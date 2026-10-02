import useAuth from "../useAuth";
import { useState } from "react";
import type { SubmitEventHandler } from "react";

const GROUPS_URL = "/v1/groups";

export function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const { authFetch } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await authFetch(GROUPS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });
      if (res.status !== 201)
        throw new Error(`Create group failed with status ${res.status}`);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Could not create the group. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex w-full max-w-120 flex-col gap-4 rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-700/40 dark:bg-black dark:shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold md:text-xl">Create Group</h2>
          <button
            type="button"
            aria-label="Close"
            className="aspect-square rounded-full border border-blue-300 px-3 py-1 text-xl font-bold dark:border-gray-700 [&:active,&:hover]:border-transparent [&:active,&:hover]:bg-red-500"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="rounded-lg border border-blue-300 p-2 px-4 text-sm font-semibold outline-0 focus:border-blue-100 dark:border-gray-700 focus:dark:border-gray-500"
            name="group-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Group name"
            autoFocus
          />
          <textarea
            className="min-h-24 resize-none rounded-xl border border-blue-300 p-2 px-4 text-sm font-semibold outline-0 focus:border-blue-100 dark:border-gray-700 focus:dark:border-gray-500"
            name="group-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this group about?"
          />
          {error && (
            <p className="text-center text-sm font-bold text-red-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || !name.trim() || !description.trim()}
            className="w-full rounded-full border border-blue-300 bg-white p-2 text-sm font-bold text-blue-500 transition disabled:opacity-50 md:text-base dark:border-gray-700 dark:text-black [&:active:not(:disabled),&:hover:not(:disabled)]:-translate-y-1"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
