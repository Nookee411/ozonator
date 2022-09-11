import React from 'react';
import { Link, Head } from '@inertiajs/inertia-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome(props) {
  return (
    <>
      <Head title="Welcome" />
      <div className="relative flex flex-col items-top pt-48 min-h-screen max-h-screen bg-gray-900 items-center">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <h1 className="flex flex-wrap justify-center pt-8 sm:pt-0 text-ozon-blue text-6xl sm:text-8xl items-center gap-10 font-semibold">
            <ApplicationLogo size={128} className="ml-9" />
            <span> Ozonator </span>
          </h1>
        </div>

        <div className="px-6 py-4 block">
          {props.auth.user ? (
            <Link href={route('lk.products')} className="text-xl text-gray-700 dark:text-gray-500 underline sm:text-2xl">
              Products
            </Link>
          ) : (
            <>
              <Link href={route('login')} className="text-2xl text-gray-700 dark:text-gray-500 underline sm:text-2xl">
                Вход
              </Link>

              <Link
                href={route('register')}
                className="ml-4 text-gray-700 dark:text-gray-500 underline text-2xl"
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
