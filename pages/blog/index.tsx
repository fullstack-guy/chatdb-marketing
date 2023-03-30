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
        <Layout>
            <div className="text-center text-5xl font-bold text-heading">
                ChatDB Blog
            </div>
            <div className="m-10 grid grid-cols-1 p-4 2xl:grid-cols-3 md:p-0 5xl:grid-cols-4">
                {(posts || []).map(({ slug, frontmatter }, index) => (
                    <Link key={index} href={`/post/${slug}`}>
                        <div className="m-auto cursor-pointer">
                            <div
                                key={slug}
                                className="card mx-auto mb-8 w-full rounded-lg bg-[#323457] p-4 shadow-xl md:w-96"
                            >
                                <>
                                    <figure className="w-full pt-6 pb-4">
                                        <img
                                            src={`/${frontmatter.image}`}
                                            className="h-48 w-full rounded-xl object-cover"
                                        />
                                    </figure>
                                    <div className="card-body flex items-center justify-center text-center">
                                        <h2 className="card-title text-xl font-bold text-white">
                                            {frontmatter.title}
                                        </h2>
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
