import React, { Suspense, useEffect, useState } from 'react';
import { Head } from '@inertiajs/inertia-react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Authenticated from '@/Layouts/Authenticated';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import InputError from '@/Components/InputError';
import ProductsList from '@/Components/ProductsList';
import ProductService from '@/services/ProductService';

export default function Dashboard({ auth, errors }) {
  const [link, setLink] = useState('');
  const [products, setProducts] = useState([]);

  const handleInput = (e) => {
    setLink(e.target.value);
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(ProductService.postProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });

  const postProduct = (e) => {
    mutation.mutate({ link });
  };

  return (
    <Authenticated
      auth={auth}
      errors={errors}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Товары</h2>}
    >
      <Head title="Товары" />
      <div className="px-4 bg-white">
        <div className="flex flex-col sm:flex-row items-stretch mb-4">

          <Input
            type="text"
            value={link}
            handleChange={handleInput}
            placeholder="Ссылка на товар"
            className="w-full mb-3 sm:mb-0 sm:mr-4"
          />
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={postProduct}
          >
            Add product
          </Button>
        </div>
        <div className="pb-12">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg ">
            <Suspense fallback={<div>Загрузка...</div>}>
              <ProductsList />
            </Suspense>
          </div>
        </div>
      </div>

    </Authenticated>
  );
}
