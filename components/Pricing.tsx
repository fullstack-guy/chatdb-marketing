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
        <div className="mb-2 mt-12 text-center">
          <h1 className="mb-4 text-7xl font-black text-black">Pricing</h1>
          <p className="text-lg">
            Choose the right pricing for you and get started working on your
            project
          </p>
          <div className="mt-6">
            <label
              className="inline-flex cursor-pointer items-center"
              onClick={handleToggle}
            >
              <span className="mr-3">Monthly</span>
              <input
                type="checkbox"
                className="toggle"
                checked={isYearlyPricing}
                onChange={handleToggle}
              />
              <span className="ml-3">Yearly</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-8 p-10 xl:flex-row">
          <PlanCard
            color="#78E3FC"
            name="Basic"
            monthlyPrice="19.99"
            annualPrice="199.99"
            description="Get started with the basic plan"
            features={[
              "1 User",
              "1 Project",
              "10 Tables",
              "Smart Debugging",
              "Backed by ChatGPT",
              "PostgreSQL Connection",
            ]}
            btnText="Get Started"
            isYearlyPricing={isYearlyPricing}
          />
          <PlanCard
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
              "All Connections",
              "Backed by GPT4",
              "Premium Support",
            ]}
            btnText="Become a Pro"
            isYearlyPricing={isYearlyPricing}
          />
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
