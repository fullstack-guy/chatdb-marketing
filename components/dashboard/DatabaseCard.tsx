import React from 'react';
import Link from 'next/link';

const Card = ({ logo, title, lastUpdated }) => {
  return (
    <Link href={`/dashboard/${title.toLowerCase()}`}>
      <div className="cursor-pointer flex items-center rounded-lg shadow-md p-4 mb-4 transition duration-300 ease-in-out hover:scale-105">
        <div className='flex bg-[#0fe0b6] w-20 h-20 rounded-lg overflow-hidden mr-4 items-center justify-center'>
          <img className="w-10 h-10 m-auto" src={logo} alt={title} />
        </div>
        <div>
          <h1 className='mb-2 font-bold text-black text-lg'>{title}</h1>
          <p className='italic text-sm text-gray-600'>Last Updated: {lastUpdated}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
