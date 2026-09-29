import Navbar, { type NavbarLinkType } from "../common/Navbar";
import Footer from "../common/Footer";
import BookDescription from "../books/BookDescription";
import type { BookType } from "../books/types";
import type { UserType, GroupType } from "./types";
import { Link } from "react-router";

const placeholderUser: UserType = {
  username: "reader42",
  groups: [
    { slug: "fantasy-fans", name: "Fantasy Fans", members: 1280 },
    { slug: "classics-club", name: "Classics Club", members: 342 },
    { slug: "night-owl-readers", name: "Night Owl Readers", members: 87 },
  ],
  books: [
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      description:
        "Bilbo Baggins is swept into an unexpected journey to reclaim a lost dwarf kingdom from the dragon Smaug.",
      genres: ["Fantasy", "Adventure", "Classic"],
      pages: 310,
      firstPublished: "1937",
      stats: { reading: 1204, read: 58320, wantToRead: 20418 },
    },
    {
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      description:
        "The story of Kvothe, a gifted young man who grows into the most notorious wizard his world has ever seen.",
      genres: ["Fantasy", "Adventure"],
      pages: 662,
      firstPublished: "2007",
      stats: { reading: 980, read: 41200, wantToRead: 27650 },
    },
  ],
};

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
  return (
    <aside className="flex flex-col gap-6 md:sticky md:top-20 md:left-0 md:self-start">
      <div className="flex flex-col gap-4">
        <UserAvatar />
        <h1 className="text-center text-xl font-bold md:text-2xl">
          {user.username}
        </h1>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold md:text-xl">Groups</h2>
        {user.groups.map((group) => (
          <GroupCard key={group.slug} group={group} />
        ))}
      </div>
    </aside>
  );
}

function UserBookCard({ book }: { book: BookType }) {
  return (
    <Link
      className="flex flex-col gap-4 rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-700/40 dark:bg-black dark:shadow-black/60"
      to={`/book/${book.title}`}
    >
      <BookDescription book={book} />
    </Link>
  );
}

function UserBookList({ books }: { books: BookType[] }) {
  return (
    <section className="flex flex-col gap-4">
      {books.map((book) => (
        <UserBookCard key={book.title} book={book} />
      ))}
    </section>
  );
}

export default function UserPage() {
  const navbarLinks: NavbarLinkType[] = [{ label: "Home", href: "/" }];

  return (
    <div className="flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700">
      <Navbar
        links={navbarLinks}
        forcesdBGColor="md:bg-blue-500 md:dark:bg-black"
      />
      <main className="container mx-auto my-24 grid grid-cols-1 gap-4 p-4 text-white sm:gap-2 sm:p-0 md:relative md:grid-cols-[1fr_2fr] lg:gap-4">
        <UserSidePanel user={placeholderUser} />
        <UserBookList books={placeholderUser.books} />
      </main>
      <Footer />
    </div>
  );
}
