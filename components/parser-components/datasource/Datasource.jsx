import { useEffect, useState } from 'react';
import Image from 'next/image'
import ProfileImg from '../../../public/images/ProfileImg.png'
import ArrowDownIcon from '../../../assets/icons/ArrowDownIcon'
import ArrowRightIcon from '../../../assets/icons/RightIcon';
import supabase from "../../../utils/supabaseClient";
import { useUser } from '@clerk/nextjs';

const Datasource = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [fetchedDatabases, setFetchedDatabases] = useState([]);

  const fetchDatabases = async () => {
    const { data, error } = await supabase
      .from("user_schemas")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching databases:", error);
    } else {
      setFetchedDatabases(
        data.map((db) => ({
          name: db.title,
          path: "/dashboard/postgres",
          selected: false,
          img: "/images/postgres-icon.png",
          uuid: db.uuid,
          created_at: db.created_at,
        }))
      );
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchDatabases();
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className='m-2'>
      <button
        id="dropdownHoverButton"
        data-dropdown-toggle="dropdownHover"
        data-dropdown-trigger="hover"
        className="text-white bg-white border border-gray-400 focus:ring-gray-400 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        <img src={'/images/postgres-icon.png'} width={40} height={40} />
        <div className="flex flex-col items-start">
          <span className="text-sm font-xs ml-2 text-black">{fetchedDatabases[0]?.name}</span>
          {/* <span className="text-sm font-xs text-gray-400">Redshift</span> */}

        </div>
        {/* {dropdownVisible ? <ArrowDownIcon className="ml-5 text-black" fill="none" />
          : <ArrowRightIcon className="ml-5 text-black" fill="none" />
        } */}
      </button>
    </div>
  )
}

export default Datasource