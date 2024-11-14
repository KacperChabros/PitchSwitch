import React, { useState } from "react";
import * as Yup from "yup";
import { useAuth } from "../../Context/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import GenericForm, { FormField } from "../../Components/GenericForm/GenericForm";

const LoginPage: React.FC = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const fields: FormField[] = [
    {
      name: "userName",
      label: "Username",
      initialValue: "",
      type: "text",
      validationSchema: Yup.string().required("Username is required"),
    },
    {
      name: "password",
      label: "Password",
      initialValue: "",
      type: "password",
      validationSchema: Yup.string().required("Password is required"),
    },
  ];

  function getErrorMessage(error: any): string {
    if (error.name === "AxiosError") {
      return (
        error.response?.data || `Error: ${error.message}`
      );
    }
    return `Unexpected error: ${error.message}`;
  }

  const handleLogin = async (formData: { [key: string]: any }) => {
    try {
      await loginUser(formData.userName, formData.password);
      toast.success("Login Success!");
      navigate("/home");
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-8 px-6 mx-auto">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <GenericForm
            fields={fields}
            onSubmit={handleLogin}
            isDarkFont={false}
          />
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
