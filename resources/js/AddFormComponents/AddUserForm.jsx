import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { X, Eye, EyeOff } from "lucide-react";
import Select from "react-select";

const PasswordInput = ({
    name,
    label,
    showPassword,
    setShowPassword,
    register,
    errors,
    apiErrors,
    required = true,
    placeholder = "",
    submitting = false,
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                {...register(name, {
                    required: required ? `${label} is required` : false,
                    minLength: required
                        ? {
                              value: 6,
                              message: "Password must be at least 6 characters",
                          }
                        : undefined,
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
                    errors[name] || apiErrors?.[name] ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={submitting}
            />
            <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                disabled={submitting}
            >
                {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                ) : (
                    <Eye className="h-5 w-5" />
                )}
            </button>
        </div>
        {errors[name] && (
            <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
        )}
        {apiErrors && apiErrors[name] && (
            <p className="mt-1 text-sm text-red-600">{apiErrors[name][0]}</p>
        )}
    </div>
);

const AddUserForm = ({ onSuccess, onCancel }) => {
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiErrors, setApiErrors] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
        clearErrors,
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
        },
    });

    // Role options for React Select
    const roleOptions = [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "developer", label: "Developer" },
        { value: "technician", label: "Technician" },
        { value: "accountant", label: "Accountant" },
    ];

    // Add useEffect to lock body scroll when form mounts
    useEffect(() => {
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
        };
    }, []);

    const watchPassword = watch("password");

    // Add password confirmation validation logic
    const validatePasswordConfirmation = (value) => {
        if (value !== watchPassword) {
            return "Passwords do not match";
        }
        return true;
    };

    // Handle Create User API Call
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourusers.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setApiErrors(error.response.data.errors);
                // Set errors in react-hook-form
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

        // Append all form data except confirmPassword
        const { confirmPassword, ...userData } = data;
        for (const key in userData) {
            if (userData[key] !== null && userData[key] !== "") {
                formData.append(key, userData[key]);
            }
        }

        try {
            setSubmitting(true);
            setApiErrors({});
            clearErrors();

            await handleCreate(formData);

            // Reset form and call success callback     
            reset();
            onSuccess();
        } catch (error) {
            console.log("Error saving data", error);
            if (!error.message || error.message !== "Validation failed") {
                alert("Error creating user. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Handle role change for React Select
    const handleRoleChange = (selectedOption) => {
        setValue("role", selectedOption ? selectedOption.value : "", {
            shouldValidate: true,
            shouldDirty: true,
        });
        // Clear role error when selection changes
        if (apiErrors.role) {
            setApiErrors((prev) => ({ ...prev, role: null }));
        }
    };

    // Get selected role value for React Select
    const selectedRole = roleOptions.find(option => option.value === watch("role"));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 text-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <h2 className="text-2xl font-bold">
                                Add New User
                            </h2>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            type="button"
                            disabled={submitting}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Name must be at least 2 characters",
                                        },
                                    })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.name || apiErrors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter user name"
                                    disabled={submitting}
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name.message}
                                </p>
                            )}
                            {apiErrors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {apiErrors.name[0]}
                                </p>
                            )}
                        </div>

                        {/* Email and Role Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address",
                                            },
                                        })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.email || apiErrors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter email address"
                                        disabled={submitting}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.email.message}
                                    </p>
                                )}
                                {apiErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {apiErrors.email[0]}
                                    </p>
                                )}
                            </div>

                            {/* Role with React Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    options={roleOptions}
                                    value={selectedRole}
                                    onChange={handleRoleChange}
                                    placeholder="Select a role"
                                    isDisabled={submitting}
                                    isSearchable={true}
                                    isClearable={false}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: (errors.role || apiErrors.role) 
                                                ? '#ef4444' 
                                                : state.isFocused 
                                                    ? '#3b82f6' 
                                                    : '#d1d5db',
                                            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                                            '&:hover': {
                                                borderColor: (errors.role || apiErrors.role) 
                                                    ? '#ef4444' 
                                                    : '#3b82f6'
                                            }
                                        }),
                                        menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 9999
                                        })
                                    }}
                                    menuPortalTarget={document.body}
                                />
                                {errors.role && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.role.message}
                                    </p>
                                )}
                                {apiErrors.role && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {apiErrors.role[0]}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Password Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PasswordInput
                                name="password"
                                label="Password"
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                register={register}
                                errors={errors}
                                apiErrors={apiErrors}
                                required={true}
                                placeholder="Enter password"
                                submitting={submitting}
                            />

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: validatePasswordConfirmation,
                                        })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
                                            errors.confirmPassword || apiErrors.confirmPassword
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder="Confirm password"
                                        disabled={submitting}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        disabled={submitting}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                                {apiErrors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {apiErrors.confirmPassword[0]}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                disabled={submitting}
                            >
                                {submitting ? (
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
                                        Creating...
                                    </span>
                                ) : (
                                    <span>Create User</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserForm;
