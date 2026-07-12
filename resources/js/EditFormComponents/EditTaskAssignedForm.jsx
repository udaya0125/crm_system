import axios from "axios";
import {
    X,
    Paperclip,
    FileText,
    UploadCloud,
    Check,
    RotateCcw,
    Lock,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { usePage } from "@inertiajs/react";
import { useForm, Controller } from "react-hook-form";

const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
];

const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
];

const ROLES = {
    ADMIN: "admin",
    MANAGER: "manager",
    DEVELOPER: "developer",
    TECHNICIAN: "technician",
    ACCOUNTANT: "accountant",
    USER: "user",
};

const DEPARTMENT_OPTIONS = [
    { value: ROLES.DEVELOPER, label: "Developer" },
    { value: ROLES.TECHNICIAN, label: "Technician" },
    { value: ROLES.ACCOUNTANT, label: "Accountant" },
    { value: ROLES.USER, label: "User" },
];

// Accepted attachment types (kept in sync with backend validation:
// mimes:jpg,jpeg,png,gif,webp,pdf | max:10240)
const ACCEPTED_FILE_TYPES = "image/jpeg,image/png,image/gif,image/webp,application/pdf";
const isImageFile = (file) => !!file?.type?.startsWith("image/");
const isImagePath = (path = "") => /\.(jpe?g|png|gif|webp)$/i.test(path);

const QUILL_MODULES = {
    toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
    ],
};
const QUILL_FORMATS = ["bold", "italic", "underline", "list", "bullet"];

// NOTE: In practice this form should never be opened for a Completed task —
// TaskAssigned.jsx's handleEdit() guard and the TaskCard/TaskDetailPopup UI
// no longer offer an entry point once a task is Completed. The isLocked
// checks below are a defensive second layer in case this form is ever
// reached some other way. Admin review (reopen/approve) is handled
// separately in TaskDetailPopup and no longer lives in this form at all.
const EditTaskAssignedForm = ({
    showForm,
    setShowForm,
    editingTaskAssigned,
    setEditingTaskAssigned,
    handleUpdate,
    onDeleteAttachment,
}) => {
    const { auth } = usePage().props;
    const currentUser = auth?.user;

    const [submitting, setSubmitting] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [attachmentPreviews, setAttachmentPreviews] = useState([]); // [{ name, isImage, url }]
    const [existingAttachments, setExistingAttachments] = useState([]);
    const [markedForDelete, setMarkedForDelete] = useState(() => new Set());
    const [deletingAttachmentId, setDeletingAttachmentId] = useState(null);
    const [attachmentError, setAttachmentError] = useState("");
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [menuPortalTarget, setMenuPortalTarget] = useState(null);
     const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            department: null,
            assigned_team: null,
            assigned_by: null,
            priority: null,
            start_date: "",
            due_date: "",
            description: "",
            status: "Pending",
        },
    });

    // Completed tasks are locked: no field edits, no attachment add/remove.
    const isLocked = editingTaskAssigned?.status === "Completed";
    const startDate = watch("start_date");

    useEffect(() => {
        setMenuPortalTarget(document.body);
    }, []);

    useEffect(() => {
        if (!showForm) return;

        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";

        return () => {
            document.body.style.overflow = "unset";
            document.body.style.position = "static";
            document.body.style.width = "auto";
        };
    }, [showForm]);

    useEffect(() => {
        const next = attachments.map((file) => ({
            name: file.name,
            isImage: isImageFile(file),
            url: isImageFile(file) ? URL.createObjectURL(file) : null,
        }));
        setAttachmentPreviews(next);

        return () => {
            next.forEach((p) => p.url && URL.revokeObjectURL(p.url));
        };
    }, [attachments]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const response = await axios.get(route("ourusers.index"));
                const userOptions = (response.data.users || []).map((u) => ({
                    value: u.id,
                    label: u.role ? `${u.name} (${u.role})` : u.name,
                    role: u.role,
                }));
                setUsers(userOptions);
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (editingTaskAssigned && users.length > 0) {
            const selectedAssignee = users.find(
                (u) => u.value === parseInt(editingTaskAssigned.assigned_team)
            );
            const selectedAssigner = users.find(
                (u) => u.value === parseInt(editingTaskAssigned.user_id)
            );
            const selectedPriority = priorityOptions.find(
                (p) => p.value === editingTaskAssigned.priority
            );

            reset({
                title: editingTaskAssigned.title || "",
                department: editingTaskAssigned.department
                    ? DEPARTMENT_OPTIONS.find((d) => d.value === editingTaskAssigned.department) || {
                          value: editingTaskAssigned.department,
                          label: editingTaskAssigned.department,
                      }
                    : null,
                assigned_team:
                    selectedAssignee ||
                    (editingTaskAssigned.assigned_user
                        ? {
                              value: editingTaskAssigned.assigned_user.id,
                              label: editingTaskAssigned.assigned_user.role
                                  ? `${editingTaskAssigned.assigned_user.name} (${editingTaskAssigned.assigned_user.role})`
                                  : editingTaskAssigned.assigned_user.name,
                          }
                        : null),
                assigned_by:
                    selectedAssigner ||
                    (editingTaskAssigned.creator
                        ? {
                              value: editingTaskAssigned.creator.id,
                              label: editingTaskAssigned.creator.role
                                  ? `${editingTaskAssigned.creator.name} (${editingTaskAssigned.creator.role})`
                                  : editingTaskAssigned.creator.name,
                          }
                        : null),
                priority: selectedPriority || null,
                start_date: editingTaskAssigned.start_date?.slice(0, 10) || "",
                due_date: editingTaskAssigned.due_date?.slice(0, 10) || "",
                description: editingTaskAssigned.description || "",
                status: editingTaskAssigned.status || "Pending",
            });
            setExistingAttachments(editingTaskAssigned.attachments || []);
            setAttachments([]);
            setMarkedForDelete(new Set());
            setAttachmentError("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingTaskAssigned, users]);

    const resetForm = () => {
        reset({
            title: "",
            department: null,
            assigned_team: null,
            assigned_by: null,
            priority: null,
            start_date: "",
            due_date: "",
            description: "",
            status: "Pending",
        });
        setAttachments([]);
        setExistingAttachments([]);
        setMarkedForDelete(new Set());
        setAttachmentError("");
    };

    const addFiles = (fileList) => {
        if (isLocked) return;
        const incoming = Array.from(fileList || []);
        if (!incoming.length) return;
        setAttachments((prev) => [...prev, ...incoming]);
    };

    const handleFileChange = (e) => {
        addFiles(e.target.files);
        e.target.value = "";
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        addFiles(e.dataTransfer.files);
    };

    const removeAttachment = (index) => {
        if (isLocked) return;
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleMarkForDelete = (attachmentId) => {
        if (isLocked) return;
        setAttachmentError("");
        setMarkedForDelete((prev) => {
            const next = new Set(prev);
            if (next.has(attachmentId)) {
                next.delete(attachmentId);
            } else {
                next.add(attachmentId);
            }
            return next;
        });
    };

    const confirmDeleteAttachment = async (attachmentId) => {
        if (isLocked) return;
        if (typeof onDeleteAttachment !== "function" || !editingTaskAssigned) return;

        setAttachmentError("");
        setDeletingAttachmentId(attachmentId);
        try {
            await onDeleteAttachment(editingTaskAssigned.id, attachmentId);
            setExistingAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
            setMarkedForDelete((prev) => {
                const next = new Set(prev);
                next.delete(attachmentId);
                return next;
            });
        } catch (error) {
            console.log("Error deleting attachment", error);
            setAttachmentError("Couldn't delete that attachment. Please try again.");
        } finally {
            setDeletingAttachmentId(null);
        }
    };

    const onSubmit = async (data) => {
        if (isLocked) return;
        setSubmitting(true);

        try {
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("start_date", data.start_date);
            formData.append("due_date", data.due_date);
            if (data.description && data.description !== "<p><br></p>") {
                formData.append("description", data.description);
            }

            formData.append("status", data.status);

            if (data.assigned_team) formData.append("assigned_team", data.assigned_team.value);
            if (data.assigned_by) formData.append("user_id", data.assigned_by.value);
            if (data.priority) formData.append("priority", data.priority.value);

            attachments.forEach((file) => formData.append("attachments[]", file));

            await handleUpdate(formData, editingTaskAssigned.id);

            resetForm();
            setShowForm(false);
            setEditingTaskAssigned(null);
        } catch (error) {
            console.log("Error updating data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingTaskAssigned(null);
        resetForm();
    };

    const selectStyles = {
        control: (base) => ({
            ...base,
            borderColor: "#d6d3d1",
            borderRadius: "0.5rem",
            padding: "0.125rem 0",
            boxShadow: "none",
            "&:hover": { borderColor: "#a8a29e" },
        }),
        option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected ? "#6366f1" : isFocused ? "#e0e7ff" : "white",
            color: isSelected ? "white" : "#1f2937",
            cursor: "pointer",
        }),
        menu: (base) => ({ ...base, borderRadius: "0.5rem", overflow: "hidden", zIndex: 9999 }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    if (!showForm || !editingTaskAssigned) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Edit Task</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{editingTaskAssigned.title}</p>
                    </div>
                    <button onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-6 py-4 space-y-4">
                    {isLocked && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                            <Lock size={13} className="shrink-0" />
                            This ticket is completed and locked — no fields or attachments can be
                            changed.
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 grid grid-cols-2 gap-4 bg-gray-50 border border-gray-100 rounded-lg p-3">
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">
                                    Assigned to
                                </p>
                                <p className="text-sm text-gray-800">
                                    {watch("assigned_team")?.label || "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">
                                    Assigned by
                                </p>
                                <p className="text-sm text-gray-800">
                                    {watch("assigned_by")?.label || "—"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority <span className="text-red-500">*</span></label>
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={priorityOptions}
                                        placeholder="Select priority"
                                        isClearable
                                        isDisabled={isLocked}
                                        styles={selectStyles}
                                        menuPortalTarget={menuPortalTarget}
                                        menuPosition="fixed"
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={statusOptions.find((s) => s.value === field.value)}
                                        onChange={(option) => field.onChange(option.value)}
                                        options={statusOptions}
                                        isDisabled={isLocked}
                                        styles={selectStyles}
                                        menuPortalTarget={menuPortalTarget}
                                        menuPosition="fixed"
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                disabled={isLocked}
                                {...register("start_date", { required: "Start date is required" })}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-gray-50"
                            />
                            {errors.start_date && (
                                <p className="text-xs text-red-500 mt-1">{errors.start_date.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                disabled={isLocked}
                                {...register("due_date", {
                                    required: "Due date is required",
                                    validate: (value) =>
                                        !value ||
                                        !startDate ||
                                        value >= startDate ||
                                        "Due date can't be before the start date",
                                })}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-gray-50"
                            />
                            {errors.due_date && (
                                <p className="text-xs text-red-500 mt-1">{errors.due_date.message}</p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <div
                                        className={`rounded-lg border border-gray-200 overflow-hidden ${
                                            isLocked ? "opacity-60 pointer-events-none" : ""
                                        } [&_.ql-toolbar]:bg-white [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0
                                            [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200
                                            [&_.ql-container]:border-none
                                            [&_.ql-editor]:min-h-[120px] [&_.ql-editor]:max-h-[240px] [&_.ql-editor]:overflow-y-auto`}
                                    >
                                        <ReactQuill
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            readOnly={isLocked}
                                            modules={QUILL_MODULES}
                                            formats={QUILL_FORMATS}
                                            placeholder="Add any extra context for this ticket..."
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>

                        {attachmentError && (
                            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-2">
                                {attachmentError}
                            </div>
                        )}

                        {existingAttachments.length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-3">
                                {existingAttachments.map((att) => {
                                    const isImage = isImagePath(att.attachment);
                                    const fileName = att.attachment.split("/").pop();
                                    const isMarked = markedForDelete.has(att.id);
                                    const isDeleting = deletingAttachmentId === att.id;

                                    return (
                                        <div key={att.id} className="relative group">
                                            <a
                                                href={`${imgurl}/${att.attachment}`}
                                                target={isMarked ? undefined : "_blank"}
                                                rel="noreferrer"
                                                onClick={(e) => isMarked && e.preventDefault()}
                                                className="block"
                                                title={fileName}
                                            >
                                                <div
                                                    className={`w-full aspect-square rounded-lg overflow-hidden border flex items-center justify-center transition-all ${
                                                        isMarked
                                                            ? "border-red-200 opacity-40 grayscale"
                                                            : "border-gray-200 bg-gray-50 group-hover:border-indigo-300"
                                                    }`}
                                                >
                                                    {isImage ? (
                                                        <img
                                                            src={`${imgurl}/${att.attachment}`}
                                                            alt={fileName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <FileText size={26} className="text-red-400" />
                                                    )}
                                                </div>
                                            </a>

                                            {!isMarked && !isLocked && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleMarkForDelete(att.id)}
                                                    className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-0.5 text-gray-500 hover:text-red-600 hover:border-red-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Remove attachment"
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}

                                            <p className="text-[10px] text-gray-500 mt-1 truncate flex items-center gap-1">
                                                <Paperclip size={10} className="shrink-0" />
                                                {fileName}
                                            </p>

                                            {isMarked && !isLocked && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => confirmDeleteAttachment(att.id)}
                                                        disabled={isDeleting}
                                                        className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium px-1.5 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        <Check size={10} />
                                                        {isDeleting ? "Saving..." : "Save"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleMarkForDelete(att.id)}
                                                        disabled={isDeleting}
                                                        title="Cancel"
                                                        className="flex items-center justify-center text-[10px] px-1.5 py-1 rounded-md border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                                    >
                                                        <RotateCcw size={10} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {!isLocked && (
                            <label
                                htmlFor="edit-task-attachments"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleFileDrop}
                                className="flex flex-col items-center justify-center gap-1 w-full border-2 border-dashed border-gray-300 rounded-lg px-3 py-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors"
                            >
                                <UploadCloud size={22} className="text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
                                </span>
                                <span className="text-xs text-gray-400">Images or PDF, up to 10MB each</span>
                                <input
                                    id="edit-task-attachments"
                                    type="file"
                                    multiple
                                    accept={ACCEPTED_FILE_TYPES}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {attachmentPreviews.length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-3">
                                {attachmentPreviews.map((p, index) => (
                                    <div key={index} className="relative group">
                                        <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                                            {p.isImage ? (
                                                <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <FileText size={26} className="text-red-400" />
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(index)}
                                            className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-0.5 text-gray-500 hover:text-red-600 hover:border-red-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove"
                                        >
                                            <X size={12} />
                                        </button>
                                        <p className="text-[10px] text-gray-500 mt-1 truncate" title={p.name}>
                                            {p.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>

                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                    <button type="button" onClick={closeForm} className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={submitting || loadingUsers || isLocked}
                        className="px-5 py-2 flex items-center gap-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isLocked ? (
                            <>
                                <Lock size={14} /> Locked
                            </>
                        ) : submitting ? (
                            "Saving..."
                        ) : (
                            "Update Task"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTaskAssignedForm;
