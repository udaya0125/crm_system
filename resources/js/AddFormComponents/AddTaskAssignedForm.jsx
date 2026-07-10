import axios from "axios";
import { X, Plus, Trash2, Paperclip, FileText, UploadCloud, CheckCircle, Circle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { usePage } from "@inertiajs/react";

const emptyForm = {
    title: "",
    department: null,
    assigned_team: null,
    assigned_by: null,
    priority: null,
    start_date: "",
    due_date: "",
    description: "",
    status: "Pending",
};

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

const isAdminOrManager = (role) => role === ROLES.ADMIN || role === ROLES.MANAGER;

// Accepted attachment types (kept in sync with backend validation:
// mimes:jpg,jpeg,png,gif,webp,pdf | max:10240)
const ACCEPTED_FILE_TYPES = "image/jpeg,image/png,image/gif,image/webp,application/pdf";
const isImageFile = (file) => !!file?.type?.startsWith("image/");

const AddTaskAssignedForm = ({
    showForm,
    setShowForm,
    handleCreate,
}) => {
    const { auth } = usePage().props;
    const currentUser = auth?.user;

    const [submitting, setSubmitting] = useState(false);
    const [taskAssignedForm, setTaskAssignedForm] = useState(emptyForm);
    const [taskItems, setTaskItems] = useState([{ description: "", status: "Pending" }]);
    const [attachments, setAttachments] = useState([]);
    const [attachmentPreviews, setAttachmentPreviews] = useState([]); // [{ name, isImage, url }]
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [menuPortalTarget, setMenuPortalTarget] = useState(null);

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
        if (!taskAssignedForm.department) {
            return users;
        }
        return users.filter(
            (u) =>
                u.role === taskAssignedForm.department.value ||
                isAdminOrManager(u.role)
        );
    }, [users, taskAssignedForm.department]);

    useEffect(() => {
        if (showForm && users.length > 0 && currentUser) {
            const me = users.find((u) => u.value === currentUser.id) || {
                value: currentUser.id,
                label: currentUser.role ? `${currentUser.name} (${currentUser.role})` : currentUser.name,
                role: currentUser.role,
            };
            setTaskAssignedForm({ ...emptyForm, assigned_by: me });
            setTaskItems([{ description: "", status: "Pending" }]);
            setAttachments([]);
        }
    }, [showForm, users, currentUser]);

    const resetForm = () => {
        const me =
            currentUser &&
            (users.find((u) => u.value === currentUser.id) || {
                value: currentUser.id,
                label: currentUser.role ? `${currentUser.name} (${currentUser.role})` : currentUser.name,
                role: currentUser.role,
            });
        setTaskAssignedForm({ ...emptyForm, assigned_by: me || null });
        setTaskItems([{ description: "", status: "Pending" }]);
        setAttachments([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskAssignedForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (option, fieldName) => {
        setTaskAssignedForm((prev) => {
            const next = { ...prev, [fieldName]: option };

            if (fieldName === "department" && prev.assigned_team) {
                const stillValid =
                    !option ||
                    prev.assigned_team.role === option.value ||
                    isAdminOrManager(prev.assigned_team.role);
                if (!stillValid) next.assigned_team = null;
            }

            return next;
        });
    };

    const assignToMe = () => {
        if (!currentUser) return;
        const me = users.find((u) => u.value === currentUser.id) || {
            value: currentUser.id,
            label: currentUser.role ? `${currentUser.name} (${currentUser.role})` : currentUser.name,
            role: currentUser.role,
        };

        // Auto-select the Department dropdown to match the logged-in user's
        // own role, so "Assign to me" doesn't leave Department blank/stale.
        // Admins/managers don't have a department in DEPARTMENT_OPTIONS
        // (they're role-based, not department-based), so leave that field
        // alone for them rather than clearing or guessing.
        const myDepartment = DEPARTMENT_OPTIONS.find((d) => d.value === me.role) || null;

        setTaskAssignedForm((prev) => ({
            ...prev,
            assigned_team: me,
            department: isAdminOrManager(me.role) ? prev.department : myDepartment,
        }));
    };

    const addTaskItem = () =>
        setTaskItems((prev) => [...prev, { description: "", status: "Pending" }]);

    const removeTaskItem = (index) =>
        setTaskItems((prev) => prev.filter((_, i) => i !== index));

    const updateTaskItem = (index, field, value) =>
        setTaskItems((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );

    // Toggles a checklist item between "Pending" and "Completed" — same
    // interaction pattern as AddProjectForm's toggleTaskCompletion, just
    // driven off the string status field instead of a boolean.
    const toggleTaskItemStatus = (index) =>
        setTaskItems((prev) =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, status: item.status === "Completed" ? "Pending" : "Completed" }
                    : item
            )
        );

    // Progress preview — mirrors the filtering handleSubmit already applies
    // (blank-description items are dropped before being sent to the server),
    // so the percentage shown here matches what actually gets saved.
    const validTaskItems = taskItems.filter((item) => item.description.trim() !== "");
    const completedTaskItems = validTaskItems.filter((item) => item.status === "Completed");
    const checklistProgress =
        validTaskItems.length === 0
            ? 0
            : Math.round((completedTaskItems.length / validTaskItems.length) * 100);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();

            formData.append("title", taskAssignedForm.title);
            formData.append("start_date", taskAssignedForm.start_date);
            formData.append("due_date", taskAssignedForm.due_date);
            if (taskAssignedForm.description) formData.append("description", taskAssignedForm.description);

            formData.append("status", taskAssignedForm.status);

            if (taskAssignedForm.assigned_team) formData.append("assigned_team", taskAssignedForm.assigned_team.value);
            if (taskAssignedForm.assigned_by) formData.append("user_id", taskAssignedForm.assigned_by.value);
            if (taskAssignedForm.priority) formData.append("priority", taskAssignedForm.priority.value);

            attachments.forEach((file) => formData.append("attachments[]", file));

            taskItems.forEach((item, index) => {
                if (item.description.trim() !== "") {
                    formData.append(`task_items[${index}][description]`, item.description);
                    formData.append(`task_items[${index}][status]`, item.status || "Pending");
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

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
                    <button onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={taskAssignedForm.title}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>
                            <Select
                                value={taskAssignedForm.department}
                                onChange={(option) => handleSelectChange(option, "department")}
                                options={DEPARTMENT_OPTIONS}
                                placeholder="Select department"
                                isClearable
                                styles={selectStyles}
                                menuPortalTarget={menuPortalTarget}
                                menuPosition="fixed"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Assigned To
                                </label>
                                <button
                                    type="button"
                                    onClick={assignToMe}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Assign to me
                                </button>
                            </div>
                            <Select
                                value={taskAssignedForm.assigned_team}
                                onChange={(option) => handleSelectChange(option, "assigned_team")}
                                options={assignedTeamOptions}
                                isLoading={loadingUsers}
                                isDisabled={loadingUsers}
                                placeholder={
                                    loadingUsers
                                        ? "Loading users..."
                                        : taskAssignedForm.department
                                        ? `Select from ${taskAssignedForm.department.label}`
                                        : "Select"
                                }
                                isClearable
                                styles={selectStyles}
                                menuPortalTarget={menuPortalTarget}
                                menuPosition="fixed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assigned By
                            </label>
                            <Select
                                value={taskAssignedForm.assigned_by}
                                onChange={(option) => handleSelectChange(option, "assigned_by")}
                                options={users}
                                isLoading={loadingUsers}
                                isDisabled={loadingUsers}
                                placeholder={loadingUsers ? "Loading users..." : "Select assigner"}
                                isClearable
                                styles={selectStyles}
                                menuPortalTarget={menuPortalTarget}
                                menuPosition="fixed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <Select
                                value={taskAssignedForm.priority}
                                onChange={(option) => handleSelectChange(option, "priority")}
                                options={priorityOptions}
                                placeholder="Select priority"
                                isClearable
                                styles={selectStyles}
                                menuPortalTarget={menuPortalTarget}
                                menuPosition="fixed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={taskAssignedForm.start_date}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                name="due_date"
                                value={taskAssignedForm.due_date}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={taskAssignedForm.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Task Checklist — styled to match AddProjectForm's
                        "Project Tasks" box: bordered container, pill-style
                        "Add Item" button, checkbox-toggle rows, and a live
                        progress bar. */}
                    <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-xs font-semibold tracking-wide text-stone-500 uppercase">
                                Task Checklist
                            </label>
                            <button
                                type="button"
                                onClick={addTaskItem}
                                className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition"
                            >
                                <Plus size={14} />
                                Add Item
                            </button>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {taskItems.length === 0 ? (
                                <p className="text-sm text-stone-400 text-center py-4">
                                    No items added yet. Click "Add Item" to create your first checklist item.
                                </p>
                            ) : (
                                taskItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 bg-white p-2 rounded-lg border border-stone-200"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleTaskItemStatus(index)}
                                            className="flex-shrink-0"
                                        >
                                            {item.status === "Completed" ? (
                                                <CheckCircle size={20} className="text-emerald-500" />
                                            ) : (
                                                <Circle size={20} className="text-stone-400" />
                                            )}
                                        </button>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateTaskItem(index, "description", e.target.value)}
                                            placeholder={`Item ${index + 1} description`}
                                            className="flex-1 text-sm border-none focus:ring-0 p-1 bg-transparent"
                                        />
                                        {taskItems.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTaskItem(index)}
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
                                        style={{ width: `${checklistProgress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-stone-400 mt-1">
                                    {completedTaskItems.length} of {validTaskItems.length} items completed
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>

                        <label
                            htmlFor="add-task-attachments"
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
                        type="submit"
                        onClick={handleSubmit}
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


// import axios from "axios";
// import { X, Plus, Trash2, Paperclip, FileText, UploadCloud } from "lucide-react";
// import React, { useEffect, useMemo, useState } from "react";
// import Select from "react-select";
// import { usePage } from "@inertiajs/react";

// const emptyForm = {
//     title: "",
//     department: null,
//     assigned_team: null,
//     assigned_by: null,
//     priority: null,
//     start_date: "",
//     due_date: "",
//     description: "",
//     status: "Pending",
// };

// const priorityOptions = [
//     { value: "Low", label: "Low" },
//     { value: "Medium", label: "Medium" },
//     { value: "High", label: "High" },
// ];

// const statusOptions = [
//     { value: "Pending", label: "Pending" },
//     { value: "In Progress", label: "In Progress" },
//     { value: "Completed", label: "Completed" },
// ];

// const ROLES = {
//     ADMIN: "admin",
//     MANAGER: "manager",
//     DEVELOPER: "developer",
//     TECHNICIAN: "technician",
//     ACCOUNTANT: "accountant",
//     USER: "user",
// };

// const DEPARTMENT_OPTIONS = [
//     { value: ROLES.DEVELOPER, label: "Developer" },
//     { value: ROLES.TECHNICIAN, label: "Technician" },
//     { value: ROLES.ACCOUNTANT, label: "Accountant" },
//     { value: ROLES.USER, label: "User" },
// ];

// const isAdminOrManager = (role) => role === ROLES.ADMIN || role === ROLES.MANAGER;

// // Accepted attachment types (kept in sync with backend validation:
// // mimes:jpg,jpeg,png,gif,webp,pdf | max:10240)
// const ACCEPTED_FILE_TYPES = "image/jpeg,image/png,image/gif,image/webp,application/pdf";
// const isImageFile = (file) => !!file?.type?.startsWith("image/");

// const AddTaskAssignedForm = ({
//     showForm,
//     setShowForm,
//     handleCreate,
// }) => {
//     const { auth } = usePage().props;
//     const currentUser = auth?.user;

//     const [submitting, setSubmitting] = useState(false);
//     const [taskAssignedForm, setTaskAssignedForm] = useState(emptyForm);
//     const [taskItems, setTaskItems] = useState([{ description: "", status: "Pending" }]);
//     const [attachments, setAttachments] = useState([]);
//     const [attachmentPreviews, setAttachmentPreviews] = useState([]); // [{ name, isImage, url }]
//     const [users, setUsers] = useState([]);
//     const [loadingUsers, setLoadingUsers] = useState(true);
//     const [menuPortalTarget, setMenuPortalTarget] = useState(null);

//     useEffect(() => {
//         setMenuPortalTarget(document.body);
//     }, []);

//     useEffect(() => {
//         if (!showForm) return;

//         document.body.style.overflow = "hidden";
//         document.body.style.position = "fixed";
//         document.body.style.width = "100%";

//         return () => {
//             document.body.style.overflow = "unset";
//             document.body.style.position = "static";
//             document.body.style.width = "auto";
//         };
//     }, [showForm]);

//     useEffect(() => {
//         const next = attachments.map((file) => ({
//             name: file.name,
//             isImage: isImageFile(file),
//             url: isImageFile(file) ? URL.createObjectURL(file) : null,
//         }));
//         setAttachmentPreviews(next);

//         return () => {
//             next.forEach((p) => p.url && URL.revokeObjectURL(p.url));
//         };
//     }, [attachments]);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 setLoadingUsers(true);
//                 const response = await axios.get(route("ourusers.index"));
//                 const userOptions = (response.data.users || []).map((u) => ({
//                     value: u.id,
//                     label: u.role ? `${u.name} (${u.role})` : u.name,
//                     role: u.role,
//                 }));
//                 setUsers(userOptions);
//             } catch (error) {
//                 console.error("Error fetching users:", error);
//                 setUsers([]);
//             } finally {
//                 setLoadingUsers(false);
//             }
//         };
//         fetchUsers();
//     }, []);

//     const assignedTeamOptions = useMemo(() => {
//         if (!taskAssignedForm.department) {
//             return users;
//         }
//         return users.filter(
//             (u) =>
//                 u.role === taskAssignedForm.department.value ||
//                 isAdminOrManager(u.role)
//         );
//     }, [users, taskAssignedForm.department]);

//     useEffect(() => {
//         if (showForm && users.length > 0 && currentUser) {
//             const me = users.find((u) => u.value === currentUser.id) || {
//                 value: currentUser.id,
//                 label: currentUser.role ? `${currentUser.name} (${currentUser.role})` : currentUser.name,
//                 role: currentUser.role,
//             };
//             setTaskAssignedForm({ ...emptyForm, assigned_by: me });
//             setTaskItems([{ description: "", status: "Pending" }]);
//             setAttachments([]);
//         }
//     }, [showForm, users, currentUser]);

//     const resetForm = () => {
//         const me =
//             currentUser &&
//             (users.find((u) => u.value === currentUser.id) || {
//                 value: currentUser.id,
//                 label: currentUser.role ? `${currentUser.name} (${currentUser.role})` : currentUser.name,
//                 role: currentUser.role,
//             });
//         setTaskAssignedForm({ ...emptyForm, assigned_by: me || null });
//         setTaskItems([{ description: "", status: "Pending" }]);
//         setAttachments([]);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setTaskAssignedForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSelectChange = (option, fieldName) => {
//         setTaskAssignedForm((prev) => {
//             const next = { ...prev, [fieldName]: option };

//             if (fieldName === "department" && prev.assigned_team) {
//                 const stillValid =
//                     !option ||
//                     prev.assigned_team.role === option.value ||
//                     isAdminOrManager(prev.assigned_team.role);
//                 if (!stillValid) next.assigned_team = null;
//             }

//             return next;
//         });
//     };

//     const assignToMe = () => {
//         if (!currentUser) return;
//         const me = users.find((u) => u.value === currentUser.id) || {
//             value: currentUser.id,
//             label: currentUser.role ? `${currentUser.name} (${currentUser.role})` : currentUser.name,
//             role: currentUser.role,
//         };
//         setTaskAssignedForm((prev) => ({ ...prev, assigned_team: me }));
//     };

//     const addTaskItem = () =>
//         setTaskItems((prev) => [...prev, { description: "", status: "Pending" }]);

//     const removeTaskItem = (index) =>
//         setTaskItems((prev) => prev.filter((_, i) => i !== index));

//     const updateTaskItem = (index, field, value) =>
//         setTaskItems((prev) =>
//             prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
//         );

//     const addFiles = (fileList) => {
//         const incoming = Array.from(fileList || []);
//         if (!incoming.length) return;
//         setAttachments((prev) => [...prev, ...incoming]);
//     };

//     const handleFileChange = (e) => {
//         addFiles(e.target.files);
//         e.target.value = "";
//     };

//     const handleFileDrop = (e) => {
//         e.preventDefault();
//         addFiles(e.dataTransfer.files);
//     };

//     const removeAttachment = (index) =>
//         setAttachments((prev) => prev.filter((_, i) => i !== index));

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmitting(true);

//         try {
//             const formData = new FormData();

//             formData.append("title", taskAssignedForm.title);
//             formData.append("start_date", taskAssignedForm.start_date);
//             formData.append("due_date", taskAssignedForm.due_date);
//             if (taskAssignedForm.description) formData.append("description", taskAssignedForm.description);

//             formData.append("status", taskAssignedForm.status);

//             if (taskAssignedForm.assigned_team) formData.append("assigned_team", taskAssignedForm.assigned_team.value);
//             if (taskAssignedForm.assigned_by) formData.append("user_id", taskAssignedForm.assigned_by.value);
//             if (taskAssignedForm.priority) formData.append("priority", taskAssignedForm.priority.value);

//             attachments.forEach((file) => formData.append("attachments[]", file));

//             taskItems.forEach((item, index) => {
//                 if (item.description.trim() !== "") {
//                     formData.append(`task_items[${index}][description]`, item.description);
//                     formData.append(`task_items[${index}][status]`, item.status || "Pending");
//                 }
//             });

//             await handleCreate(formData);

//             resetForm();
//             setShowForm(false);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const closeForm = () => {
//         setShowForm(false);
//         resetForm();
//     };

//     const selectStyles = {
//         control: (base) => ({
//             ...base,
//             borderColor: "#d6d3d1",
//             borderRadius: "0.5rem",
//             padding: "0.125rem 0",
//             boxShadow: "none",
//             "&:hover": { borderColor: "#a8a29e" },
//         }),
//         option: (base, { isFocused, isSelected }) => ({
//             ...base,
//             backgroundColor: isSelected ? "#6366f1" : isFocused ? "#e0e7ff" : "white",
//             color: isSelected ? "white" : "#1f2937",
//             cursor: "pointer",
//         }),
//         menu: (base) => ({ ...base, borderRadius: "0.5rem", overflow: "hidden", zIndex: 9999 }),
//         menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//     };

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col">
//                 <div className="flex justify-between items-center px-6 py-4 border-b">
//                     <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
//                     <button onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                         <X size={22} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                             <input
//                                 type="text"
//                                 name="title"
//                                 value={taskAssignedForm.title}
//                                 onChange={handleChange}
//                                 required
//                                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div>

//                         <div className="col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Department
//                             </label>
//                             <Select
//                                 value={taskAssignedForm.department}
//                                 onChange={(option) => handleSelectChange(option, "department")}
//                                 options={DEPARTMENT_OPTIONS}
//                                 placeholder="Select department"
//                                 isClearable
//                                 styles={selectStyles}
//                                 menuPortalTarget={menuPortalTarget}
//                                 menuPosition="fixed"
//                             />
//                             <p className="text-xs text-gray-400 mt-1">
//                                 Filters who shows up in "Assigned To" below. Admins/managers always show regardless of department.
//                             </p>
//                         </div>

//                         <div>
//                             <div className="flex justify-between items-center mb-1">
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Assigned To (does the work)
//                                 </label>
//                                 <button
//                                     type="button"
//                                     onClick={assignToMe}
//                                     className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
//                                 >
//                                     Assign to me
//                                 </button>
//                             </div>
//                             <Select
//                                 value={taskAssignedForm.assigned_team}
//                                 onChange={(option) => handleSelectChange(option, "assigned_team")}
//                                 options={assignedTeamOptions}
//                                 isLoading={loadingUsers}
//                                 isDisabled={loadingUsers}
//                                 placeholder={
//                                     loadingUsers
//                                         ? "Loading users..."
//                                         : taskAssignedForm.department
//                                         ? `Select from ${taskAssignedForm.department.label}`
//                                         : "Select assignee"
//                                 }
//                                 isClearable
//                                 styles={selectStyles}
//                                 menuPortalTarget={menuPortalTarget}
//                                 menuPosition="fixed"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Assigned By
//                             </label>
//                             <Select
//                                 value={taskAssignedForm.assigned_by}
//                                 onChange={(option) => handleSelectChange(option, "assigned_by")}
//                                 options={users}
//                                 isLoading={loadingUsers}
//                                 isDisabled={loadingUsers}
//                                 placeholder={loadingUsers ? "Loading users..." : "Select assigner"}
//                                 isClearable
//                                 styles={selectStyles}
//                                 menuPortalTarget={menuPortalTarget}
//                                 menuPosition="fixed"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
//                             <Select
//                                 value={taskAssignedForm.priority}
//                                 onChange={(option) => handleSelectChange(option, "priority")}
//                                 options={priorityOptions}
//                                 placeholder="Select priority"
//                                 isClearable
//                                 styles={selectStyles}
//                                 menuPortalTarget={menuPortalTarget}
//                                 menuPosition="fixed"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//                             <input
//                                 type="date"
//                                 name="start_date"
//                                 value={taskAssignedForm.start_date}
//                                 onChange={handleChange}
//                                 required
//                                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
//                             <input
//                                 type="date"
//                                 name="due_date"
//                                 value={taskAssignedForm.due_date}
//                                 onChange={handleChange}
//                                 required
//                                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div>

//                         <div className="col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                             <textarea
//                                 name="description"
//                                 value={taskAssignedForm.description}
//                                 onChange={handleChange}
//                                 rows={3}
//                                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div>
//                     </div>

//                     {/* Task Checklist */}
//                     <div>
//                         <div className="flex justify-between items-center mb-2">
//                             <label className="block text-sm font-medium text-gray-700">Task Checklist</label>
//                             <button
//                                 type="button"
//                                 onClick={addTaskItem}
//                                 className="text-indigo-600 text-sm flex items-center gap-1 hover:text-indigo-800"
//                             >
//                                 <Plus size={16} /> Add Item
//                             </button>
//                         </div>
//                         <div className="space-y-2">
//                             {taskItems.map((item, index) => (
//                                 <div key={index} className="flex items-center gap-2">
//                                     <input
//                                         type="text"
//                                         placeholder={`Item ${index + 1} description`}
//                                         value={item.description}
//                                         onChange={(e) => updateTaskItem(index, "description", e.target.value)}
//                                         className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                     />
//                                     {taskItems.length > 1 && (
//                                         <button
//                                             type="button"
//                                             onClick={() => removeTaskItem(index)}
//                                             className="text-red-500 hover:text-red-700"
//                                         >
//                                             <Trash2 size={18} />
//                                         </button>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Attachments */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>

//                         <label
//                             htmlFor="add-task-attachments"
//                             onDragOver={(e) => e.preventDefault()}
//                             onDrop={handleFileDrop}
//                             className="flex flex-col items-center justify-center gap-1 w-full border-2 border-dashed border-gray-300 rounded-lg px-3 py-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors"
//                         >
//                             <UploadCloud size={22} className="text-gray-400" />
//                             <span className="text-sm text-gray-600">
//                                 <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
//                             </span>
//                             <span className="text-xs text-gray-400">Images or PDF, up to 10MB each</span>
//                             <input
//                                 id="add-task-attachments"
//                                 type="file"
//                                 multiple
//                                 accept={ACCEPTED_FILE_TYPES}
//                                 onChange={handleFileChange}
//                                 className="hidden"
//                             />
//                         </label>

//                         {attachmentPreviews.length > 0 && (
//                             <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-3">
//                                 {attachmentPreviews.map((p, index) => (
//                                     <div key={index} className="relative group">
//                                         <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
//                                             {p.isImage ? (
//                                                 <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
//                                             ) : (
//                                                 <FileText size={26} className="text-red-400" />
//                                             )}
//                                         </div>
//                                         <button
//                                             type="button"
//                                             onClick={() => removeAttachment(index)}
//                                             className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-0.5 text-gray-500 hover:text-red-600 hover:border-red-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
//                                             title="Remove"
//                                         >
//                                             <X size={12} />
//                                         </button>
//                                         <p className="text-[10px] text-gray-500 mt-1 truncate" title={p.name}>
//                                             {p.name}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </form>

//                 <div className="flex justify-end gap-3 px-6 py-4 border-t">
//                     <button type="button" onClick={closeForm} className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-50">
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         onClick={handleSubmit}
//                         disabled={submitting || loadingUsers}
//                         className="px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
//                     >
//                         {submitting ? "Saving..." : "Create Task"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddTaskAssignedForm;


