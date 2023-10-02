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

  return (
    <div className="relative">
      <div className="h-[15vh] flex justify-center items-center bg-white border border-gray-200 rounded-lg shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 transition duration-300 ease-in-out hover:scale-105 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="w-full p-2 md:w-full md:p-4 lg:w-full lg:p-4">
          <div className="h-[10vh] w-1/3 md:h-[10vh] md:w-2/6 lg:h-[10vh] lg:w-2/6 flex items-center justify-center rounded-lg bg-[#0fe0b6]">
            <Image
              className="m-auto p-1"
              width={40}
              height={40}
              src={logo}
              alt={title}
            />
          </div>
        </div>
        <div className="w-full h-full flex flex-row justify-between items-center p-2 leading-normal">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
          <div className="h-full flex flex-col justify-around items-center">
            <DropDownMenu uuid={uuid} refetchDatabases={refetch} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8 cursor-pointer bg-slate-100  hover:bg-slate-200 rounded-xl"
              onClick={handleDatabaseCardClick}
            >
              <path fillRule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z" clipRule="evenodd"
              />
            </svg>
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
