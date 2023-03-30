import Link from 'next/link'
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from 'react';
import { MenuAlt3Icon } from "@heroicons/react/outline";
import { useRouter } from 'next/router';
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton
} from "@clerk/nextjs";


const Navbar = () => {
    const router = useRouter();

    // Check if the current route is the dashboard route
    const isOnDashboard = router.pathname === '/dashboard';

    return (
        <header className="mx-auto max-w-7xl px-6 xl:px-0">
            <nav className="relative z-20 flex justify-between items-center py-6">
                <Link href="/">
                    <a className="z-10">
                        {/* Logo */}
                        <h1 className="text-4xl font-bold text-heading">ChatDB</h1>
                    </a>
                </Link>
                <div className="hidden md:flex items-center">
                    <Link href="/pricing">
                        <a
                            className="cursor-pointer px-4 rounded-lg mx-4 py-2.5 text-base font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
                        >
                            Pricing
                        </a>
                    </Link>
                    <Link href="/blog">
                        <a
                            className="cursor-pointer px-4 rounded-lg mx-4 py-2.5 text-base font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
                        >
                            Blog
                        </a>
                    </Link>
                    <SignedIn>
                        {isOnDashboard ? (
                            <>
                                <div
                                    style={{ background: "linear-gradient(90deg, rgba(168,41,250,1) 0%, rgb(121 87 255 / 80%) 75%)" }}
                                    className="btn btn-md inline-flex cursor-pointer border-none capitalize mx-4 items-center justify-center rounded-xl px-4 text-base font-semibold text-white shadow-sm hover:bg-primary-accent focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:border-primary disabled:hover:bg-primary disabled:hover:text-white dark:focus:ring-white/80"
                                >
                                    Add Database
                                </div>
                            </>
                        ) : (
                            <Link href="/dashboard">
                                <a
                                    className="cursor-pointer px-4 rounded-lg mx-4 py-2.5 text-base font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
                                >
                                    Dashboard
                                </a>
                            </Link>
                        )}
                        <div className="mx-4">
                            <UserButton />
                        </div>
                    </SignedIn>
                    <SignedOut>
                        {/* Signed out users get sign in button */}
                        <div className='cursor-pointer px-4 rounded-lg mx-4 py-2.5 text-base font-semibold hover:bg-heading/5 hover:text-heading focus:bg-heading/5'>
                            {/* <SignInButton /> */}
                        </div>
                    </SignedOut>
                </div>

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