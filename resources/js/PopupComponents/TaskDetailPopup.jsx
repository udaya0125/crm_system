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
//     FileText,
//     AlertCircle,
//     Lock,
//     ShieldCheck,
//     RotateCcw,
// } from "lucide-react";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import Select from "react-select";
// import parse from "html-react-parser";
// import { useForm, Controller } from "react-hook-form";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     "pdfjs-dist/build/pdf.worker.min.mjs",
//     import.meta.url,
// ).toString();

// export const STATUS_STYLES = {
//     Pending: { bar: "#94A3B8" },
//     "In Progress": { bar: "#3B6E91" },
//     Completed: { bar: "#2F5D50" },
// };

// const STATUS_OPTIONS = Object.keys(STATUS_STYLES);

// export const DEPARTMENT_STYLES = {
//     developer: {
//         label: "Developer",
//         bar: "#6D5BD0",
//         text: "#4C3FAE",
//         bg: "#EFEDFC",
//     },
//     technician: {
//         label: "Technician",
//         bar: "#C9762C",
//         text: "#8A4E15",
//         bg: "#FBEFE3",
//     },
//     accountant: {
//         label: "Accountant",
//         bar: "#3B6E91",
//         text: "#265266",
//         bg: "#E7F1F6",
//     },
//     admin: { label: "Admin", bar: "#475569", text: "#334155", bg: "#EEF1F5" },
//     manager: {
//         label: "Manager",
//         bar: "#475569",
//         text: "#334155",
//         bg: "#EEF1F5",
//     },
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

// const PRIORITY_OPTIONS = Object.keys(PRIORITY_DOT);

// const ADMIN_STATUS_OPTIONS = [
//     {
//         value: "Reopened",
//         label: "Reopened — send back for edits",
//         description: "Kicks the task back to In Progress so it can be revised.",
//     },
//     {
//         value: "Completed",
//         label: "Completed — approve & finalize",
//         description: "Locks the task permanently. No further review.",
//     },
// ];

// const ADMIN_STATUS_META = {
//     Completed: {
//         label: "Approved",
//         badgeBg: "#EAF2EF",
//         badgeText: "#2F5D50",
//         cardBorder: "#C7DAD3",
//         cardBg: "#F3F8F6",
//         icon: CheckCircle2,
//     },
//     Reopened: {
//         label: "Reopened",
//         badgeBg: "#FEF3C7",
//         badgeText: "#92400E",
//         cardBorder: "#FDE0A5",
//         cardBg: "#FFFBEB",
//         icon: RotateCcw,
//     },
//     default: {
//         label: "Reviewed",
//         badgeBg: "#F1F5F9",
//         badgeText: "#475569",
//         cardBorder: "#E2E8F0",
//         cardBg: "#F8FAFC",
//         icon: ShieldCheck,
//     },
// };

// const getAdminStatusMeta = (status) =>
//     ADMIN_STATUS_META[status] || ADMIN_STATUS_META.default;

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

//     if (diffDays < 0)
//         return {
//             text: `${Math.abs(diffDays)}d overdue`,
//             color: "text-red-600",
//         };
//     if (diffDays === 0) return { text: "Due today", color: "text-orange-600" };
//     if (diffDays <= 2)
//         return { text: `${diffDays}d left`, color: "text-orange-500" };
//     return { text: `${diffDays}d left`, color: "text-gray-500" };
// };

// const isPdfFile = (path = "") => /\.pdf$/i.test(path);
// const attachmentUrl = (path) => `/storage/${path}`;

// const sanitizeRichText = (html = "") =>
//     html
//         .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
//         .replace(/ on\w+="[^"]*"/gi, "")
//         .replace(/ on\w+='[^']*'/gi, "");

// const DetailRow = ({ label, value }) => (
//     <div>
//         <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">
//             {label}
//         </p>
//         <p className="text-sm text-gray-800">{value || "—"}</p>
//     </div>
// );

// // ─── Inline PDF Viewer ──────────────────────────────────────────────────────
// const AttachmentPdfViewer = ({ url }) => {
//     const [numPages, setNumPages] = useState(null);
//     const [scale, setScale] = useState(1.0);
//     const [pdfLoading, setPdfLoading] = useState(true);
//     const [pdfError, setPdfError] = useState(null);
//     const [currentPageInView, setCurrentPageInView] = useState(1);

//     const containerRef = useRef(null);
//     const pageRefs = useRef([]);

//     const onDocumentLoadSuccess = useCallback(({ numPages }) => {
//         setNumPages(numPages);
//         setPdfLoading(false);
//         setPdfError(null);
//         pageRefs.current = pageRefs.current.slice(0, numPages);
//     }, []);

//     const onDocumentLoadError = useCallback((err) => {
//         console.error("PDF load error:", err);
//         setPdfError("Failed to load PDF.");
//         setPdfLoading(false);
//     }, []);

//     useEffect(() => {
//         if (!numPages) return;
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((entry) => {
//                     if (entry.isIntersecting) {
//                         setCurrentPageInView(
//                             parseInt(entry.target.dataset.page, 10) + 1,
//                         );
//                     }
//                 });
//             },
//             { threshold: 0.5 },
//         );
//         pageRefs.current.forEach((ref) => {
//             if (ref) observer.observe(ref);
//         });
//         return () => {
//             pageRefs.current.forEach((ref) => {
//                 if (ref) observer.unobserve(ref);
//             });
//         };
//     }, [numPages, scale]);

//     const zoomIn = () => setScale((p) => Math.min(p + 0.2, 2.0));
//     const zoomOut = () => setScale((p) => Math.max(p - 0.2, 0.6));
//     const resetZoom = () => setScale(1.0);

//     return (
//         <div className="flex flex-col h-full">
//             {/* PDF toolbar */}
//             <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg shrink-0">
//                 <div className="flex items-center gap-2">
//                     <FileText size={14} className="text-red-500" />
//                     <span className="text-xs font-medium text-gray-600">
//                         PDF Document
//                     </span>
//                     {numPages && (
//                         <span className="text-xs text-gray-400">
//                             — Page{" "}
//                             <span className="font-medium text-gray-600">
//                                 {currentPageInView}
//                             </span>{" "}
//                             of {numPages}
//                         </span>
//                     )}
//                 </div>
//                 <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
//                     <button
//                         onClick={zoomOut}
//                         disabled={scale <= 0.6}
//                         className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
//                     >
//                         <svg
//                             className="w-3.5 h-3.5 text-gray-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M20 12H4"
//                             />
//                         </svg>
//                     </button>
//                     <span className="px-2 text-xs font-medium text-gray-600 min-w-[42px] text-center">
//                         {Math.round(scale * 100)}%
//                     </span>
//                     <button
//                         onClick={zoomIn}
//                         disabled={scale >= 2.0}
//                         className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
//                     >
//                         <svg
//                             className="w-3.5 h-3.5 text-gray-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M12 4v16m8-8H4"
//                             />
//                         </svg>
//                     </button>
//                     <button
//                         onClick={resetZoom}
//                         className="px-2 py-1 text-xs hover:bg-gray-100 rounded-md transition-colors text-gray-500"
//                     >
//                         reset
//                     </button>
//                 </div>
//             </div>

//             {/* PDF scroll area */}
//             <div
//                 ref={containerRef}
//                 className="flex-1 overflow-auto bg-gray-100 rounded-b-lg"
//                 style={{
//                     scrollbarWidth: "thin",
//                     scrollbarColor: "#9CA3AF #F3F4F6",
//                 }}
//             >
//                 {pdfLoading && !pdfError && (
//                     <div className="flex flex-col items-center justify-center py-16">
//                         <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#2F5D50]" />
//                         <p className="text-gray-400 text-xs mt-3">
//                             Loading PDF…
//                         </p>
//                     </div>
//                 )}
//                 {pdfError && (
//                     <div className="flex flex-col items-center justify-center py-16 text-center px-4">
//                         <AlertCircle size={32} className="text-red-400 mb-2" />
//                         <p className="text-sm text-red-600">{pdfError}</p>
//                     </div>
//                 )}
//                 {!pdfError && (
//                     <Document
//                         file={url}
//                         onLoadSuccess={onDocumentLoadSuccess}
//                         onLoadError={onDocumentLoadError}
//                         loading={null}
//                         className="flex flex-col items-center py-4 gap-4"
//                     >
//                         {numPages &&
//                             Array.from({ length: numPages }, (_, i) => (
//                                 <div
//                                     key={`page_${i + 1}`}
//                                     ref={(el) => (pageRefs.current[i] = el)}
//                                     data-page={i}
//                                 >
//                                     <Page
//                                         pageNumber={i + 1}
//                                         scale={scale}
//                                         renderTextLayer={true}
//                                         renderAnnotationLayer={true}
//                                         className="shadow-md bg-white overflow-hidden"
//                                         loading={
//                                             <div className="w-[400px] h-[500px] bg-gray-200 animate-pulse" />
//                                         }
//                                     />
//                                 </div>
//                             ))}
//                     </Document>
//                 )}
//             </div>
//         </div>
//     );
// };

// const QUILL_MODULES = {
//     toolbar: [
//         ["bold", "italic", "underline"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["clean"],
//     ],
// };
// const QUILL_FORMATS = ["bold", "italic", "underline", "list", "bullet"];

// const adminStatusSelectStyles = {
//     control: (base, state) => ({
//         ...base,
//         borderColor: state.isFocused ? "#D97706" : "#FCD34D",
//         borderRadius: "0.5rem",
//         padding: "0.125rem 0",
//         boxShadow: state.isFocused ? "0 0 0 2px rgba(217,119,6,0.15)" : "none",
//         "&:hover": { borderColor: "#D97706" },
//     }),
//     option: (base, { isFocused, isSelected }) => ({
//         ...base,
//         backgroundColor: isSelected
//             ? "#2F5D50"
//             : isFocused
//               ? "#FEF3C7"
//               : "white",
//         color: isSelected ? "white" : "#1f2937",
//         cursor: "pointer",
//         padding: "0.5rem 0.75rem",
//     }),
//     menu: (base) => ({
//         ...base,
//         borderRadius: "0.5rem",
//         overflow: "hidden",
//         zIndex: 9999,
//     }),
//     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
// };

// const AdminStatusOption = (props) => {
//     const { data, innerRef, innerProps, isFocused, isSelected } = props;
//     return (
//         <div
//             ref={innerRef}
//             {...innerProps}
//             className="px-3 py-2 cursor-pointer"
//             style={{
//                 backgroundColor: isSelected
//                     ? "#2F5D50"
//                     : isFocused
//                       ? "#FEF3C7"
//                       : "white",
//                 color: isSelected ? "white" : "#1f2937",
//             }}
//         >
//             <p className="text-sm font-medium">{data.label}</p>
//             <p
//                 className={`text-xs mt-0.5 ${isSelected ? "text-white/80" : "text-gray-400"}`}
//             >
//                 {data.description}
//             </p>
//         </div>
//     );
// };

// const TaskDetailPopup = ({
//     task,
//     onClose,
//     onEdit,
//     onQuickUpdate,
//     onReview,
//     isPrivileged,
// }) => {
//     const [savingField, setSavingField] = useState(null); // "due_date" | "status" | "priority" | "checklist" | null
//     const [error, setError] = useState("");

//     const [editingDueDate, setEditingDueDate] = useState(false);

//     // Checklist draft — always "live", no separate view/edit toggle.
//     const [checklistDraft, setChecklistDraft] = useState([]);

//     const [menuPortalTarget, setMenuPortalTarget] = useState(null);

//     // ── Due-date inline edit form ───────────────────────────────────────
//     // Small RHF instance just for the due-date popover. Validated against
//     // the task's start_date so picking a due date earlier than the start
//     // date shows an inline error instead of silently saving.
//     const {
//         register: registerDueDate,
//         handleSubmit: handleDueDateSubmit,
//         reset: resetDueDateForm,
//         formState: { errors: dueDateErrors },
//     } = useForm({ defaultValues: { due_date: "" } });

//     // ── Admin review form ────────────────────────────────────────────────
//     // Admin Status (react-select) and Admin Remarks (Quill) submitted
//     // together via one Save Review button.
//     const {
//         control: reviewControl,
//         handleSubmit: handleReviewSubmit,
//         reset: resetReviewForm,
//         formState: { errors: reviewErrors, isSubmitting: reviewSubmitting },
//     } = useForm({ defaultValues: { admin_status: null, admin_remarks: "" } });

//     useEffect(() => {
//         setMenuPortalTarget(document.body);
//     }, []);

//     // Lock background page scroll while the popup is open, and restore
//     // whatever the body's scroll state was before, when it closes.
//     useEffect(() => {
//         if (!task) return; // nothing to show — don't touch body scroll

//         const scrollY = window.scrollY;
//         const {
//             overflow: prevOverflow,
//             position: prevPosition,
//             top: prevTop,
//             width: prevWidth,
//         } = document.body.style;

//         document.body.style.overflow = "hidden";
//         document.body.style.position = "fixed";
//         document.body.style.top = `-${scrollY}px`;
//         document.body.style.width = "100%";

//         return () => {
//             document.body.style.overflow = prevOverflow;
//             document.body.style.position = prevPosition;
//             document.body.style.top = prevTop;
//             document.body.style.width = prevWidth;
//             window.scrollTo(0, scrollY);
//         };
//     }, [task]);

//     // Re-sync the checklist draft whenever the underlying task changes
//     // (popup opened for a different ticket, or the parent re-fetched fresh
//     // data after a save).
//     useEffect(() => {
//         setChecklistDraft(
//             (task?.task_items || []).map((item, i) => ({
//                 clientId: item.id ?? `existing-${i}`,
//                 description: item.description,
//                 status: item.status || "Pending",
//             })),
//         );
//     }, [task]);

//     // Seed the review form from the task's previous verdict whenever the
//     // popup switches to a different task. A task that's been Reopened ->
//     // re-edited -> resubmitted as Completed shows up here with the
//     // admin/manager's last status choice and remarks already filled in, so
//     // review always starts with full prior context instead of a blank
//     // slate — the admin can leave it as-is (re-save with updated notes) or
//     // change the verdict entirely (e.g. switch to "Completed" to approve).
//     useEffect(() => {
//         resetReviewForm({
//             admin_status: task?.admin_status
//                 ? ADMIN_STATUS_OPTIONS.find(
//                       (o) => o.value === task.admin_status,
//                   ) || null
//                 : null,
//             admin_remarks: task?.admin_remarks || "",
//         });
//         setEditingDueDate(false);
//     }, [task?.id, resetReviewForm]);

//     if (!task) return null;

//     const dept = getDeptStyle(task.department);
//     const progress = getProgress(checklistDraft);
//     const dueInfo = getDueInfo(task.due_date);

//     // Completed tasks are locked: no quick-edits (status/priority/due date/
//     // checklist) and no "Edit ticket" access, even if a parent passed an
//     // onQuickUpdate handler.
//     const isLocked = task.status === "Completed";
//     const canQuickEdit = typeof onQuickUpdate === "function" && !isLocked;

//     // Whether there's any admin review info to show at all (badge + summary
//     // card) — independent of the task's current status.
//     const hasAdminReview = Boolean(task.admin_status || task.admin_remarks);
//     const adminMeta = getAdminStatusMeta(task.admin_status);
//     const AdminMetaIcon = adminMeta.icon;

//     // Review FORM eligibility: task must be currently Completed, viewer
//     // must be admin/manager, an onReview handler must be wired up, and it
//     // must not already be finalized (admin_status === "Completed" is the
//     // permanent approval state — no further review once reached).
//     const isFinalized = task.admin_status === "Completed";
//     const needsReview =
//         isLocked &&
//         isPrivileged &&
//         !isFinalized &&
//         typeof onReview === "function";

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
//         if (merged.description)
//             formData.append("description", merged.description);
//         formData.append("status", merged.status);

//         merged.task_items.forEach((item, index) => {
//             if (item.description?.trim()) {
//                 formData.append(
//                     `task_items[${index}][description]`,
//                     item.description,
//                 );
//                 formData.append(
//                     `task_items[${index}][status]`,
//                     item.status || "Pending",
//                 );
//             }
//         });

//         return formData;
//     };

//     const handleQuickSave = async (overrides, savingKey) => {
//         if (isLocked) return false;
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
//         if (isLocked) return;
//         resetDueDateForm({ due_date: task.due_date?.slice(0, 10) || "" });
//         setEditingDueDate(true);
//     };

//     const onDueDateSubmit = async (data) => {
//         if (!data.due_date) {
//             setEditingDueDate(false);
//             return;
//         }
//         const ok = await handleQuickSave(
//             { due_date: data.due_date },
//             "due_date",
//         );
//         if (ok) setEditingDueDate(false);
//     };

//     // ---- Status ----
//     const handleStatusChange = (e) => {
//         handleQuickSave({ status: e.target.value }, "status");
//     };

//     // ---- Priority — same pattern as status: select saves immediately ----
//     const handlePriorityChange = (e) => {
//         handleQuickSave({ priority: e.target.value }, "priority");
//     };

//     // ---- Checklist — always-editable draft ----
//     const addDraftItem = () => {
//         if (isLocked) return;
//         setChecklistDraft((prev) => [
//             ...prev,
//             {
//                 clientId: `new-${Date.now()}`,
//                 description: "",
//                 status: "Pending",
//             },
//         ]);
//     };

//     const removeDraftItem = (clientId) => {
//         if (isLocked) return;
//         setChecklistDraft((prev) =>
//             prev.filter((i) => i.clientId !== clientId),
//         );
//     };

//     const updateDraftText = (clientId, text) => {
//         if (isLocked) return;
//         setChecklistDraft((prev) =>
//             prev.map((i) =>
//                 i.clientId === clientId ? { ...i, description: text } : i,
//             ),
//         );
//     };

//     const toggleDraftStatus = (clientId) => {
//         if (isLocked) return;
//         setChecklistDraft((prev) =>
//             prev.map((i) =>
//                 i.clientId === clientId
//                     ? {
//                           ...i,
//                           status:
//                               i.status === "Completed"
//                                   ? "Pending"
//                                   : "Completed",
//                       }
//                     : i,
//             ),
//         );
//     };

//     const moveDraftUp = (index) => {
//         if (isLocked) return;
//         if (index === 0) return;
//         setChecklistDraft((prev) => {
//             const next = [...prev];
//             [next[index - 1], next[index]] = [next[index], next[index - 1]];
//             return next;
//         });
//     };

//     const moveDraftDown = (index) => {
//         if (isLocked) return;
//         setChecklistDraft((prev) => {
//             if (index === prev.length - 1) return prev;
//             const next = [...prev];
//             [next[index], next[index + 1]] = [next[index + 1], next[index]];
//             return next;
//         });
//     };

//     const saveChecklist = async () => {
//         if (isLocked) return;
//         const items = checklistDraft
//             .filter((i) => i.description.trim() !== "")
//             .map((i) => ({
//                 description: i.description.trim(),
//                 status: i.status,
//             }));

//         await handleQuickSave({ task_items: items }, "checklist");
//     };

//     // ---- Review (admin/manager verdict on a Completed task) ----
//     const onReviewSubmit = async (data) => {
//         if (typeof onReview !== "function") return;
//         try {
//             await onReview(task.id, {
//                 admin_status: data.admin_status.value,
//                 admin_remarks:
//                     data.admin_remarks && data.admin_remarks !== "<p><br></p>"
//                         ? data.admin_remarks
//                         : null,
//             });
//         } catch (err) {
//             console.log("Review failed", err);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col">
//                 <div
//                     className="flex justify-between items-start px-6 py-4 border-b"
//                     style={{ borderLeft: `6px solid ${dept.bar}` }}
//                 >
//                     <div>
//                         <span className="font-mono text-xs text-gray-400">
//                             {task.task_id}
//                         </span>
//                         <h2 className="text-xl font-bold text-gray-900 mt-0.5">
//                             {task.title}
//                         </h2>
//                         <div className="flex items-center gap-2 mt-2 flex-wrap">
//                             <span
//                                 className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
//                                 style={{
//                                     backgroundColor: dept.bg,
//                                     color: dept.text,
//                                 }}
//                             >
//                                 {dept.label}
//                             </span>

//                             {isLocked && (
//                                 <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-500">
//                                     <Lock size={10} /> Locked
//                                 </span>
//                             )}

//                             {/* Status */}
//                             {canQuickEdit ? (
//                                 <span className="flex items-center gap-1.5">
//                                     <span
//                                         className="w-1.5 h-1.5 rounded-full shrink-0"
//                                         style={{
//                                             backgroundColor:
//                                                 STATUS_STYLES[task.status]
//                                                     ?.bar || "#CBD5E1",
//                                         }}
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
//                                         <span className="text-[10px] text-gray-400">
//                                             saving…
//                                         </span>
//                                     )}
//                                 </span>
//                             ) : (
//                                 <span className="flex items-center gap-1.5 text-xs text-gray-500">
//                                     <span
//                                         className="w-1.5 h-1.5 rounded-full"
//                                         style={{
//                                             backgroundColor:
//                                                 STATUS_STYLES[task.status]
//                                                     ?.bar || "#CBD5E1",
//                                         }}
//                                     />
//                                     {task.status}
//                                 </span>
//                             )}

//                             {/* Priority — same quick-edit pattern as status */}
//                             {canQuickEdit ? (
//                                 <span className="flex items-center gap-1.5">
//                                     <span
//                                         className="w-1.5 h-1.5 rounded-full shrink-0"
//                                         style={{
//                                             backgroundColor:
//                                                 PRIORITY_DOT[task.priority] ||
//                                                 "#CBD5E1",
//                                         }}
//                                     />
//                                     <select
//                                         value={task.priority}
//                                         onChange={handlePriorityChange}
//                                         disabled={savingField === "priority"}
//                                         className="text-xs text-gray-600 border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-[#2F5D50]/30 rounded cursor-pointer disabled:opacity-50"
//                                     >
//                                         {PRIORITY_OPTIONS.map((p) => (
//                                             <option key={p} value={p}>
//                                                 {p}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     {savingField === "priority" && (
//                                         <span className="text-[10px] text-gray-400">
//                                             saving…
//                                         </span>
//                                     )}
//                                 </span>
//                             ) : (
//                                 <span className="flex items-center gap-1.5 text-xs text-gray-500">
//                                     <span
//                                         className="w-1.5 h-1.5 rounded-full"
//                                         style={{
//                                             backgroundColor:
//                                                 PRIORITY_DOT[task.priority] ||
//                                                 "#CBD5E1",
//                                         }}
//                                     />
//                                     {task.priority} priority
//                                 </span>
//                             )}

//                             {/* Admin status badge — shown whenever a review has
//                                 ever happened, independent of the task's current
//                                 status (so it survives a Reopen -> In Progress
//                                 transition). */}
//                             {task.admin_status && (
//                                 <span
//                                     className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
//                                     style={{
//                                         backgroundColor: adminMeta.badgeBg,
//                                         color: adminMeta.badgeText,
//                                     }}
//                                 >
//                                     <AdminMetaIcon size={10} />
//                                     {adminMeta.label}
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
//                     >
//                         <X size={20} />
//                     </button>
//                 </div>

//                 <div className="overflow-y-auto px-6 py-5 space-y-5">
//                     {error && (
//                         <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
//                             {error}
//                         </div>
//                     )}

//                     {/* ── Admin Review summary card ──────────────────────────
//                         Shown whenever there's ANY review data on the task
//                         (admin_status / admin_remarks), no matter what
//                         task.status currently is. This persists through
//                         Reopened -> re-edited -> re-Completed cycles since
//                         update() never clears these fields — only review()
//                         does, and only when an admin/manager explicitly
//                         submits a new verdict. */}
//                     {hasAdminReview && (
//                         <div
//                             className="rounded-xl border overflow-hidden"
//                             style={{ borderColor: adminMeta.cardBorder }}
//                         >
//                             <div
//                                 className="flex items-center justify-between px-4 py-2.5 border-b"
//                                 style={{
//                                     backgroundColor: adminMeta.cardBg,
//                                     borderColor: adminMeta.cardBorder,
//                                 }}
//                             >
//                                 <div className="flex items-center gap-2">
//                                     <span
//                                         className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
//                                         style={{
//                                             backgroundColor: adminMeta.badgeBg,
//                                         }}
//                                     >
//                                         <AdminMetaIcon
//                                             size={13}
//                                             style={{
//                                                 color: adminMeta.badgeText,
//                                             }}
//                                         />
//                                     </span>
//                                     <p className="text-sm font-semibold text-gray-800">
//                                         Admin Review
//                                     </p>
//                                 </div>
//                                 <span
//                                     className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
//                                     style={{
//                                         backgroundColor: adminMeta.badgeBg,
//                                         color: adminMeta.badgeText,
//                                     }}
//                                 >
//                                     {adminMeta.label}
//                                 </span>
//                             </div>

//                             <div className="px-4 py-3 bg-white">
//                                 {task.admin_remarks ? (
//                                     <>
//                                         <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
//                                             What needs attention
//                                         </p>
//                                         <div
//                                             className="text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto pr-1
//                                                 [&_p]:mb-1.5 [&_p:last-child]:mb-0
//                                                 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
//                                         >
//                                             {parse(
//                                                 sanitizeRichText(
//                                                     task.admin_remarks,
//                                                 ),
//                                             )}
//                                         </div>
//                                     </>
//                                 ) : (
//                                     <p className="text-sm text-gray-400 italic">
//                                         No remarks were left.
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {/* ── Admin/manager review FORM ──────────────────────────
//                         Only shown for a Completed task that hasn't been
//                         finalized yet. Two separate fields — Admin Status
//                         (react-select) and Admin Remarks (Quill, fixed height
//                         + internal scroll) — submitted together via one
//                         Save Review button. Pre-filled from the task's
//                         existing admin_status/admin_remarks, so a second or
//                         third review round starts from the prior verdict
//                         instead of blank. */}
//                     {needsReview && (
//                         <div className="rounded-xl border border-amber-200 overflow-hidden">
//                             <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border-b border-amber-200">
//                                 <AlertCircle
//                                     size={15}
//                                     className="text-amber-600 shrink-0"
//                                 />
//                                 <p className="text-sm font-semibold text-amber-800">
//                                     Awaiting your review
//                                 </p>
//                             </div>

//                             <div className="px-4 py-4 bg-white space-y-4">
//                                 {task.admin_status && (
//                                     <p className="text-xs text-gray-500 -mt-1">
//                                         Pre-filled with your previous review —
//                                         update it if the resubmission changes
//                                         your verdict.
//                                     </p>
//                                 )}

//                                 {/* Field 1: Admin Status — react-select */}
//                                 <div>
//                                     <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                                         Admin Status
//                                     </label>
//                                     <Controller
//                                         name="admin_status"
//                                         control={reviewControl}
//                                         rules={{
//                                             required:
//                                                 "Please choose an Admin Status before saving.",
//                                         }}
//                                         render={({ field }) => (
//                                             <Select
//                                                 value={field.value}
//                                                 onChange={field.onChange}
//                                                 options={ADMIN_STATUS_OPTIONS}
//                                                 components={{
//                                                     Option: AdminStatusOption,
//                                                 }}
//                                                 placeholder="Select an outcome..."
//                                                 isDisabled={reviewSubmitting}
//                                                 isClearable
//                                                 styles={
//                                                     adminStatusSelectStyles
//                                                 }
//                                                 menuPortalTarget={
//                                                     menuPortalTarget
//                                                 }
//                                                 menuPosition="fixed"
//                                             />
//                                         )}
//                                     />
//                                 </div>

//                                 {/* Field 2: Admin Remarks — rich text, fixed
//                                     height with internal scroll once content
//                                     grows past that height. */}
//                                 <div>
//                                     <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                                         Admin Remarks
//                                     </label>
//                                     <Controller
//                                         name="admin_remarks"
//                                         control={reviewControl}
//                                         render={({ field }) => (
//                                             <div
//                                                 className="rounded-lg border border-gray-200 overflow-hidden
//                                                     [&_.ql-toolbar]:sticky [&_.ql-toolbar]:top-0 [&_.ql-toolbar]:z-10 [&_.ql-toolbar]:bg-white
//                                                     [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200
//                                                     [&_.ql-container]:border-none
//                                                     [&_.ql-editor]:h-[180px] [&_.ql-editor]:max-h-[180px] [&_.ql-editor]:overflow-y-auto"
//                                             >
//                                                 <ReactQuill
//                                                     theme="snow"
//                                                     value={field.value}
//                                                     onChange={field.onChange}
//                                                     readOnly={
//                                                         reviewSubmitting
//                                                     }
//                                                     modules={QUILL_MODULES}
//                                                     formats={QUILL_FORMATS}
//                                                     placeholder="Describe what needs to change, or leave approval notes..."
//                                                 />
//                                             </div>
//                                         )}
//                                     />
//                                 </div>

//                                 {reviewErrors.admin_status && (
//                                     <p className="text-xs text-red-600">
//                                         {reviewErrors.admin_status.message}
//                                     </p>
//                                 )}

//                                 {/* Save button below both fields */}
//                                 <div className="flex justify-end pt-1">
//                                     <button
//                                         type="button"
//                                         onClick={handleReviewSubmit(
//                                             onReviewSubmit,
//                                         )}
//                                         disabled={reviewSubmitting}
//                                         className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 font-medium"
//                                     >
//                                         {reviewSubmitting
//                                             ? "Saving..."
//                                             : "Save Review"}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

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

//                         {/* Due date — click to edit, small button confirms the save */}
//                         <div>
//                             <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">
//                                 Due date
//                             </p>
//                             {canQuickEdit && editingDueDate ? (
//                                 <form
//                                     onSubmit={handleDueDateSubmit(
//                                         onDueDateSubmit,
//                                     )}
//                                     className="flex flex-col gap-1"
//                                 >
//                                     <div className="flex items-center gap-2">
//                                         <input
//                                             type="date"
//                                             autoFocus
//                                             disabled={
//                                                 savingField === "due_date"
//                                             }
//                                             {...registerDueDate("due_date", {
//                                                 required: true,
//                                                 validate: (value) =>
//                                                     !value ||
//                                                     !task.start_date ||
//                                                     value >=
//                                                         task.start_date.slice(
//                                                             0,
//                                                             10,
//                                                         ) ||
//                                                     "Can't be before the start date",
//                                             })}
//                                             onKeyDown={(e) => {
//                                                 if (e.key === "Escape")
//                                                     setEditingDueDate(false);
//                                             }}
//                                             className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 disabled:opacity-50"
//                                         />
//                                         <button
//                                             type="submit"
//                                             disabled={
//                                                 savingField === "due_date"
//                                             }
//                                             title="Confirm due date"
//                                             className="p-1 rounded-full bg-[#2F5D50] text-white hover:bg-[#264C41] disabled:opacity-50"
//                                         >
//                                             <Check size={12} />
//                                         </button>
//                                         {savingField === "due_date" && (
//                                             <span className="text-[10px] text-gray-400">
//                                                 saving…
//                                             </span>
//                                         )}
//                                     </div>
//                                     {dueDateErrors.due_date && (
//                                         <p className="text-[11px] text-red-500">
//                                             {dueDateErrors.due_date.message ||
//                                                 "Due date is required"}
//                                         </p>
//                                     )}
//                                 </form>
//                             ) : (
//                                 <button
//                                     type="button"
//                                     onClick={
//                                         canQuickEdit
//                                             ? startEditingDueDate
//                                             : undefined
//                                     }
//                                     className={`text-sm flex items-center gap-1.5 ${
//                                         canQuickEdit
//                                             ? "hover:text-[#2F5D50] cursor-pointer"
//                                             : "cursor-default"
//                                     } ${dueInfo ? dueInfo.color : "text-gray-800"}`}
//                                 >
//                                     {task.due_date?.slice(0, 10) || "—"}
//                                     {dueInfo && <span>· {dueInfo.text}</span>}
//                                     {canQuickEdit && (
//                                         <Calendar
//                                             size={12}
//                                             className="text-gray-400"
//                                         />
//                                     )}
//                                 </button>
//                             )}
//                         </div>
//                     </div>

//                     {task.description && (
//                         <div>
//                             <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
//                                 Description
//                             </p>
//                             <div
//                                 className="text-sm text-gray-700 leading-relaxed
//                                     [&_p]:mb-1.5 [&_p:last-child]:mb-0
//                                     [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
//                             >
//                                 {parse(sanitizeRichText(task.description))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Checklist — always in an editable draft state when
//                         unlocked (no toggle button). */}
//                     <div>
//                         <div className="flex justify-between items-center mb-2">
//                             <div className="flex items-center gap-2">
//                                 <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
//                                     Checklist
//                                 </p>
//                                 {checklistDraft.length > 0 && (
//                                     <span className="text-xs text-gray-400">
//                                         {progress}% complete
//                                     </span>
//                                 )}
//                             </div>
//                             {canQuickEdit && (
//                                 <button
//                                     type="button"
//                                     onClick={addDraftItem}
//                                     className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
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
//                                             No items yet. Click "Add item" to
//                                             create one.
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
//                                                     onClick={() =>
//                                                         toggleDraftStatus(
//                                                             item.clientId,
//                                                         )
//                                                     }
//                                                     className="shrink-0"
//                                                     title={
//                                                         item.status ===
//                                                         "Completed"
//                                                             ? "Mark as incomplete"
//                                                             : "Mark as complete"
//                                                     }
//                                                 >
//                                                     {item.status ===
//                                                     "Completed" ? (
//                                                         <CheckCircle2
//                                                             size={18}
//                                                             className="text-[#2F5D50]"
//                                                         />
//                                                     ) : (
//                                                         <Circle
//                                                             size={18}
//                                                             className="text-gray-300"
//                                                         />
//                                                     )}
//                                                 </button>

//                                                 <input
//                                                     type="text"
//                                                     value={item.description}
//                                                     onChange={(e) =>
//                                                         updateDraftText(
//                                                             item.clientId,
//                                                             e.target.value,
//                                                         )
//                                                     }
//                                                     placeholder={`Item ${index + 1}`}
//                                                     className={`flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 ${
//                                                         item.status ===
//                                                         "Completed"
//                                                             ? "line-through text-gray-400"
//                                                             : "text-gray-700"
//                                                     }`}
//                                                 />

//                                                 <button
//                                                     type="button"
//                                                     onClick={() =>
//                                                         moveDraftUp(index)
//                                                     }
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
//                                                     onClick={() =>
//                                                         moveDraftDown(index)
//                                                     }
//                                                     disabled={
//                                                         index ===
//                                                         checklistDraft.length -
//                                                             1
//                                                     }
//                                                     title="Move down"
//                                                     className={`p-1 rounded ${
//                                                         index ===
//                                                         checklistDraft.length -
//                                                             1
//                                                             ? "text-gray-300 cursor-not-allowed"
//                                                             : "text-gray-500 hover:bg-gray-200"
//                                                     }`}
//                                                 >
//                                                     <ArrowDown size={14} />
//                                                 </button>
//                                                 <button
//                                                     type="button"
//                                                     onClick={() =>
//                                                         removeDraftItem(
//                                                             item.clientId,
//                                                         )
//                                                     }
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
//                                         className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
//                                     >
//                                         {savingField === "checklist"
//                                             ? "Saving..."
//                                             : "Save checklist"}
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : task.task_items?.length > 0 ? (
//                             <div className="space-y-1.5">
//                                 {task.task_items.map((item, i) => (
//                                     <div
//                                         key={item.id ?? i}
//                                         className="flex items-center gap-2 text-sm"
//                                     >
//                                         {item.status === "Completed" ? (
//                                             <CheckCircle2
//                                                 size={16}
//                                                 className="text-[#2F5D50] shrink-0"
//                                             />
//                                         ) : (
//                                             <Circle
//                                                 size={16}
//                                                 className="text-gray-300 shrink-0"
//                                             />
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
//                             <p className="text-sm text-gray-400 italic">
//                                 No checklist items yet.
//                             </p>
//                         )}
//                     </div>

//                     {/* Attachments — images render inline, PDFs render in a
//                         scrollable/zoomable inline viewer. This popup never
//                         offered attachment deletion — that lives in
//                         EditTaskAssignedForm, which is itself locked out once
//                         the task is Completed. */}
//                     {task.attachments?.length > 0 && (
//                         <div>
//                             <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">
//                                 Attachments ({task.attachments.length})
//                             </p>
//                             <div className="space-y-4">
//                                 {task.attachments.map((att) => {
//                                     const url = attachmentUrl(att.attachment);
//                                     const fileName = att.attachment
//                                         .split("/")
//                                         .pop();
//                                     const isPdf = isPdfFile(att.attachment);

//                                     return (
//                                         <div
//                                             key={att.id}
//                                             className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden"
//                                         >
//                                             <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-100">
//                                                 <span className="flex items-center gap-1.5 text-xs text-gray-600 truncate">
//                                                     <Paperclip
//                                                         size={12}
//                                                         className="shrink-0 text-gray-400"
//                                                     />
//                                                     {fileName}
//                                                 </span>
//                                                 <a
//                                                     href={url}
//                                                     target="_blank"
//                                                     rel="noreferrer"
//                                                     className="text-[11px] text-indigo-600 hover:underline shrink-0 ml-2"
//                                                 >
//                                                     Open in new tab
//                                                 </a>
//                                             </div>

//                                             {isPdf ? (
//                                                 <div
//                                                     style={{ height: "420px" }}
//                                                 >
//                                                     <AttachmentPdfViewer
//                                                         url={url}
//                                                     />
//                                                 </div>
//                                             ) : (
//                                                 <div className="w-full flex items-center justify-center p-3 bg-gray-50">
//                                                     <img
//                                                         src={url}
//                                                         alt={fileName}
//                                                         className="max-w-full max-h-[360px] object-contain rounded-lg shadow-sm"
//                                                     />
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
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
//                     {isLocked ? (
//                         <span
//                             className="px-5 py-2 flex items-center gap-2 rounded-full bg-gray-100 text-gray-400 text-sm cursor-not-allowed select-none"
//                             title="Completed tickets are locked from editing"
//                         >
//                             <Lock size={14} /> Locked
//                         </span>
//                     ) : (
//                         <button
//                             type="button"
//                             onClick={() => onEdit(task)}
//                             className="px-5 py-2 flex items-center gap-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
//                         >
//                             <Pencil size={15} /> Edit ticket
//                         </button>
//                     )}
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
    Lock,
    ShieldCheck,
    RotateCcw,
} from "lucide-react";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import parse from "html-react-parser";
import { useForm, Controller } from "react-hook-form";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

export const STATUS_STYLES = {
    Pending: { bar: "#94A3B8" },
    "In Progress": { bar: "#3B6E91" },
    Completed: { bar: "#2F5D50" },
};

const STATUS_OPTIONS = Object.keys(STATUS_STYLES);

export const DEPARTMENT_STYLES = {
    developer: {
        label: "Developer",
        bar: "#6D5BD0",
        text: "#4C3FAE",
        bg: "#EFEDFC",
    },
    technician: {
        label: "Technician",
        bar: "#C9762C",
        text: "#8A4E15",
        bg: "#FBEFE3",
    },
    accountant: {
        label: "Accountant",
        bar: "#3B6E91",
        text: "#265266",
        bg: "#E7F1F6",
    },
    admin: { label: "Admin", bar: "#475569", text: "#334155", bg: "#EEF1F5" },
    manager: {
        label: "Manager",
        bar: "#475569",
        text: "#334155",
        bg: "#EEF1F5",
    },
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

const PRIORITY_OPTIONS = Object.keys(PRIORITY_DOT);

const ADMIN_STATUS_OPTIONS = [
    {
        value: "Reopened",
        label: "Reopened — send back for edits",
        description: "Kicks the task back to In Progress so it can be revised.",
    },
    {
        value: "Completed",
        label: "Completed — approve & finalize",
        description: "Locks the task permanently. No further review.",
    },
];

const ADMIN_STATUS_META = {
    Completed: {
        label: "Approved",
        badgeBg: "#EAF2EF",
        badgeText: "#2F5D50",
        cardBorder: "#C7DAD3",
        cardBg: "#F3F8F6",
        icon: CheckCircle2,
    },
    Reopened: {
        label: "Reopened",
        badgeBg: "#FEF3C7",
        badgeText: "#92400E",
        cardBorder: "#FDE0A5",
        cardBg: "#FFFBEB",
        icon: RotateCcw,
    },
    default: {
        label: "Reviewed",
        badgeBg: "#F1F5F9",
        badgeText: "#475569",
        cardBorder: "#E2E8F0",
        cardBg: "#F8FAFC",
        icon: ShieldCheck,
    },
};

const getAdminStatusMeta = (status) =>
    ADMIN_STATUS_META[status] || ADMIN_STATUS_META.default;

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

 const imgurl = import.meta.env.VITE_IMAGE_PATH;

const isPdfFile = (path = "") => /\.pdf$/i.test(path);
const attachmentUrl = (path) => `${imgurl}/${path}`;

const sanitizeRichText = (html = "") =>
    html
        .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
        .replace(/ on\w+="[^"]*"/gi, "")
        .replace(/ on\w+='[^']*'/gi, "");

const DetailRow = ({ label, value }) => (
    <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">
            {label}
        </p>
        <p className="text-sm text-gray-800">{value || "—"}</p>
    </div>
);

// ─── Inline PDF Viewer ──────────────────────────────────────────────────────
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
                        setCurrentPageInView(
                            parseInt(entry.target.dataset.page, 10) + 1,
                        );
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
                    <span className="text-xs font-medium text-gray-600">
                        PDF Document
                    </span>
                    {numPages && (
                        <span className="text-xs text-gray-400">
                            — Page{" "}
                            <span className="font-medium text-gray-600">
                                {currentPageInView}
                            </span>{" "}
                            of {numPages}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
                    <button
                        onClick={zoomOut}
                        disabled={scale <= 0.6}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
                    >
                        <svg
                            className="w-3.5 h-3.5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                            />
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
                        <svg
                            className="w-3.5 h-3.5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
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
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#9CA3AF #F3F4F6",
                }}
            >
                {pdfLoading && !pdfError && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#2F5D50]" />
                        <p className="text-gray-400 text-xs mt-3">
                            Loading PDF…
                        </p>
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
                                <div
                                    key={`page_${i + 1}`}
                                    ref={(el) => (pageRefs.current[i] = el)}
                                    data-page={i}
                                >
                                    <Page
                                        pageNumber={i + 1}
                                        scale={scale}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                        className="shadow-md bg-white overflow-hidden"
                                        loading={
                                            <div className="w-[400px] h-[500px] bg-gray-200 animate-pulse" />
                                        }
                                    />
                                </div>
                            ))}
                    </Document>
                )}
            </div>
        </div>
    );
};

const QUILL_MODULES = {
    toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
    ],
};
const QUILL_FORMATS = ["bold", "italic", "underline", "list", "bullet"];

const adminStatusSelectStyles = {
    control: (base, state) => ({
        ...base,
        borderColor: state.isFocused ? "#D97706" : "#FCD34D",
        borderRadius: "0.5rem",
        padding: "0.125rem 0",
        boxShadow: state.isFocused ? "0 0 0 2px rgba(217,119,6,0.15)" : "none",
        "&:hover": { borderColor: "#D97706" },
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected
            ? "#2F5D50"
            : isFocused
              ? "#FEF3C7"
              : "white",
        color: isSelected ? "white" : "#1f2937",
        cursor: "pointer",
        padding: "0.5rem 0.75rem",
    }),
    menu: (base) => ({
        ...base,
        borderRadius: "0.5rem",
        overflow: "hidden",
        zIndex: 9999,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const AdminStatusOption = (props) => {
    const { data, innerRef, innerProps, isFocused, isSelected } = props;
    return (
        <div
            ref={innerRef}
            {...innerProps}
            className="px-3 py-2 cursor-pointer"
            style={{
                backgroundColor: isSelected
                    ? "#2F5D50"
                    : isFocused
                      ? "#FEF3C7"
                      : "white",
                color: isSelected ? "white" : "#1f2937",
            }}
        >
            <p className="text-sm font-medium">{data.label}</p>
            <p
                className={`text-xs mt-0.5 ${isSelected ? "text-white/80" : "text-gray-400"}`}
            >
                {data.description}
            </p>
        </div>
    );
};

const TaskDetailPopup = ({
    task,
    onClose,
    onEdit,
    onQuickUpdate,
    onReview,
    onDeleteAttachment,
    isPrivileged,
}) => {
    const [savingField, setSavingField] = useState(null); // "due_date" | "status" | "priority" | "checklist" | null
    const [error, setError] = useState("");

    const [editingDueDate, setEditingDueDate] = useState(false);

    // Checklist draft — always "live", no separate view/edit toggle.
    const [checklistDraft, setChecklistDraft] = useState([]);

    // Tracks which attachment id is currently being deleted, so we can
    // disable/spin just that one button instead of the whole popup.
    const [deletingAttachmentId, setDeletingAttachmentId] = useState(null);

    const [menuPortalTarget, setMenuPortalTarget] = useState(null);

    // ── Due-date inline edit form ───────────────────────────────────────
    // Small RHF instance just for the due-date popover. Validated against
    // the task's start_date so picking a due date earlier than the start
    // date shows an inline error instead of silently saving.
    const {
        register: registerDueDate,
        handleSubmit: handleDueDateSubmit,
        reset: resetDueDateForm,
        formState: { errors: dueDateErrors },
    } = useForm({ defaultValues: { due_date: "" } });

    // ── Admin review form ────────────────────────────────────────────────
    // Admin Status (react-select) and Admin Remarks (Quill) submitted
    // together via one Save Review button.
    const {
        control: reviewControl,
        handleSubmit: handleReviewSubmit,
        reset: resetReviewForm,
        formState: { errors: reviewErrors, isSubmitting: reviewSubmitting },
    } = useForm({ defaultValues: { admin_status: null, admin_remarks: "" } });

    useEffect(() => {
        setMenuPortalTarget(document.body);
    }, []);

    // Lock background page scroll while the popup is open, and restore
    // whatever the body's scroll state was before, when it closes.
    useEffect(() => {
        if (!task) return; // nothing to show — don't touch body scroll

        const scrollY = window.scrollY;
        const {
            overflow: prevOverflow,
            position: prevPosition,
            top: prevTop,
            width: prevWidth,
        } = document.body.style;

        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";

        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.position = prevPosition;
            document.body.style.top = prevTop;
            document.body.style.width = prevWidth;
            window.scrollTo(0, scrollY);
        };
    }, [task]);

    // Re-sync the checklist draft whenever the underlying task changes
    // (popup opened for a different ticket, or the parent re-fetched fresh
    // data after a save).
    useEffect(() => {
        setChecklistDraft(
            (task?.task_items || []).map((item, i) => ({
                clientId: item.id ?? `existing-${i}`,
                description: item.description,
                status: item.status || "Pending",
            })),
        );
    }, [task]);

    // Seed the review form from the task's previous verdict whenever the
    // popup switches to a different task. A task that's been Reopened ->
    // re-edited -> resubmitted as Completed shows up here with the
    // admin/manager's last status choice and remarks already filled in, so
    // review always starts with full prior context instead of a blank
    // slate — the admin can leave it as-is (re-save with updated notes) or
    // change the verdict entirely (e.g. switch to "Completed" to approve).
    useEffect(() => {
        resetReviewForm({
            admin_status: task?.admin_status
                ? ADMIN_STATUS_OPTIONS.find(
                      (o) => o.value === task.admin_status,
                  ) || null
                : null,
            admin_remarks: task?.admin_remarks || "",
        });
        setEditingDueDate(false);
    }, [task?.id, resetReviewForm]);

    if (!task) return null;

    const dept = getDeptStyle(task.department);
    const progress = getProgress(checklistDraft);
    const dueInfo = getDueInfo(task.due_date);

    // Completed tasks are locked: no quick-edits (status/priority/due date/
    // checklist) and no "Edit ticket" access, even if a parent passed an
    // onQuickUpdate handler.
    const isLocked = task.status === "Completed";
    const canQuickEdit = typeof onQuickUpdate === "function" && !isLocked;

    // Whether there's any admin review info to show at all (badge + summary
    // card) — independent of the task's current status.
    const hasAdminReview = Boolean(task.admin_status || task.admin_remarks);
    const adminMeta = getAdminStatusMeta(task.admin_status);
    const AdminMetaIcon = adminMeta.icon;

    // Review FORM eligibility: task must be currently Completed, viewer
    // must be admin/manager, an onReview handler must be wired up, and it
    // must not already be finalized (admin_status === "Completed" is the
    // permanent approval state — no further review once reached).
    const isFinalized = task.admin_status === "Completed";
    const needsReview =
        isLocked &&
        isPrivileged &&
        !isFinalized &&
        typeof onReview === "function";

    // Attachment deletion is only offered while the task is unlocked and a
    // handler has actually been wired up by the parent.
    const canDeleteAttachments =
        !isLocked && typeof onDeleteAttachment === "function";

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
        if (merged.description)
            formData.append("description", merged.description);
        formData.append("status", merged.status);

        merged.task_items.forEach((item, index) => {
            if (item.description?.trim()) {
                formData.append(
                    `task_items[${index}][description]`,
                    item.description,
                );
                formData.append(
                    `task_items[${index}][status]`,
                    item.status || "Pending",
                );
            }
        });

        return formData;
    };

    const handleQuickSave = async (overrides, savingKey) => {
        if (isLocked) return false;
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
        if (isLocked) return;
        resetDueDateForm({ due_date: task.due_date?.slice(0, 10) || "" });
        setEditingDueDate(true);
    };

    const onDueDateSubmit = async (data) => {
        if (!data.due_date) {
            setEditingDueDate(false);
            return;
        }
        const ok = await handleQuickSave(
            { due_date: data.due_date },
            "due_date",
        );
        if (ok) setEditingDueDate(false);
    };

    // ---- Status ----
    const handleStatusChange = (e) => {
        handleQuickSave({ status: e.target.value }, "status");
    };

    // ---- Priority — same pattern as status: select saves immediately ----
    const handlePriorityChange = (e) => {
        handleQuickSave({ priority: e.target.value }, "priority");
    };

    // ---- Checklist — always-editable draft ----
    const addDraftItem = () => {
        if (isLocked) return;
        setChecklistDraft((prev) => [
            ...prev,
            {
                clientId: `new-${Date.now()}`,
                description: "",
                status: "Pending",
            },
        ]);
    };

    const removeDraftItem = (clientId) => {
        if (isLocked) return;
        setChecklistDraft((prev) =>
            prev.filter((i) => i.clientId !== clientId),
        );
    };

    const updateDraftText = (clientId, text) => {
        if (isLocked) return;
        setChecklistDraft((prev) =>
            prev.map((i) =>
                i.clientId === clientId ? { ...i, description: text } : i,
            ),
        );
    };

    const toggleDraftStatus = (clientId) => {
        if (isLocked) return;
        setChecklistDraft((prev) =>
            prev.map((i) =>
                i.clientId === clientId
                    ? {
                          ...i,
                          status:
                              i.status === "Completed"
                                  ? "Pending"
                                  : "Completed",
                      }
                    : i,
            ),
        );
    };

    const moveDraftUp = (index) => {
        if (isLocked) return;
        if (index === 0) return;
        setChecklistDraft((prev) => {
            const next = [...prev];
            [next[index - 1], next[index]] = [next[index], next[index - 1]];
            return next;
        });
    };

    const moveDraftDown = (index) => {
        if (isLocked) return;
        setChecklistDraft((prev) => {
            if (index === prev.length - 1) return prev;
            const next = [...prev];
            [next[index], next[index + 1]] = [next[index + 1], next[index]];
            return next;
        });
    };

    const saveChecklist = async () => {
        if (isLocked) return;
        const items = checklistDraft
            .filter((i) => i.description.trim() !== "")
            .map((i) => ({
                description: i.description.trim(),
                status: i.status,
            }));

        await handleQuickSave({ task_items: items }, "checklist");
    };

    // ---- Review (admin/manager verdict on a Completed task) ----
    const onReviewSubmit = async (data) => {
        if (typeof onReview !== "function") return;
        try {
            await onReview(task.id, {
                admin_status: data.admin_status.value,
                admin_remarks:
                    data.admin_remarks && data.admin_remarks !== "<p><br></p>"
                        ? data.admin_remarks
                        : null,
            });
        } catch (err) {
            console.log("Review failed", err);
        }
    };

    // ---- Attachments — delete ----
    // Reuses the parent's onDeleteAttachment (already wrapped in
    // toast.promise in TaskAssigned.jsx), so no local toast calls needed
    // here. A native confirm guards against an accidental click since
    // there's no separate "mark then confirm" step like in the edit form.
    const handleDeleteAttachmentClick = async (attachmentId) => {
        if (!canDeleteAttachments) return;
        if (!window.confirm("Delete this attachment? This can't be undone.")) {
            return;
        }
        setDeletingAttachmentId(attachmentId);
        try {
            await onDeleteAttachment(task.id, attachmentId);
        } catch (err) {
            console.log("Attachment delete failed", err);
        } finally {
            setDeletingAttachmentId(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col">
                <div
                    className="flex justify-between items-start px-6 py-4 border-b"
                    style={{ borderLeft: `6px solid ${dept.bar}` }}
                >
                    <div>
                        <span className="font-mono text-xs text-gray-400">
                            {task.task_id}
                        </span>
                        <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                            {task.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span
                                className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
                                style={{
                                    backgroundColor: dept.bg,
                                    color: dept.text,
                                }}
                            >
                                {dept.label}
                            </span>

                            {isLocked && (
                                <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                                    <Lock size={10} /> Locked
                                </span>
                            )}

                            {/* Status */}
                            {canQuickEdit ? (
                                <span className="flex items-center gap-1.5">
                                    <span
                                        className="w-1.5 h-1.5 rounded-full shrink-0"
                                        style={{
                                            backgroundColor:
                                                STATUS_STYLES[task.status]
                                                    ?.bar || "#CBD5E1",
                                        }}
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
                                        <span className="text-[10px] text-gray-400">
                                            saving…
                                        </span>
                                    )}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                STATUS_STYLES[task.status]
                                                    ?.bar || "#CBD5E1",
                                        }}
                                    />
                                    {task.status}
                                </span>
                            )}

                            {/* Priority — same quick-edit pattern as status */}
                            {canQuickEdit ? (
                                <span className="flex items-center gap-1.5">
                                    <span
                                        className="w-1.5 h-1.5 rounded-full shrink-0"
                                        style={{
                                            backgroundColor:
                                                PRIORITY_DOT[task.priority] ||
                                                "#CBD5E1",
                                        }}
                                    />
                                    <select
                                        value={task.priority}
                                        onChange={handlePriorityChange}
                                        disabled={savingField === "priority"}
                                        className="text-xs text-gray-600 border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-[#2F5D50]/30 rounded cursor-pointer disabled:opacity-50"
                                    >
                                        {PRIORITY_OPTIONS.map((p) => (
                                            <option key={p} value={p}>
                                                {p}
                                            </option>
                                        ))}
                                    </select>
                                    {savingField === "priority" && (
                                        <span className="text-[10px] text-gray-400">
                                            saving…
                                        </span>
                                    )}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                PRIORITY_DOT[task.priority] ||
                                                "#CBD5E1",
                                        }}
                                    />
                                    {task.priority} priority
                                </span>
                            )}

                            {/* Admin status badge — shown whenever a review has
                                ever happened, independent of the task's current
                                status (so it survives a Reopen -> In Progress
                                transition). */}
                            {task.admin_status && (
                                <span
                                    className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
                                    style={{
                                        backgroundColor: adminMeta.badgeBg,
                                        color: adminMeta.badgeText,
                                    }}
                                >
                                    <AdminMetaIcon size={10} />
                                    {adminMeta.label}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-5 space-y-5">
                    {error && (
                        <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    {/* ── Admin Review summary card ──────────────────────────
                        Shown whenever there's ANY review data on the task
                        (admin_status / admin_remarks), no matter what
                        task.status currently is. This persists through
                        Reopened -> re-edited -> re-Completed cycles since
                        update() never clears these fields — only review()
                        does, and only when an admin/manager explicitly
                        submits a new verdict. */}
                    {hasAdminReview && (
                        <div
                            className="rounded-xl border overflow-hidden"
                            style={{ borderColor: adminMeta.cardBorder }}
                        >
                            <div
                                className="flex items-center justify-between px-4 py-2.5 border-b"
                                style={{
                                    backgroundColor: adminMeta.cardBg,
                                    borderColor: adminMeta.cardBorder,
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                                        style={{
                                            backgroundColor: adminMeta.badgeBg,
                                        }}
                                    >
                                        <AdminMetaIcon
                                            size={13}
                                            style={{
                                                color: adminMeta.badgeText,
                                            }}
                                        />
                                    </span>
                                    <p className="text-sm font-semibold text-gray-800">
                                        Admin Review
                                    </p>
                                </div>
                                <span
                                    className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
                                    style={{
                                        backgroundColor: adminMeta.badgeBg,
                                        color: adminMeta.badgeText,
                                    }}
                                >
                                    {adminMeta.label}
                                </span>
                            </div>

                            <div className="px-4 py-3 bg-white">
                                {task.admin_remarks ? (
                                    <>
                                        <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                                            What needs attention
                                        </p>
                                        <div
                                            className="text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto pr-1
                                                [&_p]:mb-1.5 [&_p:last-child]:mb-0
                                                [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                                        >
                                            {parse(
                                                sanitizeRichText(
                                                    task.admin_remarks,
                                                ),
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">
                                        No remarks were left.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Admin/manager review FORM ──────────────────────────
                        Only shown for a Completed task that hasn't been
                        finalized yet. Two separate fields — Admin Status
                        (react-select) and Admin Remarks (Quill, fixed height
                        + internal scroll) — submitted together via one
                        Save Review button. Pre-filled from the task's
                        existing admin_status/admin_remarks, so a second or
                        third review round starts from the prior verdict
                        instead of blank. */}
                    {needsReview && (
                        <div className="rounded-xl border border-amber-200 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border-b border-amber-200">
                                <AlertCircle
                                    size={15}
                                    className="text-amber-600 shrink-0"
                                />
                                <p className="text-sm font-semibold text-amber-800">
                                    Awaiting your review
                                </p>
                            </div>

                            <div className="px-4 py-4 bg-white space-y-4">
                                {task.admin_status && (
                                    <p className="text-xs text-gray-500 -mt-1">
                                        Pre-filled with your previous review —
                                        update it if the resubmission changes
                                        your verdict.
                                    </p>
                                )}

                                {/* Field 1: Admin Status — react-select */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Admin Status
                                    </label>
                                    <Controller
                                        name="admin_status"
                                        control={reviewControl}
                                        rules={{
                                            required:
                                                "Please choose an Admin Status before saving.",
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={ADMIN_STATUS_OPTIONS}
                                                components={{
                                                    Option: AdminStatusOption,
                                                }}
                                                placeholder="Select an outcome..."
                                                isDisabled={reviewSubmitting}
                                                isClearable
                                                styles={
                                                    adminStatusSelectStyles
                                                }
                                                menuPortalTarget={
                                                    menuPortalTarget
                                                }
                                                menuPosition="fixed"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Field 2: Admin Remarks — rich text, fixed
                                    height with internal scroll once content
                                    grows past that height. */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Admin Remarks
                                    </label>
                                    <Controller
                                        name="admin_remarks"
                                        control={reviewControl}
                                        render={({ field }) => (
                                            <div
                                                className="rounded-lg border border-gray-200 overflow-hidden
                                                    [&_.ql-toolbar]:sticky [&_.ql-toolbar]:top-0 [&_.ql-toolbar]:z-10 [&_.ql-toolbar]:bg-white
                                                    [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200
                                                    [&_.ql-container]:border-none
                                                    [&_.ql-editor]:h-[180px] [&_.ql-editor]:max-h-[180px] [&_.ql-editor]:overflow-y-auto"
                                            >
                                                <ReactQuill
                                                    theme="snow"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    readOnly={
                                                        reviewSubmitting
                                                    }
                                                    modules={QUILL_MODULES}
                                                    formats={QUILL_FORMATS}
                                                    placeholder="Describe what needs to change, or leave approval notes..."
                                                />
                                            </div>
                                        )}
                                    />
                                </div>

                                {reviewErrors.admin_status && (
                                    <p className="text-xs text-red-600">
                                        {reviewErrors.admin_status.message}
                                    </p>
                                )}

                                {/* Save button below both fields */}
                                <div className="flex justify-end pt-1">
                                    <button
                                        type="button"
                                        onClick={handleReviewSubmit(
                                            onReviewSubmit,
                                        )}
                                        disabled={reviewSubmitting}
                                        className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 font-medium"
                                    >
                                        {reviewSubmitting
                                            ? "Saving..."
                                            : "Save Review"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow
                            label="Assigned to"
                            value={task.assigned_user?.name}
                        />
                        <DetailRow
                            label="Assigned by"
                            value={task.creator?.name}
                        />
                        <DetailRow
                            label="Start date"
                            value={task.start_date?.slice(0, 10)}
                        />

                        {/* Due date — click to edit, small button confirms the save */}
                        <div>
                            <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">
                                Due date
                            </p>
                            {canQuickEdit && editingDueDate ? (
                                <form
                                    onSubmit={handleDueDateSubmit(
                                        onDueDateSubmit,
                                    )}
                                    className="flex flex-col gap-1"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            autoFocus
                                            disabled={
                                                savingField === "due_date"
                                            }
                                            {...registerDueDate("due_date", {
                                                required: true,
                                                validate: (value) =>
                                                    !value ||
                                                    !task.start_date ||
                                                    value >=
                                                        task.start_date.slice(
                                                            0,
                                                            10,
                                                        ) ||
                                                    "Can't be before the start date",
                                            })}
                                            onKeyDown={(e) => {
                                                if (e.key === "Escape")
                                                    setEditingDueDate(false);
                                            }}
                                            className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 disabled:opacity-50"
                                        />
                                        <button
                                            type="submit"
                                            disabled={
                                                savingField === "due_date"
                                            }
                                            title="Confirm due date"
                                            className="p-1 rounded-full bg-[#2F5D50] text-white hover:bg-[#264C41] disabled:opacity-50"
                                        >
                                            <Check size={12} />
                                        </button>
                                        {savingField === "due_date" && (
                                            <span className="text-[10px] text-gray-400">
                                                saving…
                                            </span>
                                        )}
                                    </div>
                                    {dueDateErrors.due_date && (
                                        <p className="text-[11px] text-red-500">
                                            {dueDateErrors.due_date.message ||
                                                "Due date is required"}
                                        </p>
                                    )}
                                </form>
                            ) : (
                                <button
                                    type="button"
                                    onClick={
                                        canQuickEdit
                                            ? startEditingDueDate
                                            : undefined
                                    }
                                    className={`text-sm flex items-center gap-1.5 ${
                                        canQuickEdit
                                            ? "hover:text-[#2F5D50] cursor-pointer"
                                            : "cursor-default"
                                    } ${dueInfo ? dueInfo.color : "text-gray-800"}`}
                                >
                                    {task.due_date?.slice(0, 10) || "—"}
                                    {dueInfo && <span>· {dueInfo.text}</span>}
                                    {canQuickEdit && (
                                        <Calendar
                                            size={12}
                                            className="text-gray-400"
                                        />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {task.description && (
                        <div>
                            <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                                Description
                            </p>
                            <div
                                className="text-sm text-gray-700 leading-relaxed
                                    [&_p]:mb-1.5 [&_p:last-child]:mb-0
                                    [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                            >
                                {parse(sanitizeRichText(task.description))}
                            </div>
                        </div>
                    )}

                    {/* Checklist — always in an editable draft state when
                        unlocked (no toggle button). */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                                    Checklist
                                </p>
                                {checklistDraft.length > 0 && (
                                    <span className="text-xs text-gray-400">
                                        {progress}% complete
                                    </span>
                                )}
                            </div>
                            {canQuickEdit && (
                                <button
                                    type="button"
                                    onClick={addDraftItem}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
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
                                            No items yet. Click "Add item" to
                                            create one.
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
                                                    onClick={() =>
                                                        toggleDraftStatus(
                                                            item.clientId,
                                                        )
                                                    }
                                                    className="shrink-0"
                                                    title={
                                                        item.status ===
                                                        "Completed"
                                                            ? "Mark as incomplete"
                                                            : "Mark as complete"
                                                    }
                                                >
                                                    {item.status ===
                                                    "Completed" ? (
                                                        <CheckCircle2
                                                            size={18}
                                                            className="text-[#2F5D50]"
                                                        />
                                                    ) : (
                                                        <Circle
                                                            size={18}
                                                            className="text-gray-300"
                                                        />
                                                    )}
                                                </button>

                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) =>
                                                        updateDraftText(
                                                            item.clientId,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={`Item ${index + 1}`}
                                                    className={`flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 ${
                                                        item.status ===
                                                        "Completed"
                                                            ? "line-through text-gray-400"
                                                            : "text-gray-700"
                                                    }`}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        moveDraftUp(index)
                                                    }
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
                                                    onClick={() =>
                                                        moveDraftDown(index)
                                                    }
                                                    disabled={
                                                        index ===
                                                        checklistDraft.length -
                                                            1
                                                    }
                                                    title="Move down"
                                                    className={`p-1 rounded ${
                                                        index ===
                                                        checklistDraft.length -
                                                            1
                                                            ? "text-gray-300 cursor-not-allowed"
                                                            : "text-gray-500 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    <ArrowDown size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeDraftItem(
                                                            item.clientId,
                                                        )
                                                    }
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
                                        className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {savingField === "checklist"
                                            ? "Saving..."
                                            : "Save checklist"}
                                    </button>
                                </div>
                            </div>
                        ) : task.task_items?.length > 0 ? (
                            <div className="space-y-1.5">
                                {task.task_items.map((item, i) => (
                                    <div
                                        key={item.id ?? i}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        {item.status === "Completed" ? (
                                            <CheckCircle2
                                                size={16}
                                                className="text-[#2F5D50] shrink-0"
                                            />
                                        ) : (
                                            <Circle
                                                size={16}
                                                className="text-gray-300 shrink-0"
                                            />
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
                            <p className="text-sm text-gray-400 italic">
                                No checklist items yet.
                            </p>
                        )}
                    </div>

                    {/* Attachments — images render inline, PDFs render in a
                        scrollable/zoomable inline viewer. Deletion is offered
                        here whenever the task is unlocked and a parent
                        onDeleteAttachment handler is wired up (mirrors
                        EditTaskAssignedForm's delete capability, minus the
                        "mark then confirm" two-step — this uses a native
                        confirm() instead since there's no separate save step
                        in this popup). */}
                    {task.attachments?.length > 0 && (
                        <div>
                            <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                                Attachments ({task.attachments.length})
                            </p>
                            <div className="space-y-4">
                                {task.attachments.map((att) => {
                                    const url = attachmentUrl(att.attachment);
                                    const fileName = att.attachment
                                        .split("/")
                                        .pop();
                                    const isPdf = isPdfFile(att.attachment);
                                    const isDeleting =
                                        deletingAttachmentId === att.id;

                                    return (
                                        <div
                                            key={att.id}
                                            className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-100">
                                                <span className="flex items-center gap-1.5 text-xs text-gray-600 truncate">
                                                    <Paperclip
                                                        size={12}
                                                        className="shrink-0 text-gray-400"
                                                    />
                                                    {fileName}
                                                </span>
                                                <div className="flex items-center gap-3 shrink-0 ml-2">
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[11px] text-indigo-600 hover:underline"
                                                    >
                                                        Open in new tab
                                                    </a>
                                                    {canDeleteAttachments && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteAttachmentClick(
                                                                    att.id,
                                                                )
                                                            }
                                                            disabled={
                                                                isDeleting
                                                            }
                                                            title="Delete attachment"
                                                            className="text-red-500 hover:text-red-700 disabled:opacity-40"
                                                        >
                                                            <Trash2
                                                                size={14}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {isPdf ? (
                                                <div
                                                    style={{ height: "420px" }}
                                                >
                                                    <AttachmentPdfViewer
                                                        url={url}
                                                    />
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
                    {isLocked ? (
                        <span
                            className="px-5 py-2 flex items-center gap-2 rounded-full bg-gray-100 text-gray-400 text-sm cursor-not-allowed select-none"
                            title="Completed tickets are locked from editing"
                        >
                            <Lock size={14} /> Locked
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onEdit(task)}
                            className="px-5 py-2 flex items-center gap-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                        >
                            <Pencil size={15} /> Edit ticket
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPopup;
