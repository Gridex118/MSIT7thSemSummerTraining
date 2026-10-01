import Navbar, { type NavbarLinkType } from "../common/Navbar";
import Footer from "../common/Footer";
import BookDescription from "../books/BookDescription";
import useAuth from "../useAuth";
import type { ProfileResponseType } from "@backend/types";
import type { BookType } from "../books/types";
import type { UserType, GroupType } from "./types";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const PROFILE_URL = "/v1/users";
const dummyStats = { reading: 1204, read: 58320, wantToRead: 20418 };
function toUserType(profile: ProfileResponseType): UserType {
  return {
    username: profile.username,
    groups: profile.groups.map((g) => ({
      slug: g._id,
      name: g.name,
      members: g.memberCount,
    })),
    books: profile.books.map(({ book, readStatus }) => ({
      title: book.title,
      author: book.author ?? "",
      description: "",
      genres: [],
      pages: 0,
      firstPublished: "",
      stats: dummyStats,
      workKey: book.workKey,
      editionKey: book.editionKey,
      readStatus: readStatus,
    })),
  };
}

function UserAvatar() {
  return (
    <div className="aspect-square w-40 self-center rounded-full bg-blue-600 dark:bg-black"></div>
  );
}

function GroupCard({ group }: { group: GroupType }) {
  return (
    <Link
      className="w-fit rounded-xl border border-transparent p-2 px-4 transition [&:hover,&:active]:border-blue-300 [&:hover,&:active]:dark:border-gray-400"
      to={`/group/${group.slug}`}
    >
      <p className="text-sm font-bold">{group.name}</p>
      <p className="text-xs font-semibold dark:text-gray-400">
        {group.members.toLocaleString()} members
      </p>
    </Link>
  );
}

function UserSidePanel({ user }: { user: UserType }) {
  const { userId, logout } = useAuth();
  const { userId: paramsUserId } = useParams();
  const navigate = useNavigate();

  return (
    <aside className="flex flex-col gap-6 md:sticky md:top-20 md:left-0 md:self-start">
      <div className="flex flex-col gap-4">
        <UserAvatar />
        <div>
          <h1 className="text-center text-xl font-bold md:text-2xl">
            {user.username}
            {userId === paramsUserId && (
              <button
                className="ml-2 w-fit cursor-pointer text-base text-red-100 underline dark:text-red-400"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                /Log Out
              </button>
            )}
          </h1>
        </div>
      </div>
      {user.groups.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold md:text-xl">Groups</h2>
          {user.groups.map((group) => (
            <GroupCard key={group.slug} group={group} />
          ))}
        </div>
      ) : (
        <p>User has not joined any groups</p>
      )}
    </aside>
  );
}

function readStatusPretty(raw?: string) {
  const statusLabels: Record<string, string> = {
    reading: "Reading",
    read: "Read",
    planning: "Want to Read",
  };
  return raw ? statusLabels[raw] : "";
}

function UserBookCard({ book }: { book: BookType }) {
  return (
    <Link
      className="flex flex-col gap-2 rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-700/40 dark:bg-black dark:shadow-black/60"
      to={`/book/${book.workKey}/${book.editionKey}`}
    >
      <BookDescription book={book} />
      <div>{readStatusPretty(book.readStatus)}</div>
    </Link>
  );
}

function UserBookList({ books }: { books: BookType[] }) {
  if (books.length <= 0) return <p>User has yet to add any books</p>;
  return (
    <section className="flex flex-col gap-4">
      {books.map((book) => (
        <UserBookCard key={book.editionKey} book={book} />
      ))}
    </section>
  );
}

export default function UserPage() {
  const { userId: paramsUserId } = useParams();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const navbarLinks: NavbarLinkType[] = [
    userId ? null : { label: "Home", href: "/" },
    userId
      ? { label: "Profile", href: `/user/${userId}` }
      : { label: "Sign in", href: "/login" },
    { label: "Books", href: "/books" },
    { label: "Groups", href: "/groups" },
  ];

  useEffect(() => {
    if (!paramsUserId) return;
    let cancelled = false;
    async function loadUser() {
      try {
        const res = await fetch(`${PROFILE_URL}/${paramsUserId}`, {
          cache: "no-store",
        });
        if (res.status !== 200)
          throw new Error(`Profile failed with status ${res.status}`);
        const profile: ProfileResponseType = await res.json();
        if (!cancelled) setUser(toUserType(profile));
      } catch (err) {
        console.error(err);
        if (!cancelled) setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
    return () => {
      cancelled = true;
    };
  }, [paramsUserId]);

  return (
    <div className="font-jetbrains-mono flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700">
      <Navbar
        links={navbarLinks}
        forcesdBGColor="md:bg-blue-500 md:dark:bg-black"
      />
      {isLoading ? (
        <div className="m-auto flex items-center gap-4 text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          Loading Results
        </div>
      ) : (
        <main className="container mx-auto my-24 grid grid-cols-1 gap-4 p-4 text-white sm:gap-2 sm:p-0 md:relative md:grid-cols-[1fr_2fr] lg:gap-4">
          {user ? (
            <>
              <UserSidePanel user={user} />
              <UserBookList books={user.books} />
            </>
          ) : (
            <p className="text-sm font-bold">User not found</p>
          )}
        </main>
      )}
      <Footer />
    </div>
  );
}
