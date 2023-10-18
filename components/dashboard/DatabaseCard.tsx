import React, { useState } from "react";
import Image from "next/image";
import { trpc } from "../../utils/trpc";
import UpdateSubscriptionModal from "../UpdateSubscriptionModal";
import { useRouter } from "next/router";
import DeleteDatabasesModal from "./DeleteDatabasesModal";
import DropDownMenu from "./DropDownMenu";
import { twMerge } from "tailwind-merge";
export const Card = ({ type, logo, title, lastUpdated, uuid, refetch }) => {
  const {
    isLoading,
    isError,
    data: subscriptionStatus,
  } = trpc.subscriptions.status.useQuery();
  const [
    isUpdateSubscriptionModalOpeneded,
    setIsUpdateSubscriptionModalOpened,
  ] = useState(false);
  const [isDeleteDatabasesModalOpened, setIsDeleteDatabasesModalOpeneded] =
    useState(false);
  const router = useRouter();
  const handleDatabaseCardClick = () => {
    if (
      !isLoading &&
      !isError &&
      subscriptionStatus?.remainingDatabases === null
    ) {
      setIsUpdateSubscriptionModalOpened(true);
    } else if (
      !isLoading &&
      !isError &&
      subscriptionStatus?.isUserExceedingAllowedNumberOfDatabases
    ) {
      setIsDeleteDatabasesModalOpeneded(true);
    } else {
      router.push(`/dashboard/${uuid}`);
    }
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="relative">
      <div
        className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:max-w-xl md:flex-row"
        onClick={handleDatabaseCardClick}
      >
        <div className="flex-shrink-0 p-1 md:p-1 lg:p-1">
          <div
            className={twMerge(
              "flex h-[8vh] w-[8vh] items-center justify-center rounded-lg ",
              type === "POSTGRES" ? "bg-[#0fe0b6]" : "bg-[#8cb4ff]"
            )}
          >
            <Image
              className="m-auto"
              width={40}
              height={40}
              src={logo}
              alt={title}
            />
          </div>
        </div>
        <div className="relative flex h-full flex-grow flex-col items-start justify-between leading-normal">
          <div className="flex w-full items-center">
            <h5 className="ml-2 text-left text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h5>
          </div>
          <div
            className="absolute right-0 top-0 m-0 p-0"
            onClick={handleDropdownClick}
          >
            <DropDownMenu uuid={uuid} refetchDatabases={refetch} />
          </div>
        </div>
      </div>

      <UpdateSubscriptionModal
        open={isUpdateSubscriptionModalOpeneded}
        setOpen={setIsUpdateSubscriptionModalOpened}
        description={
          "You are not subscribed to any plan. Please choose a plan to start creating databases."
        }
        title={"Choose a Plan"}
        actionDescription={"View Pricing"}
        action={() => router.push("/pricing")}
      />
      <DeleteDatabasesModal
        open={isDeleteDatabasesModalOpened}
        setOpen={setIsDeleteDatabasesModalOpeneded}
      />
    </div>
  );
};

export default Card;
