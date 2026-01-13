import React, { useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { X } from "lucide-react";

const EditTaskAssigned = ({
    editingTaskList,
    setEditingTaskList,
    setReloadTrigger,
    showForm,
    setShowForm,
    users,
}) => {
    const { props } = usePage();
    const user = props.auth.user;

    // Quill editor configuration
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
    ];

    const {
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        watch,
        formState: { errors, isSubmitting, isValid, isDirty },
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            assigned_to: "", // Changed from user_id to assigned_to
        },
        mode: "onChange",
    });

    // Watch description for validation feedback
    const descriptionValue = watch("description");

    // Find current assignee's details from users array
    const currentAssignee =
        editingTaskList && Array.isArray(users)
            ? users.find(
                  (user) =>
                      Number(user.id) === Number(editingTaskList.assigned_to)
              )
            : null;

    // Check if user is admin
    useEffect(() => {
        if (user.role !== "admin") {
            setShowForm(false);
        }
    }, [user.role, setShowForm]);

    // Set form values when editing
    useEffect(() => {
        if (editingTaskList && user.role === "admin" && showForm) {
            reset({
                title: editingTaskList.title || "",
                description: editingTaskList.description || "",
                assigned_to: editingTaskList.assigned_to || "", // Changed from user_id to assigned_to
            });
            clearErrors();
        } else if (!showForm) {
            // Reset form when closing
            reset({
                title: "",
                description: "",
                assigned_to: "", // Changed from user_id to assigned_to
            });
            setEditingTaskList(null);
            clearErrors();
        }
    }, [
        editingTaskList,
        user.role,
        showForm,
        setShowForm,
        reset,
        setEditingTaskList,
        clearErrors,
    ]);

    // Handle Update Task
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourtasklist.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                setReloadTrigger((prev) => !prev);
                return response.data;
            } else {
                throw new Error(
                    response.data.message || "Failed to update task"
                );
            }
        } catch (error) {
            handleApiErrors(error);
            throw error;
        }
    };

    // Handle API errors
    const handleApiErrors = (error) => {
        if (error.response?.data?.errors) {
            Object.entries(error.response.data.errors).forEach(
                ([field, messages]) => {
                    setError(field, {
                        type: "manual",
                        message: Array.isArray(messages)
                            ? messages[0]
                            : messages,
                    });
                }
            );
        } else {
            setError("root.server", {
                type: "manual",
                message:
                    error.response?.data?.message || "Error processing request",
            });
        }
    };

    // Handle Form Submission
    const onSubmit = async (data) => {
        // Check if user is admin
        if (user.role !== "admin") {
            alert("Only admins can edit tasks");
            return;
        }

        if (!editingTaskList) {
            alert("No task selected for editing");
            return;
        }

        const formData = new FormData();

        // Append all form data
        for (const key in data) {
            if (data[key] !== null && data[key] !== "") {
                formData.append(key, data[key]);
            }
        }

        try {
            clearErrors(); // Clear previous errors

            // Update existing task
            await handleUpdate(formData, editingTaskList.id);

            // Reset form and close
            reset({
                title: "",
                description: "",
                assigned_to: "", // Changed from user_id to assigned_to
            });

            setShowForm(false);
            setEditingTaskList(null);
        } catch (error) {
            console.log("Error saving data", error);
        }
    };

    // Handle Close
    const handleClose = () => {
        reset({
            title: "",
            description: "",
            assigned_to: "", // Changed from user_id to assigned_to
        });
        clearErrors();
        setShowForm(false);
        setEditingTaskList(null);
    };

    if (!showForm || user.role !== "admin" || !editingTaskList) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Edit Task Assignment
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl transition duration-200"
                        disabled={isSubmitting}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* General Error Message */}
                {errors.root?.server && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">
                            {errors.root.server.message}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="title"
                        >
                            Task Title *
                        </label>
                        <Controller
                            name="title"
                            control={control}
                            rules={{
                                required: "Task title is required",
                                maxLength: {
                                    value: 100,
                                    message:
                                        "Title must be less than 100 characters",
                                },
                            }}
                            render={({ field }) => (
                                <input
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.title ? "border-red-500" : ""
                                    }`}
                                    id="title"
                                    type="text"
                                    {...field}
                                    placeholder="Enter task title"
                                    disabled={isSubmitting}
                                    aria-invalid={
                                        errors.title ? "true" : "false"
                                    }
                                />
                            )}
                        />
                        {errors.title && (
                            <p
                                className="text-red-500 text-xs mt-1"
                                role="alert"
                            >
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">

                        {/* Description */}
                        
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="description"
                        >
                            Description
                        </label>
                        <Controller
                            name="description"
                            control={control}
                            rules={{
                                maxLength: {
                                    value: 2000,
                                    message:
                                        "Description must be less than 2000 characters",
                                },
                                validate: {
                                    noMaliciousTags: (value) => {
                                        if (!value) return true;
                                        // Basic check for script tags
                                        const hasScriptTags =
                                            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(
                                                value
                                            );
                                        return (
                                            !hasScriptTags ||
                                            "Description contains invalid content"
                                        );
                                    },
                                },
                            }}
                            render={({ field }) => (
                                <>
                                    <div
                                        className={`border rounded overflow-hidden ${
                                            errors.description
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <ReactQuill
                                            theme="snow"
                                            modules={quillModules}
                                            formats={quillFormats}
                                            value={field.value}
                                            placeholder="Enter task description..."
                                            readOnly={isSubmitting}
                                            className="h-64"
                                            onChange={(content) => {
                                                field.onChange(content);
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        />
                        {errors.description && (
                            <p
                                className="text-red-500 text-xs mt-2"
                                role="alert"
                            >
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Assigned to User */}
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="assigned_to"
                        >
                            Assign to User *
                        </label>

                        <Controller
                            name="assigned_to"
                            control={control}
                            rules={{ required: "Please select a user" }}
                            render={({ field }) => (
                                <select
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.assigned_to
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    id="assigned_to"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    aria-invalid={
                                        errors.assigned_to ? "true" : "false"
                                    }
                                >
                                    <option value="">Select a user</option>
                                    {Array.isArray(users) &&
                                    users.length > 0 ? (
                                        users.map((user) => (
                                            <option
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name} ({user.email})
                                                {/* Show indicator if this is the current assignee */}
                                                {editingTaskList &&
                                                    Number(user.id) ===
                                                        Number(
                                                            editingTaskList.assigned_to
                                                        )}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            No users available
                                        </option>
                                    )}
                                </select>
                            )}
                        />
                        {errors.assigned_to && (
                            <p
                                className="text-red-500 text-xs mt-1"
                                role="alert"
                            >
                                {errors.assigned_to.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 rounded-lg font-semibold
                   bg-gray-100 text-gray-800
                   hover:bg-gray-200
                   transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting || !isValid || !isDirty}
                            className="flex-1 py-3 px-4 rounded-lg font-semibold
                   bg-blue-500 text-white
                   hover:bg-blue-600
                   transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Updating..." : "Update Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskAssigned;
