import axios from "axios";
import {
    X,
    Plus,
    Trash2,
    FileText,
    UploadCloud,
    CheckCircle,
    Circle,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { usePage } from "@inertiajs/react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
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

const isAdminOrManager = (role) =>
    role === ROLES.ADMIN || role === ROLES.MANAGER;

const ACCEPTED_FILE_TYPES =
    "image/jpeg,image/png,image/gif,image/webp,application/pdf";
const isImageFile = (file) => !!file?.type?.startsWith("image/");

// Kept intentionally small/plain to match the compact modal — matches the
// toolbar already used for Admin Remarks in TaskDetailPopup.jsx.
const QUILL_MODULES = {
    toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
    ],
};
const QUILL_FORMATS = ["bold", "italic", "underline", "list", "bullet"];

const buildDefaultValues = () => ({
    title: "",
    department: null,
    assigned_team: null,
    assigned_by: null,
    priority: null,
    start_date: "",
    due_date: "",
    description: "",
    status: "Pending",
    task_items: [{ description: "", status: "Pending" }],
});

const AddTaskAssignedForm = ({ showForm, setShowForm, handleCreate }) => {
    const { auth } = usePage().props;
    const currentUser = auth?.user;

    const [submitting, setSubmitting] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [attachmentPreviews, setAttachmentPreviews] = useState([]); // [{ name, isImage, url }]
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [menuPortalTarget, setMenuPortalTarget] = useState(null);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: buildDefaultValues() });

    const {
        fields: taskItemFields,
        append: appendTaskItem,
        remove: removeTaskItem,
    } = useFieldArray({
        control,
        name: "task_items",
    });

    const department = watch("department");
    const taskItems = watch("task_items");

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

    const assignedTeamOptions = useMemo(() => {
        if (!department) return users;
        return users.filter(
            (u) => u.role === department.value || isAdminOrManager(u.role),
        );
    }, [users, department]);

    const buildMeOption = () =>
        currentUser &&
        (users.find((u) => u.value === currentUser.id) || {
            value: currentUser.id,
            label: currentUser.role
                ? `${currentUser.name} (${currentUser.role})`
                : currentUser.name,
            role: currentUser.role,
        });

    useEffect(() => {
        if (showForm && users.length > 0 && currentUser) {
            reset({ ...buildDefaultValues(), assigned_by: buildMeOption() });
            setAttachments([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showForm, users, currentUser]);

    const resetForm = () => {
        reset({
            ...buildDefaultValues(),
            assigned_by: buildMeOption() || null,
        });
        setAttachments([]);
    };

    const handleDepartmentChange = (option, fieldOnChange) => {
        fieldOnChange(option);

        const currentAssignee = getValues("assigned_team");
        if (currentAssignee) {
            const stillValid =
                !option ||
                currentAssignee.role === option.value ||
                isAdminOrManager(currentAssignee.role);
            if (!stillValid)
                setValue("assigned_team", null, { shouldDirty: true });
        }
    };

    const assignToMe = () => {
        if (!currentUser) return;
        const me = buildMeOption();
        if (!me) return;

        // Auto-select the Department dropdown to match the logged-in user's
        // own role, so "Assign to me" doesn't leave Department blank/stale.
        // Admins/managers don't have a department in DEPARTMENT_OPTIONS
        // (they're role-based, not department-based), so leave that field
        // alone for them rather than clearing or guessing.
        const myDepartment =
            DEPARTMENT_OPTIONS.find((d) => d.value === me.role) || null;

        setValue("assigned_team", me, { shouldDirty: true, shouldValidate: true });
        if (!isAdminOrManager(me.role)) {
            setValue("department", myDepartment, { shouldDirty: true, shouldValidate: true });
        }
    };

    const toggleTaskItemStatus = (index) => {
        const current = getValues(`task_items.${index}.status`);
        setValue(
            `task_items.${index}.status`,
            current === "Completed" ? "Pending" : "Completed",
            { shouldDirty: true },
        );
    };

    // Progress preview — mirrors the filtering onSubmit already applies
    // (blank-description items are dropped before being sent to the server),
    // so the percentage shown here matches what actually gets saved.
    const validTaskItems = (taskItems || []).filter(
        (item) => item.description?.trim() !== "",
    );
    const completedTaskItems = validTaskItems.filter(
        (item) => item.status === "Completed",
    );
    const checklistProgress =
        validTaskItems.length === 0
            ? 0
            : Math.round(
                  (completedTaskItems.length / validTaskItems.length) * 100,
              );

    const addFiles = (fileList) => {
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

    const removeAttachment = (index) =>
        setAttachments((prev) => prev.filter((_, i) => i !== index));

    const onSubmit = async (data) => {
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

            formData.append("assigned_team", data.assigned_team.value);
            formData.append("user_id", data.assigned_by.value);
            formData.append("priority", data.priority.value);

            attachments.forEach((file) =>
                formData.append("attachments[]", file),
            );

            (data.task_items || []).forEach((item, index) => {
                if (item.description.trim() !== "") {
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

            await handleCreate(formData);

            resetForm();
            setShowForm(false);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const closeForm = () => {
        setShowForm(false);
        resetForm();
    };

    const errorSelectStyles = {
        control: (base) => ({
            ...base,
            borderColor: "#fca5a5",
            borderRadius: "0.5rem",
            padding: "0.125rem 0",
            boxShadow: "none",
            "&:hover": { borderColor: "#f87171" },
        }),
        option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected ? "#6366f1" : isFocused ? "#e0e7ff" : "white",
            color: isSelected ? "white" : "#1f2937",
            cursor: "pointer",
        }),
        menu: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            overflow: "hidden",
            zIndex: 9999,
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
            backgroundColor: isSelected
                ? "#6366f1"
                : isFocused
                  ? "#e0e7ff"
                  : "white",
            color: isSelected ? "white" : "#1f2937",
            cursor: "pointer",
        }),
        menu: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            overflow: "hidden",
            zIndex: 9999,
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New Task
                    </h2>
                    <button
                        onClick={closeForm}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={22} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="overflow-y-auto px-6 py-4 space-y-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("title", {
                                    required: "Title is required",
                                })}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.title && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="department"
                                control={control}
                                rules={{ required: "Department is required" }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onChange={(option) =>
                                            handleDepartmentChange(option, field.onChange)
                                        }
                                        options={DEPARTMENT_OPTIONS}
                                        placeholder="Select department"
                                        isClearable
                                        styles={
                                            errors.department
                                                ? errorSelectStyles
                                                : selectStyles
                                        }
                                        menuPortalTarget={menuPortalTarget}
                                        menuPosition="fixed"
                                    />
                                )}
                            />
                            {errors.department && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.department.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Assigned To <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={assignToMe}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Assign to me
                                </button>
                            </div>
                            <Controller
                                name="assigned_team"
                                control={control}
                                rules={{ required: "Assignee is required" }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={assignedTeamOptions}
                                        isLoading={loadingUsers}
                                        isDisabled={loadingUsers}
                                        placeholder={
                                            loadingUsers
                                                ? "Loading users..."
                                                : department
                                                  ? `Select from ${department.label}`
                                                  : "Select"
                                        }
                                        isClearable
                                        styles={
                                            errors.assigned_team
                                                ? errorSelectStyles
                                                : selectStyles
                                        }
                                        menuPortalTarget={menuPortalTarget}
                                        menuPosition="fixed"
                                    />
                                )}
                            />
                            {errors.assigned_team && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.assigned_team.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assigned By <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="assigned_by"
                                control={control}
                                rules={{ required: "Assigner is required" }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={users}
                                        isLoading={loadingUsers}
                                        isDisabled={loadingUsers}
                                        placeholder={
                                            loadingUsers
                                                ? "Loading users..."
                                                : "Select assigner"
                                        }
                                        isClearable
                                        styles={
                                            errors.assigned_by
                                                ? errorSelectStyles
                                                : selectStyles
                                        }
                                        menuPortalTarget={menuPortalTarget}
                                        menuPosition="fixed"
                                    />
                                )}
                            />
                            {errors.assigned_by && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.assigned_by.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="priority"
                                control={control}
                                rules={{ required: "Priority is required" }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={priorityOptions}
                                        placeholder="Select priority"
                                        isClearable
                                        styles={
                                            errors.priority
                                                ? errorSelectStyles
                                                : selectStyles
                                        }
                                        menuPortalTarget={menuPortalTarget}
                                        menuPosition="fixed"
                                    />
                                )}
                            />
                            {errors.priority && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.priority.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                {...register("start_date", {
                                    required: "Start date is required",
                                })}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.start_date && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.start_date.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                {...register("due_date", {
                                    required: "Due date is required",
                                    validate: (value) =>
                                        !value ||
                                        !watch("start_date") ||
                                        value >= watch("start_date") ||
                                        "Due date can't be before the start date",
                                })}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.due_date && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.due_date.message}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <div
                                        className="rounded-lg border border-gray-200 overflow-hidden
                                            [&_.ql-toolbar]:bg-white [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0
                                            [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200
                                            [&_.ql-container]:border-none
                                            [&_.ql-editor]:min-h-[120px] [&_.ql-editor]:max-h-[240px] [&_.ql-editor]:overflow-y-auto"
                                    >
                                        <ReactQuill
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            modules={QUILL_MODULES}
                                            formats={QUILL_FORMATS}
                                            placeholder="Add any extra context for this ticket..."
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {/* Task Checklist — styled to match AddProjectForm's
                        "Project Tasks" box: bordered container, pill-style
                        "Add Item" button, checkbox-toggle rows, and a live
                        progress bar. Now backed by useFieldArray. */}
                    <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-xs font-semibold tracking-wide text-stone-500 uppercase">
                                Task Checklist
                            </label>
                            <button
                                type="button"
                                onClick={() =>
                                    appendTaskItem({
                                        description: "",
                                        status: "Pending",
                                    })
                                }
                                className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition"
                            >
                                <Plus size={14} />
                                Add Item
                            </button>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {taskItemFields.length === 0 ? (
                                <p className="text-sm text-stone-400 text-center py-4">
                                    No items added yet. Click "Add Item" to
                                    create your first checklist item.
                                </p>
                            ) : (
                                taskItemFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="flex items-center gap-2 bg-white p-2 rounded-lg border border-stone-200"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleTaskItemStatus(index)
                                            }
                                            className="flex-shrink-0"
                                        >
                                            {taskItems?.[index]?.status ===
                                            "Completed" ? (
                                                <CheckCircle
                                                    size={20}
                                                    className="text-emerald-500"
                                                />
                                            ) : (
                                                <Circle
                                                    size={20}
                                                    className="text-stone-400"
                                                />
                                            )}
                                        </button>
                                        <input
                                            type="text"
                                            {...register(
                                                `task_items.${index}.description`,
                                            )}
                                            placeholder={`Item ${index + 1} description`}
                                            className="flex-1 text-sm border-none focus:ring-0 p-1 bg-transparent"
                                        />
                                        {taskItemFields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeTaskItem(index)
                                                }
                                                className="flex-shrink-0 p-1 hover:bg-red-100 rounded-full text-red-500 transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {validTaskItems.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-stone-200">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium text-stone-600">
                                        Progress Preview
                                    </span>
                                    <span className="text-xs font-bold text-indigo-600">
                                        {checklistProgress}%
                                    </span>
                                </div>
                                <div className="w-full bg-stone-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${checklistProgress}%`,
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-stone-400 mt-1">
                                    {completedTaskItems.length} of{" "}
                                    {validTaskItems.length} items completed
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Attachments — unchanged, kept as plain useState since
                        FileList objects don't play well with RHF's dirty/
                        reset tracking. */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attachments
                        </label>

                        <label
                            htmlFor="add-task-attachments"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}
                            className="flex flex-col items-center justify-center gap-1 w-full border-2 border-dashed border-gray-300 rounded-lg px-3 py-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors"
                        >
                            <UploadCloud size={22} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                                <span className="text-indigo-600 font-medium">
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </span>
                            <span className="text-xs text-gray-400">
                                Images or PDF, up to 10MB each
                            </span>
                            <input
                                id="add-task-attachments"
                                type="file"
                                multiple
                                accept={ACCEPTED_FILE_TYPES}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        {attachmentPreviews.length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-3">
                                {attachmentPreviews.map((p, index) => (
                                    <div key={index} className="relative group">
                                        <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                                            {p.isImage ? (
                                                <img
                                                    src={p.url}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <FileText
                                                    size={26}
                                                    className="text-red-400"
                                                />
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeAttachment(index)
                                            }
                                            className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-0.5 text-gray-500 hover:text-red-600 hover:border-red-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove"
                                        >
                                            <X size={12} />
                                        </button>
                                        <p
                                            className="text-[10px] text-gray-500 mt-1 truncate"
                                            title={p.name}
                                        >
                                            {p.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>

                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                    <button
                        type="button"
                        onClick={closeForm}
                        className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={submitting || loadingUsers}
                        className="px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {submitting ? "Saving..." : "Create Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTaskAssignedForm;
