import React, { useState } from "react";
import Image from "next/image";
import { trpc } from "../../utils/trpc";
import UpdateSubscriptionModal from "../UpdateSubscriptionModal";
import { useRouter } from "next/router";
import DeleteDatabasesModal from "./DeleteDatabasesModal";
import DropDownMenu from "./DropDownMenu";
export const Card = ({ logo, title, lastUpdated, uuid, refetch }) => {
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
      <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg cursor-pointer shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 transition duration-300 ease-in-out hover:scale-105 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={handleDatabaseCardClick}>
        <div className="flex-shrink-0 p-1 md:p-1 lg:p-1">
          <div className="h-[8vh] w-[8vh] flex items-center justify-center rounded-lg bg-[#0fe0b6]">
            <Image
              className="m-auto"
              width={40}
              height={40}
              src={logo}
              alt={title}
            />
          </div>
        </div>
        <div className="flex-grow h-full flex flex-col justify-between items-start leading-normal relative">
          <div className="flex items-center w-full">
            <h5 className="text-xl font-bold ml-2 text-left tracking-tight text-gray-900 dark:text-white">{title}</h5>
          </div>
          <div
            className="absolute top-0 right-0 p-0 m-0"
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
    </div >
  );
};

export default Card;
