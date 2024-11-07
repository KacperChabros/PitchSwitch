import React, { useState } from 'react'
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from '../../Context/useAuth';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type Props = {}

type LoginFormInputs = {
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    bio?: string | null;
};

const validation = Yup.object().shape({
   userName: Yup.string()
  .required("Username is required")
  .min(3, "Username must be between 3 and 50 characters.")
  .max(50, "Username must be between 3 and 50 characters."),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),

  password: Yup.string()
    .required('Password is required')
    .min(12, 'Password must be at least 12 characters long')
    .matches(/[0-9]/, 'Password must contain at least one digit')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one non-alphanumeric character'),

  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be between 2 and 50 characters.")
    .max(50, "First name must be between 2 and 50 characters."),

  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be between 2 and 50 characters.")
    .max(50, "Last name must be between 2 and 50 characters."),

  profilePictureUrl: Yup.string()
    .nullable()
    .max(200, "Profile Picture Url must be between 2 and 200 characters."),

  bio: Yup.string()
    .nullable()
    .max(500, "Bio cannot be longer than 500 characters.")
});

function getErrorMessage(error: any): string {
    if (error.name === 'AxiosError') {
        return error.response?.data?.errors?.[0]?.description || `Error: ${error.message}`;
    }
    return `Unexpected error: ${error.message}`;
}


const RegisterPage = (props: Props) => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const {register, handleSubmit, formState: { errors }} = useForm<LoginFormInputs>({resolver: yupResolver(validation)})
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file && !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            toast.error("Only JPEG, PNG, or GIF image files are allowed.");
            return;
        }

        setProfilePicture(file);
        if (file) {
            setProfilePicturePreview(URL.createObjectURL(file));
        } else {
            setProfilePicturePreview(null);
        }
};

  const handleRegister = async (form: LoginFormInputs) => {
    try{
        const result = await registerUser(form.userName, form.email, form.password, form.firstName, form.lastName, form.bio, profilePicture);
        toast.success("Registered successfully!");
        navigate("/home");
    }catch(e: any){
        toast.error(getErrorMessage(e));
        console.error(e); 
    }
}


  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-8 px-6 mx-auto">
        <div className="w-full max-w-md bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Register
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleRegister)}>
                    <div>
                        <label
                            htmlFor="username"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Username"
                            {...register("userName")}
                        />
                        {errors.userName ? <p className="text-red-500">{errors.userName.message}</p> : ""}
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Email"
                            {...register("email")}
                        />
                        {errors.email ? <p className="text-red-500">{errors.email.message}</p> : ""}
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            {...register("password")}
                        />
                        {errors.password ? <p className="text-red-500">{errors.password.message}</p> : ""}
                    </div>
                    <div>
                        <label
                            htmlFor="firstName"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="First Name"
                            {...register("firstName")}
                        />
                        {errors.firstName ? <p className="text-red-500">{errors.firstName.message}</p> : ""}
                    </div>
                    <div>
                        <label
                            htmlFor="lastName"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Last Name"
                            {...register("lastName")}
                        />
                        {errors.lastName ? <p className="text-red-500">{errors.lastName.message}</p> : ""}
                    </div>
                    <div>
                        <label
                            htmlFor="bio"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Bio
                        </label>
                        <textarea
                        id="bio"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-32 resize-none"
                        placeholder="Tell us about yourself..."
                        {...register("bio")}
                    />
                        {errors.bio ? <p className="text-red-500">{errors.bio.message}</p> : ""}
                    </div>
                    <div className="flex flex-col items-center">
                        <label htmlFor="profilePicture" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Picture:</label>
                        <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border border-gray-300 rounded p-2 text-gray-900 dark:text-white w-full mb-4"
                        />
                        {profilePicturePreview && (
                            <img
                                src={profilePicturePreview}
                                alt="Profile Preview"
                                className="w-32 h-32 mt-4 rounded-full object-cover"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white bg-green-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        Sign up
                    </button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Already a member?{" "}
                        <Link to="/login"
                            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    </section>
  )
}

export default RegisterPage