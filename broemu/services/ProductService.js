const { firefox } = require('playwright');
const TASK_TYPE = require('../constants');
const { writeLogs } = require('../utils');

const launch_opt = {
  // headless: false,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process', // <- this one doesn't works in Windows
    '--disable-gpu',
    '--start-maximized',
  ],
};
const opt = {
  viewport: {
    width: 1920,
    height: 1080,
  },
};

async function ProductService() {
  writeLogs('Starting browser');
  const browser = await firefox.launch(launch_opt);
  const context = await browser.newContext(opt);
  const page = await context.newPage();
  writeLogs('success');

  async function openPage(url) {
    writeLogs(`Loading page [${url}]`);
    await page.goto(url, {
      waitUntil: 'load',
    });
    writeLogs('Success. Page loaded');
  }
  async function getProductTitle() {
    return await (await page.$('h1')).innerText();
  }

  async function getPrices() {
    const pricesBlock = await page.$('[slot="content"]');
    if (!pricesBlock) return {};

    const pricesText = await pricesBlock.innerText();
    const pricesRaw = pricesText.split('₽');
    const prices = pricesRaw.map((price) => {
      const cleared = price.replaceAll(/[\n  ]/gi, '').trim();
      if (!cleared.match(/[\d,\.]+/)) return;
      return Number(cleared);
    });
    prices.sort((a, b) => b - a);

    writeLogs('Prices parsed')
    return {
      ...(prices[0] && { full: prices[0] }),
      ...(prices[1] && { discount: prices[1] }),
      ...(prices[2] && { card: prices[2] }),
    };
  }

  async function getBestSeller() {
    writeLogs('Scaninig bestseller')
    const isBestseller = !!((await page.$$('[data-widget="webMarketingMarks"]')).length);
    writeLogs('Success');
    
    return isBestseller
  }

  // async function checkIfProduct() {
    // const url = await page.url();
    // return !(await (await page.$$('[data-widget="webOutOfStock"]')).length)
    // https://www.ozon.ru/search/?deny_category_prediction=true&from_global=true&text=The%20Big%20Picture.%20Advanced.%20Workbook&product_id=348323201
  // }

  async function getRating() {
    writeLogs('Scanning rating')
    const ratingWidget = await page.waitForSelector('[data-widget="webReviewProductScore"]')
    console.log(await ratingWidget.textContent());
    const ratingRaw = await (await ratingWidget.$('[style]')).getAttribute('style')
    const score = Number(ratingRaw.replaceAll(/[%;]|(width:)/gi, ''));
    let reviews = 0
    const reviewsElement = await ratingWidget.$('a[title]')
    if(reviewsElement) {
      const reviewsRaw = await reviewsElement.getAttribute('title')
      reviews = Number(reviewsRaw.replaceAll(/ отзыв(ов|а|)/gi, ''))
    }
    writeLogs('Success');
    return {
      score,
      reviews
    }
  }

  async function getStock() {
    writeLogs('Add to cart');
    await page.click('[data-widget="webAddToCart"]')
    await page.waitForTimeout(500);
    await openPage('https://www.ozon.ru/cart')
    await page.waitForTimeout(1000);
    
    writeLogs('Close popup if needed');
    const popupButton = await page.$('[data-widget="alertPopup"] button svg', { timeout: 2000 })
    if(popupButton)
      await popupButton.click();
    writeLogs('Success');
    
    await page.click('input[readonly="readonly"][role="combobox"][name="filter"]')
    const lastElement = await page.$('.vue-portal-target [role="option"]:last-child')

    const content = (await lastElement.textContent()).trim()
    let stock = 0
    
    console.log(content);
    if(content!=="10+"){
      stock = content
    }
    else {
      await lastElement.click()
      await page.waitForTimeout(500)
      const input = await page.$('[data-widget="column"] input[type="number"]')
      stock = await input.getAttribute('max')
    }

    writeLogs('Success');

    writeLogs('Delete from cart')
    const deleteButton = await page.$('text=Удалить')
    await deleteButton.click()

    const confirmButton = (await page.$$('.vue-portal-target button'))[1]
    await confirmButton.click()
    await page.waitForTimeout(500)

    return stock
  }

  async function scanProduct(type, id) {
    const URL = `https://www.ozon.ru/product/${id}`
    const data = {}

    await openPage(URL)

    if(type === TASK_TYPE.FIRST_SCAN) {
      try {
        const title = await getProductTitle()

        data.title = title
      } catch(ex) {
        writeLogs('Title not found')
        writeLogs(ex)
      }
    }

    try {
      const prices = await getPrices()
      data.prices = prices
    } catch(ex) {
      writeLogs('Prices parse error')
      writeLogs(ex)
    }

    data.isBestseller = await getBestSeller();

    try {
      data.rating = await getRating();
    } catch(ex) {
      writeLogs('Rating error')
      writeLogs(ex)
    }

    try {
      data.stock = await getStock()
    } catch(ex) {
      writeLogs('Stock parsing error')
      writeLogs(ex)
    }

    return data
  }

  async function destroy() {
    await page.close();
    await context.close();
    await browser.close();
  }
  return {
    scanProduct,
    destroy
  };
}

module.exports = ProductService;
