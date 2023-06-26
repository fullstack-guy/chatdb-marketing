import { CreateOrganization } from "@clerk/clerk-react";
import Layout from "../../components/Layout";

const CreateOrganizationPage = () => {
  return (
    <Layout>
      <div className="mt-20 flex w-full items-center justify-center">
        <div className="mx-auto">
          <CreateOrganization
            path="/create-team"
            routing="path"
            afterCreateOrganizationUrl="/team"
          />
        </div>
      </div>
    </Layout>
  );
};

export default CreateOrganizationPage;
