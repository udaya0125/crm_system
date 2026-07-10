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
//     Lock,
// } from "lucide-react";
// import React, { useEffect, useMemo, useState } from "react";
// import EditTaskAssignedForm from "@/EditFormComponents/EditTaskAssignedForm";


// const TaskCard = ({ task, onEdit, onView, onDelete }) => {
//     const progress = getProgress(task.task_items);
//     const dueInfo = getDueInfo(task.due_date);
//     const dept = getDeptStyle(task.department);
//     const isLocked = task.status === "Completed";

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
//                         {isLocked ? (
//                             <span title="Completed — locked from editing">
//                                 <Lock size={14} className="text-gray-300" />
//                             </span>
//                         ) : (
//                             <button
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     onEdit(task);
//                                 }}
//                                 className="text-[#2F5D50] hover:text-[#1D3B32]"
//                                 title="Edit ticket"
//                             >
//                                 <Pencil size={15} />
//                             </button>
//                         )}
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

// const Pagination = ({ meta, onPageChange }) => {
//     if (!meta || meta.last_page <= 1) return null;

//     const { current_page, last_page } = meta;
//     const baseBtn =
//         "w-9 h-9 flex items-center justify-center rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition";

//     return (
//         <div className="flex items-center justify-center gap-1.5 mt-8">
//             <button
//                 type="button"
//                 className={baseBtn}
//                 onClick={() => onPageChange(1)}
//                 disabled={current_page === 1}
//                 title="First page"
//             >
//                 «
//             </button>
//             <button
//                 type="button"
//                 className={baseBtn}
//                 onClick={() => onPageChange(current_page - 1)}
//                 disabled={current_page === 1}
//                 title="Previous page"
//             >
//                 ‹
//             </button>
//             <span className="px-4 h-9 flex items-center font-mono text-xs text-gray-500">
//                 Page {current_page} of {last_page}
//             </span>
//             <button
//                 type="button"
//                 className={baseBtn}
//                 onClick={() => onPageChange(current_page + 1)}
//                 disabled={current_page === last_page}
//                 title="Next page"
//             >
//                 ›
//             </button>
//             <button
//                 type="button"
//                 className={baseBtn}
//                 onClick={() => onPageChange(last_page)}
//                 disabled={current_page === last_page}
//                 title="Last page"
//             >
//                 »
//             </button>
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

//     const [page, setPage] = useState(1);
//     const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

//     useEffect(() => {
//         const fetchTaskAssigned = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourtaskassigned.index", { page }));
//                 setAllTaskAssigned(response.data.data);
//                 setMeta({
//                     current_page: response.data.current_page,
//                     last_page: response.data.last_page,
//                     total: response.data.total,
//                 });
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTaskAssigned();
//     }, [reloadTrigger, page]);

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
//     //
//     // Note: the backend rejects this call outright (403) once a task's
//     // status is "Completed" — the popup itself also stops rendering the
//     // quick-edit controls for a completed task, so this path shouldn't
//     // normally be reachable in that state, but the server-side check is
//     // what actually enforces the lock.
//     const handleQuickUpdate = async (formData, id) => {
//         const data = await handleUpdate(formData, id);
//         if (data?.data) {
//             setViewingTask(data.data);
//             setAllTaskAssigned((prev) => prev.map((t) => (t.id === id ? data.data : t)));
//         }
//         return data;
//     };

//     // Deletes ONE attachment at a time from a task. Wired to the "Save"
//     // button that appears in EditTaskAssignedForm after an attachment is
//     // staged for removal — the backend's destroyAttachment() endpoint only
//     // ever removes the single attachment referenced by attachmentId, and
//     // also refuses this once the task is Completed.
//     //
//     // NOTE: adjust the route name/params below to match your actual route
//     // for TaskAssignedController@destroyAttachment (e.g. defined as
//     // Route::delete('task-assigned/{task}/attachments/{attachment}', ...)
//     // -> name('ourtaskassigned.attachments.destroy')). The controller
//     // method itself (destroyAttachment) already exists and expects
//     // ($taskId, $attachmentId).
//     const handleDeleteAttachment = async (taskId, attachmentId) => {
//         try {
//             await axios.delete(
//                 route("ourtaskassigned.attachments.destroy", { task: taskId, attachment: attachmentId })
//             );

//             // Keep local state in sync immediately (list + popup), so the
//             // user doesn't have to wait for a full refetch to see it gone.
//             setAllTaskAssigned((prev) =>
//                 prev.map((t) =>
//                     t.id === taskId
//                         ? { ...t, attachments: (t.attachments || []).filter((a) => a.id !== attachmentId) }
//                         : t
//                 )
//             );
//             setViewingTask((prev) =>
//                 prev && prev.id === taskId
//                     ? { ...prev, attachments: (prev.attachments || []).filter((a) => a.id !== attachmentId) }
//                     : prev
//             );
//         } catch (error) {
//             console.log("Error deleting attachment", error);
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

//     // Completed tasks are locked — bail out before opening the edit form.
//     // (TaskCard and TaskDetailPopup already hide/disable the entry points
//     // that would call this for a completed task, but this guard covers any
//     // other call site too.)
//     const handleEdit = (taskAssigned) => {
//         if (taskAssigned?.status === "Completed") return;
//         setViewingTask(null);
//         setEditingTaskAssigned(taskAssigned);
//         setShowEditForm(true);
//     };

//     const handleView = (taskAssigned) => {
//         setViewingTask(taskAssigned);
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage < 1 || newPage > meta.last_page || newPage === meta.current_page) return;
//         setPage(newPage);
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
//                             <span className="font-mono text-sm font-semibold text-gray-700">{meta.total}</span>
//                             <span className="text-xs text-gray-500">total tickets</span>
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

//                         <Pagination meta={meta} onPageChange={handlePageChange} />
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
//                 onDeleteAttachment={handleDeleteAttachment}
//             />
//         </AdminWrapper>
//     );
// };

// export default TaskAssigned;



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
    Lock,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import EditTaskAssignedForm from "@/EditFormComponents/EditTaskAssignedForm";


const TaskCard = ({ task, onEdit, onView, onDelete }) => {
    const progress = getProgress(task.task_items);
    const dueInfo = getDueInfo(task.due_date);
    const dept = getDeptStyle(task.department);
    const isLocked = task.status === "Completed";

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
                        {isLocked ? (
                            <span title="Completed — locked from editing">
                                <Lock size={14} className="text-gray-300" />
                            </span>
                        ) : (
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
                        )}
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
    //
    // Note: the backend rejects this call outright (403) once a task's
    // status is "Completed" — the popup itself also stops rendering the
    // quick-edit controls for a completed task, so this path shouldn't
    // normally be reachable in that state, but the server-side check is
    // what actually enforces the lock.
    const handleQuickUpdate = async (formData, id) => {
        const data = await handleUpdate(formData, id);
        if (data?.data) {
            setViewingTask(data.data);
            setAllTaskAssigned((prev) => prev.map((t) => (t.id === id ? data.data : t)));
        }
        return data;
    };

    // Admin/manager review action for a Completed task. Posts to a dedicated
    // review() endpoint (not the general update()) since it only ever
    // touches admin_status/admin_remarks and, for "Reopened", flips status
    // back to "In Progress" so the task becomes editable again. Syncs the
    // returned task back into local state immediately, same pattern as
    // handleQuickUpdate.
    const handleReview = async (id, { admin_status, admin_remarks }) => {
        try {
            const response = await axios.patch(route("ourtaskassigned.review", { id }), {
                admin_status,
                admin_remarks,
            });
            if (response.data?.data) {
                setViewingTask(response.data.data);
                setAllTaskAssigned((prev) =>
                    prev.map((t) => (t.id === id ? response.data.data : t))
                );
            }
            return response.data;
        } catch (error) {
            console.log("Error reviewing task", error);
            throw error;
        }
    };

    // Deletes ONE attachment at a time from a task. Wired to the "Save"
    // button that appears in EditTaskAssignedForm after an attachment is
    // staged for removal — the backend's destroyAttachment() endpoint only
    // ever removes the single attachment referenced by attachmentId, and
    // also refuses this once the task is Completed.
    const handleDeleteAttachment = async (taskId, attachmentId) => {
        try {
            await axios.delete(
                route("ourtaskassigned.attachments.destroy", { task: taskId, attachment: attachmentId })
            );

            setAllTaskAssigned((prev) =>
                prev.map((t) =>
                    t.id === taskId
                        ? { ...t, attachments: (t.attachments || []).filter((a) => a.id !== attachmentId) }
                        : t
                )
            );
            setViewingTask((prev) =>
                prev && prev.id === taskId
                    ? { ...prev, attachments: (prev.attachments || []).filter((a) => a.id !== attachmentId) }
                    : prev
            );
        } catch (error) {
            console.log("Error deleting attachment", error);
            throw error;
        }
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

    // Completed tasks are locked — bail out before opening the edit form.
    // (TaskCard and TaskDetailPopup already hide/disable the entry points
    // that would call this for a completed task, but this guard covers any
    // other call site too.)
    const handleEdit = (taskAssigned) => {
        if (taskAssigned?.status === "Completed") return;
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
                onReview={handleReview}
                isPrivileged={isPrivileged}
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
                onDeleteAttachment={handleDeleteAttachment}
            />
        </AdminWrapper>
    );
};

export default TaskAssigned;
