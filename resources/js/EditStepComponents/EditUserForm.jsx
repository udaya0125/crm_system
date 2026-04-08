import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { X } from "lucide-react";
import Select from "react-select";

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
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
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
                route("ourusers.update", { id }),
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 text-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <h2 className="text-2xl font-bold">
                                Edit User
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
                            {/* Email (Read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        {...register("email")}
                                        readOnly
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                        placeholder="Email cannot be changed"
                                    />
                                </div>
                                {/* <p className="text-xs text-gray-500 mt-1">
                                    Email address cannot be changed
                                </p> */}
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
                                        Updating...
                                    </span>
                                ) : (
                                    <span>Update User</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUserForm;




// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { X } from "lucide-react";

// const EditUserForm = ({ editingUser, onSuccess, onCancel }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [apiErrors, setApiErrors] = useState({});

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         reset,
//         setError,
//         clearErrors,
//     } = useForm({
//         defaultValues: {
//             name: "",
//             email: "",
//             role: "",
//         },
//     });

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

//     // Use Effect - fixed dependency array
//     useEffect(() => {
//         if (editingUser) {
//             reset({
//                 name: editingUser.name || "",
//                 email: editingUser.email || "",
//                 role: editingUser.role || "",
//             });
//         } else {
//             reset({
//                 name: "",
//                 email: "",
//                 role: "",
//             });
//         }
//         setApiErrors({});
//         clearErrors();
//     }, [editingUser, reset, clearErrors]);

//     // Handle Update User
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourusers.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );
//             return response.data;
//         } catch (error) {
//             if (error.response && error.response.data.errors) {
//                 setApiErrors(error.response.data.errors);
//                 // Set errors in react-hook-form & throw to stop submission
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

//         // Append all form data except email (since it shouldn't be changed)
//         for (const key in data) {
//             if (key !== "email" && data[key] !== null && data[key] !== "") {
//                 formData.append(key, data[key]);
//             }
//         }

//         try {
//             setSubmitting(true);
//             setApiErrors({});
//             clearErrors();

//             // Editing existing user
//             await handleUpdate(formData, editingUser.id);

//             // Reset form and call success callback
//             reset();
//             onSuccess();
//         } catch (error) {
//             console.log("Error saving data", error);
//             if (!error.message || error.message !== "Validation failed") {
//                 alert("Error updating user. Please try again.");
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                 <div className="p-6 text-gray-800">
//                     <div className="flex justify-between items-center mb-6">
//                         <div className="flex items-center space-x-3">
//                             <h2 className="text-2xl font-bold">
//                                 Edit User
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

//                         {/* Email (Read-only) */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Email
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type="email"
//                                     {...register("email")}
//                                     readOnly
//                                     disabled
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
//                                     placeholder="Email cannot be changed"
//                                 />
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1">
//                                 Email address cannot be changed
//                             </p>
//                         </div>

//                         {/* Role */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Role <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <select
//                                     {...register("role", { required: "Role is required" })}
//                                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
//                                         errors.role || apiErrors.role ? 'border-red-500' : 'border-gray-300'
//                                     }`}
//                                     disabled={submitting}
//                                 >
//                                     <option value="" disabled>Select a role</option>
//                                     <option value="admin">Admin</option>
//                                     <option value="salesteam">Sales Team</option>
//                                     <option value="projectmanager">Project Manager</option>
//                                     <option value="developer">Developer</option>
//                                     <option value="technician">Technician</option>
//                                     <option value="accountant">Accountant</option>
//                                     <option value="support">Support</option>
//                                     <option value="user">User</option>
//                                 </select>
//                                 {/* Custom dropdown arrow */}
//                                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                                     </svg>
//                                 </div>
//                             </div>
//                             {errors.role && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {errors.role.message}
//                                 </p>
//                             )}
//                             {apiErrors.role && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {apiErrors.role[0]}
//                                 </p>
//                             )}
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
//                                         Updating...
//                                     </span>
//                                 ) : (
//                                     <span>Update User</span>
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditUserForm;


