import React from "react";
import Navbar from "../components/Navbar";
import { NextSeo } from "next-seo";
import Link from "next/link";

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  url?: string;
};

const Layout = ({ children, title, description, url }: LayoutProps) => {
  const defaultTitle = "ChatDB | The AI Database Assistant for your team";
  const defaultDescription =
    "The tool that is an expert on your database. Say goodbye to hours spent creating the correct query to get the data you need.";
  const defaultUrl = "https://www.chatdb.ai";

  return (
    <div className="bg-layer-1">
      <NextSeo
        title={title || defaultTitle}
        description={description || defaultDescription}
        openGraph={{
          url: url || defaultUrl,
          title: title || defaultTitle,
          description: description || defaultDescription,
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
              <p>The AI Database Assistant ready to solve your problems.</p>
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
              <Link href="contact-us" className="link-hover link">
                Contact Us
              </Link>
            </div>
            <div>
              <span className="footer-title">Tools</span>
              <Link href="/csv-viewer" className="link-hover link">
                CSV Viewer and Editor
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
