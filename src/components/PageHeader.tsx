export default function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="container-page pt-16 pb-10 sm:pt-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
        {title}
      </h1>
      {intro && (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-bark/70">
          {intro}
        </p>
      )}
    </div>
  );
}
