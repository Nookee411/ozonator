import React, { Suspense, useEffect, useState } from 'react';
import { Head } from '@inertiajs/inertia-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Authenticated from '@/Layouts/Authenticated';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import InputError from '@/Components/InputError';
import ProductsList from '@/Components/ProductsList';
import ProductService from '@/services/ProductService';
import { STATUS } from '@/constants';

export default function Products({ auth, errors }) {
  const [link, setLink] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [refetchInterval, setRefetchInterval] = useState(4000);

  const handleInput = (e) => {
    setLink(e.target.value);
    setErrorMessages([]);
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(ProductService.postProduct, {
    onSuccess: (data) => {
      if (data.status === STATUS.SUCCESS) {
        setLink('');
        queryClient.invalidateQueries(['todos']);
        setRefetchInterval(4000);
      } else {
        setErrorMessages(data.errors.ozon_link);
      }
    },
    onError: (data) => {
      const linkErrors = data.response.data.errors.ozon_link;
      setErrorMessages(linkErrors);
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
      <div className="bg-white">
        <div className="mb-4">

          <div className="px-4 flex flex-col sm:flex-row items-stretch">
            <Input
              type="text"
              value={link}
              handleChange={handleInput}
              placeholder="Ссылка на товар"
              className="w-full mb-3 sm:mb-0 sm:mr-4"

            />
            <Button
              processing={mutation.isLoading}
              type="button"
              className="w-full sm:w-auto"
              onClick={postProduct}
              disabled={errorMessages.length}
            >
              Добавить товар
            </Button>
          </div>
          <InputError messages={errorMessages} />
        </div>

        <Suspense fallback={<div>Загрузка...</div>}>
          <ProductsList
            refetchInterval={refetchInterval}
            setRefetchInterval={setRefetchInterval}
          />
        </Suspense>
      </div>

    </Authenticated>
  );
}
