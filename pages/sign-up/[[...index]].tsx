import { SignUp } from "@clerk/nextjs";
import Layout from "../../components/Layout";

const SignUpPage = () => (
    <Layout>
        <div className="w-full mt-20 flex items-center justify-center">
            <div className="mx-auto">
                <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
            </div>
        </div>
    </Layout>
);
export default SignUpPage;

