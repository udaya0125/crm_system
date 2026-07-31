// import React, { useState } from "react";
// import {
//     X,
//     Edit,
//     FileText,
//     Calendar,
//     CheckCircle,
//     Circle,
//     Square,
//     Clock,
//     Check,
// } from "lucide-react";
// import parse from "html-react-parser";

// // ─── Shared helpers (mirrors the pattern in PopupComponents/TaskDetailPopup) ─

// export const getDueInfo = (dueDate, isCompleted) => {
//     if (!dueDate || isCompleted) return null;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const due = new Date(dueDate);
//     const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

//     if (diffDays < 0)
//         return { text: `${Math.abs(diffDays)}d overdue`, color: "text-red-600" };
//     if (diffDays === 0)
//         return { text: "Due today", color: "text-orange-600" };
//     if (diffDays <= 2)
//         return { text: `${diffDays}d left`, color: "text-orange-500" };
//     return { text: `${diffDays}d left`, color: "text-gray-500" };
// };

// export const formatDate = (dateString) => {
//     if (!dateString) return "No due date";
//     const date = new Date(dateString);
//     return `${String(date.getDate()).padStart(2, "0")}/${String(
//         date.getMonth() + 1,
//     ).padStart(2, "0")}/${date.getFullYear()}`;
// };

// // How long a todo took to finish, i.e. the gap between when it was created
// // and when it was last saved as complete. Relies on `is_completed` being
// // set in the same request that produces the final `updated_at` — which is
// // how TodoController::update() already works, so `updated_at` is the
// // completion timestamp.
// export const getCompletionDuration = (todo) => {
//     if (!todo?.is_completed || !todo.created_at || !todo.updated_at) {
//         return null;
//     }

//     const start = new Date(todo.created_at);
//     const end = new Date(todo.updated_at);
//     const diffMs = end - start;
//     if (diffMs <= 0) return "Under a minute";

//     const minutes = Math.floor(diffMs / 60000);
//     const days = Math.floor(minutes / 1440);
//     const hours = Math.floor((minutes % 1440) / 60);
//     const mins = minutes % 60;

//     if (days > 0) return `${days}d ${hours}h`;
//     if (hours > 0) return `${hours}h ${mins}m`;
//     if (mins > 0) return `${mins}m`;
//     return "Under a minute";
// };

// // Custom parser to replace rich-text HTML elements from ReactQuill output
// // with Lucide icons (checklists, ordered lists, etc). Lives here now since
// // the description timeline only renders inside this popup.
// const parseWithIcons = (html) => {
//     if (!html) return null;

//     const elements = parse(html);

//     const replaceElements = (node) => {
//         if (!node || typeof node !== "object") return node;
//         if (Array.isArray(node)) return node.map(replaceElements);

//         if (node.props && node.props.children) {
//             if (node.type === "ul" || node.type === "ol") {
//                 const children = React.Children.map(
//                     node.props.children,
//                     (child, index) => {
//                         if (child && child.props && child.type === "li") {
//                             return React.cloneElement(child, {
//                                 className: `${
//                                     child.props.className || ""
//                                 } flex items-start gap-2 py-1`,
//                                 children: (
//                                     <>
//                                         {node.type === "ul" ? (
//                                             <CheckCircle
//                                                 size={12}
//                                                 className="mt-1.5 text-indigo-500 flex-shrink-0"
//                                             />
//                                         ) : (
//                                             <span className="text-sm font-medium text-indigo-600 w-5 flex-shrink-0">
//                                                 {index + 1}.
//                                             </span>
//                                         )}
//                                         <span className="flex-1">
//                                             {replaceElements(
//                                                 child.props.children,
//                                             )}
//                                         </span>
//                                     </>
//                                 ),
//                             });
//                         }
//                         return child;
//                     },
//                 );

//                 return React.createElement(node.type, {
//                     ...node.props,
//                     className: `${node.props.className || ""} space-y-2 my-2`,
//                     children,
//                 });
//             }

//             if (
//                 node.props.className &&
//                 node.props.className.includes("ql-direction")
//             ) {
//                 const children = React.Children.map(
//                     node.props.children,
//                     (child) => {
//                         if (child && child.props && child.type === "span") {
//                             const isChecked =
//                                 child.props.style?.textDecoration ===
//                                 "line-through";
//                             return React.cloneElement(child, {
//                                 children: (
//                                     <div className="flex items-center gap-2">
//                                         {isChecked ? (
//                                             <CheckCircle
//                                                 size={16}
//                                                 className="text-green-500 flex-shrink-0"
//                                             />
//                                         ) : (
//                                             <Square
//                                                 size={16}
//                                                 className="text-gray-400 flex-shrink-0"
//                                             />
//                                         )}
//                                         <span
//                                             className={
//                                                 isChecked
//                                                     ? "line-through text-gray-500"
//                                                     : ""
//                                             }
//                                         >
//                                             {child.props.children}
//                                         </span>
//                                     </div>
//                                 ),
//                             });
//                         }
//                         return child;
//                     },
//                 );

//                 return React.createElement("div", {
//                     ...node.props,
//                     children,
//                 });
//             }

//             const newChildren = React.Children.map(
//                 node.props.children,
//                 replaceElements,
//             );
//             return React.cloneElement(node, { children: newChildren });
//         }

//         return node;
//     };

//     return replaceElements(elements);
// };

// // ─── Popup ───────────────────────────────────────────────────────────────

// const TodoDetailPopup = ({ todo, onClose, onEdit, onQuickUpdate }) => {
//     const [marking, setMarking] = useState(false);

//     if (!todo) return null;

//     const isLocked = todo.is_completed;
//     const dueInfo = getDueInfo(todo.due_date, isLocked);
//     const completionDuration = getCompletionDuration(todo);
//     const barColor = isLocked
//         ? "#2F5D50"
//         : dueInfo?.color === "text-red-600"
//           ? "#D64545"
//           : "#F2A93B";

//     const canQuickComplete = !isLocked && typeof onQuickUpdate === "function";

//     // Quick "mark complete" — only sends the fields needed to flip
//     // is_completed. Deliberately omits `descriptions` so the controller's
//     // `array_key_exists('descriptions', $validated)` check stays false and
//     // the existing description timeline is left untouched.
//     const handleMarkComplete = async () => {
//         if (!canQuickComplete) return;
//         setMarking(true);
//         try {
//             const formData = new FormData();
//             formData.append("title", todo.title);
//             if (todo.due_date) {
//                 formData.append("due_date", todo.due_date.slice(0, 10));
//             }
//             formData.append("is_completed", "1");
//             await onQuickUpdate(formData, todo.id);
//         } catch (err) {
//             console.log("Marking todo complete failed", err);
//         } finally {
//             setMarking(false);
//         }
//     };

//     return (
//         <div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//             onClick={onClose}
//         >
//             <div
//                 className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Header */}
//                 <div
//                     className="flex justify-between items-start px-6 py-4 border-b"
//                     style={{ borderLeft: `6px solid ${barColor}` }}
//                 >
//                     <div>
//                         <span className="font-mono text-xs text-gray-400">
//                             TD-{String(todo.id).padStart(4, "0")}
//                         </span>
//                         <h2 className="text-xl font-bold text-gray-900 mt-0.5">
//                             {todo.title}
//                         </h2>
//                         <div className="flex items-center gap-3 mt-2 flex-wrap">
//                             <span
//                                 className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
//                                     isLocked
//                                         ? "bg-green-100 text-green-800"
//                                         : "bg-yellow-100 text-yellow-800"
//                                 }`}
//                             >
//                                 {isLocked ? (
//                                     <CheckCircle size={12} />
//                                 ) : (
//                                     <Circle size={12} />
//                                 )}
//                                 {isLocked ? "Complete" : "Incomplete"}
//                             </span>

//                             <span
//                                 className={`flex items-center gap-1 text-xs ${
//                                     dueInfo ? dueInfo.color : "text-gray-500"
//                                 }`}
//                             >
//                                 <Clock size={12} />
//                                 {formatDate(todo.due_date)}
//                                 {dueInfo && <span>· {dueInfo.text}</span>}
//                             </span>

//                             {completionDuration && (
//                                 <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
//                                     <Check size={12} />
//                                     Completed in {completionDuration}
//                                 </span>
//                             )}

//                             {canQuickComplete && (
//                                 <button
//                                     type="button"
//                                     onClick={handleMarkComplete}
//                                     disabled={marking}
//                                     className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
//                                 >
//                                     <Check size={12} />
//                                     {marking ? "Marking..." : "Mark complete"}
//                                 </button>
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

//                 {/* Body */}
//                 <div className="overflow-y-auto px-6 py-5">
//                     {todo.descriptions && todo.descriptions.length > 0 ? (
//                         <div className="space-y-4">
//                             {todo.descriptions
//                                 .slice()
//                                 .reverse()
//                                 .map((description, index) => (
//                                     <div
//                                         key={index}
//                                         className="bg-gray-50 border border-gray-200 rounded-lg p-4"
//                                     >
//                                         <div className="flex items-start gap-3 mb-3">
//                                             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//                                                 <span className="text-sm font-semibold text-blue-600">
//                                                     T
//                                                 </span>
//                                             </div>
//                                             <div className="flex-1">
//                                                 <div className="flex justify-between items-start mb-2">
//                                                     <h2 className="font-medium text-gray-800">
//                                                         Todo Description
//                                                     </h2>
//                                                     <div className="flex gap-2 items-center">
//                                                         <Calendar
//                                                             size={14}
//                                                             className="text-gray-400"
//                                                         />
//                                                         <p className="text-xs text-gray-500">
//                                                             {description.created_at
//                                                                 ? new Date(
//                                                                       description.created_at,
//                                                                   ).toLocaleString()
//                                                                 : "Unknown date"}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="pl-13">
//                                             <div className="prose max-w-none text-md text-gray-700 pl-4 py-2">
//                                                 {parseWithIcons(
//                                                     description.description ||
//                                                         "",
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
//                             <FileText
//                                 size={64}
//                                 className="mx-auto text-gray-300 mb-3"
//                             />
//                             <h4 className="text-lg font-medium text-gray-500 mb-2">
//                                 No descriptions available
//                             </h4>
//                             <p className="text-gray-400 text-sm">
//                                 There are no descriptions for this todo yet.
//                             </p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
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
//                             title="Completed todos are locked from editing"
//                         >
//                             <CheckCircle size={14} /> Locked
//                         </span>
//                     ) : (
//                         <button
//                             type="button"
//                             onClick={() => onEdit(todo)}
//                             className="px-5 py-2 flex items-center gap-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
//                         >
//                             <Edit size={15} /> Edit todo
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TodoDetailPopup;



import React, { useState } from "react";
import {
    X,
    Edit,
    FileText,
    Calendar,
    CheckCircle,
    Circle,
    Square,
    Clock,
    Check,
    AlertTriangle,
} from "lucide-react";
import parse from "html-react-parser";

// ─── Shared helpers (mirrors the pattern in PopupComponents/TaskDetailPopup) ─

export const getDueInfo = (dueDate, isCompleted) => {
    if (!dueDate || isCompleted) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
        return { text: `${Math.abs(diffDays)}d overdue`, color: "text-red-600" };
    if (diffDays === 0)
        return { text: "Due today", color: "text-orange-600" };
    if (diffDays <= 2)
        return { text: `${diffDays}d left`, color: "text-orange-500" };
    return { text: `${diffDays}d left`, color: "text-gray-500" };
};

export const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1,
    ).padStart(2, "0")}/${date.getFullYear()}`;
};

// How long a todo took to finish, i.e. the gap between when it was created
// and when it was last saved as complete. Relies on `is_completed` being
// set in the same request that produces the final `updated_at` — which is
// how TodoController::update() already works, so `updated_at` is the
// completion timestamp.
export const getCompletionDuration = (todo) => {
    if (!todo?.is_completed || !todo.created_at || !todo.updated_at) {
        return null;
    }

    const start = new Date(todo.created_at);
    const end = new Date(todo.updated_at);
    const diffMs = end - start;
    if (diffMs <= 0) return "Under a minute";

    const minutes = Math.floor(diffMs / 60000);
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) return `${mins}m`;
    return "Under a minute";
};

// Whether a completed todo was finished after its due date. Compares the
// completion timestamp (`updated_at`) against the end of the due date's
// day, so completing it anytime on the due date itself still counts as
// on-time.
export const isLateCompletion = (todo) => {
    if (!todo?.is_completed || !todo.due_date || !todo.updated_at) {
        return false;
    }

    const due = new Date(todo.due_date);
    due.setHours(23, 59, 59, 999);
    const completedAt = new Date(todo.updated_at);

    return completedAt > due;
};

// Custom parser to replace rich-text HTML elements from ReactQuill output
// with Lucide icons (checklists, ordered lists, etc). Lives here now since
// the description timeline only renders inside this popup.
const parseWithIcons = (html) => {
    if (!html) return null;

    const elements = parse(html);

    const replaceElements = (node) => {
        if (!node || typeof node !== "object") return node;
        if (Array.isArray(node)) return node.map(replaceElements);

        if (node.props && node.props.children) {
            if (node.type === "ul" || node.type === "ol") {
                const children = React.Children.map(
                    node.props.children,
                    (child, index) => {
                        if (child && child.props && child.type === "li") {
                            return React.cloneElement(child, {
                                className: `${
                                    child.props.className || ""
                                } flex items-start gap-2 py-1`,
                                children: (
                                    <>
                                        {node.type === "ul" ? (
                                            <CheckCircle
                                                size={12}
                                                className="mt-1.5 text-indigo-500 flex-shrink-0"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-indigo-600 w-5 flex-shrink-0">
                                                {index + 1}.
                                            </span>
                                        )}
                                        <span className="flex-1">
                                            {replaceElements(
                                                child.props.children,
                                            )}
                                        </span>
                                    </>
                                ),
                            });
                        }
                        return child;
                    },
                );

                return React.createElement(node.type, {
                    ...node.props,
                    className: `${node.props.className || ""} space-y-2 my-2`,
                    children,
                });
            }

            if (
                node.props.className &&
                node.props.className.includes("ql-direction")
            ) {
                const children = React.Children.map(
                    node.props.children,
                    (child) => {
                        if (child && child.props && child.type === "span") {
                            const isChecked =
                                child.props.style?.textDecoration ===
                                "line-through";
                            return React.cloneElement(child, {
                                children: (
                                    <div className="flex items-center gap-2">
                                        {isChecked ? (
                                            <CheckCircle
                                                size={16}
                                                className="text-green-500 flex-shrink-0"
                                            />
                                        ) : (
                                            <Square
                                                size={16}
                                                className="text-gray-400 flex-shrink-0"
                                            />
                                        )}
                                        <span
                                            className={
                                                isChecked
                                                    ? "line-through text-gray-500"
                                                    : ""
                                            }
                                        >
                                            {child.props.children}
                                        </span>
                                    </div>
                                ),
                            });
                        }
                        return child;
                    },
                );

                return React.createElement("div", {
                    ...node.props,
                    children,
                });
            }

            const newChildren = React.Children.map(
                node.props.children,
                replaceElements,
            );
            return React.cloneElement(node, { children: newChildren });
        }

        return node;
    };

    return replaceElements(elements);
};

// ─── Popup ───────────────────────────────────────────────────────────────

const TodoDetailPopup = ({ todo, onClose, onEdit, onQuickUpdate }) => {
    const [marking, setMarking] = useState(false);

    if (!todo) return null;

    const isLocked = todo.is_completed;
    const dueInfo = getDueInfo(todo.due_date, isLocked);
    const completionDuration = getCompletionDuration(todo);
    const lateCompletion = isLateCompletion(todo);

    const barColor = isLocked
        ? lateCompletion
            ? "#D64545"
            : "#2F5D50"
        : dueInfo?.color === "text-red-600"
          ? "#D64545"
          : "#F2A93B";

    const canQuickComplete = !isLocked && typeof onQuickUpdate === "function";

    // Quick "mark complete" — only sends the fields needed to flip
    // is_completed. Deliberately omits `descriptions` so the controller's
    // `array_key_exists('descriptions', $validated)` check stays false and
    // the existing description timeline is left untouched.
    const handleMarkComplete = async () => {
        if (!canQuickComplete) return;
        setMarking(true);
        try {
            const formData = new FormData();
            formData.append("title", todo.title);
            if (todo.due_date) {
                formData.append("due_date", todo.due_date.slice(0, 10));
            }
            formData.append("is_completed", "1");
            await onQuickUpdate(formData, todo.id);
        } catch (err) {
            console.log("Marking todo complete failed", err);
        } finally {
            setMarking(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex justify-between items-start px-6 py-4 border-b"
                    style={{ borderLeft: `6px solid ${barColor}` }}
                >
                    <div>
                        <span className="font-mono text-xs text-gray-400">
                            TD-{String(todo.id).padStart(4, "0")}
                        </span>
                        <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                            {todo.title}
                        </h2>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span
                                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                    isLocked
                                        ? lateCompletion
                                            ? "bg-red-100 text-red-800"
                                            : "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                                {isLocked ? (
                                    lateCompletion ? (
                                        <AlertTriangle size={12} />
                                    ) : (
                                        <CheckCircle size={12} />
                                    )
                                ) : (
                                    <Circle size={12} />
                                )}
                                {isLocked
                                    ? lateCompletion
                                        ? "Completed late"
                                        : "Complete"
                                    : "Incomplete"}
                            </span>

                            {/* Due-date / days-remaining row — only relevant
                                while the todo is still open. Once it's
                                completed, the completion badge below tells
                                the whole story instead. */}
                            {!isLocked && (
                                <span
                                    className={`flex items-center gap-1 text-xs ${
                                        dueInfo
                                            ? dueInfo.color
                                            : "text-gray-500"
                                    }`}
                                >
                                    <Clock size={12} />
                                    {formatDate(todo.due_date)}
                                    {dueInfo && <span>· {dueInfo.text}</span>}
                                </span>
                            )}

                            {completionDuration && (
                                <span
                                    className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                                        lateCompletion
                                            ? "text-red-700 bg-red-50"
                                            : "text-green-700 bg-green-50"
                                    }`}
                                >
                                    <Check size={12} />
                                    Completed in {completionDuration}
                                    {lateCompletion && (
                                        <span>
                                            {" "}
                                            (past due {formatDate(
                                                todo.due_date,
                                            )})
                                        </span>
                                    )}
                                </span>
                            )}

                            {canQuickComplete && (
                                <button
                                    type="button"
                                    onClick={handleMarkComplete}
                                    disabled={marking}
                                    className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                                >
                                    <Check size={12} />
                                    {marking ? "Marking..." : "Mark complete"}
                                </button>
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

                {/* Body */}
                <div className="overflow-y-auto px-6 py-5">
                    {todo.descriptions && todo.descriptions.length > 0 ? (
                        <div className="space-y-4">
                            {todo.descriptions
                                .slice()
                                .reverse()
                                .map((description, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-semibold text-blue-600">
                                                    T
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h2 className="font-medium text-gray-800">
                                                        Todo Description
                                                    </h2>
                                                    <div className="flex gap-2 items-center">
                                                        <Calendar
                                                            size={14}
                                                            className="text-gray-400"
                                                        />
                                                        <p className="text-xs text-gray-500">
                                                            {description.created_at
                                                                ? new Date(
                                                                      description.created_at,
                                                                  ).toLocaleString()
                                                                : "Unknown date"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pl-13">
                                            <div className="prose max-w-none text-md text-gray-700 pl-4 py-2">
                                                {parseWithIcons(
                                                    description.description ||
                                                        "",
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                            <FileText
                                size={64}
                                className="mx-auto text-gray-300 mb-3"
                            />
                            <h4 className="text-lg font-medium text-gray-500 mb-2">
                                No descriptions available
                            </h4>
                            <p className="text-gray-400 text-sm">
                                There are no descriptions for this todo yet.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
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
                            title="Completed todos are locked from editing"
                        >
                            <CheckCircle size={14} /> Locked
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onEdit(todo)}
                            className="px-5 py-2 flex items-center gap-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                        >
                         Edit todo
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodoDetailPopup;