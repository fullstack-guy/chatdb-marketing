import { BsThreeDots } from 'react-icons/bs';
import Link from "next/link";

type DashboardProps = {
    name: string,
    description: string,
    tags: any,
    updatedAt: string,
}

const DatabaseCard = ({ name, description, tags, updatedAt }: DashboardProps) => {
    return (
        <Link href={`/dashboard/${name.toLowerCase()}`}>
            <div className="cursor-pointer hover:scale-105 transition ease-in-out delay-50 card w-64 bg-base-100 shadow-xl m-auto flex flex-col items-center relative">
                {/* Icon button at the top right */}
                <button
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                    onClick={() => {
                        // Handle click event here
                    }}
                >
                    <BsThreeDots className='h-6 w-6' />
                </button>
                {/* Centered avatar */}
                <div className="mt-4">
                    <img
                        className="w-24 h-24 rounded-full object-cover"
                        src="/images/postgres.png"
                        alt="Avatar"
                    />
                </div>
                {/* Card body with database information */}
                <div className="card-body flex-1 flex flex-col justify-center items-center p-4 overflow-auto max-h-96">
                    <h2 className="card-title text-center">
                        {name}
                    </h2>
                    <p className="text-center">{description}</p>
                    <div className="card-actions justify-center mt-4">
                        {
                            tags.map((tag: string, index) => {
                                <div key={index} className="badge bg-purple-500 font-semibold text-primary-content">{tag}</div>
                            })
                        }
                    </div>
                    <p className="text-center text-sm">Last Updated: {updatedAt}</p>
                </div>
            </div>
        </Link>
    );
}

export default DatabaseCard;
