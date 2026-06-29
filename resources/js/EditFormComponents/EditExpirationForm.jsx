import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import Select from "react-select";
import toast from "react-hot-toast";

const EditExpirationForm = ({
    editingExpiration,
    handleUpdate,
    onSuccess,
    onCancel,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [expirationForm, setExpirationForm] = useState({
        client_id: "",
        title: "",
        last_renewal_date: "",
        duration: "",
        expiration_date: "",
    });

    // Title options for dropdown
    const titleOptions = [
        { value: "domain", label: "Domain" },
        { value: "e-attendance", label: "E-Attendance" },
    ];

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

    // Fetch clients
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

    // Populate form when editing
    useEffect(() => {
        if (editingExpiration) {
            setExpirationForm({
                client_id: editingExpiration.client_id || "",
                title: editingExpiration.title || "",
                last_renewal_date:
                    editingExpiration.last_renewal_date?.split("T")[0] || "",
                duration: editingExpiration.duration || "",
                expiration_date:
                    editingExpiration.expiration_date?.split("T")[0] || "",
            });

            // Set selected client for react-select
            if (editingExpiration.client_id && clients.length > 0) {
                const client = clients.find(
                    (c) => c.id === editingExpiration.client_id,
                );
                if (client) {
                    setSelectedClient({
                        value: client.id,
                        label: client.organization_name || client.name,
                    });
                }
            }

            // Set selected title for react-select
            if (editingExpiration.title) {
                const titleOption = titleOptions.find(
                    (t) => t.value === editingExpiration.title,
                );
                if (titleOption) {
                    setSelectedTitle(titleOption);
                }
            }
        }
        setErrors({});
    }, [editingExpiration, clients]);

    // Auto-calculate expiration date when last_renewal_date or duration changes
    useEffect(() => {
        if (expirationForm.last_renewal_date && expirationForm.duration) {
            const lastRenewal = new Date(expirationForm.last_renewal_date);
            const durationMonths = parseInt(expirationForm.duration);

            if (!isNaN(durationMonths) && durationMonths > 0) {
                const expirationDate = new Date(lastRenewal);
                expirationDate.setMonth(
                    lastRenewal.getMonth() + durationMonths,
                );

                // Format as YYYY-MM-DD for input
                const year = expirationDate.getFullYear();
                const month = String(expirationDate.getMonth() + 1).padStart(
                    2,
                    "0",
                );
                const day = String(expirationDate.getDate()).padStart(2, "0");

                setExpirationForm((prev) => ({
                    ...prev,
                    expiration_date: `${year}-${month}-${day}`,
                }));
            }
        }
    }, [expirationForm.last_renewal_date, expirationForm.duration]);

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!expirationForm.client_id) {
            newErrors.client_id = "Client is required";
        }

        if (!expirationForm.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!expirationForm.last_renewal_date) {
            newErrors.last_renewal_date = "Last renewal date is required";
        } else {
            const selectedDate = new Date(expirationForm.last_renewal_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
                newErrors.last_renewal_date =
                    "Last renewal date cannot be in the future";
            }
        }

        if (!expirationForm.duration) {
            newErrors.duration = "Duration is required";
        } else {
            const durationValue = parseInt(expirationForm.duration);
            if (durationValue <= 0) {
                newErrors.duration = "Duration must be greater than 0";
            } else if (durationValue > 120) {
                newErrors.duration =
                    "Duration cannot exceed 120 months (10 years)";
            }
        }

        if (!expirationForm.expiration_date) {
            newErrors.expiration_date = "Expiration date is required";
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expDate = new Date(expirationForm.expiration_date);

            if (expDate < today) {
                newErrors.expiration_date =
                    "Expiration date cannot be in the past";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Submit
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!validateForm()) {
    //         return;
    //     }

    //     const formData = new FormData();

    //     // Append all form data
    //     Object.keys(expirationForm).forEach(key => {
    //         if (expirationForm[key] !== null && expirationForm[key] !== "") {
    //             formData.append(key, expirationForm[key]);
    //         }
    //     });

    //     try {
    //         setSubmitting(true);
    //         await handleUpdate(formData, editingExpiration.id);
    //         alert('Expiration updated successfully!');

    //         if (onSuccess) {
    //             onSuccess();
    //         }

    //     } catch (error) {
    //         console.log("Error updating data", error);

    //         if (error.response) {
    //             if (error.response.data.errors) {
    //                 setErrors(error.response.data.errors);
    //             } else if (error.response.data.message) {
    //                 alert(error.response.data.message);
    //             } else {
    //                 alert('Error updating expiration. Please try again.');
    //             }
    //         } else {
    //             alert('Network error. Please check your connection.');
    //         }
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        Object.keys(expirationForm).forEach((key) => {
            if (expirationForm[key] !== null && expirationForm[key] !== "") {
                formData.append(key, expirationForm[key]);
            }
        });

        try {
            setSubmitting(true);
            await toast.promise(handleUpdate(formData, editingExpiration.id), {
                loading: "Updating expiration...",
                success: "Expiration updated successfully!",
                error: (err) => {
                    if (err.response?.data?.errors) {
                        setErrors(err.response.data.errors);
                    }
                    return (
                        err.response?.data?.message ||
                        "Failed to update expiration."
                    );
                },
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            // errors already handled inside toast.promise
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpirationForm((prev) => ({
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

    // Handle client change with react-select
    const handleClientChange = (selectedOption) => {
        setSelectedClient(selectedOption);
        setExpirationForm((prev) => ({
            ...prev,
            client_id: selectedOption ? selectedOption.value : "",
        }));

        // Clear client error
        if (errors.client_id) {
            setErrors((prev) => ({
                ...prev,
                client_id: null,
            }));
        }
    };

    // Handle title change with react-select
    const handleTitleChange = (selectedOption) => {
        setSelectedTitle(selectedOption);
        setExpirationForm((prev) => ({
            ...prev,
            title: selectedOption ? selectedOption.value : "",
        }));

        // Clear title error
        if (errors.title) {
            setErrors((prev) => ({
                ...prev,
                title: null,
            }));
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    // Get today's date in YYYY-MM-DD format for min/max attributes
    const today = new Date().toISOString().split("T")[0];

    // Transform clients for react-select
    const clientOptions = clients.map((client) => ({
        value: client.id,
        label: client.organization_name || client.name,
    }));

    // Custom styles for react-select
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
            "&:hover": {
                borderColor: "#6366f1",
            },
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
            "&:active": {
                backgroundColor: "#4f46e5",
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#9ca3af",
        }),
    };

    return (
        <div className="p-6 text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Edit Expiration
                    </h2>
                </div>
                <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    type="button"
                    disabled={submitting}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Client and Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Client Field with React Select */}
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
                            loadingMessage={() => "Loading clients..."}
                        />
                        {errors.client_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.client_id}
                            </p>
                        )}
                    </div>

                    {/* Title Field with React Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <Select
                            name="title"
                            value={selectedTitle}
                            onChange={handleTitleChange}
                            options={titleOptions}
                            placeholder="Select Title"
                            isDisabled={submitting}
                            isClearable
                            isSearchable
                            styles={customSelectStyles}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            noOptionsMessage={() => "No titles found"}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.title}
                            </p>
                        )}
                    </div>
                </div>

                {/* Row 2: Last Renewal Date and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Last Renewal Date Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Renewal Date{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="last_renewal_date"
                            value={expirationForm.last_renewal_date}
                            onChange={handleChange}
                            max={today}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors.last_renewal_date
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            disabled={submitting}
                            required
                        />
                        {errors.last_renewal_date && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.last_renewal_date}
                            </p>
                        )}
                    </div>

                    {/* Duration Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (Months){" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="duration"
                            value={expirationForm.duration}
                            onChange={handleChange}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors.duration
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="Enter duration in months"
                            min="1"
                            max="120"
                            step="1"
                            disabled={submitting}
                            required
                        />
                        {errors.duration && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.duration}
                            </p>
                        )}
                    </div>
                </div>

                {/* Row 3: Expiration Date (Full Width) */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Expiration Date Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration Date{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="expiration_date"
                            value={expirationForm.expiration_date}
                            onChange={handleChange}
                            min={today}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 ${
                                errors.expiration_date
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            disabled={true}
                            readOnly
                            required
                        />
                        {errors.expiration_date && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.expiration_date}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                            Automatically calculated based on last renewal date
                            + duration (months)
                        </p>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
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
                                Updating...
                            </span>
                        ) : (
                            <span>Update Expiration</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditExpirationForm;
