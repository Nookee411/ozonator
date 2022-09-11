import React, { useMemo, useState } from 'react';
import { Head, usePage } from '@inertiajs/inertia-react';
import { subDays } from 'date-fns';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DateRangePicker } from 'react-date-range';
import Authenticated from '@/Layouts/Authenticated';
import ProductPriceChart from '@/Components/ProductPriceChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function Details({ auth, errors }) {
  const { product } = usePage().props;

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: subDays(new Date(), 7),
      key: 'selection',
    },
  ]);

  return (
    <Authenticated
      auth={auth}
      errors={errors}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Детализация</h2>}
    >
      <Head title="Детализация" />
      <h1 className="px-4 bg-white text-xl">
        {product.title}
      </h1>
      {/* <DateRangePicker
        onChange={(item) => setState([item.selection])}
        showSelectionPreview
        moveRangeOnFirstSelection={false}
        months={1}
        ranges={state}
        direction="vertical"
      /> */}
      <ProductPriceChart statistics={product.statistics} />
      <div className="overflow-x-auto relative">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300">
            <tr>
              <th scope="col" className="py-3 px-6 min-w-fit">
                Дата
              </th>
              <th scope="col" className="py-3 px-6 min-w-fit">
                Цена
              </th>
              <th scope="col" className="py-3 px-6 min-w-fit">
                Цена со скидкой
              </th>
              <th scope="col" className="py-3 px-6 min-w-fit">
                Цена по карте Ozon
              </th>
              <th scope="col" className="py-3 px-6 min-w-fit">
                Остаток
              </th>
              <th scope="col" className="py-3 px-6 min-w-fit">
                Бестселлер
              </th>
            </tr>
          </thead>
          <tbody>
            {product.statistics.map((item, index) => (
              <tr key={item.id} className={`bg-white border-b hover:bg-gray-100 hover:ease-in-out transition duration-200 ${!(index % 2) ? 'bg-gray-200' : 'bg-gray-300 '}`}>
                <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                  {moment(item.created_at).format('DD.MM.YYYY')}
                </th>
                <td className="py-4 px-6 font-bold text-black">
                  {item.price === null ? 'N/D' : `${item.price}₽`}
                </td>
                <td className="py-4 px-6 text-ozon-red font-bold">
                  {item.discount_price === null ? 'N/D' : `${item.discount_price}₽`}
                </td>
                <td className="py-4 px-6 text-ozon-green font-bold">
                  {item.ozon_card_price === null ? 'N/D' : `${item.ozon_card_price}₽`}
                </td>
                <td className="py-4 px-6 ">
                  {item.stock}
                </td>
                <td className="py-4 px-6 ">
                  {item.is_bestseller}
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </Authenticated>
  );
}
