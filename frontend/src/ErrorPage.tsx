import { Link } from "react-router";

export default function ErrorPage() {
  return (
    <div className="bg-red-300 p-4">
      <h1 className="text-3xl">Error: 404</h1>
      <p className="text-xl">Page not found</p>
      <Link className="text-blue-500" to="/">
        Go Home
      </Link>
    </div>
  );
}
