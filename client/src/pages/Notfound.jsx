import { ArrowLeft } from "lucide-react";
import { HeadProvider, Title, Meta } from "react-head";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#1A0C0B] px-6 text-center">
      <HeadProvider>
        <Title>Checkout</Title>
        <Meta name="description" content="Luxury fashion at Shoplulu" />
      </HeadProvider>
      <h1 className="text-8xl md:text-9xl font-light tracking-widest">404</h1>
      <p className="mt-4 text-sm uppercase tracking-[0.2em] text-gray-500">
        Oops! Page not found
      </p>

      <p className="mt-6 text-base md:text-lg text-gray-700 md:w-1/2">
        The page you’re looking for doesn’t exist or may have been moved. Don’t
        worry — let’s get you back to something beautiful.
      </p>

      <Link
        to="/"
        className="mt-10 inline-flex items-center gap-2 text-sm font-medium uppercase border border-[#1A0C0B] px-6 py-3 rounded-full transition-all hover:bg-[#1A0C0B] hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
