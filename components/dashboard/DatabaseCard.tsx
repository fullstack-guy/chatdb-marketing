import React, { useState } from "react";
import Image from "next/image";
import { trpc } from "../../utils/trpc";
import UpdateSubscriptionModal from "../UpdateSubscriptionModal";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

export const Card = ({ logo, title, lastUpdated, uuid }) => {
  const { isLoading, isError, data: subscriptionStatus } = trpc.subscriptions.status.useQuery()
  const [isUpdateSubscriptionModalOpeneded, setIsUpdateSubscriptionModalOpened] = useState(false)
  const router = useRouter()
  const { user } = useUser()
  const handleDatabaseCardClick = () => {
    console.log(user)
    return
    if (!isLoading && !isError && subscriptionStatus?.remainingDatabases === null) {
      console.log("here")
      setIsUpdateSubscriptionModalOpened(true)
    } else {
      console.log("there")
      router.push(`/dashboard/${uuid}`)
    }
  }

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={handleDatabaseCardClick}>
        <div className="mb-4 flex cursor-pointer items-center rounded-lg p-4 shadow-md transition duration-300 ease-in-out hover:scale-105">
          <div className="mr-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-[#0fe0b6]">
            <Image
              className="m-auto"
              width={40}
              height={40}
              src={logo}
              alt={title}
            />
          </div>
          <div>
            <h1 className="mb-2 text-lg font-bold text-black">{title}</h1>
            {/* <p className="text-sm italic text-gray-600">
              Created: {lastUpdated}
            </p> */}
          </div>
        </div>
      </div>
      <UpdateSubscriptionModal open={isUpdateSubscriptionModalOpeneded} setOpen={setIsUpdateSubscriptionModalOpened}
        description={"You are not subscribed to any plan. Please choose a plan to start creating databases."}
        title={"Choose a Plan"}
        actionDescription={"View Pricing"}
        action={() => router.push("/pricing")} />
    </div>

  );
};

export default Card;
