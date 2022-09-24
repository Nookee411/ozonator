require('dotenv').config()
const moment = require('moment')
const TASK_TYPE = require('./constants');
const knex = require('./knex');
const ProductService = require('./services/ProductService');

(async () => { 
  const taskId = process.argv[2]
  const task = await knex('tasks').where({id: taskId}).first()
  const product = await knex('products').where({id: task.product_id}).first()

  const service = await ProductService()
  const data = await service.scanProduct(task.type, product.ozon_id)

  if(task.type === TASK_TYPE.FIRST_SCAN) {
    if(data.seller.id) {
      let seller = await knex('sellers').where({ id: data.seller.id}).first()
      if(!seller) {
        seller = await knex('sellers').insert({
          id: data.seller.id,
          name: data.seller.name,
        })
      }
    }
    
    await knex('products')
    .where({id: product.id})
      .update({ 
        title: data.title,
        seller_id: data.seller.id
      })
  }

  //write data

  const todayMidnight = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')

  const productStatistics = await knex('statistics')
    .where({ 'product_id': product.id })
    .where('created_at', '>=', todayMidnight)
    .first()

  if(productStatistics) {
    await knex('statistics').update({
      'updated_at': moment().format('YYYY-MM-DD HH:mm:ss'),
      'product_id': product.id,
      'price': data.prices.full,
      'discount_price': data.prices.discount,
      'ozon_card_price': data.prices.card,
      'rating': data.rating.score,
      'reviews': data.rating.reviews,
      'is_bestseller': data.isBestseller,
      'stock': data.stock,
    })
  } else {
    await knex('statistics').insert({
      'created_at': moment().format('YYYY-MM-DD HH:mm:ss'),
      'updated_at': moment().format('YYYY-MM-DD HH:mm:ss'),
      'product_id': product.id,
      'price': data.prices.full,
      'discount_price': data.prices.discount,
      'ozon_card_price': data.prices.card,
      'rating': data.rating.score,
      'reviews': data.rating.reviews,
      'is_bestseller': data.isBestseller,
      'stock': data.stock,
    })
  }
  
  service.destroy()
  knex.destroy()
})()

