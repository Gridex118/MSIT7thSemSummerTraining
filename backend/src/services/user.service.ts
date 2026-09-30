import { isValidObjectId, Types } from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.ts";
import { Book } from "../models/book.model.ts";
import { UserBook } from "../models/user_book.model.ts";
import { Group } from "../models/group.model.ts";
import { ServiceError } from "../errors.ts";
import { signToken } from "../middlewares/auth.middleware.ts";

const SALT_ROUNDS = 10;
const DUMMY_HASH = bcrypt.hashSync("dummy password", SALT_ROUNDS);
const AVATAR_PATH = "/uploads/avatars";

export type LoginInputType = { identifier: string; password: string };

export type RegisterInputType = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type BookInputType = {
  title: string;
  author: string;
  authorKey: string;
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

export async function addBooks(id: string, books: BookInputType[]) {
  assertValidId(id, "user id");
  const userExists = await User.exists({ _id: id });
  if (!userExists) throw new ServiceError(404, "User not found");
  const userId = new Types.ObjectId(id);
  await Promise.all(
    books.map(async (b) => {
      const book = await Book.findOneAndUpdate(
        { editionKey: b.editionKey },
        {
          $setOnInsert: {
            title: b.title,
            author: b.author,
            authorKey: b.authorKey,
            workKey: b.workKey,
          },
        },
        { upsert: true, new: true },
      );
      await UserBook.updateOne(
        { user: userId, book: book._id },
        { $setOnInsert: { user: userId, book: book._id } },
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
  return UserBook.find({ user: id }).populate("book", "title author");
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
  const user = await User.findById(id);
  if (!user) throw new ServiceError(404, "User not found");
  const groups = await Group.find({ members: user._id }).select("name");
  const books = await UserBook.find({ user: user._id }).populate("book");
  return { ...user.toObject(), groups, books };
}

export async function getAllUsers() {
  return User.find().select("name username avatar");
}
