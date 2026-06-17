import { redirect } from "next/navigation";
import Link from "next/link";
import { checkPassword, createSession, isAuthed } from "@/lib/auth";

export const metadata = { title: "Sign in" };

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") || "");
  if (!checkPassword(password)) {
    redirect("/login?error=1");
  }
  await createSession();
  redirect("/admin");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthed()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand/50 px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center font-serif text-2xl font-semibold text-ink">
          Noah Roe
        </Link>
        <div className="card mt-6 p-8">
          <h1 className="font-serif text-2xl font-semibold text-ink">Admin sign in</h1>
          <p className="mt-1 text-sm text-bark/60">Enter your password to manage the site.</p>
          {error && (
            <p className="mt-4 rounded-lg bg-clay-500/10 px-3 py-2 text-sm text-clay-600">
              Incorrect password. Try again.
            </p>
          )}
          <form action={login} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoFocus
                required
                className="field"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-primary w-full">Sign in</button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-bark/45">
          <Link href="/" className="hover:text-moss-600">← Back to site</Link>
        </p>
      </div>
    </div>
  );
}
