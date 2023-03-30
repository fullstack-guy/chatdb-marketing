import { UserProfile } from "@clerk/nextjs";
import Layout from "../../components/Layout";

const UserProfilePage = () => (
    <Layout>
        <div className="w-full flex items-center justify-center">
            <div className="mx-auto">
                <UserProfile path="/profile" routing="path" />
            </div>
        </div>
    </Layout>
);

export default UserProfilePage;
