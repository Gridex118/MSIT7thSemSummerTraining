import { isValidObjectId, Types } from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.ts";
import { Book } from "../models/book.model.ts";
import { Group } from "../models/group.model.ts";
import { ServiceError } from "../errors.ts";

const SALT_ROUNDS = 10;
const AVATAR_PATH = "/uploads/avatars";

export type RegisterInputType = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type BookInputType = {
  title: string;
  workKey: string;
  editionKey: string;
};

function assertValidId(id: string, label: string) {
  if (!isValidObjectId(id)) throw new ServiceError(400, `Invalid ${label}`);
}

export async function registerUser(input: RegisterInputType) {
  const hashed = await bcrypt.hash(String(input.password), SALT_ROUNDS);
  const user = await User.create({ ...input, password: hashed });
  const { password: _password, ...safe } = user.toObject();
  return safe;
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

export async function addBooks(id: string, books: BookInputType[]) {
  assertValidId(id, "user id");
  const saved = await Promise.all(
    books.map((b) =>
      Book.findOneAndUpdate(
        { editionKey: b.editionKey },
        { $setOnInsert: { title: b.title, workKey: b.workKey } },
        { upsert: true, new: true },
      ),
    ),
  );
  const user = await User.findByIdAndUpdate(
    id,
    { $addToSet: { books: { $each: saved.map((b) => b._id) } } },
    { new: true },
  ).populate("books");
  if (!user) throw new ServiceError(404, "User not found");
  return user;
}

export async function joinGroup(id: string, groupId: string) {
  if (!isValidObjectId(id) || !isValidObjectId(groupId))
    throw new ServiceError(400, "Invalid user id or group id");
  const [user, group] = await Promise.all([
    User.exists({ _id: id }),
    Group.findById(groupId),
  ]);
  if (!user || !group) throw new ServiceError(404, "User or group not found");
  if (group.visibility !== "public")
    throw new ServiceError(403, "This group is private");
  await Group.updateOne(
    { _id: groupId },
    { $addToSet: { members: new Types.ObjectId(id) } },
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
  const user = await User.findById(id).populate("books");
  if (!user) throw new ServiceError(404, "User not found");
  const groups = await Group.find({ members: user._id }).select("name");
  return { ...user.toObject(), groups };
}

export async function getAllUsers() {
  return User.find().select("name username avatar");
}
