import React, { use, useEffect, useState } from "react";
import posthog from "posthog-js";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { toast } from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redirectingToCheckout, setRedirectingToCheckout] = useState(false);
  const router = useRouter();
  const cancel = trpc.subscriptions.cancel.useMutation({
    onMutate: () => {
      toast.loading("Updating plan...", {
        duration: 2000,
      });
    },
    onSuccess: (data) => {
      toast.success(data.message, {
        duration: 2000,
      });
      router.reload();
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 2000,
      });
    },
  });
  const update = trpc.subscriptions.update.useMutation({
    onMutate: () => {
      toast.loading("Updating plan...", {
        duration: 2000,
      });
    },
    onSuccess: (data) => {
      toast.success(data.message, {
        duration: 2000,
      });
      router.reload();
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 2000,
      });
    },
  });
  const handleButtonClick = (active) => {
    if (btnText === "Cancel") {
      setIsModalOpen(true);
    } else if (btnText === "Get Started") {
      setRedirectingToCheckout(true);
      router.push(`/checkout?plan=${name.toLowerCase()}`);
      posthog.capture("pricing_button_clicked");
    } else if (btnText === "Upgrade") {
      update.mutateAsync({
        plan: "chatDB Pro Plan",
      });
    } else if (btnText === "Downgrade") {
      update.mutateAsync({
        plan: "chatDB Hobby Plan",
      });
    }
  };
  const confirmAction = () => {
    cancel.mutateAsync();
  };

  return (
    <div
      style={{
        backgroundColor: color,
        border: active ? "3px solid #444" : "none",
        boxShadow: active ? "0 4px 8px rgba(0,0,0,0.15)" : "none",
      }}
      className="flex min-h-[428px] w-[400px] flex-col rounded-3xl p-8"
    >
      <ConfirmationModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        action={confirmAction}
      />
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-medium text-black">{name}</h2>
        {active && (
          <span className="text-md ml-2 rounded bg-gray-800 px-2.5 py-1 font-medium text-white">
            Current Plan
          </span>
        )}
      </div>

      {name !== "Business" ? (
        <div className="mb-5 flex items-end text-6xl font-black text-black">
          {price && (
            <>
              <div>${price}</div>
              <div className="text-lg font-medium">/month</div>
            </>
          )}
        </div>
      ) : (
        <div className="mb-5 flex items-end text-6xl font-black text-black">
          Contact Us
        </div>
      )}

      <p className="mb-5 font-semibold text-black">{description}</p>

      <ul className="mb-10 flex flex-col gap-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-800">
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
      {name !== "Business" && (
        <button
          className="mt-auto cursor-pointer rounded-xl bg-black px-6 py-3 text-left text-lg font-medium text-white"
          onClick={(e) => handleButtonClick(active)}
          disabled={cancel.isLoading || update.isLoading}
        >
          {cancel.isLoading || update.isLoading || redirectingToCheckout ? (
            <LoadingSpinner />
          ) : (
            btnText
          )}
        </button>
      )}
    </div>
  );
}
