import { FormEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { trpc } from "../../utils/trpc";

const Checkout = () => {
    const router = useRouter()
    const { isSignedIn, isLoaded, user } = useUser()
    const plan = router.query.plan;
    const [formData, setFormData] = useState({
        email: "",
    })
    const [submitting, setSetsubmitting] = useState(false)
    const { isLoading, isError, data: subscriptionStatus } = trpc.subscriptions.status.useQuery()
    const plans = {
        hobby: {
            monthlyPriceId: 'pri_01h90zjbsana88btxhepx13g9n',
        },
        pro: {
            monthlyPriceId: 'pri_01h90zt3jwcrxsjsmfyzb8qqda'
        }
    }
    const openPaddleCheckout = async () => {
        const Paddle = await window.Paddle;
        setSetsubmitting(true)
        await Paddle?.Checkout.open({
            settings: {
                displayMode: "inline",
                theme: "light",
                locale: "en",
                frameTarget: "checkout-container",
                frameInitialHeight: "450",
                frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;"
            },
            items: [
                {
                    priceId: plans[plan as string].monthlyPriceId,
                    quantity: 1
                },

            ],
            customer: {
                email: user?.emailAddresses[0]?.emailAddress,

            }
        });
    };

    useEffect(() => {


        if (isSignedIn && isLoaded && user.emailAddresses[0]) {
            setFormData({ ...formData, email: user.emailAddresses[0].emailAddress })
        }

        const onPageLoad = async () => {
            if (subscriptionStatus && subscriptionStatus.remainingDatabases === null) {
                await openPaddleCheckout();
            }
        };

        if (document.readyState === 'complete') {
            if (!plan) {
                router.push("/pricing")
                return
            }
            onPageLoad();

        } else {
            window.addEventListener('load', onPageLoad);
            return () => window.removeEventListener('load', onPageLoad);
        }
    }, [plan, isLoading, subscriptionStatus])

    return (
        <Layout
            title="ChatDB Pricing | The AI Database Assistant for your team"
            description="Discover affordable plans for ChatDB, the AI Database Assistant. Find the perfect plan for your team size and needs."
            url="https://www.chatdb.ai/pricing"
        >

            <h1 className="text-center p-2 m-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">You are subscribing to the <span className="capitalize text-blue-600 dark:text-blue-500">{plan}</span> Plan.</h1>

            <div className="checkout-container">
            </div>

        </Layout>
    );
};

export default Checkout;
