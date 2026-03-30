// app/blog/[slug]/page.jsx
// Purpose: Individual blog post route — ready for MDX content.
//   Currently redirects to /blog since no posts exist yet.
//   When adding posts: export an array from lib/posts.js and import MDX files.
// Key exports: default BlogPostPage

import { redirect } from 'next/navigation';

export default function BlogPostPage({ params }) {
  // No posts yet — redirect to blog index
  redirect('/blog');
}
