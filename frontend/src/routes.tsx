import BookPage from "./components/books/BookPage";
import App from "./App";
import ErrorPage from "./ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "book/:bookName",
    element: <BookPage />,
  },
];

export default routes;
