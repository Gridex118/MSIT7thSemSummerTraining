import { isValidObjectId } from "mongoose";
import { Discussion } from "../models/discussion.model.ts";
import { Chat } from "../models/chat.model.ts";
import { User } from "../models/user.model.ts";
import { ServiceError } from "../errors.ts";

export type ChatContentType = "text" | "image";

export type CreateChatInputType = {
  sender: string;
  contentType: ChatContentType;
  content: string;
};

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

export async function getChats(id: string) {
  assertValidId(id, "discussion id");
  const exists = await Discussion.exists({ _id: id });
  if (!exists) throw new ServiceError(404, "Discussion not found");
  return Chat.find({ discussion: id })
    .sort({ sentAt: 1 })
    .populate("sender", "name username avatar");
}

export async function createChat(id: string, input: CreateChatInputType) {
  assertValidId(id, "discussion id");
  assertValidId(input.sender, "sender id");
  const [discussion, sender] = await Promise.all([
    Discussion.exists({ _id: id }),
    User.exists({ _id: input.sender }),
  ]);
  if (!discussion) throw new ServiceError(404, "Discussion not found");
  if (!sender) throw new ServiceError(404, "Sender not found");
  const chat = await Chat.create({
    discussion: id,
    sender: input.sender,
    contentType: input.contentType,
    content: input.content,
  });
  return chat.populate("sender", "name username avatar");
}
