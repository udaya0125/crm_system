import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
    
    // Check if task is completed
    const isTaskCompleted = editingTask?.is_completed;

    // React Quill modules configuration
    const quillModules = {
        toolbar: !isTaskCompleted ? [
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
        ] : false, // Disable toolbar if task is completed
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
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${day}-${month}-${year} ${hours}:${minutes}`;
        } catch (error) {
            console.error('Error formatting date:', error);
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
                const [hours, minutes] = timeString.split(':');
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
            console.error('Error formatting date for input:', error);
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
            const formattedDate = formatDateForInput(editingTask.due_date, editingTask.due_time);

            reset({
                is_completed: editingTask.is_completed ? "complete" : "incomplete",
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
                descriptions: allDescriptions.length > 0 ? allDescriptions : [""],
            };

            await onUpdateTask(taskData);
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Description Fields - Editable */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                        Add Description
                    </label>
                </div>

                {newDescriptionFields.map((_, index) => (
                    <div key={`new-${index}`} className="space-y-2">
                        <Controller
                            name={`new_descriptions.${index}`}
                            control={control}
                            render={({ field }) => (
                                <div className={`border ${isTaskCompleted ? 'border-gray-200 bg-gray-50' : 'border-gray-300'} rounded-lg overflow-hidden`}>
                                    <ReactQuill
                                        {...field}
                                        theme="snow"
                                        modules={quillModules}
                                        formats={quillFormats}
                                        className="h-40 mb-12"
                                        value={field.value}
                                        onChange={(content) => !isTaskCompleted && field.onChange(content)}
                                        readOnly={isTaskCompleted}
                                    />
                                </div>
                            )}
                        />
                    </div>
                ))}
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
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 transition duration-200 ${
                                isTaskCompleted 
                                    ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed' 
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            disabled={isTaskCompleted}
                        />
                    )}
                />
                {/* <p className="text-xs text-gray-500">
                    {isTaskCompleted ? 'Cannot modify due date for completed tasks' : 'Select both date and time for the task deadline'}
                </p> */}
            </div>

            
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Status
                </label>
                <Controller
                    name="is_completed"
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        >
                            <option value="incomplete">Incomplete</option>
                            <option value="complete">Complete</option>
                        </select>
                    )}
                />
                {/* {isTaskCompleted && (
                    <p className="text-sm text-blue-600">
                        Note: Changing status to "Incomplete" will re-enable editing.
                    </p>
                )} */}
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
                    {isSubmitting ? "Updating..." : "Update Task"}
                </button>
            </div>
        </form>
    );
};

export default EditTask;