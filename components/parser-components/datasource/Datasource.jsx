import { useState } from 'react';
import Image from 'next/image'
// import ProfileImg from '../../../public/images/ProfileImg.png'
import ProfileImg from '../../../public/images/ProfileImg.png'
import ArrowDownIcon from '../../../assets/icons/ArrowDownIcon'
import ArrowRightIcon from '../../../assets/icons/RightIcon';

const Datasource = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className='m-2'>
      <button
        id="dropdownHoverButton"
        data-dropdown-toggle="dropdownHover"
        data-dropdown-trigger="hover"
        className="text-white bg-white border border-gray-400 focus:ring-gray-400 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <Image src={ProfileImg} className='w-12 height-20' alt="profile image" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-xs text-black">All Users Data</span>
            <span className="text-sm font-xs text-gray-400">Redshift</span>
          </div>
        </div>
        {dropdownVisible ? <ArrowDownIcon className="ml-5 text-black" fill="none" />
          : <ArrowRightIcon className="ml-5 text-black" fill="none" />
        }
      </button>

      <div
        id="dropdownHover"
        className={`z-10 ${dropdownVisible ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-50 dark:bg-gray-700`}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownHoverButton"
        >
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Settings
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Earnings
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Datasource