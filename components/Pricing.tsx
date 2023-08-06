import React, { useState } from "react";
import PlanCard from "./PlanCard";

export default function Pricing() {
  const [isYearlyPricing, setYearlyPricing] = useState(false);

  const handleToggle = () => {
    setYearlyPricing(!isYearlyPricing);
  };

  return (
    <div className="w-full">
      <div className="m-auto flex flex-col items-center p-4">
        <div className="mb-10 mt-12 text-center">
          <h1 className="mb-4 text-7xl font-black text-black">Pricing</h1>
          <p className="text-lg">
            Choose the right pricing for you and get started working on your
            project. <br></br>Get your own personal data analyst at the price of a pizza!
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              className={`rounded-lg px-4 py-2 ${!isYearlyPricing
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-500"
                }`}
              onClick={() => setYearlyPricing(false)}
            >
              Monthly
            </button>
            <button
              className={`rounded-lg px-4 py-2 ${isYearlyPricing
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-500"
                }`}
              onClick={() => setYearlyPricing(true)}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-8 xl:flex-row">
          <PlanCard
            color="#78E3FC"
            name="Basic"
            monthlyPrice="29.99"
            annualPrice="299.99"
            description="Get started with the basic plan"
            features={[
              "1 User",
              "5 Databases",
              "30 Tables",
              "Unlimited Messages",
              "Chat with CSV",
              "Backed by ChatGPT",
              "PostgreSQL Connection",
              "Multiple Schemas",
            ]}
            btnText="Get Started"
            isYearlyPricing={isYearlyPricing}
          />
          {/* <PlanCard
            color="#F4D06F"
            name="Pro"
            monthlyPrice="29.99"
            annualPrice="299.99"
            description="Get more advanced"
            features={[
              "1 User",
              "5 Projects",
              "50 Tables",
              "Smart Debugging",
              "Multiple Schemas",
              "All Connections",
              "GPT4 Add On",
              "Premium Support",
            ]}
            btnText="Become a Pro"
            isYearlyPricing={isYearlyPricing}
          /> */}
          <PlanCard
            color="#FFB5BA"
            name="Business"
            description="For big teams and businesses"
            price="Contact Us"
            features={[
              "Organization Settings",
              "Unlimited Users",
              "Unlimited Projects",
              "All Connections",
              "Backed by GPT4",
              "Premium Support",
              "Custom Feature Requests",
            ]}
            btnText="Contact Us"
            isYearlyPricing={isYearlyPricing}
          />
        </div>
      </div>
    </div>
  );
}
