export type SaveState = "idle" | "saving" | "saved";

export default function SaveStatus({ state }: { state: SaveState }) {
  if (state === "idle") return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        state === "saving" ? "text-bark/50" : "text-moss-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          state === "saving" ? "animate-pulse bg-bark/40" : "bg-moss-500"
        }`}
      />
      {state === "saving" ? "Saving…" : "Saved"}
    </span>
  );
}
