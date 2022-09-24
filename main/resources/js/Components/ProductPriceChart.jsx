import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'График цены',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function ProductPriceChart({ statistics }) {
  const chartData = useMemo(() => {
    // console.log(statistics.length);
    const labels = statistics.map((ele) => moment(ele.created_at).format('DD.MM.YYYY'));
    return ({
      labels,
      datasets: [
        {
          label: 'Цена',
          data: statistics.map((ele) => ele.price),
          borderColor: 'rgb(0, 0, 0)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        {
          label: 'Цена со скидкой',
          data: statistics.map((ele) => ele.discount_price),
          borderColor: 'rgb(249, 17, 85)',
          backgroundColor: 'rgba(249, 17, 85, 0.5)',
        },
        {
          label: 'Цена по карте озон',
          data: statistics.map((ele) => ele.ozon_card_price),
          borderColor: 'rgb(16, 196, 76)',
          backgroundColor: 'rgba(16, 196, 76, 0.5)',
        },
      ],
    });
  }, [statistics]);

  return (
    <section className="max-w-full overflow-x-auto">
      <Line options={options} data={chartData} className="max-w-6xl min-w-[700px] max-h-[400px] mx-auto" />
    </section>

  );
}

ProductPriceChart.propTypes = {
  statistics: PropTypes.arrayOf(PropTypes.shape({
    created_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount_price: PropTypes.number.isRequired,
    ozon_card_price: PropTypes.number.isRequired,
  })).isRequired,
};
