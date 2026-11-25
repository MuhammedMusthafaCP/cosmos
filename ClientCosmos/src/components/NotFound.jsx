import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-black px-4 text-center text-white">
      <div>
        <p className="font-poppins text-6xl font-bold tracking-widest">404</p>
        <h1 className="mt-4 text-xl font-semibold">Lost in space</h1>
        <p className="mt-2 text-sm text-gray-400">We couldn&apos;t find the page you were looking for.</p>
        <Link to="/HomePage" className="mt-6 inline-block rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-gray-200">
          Back to home
        </Link>
      </div>
    </div>
  );
}
