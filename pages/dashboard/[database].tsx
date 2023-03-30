import Layout from "../../components/Layout";


export const customers = [
    {
        email: "nicholas.turner@gmail.com",
        slug: "nicholasturner",
        name: "Nicholas Turner",
        tier: "starter",
        avatar: "/assets/avatars/nicholas-turner.png",
        paymentMethod: { type: "visa", last4: "4479" },
        totalSpend: 69000,
        refund: 2000,
    },
    {
        email: "cedric.green@gmail.com",
        slug: "cedricgreen",
        name: "Cedric Green",
        tier: "business",
        avatar: "/assets/avatars/cedric-green.png",
        paymentMethod: { type: "mastercard", last4: "5236" },
        totalSpend: 248000,
        refund: 0,
    },
    {
        email: "dianne.russell@gmail.com",
        slug: "diannerussell",
        name: "Dianne Russell",
        tier: "enterprise",
        avatar: "/assets/avatars/dianne-russell.png",
        paymentMethod: { type: "visa", last4: "1267" },
        totalSpend: 1290000,
        refund: 0,
    },
    {
        email: "randy.warren@gmail.com",
        slug: "randywarren",
        name: "Randy Warren",
        tier: "starter",
        avatar: "/assets/avatars/randy-warren.png",
        paymentMethod: { type: "mastercard", last4: "9941" },
        totalSpend: 4500,
        refund: 0,
    },
    {
        email: "saul.tran@gmail.com",
        slug: "saultran",
        name: "Saul Tran",
        tier: "business",
        avatar: "/assets/avatars/saul-tran.png",
        paymentMethod: { type: "mastercard", last4: "4721" },
        totalSpend: 80000,
        refund: 0,
    },
    {
        email: "irina.zaytesev@gmail.com",
        slug: "irinazaytesev",
        name: "Irina Zaytesev",
        tier: "business",
        avatar: "/assets/avatars/irina-zaytesev.png",
        paymentMethod: { type: "visa", last4: "5321" },
        totalSpend: 120000,
        refund: 0,
    },
    {
        email: "pasquale.blanco@gmail.com",
        slug: "pasqualeblanco",
        name: "Pasquale Blanco",
        tier: "starter",
        avatar: "/assets/avatars/pasquale-blanco.png",
        paymentMethod: { type: "mastercard", last4: "8321" },
        totalSpend: 3000,
        refund: 0,
    },
    {
        email: "valentin.burger@gmail.com",
        slug: "valentinburger",
        name: "Valentin Burger",
        tier: "business",
        avatar: "/assets/avatars/valentin-burger.png",
        paymentMethod: { type: "visa", last4: "0257" },
        totalSpend: 15000,
        refund: 0,
    },
    {
        email: "kathryn.murphy@gmail.com",
        slug: "kathrynmurphy",
        name: "Kathryn Murphy",
        tier: "enterprise",
        avatar: "/assets/avatars/kathryn-murphy.png",
        paymentMethod: { type: "visa", last4: "1690" },
        totalSpend: 550000,
        refund: 0,
    },
    {
        email: "arlene.mccoy@gmail.com",
        slug: "arlenemccoy",
        name: "Arlene McCoy",
        tier: "starter",
        avatar: "/assets/avatars/arlene-mccoy.png",
        paymentMethod: { type: "mastercard", last4: "9257" },
        totalSpend: 10000,
        refund: 5000,
    },
];

const currencyFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
});

const paymentMethodThumbnailImageMapper = {
    visa: "/assets/payment-methods/visa-thumbnail.png",
    mastercard: "/assets/payment-methods/mastercard-thumbnail.png",
};

const tierColorMapper = {
    starter: "text-blue-800 dark:text-blue-600 bg-blue-200 border-blue-200",
    business: "text-cyan-800 dark:text-cyan-600 bg-cyan-200 border-cyan-200",
    enterprise:
        "text-indigo-800 dark:text-indigo-600 bg-indigo-200 border-indigo-200",
};

export default function Page() {
    return (
        <Layout>
            <div className="h-full w-full overflow-x-auto rounded-xl bg-layer-2 px-11 py-6 scrollbar">
                <table className="w-full divide-y divide-muted-1">
                    <thead className="text-xs font-semibold uppercase text-text">
                        <tr>
                            <th className="whitespace-nowrap bg-layer-2 py-3 px-4 text-left font-semibold text-text">
                                Name
                            </th>
                            <th className="sr-only">Tier</th>
                            <th className="whitespace-nowrap bg-layer-2 py-3 px-4 text-left font-semibold text-text">
                                Email
                            </th>
                            <th className="whitespace-nowrap bg-layer-2 py-3 px-4 text-left font-semibold text-text">
                                Payment Method
                            </th>
                            <th className="whitespace-nowrap bg-layer-2 py-3 px-4 text-left font-semibold text-text">
                                Total Spend
                            </th>
                            <th className="whitespace-nowrap bg-layer-2 py-3 px-4 text-left font-semibold text-text">
                                Refunds
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-muted-1 text-sm font-medium">
                        {customers.map((customer, index) => {
                            return (
                                <tr key={customer.email}>
                                    <td className="whitespace-nowrap bg-layer-2 py-3 px-4 text-heading">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img
                                                    src={customer.avatar}
                                                    alt="avatar"
                                                    className="inline-block w-full flex-shrink-0 rounded-full"
                                                />
                                            </div>
                                            <span>{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap bg-layer-2 py-3 px-4 text-heading">
                                        <span
                                            className={`${tierColorMapper[customer.tier]
                                                } inline-flex items-center rounded-full border-2 px-2 py-0.5 text-xs font-semibold capitalize shadow-sm`}
                                        >
                                            {customer.tier}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap bg-layer-2 py-3 px-4 text-heading">
                                        {customer.email}
                                    </td>
                                    <td className="whitespace-nowrap bg-layer-2 py-3 px-4 text-heading">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 flex-shrink-0">
                                                <img
                                                    src={
                                                        paymentMethodThumbnailImageMapper[
                                                        customer.paymentMethod.type
                                                        ]
                                                    }
                                                    alt={`${customer.paymentMethod.type} logo`}
                                                />
                                            </div>
                                            <span>•••• {customer.paymentMethod.last4}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap bg-layer-2 py-3 px-4 text-heading">
                                        {currencyFormatter.format(customer.totalSpend / 100)}
                                    </td>
                                    <td className="whitespace-nowrap bg-layer-2 py-3 px-4 text-heading">
                                        {currencyFormatter.format(customer.refund / 100)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}