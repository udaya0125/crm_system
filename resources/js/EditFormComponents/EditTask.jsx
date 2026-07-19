import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { X, Plus, Trash2 } from "lucide-react";

const EditTask = ({ onUpdateTask, onClose, editingTask, taskLists }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            is_completed: "incomplete",
            due_date: "",
            new_descriptions: [""],
        },
    });

    const [existingDescriptions, setExistingDescriptions] = useState([]);
    const [newDescriptionFields, setNewDescriptionFields] = useState([""]);

    // Add this useEffect to lock body scroll when form mounts
    useEffect(() => {
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
        };
    }, []);

    // Check if task is completed & disable editing if so
    const isTaskCompleted = editingTask?.is_completed;

    // React Quill modules configuration
    const quillModules = {
        toolbar: !isTaskCompleted
            ? [
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
              ]
            : false, // Disable toolbar if task is completed
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

    // Format date for datetime-local input from backend data
    const formatDateForInput = (dateString, timeString) => {
        if (!dateString) return "";

        try {
            const date = new Date(dateString);

            // If time is available, add it to the date
            if (timeString) {
                const [hours, minutes] = timeString.split(":");
                date.setHours(parseInt(hours) || 0);
                date.setMinutes(parseInt(minutes) || 0);
            }

            // Format to YYYY-MM-DDTHH:mm for datetime-local input
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
            console.error("Error formatting date for input:", error);
            return "";
        }
    };

    useEffect(() => {
        if (editingTask) {
            // Load existing descriptions as read-only
            const existingDescs = editingTask.descriptions || [];
            setExistingDescriptions(existingDescs);

            // Initialize with one empty field for new description
            setNewDescriptionFields([""]);

            // Format the date for datetime-local input
            const formattedDate = formatDateForInput(
                editingTask.due_date,
                editingTask.due_time
            );

            reset({
                is_completed: editingTask.is_completed
                    ? "complete"
                    : "incomplete",
                due_date: formattedDate,
                new_descriptions: [""],
            });
        }
    }, [editingTask, reset]);

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            // Format due_date for backend
            const formattedDueDate = formatDateForBackend(data.due_date);

            // Combine existing descriptions with new ones
            const existingDescs = existingDescriptions.map(
                (desc) => desc.content
            );

            // Filter out empty new descriptions
            const filteredNewDescriptions = data.new_descriptions.filter(
                (desc) => desc && desc.trim() !== "" && desc !== "<p><br></p>"
            );

            // Combine existing and new descriptions
            const allDescriptions = [
                ...existingDescs,
                ...filteredNewDescriptions,
            ];

            const taskData = {
                title: editingTask.title,
                is_completed: data.is_completed === "complete",
                due_date: formattedDueDate,
                task_list_id: editingTask.task_list_id,
                descriptions:
                    allDescriptions.length > 0 ? allDescriptions : [""],
            };

            await onUpdateTask(taskData);
            onClose(); // Close the form after successful submission
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    };

    // Add a new description field
    const addNewDescriptionField = () => {
        if (!isTaskCompleted) {
            setNewDescriptionFields([...newDescriptionFields, ""]);
            const currentNewDescriptions = watch("new_descriptions");
            setValue("new_descriptions", [...currentNewDescriptions, ""]);
        }
    };

    // Remove a new description field
    const removeNewDescriptionField = (index) => {
        if (!isTaskCompleted && newDescriptionFields.length > 1) {
            const newFields = [...newDescriptionFields];
            newFields.splice(index, 1);
            setNewDescriptionFields(newFields);

            const currentNewDescriptions = watch("new_descriptions");
            const newDescriptions = [...currentNewDescriptions];
            newDescriptions.splice(index, 1);
            setValue("new_descriptions", newDescriptions);
        }
    };

    // Function to safely parse HTML content
    const parseDescriptionContent = (desc) => {
        if (typeof desc === "string") return desc;
        if (desc && desc.content) return desc.content;
        return "";
    };

    // Handle cancel
    const handleCancel = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="p-6 text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold">Edit Task</h2>
                    {isTaskCompleted && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            Completed
                        </span>
                    )}
                </div>
                <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    type="button"
                    disabled={isSubmitting}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Task Title (Read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Title
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={editingTask?.title || ""}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                            disabled
                            readOnly
                        />
                    </div>
                </div>

                {/* First Row - Due Date and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Due Date and Time Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date & Time
                        </label>
                        <div className="relative">
                            <Controller
                                name="due_date"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="datetime-local"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 ${
                                            isTaskCompleted
                                                ? "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                        disabled={isTaskCompleted}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Status Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <div className="relative">
                            <Controller
                                name="is_completed"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isSubmitting}
                                    >
                                        <option value="incomplete">Incomplete</option>
                                        <option value="complete">Complete</option>
                                    </select>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Existing Descriptions (Read-only) */}
                {/* {existingDescriptions.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Existing Descriptions
                        </label>
                        <div className="space-y-3">
                            {existingDescriptions.map((desc, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                                >
                                    <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: parseDescriptionContent(desc),
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )} */}

                {/* New Description Fields - Editable */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">
                            Add New Descriptions
                        </label>
                        {!isTaskCompleted && (
                            <button
                                type="button"
                                onClick={addNewDescriptionField}
                                className="inline-flex items-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                                disabled={isSubmitting}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Description
                            </button>
                        )}
                    </div>

                    {newDescriptionFields.map((_, index) => (
                        <div key={`new-${index}`} className="relative group">
                            <Controller
                                name={`new_descriptions.${index}`}
                                control={control}
                                render={({ field }) => (
                                    <div
                                        className={`border ${
                                            isTaskCompleted
                                                ? "border-gray-200 bg-gray-50"
                                                : "border-gray-300"
                                        } rounded-lg overflow-hidden`}
                                    >
                                        <ReactQuill
                                            {...field}
                                            theme="snow"
                                            modules={quillModules}
                                            formats={quillFormats}
                                            className="h-40 mb-12"
                                            value={field.value}
                                            onChange={(content) =>
                                                !isTaskCompleted &&
                                                field.onChange(content)
                                            }
                                            readOnly={isTaskCompleted}
                                        />
                                    </div>
                                )}
                            />
                            {!isTaskCompleted && newDescriptionFields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeNewDescriptionField(index)}
                                    className="absolute -right-2 -top-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100"
                                    disabled={isSubmitting}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                Updating...
                            </span>
                        ) : (
                            <span>Update Task</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTask;

