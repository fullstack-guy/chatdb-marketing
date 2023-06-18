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
import posthog from 'posthog-js'

if (process.env.NODE_ENV === 'production') {
  posthog.init('phc_XX7yzbdFT45MB5ekwxwcXJ7EQy5bGXeQ57BpuWauzJt', {
    api_host: 'https://app.posthog.com',
    loaded: function (posthog) {
      posthog.identify('[user unique id]')
    },
  });
}


export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    hotjar.initialize(3430108, 6);

    // Track page view in Posthog
    posthog.capture('$pageview');

    // Listen for page changes
    router.events.on('routeChangeComplete', url => {
      posthog.capture('$pageview'); // track page view on route change
    });

    return () => {
      // Clean up the listener when the component is unmounted
      router.events.off('routeChangeComplete', () => posthog.capture('$pageview'));
    };
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
