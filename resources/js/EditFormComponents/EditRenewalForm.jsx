import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

// Note I have not used this on my project 
const EditRenewalForm = ({ editingRenewal, setShowForm, setEditingRenewal, setReloadTrigger }) => {
    const [submitting, setSubmitting] = useState(false);
    const [renewalForm, setRenewalForm] = useState({
        contract_id: "",
        client_name: "",
        service_type: "",
        start_date: "",
        expiry_date: "",
        amount: "",
        renewal_period: "",
        responsible_staff: "",
        status: "",
    });

    // Pre-populate form with the renewal being edited
    useEffect(() => {
        if (editingRenewal) {
            setRenewalForm({
                contract_id:       editingRenewal.contract_id       ?? "",
                client_name:       editingRenewal.client_name       ?? "",
                service_type:      editingRenewal.service_type      ?? "",
                start_date:        editingRenewal.start_date        ?? "",
                expiry_date:       editingRenewal.expiry_date       ?? "",
                amount:            editingRenewal.amount            ?? "",
                renewal_period:    editingRenewal.renewal_period    ?? "",
                responsible_staff: editingRenewal.responsible_staff ?? "",
                status:            editingRenewal.status            ?? "",
            });
        }
    }, [editingRenewal]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setRenewalForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingRenewal(null);
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("renewals.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );
        setReloadTrigger((prev) => !prev);
        return response.data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in renewalForm) {
            if (renewalForm[key] !== null && renewalForm[key] !== "") {
                formData.append(key, renewalForm[key]);
            }
        }

        try {
            setSubmitting(true);
            await handleUpdate(formData, editingRenewal.id);
            handleClose();
        } catch (error) {
            console.error("Error updating renewal", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold text-stone-800">
                        Edit Renewal
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contract ID
                            </label>
                            <input
                                type="text"
                                name="contract_id"
                                value={renewalForm.contract_id}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client Name
                            </label>
                            <input
                                type="text"
                                name="client_name"
                                value={renewalForm.client_name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Type
                            </label>
                            <input
                                type="text"
                                name="service_type"
                                value={renewalForm.service_type}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={renewalForm.amount}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={renewalForm.start_date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                            </label>
                            <input
                                type="date"
                                name="expiry_date"
                                value={renewalForm.expiry_date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Renewal Period
                            </label>
                            <input
                                type="text"
                                name="renewal_period"
                                value={renewalForm.renewal_period}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Responsible Staff
                            </label>
                            <input
                                type="text"
                                name="responsible_staff"
                                value={renewalForm.responsible_staff}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={renewalForm.status}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select status</option>
                                <option value="pending">Pending</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRenewalForm;