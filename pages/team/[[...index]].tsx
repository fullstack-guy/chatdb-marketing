import { OrganizationProfile } from '@clerk/clerk-react'
import Layout from "../../components/Layout";

const OrganizationProfilePage = () => {
    return (
        <Layout>
            <div className="mt-20 flex w-full items-center justify-center">
                <div className="mx-auto">
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <OrganizationProfile path='/team' routing='path' afterLeaveOrganizationUrl='/dashboard' />
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default OrganizationProfilePage