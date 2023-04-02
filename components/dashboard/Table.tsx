import Link from "next/link";

// Define the type for the individual database object
interface DatabaseObject {
    name: string;
    type: string | undefined;
    lastUpdated: string;
}

type DatabaseObjectArray = DatabaseObject[];
interface Props {
    databases: DatabaseObjectArray;
}


const Table = ({ databases }: Props) => {

    return (
        <div className="overflow-x-auto w-full">
            <table className="table w-full">
                {/* head */}
                <thead>
                    <tr>

                        <th>Name</th>
                        <th>Type</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        databases.map((database, index) => (
                            <Link key={index} href={`/dashboard/${database.name.toLowerCase()}`}>
                                <tr className="hover:bg-base-400 cursor-pointer">
                                    <td>
                                        <div className="font-bold text-lg">
                                            {database.name}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-14 h-14">
                                                    <img src="/images/postgres.png" alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">PostgreSQL</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{database.lastUpdated}</td>
                                </tr>
                            </Link>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default Table;