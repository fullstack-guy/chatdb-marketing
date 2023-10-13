import React, { useEffect, useState } from "react";
import PlanCard from "./PlanCard";
import { useUser } from "@clerk/nextjs";

export default function Pricing() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activePlan, setActivePlan] = useState("");

  const btnText = (name) => {
    if (activePlan === "chatDB Hobby Plan" && name === "Hobby") {
      return "Cancel";
    } else if (activePlan === "chatDB Hobby Plan" && name === "Pro") {
      return "Upgrade";
    } else if (activePlan === "chatDB Pro Plan" && name === "Pro") {
      return "Cancel";
    } else if (activePlan === "chatDB Pro Plan" && name === "Hobby") {
      return "Downgrade";
    } else {
      return "Get Started";
    }
  };

  const isActivePlan = (name) => {
    return activePlan === name;
  };
  useEffect(() => {
    if (isSignedIn) {
      setActivePlan(user.publicMetadata.plan as string);
    }
  }, [isSignedIn, isLoaded, user]);
  return (
    <div className="w-full">
      <div className="m-auto flex flex-col items-center p-4">
        <div className="mb-10 mt-12 text-center">
          <h1 className="mb-4 text-7xl font-black text-black">Pricing</h1>
          <p className="text-lg">
            Choose the right pricing for you and get started on your project!
          </p>
        </div>
        <div className="flex flex-col gap-8 xl:flex-row">
          <PlanCard
            active={isActivePlan("chatDB Hobby Plan")}
            color="#78E3FC"
            name="Hobby"
            price="29.99"
            description="Get started with the basic plan!"
            features={[
              "1 User",
              "1 Data Source",
              "Charts and Graphs",
              "PostgreSQL Connection",
              "60 AI Queries Per Month",
            ]}
            btnText={btnText("Hobby")}
          />
          <PlanCard
            active={isActivePlan("chatDB Pro Plan")}
            color="#ffb5ba"
            name="Pro"
            price="49.99"
            description="For taking it up a notch!"
            features={[
              "1 User",
              "5 Data Sources",
              "Charts and Graphs",
              "PostgreSQL Connection",
              "More Databases Coming Soon",
              "120 AI Queries Per Month",
            ]}
            btnText={btnText("Pro")}
          />
          <PlanCard
            active={isActivePlan("chatDB Custom Plan")}
            color="#ab9cf0"
            name="Business"
            price="Custom"
            description="Tailored to your needs!"
            features={[
              "Unlimited Users",
              "Unlimited Data Sources",
              "Charts and Graphs",
              "Fine-Tuned Model to your Database",
              "Unlimited Queries",
              "Premium Support",
            ]}
            btnText={btnText("Contact Us")}
          />
        </div>
        {/* New banner for more AI query credits */}
        <div className="mb-20 mt-20 w-[50%] rounded-xl bg-white p-4 text-center">
          <h2 className="text-xl font-semibold text-black">
            Need more AI query credits?
          </h2>
          <span>
            <a
              href="mailto:caleb@chatdb.ai"
              className="text-gray-600 underline"
            >
              Contact us
            </a>
            <p className="inline"> and we can craft a customized plan.</p>
          </span>
        </div>
      </div>
    </div>
  );
}
