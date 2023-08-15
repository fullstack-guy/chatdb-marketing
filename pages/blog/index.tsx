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
            <div
              key={slug}
              className="border border-purple-600 transform transition hover:scale-105 rounded-lg overflow-hidden shadow-lg hover:border-purple-700 cursor-pointer m-auto mb-4" // Applied the purple design styles
            >
              <div className="bg-gradient-to-br from-purple-100 to-white p-6"> {/* Added gradient */}
                <h2 className="font-bold text-purple-700 text-2xl mb-2">{frontmatter.title}</h2> {/* Text color changed to purple */}
                <p className="text-gray-700 mt-2 text-lg">{frontmatter.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

