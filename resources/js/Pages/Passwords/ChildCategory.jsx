import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Layers } from "lucide-react";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import AddChildCategory from "@/AddFormComponents/AddChildCategory";
import EditChildCategory from "@/EditFormComponents/EditChildCategory";

// ─── Helpers ────────────────────────────────────────────────────────────────

const groupBySubCategory = (childCategories) => {
    const map = {};
    childCategories.forEach((child) => {
        const subId   = child.sub_category?.id   ?? "__none__";
        const subName = child.sub_category?.name ?? "Uncategorised";
        if (!map[subId]) {
            map[subId] = { id: subId, name: subName, children: [] };
        }
        map[subId].children.push(child);
    });
    return Object.values(map);
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ChildCategory = () => {
    const [allChildCategory, setAllChildCategory]         = useState([]);
    const [reloadTrigger, setReloadTrigger]               = useState(false);
    const [editingChildCategory, setEditingChildCategory] = useState(null);
    const [showAddForm, setShowAddForm]                   = useState(false);
    const [showEditForm, setShowEditForm]                 = useState(false);

    useEffect(() => {
        const fetchChildCategory = async () => {
            try {
                const response = await axios.get(route("ourchildcategories.index"));
                setAllChildCategory(response.data.data);
            } catch (error) {
                console.error("fetching error", error);
            }
        };
        fetchChildCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Delete this child category?")) return;
        try {
            await axios.delete(route("ourchildcategories.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (childCategory) => {
        setEditingChildCategory(childCategory);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourchildcategories.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Error updating child category", error);
            throw error;
        }
    };

    const grouped = useMemo(
        () => groupBySubCategory(allChildCategory),
        [allChildCategory]
    );

    return (
        <AdminWrapper>
            <div className="container mx-auto py-4">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    Child Category Management
                </h1>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm text-sm font-medium"
                >
                    <Plus size={16} />
                    Create
                </button>
            </div>

            {/* Table card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                                S.N.
                            </th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Child Category
                            </th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {grouped.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    No child categories found.
                                </td>
                            </tr>
                        ) : (
                            grouped.map((group) => (
                                <React.Fragment key={group.id}>
                                    {/* SubCategory header row */}
                                    <tr className="bg-indigo-50/60 border-t-2 border-indigo-100">
                                        <td colSpan={4} className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                    <Layers size={13} className="text-indigo-600" />
                                                </div>
                                                <span className="font-semibold text-indigo-700 tracking-wide uppercase text-xs">
                                                    {group.name}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Child rows */}
                                    {group.children.map((child, index) => (
                                        <tr
                                            key={child.id}
                                            className="border-t border-gray-50 hover:bg-gray-50/70 transition-colors"
                                        >
                                            <td className="px-5 py-3">
                                                <span className="text-gray-400 text-xs font-mono">
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-gray-700 font-medium pl-1">
                                                    {child.name}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-gray-500 text-xs">
                                                    {new Date(child.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <button
                                                        onClick={() => handleEdit(child)}
                                                        title="Edit"
                                                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(child.id)}
                                                        title="Delete"
                                                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-400">
                    <span>
                        {grouped.length} {grouped.length === 1 ? "subcategory" : "subcategories"}
                    </span>
                    <span>{allChildCategory.length} total child categories</span>
                </div>
            </div>

            {/* Add Form Modal */}
            <AddChildCategory
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
            />

            {/* Edit Form Modal */}
            <EditChildCategory
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                editingChildCategory={editingChildCategory}
                setEditingChildCategory={setEditingChildCategory}
                setReloadTrigger={setReloadTrigger}
                handleUpdate={handleUpdate}
            />
            </div>
        </AdminWrapper>
    );
};

export default ChildCategory;



// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { Plus, Pencil, Trash2, Layers } from "lucide-react";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import AddChildCategory from "@/AddFormComponents/AddChildCategory";

// // ─── Helpers ────────────────────────────────────────────────────────────────

// const groupBySubCategory = (childCategories) => {
//     const map = {};
//     childCategories.forEach((child) => {
//         const subId   = child.sub_category?.id   ?? "__none__";
//         const subName = child.sub_category?.name ?? "Uncategorised";
//         if (!map[subId]) {
//             map[subId] = { id: subId, name: subName, children: [] };
//         }
//         map[subId].children.push(child);
//     });
//     return Object.values(map);
// };

// // ─── Main Component ───────────────────────────────────────────────────────────

// const ChildCategory = () => {
//     const [allChildCategory, setAllChildCategory]         = useState([]);
//     const [reloadTrigger, setReloadTrigger]               = useState(false);
//     const [editingChildCategory, setEditingChildCategory] = useState(null);
//     const [showForm, setShowForm]                         = useState(false);

//     useEffect(() => {
//         const fetchChildCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourchildcategories.index"));
//                 setAllChildCategory(response.data.data);
//             } catch (error) {
//                 console.error("fetching error", error);
//             }
//         };
//         fetchChildCategory();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!confirm("Delete this child category?")) return;
//         try {
//             await axios.delete(route("ourchildcategories.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const handleEdit = (childCategory) => {
//         setEditingChildCategory(childCategory);
//         setShowForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourchildcategories.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error updating child category", error);
//             throw error;
//         }
//     };

//     const grouped = useMemo(
//         () => groupBySubCategory(allChildCategory),
//         [allChildCategory]
//     );

//     return (
//         <AdminWrapper>
//             {/* Header */}
//             <div className="mb-6 flex justify-between items-center">
//                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                     Child Category Management
//                 </h1>
//                 <button
//                     onClick={() => { setEditingChildCategory(null); setShowForm(true); }}
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
//                                 Child Category
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
//                                     No child categories found.
//                                 </td>
//                             </tr>
//                         ) : (
//                             grouped.map((group) => (
//                                 <React.Fragment key={group.id}>
//                                     {/* SubCategory header row */}
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

//                                     {/* Child rows */}
//                                     {group.children.map((child, index) => (
//                                         <tr
//                                             key={child.id}
//                                             className="border-t border-gray-50 hover:bg-gray-50/70 transition-colors"
//                                         >
//                                             <td className="px-5 py-3">
//                                                 <span className="text-gray-400 text-xs font-mono">
//                                                     {index + 1}
//                                                 </span>
//                                             </td>
//                                             <td className="px-5 py-3">
//                                                 <span className="text-gray-700 font-medium pl-1">
//                                                     {child.name}
//                                                 </span>
//                                             </td>
//                                             <td className="px-5 py-3">
//                                                 <span className="text-gray-500 text-xs">
//                                                     {new Date(child.created_at).toLocaleDateString()}
//                                                 </span>
//                                             </td>
//                                             <td className="px-5 py-3 text-right">
//                                                 <div className="flex gap-1 justify-end">
//                                                     <button
//                                                         onClick={() => handleEdit(child)}
//                                                         title="Edit"
//                                                         className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
//                                                     >
//                                                         <Pencil size={14} />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDelete(child.id)}
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
//                         {grouped.length} {grouped.length === 1 ? "subcategory" : "subcategories"}
//                     </span>
//                     <span>{allChildCategory.length} total child categories</span>
//                 </div>
//             </div>

//             <AddChildCategory
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingChildCategory={editingChildCategory}
//                 setEditingChildCategory={setEditingChildCategory}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default ChildCategory;


