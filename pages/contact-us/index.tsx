import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    axios
      .post("https://api.slapform.com/qBd4CXjnf", {
        from: data.email,
        text: data.message,
      })
      .then((response) => {
        toast.success("Message sent successfully!");
        reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("There was an error sending your message.");
      });
  };

  return (
    <Layout
      title="Contact Us | ChatDB"
      description="Get in touch with us for any questions, comments, or feedback about ChatDB. We're here to help!"
      url="https://www.chatdb.ai/contact-us"
    >
      <div className="w-full">
        <div className="m-auto flex flex-col items-center p-4">
          <div className="mb-2 mt-12 text-center">
            <h1 className="mb-4 text-7xl font-black text-black">Contact Us</h1>
            <p className="mt-12 text-lg">
              We would love to hear from you. Please fill out this form and we
              will get in touch with you shortly.
            </p>
          </div>
          <div className="mt-12 w-full max-w-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  className="mb-2 block text-sm font-bold text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Entered value does not match email format",
                    },
                  })}
                  className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  id="email"
                  type="email"
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-xs italic text-red-500">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  className="mb-2 block text-sm font-bold text-gray-700"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  className="textarea-bordered textarea textarea-lg w-full max-w-2xl"
                  {...register("message", { required: "Message is required" })}
                  id="message"
                  placeholder="Message"
                />
                {errors.message && (
                  <p className="text-xs italic text-red-500">
                    {errors.message.message as string}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end">
                <button
                  className="focus:shadow-outline rounded bg-gray-700 px-4 py-2 font-bold text-white focus:outline-none"
                  type="submit"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </Layout>
  );
}
