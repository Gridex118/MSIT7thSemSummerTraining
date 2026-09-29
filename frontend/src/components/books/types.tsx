export type BookType = {
  title: string;
  author: string;
  description: string;
  genres: string[];
  pages: number;
  firstPublished: string;
  stats: { reading: number; read: number; wantToRead: number };
};

export type SimilarBookType = { slug: string; title: string; author: string };

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
