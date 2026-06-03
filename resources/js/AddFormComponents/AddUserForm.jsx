// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { X, Eye, EyeOff } from "lucide-react";
// import Select from "react-select";

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
//     submitting = false,
// }) => (
//     <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//             {label} {required && <span className="text-red-500">*</span>}
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
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
//                     errors[name] || apiErrors?.[name] ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 disabled={submitting}
//             />
//             <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                 onClick={() => setShowPassword(!showPassword)}
//                 disabled={submitting}
//             >
//                 {showPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                 ) : (
//                     <Eye className="h-5 w-5" />
//                 )}
//             </button>
//         </div>
//         {errors[name] && (
//             <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
//         )}
//         {apiErrors && apiErrors[name] && (
//             <p className="mt-1 text-sm text-red-600">{apiErrors[name][0]}</p>
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
//         setValue,
//     } = useForm({
//         defaultValues: {
//             name: "",
//             email: "",
//             password: "",
//             confirmPassword: "",
//             role: "",
//         },
//     });

//     // Role options for React Select
//     const roleOptions = [
//         { value: "admin", label: "Admin" },
//         { value: "manager", label: "Manager" },
//         { value: "developer", label: "Developer" },
//         { value: "technician", label: "Technician" },
//         { value: "accountant", label: "Accountant" },
//     ];

//     // Add useEffect to lock body scroll when form mounts
//     useEffect(() => {
//         // Lock body scroll
//         document.body.style.overflow = 'hidden';
//         document.body.style.position = 'fixed';
//         document.body.style.width = '100%';
        
//         // Cleanup function to restore scroll when component unmounts
//         return () => {
//             document.body.style.overflow = 'unset';
//             document.body.style.position = 'static';
//             document.body.style.width = 'auto';
//         };
//     }, []);

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
//             await axios.post(route("ourusers.store"), formData, {
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

//     // Handle role change for React Select
//     const handleRoleChange = (selectedOption) => {
//         setValue("role", selectedOption ? selectedOption.value : "", {
//             shouldValidate: true,
//             shouldDirty: true,
//         });
//         // Clear role error when selection changes
//         if (apiErrors.role) {
//             setApiErrors((prev) => ({ ...prev, role: null }));
//         }
//     };

//     // Get selected role value for React Select
//     const selectedRole = roleOptions.find(option => option.value === watch("role"));

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                 <div className="p-6 text-gray-800">
//                     <div className="flex justify-between items-center mb-6">
//                         <div className="flex items-center space-x-3">
//                             <h2 className="text-2xl font-bold">
//                                 Add New User
//                             </h2>
//                         </div>
//                         <button
//                             onClick={onCancel}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                             type="button"
//                             disabled={submitting}
//                         >
//                             <X className="w-6 h-6" />
//                         </button>
//                     </div>

//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                         {/* Name */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Name <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type="text"
//                                     {...register("name", {
//                                         required: "Name is required",
//                                         minLength: {
//                                             value: 2,
//                                             message: "Name must be at least 2 characters",
//                                         },
//                                     })}
//                                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                         errors.name || apiErrors.name ? 'border-red-500' : 'border-gray-300'
//                                     }`}
//                                     placeholder="Enter user name"
//                                     disabled={submitting}
//                                 />
//                             </div>
//                             {errors.name && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {errors.name.message}
//                                 </p>
//                             )}
//                             {apiErrors.name && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {apiErrors.name[0]}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Email and Role Row */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {/* Email */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Email <span className="text-red-500">*</span>
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type="email"
//                                         {...register("email", {
//                                             required: "Email is required",
//                                             pattern: {
//                                                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                                                 message: "Invalid email address",
//                                             },
//                                         })}
//                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                             errors.email || apiErrors.email ? 'border-red-500' : 'border-gray-300'
//                                         }`}
//                                         placeholder="Enter email address"
//                                         disabled={submitting}
//                                     />
//                                 </div>
//                                 {errors.email && (
//                                     <p className="mt-1 text-sm text-red-600">
//                                         {errors.email.message}
//                                     </p>
//                                 )}
//                                 {apiErrors.email && (
//                                     <p className="mt-1 text-sm text-red-600">
//                                         {apiErrors.email[0]}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Role with React Select */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Role <span className="text-red-500">*</span>
//                                 </label>
//                                 <Select
//                                     options={roleOptions}
//                                     value={selectedRole}
//                                     onChange={handleRoleChange}
//                                     placeholder="Select a role"
//                                     isDisabled={submitting}
//                                     isSearchable={true}
//                                     isClearable={false}
//                                     className="react-select-container"
//                                     classNamePrefix="react-select"
//                                     styles={{
//                                         control: (base, state) => ({
//                                             ...base,
//                                             borderColor: (errors.role || apiErrors.role) 
//                                                 ? '#ef4444' 
//                                                 : state.isFocused 
//                                                     ? '#3b82f6' 
//                                                     : '#d1d5db',
//                                             boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
//                                             '&:hover': {
//                                                 borderColor: (errors.role || apiErrors.role) 
//                                                     ? '#ef4444' 
//                                                     : '#3b82f6'
//                                             }
//                                         }),
//                                         menuPortal: (base) => ({
//                                             ...base,
//                                             zIndex: 9999
//                                         })
//                                     }}
//                                     menuPortalTarget={document.body}
//                                 />
//                                 {errors.role && (
//                                     <p className="mt-1 text-sm text-red-600">
//                                         {errors.role.message}
//                                     </p>
//                                 )}
//                                 {apiErrors.role && (
//                                     <p className="mt-1 text-sm text-red-600">
//                                         {apiErrors.role[0]}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Password Row */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <PasswordInput
//                                 name="password"
//                                 label="Password"
//                                 showPassword={showPassword}
//                                 setShowPassword={setShowPassword}
//                                 register={register}
//                                 errors={errors}
//                                 apiErrors={apiErrors}
//                                 required={true}
//                                 placeholder="Enter password"
//                                 submitting={submitting}
//                             />

//                             {/* Confirm Password */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Confirm Password <span className="text-red-500">*</span>
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type={showConfirmPassword ? "text" : "password"}
//                                         {...register("confirmPassword", {
//                                             required: "Please confirm your password",
//                                             validate: validatePasswordConfirmation,
//                                         })}
//                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
//                                             errors.confirmPassword || apiErrors.confirmPassword
//                                                 ? 'border-red-500'
//                                                 : 'border-gray-300'
//                                         }`}
//                                         placeholder="Confirm password"
//                                         disabled={submitting}
//                                     />
//                                     <button
//                                         type="button"
//                                         className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                                         onClick={() =>
//                                             setShowConfirmPassword(!showConfirmPassword)
//                                         }
//                                         disabled={submitting}
//                                     >
//                                         {showConfirmPassword ? (
//                                             <EyeOff className="h-5 w-5" />
//                                         ) : (
//                                             <Eye className="h-5 w-5" />
//                                         )}
//                                     </button>
//                                 </div>
//                                 {errors.confirmPassword && (
//                                     <p className="mt-1 text-sm text-red-600">
//                                         {errors.confirmPassword.message}
//                                     </p>
//                                 )}
//                                 {apiErrors.confirmPassword && (
//                                     <p className="mt-1 text-sm text-red-600">
//                                         {apiErrors.confirmPassword[0]}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Form Actions */}
//                         <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                             <button
//                                 type="button"
//                                 onClick={onCancel}
//                                 className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                 disabled={submitting}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                                 disabled={submitting}
//                             >
//                                 {submitting ? (
//                                     <span className="flex items-center">
//                                         <svg
//                                             className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                         >
//                                             <circle
//                                                 className="opacity-25"
//                                                 cx="12"
//                                                 cy="12"
//                                                 r="10"
//                                                 stroke="currentColor"
//                                                 strokeWidth="4"
//                                             />
//                                             <path
//                                                 className="opacity-75"
//                                                 fill="currentColor"
//                                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                                             />
//                                         </svg>
//                                         Creating...
//                                     </span>
//                                 ) : (
//                                     <span>Create User</span>
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddUserForm;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X, Eye, EyeOff, Camera } from "lucide-react";

const AddUserForm = ({ onSuccess, onCancel }) => {
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiErrors, setApiErrors] = useState({});
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        contact: "",
        password: "",
        password_confirmation: "",
        image: null,
        role: "technician",
    });

    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        return () => {
            document.body.style.overflow = "unset";
            document.body.style.position = "static";
            document.body.style.width = "auto";
        };
    }, []);

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({ ...prev, [name]: value }));
        // Clear api error for this field on change
        if (apiErrors[name]) {
            setApiErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        setUserForm((prev) => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiErrors({});

        // Client-side validation
        if (!userForm.name.trim()) return setApiErrors({ name: ["Name is required"] });
        if (!userForm.email.trim()) return setApiErrors({ email: ["Email is required"] });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email))
            return setApiErrors({ email: ["Please enter a valid email address"] });
        if (!userForm.password) return setApiErrors({ password: ["Password is required"] });
        if (userForm.password.length < 6)
            return setApiErrors({ password: ["Password must be at least 6 characters"] });
        if (userForm.password !== userForm.password_confirmation)
            return setApiErrors({ password_confirmation: ["Passwords do not match"] });

        const formData = new FormData();
        for (const key in userForm) {
            if (userForm[key] !== null && userForm[key] !== "") {
                formData.append(key, userForm[key]);
            }
        }

        try {
            setSubmitting(true);
            await axios.post(route("ourusers.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onSuccess?.();
        } catch (error) {
            if (error.response?.data?.errors) {
                setApiErrors(error.response.data.errors);
            } else {
                alert(error.response?.data?.message || "Error creating user. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        onCancel?.();
    };

    return (
        <div className="p-6 text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New User</h2>
                <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    type="button"
                    disabled={submitting}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-2">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <Camera className="w-12 h-12 mb-1" />
                                    <span className="text-xs">Add Photo</span>
                                </div>
                            )}
                        </div>
                        <label
                            htmlFor="add-image-upload"
                            className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition-colors shadow-lg"
                        >
                            <Camera className="w-4 h-4" />
                        </label>
                        <input
                            id="add-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={submitting}
                        />
                    </div>
                    <p className="text-xs text-gray-500">Click the camera icon to upload a profile picture</p>
                    {apiErrors.image && (
                        <p className="mt-1 text-sm text-red-600">{apiErrors.image[0]}</p>
                    )}
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={userForm.name}
                            onChange={handleChange}
                            placeholder="Enter user name"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                apiErrors.name ? "border-red-500" : "border-gray-300"
                            }`}
                            disabled={submitting}
                        />
                        {apiErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{apiErrors.name[0]}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                apiErrors.email ? "border-red-500" : "border-gray-300"
                            }`}
                            disabled={submitting}
                        />
                        {apiErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{apiErrors.email[0]}</p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="role"
                            value={userForm.role}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                                apiErrors.role ? "border-red-500" : "border-gray-300"
                            }`}
                            disabled={submitting}
                        >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="developer">Developer</option>
                            <option value="technician">Technician</option>
                            <option value="accountant">Accountant</option>
                        </select>
                        {apiErrors.role && (
                            <p className="mt-1 text-sm text-red-600">{apiErrors.role[0]}</p>
                        )}
                    </div>

                    {/* Contact */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact
                        </label>
                        <input
                            type="text"
                            name="contact"
                            value={userForm.contact}
                            onChange={handleChange}
                            placeholder="Enter contact number"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                apiErrors.contact ? "border-red-500" : "border-gray-300"
                            }`}
                            disabled={submitting}
                        />
                        {apiErrors.contact && (
                            <p className="mt-1 text-sm text-red-600">{apiErrors.contact[0]}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={userForm.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
                                    apiErrors.password ? "border-red-500" : "border-gray-300"
                                }`}
                                disabled={submitting}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                disabled={submitting}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {apiErrors.password && (
                            <p className="mt-1 text-sm text-red-600">{apiErrors.password[0]}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={userForm.password_confirmation}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
                                    apiErrors.password_confirmation ? "border-red-500" : "border-gray-300"
                                }`}
                                disabled={submitting}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                disabled={submitting}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {apiErrors.password_confirmation && (
                            <p className="mt-1 text-sm text-red-600">{apiErrors.password_confirmation[0]}</p>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
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
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
    );
};

export default AddUserForm;
