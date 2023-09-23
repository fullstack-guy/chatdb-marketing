
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import LoadingSpinner from '../LoadingSpinner'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'
import toast from 'react-hot-toast'
export default function DeleteDatabasesModal({ open, setOpen }) {
    const [isLoadingAction, setIsLoadingAction] = useState(false)
    const { isLoading, isError, data: dbs, refetch: refetchDatabases } = trpc.databases.getAll.useQuery()
    const deleteDatabase = trpc.databases.delete.useMutation({
        onMutate: () => {
            toast.loading("Deleting database...", {
                duration: 1000
            })
        },
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            refetchDatabases()
            toast.success("Database deleted successfully")
        }

    })

    const router = useRouter()

    const handleAction = () => {
        setIsLoadingAction(true)
        router.push("/pricing")
    }

    const handleDeleteBtnClick = (uuid) => {
        deleteDatabase.mutate({
            uuid
        })
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => { }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                                                Maximum Databases Reached
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-md text-gray-500">
                                                    You have reached the maximum number of databases you can create for your current active plan. Please delete a database to create a new one.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6">
                                    <div className="flex flex-col justify-between items-center gap-4">
                                        {isLoading && <LoadingSpinner />}
                                        {
                                            dbs?.map((db, index) => (
                                                <div className="w-full flex justify-between" key={index}>
                                                    <div className="flex justify-between items-center gap-2">
                                                        <Image alt='database icon' src="/images/postgres-icon.png" width={30} height={25} />
                                                        <span className="inline-flex rounded-md shadow-sm">
                                                            {db.title}
                                                        </span>
                                                    </div>
                                                    <button onClick={() => handleDeleteBtnClick(db.uuid)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="#d72f0c" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        style={{
                                            background:
                                                "linear-gradient(90deg, rgba(168,41,250,1) 0%, rgb(121 87 255 / 80%) 75%)",
                                        }}
                                        className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                                        onClick={handleAction}
                                    >
                                        {isLoadingAction ? <LoadingSpinner /> : "Go to pricing"}
                                    </button>

                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
