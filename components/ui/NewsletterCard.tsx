import Link from "next/link";

export type NewsletterCardProps = {
  date: string;
  title: string;
  description: string;
  href?: string;
};

export default function NewsletterCard({
  date,
  title,
  description,
  href = "/",
}: NewsletterCardProps) {
  return (
    <div className="rounded-md border border-stone-200 bg-stone-50 p-8 shadow-sm dark:border-stone-700 dark:bg-stone-950">
      <div className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">
        {date}
      </div>
      <h3 className="text-xl font-semibold text-stone-950 dark:text-stone-100 mb-3">
        {title}
      </h3>
      <p className="text-stone-600 dark:text-stone-300 text-sm mb-6">
        {description}
      </p>
      <Link
        href={href}
        className="text-sm font-semibold text-orange-600 hover:underline dark:text-orange-400"
      >
        View details →
      </Link>
    </div>
  );
}