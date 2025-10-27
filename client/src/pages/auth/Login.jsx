import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../store/auth-slice";
import { loginFormControls } from "../../config";
import CommonForm from "../../components/common/Form";
import { showSnackbar } from "../../store/ui/snackbarslice";
import { HeadProvider, Title, Meta } from "react-head";

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
      <HeadProvider>
        <Title>Login</Title>
        <Meta name="description" content="Luxury fashion at Shoplulu" />
      </HeadProvider>
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
