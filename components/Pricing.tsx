import PlanCard from './PlanCard';

export default function Pricing() {
  return (
    <div className="w-full">
      <div className="flex m-auto flex-col items-center p-4">
        <div className="mb-2 mt-12 text-center">
          <h1 className="mb-4 text-7xl font-black text-black">Pricing</h1>
          <p className="text-lg">
            Choose the right pricing for you and get started working on your
            project
          </p>
        </div>
        <div className="flex flex-col gap-8 p-10 xl:flex-row">
          <PlanCard
            color="#78E3FC"
            name="Basic"
            description="Get started with the basic plan"
            features={['1 User', '1 Project', '5 Tables', 'Built with ChatGPT', 'Postgres Connection']}
            btnText="Start Free Plan"
          />
          <PlanCard
            color="#F4D06F"
            name="Pro"
            description="Get more advanced"
            price="29.99"
            features={['1 User', '5 Projects', '50 Tables', 'All Connections', 'Built with GPT4', 'Premium Support']}
            btnText="Become a Pro"
          />
          <PlanCard
            color="#FFB5BA"
            name="Business"
            description="For big teams and businesses"
            price="Contact Us"
            features={[
              'Organization Settings',
              'Unlimited Users',
              'Unlimited Projects',
              'All Connections',
              'Uses GPT4',
              'Premium Support',
              'Custom Feature Requests',
            ]}
            btnText="Contact Us"
          />
        </div>
      </div>
    </div>
  );
}
