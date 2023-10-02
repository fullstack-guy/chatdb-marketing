import posthog from 'posthog-js';

posthog.init("phc_XX7yzbdFT45MB5ekwxwcXJ7EQy5bGXeQ57BpuWauzJt", {
    api_host: "https://app.posthog.com",
    loaded: function (posthog) {
        posthog.identify(uniqueId); // Use the unique ID for the PostHog identify call
    },
});

export default posthog;