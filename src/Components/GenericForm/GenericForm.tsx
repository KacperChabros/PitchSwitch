import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";

export type FormField = {
    name: string;
    label: string;
    initialValue: string | number | boolean | null | Date;
    type: "text" | "number" | "select" | "file" | "checkbox" | "date" | "textarea";  // Dodajemy "textarea"
    options?: { label: string; value: string | number }[];
    validationSchema?: Yup.AnySchema;
};

type FormProps = {
    fields: FormField[];
    onSubmit: (formFields: { [key: string]: string | number | File | boolean | null | Date }) => void;
};

const imageFileValidation = (file: File | null) => {
    if (!file) return true;

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

const generateValidationSchema = (fields: FormField[]) => {
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
                        return imageFileValidation(file) === true;
                    });
            } else if (field.type === "checkbox") {
                acc[field.name] = Yup.boolean().nullable();
            } else if (field.type === "date") {
                acc[field.name] = Yup.date().nullable().required(`${field.label} is required`);
            }
        }
        return acc;
    }, {} as { [key: string]: Yup.AnySchema });

    return Yup.object().shape(shape);
};

const GenericForm: React.FC<FormProps> = ({ fields, onSubmit }) => {
    const validationSchema = generateValidationSchema(fields);

    const formik = useFormik({
        initialValues: fields.reduce((acc, field) => {
            acc[field.name] = field.initialValue;
            return acc;
        }, {} as { [key: string]: string | number | File | boolean | null | Date }),
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
                        {field.type === "textarea" && (
                            <textarea
                                id={field.name}
                                name={field.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values[field.name] as string}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                rows={5}
                            />
                        )}
                        {field.type === "date" && (
                            <input
                                type="date"
                                id={field.name}
                                name={field.name}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : null;
                                    formik.setFieldValue(field.name, date);
                                }}
                                onBlur={formik.handleBlur}
                                value={
                                    formik.values[field.name] instanceof Date
                                        ? (formik.values[field.name] as Date).toISOString().split('T')[0]
                                        : ""
                                }
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
                                maxMenuHeight={200}
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

export default GenericForm;
