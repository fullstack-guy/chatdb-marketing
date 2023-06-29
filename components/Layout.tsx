import React from "react";
import Navbar from "../components/Navbar";
import { NextSeo } from "next-seo";
import Link from "next/link";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-layer-1">
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
      <div className="mx-auto h-full max-w-7xl bg-layer-1">
        <div className="mx-5 xl:mx-0">
          <Navbar />
          <main className="main-content min-h-[calc(100vh-100px)] flex-grow bg-layer-1">
            {children}
          </main>
          <footer className="footer p-10 text-base-content">
            <div>
              <p className="text-xl font-bold">ChatDB</p>
              <p>The tool you needed for your database!</p>
            </div>
            <div>
              <span className="footer-title">Company</span>
              <Link href="/" className="link-hover link">
                Home
              </Link>
              <Link href="pricing" className="link-hover link">
                Pricing
              </Link>
              <Link href="blog" className="link-hover link">
                Blog
              </Link>
            </div>
            {/* <div>
              <span className="footer-title">Legal</span>
              <a className="link link-hover">Terms of use</a>
              <a className="link link-hover">Privacy policy</a>
              <a className="link link-hover">Cookie policy</a>
            </div> */}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
