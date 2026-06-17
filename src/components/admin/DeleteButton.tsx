"use client";

export default function DeleteButton({
  action,
  id,
  label = "Delete",
  confirmText = "Are you sure? This can't be undone.",
}: {
  action: (formData: FormData) => void;
  id: number;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm font-medium text-clay-600 hover:text-clay-500"
      >
        {label}
      </button>
    </form>
  );
}
