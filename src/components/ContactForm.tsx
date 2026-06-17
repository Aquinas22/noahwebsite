"use client";

import { useActionState } from "react";
import { submitMessage, type ContactState } from "@/app/admin/actions";

const initial: ContactState = { ok: false };

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitMessage, initial);

  if (state.ok) {
    return (
      <div className="card flex flex-col items-center gap-2 p-10 text-center">
        <p className="font-serif text-2xl font-semibold text-ink">Thanks — message sent! ✉️</p>
        <p className="text-sm text-bark/60">I&apos;ll get back to you as soon as I can.</p>
      </div>
    );
  }

  return (
    <form action={action} className="card space-y-5 p-6">
      {/* Honeypot — hidden from humans, catches bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" name="name" required className="field" placeholder="Your name" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="field" placeholder="you@example.com" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="subject">Subject</label>
        <input id="subject" name="subject" className="field" placeholder="What's this about? (optional)" />
      </div>

      <div>
        <label className="label" htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={6} required className="field" placeholder="Tell me a little about what you have in mind…" />
      </div>

      {state.error && (
        <p className="rounded-lg bg-clay-500/10 px-4 py-2.5 text-sm text-clay-600">{state.error}</p>
      )}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
