import Layout from "../../components/Layout";
import Link from "next/link";

const Page = () => {
    return (
        <Layout
            title="ChatDB | Privacy Policy"
            url="https://www.chatdb.ai/privacy-policy"
            oggURL={
                `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
                }/api/og?title=${encodeURIComponent("Privacy Policy")}`
            }
        >
            <div className="px-4 py-8 md:px-8">
                <h1 className="my-10 text-left text-black text-4xl font-bold md:max-w-4xl md:text-4xl xl:text-6xl">
                    Privacy Policy
                </h1>
                <h2 className="text-xl text-heading">Last modified: August 22, 2023</h2>

                {/* Data Storage and Security */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-black">Data Storage and Security</h2>
                    <p className="mt-6 text-lg text-gray-700">
                        We are committed to maintaining the privacy and integrity of user data. Here are our rigorous measures:
                    </p>
                    <ul className="mt-4 pl-8 list-disc">
                        <li className="mt-2 text-lg text-gray-700">
                            Our system retains the database table schema to generate the database schema flow interface. This schema is encrypted and securely stored in a Vault.
                        </li>
                        <li className="mt-2 text-lg text-gray-700">
                            Personal or proprietary data from user databases is never stored on our platform.
                        </li>
                        <li className="mt-2 text-lg text-gray-700">
                            We ensure data credentials are encrypted when at rest. When these credentials move between secure databases and servers, they are tokenized with <Link href="https://basistheory.com/"><b>Basis Theory</b></Link> and protected by TLS protocols.
                        </li>
                    </ul>
                </section>

                {/* Cookie Tracking */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-black">Data Storage and Security</h2>
                    <p className="mt-6 text-lg text-gray-700">
                        We are committed to maintaining the privacy and integrity of user data. Here are our rigorous measures:
                    </p>
                    <p className="text-lg text-gray-700">
                        We use cookies and similar tracking technologies to track the activity on our Service and we hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your Device. Other tracking technologies are also used such as beacons, tags, and scripts to collect and track information and to improve and analyze our Service.
                    </p>
                    <ul className="mt-2 pl-8 list-disc text-lg text-gray-700">
                        <li>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</li>
                        <li>If you do not accept cookies, you may not be able to use some portions of our Service.</li>
                    </ul>
                    <p className="text-lg text-gray-700 mt-4">
                        Examples of Cookies we use:
                    </p>
                    <ul className="mt-2 pl-8 list-disc text-lg text-gray-700">
                        <li>Session Cookies: We use Session Cookies to operate our Service.</li>
                        <li>Preference Cookies: We use Preference Cookies to remember your preferences and various settings.</li>
                        <li>Security Cookies: We use Security Cookies for security purposes.</li>
                        <li>Advertising Cookies: Advertising Cookies are used to serve you with advertisements that may be relevant to you and your interests.</li>
                    </ul>

                    <h3 className="text-xl my-4 font-semibold text-black">Use of Data</h3>
                    <p className="text-lg text-gray-700">
                        ChatDB.ai uses the collected Personal Data for various purposes:
                    </p>
                    <ol className="mt-2 pl-8 list-decimal text-lg text-gray-700">
                        <li>to provide and maintain our Service; type of Personal Data: email address, first name and last name, Cookies and Usage Data; necessity for the performance of a contract to which you are a party;</li>
                        <li>to notify you about changes to our Service; type of Personal Data: email address, first name and last name, Cookies and Usage Data; necessity for the performance of a contract to which you are a party;</li>
                        <li>to allow you to participate in interactive features of our Service when you choose to do so; type of Personal Data: email address, first name and last name, Cookies and Usage Data; necessity for the performance of a contract to which you are a party;</li>
                        <li>to provide customer support; type of Personal Data: email address, first name and last name, Cookies and Usage Data; necessity for the performance of a contract to which you are a party;</li>
                        <li>to gather analysis or valuable information so that we can improve our Service; type of Personal Data: email address, first name and last name, Cookies and Usage Data; legitimate interests of the Data Controller;</li>
                        <li>to monitor the usage of our Service; type of Personal Data: email address, first name and last name, Cookies and Usage Data; legitimate interests of the Data Controller;</li>
                        <li>to detect, prevent and address technical issues; type of Personal Data: email address, first name and last name, Cookies and Usage Data; legitimate interests of the Data Controller;</li>
                        <li>to fulfill any other purpose for which you provide it; type of Personal Data: email address, first name and last name, Cookies and Usage Data; necessity for the performance of a contract to which you are a party;</li>
                        <li>to carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection; type of Personal Data: email address, first name and last name, Cookies and Usage Data; necessity for the performance of a contract to which you are a party;</li>
                        <li>to provide you with notices about your account and/or subscription, including expiration and renewal notices, email-instructions, etc.; type of Personal Data: email address, first name and last name, Cookies and Usage Data; necessity for the performance of a contract to which you are a party;</li>
                        <li>to provide you with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information; type of Personal Data: email address, first name and last name, Cookies and Usage Data; upon your consent;</li>
                        <li>in any other way we may describe when you provide the information; type of Personal Data: email address, first name and last name, Cookies and Usage Data; necessity for the performance of a contract to which you are a party;</li>
                    </ol>
                    <h3 className="text-xl my-4 font-semibold text-black">Retention of Data</h3>
                    <p className="text-lg text-gray-700">
                        We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies. Your Personal Data processed upon your consent will be stored for as long as the relevant consent is not withdrawn and until the expiration of claims resulting from the Service. We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer time periods.
                    </p>
                    <br></br>
                    <p className="font-semibold text-gray-700 text-lg">Once again, we do not store data from your database tables.</p>
                    <h3 className="text-xl my-4 font-semibold text-black">Transfer of Data</h3>
                    <p className="text-gray-700 text-lg">Your information, including Personal Data, may be transferred to – and maintained on – computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. If you are located outside United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to United States and process it there. The Company will take all the steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information. When we transfer your Personal Data to other countries, we will protect that Personal Data as described in this Privacy Policy and in accordance with applicable law. We use contractual protections for the transfer of Personal Data among various jurisdictions (the European Commission’s standard contractual clauses referred to in Article 46. 2 c) of the GDPR).
                    </p>
                    <h3 className="text-xl my-4 font-semibold text-black">Your Data Protection Rights Under General Data Protection Regulation (GDPR)</h3>
                    <p className="text-lg text-gray-700">If you are a resident of the European Union (EU) and European Economic Area (EEA), you have certain data protection rights, covered by GDPR. We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. You have the following data protection rights:</p>
                    <ol className="mt-2 pl-8 list-decimal text-lg text-gray-700">
                        <li>to access to your Personal Data by requesting sharing and/or sending a copy of all your Personal Data processed by us;</li>
                        <li>to request rectification of inaccurate Personal Data by indicating the data requiring rectification;</li>
                        <li>to request erasure of your Personal Data; we have the right to refuse to erase the Personal Data in specific circumstances provided by law;</li>
                        <li>to request restriction of processing of your Personal Data by indicating the data which should be restricted;</li>
                        <li>to object to processing your Personal Data conducted based on grounds relating to your particular situation;</li>
                        <li>to withdraw the consent to process your Personal Data at any time. Withdrawal of the consent is possible solely in the scope of processing made based on consent. We are authorized to process your Personal Data after withdrawal your consent if we have the legal basis for such processing, for the purposes defined by that legal basis;</li>
                        <li>to lodge a complaint with a supervisory authority, in particular in the EU member state of your habitual residence, place of work or place of the alleged infringement if you consider that the processing of Personal Data relating to you infringes GDPR.</li>
                    </ol>
                    <p className="text-lg text-gray-700">If you wish to execute any of the above-mentioned rights, please email us at caleb@chatdb.ai</p>
                    <h3 className="text-xl my-4 font-semibold text-black">Changes to This Privacy Policy</h3>
                    <p className="text-lg text-gray-700">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating “effective date” at the top of this page, unless another type of notice is required by the applicable law. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. By continuing to use our Service or providing us with Personal Data after we have posted an updated Privacy Policy, or notified you if applicable, you consent to the revised Privacy Policy and practices described in it.</p>
                </section>
            </div>
        </Layout>
    );
};

export default Page;
