import { useEffect } from "react";
import Layout from "../../components/Layout";

const Page = () => {

    const handlePayment = async () => {
        const Paddle = window.Paddle;

        Paddle.Checkout.open({
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
                    priceId: 'pri_01h91dyt1mxwnc4g0xqnwvcs7x',
                    quantity: 1
                }
            ]
        });
    };

    useEffect(() => {

    }, []);
    return (
        <Layout
            title="ChatDB Pricing | The AI Database Assistant for your team"
            description="Discover affordable plans for ChatDB, the AI Database Assistant. Find the perfect plan for your team size and needs."
            url="https://www.chatdb.ai/pricing"
        >
            <div className="checkout-container"></div>
            <button
                className='paddle_button'
                data-items='[{
                     "priceId": "pri_01h91dyt1mxwnc4g0xqnwvcs7x",
                     "quantity": 1
                     }]'
            >
                Pay
            </button>
        </Layout>
    );
};

export default Page;
