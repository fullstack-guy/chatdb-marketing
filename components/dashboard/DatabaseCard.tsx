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
      <div className="h-[15vh] flex justify-center items-center p-2 bg-white border border-gray-200 rounded-lg cursor-pointer shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 transition duration-300 ease-in-out hover:scale-105 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={handleDatabaseCardClick}>
        <div className="w-full p-2 md:w-1/2 md:py-4 md:px-2 lg:w-1/2 lg:py-4 lg:px-6">
          <div className="h-[10vh] w-full flex items-center justify-center rounded-lg bg-[#0fe0b6]">
            <Image
              className="m-auto p-1"
              width={40}
              height={40}
              src={logo}
              alt={title}
            />
          </div>
        </div>
        <div className="w-full h-full flex flex-row justify-between items-center leading-normal">
          <h5 className="w-full mb-2 text-xl font-bold text-left tracking-tight text-gray-900 dark:text-white">{title}</h5>
          <div
            className="h-full flex flex-col"
            onClick={handleDropdownClick} // Handle DropdownMenu click event
          >
            <DropDownMenu uuid={uuid} refetchDatabases={refetch} />
          </div>
        </div>
      </div >

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
