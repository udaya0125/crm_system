// import { X } from "lucide-react";
// import React from "react";

// const AddTicketForm = () => {
//     const [submitting, setSubmitting] = useState(false);
//     const [ticketForm, setTicketForm] = useState({
//         ticket_id: "",
//         client_name: "",
//         issue_type: "",
//         device_type: "",
//         problem_description: "",
//         priority: "",
//         assigned_technician: "",
//         status: "",
//     });

//     //  Use Effect for setting the form data when editing and resetting when not editing
//     useEffect(() => {
//         if (editingTicket) {
//             setTicketForm({
//                 ...editingTicket,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setTicketForm({
//                 ticket_id: "",
//                 client_name: "",
//                 issue_type: "",
//                 device_type: "",
//                 problem_description: "",
//                 priority: "",
//                 assigned_technician: "",
//                 status: "",
//             });
//         }
//     }, [editingTicket]);

//     // Handle Create Ticket
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourtickets.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating ticket", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in ticketForm) {
//             if (ticketForm[key] !== null && ticketForm[key] !== "") {
//                 formData.append(key, ticketForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingTicket) {
//                 // Editing existing ticket
//                 await handleUpdate(formData, editingTicket.id);
//             } else {
//                 // Creating new ticket
//                 await handleCreate(formData);
//             }
//             setTicketForm({
//                 ticket_id: "",
//                 client_name: "",
//                 issue_type: "",
//                 device_type: "",
//                 problem_description: "",
//                 priority: "",
//                 assigned_technician: "",
//                 status: "",
//             });

//             setShowForm(false);
//             setEditingTicket(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setTicketForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
//                     <h2 className="text-2xl font-bold">Add New Gallery Item</h2>
//                     <button
//                         type="button"
//                         className="p-2 hover:bg-gray-100 rounded-full transition"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddTicketForm;



import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const AddTicketForm = ({
    editingTicket,
    setEditingTicket,
    setShowForm,
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const emptyForm = {
        ticket_id: "",
        client_name: "",
        issue_type: "",
        device_type: "",
        problem_description: "",
        priority: "",
        assigned_technician: "",
        status: "open", // Default status for new tickets
    };

    const [ticketForm, setTicketForm] = useState(emptyForm);

    // Priority options for react-select
    const priorityOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
    ];

    // Status options for react-select
    const statusOptions = [
        { value: "open", label: "Open" },
        { value: "in_progress", label: "In Progress" },
        { value: "waiting_parts", label: "Waiting Parts" },
        { value: "client_approval", label: "Client Approval" },
        { value: "completed", label: "Completed" },
        { value: "closed", label: "Closed" },
    ];

    // Lock body scroll when form mounts
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

    useEffect(() => {
        if (editingTicket) {
            setTicketForm({ ...editingTicket });
            
            // Set selected priority for react-select
            const priorityOption = priorityOptions.find(
                option => option.value === editingTicket.priority
            );
            setSelectedPriority(priorityOption || null);
            
            // Set selected status for react-select
            const statusOption = statusOptions.find(
                option => option.value === editingTicket.status
            );
            setSelectedStatus(statusOption || null);
        } else {
            setTicketForm(emptyForm);
            setSelectedPriority(null);
            setSelectedStatus(null);
        }
    }, [editingTicket]);

    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourtickets.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating ticket", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        const formData = new FormData();
        
        // Append all form data
        Object.keys(ticketForm).forEach(key => {
            if (ticketForm[key] !== null && ticketForm[key] !== "") {
                formData.append(key, ticketForm[key]);
            }
        });

        try {
            setSubmitting(true);
            if (editingTicket) {
                await handleUpdate(formData, editingTicket.id);
            } else {
                await handleCreate(formData);
            }
            
            // Show success message
            alert(editingTicket ? 'Ticket updated successfully!' : 'Ticket created successfully!');
            
            setTicketForm(emptyForm);
            setShowForm(false);
            setEditingTicket(null);
            
        } catch (error) {
            console.log("Error saving data", error);
            
            if (error.response) {
                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else if (error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    alert('Error saving ticket. Please try again.');
                }
            } else {
                alert('Network error. Please check your connection.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!ticketForm.client_name?.trim()) {
            newErrors.client_name = "Client name is required";
        }
        
        if (!ticketForm.issue_type?.trim()) {
            newErrors.issue_type = "Issue type is required";
        }
        
        if (!ticketForm.device_type?.trim()) {
            newErrors.device_type = "Device type is required";
        }
        
        if (!ticketForm.priority) {
            newErrors.priority = "Priority is required";
        }
        
        if (editingTicket && !ticketForm.status) {
            newErrors.status = "Status is required";
        }
        
        if (!ticketForm.problem_description?.trim()) {
            newErrors.problem_description = "Problem description is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle change for regular inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicketForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    // Handle priority change with react-select
    const handlePriorityChange = (selectedOption) => {
        setSelectedPriority(selectedOption);
        setTicketForm((prev) => ({ 
            ...prev, 
            priority: selectedOption ? selectedOption.value : "" 
        }));
        
        // Clear priority error
        if (errors.priority) {
            setErrors((prev) => ({
                ...prev,
                priority: null,
            }));
        }
    };

    // Handle status change with react-select
    const handleStatusChange = (selectedOption) => {
        setSelectedStatus(selectedOption);
        setTicketForm((prev) => ({ 
            ...prev, 
            status: selectedOption ? selectedOption.value : "" 
        }));
        
        // Clear status error
        if (errors.status) {
            setErrors((prev) => ({
                ...prev,
                status: null,
            }));
        }
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingTicket(null);
        setTicketForm(emptyForm);
        setSelectedPriority(null);
        setSelectedStatus(null);
        setErrors({});
    };

    const inputClass = `w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
        errors.client_name || errors.issue_type || errors.device_type || errors.problem_description 
            ? 'border-red-500' 
            : 'border-gray-300'
    }`;

    // Custom styles for react-select matching the example
    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '42px',
            borderColor: state.isFocused 
                ? '#6366f1' 
                : (errors.priority || errors.status) 
                    ? '#ef4444' 
                    : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
            '&:hover': {
                borderColor: '#6366f1'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected 
                ? '#6366f1' 
                : state.isFocused 
                ? '#e0e7ff' 
                : 'white',
            color: state.isSelected ? 'white' : '#111827',
            cursor: 'pointer',
            fontSize: '0.875rem',
            padding: '8px 12px',
            '&:active': {
                backgroundColor: '#4f46e5'
            }
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9ca3af',
            fontSize: '0.875rem'
        }),
        singleValue: (provided) => ({
            ...provided,
            fontSize: '0.875rem'
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '0.5rem',
            overflow: 'hidden',
            zIndex: 60
        })
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-2xl font-bold text-stone-800">
                            {editingTicket ? "Edit Ticket" : "Add New Ticket"}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={submitting}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Client Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="client_name"
                                value={ticketForm.client_name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.client_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="John Doe"
                                disabled={submitting}
                                required
                            />
                            {errors.client_name && (
                                <p className="mt-1 text-sm text-red-600">{errors.client_name}</p>
                            )}
                        </div>

                        {/* Issue Type Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Issue Type <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="issue_type"
                                value={ticketForm.issue_type}
                                onChange={handleChange}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.issue_type ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Hardware / Software / Network"
                                disabled={submitting}
                                required
                            />
                            {errors.issue_type && (
                                <p className="mt-1 text-sm text-red-600">{errors.issue_type}</p>
                            )}
                        </div>

                        {/* Device Type Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Device Type <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="device_type"
                                value={ticketForm.device_type}
                                onChange={handleChange}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.device_type ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Laptop / Desktop / Printer"
                                disabled={submitting}
                                required
                            />
                            {errors.device_type && (
                                <p className="mt-1 text-sm text-red-600">{errors.device_type}</p>
                            )}
                        </div>

                        {/* Priority Field with React Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority <span className="text-red-500">*</span>
                            </label>
                            <Select
                                name="priority"
                                value={selectedPriority}
                                onChange={handlePriorityChange}
                                options={priorityOptions}
                                placeholder="Select Priority"
                                isDisabled={submitting}
                                isClearable
                                isSearchable
                                styles={customSelectStyles}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                noOptionsMessage={() => "No options found"}
                            />
                            {errors.priority && (
                                <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
                            )}
                        </div>

                        {/* Status Field with React Select - only shown when editing */}
                        {editingTicket && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    name="status"
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                    options={statusOptions}
                                    placeholder="Select Status"
                                    isDisabled={submitting}
                                    isClearable={false}
                                    isSearchable
                                    styles={customSelectStyles}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    noOptionsMessage={() => "No options found"}
                                />
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                )}
                            </div>
                        )}

                        {/* Assigned Technician Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assigned Technician
                            </label>
                            <input
                                type="text"
                                name="assigned_technician"
                                value={ticketForm.assigned_technician}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Optional"
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {/* Problem Description Field - Full Width */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Problem Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="problem_description"
                            value={ticketForm.problem_description}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors.problem_description ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Describe the issue in detail..."
                            disabled={submitting}
                            required
                        />
                        {errors.problem_description && (
                            <p className="mt-1 text-sm text-red-600">{errors.problem_description}</p>
                        )}
                    </div>

                    {/* Helper text for status when creating new ticket */}
                    {/* {!editingTicket && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-700">
                                <span className="font-medium">Note:</span> Status will be automatically set to "Open" for new tickets.
                            </p>
                        </div>
                    )} */}

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2.5 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
                            disabled={submitting}
                        >
                            {submitting ? (
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
                                    {editingTicket ? 'Updating...' : 'Creating...'}
                                </span>
                            ) : (
                                <span>{editingTicket ? 'Update Ticket' : 'Create Ticket'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTicketForm;