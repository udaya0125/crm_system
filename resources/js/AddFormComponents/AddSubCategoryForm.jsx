import React, { useEffect, useState } from "react";
import axios from "axios";

const AddSubCategoryForm = ({
    showForm,
    setShowForm,
    setReloadTrigger,
    editingSubCategory,
    setEditingSubCategory,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategoryForm, setSubCategoryForm] = useState({
        name: "",
        category_id: "",
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(route("ourcategories.index"));
                setCategories(response.data.data);
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (editingSubCategory) {
            setSubCategoryForm({
                name: editingSubCategory.name,
                category_id: editingSubCategory.category_id,
            });
        } else if (showForm) {
            setSubCategoryForm({ name: "", category_id: "" });
        }
    }, [editingSubCategory, showForm]);

    const resetForm = () => {
        setShowForm(true);
        setEditingSubCategory(null);
        setSubCategoryForm({ name: "", category_id: "" });
    };

    const handleCreate = async (formData) => {
        await axios.post(route("oursubcategories.store"), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setReloadTrigger((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(subCategoryForm).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        try {
            setSubmitting(true);

            if (editingSubCategory) {
                await handleUpdate(formData, editingSubCategory.id);
            } else {
                await handleCreate(formData);
            }

            resetForm();
        } catch (error) {
            console.error("Error saving subcategory", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubCategoryForm((prev) => ({ ...prev, [name]: value }));
    };

    if (!showForm) return null;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">
                    {editingSubCategory ? "Edit mode" : "Create mode"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    {editingSubCategory
                        ? "Update subcategory"
                        : "Add a new subcategory"}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Pick the parent category and manage the next level from this page.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Subcategory name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={subCategoryForm.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Men's Shoes"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Parent category <span className="text-rose-500">*</span>
                    </label>
                    <select
                        name="category_id"
                        value={subCategoryForm.category_id}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting
                            ? "Saving..."
                            : editingSubCategory
                              ? "Update subcategory"
                              : "Create subcategory"}
                    </button>
                    <button
                        type="button"
                        onClick={resetForm}
                        className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                        Clear form
                    </button>
                </div>
            </form>

            {editingSubCategory ? (
                <p className="mt-4 text-xs text-slate-500">
                    You are editing an existing subcategory. Clear the form to switch back to create mode.
                </p>
            ) : null}
        </div>
    );
};

export default AddSubCategoryForm;