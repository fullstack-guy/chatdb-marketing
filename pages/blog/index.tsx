import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import Layout from "../../components/Layout";
import Image from "next/image";

export async function getStaticProps() {
  const files = fs.readdirSync("posts");

  const posts = files.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const readFile = fs.readFileSync(`posts/${fileName}`, "utf-8");
    const { data: frontmatter } = matter(readFile);
    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
}

export default function Page({ posts }) {
  return (
    <Layout
      title="ChatDB Blog | Database insights and more"
      description="Stay up-to-date with the latest news, insights, and tips about databases, AI technology, and ChatDB features from our blog."
      url="https://www.chatdb.ai/blog"
    >
      <div className="mt-24 text-center text-7xl font-bold text-black">
        Blog
      </div>
      <div className="5xl:grid-cols-4 m-10 grid grid-cols-1 p-4 md:p-0 2xl:grid-cols-3">
        {(posts || []).map(({ slug, frontmatter }, index) => (
          <Link key={index} href={`/post/${slug}`}>
            <div className="m-auto cursor-pointer">
              <div
                key={slug}
                className="card mx-auto mb-8 w-full transform rounded-xl bg-[#323457] p-0 shadow-xl transition hover:scale-105 md:w-96 lg:p-4"
              >
                <>
                  <figure className="w-full p-6">
                    <Image
                      src={`/${frontmatter.image}`}
                      width={300}
                      height={150}
                      alt="blog image"
                      className="rounded-sm object-cover"
                    />
                  </figure>
                  <div className="card-body flex items-center justify-center text-center">
                    <h2 className="text-md card-title font-bold text-white xl:text-2xl">
                      {frontmatter.title}
                    </h2>
                    <p className="mt-2 text-sm text-white">
                      {frontmatter.description}
                    </p>
                  </div>
                </>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
