import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>My Blog</title>
      </Head>
      <main>
        <h1>My Blog</h1>
        <ul className="blog-list">
          {posts.map((post) => (
            <li key={post.slug} className="blog-post">
              <Link href={`/posts/${post.slug}`}>
                <h2>{post.frontmatter.title}</h2>
              </Link>
              <p className="blog-excerpt">{post.excerpt}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContents);
    const slug = filename.replace(/\.md$/, '');
    const excerpt = content.substring(0, 200) + '...';

    return {
      slug,
      frontmatter,
      excerpt,
    };
  });

  return {
    props: {
      posts,
    },
  };
}
