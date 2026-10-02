import Navbar, { type NavbarLinkType } from "../common/Navbar";
import Footer from "../common/Footer";
import { useState, useEffect, type SubmitEventHandler } from "react";
import { Link, useParams } from "react-router";
import BookDescription from "./BookDescription";
import useAuth from "../useAuth";
import type { BookType, ReadingStatusType } from "./types";
import type {
  OpenLibraryEditionType,
  OpenLibraryWorkType,
  ProfileResponseType,
  BookReviewType,
} from "@backend/types";

const COVER_URL = "/v1/openLibrary/covers";
const WORK_URL = "/v1/openLibrary/work";
const EDITION_URL = "/v1/openLibrary/edition";
const BOOKS_URL = "/v1/books";

type StatBoxProps = { label: string; value: number };
function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-blue-300 p-2 dark:border-gray-700">
      <p className="text-lg font-bold md:text-xl">{value.toLocaleString()}</p>
      <p className="text-center text-xs font-semibold dark:text-gray-400">
        {label}
      </p>
    </div>
  );
}

type InfoRowProps = { label: string; value: string | number };
function InfoRow({ label, value }: InfoRowProps) {
  return (
    <p className="text-sm font-semibold">
      <span className="font-bold">{label}:</span> {value}
    </p>
  );
}

function BookDetailsSection({ book }: { book: BookType }) {
  return (
    <section className="flex flex-col gap-4">
      <BookDescription book={book} />
      <div className="flex flex-col gap-1">
        <InfoRow label="Pages" value={book.pages} />
        <InfoRow label="First Published" value={book.firstPublished} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatBox label="Reading" value={book.stats.reading} />
        <StatBox label="Read" value={book.stats.read} />
        <StatBox label="Want to Read" value={book.stats.wantToRead} />
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: BookReviewType }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-blue-300 p-2 px-4 dark:border-gray-700">
      <Link to={`/user/${review.user._id}`} className="text-sm font-bold">
        {review.user.username}
      </Link>
      <p className="text-sm">{review.reviewText}</p>
    </div>
  );
}

function ReviewInput({
  workKey,
  onAdded,
}: {
  workKey: string;
  onAdded: (review: BookReviewType) => void;
}) {
  const { authFetch } = useAuth();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await authFetch(`${BOOKS_URL}/${workKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewText: trimmed }),
      });
      if (res.status === 409) {
        setError("You have already reviewed this book.");
        return;
      }
      if (res.status !== 201)
        throw new Error(`Add review failed with status ${res.status}`);
      const review: BookReviewType = await res.json();
      onAdded(review);
      setText("");
    } catch (err) {
      console.error(err);
      setError("Could not add your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
      <textarea
        className="min-h-24 resize-none rounded-xl border border-blue-300 p-2 px-4 text-sm font-semibold outline-0 focus:border-blue-100 dark:border-gray-700 focus:dark:border-gray-500"
        name="review-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your review"
      />
      {error && (
        <p className="text-center text-sm font-bold text-red-300">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting || !text.trim()}
        className="rounded-full border border-blue-300 bg-white p-2 text-sm font-bold text-blue-500 transition disabled:opacity-50 dark:border-gray-700 dark:text-black [&:active:not(:disabled),&:hover:not(:disabled)]:-translate-y-1"
      >
        {submitting ? "Posting..." : "Add Review"}
      </button>
    </form>
  );
}

function BookCommunitySection({ workKey }: { workKey: string }) {
  const { userId } = useAuth();
  const [reviews, setReviews] = useState<BookReviewType[]>([]);
  useEffect(() => {
    let cancelled = false;
    async function loadReviews() {
      try {
        const res = await fetch(`${BOOKS_URL}/${workKey}`, {
          cache: "no-store",
        });
        if (res.status !== 200)
          throw new Error(`Reviews failed with status ${res.status}`);
        const json: BookReviewType[] = await res.json();
        if (!cancelled) setReviews(json);
      } catch (err) {
        console.error(err);
        if (!cancelled) setReviews([]);
      }
    }
    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [workKey]);
  const hasReviewed = !!userId && reviews.some((r) => r.user._id === userId);

  return (
    <section className="flex flex-col gap-6 border-t border-blue-300 pt-6 dark:border-gray-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold md:text-xl">Reviews</h2>
        {reviews.length === 0 && (
          <p className="text-sm font-semibold dark:text-gray-400">
            No reviews yet
          </p>
        )}
        {reviews.map((review) => (
          <ReviewCard key={review.user._id} review={review} />
        ))}
        {userId && !hasReviewed && (
          <ReviewInput
            workKey={workKey}
            onAdded={(review) => setReviews((current) => [review, ...current])}
          />
        )}
        {!userId && (
          <p className="mt-2 text-center text-gray-200 dark:text-gray-300">
            <Link className="font-semibold text-white" to="/login">
              Log in
            </Link>{" "}
            to add your own review
          </p>
        )}
      </div>
    </section>
  );
}

const statusOptions: ReadingStatusType[] = ["reading", "read", "wantToRead"];
const statusLabels: Record<ReadingStatusType, string> = {
  reading: "Reading",
  read: "Read",
  wantToRead: "Want to Read",
};
const READ_STATUS_MAP: Record<ReadingStatusType, string> = {
  reading: "reading",
  read: "read",
  wantToRead: "planning",
};
const STATUS_FROM_BACKEND: Record<string, ReadingStatusType> = {
  reading: "reading",
  read: "read",
  planning: "wantToRead",
};

function CoverImage() {
  const { editionKey } = useParams();
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const src = `${COVER_URL}/${editionKey}?size=L`;
  console.log(src);

  if (!editionKey || failedKey === editionKey)
    return (
      <div className="aspect-2/3 w-full rounded-xl bg-blue-500 text-blue-500 dark:bg-gray-600 dark:text-black"></div>
    );
  return (
    <img
      className="aspect-2/3 w-full rounded-xl object-cover"
      src={src}
      alt="Book cover"
      onError={() => setFailedKey(editionKey)}
    />
  );
}

type ReadingStatusToggleProps = {
  status: ReadingStatusType | null;
  onChange: (status: ReadingStatusType | null) => void;
};
function ReadingStatusToggle({ status, onChange }: ReadingStatusToggleProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-1 lg:grid-cols-3">
      {statusOptions.map((option) => (
        <button
          key={option}
          type="button"
          className={`rounded-full border p-2 text-xs font-bold transition md:text-sm [&:active,&:hover]:-translate-y-1 ${
            status === option
              ? "border-white bg-white text-blue-500 dark:text-black"
              : "border-blue-300 dark:border-gray-700"
          }`}
          onClick={() => onChange(status === option ? null : option)}
        >
          {statusLabels[option]}
        </button>
      ))}
    </div>
  );
}

type BookSidePanelProps = { isLoggedIn: boolean; book: BookType | null };
function BookSidePanel({ isLoggedIn, book }: BookSidePanelProps) {
  const { userId, authFetch } = useAuth();
  const [status, setStatus] = useState<ReadingStatusType | null>(null);
  const editionKey = book?.editionKey;
  useEffect(() => {
    if (!userId || !editionKey) {
      return;
    }
    let cancelled = false;
    async function loadStatus() {
      try {
        const res = await fetch(`/v1/users/${userId}`, { cache: "no-store" });
        if (res.status !== 200)
          throw new Error(`Profile failed with status ${res.status}`);
        const profile: ProfileResponseType = await res.json();
        const entry = profile.books.find(
          (b) => b.book.editionKey === editionKey,
        );
        if (!cancelled)
          setStatus(
            entry ? (STATUS_FROM_BACKEND[entry.readStatus] ?? null) : null,
          );
      } catch (err) {
        console.error(err);
        if (!cancelled) setStatus(null);
      }
    }
    loadStatus();
    return () => {
      cancelled = true;
    };
  }, [userId, editionKey]);
  async function saveBook(
    newStatus: ReadingStatusType,
    previous: ReadingStatusType | null,
  ) {
    if (!userId || !book) return;
    try {
      const res = await authFetch(`/v1/users/${userId}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          books: [
            {
              title: book.title,
              author: book.author,
              authorKey: book.author,
              workKey: book.workKey,
              editionKey: book.editionKey,
            },
          ],
          readStatus: READ_STATUS_MAP[newStatus],
        }),
      });
      if (res.status !== 200)
        throw new Error(`Add book failed with status ${res.status}`);
    } catch (err) {
      console.error(err);
      setStatus(previous);
    }
  }
  function handleStatusChange(newStatus: ReadingStatusType | null) {
    const previous = status;
    setStatus(newStatus);
    if (newStatus) saveBook(newStatus, previous);
  }

  return (
    <aside className="flex flex-col gap-4 rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-700/40 md:self-start dark:bg-black dark:shadow-black/60">
      <CoverImage />
      {isLoggedIn && (
        <ReadingStatusToggle status={status} onChange={handleStatusChange} />
      )}
    </aside>
  );
}

const dummyStats = { reading: 1204, read: 58320, wantToRead: 20418 };

function toBookType(
  work: OpenLibraryWorkType,
  edition: OpenLibraryEditionType,
  workKey: string,
  editionKey: string,
): BookType {
  return {
    title: work.title,
    workKey,
    editionKey,
    author: work.author ?? "",
    description: work.description ?? "",
    genres: (work.subjects ?? []).slice(0, 8),
    pages: edition.number_of_pages ?? 0,
    firstPublished: edition.publish_date ?? "No Print",
    stats: dummyStats,
  };
}

export default function BookPage() {
  const { userId } = useAuth();
  const navbarLinks: NavbarLinkType[] = [
    userId ? null : { label: "Home", href: "/" },
    userId
      ? { label: "Profile", href: `/user/${userId}` }
      : { label: "Sign In", href: "/login" },
    { label: "Books", href: "/books" },
    userId ? { label: "Groups", href: "/groups" } : null,
  ];
  const isLoggedIn = !!userId;
  const { workKey, editionKey } = useParams();
  const [book, setBook] = useState<BookType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!workKey) return;
    let cancelled = false;
    async function loadBook() {
      try {
        const resWork = await fetch(`${WORK_URL}/${workKey}`);
        if (resWork.status !== 200)
          throw new Error(`Work failed with status ${resWork.status}`);
        const work: OpenLibraryWorkType = await resWork.json();
        const resEdition = await fetch(`${EDITION_URL}/${editionKey}`);
        if (resEdition.status !== 200)
          throw new Error(`Work failed with status ${resEdition.status}`);
        const edition: OpenLibraryEditionType = await resEdition.json();
        if (!cancelled)
          setBook(toBookType(work, edition, workKey!, editionKey!));
      } catch (err) {
        console.error(err);
        if (!cancelled) setBook(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadBook();
    return () => {
      cancelled = true;
    };
  }, [workKey, editionKey]);

  return (
    <div className="font-jetbrains-mono flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700">
      <Navbar links={navbarLinks} />
      {isLoading ? (
        <div className="m-auto flex items-center gap-4 text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          Loading Results
        </div>
      ) : (
        <main className="container mx-auto mt-16 mb-24 grid grid-cols-1 gap-4 p-4 sm:mt-4 sm:gap-2 sm:p-0 md:grid-cols-[1fr_2fr] lg:gap-4">
          <BookSidePanel isLoggedIn={isLoggedIn} book={book} />
          <div className="flex flex-col gap-6 rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-700/40 md:self-start dark:bg-black dark:shadow-black/60">
            {book ? (
              <>
                <BookDetailsSection book={book} />
                <BookCommunitySection workKey={book?.workKey} />
              </>
            ) : (
              <p className="text-sm font-bold">Book not found</p>
            )}
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}
