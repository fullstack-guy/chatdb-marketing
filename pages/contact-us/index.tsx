import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export default function Contact() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = (data) => {
        axios.post('https://api.slapform.com/qBd4CXjnf', {
            from: data.email,
            text: data.message
        })
            .then((response) => {
                toast.success("Message sent successfully!");
                reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error("There was an error sending your message.");
            });
    };

    return (
        <Layout>
            <div className="w-full">
                <div className="m-auto flex flex-col items-center p-4">
                    <div className="mb-2 mt-12 text-center">
                        <h1 className="mb-4 text-7xl font-black text-black">Contact Us</h1>
                        <p className="text-lg mt-12">
                            We would love to hear from you. Please fill out this form and we will get in touch with you shortly.
                        </p>
                    </div>
                    <div className="w-full max-w-md mt-12">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Entered value does not match email format' } })}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                />
                                {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message as string}</p>}
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                                    Message
                                </label>
                                <textarea
                                    className="textarea textarea-bordered textarea-lg w-full max-w-2xl"

                                    {...register('message', { required: 'Message is required' })}
                                    id="message"
                                    placeholder="Message"
                                />
                                {errors.message && <p className="text-red-500 text-xs italic">{errors.message.message as string}</p>}
                            </div>
                            <div className="flex items-center justify-end">
                                <button className="bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Toaster position='bottom-center' />
        </Layout>
    );
}
