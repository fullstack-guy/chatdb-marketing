import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { trpc } from '../../utils/trpc'
import toast from 'react-hot-toast'
import LoadingSpinner from '../LoadingSpinner'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function DropDownMenu({ uuid, refetchDatabases }: { uuid: string, refetchDatabases: () => void }) {
    const deleteDatabase = trpc.databases.delete.useMutation({
        onMutate: () => {
            toast.loading('Deleting database...', {
                duration: 1000,
            })
        },
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            refetchDatabases()
            toast.success('Database deleted successfully')
        },
    })
    return (
        <Menu as="div" className="w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8 inline-block text-left">
            <div>
                <Menu.Button className="absolute w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8 inline-flex justify-center gap-x-1.5 rounded-md bg-white px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-[32%] w-2 h-2 md:w-3 md:h-3 lg:w-3 lg:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">

                        <Menu.Item>
                            {({ active }) => (
                                <span
                                    className={classNames(
                                        active ? 'bg-red-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm cursor-pointer'
                                    )}
                                    onClick={() => deleteDatabase.mutate({ uuid })}
                                >
                                    <div className="flex flex-row justify-between items-center">
                                        Delete
                                        {
                                            deleteDatabase.isLoading ? <LoadingSpinner />
                                                :
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 cursor-pointer"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="#d72f0c"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                        }
                                    </div>
                                </span>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
