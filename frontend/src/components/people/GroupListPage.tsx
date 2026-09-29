import Navbar, { type NavbarLinkType } from "../common/Navbar";
import Footer from "../common/Footer";
import type { GroupSummaryType } from "./types";
import { Link } from "react-router";

const placeholderGroups: GroupSummaryType[] = [
  { slug: "fantasy-fans", name: "Fantasy Fans", members: 1280 },
  { slug: "classics-club", name: "Classics Club", members: 342 },
  { slug: "night-owl-readers", name: "Night Owl Readers", members: 87 },
  { slug: "sci-fi-society", name: "Sci-Fi Society", members: 956 },
  { slug: "mystery-book-club", name: "Mystery Book Club", members: 514 },
  { slug: "poetry-corner", name: "Poetry Corner", members: 129 },
];
function GroupSummaryAvatar() {
  return (
    <div className="aspect-square w-16 shrink-0 rounded-xl bg-blue-500 dark:bg-gray-600"></div>
  );
}
function GroupSummaryCard({ group }: { group: GroupSummaryType }) {
  return (
    <Link
      className="grid grid-cols-[auto_1fr] items-center gap-x-4 rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-700/40 transition dark:bg-black dark:shadow-black/60 [&:active,&:hover]:-translate-y-1"
      to={`/group/${group.slug}`}
    >
      <GroupSummaryAvatar />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate text-lg font-bold md:text-xl">{group.name}</p>
        <p className="text-xs font-semibold dark:text-gray-400">
          {group.members.toLocaleString()} members
        </p>
      </div>
    </Link>
  );
}
function GroupGrid({ groups }: { groups: GroupSummaryType[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <GroupSummaryCard key={group.slug} group={group} />
      ))}
    </section>
  );
}
export default function GroupListPage() {
  const navbarLinks: NavbarLinkType[] = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/user/1" },
    { label: "Books", href: "/books" },
    { label: "Groups", href: "/groups" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700">
      <Navbar
        links={navbarLinks}
        forcesdBGColor="md:bg-blue-500 md:dark:bg-black"
      />
      <main className="container mx-auto my-24 flex flex-col gap-6 p-4 text-white sm:p-0">
        <h1 className="text-xl font-bold md:text-center md:text-2xl">
          Public Groups
        </h1>
        <GroupGrid groups={placeholderGroups} />
      </main>
      <Footer />
    </div>
  );
}
