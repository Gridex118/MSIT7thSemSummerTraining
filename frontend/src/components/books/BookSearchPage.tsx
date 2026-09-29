import { useState } from "react";
import { Link } from "react-router";
import Navbar, { type NavbarLinkType } from "../common/Navbar";
import Footer from "../common/Footer";
import type { SearchResultType } from "./types";

const placeholderResults: SearchResultType[] = [
  {
    slug: "the-hobbit",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genres: ["Fantasy", "Adventure", "Classic"],
  },
  {
    slug: "the-fellowship-of-the-ring",
    title: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    genres: ["Fantasy", "Adventure"],
  },
  {
    slug: "the-name-of-the-wind",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genres: ["Fantasy", "Adventure"],
  },
  {
    slug: "dune",
    title: "Dune",
    author: "Frank Herbert",
    genres: ["Science Fiction", "Classic"],
  },
];

function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");
  return (
    <form
      className="flex gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        onSearch(trimmed);
      }}
    >
      <input
        className="min-w-0 flex-1 rounded-full border border-blue-300 p-2 px-4 text-sm font-semibold outline-0 focus:border-blue-100 dark:border-gray-500 focus:dark:border-gray-400"
        name="book-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title or author"
      />
      <button
        type="submit"
        disabled={!query.trim()}
        className="rounded-full border border-blue-300 bg-white px-6 text-sm font-bold text-blue-500 transition disabled:opacity-50 md:text-base dark:border-gray-700 dark:text-black [&:active:not(:disabled),&:hover:not(:disabled)]:-translate-y-1"
      >
        Search
      </button>
    </form>
  );
}

function SearchResultCard({ book }: { book: SearchResultType }) {
  return (
    <Link
      className="flex flex-col gap-2 rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-700/40 transition dark:bg-black dark:shadow-black/60 [&:active,&:hover]:-translate-y-1"
      to={`/book/${book.slug}`}
    >
      <div>
        <p className="text-lg font-bold md:text-xl">{book.title}</p>
        <p className="text-sm font-semibold dark:text-gray-400">
          by {book.author}
        </p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {book.genres.map((genre) => (
          <li
            key={genre}
            className="rounded-full border border-blue-300 px-3 py-1 text-xs font-semibold dark:border-gray-700"
          >
            {genre}
          </li>
        ))}
      </ul>
    </Link>
  );
}

function SearchResults({ results }: { results: SearchResultType[] | null }) {
  if (results === null) {
    return (
      <p className="text-center text-sm font-bold dark:text-gray-400">
        Search for a book to get started
      </p>
    );
  }
  if (results.length === 0) {
    return (
      <p className="text-center text-sm font-bold dark:text-gray-400">
        No books found
      </p>
    );
  }
  return (
    <section className="flex flex-col gap-4">
      {results.map((book) => (
        <SearchResultCard key={book.slug} book={book} />
      ))}
    </section>
  );
}

export default function BookSearchPage() {
  const navbarLinks: NavbarLinkType[] = [
    { label: "Home", href: "/" },
    { label: "Books", href: "/books" },
    { label: "Sign In", href: "/login" },
  ];
  const [results, setResults] = useState<SearchResultType[] | null>(null);
  const handleSearch = (query: string) => {
    const q = query.toLowerCase();
    setResults(
      placeholderResults.filter(
        (book) =>
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q),
      ),
    );
  };

  return (
    <div className="font-jetbrains-mono flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700">
      <Navbar
        links={navbarLinks}
        forcesdBGColor="md:bg-blue-500 md:dark:bg-black"
      />
      <main className="container mx-auto my-24 flex max-w-200 flex-col gap-6 p-4 text-white sm:p-0 md:p-4">
        <SearchBar onSearch={handleSearch} />
        <SearchResults results={results} />
      </main>
      <Footer />
    </div>
  );
}
