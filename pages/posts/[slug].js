import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Head from 'next/head';

export default function PostPage({ frontmatter, content }) {
  return (
    <>
      <Head>
        <title>{frontmatter.title}</title>
      </Head>
      <main>
        <h1>{frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames.map((filename) => ({
    params: {
      slug: filename.replace(/\.md$/, ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content: markdownContent } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(markdownContent);
  const content = processedContent.toString();

  return {
    props: {
      frontmatter,
      content,
    },
  };
}
