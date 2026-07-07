// import axios from "axios";
// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddTaskAssignedForm = ({ showForm, setShowForm, editingTaskAssigned, setEditingTaskAssigned, handleUpdate }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [taskAssignedForm, setTaskAssignedForm] = useState({
//         title: "",
//         department:"",
//         assigned_id: "",
//         user_id: "",
//         priority: "",
//         start_date: "",
//         due_date: "",
//         description: "",
//         task: "",
//         status: "",
//         attachment: "",
//         admin_remarks: "",
//         admin_status: "",
//     });
//     //  Use Effect
//     useEffect(() => {
//         if (editingTaskAssigned) {
//             setTaskAssignedForm({
//                 ...editingTaskAssigned,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setTaskAssignedForm({
//                 title: "",
//         department:"",
//         assigned_id: "",
//         user_id: "",
//         priority: "",
//         start_date: "",
//         due_date: "",
//         description: "",
//         task: "",
//         status: "",
//         attachment: "",
//         admin_remarks: "",
//         admin_status: "",
//             });
//         }
//     }, [editingTaskAssigned]);

//     // Handle Create Task Assigned
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourtaskassigned.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating task assigned", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in taskAssignedForm) {
//             if (taskAssignedForm[key] !== null && taskAssignedForm[key] !== "") {
//                 formData.append(key, taskAssignedForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingTaskAssigned) {
//                 // Editing existing task assigned
//                 await handleUpdate(formData, editingTaskAssigned.id);
//             } else {
//                 // Creating new task assigned
//                 await handleCreate(formData);
//             }
//             setTaskAssignedForm({
//                 title: "",
//         department:"",
//         assigned_id: "",
//         user_id: "",
//         priority: "",
//         start_date: "",
//         due_date: "",
//         description: "",
//         task: "",
//         status: "",
//         attachment: "",
//         admin_remarks: "",
//         admin_status: "",
//             });

//             setShowForm(false);
//             setEditingTaskAssigned(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setTaskAssignedForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));
//     };

//     if (!showForm) return null;
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Add New Task
//                     </h2>
//                     <button
//                         onClick={() => {
//                             setShowForm(false);
//                         }}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddTaskAssignedForm;




import axios from "axios";
import { X, Plus, Trash2, Paperclip } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { usePage } from "@inertiajs/react";

const emptyForm = {
    title: "",
    department: null,    // { value: role, label: role } — used only to filter assigned_team options, not submitted
    assigned_team: null, // { value: id, label: name } — who it's assigned TO
    assigned_by: null,   // { value: id, label: name } — who is assigning it
    priority: null,
    start_date: "",
    due_date: "",
    description: "",
    status: "Pending",
    admin_remarks: "",
    admin_status: "",
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

// Matches the exact role values used on the user record.
const ROLES = {
    ADMIN: "admin",
    MANAGER: "manager",
    DEVELOPER: "developer",
    TECHNICIAN: "technician",
    ACCOUNTANT: "accountant",
    USER: "user", // generic user role, not a department
};

// These are the selectable "departments" — admin/manager are excluded here
// since they aren't a department, they just get auto-included in every
// department's assignee list below.
const DEPARTMENT_OPTIONS = [
    { value: ROLES.DEVELOPER, label: "Developer" },
    { value: ROLES.TECHNICIAN, label: "Technician" },
    { value: ROLES.ACCOUNTANT, label: "Accountant" },
    { value: ROLES.USER, label: "User" },
];

// Admin/manager always show up in "Assigned To" regardless of department.
const isAdminOrManager = (role) => role === ROLES.ADMIN || role === ROLES.MANAGER;

const AddTaskAssignedForm = ({
    showForm,
    setShowForm,
    editingTaskAssigned,
    setEditingTaskAssigned,
    handleCreate,
    handleUpdate,
}) => {
    const { auth } = usePage().props;
    const currentUser = auth?.user;

    const [submitting, setSubmitting] = useState(false);
    const [taskAssignedForm, setTaskAssignedForm] = useState(emptyForm);
    const [taskItems, setTaskItems] = useState([{ description: "", status: "Pending" }]);
    const [attachments, setAttachments] = useState([]);
    const [existingAttachments, setExistingAttachments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [menuPortalTarget, setMenuPortalTarget] = useState(null);

    // Lock body scroll + set portal target
    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        setMenuPortalTarget(document.body);

        return () => {
            document.body.style.overflow = "unset";
            document.body.style.position = "static";
            document.body.style.width = "auto";
        };
    }, []);

    // Fetch users for the dropdowns
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

    // Users shown in "Assigned To" — matches the selected department, plus
    // admin/manager users always included regardless of department.
    const assignedTeamOptions = useMemo(() => {
        if (!taskAssignedForm.department) {
            return users; // no department chosen yet — show everyone
        }
        return users.filter(
            (u) =>
                u.role === taskAssignedForm.department.value ||
                isAdminOrManager(u.role)
        );
    }, [users, taskAssignedForm.department]);

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

            setTaskAssignedForm({
                title: editingTaskAssigned.title || "",
                department: editingTaskAssigned.department
                    ? DEPARTMENT_OPTIONS.find((d) => d.value === editingTaskAssigned.department) || {
                          value: editingTaskAssigned.department,
                          label: editingTaskAssigned.department,
                      }
                    : null,
                assigned_team: selectedAssignee || null,
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
                admin_remarks: editingTaskAssigned.admin_remarks || "",
                admin_status: editingTaskAssigned.admin_status || "",
            });
            setTaskItems(
                editingTaskAssigned.task_items?.length
                    ? editingTaskAssigned.task_items.map((i) => ({
                          description: i.description,
                          status: i.status || "Pending",
                      }))
                    : [{ description: "", status: "Pending" }]
            );
            setExistingAttachments(editingTaskAssigned.attachments || []);
            setAttachments([]);
        } else if (!editingTaskAssigned && users.length > 0 && currentUser) {
            // New task: auto-fill "Assigned By" with the logged-in user
            const me = users.find((u) => u.value === currentUser.id) || {
                value: currentUser.id,
                label: currentUser.role ? `${currentUser.name} (${currentUser.role})` : currentUser.name,
                role: currentUser.role,
            };
            setTaskAssignedForm({ ...emptyForm, assigned_by: me });
            setTaskItems([{ description: "", status: "Pending" }]);
            setAttachments([]);
            setExistingAttachments([]);
        }
    }, [editingTaskAssigned, users, currentUser]);

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
        setExistingAttachments([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskAssignedForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (option, fieldName) => {
        setTaskAssignedForm((prev) => {
            const next = { ...prev, [fieldName]: option };

            // Changing department invalidates an assignee who no longer fits
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
        setTaskAssignedForm((prev) => ({ ...prev, assigned_team: me }));
    };

    const addTaskItem = () =>
        setTaskItems((prev) => [...prev, { description: "", status: "Pending" }]);

    const removeTaskItem = (index) =>
        setTaskItems((prev) => prev.filter((_, i) => i !== index));

    const updateTaskItem = (index, field, value) =>
        setTaskItems((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );

    const handleFileChange = (e) => {
        setAttachments((prev) => [...prev, ...Array.from(e.target.files)]);
        e.target.value = "";
    };

    const removeAttachment = (index) =>
        setAttachments((prev) => prev.filter((_, i) => i !== index));

    const isCompleted = taskAssignedForm.status === "Completed";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();

            formData.append("title", taskAssignedForm.title);
            formData.append("start_date", taskAssignedForm.start_date);
            formData.append("due_date", taskAssignedForm.due_date);
            if (taskAssignedForm.description) formData.append("description", taskAssignedForm.description);

            if (isCompleted) {
                if (taskAssignedForm.admin_remarks) formData.append("admin_remarks", taskAssignedForm.admin_remarks);
                if (taskAssignedForm.admin_status) formData.append("admin_status", taskAssignedForm.admin_status);
            }

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

            if (editingTaskAssigned) {
                await handleUpdate(formData, editingTaskAssigned.id);
            } else {
                await handleCreate(formData);
            }

            resetForm();
            setShowForm(false);
            setEditingTaskAssigned(null);
        } catch (error) {
            console.log("Error saving data", error);
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

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingTaskAssigned ? "Edit Task" : "Add New Task"}
                    </h2>
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
                            <p className="text-xs text-gray-400 mt-1">
                                Filters who shows up in "Assigned To" below. Admins/managers always show regardless of department.
                            </p>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Assigned To (does the work)
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
                                        : "Select assignee"
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

                        {editingTaskAssigned && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <Select
                                    value={statusOptions.find((s) => s.value === taskAssignedForm.status)}
                                    onChange={(option) =>
                                        setTaskAssignedForm((prev) => ({ ...prev, status: option.value }))
                                    }
                                    options={statusOptions}
                                    styles={selectStyles}
                                    menuPortalTarget={menuPortalTarget}
                                    menuPosition="fixed"
                                />
                            </div>
                        )}

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

                        {isCompleted && (
                            <>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Remarks</label>
                                    <textarea
                                        name="admin_remarks"
                                        value={taskAssignedForm.admin_remarks}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Status</label>
                                    <input
                                        type="text"
                                        name="admin_status"
                                        value={taskAssignedForm.admin_status}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Task Checklist */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Task Checklist</label>
                            <button
                                type="button"
                                onClick={addTaskItem}
                                className="text-indigo-600 text-sm flex items-center gap-1 hover:text-indigo-800"
                            >
                                <Plus size={16} /> Add Item
                            </button>
                        </div>
                        <div className="space-y-2">
                            {taskItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder={`Item ${index + 1} description`}
                                        value={item.description}
                                        onChange={(e) => updateTaskItem(index, "description", e.target.value)}
                                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {editingTaskAssigned && (
                                        <select
                                            value={item.status}
                                            onChange={(e) => updateTaskItem(index, "status", e.target.value)}
                                            className="border rounded-lg px-2 py-2 text-sm"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    )}
                                    {taskItems.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTaskItem(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                        {existingAttachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {existingAttachments.map((att) => (
                                    <a
                                        key={att.id}
                                        href={`/storage/${att.attachment}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700 hover:bg-gray-200"
                                    >
                                        <Paperclip size={12} />
                                        {att.attachment.split("/").pop()}
                                    </a>
                                ))}
                            </div>
                        )}
                        <input type="file" multiple onChange={handleFileChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
                        {attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {attachments.map((file, index) => (
                                    <span key={index} className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                                        {file.name}
                                        <button type="button" onClick={() => removeAttachment(index)}>
                                            <X size={12} />
                                        </button>
                                    </span>
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
                        {submitting ? "Saving..." : editingTaskAssigned ? "Update Task" : "Create Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTaskAssignedForm;



// import axios from "axios";
// import { X, Plus, Trash2, Paperclip } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import Select from "react-select";

// const emptyForm = {
//     title: "",
//     assigned_team: null, // { value: id, label: name } — who it's assigned TO
//     assigned_by: null,   // { value: id, label: name } — who is assigning it
//     priority: null,
//     start_date: "",
//     due_date: "",
//     description: "",
//     status: "Pending",
//     admin_remarks: "",
//     admin_status: "",
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

// const AddTaskAssignedForm = ({
//     showForm,
//     setShowForm,
//     editingTaskAssigned,
//     setEditingTaskAssigned,
//     handleCreate,
//     handleUpdate,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [taskAssignedForm, setTaskAssignedForm] = useState(emptyForm);
//     const [taskItems, setTaskItems] = useState([{ description: "", status: "Pending" }]);
//     const [attachments, setAttachments] = useState([]);
//     const [existingAttachments, setExistingAttachments] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [loadingUsers, setLoadingUsers] = useState(true);
//     const [menuPortalTarget, setMenuPortalTarget] = useState(null);

//     // Lock body scroll + set portal target — same as AddProjectForm
//     useEffect(() => {
//         document.body.style.overflow = "hidden";
//         document.body.style.position = "fixed";
//         document.body.style.width = "100%";
//         setMenuPortalTarget(document.body);

//         return () => {
//             document.body.style.overflow = "unset";
//             document.body.style.position = "static";
//             document.body.style.width = "auto";
//         };
//     }, []);

//     // Fetch users for both dropdowns — identical shape to AddProjectForm
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

//     useEffect(() => {
//         if (editingTaskAssigned && users.length > 0) {
//             const selectedAssignee = users.find(
//                 (u) => u.value === parseInt(editingTaskAssigned.assigned_team)
//             );
//             const selectedAssigner = users.find(
//                 (u) => u.value === parseInt(editingTaskAssigned.user_id)
//             );
//             const selectedPriority = priorityOptions.find(
//                 (p) => p.value === editingTaskAssigned.priority
//             );
//             const selectedStatus = statusOptions.find(
//                 (s) => s.value === editingTaskAssigned.status
//             );

//             setTaskAssignedForm({
//                 title: editingTaskAssigned.title || "",
//                 assigned_team: selectedAssignee || null,
//                 assigned_by: selectedAssigner || null,
//                 priority: selectedPriority || null,
//                 start_date: editingTaskAssigned.start_date?.slice(0, 10) || "",
//                 due_date: editingTaskAssigned.due_date?.slice(0, 10) || "",
//                 description: editingTaskAssigned.description || "",
//                 status: editingTaskAssigned.status || "Pending",
//                 admin_remarks: editingTaskAssigned.admin_remarks || "",
//                 admin_status: editingTaskAssigned.admin_status || "",
//             });
//             setTaskItems(
//                 editingTaskAssigned.task_items?.length
//                     ? editingTaskAssigned.task_items.map((i) => ({
//                           description: i.description,
//                           status: i.status || "Pending",
//                       }))
//                     : [{ description: "", status: "Pending" }]
//             );
//             setExistingAttachments(editingTaskAssigned.attachments || []);
//             setAttachments([]);
//         } else if (!editingTaskAssigned) {
//             resetForm();
//         }
//     }, [editingTaskAssigned, users]);

//     const resetForm = () => {
//         setTaskAssignedForm(emptyForm);
//         setTaskItems([{ description: "", status: "Pending" }]);
//         setAttachments([]);
//         setExistingAttachments([]);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setTaskAssignedForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSelectChange = (option, fieldName) => {
//         setTaskAssignedForm((prev) => ({ ...prev, [fieldName]: option }));
//     };

//     const addTaskItem = () =>
//         setTaskItems((prev) => [...prev, { description: "", status: "Pending" }]);

//     const removeTaskItem = (index) =>
//         setTaskItems((prev) => prev.filter((_, i) => i !== index));

//     const updateTaskItem = (index, field, value) =>
//         setTaskItems((prev) =>
//             prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
//         );

//     const handleFileChange = (e) => {
//         setAttachments((prev) => [...prev, ...Array.from(e.target.files)]);
//         e.target.value = "";
//     };

//     const removeAttachment = (index) =>
//         setAttachments((prev) => prev.filter((_, i) => i !== index));

//     // Department is derived live from whoever is picked as the assignee
//     const derivedDepartment = taskAssignedForm.assigned_team?.role || "";

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmitting(true);

//         try {
//             const formData = new FormData();

//             formData.append("title", taskAssignedForm.title);
//             formData.append("start_date", taskAssignedForm.start_date);
//             formData.append("due_date", taskAssignedForm.due_date);
//             if (taskAssignedForm.description) formData.append("description", taskAssignedForm.description);
//             if (taskAssignedForm.admin_remarks) formData.append("admin_remarks", taskAssignedForm.admin_remarks);
//             if (taskAssignedForm.admin_status) formData.append("admin_status", taskAssignedForm.admin_status);
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

//             if (editingTaskAssigned) {
//                 await handleUpdate(formData, editingTaskAssigned.id);
//             } else {
//                 await handleCreate(formData);
//             }

//             resetForm();
//             setShowForm(false);
//             setEditingTaskAssigned(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const closeForm = () => {
//         setShowForm(false);
//         setEditingTaskAssigned(null);
//         resetForm();
//     };

//     // Same react-select styling as AddProjectForm
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
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         {editingTaskAssigned ? "Edit Task" : "Add New Task"}
//                     </h2>
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

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Assigned To (does the work)
//                             </label>
//                             <Select
//                                 value={taskAssignedForm.assigned_team}
//                                 onChange={(option) => handleSelectChange(option, "assigned_team")}
//                                 options={users}
//                                 isLoading={loadingUsers}
//                                 isDisabled={loadingUsers}
//                                 placeholder={loadingUsers ? "Loading users..." : "Select assignee"}
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

//                         <div className="col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Department (auto from assignee's role)
//                             </label>
//                             <input
//                                 type="text"
//                                 readOnly
//                                 value={derivedDepartment}
//                                 placeholder="Select an assignee first"
//                                 className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
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

//                         {editingTaskAssigned && (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                                 <Select
//                                     value={statusOptions.find((s) => s.value === taskAssignedForm.status)}
//                                     onChange={(option) =>
//                                         setTaskAssignedForm((prev) => ({ ...prev, status: option.value }))
//                                     }
//                                     options={statusOptions}
//                                     styles={selectStyles}
//                                     menuPortalTarget={menuPortalTarget}
//                                     menuPosition="fixed"
//                                 />
//                             </div>
//                         )}

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

//                         {editingTaskAssigned && (
//                             <div className="col-span-2">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Admin Remarks</label>
//                                 <textarea
//                                     name="admin_remarks"
//                                     value={taskAssignedForm.admin_remarks}
//                                     onChange={handleChange}
//                                     rows={2}
//                                     className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 />
//                             </div>
//                         )}
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
//                                     {editingTaskAssigned && (
//                                         <select
//                                             value={item.status}
//                                             onChange={(e) => updateTaskItem(index, "status", e.target.value)}
//                                             className="border rounded-lg px-2 py-2 text-sm"
//                                         >
//                                             <option value="Pending">Pending</option>
//                                             <option value="Completed">Completed</option>
//                                         </select>
//                                     )}
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
//                         {existingAttachments.length > 0 && (
//                             <div className="flex flex-wrap gap-2 mb-2">
//                                 {existingAttachments.map((att) => (
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
//                         )}
//                         <input type="file" multiple onChange={handleFileChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
//                         {attachments.length > 0 && (
//                             <div className="flex flex-wrap gap-2 mt-2">
//                                 {attachments.map((file, index) => (
//                                     <span key={index} className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
//                                         {file.name}
//                                         <button type="button" onClick={() => removeAttachment(index)}>
//                                             <X size={12} />
//                                         </button>
//                                     </span>
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
//                         {submitting ? "Saving..." : editingTaskAssigned ? "Update Task" : "Create Task"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddTaskAssignedForm;
