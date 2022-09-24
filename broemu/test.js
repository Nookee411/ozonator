const ProductService = require("./services/ProductService");
const TASK_TYPE = require("./constants");
const pages = [
  '140178690',
  '33871129',
  '135747632',
  '626771439',
  '464353948',
  '502924822',
  '348323192',
  '5299425',
  '641645803',
  '536956854',
  '355560191',
  '600348083',
];

(async ()=>{
  const dataset = [];
  for(const pageId of pages) {    
    const service = await ProductService()
    const data = await service.scanProduct(TASK_TYPE.FIRST_SCAN ,pageId)
    dataset.push(data);
    service.destroy()
  }
  console.log(dataset);
})()