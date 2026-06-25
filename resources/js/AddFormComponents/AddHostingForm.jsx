import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const AddHostingForm = ({
    setShowAddForm,
    setReloadTrigger,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [hostingForm, setHostingForm] = useState({
        hosting_plan: "",
        client_id: "",
        disk_usage: "",
        renewal_date: "",
        hosting_provider: "",
    });
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    // Lock body scroll when form mounts
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

    const validateForm = () => {
        const newErrors = {};

        if (!hostingForm.hosting_plan.trim()) {
            newErrors.hosting_plan = "Hosting plan is required";
        }

        if (!hostingForm.client_id) {
            newErrors.client_id = "Client is required";
        }

        if (!hostingForm.hosting_provider.trim()) {
            newErrors.hosting_provider = "Hosting provider is required";
        }

        if (!hostingForm.renewal_date) {
            newErrors.renewal_date = "Renewal date is required";
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const renewalDate = new Date(hostingForm.renewal_date);

            if (renewalDate < today) {
                newErrors.renewal_date = "Renewal date cannot be in the past";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourhostings.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating hosting", error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData();
        for (const key in hostingForm) {
            if (hostingForm[key] !== null && hostingForm[key] !== "") {
                formData.append(key, hostingForm[key]);
            }
        }

        try {
            setSubmitting(true);
            await handleCreate(formData);
            setShowAddForm(false);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHostingForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleClientChange = (selectedOption) => {
        setSelectedClient(selectedOption);
        setHostingForm((prev) => ({
            ...prev,
            client_id: selectedOption ? selectedOption.value : "",
        }));
        if (errors.client_id) {
            setErrors((prev) => ({ ...prev, client_id: null }));
        }
    };

    const handleClose = () => {
        setShowAddForm(false);
    };

    const clientOptions = clients.map((client) => ({
        value: client.id,
        label: client.organization_name || client.name,
    }));

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: "42px",
            borderColor: errors.client_id
                ? "#ef4444"
                : state.isFocused
                ? "#6366f1"
                : "#d1d5db",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(99, 102, 241, 0.2)"
                : "none",
            "&:hover": { borderColor: "#6366f1" },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#6366f1"
                : state.isFocused
                ? "#e0e7ff"
                : "white",
            color: state.isSelected ? "white" : "#111827",
            cursor: "pointer",
            "&:active": { backgroundColor: "#4f46e5" },
        }),
        placeholder: (provided) => ({ ...provided, color: "#9ca3af" }),
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">Add New Hosting</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                        disabled={submitting}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Hosting Plan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hosting Plan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="hosting_plan"
                            value={hostingForm.hosting_plan}
                            onChange={handleChange}
                            disabled={submitting}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.hosting_plan
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="e.g. Basic, Pro, Enterprise"
                        />
                        {errors.hosting_plan && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.hosting_plan}
                            </p>
                        )}
                    </div>

                    {/* Client */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client <span className="text-red-500">*</span>
                        </label>
                        <Select
                            name="client_id"
                            value={selectedClient}
                            onChange={handleClientChange}
                            options={clientOptions}
                            placeholder="Select Client"
                            isDisabled={submitting}
                            isClearable
                            isSearchable
                            styles={customSelectStyles}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            noOptionsMessage={() => "No clients found"}
                        />
                        {errors.client_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.client_id}
                            </p>
                        )}
                    </div>

                    {/* Hosting Provider */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hosting Provider <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="hosting_provider"
                            value={hostingForm.hosting_provider}
                            onChange={handleChange}
                            disabled={submitting}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.hosting_provider
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="e.g. AWS, DigitalOcean, Hostinger"
                        />
                        {errors.hosting_provider && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.hosting_provider}
                            </p>
                        )}
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
                            disabled={submitting}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. 5GB"
                        />
                    </div>

                    {/* Renewal Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Renewal Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="renewal_date"
                            value={hostingForm.renewal_date}
                            onChange={handleChange}
                            min={today}
                            disabled={submitting}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.renewal_date
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.renewal_date && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.renewal_date}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition text-sm font-medium disabled:opacity-50"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-60 flex items-center"
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
                                    Saving...
                                </span>
                            ) : (
                                "Create"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHostingForm;
