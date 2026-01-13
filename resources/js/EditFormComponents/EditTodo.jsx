import React, { useEffect } from "react";
import { X, Lock } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditTodo = ({
    editingTodo,
    onClose,
    handleUpdate,
    reloadTrigger,
    setReloadTrigger,
}) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
        watch,
    } = useForm({
        defaultValues: {
            title: "",
            descriptions: [{ description: "", isOriginal: false }],
            due_date: "",
            is_completed: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "descriptions",
    });

    const [error, setError] = React.useState("");

    // Custom CSS for smaller Quill editor
    const quillStyles = {
        height: "150px",
        marginBottom: "10px",
    };

    // Quill modules configuration
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
        clipboard: {
            matchVisual: false,
        },
    };

    // Quill formats
    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "image",
    ];

    // Use Effect to reset form when editingTodo changes
    useEffect(() => {
        if (editingTodo) {
            // Prepare descriptions array
            const descriptionFields = [];

            // Add original descriptions first
            if (editingTodo.descriptions?.length > 0) {
                editingTodo.descriptions.forEach((desc) => {
                    descriptionFields.push({
                        description: desc.description || "",
                        isOriginal: true,
                        id: desc.id || Date.now() + Math.random(),
                    });
                });
            }

            // Always add one empty field for new description
            descriptionFields.push({
                description: "",
                isOriginal: false,
                id: `new-${Date.now()}`,
            });

            reset({
                title: editingTodo.title || "",
                descriptions: descriptionFields,
                due_date: editingTodo.due_date
                    ? editingTodo.due_date.split("T")[0]
                    : "",
                is_completed: editingTodo.is_completed || false,
            });
        }
        setError("");
    }, [editingTodo, reset]);

    // Handle Form Submit
    const onSubmit = async (data) => {
        try {
            setError("");

            // Format descriptions as strings for backend
            const formattedDescriptions = data.descriptions
                .filter((desc) => {
                    const strippedContent = desc.description
                        ?.replace(/<[^>]*>/g, "")
                        .trim();
                    return strippedContent !== "";
                })
                .map((desc) => desc.description);

            const updateData = {
                title: data.title.trim(),
                descriptions: formattedDescriptions,
                due_date: data.due_date || null,
                is_completed: data.is_completed,
            };

            await handleUpdate(updateData, editingTodo.id);

            // Reset form and close modal
            reset();
            onClose();
        } catch (error) {
            console.error("Error updating todo:", error);
            setError(
                error.response?.data?.message ||
                    error.message ||
                    "An error occurred. Please try again."
            );
        }
    };

    // Handle cancel
    const handleCancel = () => {
        reset();
        setError("");
        onClose();
    };

    // Function to add a new description field
    const handleAddDescription = () => {
        append({ description: "", isOriginal: false });
    };

    // Function to remove a description field
    const handleRemoveDescription = (index) => {
        remove(index);
    };

    // Get watched descriptions to check content
    const watchedDescriptions = watch("descriptions");

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Edit Todo
                        </h2>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
                                <p className="font-medium">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                {...register("title", {
                                    required: "Title is required",
                                    minLength: {
                                        value: 3,
                                        message:
                                            "Title must be at least 3 characters",
                                    },
                                    maxLength: {
                                        value: 200,
                                        message:
                                            "Title must be less than 200 characters",
                                    },
                                })}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    errors.title
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                                placeholder="Enter todo title"
                                disabled={isSubmitting}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-2 font-medium">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Descriptions Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold">
                                    Description
                                </label>
                            </div>

                            {/* Show editable fields for new descriptions */}
                            <div>
                                {fields.map((field, index) => {
                                    // Skip original descriptions (they're displayed above as read-only)
                                    if (field.isOriginal) return null;

                                    const isLastField =
                                        index === fields.length - 1;
                                    const hasContent = watchedDescriptions?.[
                                        index
                                    ]?.description
                                        ?.replace(/<[^>]*>/g, "")
                                        .trim();

                                    return (
                                        <div key={field.id} className="mb-4">
                                            <div className="flex items-start gap-2">
                                                <Controller
                                                    name={`descriptions.${index}.description`}
                                                    control={control}
                                                    defaultValue=""
                                                    render={({
                                                        field: quillField,
                                                    }) => (
                                                        <div className="flex-1">
                                                            <ReactQuill
                                                                {...quillField}
                                                                theme="snow"
                                                                modules={
                                                                    modules
                                                                }
                                                                formats={
                                                                    formats
                                                                }
                                                                style={
                                                                    quillStyles
                                                                }
                                                                placeholder={
                                                                    isLastField
                                                                        ? "Start typing your new description..."
                                                                        : "Additional description..."
                                                                }
                                                                readOnly={
                                                                    isSubmitting
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                />
                                                {!isLastField && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveDescription(
                                                                index
                                                            )
                                                        }
                                                        className="mt-2 text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                                        disabled={isSubmitting}
                                                        title="Remove description"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mt-20 lg:mt-14 mb-2">
                                Due Date
                            </label>
                            <input
                                type="date"
                                {...register("due_date")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors"
                                disabled={isSubmitting}
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Status
                            </label>
                            <Controller
                                name="is_completed"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        value={
                                            field.value
                                                ? "completed"
                                                : "incomplete"
                                        }
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value === "completed"
                                            )
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        <option value="incomplete">
                                            Incomplete
                                        </option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                    </select>
                                )}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-6">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
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
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    "Update Todo"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTodo;
