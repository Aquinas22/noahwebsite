import { getMessages } from "@/lib/content";
import { markMessageRead, deleteMessage } from "../actions";
import PageTitle from "@/components/admin/PageTitle";
import DeleteButton from "@/components/admin/DeleteButton";

function fmtDate(s: string) {
  return new Date(s.replace(" ", "T") + "Z").toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminMessagesPage() {
  const messages = getMessages();

  return (
    <div>
      <PageTitle title="Messages" />

      {messages.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
          <p className="font-serif text-xl font-semibold text-ink">No messages yet</p>
          <p className="text-sm text-bark/60">Submissions from your contact form will show up here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`card p-5 ${m.read ? "" : "border-moss-300 bg-moss-50/40"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-lg font-semibold text-ink">
                    {!m.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-moss-500 align-middle" />}
                    {m.name}
                  </p>
                  <a href={`mailto:${m.email}`} className="text-sm text-moss-600 hover:text-moss-700">
                    {m.email}
                  </a>
                  {m.subject && <p className="mt-1 text-sm font-medium text-bark/80">{m.subject}</p>}
                </div>
                <p className="text-xs text-bark/45">{fmtDate(m.created_at)}</p>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-bark/80">{m.body}</p>

              <div className="mt-4 flex items-center gap-3 border-t border-bark/10 pt-3">
                <form action={markMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  {!m.read && <input type="hidden" name="read" value="1" />}
                  <button className="text-sm font-medium text-moss-600 hover:text-moss-700">
                    {m.read ? "Mark unread" : "Mark read"}
                  </button>
                </form>
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "your message"))}`} className="text-sm font-medium text-moss-600 hover:text-moss-700">
                  Reply
                </a>
                <span className="flex-1" />
                <DeleteButton action={deleteMessage} id={m.id} label="Delete" confirmText={`Delete message from ${m.name}?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
