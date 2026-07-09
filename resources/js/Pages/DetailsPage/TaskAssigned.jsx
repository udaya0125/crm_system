import AddTaskAssignedForm from "@/AddFormComponents/AddTaskAssignedForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import TaskDetailPopup, {
    STATUS_STYLES,
    getDeptStyle,
    getProgress,
    getDueInfo,
    PRIORITY_DOT,
} from "@/PopupComponents/TaskDetailPopup";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import {
    Plus,
    Pencil,
    Trash2,
    Paperclip,
    Calendar,
    Search,
    X,
    User,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import EditTaskAssignedForm from "@/EditFormComponents/EditTaskAssignedForm";


const TaskCard = ({ task, onEdit, onView, onDelete }) => {
    const progress = getProgress(task.task_items);
    const dueInfo = getDueInfo(task.due_date);
    const dept = getDeptStyle(task.department);

    return (
        <div
            onClick={() => onView(task)}
            className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden"
            style={{ borderLeft: `4px solid ${dept.bar}` }}
        >
            {/* Stub row */}
            <div className="flex items-center justify-between px-4 pt-3">
                <span className="font-mono text-[11px] tracking-wide text-gray-400">
                    {task.task_id}
                </span>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: STATUS_STYLES[task.status]?.bar || "#CBD5E1" }}
                        />
                        <span className="text-[11px] font-medium text-gray-500">{task.status}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: PRIORITY_DOT[task.priority] || "#CBD5E1" }}
                        />
                        <span className="text-[11px] font-medium text-gray-500">{task.priority}</span>
                    </span>
                </div>
            </div>

            {/* Perforation */}
            <div className="relative my-2.5 mx-4">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F3F4F7] border border-gray-200" />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F3F4F7] border border-gray-200" />
                <div className="border-t border-dashed border-gray-200" />
            </div>

            {/* Details */}
            <div className="px-4 pb-4">
                <h3 className="font-semibold text-gray-800 leading-snug mb-2">{task.title}</h3>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                        className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ backgroundColor: dept.bg, color: dept.text }}
                    >
                        {dept.label}
                    </span>
                    {task.assigned_user && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <User size={11} /> {task.assigned_user.name}
                        </span>
                    )}
                </div>

                {task.task_items?.length > 0 && (
                    <div className="mb-3">
                        <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                            <span>Checklist</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${progress}%`, backgroundColor: dept.bar }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        {dueInfo && (
                            <span className={`flex items-center gap-1 ${dueInfo.color}`}>
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
                            className="text-[#2F5D50] hover:text-[#1D3B32]"
                            title="Edit ticket"
                        >
                            <Pencil size={15} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(task.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                            title="Delete ticket"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                </div>

                {task.creator && (
                    <p className="text-[11px] text-gray-400 mt-2">Dispatched by {task.creator.name}</p>
                )}
            </div>
        </div>
    );
};

const Pagination = ({ meta, onPageChange }) => {
    if (!meta || meta.last_page <= 1) return null;

    const { current_page, last_page } = meta;
    const baseBtn =
        "w-9 h-9 flex items-center justify-center rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition";

    return (
        <div className="flex items-center justify-center gap-1.5 mt-8">
            <button
                type="button"
                className={baseBtn}
                onClick={() => onPageChange(1)}
                disabled={current_page === 1}
                title="First page"
            >
                «
            </button>
            <button
                type="button"
                className={baseBtn}
                onClick={() => onPageChange(current_page - 1)}
                disabled={current_page === 1}
                title="Previous page"
            >
                ‹
            </button>
            <span className="px-4 h-9 flex items-center font-mono text-xs text-gray-500">
                Page {current_page} of {last_page}
            </span>
            <button
                type="button"
                className={baseBtn}
                onClick={() => onPageChange(current_page + 1)}
                disabled={current_page === last_page}
                title="Next page"
            >
                ›
            </button>
            <button
                type="button"
                className={baseBtn}
                onClick={() => onPageChange(last_page)}
                disabled={current_page === last_page}
                title="Last page"
            >
                »
            </button>
        </div>
    );
};

const TaskAssigned = () => {
    const { auth } = usePage().props;
    const currentUser = auth?.user;
    const isPrivileged = ["admin", "manager"].includes(currentUser?.role);

    const [allTaskAssigned, setAllTaskAssigned] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTaskAssigned, setEditingTaskAssigned] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [viewingTask, setViewingTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [mineOnly, setMineOnly] = useState(false);

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    useEffect(() => {
        const fetchTaskAssigned = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourtaskassigned.index", { page }));
                setAllTaskAssigned(response.data.data);
                setMeta({
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    total: response.data.total,
                });
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskAssigned();
    }, [reloadTrigger, page]);

    const departmentOptions = useMemo(() => {
        const roles = [...new Set(allTaskAssigned.map((t) => t.department).filter(Boolean))];
        return roles.map((r) => ({ value: r, label: getDeptStyle(r).label }));
    }, [allTaskAssigned]);

    const filteredTasks = useMemo(() => {
        const q = search.trim().toLowerCase();
        return allTaskAssigned.filter((t) => {
            if (q) {
                const haystack = `${t.task_id} ${t.title} ${t.description || ""}`.toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            if (isPrivileged && deptFilter !== "all" && t.department !== deptFilter) return false;
            if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
            if (statusFilter !== "all" && t.status !== statusFilter) return false;
            if (isPrivileged && mineOnly && currentUser && t.assigned_team !== currentUser.id) return false;
            return true;
        });
    }, [allTaskAssigned, search, deptFilter, priorityFilter, statusFilter, mineOnly, currentUser, isPrivileged]);

    const hasActiveFilters =
        search ||
        (isPrivileged && deptFilter !== "all") ||
        priorityFilter !== "all" ||
        statusFilter !== "all" ||
        (isPrivileged && mineOnly);

    const clearFilters = () => {
        setSearch("");
        setDeptFilter("all");
        setPriorityFilter("all");
        setStatusFilter("all");
        setMineOnly(false);
    };

    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(route("ourtaskassigned.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
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
            const response = await axios.post(route("ourtaskassigned.update", { id }), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating task assigned", error);
            throw error;
        }
    };

    // Used by the detail popup for inline edits (due date, status, checklist
    // items, admin notes). Reuses handleUpdate for the actual request, but
    // also syncs the freshly-returned task back into local state so the
    // popup and card list reflect the change immediately without waiting
    // on the next full refetch triggered by reloadTrigger.
    const handleQuickUpdate = async (formData, id) => {
        const data = await handleUpdate(formData, id);
        if (data?.data) {
            setViewingTask(data.data);
            setAllTaskAssigned((prev) => prev.map((t) => (t.id === id ? data.data : t)));
        }
        return data;
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task assigned?")) return;
        try {
            await axios.delete(route("ourtaskassigned.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (taskAssigned) => {
        setViewingTask(null);
        setEditingTaskAssigned(taskAssigned);
        setShowEditForm(true);
    };

    const handleView = (taskAssigned) => {
        setViewingTask(taskAssigned);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > meta.last_page || newPage === meta.current_page) return;
        setPage(newPage);
    };

    const openTickets = allTaskAssigned.filter((t) => t.status !== "Completed").length;

    return (
        <AdminWrapper>
            <div className="bg-[#F3F4F7] -m-6 p-6 h-full overflow-y-auto">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="font-mono text-[11px] tracking-[0.2em] text-gray-400 uppercase mb-1">
                            Operations Board
                        </p>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Task Dispatch</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 rounded-full border-2 border-dashed border-gray-300 px-3 py-1.5">
                            <span className="font-mono text-sm font-semibold text-gray-700">{meta.total}</span>
                            <span className="text-xs text-gray-500">total tickets</span>
                        </div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-4 py-2 flex items-center gap-2 bg-[#2F5D50] text-white rounded-full hover:bg-[#264C41] transition shadow-sm"
                        >
                            <Plus size={18} />
                            <span>New ticket</span>
                        </button>
                    </div>
                </div>

                {/* Search + filters */}
                <div className="flex flex-wrap items-center gap-2 mb-6 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title or ticket ID..."
                            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
                        />
                    </div>

                    {isPrivileged && (
                        <select
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
                        >
                            <option value="all">All departments</option>
                            {departmentOptions.map((d) => (
                                <option key={d.value} value={d.value}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                    )}

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
                    >
                        <option value="all">All priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
                    >
                        <option value="all">All statuses</option>
                        {Object.keys(STATUS_STYLES).map((key) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>

                    {isPrivileged && (
                        <button
                            type="button"
                            onClick={() => setMineOnly((prev) => !prev)}
                            className={`text-sm px-3 py-2 rounded-lg border transition ${
                                mineOnly
                                    ? "bg-[#2F5D50] border-[#2F5D50] text-white"
                                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Assigned to me
                        </button>
                    )}

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-sm px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 flex items-center gap-1"
                        >
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-10">Loading tickets...</div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-xs uppercase tracking-wider text-gray-500">
                                {statusFilter === "all" ? "All tickets" : statusFilter}
                            </span>
                            <span className="text-xs font-mono text-gray-400 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
                                {filteredTasks.length}
                            </span>
                        </div>

                        {filteredTasks.length === 0 ? (
                            <div className="border border-dashed border-gray-300 rounded-lg py-10 text-center">
                                <p className="text-sm text-gray-400 italic">
                                    {hasActiveFilters ? "No tickets match your filters" : "No tickets yet"}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredTasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={handleEdit}
                                        onView={handleView}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}

                        <Pagination meta={meta} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>

            <TaskDetailPopup
                task={viewingTask}
                onClose={() => setViewingTask(null)}
                onEdit={handleEdit}
                onQuickUpdate={handleQuickUpdate}
            />

            <AddTaskAssignedForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                handleCreate={handleCreate}
            />

            <EditTaskAssignedForm
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                editingTaskAssigned={editingTaskAssigned}
                setEditingTaskAssigned={setEditingTaskAssigned}
                handleUpdate={handleUpdate}
            />
        </AdminWrapper>
    );
};

export default TaskAssigned;

// import AddTaskAssignedForm from "@/AddFormComponents/AddTaskAssignedForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import TaskDetailPopup, {
//     STATUS_STYLES,
//     getDeptStyle,
//     getProgress,
//     getDueInfo,
//     PRIORITY_DOT,
// } from "@/PopupComponents/TaskDetailPopup";
// import axios from "axios";
// import { usePage } from "@inertiajs/react";
// import {
//     Plus,
//     Pencil,
//     Trash2,
//     Paperclip,
//     Calendar,
//     Search,
//     X,
//     User,
// } from "lucide-react";
// import React, { useEffect, useMemo, useState } from "react";
// import EditTaskAssignedForm from "@/EditFormComponents/EditTaskAssignedForm";


// const TaskCard = ({ task, onEdit, onView, onDelete }) => {
//     const progress = getProgress(task.task_items);
//     const dueInfo = getDueInfo(task.due_date);
//     const dept = getDeptStyle(task.department);

//     return (
//         <div
//             onClick={() => onView(task)}
//             className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden"
//             style={{ borderLeft: `4px solid ${dept.bar}` }}
//         >
//             {/* Stub row */}
//             <div className="flex items-center justify-between px-4 pt-3">
//                 <span className="font-mono text-[11px] tracking-wide text-gray-400">
//                     {task.task_id}
//                 </span>
//                 <div className="flex items-center gap-3">
//                     <span className="flex items-center gap-1.5">
//                         <span
//                             className="w-1.5 h-1.5 rounded-full"
//                             style={{ backgroundColor: STATUS_STYLES[task.status]?.bar || "#CBD5E1" }}
//                         />
//                         <span className="text-[11px] font-medium text-gray-500">{task.status}</span>
//                     </span>
//                     <span className="flex items-center gap-1.5">
//                         <span
//                             className="w-1.5 h-1.5 rounded-full"
//                             style={{ backgroundColor: PRIORITY_DOT[task.priority] || "#CBD5E1" }}
//                         />
//                         <span className="text-[11px] font-medium text-gray-500">{task.priority}</span>
//                     </span>
//                 </div>
//             </div>

//             {/* Perforation */}
//             <div className="relative my-2.5 mx-4">
//                 <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F3F4F7] border border-gray-200" />
//                 <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F3F4F7] border border-gray-200" />
//                 <div className="border-t border-dashed border-gray-200" />
//             </div>

//             {/* Details */}
//             <div className="px-4 pb-4">
//                 <h3 className="font-semibold text-gray-800 leading-snug mb-2">{task.title}</h3>

//                 <div className="flex items-center gap-2 mb-3 flex-wrap">
//                     <span
//                         className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
//                         style={{ backgroundColor: dept.bg, color: dept.text }}
//                     >
//                         {dept.label}
//                     </span>
//                     {task.assigned_user && (
//                         <span className="text-xs text-gray-500 flex items-center gap-1">
//                             <User size={11} /> {task.assigned_user.name}
//                         </span>
//                     )}
//                 </div>

//                 {task.task_items?.length > 0 && (
//                     <div className="mb-3">
//                         <div className="flex justify-between text-[11px] text-gray-400 mb-1">
//                             <span>Checklist</span>
//                             <span>{progress}%</span>
//                         </div>
//                         <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
//                             <div
//                                 className="h-full rounded-full transition-all"
//                                 style={{ width: `${progress}%`, backgroundColor: dept.bar }}
//                             />
//                         </div>
//                     </div>
//                 )}

//                 <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//                     <div className="flex items-center gap-3 text-xs text-gray-500">
//                         {dueInfo && (
//                             <span className={`flex items-center gap-1 ${dueInfo.color}`}>
//                                 <Calendar size={12} /> {dueInfo.text}
//                             </span>
//                         )}
//                         {task.attachments?.length > 0 && (
//                             <span className="flex items-center gap-1">
//                                 <Paperclip size={12} /> {task.attachments.length}
//                             </span>
//                         )}
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 onEdit(task);
//                             }}
//                             className="text-[#2F5D50] hover:text-[#1D3B32]"
//                             title="Edit ticket"
//                         >
//                             <Pencil size={15} />
//                         </button>
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 onDelete(task.id);
//                             }}
//                             className="text-red-500 hover:text-red-700"
//                             title="Delete ticket"
//                         >
//                             <Trash2 size={15} />
//                         </button>
//                     </div>
//                 </div>

//                 {task.creator && (
//                     <p className="text-[11px] text-gray-400 mt-2">Dispatched by {task.creator.name}</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// const TaskAssigned = () => {
//     const { auth } = usePage().props;
//     const currentUser = auth?.user;
//     const isPrivileged = ["admin", "manager"].includes(currentUser?.role);

//     const [allTaskAssigned, setAllTaskAssigned] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTaskAssigned, setEditingTaskAssigned] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [viewingTask, setViewingTask] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const [search, setSearch] = useState("");
//     const [deptFilter, setDeptFilter] = useState("all");
//     const [priorityFilter, setPriorityFilter] = useState("all");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [mineOnly, setMineOnly] = useState(false);

//     useEffect(() => {
//         const fetchTaskAssigned = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourtaskassigned.index"));
//                 setAllTaskAssigned(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTaskAssigned();
//     }, [reloadTrigger]);

//     const departmentOptions = useMemo(() => {
//         const roles = [...new Set(allTaskAssigned.map((t) => t.department).filter(Boolean))];
//         return roles.map((r) => ({ value: r, label: getDeptStyle(r).label }));
//     }, [allTaskAssigned]);

//     const filteredTasks = useMemo(() => {
//         const q = search.trim().toLowerCase();
//         return allTaskAssigned.filter((t) => {
//             if (q) {
//                 const haystack = `${t.task_id} ${t.title} ${t.description || ""}`.toLowerCase();
//                 if (!haystack.includes(q)) return false;
//             }
//             if (isPrivileged && deptFilter !== "all" && t.department !== deptFilter) return false;
//             if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
//             if (statusFilter !== "all" && t.status !== statusFilter) return false;
//             if (isPrivileged && mineOnly && currentUser && t.assigned_team !== currentUser.id) return false;
//             return true;
//         });
//     }, [allTaskAssigned, search, deptFilter, priorityFilter, statusFilter, mineOnly, currentUser, isPrivileged]);

//     const hasActiveFilters =
//         search ||
//         (isPrivileged && deptFilter !== "all") ||
//         priorityFilter !== "all" ||
//         statusFilter !== "all" ||
//         (isPrivileged && mineOnly);

//     const clearFilters = () => {
//         setSearch("");
//         setDeptFilter("all");
//         setPriorityFilter("all");
//         setStatusFilter("all");
//         setMineOnly(false);
//     };

//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(route("ourtaskassigned.store"), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error creating task assigned", error);
//             throw error;
//         }
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(route("ourtaskassigned.update", { id }), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating task assigned", error);
//             throw error;
//         }
//     };

//     // Used by the detail popup for inline edits (due date, status, checklist
//     // items, admin notes). Reuses handleUpdate for the actual request, but
//     // also syncs the freshly-returned task back into local state so the
//     // popup and card list reflect the change immediately without waiting
//     // on the next full refetch triggered by reloadTrigger.
//     const handleQuickUpdate = async (formData, id) => {
//         const data = await handleUpdate(formData, id);
//         if (data?.data) {
//             setViewingTask(data.data);
//             setAllTaskAssigned((prev) => prev.map((t) => (t.id === id ? data.data : t)));
//         }
//         return data;
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this task assigned?")) return;
//         try {
//             await axios.delete(route("ourtaskassigned.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (taskAssigned) => {
//         setViewingTask(null);
//         setEditingTaskAssigned(taskAssigned);
//         setShowEditForm(true);
//     };

//     const handleView = (taskAssigned) => {
//         setViewingTask(taskAssigned);
//     };

//     const openTickets = allTaskAssigned.filter((t) => t.status !== "Completed").length;

//     return (
//         <AdminWrapper>
//             <div className="bg-[#F3F4F7] -m-6 p-6 h-full overflow-y-auto">
//                 {/* Header */}
//                 <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
//                     <div>
//                         <p className="font-mono text-[11px] tracking-[0.2em] text-gray-400 uppercase mb-1">
//                             Operations Board
//                         </p>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Task Dispatch</h1>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <div className="hidden sm:flex items-center gap-2 rounded-full border-2 border-dashed border-gray-300 px-3 py-1.5">
//                             <span className="font-mono text-sm font-semibold text-gray-700">{openTickets}</span>
//                             <span className="text-xs text-gray-500">open tickets</span>
//                         </div>
//                         <button
//                             onClick={() => setShowAddForm(true)}
//                             className="px-4 py-2 flex items-center gap-2 bg-[#2F5D50] text-white rounded-full hover:bg-[#264C41] transition shadow-sm"
//                         >
//                             <Plus size={18} />
//                             <span>New ticket</span>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Search + filters */}
//                 <div className="flex flex-wrap items-center gap-2 mb-6 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
//                     <div className="relative flex-1 min-w-[200px]">
//                         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             placeholder="Search by title or ticket ID..."
//                             className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         />
//                     </div>

//                     {isPrivileged && (
//                         <select
//                             value={deptFilter}
//                             onChange={(e) => setDeptFilter(e.target.value)}
//                             className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         >
//                             <option value="all">All departments</option>
//                             {departmentOptions.map((d) => (
//                                 <option key={d.value} value={d.value}>
//                                     {d.label}
//                                 </option>
//                             ))}
//                         </select>
//                     )}

//                     <select
//                         value={priorityFilter}
//                         onChange={(e) => setPriorityFilter(e.target.value)}
//                         className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                     >
//                         <option value="all">All priorities</option>
//                         <option value="High">High</option>
//                         <option value="Medium">Medium</option>
//                         <option value="Low">Low</option>
//                     </select>

//                     <select
//                         value={statusFilter}
//                         onChange={(e) => setStatusFilter(e.target.value)}
//                         className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                     >
//                         <option value="all">All statuses</option>
//                         {Object.keys(STATUS_STYLES).map((key) => (
//                             <option key={key} value={key}>
//                                 {key}
//                             </option>
//                         ))}
//                     </select>

//                     {isPrivileged && (
//                         <button
//                             type="button"
//                             onClick={() => setMineOnly((prev) => !prev)}
//                             className={`text-sm px-3 py-2 rounded-lg border transition ${
//                                 mineOnly
//                                     ? "bg-[#2F5D50] border-[#2F5D50] text-white"
//                                     : "border-gray-200 text-gray-600 hover:bg-gray-50"
//                             }`}
//                         >
//                             Assigned to me
//                         </button>
//                     )}

//                     {hasActiveFilters && (
//                         <button
//                             type="button"
//                             onClick={clearFilters}
//                             className="text-sm px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 flex items-center gap-1"
//                         >
//                             <X size={14} /> Clear
//                         </button>
//                     )}
//                 </div>

//                 {loading ? (
//                     <div className="text-center text-gray-400 py-10">Loading tickets...</div>
//                 ) : (
//                     <div>
//                         <div className="flex items-center justify-between mb-3">
//                             <span className="font-mono text-xs uppercase tracking-wider text-gray-500">
//                                 {statusFilter === "all" ? "All tickets" : statusFilter}
//                             </span>
//                             <span className="text-xs font-mono text-gray-400 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
//                                 {filteredTasks.length}
//                             </span>
//                         </div>

//                         {filteredTasks.length === 0 ? (
//                             <div className="border border-dashed border-gray-300 rounded-lg py-10 text-center">
//                                 <p className="text-sm text-gray-400 italic">
//                                     {hasActiveFilters ? "No tickets match your filters" : "No tickets yet"}
//                                 </p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 {filteredTasks.map((task) => (
//                                     <TaskCard
//                                         key={task.id}
//                                         task={task}
//                                         onEdit={handleEdit}
//                                         onView={handleView}
//                                         onDelete={handleDelete}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             <TaskDetailPopup
//                 task={viewingTask}
//                 onClose={() => setViewingTask(null)}
//                 onEdit={handleEdit}
//                 onQuickUpdate={handleQuickUpdate}
//             />

//             <AddTaskAssignedForm
//                 showForm={showAddForm}
//                 setShowForm={setShowAddForm}
//                 handleCreate={handleCreate}
//             />

//             <EditTaskAssignedForm
//                 showForm={showEditForm}
//                 setShowForm={setShowEditForm}
//                 editingTaskAssigned={editingTaskAssigned}
//                 setEditingTaskAssigned={setEditingTaskAssigned}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default TaskAssigned;



// import AddTaskAssignedForm from "@/AddFormComponents/AddTaskAssignedForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import TaskDetailPopup, {
//     STATUS_STYLES,
//     getDeptStyle,
//     getProgress,
//     getDueInfo,
//     PRIORITY_DOT,
// } from "@/PopupComponents/TaskDetailPopup";
// import axios from "axios";
// import { usePage } from "@inertiajs/react";
// import {
//     Plus,
//     Pencil,
//     Trash2,
//     Paperclip,
//     Calendar,
//     Search,
//     X,
//     User,
// } from "lucide-react";
// import React, { useEffect, useMemo, useState } from "react";

// // Ticket-stub card: a perforated line separates the tracking stub (id +
// // status + priority) from the job details, like a tear-off work order.
// // Clicking the card opens the read-only detail popup (onView); only the
// // pencil icon opens the edit form (onEdit).
// const TaskCard = ({ task, onEdit, onView, onDelete }) => {
//     const progress = getProgress(task.task_items);
//     const dueInfo = getDueInfo(task.due_date);
//     const dept = getDeptStyle(task.department);

//     return (
//         <div
//             onClick={() => onView(task)}
//             className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden"
//             style={{ borderLeft: `4px solid ${dept.bar}` }}
//         >
//             {/* Stub row */}
//             <div className="flex items-center justify-between px-4 pt-3">
//                 <span className="font-mono text-[11px] tracking-wide text-gray-400">
//                     {task.task_id}
//                 </span>
//                 <div className="flex items-center gap-3">
//                     <span className="flex items-center gap-1.5">
//                         <span
//                             className="w-1.5 h-1.5 rounded-full"
//                             style={{ backgroundColor: STATUS_STYLES[task.status]?.bar || "#CBD5E1" }}
//                         />
//                         <span className="text-[11px] font-medium text-gray-500">{task.status}</span>
//                     </span>
//                     <span className="flex items-center gap-1.5">
//                         <span
//                             className="w-1.5 h-1.5 rounded-full"
//                             style={{ backgroundColor: PRIORITY_DOT[task.priority] || "#CBD5E1" }}
//                         />
//                         <span className="text-[11px] font-medium text-gray-500">{task.priority}</span>
//                     </span>
//                 </div>
//             </div>

//             {/* Perforation */}
//             <div className="relative my-2.5 mx-4">
//                 <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F3F4F7] border border-gray-200" />
//                 <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F3F4F7] border border-gray-200" />
//                 <div className="border-t border-dashed border-gray-200" />
//             </div>

//             {/* Details */}
//             <div className="px-4 pb-4">
//                 <h3 className="font-semibold text-gray-800 leading-snug mb-2">{task.title}</h3>

//                 <div className="flex items-center gap-2 mb-3 flex-wrap">
//                     <span
//                         className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
//                         style={{ backgroundColor: dept.bg, color: dept.text }}
//                     >
//                         {dept.label}
//                     </span>
//                     {task.assigned_user && (
//                         <span className="text-xs text-gray-500 flex items-center gap-1">
//                             <User size={11} /> {task.assigned_user.name}
//                         </span>
//                     )}
//                 </div>

//                 {task.task_items?.length > 0 && (
//                     <div className="mb-3">
//                         <div className="flex justify-between text-[11px] text-gray-400 mb-1">
//                             <span>Checklist</span>
//                             <span>{progress}%</span>
//                         </div>
//                         <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
//                             <div
//                                 className="h-full rounded-full transition-all"
//                                 style={{ width: `${progress}%`, backgroundColor: dept.bar }}
//                             />
//                         </div>
//                     </div>
//                 )}

//                 <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//                     <div className="flex items-center gap-3 text-xs text-gray-500">
//                         {dueInfo && (
//                             <span className={`flex items-center gap-1 ${dueInfo.color}`}>
//                                 <Calendar size={12} /> {dueInfo.text}
//                             </span>
//                         )}
//                         {task.attachments?.length > 0 && (
//                             <span className="flex items-center gap-1">
//                                 <Paperclip size={12} /> {task.attachments.length}
//                             </span>
//                         )}
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 onEdit(task);
//                             }}
//                             className="text-[#2F5D50] hover:text-[#1D3B32]"
//                             title="Edit ticket"
//                         >
//                             <Pencil size={15} />
//                         </button>
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 onDelete(task.id);
//                             }}
//                             className="text-red-500 hover:text-red-700"
//                             title="Delete ticket"
//                         >
//                             <Trash2 size={15} />
//                         </button>
//                     </div>
//                 </div>

//                 {task.creator && (
//                     <p className="text-[11px] text-gray-400 mt-2">Dispatched by {task.creator.name}</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// const TaskAssigned = () => {
//     const { auth } = usePage().props;
//     const currentUser = auth?.user;
//     const isPrivileged = ["admin", "manager"].includes(currentUser?.role);

//     const [allTaskAssigned, setAllTaskAssigned] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTaskAssigned, setEditingTaskAssigned] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [viewingTask, setViewingTask] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const [search, setSearch] = useState("");
//     const [deptFilter, setDeptFilter] = useState("all");
//     const [priorityFilter, setPriorityFilter] = useState("all");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [mineOnly, setMineOnly] = useState(false);

//     useEffect(() => {
//         const fetchTaskAssigned = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourtaskassigned.index"));
//                 setAllTaskAssigned(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTaskAssigned();
//     }, [reloadTrigger]);

//     const departmentOptions = useMemo(() => {
//         const roles = [...new Set(allTaskAssigned.map((t) => t.department).filter(Boolean))];
//         return roles.map((r) => ({ value: r, label: getDeptStyle(r).label }));
//     }, [allTaskAssigned]);

//     const filteredTasks = useMemo(() => {
//         const q = search.trim().toLowerCase();
//         return allTaskAssigned.filter((t) => {
//             if (q) {
//                 const haystack = `${t.task_id} ${t.title} ${t.description || ""}`.toLowerCase();
//                 if (!haystack.includes(q)) return false;
//             }
//             if (isPrivileged && deptFilter !== "all" && t.department !== deptFilter) return false;
//             if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
//             if (statusFilter !== "all" && t.status !== statusFilter) return false;
//             if (isPrivileged && mineOnly && currentUser && t.assigned_team !== currentUser.id) return false;
//             return true;
//         });
//     }, [allTaskAssigned, search, deptFilter, priorityFilter, statusFilter, mineOnly, currentUser, isPrivileged]);

//     const hasActiveFilters =
//         search ||
//         (isPrivileged && deptFilter !== "all") ||
//         priorityFilter !== "all" ||
//         statusFilter !== "all" ||
//         (isPrivileged && mineOnly);

//     const clearFilters = () => {
//         setSearch("");
//         setDeptFilter("all");
//         setPriorityFilter("all");
//         setStatusFilter("all");
//         setMineOnly(false);
//     };

//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(route("ourtaskassigned.store"), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error creating task assigned", error);
//             throw error;
//         }
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(route("ourtaskassigned.update", { id }), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating task assigned", error);
//             throw error;
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this task assigned?")) return;
//         try {
//             await axios.delete(route("ourtaskassigned.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (taskAssigned) => {
//         setViewingTask(null);
//         setEditingTaskAssigned(taskAssigned);
//         setShowForm(true);
//     };

//     const handleView = (taskAssigned) => {
//         setViewingTask(taskAssigned);
//     };

//     const openTickets = allTaskAssigned.filter((t) => t.status !== "Completed").length;

//     return (
//         <AdminWrapper>
//             <div className="bg-[#F3F4F7] -m-6 p-6 min-h-full">
//                 {/* Header */}
//                 <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
//                     <div>
//                         <p className="font-mono text-[11px] tracking-[0.2em] text-gray-400 uppercase mb-1">
//                             Operations Board
//                         </p>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Task Dispatch</h1>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <div className="hidden sm:flex items-center gap-2 rounded-full border-2 border-dashed border-gray-300 px-3 py-1.5">
//                             <span className="font-mono text-sm font-semibold text-gray-700">{openTickets}</span>
//                             <span className="text-xs text-gray-500">open tickets</span>
//                         </div>
//                         <button
//                             onClick={() => setShowForm(true)}
//                             className="px-4 py-2 flex items-center gap-2 bg-[#2F5D50] text-white rounded-full hover:bg-[#264C41] transition shadow-sm"
//                         >
//                             <Plus size={18} />
//                             <span>New ticket</span>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Search + filters */}
//                 <div className="flex flex-wrap items-center gap-2 mb-6 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
//                     <div className="relative flex-1 min-w-[200px]">
//                         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             placeholder="Search by title or ticket ID..."
//                             className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         />
//                     </div>

//                     {isPrivileged && (
//                         <select
//                             value={deptFilter}
//                             onChange={(e) => setDeptFilter(e.target.value)}
//                             className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         >
//                             <option value="all">All departments</option>
//                             {departmentOptions.map((d) => (
//                                 <option key={d.value} value={d.value}>
//                                     {d.label}
//                                 </option>
//                             ))}
//                         </select>
//                     )}

//                     <select
//                         value={priorityFilter}
//                         onChange={(e) => setPriorityFilter(e.target.value)}
//                         className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                     >
//                         <option value="all">All priorities</option>
//                         <option value="High">High</option>
//                         <option value="Medium">Medium</option>
//                         <option value="Low">Low</option>
//                     </select>

//                     <select
//                         value={statusFilter}
//                         onChange={(e) => setStatusFilter(e.target.value)}
//                         className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                     >
//                         <option value="all">All statuses</option>
//                         {Object.keys(STATUS_STYLES).map((key) => (
//                             <option key={key} value={key}>
//                                 {key}
//                             </option>
//                         ))}
//                     </select>

//                     {isPrivileged && (
//                         <button
//                             type="button"
//                             onClick={() => setMineOnly((prev) => !prev)}
//                             className={`text-sm px-3 py-2 rounded-lg border transition ${
//                                 mineOnly
//                                     ? "bg-[#2F5D50] border-[#2F5D50] text-white"
//                                     : "border-gray-200 text-gray-600 hover:bg-gray-50"
//                             }`}
//                         >
//                             Assigned to me
//                         </button>
//                     )}

//                     {hasActiveFilters && (
//                         <button
//                             type="button"
//                             onClick={clearFilters}
//                             className="text-sm px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 flex items-center gap-1"
//                         >
//                             <X size={14} /> Clear
//                         </button>
//                     )}
//                 </div>

//                 {loading ? (
//                     <div className="text-center text-gray-400 py-10">Loading tickets...</div>
//                 ) : (
//                     <div>
//                         <div className="flex items-center justify-between mb-3">
//                             <span className="font-mono text-xs uppercase tracking-wider text-gray-500">
//                                 {statusFilter === "all" ? "All tickets" : statusFilter}
//                             </span>
//                             <span className="text-xs font-mono text-gray-400 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
//                                 {filteredTasks.length}
//                             </span>
//                         </div>

//                         {filteredTasks.length === 0 ? (
//                             <div className="border border-dashed border-gray-300 rounded-lg py-10 text-center">
//                                 <p className="text-sm text-gray-400 italic">
//                                     {hasActiveFilters ? "No tickets match your filters" : "No tickets yet"}
//                                 </p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 {filteredTasks.map((task) => (
//                                     <TaskCard
//                                         key={task.id}
//                                         task={task}
//                                         onEdit={handleEdit}
//                                         onView={handleView}
//                                         onDelete={handleDelete}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             <TaskDetailPopup
//                 task={viewingTask}
//                 onClose={() => setViewingTask(null)}
//                 onEdit={handleEdit}
//             />

//             <AddTaskAssignedForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 editingTaskAssigned={editingTaskAssigned}
//                 setEditingTaskAssigned={setEditingTaskAssigned}
//                 handleCreate={handleCreate}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default TaskAssigned;


// import AddTaskAssignedForm from "@/AddFormComponents/AddTaskAssignedForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import TaskDetailPopup, {
//     STATUS_STYLES,
//     getDeptStyle,
//     getProgress,
//     getDueInfo,
//     PRIORITY_DOT,
// } from "@/PopupComponents/TaskDetailPopup";
// import axios from "axios";
// import { usePage } from "@inertiajs/react";
// import {
//     Plus,
//     Pencil,
//     Trash2,
//     Paperclip,
//     Calendar,
//     Search,
//     X,
//     User,
// } from "lucide-react";
// import React, { useEffect, useMemo, useState } from "react";

// // Ticket-stub card: a perforated line separates the tracking stub (id +
// // status + priority) from the job details, like a tear-off work order.
// // Clicking the card opens the read-only detail popup (onView); only the
// // pencil icon opens the edit form (onEdit).
// const TaskCard = ({ task, onEdit, onView, onDelete }) => {
//     const progress = getProgress(task.task_items);
//     const dueInfo = getDueInfo(task.due_date);
//     const dept = getDeptStyle(task.department);

//     return (
//         <div
//             onClick={() => onView(task)}
//             className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden"
//             style={{ borderLeft: `4px solid ${dept.bar}` }}
//         >
//             {/* Stub row */}
//             <div className="flex items-center justify-between px-4 pt-3">
//                 <span className="font-mono text-[11px] tracking-wide text-gray-400">
//                     {task.task_id}
//                 </span>
//                 <div className="flex items-center gap-3">
//                     <span className="flex items-center gap-1.5">
//                         <span
//                             className="w-1.5 h-1.5 rounded-full"
//                             style={{ backgroundColor: STATUS_STYLES[task.status]?.bar || "#CBD5E1" }}
//                         />
//                         <span className="text-[11px] font-medium text-gray-500">{task.status}</span>
//                     </span>
//                     <span className="flex items-center gap-1.5">
//                         <span
//                             className="w-1.5 h-1.5 rounded-full"
//                             style={{ backgroundColor: PRIORITY_DOT[task.priority] || "#CBD5E1" }}
//                         />
//                         <span className="text-[11px] font-medium text-gray-500">{task.priority}</span>
//                     </span>
//                 </div>
//             </div>

//             {/* Perforation */}
//             <div className="relative my-2.5 mx-4">
//                 <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F3F4F7] border border-gray-200" />
//                 <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F3F4F7] border border-gray-200" />
//                 <div className="border-t border-dashed border-gray-200" />
//             </div>

//             {/* Details */}
//             <div className="px-4 pb-4">
//                 <h3 className="font-semibold text-gray-800 leading-snug mb-2">{task.title}</h3>

//                 <div className="flex items-center gap-2 mb-3 flex-wrap">
//                     <span
//                         className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
//                         style={{ backgroundColor: dept.bg, color: dept.text }}
//                     >
//                         {dept.label}
//                     </span>
//                     {task.assigned_user && (
//                         <span className="text-xs text-gray-500 flex items-center gap-1">
//                             <User size={11} /> {task.assigned_user.name}
//                         </span>
//                     )}
//                 </div>

//                 {task.task_items?.length > 0 && (
//                     <div className="mb-3">
//                         <div className="flex justify-between text-[11px] text-gray-400 mb-1">
//                             <span>Checklist</span>
//                             <span>{progress}%</span>
//                         </div>
//                         <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
//                             <div
//                                 className="h-full rounded-full transition-all"
//                                 style={{ width: `${progress}%`, backgroundColor: dept.bar }}
//                             />
//                         </div>
//                     </div>
//                 )}

//                 <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//                     <div className="flex items-center gap-3 text-xs text-gray-500">
//                         {dueInfo && (
//                             <span className={`flex items-center gap-1 ${dueInfo.color}`}>
//                                 <Calendar size={12} /> {dueInfo.text}
//                             </span>
//                         )}
//                         {task.attachments?.length > 0 && (
//                             <span className="flex items-center gap-1">
//                                 <Paperclip size={12} /> {task.attachments.length}
//                             </span>
//                         )}
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 onEdit(task);
//                             }}
//                             className="text-[#2F5D50] hover:text-[#1D3B32]"
//                             title="Edit ticket"
//                         >
//                             <Pencil size={15} />
//                         </button>
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 onDelete(task.id);
//                             }}
//                             className="text-red-500 hover:text-red-700"
//                             title="Delete ticket"
//                         >
//                             <Trash2 size={15} />
//                         </button>
//                     </div>
//                 </div>

//                 {task.creator && (
//                     <p className="text-[11px] text-gray-400 mt-2">Dispatched by {task.creator.name}</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// const TaskAssigned = () => {
//     const { auth } = usePage().props;
//     const currentUser = auth?.user;

//     const [allTaskAssigned, setAllTaskAssigned] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTaskAssigned, setEditingTaskAssigned] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [viewingTask, setViewingTask] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const [search, setSearch] = useState("");
//     const [deptFilter, setDeptFilter] = useState("all");
//     const [priorityFilter, setPriorityFilter] = useState("all");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [mineOnly, setMineOnly] = useState(false);

//     useEffect(() => {
//         const fetchTaskAssigned = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourtaskassigned.index"));
//                 setAllTaskAssigned(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTaskAssigned();
//     }, [reloadTrigger]);

//     const departmentOptions = useMemo(() => {
//         const roles = [...new Set(allTaskAssigned.map((t) => t.department).filter(Boolean))];
//         return roles.map((r) => ({ value: r, label: getDeptStyle(r).label }));
//     }, [allTaskAssigned]);

//     const filteredTasks = useMemo(() => {
//         const q = search.trim().toLowerCase();
//         return allTaskAssigned.filter((t) => {
//             if (q) {
//                 const haystack = `${t.task_id} ${t.title} ${t.description || ""}`.toLowerCase();
//                 if (!haystack.includes(q)) return false;
//             }
//             if (deptFilter !== "all" && t.department !== deptFilter) return false;
//             if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
//             if (statusFilter !== "all" && t.status !== statusFilter) return false;
//             if (mineOnly && currentUser && t.assigned_team !== currentUser.id) return false;
//             return true;
//         });
//     }, [allTaskAssigned, search, deptFilter, priorityFilter, statusFilter, mineOnly, currentUser]);

//     const hasActiveFilters =
//         search || deptFilter !== "all" || priorityFilter !== "all" || statusFilter !== "all" || mineOnly;

//     const clearFilters = () => {
//         setSearch("");
//         setDeptFilter("all");
//         setPriorityFilter("all");
//         setStatusFilter("all");
//         setMineOnly(false);
//     };

//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(route("ourtaskassigned.store"), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error creating task assigned", error);
//             throw error;
//         }
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(route("ourtaskassigned.update", { id }), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating task assigned", error);
//             throw error;
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this task assigned?")) return;
//         try {
//             await axios.delete(route("ourtaskassigned.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (taskAssigned) => {
//         setViewingTask(null);
//         setEditingTaskAssigned(taskAssigned);
//         setShowForm(true);
//     };

//     const handleView = (taskAssigned) => {
//         setViewingTask(taskAssigned);
//     };

//     const openTickets = allTaskAssigned.filter((t) => t.status !== "Completed").length;

//     return (
//         <AdminWrapper>
//             <div className="bg-[#F3F4F7] -m-6 p-6 min-h-full">
//                 {/* Header */}
//                 <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
//                     <div>
//                         <p className="font-mono text-[11px] tracking-[0.2em] text-gray-400 uppercase mb-1">
//                             Operations Board
//                         </p>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Task Dispatch</h1>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <div className="hidden sm:flex items-center gap-2 rounded-full border-2 border-dashed border-gray-300 px-3 py-1.5">
//                             <span className="font-mono text-sm font-semibold text-gray-700">{openTickets}</span>
//                             <span className="text-xs text-gray-500">open tickets</span>
//                         </div>
//                         <button
//                             onClick={() => setShowForm(true)}
//                             className="px-4 py-2 flex items-center gap-2 bg-[#2F5D50] text-white rounded-full hover:bg-[#264C41] transition shadow-sm"
//                         >
//                             <Plus size={18} />
//                             <span>New ticket</span>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Search + filters */}
//                 <div className="flex flex-wrap items-center gap-2 mb-6 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
//                     <div className="relative flex-1 min-w-[200px]">
//                         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             placeholder="Search by title or ticket ID..."
//                             className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         />
//                     </div>

//                     <select
//                         value={deptFilter}
//                         onChange={(e) => setDeptFilter(e.target.value)}
//                         className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                     >
//                         <option value="all">All departments</option>
//                         {departmentOptions.map((d) => (
//                             <option key={d.value} value={d.value}>
//                                 {d.label}
//                             </option>
//                         ))}
//                     </select>

//                     <select
//                         value={priorityFilter}
//                         onChange={(e) => setPriorityFilter(e.target.value)}
//                         className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                     >
//                         <option value="all">All priorities</option>
//                         <option value="High">High</option>
//                         <option value="Medium">Medium</option>
//                         <option value="Low">Low</option>
//                     </select>

//                     <select
//                         value={statusFilter}
//                         onChange={(e) => setStatusFilter(e.target.value)}
//                         className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                     >
//                         <option value="all">All statuses</option>
//                         {Object.keys(STATUS_STYLES).map((key) => (
//                             <option key={key} value={key}>
//                                 {key}
//                             </option>
//                         ))}
//                     </select>

//                     <button
//                         type="button"
//                         onClick={() => setMineOnly((prev) => !prev)}
//                         className={`text-sm px-3 py-2 rounded-lg border transition ${
//                             mineOnly
//                                 ? "bg-[#2F5D50] border-[#2F5D50] text-white"
//                                 : "border-gray-200 text-gray-600 hover:bg-gray-50"
//                         }`}
//                     >
//                         Assigned to me
//                     </button>

//                     {hasActiveFilters && (
//                         <button
//                             type="button"
//                             onClick={clearFilters}
//                             className="text-sm px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 flex items-center gap-1"
//                         >
//                             <X size={14} /> Clear
//                         </button>
//                     )}
//                 </div>

//                 {loading ? (
//                     <div className="text-center text-gray-400 py-10">Loading tickets...</div>
//                 ) : (
//                     <div>
//                         <div className="flex items-center justify-between mb-3">
//                             <span className="font-mono text-xs uppercase tracking-wider text-gray-500">
//                                 {statusFilter === "all" ? "All tickets" : statusFilter}
//                             </span>
//                             <span className="text-xs font-mono text-gray-400 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
//                                 {filteredTasks.length}
//                             </span>
//                         </div>

//                         {filteredTasks.length === 0 ? (
//                             <div className="border border-dashed border-gray-300 rounded-lg py-10 text-center">
//                                 <p className="text-sm text-gray-400 italic">
//                                     {hasActiveFilters ? "No tickets match your filters" : "No tickets yet"}
//                                 </p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 {filteredTasks.map((task) => (
//                                     <TaskCard
//                                         key={task.id}
//                                         task={task}
//                                         onEdit={handleEdit}
//                                         onView={handleView}
//                                         onDelete={handleDelete}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             <TaskDetailPopup
//                 task={viewingTask}
//                 onClose={() => setViewingTask(null)}
//                 onEdit={handleEdit}
//             />

//             <AddTaskAssignedForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 editingTaskAssigned={editingTaskAssigned}
//                 setEditingTaskAssigned={setEditingTaskAssigned}
//                 handleCreate={handleCreate}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default TaskAssigned;


// import AddTaskAssignedForm from "@/AddFormComponents/AddTaskAssignedForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { usePage } from "@inertiajs/react";
// import {
//     Plus,
//     Pencil,
//     Trash2,
//     Paperclip,
//     Calendar,
//     Search,
//     X,
//     User,
//     UserCheck,
//     CheckCircle2,
//     Circle,
// } from "lucide-react";
// import React, { useEffect, useMemo, useState } from "react";

// const STATUS_STYLES = {
//     Pending: { bar: "#94A3B8" },
//     "In Progress": { bar: "#3B6E91" },
//     Completed: { bar: "#2F5D50" },
// };

// // Department / role tag styling — each department gets a distinct identity
// // so a glance at the left edge of a ticket tells you who owns it.
// const DEPARTMENT_STYLES = {
//     developer: { label: "Developer", bar: "#6D5BD0", text: "#4C3FAE", bg: "#EFEDFC" },
//     technician: { label: "Technician", bar: "#C9762C", text: "#8A4E15", bg: "#FBEFE3" },
//     accountant: { label: "Accountant", bar: "#3B6E91", text: "#265266", bg: "#E7F1F6" },
//     admin: { label: "Admin", bar: "#475569", text: "#334155", bg: "#EEF1F5" },
//     manager: { label: "Manager", bar: "#475569", text: "#334155", bg: "#EEF1F5" },
//     user: { label: "User", bar: "#94A3B8", text: "#475569", bg: "#F1F5F9" },
// };

// const getDeptStyle = (role) =>
//     DEPARTMENT_STYLES[(role || "").toLowerCase()] || {
//         label: role || "Unassigned",
//         bar: "#CBD5E1",
//         text: "#64748B",
//         bg: "#F8FAFC",
//     };

// const PRIORITY_DOT = {
//     High: "#D64545",
//     Medium: "#C98A1D",
//     Low: "#2F8F5B",
// };

// const getProgress = (taskItems) => {
//     if (!taskItems || taskItems.length === 0) return 0;
//     const completed = taskItems.filter((i) => i.status === "Completed").length;
//     return Math.round((completed / taskItems.length) * 100);
// };

// const getDueInfo = (dueDate) => {
//     if (!dueDate) return null;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const due = new Date(dueDate);
//     const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

//     if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, color: "text-red-600" };
//     if (diffDays === 0) return { text: "Due today", color: "text-orange-600" };
//     if (diffDays <= 2) return { text: `${diffDays}d left`, color: "text-orange-500" };
//     return { text: `${diffDays}d left`, color: "text-gray-500" };
// };

// // Ticket-stub card: a perforated line separates the tracking stub (id +
// // priority) from the job details, like a tear-off work order.
// const TaskCard = ({ task, onEdit, onView, onDelete }) => {
//     const progress = getProgress(task.task_items);
//     const dueInfo = getDueInfo(task.due_date);
//     const dept = getDeptStyle(task.department);

//     return (
//         <div
//             onClick={() => onView(task)}
//             className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden"
//             style={{ borderLeft: `4px solid ${dept.bar}` }}
//         >
//             {/* Stub row */}
//             <div className="flex items-center justify-between px-4 pt-3">
//                 <span className="font-mono text-[11px] tracking-wide text-gray-400">
//                     {task.task_id}
//                 </span>
//                 <div className="flex items-center gap-3">
//                     <span className="flex items-center gap-1.5">
//                         <span
//                             className="w-1.5 h-1.5 rounded-full"
//                             style={{ backgroundColor: STATUS_STYLES[task.status]?.bar || "#CBD5E1" }}
//                         />
//                         <span className="text-[11px] font-medium text-gray-500">{task.status}</span>
//                     </span>
//                     <span className="flex items-center gap-1.5">
//                         <span
//                             className="w-1.5 h-1.5 rounded-full"
//                             style={{ backgroundColor: PRIORITY_DOT[task.priority] || "#CBD5E1" }}
//                         />
//                         <span className="text-[11px] font-medium text-gray-500">{task.priority}</span>
//                     </span>
//                 </div>
//             </div>

//             {/* Perforation */}
//             <div className="relative my-2.5 mx-4">
//                 <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F3F4F7] border border-gray-200" />
//                 <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F3F4F7] border border-gray-200" />
//                 <div className="border-t border-dashed border-gray-200" />
//             </div>

//             {/* Details */}
//             <div className="px-4 pb-4">
//                 <h3 className="font-semibold text-gray-800 leading-snug mb-2">{task.title}</h3>

//                 <div className="flex items-center gap-2 mb-3 flex-wrap">
//                     <span
//                         className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
//                         style={{ backgroundColor: dept.bg, color: dept.text }}
//                     >
//                         {dept.label}
//                     </span>
//                     {task.assigned_user && (
//                         <span className="text-xs text-gray-500 flex items-center gap-1">
//                             <User size={11} /> {task.assigned_user.name}
//                         </span>
//                     )}
//                 </div>

//                 {task.task_items?.length > 0 && (
//                     <div className="mb-3">
//                         <div className="flex justify-between text-[11px] text-gray-400 mb-1">
//                             <span>Checklist</span>
//                             <span>{progress}%</span>
//                         </div>
//                         <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
//                             <div
//                                 className="h-full rounded-full transition-all"
//                                 style={{ width: `${progress}%`, backgroundColor: dept.bar }}
//                             />
//                         </div>
//                     </div>
//                 )}

//                 <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//                     <div className="flex items-center gap-3 text-xs text-gray-500">
//                         {dueInfo && (
//                             <span className={`flex items-center gap-1 ${dueInfo.color}`}>
//                                 <Calendar size={12} /> {dueInfo.text}
//                             </span>
//                         )}
//                         {task.attachments?.length > 0 && (
//                             <span className="flex items-center gap-1">
//                                 <Paperclip size={12} /> {task.attachments.length}
//                             </span>
//                         )}
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 onEdit(task);
//                             }}
//                             className="text-[#2F5D50] hover:text-[#1D3B32]"
//                             title="Edit ticket"
//                         >
//                             <Pencil size={15} />
//                         </button>
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 onDelete(task.id);
//                             }}
//                             className="text-red-500 hover:text-red-700"
//                             title="Delete ticket"
//                         >
//                             <Trash2 size={15} />
//                         </button>
//                     </div>
//                 </div>

//                 {task.creator && (
//                     <p className="text-[11px] text-gray-400 mt-2">Dispatched by {task.creator.name}</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// const DetailRow = ({ label, value }) => (
//     <div>
//         <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
//         <p className="text-sm text-gray-800">{value || "—"}</p>
//     </div>
// );

// const TaskDetailModal = ({ task, onClose, onEdit }) => {
//     if (!task) return null;
//     const dept = getDeptStyle(task.department);
//     const progress = getProgress(task.task_items);
//     const dueInfo = getDueInfo(task.due_date);

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col">
//                 <div
//                     className="flex justify-between items-start px-6 py-4 border-b"
//                     style={{ borderLeft: `6px solid ${dept.bar}` }}
//                 >
//                     <div>
//                         <span className="font-mono text-xs text-gray-400">{task.task_id}</span>
//                         <h2 className="text-xl font-bold text-gray-900 mt-0.5">{task.title}</h2>
//                         <div className="flex items-center gap-2 mt-2 flex-wrap">
//                             <span
//                                 className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
//                                 style={{ backgroundColor: dept.bg, color: dept.text }}
//                             >
//                                 {dept.label}
//                             </span>
//                             <span className="flex items-center gap-1.5 text-xs text-gray-500">
//                                 <span
//                                     className="w-1.5 h-1.5 rounded-full"
//                                     style={{ backgroundColor: STATUS_STYLES[task.status]?.bar || "#CBD5E1" }}
//                                 />
//                                 {task.status}
//                             </span>
//                             <span className="flex items-center gap-1.5 text-xs text-gray-500">
//                                 <span
//                                     className="w-1.5 h-1.5 rounded-full"
//                                     style={{ backgroundColor: PRIORITY_DOT[task.priority] || "#CBD5E1" }}
//                                 />
//                                 {task.priority} priority
//                             </span>
//                         </div>
//                     </div>
//                     <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0">
//                         <X size={20} />
//                     </button>
//                 </div>

//                 <div className="overflow-y-auto px-6 py-5 space-y-5">
//                     <div className="grid grid-cols-2 gap-4">
//                         <DetailRow
//                             label="Assigned to"
//                             value={task.assigned_user?.name}
//                         />
//                         <DetailRow
//                             label="Assigned by"
//                             value={task.creator?.name}
//                         />
//                         <DetailRow
//                             label="Start date"
//                             value={task.start_date?.slice(0, 10)}
//                         />
//                         <DetailRow
//                             label="Due date"
//                             value={
//                                 dueInfo ? (
//                                     <span className={dueInfo.color}>
//                                         {task.due_date?.slice(0, 10)} · {dueInfo.text}
//                                     </span>
//                                 ) : (
//                                     task.due_date?.slice(0, 10)
//                                 )
//                             }
//                         />
//                     </div>

//                     {task.description && (
//                         <div>
//                             <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
//                                 Description
//                             </p>
//                             <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.description}</p>
//                         </div>
//                     )}

//                     {task.status === "Completed" && (task.admin_remarks || task.admin_status) && (
//                         <div className="bg-[#EAF2EF] border border-[#C7DAD3] rounded-lg p-3 space-y-2">
//                             {task.admin_status && <DetailRow label="Admin status" value={task.admin_status} />}
//                             {task.admin_remarks && <DetailRow label="Admin remarks" value={task.admin_remarks} />}
//                         </div>
//                     )}

//                     {task.task_items?.length > 0 && (
//                         <div>
//                             <div className="flex justify-between items-center mb-2">
//                                 <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
//                                     Checklist
//                                 </p>
//                                 <span className="text-xs text-gray-400">{progress}% complete</span>
//                             </div>
//                             <div className="space-y-1.5">
//                                 {task.task_items.map((item, i) => (
//                                     <div key={i} className="flex items-center gap-2 text-sm">
//                                         {item.status === "Completed" ? (
//                                             <CheckCircle2 size={16} className="text-[#2F5D50] shrink-0" />
//                                         ) : (
//                                             <Circle size={16} className="text-gray-300 shrink-0" />
//                                         )}
//                                         <span className={item.status === "Completed" ? "text-gray-400 line-through" : "text-gray-700"}>
//                                             {item.description}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {task.attachments?.length > 0 && (
//                         <div>
//                             <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">
//                                 Attachments
//                             </p>
//                             <div className="flex flex-wrap gap-2">
//                                 {task.attachments.map((att) => (
//                                     <a
//                                         key={att.id}
//                                         href={`/storage/${att.attachment}`}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                         className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700 hover:bg-gray-200"
//                                     >
//                                         <Paperclip size={12} />
//                                         {att.attachment.split("/").pop()}
//                                     </a>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className="flex justify-end gap-3 px-6 py-4 border-t">
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-50"
//                     >
//                         Close
//                     </button>
//                     <button
//                         type="button"
//                         onClick={() => onEdit(task)}
//                         className="px-5 py-2 flex items-center gap-2 rounded-full bg-[#2F5D50] text-white hover:bg-[#264C41]"
//                     >
//                         <Pencil size={15} /> Edit ticket
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const TaskAssigned = () => {
//     const { auth } = usePage().props;
//     const currentUser = auth?.user;

//     const [allTaskAssigned, setAllTaskAssigned] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTaskAssigned, setEditingTaskAssigned] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [viewingTask, setViewingTask] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const [search, setSearch] = useState("");
//     const [deptFilter, setDeptFilter] = useState("all");
//     const [priorityFilter, setPriorityFilter] = useState("all");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [mineOnly, setMineOnly] = useState(false);

//     useEffect(() => {
//         const fetchTaskAssigned = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourtaskassigned.index"));
//                 setAllTaskAssigned(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTaskAssigned();
//     }, [reloadTrigger]);

//     const departmentOptions = useMemo(() => {
//         const roles = [...new Set(allTaskAssigned.map((t) => t.department).filter(Boolean))];
//         return roles.map((r) => ({ value: r, label: getDeptStyle(r).label }));
//     }, [allTaskAssigned]);

//     const filteredTasks = useMemo(() => {
//         const q = search.trim().toLowerCase();
//         return allTaskAssigned.filter((t) => {
//             if (q) {
//                 const haystack = `${t.task_id} ${t.title} ${t.description || ""}`.toLowerCase();
//                 if (!haystack.includes(q)) return false;
//             }
//             if (deptFilter !== "all" && t.department !== deptFilter) return false;
//             if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
//             if (statusFilter !== "all" && t.status !== statusFilter) return false;
//             if (mineOnly && currentUser && t.assigned_team !== currentUser.id) return false;
//             return true;
//         });
//     }, [allTaskAssigned, search, deptFilter, priorityFilter, statusFilter, mineOnly, currentUser]);

//     const hasActiveFilters =
//         search || deptFilter !== "all" || priorityFilter !== "all" || statusFilter !== "all" || mineOnly;

//     const clearFilters = () => {
//         setSearch("");
//         setDeptFilter("all");
//         setPriorityFilter("all");
//         setStatusFilter("all");
//         setMineOnly(false);
//     };

//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(route("ourtaskassigned.store"), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error creating task assigned", error);
//             throw error;
//         }
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(route("ourtaskassigned.update", { id }), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating task assigned", error);
//             throw error;
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this task assigned?")) return;
//         try {
//             await axios.delete(route("ourtaskassigned.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (taskAssigned) => {
//         setViewingTask(null);
//         setEditingTaskAssigned(taskAssigned);
//         setShowForm(true);
//     };

//     const handleView = (taskAssigned) => {
//         setViewingTask(taskAssigned);
//     };

//     const openTickets = allTaskAssigned.filter((t) => t.status !== "Completed").length;

//     return (
//         <AdminWrapper>
//             <div className="bg-[#F3F4F7] -m-6 p-6 min-h-full">
//                 {/* Header */}
//                 <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
//                     <div>
//                         <p className="font-mono text-[11px] tracking-[0.2em] text-gray-400 uppercase mb-1">
//                             Operations Board
//                         </p>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Task Dispatch</h1>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <div className="hidden sm:flex items-center gap-2 rounded-full border-2 border-dashed border-gray-300 px-3 py-1.5">
//                             <span className="font-mono text-sm font-semibold text-gray-700">{openTickets}</span>
//                             <span className="text-xs text-gray-500">open tickets</span>
//                         </div>
//                         <button
//                             onClick={() => setShowForm(true)}
//                             className="px-4 py-2 flex items-center gap-2 bg-[#2F5D50] text-white rounded-full hover:bg-[#264C41] transition shadow-sm"
//                         >
//                             <Plus size={18} />
//                             <span>New ticket</span>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Search + filters */}
//                 <div className="flex flex-wrap items-center gap-2 mb-6 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
//                     <div className="relative flex-1 min-w-[200px]">
//                         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             placeholder="Search by title or ticket ID..."
//                             className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         />
//                     </div>

//                     <select
//                         value={deptFilter}
//                         onChange={(e) => setDeptFilter(e.target.value)}
//                         className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                     >
//                         <option value="all">All departments</option>
//                         {departmentOptions.map((d) => (
//                             <option key={d.value} value={d.value}>
//                                 {d.label}
//                             </option>
//                         ))}
//                     </select>

//                     <select
//                         value={priorityFilter}
//                         onChange={(e) => setPriorityFilter(e.target.value)}
//                         className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                     >
//                         <option value="all">All priorities</option>
//                         <option value="High">High</option>
//                         <option value="Medium">Medium</option>
//                         <option value="Low">Low</option>
//                     </select>

//                     <select
//                         value={statusFilter}
//                         onChange={(e) => setStatusFilter(e.target.value)}
//                         className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                     >
//                         <option value="all">All statuses</option>
//                         {Object.keys(STATUS_STYLES).map((key) => (
//                             <option key={key} value={key}>
//                                 {key}
//                             </option>
//                         ))}
//                     </select>

//                     <button
//                         type="button"
//                         onClick={() => setMineOnly((prev) => !prev)}
//                         className={`text-sm px-3 py-2 rounded-lg border transition ${
//                             mineOnly
//                                 ? "bg-[#2F5D50] border-[#2F5D50] text-white"
//                                 : "border-gray-200 text-gray-600 hover:bg-gray-50"
//                         }`}
//                     >
//                         Assigned to me
//                     </button>

//                     {hasActiveFilters && (
//                         <button
//                             type="button"
//                             onClick={clearFilters}
//                             className="text-sm px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 flex items-center gap-1"
//                         >
//                             <X size={14} /> Clear
//                         </button>
//                     )}
//                 </div>

//                 {loading ? (
//                     <div className="text-center text-gray-400 py-10">Loading tickets...</div>
//                 ) : (
//                     <div>
//                         <div className="flex items-center justify-between mb-3">
//                             <span className="font-mono text-xs uppercase tracking-wider text-gray-500">
//                                 {statusFilter === "all" ? "All tickets" : statusFilter}
//                             </span>
//                             <span className="text-xs font-mono text-gray-400 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
//                                 {filteredTasks.length}
//                             </span>
//                         </div>

//                         {filteredTasks.length === 0 ? (
//                             <div className="border border-dashed border-gray-300 rounded-lg py-10 text-center">
//                                 <p className="text-sm text-gray-400 italic">
//                                     {hasActiveFilters ? "No tickets match your filters" : "No tickets yet"}
//                                 </p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 {filteredTasks.map((task) => (
//                                     <TaskCard
//                                         key={task.id}
//                                         task={task}
//                                         onEdit={handleEdit}
//                                         onView={handleView}
//                                         onDelete={handleDelete}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             <TaskDetailModal
//                 task={viewingTask}
//                 onClose={() => setViewingTask(null)}
//                 onEdit={handleEdit}
//             />

//             <AddTaskAssignedForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 editingTaskAssigned={editingTaskAssigned}
//                 setEditingTaskAssigned={setEditingTaskAssigned}
//                 handleCreate={handleCreate}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default TaskAssigned;

