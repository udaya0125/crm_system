// import axios from "axios";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//     ChevronUp,
//     ChevronDown,
//     ChevronLeft,
//     ChevronRight,
//     Edit,
//     Trash2,
//     X,
//     Eye,
//     FileText,
//     Calendar,
//     CheckCircle,
//     Square,
//     Plus,
// } from "lucide-react";
// import AddTodo from "@/AddFormComponents/AddTodo";
// import EditTodo from "@/EditFormComponents/EditTodo";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import parse from "html-react-parser";
// import MyTable from "@/TableComponents/MyTable";
// import { Head } from "@inertiajs/react";
// import PageLoader from "@/Loader/PageLoader";
// import toast, { Toaster } from "react-hot-toast";

// const ToDOPage = () => {
//     const [allTodo, setAllTodo] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [selectedTodo, setSelectedTodo] = useState(null);
//     const [editingTodo, setEditingTodo] = useState(null);

//     useEffect(() => {
//         const fetchTodo = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(route("ourtodo.index"));
//                 setAllTodo(response.data.data || []);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTodo();
//     }, [reloadTrigger]);

//     // Custom parser to replace HTML elements with Lucide icons
//     const parseWithIcons = (html) => {
//         if (!html) return null;

//         const elements = parse(html);

//         const replaceElements = (node) => {
//             if (!node || typeof node !== "object") return node;

//             if (Array.isArray(node)) {
//                 return node.map(replaceElements);
//             }

//             if (node.props && node.props.children) {
//                 // Replace ul/ol with custom styled lists
//                 if (node.type === "ul" || node.type === "ol") {
//                     const children = React.Children.map(
//                         node.props.children,
//                         (child, index) => {
//                             if (child && child.props && child.type === "li") {
//                                 return React.cloneElement(child, {
//                                     className: `${
//                                         child.props.className || ""
//                                     } flex items-start gap-2 py-1`,
//                                     children: (
//                                         <>
//                                             {node.type === "ul" ? (
//                                                 <CheckCircle
//                                                     size={12}
//                                                     className="mt-1.5 text-blue-500 flex-shrink-0"
//                                                 />
//                                             ) : (
//                                                 <span className="text-sm font-medium text-blue-600 w-5 flex-shrink-0">
//                                                     {index + 1}.
//                                                 </span>
//                                             )}
//                                             <span className="flex-1">
//                                                 {replaceElements(
//                                                     child.props.children,
//                                                 )}
//                                             </span>
//                                         </>
//                                     ),
//                                 });
//                             }
//                             return child;
//                         },
//                     );

//                     return React.createElement(node.type, {
//                         ...node.props,
//                         className: `${
//                             node.props.className || ""
//                         } space-y-2 my-2`,
//                         children: children,
//                     });
//                 }

//                 // Replace checkboxes/todo items
//                 if (
//                     node.props.className &&
//                     node.props.className.includes("ql-direction")
//                 ) {
//                     const children = React.Children.map(
//                         node.props.children,
//                         (child) => {
//                             if (child && child.props && child.type === "span") {
//                                 const isChecked =
//                                     child.props.style?.textDecoration ===
//                                     "line-through";
//                                 return React.cloneElement(child, {
//                                     children: (
//                                         <div className="flex items-center gap-2">
//                                             {isChecked ? (
//                                                 <CheckCircle
//                                                     size={16}
//                                                     className="text-green-500 flex-shrink-0"
//                                                 />
//                                             ) : (
//                                                 <Square
//                                                     size={16}
//                                                     className="text-gray-400 flex-shrink-0"
//                                                 />
//                                             )}
//                                             <span
//                                                 className={
//                                                     isChecked
//                                                         ? "line-through text-gray-500"
//                                                         : ""
//                                                 }
//                                             >
//                                                 {child.props.children}
//                                             </span>
//                                         </div>
//                                     ),
//                                 });
//                             }
//                             return child;
//                         },
//                     );

//                     return React.createElement("div", {
//                         ...node.props,
//                         children: children,
//                     });
//                 }

//                 const newChildren = React.Children.map(
//                     node.props.children,
//                     replaceElements,
//                 );
//                 return React.cloneElement(node, { children: newChildren });
//             }

//             return node;
//         };

//         return replaceElements(elements);
//     };

//     // handleDelete
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this todo?")) {
//             return;
//         }

//         try {
//             await axios.delete(route("ourtodo.destroy", { id: id }));
//             setReloadTrigger((prev) => !prev);
//             toast.success("Todo deleted successfully.");
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to delete todo. Please try again.");
//         }
//     };

//     // handleEdit - Opens edit modal
//     const handleEdit = (todo) => {
//         // Don't allow editing if todo is completed
//         if (todo.is_completed) {
//             return;
//         }
//         setEditingTodo(todo);
//         setIsEditModalOpen(true);
//     };

//     // Handle Add Todo
//     const handleAdd = async (formData) => {
//         try {
//             const response = await axios.post(route("ourtodo.store"), formData);
//             setReloadTrigger((prev) => !prev);
//             setIsAddModalOpen(false);
//             toast.success("Todo created successfully.");
//             return response.data;
//         } catch (error) {
//             console.log("Error adding todo", error);
//             toast.error("Failed to create todo. Please try again.");
//             throw error;
//         }
//     };

//     // Handle Update Todo
//     const handleUpdate = async (formData, id) => {
//         try {
//             const response = await axios.put(
//                 route("ourtodo.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             setEditingTodo(null);
//             setIsEditModalOpen(false);
//             toast.success("Todo updated successfully.");
//             return response.data;
//         } catch (error) {
//             console.log("Error updating todo", error);
//             toast.error("Failed to update todo. Please try again.");
//             throw error;
//         }
//     };

//     // Format date for display
//     const formatDate = (dateString) => {
//         if (!dateString) return "No due date";
//         const date = new Date(dateString);
//         const isOverdue = date < new Date() && !selectedTodo?.is_completed;

//         return (
//             <div className="flex flex-col lg:flex-row items-center gap-2">
//                 <span
//                     className={`px-3 py-1 text-xs rounded-full ${
//                         isOverdue
//                             ? "bg-red-100 text-red-800"
//                             : "bg-blue-100 text-blue-800"
//                     }`}
//                 >
//                     {String(date.getDate()).padStart(2, "0")}/
//                     {String(date.getMonth() + 1).padStart(2, "0")}/
//                     {date.getFullYear()}
//                 </span>
//             </div>
//         );
//     };

//     // Define columns for MyTable
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S.N.",
//                 accessor: (row, index) => index + 1,
//                 id: "rowIndex",
//                 width: 50,
//             },
//             {
//                 Header: "Status",
//                 accessor: "is_completed",
//                 Cell: ({ value }) => (
//                     <div className="flex items-center gap-2">
//                         <span
//                             className={`px-3 py-1.5 text-xs font-medium rounded-full ${
//                                 value
//                                     ? "bg-green-100 text-green-800"
//                                     : "bg-yellow-100 text-yellow-800"
//                             }`}
//                         >
//                             {value ? "Complete" : "Incomplete"}
//                         </span>
//                     </div>
//                 ),
//                 width: 140,
//             },
//             {
//                 Header: "Title",
//                 accessor: "title",
//                 Cell: ({ value }) => (
//                     <div className="flex items-center gap-2">
//                         <span className={`text-sm font-medium text-gray-900`}>
//                             {value}
//                         </span>
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Due Date",
//                 accessor: "due_date",
//                 Cell: ({ value }) => formatDate(value),
//                 width: 200,
//             },
//             {
//                 Header: "Actions",
//                 accessor: "id",
//                 Cell: ({ row }) => {
//                     const todo = row.original;
//                     const isCompleted = todo.is_completed;

//                     return (
//                         <div className="flex items-center gap-2">
//                             <button
//                                 onClick={() => setSelectedTodo(todo)}
//                                 className={`p-2  transition-colors flex items-center justify-center ${
//                                     selectedTodo?.id === todo.id
//                                         ? " text-blue-700"
//                                         : " text-gray-700 "
//                                 }`}
//                                 title="View todo details"
//                             >
//                                 <Eye size={16} />
//                             </button>

//                             {/* Only show edit button if todo is NOT completed */}
//                             {!isCompleted && (
//                                 <button
//                                     onClick={() => handleEdit(todo)}
//                                     className="text-indigo-600 hover:text-indigo-900 transition duration-200"
//                                     title="Edit todo"
//                                 >
//                                     <Edit size={16} />
//                                 </button>
//                             )}

//                             <button
//                                 onClick={() => handleDelete(todo.id)}
//                                 className="text-red-600 hover:text-red-900 transition duration-200"
//                                 title="Delete todo"
//                             >
//                                 <Trash2 size={16} />
//                             </button>
//                         </div>
//                     );
//                 },
//                 width: 160,
//             },
//         ],
//         [selectedTodo],
//     );

//     // Open add modal
//     const openAddModal = () => {
//         setIsAddModalOpen(true);
//     };

//     // Close add modal
//     const closeAddModal = () => {
//         setIsAddModalOpen(false);
//     };

//     // Close edit modal
//     const closeEditModal = () => {
//         setIsEditModalOpen(false);
//         setEditingTodo(null);
//     };

//     return (
//         <AdminWrapper>
//             <Head title="ToDo List" />

//             {/* Toast container — place once at the top level */}
//             {/* <Toaster
//                 position="top-right"
//                 toastOptions={{
//                     duration: 3000,
//                     style: {
//                         borderRadius: "8px",
//                         fontSize: "14px",
//                     },
//                     success: {
//                         iconTheme: {
//                             primary: "#4f46e5",
//                             secondary: "#fff",
//                         },
//                     },
//                 }}
//             /> */}
//               <Toaster position="top-right" />

//             <div className="container mx-auto">
//                 {/* Header */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                          ToDo List
//                     </h1>
//                     <button
//                         onClick={openAddModal}
//                         className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 {loading ? (
//                     <PageLoader />
//                 ) : (
//                     <MyTable data={allTodo} columns={columns} />
//                 )}

//                 {/* Todo Details Section - Below the Table */}
//                 {selectedTodo && (
//                     <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
//                         {/* Todo Information */}
//                         <div className="p-6">
//                             <div>
//                                 <div className="flex justify-between">
//                                     <div className="flex items-center gap-3 mb-4">
//                                         <FileText
//                                             size={24}
//                                             className="text-blue-600"
//                                         />
//                                         <h3 className="text-lg font-semibold text-gray-800">
//                                             {selectedTodo.title}
//                                         </h3>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         {!selectedTodo.is_completed && (
//                                             <button
//                                                 onClick={() =>
//                                                     handleEdit(selectedTodo)
//                                                 }
//                                                 className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded hover:bg-blue-50"
//                                                 title="Edit todo"
//                                             >
//                                                 <Edit size={16} />
//                                             </button>
//                                         )}
//                                         <button
//                                             onClick={() =>
//                                                 setSelectedTodo(null)
//                                             }
//                                             className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//                                             title="Close details"
//                                         >
//                                             <X size={20} />
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {selectedTodo.descriptions &&
//                                 selectedTodo.descriptions.length > 0 ? (
//                                     <div className="space-y-4">
//                                         {selectedTodo.descriptions
//                                             .slice()
//                                             .reverse()
//                                             .map((description, index) => (
//                                                 <div
//                                                     key={index}
//                                                     className="bg-gray-50 border border-gray-200 rounded-lg p-4"
//                                                 >
//                                                     <div className="flex items-start gap-3 mb-3">
//                                                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//                                                             <span className="text-sm font-semibold text-blue-600">
//                                                                 T
//                                                             </span>
//                                                         </div>
//                                                         <div className="flex-1">
//                                                             <div className="flex justify-between items-start mb-2">
//                                                                 <div className="font-medium text-gray-800">
//                                                                     <h2 className="font-medium text-gray-800">
//                                                                         Todo
//                                                                         Description
//                                                                     </h2>
//                                                                 </div>
//                                                                 <div className="flex gap-2 items-center">
//                                                                     <Calendar
//                                                                         size={
//                                                                             14
//                                                                         }
//                                                                         className="text-gray-400"
//                                                                     />
//                                                                     <p className="text-xs text-gray-500">
//                                                                         {description.created_at
//                                                                             ? new Date(
//                                                                                   description.created_at,
//                                                                               ).toLocaleString()
//                                                                             : "Unknown date"}
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     <div className="pl-14">
//                                                         <div className="prose max-w-none text-md text-gray-700 pl-4 py-2">
//                                                             {parseWithIcons(
//                                                                 description.description ||
//                                                                     "",
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                     </div>
//                                 ) : (
//                                     <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
//                                         <FileText
//                                             size={64}
//                                             className="mx-auto text-gray-300 mb-3"
//                                         />
//                                         <h4 className="text-lg font-medium text-gray-500 mb-2">
//                                             No descriptions available
//                                         </h4>
//                                         <p className="text-gray-400 text-sm">
//                                             There are no descriptions for this
//                                             todo yet.
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Add Todo Modal */}
//                 {isAddModalOpen && (
//                     <AddTodo
//                         onClose={closeAddModal}
//                         handleAdd={handleAdd}
//                         reloadTrigger={reloadTrigger}
//                         setReloadTrigger={setReloadTrigger}
//                     />
//                 )}

//                 {/* Edit Todo Modal */}
//                 {isEditModalOpen && editingTodo && (
//                     <EditTodo
//                         editingTodo={editingTodo}
//                         onClose={closeEditModal}
//                         handleUpdate={handleUpdate}
//                         reloadTrigger={reloadTrigger}
//                         setReloadTrigger={setReloadTrigger}
//                     />
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// export default ToDOPage;


import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import {
    Pencil,
    Trash2,
    Eye,
    FileText,
    Calendar,
    Clock,
    Plus,
    AlertTriangle,
} from "lucide-react";
import AddTodo from "@/AddFormComponents/AddTodo";
import EditTodo from "@/EditFormComponents/EditTodo";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import TodoDetailPopup, {
    getDueInfo,
    formatDate,
    getCompletionDuration,
    isLateCompletion,
} from "@/PopupComponents/TodoDetailPopup";
import { Head } from "@inertiajs/react";
import PageLoader from "@/Loader/PageLoader";
import toast, { Toaster } from "react-hot-toast";

const TodoCard = ({ todo, onView, onEdit, onDelete }) => {
    const isLocked = todo.is_completed;
    const dueInfo = getDueInfo(todo.due_date, isLocked);
    const completionDuration = getCompletionDuration(todo);
    const lateCompletion = isLateCompletion(todo);
    const descCount = todo.descriptions?.length || 0;

    const barColor = isLocked
        ? lateCompletion
            ? "#D64545"
            : "#2F5D50"
        : dueInfo?.color === "text-red-600"
          ? "#D64545"
          : "#F2A93B";

    return (
        <div
            onClick={() => onView(todo)}
            className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden"
            style={{ borderLeft: `4px solid ${barColor}` }}
        >
            {/* Stub row */}
            <div className="flex items-center justify-between px-4 pt-3">
                {/* <span className="font-mono text-[11px] tracking-wide text-gray-400">
                    TD-{String(todo.id).padStart(4, "0")}
                </span> */}
                <span className="font-mono text-[11px] tracking-wide text-gray-400">
    TD-{String(todo.sequence_no).padStart(4, "0")}
</span>
                <span className="flex items-center gap-1.5">
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            isLocked
                                ? lateCompletion
                                    ? "bg-[#D64545]"
                                    : "bg-[#2F5D50]"
                                : "bg-yellow-400"
                        }`}
                    />
                    <span className="text-[11px] font-medium text-gray-500">
                        {isLocked
                            ? lateCompletion
                                ? "Completed late"
                                : "Complete"
                            : "Incomplete"}
                    </span>
                </span>
            </div>

            {/* Perforation */}
            <div className="relative my-2.5 mx-4">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F3F4F7] border border-gray-200" />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F3F4F7] border border-gray-200" />
                <div className="border-t border-dashed border-gray-200" />
            </div>

            {/* Details */}
            <div className="px-4 pb-4">
                <h3 className="font-semibold text-gray-800 leading-snug mb-3 line-clamp-2 min-h-[2.5rem]">
                    {todo.title}
                </h3>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        {completionDuration ? (
                            <span
                                className={`flex items-center gap-1 ${
                                    lateCompletion
                                        ? "text-red-700"
                                        : "text-green-700"
                                }`}
                            >
                                {lateCompletion ? (
                                    <AlertTriangle size={12} />
                                ) : (
                                    <Clock size={12} />
                                )}
                                {lateCompletion ? "Late · " : "Completed in "}
                                {completionDuration}
                            </span>
                        ) : (
                            <span
                                className={`flex items-center gap-1 ${
                                    dueInfo ? dueInfo.color : ""
                                }`}
                            >
                                <Calendar size={12} />{" "}
                                {formatDate(todo.due_date)}
                                {dueInfo && <span>· {dueInfo.text}</span>}
                            </span>
                        )}
                        {/* {descCount > 0 && (
                            <span className="flex items-center gap-1">
                                <FileText size={12} /> {descCount}
                            </span>
                        )} */}
                    </div>

                    <div
                        className="flex items-center gap-2 "
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => onView(todo)}
                            className="text-gray-500 hover:text-blue-700"
                            title="View todo details"
                        >
                            <Eye size={15} />
                        </button>
                        {!isLocked && (
                            <button
                                onClick={() => onEdit(todo)}
                                className="text-[#2F5D50] hover:text-[#1D3B32]"
                                title="Edit todo"
                            >
                                <Pencil size={15} />
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(todo.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete todo"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ToDOPage = () => {
    const [allTodo, setAllTodo] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [editingTodo, setEditingTodo] = useState(null);

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourtodo.index"));
                setAllTodo(response.data.data || []);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodo();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this todo?")) {
            return;
        }

        try {
            await axios.delete(route("ourtodo.destroy", { id: id }));
            setReloadTrigger((prev) => !prev);
            if (selectedTodo?.id === id) setSelectedTodo(null);
            toast.success("Todo deleted successfully.");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete todo. Please try again.");
        }
    };

    const handleEdit = (todo) => {
        if (todo.is_completed) return;
        setEditingTodo(todo);
        setIsEditModalOpen(true);
    };

    const handleAdd = async (formData) => {
        try {
            const response = await axios.post(route("ourtodo.store"), formData);
            setReloadTrigger((prev) => !prev);
            setIsAddModalOpen(false);
            toast.success("Todo created successfully.");
            return response.data;
        } catch (error) {
            console.log("Error adding todo", error);
            toast.error("Failed to create todo. Please try again.");
            throw error;
        }
    };

    const handleUpdate = async (formData, id) => {
        try {
            const response = await axios.put(
                route("ourtodo.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            setEditingTodo(null);
            setIsEditModalOpen(false);
            // Keep the details popup in sync if it's open for this todo
            setSelectedTodo((prev) =>
                prev && prev.id === id ? response.data.data : prev,
            );
            toast.success("Todo updated successfully.");
            return response.data;
        } catch (error) {
            console.log("Error updating todo", error);
            toast.error("Failed to update todo. Please try again.");
            throw error;
        }
    };

    // The popup's FormData-based quick actions (e.g. "Mark complete") post
    // through the same PUT route/content-type as handleUpdate.
    const handleQuickUpdate = async (formData, id) => handleUpdate(formData, id);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTodo(null);
    };

    // Sort: incomplete first, then by nearest due date
    const sortedTodo = useMemo(() => {
        return [...allTodo].sort((a, b) => {
            if (a.is_completed !== b.is_completed) {
                return a.is_completed ? 1 : -1;
            }
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;
            return new Date(a.due_date) - new Date(b.due_date);
        });
    }, [allTodo]);

    return (
        <AdminWrapper>
            <Head title="ToDo List" />
            <Toaster position="top-right" />

            <div className="bg-[#F3F4F7] -m-6 p-6 h-full overflow-y-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        ToDo List
                    </h1>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {loading ? (
                    <PageLoader />
                ) : sortedTodo.length === 0 ? (
                    <div className="border border-dashed border-gray-300 rounded-lg py-16 text-center bg-white">
                        <FileText size={56} className="mx-auto text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500 mb-1">
                            No todos yet
                        </h4>
                        <p className="text-gray-400 text-sm mb-6">
                            Create your first todo to get started.
                        </p>
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                            <Plus size={16} />
                            Create Todo
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedTodo.map((todo) => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                onView={setSelectedTodo}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                <TodoDetailPopup
                    todo={selectedTodo}
                    onClose={() => setSelectedTodo(null)}
                    onEdit={handleEdit}
                    onQuickUpdate={handleQuickUpdate}
                />

                {/* Add Todo Modal */}
                {isAddModalOpen && (
                    <AddTodo
                        onClose={closeAddModal}
                        handleAdd={handleAdd}
                        reloadTrigger={reloadTrigger}
                        setReloadTrigger={setReloadTrigger}
                    />
                )}

                {/* Edit Todo Modal */}
                {isEditModalOpen && editingTodo && (
                    <EditTodo
                        editingTodo={editingTodo}
                        onClose={closeEditModal}
                        handleUpdate={handleUpdate}
                        reloadTrigger={reloadTrigger}
                        setReloadTrigger={setReloadTrigger}
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default ToDOPage;
