import { useParams } from "react-router";

export default function BookPage() {
  const { bookName } = useParams();

  return (
    <div className="bg-blue-500 text-white p-4">
      <h1 className="text-3xl text-bold">
        <span className="font-bold">Book:</span> {bookName}
      </h1>
    </div>
  );
}
