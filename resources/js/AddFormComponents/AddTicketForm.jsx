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

const AddTicketForm = ({
    editingTicket,
    setEditingTicket,
    setShowForm,
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);

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

    useEffect(() => {
        if (editingTicket) {
            setTicketForm({ ...editingTicket });
        } else {
            setTicketForm(emptyForm);
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
        const formData = new FormData();
        for (const key in ticketForm) {
            if (ticketForm[key] !== null && ticketForm[key] !== "") {
                formData.append(key, ticketForm[key]);
            }
        }
        try {
            setSubmitting(true);
            if (editingTicket) {
                await handleUpdate(formData, editingTicket.id);
            } else {
                await handleCreate(formData);
            }
            setTicketForm(emptyForm);
            setShowForm(false);
            setEditingTicket(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicketForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingTicket(null);
        setTicketForm(emptyForm);
    };

    const inputClass =
        "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold text-stone-800">
                        {editingTicket ? "Edit Ticket" : "Add New Ticket"}
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                                Client Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="client_name"
                                value={ticketForm.client_name}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                                Issue Type <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="issue_type"
                                value={ticketForm.issue_type}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="Hardware / Software / Network"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                                Device Type <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="device_type"
                                value={ticketForm.device_type}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="Laptop / Desktop / Printer"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                                Priority <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="priority"
                                value={ticketForm.priority}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            >
                                <option value="">Select priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        {/* Status field - only shown when editing */}
                        {editingTicket && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={ticketForm.status}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="waiting_parts">Waiting Parts</option>
                                    <option value="client_approval">Client Approval</option>
                                    <option value="completed">Completed</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                                Assigned Technician
                            </label>
                            <input
                                type="text"
                                name="assigned_technician"
                                value={ticketForm.assigned_technician}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                            Problem Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="problem_description"
                            value={ticketForm.problem_description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className={inputClass}
                            placeholder="Describe the issue in detail..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed tracking-widest uppercase"
                        >
                            {submitting
                                ? "Saving..."
                                : editingTicket
                                ? "Update Ticket"
                                : "Create Ticket"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTicketForm;