import { type BookType } from "../books/types";

export type GroupType = { slug: string; name: string; members: number };

export type UserType = {
  username: string;
  groups: GroupType[];
  books: BookType[];
};

export type DiscussionType = {
  id: number;
  title: string;
  bookTitle: string;
};

export type GroupDetailType = {
  name: string;
  description: string;
  members: number;
  discussions: DiscussionType[];
};

export type CommentType = {
  id: number;
  user: string;
  date: string;
  message: string;
};
