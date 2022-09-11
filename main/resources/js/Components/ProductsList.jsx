import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { divide } from 'lodash';
import React, { Suspense, useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import ProductService from '@/services/ProductService';
import EditIcon from '@/Icons/EditIcon';
import DeleteIcon from '@/Icons/DeleteIcon';

export default function ProductsList() {
  const [refetchInterval, setRefetchInterval] = useState(4000);
  const query = useQuery(['todos'], ProductService.getAll, {
    refetchInterval,
    onError: () => setRefetchInterval(0),
    onSuccess: (data) => {
      if (data.status !== 'success') { return setRefetchInterval(0); }

      const hasNull = data.products.some((ele) => !ele.title);
      if (!hasNull) {
        setRefetchInterval(0);
      }
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation(ProductService.deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });
  const deleteProduct = (id) => (e) => {
    mutation.mutate(id);
  };

  return (
    <div className="overflow-x-auto relative">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-300">
          <tr>
            <th scope="col" className="py-3 px-6">
              id
            </th>
            <th scope="col" className="py-3 px-6">
              Название
            </th>
            <th scope="col" className="py-3 px-6">
              Озон id
            </th>
            <th scope="col" className="py-3 px-6">
              Действия
            </th>
          </tr>
        </thead>
        <tbody>
          {query.data.products.map((item, index) => (
            <tr
              key={item.id}
              className={`bg-white border-b hover:bg-gray-100 hover:ease-in-out transition duration-200 ${
                !(index % 2) ? 'bg-gray-200' : 'bg-gray-300 '
              }`}
            >
              <th
                scope="row"
                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
              >
                {item.id}
              </th>
              <td className="py-4 px-6 text-ellipsis max-w-md whitespace-nowrap overflow-hidden">
                <Link
                  href={route('lk.details', { id: item.id })}
                >
                  {item.title ?? <div>Загрузка...</div>}
                </Link>
              </td>
              <td className="py-4 px-6">
                <a
                  className="hover:text-indigo-700 hover:ease-in-out transition duration-200 cursor-pointer"
                  href={`https://www.ozon.ru/product/${item.ozon_id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.ozon_id}
                </a>
              </td>
              <td className="py-4 px-6 ">
                {/* <EditIcon classes="w-6 h-6 hover:text-indigo-700 transition duration-200 cursor-pointer" /> */}
                <DeleteIcon
                  classes="w-6 h-6 hover:text-indigo-700 transition duration-200 cursor-pointer"
                  onClick={deleteProduct(item.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
