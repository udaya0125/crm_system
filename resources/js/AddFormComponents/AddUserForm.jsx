// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { X } from "lucide-react";

// const PasswordInput = ({
//     name,
//     label,
//     showPassword,
//     setShowPassword,
//     register,
//     errors,
//     apiErrors,
//     required = true,
//     placeholder = "",
// }) => (
//     <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//             {label}
//         </label>
//         <div className="relative">
//             <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder={placeholder}
//                 {...register(name, {
//                     required: required ? `${label} is required` : false,
//                     minLength: required
//                         ? {
//                               value: 6,
//                               message: "Password must be at least 6 characters",
//                           }
//                         : undefined,
//                 })}
//                 className={`mt-1 block w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//                     errors[name] ? "border-red-500" : "border-gray-300"
//                 }`}
//             />
//             <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                 onClick={() => setShowPassword(!showPassword)}
//             >
//                 {showPassword ? (
//                     <svg
//                         className="h-5 w-5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                         />
//                     </svg>
//                 ) : (
//                     <svg
//                         className="h-5 w-5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//                         />
//                     </svg>
//                 )}
//             </button>
//         </div>
//         {errors[name] && (
//             <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
//         )}
//         {apiErrors && apiErrors[name] && (
//             <p className="text-red-500 text-xs mt-1">{apiErrors[name][0]}</p>
//         )}
//     </div>
// );

// const AddUserForm = ({ onSuccess, onCancel }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [apiErrors, setApiErrors] = useState({});

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         reset,
//         setError,
//         clearErrors,
//         watch,
//     } = useForm({
//         defaultValues: {
//             name: "",
//             email: "",
//             password: "",
//             confirmPassword: "",
//             role: "",
//         },
//     });

//     const watchPassword = watch("password");

//     // Add password confirmation validation logic
//     const validatePasswordConfirmation = (value) => {
//         if (value !== watchPassword) {
//             return "Passwords do not match";
//         }
//         return true;
//     };

//     // Handle Create User API Call
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ouruser.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//         } catch (error) {
//             if (error.response && error.response.data.errors) {
//                 setApiErrors(error.response.data.errors);
//                 // Set errors in react-hook-form
//                 Object.keys(error.response.data.errors).forEach((key) => {
//                     setError(key, {
//                         type: "server",
//                         message: error.response.data.errors[key][0],
//                     });
//                 });
//                 throw new Error("Validation failed");
//             }
//             throw error;
//         }
//     };

//     // Handle Form Submit                                                                               
//     const onSubmit = async (data) => {
//         const formData = new FormData();

//         // Append all form data except confirmPassword
//         const { confirmPassword, ...userData } = data;
//         for (const key in userData) {
//             if (userData[key] !== null && userData[key] !== "") {
//                 formData.append(key, userData[key]);
//             }
//         }

//         try {
//             setSubmitting(true);
//             setApiErrors({});
//             clearErrors();

//             await handleCreate(formData);

//             // Reset form and call success callback     
//             reset();
//             onSuccess();
//         } catch (error) {
//             console.log("Error saving data", error);
//             if (!error.message || error.message !== "Validation failed") {
//                 alert("Error creating user. Please try again.");
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     return (
//         <div className="bg-white p-6 rounded-lg">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Add New User</h2>
//                 <button
//                     onClick={onCancel}
//                     className="text-gray-500 hover:text-gray-700 text-2xl"
//                 >
//                     <X className="w-6 h-6" />
//                 </button>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Name
//                     </label>
//                     <input
//                         type="text"
//                         {...register("name", {
//                             required: "Name is required",
//                             minLength: {
//                                 value: 2,
//                                 message: "Name must be at least 2 characters",
//                             },
//                         })}
//                         className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//                             errors.name ? "border-red-500" : "border-gray-300"
//                         }`}
//                     />
//                     {errors.name && (
//                         <p className="text-red-500 text-xs mt-1">
//                             {errors.name.message}
//                         </p>
//                     )}
//                     {apiErrors.name && (
//                         <p className="text-red-500 text-xs mt-1">
//                             {apiErrors.name[0]}
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Email
//                     </label>
//                     <input
//                         type="email"
//                         {...register("email", {
//                             required: "Email is required",
//                             pattern: {
//                                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                                 message: "Invalid email address",
//                             },
//                         })}
//                         className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//                             errors.email ? "border-red-500" : "border-gray-300"
//                         }`}
//                     />
//                     {errors.email && (
//                         <p className="text-red-500 text-xs mt-1">
//                             {errors.email.message}
//                         </p>
//                     )}
//                     {apiErrors.email && (
//                         <p className="text-red-500 text-xs mt-1">
//                             {apiErrors.email[0]}
//                         </p>
//                     )}
//                 </div>

//                 <PasswordInput
//                     name="password"
//                     label="Password"
//                     showPassword={showPassword}
//                     setShowPassword={setShowPassword}
//                     register={register}
//                     errors={errors}
//                     apiErrors={apiErrors}
//                     required={true}
//                 />

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Confirm Password
//                     </label>
//                     <div className="relative">
//                         <input
//                             type={showConfirmPassword ? "text" : "password"}
//                             {...register("confirmPassword", {
//                                 required: "Please confirm your password",
//                                 validate: validatePasswordConfirmation,
//                             })}
//                             className={`mt-1 block w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//                                 errors.confirmPassword
//                                     ? "border-red-500"
//                                     : "border-gray-300"
//                             }`}
//                         />
//                         <button
//                             type="button"
//                             className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                             onClick={() =>
//                                 setShowConfirmPassword(!showConfirmPassword)
//                             }
//                         >
//                             {showConfirmPassword ? (
//                                 <svg
//                                     className="h-5 w-5"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                     />
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                     />
//                                 </svg>
//                             ) : (
//                                 <svg
//                                     className="h-5 w-5"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//                                     />
//                                 </svg>
//                             )}
//                         </button>
//                     </div>
//                     {errors.confirmPassword && (
//                         <p className="text-red-500 text-xs mt-1">
//                             {errors.confirmPassword.message}
//                         </p>
//                     )}
//                     {apiErrors.confirmPassword && (
//                         <p className="text-red-500 text-xs mt-1">
//                             {apiErrors.confirmPassword[0]}
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Role
//                     </label>
//                     <select
//                         {...register("role", { required: "Role is required" })}
//                         className={`mt-1 block w-full border rounded-md px-3 py-2  focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//                             errors.role ? "border-red-500" : "border-gray-300"
//                         }`}
//                     >
//                         <option disabled value="">
//                             Select Role
//                         </option>
//                         <option value="admin">Admin</option>
//                         <option value="user">User</option>
//                     </select>
//                     {errors.role && (
//                         <p className="text-red-500 text-xs mt-1">
//                             {errors.role.message}
//                         </p>
//                     )}
//                     {apiErrors.role && (
//                         <p className="text-red-500 text-xs mt-1">
//                             {apiErrors.role[0]}
//                         </p>
//                     )}
//                 </div>

//                 <div className="flex space-x-3 pt-4">
//                     <button
//                         type="button"
//                         onClick={onCancel}
//                         className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded  transition duration-200"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         disabled={submitting}
//                         className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition duration-200"
//                     >
//                         {submitting ? "Creating..." : "Create User"}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddUserForm;



import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { X, Eye, EyeOff } from "lucide-react";

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
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
        },
    });

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
            await axios.post(route("ouruser.store"), formData, {
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

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    {...register("role", { required: "Role is required" })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                                        errors.role || apiErrors.role ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={submitting}
                                >
                                    <option value="" disabled>Select a role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                                {/* Custom dropdown arrow */}
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
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