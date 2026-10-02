import BookPage from "./components/books/BookPage";
import BookSearchPage from "./components/books/BookSearchPage";
import UserPage from "./components/people/UserPage";
import GroupPage from "./components/people/GroupPage";
import GroupListPage from "./components/people/GroupListPage";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
import App from "./App";
import ErrorPage from "./ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "books",
    element: <BookSearchPage />,
  },
  {
    path: "book/:workKey/:editionKey",
    element: <BookPage />,
  },
  {
    path: "user/:userId",
    element: <UserPage />,
  },
  {
    path: "group/:groupId",
    element: <GroupPage />,
  },
  {
    path: "groups",
    element: <GroupListPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegistrationPage />,
  },
];

export default routes;
