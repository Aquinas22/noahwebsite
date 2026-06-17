import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/settings";
import { navLinks } from "@/lib/settings-schema";

export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = getSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <Nav
        siteTitle={s.site_title}
        coffeeUrl={s.coffee_url}
        coffeeLabel={s.coffee_label}
        links={navLinks(s)}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={s} />
    </div>
  );
}
