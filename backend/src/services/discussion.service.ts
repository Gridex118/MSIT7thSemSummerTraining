import { isValidObjectId } from "mongoose";
import { Discussion } from "../models/discussion.model.ts";
import { Chat } from "../models/chat.model.ts";
import { Group } from "../models/group.model.ts";
import { ServiceError } from "../errors.ts";
import type { CreateChatInputType, ChatType } from "../types.ts";

function assertValidId(id: string, label: string) {
  if (!isValidObjectId(id)) throw new ServiceError(400, `Invalid ${label}`);
}

export async function getDiscussion(id: string) {
  assertValidId(id, "discussion id");
  const discussion = await Discussion.findById(id)
    .select("title book startedBy")
    .populate("book", "title workKey editionKey")
    .populate("startedBy", "name username avatar");
  if (!discussion) throw new ServiceError(404, "Discussion not found");
  return discussion;
}

export async function getChats(id: string): Promise<ChatType[]> {
  assertValidId(id, "discussion id");
  const exists = await Discussion.exists({ _id: id });
  if (!exists) throw new ServiceError(404, "Discussion not found");
  const chatDocs = await Chat.find({ discussion: id })
    .sort({ sentAt: 1 })
    .populate<{ sender: { _id: string; username: string; avatar?: string } }>(
      "sender",
      "_id username avatar",
    )
    .lean();
  return chatDocs.map(({ _id, sender, sentAt, ...rest }) => ({
    sentAt: sentAt.toLocaleString(),
    ...rest,
    sender: {
      username: sender.username,
      _id: String(sender._id),
      avatar: sender.avatar,
    },
    _id: String(_id),
  }));
}

export async function createChat(id: string, input: CreateChatInputType) {
  assertValidId(id, "discussion id");
  assertValidId(input.sender, "sender id");
  const discussion = await Discussion.findById(id).select("group");
  if (!discussion) throw new ServiceError(404, "Discussion not found");
  const isMember = await Group.exists({
    _id: discussion.group,
    members: input.sender,
  });
  if (!isMember)
    throw new ServiceError(
      403,
      "Only group members can post in this discussion",
    );
  const chat = await Chat.create({
    discussion: id,
    sender: input.sender,
    contentType: input.contentType,
    content: input.content,
  });
  return chat.populate("sender", "name username avatar");
}
