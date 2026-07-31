// import React, { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const AddTodo = ({ onClose, handleAdd }) => {
//     const {
//         register,
//         handleSubmit,
//         control,
//         reset,
//         formState: { errors, isSubmitting },
//     } = useForm({
//         defaultValues: {
//             title: "",
//             descriptions: [{ description: "" }],
//             due_date: "",
//         },
//     });

//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: "descriptions",
//     });

//     const [error, setError] = useState("");

//     // Lock body scroll when modal mounts
//     useEffect(() => {
//         document.body.style.overflow = "hidden";
//         document.body.style.position = "fixed";
//         document.body.style.width = "100%";

//         return () => {
//             document.body.style.overflow = "unset";
//             document.body.style.position = "static";
//             document.body.style.width = "auto";
//         };
//     }, []);

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
//             matchVisual: false,
//         },
//     };

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

//     // Reset form when modal opens
//     useEffect(() => {
//         reset({
//             title: "",
//             descriptions: [{ description: "" }],
//             due_date: "",
//         });
//         setError("");
//     }, [reset]);

//     // Handle Form Submit
//     const onSubmit = async (data) => {
//         try {
//             setError("");

//             const formattedDescriptions = data.descriptions
//                 .filter((desc) => {
//                     const strippedContent = desc.description
//                         ?.replace(/<[^>]*>/g, "")
//                         .trim();
//                     return strippedContent !== "";
//                 })
//                 .map((desc) => desc.description);

//             const transformedData = {
//                 title: data.title.trim(),
//                 descriptions: formattedDescriptions,
//                 due_date: data.due_date || null,
//             };

//             // Toast is fired in the parent handleAdd; errors are re-thrown here
//             await handleAdd(transformedData);
//             reset();
//             onClose();
//         } catch (error) {
//             console.log("Error saving data", error);
//             setError(
//                 error.response?.data?.message ||
//                     "An error occurred. Please try again.",
//             );
//         }
//     };

//     const handleCancel = () => {
//         reset();
//         setError("");
//         onClose();
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//                 <div className="p-6 text-gray-800">
//                     <div className="flex justify-between items-center mb-6">
//                         <div className="flex items-center space-x-3">
//                             <h2 className="text-2xl font-bold">Add New Todo</h2>
//                         </div>
//                         <button
//                             onClick={handleCancel}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                             type="button"
//                             disabled={isSubmitting}
//                         >
//                             <X className="w-6 h-6" />
//                         </button>
//                     </div>

//                     <form
//                         onSubmit={handleSubmit(onSubmit)}
//                         className="space-y-6"
//                     >
//                         {error && (
//                             <div className="p-3 bg-red-100 text-red-700 rounded">
//                                 {error}
//                             </div>
//                         )}

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Title{" "}
//                                     <span className="text-red-500">*</span>
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type="text"
//                                         {...register("title", {
//                                             required: "Title is required",
//                                             minLength: {
//                                                 value: 3,
//                                                 message:
//                                                     "Title must be at least 3 characters",
//                                             },
//                                         })}
//                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                             errors.title
//                                                 ? "border-red-500"
//                                                 : "border-gray-300"
//                                         }`}
//                                         placeholder="Enter todo title"
//                                         disabled={isSubmitting}
//                                     />
//                                 </div>
//                                 {errors.title && (
//                                     <p className="mt-1 text-sm text-red-600">
//                                         {errors.title.message}
//                                     </p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Due Date
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type="date"
//                                         {...register("due_date")}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         disabled={isSubmitting}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Description
//                             </label>

//                             {fields.map((field, index) => (
//                                 <div key={field.id} className="quill-wrapper">
//                                     <Controller
//                                         name={`descriptions.${index}.description`}
//                                         control={control}
//                                         render={({ field: quillField }) => (
//                                             <ReactQuill
//                                                 {...quillField}
//                                                 theme="snow"
//                                                 modules={modules}
//                                                 formats={formats}
//                                                 placeholder="Enter description..."
//                                                 readOnly={isSubmitting}
//                                                 className="w-full"
//                                             />
//                                         )}
//                                     />
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                             <button
//                                 type="button"
//                                 onClick={handleCancel}
//                                 className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                 disabled={isSubmitting}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                                 disabled={isSubmitting}
//                             >
//                                 {isSubmitting ? (
//                                     <span className="flex items-center">
//                                         <svg
//                                             className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                         >
//                                             <circle
//                                                 className="opacity-25"
//                                                 cx="12"
//                                                 cy="12"
//                                                 r="10"
//                                                 stroke="currentColor"
//                                                 strokeWidth="4"
//                                             />
//                                             <path
//                                                 className="opacity-75"
//                                                 fill="currentColor"
//                                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                                             />
//                                         </svg>
//                                         Creating...
//                                     </span>
//                                 ) : (
//                                     <span>Create Todo</span>
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddTodo;


import React, { useEffect, useState } from "react";
import { X, Calendar, Type, StickyNote, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const todayISO = () => new Date().toISOString().split("T")[0];

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

    const [error, setError] = useState("");

    // Lock body scroll when modal mounts
    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";

        return () => {
            document.body.style.overflow = "unset";
            document.body.style.position = "static";
            document.body.style.width = "auto";
        };
    }, []);

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

            // Toast is fired in the parent handleAdd; errors are re-thrown here
            await handleAdd(transformedData);
            reset();
            onClose();
        } catch (error) {
            console.log("Error saving data", error);
            setError(
                error.response?.data?.message ||
                    "An error occurred. Please try again.",
            );
        }
    };

    const handleCancel = () => {
        reset();
        setError("");
        onClose();
    };

    const handleAddNote = () => {
        append({ description: "" });
    };

    const handleRemoveNote = (index) => {
        remove(index);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={handleCancel}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shrink-0">
                            <StickyNote size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Add New Todo
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Create a task with an optional due date and
                                notes
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body + footer */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col overflow-hidden"
                >
                    <div className="overflow-y-auto px-6 py-6 space-y-6">
                        {error && (
                            <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Type
                                        size={16}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
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
                                        className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-colors ${
                                            errors.title
                                                ? "border-red-400"
                                                : "border-gray-200"
                                        }`}
                                        placeholder="e.g. Follow up with the vendor"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                                    Due Date
                                </label>
                                <div className="relative">
                                    <Calendar
                                        size={16}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                    <input
                                        type="date"
                                        min={todayISO()}
                                        {...register("due_date")}
                                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-colors"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Notes
                                </label>
                                {/* <button
                                    type="button"
                                    onClick={handleAddNote}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                                >
                                    <Plus size={13} />
                                    Add another note
                                </button> */}
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="rounded-xl border border-gray-200 bg-gray-50/60 p-2"
                                    >
                                        <div className="flex items-start gap-2">
                                            <div
                                                className="flex-1 quill-wrapper rounded-lg border border-gray-200 bg-white overflow-hidden
                                                    [&_.ql-toolbar]:sticky [&_.ql-toolbar]:top-0 [&_.ql-toolbar]:z-10 [&_.ql-toolbar]:bg-white
                                                    [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200
                                                    [&_.ql-container]:border-none
                                                    [&_.ql-editor]:min-h-[130px]"
                                            >
                                                <Controller
                                                    name={`descriptions.${index}.description`}
                                                    control={control}
                                                    render={({
                                                        field: quillField,
                                                    }) => (
                                                        <ReactQuill
                                                            {...quillField}
                                                            theme="snow"
                                                            modules={modules}
                                                            formats={formats}
                                                            placeholder="Enter description..."
                                                            readOnly={
                                                                isSubmitting
                                                            }
                                                            className="w-full"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            {fields.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveNote(index)
                                                    }
                                                    disabled={isSubmitting}
                                                    title="Remove note"
                                                    className="mt-2 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 shrink-0"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0 bg-white">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4 text-white"
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
                                    Creating...
                                </>
                            ) : (
                                <>
                                    Create Todo
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTodo;
