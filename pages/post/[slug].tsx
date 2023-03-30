import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import Layout from "../../components/Layout";

export async function getStaticPaths() {
  const files = fs.readdirSync("posts");
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(".md", ""),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

// Custom markdown-it plugin
function lazyLoadImages(md) {
  const defaultRender = md.renderer.rules.image;

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    token.attrs.push(["loading", "lazy"]);
    return defaultRender(tokens, idx, options, env, self);
  };
}

export async function getStaticProps({ params: { slug } }) {
  const fileName = fs.readFileSync(`posts/${slug}.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);

  const mdParser = md().use(lazyLoadImages);
  const htmlContent = mdParser.render(content);

  return {
    props: {
      frontmatter,
      htmlContent,
    },
  };
}

export default function PostPage({ frontmatter, htmlContent }) {
  const { title, description } = frontmatter;
  return (
    <Layout>
      <div className="prose-invert prose mx-auto mt-12">
        <div className="mx-10">
          <h1 className="text-center text-5xl text-heading">{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
    </Layout>
  );
}
