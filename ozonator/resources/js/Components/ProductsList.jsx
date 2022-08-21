import { useQuery, useQueryClient } from '@tanstack/react-query';
import { divide } from 'lodash';
import React, { Suspense, useState } from 'react';
import Pagination from 'react-js-pagination';
import ProductService from '@/services/ProductService';

export default function ProductsList() {
  const query = useQuery(['todos'], ProductService.getAll);

  return (
    <div className="overflow-x-auto relative">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-300">
          <tr>
            <th scope="col" className="py-3 px-6">
              id
            </th>
            {/* <th scope="col" className="py-3 px-6">
              Color
            </th> */}
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
          {query.data.data.products.map((item, index) => (
            <tr key={item.id} className={`bg-white border-b ${!(index % 2) ? 'bg-gray-200' : 'bg-gray-300'}`}>
              <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                {item.id}
              </th>
              <td className="py-4 px-6">
                {item.title ?? <div>Loading...</div>}
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
              <td className="py-4 px-6 hover:text-indigo-700 hover:ease-in-out transition duration-200 cursor-pointer">
                123
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
