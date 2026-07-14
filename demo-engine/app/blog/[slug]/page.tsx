import { BlogPostPage } from "@theme/pages/BlogPage";
import { POSTS } from "@/data/products";

// Static export: every dynamic route must enumerate its pages up front.
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug) || POSTS[0];
  const related = POSTS.filter((p) => p.id !== post.id).slice(0, 3);
  return <BlogPostPage post={post} related={related} />;
}
