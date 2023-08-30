import { FormEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { set } from "zod";

const Checkout = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter()
    const plan = router.query.plan;
    const [formData, setFormData] = useState({
        email: "",
        country: "",
        zip: ""
    })
    const [submitting, setSetsubmitting] = useState(false)
    const plans = {
        hobby: {
            monthlyPriceId: 'pri_01h90zjbsana88btxhepx13g9n',
        },
        pro: {
            monthlyPriceId: 'pri_01h90zt3jwcrxsjsmfyzb8qqda'
        }
    }
    const capitalizeFirstLetter = (input: string) => input.charAt(0).toUpperCase() + input.slice(1);
    const handlePayment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const Paddle = window.Paddle;
        console.log("plan", plan);
        setSetsubmitting(true)
        Paddle.Checkout.open({
            settings: {
                displayMode: "inline",
                theme: "light",
                locale: "en",
                frameTarget: "checkout-container",
                frameInitialHeight: "450",
                frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;"
            },
            eventCallback: function (data) {
                if (data.name == "checkout.completed") {
                    console.log("paddle data", data);
                }
            },
            items: [
                {
                    priceId: plans[plan as string].monthlyPriceId,
                    quantity: 1
                },

            ],
            customer: {
                email: formData.email,
                address: {
                    postalCode: formData.zip
                }
            }
        });
    };

    return (
        <Layout
            title="ChatDB Pricing | The AI Database Assistant for your team"
            description="Discover affordable plans for ChatDB, the AI Database Assistant. Find the perfect plan for your team size and needs."
            url="https://www.chatdb.ai/pricing"
        >

            <div className="flex flex-col items-center justify-center align-middle">
                <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">You are subscribing for the <span className="capitalize text-blue-600 dark:text-blue-500">{plan}</span> Plan.</h1>

                {
                    !submitting && (
                        <form className="p-4 w-full md:w-1/2 lg:w-1/2 z-[100]" onSubmit={handlePayment}>
                            <div className="mb-6">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="name@test.com" required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zip or Postal code: <span className="text-sm text-gray-500">{"(Optional)"}</span></label>
                                <input type="text" id="zip" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    value={formData.zip}
                                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"

                            >Subscribe</button>
                        </form>
                    )
                }
            </div>

            <div className="checkout-container">
            </div>

        </Layout>
    );
};

export default Checkout;
