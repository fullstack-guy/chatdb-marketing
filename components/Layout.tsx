import React from 'react';
import Navbar from "../components/Navbar";
import { NextSeo } from 'next-seo';
import { Analytics } from "@vercel/analytics/react";

type LayoutProps = {
    children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <NextSeo
                title="ChatDB | The AI Database Assistant for your team"
                description="The tool that is an expert on your database. Say goodbye to hours
        spent creating the correct query to get the data you need."
                openGraph={{
                    url: "https://www.chatdb.ai",
                    title: "ChatDB.ai | The AI Database Assistant for your team",
                    description:
                        "The tool that is an expert on your database. Say goodbye to hours spent creating the correct query to get the data you need",
                    images: [
                        {
                            url: "https://chatdb-assets.s3.amazonaws.com/ogg.png",
                            width: 800,
                            height: 600,
                            alt: "ChatDB",
                            type: "image/jpeg",
                        },
                    ],
                    siteName: "ChatDB",
                }}
                additionalLinkTags={[
                    {
                        rel: "icon",
                        href: "https://chatdb-assets.s3.amazonaws.com/favicon.ico",
                    },
                ]}
            />
            <div className='h-full'>
                <Navbar />
                <main className="main-content">{children}</main>
            </div>
            <Analytics />
        </>

    )
}

export default Layout;
