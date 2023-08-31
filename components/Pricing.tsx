import React, { useEffect, useState } from "react";
import PlanCard from "./PlanCard";
import { useUser } from "@clerk/nextjs";

export default function Pricing() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <div className="w-full">
      <div className="m-auto flex flex-col items-center p-4">
        <div className="mb-10 mt-12 text-center">
          <h1 className="mb-4 text-7xl font-black text-black">Pricing</h1>
          <p className="text-lg">
            Choose the right pricing for you and get started working on your
            project. <br></br>Get your own personal data analyst at the price of
            a pizza!
          </p>
        </div>
        <div className="flex flex-col gap-8 xl:flex-row">
          <PlanCard
            color="#78E3FC"
            name="Hobby"
            price="19.99"
            description="Get started with the basic plan"
            features={[
              "1 User",
              "5 Databases",
              "PostgreSQL Connection",
              "30 Tables",
            ]}
            btnText="Get Started"
          />
          <PlanCard
            color="#ffb5ba"
            name="Pro"
            price="49.99"
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
          />
        </div>
      </div>
    </div>
  );
}
