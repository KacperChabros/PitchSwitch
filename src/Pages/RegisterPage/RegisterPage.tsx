import React, { useState } from 'react';
import * as Yup from 'yup';
import { useAuth } from '../../Context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import GenericForm, { FormField } from '../../Components/GenericForm/GenericForm';

const RegisterPage: React.FC = () => {
    const { registerUser } = useAuth();
    const navigate = useNavigate();
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const fields: FormField[] = [
        {
            name: 'userName',
            label: 'Username',
            initialValue: '',
            type: 'text',
            validationSchema: Yup.string()
                .required('Username is required')
                .min(3, 'Username must be between 3 and 50 characters.')
                .max(50, 'Username must be between 3 and 50 characters.')
        },
        {
            name: 'email',
            label: 'Email',
            initialValue: '',
            type: 'text',
            validationSchema: Yup.string()
                .required('Email is required')
                .email('Invalid email address')
        },
        {
            name: 'password',
            label: 'Password',
            initialValue: '',
            type: 'password',
            validationSchema: Yup.string()
                .required('Password is required')
                .min(12, 'Password must be at least 12 characters long')
                .matches(/[0-9]/, 'Password must contain at least one digit')
                .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
                .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
                .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one non-alphanumeric character')
        },
        {
            name: 'firstName',
            label: 'First Name',
            initialValue: '',
            type: 'text',
            validationSchema: Yup.string()
                .required('First name is required')
                .min(2, 'First name must be between 2 and 50 characters.')
                .max(50, 'First name must be between 2 and 50 characters.')
        },
        {
            name: 'lastName',
            label: 'Last Name',
            initialValue: '',
            type: 'text',
            validationSchema: Yup.string()
                .required('Last name is required')
                .min(2, 'Last name must be between 2 and 50 characters.')
                .max(50, 'Last name must be between 2 and 50 characters.')
        },
        {
            name: 'bio',
            label: 'Bio',
            initialValue: '',
            type: 'textarea',
            validationSchema: Yup.string()
                .nullable()
                .max(500, 'Bio cannot be longer than 500 characters.')
        },
        {
            name: 'profilePicture',
            label: 'Profile Picture',
            initialValue: null,
            type: 'file'
        }
    ];

    function getErrorMessage(error: any): string {
        if (error.name === 'AxiosError') {
            return error.response?.data?.errors?.[0]?.description || `Error: ${error.message}`;
        }
        return `Unexpected error: ${error.message}`;
    }
    const handleRegister = async (formData: { [key: string]: any }) => {
        try {
            await registerUser(
                formData.userName,
                formData.email,
                formData.password,
                formData.firstName,
                formData.lastName,
                formData.bio,
                formData.profilePicture || profilePicture
            );
            toast.success("Registered successfully!");
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
                        Register
                    </h1>
                    <GenericForm fields={fields} onSubmit={handleRegister} isDarkFont={false}/>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Already a member?{" "}
                        <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;
