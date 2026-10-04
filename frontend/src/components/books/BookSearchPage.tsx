import { useState, useEffect } from "react";
import { Link } from "react-router";
import Navbar, { type NavbarLinkType } from "../common/Navbar";
import Footer from "../common/Footer";
import useAuth from "../useAuth";
import useTheme from "../useTheme";
import type { SearchResultType } from "./types";
import type { OpenLibraryBookType } from "@backend/types";

import OpenLibraryLogo from "../../assets/openlibrary-logo-tighter.svg?react";

const SEARCH_URL = "/v1/openLibrary/search";

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
      to={`/book/${book.workKey}/${book.editionKey}`}
      state={{ book: book.raw }}
    >
      <div>
        <p className="text-lg font-bold md:text-xl">{book.title}</p>
        <p className="text-sm font-semibold dark:text-gray-400">
          by {book.author}
        </p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {book.genres.slice(0, 5).map((genre) => (
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
        <SearchResultCard key={book.editionKey} book={book} />
      ))}
    </section>
  );
}

export default function BookSearchPage() {
  const { userId } = useAuth();
  const { darkMode } = useTheme();
  const navbarLinks: NavbarLinkType[] = [
    userId ? null : { label: "Home", href: "/" },
    userId
      ? { label: "Profile", href: `/user/${userId}` }
      : { label: "Sign In", href: "/login" },
    { label: "Books", href: "/books" },
    userId ? { label: "Groups", href: "/groups" } : null,
  ];
  const [results, setResults] = useState<SearchResultType[] | null>(null);
  const [query, setQuery] = useState("");
  const [loadingResults, setLoadingResults] = useState(false);
  const handleSearch = (newQuery: string) => setQuery(newQuery);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    async function runSearch() {
      setLoadingResults(true);
      try {
        const res = await fetch(`${SEARCH_URL}?q=${query}`);
        if (res.status !== 200)
          throw new Error(`Search failed with status ${res.status}`);
        const books: OpenLibraryBookType[] = await res.json();
        if (cancelled) {
          return;
        }
        setResults(
          books.map((book) => ({
            workKey: book.workKey,
            editionKey: book.editionKey,
            title: book.title,
            author: book.author.name,
            genres: book.subjects ?? [],
            raw: book,
          })),
        );
      } catch (err) {
        console.error(err);
        if (!cancelled) setResults([]);
      } finally {
        setLoadingResults(false);
      }
    }
    runSearch();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div
      className={`font-jetbrains-mono flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700 ${darkMode && "dark"}`}
    >
      <Navbar
        links={navbarLinks}
        forcesdBGColor="md:bg-blue-500 md:dark:bg-black"
      />
      <main className="container mx-auto my-24 flex max-w-200 flex-col gap-6 p-4 text-white sm:p-0 md:p-4">
        <div className="flex items-center justify-center gap-2 text-blue-200 dark:text-gray-400">
          <p>Powered By</p>
          <a href="openlibrary.org">
            <OpenLibraryLogo className="w-32" />
          </a>
        </div>
        <SearchBar onSearch={handleSearch} />
        {loadingResults ? (
          <div className="m-auto flex items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            Loading Results
          </div>
        ) : (
          <SearchResults results={results} />
        )}
      </main>
      <Footer />
    </div>
  );
}
