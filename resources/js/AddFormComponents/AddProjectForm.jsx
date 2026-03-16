// import React from "react";

// const AddProjectForm = () => {
//     const [submitting, setSubmitting] = useState(false);
//     const [projectForm, setProjectForm] = useState({
//         project_id: "",
//         client_name: "",
//         project_title: "",
//         service_type: "",
//         start_date: "",
//         deadline: "",
//         project_description: "",
//         assigned_team: "",
//         priority: "",
//         status: "",
//         completion: "",
//     });

//     //  Use Effect
//     useEffect(() => {
//         if (editingProject) {
//             setProjectForm({
//                 ...editingProject,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setProjectForm({
//                 project_id: "",
//                 client_name: "",
//                 project_title: "",
//                 service_type: "",
//                 start_date: "",
//                 deadline: "",
//                 project_description: "",
//                 assigned_team: "",
//                 priority: "",
//                 status: "",
//                 completion: "",
//             });
//         }
//     }, [editingProject]);

//     // Handle Create Project
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourprojects.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating project", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in projectForm) {
//             if (projectForm[key] !== null && projectForm[key] !== "") {
//                 formData.append(key, projectForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingProject) {
//                 // Editing existing project
//                 await handleUpdate(formData, editingProject.id);
//             } else {
//                 // Creating new project
//                 await handleCreate(formData);
//             }
//             setProjectForm({
//                 project_id: "",
//                 client_name: "",
//                 project_title: "",
//                 service_type: "",
//                 start_date: "",
//                 deadline: "",
//                 project_description: "",
//                 assigned_team: "",
//                 priority: "",
//                 status: "",
//                 completion: "",
//             });

//             setShowForm(false);
//             setEditingProject(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setProjectForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));
//     };
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
//                     <h2 className="text-2xl font-bold">Add New Gallery Item</h2>
//                     <button
//                         type="button"
//                         className="p-2 hover:bg-gray-100 rounded-full transition"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddProjectForm;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Plus, Trash2, CheckCircle, Circle } from "lucide-react";

const AddProjectForm = ({ editingProject, onClose, onUpdate, setReloadTrigger }) => {
    const [submitting, setSubmitting] = useState(false);
    const [tasks, setTasks] = useState([]);

    const emptyForm = {
        client_name: "",
        project_title: "",
        service_type: "",
        start_date: "",
        deadline: "",
        assigned_team: "",
        priority: "",
        status: "",
    };

    const [projectForm, setProjectForm] = useState(emptyForm);

    // Parse tasks from project_description or initialize empty
    useEffect(() => {
        if (editingProject) {
            setProjectForm({
                client_name: editingProject.client_name ?? "",
                project_title: editingProject.project_title ?? "",
                service_type: editingProject.service_type ?? "",
                start_date: editingProject.start_date ?? "",
                deadline: editingProject.deadline ?? "",
                assigned_team: editingProject.assigned_team ?? "",
                priority: editingProject.priority ?? "",
                status: editingProject.status ?? "",
            });

            // Parse tasks from stored JSON
            if (editingProject.project_description) {
                try {
                    const parsedTasks = JSON.parse(editingProject.project_description);
                    setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
                } catch (e) {
                    // If not JSON, initialize empty
                    setTasks([]);
                }
            } else {
                setTasks([]);
            }
        } else {
            setProjectForm(emptyForm);
            setTasks([]);
        }
    }, [editingProject]);

    // Calculate completion percentage based on tasks
    const calculateCompletion = () => {
        if (tasks.length === 0) return 0;
        const completedTasks = tasks.filter(task => task.completed).length;
        return Math.round((completedTasks / tasks.length) * 100);
    };

    // Add new task
    const addTask = () => {
        setTasks([...tasks, { id: Date.now(), text: "", completed: false }]);
    };

    // Remove task
    const removeTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    // Update task text
    const updateTaskText = (taskId, newText) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, text: newText } : task
        ));
    };

    // Toggle task completion
    const toggleTaskCompletion = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    // Handle form change
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setProjectForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    // Submit — create or update
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Filter out empty tasks
        const validTasks = tasks.filter(task => task.text.trim() !== "");
        
        // Create form data
        const formData = new FormData();
        
        // Add all regular fields
        for (const key in projectForm) {
            if (projectForm[key] !== null && projectForm[key] !== "") {
                formData.append(key, projectForm[key]);
            }
        }
        
        // Add tasks as JSON string in project_description
        formData.append("project_description", JSON.stringify(validTasks));
        
        // Add calculated completion percentage
        const completionPercentage = calculateCompletion();
        formData.append("completion", completionPercentage);

        try {
            setSubmitting(true);

            if (editingProject) {
                await onUpdate(formData, editingProject.id);
            } else {
                await axios.post(route("ourprojects.store"), formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setReloadTrigger((prev) => !prev);
            }

            onClose();
        } catch (error) {
            console.error("Error saving project:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Shared input classes
    const inputClass =
        "w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition";

    const labelClass = "block text-xs font-semibold tracking-wide text-stone-500 uppercase mb-1";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-100">
                    <h2 className="text-xl font-bold tracking-wide text-stone-800">
                        {editingProject ? "Edit Project" : "Add New Project"}
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

                    {/* Row: Client + Title */}
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
                            <label className={labelClass}>Project Title *</label>
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

                    {/* Service Type */}
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

                    {/* Row: Start Date + Deadline */}
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

                    {/* Tasks Section - replaces the rich text editor */}
                    <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
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

                        {/* Tasks List */}
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

                        {/* Progress Preview */}
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
                    </div>

                    {/* Assigned Team */}
                    <div>
                        <label className={labelClass}>Assigned Team</label>
                        <input
                            type="text"
                            name="assigned_team"
                            value={projectForm.assigned_team}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="e.g. Design Team"
                        />
                    </div>

                    {/* Row: Priority + Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Priority *</label>
                            <select
                                name="priority"
                                value={projectForm.priority}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            >
                                <option value="">Select priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Status *</label>
                            <select
                                name="status"
                                value={projectForm.status}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            >
                                <option value="">Select status</option>
                                <option value="pending">Pending</option>
                                <option value="in progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
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
                            disabled={submitting}
                            className="px-6 py-2 rounded-full text-sm font-medium tracking-wide bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting
                                ? "Saving..."
                                : editingProject
                                    ? "Update Project"
                                    : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectForm;