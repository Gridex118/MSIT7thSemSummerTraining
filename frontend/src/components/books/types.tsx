import type { OpenLibraryBookType } from "@backend/types";

export type BookType = {
  title: string;
  workKey: string;
  editionKey: string;
  author: string;
  description: string;
  genres: string[];
  pages: number;
  firstPublished: string;
  stats: { reading: number; read: number; wantToRead: number };
  readStatus?: string;
};

export type SimilarBookType = {
  slug: string;
  title: string;
  author: string;
};

export type ReviewType = {
  id: number;
  user: string;
  rating: number;
  content: string;
};

export type BookCommunityType = {
  reviews: ReviewType[];
};

export type SearchResultType = {
  workKey: string;
  editionKey: string;
  title: string;
  author: string;
  genres: string[];
  raw: OpenLibraryBookType;
};

export type ReadingStatusType = "reading" | "read" | "wantToRead";
