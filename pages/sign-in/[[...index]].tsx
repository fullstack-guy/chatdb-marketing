import { SignIn } from "@clerk/nextjs";
import Layout from "../../components/Layout";

const SignInPage = () => (
  <Layout>
    <div className="mt-20 flex w-full items-center justify-center">
      <div className="mx-auto">
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </div>
    </div>
  </Layout>
);
export default SignInPage;
