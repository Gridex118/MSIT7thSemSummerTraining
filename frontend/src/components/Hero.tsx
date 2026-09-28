import { Link } from "react-router";

function HeroBanner() {
  return (
    <>
      <p className="mb-1 text-3xl">
        Can't Decide What to Read Next?{" "}
        <span className="text-blue-100 dark:text-gray-400">
          Want to Connect With Fellow Book Readers?
        </span>
      </p>
      <p className="text-left text-blue-50 md:ml-auto md:max-w-[70%] md:text-right dark:text-gray-200">
        Discover your next great read with personalized recommendations, build
        your own library, and join reading groups to share reviews, ideas, and
        discussions with fellow readers.
      </p>
    </>
  );
}

export default function Hero() {
  return (
    <section
      id="app__hero"
      className="container m-auto flex h-screen max-w-200 flex-col justify-center gap-12 p-8 font-semibold text-white"
    >
      <HeroBanner />
      <div className="flex gap-2 md:mt-8 md:justify-center md:gap-8">
        <p className="transition [&:hover,&:active]:-translate-y-1 [&:hover,&:active]:shadow-md">
          <Link
            className="rounded-full bg-white px-6 py-2 text-sm text-blue-500 shadow-blue-600/80 md:text-base dark:text-black dark:shadow-gray-300/50 [&:hover,&:active]:shadow-md"
            to="login"
          >
            Login
          </Link>
        </p>
        <p>
          <Link
            className="rounded-full border-2 border-transparent px-6 py-2 text-sm text-blue-50 hover:border-blue-50/50 md:text-base dark:text-gray-200 hover:dark:border-gray-200/30"
            to="register"
          >
            Or Register
          </Link>
        </p>
      </div>
    </section>
  );
}
