import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink">
        This page wandered off the farm
      </h1>
      <p className="mt-3 text-bark/65">
        We couldn&apos;t find what you were looking for.
      </p>
      <Link href="/" className="btn-primary mt-6">Back home</Link>
    </div>
  );
}
