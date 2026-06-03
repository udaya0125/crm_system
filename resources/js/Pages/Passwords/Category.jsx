import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Edit } from "lucide-react";
import AddCategoryForm from "@/AddPasswordComponents/AddCategoryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/TableComponents/MyTable";
import EditCategoryForm from "@/EditPasswordComponents/EditCategoryForm";

const Category = () => {
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourcategories.index"));
                setAllCategory(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await axios.delete(route("ourcategories.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourcategories.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating category:", error);
            throw error;
        }
    };

    // Define table columns
    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ value }) => <span className="font-medium text-gray-800">{value}</span>,
            },
            {
                Header: "Created At",
                accessor: "created_at",
                Cell: ({ value }) => <span>{new Date(value).toLocaleDateString()}</span>,
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit"
                        >
                             <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <AdminWrapper>
            <div className="container mx-auto py-4">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                    Category Management
                </h1>
                <button
                    onClick={() => {
                        setShowAddForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* Table */}
            <MyTable
                columns={columns} 
                data={allCategory} 
                loading={loading}
            />

            {/* Add Category Modal */}
            <AddCategoryForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
            />

            {/* Edit Category Modal */}
            <EditCategoryForm
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                editingCategory={editingCategory}
                setEditingCategory={setEditingCategory}
                handleUpdate={handleUpdate}
                setReloadTrigger={setReloadTrigger}
            />
            </div>
        </AdminWrapper>
    );
};

export default Category;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// import AddCategoryForm from "@/AddFormComponents/AddCategoryForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";

// const Category = () => {
//     const [allCategory, setAllCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     useEffect(() => {
//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 // Controller returns { status, data } — so use response.data.data
//                 setAllCategory(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         fetchCategory();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this category?")) return;
//         try {
//             await axios.delete(route("ourcategories.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Delete error:", error);
//         }
//     };

//     const handleEdit = (category) => {
//         setEditingCategory(category);
//         setShowForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourcategories.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error updating category:", error);
//             throw error;
//         }
//     };

//     return (
//         <AdminWrapper>
//             {/* Header */}
//             <div className="mb-8 flex justify-between items-center">
//                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                     Category Management
//                 </h1>
//                 <button
//                     onClick={() => {
//                         setEditingCategory(null);
//                         setShowForm(true);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* Table */}
//             <div className="bg-white rounded-xl shadow overflow-hidden">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                 #
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                 Name
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                 Created At
//                             </th>
//                             <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                 Actions
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                         {allCategory.length === 0 ? (
//                             <tr>
//                                 <td
//                                     colSpan={4}
//                                     className="px-6 py-10 text-center text-gray-400"
//                                 >
//                                     No categories found.
//                                 </td>
//                             </tr>
//                         ) : (
//                             allCategory.map((category, index) => (
//                                 <tr
//                                     key={category.id}
//                                     className="hover:bg-gray-50 transition"
//                                 >
//                                     <td className="px-6 py-4 text-sm text-gray-500">
//                                         {index + 1}
//                                     </td>
//                                     <td className="px-6 py-4 text-sm font-medium text-gray-800">
//                                         {category.name}
//                                     </td>
//                                     <td className="px-6 py-4 text-sm text-gray-500">
//                                         {new Date(category.created_at).toLocaleDateString()}
//                                     </td>
//                                     <td className="px-6 py-4 text-right">
//                                         <div className="flex justify-end gap-2">
//                                             <button
//                                                 onClick={() => handleEdit(category)}
//                                                 className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
//                                                 title="Edit"
//                                             >
//                                                 <Pencil size={16} />
//                                             </button>
//                                             <button
//                                                 onClick={() => handleDelete(category.id)}
//                                                 className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
//                                                 title="Delete"
//                                             >
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Modal Form */}
//             <AddCategoryForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingCategory={editingCategory}
//                 setEditingCategory={setEditingCategory}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default Category;
