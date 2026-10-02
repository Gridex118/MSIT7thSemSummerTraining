import "dotenv/config";
import { isValidObjectId, Types } from "mongoose";
import { Book } from "../models/book.model.ts";
import { Group } from "../models/group.model.ts";
import { User } from "../models/user.model.ts";
import { Discussion } from "../models/discussion.model.ts";
import { ServiceError } from "../errors.ts";
import type {
  CreateGroupInputType,
  CreateDiscussionInputType,
  GroupType,
  GroupDetailsType,
} from "../types.ts";

const AVATAR_PATH = process.env.VERCEL
  ? "/tmp/uploads/avatars"
  : "uploads/avatars";

function assertValidId(id: string, label: string) {
  if (!isValidObjectId(id)) throw new ServiceError(400, `Invalid ${label}`);
}

export async function createGroup(input: CreateGroupInputType) {
  assertValidId(input.owner, "owner id");
  const ownerExists = await User.exists({ _id: input.owner });
  if (!ownerExists) throw new ServiceError(404, "Owner not found");
  const ownerId = new Types.ObjectId(input.owner);
  return Group.create({
    name: input.name,
    description: input.description,
    owner: ownerId,
    members: [ownerId],
  });
}

export async function updateGroupAvatar(
  id: string,
  userId: string,
  filename: string,
) {
  assertValidId(id, "group id");
  const group = await Group.findById(id);
  if (!group) throw new ServiceError(404, "Group not found");
  if (String(group.owner) !== userId)
    throw new ServiceError(403, "Only the group owner can change the avatar");
  group.avatar = `${AVATAR_PATH}/${filename}`;
  await group.save();
  return group;
}

export async function getPublicGroups(): Promise<GroupType[]> {
  const groups = await Group.find({ visibility: "public" })
    .select("name description avatar members")
    .lean();
  return groups.map(({ members, _id, name, description, avatar }) => ({
    _id: String(_id),
    name,
    description,
    avatar,
    members,
    memberCount: members.length,
  }));
}

export async function getGroupMembers(id: string) {
  assertValidId(id, "group id");
  const group = await Group.findById(id).populate(
    "members",
    "name username avatar",
  );
  if (!group) throw new ServiceError(404, "Group not found");
  return group.members;
}

export async function getGroupDiscussions(id: string) {
  assertValidId(id, "group id");
  const exists = await Group.exists({ _id: id });
  if (!exists) throw new ServiceError(404, "Group not found");
  return Discussion.find({ group: id })
    .sort({ createdAt: -1 })
    .populate("book", "title workKey editionKey")
    .populate("startedBy", "name username avatar");
}

export async function getGroupDetails(id: string): Promise<GroupDetailsType> {
  assertValidId(id, "group id");
  const group = await Group.findById(id).lean();
  if (!group) throw new ServiceError(404, "Group not found");
  const discussions = await Discussion.find({ group: group._id })
    .sort({ createdAt: -1 })
    .select("title book")
    .populate<{ book: { title: string } }>("book", "title")
    .lean();
  return {
    _id: String(group._id),
    name: group.name,
    description: group.description,
    avatar: group.avatar,
    memberCount: group.members.length,
    ownerId: String(group.owner),
    members: group.members.map((member) => ({ _id: String(member) })),
    discussions: discussions.map((d) => ({
      _id: String(d._id),
      title: d.title,
      book: { title: d.book.title },
    })),
  };
}

export async function createDiscussion(
  groupId: string,
  input: CreateDiscussionInputType,
) {
  assertValidId(groupId, "group id");
  assertValidId(input.startedBy, "user id");
  const group = await Group.findById(groupId).select("members");
  if (!group) throw new ServiceError(404, "Group not found");
  const starterId = new Types.ObjectId(input.startedBy);
  if (!group.members.some((member) => member.equals(starterId)))
    throw new ServiceError(403, "Only group members can start a discussion");
  const book = await Book.findOneAndUpdate(
    { editionKey: input.book.editionKey },
    { $setOnInsert: { title: input.book.title, workKey: input.book.workKey } },
    { upsert: true, returnDocument: "after" },
  );
  const discussion = await Discussion.create({
    title: input.title,
    group: group._id,
    book: book._id,
    startedBy: starterId,
  });
  return discussion.populate([
    { path: "book", select: "title workKey editionKey" },
    { path: "startedBy", select: "name username avatar" },
  ]);
}
