import React, { useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { X } from "lucide-react";
import Select from "react-select"; // Add this import

const AddTaskAssigned = ({
    setReloadTrigger,
    showForm,
    setShowForm,
    users,
}) => {
    const { props } = usePage();
    const user = props.auth.user;

    // Transform users data for react-select format
    const userOptions = React.useMemo(() => {
        if (!Array.isArray(users)) return [];
        return users.map(user => ({
            value: user.id,
            label: `${user.name} (${user.email})`
        }));
    }, [users]);

    // Custom styles for react-select
    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
            '&:hover': {
                borderColor: '#3b82f6'
            },
            minHeight: '42px',
            borderRadius: '0.5rem',
        }),
        option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected ? '#3b82f6' : isFocused ? '#e5e7eb' : 'white',
            color: isSelected ? 'white' : '#374151',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: isSelected ? '#2563eb' : '#d1d5db'
            }
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }),
        placeholder: (base) => ({
            ...base,
            color: '#9ca3af'
        }),
        singleValue: (base) => ({
            ...base,
            color: '#374151'
        })
    };

    // Add useEffect to lock body scroll when form mounts
    useEffect(() => {
        if (showForm && user.role === "admin") {
            // Lock body scroll
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        }
        
        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
        };
    }, [showForm, user.role]);

    // Quill editor configuration
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
    ];

    const {
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        watch,
        formState: { errors, isSubmitting, isValid, isDirty },
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            user_id: "",
        },
        mode: "onChange",
    });

    // Watch description for validation feedback
    const descriptionValue = watch("description");

    // Check if user is admin
    useEffect(() => {
        if (user.role !== "admin") {
            setShowForm(false);
        }
    }, [user.role, setShowForm]);

    // Reset form when opening
    useEffect(() => {
        if (showForm) {
            reset({
                title: "",
                description: "",
                user_id: "",
            });
            clearErrors();
        }
    }, [showForm, reset, clearErrors]);

    // Handle Create Task
    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(
                route("ourtasklist.store"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                setReloadTrigger((prev) => !prev);
                return response.data;
            } else {
                throw new Error(
                    response.data.message || "Failed to create task"
                );
            }
        } catch (error) {
            handleApiErrors(error);
            throw error;
        }
    };

    // Handle API errors
    const handleApiErrors = (error) => {
        if (error.response?.data?.errors) {
            Object.entries(error.response.data.errors).forEach(
                ([field, messages]) => {
                    setError(field, {
                        type: "manual",
                        message: Array.isArray(messages)
                            ? messages[0]
                            : messages,
                    });
                }
            );
        } else {
            setError("root.server", {
                type: "manual",
                message:
                    error.response?.data?.message || "Error processing request",
            });
        }
    };

    // Handle Form Submission
    const onSubmit = async (data) => {
        // Check if user is admin
        if (user.role !== "admin") {
            alert("Only admins can assign tasks");
            return;
        }

        const formData = new FormData();

        // Append all form data
        for (const key in data) {
            if (data[key] !== null && data[key] !== "") {
                formData.append(key, data[key]);
            }
        }

        try {
            clearErrors(); // Clear previous errors

            // Creating new task
            await handleCreate(formData);

            // Reset form and close
            reset({
                title: "",
                description: "",
                user_id: "",
            });

            setShowForm(false);
        } catch (error) {
            console.log("Error saving data", error);
        }
    };

    // Handle Close
    const handleClose = () => {
        reset({
            title: "",
            description: "",
            user_id: "",
        });
        clearErrors();
        setShowForm(false);
    };

    if (!showForm || user.role !== "admin") return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 text-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <h2 className="text-2xl font-bold">
                                Assign New Task
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            type="button"
                            disabled={isSubmitting}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* General Error Message */}
                    {errors.root?.server && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">
                                {errors.root.server.message}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Task Title and Assign to User - Flex Row */}
                        <div className="flex gap-4">
                            {/* Task Title - Takes 50% width */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Task Title <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="title"
                                    control={control}
                                    rules={{
                                        required: "Task title is required",
                                        maxLength: {
                                            value: 100,
                                            message:
                                                "Title must be less than 100 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.title ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            type="text"
                                            {...field}
                                            placeholder="Enter task title"
                                            disabled={isSubmitting}
                                            aria-invalid={
                                                errors.title ? "true" : "false"
                                            }
                                        />
                                    )}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Assign to User - Takes 50% width */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assign to User <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="user_id"
                                    control={control}
                                    rules={{ required: "Please select a user" }}
                                    render={({ field }) => (
                                        <Select
                                            options={userOptions}
                                            value={userOptions.find(option => option.value === field.value) || null}
                                            onChange={(selectedOption) => {
                                                field.onChange(selectedOption ? selectedOption.value : '');
                                            }}
                                            onBlur={field.onBlur}
                                            placeholder="Select a user..."
                                            isDisabled={isSubmitting}
                                            isClearable={true}
                                            isSearchable={true}
                                            styles={{
                                                ...customSelectStyles,
                                                control: (base, state) => ({
                                                    ...customSelectStyles.control(base, state),
                                                    borderColor: errors.user_id ? '#ef4444' : base.borderColor,
                                                })
                                            }}
                                            className={errors.user_id ? 'react-select-error' : ''}
                                            classNamePrefix="react-select"
                                            noOptionsMessage={() => "No users available"}
                                            loadingMessage={() => "Loading users..."}
                                        />
                                    )}
                                />
                                {errors.user_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.user_id.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description - Full Width */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{
                                    maxLength: {
                                        value: 2000,
                                        message:
                                            "Description must be less than 2000 characters",
                                    },
                                    validate: {
                                        noMaliciousTags: (value) => {
                                            if (!value) return true;
                                            // Basic check for script tags
                                            const hasScriptTags =
                                                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(
                                                    value
                                                );
                                            return (
                                                !hasScriptTags ||
                                                "Description contains invalid content"
                                            );
                                        },
                                    },
                                }}
                                render={({ field }) => (
                                    <>
                                        <div
                                            className={`border rounded-lg overflow-hidden ${
                                                errors.description
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                        >
                                            <ReactQuill
                                                theme="snow"
                                                modules={quillModules}
                                                formats={quillFormats}
                                                value={field.value}
                                                placeholder="Enter task description..."
                                                readOnly={isSubmitting}
                                                className="h-64"
                                                onChange={(content) => {
                                                    field.onChange(content);
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !isValid || !isDirty}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    <span>Assign Task</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTaskAssigned;
