// Idea for having a common types folder from
// https://blog.logrocket.com/extend-express-request-object-typescript/

export type CoverSizeType = "S" | "M" | "L";

export type OpenLibraryAuthorIdentityType = {
  name: string;
  authorKey: string;
};

export type OpenLibraryBookType = {
  // title
  title: string;
  // key
  workKey: string;
  // subject
  subjects: string[];
  // author_name, author_key
  author: OpenLibraryAuthorIdentityType;
  // number_of_pages_median
  numPages: number;
  // editions.docs[0].key, just grab the one edition it prints out by default
  editionKey: string;
};

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

export type CreateGroupInputType = {
  name: string;
  description: string;
  owner: string;
};

export type CreateDiscussionInputType = {
  title: string;
  startedBy: string;
  book: { title: string; workKey: string; editionKey: string };
};

export type ChatContentType = "text" | "image";

export type CreateChatInputType = {
  sender: string;
  contentType: ChatContentType;
  content: string;
};

export type ProfileResponseType = {
  _id: string;
  name: string;
  username: string;
  groups: { _id: string; name: string; memberCount: number }[];
  books: {
    _id: string;
    book: {
      title: string;
      author?: string;
      workKey: string;
      editionKey: string;
    };
    readStatus: string;
  }[];
};
