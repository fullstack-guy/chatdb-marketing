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

  // Sort the posts by date, assuming frontmatter has a 'date' field
  posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));

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
      <div className="mb-24 mt-24 text-center text-7xl font-bold text-black">
        Blog
      </div>
      <div className="m-10 p-4 md:p-0">
        {(posts || []).map(({ slug, frontmatter }, index) => (
          <Link key={index} href={`/post/${slug}`}>
            <div
              key={slug}
              className="m-auto mb-4 transform cursor-pointer overflow-hidden rounded-lg border border-purple-600 shadow-lg transition hover:scale-105 hover:border-purple-700" // Applied the purple design styles
            >
              <div className="bg-gradient-to-br from-purple-100 to-white p-6">
                {" "}
                {/* Added gradient */}
                <h2 className="mb-2 text-2xl font-bold text-purple-700">
                  {frontmatter.title}
                </h2>{" "}
                {/* Text color changed to purple */}
                <p className="mt-2 text-lg text-gray-700">
                  {frontmatter.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
