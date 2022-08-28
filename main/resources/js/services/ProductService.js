import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';

const ProductService = {
  getAll: () => axios.get('/products').then((response) => response.data),
  // getAll: () => Inertia.visit('/products'),
  getById: (id) => axios.get('/products', {
    params: {
      id,
    },
  }).then((response) => response.data),
  postProduct: ({ link }) => axios.post('/products', { ozon_link: link })
    .then((response) => response.data),
  deleteProduct: (id) => axios.delete(`/products/${id}`).then((response) => response.data),
};

export default ProductService;
