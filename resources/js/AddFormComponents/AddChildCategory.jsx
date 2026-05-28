import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const AddChildCategory = ({
    showForm,
    setShowForm,
    setReloadTrigger,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const [childCategoryForm, setChildCategoryForm] = useState({
        name: "",
        sub_category_id: "",
    });

    // Fetch subcategories for the dropdown
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

    const handleCreate = async (formData) => {
        await axios.post(route("ourchildcategories.store"), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setReloadTrigger((prev) => !prev);
    };

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
            await handleCreate(formData);
            setChildCategoryForm({ name: "", sub_category_id: "" });
            setShowForm(false);
        } catch (error) {
            console.error("Error creating child category", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChildCategoryForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setShowForm(false);
        setChildCategoryForm({ name: "", sub_category_id: "" });
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New Child Category
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
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

                    {/* SubCategory dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Parent SubCategory <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="sub_category_id"
                            value={childCategoryForm.sub_category_id}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                        >
                            <option value="">— Select a subcategory —</option>
                            {subCategories.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
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
                            {submitting ? "Creating..." : "Create Child Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddChildCategory;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { X } from "lucide-react";

// const AddChildCategory = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingChildCategory,
//     setEditingChildCategory,
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
//                 setSubCategories(response.data.data); // SubCategoryController returns { status, data }
//             } catch (error) {
//                 console.error("Error fetching subcategories", error);
//             }
//         };
//         fetchSubCategories();
//     }, []);

//     // Populate form when editing
//     useEffect(() => {
//         if (editingChildCategory) {
//             setChildCategoryForm({
//                 name: editingChildCategory.name,
//                 sub_category_id: editingChildCategory.sub_category_id,
//             });
//         } else {
//             setChildCategoryForm({ name: "", sub_category_id: "" });
//         }
//     }, [editingChildCategory]);

//     const handleCreate = async (formData) => {
//         await axios.post(route("ourchildcategories.store"), formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });
//         setReloadTrigger((prev) => !prev);
//     };

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
//             if (editingChildCategory) {
//                 await handleUpdate(formData, editingChildCategory.id);
//             } else {
//                 await handleCreate(formData);
//             }
//             setChildCategoryForm({ name: "", sub_category_id: "" });
//             setShowForm(false);
//             setEditingChildCategory(null);
//         } catch (error) {
//             console.error("Error saving child category", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setChildCategoryForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingChildCategory(null);
//         setChildCategoryForm({ name: "", sub_category_id: "" });
//     };

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         {editingChildCategory ? "Edit Child Category" : "Add New Child Category"}
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

//                     {/* SubCategory dropdown */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Parent SubCategory <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                             name="sub_category_id"
//                             value={childCategoryForm.sub_category_id}
//                             onChange={handleChange}
//                             required
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
//                         >
//                             <option value="">— Select a subcategory —</option>
//                             {subCategories.map((sub) => (
//                                 <option key={sub.id} value={sub.id}>
//                                     {sub.name}
//                                 </option>
//                             ))}
//                         </select>
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
//                             {submitting
//                                 ? "Saving..."
//                                 : editingChildCategory
//                                 ? "Update Child Category"
//                                 : "Create Child Category"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddChildCategory;

