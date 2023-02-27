import Link from 'next/link'
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from 'react';
import { ChevronDownIcon, MenuAlt3Icon } from "@heroicons/react/outline";


const Navbar = () => {
    return (
        <header className="mx-auto max-w-6xl px-8 xl:px-0">
            <nav className="relative z-20 flex shrink-0 items-center space-x-2 py-6">
                <Link href="/">
                    <a className="z-10">
                        {/* Logo */}
                        <h1 className="text-4xl font-bold text-heading">ChatDB</h1>
                    </a>
                </Link>
                <div className="flex-1">
                    <div className="absolute inset-y-0 inset-x-0 hidden items-center justify-end space-x-1.5 px-4 md:flex">
                        <Link href="/pricing">
                            <a
                                className="inline-flex cursor-pointer items-center justify-between rounded-xl border-2 border-transparent bg-transparent px-4 py-2.5 text-base font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
                            >
                                Pricing
                            </a>
                        </Link>
                    </div>
                </div>
                {/* <div className="z-10">
                    <button
                        type="button"
                        className="hidden cursor-pointer items-center justify-center rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 text-base font-semibold text-text  shadow-sm hover:text-heading focus:text-heading focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-text dark:focus:ring-white/80 md:inline-flex"
                    >
                        Open App
                    </button>
                </div> */}

                <Menu as="div" className="relative md:hidden">
                    <Menu.Button
                        type="button"
                        className="inline-flex cursor-pointer items-center justify-right rounded-xl border-none border-transparent bg-transparent p-2 font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
                    >
                        <MenuAlt3Icon className="h-5 w-5 text-black" />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-layer-3 py-3 shadow-xl focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <Link href="/pricing">
                                        <a
                                            className={`${active ? "bg-muted-1 text-heading" : "text-text"
                                                } flex w-full text-black cursor-pointer items-center px-4 py-2 text-sm font-semibold`}
                                        >
                                            Pricing
                                        </a>
                                    </Link>
                                )}
                            </Menu.Item>
                            {/* <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`${active ? "bg-muted-1 text-heading" : "text-text"
                                            } flex w-full cursor-pointer items-center px-4 py-2 text-sm font-semibold`}
                                    >
                                        Button
                                    </button>
                                )}
                            </Menu.Item> */}
                        </Menu.Items>
                    </Transition>
                </Menu>
            </nav>
        </header>
    );
}

export default Navbar;