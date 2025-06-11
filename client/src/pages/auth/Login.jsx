// import CommonForm from "@/components/common/form";
// import { loginFormControls } from "@/config";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../store/auth-slice";
import { loginFormControls } from "../../config";
import CommonForm from "../../components/common/Form";

const AuthLogin = () => {
  const initialState = {
    username: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("FormData:", formData);
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        console.log("yes");
        localStorage.removeItem("guestId");
      } else {
        console.log("no");
      }
    });
  };
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">Don't have an account?</p>
        <Link
          className="font-medium text-primary hover:underline"
          to="/auth/register"
        >
          Register
        </Link>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthLogin;
