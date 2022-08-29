require('dotenv').config()
const moment = require('moment')
const { firefox, errors } = require('playwright');
const knex = require('./knex')

const launch_opt = {
  // headless: false,
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
};

(async () => { 
  const taskId = process.argv[2]
  const task = await knex('tasks').where({id: taskId}).first()
  const product = await knex('products').where({id: task.product_id}).first()
  let data = {};

  writeLogs('Starting browser')
  const browser = await firefox.launch(launch_opt);
  const context = await browser.newContext(opt);
  const page = await context.newPage();
  writeLogs('Success')

  writeLogs('Loading product page')
  await page.goto(`https://www.ozon.ru/product/${product.ozon_id}`, {
    waitUntil: 'load',
  })
  writeLogs('Success')

  if(task.type === TYPES.FIRST_SCAN) {
    const productTitle = await (await page.$('h1')).innerText()

    const res = await knex('products')
    .where({id: task.product_id})
    .update({ title: productTitle })

  }

  writeLogs('Scaning prices');
  const pricesBlock = (await page.$('[slot="content"]'));
  const prices = {
    discount: await (await pricesBlock.$('.xm3')).innerText(),
    full: await (await pricesBlock.$('.mx4')).innerText(),
    card: await (await pricesBlock.$('.ui-ca6')).innerText(),
  }
  for(const key in prices) {
    try {
      const replace = prices[key].replaceAll(/[ ₽]|(при оплате Ozon Картой)/gi, '')
      prices[key] = Number(replace)
    } catch (ex) {
      prices[key] = null
    }
  }
  writeLogs('Success');

  writeLogs('Scaninig bestseller')
  const isBestseller = !!((await page.$$('[data-widget="webMarketingMarks"]')).length);

  writeLogs('Success');
  
  //scan rating & reviews
  writeLogs('Scanning rating')
  const ratingWidget = await page.$('[data-widget="webReviewProductScore"]')
  const ratingRaw = await (await ratingWidget.$('[style]')).getAttribute('style')
  const rating = Number(ratingRaw.replaceAll(/[%;]|(width:)/gi, ''));
  let reviews = 0
  const reviewsElement = await ratingWidget.$('a[title]')
  if(reviewsElement) {
    const reviewsRaw = await reviewsElement.getAttribute('title')
    reviews = Number(reviewsRaw.replaceAll(/ отзыв(ов|а|)/gi, ''))
  }
  

  writeLogs('Success');

  writeLogs('Add to cart');
  await page.click('[data-widget="webAddToCart"]')
  
  await page.waitForTimeout(1000);

  await page.goto('https://www.ozon.ru/cart', {
    waitUntil: 'load',
  })
  await page.waitForTimeout(1000);
  writeLogs('Success');

  // await page.click('.a5tb.ui-f2.ui-k>button');
  writeLogs('close popup if needed');
  const popupButton = await page.$('[data-widget="alertPopup"] button svg')
  if(popupButton)
  await popupButton.click();
  // <input autocomplete="off" title="1" readonly="readonly" role="combobox" type="text" name="filter" value="" class="ui-r4">
  writeLogs('Success');
  
  
  await page.click('input[readonly="readonly"][role="combobox"][name="filter"]')
  const lastElement = await page.$('.vue-portal-target [role="option"]:last-child')

  const content = (await lastElement.textContent()).trim()
  let stock = 0
  
  if(content!=="10+")
    stock = content
  else {
    await lastElement.click()
    await page.waitForTimeout(1000)
    const input = await page.$('[data-widget="column"] input[type="number"]')
    stock = await input.getAttribute('max')
  }

  //write data
  await knex('statistics').insert({
    'created_at': moment().format('YYYY-MM-DD HH:mm:ss'),
    'updated_at': moment().format('YYYY-MM-DD HH:mm:ss'),
    'product_id': product.id,
    'price': prices.full,
    'discount_price': prices.discount,
    'ozon_card_price': prices.card,
    'rating': rating,
    'reviews': reviews,
    'is_bestseller': isBestseller,
    'stock': stock,
  })
  
  browser.close()

  knex.destroy()

})()

async function writeLogs(data) {
  console.log(`[${moment().toISOString()}]: ${data}`);
}