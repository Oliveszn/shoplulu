import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div
      className="flex min-h-screen w-full "
      style={{
        background: "linear-gradient(to bottom right, #f8fafc, #f1f5f9)",
      }}
    >
      {/* Left Side */}
      <div className="hidden lg:flex items-center justify-center relative w-1/2 px-12">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(to bottom right, #4f46e5, #9333ea, #db2777)",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-lg space-y-6 text-center">
          {/* Logo/Icon */}
          <div className="mx-auto w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/15">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-white leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                ShopLulu
              </span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Discover amazing products and enjoy seamless shopping experience
              with us.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12 sm:px-8 lg:px-12 relative">
        {/* background patt */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="relative z-10 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
