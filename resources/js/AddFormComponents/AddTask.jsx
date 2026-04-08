import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { X, User, UserPlus } from "lucide-react";
import Select from "react-select";

const AddTask = ({ onAddTask, onClose, taskLists }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            title: "",
            due_date: "",
            task_list_id: "",
            description: "",
        },
    });

    // Watch the selected task list ID
    const selectedTaskListId = watch("task_list_id");
    
    // Find the selected task list with its assigned user and creator
    const selectedTaskList = taskLists?.find(
        (list) => list.id.toString() === selectedTaskListId?.toString()
    );

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

    // React Quill modules configuration and formats
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

    // Transform taskLists into options for react-select
    const taskListOptions = taskLists?.map(list => ({
        value: list.id,
        label: list.title
    })) || [];

    // Custom styles for react-select
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '42px',
            borderColor: errors.task_list_id ? '#ef4444' : '#d1d5db',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#3b82f6'
            },
            ...(state.isFocused && {
                borderColor: '#3b82f6',
                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
            })
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e5e7eb' : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: state.isSelected ? '#3b82f6' : '#d1d5db'
            }
        }),
        menu: (base) => ({
            ...base,
            zIndex: 50
        }),
        placeholder: (base) => ({
            ...base,
            color: '#9ca3af'
        })
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
            onClose(); // Close the form after successful submission
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
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
                    <h2 className="text-2xl font-bold">Add New Task</h2>
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
                {/* First Row - Title and Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: "Title is required" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter task title"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.title ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        disabled={isSubmitting}
                                        required
                                    />
                                )}
                            />
                        </div>
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                        )}
                    </div>

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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min={new Date().toISOString().slice(0, 16)}
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Task List Selection - Updated Layout */}
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Task List Dropdown with React Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task List <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Controller
                                    name="task_list_id"
                                    control={control}
                                    rules={{ required: "Task list is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={taskListOptions}
                                            styles={selectStyles}
                                            placeholder="Select a Task List"
                                            isDisabled={isSubmitting}
                                            isClearable={false}
                                            isSearchable={true}
                                            value={taskListOptions.find(option => option.value === field.value) || null}
                                            onChange={(selectedOption) => {
                                                field.onChange(selectedOption ? selectedOption.value : '');
                                            }}
                                            onBlur={field.onBlur}
                                            getOptionLabel={(option) => option.label}
                                            getOptionValue={(option) => option.value}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            noOptionsMessage={() => "No task lists available"}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Assigned By Information - Now as a Box with increased text size */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assigned by:
                            </label>
                            <div className="h-10 w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                                {selectedTaskList && selectedTaskList.creator ? (
                                    <div className="flex items-center space-x-2 text-gray-700">
                                        <UserPlus className="w-5 h-5 text-gray-500" />
                                        <span className="text-base font-medium">
                                            {selectedTaskList.creator.name}
                                        </span>
                                        {selectedTaskList.creator.email && (
                                            <span className="text-gray-500 text-sm">
                                                ({selectedTaskList.creator.email})
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-base">Select a task list to see who assigned it</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Error Message for Task List */}
                    {errors.task_list_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.task_list_id.message}</p>
                    )}

                    {/* Assigned To User (Below the grid) - With increased text size */}
                    {selectedTaskList && selectedTaskList.assigned_user && (
                        <div className="mt-3 flex items-center space-x-2 text-gray-700">
                            <User className="w-5 h-5 text-gray-500" />
                            <span>
                                <span className="font-medium text-base">Assigned to:</span>{' '}
                                <span className="text-base">{selectedTaskList.assigned_user.name}</span>
                            </span>
                        </div>
                    )}
                </div>

                {/* Description Field - Full Width */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <div className="relative">
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
                                        readOnly={isSubmitting}
                                    />
                                </div>
                            )}
                        />
                    </div>
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
                                Creating...
                            </span>
                        ) : (
                            <span>Create Task</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTask;



// import React, { useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { X } from "lucide-react";

// const AddTask = ({ onAddTask, onClose, taskLists }) => {
//     const {
//         control,
//         handleSubmit,
//         formState: { errors, isSubmitting },
//         reset,
//         setValue,
//         watch,
//     } = useForm({
//         defaultValues: {
//             title: "",
//             due_date: "",
//             task_list_id: "",
//             description: "",
//         },
//     });

//     // Add this useEffect to lock body scroll when form mounts
//     useEffect(() => {
//         // Lock body scroll
//         document.body.style.overflow = 'hidden';
//         document.body.style.position = 'fixed';
//         document.body.style.width = '100%';
        
//         // Cleanup function to restore scroll when component unmounts
//         return () => {
//             document.body.style.overflow = 'unset';
//             document.body.style.position = 'static';
//             document.body.style.width = 'auto';
//         };
//     }, []);

//     // React Quill modules configuration and formats
//     const quillModules = {
//         toolbar: [
//             ["bold", "italic", "underline", "strike"],
//             ["blockquote", "code-block"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ script: "sub" }, { script: "super" }],
//             [{ indent: "-1" }, { indent: "+1" }],
//             [{ direction: "rtl" }],
//             [{ size: ["small", false, "large", "huge"] }],
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             [{ color: [] }, { background: [] }],
//             [{ font: [] }],
//             [{ align: [] }],
//             ["clean"],
//             ["link", "image"],
//         ],
//     };

//     const quillFormats = [
//         "header",
//         "font",
//         "size",
//         "bold",
//         "italic",
//         "underline",
//         "strike",
//         "blockquote",
//         "list",
//         "bullet",
//         "indent",
//         "link",
//         "image",
//         "color",
//         "background",
//         "align",
//         "code-block",
//     ];

//     // Format date to d-m-y H:i format for Laravel
//     const formatDateForBackend = (dateString) => {
//         if (!dateString) return null;

//         try {
//             const date = new Date(dateString);
//             const day = String(date.getDate()).padStart(2, "0");
//             const month = String(date.getMonth() + 1).padStart(2, "0");
//             const year = String(date.getFullYear()).slice(-2);
//             const hours = String(date.getHours()).padStart(2, "0");
//             const minutes = String(date.getMinutes()).padStart(2, "0");

//             return `${day}-${month}-${year} ${hours}:${minutes}`;
//         } catch (error) {
//             console.error("Error formatting date:", error);
//             return null;
//         }
//     };

//     // Handle form submission
//     const onSubmit = async (data) => {
//         try {
//             // Format due_date for backend
//             const formattedDueDate = formatDateForBackend(data.due_date);

//             const taskData = {
//                 title: data.title,
//                 is_completed: false, // Always set to false (incomplete) for new tasks
//                 due_date: formattedDueDate,
//                 task_list_id: data.task_list_id,
//                 descriptions:
//                     data.description &&
//                     data.description.trim() !== "" &&
//                     data.description !== "<p><br></p>"
//                         ? [data.description]
//                         : [""],
//             };

//             await onAddTask(taskData);
//             reset(); // Clear form
//             onClose(); // Close the form after successful submission
//         } catch (error) {
//             console.error("Error adding task:", error);
//             throw error;
//         }
//     };

//     // Handle cancel
//     const handleCancel = () => {
//         if (onClose) {
//             onClose();
//         }
//     };

//     return (
//         <div className="p-6 text-gray-800">
//             <div className="flex justify-between items-center mb-6">
//                 <div className="flex items-center space-x-3">
//                     <h2 className="text-2xl font-bold">Add New Task</h2>
//                 </div>
//                 <button
//                     onClick={handleCancel}
//                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     type="button"
//                     disabled={isSubmitting}
//                 >
//                     <X className="w-6 h-6" />
//                 </button>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 {/* First Row - Title and Due Date */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Title Field */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Title <span className="text-red-500">*</span>
//                         </label>
//                         <div className="relative">
//                             <Controller
//                                 name="title"
//                                 control={control}
//                                 rules={{ required: "Title is required" }}
//                                 render={({ field }) => (
//                                     <input
//                                         {...field}
//                                         type="text"
//                                         placeholder="Enter task title"
//                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                             errors.title ? 'border-red-500' : 'border-gray-300'
//                                         }`}
//                                         disabled={isSubmitting}
//                                         required
//                                     />
//                                 )}
//                             />
//                         </div>
//                         {errors.title && (
//                             <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
//                         )}
//                     </div>

//                     {/* Due Date and Time Field */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Due Date & Time
//                         </label>
//                         <div className="relative">
//                             <Controller
//                                 name="due_date"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <input
//                                         {...field}
//                                         type="datetime-local"
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         min={new Date().toISOString().slice(0, 16)}
//                                         disabled={isSubmitting}
//                                     />
//                                 )}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Task List ID Field */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Task List <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                         <Controller
//                             name="task_list_id"
//                             control={control}
//                             rules={{ required: "Task list is required" }}
//                             render={({ field }) => (
//                                 <select
//                                     {...field}
//                                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                         errors.task_list_id ? 'border-red-500' : 'border-gray-300'
//                                     }`}
//                                     disabled={isSubmitting}
//                                     required
//                                 >
//                                     <option value="">Select a Task List</option>
//                                     {taskLists &&
//                                         taskLists.map((list) => (
//                                             <option key={list.id} value={list.id}>
//                                                 {list.title}
//                                             </option>
//                                         ))}
//                                 </select>
//                             )}
//                         />
//                     </div>
//                     {errors.task_list_id && (
//                         <p className="mt-1 text-sm text-red-600">{errors.task_list_id.message}</p>
//                     )}
//                 </div>

//                 {/* Description Field - Full Width */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Description
//                     </label>
//                     <div className="relative">
//                         <Controller
//                             name="description"
//                             control={control}
//                             render={({ field }) => (
//                                 <div className="border border-gray-300 rounded-lg overflow-hidden">
//                                     <ReactQuill
//                                         {...field}
//                                         theme="snow"
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         className="h-40 mb-12"
//                                         placeholder="Enter task description..."
//                                         onChange={(content) => field.onChange(content)}
//                                         readOnly={isSubmitting}
//                                     />
//                                 </div>
//                             )}
//                         />
//                     </div>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                     <button
//                         type="button"
//                         onClick={handleCancel}
//                         className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={isSubmitting}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                         disabled={isSubmitting}
//                     >
//                         {isSubmitting ? (
//                             <span className="flex items-center">
//                                 <svg
//                                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <circle
//                                         className="opacity-25"
//                                         cx="12"
//                                         cy="12"
//                                         r="10"
//                                         stroke="currentColor"
//                                         strokeWidth="4"
//                                     />
//                                     <path
//                                         className="opacity-75"
//                                         fill="currentColor"
//                                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                                     />
//                                 </svg>
//                                 Creating...
//                             </span>
//                         ) : (
//                             <span>Create Task</span>
//                         )}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddTask;
