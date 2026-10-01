import { useState } from "react";
import Navbar, { type NavbarLinkType } from "../common/Navbar";
import useAuth from "../useAuth";
import type { GroupDetailType, DiscussionType, CommentType } from "./types";
import { DiscussionModal } from "./DiscussionModal";
import Footer from "../common/Footer";

const placeholderGroup: GroupDetailType = {
  name: "Fantasy Fans",
  description:
    "A group for readers of epic quests, dragons and worlds worth getting lost in.",
  members: 1280,
  discussions: [
    {
      id: 1,
      title: "Is the second half worth the slow start?",
      bookTitle: "The Hobbit",
    },
    {
      id: 2,
      title: "Kvothe as an unreliable narrator",
      bookTitle: "The Name of the Wind",
    },
    { id: 3, title: "Favorite riddle scene", bookTitle: "The Hobbit" },
  ],
};

const placeholderComments: CommentType[] = [
  {
    id: 1,
    user: "reader42",
    date: "Sep 21, 2026",
    message:
      "The pacing picks up a lot once they reach Mirkwood, so I'd say yes.",
  },
  {
    id: 2,
    user: "pagesurfer",
    date: "Sep 22, 2026",
    message:
      "Agreed, and the riddle scene alone makes the first few chapters worth it.",
  },
  {
    id: 3,
    user: "night_owl",
    date: "Sep 24, 2026",
    message: "I almost quit around chapter 3, so I'm glad I stuck with it.",
  },
  {
    id: 4,
    user: "night_owl",
    date: "Sep 24, 2026",
    message: "I almost quit around chapter 3, so I'm glad I stuck with it.",
  },
];

function GroupAvatar() {
  return (
    <div className="aspect-square w-40 self-center rounded-xl bg-blue-600 dark:bg-black"></div>
  );
}

function GroupSidePanel({ group }: { group: GroupDetailType }) {
  return (
    <aside className="flex flex-col gap-6 md:sticky md:top-20 md:left-0 md:self-start">
      <div className="flex flex-col gap-4">
        <GroupAvatar />
        <h1 className="text-center text-xl font-bold md:text-2xl">
          {group.name}
        </h1>
        <p className="text-center text-xs font-semibold dark:text-gray-400">
          {group.members.toLocaleString()} members
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold md:text-xl">About</h2>
        <p className="text-sm">{group.description}</p>
      </div>
    </aside>
  );
}

function DiscussionCard({
  discussion,
  onSelect,
}: {
  discussion: DiscussionType;
  onSelect: (discussion: DiscussionType) => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full flex-col gap-1 rounded-xl bg-blue-600 p-4 text-left text-white shadow-lg shadow-blue-700/40 transition dark:bg-black dark:shadow-black/60 [&:active,&:hover]:-translate-y-1"
      onClick={() => onSelect(discussion)}
    >
      <p className="text-lg font-bold md:text-xl">{discussion.title}</p>
      <p className="text-sm font-semibold dark:text-gray-400">
        on {discussion.bookTitle}
      </p>
    </button>
  );
}

function DiscussionList({
  discussions,
  onSelect,
}: {
  discussions: DiscussionType[];
  onSelect: (discussion: DiscussionType) => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="mt-4 text-lg font-bold sm:mt-0 md:text-xl">Discussions</h2>
      {discussions.map((discussion) => (
        <DiscussionCard
          key={discussion.id}
          discussion={discussion}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}

export default function GroupPage() {
  const { userId } = useAuth();
  const navbarLinks: NavbarLinkType[] = [
    userId ? null : { label: "Home", href: "/" },
    userId
      ? { label: "Profile", href: `/user/${userId}` }
      : { label: "Sign in", href: "/login" },
    { label: "Books", href: "/books" },
    { label: "Groups", href: "/groups" },
  ];
  const [selected, setSelected] = useState<DiscussionType | null>(null);

  return (
    <div className="font-jetbrains-mono flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700">
      <Navbar
        links={navbarLinks}
        forcesdBGColor="md:bg-blue-500 md:dark:bg-black"
      />
      <main className="container mx-auto my-24 grid grid-cols-1 gap-4 p-4 text-white sm:gap-2 sm:p-0 md:relative md:grid-cols-[1fr_2fr] lg:gap-4 lg:gap-8">
        <GroupSidePanel group={placeholderGroup} />
        <DiscussionList
          discussions={placeholderGroup.discussions}
          onSelect={setSelected}
        />
      </main>
      <Footer />
      {selected && (
        <DiscussionModal
          discussion={selected}
          comments={placeholderComments}
          onClose={() => setSelected(null)}
          onSend={(message) => console.log(message)}
        />
      )}
    </div>
  );
}
