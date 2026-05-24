import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AddSubCategoryForm from "@/AddFormComponents/AddSubCategoryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";

const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString();
};

const SubCategory = () => {
    const [allSubCategories, setAllSubCategories] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [showForm, setShowForm] = useState(true);

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const response = await axios.get(route("oursubcategories.index"));
                setAllSubCategories(response.data.data);
            } catch (error) {
                console.error("fetching error", error);
            }
        };

        fetchSubCategories();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Delete this subcategory?")) return;

        try {
            await axios.delete(route("oursubcategories.destroy", { id }));
            setReloadTrigger((prev) => !prev);

            if (editingSubCategory?.id === id) {
                setEditingSubCategory(null);
                setShowForm(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (subCategory) => {
        setEditingSubCategory(subCategory);
        setShowForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("oursubcategories.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Error updating subcategory", error);
            throw error;
        }
    };

    const startCreate = () => {
        setEditingSubCategory(null);
        setShowForm(true);
    };

    return (
        <AdminWrapper>
            <div className="space-y-6 px-4 py-6 lg:px-0">
                <div className="rounded-[28px] bg-gradient-to-r from-emerald-900 via-teal-800 to-cyan-800 p-6 text-white shadow-lg">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.28em] text-emerald-200">
                                Admin panel
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold">
                                Subcategory management
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-emerald-100">
                                Keep parent and child relationships clear while editing from one page.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                                <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
                                    Total subcategories
                                </p>
                                <p className="mt-1 text-2xl font-semibold">
                                    {allSubCategories.length}
                                </p>
                            </div>
                            <button
                                onClick={startCreate}
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                            >
                                <Plus size={18} />
                                New subcategory
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-12">
                    <div className="xl:col-span-4">
                        <AddSubCategoryForm
                            showForm={showForm}
                            setShowForm={setShowForm}
                            setReloadTrigger={setReloadTrigger}
                            editingSubCategory={editingSubCategory}
                            setEditingSubCategory={setEditingSubCategory}
                            handleUpdate={handleUpdate}
                        />
                    </div>

                    <div className="xl:col-span-8">
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-6 py-5">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Subcategories list
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Parent category details stay visible right in the table.
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-slate-50">
                                        <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                            <th className="px-6 py-4">#</th>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Parent category</th>
                                            <th className="px-6 py-4">Created</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {allSubCategories.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-6 py-14 text-center text-sm text-slate-400"
                                                >
                                                    No subcategories found yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            allSubCategories.map((subCategory, index) => (
                                                <tr
                                                    key={subCategory.id}
                                                    className="transition hover:bg-slate-50"
                                                >
                                                    <td className="px-6 py-4 text-sm text-slate-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-medium text-slate-900">
                                                            {subCategory.name}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {subCategory.category?.name || "N/A"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">
                                                        {formatDate(subCategory.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(subCategory)}
                                                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                                            >
                                                                <Pencil size={15} />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(subCategory.id)}
                                                                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                                            >
                                                                <Trash2 size={15} />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminWrapper>
    );
};

export default SubCategory;
