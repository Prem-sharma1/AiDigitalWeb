export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  return {
    alternates: {
      canonical: `/blog/${resolvedParams.slug}`,
    },
  };
}

export default function BlogSlugLayout({ children }) {
  return children;
}
