import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import Layout from "../../components/Layout";

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
      <div className="m-10 p-4 md:p-0">
        {(posts || []).map(({ slug, frontmatter }, index) => (
          <Link key={index} href={`/post/${slug}`}>
            <div className="card m-auto cursor-pointer">
              <div
                key={slug}
                className={`mb-2 w-full p-2 transform rounded-xl shadow-xl transition hover:scale-105 `}
              >
                <>
                  <div className="card-body text-left">
                    <h2 className="card-title text-2xl text-black font-bold">
                      {frontmatter.title}
                    </h2>
                    <p className="mt-2 text-lg">{frontmatter.description}</p>
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
