// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { usePage } from "@inertiajs/react";
// import { Search, X } from "lucide-react";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { STATUS_STYLES, DEPARTMENT_STYLES } from "@/PopupComponents/TaskDetailPopup";
// import TaskReportDetailPopup from "./TaskReportDetailPopup";

// const UserCard = ({ user, onClick }) => {
//     const initials = (user.name || "")
//         .split(" ")
//         .map((n) => n[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase();

//     const openCount = (user.in_progress_tasks || 0) + (user.pending_tasks || 0);

//     return (
//         <button
//             type="button"
//             onClick={() => onClick(user)}
//             className="text-left bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#2F5D50]/30 transition-all"
//         >
//             <div className="flex items-center gap-3 mb-3">
//                 <span className="w-10 h-10 rounded-full bg-[#EAF2EF] text-[#2F5D50] font-bold flex items-center justify-center text-sm shrink-0">
//                     {initials}
//                 </span>
//                 <div className="min-w-0">
//                     <p className="text-sm font-semibold text-gray-900 truncate">
//                         {user.name}
//                     </p>
//                     <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
//                         {user.role}
//                     </p>
//                 </div>
//             </div>

//             <div className="grid grid-cols-3 gap-2">
//                 <div className="text-center">
//                     <p className="text-base font-bold text-gray-900">
//                         {user.total_tasks}
//                     </p>
//                     <p className="text-[10px] text-gray-400 uppercase tracking-wider">
//                         Total
//                     </p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-base font-bold text-[#DC2626]">
//                         {user.completed_tasks}
//                     </p>
//                     <p className="text-[10px] text-gray-400 uppercase tracking-wider">
//                         Done
//                     </p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-base font-bold text-[#16A34A]">
//                         {openCount}
//                     </p>
//                     <p className="text-[10px] text-gray-400 uppercase tracking-wider">
//                         Open
//                     </p>
//                 </div>
//             </div>
//         </button>
//     );
// };

// const TaskReport = () => {
//     const { auth } = usePage().props;
//     const isPrivileged = ["admin", "manager"].includes(auth?.user?.role);

//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedUserId, setSelectedUserId] = useState(null);

//     const [search, setSearch] = useState("");
//     const [debouncedSearch, setDebouncedSearch] = useState("");
//     const [roleFilter, setRoleFilter] = useState("all");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");

//     // Debounce the free-text search so we're not firing a request on every
//     // keystroke.
//     useEffect(() => {
//         const id = setTimeout(() => setDebouncedSearch(search), 400);
//         return () => clearTimeout(id);
//     }, [search]);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             setLoading(true);
//             try {
//                 const res = await axios.get(
//                     route("ourtaskreport.index", {
//                         search: debouncedSearch || undefined,
//                         role: roleFilter !== "all" ? roleFilter : undefined,
//                         status: statusFilter !== "all" ? statusFilter : undefined,
//                         start_date: startDate || undefined,
//                         end_date: endDate || undefined,
//                     }),
//                 );
//                 setUsers(res.data?.data || []);
//             } catch (err) {
//                 console.log("Error fetching users summary", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUsers();
//     }, [debouncedSearch, roleFilter, statusFilter, startDate, endDate]);

//     const hasActiveFilters =
//         search ||
//         roleFilter !== "all" ||
//         statusFilter !== "all" ||
//         startDate ||
//         endDate;

//     const clearFilters = () => {
//         setSearch("");
//         setRoleFilter("all");
//         setStatusFilter("all");
//         setStartDate("");
//         setEndDate("");
//     };

//     const roleOptions = useMemo(() => Object.keys(DEPARTMENT_STYLES), []);

//     return (
//         <AdminWrapper>
//             <div className="bg-[#F3F4F7] -m-6 p-6 h-full overflow-y-auto">
//                 <div className="mb-6">
//                     <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                         Task Report
//                     </h1>
//                     <p className="text-sm text-gray-500 mt-1">
//                         {users.length} team member{users.length === 1 ? "" : "s"} —
//                         filter, then click a card to see their full task history.
//                     </p>
//                 </div>

//                 {/* Filters */}
//                 <div className="flex flex-wrap items-center gap-2 mb-6 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
//                     <div className="relative flex-1 min-w-[200px]">
//                         <Search
//                             size={16}
//                             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                         />
//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             placeholder="Search by team member name..."
//                             className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         />
//                     </div>

//                     {isPrivileged && (
//                         <select
//                             value={roleFilter}
//                             onChange={(e) => setRoleFilter(e.target.value)}
//                             className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         >
//                             <option value="all">All roles</option>
//                             {roleOptions.map((r) => (
//                                 <option key={r} value={r}>
//                                     {DEPARTMENT_STYLES[r].label}
//                                 </option>
//                             ))}
//                         </select>
//                     )}

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

//                     <div className="flex items-center gap-1.5">
//                         <input
//                             type="date"
//                             value={startDate}
//                             onChange={(e) => setStartDate(e.target.value)}
//                             className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         />
//                         <span className="text-gray-300 text-sm">to</span>
//                         <input
//                             type="date"
//                             value={endDate}
//                             onChange={(e) => setEndDate(e.target.value)}
//                             className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         />
//                     </div>

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
//                     <div className="text-center text-gray-400 py-10">
//                         Loading team...
//                     </div>
//                 ) : users.length === 0 ? (
//                     <div className="py-10 text-center">
//                         <p className="text-sm text-gray-400 italic">
//                             {hasActiveFilters
//                                 ? "No team members match your filters"
//                                 : "No team members with tasks yet"}
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                         {users.map((user) => (
//                             <UserCard
//                                 key={user.id}
//                                 user={user}
//                                 onClick={(u) => setSelectedUserId(u.id)}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>

//             <TaskReportDetailPopup
//                 userId={selectedUserId}
//                 onClose={() => setSelectedUserId(null)}
//             />
//         </AdminWrapper>
//     );
// };

// export default TaskReport;




// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";
// import Select from "react-select";
// import { usePage } from "@inertiajs/react";
// import {
//     X,
//     Download,
//     Loader2,
//     Users,
//     ListChecks,
//     CheckCircle2,
//     Clock3,
// } from "lucide-react";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { STATUS_STYLES, DEPARTMENT_STYLES } from "@/PopupComponents/TaskDetailPopup";
// import TaskReportDetailPopup from "./TaskReportDetailPopup";

// // ── Avatar color rotation — deterministic per user id, so a given
// // person's initials always land on the same color across renders. ──────
// const AVATAR_PALETTES = [
//     { bg: "#EAF2EF", text: "#2F5D50" },
//     { bg: "#EFF4FB", text: "#2A5C8A" },
//     { bg: "#FBF0E8", text: "#B5651D" },
//     { bg: "#F3EEFB", text: "#6B46A8" },
//     { bg: "#FCEFF1", text: "#B23A5A" },
// ];

// const getAvatarPalette = (id) => AVATAR_PALETTES[id % AVATAR_PALETTES.length];

// // react-select styling to match the rest of the filter bar (rounded-lg,
// // gray-200 border, brand-green focus ring).
// const userSelectStyles = {
//     control: (base, state) => ({
//         ...base,
//         minHeight: "38px",
//         borderRadius: "0.5rem",
//         borderColor: state.isFocused ? "#2F5D50" : "#e5e7eb",
//         boxShadow: state.isFocused ? "0 0 0 2px rgba(47,93,80,0.3)" : "none",
//         "&:hover": { borderColor: state.isFocused ? "#2F5D50" : "#e5e7eb" },
//         fontSize: "0.875rem",
//     }),
//     valueContainer: (base) => ({ ...base, padding: "2px 10px" }),
//     indicatorSeparator: () => ({ display: "none" }),
//     menu: (base) => ({ ...base, fontSize: "0.875rem", zIndex: 20 }),
//     option: (base, state) => ({
//         ...base,
//         backgroundColor: state.isSelected
//             ? "#2F5D50"
//             : state.isFocused
//                 ? "#EAF2EF"
//                 : "white",
//         color: state.isSelected ? "white" : "#111827",
//         cursor: "pointer",
//     }),
//     placeholder: (base) => ({ ...base, color: "#9ca3af" }),
//     singleValue: (base) => ({ ...base, color: "#374151" }),
// };

// const ALL_USERS_OPTION = { value: null, label: "All Users" };

// const SummaryTile = ({ icon: Icon, label, value, accent }) => (
//     <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
//         <span
//             className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
//             style={{ backgroundColor: `${accent}15` }}
//         >
//             <Icon size={18} style={{ color: accent }} />
//         </span>
//         <div className="min-w-0">
//             <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
//             <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
//                 {label}
//             </p>
//         </div>
//     </div>
// );

// const UserCard = ({ user, onClick }) => {
//     const palette = getAvatarPalette(user.id);
//     const initials = (user.name || "")
//         .split(" ")
//         .map((n) => n[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase();

//     const pendingCount = (user.in_progress_tasks || 0) + (user.pending_tasks || 0);
//     const total = user.total_tasks || 0;
//     const completionPct = total > 0 ? Math.round((user.completed_tasks / total) * 100) : 0;

//     return (
//         <button
//             type="button"
//             onClick={() => onClick(user)}
//             className="group text-left bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#2F5D50]/30 hover:-translate-y-0.5 transition-all duration-150"
//         >
//             <div className="flex items-center gap-3 mb-3.5">
//                 <span
//                     className="w-11 h-11 rounded-full font-bold flex items-center justify-center text-sm shrink-0"
//                     style={{ backgroundColor: palette.bg, color: palette.text }}
//                 >
//                     {initials}
//                 </span>
//                 <div className="min-w-0 flex-1">
//                     <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#2F5D50] transition-colors">
//                         {user.name}
//                     </p>
//                     <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
//                         {user.role}
//                     </p>
//                 </div>
//             </div>

//             {/* Completion progress bar */}
//             <div className="mb-3.5">
//                 <div className="flex items-center justify-between mb-1">
//                     <span className="text-[10px] text-gray-400 uppercase tracking-wider">
//                         Completion
//                     </span>
//                     <span className="text-[11px] font-semibold text-gray-600">
//                         {completionPct}%
//                     </span>
//                 </div>
//                 <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
//                     <div
//                         className="h-full rounded-full transition-all duration-300"
//                         style={{
//                             width: `${completionPct}%`,
//                             backgroundColor:
//                                 completionPct === 100
//                                     ? "#16A34A"
//                                     : completionPct > 0
//                                         ? "#2F5D50"
//                                         : "#E5E7EB",
//                         }}
//                     />
//                 </div>
//             </div>

//             <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
//                 <div className="text-center">
//                     <p className="text-base font-bold text-gray-900">{total}</p>
//                     <p className="text-[10px] text-gray-400 uppercase tracking-wider">
//                         Total
//                     </p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-base font-bold text-[#DC2626]">
//                         {user.completed_tasks}
//                     </p>
//                     <p className="text-[10px] text-gray-400 uppercase tracking-wider">
//                         Done
//                     </p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-base font-bold text-[#16A34A]">
//                         {pendingCount}
//                     </p>
//                     <p className="text-[10px] text-gray-400 uppercase tracking-wider">
//                         Pending
//                     </p>
//                 </div>
//             </div>
//         </button>
//     );
// };

// const UserCardSkeleton = () => (
//     <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse">
//         <div className="flex items-center gap-3 mb-3.5">
//             <span className="w-11 h-11 rounded-full bg-gray-100 shrink-0" />
//             <div className="min-w-0 flex-1 space-y-1.5">
//                 <div className="h-3.5 w-2/3 bg-gray-100 rounded" />
//                 <div className="h-2.5 w-1/3 bg-gray-100 rounded" />
//             </div>
//         </div>
//         <div className="mb-3.5">
//             <div className="h-1.5 w-full bg-gray-100 rounded-full" />
//         </div>
//         <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
//             {[0, 1, 2].map((i) => (
//                 <div key={i} className="text-center space-y-1">
//                     <div className="h-4 w-6 bg-gray-100 rounded mx-auto" />
//                     <div className="h-2 w-8 bg-gray-100 rounded mx-auto" />
//                 </div>
//             ))}
//         </div>
//     </div>
// );

// // ── PDF duration helpers (mirrors TaskReportDetailPopup's formatting) ──────

// const secondsBetween = (start, end) => {
//     if (!start) return null;
//     const startMs = new Date(start).getTime();
//     const endMs = end ? new Date(end).getTime() : Date.now();
//     return Math.max(0, Math.floor((endMs - startMs) / 1000));
// };

// const formatDuration = (totalSeconds) => {
//     if (totalSeconds == null || totalSeconds < 0) return "—";
//     const days = Math.floor(totalSeconds / 86400);
//     const hours = Math.floor((totalSeconds % 86400) / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     if (days > 0) return `${days}d ${hours}h`;
//     if (hours > 0) return `${hours}h ${minutes}m`;
//     if (minutes > 0) return `${minutes}m`;
//     return "just now";
// };

// const formatItemDuration = (totalSeconds) => {
//     if (totalSeconds == null || totalSeconds < 0) return "—";
//     if (totalSeconds < 60) return `${totalSeconds} sec`;

//     const days = Math.floor(totalSeconds / 86400);
//     const hours = Math.floor((totalSeconds % 86400) / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);

//     if (days > 0) {
//         const dayLabel = `${days} day${days !== 1 ? "s" : ""}`;
//         return hours > 0 ? `${dayLabel} ${hours} hr` : dayLabel;
//     }
//     if (hours > 0) {
//         const hourLabel = `${hours} hr`;
//         return minutes > 0 ? `${hourLabel} ${minutes} min` : hourLabel;
//     }
//     return `${minutes} min`;
// };

// /**
//  * Builds and downloads a PDF containing EVERY detail the model provides
//  * for every filtered team member — not the summary cards shown on
//  * screen. For each user: their aggregate counts, then every one of
//  * their tasks with assigned to/by, start/due dates, status, the
//  * completed-task duration (start_date -> due_date) when applicable, and
//  * the full task list (each item's description, completion date, and
//  * time taken from created_at -> updated_at — updated_at is only bumped
//  * by the backend when description/status actually changes, so it
//  * reflects the real completion moment). Table drawn manually since only
//  * `jspdf` (no autotable plugin) is installed.
//  */
// const exportFullDetailPdf = (users, filters) => {
//     const doc = new jsPDF({ unit: "pt", format: "a4" });
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const marginX = 40;
//     const maxWidth = pageWidth - marginX * 2;
//     let y = 50;

//     const ensureSpace = (needed) => {
//         if (y + needed > pageHeight - 40) {
//             doc.addPage();
//             y = 50;
//         }
//     };

//     const writeLine = (text, { size = 10, style = "normal", color = "#1f2937", gap = 14, indent = 0 } = {}) => {
//         doc.setFont("helvetica", style);
//         doc.setFontSize(size);
//         doc.setTextColor(color);
//         const lines = doc.splitTextToSize(text, maxWidth - indent);
//         lines.forEach((line) => {
//             ensureSpace(gap);
//             doc.text(line, marginX + indent, y);
//             y += gap;
//         });
//     };

//     // Report header
//     writeLine("Task Report — Full Team Detail", { size: 18, style: "bold", gap: 22 });
//     writeLine(`Generated ${new Date().toLocaleString()}`, { size: 9, color: "#6b7280", gap: 16 });

//     const filterLine = [
//         filters.user ? `Team member: ${filters.user}` : null,
//         filters.role && filters.role !== "all" ? `Role: ${filters.role}` : null,
//         filters.status && filters.status !== "all" ? `Status: ${filters.status}` : null,
//         filters.startDate || filters.endDate
//             ? `Date range: ${filters.startDate || "…"} to ${filters.endDate || "…"}`
//             : null,
//     ]
//         .filter(Boolean)
//         .join("   |   ");

//     if (filterLine) {
//         writeLine(filterLine, { size: 9, color: "#6b7280", gap: 16 });
//     }

//     y += 8;

//     users.forEach((user, userIdx) => {
//         ensureSpace(50);

//         // Section divider between users
//         if (userIdx > 0) {
//             y += 6;
//             doc.setDrawColor("#9ca3af");
//             doc.setLineWidth(1);
//             doc.line(marginX, y, pageWidth - marginX, y);
//             doc.setLineWidth(0.5);
//             y += 18;
//         }

//         const tasks = user.assigned_tasks || [];
//         const completed = tasks.filter((t) => t.status === "Completed").length;
//         const pending = tasks.length - completed;

//         writeLine(`${user.name}`, { size: 14, style: "bold", gap: 18 });
//         writeLine(`Role: ${user.role || "—"}`, { size: 9, color: "#6b7280", gap: 14 });
//         writeLine(
//             `Total tasks: ${tasks.length}   Completed: ${completed}   Pending: ${pending}`,
//             { size: 9, style: "bold", gap: 16 },
//         );

//         y += 4;

//         if (tasks.length === 0) {
//             writeLine("No tasks in this range.", { size: 9, color: "#9ca3af", gap: 16 });
//             return;
//         }

//         tasks.forEach((task, taskIdx) => {
//             ensureSpace(60);

//             if (taskIdx > 0) {
//                 y += 2;
//                 doc.setDrawColor("#e5e7eb");
//                 doc.line(marginX + 12, y, pageWidth - marginX, y);
//                 y += 12;
//             }

//             const isTaskCompleted = task.status === "Completed";
//             const taskDurationSeconds = isTaskCompleted
//                 ? secondsBetween(task.start_date, task.due_date)
//                 : null;

//             writeLine(`${taskIdx + 1}. ${task.title}`, {
//                 size: 11,
//                 style: "bold",
//                 gap: 15,
//                 indent: 12,
//             });
//             writeLine(`Status: ${task.status}`, {
//                 size: 9,
//                 color: "#6b7280",
//                 gap: 13,
//                 indent: 12,
//             });
//             writeLine(
//                 `Assigned to: ${user.name}    Assigned by: ${task.creator?.name || "—"}`,
//                 { size: 9, gap: 13, indent: 12 },
//             );
//             writeLine(
//                 `Start date: ${task.start_date?.slice(0, 10) || "—"}    Due date: ${task.due_date?.slice(0, 10) || "—"}`,
//                 { size: 9, gap: isTaskCompleted ? 13 : 15, indent: 12 },
//             );

//             if (isTaskCompleted) {
//                 writeLine(`Completed in: ${formatDuration(taskDurationSeconds)}`, {
//                     size: 9,
//                     style: "bold",
//                     color: "#DC2626",
//                     gap: 15,
//                     indent: 12,
//                 });
//             }

//             const items = task.task_items || [];
//             if (items.length > 0) {
//                 writeLine("Task List:", {
//                     size: 9,
//                     style: "bold",
//                     color: "#374151",
//                     gap: 13,
//                     indent: 12,
//                 });

//                 items.forEach((item) => {
//                     const isCompleted = item.status === "Completed";
//                     const bullet = isCompleted ? "[x]" : "[ ]";
//                     let line = `${bullet} ${item.description}`;

//                     if (isCompleted) {
//                         const takenSeconds = secondsBetween(item.created_at, item.updated_at);
//                         line += `  — completed ${item.updated_at?.slice(0, 10) || "—"}, took ${formatItemDuration(takenSeconds)}`;
//                     }

//                     writeLine(line, {
//                         size: 9,
//                         color: isCompleted ? "#2F5D50" : "#374151",
//                         gap: 13,
//                         indent: 24,
//                     });
//                 });
//             }

//             y += 4;
//         });
//     });

//     doc.save(`task-report-full-detail-${new Date().toISOString().slice(0, 10)}.pdf`);
// };

// const TaskReport = () => {
//     const { auth } = usePage().props;
//     const isPrivileged = ["admin", "manager"].includes(auth?.user?.role);

//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedUserId, setSelectedUserId] = useState(null);
//     const [exporting, setExporting] = useState(false);

//     // Team member picker — independent of the filtered grid, so the
//     // dropdown always lists every user, not just ones currently showing up.
//     const [teamMembers, setTeamMembers] = useState([]);
//     const [selectedUser, setSelectedUser] = useState(ALL_USERS_OPTION);

//     const [roleFilter, setRoleFilter] = useState("all");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");

//     // Fetch the full team member list once, for the dropdown options.
//     useEffect(() => {
//         const fetchTeamMembers = async () => {
//             try {
//                 const res = await axios.get(route("ourtaskreport.teammembers"));
//                 setTeamMembers(res.data?.data || []);
//             } catch (err) {
//                 console.log("Error fetching team members", err);
//             }
//         };

//         fetchTeamMembers();
//     }, []);

//     const userOptions = useMemo(
//         () => [
//             ALL_USERS_OPTION,
//             ...teamMembers.map((u) => ({
//                 value: u.id,
//                 label: u.name,
//             })),
//         ],
//         [teamMembers],
//     );

//     useEffect(() => {
//         const fetchUsers = async () => {
//             setLoading(true);
//             try {
//                 const res = await axios.get(
//                     route("ourtaskreport.index", {
//                         user_id: selectedUser?.value || undefined,
//                         role: roleFilter !== "all" ? roleFilter : undefined,
//                         status: statusFilter !== "all" ? statusFilter : undefined,
//                         start_date: startDate || undefined,
//                         end_date: endDate || undefined,
//                     }),
//                 );
//                 setUsers(res.data?.data || []);
//             } catch (err) {
//                 console.log("Error fetching users summary", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUsers();
//     }, [selectedUser, roleFilter, statusFilter, startDate, endDate]);

//     const hasActiveFilters =
//         (selectedUser && selectedUser.value) ||
//         roleFilter !== "all" ||
//         statusFilter !== "all" ||
//         startDate ||
//         endDate;

//     const clearFilters = () => {
//         setSelectedUser(ALL_USERS_OPTION);
//         setRoleFilter("all");
//         setStatusFilter("all");
//         setStartDate("");
//         setEndDate("");
//     };

//     const roleOptions = useMemo(() => Object.keys(DEPARTMENT_STYLES), []);

//     // Aggregate summary tiles across every currently-filtered user.
//     const summary = useMemo(() => {
//         return users.reduce(
//             (acc, u) => {
//                 const pending = (u.in_progress_tasks || 0) + (u.pending_tasks || 0);
//                 acc.members += 1;
//                 acc.total += u.total_tasks || 0;
//                 acc.completed += u.completed_tasks || 0;
//                 acc.pending += pending;
//                 return acc;
//             },
//             { members: 0, total: 0, completed: 0, pending: 0 },
//         );
//     }, [users]);

//     // Fetches the FULL nested detail (every task + task list item, not
//     // just counts) for the currently active filters, then builds the PDF
//     // from that — separate request from the card-grid summary fetch.
//     const handleExportAll = async () => {
//         setExporting(true);
//         try {
//             const res = await axios.get(
//                 route("ourtaskreport.export", {
//                     user_id: selectedUser?.value || undefined,
//                     role: roleFilter !== "all" ? roleFilter : undefined,
//                     status: statusFilter !== "all" ? statusFilter : undefined,
//                     start_date: startDate || undefined,
//                     end_date: endDate || undefined,
//                 }),
//             );
//             const fullUsers = res.data?.data || [];
//             exportFullDetailPdf(fullUsers, {
//                 user: selectedUser?.value ? selectedUser.label : null,
//                 role: roleFilter,
//                 status: statusFilter,
//                 startDate,
//                 endDate,
//             });
//         } catch (err) {
//             console.log("Error exporting full detail PDF", err);
//         } finally {
//             setExporting(false);
//         }
//     };

//     return (
//         <AdminWrapper>
//             <div className="bg-[#F3F4F7] -m-6 p-6 h-full overflow-y-auto">
//                 <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                             Task Report
//                         </h1>
//                         <p className="text-sm text-gray-500 mt-1">
//                             Team workload overview — filter, then click a card for
//                             the full task history.
//                         </p>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={handleExportAll}
//                         disabled={loading || exporting || users.length === 0}
//                         className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#2F5D50] text-white text-sm font-medium hover:bg-[#274d42] disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 shadow-sm"
//                     >
//                         {exporting ? (
//                             <Loader2 size={14} className="animate-spin" />
//                         ) : (
//                             <Download size={14} />
//                         )}
//                         {exporting ? "Preparing…" : "Export PDF"}
//                     </button>
//                 </div>

//                 {/* Aggregate summary tiles */}
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//                     <SummaryTile
//                         icon={Users}
//                         label="Team members"
//                         value={summary.members}
//                         accent="#2F5D50"
//                     />
//                     <SummaryTile
//                         icon={ListChecks}
//                         label="Total tasks"
//                         value={summary.total}
//                         accent="#3B6E91"
//                     />
//                     <SummaryTile
//                         icon={CheckCircle2}
//                         label="Completed"
//                         value={summary.completed}
//                         accent="#DC2626"
//                     />
//                     <SummaryTile
//                         icon={Clock3}
//                         label="Pending"
//                         value={summary.pending}
//                         accent="#16A34A"
//                     />
//                 </div>

//                 {/* Filters */}
//                 <div className="flex flex-wrap items-center gap-2 mb-6 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
//                     <div className="flex-1 min-w-[220px]">
//                         <Select
//                             options={userOptions}
//                             value={selectedUser}
//                             onChange={(option) => setSelectedUser(option || ALL_USERS_OPTION)}
//                             styles={userSelectStyles}
//                             placeholder="All Users"
//                             isClearable={false}
//                             isSearchable
//                         />
//                     </div>

//                     {isPrivileged && (
//                         <select
//                             value={roleFilter}
//                             onChange={(e) => setRoleFilter(e.target.value)}
//                             className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         >
//                             <option value="all">All roles</option>
//                             {roleOptions.map((r) => (
//                                 <option key={r} value={r}>
//                                     {DEPARTMENT_STYLES[r].label}
//                                 </option>
//                             ))}
//                         </select>
//                     )}

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

//                     <div className="flex items-center gap-1.5">
//                         <input
//                             type="date"
//                             value={startDate}
//                             onChange={(e) => setStartDate(e.target.value)}
//                             className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         />
//                         <span className="text-gray-300 text-sm">to</span>
//                         <input
//                             type="date"
//                             value={endDate}
//                             onChange={(e) => setEndDate(e.target.value)}
//                             className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         />
//                     </div>

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
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                         {Array.from({ length: 8 }).map((_, i) => (
//                             <UserCardSkeleton key={i} />
//                         ))}
//                     </div>
//                 ) : users.length === 0 ? (
//                     <div className="py-16 text-center bg-white border border-gray-200 rounded-xl">
//                         <Users size={28} className="mx-auto text-gray-300 mb-2" />
//                         <p className="text-sm text-gray-400 italic">
//                             {hasActiveFilters
//                                 ? "No team members match your filters"
//                                 : "No team members with tasks yet"}
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                         {users.map((user) => (
//                             <UserCard
//                                 key={user.id}
//                                 user={user}
//                                 onClick={(u) => setSelectedUserId(u.id)}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>

//             <TaskReportDetailPopup
//                 userId={selectedUserId}
//                 onClose={() => setSelectedUserId(null)}
//             />
//         </AdminWrapper>
//     );
// };

// export default TaskReport;




import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import Select from "react-select";
import { usePage } from "@inertiajs/react";
import {
    X,
    Download,
    Loader2,
    Users,
    ListChecks,
    CheckCircle2,
    Clock3,
} from "lucide-react";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { STATUS_STYLES, DEPARTMENT_STYLES } from "@/PopupComponents/TaskDetailPopup";
import TaskReportDetailPopup from "./TaskReportDetailPopup";

const AVATAR_PALETTES = [
    { bg: "#EAF2EF", text: "#2F5D50" },
    { bg: "#EFF4FB", text: "#2A5C8A" },
    { bg: "#FBF0E8", text: "#B5651D" },
    { bg: "#F3EEFB", text: "#6B46A8" },
    { bg: "#FCEFF1", text: "#B23A5A" },
];

const getAvatarPalette = (id) => AVATAR_PALETTES[id % AVATAR_PALETTES.length];

const userSelectStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: "38px",
        borderRadius: "0.5rem",
        borderColor: state.isFocused ? "#2F5D50" : "#e5e7eb",
        boxShadow: state.isFocused ? "0 0 0 2px rgba(47,93,80,0.3)" : "none",
        "&:hover": { borderColor: state.isFocused ? "#2F5D50" : "#e5e7eb" },
        fontSize: "0.875rem",
    }),
    valueContainer: (base) => ({ ...base, padding: "2px 10px" }),
    indicatorSeparator: () => ({ display: "none" }),
    menu: (base) => ({ ...base, fontSize: "0.875rem", zIndex: 20 }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? "#2F5D50"
            : state.isFocused
                ? "#EAF2EF"
                : "white",
        color: state.isSelected ? "white" : "#111827",
        cursor: "pointer",
    }),
    placeholder: (base) => ({ ...base, color: "#9ca3af" }),
    singleValue: (base) => ({ ...base, color: "#374151" }),
};

const ALL_USERS_OPTION = { value: null, label: "All Users" };

const SummaryTile = ({ icon: Icon, label, value, accent }) => (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
        <span
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accent}15` }}
        >
            <Icon size={18} style={{ color: accent }} />
        </span>
        <div className="min-w-0">
            <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
            <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                {label}
            </p>
        </div>
    </div>
);

const UserCard = ({ user, onClick }) => {
    const palette = getAvatarPalette(user.id);
    const initials = (user.name || "")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const pendingCount = (user.in_progress_tasks || 0) + (user.pending_tasks || 0);
    const total = user.total_tasks || 0;
    const completionPct = total > 0 ? Math.round((user.completed_tasks / total) * 100) : 0;

    return (
        <button
            type="button"
            onClick={() => onClick(user)}
            className="group text-left bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#2F5D50]/30 hover:-translate-y-0.5 transition-all duration-150"
        >
            <div className="flex items-center gap-3 mb-3.5">
                <span
                    className="w-11 h-11 rounded-full font-bold flex items-center justify-center text-sm shrink-0"
                    style={{ backgroundColor: palette.bg, color: palette.text }}
                >
                    {initials}
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#2F5D50] transition-colors">
                        {user.name}
                    </p>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                        {user.role}
                    </p>
                </div>
            </div>

            <div className="mb-3.5">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        Completion
                    </span>
                    <span className="text-[11px] font-semibold text-gray-600">
                        {completionPct}%
                    </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                            width: `${completionPct}%`,
                            backgroundColor:
                                completionPct === 100
                                    ? "#16A34A"
                                    : completionPct > 0
                                        ? "#2F5D50"
                                        : "#E5E7EB",
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                <div className="text-center">
                    <p className="text-base font-bold text-gray-900">{total}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        Total
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-base font-bold text-[#DC2626]">
                        {user.completed_tasks}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        Completed
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-base font-bold text-[#16A34A]">
                        {pendingCount}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        Pending
                    </p>
                </div>
            </div>
        </button>
    );
};

const UserCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse">
        <div className="flex items-center gap-3 mb-3.5">
            <span className="w-11 h-11 rounded-full bg-gray-100 shrink-0" />
            <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-3.5 w-2/3 bg-gray-100 rounded" />
                <div className="h-2.5 w-1/3 bg-gray-100 rounded" />
            </div>
        </div>
        <div className="mb-3.5">
            <div className="h-1.5 w-full bg-gray-100 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
            {[0, 1, 2].map((i) => (
                <div key={i} className="text-center space-y-1">
                    <div className="h-4 w-6 bg-gray-100 rounded mx-auto" />
                    <div className="h-2 w-8 bg-gray-100 rounded mx-auto" />
                </div>
            ))}
        </div>
    </div>
);

/**
 * Popup shown when "Export PDF" is clicked. Step 1 lets the user pick
 * "Export all" (every user currently matching the page's filters) or
 * "Export a few" (hand-pick specific team members from that same
 * filtered list). Step 2, shown only for "Export a few", is a checkbox
 * list built from the `users` prop (the already-filtered summary list
 * on screen) so selection always respects whatever role/status/date
 * filters are active on the page.
 */
const ExportSelectionModal = ({ users, exporting, onClose, onExportAll, onExportSelected }) => {
    const [mode, setMode] = useState("choose"); // "choose" | "select"
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleUser = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
                <div className="flex justify-between items-center px-5 py-4 border-b">
                    <h2 className="text-base font-bold text-gray-900">
                        {mode === "choose" ? "Export PDF" : "Select team members"}
                    </h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
                        <X size={18} />
                    </button>
                </div>

                {mode === "choose" ? (
                    <div className="p-5 space-y-3">
                        <button
                            type="button"
                            onClick={onExportAll}
                            disabled={exporting}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 hover:border-[#2F5D50]/40 hover:bg-[#F3F8F6] transition text-left disabled:opacity-50"
                        >
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Export all</p>
                                <p className="text-xs text-gray-500">
                                    All {users.length} team member{users.length !== 1 ? "s" : ""} matching current filters
                                </p>
                            </div>
                            {exporting ? (
                                <Loader2 size={16} className="text-[#2F5D50] animate-spin" />
                            ) : (
                                <Download size={16} className="text-[#2F5D50]" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode("select")}
                            disabled={exporting}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 hover:border-[#2F5D50]/40 hover:bg-[#F3F8F6] transition text-left disabled:opacity-50"
                        >
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Export a few</p>
                                <p className="text-xs text-gray-500">Pick specific team members</p>
                            </div>
                            <Users size={16} className="text-[#2F5D50]" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="max-h-80 overflow-y-auto px-5 py-3 space-y-1">
                            {users.length === 0 ? (
                                <p className="text-sm text-gray-400 italic text-center py-6">
                                    No team members match your filters
                                </p>
                            ) : (
                                users.map((u) => (
                                    <label
                                        key={u.id}
                                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(u.id)}
                                            onChange={() => toggleUser(u.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-[#2F5D50] focus:ring-[#2F5D50]/30"
                                        />
                                        <span className="text-sm text-gray-800">{u.name}</span>
                                        <span className="text-[10px] text-gray-400 uppercase ml-auto">
                                            {u.role}
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>
                        <div className="flex justify-between items-center gap-3 px-5 py-4 border-t">
                            <button
                                type="button"
                                onClick={() => setMode("choose")}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => onExportSelected(selectedIds)}
                                disabled={exporting || selectedIds.length === 0}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2F5D50] text-white text-sm font-medium hover:bg-[#274d42] disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                {exporting ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Download size={14} />
                                )}
                                Export{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const secondsBetween = (start, end) => {
    if (!start) return null;
    const startMs = new Date(start).getTime();
    const endMs = end ? new Date(end).getTime() : Date.now();
    return Math.max(0, Math.floor((endMs - startMs) / 1000));
};

const formatDuration = (totalSeconds) => {
    if (totalSeconds == null || totalSeconds < 0) return "—";
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return "just now";
};

const formatItemDuration = (totalSeconds) => {
    if (totalSeconds == null || totalSeconds < 0) return "—";
    if (totalSeconds < 60) return `${totalSeconds} sec`;

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (days > 0) {
        const dayLabel = `${days} day${days !== 1 ? "s" : ""}`;
        return hours > 0 ? `${dayLabel} ${hours} hr` : dayLabel;
    }
    if (hours > 0) {
        const hourLabel = `${hours} hr`;
        return minutes > 0 ? `${hourLabel} ${minutes} min` : hourLabel;
    }
    return `${minutes} min`;
};

/**
 * Builds and downloads a PDF containing every detail the model provides
 * for every filtered team member. Duration is created_at -> updated_at
 * (the moment the task row was created, to the moment it was saved as
 * Completed) — not start_date -> due_date. start_date has no
 * time-of-day (stored as midnight) and due_date is just the target
 * deadline, so together they'd show the scheduled window rather than
 * how long the task actually took.
 */
const exportFullDetailPdf = (users, filters) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 40;
    const maxWidth = pageWidth - marginX * 2;
    let y = 50;

    const ensureSpace = (needed) => {
        if (y + needed > pageHeight - 40) {
            doc.addPage();
            y = 50;
        }
    };

    const writeLine = (text, { size = 10, style = "normal", color = "#1f2937", gap = 14, indent = 0 } = {}) => {
        doc.setFont("helvetica", style);
        doc.setFontSize(size);
        doc.setTextColor(color);
        const lines = doc.splitTextToSize(text, maxWidth - indent);
        lines.forEach((line) => {
            ensureSpace(gap);
            doc.text(line, marginX + indent, y);
            y += gap;
        });
    };

    writeLine("Task Report — Full Team Detail", { size: 18, style: "bold", gap: 22 });
    writeLine(`Generated ${new Date().toLocaleString()}`, { size: 9, color: "#6b7280", gap: 16 });

    const filterLine = [
        filters.user ? `Team member: ${filters.user}` : null,
        filters.role && filters.role !== "all" ? `Role: ${filters.role}` : null,
        filters.status && filters.status !== "all" ? `Status: ${filters.status}` : null,
        filters.startDate || filters.endDate
            ? `Date range: ${filters.startDate || "…"} to ${filters.endDate || "…"}`
            : null,
    ]
        .filter(Boolean)
        .join("   |   ");

    if (filterLine) {
        writeLine(filterLine, { size: 9, color: "#6b7280", gap: 16 });
    }

    y += 8;

    users.forEach((user, userIdx) => {
        ensureSpace(50);

        if (userIdx > 0) {
            y += 6;
            doc.setDrawColor("#9ca3af");
            doc.setLineWidth(1);
            doc.line(marginX, y, pageWidth - marginX, y);
            doc.setLineWidth(0.5);
            y += 18;
        }

        const tasks = user.assigned_tasks || [];
        const completed = tasks.filter((t) => t.status === "Completed").length;
        const pending = tasks.length - completed;

        writeLine(`${user.name}`, { size: 14, style: "bold", gap: 18 });
        writeLine(`Role: ${user.role || "—"}`, { size: 9, color: "#6b7280", gap: 14 });
        writeLine(
            `Total tasks: ${tasks.length}   Completed: ${completed}   Pending: ${pending}`,
            { size: 9, style: "bold", gap: 16 },
        );

        y += 4;

        if (tasks.length === 0) {
            writeLine("No tasks in this range.", { size: 9, color: "#9ca3af", gap: 16 });
            return;
        }

        tasks.forEach((task, taskIdx) => {
            ensureSpace(60);

            if (taskIdx > 0) {
                y += 2;
                doc.setDrawColor("#e5e7eb");
                doc.line(marginX + 12, y, pageWidth - marginX, y);
                y += 12;
            }

            const isTaskCompleted = task.status === "Completed";
            const taskDurationSeconds = isTaskCompleted
                ? secondsBetween(task.created_at, task.updated_at)
                : null;

            writeLine(`${taskIdx + 1}. ${task.title}`, {
                size: 11,
                style: "bold",
                gap: 15,
                indent: 12,
            });
            writeLine(`Status: ${task.status}`, {
                size: 9,
                color: "#6b7280",
                gap: 13,
                indent: 12,
            });
            writeLine(
                `Assigned to: ${user.name}    Assigned by: ${task.creator?.name || "—"}`,
                { size: 9, gap: 13, indent: 12 },
            );
            writeLine(
                `Start date: ${task.start_date?.slice(0, 10) || "—"}    Due date: ${task.due_date?.slice(0, 10) || "—"}`,
                { size: 9, gap: isTaskCompleted ? 13 : 15, indent: 12 },
            );

            if (isTaskCompleted) {
                writeLine(`Completed in: ${formatDuration(taskDurationSeconds)}`, {
                    size: 9,
                    style: "bold",
                    color: "#DC2626",
                    gap: 15,
                    indent: 12,
                });
            }

            const items = task.task_items || [];
            if (items.length > 0) {
                writeLine("Task List:", {
                    size: 9,
                    style: "bold",
                    color: "#374151",
                    gap: 13,
                    indent: 12,
                });

                items.forEach((item) => {
                    const isCompleted = item.status === "Completed";
                    const bullet = isCompleted ? "[x]" : "[ ]";
                    let line = `${bullet} ${item.description}`;

                    if (isCompleted) {
                        const takenSeconds = secondsBetween(item.created_at, item.updated_at);
                        line += `  — completed ${item.updated_at?.slice(0, 10) || "—"}, took ${formatItemDuration(takenSeconds)}`;
                    }

                    writeLine(line, {
                        size: 9,
                        color: isCompleted ? "#2F5D50" : "#374151",
                        gap: 13,
                        indent: 24,
                    });
                });
            }

            y += 4;
        });
    });

    doc.save(`task-report-full-detail-${new Date().toISOString().slice(0, 10)}.pdf`);
};

const TaskReport = () => {
    const { auth } = usePage().props;
    const isPrivileged = ["admin", "manager"].includes(auth?.user?.role);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(ALL_USERS_OPTION);

    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const res = await axios.get(route("ourtaskreport.teammembers"));
                setTeamMembers(res.data?.data || []);
            } catch (err) {
                console.log("Error fetching team members", err);
            }
        };

        fetchTeamMembers();
    }, []);

    const userOptions = useMemo(
        () => [
            ALL_USERS_OPTION,
            ...teamMembers.map((u) => ({
                value: u.id,
                label: u.name,
            })),
        ],
        [teamMembers],
    );

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    route("ourtaskreport.index", {
                        user_id: selectedUser?.value || undefined,
                        role: roleFilter !== "all" ? roleFilter : undefined,
                        status: statusFilter !== "all" ? statusFilter : undefined,
                        start_date: startDate || undefined,
                        end_date: endDate || undefined,
                    }),
                );
                setUsers(res.data?.data || []);
            } catch (err) {
                console.log("Error fetching users summary", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [selectedUser, roleFilter, statusFilter, startDate, endDate]);

    const hasActiveFilters =
        (selectedUser && selectedUser.value) ||
        roleFilter !== "all" ||
        statusFilter !== "all" ||
        startDate ||
        endDate;

    const clearFilters = () => {
        setSelectedUser(ALL_USERS_OPTION);
        setRoleFilter("all");
        setStatusFilter("all");
        setStartDate("");
        setEndDate("");
    };

    const roleOptions = useMemo(() => Object.keys(DEPARTMENT_STYLES), []);

    const summary = useMemo(() => {
        return users.reduce(
            (acc, u) => {
                const pending = (u.in_progress_tasks || 0) + (u.pending_tasks || 0);
                acc.members += 1;
                acc.total += u.total_tasks || 0;
                acc.completed += u.completed_tasks || 0;
                acc.pending += pending;
                return acc;
            },
            { members: 0, total: 0, completed: 0, pending: 0 },
        );
    }, [users]);

    /**
     * Fetches full task detail and builds the PDF. When `userIds` is
     * provided (from the "Export a few" step of ExportSelectionModal),
     * it takes priority over the single top-bar `selectedUser` filter —
     * so picking specific people in the modal always wins even if the
     * top dropdown still has someone selected. `userIds` is sent as an
     * array query param (`user_ids[]=..`), which the backend's
     * `usersWithFullTasks()` now understands via `whereIn`.
     */
    const handleExport = async (userIds = null) => {
        setExporting(true);
        try {
            const res = await axios.get(
                route("ourtaskreport.export", {
                    user_id: !userIds && selectedUser?.value ? selectedUser.value : undefined,
                    user_ids: userIds && userIds.length > 0 ? userIds : undefined,
                    role: roleFilter !== "all" ? roleFilter : undefined,
                    status: statusFilter !== "all" ? statusFilter : undefined,
                    start_date: startDate || undefined,
                    end_date: endDate || undefined,
                }),
            );
            const fullUsers = res.data?.data || [];
            exportFullDetailPdf(fullUsers, {
                user:
                    userIds && userIds.length > 0
                        ? `${userIds.length} selected member${userIds.length !== 1 ? "s" : ""}`
                        : selectedUser?.value
                            ? selectedUser.label
                            : null,
                role: roleFilter,
                status: statusFilter,
                startDate,
                endDate,
            });
            setShowExportModal(false);
        } catch (err) {
            console.log("Error exporting full detail PDF", err);
        } finally {
            setExporting(false);
        }
    };

    return (
        <AdminWrapper>
            <div className="bg-[#F3F4F7] -m-6 p-6 h-full overflow-y-auto">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                            Task Report
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Team workload overview — filter, then click a card for
                            the full task history.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowExportModal(true)}
                        disabled={loading || users.length === 0}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#2F5D50] text-white text-sm font-medium hover:bg-[#274d42] disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 shadow-sm"
                    >
                        <Download size={14} />
                        Export PDF
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <SummaryTile
                        icon={Users}
                        label="Team members"
                        value={summary.members}
                        accent="#2F5D50"
                    />
                    <SummaryTile
                        icon={ListChecks}
                        label="Total tasks"
                        value={summary.total}
                        accent="#3B6E91"
                    />
                    <SummaryTile
                        icon={CheckCircle2}
                        label="Completed"
                        value={summary.completed}
                        accent="#DC2626"
                    />
                    <SummaryTile
                        icon={Clock3}
                        label="Pending"
                        value={summary.pending}
                        accent="#16A34A"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-6 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
                    <div className="flex-1 min-w-[220px]">
                        <Select
                            options={userOptions}
                            value={selectedUser}
                            onChange={(option) => setSelectedUser(option || ALL_USERS_OPTION)}
                            styles={userSelectStyles}
                            placeholder="All Users"
                            isClearable={false}
                            isSearchable
                        />
                    </div>

                    {isPrivileged && (
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
                        >
                            <option value="all">All roles</option>
                            {roleOptions.map((r) => (
                                <option key={r} value={r}>
                                    {DEPARTMENT_STYLES[r].label}
                                </option>
                            ))}
                        </select>
                    )}

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

                    <div className="flex items-center gap-1.5">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
                        />
                        <span className="text-gray-300 text-sm">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
                        />
                    </div>

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <UserCardSkeleton key={i} />
                        ))}
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-16 text-center bg-white border border-gray-200 rounded-xl">
                        <Users size={28} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-400 italic">
                            {hasActiveFilters
                                ? "No team members match your filters"
                                : "No team members with tasks yet"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {users.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onClick={(u) => setSelectedUserId(u.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <TaskReportDetailPopup
                userId={selectedUserId}
                onClose={() => setSelectedUserId(null)}
            />

            {showExportModal && (
                <ExportSelectionModal
                    users={users}
                    exporting={exporting}
                    onClose={() => setShowExportModal(false)}
                    onExportAll={() => handleExport(null)}
                    onExportSelected={(ids) => handleExport(ids)}
                />
            )}
        </AdminWrapper>
    );
};

export default TaskReport;


// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";
// import Select from "react-select";
// import { usePage } from "@inertiajs/react";
// import {
//     X,
//     Download,
//     Loader2,
//     Users,
//     ListChecks,
//     CheckCircle2,
//     Clock3,
// } from "lucide-react";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { STATUS_STYLES, DEPARTMENT_STYLES } from "@/PopupComponents/TaskDetailPopup";
// import TaskReportDetailPopup from "./TaskReportDetailPopup";

// const AVATAR_PALETTES = [
//     { bg: "#EAF2EF", text: "#2F5D50" },
//     { bg: "#EFF4FB", text: "#2A5C8A" },
//     { bg: "#FBF0E8", text: "#B5651D" },
//     { bg: "#F3EEFB", text: "#6B46A8" },
//     { bg: "#FCEFF1", text: "#B23A5A" },
// ];

// const getAvatarPalette = (id) => AVATAR_PALETTES[id % AVATAR_PALETTES.length];

// const userSelectStyles = {
//     control: (base, state) => ({
//         ...base,
//         minHeight: "38px",
//         borderRadius: "0.5rem",
//         borderColor: state.isFocused ? "#2F5D50" : "#e5e7eb",
//         boxShadow: state.isFocused ? "0 0 0 2px rgba(47,93,80,0.3)" : "none",
//         "&:hover": { borderColor: state.isFocused ? "#2F5D50" : "#e5e7eb" },
//         fontSize: "0.875rem",
//     }),
//     valueContainer: (base) => ({ ...base, padding: "2px 10px" }),
//     indicatorSeparator: () => ({ display: "none" }),
//     menu: (base) => ({ ...base, fontSize: "0.875rem", zIndex: 20 }),
//     option: (base, state) => ({
//         ...base,
//         backgroundColor: state.isSelected
//             ? "#2F5D50"
//             : state.isFocused
//                 ? "#EAF2EF"
//                 : "white",
//         color: state.isSelected ? "white" : "#111827",
//         cursor: "pointer",
//     }),
//     placeholder: (base) => ({ ...base, color: "#9ca3af" }),
//     singleValue: (base) => ({ ...base, color: "#374151" }),
// };

// const ALL_USERS_OPTION = { value: null, label: "All Users" };

// const SummaryTile = ({ icon: Icon, label, value, accent }) => (
//     <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
//         <span
//             className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
//             style={{ backgroundColor: `${accent}15` }}
//         >
//             <Icon size={18} style={{ color: accent }} />
//         </span>
//         <div className="min-w-0">
//             <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
//             <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
//                 {label}
//             </p>
//         </div>
//     </div>
// );

// const UserCard = ({ user, onClick }) => {
//     const palette = getAvatarPalette(user.id);
//     const initials = (user.name || "")
//         .split(" ")
//         .map((n) => n[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase();

//     const pendingCount = (user.in_progress_tasks || 0) + (user.pending_tasks || 0);
//     const total = user.total_tasks || 0;
//     const completionPct = total > 0 ? Math.round((user.completed_tasks / total) * 100) : 0;

//     return (
//         <button
//             type="button"
//             onClick={() => onClick(user)}
//             className="group text-left bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#2F5D50]/30 hover:-translate-y-0.5 transition-all duration-150"
//         >
//             <div className="flex items-center gap-3 mb-3.5">
//                 <span
//                     className="w-11 h-11 rounded-full font-bold flex items-center justify-center text-sm shrink-0"
//                     style={{ backgroundColor: palette.bg, color: palette.text }}
//                 >
//                     {initials}
//                 </span>
//                 <div className="min-w-0 flex-1">
//                     <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#2F5D50] transition-colors">
//                         {user.name}
//                     </p>
//                     <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
//                         {user.role}
//                     </p>
//                 </div>
//             </div>

//             <div className="mb-3.5">
//                 <div className="flex items-center justify-between mb-1">
//                     <span className="text-[10px] text-gray-400 uppercase tracking-wider">
//                         Completion
//                     </span>
//                     <span className="text-[11px] font-semibold text-gray-600">
//                         {completionPct}%
//                     </span>
//                 </div>
//                 <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
//                     <div
//                         className="h-full rounded-full transition-all duration-300"
//                         style={{
//                             width: `${completionPct}%`,
//                             backgroundColor:
//                                 completionPct === 100
//                                     ? "#16A34A"
//                                     : completionPct > 0
//                                         ? "#2F5D50"
//                                         : "#E5E7EB",
//                         }}
//                     />
//                 </div>
//             </div>

//             <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
//                 <div className="text-center">
//                     <p className="text-base font-bold text-gray-900">{total}</p>
//                     <p className="text-[10px] text-gray-400 uppercase tracking-wider">
//                         Total
//                     </p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-base font-bold text-[#DC2626]">
//                         {user.completed_tasks}
//                     </p>
//                     <p className="text-[10px] text-gray-400 uppercase tracking-wider">
//                         Done
//                     </p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-base font-bold text-[#16A34A]">
//                         {pendingCount}
//                     </p>
//                     <p className="text-[10px] text-gray-400 uppercase tracking-wider">
//                         Pending
//                     </p>
//                 </div>
//             </div>
//         </button>
//     );
// };

// const UserCardSkeleton = () => (
//     <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse">
//         <div className="flex items-center gap-3 mb-3.5">
//             <span className="w-11 h-11 rounded-full bg-gray-100 shrink-0" />
//             <div className="min-w-0 flex-1 space-y-1.5">
//                 <div className="h-3.5 w-2/3 bg-gray-100 rounded" />
//                 <div className="h-2.5 w-1/3 bg-gray-100 rounded" />
//             </div>
//         </div>
//         <div className="mb-3.5">
//             <div className="h-1.5 w-full bg-gray-100 rounded-full" />
//         </div>
//         <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
//             {[0, 1, 2].map((i) => (
//                 <div key={i} className="text-center space-y-1">
//                     <div className="h-4 w-6 bg-gray-100 rounded mx-auto" />
//                     <div className="h-2 w-8 bg-gray-100 rounded mx-auto" />
//                 </div>
//             ))}
//         </div>
//     </div>
// );

// const secondsBetween = (start, end) => {
//     if (!start) return null;
//     const startMs = new Date(start).getTime();
//     const endMs = end ? new Date(end).getTime() : Date.now();
//     return Math.max(0, Math.floor((endMs - startMs) / 1000));
// };

// const formatDuration = (totalSeconds) => {
//     if (totalSeconds == null || totalSeconds < 0) return "—";
//     const days = Math.floor(totalSeconds / 86400);
//     const hours = Math.floor((totalSeconds % 86400) / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     if (days > 0) return `${days}d ${hours}h`;
//     if (hours > 0) return `${hours}h ${minutes}m`;
//     if (minutes > 0) return `${minutes}m`;
//     return "just now";
// };

// const formatItemDuration = (totalSeconds) => {
//     if (totalSeconds == null || totalSeconds < 0) return "—";
//     if (totalSeconds < 60) return `${totalSeconds} sec`;

//     const days = Math.floor(totalSeconds / 86400);
//     const hours = Math.floor((totalSeconds % 86400) / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);

//     if (days > 0) {
//         const dayLabel = `${days} day${days !== 1 ? "s" : ""}`;
//         return hours > 0 ? `${dayLabel} ${hours} hr` : dayLabel;
//     }
//     if (hours > 0) {
//         const hourLabel = `${hours} hr`;
//         return minutes > 0 ? `${hourLabel} ${minutes} min` : hourLabel;
//     }
//     return `${minutes} min`;
// };

// /**
//  * Builds and downloads a PDF containing every detail the model provides
//  * for every filtered team member. Duration is created_at -> updated_at
//  * (the moment the task row was created, to the moment it was saved as
//  * Completed) — not start_date -> due_date. start_date has no
//  * time-of-day (stored as midnight) and due_date is just the target
//  * deadline, so together they'd show the scheduled window rather than
//  * how long the task actually took.
//  */
// const exportFullDetailPdf = (users, filters) => {
//     const doc = new jsPDF({ unit: "pt", format: "a4" });
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const marginX = 40;
//     const maxWidth = pageWidth - marginX * 2;
//     let y = 50;

//     const ensureSpace = (needed) => {
//         if (y + needed > pageHeight - 40) {
//             doc.addPage();
//             y = 50;
//         }
//     };

//     const writeLine = (text, { size = 10, style = "normal", color = "#1f2937", gap = 14, indent = 0 } = {}) => {
//         doc.setFont("helvetica", style);
//         doc.setFontSize(size);
//         doc.setTextColor(color);
//         const lines = doc.splitTextToSize(text, maxWidth - indent);
//         lines.forEach((line) => {
//             ensureSpace(gap);
//             doc.text(line, marginX + indent, y);
//             y += gap;
//         });
//     };

//     writeLine("Task Report — Full Team Detail", { size: 18, style: "bold", gap: 22 });
//     writeLine(`Generated ${new Date().toLocaleString()}`, { size: 9, color: "#6b7280", gap: 16 });

//     const filterLine = [
//         filters.user ? `Team member: ${filters.user}` : null,
//         filters.role && filters.role !== "all" ? `Role: ${filters.role}` : null,
//         filters.status && filters.status !== "all" ? `Status: ${filters.status}` : null,
//         filters.startDate || filters.endDate
//             ? `Date range: ${filters.startDate || "…"} to ${filters.endDate || "…"}`
//             : null,
//     ]
//         .filter(Boolean)
//         .join("   |   ");

//     if (filterLine) {
//         writeLine(filterLine, { size: 9, color: "#6b7280", gap: 16 });
//     }

//     y += 8;

//     users.forEach((user, userIdx) => {
//         ensureSpace(50);

//         if (userIdx > 0) {
//             y += 6;
//             doc.setDrawColor("#9ca3af");
//             doc.setLineWidth(1);
//             doc.line(marginX, y, pageWidth - marginX, y);
//             doc.setLineWidth(0.5);
//             y += 18;
//         }

//         const tasks = user.assigned_tasks || [];
//         const completed = tasks.filter((t) => t.status === "Completed").length;
//         const pending = tasks.length - completed;

//         writeLine(`${user.name}`, { size: 14, style: "bold", gap: 18 });
//         writeLine(`Role: ${user.role || "—"}`, { size: 9, color: "#6b7280", gap: 14 });
//         writeLine(
//             `Total tasks: ${tasks.length}   Completed: ${completed}   Pending: ${pending}`,
//             { size: 9, style: "bold", gap: 16 },
//         );

//         y += 4;

//         if (tasks.length === 0) {
//             writeLine("No tasks in this range.", { size: 9, color: "#9ca3af", gap: 16 });
//             return;
//         }

//         tasks.forEach((task, taskIdx) => {
//             ensureSpace(60);

//             if (taskIdx > 0) {
//                 y += 2;
//                 doc.setDrawColor("#e5e7eb");
//                 doc.line(marginX + 12, y, pageWidth - marginX, y);
//                 y += 12;
//             }

//             const isTaskCompleted = task.status === "Completed";
//             const taskDurationSeconds = isTaskCompleted
//                 ? secondsBetween(task.created_at, task.updated_at)
//                 : null;

//             writeLine(`${taskIdx + 1}. ${task.title}`, {
//                 size: 11,
//                 style: "bold",
//                 gap: 15,
//                 indent: 12,
//             });
//             writeLine(`Status: ${task.status}`, {
//                 size: 9,
//                 color: "#6b7280",
//                 gap: 13,
//                 indent: 12,
//             });
//             writeLine(
//                 `Assigned to: ${user.name}    Assigned by: ${task.creator?.name || "—"}`,
//                 { size: 9, gap: 13, indent: 12 },
//             );
//             writeLine(
//                 `Start date: ${task.start_date?.slice(0, 10) || "—"}    Due date: ${task.due_date?.slice(0, 10) || "—"}`,
//                 { size: 9, gap: isTaskCompleted ? 13 : 15, indent: 12 },
//             );

//             if (isTaskCompleted) {
//                 writeLine(`Completed in: ${formatDuration(taskDurationSeconds)}`, {
//                     size: 9,
//                     style: "bold",
//                     color: "#DC2626",
//                     gap: 15,
//                     indent: 12,
//                 });
//             }

//             const items = task.task_items || [];
//             if (items.length > 0) {
//                 writeLine("Task List:", {
//                     size: 9,
//                     style: "bold",
//                     color: "#374151",
//                     gap: 13,
//                     indent: 12,
//                 });

//                 items.forEach((item) => {
//                     const isCompleted = item.status === "Completed";
//                     const bullet = isCompleted ? "[x]" : "[ ]";
//                     let line = `${bullet} ${item.description}`;

//                     if (isCompleted) {
//                         const takenSeconds = secondsBetween(item.created_at, item.updated_at);
//                         line += `  — completed ${item.updated_at?.slice(0, 10) || "—"}, took ${formatItemDuration(takenSeconds)}`;
//                     }

//                     writeLine(line, {
//                         size: 9,
//                         color: isCompleted ? "#2F5D50" : "#374151",
//                         gap: 13,
//                         indent: 24,
//                     });
//                 });
//             }

//             y += 4;
//         });
//     });

//     doc.save(`task-report-full-detail-${new Date().toISOString().slice(0, 10)}.pdf`);
// };

// const TaskReport = () => {
//     const { auth } = usePage().props;
//     const isPrivileged = ["admin", "manager"].includes(auth?.user?.role);

//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedUserId, setSelectedUserId] = useState(null);
//     const [exporting, setExporting] = useState(false);

//     const [teamMembers, setTeamMembers] = useState([]);
//     const [selectedUser, setSelectedUser] = useState(ALL_USERS_OPTION);

//     const [roleFilter, setRoleFilter] = useState("all");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");

//     useEffect(() => {
//         const fetchTeamMembers = async () => {
//             try {
//                 const res = await axios.get(route("ourtaskreport.teammembers"));
//                 setTeamMembers(res.data?.data || []);
//             } catch (err) {
//                 console.log("Error fetching team members", err);
//             }
//         };

//         fetchTeamMembers();
//     }, []);

//     const userOptions = useMemo(
//         () => [
//             ALL_USERS_OPTION,
//             ...teamMembers.map((u) => ({
//                 value: u.id,
//                 label: u.name,
//             })),
//         ],
//         [teamMembers],
//     );

//     useEffect(() => {
//         const fetchUsers = async () => {
//             setLoading(true);
//             try {
//                 const res = await axios.get(
//                     route("ourtaskreport.index", {
//                         user_id: selectedUser?.value || undefined,
//                         role: roleFilter !== "all" ? roleFilter : undefined,
//                         status: statusFilter !== "all" ? statusFilter : undefined,
//                         start_date: startDate || undefined,
//                         end_date: endDate || undefined,
//                     }),
//                 );
//                 setUsers(res.data?.data || []);
//             } catch (err) {
//                 console.log("Error fetching users summary", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUsers();
//     }, [selectedUser, roleFilter, statusFilter, startDate, endDate]);

//     const hasActiveFilters =
//         (selectedUser && selectedUser.value) ||
//         roleFilter !== "all" ||
//         statusFilter !== "all" ||
//         startDate ||
//         endDate;

//     const clearFilters = () => {
//         setSelectedUser(ALL_USERS_OPTION);
//         setRoleFilter("all");
//         setStatusFilter("all");
//         setStartDate("");
//         setEndDate("");
//     };

//     const roleOptions = useMemo(() => Object.keys(DEPARTMENT_STYLES), []);

//     const summary = useMemo(() => {
//         return users.reduce(
//             (acc, u) => {
//                 const pending = (u.in_progress_tasks || 0) + (u.pending_tasks || 0);
//                 acc.members += 1;
//                 acc.total += u.total_tasks || 0;
//                 acc.completed += u.completed_tasks || 0;
//                 acc.pending += pending;
//                 return acc;
//             },
//             { members: 0, total: 0, completed: 0, pending: 0 },
//         );
//     }, [users]);

//     const handleExportAll = async () => {
//         setExporting(true);
//         try {
//             const res = await axios.get(
//                 route("ourtaskreport.export", {
//                     user_id: selectedUser?.value || undefined,
//                     role: roleFilter !== "all" ? roleFilter : undefined,
//                     status: statusFilter !== "all" ? statusFilter : undefined,
//                     start_date: startDate || undefined,
//                     end_date: endDate || undefined,
//                 }),
//             );
//             const fullUsers = res.data?.data || [];
//             exportFullDetailPdf(fullUsers, {
//                 user: selectedUser?.value ? selectedUser.label : null,
//                 role: roleFilter,
//                 status: statusFilter,
//                 startDate,
//                 endDate,
//             });
//         } catch (err) {
//             console.log("Error exporting full detail PDF", err);
//         } finally {
//             setExporting(false);
//         }
//     };

//     return (
//         <AdminWrapper>
//             <div className="bg-[#F3F4F7] -m-6 p-6 h-full overflow-y-auto">
//                 <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                             Task Report
//                         </h1>
//                         <p className="text-sm text-gray-500 mt-1">
//                             Team workload overview — filter, then click a card for
//                             the full task history.
//                         </p>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={handleExportAll}
//                         disabled={loading || exporting || users.length === 0}
//                         className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#2F5D50] text-white text-sm font-medium hover:bg-[#274d42] disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 shadow-sm"
//                     >
//                         {exporting ? (
//                             <Loader2 size={14} className="animate-spin" />
//                         ) : (
//                             <Download size={14} />
//                         )}
//                         {exporting ? "Preparing…" : "Export PDF"}
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//                     <SummaryTile
//                         icon={Users}
//                         label="Team members"
//                         value={summary.members}
//                         accent="#2F5D50"
//                     />
//                     <SummaryTile
//                         icon={ListChecks}
//                         label="Total tasks"
//                         value={summary.total}
//                         accent="#3B6E91"
//                     />
//                     <SummaryTile
//                         icon={CheckCircle2}
//                         label="Completed"
//                         value={summary.completed}
//                         accent="#DC2626"
//                     />
//                     <SummaryTile
//                         icon={Clock3}
//                         label="Pending"
//                         value={summary.pending}
//                         accent="#16A34A"
//                     />
//                 </div>

//                 <div className="flex flex-wrap items-center gap-2 mb-6 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
//                     <div className="flex-1 min-w-[220px]">
//                         <Select
//                             options={userOptions}
//                             value={selectedUser}
//                             onChange={(option) => setSelectedUser(option || ALL_USERS_OPTION)}
//                             styles={userSelectStyles}
//                             placeholder="All Users"
//                             isClearable={false}
//                             isSearchable
//                         />
//                     </div>

//                     {isPrivileged && (
//                         <select
//                             value={roleFilter}
//                             onChange={(e) => setRoleFilter(e.target.value)}
//                             className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         >
//                             <option value="all">All roles</option>
//                             {roleOptions.map((r) => (
//                                 <option key={r} value={r}>
//                                     {DEPARTMENT_STYLES[r].label}
//                                 </option>
//                             ))}
//                         </select>
//                     )}

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

//                     <div className="flex items-center gap-1.5">
//                         <input
//                             type="date"
//                             value={startDate}
//                             onChange={(e) => setStartDate(e.target.value)}
//                             className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         />
//                         <span className="text-gray-300 text-sm">to</span>
//                         <input
//                             type="date"
//                             value={endDate}
//                             onChange={(e) => setEndDate(e.target.value)}
//                             className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30"
//                         />
//                     </div>

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
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                         {Array.from({ length: 8 }).map((_, i) => (
//                             <UserCardSkeleton key={i} />
//                         ))}
//                     </div>
//                 ) : users.length === 0 ? (
//                     <div className="py-16 text-center bg-white border border-gray-200 rounded-xl">
//                         <Users size={28} className="mx-auto text-gray-300 mb-2" />
//                         <p className="text-sm text-gray-400 italic">
//                             {hasActiveFilters
//                                 ? "No team members match your filters"
//                                 : "No team members with tasks yet"}
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                         {users.map((user) => (
//                             <UserCard
//                                 key={user.id}
//                                 user={user}
//                                 onClick={(u) => setSelectedUserId(u.id)}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>

//             <TaskReportDetailPopup
//                 userId={selectedUserId}
//                 onClose={() => setSelectedUserId(null)}
//             />
//         </AdminWrapper>
//     );
// };

// export default TaskReport;