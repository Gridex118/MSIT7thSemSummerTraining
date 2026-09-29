import BookPage from "./components/books/BookPage";
import UserPage from "./components/people/UserPage";
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
    path: "book/:bookName",
    element: <BookPage />,
  },
  {
    path: "user/:userName",
    element: <UserPage />,
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
