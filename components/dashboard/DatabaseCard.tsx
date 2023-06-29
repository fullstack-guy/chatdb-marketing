import React from "react";
import Link from "next/link";
import Image from "next/image";

const Card = ({ logo, title, lastUpdated, uuid }) => {
  return (
    <div className="relative">
      <Link href={`/dashboard/${uuid}`}>
        <div className="mb-4 flex cursor-pointer items-center rounded-lg p-4 shadow-md transition duration-300 ease-in-out hover:scale-105">
          <div className="mr-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-[#0fe0b6]">
            <Image
              className="m-auto"
              width={40}
              height={40}
              src={logo}
              alt={title}
            />
          </div>
          <div>
            <h1 className="mb-2 text-lg font-bold text-black">{title}</h1>
            {/* <p className="text-sm italic text-gray-600">
              Created: {lastUpdated}
            </p> */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
