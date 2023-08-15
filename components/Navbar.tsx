import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MenuAlt3Icon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const router = useRouter();

  // Check if the current route is the dashboard route
  const isOnDashboard = router.pathname === "/dashboard";

  return (
    <header className="mx-auto border-0 border-b border-solid border-b-slate-200 xl:px-0">
      <nav className="relative z-20 flex items-center justify-between py-6">
        <Link href="/" className="z-10">
          {/* Logo */}
          <h1 className="text-4xl font-bold text-heading">ChatDB</h1>
        </Link>
        <div className="hidden items-center md:flex">
          <SignedIn>
            {isOnDashboard ? (
              <></>
            ) : (
              <Link
                href="/dashboard"
                className="mx-4 cursor-pointer rounded-lg px-4 py-2.5 text-base font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
              >
                Dashboard
              </Link>
            )}
          </SignedIn>
          <Link
            href="/tools"
            className="mx-4 cursor-pointer rounded-lg px-4 py-2.5 text-base font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
          >
            Tools
          </Link>
          <Link
            href="/pricing"
            className="mx-4 cursor-pointer rounded-lg px-4 py-2.5 text-base font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="mx-4 cursor-pointer rounded-lg px-4 py-2.5 text-base font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
          >
            Blog
          </Link>
          <SignedIn>
            <div className="mx-4">
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            {/* <div className="mx-4 cursor-pointer rounded-lg px-4 py-2.5 text-base font-semibold hover:bg-heading/5 hover:text-heading focus:bg-heading/5">
              <SignInButton />
            </div> */}
          </SignedOut>
        </div>

        <Menu as="div" className="relative md:hidden">
          <Menu.Button
            type="button"
            className="justify-right :bg-heading/5 inline-flex cursor-pointer items-center rounded-xl border-none border-transparent bg-transparent p-2 font-semibold text-text hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
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
                  <Link
                    href="/tools"
                    className={`${active ? "bg-muted-1 text-heading" : "text-text"
                      } flex w-full cursor-pointer items-center px-4 py-2 text-sm font-semibold text-black`}
                  >
                    Tools
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/pricing"
                    className={`${active ? "bg-muted-1 text-heading" : "text-text"
                      } flex w-full cursor-pointer items-center px-4 py-2 text-sm font-semibold text-black`}
                  >
                    Pricing
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/blog"
                    className={`${active ? "bg-muted-1 text-heading" : "text-text"
                      } flex w-full cursor-pointer items-center px-4 py-2 text-sm font-semibold text-black`}
                  >
                    Blog
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/contact-us"
                    className={`${active ? "bg-muted-1 text-heading" : "text-text"
                      } flex w-full cursor-pointer items-center px-4 py-2 text-sm font-semibold text-black`}
                  >
                    Contact-Us
                  </Link>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </nav>
    </header>
  );
};

export default Navbar;
