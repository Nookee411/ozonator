import React from 'react';
import { Link, Head } from '@inertiajs/inertia-react';

export default function Welcome(props) {
  return (
    <>
      <Head title="Welcome" />
      <div className="relative flex flex-col items-top pt-48 min-h-screen bg-white bg-gray-900 items-center">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <h1 className="flex justify-center pt-8 sm:pt-0 text-indigo-700 text-6xl sm:text-8xl ">
            Ozonator
          </h1>
        </div>

        <div className="px-6 py-4 block">
          {props.auth.user ? (
            <Link href={route('lk.products')} className="text-xl text-gray-700 dark:text-gray-500 underline sm:text-2xl">
              Products
            </Link>
          ) : (
            <>
              <Link href={route('login')} className="text-xl text-gray-700 dark:text-gray-500 underline sm:text-2xl">
                Вход
              </Link>

              <Link
                href={route('register')}
                className="ml-4 text-sm text-gray-700 dark:text-gray-500 underline text-2xl"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
