import React, { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
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
            descriptions: [{ description: "" }],
            due_date: "",
            is_completed: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "descriptions",
    });

    const [error, setError] = useState("");

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
        };
    }, []);

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

    // FIXED: Properly populate form when editingTodo changes
    useEffect(() => {
        if (editingTodo) {
            // Prepare descriptions array - include ALL descriptions as editable
            const descriptionFields = [];

            // Add existing descriptions from the todo
            if (editingTodo.descriptions && editingTodo.descriptions.length > 0) {
                editingTodo.descriptions.forEach((desc) => {
                    descriptionFields.push({
                        description: desc.description || "",
                    });
                });
            } else {
                // If no descriptions, add one empty field
                descriptionFields.push({
                    description: "",
                });
            }

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

    const onSubmit = async (data) => {
        try {
            setError("");

            // Format descriptions - filter out empty ones
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

    const handleCancel = () => {
        reset();
        setError("");
        onClose();
    };

    const handleAddDescription = () => {
        append({ description: "" });
    };

    const handleRemoveDescription = (index) => {
        remove(index);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 text-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <h2 className="text-2xl font-bold">
                                Edit Todo
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            disabled={isSubmitting}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
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
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.title ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter todo title"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        {...register("due_date")}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isSubmitting}
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Descriptions
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddDescription}
                                    className="inline-flex items-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                    disabled={isSubmitting}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Description
                                </button>
                            </div>

                            {/* Show all descriptions as editable Quill editors */}
                            {fields.map((field, index) => (
                                <div key={field.id} className="relative quill-wrapper">
                                    <div className="flex items-start gap-2">
                                        <Controller
                                            name={`descriptions.${index}.description`}
                                            control={control}
                                            defaultValue=""
                                            render={({
                                                field: quillField,
                                            }) => (
                                                <ReactQuill
                                                    {...quillField}
                                                    theme="snow"
                                                    modules={modules}
                                                    formats={formats}
                                                    placeholder="Enter description..."
                                                    readOnly={isSubmitting}
                                                    className="flex-1 w-full"
                                                />
                                            )}
                                        />
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveDescription(index)
                                                }
                                                className="mt-2 text-red-500 hover:text-red-700 p-1 rounded transition-colors flex-shrink-0"
                                                disabled={isSubmitting}
                                                title="Remove description"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="md:w-1/2 mb-4">
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        </div>

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
                                className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                disabled={isSubmitting}
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
                                    <span>Update Todo</span>
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
