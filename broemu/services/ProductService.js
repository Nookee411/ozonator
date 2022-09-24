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
  defaultTimeout: 30000,
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
    try {
      writeLogs('Getting title')
      return await (await page.$('h1')).innerText();
    } catch (ex) {
      writeLogs('Error getting title')
      return null
    }
  }

  async function getPrices() {
    const pricesBlock = await page.$('[slot="content"]');
    if (!pricesBlock) return {};

    const pricesText = await pricesBlock.innerText();
    const pricesRaw = pricesText.split('₽');
    const ozonMatch = pricesText.match(/[\d ]* ₽ при оплате Ozon Картой/gi)
    let ozonPrice
    if(ozonMatch) {
      const ozonRaw = ozonMatch[0].match(/[\d ]*/)[0].replaceAll(/ /gi, '')
      console.log(ozonRaw);
      ozonPrice = Number(ozonRaw);

    }
    let prices = pricesRaw.map((price) => {
      const cleared = price.replaceAll(/[\n  ]/gi, '').trim();
      if (!cleared.match(/[\d,\.]+/)) return;
      return Number(cleared);
    }).filter(ele => ele && ele !== ozonPrice);
    prices.sort((a, b) => b - a);

    writeLogs('Prices parsed');
    return {
      ...(prices[0] && { full: prices[0] }),
      ...(prices[1] && { discount: prices[1] }),
      ...(ozonPrice && {card: ozonPrice}),
    };
  }

  async function getBestSeller() {
    writeLogs('Scaninig bestseller');
    const isBestseller = !!(await page.$$('[data-widget="webMarketingMarks"]'))
      .length;
    writeLogs('Success');

    return isBestseller;
  }

  async function isValidProduct() {
    // const url = await page.url();
    try {
      const outofstock = await page.waitForSelector(
        '[data-widget="webGallery"]',
        { timeout: 10000 },
    );
      return true
    } catch (ex) {
      return false
    }
  }

  async function getRating() {
    writeLogs('Scanning rating');
    const ratingWidget = await page.waitForSelector(
      '[data-widget="webReviewProductScore"]',
    );
    const ratingRaw = await (
      await ratingWidget.$('[style]')
    ).getAttribute('style');
    const score = Number(ratingRaw.replaceAll(/[%;]|(width:)/gi, ''));
    let reviews = 0;
    const reviewsElement = await ratingWidget.$('a[title]');
    if (reviewsElement) {
      const reviewsRaw = await reviewsElement.getAttribute('title');
      reviews = Number(reviewsRaw.replaceAll(/ отзыв(ов|а|)/gi, ''));
    }
    writeLogs('Success');
    return {
      score,
      reviews,
    };
  }

  async function getStock() {
    writeLogs('Add to cart');
    await page.click('[data-widget="webAddToCart"]');
    await page.waitForTimeout(500);
    await openPage('https://www.ozon.ru/cart');
    await page.waitForTimeout(1000);

    writeLogs('Close popup if needed');
    const popupButton = await page.$('[data-widget="alertPopup"] button svg', {
      timeout: 6000,
    });
    if (popupButton) await popupButton.click();
    writeLogs('Success');

    await page.click(
      'input[readonly="readonly"][role="combobox"][name="filter"]',
    );
    const lastElement = await page.$(
      '.vue-portal-target [role="option"]:last-child',
    );

    const content = (await lastElement.textContent()).trim();
    let stock = 0;

    if (content !== '10+') {
      stock = Number(content);
    } else {
      await lastElement.click();
      await page.waitForTimeout(500);
      const input = await page.$('[data-widget="column"] input[type="number"]');
      stock = Number(await input.getAttribute('max'));
    }

    writeLogs('Success');
    return stock;
  }

  async function getSeller() {
    writeLogs('Getting seller');
    try {
      const sellerBlock = await page.waitForSelector(
        '[data-widget="webCurrentSeller"]',
        { timeout: 5000 },
      );
      const sellerElement = await sellerBlock.$('a[title]');
      const sellerName = await sellerElement.innerText();
      const sellerLink = await sellerElement.getAttribute('href');
      const sellerId = sellerLink.match(/\d*\/$/)[0].replace('/', '') 
      writeLogs('Success');
      return { name: sellerName, id: sellerId };
    } catch (ex) {
      writeLogs('Error while getting seller');
      writeLogs(ex);
      return { name: null, link: null }
    }
  }

  async function scanProduct(type, id) {
    const URL = `https://www.ozon.ru/product/${id}`;
    const data = {
      title: null,
      seller: { name: null, id: null },
      prices: { full: null, card: null },
      isBestseller: null,
      rating: { score: null, reviews: null },
      stock: null
    }

    await openPage(URL);

    if(!(await isValidProduct())) {
      data.stock = 0
      return data
    }

    if (type === TASK_TYPE.FIRST_SCAN) {
      const title = await getProductTitle();
      data.title = title;

      const seller = await getSeller();
      data.seller = seller;

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

    return data;
  }

  async function testProduct(id) {
    const URL = `https://www.ozon.ru/product/${id}`;

    await openPage(URL);

    return await isValidProduct();
  }

  async function destroy() {
    await page.close();
    await context.close();
    await browser.close();
  }
  return {
    scanProduct,
    destroy,
    getSeller,
    testProduct,
  };
}

module.exports = ProductService;
