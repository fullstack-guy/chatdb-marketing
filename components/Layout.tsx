import React from "react";
import Navbar from "../components/Navbar";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Script from "next/script";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { Toaster, toast } from "react-hot-toast";

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  url?: string;
  oggURL?: string;
};

const Layout = ({ children, title, description, url, oggURL }: LayoutProps) => {
  const router = useRouter()
  const subscription = trpc.subscriptions.create.useMutation({
    onSuccess: (data) => {
      toast.success(data.message, {
        duration: 2000
      })
      router.push("/dashboard")
    },
  })

  const createSubscription = async (data) => {
    subscription.mutateAsync({
      customerId: data.customer.id,
      items: data.items
    })
  }
  const defaultTitle = "ChatDB | The AI Database Assistant for your team";
  const defaultDescription =
    "The tool that is an expert on your database. Say goodbye to hours spent creating the correct query to get the data you need.";
  const defaultUrl = "https://www.chatdb.ai";
  const defaultImage = "https://chatdb-assets.s3.amazonaws.com/ogg.png";
  return (
    <div className="bg-layer-1">
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="lazyOnload"
        onLoad={async () => {
          const Paddle = await window.Paddle;
          await Paddle.Environment.set(process.env.NEXT_PUBLIC_PADDLE_ENV);
          await Paddle.Setup({
            seller: 14142,
            eventCallback: async function (event) {
              if (event.name == "checkout.completed") {
                await createSubscription(event.data)
              }
            },
          });
        }
        }
      />
      <NextSeo
        title={title || defaultTitle}
        description={description || defaultDescription}
        canonical={url || defaultUrl}
        openGraph={{
          url: url || defaultUrl,
          title: title || defaultTitle,
          description: description || defaultDescription,
          images: [
            {
              url: oggURL || defaultImage,
              width: 800,
              height: 600,
              alt: "ChatDB",
              type: "image/jpeg",
            },
          ],
          site_name: "ChatDB",
        }}
        twitter={{
          handle: "@calebfahlgren",
          site: "@calebfahlgren",
          cardType: "summary_large_image",
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
              {/* <Link href="/pricing" className="link-hover link">
                Pricing
              </Link> */}
              <Link href="/blog" className="link-hover link">
                Blog
              </Link>
              <Link href="/contact-us" className="link-hover link">
                Contact Us
              </Link>
              <Link href="/terms-and-conditions" className="link-hover link">
                Terms and Conditions
              </Link>
              <Link href="/privacy-policy" className="link-hover link">
                Privacy Policy
              </Link>
            </div>
            <div>
              <span className="footer-title">Free Tools</span>
              <Link href="/tools/csv-editor" className="link-hover link">
                CSV Viewer and Editor
              </Link>
              <Link
                href="/tools/query-csv-with-sql"
                className="link-hover link"
              >
                Query CSV with SQL
              </Link>
              <Link
                href="/tools/csv-to-json-converter"
                className="link-hover link"
              >
                CSV to JSON Converter
              </Link>
              <Link href="/tools/sql-formatter" className="link-hover link">
                SQL Formatter
              </Link>
              <Link href="/tools/csv-to-parquet-converter" className="link-hover link">
                CSV to Parquet Converter
              </Link>
            </div>
          </footer>
        </div>
      </div>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default Layout;
