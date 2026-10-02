import "dotenv/config";
import { isValidObjectId, Types } from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.ts";
import { Book } from "../models/book.model.ts";
import { UserBook } from "../models/user_book.model.ts";
import { Group } from "../models/group.model.ts";
import { ServiceError } from "../errors.ts";
import { signToken } from "../middlewares/auth.middleware.ts";
import type {
  RegisterInputType,
  LoginInputType,
  BookInputType,
  UserGroupInputType,
} from "../types.ts";

const SALT_ROUNDS = 10;
const DUMMY_HASH = bcrypt.hashSync("dummy password", SALT_ROUNDS);
const AVATAR_PATH = process.env.VERCEL
  ? "/tmp/uploads/avatars"
  : "uploads/avatars";

function assertValidId(id: string, label: string) {
  if (!isValidObjectId(id)) throw new ServiceError(400, `Invalid ${label}`);
}

export async function registerUser(input: RegisterInputType) {
  const hashed = await bcrypt.hash(String(input.password), SALT_ROUNDS);
  const user = await User.create({ ...input, password: hashed });
  const { password: _password, ...safe } = user.toObject();
  return { user: safe, token: signToken(String(user._id)) };
}

export async function loginUser(input: LoginInputType) {
  const identifier = input.identifier.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+password");
  const valid = await bcrypt.compare(
    input.password,
    user?.password ?? DUMMY_HASH,
  );
  if (!user || !valid) throw new ServiceError(401, "Invalid credentials");
  const { password: _password, ...safe } = user.toObject();
  return { user: safe, token: signToken(String(user._id)) };
}

export async function updateUser(
  id: string,
  input: { email?: string; password?: string },
) {
  assertValidId(id, "user id");
  const update: { email?: string; password?: string } = {};
  if (input.email) update.email = String(input.email).trim().toLowerCase();
  if (input.password)
    update.password = await bcrypt.hash(String(input.password), SALT_ROUNDS);
  const user = await User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ServiceError(404, "User not found");
  return user;
}

export async function addBooks(
  id: string,
  books: BookInputType[],
  readStatus?: string,
  rating?: number,
) {
  assertValidId(id, "user id");
  const userExists = await User.exists({ _id: id });
  if (!userExists) throw new ServiceError(404, "User not found");
  const set: { readStatus?: string; rating?: number } = {};
  if (readStatus) set.readStatus = readStatus;
  if (rating !== undefined) set.rating = rating;
  const userId = new Types.ObjectId(id);
  await Promise.all(
    books.map(async (b) => {
      const book = await Book.findOneAndUpdate(
        { editionKey: b.editionKey },
        {
          $setOnInsert: {
            title: b.title,
            author: String(b.author),
            authorKey: String(b.authorKey),
            workKey: b.workKey,
          },
        },
        { upsert: true, returnDocument: "after" },
      );
      await UserBook.updateOne(
        { user: userId, book: book._id },
        { $set: set, $setOnInsert: { user: userId, book: book._id } },
        { upsert: true },
      );
    }),
  );
  return UserBook.find({ user: userId }).populate("book");
}

export async function getBooksInList(id: string) {
  assertValidId(id, "user id");
  const exists = await User.exists({ _id: id });
  if (!exists) throw new ServiceError(404, "User not found");
  return UserBook.find({ user: id }).populate(
    "book",
    "title author workKey editionKey",
  );
}

export async function joinGroup({ userId, groupId }: UserGroupInputType) {
  if (!isValidObjectId(userId) || !isValidObjectId(groupId))
    throw new ServiceError(400, "Invalid user id or group id");
  const [user, group] = await Promise.all([
    User.exists({ _id: userId }),
    Group.findById(groupId),
  ]);
  if (!user || !group) throw new ServiceError(404, "User or group not found");
  if (group.visibility !== "public")
    throw new ServiceError(403, "This group is private");
  await Group.updateOne(
    { _id: groupId },
    { $addToSet: { members: new Types.ObjectId(userId) } },
  );
}

export async function leaveGroup({ userId, groupId }: UserGroupInputType) {
  if (!isValidObjectId(userId) || !isValidObjectId(groupId))
    throw new ServiceError(400, "Invalid user id or group id");
  const group = await Group.findById(groupId).select("owner members");
  if (!group) throw new ServiceError(404, "Group not found");
  if (String(group.owner) === userId)
    throw new ServiceError(403, "The group owner cannot leave the group");
  const isMember = group.members.some((member) => String(member) === userId);
  if (!isMember)
    throw new ServiceError(404, "You are not a member of this group");
  await Group.updateOne(
    { _id: groupId },
    { $pull: { members: new Types.ObjectId(userId) } },
  );
}

export async function updateAvatar(id: string, filename: string) {
  assertValidId(id, "user id");
  const user = await User.findByIdAndUpdate(
    id,
    { avatar: `${AVATAR_PATH}/${filename}` },
    { new: true },
  );
  if (!user) throw new ServiceError(404, "User not found");
  return user;
}

export async function getUserProfile(id: string) {
  assertValidId(id, "user id");
  const user = await User.findById(id);
  if (!user) throw new ServiceError(404, "User not found");
  const groupDocs = await Group.find({ members: user._id })
    .select("name members")
    .lean();
  const groups = groupDocs.map(({ members, ...rest }) => ({
    ...rest,
    memberCount: members.length,
  }));
  const books = await UserBook.find({ user: user._id }).populate("book");
  return { ...user.toObject(), groups, books };
}

export async function getAllUsers() {
  return User.find().select("name username avatar");
}
