// import { Eye, EyeOff, X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const EditPasswordForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingPassword,
//     setEditingPassword,
//     handleUpdate,
//     allOrganization = [],
//     allCategory = [],
//     allSubCategory = [],
//     allChildCategory = [],
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [passwordForm, setPasswordForm] = useState({
//         organization_id: "",
//         category_id: "",
//         sub_category_id: "",
//         sub_sub_category_id: "",
//         username: "",
//         password: "",
//         expirydate: "",
//         note: "",
//         image: null,
//     });

//     const filteredSubCategories = allSubCategory.filter(
//         (sub) => String(sub.category_id) === String(passwordForm.category_id)
//     );
//     const filteredChildCategories = allChildCategory.filter(
//         (child) =>
//             String(child.sub_category_id) === String(passwordForm.sub_category_id)
//     );

//     useEffect(() => {
//         if (editingPassword) {
//             setPasswordForm({
//                 organization_id: editingPassword.organization_id ?? "",
//                 category_id: editingPassword.category_id ?? "",
//                 sub_category_id: editingPassword.sub_category_id ?? "",
//                 sub_sub_category_id: editingPassword.sub_sub_category_id ?? "",
//                 username: editingPassword.username ?? "",
//                 password: editingPassword.password ?? "",
//                 expirydate: editingPassword.expirydate ?? "",
//                 note: editingPassword.note ?? "",
//                 image: null,
//             });
//             setImagePreview(
//                 editingPassword.image ? `/storage/${editingPassword.image}` : null
//             );
//             setShowForm(true);
//         }
//     }, [editingPassword, setShowForm]);

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;

//         if (type === "file") {
//             const file = files[0];
//             setPasswordForm((prev) => ({ ...prev, image: file }));
//             setImagePreview(file ? URL.createObjectURL(file) : null);
//             return;
//         }

//         setPasswordForm((prev) => {
//             const updated = { ...prev, [name]: value };
//             if (name === "category_id") {
//                 updated.sub_category_id = "";
//                 updated.sub_sub_category_id = "";
//             }
//             if (name === "sub_category_id") {
//                 updated.sub_sub_category_id = "";
//             }
//             return updated;
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();

//         for (const key in passwordForm) {
//             if (passwordForm[key] !== null && passwordForm[key] !== "") {
//                 formData.append(key, passwordForm[key]);
//             }
//         }

//         try {
//             setSubmitting(true);
//             await handleUpdate(formData, editingPassword.id);
//             resetAndClose();
//         } catch (error) {
//             console.error("Error updating password", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const resetAndClose = () => {
//         setPasswordForm({
//             organization_id: "",
//             category_id: "",
//             sub_category_id: "",
//             sub_sub_category_id: "",
//             username: "",
//             password: "",
//             expirydate: "",
//             note: "",
//             image: null,
//         });
//         setImagePreview(null);
//         setShowPassword(false);
//         setShowForm(false);
//         setEditingPassword(null);
//     };

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full shadow-xl flex flex-col max-h-[90vh]">

//                 {/* Header */}
//                 <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
//                     <h2 className="text-xl font-bold text-gray-800">
//                         Edit Password
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={resetAndClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={20} />
//                     </button>
//                 </div>

//                 {/* Scrollable Form Body */}
//                 <div className="overflow-y-auto flex-1 px-6 py-5">
//                     <form onSubmit={handleSubmit} id="edit-password-form" className="space-y-4">

//                         {/* Organization + Category */}
//                         <div className="flex gap-3">
//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Organization <span className="text-red-500">*</span>
//                                 </label>
//                                 <select
//                                     name="organization_id"
//                                     value={passwordForm.organization_id}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                 >
//                                     <option value="">— Select Organization —</option>
//                                     {allOrganization.map((org) => (
//                                         <option key={org.id} value={org.id}>
//                                             {org.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Category <span className="text-red-500">*</span>
//                                 </label>
//                                 <select
//                                     name="category_id"
//                                     value={passwordForm.category_id}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                 >
//                                     <option value="">— Select Category —</option>
//                                     {allCategory.map((cat) => (
//                                         <option key={cat.id} value={cat.id}>
//                                             {cat.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         {/* Sub Category + Child Category */}
//                         {(passwordForm.category_id || passwordForm.sub_category_id) && (
//                             <div className="flex gap-3">
//                                 {passwordForm.category_id && (
//                                     <div className="flex-1">
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Sub Category
//                                         </label>
//                                         <select
//                                             name="sub_category_id"
//                                             value={passwordForm.sub_category_id}
//                                             onChange={handleChange}
//                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                         >
//                                             <option value="">— Select Sub Category —</option>
//                                             {filteredSubCategories.map((sub) => (
//                                                 <option key={sub.id} value={sub.id}>
//                                                     {sub.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 )}

//                                 {passwordForm.sub_category_id && (
//                                     <div className="flex-1">
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Child Category
//                                         </label>
//                                         <select
//                                             name="sub_sub_category_id"
//                                             value={passwordForm.sub_sub_category_id}
//                                             onChange={handleChange}
//                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                         >
//                                             <option value="">— Select Child Category —</option>
//                                             {filteredChildCategories.map((child) => (
//                                                 <option key={child.id} value={child.id}>
//                                                     {child.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {/* Username + Password */}
//                         <div className="flex gap-3">
//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Username <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="username"
//                                     value={passwordForm.username}
//                                     onChange={handleChange}
//                                     required
//                                     placeholder="Enter username or email"
//                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                 />
//                             </div>

//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Password <span className="text-red-500">*</span>
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         name="password"
//                                         value={passwordForm.password}
//                                         onChange={handleChange}
//                                         required
//                                         placeholder="Enter password"
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword((prev) => !prev)}
//                                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                     >
//                                         {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Expiry Date */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Expiry Date
//                             </label>
//                             <input
//                                 type="date"
//                                 name="expirydate"
//                                 value={passwordForm.expirydate ?? ""}
//                                 onChange={handleChange}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             />
//                         </div>

//                         {/* Note */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Note
//                             </label>
//                             <textarea
//                                 name="note"
//                                 value={passwordForm.note ?? ""}
//                                 onChange={handleChange}
//                                 rows={3}
//                                 placeholder="Optional note..."
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
//                             />
//                         </div>

//                         {/* Image Upload */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Image
//                             </label>
//                             <input
//                                 type="file"
//                                 name="image"
//                                 accept="image/jpg,image/jpeg,image/png,image/webp"
//                                 onChange={handleChange}
//                                 className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
//                             />
//                             {imagePreview && (
//                                 <div className="mt-2 relative inline-block">
//                                     <img
//                                         src={imagePreview}
//                                         alt="Preview"
//                                         className="h-20 w-20 object-cover rounded-lg border border-gray-200"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             setImagePreview(null);
//                                             setPasswordForm((prev) => ({ ...prev, image: null }));
//                                         }}
//                                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
//                                     >
//                                         <X size={12} />
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                     </form>
//                 </div>

//                 {/* Footer */}
//                 <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
//                     <button
//                         type="button"
//                         onClick={resetAndClose}
//                         className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         form="edit-password-form"
//                         disabled={submitting}
//                         className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
//                     >
//                         {submitting ? "Updating..." : "Update Password"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditPasswordForm;


import { Check, Copy, Eye, EyeOff, LockKeyhole, Trash2, Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const EditPasswordForm = ({
    showForm,
    setShowForm,
    setReloadTrigger,
    editingPassword,
    setEditingPassword,
    handleUpdate,
    allOrganization = [],
    allCategory = [],
    allSubCategory = [],
    allChildCategory = [],
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordCopied, setPasswordCopied] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [passwordForm, setPasswordForm] = useState({
        organization_id: "",
        category_id: "",
        sub_category_id: "",
        sub_sub_category_id: "",
        username: "",
        password: "",
        expirydate: "",
        note: "",
        image: null,
    });
    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

    // Transform data for React Select
    const organizationOptions = allOrganization.map((org) => ({
        value: org.id,
        label: org.name,
    }));

    const categoryOptions = allCategory.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    const subCategoryOptions = allSubCategory.map((sub) => ({
        value: sub.id,
        label: sub.name,
        category_id: sub.category_id,
    }));

    const childCategoryOptions = allChildCategory.map((child) => ({
        value: child.id,
        label: child.name,
        sub_category_id: child.sub_category_id,
    }));

    // Filtered options based on selections
    const filteredSubCategoryOptions = subCategoryOptions.filter(
        (sub) => String(sub.category_id) === String(passwordForm.category_id)
    );

    const filteredChildCategoryOptions = childCategoryOptions.filter(
        (child) =>
            String(child.sub_category_id) === String(passwordForm.sub_category_id)
    );

    // Find selected values
    const selectedOrganization = organizationOptions.find(
        (option) => option.value === passwordForm.organization_id
    );

    const selectedCategory = categoryOptions.find(
        (option) => option.value === passwordForm.category_id
    );

    const selectedSubCategory = filteredSubCategoryOptions.find(
        (option) => option.value === passwordForm.sub_category_id
    );

    const selectedChildCategory = filteredChildCategoryOptions.find(
        (option) => option.value === passwordForm.sub_sub_category_id
    );

    // Check file size (max 2MB)
    const isFileSizeValid = (file) => {
        const maxSizeInMB = 2;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        return file.size <= maxSizeInBytes;
    };

    useEffect(() => {
        if (editingPassword) {
            setPasswordForm({
                organization_id: editingPassword.organization_id ?? "",
                category_id: editingPassword.category_id ?? "",
                sub_category_id: editingPassword.sub_category_id ?? "",
                sub_sub_category_id: editingPassword.sub_sub_category_id ?? "",
                username: editingPassword.username ?? "",
                password: editingPassword.password ?? "",
                expirydate: editingPassword.expirydate ?? "",
                note: editingPassword.note ?? "",
                image: null,
            });
            setImagePreview(
                editingPassword.image ? `/storage/${editingPassword.image}` : null
            );
            setSelectedImage(null);
            setShowForm(true);
        }
    }, [editingPassword, setShowForm]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            const file = files[0];
            
            // Validate file size
            if (file && !isFileSizeValid(file)) {
                alert(`File "${file.name}" exceeds the 2MB limit. Maximum allowed file size is 2MB.`);
                e.target.value = ""; // Clear the input
                return;
            }
            
            setSelectedImage(file);
            setPasswordForm((prev) => ({ ...prev, image: file }));
            
            // Revoke old preview URL if it exists and is a blob URL
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            
            setImagePreview(file ? URL.createObjectURL(file) : null);
            return;
        }

        setPasswordForm((prev) => {
            const updated = { ...prev, [name]: value };
            return updated;
        });
    };

    const handleSelectChange = (name, selectedOption) => {
        setPasswordForm((prev) => {
            const updated = { ...prev, [name]: selectedOption ? selectedOption.value : "" };
            
            // Reset dependent fields
            if (name === "category_id") {
                updated.sub_category_id = "";
                updated.sub_sub_category_id = "";
            }
            if (name === "sub_category_id") {
                updated.sub_sub_category_id = "";
            }
            
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        for (const key in passwordForm) {
            if (passwordForm[key] !== null && passwordForm[key] !== "") {
                formData.append(key, passwordForm[key]);
            }
        }
        
        // Add _method for Laravel to handle as PUT/PATCH
        formData.append('_method', 'PUT');

        try {
            setSubmitting(true);
            await handleUpdate(formData, editingPassword.id);
            setReloadTrigger((prev) => !prev);
            resetAndClose();
        } catch (error) {
            console.error("Error updating password", error);
            alert("Failed to update password. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const resetAndClose = () => {
        // Revoke blob URL if it exists
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        
        setPasswordForm({
            organization_id: "",
            category_id: "",
            sub_category_id: "",
            sub_sub_category_id: "",
            username: "",
            password: "",
            expirydate: "",
            note: "",
            image: null,
        });
        setSelectedImage(null);
        setImagePreview(null);
        setShowPassword(false);
        setPasswordCopied(false);
        setShowForm(false);
        setEditingPassword(null);
    };

    const handleRemoveImage = () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setSelectedImage(null);
        setImagePreview(null);
        setPasswordForm((prev) => ({ ...prev, image: null }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const file = files[0];
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert("Please upload an image file.");
                return;
            }
            
            // Validate file size
            if (!isFileSizeValid(file)) {
                alert(`File "${file.name}" exceeds the 2MB limit. Maximum allowed file size is 2MB.`);
                return;
            }
            
            setSelectedImage(file);
            setPasswordForm((prev) => ({ ...prev, image: file }));
            
            // Revoke old preview URL if it exists and is a blob URL
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Custom styles for React Select
    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            borderRadius: "0.5rem",
            borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(99, 102, 241, 0.16)"
                : "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
            "&:hover": {
                borderColor: state.isFocused ? "#6366f1" : "#9ca3af",
            },
            minHeight: "42px",
        }),
        placeholder: (base) => ({
            ...base,
            color: "#9ca3af",
            fontSize: "0.875rem",
        }),
        singleValue: (base) => ({
            ...base,
            fontSize: "0.875rem",
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#e0e7ff" : "white",
            color: state.isFocused ? "#4f46e5" : "#374151",
            "&:active": {
                backgroundColor: "#c7d2fe",
            },
        }),
    };

    const handleCopyPassword = async () => {
        if (!passwordForm.password) return;

        try {
            await navigator.clipboard.writeText(passwordForm.password);
            setPasswordCopied(true);
            window.setTimeout(() => setPasswordCopied(false), 1400);
        } catch (error) {
            console.error("Unable to copy password", error);
        }
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/55  flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-start gap-4 px-6 py-5 border-b border-gray-100 shrink-0 ">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Edit Password
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={resetAndClose}
                        className="p-2 hover:bg-white rounded-full text-gray-500 hover:text-gray-800 transition-colors"
                        aria-label="Close form"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5">
                    <form onSubmit={handleSubmit} id="edit-password-form" className="space-y-5">

                        {/* Organization + Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>
                                    Organization <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    name="organization_id"
                                    options={organizationOptions}
                                    value={selectedOrganization}
                                    onChange={(option) => handleSelectChange("organization_id", option)}
                                    placeholder="Select organization"
                                    isClearable
                                    required
                                    styles={customSelectStyles}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    name="category_id"
                                    options={categoryOptions}
                                    value={selectedCategory}
                                    onChange={(option) => handleSelectChange("category_id", option)}
                                    placeholder="Select category"
                                    isClearable
                                    required
                                    styles={customSelectStyles}
                                />
                            </div>
                        </div>

                        {/* Sub Category + Child Category */}
                        {(passwordForm.category_id || passwordForm.sub_category_id) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {passwordForm.category_id && (
                                    <div>
                                        <label className={labelClass}>
                                            Sub Category
                                        </label>
                                        <Select
                                            name="sub_category_id"
                                            options={filteredSubCategoryOptions}
                                            value={selectedSubCategory}
                                            onChange={(option) => handleSelectChange("sub_category_id", option)}
                                            placeholder="Select sub category"
                                            isClearable
                                            isDisabled={!passwordForm.category_id}
                                            styles={customSelectStyles}
                                        />
                                    </div>
                                )}

                                {passwordForm.sub_category_id && (
                                    <div>
                                        <label className={labelClass}>
                                            Child Category
                                        </label>
                                        <Select
                                            name="sub_sub_category_id"
                                            options={filteredChildCategoryOptions}
                                            value={selectedChildCategory}
                                            onChange={(option) => handleSelectChange("sub_sub_category_id", option)}
                                            placeholder="Select child category"
                                            isClearable
                                            isDisabled={!passwordForm.sub_category_id}
                                            styles={customSelectStyles}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Username + Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={passwordForm.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter username or email"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <div className="mb-1.5 flex items-center justify-between gap-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    {passwordCopied && (
                                        <span className="text-xs font-medium text-emerald-600">
                                            Copied
                                        </span>
                                    )}
                                </div>
                                <div className="flex h-[42px] overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                                    <div className="flex w-10 shrink-0 items-center justify-center border-r border-gray-200 bg-gray-50 text-gray-400">
                                        <LockKeyhole size={16} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={passwordForm.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter password"
                                        className="min-w-0 flex-1 border-0 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-0"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCopyPassword}
                                        disabled={!passwordForm.password}
                                        className="flex w-11 shrink-0 items-center justify-center border-l border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Copy password"
                                        title="Copy password"
                                    >
                                        {passwordCopied ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="flex w-11 shrink-0 items-center justify-center border-l border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Expiry Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>
                                    Expiry Date
                                </label>
                                <input
                                    type="date"
                                    name="expirydate"
                                    value={passwordForm.expirydate ?? ""}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Note */}
                        <div>
                            <label className={labelClass}>
                                Note
                            </label>
                            <textarea
                                name="note"
                                value={passwordForm.note ?? ""}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Optional note..."
                                className={`${inputClass} min-h-[92px] resize-none`}
                            />
                        </div>

                        {/* Image Upload - Gallery Style */}
                        <div>
                            <label className={labelClass}>
                                Image
                            </label>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mb-4">
                                    <div className="relative inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                        {selectedImage && (
                                            <>
                                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                                    {selectedImage.name.length > 15
                                                        ? selectedImage.name.substring(0, 12) + "..."
                                                        : selectedImage.name}
                                                </div>
                                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                                    {(selectedImage.size / (1024 * 1024)).toFixed(2)}MB
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Drag & Drop Upload Area */}
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                    imagePreview
                                        ? "border-gray-300 bg-gray-50"
                                        : "border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-gray-100"
                                }`}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/jpg,image/jpeg,image/png,image/webp"
                                    onChange={handleChange}
                                    className="hidden"
                                    id="edit-password-image-upload"
                                />
                                <label
                                    htmlFor="edit-password-image-upload"
                                    className="cursor-pointer block"
                                >
                                    <div className="space-y-3">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="text-gray-600">
                                            <span className="font-medium text-indigo-600 hover:text-indigo-700">
                                                Click to upload
                                            </span>{" "}
                                            or drag and drop
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            JPG, JPEG, PNG, WEBP up to 2MB
                                        </p>
                                        {imagePreview && !selectedImage && (
                                            <p className="text-xs text-gray-500">
                                                Upload a new image to replace the current one
                                            </p>
                                        )}
                                    </div>
                                </label>
                            </div>

                            {/* Remove Button */}
                            {imagePreview && (
                                <div className="flex justify-end mt-2">
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Remove Image
                                    </button>
                                </div>
                            )}
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 shrink-0 bg-white">
                    <button
                        type="button"
                        onClick={resetAndClose}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-password-form"
                        disabled={submitting}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPasswordForm;

// import { Eye, EyeOff, X } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import Select from "react-select";

// const EditPasswordForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingPassword,
//     setEditingPassword,
//     handleUpdate,
//     allOrganization = [],
//     allCategory = [],
//     allSubCategory = [],
//     allChildCategory = [],
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [passwordForm, setPasswordForm] = useState({
//         organization_id: "",
//         category_id: "",
//         sub_category_id: "",
//         sub_sub_category_id: "",
//         username: "",
//         password: "",
//         expirydate: "",
//         note: "",
//         image: null,
//     });

//     // Transform data for React Select
//     const organizationOptions = allOrganization.map((org) => ({
//         value: org.id,
//         label: org.name,
//     }));

//     const categoryOptions = allCategory.map((cat) => ({
//         value: cat.id,
//         label: cat.name,
//     }));

//     const subCategoryOptions = allSubCategory.map((sub) => ({
//         value: sub.id,
//         label: sub.name,
//         category_id: sub.category_id,
//     }));

//     const childCategoryOptions = allChildCategory.map((child) => ({
//         value: child.id,
//         label: child.name,
//         sub_category_id: child.sub_category_id,
//     }));

//     // Filtered options based on selections
//     const filteredSubCategoryOptions = subCategoryOptions.filter(
//         (sub) => String(sub.category_id) === String(passwordForm.category_id)
//     );

//     const filteredChildCategoryOptions = childCategoryOptions.filter(
//         (child) =>
//             String(child.sub_category_id) === String(passwordForm.sub_category_id)
//     );

//     // Find selected values
//     const selectedOrganization = organizationOptions.find(
//         (option) => option.value === passwordForm.organization_id
//     );

//     const selectedCategory = categoryOptions.find(
//         (option) => option.value === passwordForm.category_id
//     );

//     const selectedSubCategory = filteredSubCategoryOptions.find(
//         (option) => option.value === passwordForm.sub_category_id
//     );

//     const selectedChildCategory = filteredChildCategoryOptions.find(
//         (option) => option.value === passwordForm.sub_sub_category_id
//     );

//     useEffect(() => {
//         if (editingPassword) {
//             setPasswordForm({
//                 organization_id: editingPassword.organization_id ?? "",
//                 category_id: editingPassword.category_id ?? "",
//                 sub_category_id: editingPassword.sub_category_id ?? "",
//                 sub_sub_category_id: editingPassword.sub_sub_category_id ?? "",
//                 username: editingPassword.username ?? "",
//                 password: editingPassword.password ?? "",
//                 expirydate: editingPassword.expirydate ?? "",
//                 note: editingPassword.note ?? "",
//                 image: null,
//             });
//             setImagePreview(
//                 editingPassword.image ? `/storage/${editingPassword.image}` : null
//             );
//             setShowForm(true);
//         }
//     }, [editingPassword, setShowForm]);

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;

//         if (type === "file") {
//             const file = files[0];
//             setPasswordForm((prev) => ({ ...prev, image: file }));
//             setImagePreview(file ? URL.createObjectURL(file) : null);
//             return;
//         }

//         setPasswordForm((prev) => {
//             const updated = { ...prev, [name]: value };
//             return updated;
//         });
//     };

//     const handleSelectChange = (name, selectedOption) => {
//         setPasswordForm((prev) => {
//             const updated = { ...prev, [name]: selectedOption ? selectedOption.value : "" };
            
//             // Reset dependent fields
//             if (name === "category_id") {
//                 updated.sub_category_id = "";
//                 updated.sub_sub_category_id = "";
//             }
//             if (name === "sub_category_id") {
//                 updated.sub_sub_category_id = "";
//             }
            
//             return updated;
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();

//         for (const key in passwordForm) {
//             if (passwordForm[key] !== null && passwordForm[key] !== "") {
//                 formData.append(key, passwordForm[key]);
//             }
//         }

//         try {
//             setSubmitting(true);
//             await handleUpdate(formData, editingPassword.id);
//             setReloadTrigger((prev) => !prev);
//             resetAndClose();
//         } catch (error) {
//             console.error("Error updating password", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const resetAndClose = () => {
//         setPasswordForm({
//             organization_id: "",
//             category_id: "",
//             sub_category_id: "",
//             sub_sub_category_id: "",
//             username: "",
//             password: "",
//             expirydate: "",
//             note: "",
//             image: null,
//         });
//         setImagePreview(null);
//         setShowPassword(false);
//         setShowForm(false);
//         setEditingPassword(null);
//     };

//     // Custom styles for React Select
//     const customSelectStyles = {
//         control: (base, state) => ({
//             ...base,
//             borderRadius: "0.5rem",
//             borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
//             boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
//             "&:hover": {
//                 borderColor: state.isFocused ? "#6366f1" : "#9ca3af",
//             },
//             minHeight: "38px",
//         }),
//         placeholder: (base) => ({
//             ...base,
//             color: "#9ca3af",
//             fontSize: "0.875rem",
//         }),
//         singleValue: (base) => ({
//             ...base,
//             fontSize: "0.875rem",
//         }),
//         option: (base, state) => ({
//             ...base,
//             backgroundColor: state.isFocused ? "#e0e7ff" : "white",
//             color: state.isFocused ? "#4f46e5" : "#374151",
//             "&:active": {
//                 backgroundColor: "#c7d2fe",
//             },
//         }),
//     };

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full shadow-xl flex flex-col max-h-[90vh]">

//                 {/* Header */}
//                 <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
//                     <h2 className="text-xl font-bold text-gray-800">
//                         Edit Password
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={resetAndClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={20} />
//                     </button>
//                 </div>

//                 {/* Scrollable Form Body */}
//                 <div className="overflow-y-auto flex-1 px-6 py-5">
//                     <form onSubmit={handleSubmit} id="edit-password-form" className="space-y-4">

//                         {/* Organization + Category */}
//                         <div className="flex gap-3">
//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Organization <span className="text-red-500">*</span>
//                                 </label>
//                                 <Select
//                                     name="organization_id"
//                                     options={organizationOptions}
//                                     value={selectedOrganization}
//                                     onChange={(option) => handleSelectChange("organization_id", option)}
//                                     placeholder="— Select Organization —"
//                                     isClearable
//                                     required
//                                     styles={customSelectStyles}
//                                 />
//                             </div>

//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Category <span className="text-red-500">*</span>
//                                 </label>
//                                 <Select
//                                     name="category_id"
//                                     options={categoryOptions}
//                                     value={selectedCategory}
//                                     onChange={(option) => handleSelectChange("category_id", option)}
//                                     placeholder="— Select Category —"
//                                     isClearable
//                                     required
//                                     styles={customSelectStyles}
//                                 />
//                             </div>
//                         </div>

//                         {/* Sub Category + Child Category */}
//                         {(passwordForm.category_id || passwordForm.sub_category_id) && (
//                             <div className="flex gap-3">
//                                 {passwordForm.category_id && (
//                                     <div className="flex-1">
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Sub Category
//                                         </label>
//                                         <Select
//                                             name="sub_category_id"
//                                             options={filteredSubCategoryOptions}
//                                             value={selectedSubCategory}
//                                             onChange={(option) => handleSelectChange("sub_category_id", option)}
//                                             placeholder="— Select Sub Category —"
//                                             isClearable
//                                             isDisabled={!passwordForm.category_id}
//                                             styles={customSelectStyles}
//                                         />
//                                     </div>
//                                 )}

//                                 {passwordForm.sub_category_id && (
//                                     <div className="flex-1">
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Child Category
//                                         </label>
//                                         <Select
//                                             name="sub_sub_category_id"
//                                             options={filteredChildCategoryOptions}
//                                             value={selectedChildCategory}
//                                             onChange={(option) => handleSelectChange("sub_sub_category_id", option)}
//                                             placeholder="— Select Child Category —"
//                                             isClearable
//                                             isDisabled={!passwordForm.sub_category_id}
//                                             styles={customSelectStyles}
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {/* Username + Password */}
//                         <div className="flex gap-3">
//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Username <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="username"
//                                     value={passwordForm.username}
//                                     onChange={handleChange}
//                                     required
//                                     placeholder="Enter username or email"
//                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                 />
//                             </div>

//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Password <span className="text-red-500">*</span>
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         name="password"
//                                         value={passwordForm.password}
//                                         onChange={handleChange}
//                                         required
//                                         placeholder="Enter password"
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword((prev) => !prev)}
//                                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                     >
//                                         {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Expiry Date */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Expiry Date
//                             </label>
//                             <input
//                                 type="date"
//                                 name="expirydate"
//                                 value={passwordForm.expirydate ?? ""}
//                                 onChange={handleChange}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             />
//                         </div>

//                         {/* Note */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Note
//                             </label>
//                             <textarea
//                                 name="note"
//                                 value={passwordForm.note ?? ""}
//                                 onChange={handleChange}
//                                 rows={3}
//                                 placeholder="Optional note..."
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
//                             />
//                         </div>

//                         {/* Image Upload */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Image
//                             </label>
//                             <input
//                                 type="file"
//                                 name="image"
//                                 accept="image/jpg,image/jpeg,image/png,image/webp"
//                                 onChange={handleChange}
//                                 className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
//                             />
//                             {imagePreview && (
//                                 <div className="mt-2 relative inline-block">
//                                     <img
//                                         src={imagePreview}
//                                         alt="Preview"
//                                         className="h-20 w-20 object-cover rounded-lg border border-gray-200"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             setImagePreview(null);
//                                             setPasswordForm((prev) => ({ ...prev, image: null }));
//                                         }}
//                                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
//                                     >
//                                         <X size={12} />
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                     </form>
//                 </div>

//                 {/* Footer */}
//                 <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
//                     <button
//                         type="button"
//                         onClick={resetAndClose}
//                         className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         form="edit-password-form"
//                         disabled={submitting}
//                         className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
//                     >
//                         {submitting ? "Updating..." : "Update Password"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditPasswordForm;
