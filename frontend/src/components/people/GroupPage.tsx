import { useState, useEffect } from "react";
import Navbar, { type NavbarLinkType } from "../common/Navbar";
import useAuth from "../useAuth";
import type { DiscussionType } from "./types";
import { DiscussionModal } from "./DiscussionModal";
import type { GroupDetailsType } from "@backend/types";
import Footer from "../common/Footer";
import { Link, useParams } from "react-router";
import { CreateDiscussionModal } from "./CreateDiscussionModal";

const GROUP_URL = "/v1/groups";

function toDiscussionType(
  d: GroupDetailsType["discussions"][number],
): DiscussionType {
  return { id: d._id, title: d.title, bookTitle: d.book.title };
}

function GroupAvatar() {
  return (
    <div className="aspect-square w-40 self-center rounded-xl bg-blue-600 dark:bg-black"></div>
  );
}

function GroupSidePanel({ group }: { group: GroupDetailsType }) {
  const { userId } = useAuth();
  const isMemberOfGroup =
    userId === group.ownerId || group.members.find(({ _id }) => _id === userId);

  return (
    <aside className="flex flex-col gap-6 md:sticky md:top-20 md:left-0 md:self-start">
      <div className="flex flex-col gap-4">
        <GroupAvatar />
        <h1 className="text-center text-xl font-bold md:text-2xl">
          {group.name}
        </h1>
        <p className="text-center text-xs font-semibold dark:text-gray-400">
          {group.memberCount.toLocaleString()} members
        </p>
        {userId &&
          (isMemberOfGroup ? (
            <button className="cursor-pointer text-red-200 hover:underline dark:text-red-500">
              / Leave Group
            </button>
          ) : (
            <button className="cursor-pointer text-green-200 hover:underline dark:text-green-500">
              / Join Group
            </button>
          ))}
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
      {discussions.length <= 0 ? (
        <p>This group has no discussions yet</p>
      ) : (
        discussions.map((discussion) => (
          <DiscussionCard
            key={discussion.id}
            discussion={discussion}
            onSelect={onSelect}
          />
        ))
      )}
    </section>
  );
}

export default function GroupPage() {
  const { groupId } = useParams();
  const { userId } = useAuth();
  const navbarLinks: NavbarLinkType[] = [
    userId ? null : { label: "Home", href: "/" },
    userId
      ? { label: "Profile", href: `/user/${userId}` }
      : { label: "Sign in", href: "/login" },
    { label: "Books", href: "/books" },
    { label: "Groups", href: "/groups" },
  ];
  const [group, setGroup] = useState<GroupDetailsType | null>(null);
  const [selected, setSelected] = useState<DiscussionType | null>(null);
  const [showDiscussionCreateModel, setShowDiscussionCreateModal] =
    useState(false);
  const isMemberOfGroup =
    userId === group?.ownerId ||
    group?.members.find(({ _id }) => _id === userId);

  useEffect(() => {
    if (!groupId) return;
    let cancelled = false;
    async function loadGroup() {
      try {
        const res = await fetch(`${GROUP_URL}/${groupId}`, {
          cache: "no-store",
        });
        if (res.status !== 200)
          throw new Error(`Group failed with status ${res.status}`);
        const json: GroupDetailsType = await res.json();
        if (!cancelled) setGroup(json);
      } catch (err) {
        console.error(err);
        if (!cancelled) setGroup(null);
      }
    }
    loadGroup();
    return () => {
      cancelled = true;
    };
  }, [groupId, showDiscussionCreateModel]);

  return (
    <div className="font-jetbrains-mono flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700">
      <Navbar
        links={navbarLinks}
        forcesdBGColor="md:bg-blue-500 md:dark:bg-black"
      />
      <main className="container mx-auto my-24 grid grid-cols-1 gap-4 p-4 text-white sm:gap-2 sm:p-0 md:relative md:grid-cols-[1fr_2fr] lg:gap-4 lg:gap-8">
        {group ? (
          <>
            <GroupSidePanel group={group} />
            <div className="flex flex-col gap-6">
              <DiscussionList
                discussions={group.discussions.map(toDiscussionType)}
                onSelect={setSelected}
              />
              {isMemberOfGroup ? (
                <button
                  type="button"
                  className="w-fit rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md transition md:text-base dark:bg-black [&:active,&:hover]:-translate-y-1"
                  onClick={() => setShowDiscussionCreateModal(true)}
                >
                  Start New Discussion
                </button>
              ) : (
                <p className="text-gray-200 dark:text-gray-300">
                  <Link className="font-semibold text-white" to="/login">
                    Log in
                  </Link>{" "}
                  to start a new discussion
                </p>
              )}
              {showDiscussionCreateModel && (
                <CreateDiscussionModal
                  groupId={groupId!}
                  onClose={() => setShowDiscussionCreateModal(false)}
                />
              )}
            </div>
          </>
        ) : (
          <p className="text-sm font-bold">Group not found</p>
        )}
      </main>
      <Footer />
      {selected && (
        <DiscussionModal
          discussionId={selected.id}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
