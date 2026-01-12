// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { X, Lock } from "lucide-react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const AddTodo = ({
//     editingTodo,
//     setEditingTodo,
//     reloadTrigger,
//     setReloadTrigger,
//     handleUpdate,
//     handleAdd,
//     onClose,
// }) => {
//     const {
//         register,
//         handleSubmit,
//         control,
//         reset,
//         setValue,
//         watch,
//         formState: { errors, isSubmitting },
//     } = useForm({
//         defaultValues: {
//             title: "",
//             descriptions: [{ description: "" }],
//             due_date: "",
//             is_completed: false,
//         },
//     });

//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: "descriptions",
//     });

//     const [error, setError] = React.useState("");

//     // Custom CSS for smaller Quill editor
//     const quillStyles = {
//         height: "150px",
//         marginBottom: "10px",
//     };

//     // Quill modules configuration
//     const modules = {
//         toolbar: [
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             ["link", "image"],
//             ["clean"],
//         ],
//         clipboard: {
//             // Disable text match when pasting
//             matchVisual: false,
//         },
//     };

//     // Quill formats
//     const formats = [
//         "header",
//         "bold",
//         "italic",
//         "underline",
//         "strike",
//         "list",
//         "bullet",
//         "link",
//         "image",
//     ];

//     // Use Effect to reset form when editingTodo changes
//     useEffect(() => {
//         if (editingTodo) {
//             reset({
//                 title: editingTodo.title || "",
//                 descriptions:
//                     editingTodo.descriptions?.length > 0
//                         ? editingTodo.descriptions.map((desc) => ({
//                               description: desc.description || "",
//                           }))
//                         : [{ description: "" }],
//                 due_date: editingTodo.due_date || "",
//                 is_completed: editingTodo.is_completed || false,
//             });
//         } else {
//             reset({
//                 title: "",
//                 descriptions: [{ description: "" }],
//                 due_date: "",
//                 is_completed: false,
//             });
//         }
//         setError("");
//     }, [editingTodo, reset]);

//     // Handle Create Todo
//     const handleCreate = async (formData) => {
//         if (handleAdd) {
//             return handleAdd(formData);
//         }

//         try {
//             // Transform descriptions array to match backend expectations
//             const transformedData = {
//                 ...formData,
//                 descriptions: formData.descriptions
//                     .filter((desc) => {
//                         // Remove HTML tags and check if there's actual content
//                         const strippedContent = desc.description
//                             ?.replace(/<[^>]*>/g, "")
//                             .trim();
//                         return strippedContent !== "";
//                     })
//                     .map((desc) => ({ description: desc.description })),
//             };

//             const response = await axios.post(
//                 route("ourtodo.store"),
//                 transformedData,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error creating todo", error);
//             throw error;
//         }
//     };

//     // Handle Update Todo
//     const handleUpdateTodo = async (formData, id) => {
//         if (handleUpdate) {
//             return handleUpdate(formData, id);
//         }

//         try {
//             // Transform descriptions array to match backend expectations
//             const transformedData = {
//                 ...formData,
//                 descriptions: formData.descriptions
//                     .filter((desc) => {
//                         // Remove HTML tags and check if there's actual content
//                         const strippedContent = desc.description
//                             ?.replace(/<[^>]*>/g, "")
//                             .trim();
//                         return strippedContent !== "";
//                     })
//                     .map((desc) => ({ description: desc.description })),
//             };

//             const response = await axios.put(
//                 route("ourtodo.update", id),
//                 transformedData,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating todo", error);
//             throw error;
//         }
//     };

//     // Handle Form Submit
//     const onSubmit = async (data) => {
//         try {
//             setError("");

//             if (editingTodo) {
//                 // When editing, only include new descriptions (empty ones)
//                 const newDescriptions = data.descriptions.filter((desc) => {
//                     // Check if this is a new description by checking if it's not in the original todo
//                     const strippedContent = desc.description
//                         ?.replace(/<[^>]*>/g, "")
//                         .trim();
//                     // Only include if it has content and is not from the original todo (after the existing ones)
//                     return (
//                         strippedContent !== "" &&
//                         !editingTodo.descriptions.some(
//                             (existingDesc) =>
//                                 existingDesc.description === desc.description
//                         )
//                     );
//                 });

//                 const updateData = {
//                     ...data,
//                     descriptions: [
//                         ...editingTodo.descriptions, // Keep original descriptions
//                         ...newDescriptions.map((desc) => ({
//                             description: desc.description,
//                         })),
//                     ],
//                 };

//                 await handleUpdateTodo(updateData, editingTodo.id);
//             } else {
//                 // Creating new todo
//                 await handleCreate(data);
//             }

//             // Reset form and call onClose if provided
//             reset();
//             if (onClose) {
//                 onClose();
//             }
//         } catch (error) {
//             console.log("Error saving data", error);
//             setError(
//                 error.response?.data?.message ||
//                     "An error occurred. Please try again."
//             );
//         }
//     };

//     // Add new description field (only for editing)
//     const addDescriptionField = () => {
//         append({ description: "" });
//     };

//     // Remove description field (only for new descriptions when editing)
//     const removeDescriptionField = (index) => {
//         // When editing, only allow removal of new description fields (those after the original ones)
//         if (editingTodo) {
//             const originalDescriptionsCount =
//                 editingTodo.descriptions?.length || 0;
//             if (index >= originalDescriptionsCount) {
//                 remove(index);
//             }
//         } else {
//             // When creating, allow removal of any except the last one
//             if (fields.length > 1) {
//                 remove(index);
//             }
//         }
//     };

//     // Handle cancel
//     const handleCancel = () => {
//         reset();
//         setEditingTodo(null);
//         setError("");
//         if (onClose) {
//             onClose();
//         }
//     };

//     // Check if a description field is from original todo (read-only)
//     const isOriginalDescription = (index) => {
//         if (!editingTodo) return false;
//         const originalDescriptionsCount = editingTodo.descriptions?.length || 0;
//         return index < originalDescriptionsCount;
//     };

//     return (
//         <div>
//             {/* Form */}
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 {error && (
//                     <div className="p-3 bg-red-100 text-red-700 rounded">
//                         {error}
//                     </div>
//                 )}

//                 {/* Title */}
//                 <div>
//                     <label className="block text-gray-700 text-sm font-bold mb-2">
//                         Title *
//                     </label>
//                     <input
//                         type="text"
//                         {...register("title", {
//                             required: "Title is required",
//                             minLength: {
//                                 value: 3,
//                                 message: "Title must be at least 3 characters",
//                             },
//                         })}
//                         className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                             errors.title ? "border-red-500" : "border-gray-300"
//                         }`}
//                         placeholder="Enter todo title"
//                     />
//                     {errors.title && (
//                         <p className="text-red-500 text-sm mt-1">
//                             {errors.title.message}
//                         </p>
//                     )}
//                 </div>

//                 {/* Descriptions */}
//                 <div>
//                     <label className="block text-gray-700 text-sm font-bold mb-2">
//                         Description
//                     </label>

//                     {/* Show existing descriptions as read-only when editing */}
//                     {editingTodo && editingTodo.descriptions?.length > 0 && (
//                         <div className="mb-4">
//                             <p className="text-sm text-gray-600 mb-2">
//                                 Existing Descriptions (read-only):
//                             </p>
//                             {editingTodo.descriptions.map((desc, index) => (
//                                 <div key={`existing-${index}`} className="mb-3">
//                                     <div className="flex gap-2 mb-1">
//                                         <div className="flex-1 relative">
//                                             <ReactQuill
//                                                 value={desc.description}
//                                                 theme="snow"
//                                                 modules={{ toolbar: false }} // Disable toolbar for read-only
//                                                 readOnly={true}
//                                                 style={quillStyles}
//                                             />
//                                             <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-1 rounded">
//                                                 <Lock size={12} />
//                                                 Read-only
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {/* Show editable description fields */}
//                     {fields.map((field, index) => {
//                         // Check if this is an original description when editing
//                         const isOriginal = isOriginalDescription(index);

//                         // When editing, only show editable fields for new descriptions
//                         if (editingTodo && isOriginal) {
//                             return null;
//                         }

//                         return (
//                             <div key={field.id} className="mb-4">
//                                 <div className="flex gap-2 mb-2">
//                                     <Controller
//                                         name={`descriptions.${index}.description`}
//                                         control={control}
//                                         render={({ field: quillField }) => (
//                                             <div className="flex-1">
//                                                 <ReactQuill
//                                                     {...quillField}
//                                                     theme="snow"
//                                                     modules={modules}
//                                                     formats={formats}
//                                                     style={quillStyles}
//                                                     placeholder={
//                                                         editingTodo
//                                                             ? "Add new description..."
//                                                             : "Enter description..."
//                                                     }
//                                                 />
//                                             </div>
//                                         )}
//                                     />
//                                 </div>
//                             </div>
//                         );
//                     })}

//                     {/* Show "Add More" button - always shown */}
//                     <button
//                         type="button"
//                         onClick={addDescriptionField}
//                         className="text-sm text-blue-500 hover:text-blue-700 mt-1"
//                     >
//                         + Add More Description
//                     </button>
//                 </div>

//                 {/* Due Date */}
//                 <div>
//                     <label className="block text-gray-700 text-sm font-bold mb-2">
//                         Due Date
//                     </label>
//                     <input
//                         type="date"
//                         {...register("due_date")}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 {/* Status Dropdown (only for editing) */}
//                 {editingTodo && (
//                     <div>
//                         <label className="block text-gray-700 text-sm font-bold mb-2">
//                             Status
//                         </label>
//                         <Controller
//                             name="is_completed"
//                             control={control}
//                             render={({ field }) => (
//                                 <select
//                                     {...field}
//                                     value={
//                                         field.value ? "completed" : "incomplete"
//                                     }
//                                     onChange={(e) =>
//                                         field.onChange(
//                                             e.target.value === "completed"
//                                         )
//                                     }
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 >
//                                     <option value="incomplete">
//                                         Incomplete
//                                     </option>
//                                     <option value="completed">Completed</option>
//                                 </select>
//                             )}
//                         />
//                     </div>
//                 )}

//                 {/* Submit Button */}
//                 <div className="flex gap-3 pt-4">
//                     <button
//                         type="submit"
//                         disabled={isSubmitting}
//                         className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {isSubmitting
//                             ? "Saving..."
//                             : editingTodo
//                             ? "Update Todo"
//                             : "Create Todo"}
//                     </button>
//                     <button
//                         type="button"
//                         onClick={handleCancel}
//                         className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddTodo;

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddTodo = ({ onClose, handleAdd }) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            title: "",
            descriptions: [{ description: "" }],
            due_date: "",
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

    // Reset form when modal opens
    useEffect(() => {
        reset({
            title: "",
            descriptions: [{ description: "" }],
            due_date: "",
        });
        setError("");
    }, [reset]);

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

            const transformedData = {
                title: data.title.trim(),
                descriptions: formattedDescriptions,
                due_date: data.due_date || null,
            };

            await handleAdd(transformedData);

            // Reset form and close modal
            reset();
            onClose();
        } catch (error) {
            console.log("Error saving data", error);
            setError(
                error.response?.data?.message ||
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Add New Todo
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded">
                                {error}
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
                                })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.title
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter todo title"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Descriptions */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Description
                            </label>

                            {/* Editable description fields */}
                            {fields.map((field, index) => (
                                <div key={field.id} className="mb-4">
                                    <div className="flex gap-2 mb-2">
                                        <Controller
                                            name={`descriptions.${index}.description`}
                                            control={control}
                                            render={({ field: quillField }) => (
                                                <div className="flex-1">
                                                    <ReactQuill
                                                        {...quillField}
                                                        theme="snow"
                                                        modules={modules}
                                                        formats={formats}
                                                        style={quillStyles}
                                                        placeholder="Enter description..."
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2 mt-16 lg:mt-10">
                                Due Date
                            </label>
                            <input
                                type="date"
                                {...register("due_date")}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Saving..." : "Create Todo"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTodo;
