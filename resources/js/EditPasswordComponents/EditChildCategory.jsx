// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { X } from "lucide-react";
// import Select from "react-select";

// const EditChildCategory = ({
//     showForm,
//     setShowForm,
//     editingChildCategory,
//     setEditingChildCategory,
//     setReloadTrigger,
//     handleUpdate,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [subCategories, setSubCategories] = useState([]);
//     const [childCategoryForm, setChildCategoryForm] = useState({
//         name: "",
//         sub_category_id: "",
//     });

//     // Fetch subcategories for the dropdown
//     useEffect(() => {
//         const fetchSubCategories = async () => {
//             try {
//                 const response = await axios.get(route("oursubcategories.index"));
//                 setSubCategories(response.data.data);
//             } catch (error) {
//                 console.error("Error fetching subcategories", error);
//             }
//         };
//         fetchSubCategories();
//     }, []);

//     // Transform subcategories for react-select
//     const subCategoryOptions = subCategories.map((sub) => ({
//         value: sub.id,
//         label: sub.name,
//     }));

//     // Find selected subcategory option
//     const selectedSubCategory = subCategoryOptions.find(
//         (option) => option.value === childCategoryForm.sub_category_id
//     );

//     // Populate form when editing
//     useEffect(() => {
//         if (editingChildCategory) {
//             setChildCategoryForm({
//                 name: editingChildCategory.name,
//                 sub_category_id: editingChildCategory.sub_category_id,
//             });
//         }
//     }, [editingChildCategory]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         for (const key in childCategoryForm) {
//             if (childCategoryForm[key] !== null && childCategoryForm[key] !== "") {
//                 formData.append(key, childCategoryForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);
//             await handleUpdate(formData, editingChildCategory.id);
//             // setReloadTrigger((prev) => !prev);
//             setShowForm(false);
//             setEditingChildCategory(null);
//         } catch (error) {
//             console.error("Error updating child category", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setChildCategoryForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubCategoryChange = (selectedOption) => {
//         setChildCategoryForm((prev) => ({
//             ...prev,
//             sub_category_id: selectedOption ? selectedOption.value : "",
//         }));
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingChildCategory(null);
//         setChildCategoryForm({ name: "", sub_category_id: "" });
//     };

//     if (!showForm || !editingChildCategory) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Edit Child Category
//                     </h2>
//                     <button
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Name */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Child Category Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={childCategoryForm.name}
//                             onChange={handleChange}
//                             required
//                             placeholder="e.g. Running Shoes"
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                         />
//                     </div>

//                     {/* SubCategory dropdown with React Select */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Parent SubCategory <span className="text-red-500">*</span>
//                         </label>
//                         <Select
//                             name="sub_category_id"
//                             options={subCategoryOptions}
//                             value={selectedSubCategory}
//                             onChange={handleSubCategoryChange}
//                             placeholder="— Select a subcategory —"
//                             isClearable
//                             required
//                             className="react-select-container"
//                             classNamePrefix="react-select"
//                             styles={{
//                                 control: (base, state) => ({
//                                     ...base,
//                                     borderRadius: "0.5rem",
//                                     borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
//                                     boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
//                                     "&:hover": {
//                                         borderColor: state.isFocused ? "#6366f1" : "#9ca3af",
//                                     },
//                                     minHeight: "42px",
//                                 }),
//                                 placeholder: (base) => ({
//                                     ...base,
//                                     color: "#9ca3af",
//                                     fontSize: "0.875rem",
//                                 }),
//                                 singleValue: (base) => ({
//                                     ...base,
//                                     fontSize: "0.875rem",
//                                 }),
//                                 option: (base, state) => ({
//                                     ...base,
//                                     backgroundColor: state.isFocused ? "#e0e7ff" : "white",
//                                     color: state.isFocused ? "#4f46e5" : "#374151",
//                                     "&:active": {
//                                         backgroundColor: "#c7d2fe",
//                                     },
//                                 }),
//                             }}
//                         />
//                     </div>

//                     {/* Actions */}
//                     <div className="flex justify-end gap-3 pt-2">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-5 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-5 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
//                         >
//                             {submitting ? "Updating..." : "Update Child Category"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditChildCategory;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import Select from "react-select";
import toast from "react-hot-toast";

const EditChildCategory = ({
    showForm,
    setShowForm,
    editingChildCategory,
    setEditingChildCategory,
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const [childCategoryForm, setChildCategoryForm] = useState({
        name: "",
        sub_category_id: "",
    });

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const response = await axios.get(route("oursubcategories.index"));
                setSubCategories(response.data.data);
            } catch (error) {
                console.error("Error fetching subcategories", error);
            }
        };
        fetchSubCategories();
    }, []);

    const subCategoryOptions = subCategories.map((sub) => ({
        value: sub.id,
        label: sub.name,
    }));

    const selectedSubCategory = subCategoryOptions.find(
        (option) => option.value === childCategoryForm.sub_category_id
    );

    useEffect(() => {
        if (editingChildCategory) {
            setChildCategoryForm({
                name: editingChildCategory.name,
                sub_category_id: editingChildCategory.sub_category_id,
            });
        }
    }, [editingChildCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in childCategoryForm) {
            if (childCategoryForm[key] !== null && childCategoryForm[key] !== "") {
                formData.append(key, childCategoryForm[key]);
            }
        }
        try {
            setSubmitting(true);
            await handleUpdate(formData, editingChildCategory.id);
            toast.success("Child category updated successfully!");
            setShowForm(false);
            setEditingChildCategory(null);
        } catch (error) {
            console.error("Error updating child category", error);
            toast.error("Failed to update child category.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChildCategoryForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubCategoryChange = (selectedOption) => {
        setChildCategoryForm((prev) => ({
            ...prev,
            sub_category_id: selectedOption ? selectedOption.value : "",
        }));
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingChildCategory(null);
        setChildCategoryForm({ name: "", sub_category_id: "" });
    };

    if (!showForm || !editingChildCategory) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Edit Child Category
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Child Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={childCategoryForm.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Running Shoes"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Parent SubCategory <span className="text-red-500">*</span>
                        </label>
                        <Select
                            name="sub_category_id"
                            options={subCategoryOptions}
                            value={selectedSubCategory}
                            onChange={handleSubCategoryChange}
                            placeholder="— Select a subcategory —"
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
                            {submitting ? "Updating..." : "Update Child Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditChildCategory;
