import { type BookType } from "../books/types";

export type GroupType = { slug: string; name: string; members: number };

export type UserType = {
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
  id: number;
  user: string;
  date: string;
  message: string;
};

export type GroupSummaryType = {
  slug: string;
  name: string;
  members: number;
};
