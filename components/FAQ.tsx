import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

const FAQ = () => {
  return (
    <>
      {/* FAQ */}
      <section className="p-8 md:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="mb-10 text-4xl font-semibold text-heading md:text-5xl md:leading-tight">
            Frequently Asked Questions
          </h2>
          <div className="flex w-96 flex-col space-y-2">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="relative flex w-full items-center justify-between rounded-lg border border-muted-1 bg-layer-2 px-4 py-2 text-base font-semibold text-heading hover:bg-muted-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-heading/80 dark:border-0 dark:bg-layer-3">
                    How does the database snapshot work?
                    <ChevronDownIcon
                      className={`${
                        open ? "rotate-180 text-heading" : "text-text"
                      } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    With TempConnect ChatDB connects to your database and reads
                    the table information. This is a one time snapshot and
                    ChatDB does not stay connected to your database.
                    <br></br>
                    <br></br>
                    ChatDB only knows the names of the tables and the column
                    names. It does not access or store any of your data in the
                    tables.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="relative flex w-full items-center justify-between rounded-lg border border-muted-1 bg-layer-2 px-4 py-2 text-base font-semibold text-heading hover:bg-muted-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-heading/80 dark:border-0 dark:bg-layer-3">
                    Does it work with queries involving complex joins?
                    <ChevronDownIcon
                      className={`${
                        open ? "rotate-180 text-heading" : "text-text"
                      } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    Yes, it works great for complex problems where you may have
                    to use multiple tables and relationships.
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
                      className={`${
                        open ? "rotate-180 text-heading" : "text-text"
                      } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    Yes, premium plans offer technical support!
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="relative flex w-full items-center justify-between rounded-lg border border-muted-1 bg-layer-2 px-4 py-2 text-base font-semibold text-heading hover:bg-muted-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-heading/80 dark:border-0 dark:bg-layer-3">
                    What are the benefits of using ChatDB?
                    <ChevronDownIcon
                      className={`${
                        open ? "rotate-180 text-heading" : "text-text"
                      } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    Offering ChatDB to your team will improve the employee
                    onboarding experience, save precious engineering hours, and
                    make it easier to extract valuable insights from your data,
                    allowing your team to make more informed decisions and
                    improve business outcomes.{" "}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="relative flex w-full items-center justify-between rounded-lg border border-muted-1 bg-layer-2 px-4 py-2 text-base font-semibold text-heading hover:bg-muted-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-heading/80 dark:border-0 dark:bg-layer-3">
                    How secure is the tool? Will it access or modify my data?
                    <ChevronDownIcon
                      className={`${
                        open ? "rotate-180 text-heading" : "text-text"
                      } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    At ChatDB, security is the top priority. We do not modify or
                    access data in your databases. Additionally, we do not store
                    your database authentication information or maintain a
                    connection to your database.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="relative flex w-full items-center justify-between rounded-lg border border-muted-1 bg-layer-2 px-4 py-2 text-base font-semibold text-heading hover:bg-muted-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-heading/80 dark:border-0 dark:bg-layer-3">
                    How does the tool learn about my database and its schema?
                    <ChevronDownIcon
                      className={`${
                        open ? "rotate-180 text-heading" : "text-text"
                      } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-2">
                    During the onboarding, you take a Snapshot of your data
                    model. This is a simple read only query that reads the
                    names, fields, and data types of the tables in your
                    database. AI will use this information to create queries
                    that work with your specific data model!
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
