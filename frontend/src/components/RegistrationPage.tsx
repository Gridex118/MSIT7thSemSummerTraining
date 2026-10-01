import { Link, Navigate, useNavigate } from "react-router";
import Navbar, { type NavbarLinkType } from "./common/Navbar";
import Footer from "./common/Footer";
import useAuth from "./useAuth";
import { useState, type SubmitEventHandler } from "react";
import type { RegisterInputType } from "@backend/types";

const REGISTER_URL = "/v1/users";
type RegistrationResType = { token: string; user: { _id: string } };
async function registerUser(input: RegisterInputType) {
  const response = await fetch(REGISTER_URL, {
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
  }: RegistrationResType = data;
  return { token, userId };
}

type RegistrationFormFieldProps = {
  name: string;
  value: string;
  setValue: (_: string) => void;
  placeholder: string;
  fieldType?: string;
};
function RegistrationFormField({
  name,
  value,
  setValue,
  placeholder,
  fieldType,
}: RegistrationFormFieldProps) {
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

function RegistrationForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const { login, userId } = useAuth();
  const navigate = useNavigate();

  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault();
    try {
      const { token, userId } = await registerUser({
        name: fullName,
        username,
        email,
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
      className="flex flex-col justify-center gap-8 px-4 py-8 md:min-w-80 lg:min-w-90"
      id="login-form"
      onSubmit={handleSubmit}
    >
      <p className="self-center text-xl font-bold md:text-2xl">
        Create an Account
      </p>
      <div className="flex flex-col gap-2">
        <RegistrationFormField
          value={fullName}
          setValue={setFullName}
          name="register-full-name"
          placeholder="Full Name"
        />
        <RegistrationFormField
          value={username}
          setValue={setUsername}
          name="register-username"
          placeholder="Username"
        />
        <RegistrationFormField
          value={email}
          setValue={setEmail}
          name="register-email"
          placeholder="Email"
          fieldType="email"
        />
        <RegistrationFormField
          value={password}
          setValue={(value) => {
            if (value !== repeatPassword) {
              setErrorMessage("Passwords do not match");
            } else {
              setErrorMessage("");
            }
            setPassword(value);
          }}
          name="register-password"
          placeholder="Password"
          fieldType="password"
        />
        <RegistrationFormField
          value={repeatPassword}
          setValue={(value) => {
            if (value !== password) {
              setErrorMessage("Passwords do not match");
            } else {
              setErrorMessage("");
            }
            setRepeatPassword(value);
          }}
          name="register-password-confirm"
          placeholder="Retype Password"
          fieldType="password"
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full rounded-full border border-blue-300 bg-white p-2 text-sm font-bold text-blue-500 transition md:text-base dark:border-gray-700 dark:text-black [&:active,&:hover]:-translate-y-1"
        >
          Create Account
        </button>
        <p className="mt-2 text-center text-sm font-bold dark:text-gray-400">
          Already have an account?{" "}
          <Link
            className="dark:text-white [&:hover,&:active]:underline"
            to="/login"
          >
            Sign In
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

function RegistrationFormContainer() {
  return (
    <div className="mx-auto my-24 flex w-[90%] max-w-200 flex-col rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-700/40 md:flex-row md:justify-between md:p-4 dark:bg-black dark:shadow-black/60">
      <RegistrationForm />
      <AsideQuoteHolder />
    </div>
  );
}

export default function RegistrationPage() {
  const navbarLinks: NavbarLinkType[] = [
    { label: "Home", href: "/" },
    { label: "Books", href: "/books" },
  ];

  return (
    <div className="font-jetbrains-mono flex min-h-screen flex-col bg-blue-500 dark:bg-gray-700">
      <Navbar
        links={navbarLinks}
        forcesdBGColor="md:bg-blue-500 md:dark:bg-black"
      />
      <RegistrationFormContainer />
      <Footer />
    </div>
  );
}
