import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Plus, Trash2, CheckCircle, Circle } from "lucide-react";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const EditProjectForm = ({
    editingProject,
    onClose,
    onUpdate,
    setReloadTrigger,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [menuPortalTarget, setMenuPortalTarget] = useState(null);

    // Lock body scroll and set portal target when form mounts
    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";

        // Set portal target to body for react-select menus to overflow properly
        setMenuPortalTarget(document.body);

        return () => {
            document.body.style.overflow = "unset";
            document.body.style.position = "static";
            document.body.style.width = "auto";
        };
    }, []);

    const [projectForm, setProjectForm] = useState({
        client_name: "",
        project_title: "",
        service_type: "",
        start_date: "",
        deadline: "",
        assigned_team: null,
        priority: null,
        status: null,
        user_remarks: "",
        admin_remarks: "",
    });

    // Options for select fields
    const priorityOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
    ];

    const statusOptions = [
        { value: "pending", label: "Pending" },
        { value: "in progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const quillModules = {
        toolbar: [[{ list: "ordered" }], [{ list: "bullet" }]],
    };

    const quillFormats = ["list", "bullet"];

    // Fetch users for assigned team dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const response = await axios.get(route("ourusers.index"));
                // Transform users to react-select format
                const userOptions = (response.data.users || []).map((user) => ({
                    value: user.id,
                    label: `${user.name}`,
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

    // Parse tasks from project_description or initialize empty
    useEffect(() => {
        if (editingProject) {
            // Find the selected user from users array
            const selectedUser = users.find(
                (u) => u.value === parseInt(editingProject.assigned_team),
            );

            // Find selected priority
            const selectedPriority = priorityOptions.find(
                (p) => p.value === editingProject.priority,
            );

            // Find selected status
            const selectedStatus = statusOptions.find(
                (s) => s.value === editingProject.status,
            );

            setProjectForm({
                client_name: editingProject.client_name ?? "",
                project_title: editingProject.project_title ?? "",
                service_type: editingProject.service_type ?? "",
                start_date: editingProject.start_date ?? "",
                deadline: editingProject.deadline ?? "",
                assigned_team: selectedUser || null,
                priority: selectedPriority || null,
                status: selectedStatus || null,
                user_remarks: editingProject.user_remarks ?? "",
                admin_remarks: editingProject.admin_remarks ?? "",
            });

            // Parse tasks from stored JSON
            if (editingProject.project_description) {
                try {
                    const parsedTasks = JSON.parse(
                        editingProject.project_description,
                    );
                    setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
                } catch (e) {
                    // If not JSON, initialize empty
                    setTasks([]);
                }
            } else {
                setTasks([]);
            }
        }
    }, [editingProject, users]);

    // Calculate completion percentage based on tasks
    const calculateCompletion = () => {
        if (tasks.length === 0) return 0;
        const completedTasks = tasks.filter((task) => task.completed).length;
        return Math.round((completedTasks / tasks.length) * 100);
    };

    // Add new task
    const addTask = () => {
        setTasks([...tasks, { id: Date.now(), text: "", completed: false }]);
    };

    // Remove task
    const removeTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    // Update task text
    const updateTaskText = (taskId, newText) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId ? { ...task, text: newText } : task,
            ),
        );
    };

    // Toggle task completion
    const toggleTaskCompletion = (taskId) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task,
            ),
        );
    };

    // Handle form change for regular inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle react-select changes
    const handleSelectChange = (selectedOption, fieldName) => {
        setProjectForm((prev) => ({
            ...prev,
            [fieldName]: selectedOption,
        }));
    };

    // Submit — update project
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Filter out empty tasks
    //     const validTasks = tasks.filter((task) => task.text.trim() !== "");

    //     // Create form data
    //     const formData = new FormData();

    //     // Add all regular fields
    //     for (const key in projectForm) {
    //         if (key === "assigned_team" && projectForm.assigned_team) {
    //             formData.append(key, projectForm.assigned_team.value);
    //         } else if (key === "priority" && projectForm.priority) {
    //             formData.append(key, projectForm.priority.value);
    //         } else if (key === "status" && projectForm.status) {
    //             formData.append(key, projectForm.status.value);
    //         } else if (projectForm[key] !== null && projectForm[key] !== "") {
    //             formData.append(key, projectForm[key]);
    //         }
    //     }

    //     // Add tasks as JSON string in project_description
    //     formData.append("project_description", JSON.stringify(validTasks));

    //     // Add calculated completion percentage
    //     const completionPercentage = calculateCompletion();
    //     formData.append("completion", completionPercentage);

    //     // Add _method field for Laravel to recognize as PUT request
    //     formData.append("_method", "PUT");

    //     try {
    //         setSubmitting(true);
    //         await onUpdate(formData, editingProject.id);
    //         onClose();
    //     } catch (error) {
    //         console.error("Error updating project:", error);
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const validTasks = tasks.filter((task) => task.text.trim() !== "");

    const formData = new FormData();
    for (const key in projectForm) {
        if (key === "assigned_team" && projectForm.assigned_team) {
            formData.append(key, projectForm.assigned_team.value);
        } else if (key === "priority" && projectForm.priority) {
            formData.append(key, projectForm.priority.value);
        } else if (key === "status" && projectForm.status) {
            formData.append(key, projectForm.status.value);
        } else if (projectForm[key] !== null && projectForm[key] !== "") {
            formData.append(key, projectForm[key]);
        }
    }

    formData.append("project_description", JSON.stringify(validTasks));
    formData.append("completion", calculateCompletion());
    formData.append("_method", "PUT");

    try {
        setSubmitting(true);
        await toast.promise(onUpdate(formData, editingProject.id), {
            loading: "Updating project...",
            success: () => {
                onClose();
                return "Project updated successfully!";
            },
            error: "Failed to update project.",
        });
    } catch (error) {
        // errors already handled inside toast.promise
    } finally {
        setSubmitting(false);
    }
};

    // Custom styles for react-select with proper z-index for portal
    const selectStyles = {
        control: (base) => ({
            ...base,
            borderColor: "#d6d3d1", // stone-300
            borderRadius: "0.5rem",
            padding: "0.125rem 0",
            boxShadow: "none",
            "&:hover": {
                borderColor: "#a8a29e", // stone-400
            },
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
            "&:active": {
                backgroundColor: "#6366f1",
            },
        }),
        menu: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            overflow: "hidden",
            zIndex: 9999,
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
    };

    // Shared input classes
    const inputClass =
        "w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition";

    const labelClass =
        "block text-xs font-semibold tracking-wide text-stone-500 uppercase mb-1";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-100">
                    <h2 className="text-xl font-bold tracking-wide text-stone-800">
                        Edit Project
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-stone-100 rounded-full transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Client + Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Client Name *</label>
                            <input
                                type="text"
                                name="client_name"
                                value={projectForm.client_name}
                                onChange={handleChange}
                                className={inputClass}
                                required
                                placeholder="e.g. Acme Corp"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                Project Title *
                            </label>
                            <input
                                type="text"
                                name="project_title"
                                value={projectForm.project_title}
                                onChange={handleChange}
                                className={inputClass}
                                required
                                placeholder="e.g. Website Redesign"
                            />
                        </div>
                    </div>

                    {/* Row 2: Assigned Team Member + Service Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                Assigned Team Member *
                            </label>
                            <Select
                                name="assigned_team"
                                value={projectForm.assigned_team}
                                onChange={(option) =>
                                    handleSelectChange(option, "assigned_team")
                                }
                                options={users}
                                isLoading={loadingUsers}
                                isDisabled={loadingUsers}
                                placeholder={
                                    loadingUsers
                                        ? "Loading users..."
                                        : "Select a team member"
                                }
                                isClearable
                                required
                                styles={selectStyles}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                menuPortalTarget={menuPortalTarget}
                                menuPosition="fixed"
                            />
                            {users.length === 0 && !loadingUsers && (
                                <p className="text-xs text-amber-600 mt-1">
                                    No users found. Please add users first.
                                </p>
                            )}
                        </div>
                        <div>
                            <label className={labelClass}>Service Type *</label>
                            <input
                                type="text"
                                name="service_type"
                                value={projectForm.service_type}
                                onChange={handleChange}
                                className={inputClass}
                                required
                                placeholder="e.g. Web Development"
                            />
                        </div>
                    </div>

                    {/* Tasks Section */}
                    {/* <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
                        <div className="flex justify-between items-center mb-3">
                            <label className={labelClass}>Project Tasks</label>
                            <button
                                type="button"
                                onClick={addTask}
                                className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition"
                            >
                                <Plus size={14} />
                                Add Task
                            </button>
                        </div>

                    
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {tasks.length === 0 ? (
                                <p className="text-sm text-stone-400 text-center py-4">
                                    No tasks added yet. Click "Add Task" to create your first task.
                                </p>
                            ) : (
                                tasks.map((task, index) => (
                                    <div key={task.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-stone-200">
                                        <button
                                            type="button"
                                            onClick={() => toggleTaskCompletion(task.id)}
                                            className="flex-shrink-0"
                                        >
                                            {task.completed ? (
                                                <CheckCircle size={20} className="text-emerald-500" />
                                            ) : (
                                                <Circle size={20} className="text-stone-400" />
                                            )}
                                        </button>
                                        <input
                                            type="text"
                                            value={task.text}
                                            onChange={(e) => updateTaskText(task.id, e.target.value)}
                                            placeholder={`Task ${index + 1}`}
                                            className="flex-1 text-sm border-none focus:ring-0 p-1 bg-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeTask(task.id)}
                                            className="flex-shrink-0 p-1 hover:bg-red-100 rounded-full text-red-500 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        
                        {tasks.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-stone-200">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium text-stone-600">Progress Preview</span>
                                    <span className="text-xs font-bold text-indigo-600">{calculateCompletion()}%</span>
                                </div>
                                <div className="w-full bg-stone-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${calculateCompletion()}%` }}
                                    />
                                </div>
                                <p className="text-xs text-stone-400 mt-1">
                                    {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
                                </p>
                            </div>
                        )}
                    </div> */}

                    {/* Row 3: Start Date + Deadline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Start Date *</label>
                            <input
                                type="date"
                                name="start_date"
                                value={projectForm.start_date}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Deadline *</label>
                            <input
                                type="date"
                                name="deadline"
                                value={projectForm.deadline}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    {/* Row 4: Priority + Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Priority *</label>
                            <Select
                                name="priority"
                                value={projectForm.priority}
                                onChange={(option) =>
                                    handleSelectChange(option, "priority")
                                }
                                options={priorityOptions}
                                placeholder="Select priority"
                                isClearable
                                required
                                styles={selectStyles}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                menuPortalTarget={menuPortalTarget}
                                menuPosition="fixed"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Status *</label>
                            <Select
                                name="status"
                                value={projectForm.status}
                                onChange={(option) =>
                                    handleSelectChange(option, "status")
                                }
                                options={statusOptions}
                                placeholder="Select status"
                                isClearable
                                required
                                styles={selectStyles}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                menuPortalTarget={menuPortalTarget}
                                menuPosition="fixed"
                            />
                        </div>
                    </div>

                    {/* Row 5: User Remarks + Admin Remarks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* <div>
                            <label className={labelClass}>User Remarks</label>
                            <textarea
                                name="user_remarks"
                                value={projectForm.user_remarks}
                                onChange={handleChange}
                                className={`${inputClass} min-h-[80px] resize-y`}
                                placeholder="Enter remarks from user perspective..."
                                rows="3"
                            />
                        </div> */}
                        <div>
                            <label className={labelClass}>User Remarks</label>
                            <ReactQuill
                                value={projectForm.user_remarks}
                                onChange={(value) =>
                                    setProjectForm((prev) => ({
                                        ...prev,
                                        user_remarks: value,
                                    }))
                                }
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Enter user remarks..."
                                className="bg-white"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Admin Remarks</label>
                            <ReactQuill
                                value={projectForm.admin_remarks}
                                onChange={(value) =>
                                    setProjectForm((prev) => ({
                                        ...prev,
                                        admin_remarks: value,
                                    }))
                                }
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Enter admin remarks..."
                                className="bg-white"
                            />
                        </div>
                        {/* <div>
                            <label className={labelClass}>Admin Remarks</label>
                            <textarea
                                name="admin_remarks"
                                value={projectForm.admin_remarks}
                                onChange={handleChange}
                                className={`${inputClass} min-h-[80px] resize-y`}
                                placeholder="Enter administrative remarks..."
                                rows="3"
                            />
                        </div> */}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-full text-sm font-medium tracking-wide text-stone-600 hover:bg-stone-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || loadingUsers}
                            className="px-6 py-2 rounded-full text-sm font-medium tracking-wide bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Updating..." : "Update Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProjectForm;
