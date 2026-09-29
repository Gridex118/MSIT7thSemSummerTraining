import { type BookType } from "../books/types";

export type GroupType = { slug: string; name: string; members: number };

export type UserType = {
  username: string;
  groups: GroupType[];
  books: BookType[];
};
