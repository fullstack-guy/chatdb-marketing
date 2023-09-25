import Layout from "../../components/Layout";
import Link from "next/link";

const Page = () => {
  return (
    <Layout
      title="ChatDB | Terms of Service"
      url="https://www.yourdomain.com/terms-of-service"
      oggURL={`${
        process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""
      }/api/og?title=${encodeURIComponent("Terms of Service")}`}
    >
      <div className="px-4 py-8 md:px-8">
        <h1 className="mt-5 text-left text-4xl font-bold text-black md:max-w-4xl md:text-4xl xl:text-6xl">
          Terms of Service
        </h1>

        <section className="my-8">
          <p className="text-md mt-6 text-left text-gray-700">
            Please read these Terms carefully before using our services
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold text-black">
            1. Usage Restrictions
          </h2>
          <p className="text-md mt-6 text-gray-700">
            You may not misuse our platform. This includes attempting
            unauthorized access, tampering with data or our platform, or using
            our services for any illegal activities.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold text-black">
            2. Changes to these Terms
          </h2>
          <p className="text-md mt-6 text-gray-700">
            We may revise these Terms from time to time. Any changes will be
            posted on this page. Please review the updated terms before
            continuing to use our platform.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold text-black">
            3. Limitation of Liability
          </h2>
          <p className="text-md mt-6 text-gray-700">
            To the maximum extent permitted by law, we shall not be liable for
            any indirect, incidental, special, consequential, or punitive
            damages, or any loss of profits or revenues, incurred directly or
            indirectly from your use of our platform.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold text-black">
            4. Communications
          </h2>
          <p className="text-md mt-6 text-gray-700">
            By creating an Account, you may opt to receive newsletters,
            marketing or promotional materials, and other pertinent
            communications.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold text-black">
            5. Prohibited Uses
          </h2>
          <p className="text-md mt-6 text-gray-700">
            You may use Service or Website only for lawful purposes and in
            accordance with Terms. You agree not to use Service or Website:
            <br></br>
            <br></br>
            in any way that violates any applicable national or international
            law or regulation, for the purpose of exploiting, harming, or
            attempting to exploit or harm minors in any way by exposing them to
            inappropriate content or otherwise, to transmit, or procure the
            sending of, any advertising or promotional material, including any
            “junk mail”, “chain letter,” “spam,” or any other similar
            solicitation, to impersonate or attempt to impersonate Company, a
            Company employee, another User, or any other person or entity, in
            any way that infringes upon the rights of others, or in any way is
            illegal, threatening, fraudulent, or harmful, or in connection with
            any unlawful, illegal, fraudulent, or harmful purpose or activity,
            to engage in any other conduct that restricts or inhibits anyone’s
            use or enjoyment of Service or Website, or which, as determined by
            us, may harm or offend Company or Users of Service or Website or
            expose them to liability. Additionally, you agree not to:
            <br></br>
            <br></br>
            use Service and Website in any manner that could disable,
            overburden, damage, or impair Service or Website or interfere with
            any other party’s use of Service, including their ability to engage
            in real time activities through Service or Website, use any robot,
            spider, or other automatic device, process, or means to access
            Service or Website for any purpose, including monitoring or copying
            any of the material on Service or Website, use any manual process to
            monitor or copy any of the material on Service or Website or for any
            other unauthorized purpose without our prior written consent, use
            any device, software, or routine that interferes with the proper
            working of Service or Website, introduce any viruses, trojan horses,
            worms, logic bombs, or other material, which is malicious or
            technologically harmful, attempt to gain unauthorized access to,
            interfere with, damage, or disrupt any parts of Service or Website,
            the server on which Service or Website is stored, or any server,
            computer, or database connected to Service or Website, attack
            Service or Website via a denial-of-service attack or a distributed
            denial-of-service attack, take any action that may damage or falsify
            Company rating, otherwise attempt to interfere with the proper
            working of Service or Website.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold text-black">6. Analytics</h2>
          <p className="text-md mt-6 text-gray-700">
            We may use third-party Service Providers to monitor and analyze the
            use of our Service.
            <br></br>
            <br></br>
            <b>PostHog</b>
            <br></br>
            <br></br>
            PostHog is an open-source analytics platform that helps us
            understand how users interact with our Service and Website. We use
            the data collected by PostHog to enhance and personalize your
            experience. Unlike other platforms, PostHog's focus is on privacy,
            ensuring that user data remains private and is not shared with third
            parties. For more information on the privacy practices of PostHog,
            please visit the PostHog{" "}
            <Link href="https://posthog.com/privacy">Privacy Policy</Link>.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold text-black">7. Contact</h2>
          <p className="text-md mt-6 text-gray-700">
            If you have any questions regarding these Terms, you may contact us
            at caleb@chatdb.ai.
          </p>
        </section>

        <section className="mt-4">
          <p className="text-md mt-6 text-gray-700">
            Last Updated: August 22, 2023
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default Page;
