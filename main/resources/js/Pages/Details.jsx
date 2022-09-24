import React, { useMemo, useState } from 'react';
import { Head, usePage } from '@inertiajs/inertia-react';
import { subDays } from 'date-fns';
import _ from 'lodash';
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

  const filteredStatistics = useMemo(() => {
    let lastCreatedDay;
    const filtered = product.statistics.filter((ele) => {
      const createdAtDay = moment(ele.created_at).startOf('day').toString();
      if (createdAtDay === lastCreatedDay) { return false; }
      lastCreatedDay = moment(ele.created_at).startOf('day').toString();
      return true;
    });
    return filtered;
  }, [product]);

  return (
    <Authenticated
      auth={auth}
      errors={errors}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Детализация</h2>}
    >
      <Head title="Детализация" />
      <div className="bg-white">

        <h1 className="px-4 text-xl">
          {product.title}
        </h1>

        <ProductPriceChart statistics={filteredStatistics} />
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
                  Отзывы
                </th>
                <th scope="col" className="py-3 px-6 min-w-fit">
                  Рейтинг
                </th>
                <th scope="col" className="py-3 px-6 min-w-fit">
                  Бестселлер
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStatistics.map((item, index) => (
                <tr key={item.id} className={`bg-white border-b hover:bg-gray-100 hover:ease-in-out transition duration-200 ${!(index % 2) ? 'bg-gray-200' : 'bg-gray-300 '}`}>
                  <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                    {moment(item.created_at).format('DD.MM.YYYY')}
                  </th>
                  <td className="py-4 px-6 font-bold text-black">
                    {item.price === null ? '-' : `${item.price}₽`}
                  </td>
                  <td className="py-4 px-6 text-ozon-red font-bold">
                    {item.discount_price === null ? '-' : `${item.discount_price}₽`}
                  </td>
                  <td className="py-4 px-6 text-ozon-green font-bold">
                    {item.ozon_card_price === null ? '-' : `${item.ozon_card_price}₽`}
                  </td>
                  <td className="py-4 px-6 ">
                    {item.stock}
                  </td>
                  <td className="py-4 px-6 ">
                    {item.reviews}
                  </td>
                  <td className="py-4 px-6 ">
                    { _.round(item.rating, 1)}
                  </td>
                  <td className="py-4 px-6 ">
                    {item.is_bestseller}
                  </td>
                </tr>
              )) }
            </tbody>
          </table>
        </div>
      </div>
    </Authenticated>
  );
}
