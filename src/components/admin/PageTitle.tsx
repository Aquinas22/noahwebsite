import Link from "next/link";

export default function PageTitle({
  title,
  action,
  back,
}: {
  title: string;
  action?: { href: string; label: string };
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="text-sm font-medium text-moss-600 hover:text-moss-700">
          ← {back.label}
        </Link>
      )}
      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold text-ink">{title}</h1>
        {action && (
          <Link href={action.href} className="btn-primary">
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
