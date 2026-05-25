import { Eye, EyeOff, X } from "lucide-react";
import React, { useEffect, useState } from "react";

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

    const filteredSubCategories = allSubCategory.filter(
        (sub) => String(sub.category_id) === String(passwordForm.category_id)
    );
    const filteredChildCategories = allChildCategory.filter(
        (child) =>
            String(child.sub_category_id) === String(passwordForm.sub_category_id)
    );

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
            setShowForm(true);
        }
    }, [editingPassword, setShowForm]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            const file = files[0];
            setPasswordForm((prev) => ({ ...prev, image: file }));
            setImagePreview(file ? URL.createObjectURL(file) : null);
            return;
        }

        setPasswordForm((prev) => {
            const updated = { ...prev, [name]: value };
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

        try {
            setSubmitting(true);
            await handleUpdate(formData, editingPassword.id);
            resetAndClose();
        } catch (error) {
            console.error("Error updating password", error);
        } finally {
            setSubmitting(false);
        }
    };

    const resetAndClose = () => {
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
        setImagePreview(null);
        setShowPassword(false);
        setShowForm(false);
        setEditingPassword(null);
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full shadow-xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">
                        Edit Password
                    </h2>
                    <button
                        type="button"
                        onClick={resetAndClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5">
                    <form onSubmit={handleSubmit} id="edit-password-form" className="space-y-4">

                        {/* Organization + Category */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Organization <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="organization_id"
                                    value={passwordForm.organization_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">— Select Organization —</option>
                                    {allOrganization.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category_id"
                                    value={passwordForm.category_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">— Select Category —</option>
                                    {allCategory.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sub Category + Child Category */}
                        {(passwordForm.category_id || passwordForm.sub_category_id) && (
                            <div className="flex gap-3">
                                {passwordForm.category_id && (
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sub Category
                                        </label>
                                        <select
                                            name="sub_category_id"
                                            value={passwordForm.sub_category_id}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="">— Select Sub Category —</option>
                                            {filteredSubCategories.map((sub) => (
                                                <option key={sub.id} value={sub.id}>
                                                    {sub.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {passwordForm.sub_category_id && (
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Child Category
                                        </label>
                                        <select
                                            name="sub_sub_category_id"
                                            value={passwordForm.sub_sub_category_id}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="">— Select Child Category —</option>
                                            {filteredChildCategories.map((child) => (
                                                <option key={child.id} value={child.id}>
                                                    {child.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Username + Password */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={passwordForm.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter username or email"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={passwordForm.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter password"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                            </label>
                            <input
                                type="date"
                                name="expirydate"
                                value={passwordForm.expirydate ?? ""}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Note */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Note
                            </label>
                            <textarea
                                name="note"
                                value={passwordForm.note ?? ""}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Optional note..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/jpg,image/jpeg,image/png,image/webp"
                                onChange={handleChange}
                                className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            />
                            {imagePreview && (
                                <div className="mt-2 relative inline-block">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setPasswordForm((prev) => ({ ...prev, image: null }));
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={resetAndClose}
                        className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-password-form"
                        disabled={submitting}
                        className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPasswordForm;