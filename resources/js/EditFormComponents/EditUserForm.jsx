// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { X } from "lucide-react";
// import Select from "react-select";

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
//         setValue,
//         watch,
//     } = useForm({
//         defaultValues: {
//             name: "",
//             email: "",
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

//                         {/* Email and Role Row */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {/* Email (Read-only) */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Email
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type="email"
//                                         {...register("email")}
//                                         readOnly
//                                         disabled
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
//                                         placeholder="Email cannot be changed"
//                                     />
//                                 </div>
//                                 {/* <p className="text-xs text-gray-500 mt-1">
//                                     Email address cannot be changed
//                                 </p> */}
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



import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Camera } from "lucide-react";

const EditUserForm = ({ editingUser, onSuccess, onCancel }) => {
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [apiErrors, setApiErrors] = useState({});
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        contact: "",
        role: "technician",
        image: null,
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

    // Populate form when editingUser changes
    useEffect(() => {
        if (editingUser) {
            setUserForm({
                name: editingUser.name || "",
                email: editingUser.email || "",
                contact: editingUser.contact || "",
                role: editingUser.role || "technician",
                image: null, // file input always starts empty
            });
            
            // Fix: Prefix the image path with 'storage/' for preview
            if (editingUser.image) {
                // If the image path already starts with 'storage/', use as is; otherwise add it
                const imagePath = editingUser.image.startsWith('storage/') 
                    ? editingUser.image 
                    : `storage/${editingUser.image}`;
                setImagePreview(imagePath);
            } else {
                setImagePreview(null);
            }
        }
        setApiErrors({});
    }, [editingUser]);

    // Cleanup blob URLs on unmount
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
        if (apiErrors[name]) {
            setApiErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Clean up old blob URL if it exists
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        
        setUserForm((prev) => ({ ...prev, image: file }));
        // Create blob URL for new file
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiErrors({});

        if (!userForm.name.trim()) return setApiErrors({ name: ["Name is required"] });
        if (!userForm.role) return setApiErrors({ role: ["Role is required"] });

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("name", userForm.name);
        formData.append("role", userForm.role);
        if (userForm.contact) formData.append("contact", userForm.contact);
        if (userForm.image) formData.append("image", userForm.image);

        try {
            setSubmitting(true);
            await axios.post(route("ourusers.update", { id: editingUser.id }), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onSuccess?.();
        } catch (error) {
            if (error.response?.data?.errors) {
                setApiErrors(error.response.data.errors);
            } else {
                alert(error.response?.data?.message || "Error updating user. Please try again.");
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
                <h2 className="text-2xl font-bold">Edit User</h2>
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
                                    onError={(e) => {
                                        // Handle image loading error
                                        e.target.onerror = null;
                                        e.target.parentElement.innerHTML = `
                                            <div class="flex flex-col items-center justify-center text-gray-400">
                                                <svg class="w-12 h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                                <span class="text-xs">No Image</span>
                                            </div>
                                        `;
                                    }}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <Camera className="w-12 h-12 mb-1" />
                                    <span className="text-xs">Add Photo</span>
                                </div>
                            )}
                        </div>
                        <label
                            htmlFor="edit-image-upload"
                            className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition-colors shadow-lg"
                        >
                            <Camera className="w-4 h-4" />
                        </label>
                        <input
                            id="edit-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={submitting}
                        />
                    </div>
                    <p className="text-xs text-gray-500">Click the camera icon to change profile picture</p>
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

                    {/* Email (read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userForm.email}
                            readOnly
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            placeholder="Email cannot be changed"
                        />
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
                                Updating...
                            </span>
                        ) : (
                            <span>Update User</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserForm;