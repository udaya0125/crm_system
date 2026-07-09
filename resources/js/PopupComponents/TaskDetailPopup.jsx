// import {
//     X,
//     Paperclip,
//     Pencil,
//     CheckCircle2,
//     Circle,
//     Plus,
//     Calendar,
//     Check,
//     Trash2,
//     ArrowUp,
//     ArrowDown,
// } from "lucide-react";
// import React, { useState, useEffect } from "react";

// // Shared styling maps + helpers for the Task Dispatch board — exported here
// // so both this popup and TaskAssigned.jsx (which renders the ticket cards)
// // stay visually in sync from a single source.

// export const STATUS_STYLES = {
//     Pending: { bar: "#94A3B8" },
//     "In Progress": { bar: "#3B6E91" },
//     Completed: { bar: "#2F5D50" },
// };

// const STATUS_OPTIONS = Object.keys(STATUS_STYLES);

// // Department / role tag styling — each department gets a distinct identity
// // so a glance at the left edge of a ticket tells you who owns it.
// export const DEPARTMENT_STYLES = {
//     developer: { label: "Developer", bar: "#6D5BD0", text: "#4C3FAE", bg: "#EFEDFC" },
//     technician: { label: "Technician", bar: "#C9762C", text: "#8A4E15", bg: "#FBEFE3" },
//     accountant: { label: "Accountant", bar: "#3B6E91", text: "#265266", bg: "#E7F1F6" },
//     admin: { label: "Admin", bar: "#475569", text: "#334155", bg: "#EEF1F5" },
//     manager: { label: "Manager", bar: "#475569", text: "#334155", bg: "#EEF1F5" },
//     user: { label: "User", bar: "#94A3B8", text: "#475569", bg: "#F1F5F9" },
// };

// export const getDeptStyle = (role) =>
//     DEPARTMENT_STYLES[(role || "").toLowerCase()] || {
//         label: role || "Unassigned",
//         bar: "#CBD5E1",
//         text: "#64748B",
//         bg: "#F8FAFC",
//     };

// export const PRIORITY_DOT = {
//     High: "#D64545",
//     Medium: "#C98A1D",
//     Low: "#2F8F5B",
// };

// export const getProgress = (taskItems) => {
//     if (!taskItems || taskItems.length === 0) return 0;
//     const completed = taskItems.filter((i) => i.status === "Completed").length;
//     return Math.round((completed / taskItems.length) * 100);
// };

// export const getDueInfo = (dueDate) => {
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

// const DetailRow = ({ label, value }) => (
//     <div>
//         <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
//         <p className="text-sm text-gray-800">{value || "—"}</p>
//     </div>
// );

// // Read-only-by-default ticket detail popup, with a few fields editable inline
// // via onQuickUpdate:
// //   - Status: select in the header, saves immediately on change.
// //   - Due date: click to reveal a date input; requires an explicit small
// //     confirm button click to save (no save-on-blur).
// //   - Checklist: always shown in an editable draft state (no toggle) — items
// //     can be added, edited, reordered (up/down), toggled complete, and
// //     deleted at any time. Nothing is sent to the server until
// //     "Save checklist" is pressed. The draft re-syncs from `task.task_items`
// //     whenever the `task` prop changes (e.g. popup opened for a new ticket,
// //     or a save round-trips fresh data back down).
// // Full edits still go through the "Edit ticket" button -> EditTaskAssignedForm.
// //
// // IMPORTANT: because the backend's update() endpoint requires the full set
// // of core fields (title, assigned_team, user_id, priority, start_date,
// // due_date) and replaces task_items wholesale when present, every quick
// // save here rebuilds the complete FormData from the current `task` prop
// // with just the changed piece overridden — never a partial payload.
// const TaskDetailPopup = ({ task, onClose, onEdit, onQuickUpdate }) => {
//     const [savingField, setSavingField] = useState(null); // "due_date" | "status" | "checklist" | null
//     const [error, setError] = useState("");

//     const [editingDueDate, setEditingDueDate] = useState(false);
//     const [dueDateDraft, setDueDateDraft] = useState("");

//     // Checklist draft — always "live", no separate view/edit toggle.
//     const [checklistDraft, setChecklistDraft] = useState([]);

//     // Re-sync the draft whenever the underlying task changes (popup opened
//     // for a different ticket, or the parent re-fetched fresh data after a
//     // save). Doing this here instead of on a button click means the draft
//     // is ready the moment the popup renders.
//     useEffect(() => {
//         setChecklistDraft(
//             (task?.task_items || []).map((item, i) => ({
//                 clientId: item.id ?? `existing-${i}`,
//                 description: item.description,
//                 status: item.status || "Pending",
//             }))
//         );
//     }, [task]);

//     if (!task) return null;

//     const dept = getDeptStyle(task.department);
//     const progress = getProgress(checklistDraft);
//     const dueInfo = getDueInfo(task.due_date);
//     const canQuickEdit = typeof onQuickUpdate === "function";

//     const buildFormData = (overrides = {}) => {
//         const merged = {
//             title: task.title,
//             assigned_team: task.assigned_team,
//             user_id: task.user_id,
//             priority: task.priority,
//             start_date: task.start_date?.slice(0, 10),
//             due_date: task.due_date?.slice(0, 10),
//             description: task.description || "",
//             status: task.status,
//             admin_remarks: task.admin_remarks || "",
//             admin_status: task.admin_status || "",
//             task_items: task.task_items || [],
//             ...overrides,
//         };

//         const formData = new FormData();
//         formData.append("title", merged.title);
//         formData.append("assigned_team", merged.assigned_team);
//         formData.append("user_id", merged.user_id);
//         formData.append("priority", merged.priority);
//         formData.append("start_date", merged.start_date);
//         formData.append("due_date", merged.due_date);
//         if (merged.description) formData.append("description", merged.description);
//         formData.append("status", merged.status);

//         if (merged.status === "Completed") {
//             if (merged.admin_remarks) formData.append("admin_remarks", merged.admin_remarks);
//             if (merged.admin_status) formData.append("admin_status", merged.admin_status);
//         }

//         merged.task_items.forEach((item, index) => {
//             if (item.description?.trim()) {
//                 formData.append(`task_items[${index}][description]`, item.description);
//                 formData.append(`task_items[${index}][status]`, item.status || "Pending");
//             }
//         });

//         return formData;
//     };

//     const handleQuickSave = async (overrides, savingKey) => {
//         setError("");
//         setSavingField(savingKey || Object.keys(overrides)[0]);
//         try {
//             await onQuickUpdate(buildFormData(overrides), task.id);
//             return true;
//         } catch (err) {
//             console.log("Quick update failed", err);
//             setError("Couldn't save that change. Please try again.");
//             return false;
//         } finally {
//             setSavingField(null);
//         }
//     };

//     // ---- Due date ----
//     const startEditingDueDate = () => {
//         setDueDateDraft(task.due_date?.slice(0, 10) || "");
//         setEditingDueDate(true);
//     };

//     const handleDueDateSave = async () => {
//         if (!dueDateDraft) {
//             setEditingDueDate(false);
//             return;
//         }
//         const ok = await handleQuickSave({ due_date: dueDateDraft }, "due_date");
//         if (ok) setEditingDueDate(false);
//     };

//     // ---- Status (unchanged) ----
//     const handleStatusChange = (e) => {
//         handleQuickSave({ status: e.target.value }, "status");
//     };

//     // ---- Checklist — always-editable draft ----
//     const addDraftItem = () => {
//         setChecklistDraft((prev) => [
//             ...prev,
//             { clientId: `new-${Date.now()}`, description: "", status: "Pending" },
//         ]);
//     };

//     const removeDraftItem = (clientId) => {
//         setChecklistDraft((prev) => prev.filter((i) => i.clientId !== clientId));
//     };

//     const updateDraftText = (clientId, text) => {
//         setChecklistDraft((prev) =>
//             prev.map((i) => (i.clientId === clientId ? { ...i, description: text } : i))
//         );
//     };

//     const toggleDraftStatus = (clientId) => {
//         setChecklistDraft((prev) =>
//             prev.map((i) =>
//                 i.clientId === clientId
//                     ? { ...i, status: i.status === "Completed" ? "Pending" : "Completed" }
//                     : i
//             )
//         );
//     };

//     const moveDraftUp = (index) => {
//         if (index === 0) return;
//         setChecklistDraft((prev) => {
//             const next = [...prev];
//             [next[index - 1], next[index]] = [next[index], next[index - 1]];
//             return next;
//         });
//     };

//     const moveDraftDown = (index) => {
//         setChecklistDraft((prev) => {
//             if (index === prev.length - 1) return prev;
//             const next = [...prev];
//             [next[index], next[index + 1]] = [next[index + 1], next[index]];
//             return next;
//         });
//     };

//     const saveChecklist = async () => {
//         const items = checklistDraft
//             .filter((i) => i.description.trim() !== "")
//             .map((i) => ({ description: i.description.trim(), status: i.status }));

//         await handleQuickSave({ task_items: items }, "checklist");
//         // Draft re-syncs automatically via the useEffect once `task` updates
//         // with fresh data from the parent after a successful save.
//     };

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

//                             {/* Status — unchanged */}
//                             {canQuickEdit ? (
//                                 <span className="flex items-center gap-1.5">
//                                     <span
//                                         className="w-1.5 h-1.5 rounded-full shrink-0"
//                                         style={{ backgroundColor: STATUS_STYLES[task.status]?.bar || "#CBD5E1" }}
//                                     />
//                                     <select
//                                         value={task.status}
//                                         onChange={handleStatusChange}
//                                         disabled={savingField === "status"}
//                                         className="text-xs text-gray-600 border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-[#2F5D50]/30 rounded cursor-pointer disabled:opacity-50"
//                                     >
//                                         {STATUS_OPTIONS.map((s) => (
//                                             <option key={s} value={s}>
//                                                 {s}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     {savingField === "status" && (
//                                         <span className="text-[10px] text-gray-400">saving…</span>
//                                     )}
//                                 </span>
//                             ) : (
//                                 <span className="flex items-center gap-1.5 text-xs text-gray-500">
//                                     <span
//                                         className="w-1.5 h-1.5 rounded-full"
//                                         style={{ backgroundColor: STATUS_STYLES[task.status]?.bar || "#CBD5E1" }}
//                                     />
//                                     {task.status}
//                                 </span>
//                             )}

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
//                     {error && (
//                         <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
//                             {error}
//                         </div>
//                     )}

//                     <div className="grid grid-cols-2 gap-4">
//                         <DetailRow label="Assigned to" value={task.assigned_user?.name} />
//                         <DetailRow label="Assigned by" value={task.creator?.name} />
//                         <DetailRow label="Start date" value={task.start_date?.slice(0, 10)} />

//                         {/* Due date — click to edit, small button confirms the save */}
//                         <div>
//                             <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">
//                                 Due date
//                             </p>
//                             {canQuickEdit && editingDueDate ? (
//                                 <div className="flex items-center gap-2">
//                                     <input
//                                         type="date"
//                                         value={dueDateDraft}
//                                         onChange={(e) => setDueDateDraft(e.target.value)}
//                                         onKeyDown={(e) => {
//                                             if (e.key === "Enter") handleDueDateSave();
//                                             if (e.key === "Escape") setEditingDueDate(false);
//                                         }}
//                                         autoFocus
//                                         disabled={savingField === "due_date"}
//                                         className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 disabled:opacity-50"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={handleDueDateSave}
//                                         disabled={savingField === "due_date"}
//                                         title="Confirm due date"
//                                         className="p-1 rounded-full bg-[#2F5D50] text-white hover:bg-[#264C41] disabled:opacity-50"
//                                     >
//                                         <Check size={12} />
//                                     </button>
//                                     {savingField === "due_date" && (
//                                         <span className="text-[10px] text-gray-400">saving…</span>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <button
//                                     type="button"
//                                     onClick={canQuickEdit ? startEditingDueDate : undefined}
//                                     className={`text-sm flex items-center gap-1.5 ${
//                                         canQuickEdit ? "hover:text-[#2F5D50] cursor-pointer" : "cursor-default"
//                                     } ${dueInfo ? dueInfo.color : "text-gray-800"}`}
//                                 >
//                                     {task.due_date?.slice(0, 10) || "—"}
//                                     {dueInfo && <span>· {dueInfo.text}</span>}
//                                     {canQuickEdit && <Calendar size={12} className="text-gray-400" />}
//                                 </button>
//                             )}
//                         </div>
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

//                     {/* Checklist — always in an editable draft state (no
//                         toggle button). Add / edit / reorder / delete are
//                         available immediately; nothing hits the server until
//                         "Save checklist" is clicked. */}
//                     <div>
//                         <div className="flex justify-between items-center mb-2">
//                             <div className="flex items-center gap-2">
//                                 <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
//                                     Checklist
//                                 </p>
//                                 {checklistDraft.length > 0 && (
//                                     <span className="text-xs text-gray-400">{progress}% complete</span>
//                                 )}
//                             </div>
//                             {canQuickEdit && (
//                                 <button
//                                     type="button"
//                                     onClick={addDraftItem}
//                                     className="text-xs text-[#2F5D50] hover:text-[#1D3B32] font-medium flex items-center gap-1"
//                                 >
//                                     <Plus size={12} /> Add item
//                                 </button>
//                             )}
//                         </div>

//                         {canQuickEdit ? (
//                             <div className="space-y-2">
//                                 {checklistDraft.length === 0 ? (
//                                     <div className="text-center py-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
//                                         <p className="text-xs text-gray-400">
//                                             No items yet. Click "Add item" to create one.
//                                         </p>
//                                     </div>
//                                 ) : (
//                                     <div className="space-y-1.5">
//                                         {checklistDraft.map((item, index) => (
//                                             <div
//                                                 key={item.clientId}
//                                                 className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors ${
//                                                     item.status === "Completed"
//                                                         ? "border-[#C7DAD3] bg-[#EAF2EF]"
//                                                         : "border-gray-200 bg-gray-50"
//                                                 }`}
//                                             >
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => toggleDraftStatus(item.clientId)}
//                                                     className="shrink-0"
//                                                     title={
//                                                         item.status === "Completed"
//                                                             ? "Mark as incomplete"
//                                                             : "Mark as complete"
//                                                     }
//                                                 >
//                                                     {item.status === "Completed" ? (
//                                                         <CheckCircle2 size={18} className="text-[#2F5D50]" />
//                                                     ) : (
//                                                         <Circle size={18} className="text-gray-300" />
//                                                     )}
//                                                 </button>

//                                                 <input
//                                                     type="text"
//                                                     value={item.description}
//                                                     onChange={(e) => updateDraftText(item.clientId, e.target.value)}
//                                                     placeholder={`Item ${index + 1}`}
//                                                     className={`flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 ${
//                                                         item.status === "Completed"
//                                                             ? "line-through text-gray-400"
//                                                             : "text-gray-700"
//                                                     }`}
//                                                 />

//                                                 <button
//                                                     type="button"
//                                                     onClick={() => moveDraftUp(index)}
//                                                     disabled={index === 0}
//                                                     title="Move up"
//                                                     className={`p-1 rounded ${
//                                                         index === 0
//                                                             ? "text-gray-300 cursor-not-allowed"
//                                                             : "text-gray-500 hover:bg-gray-200"
//                                                     }`}
//                                                 >
//                                                     <ArrowUp size={14} />
//                                                 </button>
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => moveDraftDown(index)}
//                                                     disabled={index === checklistDraft.length - 1}
//                                                     title="Move down"
//                                                     className={`p-1 rounded ${
//                                                         index === checklistDraft.length - 1
//                                                             ? "text-gray-300 cursor-not-allowed"
//                                                             : "text-gray-500 hover:bg-gray-200"
//                                                     }`}
//                                                 >
//                                                     <ArrowDown size={14} />
//                                                 </button>
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeDraftItem(item.clientId)}
//                                                     title="Remove item"
//                                                     className="p-1 text-red-500 hover:bg-red-50 rounded"
//                                                 >
//                                                     <Trash2 size={14} />
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}

//                                 <div className="flex justify-end pt-1">
//                                     <button
//                                         type="button"
//                                         onClick={saveChecklist}
//                                         disabled={savingField === "checklist"}
//                                         className="text-xs px-3 py-1.5 rounded-lg bg-[#2F5D50] text-white hover:bg-[#264C41] disabled:opacity-50"
//                                     >
//                                         {savingField === "checklist" ? "Saving..." : "Save checklist"}
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : task.task_items?.length > 0 ? (
//                             <div className="space-y-1.5">
//                                 {task.task_items.map((item, i) => (
//                                     <div key={item.id ?? i} className="flex items-center gap-2 text-sm">
//                                         {item.status === "Completed" ? (
//                                             <CheckCircle2 size={16} className="text-[#2F5D50] shrink-0" />
//                                         ) : (
//                                             <Circle size={16} className="text-gray-300 shrink-0" />
//                                         )}
//                                         <span
//                                             className={
//                                                 item.status === "Completed"
//                                                     ? "text-gray-400 line-through"
//                                                     : "text-gray-700"
//                                             }
//                                         >
//                                             {item.description}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p className="text-sm text-gray-400 italic">No checklist items yet.</p>
//                         )}
//                     </div>

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

// export default TaskDetailPopup;


import {
    X,
    Paperclip,
    Pencil,
    CheckCircle2,
    Circle,
    Plus,
    Calendar,
    Check,
    Trash2,
    ArrowUp,
    ArrowDown,
    FileText,
    AlertCircle,
} from "lucide-react";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

// Shared styling maps + helpers for the Task Dispatch board — exported here
// so both this popup and TaskAssigned.jsx (which renders the ticket cards)
// stay visually in sync from a single source.

export const STATUS_STYLES = {
    Pending: { bar: "#94A3B8" },
    "In Progress": { bar: "#3B6E91" },
    Completed: { bar: "#2F5D50" },
};

const STATUS_OPTIONS = Object.keys(STATUS_STYLES);

// Department / role tag styling — each department gets a distinct identity
// so a glance at the left edge of a ticket tells you who owns it.
export const DEPARTMENT_STYLES = {
    developer: { label: "Developer", bar: "#6D5BD0", text: "#4C3FAE", bg: "#EFEDFC" },
    technician: { label: "Technician", bar: "#C9762C", text: "#8A4E15", bg: "#FBEFE3" },
    accountant: { label: "Accountant", bar: "#3B6E91", text: "#265266", bg: "#E7F1F6" },
    admin: { label: "Admin", bar: "#475569", text: "#334155", bg: "#EEF1F5" },
    manager: { label: "Manager", bar: "#475569", text: "#334155", bg: "#EEF1F5" },
    user: { label: "User", bar: "#94A3B8", text: "#475569", bg: "#F1F5F9" },
};

export const getDeptStyle = (role) =>
    DEPARTMENT_STYLES[(role || "").toLowerCase()] || {
        label: role || "Unassigned",
        bar: "#CBD5E1",
        text: "#64748B",
        bg: "#F8FAFC",
    };

export const PRIORITY_DOT = {
    High: "#D64545",
    Medium: "#C98A1D",
    Low: "#2F8F5B",
};

export const getProgress = (taskItems) => {
    if (!taskItems || taskItems.length === 0) return 0;
    const completed = taskItems.filter((i) => i.status === "Completed").length;
    return Math.round((completed / taskItems.length) * 100);
};

export const getDueInfo = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, color: "text-red-600" };
    if (diffDays === 0) return { text: "Due today", color: "text-orange-600" };
    if (diffDays <= 2) return { text: `${diffDays}d left`, color: "text-orange-500" };
    return { text: `${diffDays}d left`, color: "text-gray-500" };
};

// Task attachments are validated on the backend as jpg/jpeg/png/gif/webp/pdf,
// so extension is enough to tell a PDF from an image here.
const isPdfFile = (path = "") => /\.pdf$/i.test(path);
const attachmentUrl = (path) => `/storage/${path}`;

const DetailRow = ({ label, value }) => (
    <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm text-gray-800">{value || "—"}</p>
    </div>
);

// ─── Inline PDF Viewer ──────────────────────────────────────────────────────
// Scrollable, zoomable, page-by-page PDF preview rendered directly in the
// popup (same behavior as the ticketing system's PdfViewer) instead of just
// linking out to the file.
const AttachmentPdfViewer = ({ url }) => {
    const [numPages, setNumPages] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [pdfLoading, setPdfLoading] = useState(true);
    const [pdfError, setPdfError] = useState(null);
    const [currentPageInView, setCurrentPageInView] = useState(1);

    const containerRef = useRef(null);
    const pageRefs = useRef([]);

    const onDocumentLoadSuccess = useCallback(({ numPages }) => {
        setNumPages(numPages);
        setPdfLoading(false);
        setPdfError(null);
        pageRefs.current = pageRefs.current.slice(0, numPages);
    }, []);

    const onDocumentLoadError = useCallback((err) => {
        console.error("PDF load error:", err);
        setPdfError("Failed to load PDF.");
        setPdfLoading(false);
    }, []);

    useEffect(() => {
        if (!numPages) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setCurrentPageInView(parseInt(entry.target.dataset.page, 10) + 1);
                    }
                });
            },
            { threshold: 0.5 },
        );
        pageRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });
        return () => {
            pageRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [numPages, scale]);

    const zoomIn = () => setScale((p) => Math.min(p + 0.2, 2.0));
    const zoomOut = () => setScale((p) => Math.max(p - 0.2, 0.6));
    const resetZoom = () => setScale(1.0);

    return (
        <div className="flex flex-col h-full">
            {/* PDF toolbar */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg shrink-0">
                <div className="flex items-center gap-2">
                    <FileText size={14} className="text-red-500" />
                    <span className="text-xs font-medium text-gray-600">PDF Document</span>
                    {numPages && (
                        <span className="text-xs text-gray-400">
                            — Page <span className="font-medium text-gray-600">{currentPageInView}</span> of {numPages}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
                    <button
                        onClick={zoomOut}
                        disabled={scale <= 0.6}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
                    >
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>
                    <span className="px-2 text-xs font-medium text-gray-600 min-w-[42px] text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={zoomIn}
                        disabled={scale >= 2.0}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
                    >
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    <button
                        onClick={resetZoom}
                        className="px-2 py-1 text-xs hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                    >
                        reset
                    </button>
                </div>
            </div>

            {/* PDF scroll area */}
            <div
                ref={containerRef}
                className="flex-1 overflow-auto bg-gray-100 rounded-b-lg"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#9CA3AF #F3F4F6" }}
            >
                {pdfLoading && !pdfError && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#2F5D50]" />
                        <p className="text-gray-400 text-xs mt-3">Loading PDF…</p>
                    </div>
                )}
                {pdfError && (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                        <AlertCircle size={32} className="text-red-400 mb-2" />
                        <p className="text-sm text-red-600">{pdfError}</p>
                    </div>
                )}
                {!pdfError && (
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null}
                        className="flex flex-col items-center py-4 gap-4"
                    >
                        {numPages &&
                            Array.from({ length: numPages }, (_, i) => (
                                <div key={`page_${i + 1}`} ref={(el) => (pageRefs.current[i] = el)} data-page={i}>
                                    <Page
                                        pageNumber={i + 1}
                                        scale={scale}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                        className="shadow-md bg-white overflow-hidden"
                                        loading={<div className="w-[400px] h-[500px] bg-gray-200 animate-pulse" />}
                                    />
                                </div>
                            ))}
                    </Document>
                )}
            </div>
        </div>
    );
};

// Read-only-by-default ticket detail popup, with a few fields editable inline
// via onQuickUpdate:
//   - Status: select in the header, saves immediately on change.
//   - Due date: click to reveal a date input; requires an explicit small
//     confirm button click to save (no save-on-blur).
//   - Checklist: always shown in an editable draft state (no toggle) — items
//     can be added, edited, reordered (up/down), toggled complete, and
//     deleted at any time. Nothing is sent to the server until
//     "Save checklist" is pressed. The draft re-syncs from `task.task_items`
//     whenever the `task` prop changes (e.g. popup opened for a new ticket,
//     or a save round-trips fresh data back down).
// Full edits still go through the "Edit ticket" button -> EditTaskAssignedForm.
//
// IMPORTANT: because the backend's update() endpoint requires the full set
// of core fields (title, assigned_team, user_id, priority, start_date,
// due_date) and replaces task_items wholesale when present, every quick
// save here rebuilds the complete FormData from the current `task` prop
// with just the changed piece overridden — never a partial payload.
const TaskDetailPopup = ({ task, onClose, onEdit, onQuickUpdate }) => {
    const [savingField, setSavingField] = useState(null); // "due_date" | "status" | "checklist" | null
    const [error, setError] = useState("");

    const [editingDueDate, setEditingDueDate] = useState(false);
    const [dueDateDraft, setDueDateDraft] = useState("");

    // Checklist draft — always "live", no separate view/edit toggle.
    const [checklistDraft, setChecklistDraft] = useState([]);

    // Re-sync the draft whenever the underlying task changes (popup opened
    // for a different ticket, or the parent re-fetched fresh data after a
    // save). Doing this here instead of on a button click means the draft
    // is ready the moment the popup renders.
    useEffect(() => {
        setChecklistDraft(
            (task?.task_items || []).map((item, i) => ({
                clientId: item.id ?? `existing-${i}`,
                description: item.description,
                status: item.status || "Pending",
            }))
        );
    }, [task]);

    if (!task) return null;

    const dept = getDeptStyle(task.department);
    const progress = getProgress(checklistDraft);
    const dueInfo = getDueInfo(task.due_date);
    const canQuickEdit = typeof onQuickUpdate === "function";

    const buildFormData = (overrides = {}) => {
        const merged = {
            title: task.title,
            assigned_team: task.assigned_team,
            user_id: task.user_id,
            priority: task.priority,
            start_date: task.start_date?.slice(0, 10),
            due_date: task.due_date?.slice(0, 10),
            description: task.description || "",
            status: task.status,
            admin_remarks: task.admin_remarks || "",
            admin_status: task.admin_status || "",
            task_items: task.task_items || [],
            ...overrides,
        };

        const formData = new FormData();
        formData.append("title", merged.title);
        formData.append("assigned_team", merged.assigned_team);
        formData.append("user_id", merged.user_id);
        formData.append("priority", merged.priority);
        formData.append("start_date", merged.start_date);
        formData.append("due_date", merged.due_date);
        if (merged.description) formData.append("description", merged.description);
        formData.append("status", merged.status);

        if (merged.status === "Completed") {
            if (merged.admin_remarks) formData.append("admin_remarks", merged.admin_remarks);
            if (merged.admin_status) formData.append("admin_status", merged.admin_status);
        }

        merged.task_items.forEach((item, index) => {
            if (item.description?.trim()) {
                formData.append(`task_items[${index}][description]`, item.description);
                formData.append(`task_items[${index}][status]`, item.status || "Pending");
            }
        });

        return formData;
    };

    const handleQuickSave = async (overrides, savingKey) => {
        setError("");
        setSavingField(savingKey || Object.keys(overrides)[0]);
        try {
            await onQuickUpdate(buildFormData(overrides), task.id);
            return true;
        } catch (err) {
            console.log("Quick update failed", err);
            setError("Couldn't save that change. Please try again.");
            return false;
        } finally {
            setSavingField(null);
        }
    };

    // ---- Due date ----
    const startEditingDueDate = () => {
        setDueDateDraft(task.due_date?.slice(0, 10) || "");
        setEditingDueDate(true);
    };

    const handleDueDateSave = async () => {
        if (!dueDateDraft) {
            setEditingDueDate(false);
            return;
        }
        const ok = await handleQuickSave({ due_date: dueDateDraft }, "due_date");
        if (ok) setEditingDueDate(false);
    };

    // ---- Status (unchanged) ----
    const handleStatusChange = (e) => {
        handleQuickSave({ status: e.target.value }, "status");
    };

    // ---- Checklist — always-editable draft ----
    const addDraftItem = () => {
        setChecklistDraft((prev) => [
            ...prev,
            { clientId: `new-${Date.now()}`, description: "", status: "Pending" },
        ]);
    };

    const removeDraftItem = (clientId) => {
        setChecklistDraft((prev) => prev.filter((i) => i.clientId !== clientId));
    };

    const updateDraftText = (clientId, text) => {
        setChecklistDraft((prev) =>
            prev.map((i) => (i.clientId === clientId ? { ...i, description: text } : i))
        );
    };

    const toggleDraftStatus = (clientId) => {
        setChecklistDraft((prev) =>
            prev.map((i) =>
                i.clientId === clientId
                    ? { ...i, status: i.status === "Completed" ? "Pending" : "Completed" }
                    : i
            )
        );
    };

    const moveDraftUp = (index) => {
        if (index === 0) return;
        setChecklistDraft((prev) => {
            const next = [...prev];
            [next[index - 1], next[index]] = [next[index], next[index - 1]];
            return next;
        });
    };

    const moveDraftDown = (index) => {
        setChecklistDraft((prev) => {
            if (index === prev.length - 1) return prev;
            const next = [...prev];
            [next[index], next[index + 1]] = [next[index + 1], next[index]];
            return next;
        });
    };

    const saveChecklist = async () => {
        const items = checklistDraft
            .filter((i) => i.description.trim() !== "")
            .map((i) => ({ description: i.description.trim(), status: i.status }));

        await handleQuickSave({ task_items: items }, "checklist");
        // Draft re-syncs automatically via the useEffect once `task` updates
        // with fresh data from the parent after a successful save.
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col">
                <div
                    className="flex justify-between items-start px-6 py-4 border-b"
                    style={{ borderLeft: `6px solid ${dept.bar}` }}
                >
                    <div>
                        <span className="font-mono text-xs text-gray-400">{task.task_id}</span>
                        <h2 className="text-xl font-bold text-gray-900 mt-0.5">{task.title}</h2>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span
                                className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
                                style={{ backgroundColor: dept.bg, color: dept.text }}
                            >
                                {dept.label}
                            </span>

                            {/* Status — unchanged */}
                            {canQuickEdit ? (
                                <span className="flex items-center gap-1.5">
                                    <span
                                        className="w-1.5 h-1.5 rounded-full shrink-0"
                                        style={{ backgroundColor: STATUS_STYLES[task.status]?.bar || "#CBD5E1" }}
                                    />
                                    <select
                                        value={task.status}
                                        onChange={handleStatusChange}
                                        disabled={savingField === "status"}
                                        className="text-xs text-gray-600 border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-[#2F5D50]/30 rounded cursor-pointer disabled:opacity-50"
                                    >
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                    {savingField === "status" && (
                                        <span className="text-[10px] text-gray-400">saving…</span>
                                    )}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: STATUS_STYLES[task.status]?.bar || "#CBD5E1" }}
                                    />
                                    {task.status}
                                </span>
                            )}

                            <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: PRIORITY_DOT[task.priority] || "#CBD5E1" }}
                                />
                                {task.priority} priority
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-5 space-y-5">
                    {error && (
                        <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow label="Assigned to" value={task.assigned_user?.name} />
                        <DetailRow label="Assigned by" value={task.creator?.name} />
                        <DetailRow label="Start date" value={task.start_date?.slice(0, 10)} />

                        {/* Due date — click to edit, small button confirms the save */}
                        <div>
                            <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">
                                Due date
                            </p>
                            {canQuickEdit && editingDueDate ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="date"
                                        value={dueDateDraft}
                                        onChange={(e) => setDueDateDraft(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleDueDateSave();
                                            if (e.key === "Escape") setEditingDueDate(false);
                                        }}
                                        autoFocus
                                        disabled={savingField === "due_date"}
                                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 disabled:opacity-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleDueDateSave}
                                        disabled={savingField === "due_date"}
                                        title="Confirm due date"
                                        className="p-1 rounded-full bg-[#2F5D50] text-white hover:bg-[#264C41] disabled:opacity-50"
                                    >
                                        <Check size={12} />
                                    </button>
                                    {savingField === "due_date" && (
                                        <span className="text-[10px] text-gray-400">saving…</span>
                                    )}
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={canQuickEdit ? startEditingDueDate : undefined}
                                    className={`text-sm flex items-center gap-1.5 ${
                                        canQuickEdit ? "hover:text-[#2F5D50] cursor-pointer" : "cursor-default"
                                    } ${dueInfo ? dueInfo.color : "text-gray-800"}`}
                                >
                                    {task.due_date?.slice(0, 10) || "—"}
                                    {dueInfo && <span>· {dueInfo.text}</span>}
                                    {canQuickEdit && <Calendar size={12} className="text-gray-400" />}
                                </button>
                            )}
                        </div>
                    </div>

                    {task.description && (
                        <div>
                            <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                                Description
                            </p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.description}</p>
                        </div>
                    )}

                    {task.status === "Completed" && (task.admin_remarks || task.admin_status) && (
                        <div className="bg-[#EAF2EF] border border-[#C7DAD3] rounded-lg p-3 space-y-2">
                            {task.admin_status && <DetailRow label="Admin status" value={task.admin_status} />}
                            {task.admin_remarks && <DetailRow label="Admin remarks" value={task.admin_remarks} />}
                        </div>
                    )}

                    {/* Checklist — always in an editable draft state (no
                        toggle button). Add / edit / reorder / delete are
                        available immediately; nothing hits the server until
                        "Save checklist" is clicked. */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                                    Checklist
                                </p>
                                {checklistDraft.length > 0 && (
                                    <span className="text-xs text-gray-400">{progress}% complete</span>
                                )}
                            </div>
                            {canQuickEdit && (
                                <button
                                    type="button"
                                    onClick={addDraftItem}
                                    className="text-xs text-[#2F5D50] hover:text-[#1D3B32] font-medium flex items-center gap-1"
                                >
                                    <Plus size={12} /> Add item
                                </button>
                            )}
                        </div>

                        {canQuickEdit ? (
                            <div className="space-y-2">
                                {checklistDraft.length === 0 ? (
                                    <div className="text-center py-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <p className="text-xs text-gray-400">
                                            No items yet. Click "Add item" to create one.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        {checklistDraft.map((item, index) => (
                                            <div
                                                key={item.clientId}
                                                className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors ${
                                                    item.status === "Completed"
                                                        ? "border-[#C7DAD3] bg-[#EAF2EF]"
                                                        : "border-gray-200 bg-gray-50"
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => toggleDraftStatus(item.clientId)}
                                                    className="shrink-0"
                                                    title={
                                                        item.status === "Completed"
                                                            ? "Mark as incomplete"
                                                            : "Mark as complete"
                                                    }
                                                >
                                                    {item.status === "Completed" ? (
                                                        <CheckCircle2 size={18} className="text-[#2F5D50]" />
                                                    ) : (
                                                        <Circle size={18} className="text-gray-300" />
                                                    )}
                                                </button>

                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => updateDraftText(item.clientId, e.target.value)}
                                                    placeholder={`Item ${index + 1}`}
                                                    className={`flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 ${
                                                        item.status === "Completed"
                                                            ? "line-through text-gray-400"
                                                            : "text-gray-700"
                                                    }`}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => moveDraftUp(index)}
                                                    disabled={index === 0}
                                                    title="Move up"
                                                    className={`p-1 rounded ${
                                                        index === 0
                                                            ? "text-gray-300 cursor-not-allowed"
                                                            : "text-gray-500 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    <ArrowUp size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveDraftDown(index)}
                                                    disabled={index === checklistDraft.length - 1}
                                                    title="Move down"
                                                    className={`p-1 rounded ${
                                                        index === checklistDraft.length - 1
                                                            ? "text-gray-300 cursor-not-allowed"
                                                            : "text-gray-500 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    <ArrowDown size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDraftItem(item.clientId)}
                                                    title="Remove item"
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-end pt-1">
                                    <button
                                        type="button"
                                        onClick={saveChecklist}
                                        disabled={savingField === "checklist"}
                                        className="text-xs px-3 py-1.5 rounded-lg bg-[#2F5D50] text-white hover:bg-[#264C41] disabled:opacity-50"
                                    >
                                        {savingField === "checklist" ? "Saving..." : "Save checklist"}
                                    </button>
                                </div>
                            </div>
                        ) : task.task_items?.length > 0 ? (
                            <div className="space-y-1.5">
                                {task.task_items.map((item, i) => (
                                    <div key={item.id ?? i} className="flex items-center gap-2 text-sm">
                                        {item.status === "Completed" ? (
                                            <CheckCircle2 size={16} className="text-[#2F5D50] shrink-0" />
                                        ) : (
                                            <Circle size={16} className="text-gray-300 shrink-0" />
                                        )}
                                        <span
                                            className={
                                                item.status === "Completed"
                                                    ? "text-gray-400 line-through"
                                                    : "text-gray-700"
                                            }
                                        >
                                            {item.description}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No checklist items yet.</p>
                        )}
                    </div>

                    {/* Attachments — images render inline, PDFs render in a
                        scrollable/zoomable inline viewer (same behavior as
                        the ticketing system's attachment preview). */}
                    {task.attachments?.length > 0 && (
                        <div>
                            <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                                Attachments ({task.attachments.length})
                            </p>
                            <div className="space-y-4">
                                {task.attachments.map((att) => {
                                    const url = attachmentUrl(att.attachment);
                                    const fileName = att.attachment.split("/").pop();
                                    const isPdf = isPdfFile(att.attachment);

                                    return (
                                        <div
                                            key={att.id}
                                            className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-100">
                                                <span className="flex items-center gap-1.5 text-xs text-gray-600 truncate">
                                                    <Paperclip size={12} className="shrink-0 text-gray-400" />
                                                    {fileName}
                                                </span>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[11px] text-[#2F5D50] hover:underline shrink-0 ml-2"
                                                >
                                                    Open in new tab
                                                </a>
                                            </div>

                                            {isPdf ? (
                                                <div style={{ height: "420px" }}>
                                                    <AttachmentPdfViewer url={url} />
                                                </div>
                                            ) : (
                                                <div className="w-full flex items-center justify-center p-3 bg-gray-50">
                                                    <img
                                                        src={url}
                                                        alt={fileName}
                                                        className="max-w-full max-h-[360px] object-contain rounded-lg shadow-sm"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-50"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="px-5 py-2 flex items-center gap-2 rounded-full bg-[#2F5D50] text-white hover:bg-[#264C41]"
                    >
                        <Pencil size={15} /> Edit ticket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPopup;
