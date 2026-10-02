import "dotenv/config";

import type {
  CoverSizeType,
  OpenLibraryBookType,
  OpenLibraryEditionType,
  OpenLibraryRawWorkType,
  OpenLibraryWorkType,
} from "../types.ts";

const SEARCH_BASE_URL = "https://openlibrary.org/search.json";
const WORK_BASE_URL = "https://openlibrary.org/works";
const EDITION_BASE_URL = "https://openlibrary.org/books";
const AUTHOR_BASE_URL = "https://openlibrary.org/authors";
const COVERS_BASE_URL = "http://covers.openlibrary.org/b";
const COVERS_OLID_URL = `${COVERS_BASE_URL}/olid`;

const REQUEST_HEADERS = {
  "User-Agent": `BooksGroup/0.1 (${process.env.USER_EMAIL ?? "example@example.org"})`,
};

type OpenLibrarySearchDocsType = {
  author_key: string;
  author_name: string;
  key: string;
  title: string;
  editions: { docs: { key: string }[] };
  number_of_pages_median: number;
  subject: string[];
};

async function fetchOpenLibrary(url: string): Promise<any> {
  const response = await fetch(url, { headers: REQUEST_HEADERS });
  if (!response.ok)
    throw Error(`Received Error Code ${response.status} from Open Library`);
  return response;
}

export function getOpenLibraryBookCoverURL(
  editionKey: string,
  size: CoverSizeType = "M",
): string {
  // Code taken from https://openlibrary.org/dev/docs/api/covers
  return `${COVERS_OLID_URL}/${editionKey}-${size}.jpg?default=false`;
}

export async function fetchOpenLibraryDescription(
  workId: string,
): Promise<null | string> {
  const url = `${WORK_BASE_URL}/${workId}.json`;
  const response = await fetchOpenLibrary(url);
  const json: { description: { value: string } } = await response.json();

  return json?.description?.value;
}

async function fetchOpenLibraryAuthorName(authorKey: string) {
  const url = `${AUTHOR_BASE_URL}/${authorKey}.json`;
  const response = await fetchOpenLibrary(url);
  const json: { personal_name?: string; name?: string } = await response.json();
  return json.personal_name ?? json.name ?? "Unknown Author";
}

export async function fetchOpenLibraryWorkAttributes(
  workKey: string,
): Promise<OpenLibraryWorkType | undefined> {
  const url = `${WORK_BASE_URL}/${workKey}.json`;
  const response = await fetchOpenLibrary(url);
  const json: OpenLibraryRawWorkType = await response.json();
  const description =
    typeof json.description === "string"
      ? json.description
      : json.description?.value;
  const authorKey =
    json.authors && json.authors[0].author.key.replace(/^\/authors\//, "");
  const author = authorKey && (await fetchOpenLibraryAuthorName(authorKey));
  return {
    title: json.title,
    description,
    subjects: json.subjects,
    author,
  };
}

export async function fetchOpenLibraryEditionAttributes(
  editionKey: string,
): Promise<OpenLibraryEditionType | undefined> {
  const url = `${EDITION_BASE_URL}/${editionKey}.json`;
  const response = await fetchOpenLibrary(url);
  const json: OpenLibraryEditionType = await response.json();
  return json;
}

function getOpenLibrarySearchRequestURL(
  query: string,
  limit: number,
  offset: number,
): string {
  return (
    `${SEARCH_BASE_URL}?` +
    `q=${encodeURIComponent(query.toLocaleLowerCase())}` +
    `&fields=key,title,author_name,author_key,editions,subject,number_of_pages_median` +
    `&language=eng` +
    `&limit=${limit}` +
    `&offset=${offset}`
  );
}

export async function fetchOpenLibrarySearch(
  searchString: string,
  limit = 10,
  page = 1,
): Promise<null | OpenLibraryBookType[]> {
  const url = getOpenLibrarySearchRequestURL(searchString, limit, page - 1);
  const response = await fetchOpenLibrary(url);
  const json: { docs: OpenLibrarySearchDocsType[] } = await response.json();

  return json?.docs.map((work) => {
    let workKey = work.key.replace(/^\/works\//, "");
    let editionKey = work.editions.docs[0].key.replace(/^\/books\//, "");

    return {
      title: work.title,
      author: { name: work.author_name, authorKey: work.author_key },
      workKey,
      editionKey,
      numPages: work.number_of_pages_median,
      subjects: work.subject,
    };
  });
}
