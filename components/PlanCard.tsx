import React, { use, useEffect, useState } from "react";
import posthog from "posthog-js";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

interface PlanCardProps {
  active: boolean;
  name: string;
  description: string;
  btnText?: string;
  monthlyPrice?: string;
  annualPrice?: string;
  features: string[];
  color: string;
  price?: string;
}

export default function PlanCard({
  active,
  name,
  description,
  price,
  features,
  color,
  btnText = "Start Trial",

}: PlanCardProps) {
  const router = useRouter();
  const cancel = trpc.subscriptions.cancel.useMutation({
    onSuccess: () => {
      console.log("cancelled")
      router.push(`/`);
    }
  })
  const handleButtonClick = (active) => {
    if (active) {
      cancel.mutateAsync()
    } else {
      router.push(`/checkout?plan=${name.toLowerCase()}`);
      posthog.capture("pricing_button_clicked");
    }
  };

  useEffect(() => {
    console.log(name, active)
  }, [active])
  return (
    <div
      style={{ backgroundColor: color }}
      className="flex min-h-[428px] w-[400px] flex-col rounded-3xl p-8"
    >
      <h2 className="flex items-center justify-between mb-5 text-xl font-medium">{name}
        {active && (<span className="self-start bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">Current</span>)}
      </h2>

      {name !== "Business" ? (
        <div className="mb-5 flex items-end text-6xl font-black text-black">
          {price && (
            <>
              <div>${price}</div>
              <div className="text-lg font-medium">
                /month
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="mb-5 flex items-end text-6xl font-black text-black">
          Contact Us
        </div>
      )}

      <p className="mb-5">{description}</p>

      <ul className="mb-10 flex flex-col gap-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-3 h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <label
        htmlFor={`${name}_modal`}
        className="mt-auto cursor-pointer rounded-xl bg-black px-6 py-3 text-lg font-medium text-white"
        onClick={e => handleButtonClick(active)}
      >
        {active ? "Cancel" : btnText}
      </label>
    </div>
  );
}
