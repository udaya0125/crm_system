import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import Select from "react-select";
import toast from "react-hot-toast";

const AddSubCategoryForm = ({ showForm, setShowForm, setReloadTrigger }) => {
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

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    const handleCreate = async (formData) => {
        await axios.post(route("oursubcategories.store"), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setReloadTrigger((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in subCategoryForm) {
            if (subCategoryForm[key] !== null && subCategoryForm[key] !== "") {
                formData.append(key, subCategoryForm[key]);
            }
        }
        try {
            setSubmitting(true);
            await handleCreate(formData);
            toast.success("Subcategory created successfully!");
            setSubCategoryForm({ name: "", category_id: "" });
            setShowForm(false);
        } catch (error) {
            console.error("Error creating subcategory", error);
            toast.error("Failed to create subcategory.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubCategoryForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (selectedOption) => {
        setSubCategoryForm((prev) => ({
            ...prev,
            category_id: selectedOption ? selectedOption.value : "",
        }));
    };

    const handleClose = () => {
        setShowForm(false);
        setSubCategoryForm({ name: "", category_id: "" });
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New SubCategory
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            SubCategory Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={subCategoryForm.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Men's Shoes"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Parent Category <span className="text-red-500">*</span>
                        </label>
                        <Select
                            name="category_id"
                            options={categoryOptions}
                            value={categoryOptions.find(
                                (option) => option.value === subCategoryForm.category_id,
                            )}
                            onChange={handleCategoryChange}
                            placeholder="— Select a category —"
                            isClearable
                            className="react-select-container"
                            classNamePrefix="react-select"
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    borderRadius: "0.5rem",
                                    borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
                                    boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
                                    "&:hover": { borderColor: state.isFocused ? "#6366f1" : "#9ca3af" },
                                    minHeight: "42px",
                                }),
                                placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "0.875rem" }),
                                singleValue: (base) => ({ ...base, fontSize: "0.875rem" }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isFocused ? "#e0e7ff" : "white",
                                    color: state.isFocused ? "#4f46e5" : "#374151",
                                    "&:active": { backgroundColor: "#c7d2fe" },
                                }),
                            }}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Creating..." : "Create SubCategory"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubCategoryForm;
