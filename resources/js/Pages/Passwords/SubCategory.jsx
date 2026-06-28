// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { Plus, Edit, Trash2 } from "lucide-react";
// import { Head } from "@inertiajs/react";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import AddSubCategoryForm from "@/AddPasswordComponents/AddSubCategoryForm";
// import EditSubCategoryForm from "@/EditPasswordComponents/EditSubCategoryForm";
// import GroupedTable from "@/TableComponents/Groupedtable";
// import PageLoader from "@/Loader/PageLoader";

// const SubCategory = () => {
//     const [allSubCategories, setAllSubCategories] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingSubCategory, setEditingSubCategory] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchSubCategories = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(
//                     route("oursubcategories.index"),
//                 );
//                 setAllSubCategories(response.data.data);
//             } catch (error) {
//                 console.error("fetching error", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchSubCategories();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!confirm("Delete this subcategory?")) return;
//         try {
//             await axios.delete(route("oursubcategories.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const handleEdit = (sub) => {
//         setEditingSubCategory(sub);
//         setShowEditForm(true);
//     };

//     // ── Column definitions ─────────────────────────────────────────────────────
//     const columns = useMemo(
//         () => [
//             {
//                 id: "sn",
//                 header: "S.N.",
//                 meta: { className: "w-16" },
//                 cell: ({ groupIndex }) => (
//                     <span className="text-gray-400 text-xs font-mono">
//                         {groupIndex + 1}
//                     </span>
//                 ),
//             },
//             {
//                 accessorKey: "name",
//                 header: "Sub Category",
//                 cell: ({ getValue }) => (
//                     <span className="text-gray-700 font-medium pl-1">
//                         {getValue()}
//                     </span>
//                 ),
//             },
//             {
//                 accessorKey: "created_at",
//                 header: "Created At",
//                 cell: ({ getValue }) => (
//                     <span className="text-gray-500 text-xs">
//                         {new Date(getValue()).toLocaleDateString()}
//                     </span>
//                 ),
//             },
//             {
//                 id: "actions",
//                 header: "Actions",
//                 meta: { className: "text-right", cellClassName: "text-right" },
//                 cell: ({ row }) => (
//                     <div className="flex gap-1 justify-end">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             title="Edit"
//                             className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
//                         >
//                             <Edit size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             title="Delete"
//                             className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
//                         >
//                             <Trash2 size={14} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         [],
//     );

//     // ── Derived counts for footer ──────────────────────────────────────────────
//     const groupCount = useMemo(() => {
//         const ids = new Set(
//             allSubCategories.map((s) => s.category?.id ?? "__none__"),
//         );
//         return ids.size;
//     }, [allSubCategories]);

//     return (
//         <AdminWrapper>
//             <Head title="SubCategory" />
//             <div className="container mx-auto py-4">
//                 {/* Header */}
//                 {/* <div className="mb-6 flex justify-between items-center">
//                     <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                         SubCategory
//                     </h1>
//                     <button
//                         onClick={() => setShowAddForm(true)}
//                         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm text-sm font-medium"
//                     >
//                         <Plus size={16} />
//                         Create
//                     </button>
//                 </div> */}

//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                         Sub Category
//                     </h1>
//                     <button
//                         onClick={() => setShowAddForm(true)}
//                         className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 {/* ── Grouped table ── */}
//                 {/* <GroupedTable
//                     rows={allSubCategories}
//                     groupKey="category"
//                     columns={columns}
//                     loading={loading}
//                     emptyMessage="No subcategories found."
//                     footerLeft={`${groupCount} ${groupCount === 1 ? "category" : "categories"}`}
//                     footerRight={`${allSubCategories.length} total subcategories`}
//                 /> */}

//                 {loading ? (
//                     <PageLoader />
//                 ) : (
//                     <GroupedTable
//                         rows={allSubCategories}
//                         groupKey="category"
//                         columns={columns}
//                         emptyMessage="No subcategories found."
//                         footerLeft={`${groupCount} ${groupCount === 1 ? "category" : "categories"}`}
//                         footerRight={`${allSubCategories.length} total subcategories`}
//                     />
//                 )}

//                 {/* Modals */}
//                 <AddSubCategoryForm
//                     showForm={showAddForm}
//                     setShowForm={setShowAddForm}
//                     setReloadTrigger={setReloadTrigger}
//                 />
//                 <EditSubCategoryForm
//                     showForm={showEditForm}
//                     setShowForm={setShowEditForm}
//                     editingSubCategory={editingSubCategory}
//                     setEditingSubCategory={setEditingSubCategory}
//                     setReloadTrigger={setReloadTrigger}
//                 />
//             </div>
//         </AdminWrapper>
//     );
// };

// export default SubCategory;


import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Head } from "@inertiajs/react";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import AddSubCategoryForm from "@/AddPasswordComponents/AddSubCategoryForm";
import EditSubCategoryForm from "@/EditPasswordComponents/EditSubCategoryForm";
import GroupedTable from "@/TableComponents/Groupedtable";
import PageLoader from "@/Loader/PageLoader";
import toast, { Toaster } from "react-hot-toast";

const SubCategory = () => {
    const [allSubCategories, setAllSubCategories] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSubCategories = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("oursubcategories.index"));
                setAllSubCategories(response.data.data);
            } catch (error) {
                console.error("fetching error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubCategories();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Delete this subcategory?")) return;
        try {
            await axios.delete(route("oursubcategories.destroy", { id }));
            setReloadTrigger((prev) => !prev);
            toast.success("Subcategory deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete subcategory.");
        }
    };

    const handleEdit = (sub) => {
        setEditingSubCategory(sub);
        setShowEditForm(true);
    };

    const columns = useMemo(
        () => [
            {
                id: "sn",
                header: "S.N.",
                meta: { className: "w-16" },
                cell: ({ groupIndex }) => (
                    <span className="text-gray-400 text-xs font-mono">
                        {groupIndex + 1}
                    </span>
                ),
            },
            {
                accessorKey: "name",
                header: "Sub Category",
                cell: ({ getValue }) => (
                    <span className="text-gray-700 font-medium pl-1">
                        {getValue()}
                    </span>
                ),
            },
            {
                accessorKey: "created_at",
                header: "Created At",
                cell: ({ getValue }) => (
                    <span className="text-gray-500 text-xs">
                        {new Date(getValue()).toLocaleDateString()}
                    </span>
                ),
            },
            {
                id: "actions",
                header: "Actions",
                meta: { className: "text-right", cellClassName: "text-right" },
                cell: ({ row }) => (
                    <div className="flex gap-1 justify-end">
                        <button
                            onClick={() => handleEdit(row.original)}
                            title="Edit"
                            className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            title="Delete"
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    const groupCount = useMemo(() => {
        const ids = new Set(
            allSubCategories.map((s) => s.category?.id ?? "__none__"),
        );
        return ids.size;
    }, [allSubCategories]);

    return (
        <AdminWrapper>
            <Head title="SubCategory" />
            <Toaster position="top-right" />
            <div className="container mx-auto py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Sub Category
                    </h1>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {loading ? (
                    <PageLoader />
                ) : (
                    <GroupedTable
                        rows={allSubCategories}
                        groupKey="category"
                        columns={columns}
                        emptyMessage="No subcategories found."
                        footerLeft={`${groupCount} ${groupCount === 1 ? "category" : "categories"}`}
                        footerRight={`${allSubCategories.length} total subcategories`}
                    />
                )}

                <AddSubCategoryForm
                    showForm={showAddForm}
                    setShowForm={setShowAddForm}
                    setReloadTrigger={setReloadTrigger}
                />
                <EditSubCategoryForm
                    showForm={showEditForm}
                    setShowForm={setShowEditForm}
                    editingSubCategory={editingSubCategory}
                    setEditingSubCategory={setEditingSubCategory}
                    setReloadTrigger={setReloadTrigger}
                />
            </div>
        </AdminWrapper>
    );
};

export default SubCategory;
