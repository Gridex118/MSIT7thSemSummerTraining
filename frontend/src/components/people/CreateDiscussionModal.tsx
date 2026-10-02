import useAuth from "../useAuth";
import { useEffect, useState } from "react";
import type { SubmitEventHandler } from "react";

const BOOKS_URL = "/v1/books";

type SimpleBookType = {
  _id: string;
  title: string;
  workKey: string;
  editionKey: string;
};

export function CreateDiscussionModal({
  groupId,
  onClose,
}: {
  groupId: string;
  onClose: () => void;
}) {
  const { authFetch } = useAuth();
  const [title, setTitle] = useState("");
  const [bookId, setBookId] = useState("");
  const [books, setBooks] = useState<SimpleBookType[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadBooks = async () => {
      try {
        const res = await fetch(BOOKS_URL);
        if (!res.ok)
          throw new Error(`Fetch books failed with status ${res.status}`);
        const data: SimpleBookType[] = await res.json();
        if (!cancelled) setBooks(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Could not load books. Please try again.");
      } finally {
        if (!cancelled) setLoadingBooks(false);
      }
    };

    loadBooks();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault();
    const selected = books.find((b) => b._id === bookId);
    if (!selected) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await authFetch(`/v1/groups/${groupId}/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          book: {
            title: selected.title,
            workKey: selected.workKey,
            editionKey: selected.editionKey,
          },
        }),
      });
      if (res.status !== 201)
        throw new Error(`Create discussion failed with status ${res.status}`);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Could not create the discussion. Please try again.");
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
          <h2 className="text-lg font-bold md:text-xl">Create Discussion</h2>
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
            name="discussion-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Discussion title"
            autoFocus
          />
          <select
            className="rounded-lg border border-blue-300 bg-blue-600 p-2 px-4 text-sm font-semibold outline-0 focus:border-blue-100 disabled:opacity-50 dark:border-gray-700 dark:bg-black focus:dark:border-gray-500"
            name="discussion-book"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            disabled={loadingBooks}
          >
            <option value="" disabled>
              {loadingBooks ? "Loading books..." : "Select a book"}
            </option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title}
              </option>
            ))}
          </select>
          {error && (
            <p className="text-center text-sm font-bold text-red-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || !title.trim() || !bookId}
            className="w-full rounded-full border border-blue-300 bg-white p-2 text-sm font-bold text-blue-500 transition disabled:opacity-50 md:text-base dark:border-gray-700 dark:text-black [&:active:not(:disabled),&:hover:not(:disabled)]:-translate-y-1"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
