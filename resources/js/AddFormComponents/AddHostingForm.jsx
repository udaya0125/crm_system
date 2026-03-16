import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddHostingForm = ({
    editingHosting,
    setShowAddForm,
    setEditingHosting,
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [hostingForm, setHostingForm] = useState({
        hosting_plan: "",
        client_id: "",
        disk_usage: "",
        renewal_date: "",
        hosting_provider: "",
    });
    const [clients, setClients] = useState([]);

    useEffect(() => {
        if (editingHosting) {
            setHostingForm({
                hosting_plan: editingHosting.hosting_plan || "",
                client_id: editingHosting.client_id || "",
                disk_usage: editingHosting.disk_usage || "",
                renewal_date: editingHosting.renewal_date || "",
                hosting_provider: editingHosting.hosting_provider || "",
            });
        } else {
            setHostingForm({
                hosting_plan: "",
                client_id: "",
                disk_usage: "",
                renewal_date: "",
                hosting_provider: "",
            });
        }
    }, [editingHosting]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(route("ourclients.index"));
                setClients(response.data.data || response.data);
            } catch (error) {
                console.error("Error fetching clients", error);
            }
        };
        fetchClients();
    }, []);

    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourhostings.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating hosting", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in hostingForm) {
            if (hostingForm[key] !== null && hostingForm[key] !== "") {
                formData.append(key, hostingForm[key]);
            }
        }
        try {
            setSubmitting(true);
            if (editingHosting) {
                await handleUpdate(formData, editingHosting.id);
            } else {
                await handleCreate(formData);
            }
            setHostingForm({
                hosting_plan: "",
                client_id: "",
                disk_usage: "",
                renewal_date: "",
                hosting_provider: "",
            });
            setShowAddForm(false);
            setEditingHosting(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setHostingForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleClose = () => {
        setShowAddForm(false);
        setEditingHosting(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        {editingHosting ? "Edit Hosting" : "Add New Hosting"}
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
                    {/* Hosting Plan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hosting Plan
                        </label>
                        <input
                            type="text"
                            name="hosting_plan"
                            value={hostingForm.hosting_plan}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Basic, Pro, Enterprise"
                        />
                    </div>

                    {/* Client */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client
                        </label>
                        <select
                            name="client_id"
                            value={hostingForm.client_id}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select a client</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Hosting Provider */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hosting Provider
                        </label>
                        <input
                            type="text"
                            name="hosting_provider"
                            value={hostingForm.hosting_provider}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. AWS, DigitalOcean, Hostinger"
                        />
                    </div>

                    {/* Disk Usage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Disk Usage
                        </label>
                        <input
                            type="text"
                            name="disk_usage"
                            value={hostingForm.disk_usage}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. 5GB"
                        />
                    </div>

                    {/* Renewal Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Renewal Date
                        </label>
                        <input
                            type="date"
                            name="renewal_date"
                            value={hostingForm.renewal_date}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-60"
                        >
                            {submitting
                                ? "Saving..."
                                : editingHosting
                                  ? "Update"
                                  : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHostingForm;