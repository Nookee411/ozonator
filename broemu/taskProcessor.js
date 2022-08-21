const { firefox, errors } = require('playwright');
const knex = require('./knex')

const launch_opt = {
  headless: false,
  args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu',
      '--start-maximized'
  ]
}
const opt = {
  viewport: {
      width: 1920,
      height: 1080
  }
};

const TYPES = {
  FIRST_SCAN: 1,
  RESCAN: 2,
}

const processTask = async (task) => { 
  const product = await knex('products').where({id: task.product_id}).first()
  writeLogs('Starting browser')
  const browser = await firefox.launch(launch_opt);
  const context = await browser.newContext(opt);
  const page = await context.newPage();
  writeLogs('Success')

  const navigationPromise = page.waitForNavigation({waitUntil: 'networkidle', timeout: 100000});

  writeLogs('Loading product page')
  await page.goto(`https://www.ozon.ru/product/${product.ozon_id}`)
  await navigationPromise
  writeLogs('Success')

  if(task.type === TYPES.FIRST_SCAN) {
    const productTitle = await (await page.$('h1')).innerText()

    const res = await knex('products')
    .where({id: task.product_id})
    .update({ title: productTitle })

  
  }

  // const widgetBlock = await page.$('[data-widget="webSale"]')
  //   const parsedPrices = (await widgetBlock.$$('text=₽'));
  //   const prices = []

  //   for (const price of parsedPrices) {
  //     const intPrice = parseInt((await price.innerText()).replaceAll(/ ₽/gi, ''))
  //     if(isNaN(intPrice))
  //       continue
  //     prices.push(intPrice)
  //   }
  //   prices.sort((a, b)=> b-a)

  //   const fullPrice = prices[0];
  //   const discountPrice = prices[1];


  await page.click('.k3v.ui-f2.ui-k')
  
  await page.waitForTimeout(2000);

  await page.goto('https://www.ozon.ru/cart')

  await navigationPromise;
  writeLogs('Success');

  // await page.click('.a5tb.ui-f2.ui-k>button');
  const popupButton = await page.$('.ui-f6.ui-g7.ui-j0')
  if(popupButton)
    await popupButton.click();
  // <input autocomplete="off" title="1" readonly="readonly" role="combobox" type="text" name="filter" value="" class="ui-r4">
  await page.click('input[readonly="readonly"][role="combobox"][name="filter"]')

  
  const lastElement = await page.$('.vue-portal-target [role="option"]:last-child')

  const content = (await lastElement.textContent()).trim()
  if(content!=="10+")
    console.log(content)
  else {
    await lastElement.click()
    const input = await page.$('.ui-aa6.ui-aa9.ui-ab2.ui-a2b input')
    console.log(await input.getAttribute('max'))
  }

  await knex('tasks').where({id: task.id}).del()
  
  browser.close()


}

async function writeLogs(data) {
  console.log(data);
}

module.exports = processTask