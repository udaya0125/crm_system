import React from "react";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddTask = ({ onAddTask, onClose, taskLists }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            title: "",
            due_date: "",
            task_list_id: "",
            description: "",
        },
    });

    // React Quill modules configuration
    const quillModules = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image"],
        ],
    };

    const quillFormats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
        "background",
        "align",
        "code-block",
    ];

    // Format date to d-m-y H:i format for Laravel
    const formatDateForBackend = (dateString) => {
        if (!dateString) return null;

        try {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = String(date.getFullYear()).slice(-2);
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            return `${day}-${month}-${year} ${hours}:${minutes}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return null;
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            // Format due_date for backend
            const formattedDueDate = formatDateForBackend(data.due_date);

            const taskData = {
                title: data.title,
                is_completed: false, // Always set to false (incomplete) for new tasks
                due_date: formattedDueDate,
                task_list_id: data.task_list_id,
                descriptions:
                    data.description &&
                    data.description.trim() !== "" &&
                    data.description !== "<p><br></p>"
                        ? [data.description]
                        : [""],
            };

            await onAddTask(taskData);
            reset(); // Clear form
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                >
                    Title *
                </label>
                <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="text"
                            placeholder="Enter task title"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                errors.title
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                    )}
                />
                {errors.title && (
                    <p className="text-sm text-red-500">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <ReactQuill
                                {...field}
                                theme="snow"
                                modules={quillModules}
                                formats={quillFormats}
                                className="h-40 mb-12"
                                placeholder="Enter task description..."
                                onChange={(content) => field.onChange(content)}
                            />
                        </div>
                    )}
                />
            </div>

            {/* Due Date and Time Field */}
            <div className="space-y-2">
                <label
                    htmlFor="due_date"
                    className="block text-sm font-medium text-gray-700"
                >
                    Due Date & Time
                </label>
                <Controller
                    name="due_date"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="datetime-local"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    )}
                />
            </div>

            {/* Task List ID Field */}
            <div className="space-y-2">
                <label
                    htmlFor="task_list_id"
                    className="block text-sm font-medium text-gray-700"
                >
                    Task List *
                </label>
                <Controller
                    name="task_list_id"
                    control={control}
                    rules={{ required: "Task list is required" }}
                    render={({ field }) => (
                        <select
                            {...field}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                errors.task_list_id
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        >
                            <option value="">Select a Task List</option>
                            {taskLists &&
                                taskLists.map((list) => (
                                    <option key={list.id} value={list.id}>
                                        {list.title}
                                        {/* {list.assigned_user ? `(Assigned to: ${list.assigned_user.name})` : ''} */}
                                    </option>
                                ))}
                        </select>
                    )}
                />
                {errors.task_list_id && (
                    <p className="text-sm text-red-500">
                        {errors.task_list_id.message}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Saving..." : "Add Task"}
                </button>
            </div>
        </form>
    );
};

export default AddTask;
