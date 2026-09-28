import { Link } from "react-router";
import Footer from "./components/common/Footer";

export default function ErrorPage() {
  return (
    <div className="flex h-screen flex-col bg-red-400">
      <main className="container m-auto flex flex-col items-center text-white">
        <div>
          <h1 className="text-5xl font-bold">ERROR: 404</h1>
          <p className="mt-2 mb-8 text-4xl">Page Not Found</p>
          <Link
            className="block w-fit rounded-full bg-white px-4 py-2 font-semibold text-red-400 shadow-red-600/50 transition [&:hover,&:active]:-translate-y-1 [&:hover,&:active]:shadow-md"
            to="/"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
