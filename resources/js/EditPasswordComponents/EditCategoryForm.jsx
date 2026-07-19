import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const EditCategoryForm = ({
    showForm,
    setShowForm,
    editingCategory,
    setEditingCategory,
    handleUpdate,
    setReloadTrigger,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ name: "" });

    useEffect(() => {
        if (editingCategory) {
            setCategoryForm({ name: editingCategory.name });
        } else {
            setCategoryForm({ name: "" });
        }
    }, [editingCategory]);

    const handleClose = () => {
        setShowForm(false);
        setEditingCategory(null);
        setCategoryForm({ name: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in categoryForm) {
            if (categoryForm[key] !== null && categoryForm[key] !== "") {
                formData.append(key, categoryForm[key]);
            }
        }
        try {
            setSubmitting(true);
            await handleUpdate(formData, editingCategory.id);
            setReloadTrigger((prev) => !prev);
            toast.success("Category updated successfully!");
            handleClose();
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to update category.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm((prev) => ({ ...prev, [name]: value }));
    };

    if (!showForm || !editingCategory) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Category</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={categoryForm.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter category name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryForm;