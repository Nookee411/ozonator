const ProductService = require("./services/ProductService");
const _ = require('lodash');
const { sleep } = require("./utils");
const TASK_TYPE = require("./constants");
const pages = [
  '626771439',
  // '146930932',
  // '177006781',
  // '5299425',
  // '536956854',
  // '355560191',
  // '600348083',
];

(async ()=>{
  const service = await ProductService()
  const dataset = [];
  for(const pageId of pages) {
    console.log(pageId);
    const data = await service.scanProduct(TASK_TYPE.FIRST_SCAN, pageId)
    dataset.push(data);
  }
  service.destroy()
  console.log(dataset);
})()