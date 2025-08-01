import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { registerUser } from "../../store/auth-slice";
import { registerFormControls } from "../../config";
import CommonForm from "../../components/common/Form";
import { showSnackbar } from "../../store/ui/snackbarslice";

const AuthRegister = () => {
  const initialState = {
    username: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await dispatch(registerUser(formData));
      if (data?.payload?.success) {
        dispatch(
          showSnackbar({
            message: data?.payload?.message || "Registration successful",
            anchorOrigin: { vertical: "top", horizontal: "center" },
          })
        );
        localStorage.removeItem("guestId");
      } else {
        dispatch(
          showSnackbar({
            message: data?.payload?.message || "Registration failed",
            anchorOrigin: { vertical: "top", horizontal: "center" },
          })
        );
      }
    } catch (error) {
      dispatch(
        showSnackbar({
          message: "Registration error:",
          error,
          anchorOrigin: { vertical: "top", horizontal: "center" },
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
          Create account
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Join thousands of happy customers today
        </p>

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200 hover:underline"
              to="/auth/login"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-50 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-50 to-transparent rounded-full translate-y-16 -translate-x-16"></div>

        <div className="relative z-10">
          <CommonForm
            formControls={registerFormControls}
            buttonText={isLoading ? "Creating Account..." : "Create Account"}
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
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
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

              <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
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
        </div>
      </div>
    </div>
  );
};

export default AuthRegister;
