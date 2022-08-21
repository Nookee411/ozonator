import React from 'react';
import { Link, Head } from '@inertiajs/inertia-react';

export default function Welcome(props) {
  return (
    <>
      <Head title="Welcome" />
      <div className="relative flex flex-col items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <h1 className="flex justify-center pt-8 sm:justify-start sm:pt-0 text-red-500 text-8xl">
            Ozonator
          </h1>
        </div>

        <div className="px-6 py-4 sm:block">
          {props.auth.user ? (
            <Link href={route('dashboard')} className="text-sm text-gray-700 dark:text-gray-500 underline text-2xl">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href={route('login')} className="text-sm text-gray-700 dark:text-gray-500 underline text-2xl">
                Log in
              </Link>

              <Link
                href={route('register')}
                className="ml-4 text-sm text-gray-700 dark:text-gray-500 underline text-2xl"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      
    </>
  );
}
