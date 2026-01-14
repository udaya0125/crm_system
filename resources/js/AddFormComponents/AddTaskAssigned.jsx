// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { usePage } from '@inertiajs/react';
// import { useForm, Controller } from 'react-hook-form';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Import Quill styles

// const AddTaskAssigned = ({
//   editingTaskList,
//   setEditingTaskList,
//   setReloadTrigger,
//   showForm,
//   setShowForm,
//   users
// }) => {
//   const { props } = usePage();
//   const user = props.auth.user;

//   // Quill editor configuration
//   const quillModules = {
//     toolbar: [
//       [{ 'header': [1, 2, 3, false] }],
//       ['bold', 'italic', 'underline', 'strike'],
//       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//       ['link'],
//       ['clean']
//     ],
//   };

//   const quillFormats = [
//     'header',
//     'bold', 'italic', 'underline', 'strike',
//     'list', 'bullet',
//     'link'
//   ];

//   const {
//     control,
//     handleSubmit,
//     reset,
//     setError,
//     clearErrors,
//     watch,
//     formState: { errors, isSubmitting, isValid, isDirty }
//   } = useForm({
//     defaultValues: {
//       title: '',
//       description: '',
//       user_id: ''
//     },
//     mode: 'onChange'
//   });

//   // Watch description for validation feedback
//   const descriptionValue = watch('description');

//   // Check if user is admin
//   useEffect(() => {
//     if (user.role !== 'admin') {
//       setShowForm(false);
//     }
//   }, [user.role, setShowForm]);

//   // Set form values when editing
//   useEffect(() => {
//     if (editingTaskList && user.role === 'admin') {
//       reset({
//         title: editingTaskList.title || '',
//         description: editingTaskList.description || '',
//         user_id: editingTaskList.user_id || editingTaskList.assigned_to || ''
//       });
//       setShowForm(true);
//     } else {
//       reset({
//         title: "",
//         description: "",
//         user_id: ""
//       });
//     }
//   }, [editingTaskList, user.role, setShowForm, reset]);

//   // Handle Create Task
//   const handleCreate = async (formData) => {
//     try {
//       const response = await axios.post(route("ourtasklist.store"), formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.data.success) {
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//       } else {
//         throw new Error(response.data.message || 'Failed to create task');
//       }
//     } catch (error) {
//       handleApiErrors(error);
//       throw error;
//     }
//   };

//   // Handle Update Task
//   const handleUpdate = async (formData, id) => {
//     try {
//       formData.append("_method", "PUT");
//       const response = await axios.post(
//         route("ourtasklist.update", { id }),
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.success) {
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//       } else {
//         throw new Error(response.data.message || 'Failed to update task');
//       }
//     } catch (error) {
//       handleApiErrors(error);
//       throw error;
//     }
//   };

//   // Handle API errors
//   const handleApiErrors = (error) => {
//     if (error.response?.data?.errors) {
//       Object.entries(error.response.data.errors).forEach(([field, messages]) => {
//         setError(field, {
//           type: 'manual',
//           message: Array.isArray(messages) ? messages[0] : messages
//         });
//       });
//     } else {
//       setError('root.server', {
//         type: 'manual',
//         message: error.response?.data?.message || 'Error processing request'
//       });
//     }
//   };

//   // Handle Form Submission
//   const onSubmit = async (data) => {
//     // Check if user is admin
//     if (user.role !== 'admin') {
//       alert('Only admins can assign tasks');
//       return;
//     }

//     const formData = new FormData();

//     // Append all form data
//     for (const key in data) {
//       if (data[key] !== null && data[key] !== "") {
//         formData.append(key, data[key]);
//       }
//     }

//     try {
//       clearErrors(); // Clear previous errors

//       if (editingTaskList) {
//         // Editing existing task
//         await handleUpdate(formData, editingTaskList.id);
//       } else {
//         // Creating new task
//         await handleCreate(formData);
//       }

//       // Reset form and close
//       reset({
//         title: "",
//         description: "",
//         user_id: ""
//       });

//       setShowForm(false);
//       setEditingTaskList(null);
//     } catch (error) {
//       console.log("Error saving data", error);
//     }
//   };

//   // Handle Close
//   const handleClose = () => {
//     reset({
//       title: "",
//       description: "",
//       user_id: ""
//     });
//     clearErrors();
//     setShowForm(false);
//     setEditingTaskList(null);
//   };

//   if (!showForm || user.role !== 'admin') return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//       <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">
//             {editingTaskList ? 'Edit Task Assignment' : 'Assign New Task'}
//           </h2>
//           <button
//             onClick={handleClose}
//             className="text-gray-400 hover:text-gray-600 text-2xl transition duration-200"
//             disabled={isSubmitting}
//           >
//             &times;
//           </button>
//         </div>

//         {/* General Error Message */}
//         {errors.root?.server && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//             <p className="text-red-600 text-sm">{errors.root.server.message}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
//               Task Title *
//             </label>
//             <Controller
//               name="title"
//               control={control}
//               rules={{
//                 required: 'Task title is required',
//                 maxLength: {
//                   value: 100,
//                   message: 'Title must be less than 100 characters'
//                 }
//               }}
//               render={({ field }) => (
//                 <input
//                   className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                     errors.title ? 'border-red-500' : ''
//                   }`}
//                   id="title"
//                   type="text"
//                   {...field}
//                   placeholder="Enter task title"
//                   disabled={isSubmitting}
//                   aria-invalid={errors.title ? "true" : "false"}
//                 />
//               )}
//             />
//             {errors.title && (
//               <p className="text-red-500 text-xs mt-1" role="alert">
//                 {errors.title.message}
//               </p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
//               Description
//             </label>
//             <Controller
//               name="description"
//               control={control}
//               rules={{
//                 maxLength: {
//                   value: 2000,
//                   message: 'Description must be less than 2000 characters'
//                 },
//                 validate: {
//                   noMaliciousTags: (value) => {
//                     if (!value) return true;
//                     // Basic check for script tags
//                     const hasScriptTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value);
//                     return !hasScriptTags || 'Description contains invalid content';
//                   }
//                 }
//               }}
//               render={({ field }) => (
//                 <>
//                   <div className={`border rounded overflow-hidden ${
//                     errors.description ? 'border-red-500' : 'border-gray-300'
//                   }`}>
//                     <ReactQuill
//                       theme="snow"
//                       modules={quillModules}
//                       formats={quillFormats}
//                       {...field}
//                       placeholder="Enter task description..."
//                       readOnly={isSubmitting}
//                       className="h-64"
//                       onChange={(content, delta, source, editor) => {
//                         // Pass the HTML content to the form
//                         field.onChange(content);
//                       }}
//                     />
//                   </div>
//                 </>
//               )}
//             />
//             {errors.description && (
//               <p className="text-red-500 text-xs mt-2" role="alert">
//                 {errors.description.message}
//               </p>
//             )}
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_id">
//               Assign to User *
//             </label>
//             <Controller
//               name="user_id"
//               control={control}
//               rules={{ required: 'Please select a user' }}
//               render={({ field }) => (
//                 <select
//                   className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                     errors.user_id ? 'border-red-500' : ''
//                   }`}
//                   id="user_id"
//                   {...field}
//                   disabled={isSubmitting}
//                   aria-invalid={errors.user_id ? "true" : "false"}
//                 >
//                   <option value="">Select a user</option>
//                   {Array.isArray(users) && users.length > 0 ? (
//                     users.map((user) => (
//                       <option key={user.id} value={user.id}>
//                         {user.name} ({user.email})
//                       </option>
//                     ))
//                   ) : (
//                     <option value="" disabled>No users available</option>
//                   )}
//                 </select>
//               )}
//             />
//             {errors.user_id && (
//               <p className="text-red-500 text-xs mt-1" role="alert">
//                 {errors.user_id.message}
//               </p>
//             )}
//           </div>

//           <div className="flex items-center justify-between">

//             <button
//               className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 transition duration-200"
//               type="button"
//               onClick={handleClose}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${
//                 isSubmitting || !isValid || !isDirty ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//               type="submit"
//               disabled={isSubmitting || !isValid || !isDirty}
//             >
//               {isSubmitting ? 'Saving...' : editingTaskList ? 'Update Task' : 'Assign Task'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddTaskAssigned;

import React, { useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { X } from "lucide-react";

const AddTaskAssigned = ({
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
            user_id: "",
        },
        mode: "onChange",
    });

    // Watch description for validation feedback
    const descriptionValue = watch("description");

    // Check if user is admin
    useEffect(() => {
        if (user.role !== "admin") {
            setShowForm(false);
        }
    }, [user.role, setShowForm]);

    // Reset form when opening
    useEffect(() => {
        if (showForm) {
            reset({
                title: "",
                description: "",
                user_id: "",
            });
            clearErrors();
        }
    }, [showForm, reset, clearErrors]);

    // Handle Create Task
    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(
                route("ourtasklist.store"),
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
                    response.data.message || "Failed to create task"
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
            alert("Only admins can assign tasks");
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

            // Creating new task
            await handleCreate(formData);

            // Reset form and close
            reset({
                title: "",
                description: "",
                user_id: "",
            });

            setShowForm(false);
        } catch (error) {
            console.log("Error saving data", error);
        }
    };

    // Handle Close
    const handleClose = () => {
        reset({
            title: "",
            description: "",
            user_id: "",
        });
        clearErrors();
        setShowForm(false);
    };

    if (!showForm || user.role !== "admin") return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Assign New Task
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
                        {/* Task Title */}
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

                    {/* Descriptions */}

                    <div className="mb-4">
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
                                            {...field}
                                            placeholder="Enter task description..."
                                            readOnly={isSubmitting}
                                            className="h-64"
                                            onChange={(
                                                content,
                                                delta,
                                                source,
                                                editor
                                            ) => {
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

                    {/* User Assigned */}

                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="user_id"
                        >
                            Assign to User *
                        </label>
                        <Controller
                            name="user_id"
                            control={control}
                            rules={{ required: "Please select a user" }}
                            render={({ field }) => (
                                <select
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.user_id ? "border-red-500" : ""
                                    }`}
                                    id="user_id"
                                    {...field}
                                    disabled={isSubmitting}
                                    aria-invalid={
                                        errors.user_id ? "true" : "false"
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
                        {errors.user_id && (
                            <p
                                className="text-red-500 text-xs mt-1"
                                role="alert"
                            >
                                {errors.user_id.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            className={`flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${
                                isSubmitting || !isValid || !isDirty
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            type="submit"
                            disabled={isSubmitting || !isValid || !isDirty}
                        >
                            {isSubmitting ? "Saving..." : "Assign Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskAssigned;
