// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { Plus, Pencil, Trash2, Layers, Edit } from "lucide-react";
// import AddSubCategoryForm from "@/AddPasswordComponents/AddSubCategoryForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import EditSubCategoryForm from "@/EditPasswordComponents/EditSubCategoryForm";
// import { Head } from "@inertiajs/react";

// // ─── Helpers ────────────────────────────────────────────────────────────────

// const groupByCategory = (subCategories) => {
//     const map = {};
//     subCategories.forEach((sub) => {
//         const catId = sub.category?.id ?? "__none__";
//         const catName = sub.category?.name ?? "Uncategorised";
//         if (!map[catId]) {
//             map[catId] = { id: catId, name: catName, children: [] };
//         }
//         map[catId].children.push(sub);
//     });
//     return Object.values(map);
// };

// // ─── Main Component ───────────────────────────────────────────────────────────

// const SubCategory = () => {
//     const [allSubCategories, setAllSubCategories] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingSubCategory, setEditingSubCategory] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);

//     useEffect(() => {
//         const fetchSubCategories = async () => {
//             try {
//                 const response = await axios.get(
//                     route("oursubcategories.index"),
//                 );
//                 setAllSubCategories(response.data.data);
//             } catch (error) {
//                 console.error("fetching error", error);
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

//     const grouped = useMemo(
//         () => groupByCategory(allSubCategories),
//         [allSubCategories],
//     );

//     return (
//         <AdminWrapper>
//             <Head title="SubCategory " />
//             <div className="container mx-auto py-4">
//                 {/* Header */}
//                 <div className="mb-6 flex justify-between items-center">
//                     <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                         SubCategory
//                     </h1>
//                     <button
//                         onClick={() => {
//                             setShowAddForm(true);
//                         }}
//                         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm text-sm font-medium"
//                     >
//                         <Plus size={16} />
//                         Create
//                     </button>
//                 </div>

//                 {/* Table card */}
//                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                     <table className="w-full text-sm text-left">
//                         <thead className="bg-gray-50 border-b border-gray-100">
//                             <tr>
//                                 <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
//                                     S.N.
//                                 </th>
//                                 <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                     Sub Category
//                                 </th>
//                                 <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                     Created At
//                                 </th>
//                                 <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
//                                     Actions
//                                 </th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {grouped.length === 0 ? (
//                                 <tr>
//                                     <td
//                                         colSpan={4}
//                                         className="px-6 py-12 text-center text-gray-400"
//                                     >
//                                         No subcategories found.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 grouped.map((group) => (
//                                     <React.Fragment key={group.id}>
//                                         {/* Category header row */}
//                                         <tr className="bg-indigo-50/60 border-t-2 border-indigo-100">
//                                             <td
//                                                 colSpan={4}
//                                                 className="px-5 py-3"
//                                             >
//                                                 <div className="flex items-center gap-2">
//                                                     <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
//                                                         <Layers
//                                                             size={13}
//                                                             className="text-indigo-600"
//                                                         />
//                                                     </div>
//                                                     <span className="font-semibold text-indigo-700 tracking-wide uppercase text-xs">
//                                                         {group.name}
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                         </tr>

//                                         {/* Subcategory rows */}
//                                         {group.children.map((sub, index) => (
//                                             <tr
//                                                 key={sub.id}
//                                                 className="border-t border-gray-50 hover:bg-gray-50/70 transition-colors"
//                                             >
//                                                 <td className="px-5 py-3">
//                                                     <span className="text-gray-400 text-xs font-mono">
//                                                         {index + 1}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-5 py-3">
//                                                     <span className="text-gray-700 font-medium pl-1">
//                                                         {sub.name}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-5 py-3">
//                                                     <span className="text-gray-500 text-xs">
//                                                         {new Date(
//                                                             sub.created_at,
//                                                         ).toLocaleDateString()}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-5 py-3 text-right">
//                                                     <div className="flex gap-1 justify-end">
//                                                         <button
//                                                             onClick={() =>
//                                                                 handleEdit(sub)
//                                                             }
//                                                             title="Edit"
//                                                             className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
//                                                         >
//                                                             <Edit size={16} />
//                                                         </button>
//                                                         <button
//                                                             onClick={() =>
//                                                                 handleDelete(
//                                                                     sub.id,
//                                                                 )
//                                                             }
//                                                             title="Delete"
//                                                             className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
//                                                         >
//                                                             <Trash2 size={14} />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </React.Fragment>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>

//                     {/* Footer */}
//                     <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-400">
//                         <span>
//                             {grouped.length}{" "}
//                             {grouped.length === 1 ? "category" : "categories"}
//                         </span>
//                         <span>
//                             {allSubCategories.length} total subcategories
//                         </span>
//                     </div>
//                 </div>

//                 {/* Add Form */}
//                 <AddSubCategoryForm
//                     showForm={showAddForm}
//                     setShowForm={setShowAddForm}
//                     setReloadTrigger={setReloadTrigger}
//                 />

//                 {/* Edit Form */}
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
                const response = await axios.get(
                    route("oursubcategories.index"),
                );
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
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (sub) => {
        setEditingSubCategory(sub);
        setShowEditForm(true);
    };

    // ── Column definitions ─────────────────────────────────────────────────────
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    // ── Derived counts for footer ──────────────────────────────────────────────
    const groupCount = useMemo(() => {
        const ids = new Set(
            allSubCategories.map((s) => s.category?.id ?? "__none__"),
        );
        return ids.size;
    }, [allSubCategories]);

    return (
        <AdminWrapper>
            <Head title="SubCategory" />
            <div className="container mx-auto py-4">
                {/* Header */}
                {/* <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        SubCategory
                    </h1>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm text-sm font-medium"
                    >
                        <Plus size={16} />
                        Create
                    </button>
                </div> */}

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

                {/* ── Grouped table ── */}
                {/* <GroupedTable
                    rows={allSubCategories}
                    groupKey="category"
                    columns={columns}
                    loading={loading}
                    emptyMessage="No subcategories found."
                    footerLeft={`${groupCount} ${groupCount === 1 ? "category" : "categories"}`}
                    footerRight={`${allSubCategories.length} total subcategories`}
                /> */}

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

                {/* Modals */}
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

// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { Plus, Pencil, Trash2, Layers } from "lucide-react";
// import AddSubCategoryForm from "@/AddFormComponents/AddSubCategoryForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";

// // ─── Helpers ────────────────────────────────────────────────────────────────

// const groupByCategory = (subCategories) => {
//     const map = {};
//     subCategories.forEach((sub) => {
//         const catId   = sub.category?.id   ?? "__none__";
//         const catName = sub.category?.name ?? "Uncategorised";
//         if (!map[catId]) {
//             map[catId] = { id: catId, name: catName, children: [] };
//         }
//         map[catId].children.push(sub);
//     });
//     return Object.values(map);
// };

// // ─── Main Component ───────────────────────────────────────────────────────────

// const SubCategory = () => {
//     const [allSubCategories, setAllSubCategories]     = useState([]);
//     const [reloadTrigger, setReloadTrigger]           = useState(false);
//     const [editingSubCategory, setEditingSubCategory] = useState(null);
//     const [showForm, setShowForm]                     = useState(false);

//     useEffect(() => {
//         const fetchSubCategories = async () => {
//             try {
//                 const response = await axios.get(route("oursubcategories.index"));
//                 setAllSubCategories(response.data.data);
//             } catch (error) {
//                 console.error("fetching error", error);
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
//         setShowForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("oursubcategories.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error updating subcategory", error);
//             throw error;
//         }
//     };

//     const grouped = useMemo(
//         () => groupByCategory(allSubCategories),
//         [allSubCategories]
//     );

//     return (
//         <AdminWrapper>
//             {/* Header */}
//             <div className="mb-6 flex justify-between items-center">
//                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                     SubCategory Management
//                 </h1>
//                 <button
//                     onClick={() => { setEditingSubCategory(null); setShowForm(true); }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm text-sm font-medium"
//                 >
//                     <Plus size={16} />
//                     Create
//                 </button>
//             </div>

//             {/* Table card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                 <table className="w-full text-sm text-left">
//                     <thead className="bg-gray-50 border-b border-gray-100">
//                         <tr>
//                             <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
//                                 S.N.
//                             </th>
//                             <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                 Sub Category
//                             </th>
//                             <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                 Created At
//                             </th>
//                             <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
//                                 Actions
//                             </th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {grouped.length === 0 ? (
//                             <tr>
//                                 <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
//                                     No subcategories found.
//                                 </td>
//                             </tr>
//                         ) : (
//                             grouped.map((group) => (
//                                 <React.Fragment key={group.id}>
//                                     {/* Category header row */}
//                                     <tr className="bg-indigo-50/60 border-t-2 border-indigo-100">
//                                         <td colSpan={4} className="px-5 py-3">
//                                             <div className="flex items-center gap-2">
//                                                 <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
//                                                     <Layers size={13} className="text-indigo-600" />
//                                                 </div>
//                                                 <span className="font-semibold text-indigo-700 tracking-wide uppercase text-xs">
//                                                     {group.name}
//                                                 </span>
//                                             </div>
//                                         </td>
//                                     </tr>

//                                     {/* Subcategory rows */}
//                                     {group.children.map((sub, index) => (
//                                         <tr
//                                             key={sub.id}
//                                             className="border-t border-gray-50 hover:bg-gray-50/70 transition-colors"
//                                         >
//                                             <td className="px-5 py-3">
//                                                 <span className="text-gray-400 text-xs font-mono">
//                                                     {index + 1}
//                                                 </span>
//                                             </td>
//                                             <td className="px-5 py-3">
//                                                 <span className="text-gray-700 font-medium pl-1">
//                                                     {sub.name}
//                                                 </span>
//                                             </td>
//                                             <td className="px-5 py-3">
//                                                 <span className="text-gray-500 text-xs">
//                                                     {new Date(sub.created_at).toLocaleDateString()}
//                                                 </span>
//                                             </td>
//                                             <td className="px-5 py-3 text-right">
//                                                 <div className="flex gap-1 justify-end">
//                                                     <button
//                                                         onClick={() => handleEdit(sub)}
//                                                         title="Edit"
//                                                         className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
//                                                     >
//                                                         <Pencil size={14} />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDelete(sub.id)}
//                                                         title="Delete"
//                                                         className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
//                                                     >
//                                                         <Trash2 size={14} />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </React.Fragment>
//                             ))
//                         )}
//                     </tbody>
//                 </table>

//                 {/* Footer */}
//                 <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-400">
//                     <span>
//                         {grouped.length} {grouped.length === 1 ? "category" : "categories"}
//                     </span>
//                     <span>{allSubCategories.length} total subcategories</span>
//                 </div>
//             </div>

//             <AddSubCategoryForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingSubCategory={editingSubCategory}
//                 setEditingSubCategory={setEditingSubCategory}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default SubCategory;
