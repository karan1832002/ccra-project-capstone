import "server-only";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsletterById } from "@/app/(admin)/admin/newsletters/actions";
import MarkdownContent from "@/components/ui/MarkdownContent";

// --- Newsletter Article Page ---
// Dynamic route that renders a single newsletter as a full article.
// Fetches the row by the URL slug [id] using Drizzle. If the record
// does not exist, return http 404 via notFound(). The layout uses a
// centered max-width container for comfortable reading.
//
// Published gating is deliberately omitted here — even draft rows
// can be viewed by anyone who has the direct URL, which allows
// admins to preview content before publication.

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewsletterArticlePage({ params }: PageProps) {
  const { id } = await params;
  const newsletter = await getNewsletterById(id);

  if (!newsletter) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* --- Back Navigation --- */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-500 mb-8"
        >
          Back to Home
        </Link>

        {/* --- Article Header --- */}
        <header className="mb-10">
          <time className="text-sm font-semibold text-orange-600">
            {newsletter.date}
          </time>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            {newsletter.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            {newsletter.description}
          </p>
        </header>

        {/* --- Article Body --- */}
        <article className="prose prose-stone max-w-none text-stone-800 prose-headings:text-stone-950 prose-a:text-orange-600 prose-code:text-orange-600 prose-table:border-stone-300 prose-th:bg-stone-100">
          <MarkdownContent content={newsletter.content} />
        </article>

        {/* --- Footer Divider --- */}
        <hr className="mt-12 border-stone-200" />
        <p className="mt-6 text-center text-sm text-stone-400">
          CCRA Newsletter
        </p>
      </div>
    </div>
  );
}