import React from 'react';
import { Link, Head } from '@inertiajs/inertia-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome(props) {
  return (
    <>
      <Head title="Welcome" />
      <div className="relative min-h-screen max-h-screen bg-ozon-black flex justify-center items-center overflow-hidden ">
        <div className="z-10 relative flex flex-col items-center items-top pb-36">
          <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
            <h1 className="flex flex-wrap justify-center pt-8 sm:pt-0 text-ozon-blue text-6xl sm:text-8xl items-center gap-10 font-semibold">
              <ApplicationLogo size={128} className="ml-9" />
              <span className="font-bungee text-gray-700"> Ozonator </span>
            </h1>
          </div>

          <div className="px-6 py-4 block">
            {props.auth.user ? (
              <Link
                href={route('lk.products')}
                className="text-xl text-gray-700 dark:text-gray-500 underline sm:text-2xl"
              >
                Products
              </Link>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="text-2xl text-gray-700 dark:text-gray-500 underline sm:text-2xl"
                >
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
        <div className="absolute top-0 left-0 right-0 bottom-0 z-0">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="absolute top-0 right-0 z-0"
            id="visual"
            viewBox="0 0 900 600"
            version="1.1"
          >
            <g xmlns="http://www.w3.org/2000/svg" transform="translate(900, 0)">
              <path d="M0 486.7C-57 469 -114.1 451.2 -179.1 432.4C-244.1 413.6 -317.1 393.8 -344.2 344.2C-371.3 294.5 -352.5 215 -368.6 152.7C-384.7 90.3 -435.7 45.2 -486.7 0L0 0Z" fill="#17161f" />
              <path d="M0 425.9C-49.9 410.3 -99.8 394.8 -156.7 378.3C-213.6 361.9 -277.4 344.6 -301.2 301.2C-324.9 257.7 -308.4 188.2 -322.5 133.6C-336.7 79.1 -381.3 39.5 -425.9 0L0 0Z" fill="#1f1f3b" />
              <path d="M0 365.1C-42.8 351.7 -85.6 338.4 -134.3 324.3C-183.1 310.2 -237.8 295.4 -258.1 258.1C-278.5 220.9 -264.4 161.3 -276.5 114.5C-288.6 67.8 -326.8 33.9 -365.1 0L0 0Z" fill="#252859" />
              <path d="M0 304.2C-35.7 293.1 -71.3 282 -111.9 270.2C-152.6 258.5 -198.2 246.1 -215.1 215.1C-232.1 184.1 -220.3 134.4 -230.4 95.4C-240.5 56.5 -272.3 28.2 -304.2 0L0 0Z" fill="#283279" />
              <path d="M0 243.4C-28.5 234.5 -57 225.6 -89.5 216.2C-122.1 206.8 -158.5 196.9 -172.1 172.1C-185.6 147.3 -176.3 107.5 -184.3 76.3C-192.4 45.2 -217.9 22.6 -243.4 0L0 0Z" fill="#283c9a" />
              <path d="M0 182.5C-21.4 175.9 -42.8 169.2 -67.2 162.1C-91.5 155.1 -118.9 147.7 -129.1 129.1C-139.2 110.5 -132.2 80.6 -138.2 57.3C-144.3 33.9 -163.4 16.9 -182.5 0L0 0Z" fill="#2446bd" />
              <path d="M0 121.7C-14.3 117.2 -28.5 112.8 -44.8 108.1C-61 103.4 -79.3 98.5 -86 86C-92.8 73.6 -88.1 53.8 -92.2 38.2C-96.2 22.6 -108.9 11.3 -121.7 0L0 0Z" fill="#1551e1" />
              <path d="M0 60.8C-7.1 58.6 -14.3 56.4 -22.4 54C-30.5 51.7 -39.6 49.2 -43 43C-46.4 36.8 -44.1 26.9 -46.1 19.1C-48.1 11.3 -54.5 5.6 -60.8 0L0 0Z" fill="#0156f3" />
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="absolute left-0 bottom-0 z-0"
            id="visual"
            viewBox="0 0 900 600"
            version="1.1"
          >
            <g xmlns="http://www.w3.org/2000/svg" transform="translate(0, 600)">
              <path d="M0 -486.7C63.4 -474.1 126.7 -461.5 179.9 -434.2C233 -406.9 276 -364.9 323.1 -323.1C370.3 -281.4 421.7 -240.1 449.7 -186.3C477.7 -132.5 482.2 -66.2 486.7 0L0 0Z" fill="#17161f" />
              <path d="M0 -425.9C55.4 -414.9 110.9 -403.9 157.4 -379.9C203.9 -356 241.5 -319.2 282.8 -282.8C324 -246.3 369 -210.1 393.5 -163C418 -115.9 421.9 -58 425.9 0L0 0Z" fill="#1f1f3b" />
              <path d="M0 -365.1C47.5 -355.6 95 -346.2 134.9 -325.7C174.8 -305.2 207 -273.6 242.4 -242.4C277.7 -211.1 316.3 -180.1 337.3 -139.7C358.3 -99.4 361.7 -49.7 365.1 0L0 0Z" fill="#252859" />
              <path d="M0 -304.2C39.6 -296.3 79.2 -288.5 112.4 -271.4C145.6 -254.3 172.5 -228 202 -202C231.5 -175.9 263.6 -150 281.1 -116.4C298.5 -82.8 301.4 -41.4 304.2 0L0 0Z" fill="#283279" />
              <path d="M0 -243.4C31.7 -237.1 63.4 -230.8 89.9 -217.1C116.5 -203.5 138 -182.4 161.6 -161.6C185.2 -140.7 210.9 -120 224.8 -93.1C238.8 -66.2 241.1 -33.1 243.4 0L0 0Z" fill="#283c9a" />
              <path d="M0 -182.5C23.8 -177.8 47.5 -173.1 67.4 -162.8C87.4 -152.6 103.5 -136.8 121.2 -121.2C138.9 -105.5 158.1 -90 168.6 -69.9C179.1 -49.7 180.8 -24.8 182.5 0L0 0Z" fill="#2446bd" />
              <path d="M0 -121.7C15.8 -118.5 31.7 -115.4 45 -108.6C58.3 -101.7 69 -91.2 80.8 -80.8C92.6 -70.4 105.4 -60 112.4 -46.6C119.4 -33.1 120.6 -16.6 121.7 0L0 0Z" fill="#1551e1" />
              <path d="M0 -60.8C7.9 -59.3 15.8 -57.7 22.5 -54.3C29.1 -50.9 34.5 -45.6 40.4 -40.4C46.3 -35.2 52.7 -30 56.2 -23.3C59.7 -16.6 60.3 -8.3 60.8 0L0 0Z" fill="#0156f3" />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}
