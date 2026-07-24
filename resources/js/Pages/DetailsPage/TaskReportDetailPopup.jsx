// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     X,
//     CheckCircle2,
//     Circle,
//     ListChecks,
//     User,
//     TrendingUp,
//     ChevronDown,
//     ChevronUp,
//     Timer,
// } from "lucide-react";
// import { getDeptStyle } from "@/PopupComponents/TaskDetailPopup";

// // ── Duration helpers (kept local to this popup — no shared utils file) ─────

// const secondsBetween = (start, end) => {
//     if (!start) return null;
//     const startMs = new Date(start).getTime();
//     const endMs = end ? new Date(end).getTime() : Date.now();
//     return Math.max(0, Math.floor((endMs - startMs) / 1000));
// };

// // Task-level duration (unchanged) — used for the top duration card and
// // the "average time to complete" line, where second-level precision
// // doesn't matter.
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

// // Checklist-item duration — finer-grained, since an item can be checked
// // off seconds after it was created. Always shows a concrete unit instead
// // of collapsing everything under a minute into "just now":
// // "0 sec", "45 sec", "1 hr", "3 hr 20 min", "1 day", "2 days 4 hr".
// const formatItemDuration = (totalSeconds) => {
//     if (totalSeconds == null || totalSeconds < 0) return "—";

//     if (totalSeconds < 60) {
//         return `${totalSeconds} sec`;
//     }

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

// // Task-status dot color for this popup specifically — intentionally
// // overrides the shared STATUS_STYLES coloring: Completed shows red,
// // Pending / In Progress show green.
// const STATUS_DOT_COLOR = {
//     Completed: "#DC2626",
//     Pending: "#16A34A",
//     "In Progress": "#16A34A",
// };

// const getStatusDotColor = (status) => STATUS_DOT_COLOR[status] || "#CBD5E1";

// const StatBlock = ({ label, value, accent }) => (
//     <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-center">
//         <p className="text-lg font-bold" style={{ color: accent || "#1f2937" }}>
//             {value}
//         </p>
//         <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mt-0.5">
//             {label}
//         </p>
//     </div>
// );

// const DetailRow = ({ label, value }) => (
//     <div>
//         <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">
//             {label}
//         </p>
//         <p className="text-xs text-gray-800">{value || "—"}</p>
//     </div>
// );

// /**
//  * One checklist (TaskItem) row, redesigned as a small card rather than a
//  * plain divided list row:
//  * - Pending: description only, dashed/muted card.
//  * - Completed: description (struck through) + a duration pill showing
//  *   how long it took (item.created_at -> item.updated_at) + the
//  *   completion date, in a solid green-tinted card.
//  */
// const ChecklistItemRow = ({ item }) => {
//     const isCompleted = item.status === "Completed";
//     const takenSeconds = isCompleted
//         ? secondsBetween(item.created_at, item.updated_at)
//         : null;

//     return (
//         <div
//             className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${
//                 isCompleted
//                     ? "bg-[#F3F8F6] border-[#D9E9E3]"
//                     : "bg-gray-50 border-gray-200 border-dashed"
//             }`}
//         >
//             <div className="flex items-center gap-2.5 min-w-0">
//                 {isCompleted ? (
//                     <CheckCircle2
//                         size={17}
//                         className="text-[#2F5D50] shrink-0"
//                     />
//                 ) : (
//                     <Circle size={17} className="text-gray-300 shrink-0" />
//                 )}
//                 <span
//                     className={`text-sm truncate ${
//                         isCompleted
//                             ? "text-gray-500 line-through"
//                             : "text-gray-700"
//                     }`}
//                 >
//                     {item.description}
//                 </span>
//             </div>

//             {isCompleted && (
//                 <div className="flex items-center gap-1.5 shrink-0">
//                     <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2F5D50] bg-white border border-[#D9E9E3] px-2 py-1 rounded-full whitespace-nowrap">
//                         <Timer size={10} />
//                         {formatItemDuration(takenSeconds)}
//                     </span>
//                     <span className="text-[10px] text-gray-400 whitespace-nowrap">
//                         {item.updated_at?.slice(0, 10)}
//                     </span>
//                 </div>
//             )}
//         </div>
//     );
// };

// /**
//  * One task card inside the popup. Collapsed by default — clicking the
//  * header (or the chevron) toggles open/closed to reveal assigned
//  * to/by, start/due dates, and the checklist. Description is
//  * intentionally never rendered, expanded or not.
//  */
// const UserTaskCard = ({ task }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const dept = getDeptStyle(task.department);
//     const items = task.task_items || [];
//     const completedCount = items.filter((i) => i.status === "Completed").length;

//     return (
//         <div
//             className="rounded-lg border border-gray-200 overflow-hidden"
//             style={{ borderLeft: `4px solid ${dept.bar}` }}
//         >
//             <button
//                 type="button"
//                 onClick={() => setIsOpen((prev) => !prev)}
//                 className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
//             >
//                 <p className="text-sm font-semibold text-gray-900 truncate">
//                     {task.title}
//                 </p>
//                 <div className="flex items-center gap-3 shrink-0">
//                     <span className="flex items-center gap-1.5 text-xs text-gray-500">
//                         <span
//                             className="w-1.5 h-1.5 rounded-full"
//                             style={{
//                                 backgroundColor: getStatusDotColor(task.status),
//                             }}
//                         />
//                         {task.status}
//                     </span>
//                     {isOpen ? (
//                         <ChevronUp size={16} className="text-gray-400" />
//                     ) : (
//                         <ChevronDown size={16} className="text-gray-400" />
//                     )}
//                 </div>
//             </button>

//             {isOpen && (
//                 <div className="px-4 pb-4">
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
//                         <DetailRow
//                             label="Assigned to"
//                             value={task.assigned_user?.name}
//                         />
//                         <DetailRow label="Assigned by" value={task.creator?.name} />
//                         <DetailRow
//                             label="Start date"
//                             value={task.start_date?.slice(0, 10)}
//                         />
//                         <DetailRow
//                             label="Due date"
//                             value={task.due_date?.slice(0, 10)}
//                         />
//                     </div>

//                     {items.length > 0 && (
//                         <div className="border-t pt-3">
//                             <div className="flex items-center justify-between mb-2">
//                                 <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
//                                     <ListChecks size={11} /> Checklist
//                                 </p>
//                                 <span className="text-[10px] text-gray-400">
//                                     {completedCount}/{items.length} done
//                                 </span>
//                             </div>
//                             <div className="space-y-1.5">
//                                 {items.map((item, i) => (
//                                     <ChecklistItemRow key={item.id ?? i} item={item} />
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// /**
//  * Workload popup for the Task Report page. Opened by clicking a user
//  * card; fetches every task assigned to that user (with checklist items,
//  * assignee, creator) plus their aggregate stats, and lists it all here.
//  */
// const TaskReportDetailPopup = ({ userId, onClose }) => {
//     const [user, setUser] = useState(null);
//     const [tasks, setTasks] = useState([]);
//     const [stats, setStats] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         if (!userId) return;

//         let cancelled = false;
//         setLoading(true);
//         setError("");

//         axios
//             .get(route("ourtaskreport.usertasks", { userId }))
//             .then((res) => {
//                 if (cancelled) return;
//                 const data = res.data?.data || [];
//                 setTasks(data);
//                 setStats(res.data?.stats || null);
//                 setUser(data[0]?.assigned_user || null);
//             })
//             .catch((err) => {
//                 console.log("Failed to load user tasks", err);
//                 if (!cancelled) setError("Couldn't load this user's tasks.");
//             })
//             .finally(() => {
//                 if (!cancelled) setLoading(false);
//             });

//         return () => {
//             cancelled = true;
//         };
//     }, [userId]);

//     // Lock background scroll while open, same pattern used elsewhere.
//     useEffect(() => {
//         if (!userId) return;
//         const scrollY = window.scrollY;
//         const prev = document.body.style.overflow;
//         document.body.style.overflow = "hidden";
//         return () => {
//             document.body.style.overflow = prev;
//             window.scrollTo(0, scrollY);
//         };
//     }, [userId]);

//     if (!userId) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-3xl w-full shadow-xl max-h-[90vh] flex flex-col">
//                 <div className="flex justify-between items-center px-6 py-4 border-b">
//                     <div className="flex items-center gap-2">
//                         <User size={16} className="text-gray-400" />
//                         <h2 className="text-lg font-bold text-gray-900">
//                             {user?.name || "User"}'s workload
//                         </h2>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
//                     >
//                         <X size={20} />
//                     </button>
//                 </div>

//                 <div className="overflow-y-auto px-6 py-5 space-y-4">
//                     {loading ? (
//                         <div className="text-center text-gray-400 py-10">
//                             Loading tasks…
//                         </div>
//                     ) : error ? (
//                         <div className="text-center text-red-500 py-10 text-sm">
//                             {error}
//                         </div>
//                     ) : (
//                         <>
//                             {stats && (
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <StatBlock
//                                         label="Total tasks"
//                                         value={stats.total_tasks}
//                                     />
//                                     <StatBlock
//                                         label="Completed"
//                                         value={stats.completed}
//                                         accent="#DC2626"
//                                     />
//                                     <StatBlock
//                                         label="Open"
//                                         value={stats.in_progress + stats.pending}
//                                         accent="#16A34A"
//                                     />
//                                 </div>
//                             )}

//                             {stats?.avg_completion_seconds != null && (
//                                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                                     <TrendingUp size={13} />
//                                     Averages{" "}
//                                     <span className="font-semibold text-gray-700">
//                                         {formatDuration(stats.avg_completion_seconds)}
//                                     </span>{" "}
//                                     to complete a task
//                                 </div>
//                             )}

//                             {tasks.length === 0 ? (
//                                 <p className="text-sm text-gray-400 italic text-center py-6">
//                                     No tasks yet
//                                 </p>
//                             ) : (
//                                 <div className="space-y-3">
//                                     {tasks.map((task) => (
//                                         <UserTaskCard key={task.id} task={task} />
//                                     ))}
//                                 </div>
//                             )}
//                         </>
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
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TaskReportDetailPopup;


import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import {
    X,
    CheckCircle2,
    Circle,
    ListChecks,
    User,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    Timer,
    Download,
    Clock,
} from "lucide-react";
import { getDeptStyle } from "@/PopupComponents/TaskDetailPopup";

// ── Duration helpers (kept local to this popup — no shared utils file) ─────

const secondsBetween = (start, end) => {
    if (!start) return null;
    const startMs = new Date(start).getTime();
    const endMs = end ? new Date(end).getTime() : Date.now();
    return Math.max(0, Math.floor((endMs - startMs) / 1000));
};

// Task-level duration — used for the top duration card, the "average
// time to complete" line, and the completed-task duration shown
// on each task card (start_date -> due_date).
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

// Checklist-item duration — finer-grained, since an item can be checked
// off seconds after it was created. Always shows a concrete unit instead
// of collapsing everything under a minute into "just now":
// "0 sec", "45 sec", "1 hr", "3 hr 20 min", "1 day", "2 days 4 hr".
const formatItemDuration = (totalSeconds) => {
    if (totalSeconds == null || totalSeconds < 0) return "—";

    if (totalSeconds < 60) {
        return `${totalSeconds} sec`;
    }

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

// Task-status dot color for this popup specifically — intentionally
// overrides the shared STATUS_STYLES coloring: Completed shows red,
// Pending / In Progress show green.
const STATUS_DOT_COLOR = {
    Completed: "#DC2626",
    Pending: "#16A34A",
    "In Progress": "#16A34A",
};

const getStatusDotColor = (status) => STATUS_DOT_COLOR[status] || "#CBD5E1";

const StatBlock = ({ label, value, accent }) => (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-center">
        <p className="text-lg font-bold" style={{ color: accent || "#1f2937" }}>
            {value}
        </p>
        <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mt-0.5">
            {label}
        </p>
    </div>
);

const DetailRow = ({ label, value }) => (
    <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">
            {label}
        </p>
        <p className="text-xs text-gray-800">{value || "—"}</p>
    </div>
);

/**
 * One TaskList item (TaskItem) row, shown as a small card:
 * - Pending: description only, dashed/muted card.
 * - Completed: description (struck through) + a duration pill showing
 *   how long it took (item.created_at -> item.updated_at, since
 *   updated_at is only bumped by the backend when description/status
 *   actually changes — i.e. it reflects the real completion moment) +
 *   the completion date.
 */
const TaskListItemRow = ({ item }) => {
    const isCompleted = item.status === "Completed";
    const takenSeconds = isCompleted
        ? secondsBetween(item.created_at, item.updated_at)
        : null;

    return (
        <div
            className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${
                isCompleted
                    ? "bg-[#F3F8F6] border-[#D9E9E3]"
                    : "bg-gray-50 border-gray-200 border-dashed"
            }`}
        >
            <div className="flex items-center gap-2.5 min-w-0">
                {isCompleted ? (
                    <CheckCircle2
                        size={17}
                        className="text-[#2F5D50] shrink-0"
                    />
                ) : (
                    <Circle size={17} className="text-gray-300 shrink-0" />
                )}
                <span
                    className={`text-sm truncate ${
                        isCompleted
                            ? "text-gray-500 line-through"
                            : "text-gray-700"
                    }`}
                >
                    {item.description}
                </span>
            </div>

            {isCompleted && (
                <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2F5D50] bg-white border border-[#D9E9E3] px-2 py-1 rounded-full whitespace-nowrap">
                        <Timer size={10} />
                        {formatItemDuration(takenSeconds)}
                    </span>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {item.updated_at?.slice(0, 10)}
                    </span>
                </div>
            )}
        </div>
    );
};

/**
 * One task card inside the popup. Collapsed by default — clicking the
 * header (or the chevron) toggles open/closed to reveal assigned
 * to/by, start/due dates, and the task list. Description is
 * intentionally never rendered, expanded or not.
 *
 * When the task itself is Completed, a duration badge shows how long
 * it took overall (start_date -> due_date, the task's own completion
 * reference — same convention used across this feature).
 */
const UserTaskCard = ({ task }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dept = getDeptStyle(task.department);
    const items = task.task_items || [];
    const completedCount = items.filter((i) => i.status === "Completed").length;

    const isTaskCompleted = task.status === "Completed";
    const taskDurationSeconds = isTaskCompleted
        ? secondsBetween(task.start_date, task.due_date)
        : null;

    return (
        <div
            className="rounded-lg border border-gray-200 overflow-hidden"
            style={{ borderLeft: `4px solid ${dept.bar}` }}
        >
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
                <p className="text-sm font-semibold text-gray-900 truncate">
                    {task.title}
                </p>
                <div className="flex items-center gap-3 shrink-0">
                    {isTaskCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#DC2626] bg-red-50 border border-red-100 px-2 py-1 rounded-full whitespace-nowrap">
                            <Clock size={10} />
                            {formatDuration(taskDurationSeconds)}
                        </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                                backgroundColor: getStatusDotColor(task.status),
                            }}
                        />
                        {task.status}
                    </span>
                    {isOpen ? (
                        <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <DetailRow
                            label="Assigned to"
                            value={task.assigned_user?.name}
                        />
                        <DetailRow label="Assigned by" value={task.creator?.name} />
                        <DetailRow
                            label="Start date"
                            value={task.start_date?.slice(0, 10)}
                        />
                        <DetailRow
                            label="Due date"
                            value={task.due_date?.slice(0, 10)}
                        />
                    </div>

                    {isTaskCompleted && (
                        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 flex items-center gap-2">
                            <Clock size={14} className="text-[#DC2626]" />
                            <p className="text-xs text-[#DC2626]">
                                Took{" "}
                                <span className="font-semibold">
                                    {formatDuration(taskDurationSeconds)}
                                </span>{" "}
                                to complete (start date → due date)
                            </p>
                        </div>
                    )}

                    {items.length > 0 && (
                        <div className="border-t pt-3">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                    <ListChecks size={11} /> Task List
                                </p>
                                <span className="text-[10px] text-gray-400">
                                    {completedCount}/{items.length} done
                                </span>
                            </div>
                            <div className="space-y-1.5">
                                {items.map((item, i) => (
                                    <TaskListItemRow key={item.id ?? i} item={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * Builds and downloads a plain-text PDF report of one user's entire
 * workload: aggregate stats, then every task with its assigned to/by,
 * start/due dates, completed-task duration, and full task list (each
 * item's completion date + time taken, using created_at -> updated_at).
 * Handles pagination manually since only `jspdf` (no autotable plugin)
 * is installed.
 */
const exportWorkloadPdf = (user, stats, tasks) => {
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

    const writeLine = (text, { size = 10, style = "normal", color = "#1f2937", gap = 14 } = {}) => {
        ensureSpace(gap + 4);
        doc.setFont("helvetica", style);
        doc.setFontSize(size);
        doc.setTextColor(color);
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line) => {
            ensureSpace(gap);
            doc.text(line, marginX, y);
            y += gap;
        });
    };

    // Header
    writeLine(`${user?.name || "User"}'s Workload Report`, {
        size: 18,
        style: "bold",
        gap: 22,
    });
    writeLine(`Generated ${new Date().toLocaleString()}`, {
        size: 9,
        color: "#6b7280",
        gap: 18,
    });

    // Stats summary
    if (stats) {
        const pendingCount = (stats.in_progress || 0) + (stats.pending || 0);
        y += 6;
        writeLine(
            `Total tasks: ${stats.total_tasks}   |   Completed: ${stats.completed}   |   Pending: ${pendingCount}`,
            { size: 10, style: "bold", gap: 16 },
        );
        if (stats.avg_completion_seconds != null) {
            writeLine(
                `Average time to complete a task: ${formatDuration(stats.avg_completion_seconds)}`,
                { size: 9, color: "#6b7280", gap: 16 },
            );
        }
    }

    y += 10;

    tasks.forEach((task, idx) => {
        ensureSpace(60);

        // Divider between tasks
        if (idx > 0) {
            y += 4;
            doc.setDrawColor("#e5e7eb");
            doc.line(marginX, y, pageWidth - marginX, y);
            y += 14;
        }

        const isTaskCompleted = task.status === "Completed";
        const taskDurationSeconds = isTaskCompleted
            ? secondsBetween(task.start_date, task.due_date)
            : null;

        writeLine(`${idx + 1}. ${task.title}`, { size: 12, style: "bold", gap: 16 });
        writeLine(`Status: ${task.status}`, { size: 9, color: "#6b7280", gap: 14 });
        writeLine(
            `Assigned to: ${task.assigned_user?.name || "—"}    Assigned by: ${task.creator?.name || "—"}`,
            { size: 9, gap: 14 },
        );
        writeLine(
            `Start date: ${task.start_date?.slice(0, 10) || "—"}    Due date: ${task.due_date?.slice(0, 10) || "—"}`,
            { size: 9, gap: 16 },
        );

        if (isTaskCompleted) {
            writeLine(
                `Completed in: ${formatDuration(taskDurationSeconds)}`,
                { size: 9, style: "bold", color: "#DC2626", gap: 16 },
            );
        }

        const items = task.task_items || [];
        if (items.length > 0) {
            writeLine("Task List:", { size: 9, style: "bold", color: "#374151", gap: 14 });

            items.forEach((item) => {
                const isCompleted = item.status === "Completed";
                const bullet = isCompleted ? "[x]" : "[ ]";
                let line = `  ${bullet} ${item.description}`;

                if (isCompleted) {
                    const takenSeconds = secondsBetween(item.created_at, item.updated_at);
                    line += `  — completed ${item.updated_at?.slice(0, 10) || "—"}, took ${formatItemDuration(takenSeconds)}`;
                }

                writeLine(line, {
                    size: 9,
                    color: isCompleted ? "#2F5D50" : "#374151",
                    gap: 13,
                });
            });
        }

        y += 6;
    });

    const filename = `${(user?.name || "user").replace(/\s+/g, "_")}-workload-report.pdf`;
    doc.save(filename);
};

/**
 * Workload popup for the Task Report page. Opened by clicking a user
 * card; fetches every task assigned to that user (with task list items,
 * assignee, creator) plus their aggregate stats, and lists it all here.
 * Includes a PDF export of the entire workload.
 */
const TaskReportDetailPopup = ({ userId, onClose }) => {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) return;

        let cancelled = false;
        setLoading(true);
        setError("");

        axios
            .get(route("ourtaskreport.usertasks", { userId }))
            .then((res) => {
                if (cancelled) return;
                const data = res.data?.data || [];
                setTasks(data);
                setStats(res.data?.stats || null);
                setUser(data[0]?.assigned_user || null);
            })
            .catch((err) => {
                console.log("Failed to load user tasks", err);
                if (!cancelled) setError("Couldn't load this user's tasks.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [userId]);

    // Lock background scroll while open, same pattern used elsewhere.
    useEffect(() => {
        if (!userId) return;
        const scrollY = window.scrollY;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
            window.scrollTo(0, scrollY);
        };
    }, [userId]);

    if (!userId) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full shadow-xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">
                            {user?.name || "User"}'s workload
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-5 space-y-4">
                    {loading ? (
                        <div className="text-center text-gray-400 py-10">
                            Loading tasks…
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-10 text-sm">
                            {error}
                        </div>
                    ) : (
                        <>
                            {stats && (
                                <div className="grid grid-cols-3 gap-2">
                                    <StatBlock
                                        label="Total tasks"
                                        value={stats.total_tasks}
                                    />
                                    <StatBlock
                                        label="Completed"
                                        value={stats.completed}
                                        accent="#DC2626"
                                    />
                                    <StatBlock
                                        label="Pending"
                                        value={stats.in_progress + stats.pending}
                                        accent="#16A34A"
                                    />
                                </div>
                            )}

                            {stats?.avg_completion_seconds != null && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <TrendingUp size={13} />
                                    Averages{" "}
                                    <span className="font-semibold text-gray-700">
                                        {formatDuration(stats.avg_completion_seconds)}
                                    </span>{" "}
                                    to complete a task
                                </div>
                            )}

                            {tasks.length === 0 ? (
                                <p className="text-sm text-gray-400 italic text-center py-6">
                                    No tasks yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {tasks.map((task) => (
                                        <UserTaskCard key={task.id} task={task} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                    <button
                        type="button"
                        onClick={() => exportWorkloadPdf(user, stats, tasks)}
                        disabled={loading || !!error || tasks.length === 0}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2F5D50] text-white text-sm hover:bg-[#274d42] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <Download size={14} /> Export PDF
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskReportDetailPopup;