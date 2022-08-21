import React from 'react';

export default function Button({
  type = 'submit', className = '', processing, children, onClick, variant = 'primary',
}) {
  return (
    <button
      type={type}
      className={
                `inline-flex items-center px-4 py-2 bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest active:bg-gray-900 transition ease-in-out duration-150
                ${processing && 'opacity-25'}
                ${
                    {
                      primary: 'bg-indigo-600 hover:bg-indigo-700',
                      outline: 'bg-transparent text-black border-1 border-gray-400',
                    }[variant]
                } 
                ${className}`
            }
      disabled={processing}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
