import type { BookType } from "./types";

export default function BookDescription({ book }: { book: BookType }) {
  console.log(book.editionKey);

  return (
    <>
      <div>
        <h2 className="text-xl font-bold md:text-2xl">{book.title}</h2>
        <p className="text-sm font-semibold dark:text-gray-400">
          by {book.author}
        </p>
      </div>
      <p className="text-sm">{book.description}</p>
      <ul className="flex flex-wrap gap-2">
        {book.genres.map((genre) => (
          <li
            key={genre}
            className="rounded-full border border-blue-300 px-3 py-1 text-xs font-semibold dark:border-gray-700"
          >
            {genre}
          </li>
        ))}
      </ul>
    </>
  );
}
