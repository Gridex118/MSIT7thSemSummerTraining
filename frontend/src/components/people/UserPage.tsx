import Navbar, { type NavbarLinkType } from "../common/Navbar";
import Footer from "../common/Footer";
import useAuth from "../useAuth";
import useTheme from "../useTheme";
import type { ProfileResponseType } from "@backend/types";
import type { BookType } from "../books/types";
import type { UserType, GroupType } from "./types";

import EditPenSvg from "../../assets/edit-pen.svg?react";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const PROFILE_URL = "/v1/users";
const COVER_URL = "/v1/openLibrary/covers";
const dummyStats = { reading: 1204, read: 58320, wantToRead: 20418 };
function toUserType(profile: ProfileResponseType): UserType {
  return {
    username: profile.username,
    avatar: profile.avatar,
    name: profile.name,
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

function UserAvatar({
  userOwnProfile,
  avatar,
}: {
  userOwnProfile: boolean;
  avatar?: string;
}) {
  return (
    <div className="group relative aspect-square w-28 shrink-0 overflow-clip rounded-full">
      {userOwnProfile && (
        <div className="absolute top-0 left-0 grid h-full w-full place-items-center rounded-full bg-black/60 text-transparent group-hover:z-999 group-active:z-999">
          <EditPenSvg className="absolute size-8 fill-white" />
          <input className="absolute size-full" type="file"></input>
        </div>
      )}
      {avatar ? (
        <img
          className="absolute top-0 left-0 size-full"
          alt="Profile Picture"
          src={avatar}
        ></img>
      ) : (
        <div className="absolute top-0 left-0 size-full rounded-full bg-blue-600 dark:bg-black"></div>
      )}
    </div>
  );
}

function UserProfile({ user }: { user: UserType }) {
  const { userId, logout } = useAuth();
  const { userId: paramsUserId } = useParams();
  const userOwnProfile = !!userId && userId == paramsUserId;
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center gap-4 md:col-start-2 md:row-start-1 md:flex-row md:gap-6">
      <UserAvatar userOwnProfile={userOwnProfile} avatar={user.avatar} />
      <div className="flex flex-col gap-1">
        <h1 className="text-center text-xl font-bold md:text-left md:text-2xl">
          {user.username}
          {userOwnProfile && (
            <button
              className="ml-2 w-fit cursor-pointer text-base text-red-100 hover:underline dark:text-red-400"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              / Log Out
            </button>
          )}
        </h1>
        <p className="text-center text-sm font-semibold text-blue-100 md:text-left dark:text-gray-400">
          {user.name}
        </p>
      </div>
    </section>
  );
}

function GroupCard({ group }: { group: GroupType }) {
  return (
    <Link
      className="w-fit rounded-xl border border-transparent p-2 px-4 transition [&:hover,&:active]:border-blue-300 [&:hover,&:active]:dark:border-gray-400"
      to={`/group/${group.slug}`}
    >
      <p className="text-sm font-bold">{group.name}</p>
      <p className="text-xs font-semibold text-blue-100 dark:text-gray-400">
        {group.members.toLocaleString()} members
      </p>
    </Link>
  );
}

function UserSidePanel({ user }: { user: UserType }) {
  return (
    <aside className="flex flex-col gap-2 md:sticky md:top-20 md:col-start-1 md:row-span-2 md:row-start-1 md:self-start">
      <h2 className="text-lg font-bold md:text-xl">Groups</h2>
      {user.groups.length > 0 ? (
        user.groups.map((group) => <GroupCard key={group.slug} group={group} />)
      ) : (
        <p className="text-sm font-semibold text-blue-100 dark:text-gray-400">
          User has not joined any groups
        </p>
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
  const status = readStatusPretty(book.readStatus);

  return (
    <Link
      className="group flex items-center gap-4 py-3"
      to={`/book/${book.workKey}/${book.editionKey}`}
    >
      <div className="aspect-2/3 w-12 shrink-0 overflow-hidden rounded bg-blue-600 shadow-md shadow-blue-700/40 dark:bg-black dark:shadow-black/60">
        <img
          className="h-full w-full object-cover"
          src={`${COVER_URL}/${book.editionKey}?size=S`}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-sm font-bold group-hover:underline md:text-base">
          {book.title}
        </p>
        <p className="truncate text-xs font-semibold text-blue-100 dark:text-gray-400">
          {book.author}
        </p>
      </div>
      {status && (
        <span className="shrink-0 rounded-full border border-blue-300 px-3 py-0.5 text-xs font-bold dark:border-gray-700">
          {status}
        </span>
      )}
    </Link>
  );
}

function UserBookList({ name, books }: { name: string; books: BookType[] }) {
  return (
    <section className="flex flex-col gap-2 md:col-start-2 md:row-start-2">
      <h2 className="text-lg font-bold md:text-xl">{name}'s list</h2>
      {books.length <= 0 ? (
        <p className="text-sm font-semibold text-blue-100 dark:text-gray-400">
          User has yet to add any books
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-blue-400/50 dark:divide-gray-700">
          {books.map((book) => (
            <UserBookCard key={book.editionKey} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function UserPage() {
  const { userId: paramsUserId } = useParams();
  const { userId } = useAuth();
  const { darkMode } = useTheme();
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
    <div
      className={`font-jetbrains-mono flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700 ${darkMode && "dark"}`}
    >
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
        <main className="mx-auto my-24 grid w-full max-w-6xl grid-cols-1 gap-8 px-4 text-white md:grid-cols-[1fr_2.5fr] md:gap-x-12">
          {user ? (
            <>
              <UserProfile user={user} />
              <UserSidePanel user={user} />
              <UserBookList name={user.name} books={user.books} />
            </>
          ) : (
            <p className="text-sm font-bold md:col-span-2">User not found</p>
          )}
        </main>
      )}
      <Footer />
    </div>
  );
}
