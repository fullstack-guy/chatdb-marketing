import "../styles/globals.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import { ClerkProvider } from "@clerk/nextjs";
import { SubscriptionProvider } from "use-stripe-subscription";
import { hotjar } from "react-hotjar";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    hotjar.initialize(3430108, 6);
  }, [router.events]);
  return (
    <SubscriptionProvider
      stripePublishableKey={
        process.env.NODE_ENV === 'production'
          ? process.env.STRIPE_PROD_PUBLISHABLE_KEY
          : process.env.STRIPE_TEST_PUBLISHABLE_KEY
      }
    >
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </SubscriptionProvider>
  );
}
