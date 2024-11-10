import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";

export type UpdateField = {
    name: string;
    label: string;
    initialValue: string | number | boolean | null; // Zmiana, żeby obsługiwać boolean (checkbox)
    type: "text" | "number" | "select" | "file" | "checkbox"; // Dodano 'checkbox'
    options?: { label: string; value: string | number }[];
    validationSchema?: Yup.AnySchema;
};

type UpdateFormProps = {
    fields: UpdateField[];
    onSubmit: (updatedFields: { [key: string]: string | number | File | boolean | null }) => void;
};

const imageFileValidation = (file: File | null) => {
    if (!file) {
        return true;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
        return new Yup.ValidationError("The file must be an image (jpeg, png, gif)", null, "file");
    }

    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
        return new Yup.ValidationError("The file size must be less than 3MB", null, "file");
    }

    return true;
};

const generateValidationSchema = (fields: UpdateField[]) => {
    const shape = fields.reduce((acc, field) => {
        if (field.validationSchema) {
            acc[field.name] = field.validationSchema;
        } else {
            if (field.type === "text") {
                acc[field.name] = Yup.string().required(`${field.label} is required`);
            } else if (field.type === "number") {
                acc[field.name] = Yup.number()
                    .typeError(`${field.label} must be a number`)
                    .required(`${field.label} is required`);
            } else if (field.type === "select") {
                acc[field.name] = Yup.string().required(`${field.label} is required`);
            } else if (field.type === "file") {
                acc[field.name] = Yup.mixed().nullable()
                    .test("is-image", "The file must be an image and <3MB", (value) => {
                        const file = value as File | null;
                        const validationResult = imageFileValidation(file);
                        if (validationResult !== true) {
                            return false;
                        }
                        return true;
                    });
            } else if (field.type === "checkbox") {
                // Checkbox nie jest wymagany
                acc[field.name] = Yup.boolean().nullable(); // Nullable, czyli może być zarówno true, false lub null
            }
        }
        return acc;
    }, {} as { [key: string]: Yup.AnySchema });

    return Yup.object().shape(shape);
};

const UpdateForm: React.FC<UpdateFormProps> = ({ fields, onSubmit }) => {
    const validationSchema = generateValidationSchema(fields);

    const formik = useFormik({
        initialValues: fields.reduce((acc, field) => {
            acc[field.name] = field.initialValue;
            return acc;
        }, {} as { [key: string]: string | number | File | boolean | null }),
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files ? e.target.files[0] : null;
        formik.setFieldValue(fieldName, file);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        formik.setFieldValue(fieldName, e.target.checked);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="w-full max-w-2xl mx-auto overflow-hidden">
            <div className="max-h-[80vh] overflow-y-auto">
                {fields.map((field) => (
                    <div key={field.name} className="mb-4">
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                            {field.label}
                        </label>
                        {field.type === "text" && (
                            <input
                                type="text"
                                id={field.name}
                                name={field.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values[field.name] as string}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                            />
                        )}
                        {field.type === "number" && (
                            <input
                                type="number"
                                id={field.name}
                                name={field.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values[field.name] as number}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                            />
                        )}
                        {field.type === "select" && field.options && (
                            <Select
                                id={field.name}
                                name={field.name}
                                value={field.options.find(
                                    (option) => option.value === formik.values[field.name]
                                )}
                                onChange={(selectedOption: any) => {
                                    formik.setFieldValue(field.name, selectedOption.value);
                                }}
                                options={field.options}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value.toString()}
                            />
                        )}
                        {field.type === "file" && (
                            <input
                                type="file"
                                id={field.name}
                                name={field.name}
                                onChange={(e) => handleFileChange(e, field.name)}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                            />
                        )}
                        {field.type === "checkbox" && (
                            <input
                                type="checkbox"
                                id={field.name}
                                name={field.name}
                                onChange={(e) => handleCheckboxChange(e, field.name)}
                                checked={formik.values[field.name] as boolean}
                                className="mt-1"
                            />
                        )}
                        {formik.touched[field.name] && formik.errors[field.name] ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors[field.name]}</div>
                        ) : null}
                    </div>
                ))}
            </div>
            <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Submit
            </button>
        </form>
    );
};

export default UpdateForm;
