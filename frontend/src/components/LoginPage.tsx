import { Link, useNavigate, Navigate } from "react-router";
import useAuth from "./useAuth";
import useTheme from "./useTheme";
import Navbar, { type NavbarLinkType } from "./common/Navbar";
import Footer from "./common/Footer";
import React, {
  useState,
  type SetStateAction,
  type SubmitEventHandler,
} from "react";

const LOGIN_URL = "/v1/users/login";
type LoginResType = { token: string; user: { _id: string } };
async function loginUser(input: { identifier: string; password: string }) {
  const response = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (response.status === 502) throw new Error("Could not connect to server");
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  const {
    token,
    user: { _id: userId },
  }: LoginResType = data;
  return { token, userId };
}

type LoginFormFieldProps = {
  name: string;
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
  placeholder: string;
  fieldType?: string;
};
function LoginFormField({
  name,
  value,
  setValue,
  placeholder,
  fieldType,
}: LoginFormFieldProps) {
  return (
    <input
      className="rounded-full border border-blue-300 p-2 px-4 text-sm font-semibold outline-0 focus:border-blue-100 dark:border-gray-700 focus:dark:border-gray-500"
      name={name}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      type={fieldType ? fieldType : "text"}
    />
  );
}

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, userId } = useAuth();
  const navigate = useNavigate();

  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault();
    try {
      const { token, userId } = await loginUser({
        identifier: usernameOrEmail,
        password,
      });
      login(token);
      navigate(`/user/${userId}`, { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(String(err));
      }
    }
  };

  if (userId) return <Navigate to={`/user/${userId}`} replace />;

  return (
    <form
      className="flex flex-col justify-center gap-8 px-4 py-8 md:min-w-80"
      id="login-form"
      onSubmit={handleSubmit}
    >
      <p className="self-center text-xl font-bold md:text-2xl">Welcome Back</p>
      <div className="flex flex-col gap-2">
        <LoginFormField
          value={usernameOrEmail}
          setValue={setUsernameOrEmail}
          name="login-user-name-email"
          placeholder="Username / Email"
        />
        <LoginFormField
          value={password}
          setValue={setPassword}
          name="login-password"
          placeholder="Password"
          fieldType="password"
        />
      </div>
      <div>
        <button className="w-full rounded-full border border-blue-300 bg-white p-2 text-sm font-bold text-blue-500 transition md:text-base dark:border-gray-700 dark:text-black [&:active,&:hover]:-translate-y-1">
          Login
        </button>
        <p className="mt-2 text-center text-sm font-bold dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            className="dark:text-white [&:hover,&:active]:underline"
            to="/register"
          >
            Sign Up
          </Link>
        </p>
        <p
          className={`text-center text-base font-semibold text-red-200 dark:text-red-400 ${!errorMessage && "!text-transparent"}`}
        >
          * {errorMessage}
        </p>
      </div>
    </form>
  );
}

function AsideQuoteHolder() {
  return (
    <div className="h-70 rounded-xl bg-blue-500 text-blue-500 md:h-120 md:w-80 dark:bg-gray-600 dark:text-black"></div>
  );
}

function LoginFormContainer() {
  return (
    <div className="mx-auto my-24 flex w-[90%] max-w-200 flex-col rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-700/40 md:flex-row md:justify-between md:p-4 dark:bg-black dark:shadow-black/60">
      <LoginForm />
      <AsideQuoteHolder />
    </div>
  );
}

export default function LoginPage() {
  const { darkMode } = useTheme();
  const navbarLinks: NavbarLinkType[] = [
    { label: "Home", href: "/" },
    { label: "Books", href: "/books" },
  ];

  return (
    <div
      className={`font-jetbrains-mono flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700 ${darkMode && "dark"}`}
    >
      <Navbar
        links={navbarLinks}
        forcesdBGColor="md:bg-blue-500 md:dark:bg-black"
      />
      <LoginFormContainer />
      <Footer />
    </div>
  );
}
