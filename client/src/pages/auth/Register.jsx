import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { registerUser } from "../../store/auth-slice";
import { registerFormControls } from "../../config";
import CommonForm from "../../components/common/Form";
import { showSnackbar } from "../../store/ui/snackbarslice";
import { HeadProvider, Title, Meta } from "react-head";

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
      <HeadProvider>
        <Title>Register</Title>
        <Meta name="description" content="Luxury fashion at Shoplulu" />
      </HeadProvider>
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
        </div>
      </div>
    </div>
  );
};

export default AuthRegister;
