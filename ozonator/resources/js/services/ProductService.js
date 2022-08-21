import axios from 'axios';

const ProductService = {
  getAll: () => axios.get('/products'),
  getById: (id) => axios.get('/products', {
    params: {
      id,
    },
  }),
  postProduct: ({ link }) => {
    axios.post('/products', { link });
  },
  deleteProduct: (id) => axios.delete('/products', {
    id,
  }),
};

export default ProductService;
