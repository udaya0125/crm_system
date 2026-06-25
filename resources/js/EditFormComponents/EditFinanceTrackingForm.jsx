import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const EditFinanceTrackingForm = ({
    editingTracking,
    setShowForm,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [trackingForm, setTrackingForm] = useState({});

    useEffect(() => {
        if (editingTracking) {
            setTrackingForm({ ...editingTracking });
        }
    }, [editingTracking]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in trackingForm) {
            if (trackingForm[key] !== null && trackingForm[key] !== "") {
                formData.append(key, trackingForm[key]);
            }
        }
        try {
            setSubmitting(true);
            await handleUpdate(formData, editingTracking.id);
            setShowForm(false);
        } catch (error) {
            console.log("Error updating data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTrackingForm((prev) => ({ ...prev, [name]: value }));
    };

    const inputClass =
        "w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";
    const labelClass =
        "block text-xs font-semibold tracking-wider text-stone-500 uppercase mb-1";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-100">
                    <h2 className="text-2xl font-bold text-stone-800">
                        Edit Tracking Item
                    </h2>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="p-2 hover:bg-stone-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Invoice ID */}
                    <div>
                        <label className={labelClass}>Invoice ID</label>
                        <input
                            type="text"
                            name="invoice_id"
                            value={trackingForm.invoice_id ?? ""}
                            onChange={handleChange}
                            placeholder="e.g., INV-001"
                            className={inputClass}
                        />
                    </div>

                    {/* Client and Project */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Client</label>
                            <input
                                type="text"
                                name="client"
                                value={trackingForm.client ?? ""}
                                onChange={handleChange}
                                required
                                placeholder="Client name"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Project</label>
                            <input
                                type="text"
                                name="project"
                                value={trackingForm.project ?? ""}
                                onChange={handleChange}
                                required
                                placeholder="Project name"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Invoice Date and Due Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Invoice Date</label>
                            <input
                                type="date"
                                name="invoice_date"
                                value={trackingForm.invoice_date ?? ""}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Due Date</label>
                            <input
                                type="date"
                                name="due_date"
                                value={trackingForm.due_date ?? ""}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Amount and Paid Amount */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={trackingForm.amount ?? ""}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Paid Amount</label>
                            <input
                                type="number"
                                name="paid_amount"
                                value={trackingForm.paid_amount ?? ""}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Status</label>
                            <select
                                name="status"
                                value={trackingForm.status ?? ""}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">Select status</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                                <option value="partially_paid">Partially Paid</option>
                                <option value="pending">Pending</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-5 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-full transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 text-sm font-semibold tracking-wider uppercase bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Saving..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFinanceTrackingForm;