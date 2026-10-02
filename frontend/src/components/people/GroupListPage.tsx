import Navbar, { type NavbarLinkType } from "../common/Navbar";
import Footer from "../common/Footer";
import useAuth from "../useAuth";
import type { GroupSummaryType } from "./types";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { CreateGroupModal } from "./CreateGroupModal";
import type { GroupType } from "@backend/types";

const GROUPS_URL = "/v1/groups";
function toGroupSummary(group: GroupType): GroupSummaryType {
  return { slug: group._id, name: group.name, members: group.memberCount };
}

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
  const { userId } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [groups, setGroups] = useState<GroupSummaryType[]>([]);
  const navbarLinks: NavbarLinkType[] = [
    userId ? null : { label: "Home", href: "/" },
    userId
      ? { label: "Profile", href: `/user/${userId}` }
      : { label: "Sign in", href: "/login" },
    { label: "Books", href: "/books" },
    { label: "Groups", href: "/groups" },
  ];
  useEffect(() => {
    let cancelled = false;
    async function loadGroups() {
      try {
        const res = await fetch(GROUPS_URL, { cache: "no-store" });
        if (res.status !== 200)
          throw new Error(`Groups failed with status ${res.status}`);
        const json: GroupType[] = await res.json();
        if (!cancelled) setGroups(json.map(toGroupSummary));
      } catch (err) {
        console.error(err);
        if (!cancelled) setGroups([]);
      }
    }
    loadGroups();
    return () => {
      cancelled = true;
    };
  }, [showCreate]);

  return (
    <div className="font-jetbrains-mono flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700">
      <Navbar
        links={navbarLinks}
        forcesdBGColor="md:bg-blue-500 md:dark:bg-black"
      />
      <main className="container mx-auto my-24 flex flex-col gap-6 p-4 text-white sm:p-0">
        <h1 className="text-xl font-bold md:text-center md:text-2xl">Groups</h1>
        <GroupGrid groups={groups} />
        {userId && (
          <div className="my-8 flex justify-center">
            <button
              type="button"
              className="w-fit rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md transition md:text-base dark:bg-black [&:active,&:hover]:-translate-y-1"
              onClick={() => setShowCreate(true)}
            >
              Create Group
            </button>
          </div>
        )}
        {showCreate && (
          <CreateGroupModal onClose={() => setShowCreate(false)} />
        )}
      </main>
      <Footer />
    </div>
  );
}
