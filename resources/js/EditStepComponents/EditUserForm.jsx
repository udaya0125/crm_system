import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { X } from "lucide-react";

const EditUserForm = ({ editingUser, onSuccess, onCancel }) => {
    const [submitting, setSubmitting] = useState(false);
    const [apiErrors, setApiErrors] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
        clearErrors,
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            role: "",
        },
    });

    // Use Effect - fixed dependency array
    useEffect(() => {
        if (editingUser) {
            reset({
                name: editingUser.name || "",
                email: editingUser.email || "",
                role: editingUser.role || "",
            });
        } else {
            reset({
                name: "",
                email: "",
                role: "",
            });
        }
        setApiErrors({});
        clearErrors();
    }, [editingUser, reset, clearErrors]);

    // Handle Update User
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ouruser.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setApiErrors(error.response.data.errors);
                // Set errors in react-hook-form & throw to stop submission
                Object.keys(error.response.data.errors).forEach((key) => {
                    setError(key, {
                        type: "server",
                        message: error.response.data.errors[key][0],
                    });
                });
                throw new Error("Validation failed");
            }
            throw error;
        }
    };

    // Handle Form Submit
    const onSubmit = async (data) => {
        const formData = new FormData();

        // Append all form data except email (since it shouldn't be changed)
        for (const key in data) {
            if (key !== "email" && data[key] !== null && data[key] !== "") {
                formData.append(key, data[key]);
            }
        }

        try {
            setSubmitting(true);
            setApiErrors({});
            clearErrors();

            // Editing existing user
            await handleUpdate(formData, editingUser.id);

            // Reset form and call success callback
            reset();
            onSuccess();
        } catch (error) {
            console.log("Error saving data", error);
            if (!error.message || error.message !== "Validation failed") {
                alert("Error updating user. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit User</h2>
                <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        {...register("name", {
                            required: "Name is required",
                            minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters",
                            },
                        })}
                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.name.message}
                        </p>
                    )}
                    {apiErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                            {apiErrors.name[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        {...register("email")}
                        readOnly
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                    </p>
                </div>

                {/* Role */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                    </label>
                    <select
                        {...register("role", { required: "Role is required" })}
                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.role ? "border-red-500" : "border-gray-300"
                        }`}
                    >
                        <option disabled value="">
                            Select Role
                        </option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    {errors.role && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.role.message}
                        </p>
                    )}
                    {apiErrors.role && (
                        <p className="text-red-500 text-xs mt-1">
                            {apiErrors.role[0]}
                        </p>
                    )}
                </div>

                <div className="flex space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition duration-200"
                    >
                        {submitting ? "Updating..." : "Update User"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserForm;
