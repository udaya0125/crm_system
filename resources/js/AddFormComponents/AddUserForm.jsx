// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { X, Eye, EyeOff, Camera } from "lucide-react";

// const AddUserForm = ({ onSuccess, onCancel }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [apiErrors, setApiErrors] = useState({});
//     const [userForm, setUserForm] = useState({
//         name: "",
//         email: "",
//         contact: "",
//         password: "",
//         password_confirmation: "",
//         image: null,
//         role: "technician",
//     });

//     useEffect(() => {
//         document.body.style.overflow = "hidden";
//         document.body.style.position = "fixed";
//         document.body.style.width = "100%";
//         return () => {
//             document.body.style.overflow = "unset";
//             document.body.style.position = "static";
//             document.body.style.width = "auto";
//         };
//     }, []);

//     useEffect(() => {
//         return () => {
//             if (imagePreview && imagePreview.startsWith("blob:")) {
//                 URL.revokeObjectURL(imagePreview);
//             }
//         };
//     }, [imagePreview]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUserForm((prev) => ({ ...prev, [name]: value }));
//         if (apiErrors[name]) {
//             setApiErrors((prev) => ({ ...prev, [name]: null }));
//         }
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         if (imagePreview && imagePreview.startsWith("blob:")) {
//             URL.revokeObjectURL(imagePreview);
//         }
//         setUserForm((prev) => ({ ...prev, image: file }));
//         setImagePreview(URL.createObjectURL(file));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setApiErrors({});

//         if (!userForm.name.trim()) return setApiErrors({ name: ["Name is required"] });
//         if (!userForm.email.trim()) return setApiErrors({ email: ["Email is required"] });
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email))
//             return setApiErrors({ email: ["Please enter a valid email address"] });
//         if (!userForm.password) return setApiErrors({ password: ["Password is required"] });
//         if (userForm.password.length < 6)
//             return setApiErrors({ password: ["Password must be at least 6 characters"] });
//         if (userForm.password !== userForm.password_confirmation)
//             return setApiErrors({ password_confirmation: ["Passwords do not match"] });

//         const formData = new FormData();
//         for (const key in userForm) {
//             if (userForm[key] !== null && userForm[key] !== "") {
//                 formData.append(key, userForm[key]);
//             }
//         }

//         try {
//             setSubmitting(true);
//             await axios.post(route("ourusers.store"), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             onSuccess?.();
//         } catch (error) {
//             if (error.response?.data?.errors) {
//                 setApiErrors(error.response.data.errors);
//             } else {
//                 alert(error.response?.data?.message || "Error creating user. Please try again.");
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleCancel = () => {
//         if (imagePreview && imagePreview.startsWith("blob:")) {
//             URL.revokeObjectURL(imagePreview);
//         }
//         onCancel?.();
//     };

//     return (
//         /* Scrollable inner container so content never clips on small screens */
//         <div className="p-4 sm:p-6 text-gray-800 max-h-[90vh] overflow-y-auto">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-5 sm:mb-6 sticky top-0 bg-white z-10 pb-3 border-b border-gray-100">
//                 <h2 className="text-xl sm:text-2xl font-bold">Add New User</h2>
//                 <button
//                     onClick={handleCancel}
//                     className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
//                     type="button"
//                     disabled={submitting}
//                 >
//                     <X className="w-5 h-5 sm:w-6 sm:h-6" />
//                 </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
//                 {/* Profile Image Upload */}
//                 <div className="flex flex-col items-center">
//                     <div className="relative mb-2">
//                         <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
//                             {imagePreview ? (
//                                 <img
//                                     src={imagePreview}
//                                     alt="Profile"
//                                     className="w-full h-full object-cover"
//                                 />
//                             ) : (
//                                 <div className="flex flex-col items-center justify-center text-gray-400">
//                                     <Camera className="w-10 h-10 sm:w-12 sm:h-12 mb-1" />
//                                     <span className="text-xs">Add Photo</span>
//                                 </div>
//                             )}
//                         </div>
//                         <label
//                             htmlFor="add-image-upload"
//                             className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition-colors shadow-lg"
//                         >
//                             <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//                         </label>
//                         <input
//                             id="add-image-upload"
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="hidden"
//                             disabled={submitting}
//                         />
//                     </div>
//                     <p className="text-xs text-gray-500 text-center">Click the camera icon to upload a profile picture</p>
//                     {apiErrors.image && (
//                         <p className="mt-1 text-sm text-red-600">{apiErrors.image[0]}</p>
//                     )}
//                 </div>

//                 {/* Fields Grid — 1 col on mobile, 2 col on sm+ */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     {/* Name */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={userForm.name}
//                             onChange={handleChange}
//                             placeholder="Enter user name"
//                             className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                 apiErrors.name ? "border-red-500" : "border-gray-300"
//                             }`}
//                             disabled={submitting}
//                         />
//                         {apiErrors.name && (
//                             <p className="mt-1 text-xs text-red-600">{apiErrors.name[0]}</p>
//                         )}
//                     </div>

//                     {/* Email */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Email <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={userForm.email}
//                             onChange={handleChange}
//                             placeholder="Enter email address"
//                             className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                 apiErrors.email ? "border-red-500" : "border-gray-300"
//                             }`}
//                             disabled={submitting}
//                         />
//                         {apiErrors.email && (
//                             <p className="mt-1 text-xs text-red-600">{apiErrors.email[0]}</p>
//                         )}
//                     </div>

//                     {/* Role */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Role <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                             name="role"
//                             value={userForm.role}
//                             onChange={handleChange}
//                             className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
//                                 apiErrors.role ? "border-red-500" : "border-gray-300"
//                             }`}
//                             disabled={submitting}
//                         >
//                             <option value="admin">Admin</option>
//                             <option value="manager">Manager</option>
//                             <option value="developer">Developer</option>
//                             <option value="technician">Technician</option>
//                             <option value="accountant">Accountant</option>
//                         </select>
//                         {apiErrors.role && (
//                             <p className="mt-1 text-xs text-red-600">{apiErrors.role[0]}</p>
//                         )}
//                     </div>

//                     {/* Contact */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Contact
//                         </label>
//                         <input
//                             type="text"
//                             name="contact"
//                             value={userForm.contact}
//                             onChange={handleChange}
//                             placeholder="Enter contact number"
//                             className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                 apiErrors.contact ? "border-red-500" : "border-gray-300"
//                             }`}
//                             disabled={submitting}
//                         />
//                         {apiErrors.contact && (
//                             <p className="mt-1 text-xs text-red-600">{apiErrors.contact[0]}</p>
//                         )}
//                     </div>

//                     {/* Password */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Password <span className="text-red-500">*</span>
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 name="password"
//                                 value={userForm.password}
//                                 onChange={handleChange}
//                                 placeholder="Enter password"
//                                 className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
//                                     apiErrors.password ? "border-red-500" : "border-gray-300"
//                                 }`}
//                                 disabled={submitting}
//                                 autoComplete="new-password"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                                 disabled={submitting}
//                             >
//                                 {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
//                             </button>
//                         </div>
//                         {apiErrors.password && (
//                             <p className="mt-1 text-xs text-red-600">{apiErrors.password[0]}</p>
//                         )}
//                     </div>

//                     {/* Confirm Password */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Confirm Password <span className="text-red-500">*</span>
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 name="password_confirmation"
//                                 value={userForm.password_confirmation}
//                                 onChange={handleChange}
//                                 placeholder="Confirm password"
//                                 className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
//                                     apiErrors.password_confirmation ? "border-red-500" : "border-gray-300"
//                                 }`}
//                                 disabled={submitting}
//                                 autoComplete="new-password"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                                 disabled={submitting}
//                             >
//                                 {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
//                             </button>
//                         </div>
//                         {apiErrors.password_confirmation && (
//                             <p className="mt-1 text-xs text-red-600">{apiErrors.password_confirmation[0]}</p>
//                         )}
//                     </div>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
//                     <button
//                         type="button"
//                         onClick={handleCancel}
//                         className="px-3 py-2 sm:px-4 sm:py-2 text-sm border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={submitting}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="px-3 py-2 sm:px-4 sm:py-2 text-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
//                         disabled={submitting}
//                     >
//                         {submitting ? (
//                             <>
//                                 <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                                 </svg>
//                                 Creating...
//                             </>
//                         ) : (
//                             "Create User"
//                         )}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddUserForm;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Eye, EyeOff, Camera } from "lucide-react";

const AddUserForm = ({ onSuccess, onCancel, onError }) => {
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
            // Parent fires toast + reloadTrigger
            onSuccess?.();
        } catch (error) {
            if (error.response?.data?.errors) {
                // Laravel validation errors — show inline, no toast
                setApiErrors(error.response.data.errors);
            } else {
                // Unexpected error — let parent show toast
                onError?.();
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
        <div className="p-4 sm:p-6 text-gray-800 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 sm:mb-6 sticky top-0 bg-white z-10 pb-3 border-b border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold">Add New User</h2>
                <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    type="button"
                    disabled={submitting}
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-2">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <Camera className="w-10 h-10 sm:w-12 sm:h-12 mb-1" />
                                    <span className="text-xs">Add Photo</span>
                                </div>
                            )}
                        </div>
                        <label
                            htmlFor="add-image-upload"
                            className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition-colors shadow-lg"
                        >
                            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                    <p className="text-xs text-gray-500 text-center">Click the camera icon to upload a profile picture</p>
                    {apiErrors.image && (
                        <p className="mt-1 text-sm text-red-600">{apiErrors.image[0]}</p>
                    )}
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                apiErrors.name ? "border-red-500" : "border-gray-300"
                            }`}
                            disabled={submitting}
                        />
                        {apiErrors.name && (
                            <p className="mt-1 text-xs text-red-600">{apiErrors.name[0]}</p>
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
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                apiErrors.email ? "border-red-500" : "border-gray-300"
                            }`}
                            disabled={submitting}
                        />
                        {apiErrors.email && (
                            <p className="mt-1 text-xs text-red-600">{apiErrors.email[0]}</p>
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
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
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
                            <p className="mt-1 text-xs text-red-600">{apiErrors.role[0]}</p>
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
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                apiErrors.contact ? "border-red-500" : "border-gray-300"
                            }`}
                            disabled={submitting}
                        />
                        {apiErrors.contact && (
                            <p className="mt-1 text-xs text-red-600">{apiErrors.contact[0]}</p>
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
                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
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
                                {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                            </button>
                        </div>
                        {apiErrors.password && (
                            <p className="mt-1 text-xs text-red-600">{apiErrors.password[0]}</p>
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
                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
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
                                {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                            </button>
                        </div>
                        {apiErrors.password_confirmation && (
                            <p className="mt-1 text-xs text-red-600">{apiErrors.password_confirmation[0]}</p>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-3 py-2 sm:px-4 sm:py-2 text-sm border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-3 py-2 sm:px-4 sm:py-2 text-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Creating...
                            </>
                        ) : (
                            "Create User"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUserForm;

