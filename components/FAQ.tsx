import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import Link from "next/link";

const FAQ = () => {
  return (
    <>
      {/* FAQ */}
      <section className="p-8 my-48 md:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="mb-10 text-2xl font-semibold text-heading md:text-5xl md:leading-tight">
            Frequently Asked Questions
          </h2>
          <div className="flex w-full md:w-2/3 flex-col space-y-2">

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="relative flex w-full items-center justify-between rounded-lg border border-muted-1 bg-layer-2 px-4 py-2 text-base font-semibold text-heading hover:bg-muted-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-heading/80 dark:border-0 dark:bg-layer-3">
                    Do you support more than PostgreSQL?
                    <ChevronDownIcon
                      className={`${open ? "rotate-180 text-heading" : "text-text"
                        } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    Currently, we support only PostgreSQL, but plan to add more database such as MySQL etc.<br></br><br></br>Send us a message at <b>caleb@chatdb.ai</b> if you use a data source other than PostgreSQL.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="relative flex w-full items-center justify-between rounded-lg border border-muted-1 bg-layer-2 px-4 py-2 text-base font-semibold text-heading hover:bg-muted-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-heading/80 dark:border-0 dark:bg-layer-3">
                    How can I improve the results?
                    <ChevronDownIcon
                      className={`${open ? "rotate-180 text-heading" : "text-text"
                        } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    By specifying the tables it needs to query can usually nudge the AI in the right direction. We will be continually improving the capabilities and effectiveness of the model.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="relative flex w-full items-center justify-between rounded-lg border border-muted-1 bg-layer-2 px-4 py-2 text-base font-semibold text-heading hover:bg-muted-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-heading/80 dark:border-0 dark:bg-layer-3">
                    Do you offer technical support?
                    <ChevronDownIcon
                      className={`${open ? "rotate-180 text-heading" : "text-text"
                        } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    Yes, we can help you based on the plan you are subscribed to.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>


            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="relative flex w-full items-center justify-between rounded-lg border border-muted-1 bg-layer-2 px-4 py-2 text-base font-semibold text-heading hover:bg-muted-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-heading/80 dark:border-0 dark:bg-layer-3">
                    How secure is the tool?
                    <ChevronDownIcon
                      className={`${open ? "rotate-180 text-heading" : "text-text"
                        } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    At ChatDB, security is the top priority. We encrypt database credentials at rest and in transit. When communicating between backend and database, we use secure tokens to protect your credentials. Your database table metadata is stored in secure secrets vault.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="relative flex w-full items-center justify-between rounded-lg border border-muted-1 bg-layer-2 px-4 py-2 text-base font-semibold text-heading hover:bg-muted-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-heading/80 dark:border-0 dark:bg-layer-3">
                    How do you protect my database from bad queries?
                    <ChevronDownIcon
                      className={`${open ? "rotate-180 text-heading" : "text-text"
                        } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    We parse the AI generated SQL query before executing it against the database. <br></br><br></br>
                    To have fool proof protection, we recommend creating a read only account for ChatDB to use with the database. We have instructions on how to do that <Link className="underline font-bold" href="/post/how-to-create-read-only-postgres-user">here</Link>.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="relative flex w-full items-center justify-between rounded-lg border border-muted-1 bg-layer-2 px-4 py-2 text-base font-semibold text-heading hover:bg-muted-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-heading/80 dark:border-0 dark:bg-layer-3">
                    What is on the product roadmap?
                    <ChevronDownIcon
                      className={`${open ? "rotate-180 text-heading" : "text-text"
                        } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    <ul className="list-disc list-inside mt-4 text-left">
                      <li>Add MySQL Database Support</li>
                      <li>Add Google Sheets Support</li>
                      <li>Add AI for files like CSVs, Excel, etc</li>
                    </ul>
                    <br></br>
                    Email us at <b>caleb@chatdb.ai</b> if you are looking for a feature that we don't yet have.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="relative flex w-full items-center justify-between rounded-lg border border-muted-1 bg-layer-2 px-4 py-2 text-base font-semibold text-heading hover:bg-muted-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-heading/80 dark:border-0 dark:bg-layer-3">
                    Do you have an Enterprise or a Custom plan?
                    <ChevronDownIcon
                      className={`${open ? "rotate-180 text-heading" : "text-text"
                        } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    Yes, we can do Enterprise or custom plans.<br></br><br></br>Send us a message at <b>caleb@chatdb.ai</b>.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;
