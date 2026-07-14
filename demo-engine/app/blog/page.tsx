import BlogPage from "@theme/pages/BlogPage";
import { POSTS } from "@/data/products";

export default function Page() {
  return <BlogPage posts={POSTS} />;
}
