// import AddTaskAssignedForm from "@/AddFormComponents/AddTaskAssignedForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const TaskAssigned = () => {
//     const [allTaskAssigned, setAllTaskAssigned] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTaskAssigned, setEditingTaskAssigned] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the task assigned data
//     useEffect(() => {
//         const fetchTaskAssigned = async () => {
//             try {
//                 const response = await axios.get(route("ourtaskassigned.index"));
//                 setAllTaskAssigned(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchTaskAssigned();
//     }, [reloadTrigger]);

//     // For delete the task assigned
//     const handleDelete = async (id) => {
//          if (!window.confirm("Are you sure you want to delete this task assigned?"))
//             return;
//         try {
//             const response = await axios.delete(
//                 route("ourtaskassigned.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (taskAssigned) => {
//         setEditingTaskAssigned(taskAssigned);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourtaskassigned.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating task assigned", error);
//             throw error;
//         }
//     };
//     return (
//         <>
//             <AdminWrapper>
//                 <div className="mb-8 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                             Task Assigned
//                         </h1>
//                     </div>
//                     <button
//                         onClick={() => setShowForm(true)}
//                         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                     >
//                         <Plus size={18} />
//                         <span>Create</span>
//                     </button>
//                 </div>

//                 <AddTaskAssignedForm
//                     showForm={showForm}
//                     setShowForm={setShowForm}
//                     setReloadTrigger={setReloadTrigger}
//                     editingTaskAssigned={editingTaskAssigned}
//                     setEditingTaskAssigned={setEditingTaskAssigned}
//                     handleUpdate={handleUpdate}
//                 />
//             </AdminWrapper>
//         </>
//     );
// };

// export default TaskAssigned;



import AddTaskAssignedForm from "@/AddFormComponents/AddTaskAssignedForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Plus, Pencil, Trash2, Paperclip, Calendar } from "lucide-react";
import React, { useEffect, useState } from "react";

const STATUS_COLUMNS = [
    {
        key: "Pending",
        label: "Pending",
        color: "bg-gray-100 text-gray-700",
        bar: "bg-gray-400",
    },
    {
        key: "In Progress",
        label: "In Progress",
        color: "bg-blue-100 text-blue-700",
        bar: "bg-blue-500",
    },
    {
        key: "Completed",
        label: "Completed",
        color: "bg-green-100 text-green-700",
        bar: "bg-green-500",
    },
];

const PRIORITY_STYLES = {
    High: "bg-red-100 text-red-700 border border-red-200",
    Medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Low: "bg-green-100 text-green-700 border border-green-200",
};

const getProgress = (taskItems) => {
    if (!taskItems || taskItems.length === 0) return 0;
    const completed = taskItems.filter((i) => i.status === "Completed").length;
    return Math.round((completed / taskItems.length) * 100);
};

const getDueInfo = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
        return {
            text: `${Math.abs(diffDays)}d overdue`,
            color: "text-red-600",
        };
    if (diffDays === 0) return { text: "Due today", color: "text-orange-600" };
    if (diffDays <= 2)
        return { text: `${diffDays}d left`, color: "text-orange-500" };
    return { text: `${diffDays}d left`, color: "text-gray-500" };
};

// const TaskCard = ({ task, onEdit, onDelete }) => {
//     const progress = getProgress(task.task_items);
//     const dueInfo = getDueInfo(task.due_date);

//     return (
//         <div
//             onClick={() => onEdit(task)}
//             className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//         >
//             <div className="flex justify-between items-start mb-2">
//                 <span className="text-xs font-mono text-gray-400">{task.task_id}</span>
//                 <span
//                     className={`text-xs px-2 py-0.5 rounded-full font-medium ${
//                         PRIORITY_STYLES[task.priority] || "bg-gray-100 text-gray-600"
//                     }`}
//                 >
//                     {task.priority}
//                 </span>
//             </div>

//             <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
//             <p className="text-xs text-gray-500 mb-3">{task.department}</p>

//             {task.task_items?.length > 0 && (
//                 <div className="mb-3">
//                     <div className="flex justify-between text-xs text-gray-500 mb-1">
//                         <span>Checklist</span>
//                         <span>{progress}%</span>
//                     </div>
//                     <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                         <div
//                             className="h-full bg-indigo-500 rounded-full transition-all"
//                             style={{ width: `${progress}%` }}
//                         />
//                     </div>
//                 </div>
//             )}

//             <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//                 <div className="flex items-center gap-3 text-xs text-gray-500">
//                     {dueInfo && (
//                         <span className={`flex items-center gap-1 ${dueInfo.color}`}>
//                             <Calendar size={12} /> {dueInfo.text}
//                         </span>
//                     )}
//                     {task.attachments?.length > 0 && (
//                         <span className="flex items-center gap-1">
//                             <Paperclip size={12} /> {task.attachments.length}
//                         </span>
//                     )}
//                 </div>

//                 <div className="flex items-center gap-2">
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             onEdit(task);
//                         }}
//                         className="text-gray-400 hover:text-indigo-600"
//                     >
//                         <Pencil size={15} />
//                     </button>
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             onDelete(task.id);
//                         }}
//                         className="text-gray-400 hover:text-red-600"
//                     >
//                         <Trash2 size={15} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

const TaskCard = ({ task, onEdit, onDelete }) => {
    const progress = getProgress(task.task_items);
    const dueInfo = getDueInfo(task.due_date);

    return (
        <div
            onClick={() => onEdit(task)}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-gray-400">
                    {task.task_id}
                </span>
                <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        PRIORITY_STYLES[task.priority] ||
                        "bg-gray-100 text-gray-600"
                    }`}
                >
                    {task.priority}
                </span>
            </div>

            <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>

            <div className="flex items-center gap-2 mb-3">
                {task.department && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                        {task.department}
                    </span>
                )}
                {task.assigned_user && (
                    <span className="text-xs text-gray-500">
                        → {task.assigned_user.name}
                    </span>
                )}
            </div>

            {task.task_items?.length > 0 && (
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Checklist</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    {dueInfo && (
                        <span
                            className={`flex items-center gap-1 ${dueInfo.color}`}
                        >
                            <Calendar size={12} /> {dueInfo.text}
                        </span>
                    )}
                    {task.attachments?.length > 0 && (
                        <span className="flex items-center gap-1">
                            <Paperclip size={12} /> {task.attachments.length}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                        }}
                        className="text-gray-400 hover:text-indigo-600"
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                        }}
                        className="text-gray-400 hover:text-red-600"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {task.creator && (
                <p className="text-[11px] text-gray-400 mt-2">
                    Assigned by {task.creator.name}
                </p>
            )}
        </div>
    );
};

const TaskAssigned = () => {
    const [allTaskAssigned, setAllTaskAssigned] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTaskAssigned, setEditingTaskAssigned] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTaskAssigned = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    route("ourtaskassigned.index"),
                );
                setAllTaskAssigned(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskAssigned();
    }, [reloadTrigger]);

    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(
                route("ourtaskassigned.store"),
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error creating task assigned", error);
            throw error;
        }
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourtaskassigned.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating task assigned", error);
            throw error;
        }
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this task assigned?",
            )
        )
            return;
        try {
            await axios.delete(route("ourtaskassigned.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (taskAssigned) => {
        setEditingTaskAssigned(taskAssigned);
        setShowForm(true);
    };

    return (
        <AdminWrapper>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        Task Assigned
                    </h1>
                    <p className="text-sm text-gray-500">
                        {allTaskAssigned.length} total tasks
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 py-10">
                    Loading tasks...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {STATUS_COLUMNS.map((col) => {
                        const tasks = allTaskAssigned.filter(
                            (t) => t.status === col.key,
                        );
                        return (
                            <div
                                key={col.key}
                                className="bg-gray-50 rounded-xl p-4"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span
                                        className={`text-sm font-semibold px-3 py-1 rounded-full ${col.color}`}
                                    >
                                        {col.label}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {tasks.length}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {tasks.length === 0 ? (
                                        <p className="text-xs text-gray-400 italic">
                                            No tasks here
                                        </p>
                                    ) : (
                                        tasks.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <AddTaskAssignedForm
                showForm={showForm}
                setShowForm={setShowForm}
                editingTaskAssigned={editingTaskAssigned}
                setEditingTaskAssigned={setEditingTaskAssigned}
                handleCreate={handleCreate}
                handleUpdate={handleUpdate}
            />
        </AdminWrapper>
    );
};

export default TaskAssigned;
