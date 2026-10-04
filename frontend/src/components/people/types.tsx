import { type BookType } from "../books/types";

export type GroupType = { slug: string; name: string; members: number };

export type UserType = {
  name: string;
  avatar?: string;
  username: string;
  groups: GroupType[];
  books: BookType[];
};

export type DiscussionType = {
  id: string;
  title: string;
  bookTitle: string;
};

export type CommentType = {
  id: string;
  user: string;
  userId: string;
  date: string;
  message: string;
};

export type GroupSummaryType = {
  slug: string;
  name: string;
  members: number;
};
