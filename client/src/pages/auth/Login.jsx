import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../store/auth-slice";
import { loginFormControls } from "../../config";
import CommonForm from "../../components/common/Form";
import { showSnackbar } from "../../store/ui/snackbarslice";

const AuthLogin = () => {
  const initialState = {
    username: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await dispatch(loginUser(formData));
      if (data?.payload?.success) {
        dispatch(
          showSnackbar({
            message: "Login Successful",
            anchorOrigin: { vertical: "top", horizontal: "center" },
          })
        );
        localStorage.removeItem("guestId");
      } else {
        dispatch(
          showSnackbar({
            message: data?.payload?.message || "Login Failed",
            anchorOrigin: { vertical: "top", horizontal: "center" },
          })
        );
      }
    } catch (error) {
      dispatch(
        showSnackbar({
          message: error,
          anchorOrigin: { vertical: "top", horizontal: "center" },
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold  text-gray-900 mb-2">Welcome back</h1>
        <p className="text-lg text-gray-600 mb-2">
          Sign in to continue your shopping journey
        </p>

        <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 hover:underline"
              to="/auth/register"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-50 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-50 to-transparent rounded-full translate-y-16 -translate-x-16"></div>

        <div className="relative z-10">
          <CommonForm
            formControls={loginFormControls}
            buttonText={isLoading ? "Signing In..." : "Sign In"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />

          <div className="mt-8 space-y-4">
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="text-indigo-600 hover:text-indigo-700 transition-colors duration-200 hover:underline"
              >
                Forgot password?
              </Link>
              <Link
                to="/help"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                Need help?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
