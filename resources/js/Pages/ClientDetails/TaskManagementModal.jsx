import React, { useState, useEffect } from "react";
import {
    X,
    Plus,
    Trash2,
    CheckCircle,
    Circle,
    Save,
    ArrowUp,
    ArrowDown,
} from "lucide-react";

const TaskManagementModal = ({ project, onClose, onSave }) => {
    const [tasks, setTasks] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // Parse tasks from project_description and sort by newest first (assuming tasks have timestamps in id)
    useEffect(() => {
        if (project?.project_description) {
            try {
                const parsedTasks = JSON.parse(project.project_description);
                if (Array.isArray(parsedTasks)) {
                    // Sort tasks by ID (timestamp) in descending order to show newest first
                    const sortedTasks = [...parsedTasks].sort(
                        (a, b) => b.id - a.id,
                    );
                    setTasks(sortedTasks);
                } else {
                    setTasks([]);
                }
            } catch (e) {
                // If not JSON, create a single task from the description
                if (project.project_description) {
                    setTasks([
                        {
                            id: Date.now(),
                            text: project.project_description,
                            completed: false,
                        },
                    ]);
                } else {
                    setTasks([]);
                }
            }
        } else {
            setTasks([]);
        }
    }, [project]);

    // Calculate completion percentage
    const calculateCompletion = () => {
        if (tasks.length === 0) return 0;
        const completedTasks = tasks.filter((task) => task.completed).length;
        return Math.round((completedTasks / tasks.length) * 100);
    };

    // Add new task - now adds to the top
    const addTask = () => {
        const newTask = {
            id: Date.now(), // Using timestamp ensures newer tasks have higher IDs
            text: "",
            completed: false,
        };
        // Add new task to the beginning of the array
        setTasks([newTask, ...tasks]);

        // Auto-focus the new task input (we'll need to use ref for this)
        setTimeout(() => {
            const taskInputs = document.querySelectorAll(".task-input");
            if (taskInputs.length > 0) {
                taskInputs[0].focus();
            }
        }, 100);
    };

    // Remove task
    const removeTask = (taskId) => {
        if (tasks.length <= 1) {
            if (
                !confirm(
                    "Removing all tasks will set progress to 0%. Continue?",
                )
            )
                return;
        }
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

    // Move task up (earlier in the list)
    const moveTaskUp = (index) => {
        if (index === 0) return; // Already at the top
        const newTasks = [...tasks];
        [newTasks[index - 1], newTasks[index]] = [
            newTasks[index],
            newTasks[index - 1],
        ];
        setTasks(newTasks);
    };

    // Move task down (later in the list)
    const moveTaskDown = (index) => {
        if (index === tasks.length - 1) return; // Already at the bottom
        const newTasks = [...tasks];
        [newTasks[index], newTasks[index + 1]] = [
            newTasks[index + 1],
            newTasks[index],
        ];
        setTasks(newTasks);
    };

    // Handle save
    const handleSave = async () => {
        // Filter out empty tasks
        const validTasks = tasks.filter((task) => task.text.trim() !== "");

        if (validTasks.length === 0) {
            if (
                !confirm("No valid tasks. This will clear all tasks. Continue?")
            ) {
                return;
            }
        }

        setIsSaving(true);
        try {
            await onSave(project.id, validTasks);
        } catch (error) {
            console.error("Error saving tasks:", error);
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-stone-100">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                            Task Management
                        </h2>
                        <p className="text-sm text-stone-500 mt-1">
                            {project?.project_title} - {project?.client_name}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-stone-100 rounded-full transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Project Info Summary */}
                <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-stone-50 rounded-lg">
                    <div>
                        <span className="text-xs text-stone-400 block">
                            Priority
                        </span>
                        <span
                            className={`text-sm font-medium capitalize mt-1 ${
                                project?.priority === "high"
                                    ? "text-red-600"
                                    : project?.priority === "medium"
                                      ? "text-amber-600"
                                      : "text-emerald-600"
                            }`}
                        >
                            {project?.priority}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-stone-400 block">
                            Status
                        </span>
                        <span
                            className={`text-sm font-medium capitalize mt-1 ${
                                project?.status === "completed"
                                    ? "text-emerald-600"
                                    : project?.status === "in progress"
                                      ? "text-blue-600"
                                      : project?.status === "pending"
                                        ? "text-amber-600"
                                        : "text-red-600"
                            }`}
                        >
                            {project?.status}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-stone-400 block">
                            Deadline
                        </span>
                        <span className="text-sm font-medium text-stone-700 mt-1">
                            {project?.deadline}
                        </span>
                    </div>
                </div>

                {/* Tasks Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <label className="block text-xs font-semibold tracking-wide text-stone-500 uppercase">
                            Project Tasks{" "}
                            {tasks.length > 0 && `(${tasks.length})`}
                        </label>
                        <button
                            type="button"
                            onClick={addTask}
                            className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition"
                        >
                            <Plus size={14} />
                            Add Task
                        </button>
                    </div>

                    {/* Tasks List - Now with newest at the top */}
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {tasks.length === 0 ? (
                            <div className="text-center py-8 bg-stone-50 rounded-lg border-2 border-dashed border-stone-200">
                                <p className="text-sm text-stone-400">
                                    No tasks yet. Click "Add Task" to create
                                    your first task.
                                </p>
                            </div>
                        ) : (
                            tasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    className={`flex items-center gap-2 bg-white p-3 rounded-lg border transition-all ${
                                        task.completed
                                            ? "border-emerald-200 bg-emerald-50/30"
                                            : "border-stone-200 hover:border-indigo-200"
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleTaskCompletion(task.id)
                                        }
                                        className="flex-shrink-0 transition-transform hover:scale-110"
                                        title={
                                            task.completed
                                                ? "Mark as incomplete"
                                                : "Mark as complete"
                                        }
                                    >
                                        {task.completed ? (
                                            <CheckCircle
                                                size={22}
                                                className="text-emerald-500"
                                            />
                                        ) : (
                                            <Circle
                                                size={22}
                                                className="text-stone-400 hover:text-indigo-400"
                                            />
                                        )}
                                    </button>

                                    <input
                                        type="text"
                                        value={task.text}
                                        onChange={(e) =>
                                            updateTaskText(
                                                task.id,
                                                e.target.value,
                                            )
                                        }
                                        placeholder={`Task ${index + 1}`}
                                        className={`task-input flex-1 text-sm border-none focus:ring-0 p-1 bg-transparent ${
                                            task.completed
                                                ? "line-through text-stone-400"
                                                : "text-stone-700"
                                        }`}
                                    />

                                    {/* Move Up/Down buttons */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => moveTaskUp(index)}
                                            disabled={index === 0}
                                            className={`p-1.5 rounded-full transition ${
                                                index === 0
                                                    ? "text-stone-300 cursor-not-allowed"
                                                    : "hover:bg-stone-100 text-stone-500"
                                            }`}
                                            title="Move up"
                                        >
                                            <ArrowUp size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveTaskDown(index)}
                                            disabled={
                                                index === tasks.length - 1
                                            }
                                            className={`p-1.5 rounded-full transition ${
                                                index === tasks.length - 1
                                                    ? "text-stone-300 cursor-not-allowed"
                                                    : "hover:bg-stone-100 text-stone-500"
                                            }`}
                                            title="Move down"
                                        >
                                            <ArrowDown size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeTask(task.id)}
                                            className="p-1.5 hover:bg-red-100 rounded-full text-red-500 transition"
                                            title="Remove task"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Progress Preview */}
                    {tasks.length > 0 && (
                        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-stone-700">
                                    Progress
                                </span>
                                <span className="text-lg font-bold text-indigo-600">
                                    {calculateCompletion()}%
                                </span>
                            </div>
                            <div className="w-full bg-stone-200 rounded-full h-2.5 mb-2">
                                <div
                                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${calculateCompletion()}%`,
                                    }}
                                />
                            </div>
                            <p className="text-xs text-stone-500">
                                {tasks.filter((t) => t.completed).length} of{" "}
                                {tasks.length} tasks completed
                            </p>
                        </div>
                    )}
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
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium tracking-wide bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <Save size={16} />
                        {isSaving ? "Saving..." : "Save Tasks"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskManagementModal;
