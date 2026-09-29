import Navbar, { type NavbarLinkType } from "../common/Navbar";
import Footer from "../common/Footer";
import { useState } from "react";
import { Link } from "react-router";
import BookDescription from "./BookDescription";
import type {
  BookType,
  BookCommunityType,
  SimilarBookType,
  ReviewType,
} from "./types";

const placeholderBook: BookType = {
  title: "The Hobbit",
  author: "J.R.R. Tolkien",
  description:
    "Bilbo Baggins is swept into an unexpected journey to reclaim a lost dwarf kingdom from the dragon Smaug.",
  genres: ["Fantasy", "Adventure", "Classic"],
  pages: 310,
  firstPublished: "1937",
  stats: { reading: 1204, read: 58320, wantToRead: 20418 },
};

const placeholderCommunity: BookCommunityType = {
  similarBooks: [
    {
      slug: "the-fellowship-of-the-ring",
      title: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
    },
    {
      slug: "the-name-of-the-wind",
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
    },
  ],
  reviews: [
    {
      id: 1,
      user: "reader42",
      rating: 5,
      content: "A cozy, timeless adventure that I keep coming back to.",
    },
    {
      id: 2,
      user: "pagesurfer",
      rating: 4,
      content: "Slow start, but the second half more than makes up for it.",
    },
  ],
};

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

function SimilarBookCard({ book }: { book: SimilarBookType }) {
  return (
    <Link
      className="rounded-xl border border-blue-300 p-2 px-4 transition dark:border-gray-700 [&:active,&:hover]:-translate-y-1"
      to={`/book/${book.slug}`}
    >
      <p className="text-sm font-bold">{book.title}</p>
      <p className="text-xs font-semibold dark:text-gray-400">{book.author}</p>
    </Link>
  );
}

function ReviewCard({ review }: { review: ReviewType }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-blue-300 p-2 px-4 dark:border-gray-700">
      <div className="flex justify-between text-sm font-bold">
        <p>{review.user}</p>
        <p>{review.rating} / 5</p>
      </div>
      <p className="text-sm">{review.content}</p>
    </div>
  );
}

function BookCommunitySection({ community }: { community: BookCommunityType }) {
  return (
    <section className="flex flex-col gap-6 border-t border-blue-300 pt-6 dark:border-gray-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold md:text-xl">Similar Books</h2>
        {community.similarBooks.map((book) => (
          <SimilarBookCard key={book.slug} book={book} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold md:text-xl">Reviews</h2>
        {community.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        <p className="mt-2 text-center text-sm font-bold dark:text-gray-400">
          <Link
            className="dark:text-white [&:hover,&:active]:underline"
            to="/login"
          >
            Login
          </Link>{" "}
          to add your own review
        </p>
      </div>
    </section>
  );
}

type ReadingStatusType = "reading" | "read" | "wantToRead";
const statusOptions: ReadingStatusType[] = ["reading", "read", "wantToRead"];
const statusLabels: Record<ReadingStatusType, string> = {
  reading: "Reading",
  read: "Read",
  wantToRead: "Want to Read",
};

function CoverImage() {
  return (
    <div className="aspect-2/3 w-full rounded-xl bg-blue-500 text-blue-500 dark:bg-gray-600 dark:text-black"></div>
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

type StarRatingProps = { rating: number; onChange: (rating: number) => void };
function StarRating({ rating, onChange }: StarRatingProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-sm font-bold dark:text-gray-400">Your Rating</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl transition [&:active,&:hover]:-translate-y-1 ${
              star <= rating
                ? "text-yellow-300"
                : "text-blue-300 dark:text-gray-700"
            }`}
            onClick={() => onChange(star === rating ? 0 : star)}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

type BookSidePanelProps = { isLoggedIn: boolean };
function BookSidePanel({ isLoggedIn }: BookSidePanelProps) {
  const [status, setStatus] = useState<ReadingStatusType | null>(null);
  const [rating, setRating] = useState(0);

  return (
    <aside className="flex flex-col gap-4 rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-700/40 md:self-start dark:bg-black dark:shadow-black/60">
      <CoverImage />
      {isLoggedIn && (
        <ReadingStatusToggle status={status} onChange={setStatus} />
      )}
      {isLoggedIn && <StarRating rating={rating} onChange={setRating} />}
    </aside>
  );
}

export default function BookPage() {
  const navbarLinks: NavbarLinkType[] = [
    { label: "Home", href: "/" },
    { label: "Books", href: "/books" },
    { label: "Sign In", href: "/login" },
  ];
  const isLoggedIn = false;

  return (
    <div className="font-jetbrains-mono flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700">
      <Navbar links={navbarLinks} />
      <main className="container mx-auto mt-16 mb-24 grid grid-cols-1 gap-4 p-4 sm:mt-4 sm:gap-2 sm:p-0 md:grid-cols-[1fr_2fr] lg:gap-4">
        <BookSidePanel isLoggedIn={isLoggedIn} />
        <div className="flex flex-col gap-6 rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-700/40 md:self-start dark:bg-black dark:shadow-black/60">
          <BookDetailsSection book={placeholderBook} />
          <BookCommunitySection community={placeholderCommunity} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
