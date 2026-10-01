import type { CommentType } from "./types";
import { useEffect, useState } from "react";
import type { ChatType } from "@backend/types";

function toCommentType(chat: ChatType): CommentType {
  return {
    id: chat._id,
    user: chat.sender.username,
    message: chat.content,
    date: chat.sentAt,
  };
}

function CommentAvatar() {
  return (
    <div className="row-span-2 aspect-square w-10 rounded-full bg-blue-500 dark:bg-gray-600"></div>
  );
}

function CommentCard({ comment }: { comment: CommentType }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-xl border border-blue-300 p-4 dark:border-gray-700">
      <CommentAvatar />
      <div className="flex items-baseline gap-2">
        <p className="text-sm font-bold">{comment.user}</p>
        <p className="text-xs font-semibold dark:text-gray-400">
          {comment.date}
        </p>
      </div>
      <p className="text-sm">{comment.message}</p>
    </div>
  );
}

type DiscussionModalProps = {
  discussionId: string;
  onClose: () => void;
  onSend: (message: string) => void;
};

function CommentInput({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");

  return (
    <form
      className="flex flex-col gap-x-4 gap-y-2 md:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = message.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setMessage("");
      }}
    >
      <input
        className="min-w-0 flex-1 rounded-full border border-blue-300 px-4 py-3 text-sm font-semibold outline-0 focus:border-blue-100 dark:border-gray-700 focus:dark:border-gray-500"
        name="comment-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a comment"
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="rounded-full border border-blue-300 bg-white px-8 py-3 text-sm font-bold text-blue-500 transition disabled:opacity-50 dark:border-gray-700 dark:text-black [&:active:not(:disabled),&:hover:not(:disabled)]:-translate-y-1"
      >
        Send
      </button>
    </form>
  );
}

export function DiscussionModal({
  discussionId,
  onClose,
  onSend,
}: DiscussionModalProps) {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;

    const loadChats = async () => {
      try {
        const res = await fetch(`/v1/discussions/${discussionId}/chats`);
        if (!res.ok)
          throw new Error(`Fetch chats failed with status ${res.status}`);
        const data: ChatType[] = await res.json();
        if (!cancelled) setChats(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Could not load the chat. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadChats();
    return () => {
      cancelled = true;
    };
  }, [discussionId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[80vh] w-full max-w-200 flex-col gap-4 rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-700/40 dark:bg-black dark:shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold md:text-xl">Discussion</h2>
          <button
            type="button"
            aria-label="Close"
            className="grid place-items-center rounded-full border border-blue-300 px-3 py-1 text-xl font-bold dark:border-gray-700 [&:active,&:hover]:border-transparent [&:active,&:hover]:bg-red-500"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <section className="flex flex-col gap-4 overflow-y-auto">
          {loading && (
            <p className="text-center text-sm font-semibold dark:text-gray-400">
              Loading...
            </p>
          )}
          {error && (
            <p className="text-center text-sm font-bold text-red-300">
              {error}
            </p>
          )}
          {!loading && !error && chats.length === 0 && (
            <p className="text-center text-sm font-semibold dark:text-gray-400">
              No messages yet. Start the conversation.
            </p>
          )}
          {chats.map((chat) => (
            <CommentCard key={chat._id} comment={toCommentType(chat)} />
          ))}
        </section>
        <CommentInput onSend={onSend} />
      </div>
    </div>
  );
}
