import type { OpenLibraryBookType } from "../../../../backend/src/services/openLibrary";

export type BookType = {
  title: string;
  author: string;
  description: string;
  genres: string[];
  pages: number;
  firstPublished: string;
  stats: { reading: number; read: number; wantToRead: number };
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
  similarBooks: SimilarBookType[];
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
