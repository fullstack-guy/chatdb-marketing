import { BsThreeDots } from "react-icons/bs";
import Link from "next/link";

type DashboardProps = {
  name: string;
  description: string;
  tags: any;
  updatedAt: string;
};

const DatabaseCard = ({
  name,
  description,
  tags,
  updatedAt,
}: DashboardProps) => {
  return (
    <Link href={`/dashboard/${name.toLowerCase()}`}>
      <div className="delay-50 card relative m-auto flex w-64 cursor-pointer flex-col items-center bg-base-100 shadow-xl transition ease-in-out hover:scale-105">
        {/* Icon button at the top right */}
        <button
          className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-200 focus:outline-none"
          onClick={() => {
            // Handle click event here
          }}
        >
          <BsThreeDots className="h-6 w-6" />
        </button>
        {/* Centered avatar */}
        <div className="mt-4">
          <img
            className="h-24 w-24 rounded-full object-cover"
            src="/images/postgres.png"
            alt="Avatar"
          />
        </div>
        {/* Card body with database information */}
        <div className="card-body flex max-h-96 flex-1 flex-col items-center justify-center overflow-auto p-4">
          <h2 className="card-title text-center">{name}</h2>
          <p className="text-center">{description}</p>
          <div className="card-actions mt-4 justify-center">
            {tags.map((tag: string, index) => {
              <div
                key={index}
                className="badge bg-purple-500 font-semibold text-primary-content"
              >
                {tag}
              </div>;
            })}
          </div>
          <p className="text-center text-sm">Last Updated: {updatedAt}</p>
        </div>
      </div>
    </Link>
  );
};

export default DatabaseCard;
