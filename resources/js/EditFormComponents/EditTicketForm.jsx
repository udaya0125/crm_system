import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";

const ACCEPTED_TYPES = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "application/pdf",
];
const ACCEPTED_EXTENSIONS = ".png,.jpg,.jpeg,.webp,.pdf";
const imgurl = import.meta.env.VITE_IMAGE_PATH;

// Safely join base + path regardless of leading/trailing slashes
const buildImageUrl = (path) => {
    if (!path) return null;
    const base = imgurl.replace(/\/+$/, "");
    const rel = path.replace(/^\/+/, "");
    return `${base}/${rel}`;
};

const EditTicketForm = ({
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
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [menuPortalTarget, setMenuPortalTarget] = useState(null);
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [dragError, setDragError] = useState("");
    const fileInputRef = useRef(null);

    const [ticketForm, setTicketForm] = useState({});

    // Store the existing image URL separately — never mix it into formData
    const [existingImageUrl, setExistingImageUrl] = useState(null);

    const priorityOptions = [
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" },
    ];

    const statusOptions = [
        { value: "open", label: "Open" },
        { value: "in_progress", label: "In Progress" },
        { value: "waiting_parts", label: "Waiting Parts" },
        { value: "client_approval", label: "Client Approval" },
        { value: "completed", label: "Completed" },
        { value: "closed", label: "Closed" },
    ];

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: "42px",
            borderColor: state.isFocused
                ? "#6366f1"
                : state.selectProps.error
                  ? "#ef4444"
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
            fontSize: "0.875rem",
            padding: "8px 12px",
            "&:active": { backgroundColor: "#4f46e5" },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#9ca3af",
            fontSize: "0.875rem",
        }),
        singleValue: (provided) => ({ ...provided, fontSize: "0.875rem" }),
        menu: (provided) => ({
            ...provided,
            borderRadius: "0.5rem",
            overflow: "hidden",
            zIndex: 9999,
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        setMenuPortalTarget(document.body);
        return () => {
            document.body.style.overflow = "unset";
            document.body.style.position = "static";
            document.body.style.width = "auto";
        };
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const response = await axios.get(route("ourusers.index"));
                const userOptions = (response.data.users || []).map((user) => ({
                    value: user.id,
                    label: `${user.name} (${user.email})`,
                }));
                setUsers(userOptions);
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (editingTicket) {
            // ✅ Pull out the image URL separately, never put it in ticketForm
            setExistingImageUrl(editingTicket.image || null);

            // ✅ Only seed editable fields into ticketForm — no image, no computed fields
            setTicketForm({
                client_name: editingTicket.client_name || "",
                email: editingTicket.email || "",
                issue_type: editingTicket.issue_type || "",
                device_type: editingTicket.device_type || "",
                problem_description: editingTicket.problem_description || "",
                priority: editingTicket.priority || "",
                status: editingTicket.status || "",
                assigned_technician: editingTicket.assigned_technician || "",
            });

            const priorityOption = priorityOptions.find(
                (option) => option.value === editingTicket.priority,
            );
            setSelectedPriority(priorityOption || null);

            const statusOption = statusOptions.find(
                (option) => option.value === editingTicket.status,
            );
            setSelectedStatus(statusOption || null);

            if (editingTicket.assigned_technician && users.length > 0) {
                const technicianOption = users.find(
                    (user) =>
                        user.value ===
                        parseInt(editingTicket.assigned_technician),
                );
                setSelectedTechnician(technicianOption || null);
            } else {
                setSelectedTechnician(null);
            }
        }
    }, [editingTicket, users]);

    const isPdf = file?.type === "application/pdf";
    const isExistingPdf = existingImageUrl?.endsWith(".pdf");

    const setNewFile = (incoming) => {
        setDragError("");
        if (!incoming) return;
        if (!ACCEPTED_TYPES.includes(incoming.type)) {
            setDragError("Only PNG, JPG, WEBP, or PDF files are accepted.");
            return;
        }
        if (incoming.size > 5 * 1024 * 1024) {
            setDragError("File must be under 5 MB.");
            return;
        }
        setFile(incoming);
    };

    const removeFile = () => {
        setFile(null);
        setDragError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) setNewFile(dropped);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        Object.keys(ticketForm).forEach((key) => {
            const value = ticketForm[key];
            if (value !== null && value !== undefined && value !== "") {
                formData.append(key, value);
            }
        });
        if (file) formData.append("image", file);

        try {
            setSubmitting(true);
            await toast.promise(handleUpdate(formData, editingTicket.id), {
                loading: "Updating ticket...",
                success: () => {
                    setShowForm(false);
                    setEditingTicket(null);
                    return "Ticket updated successfully!";
                },
                error: (err) => {
                    if (err.response?.data?.errors) {
                        setErrors(err.response.data.errors);
                    }
                    return (
                        err.response?.data?.message ||
                        "Failed to update ticket."
                    );
                },
            });
        } catch (error) {
            // errors already handled inside toast.promise
        } finally {
            setSubmitting(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!ticketForm.client_name?.trim())
            newErrors.client_name = "Client name is required";
        if (!ticketForm.issue_type?.trim())
            newErrors.issue_type = "Issue type is required";
        if (!ticketForm.device_type?.trim())
            newErrors.device_type = "Device type is required";
        if (!ticketForm.priority) newErrors.priority = "Priority is required";
        if (!ticketForm.status) newErrors.status = "Status is required";
        if (!ticketForm.problem_description?.trim())
            newErrors.problem_description = "Problem description is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicketForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handlePriorityChange = (selectedOption) => {
        setSelectedPriority(selectedOption);
        setTicketForm((prev) => ({
            ...prev,
            priority: selectedOption ? selectedOption.value : "",
        }));
        if (errors.priority) setErrors((prev) => ({ ...prev, priority: null }));
    };

    const handleStatusChange = (selectedOption) => {
        setSelectedStatus(selectedOption);
        setTicketForm((prev) => ({
            ...prev,
            status: selectedOption ? selectedOption.value : "",
        }));
        if (errors.status) setErrors((prev) => ({ ...prev, status: null }));
    };

    const handleTechnicianChange = (selectedOption) => {
        setSelectedTechnician(selectedOption);
        setTicketForm((prev) => ({
            ...prev,
            assigned_technician: selectedOption ? selectedOption.value : "",
        }));
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingTicket(null);
        setTicketForm({});
        setSelectedPriority(null);
        setSelectedStatus(null);
        setSelectedTechnician(null);
        setErrors({});
        setFile(null);
        setExistingImageUrl(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-2xl font-bold text-stone-800">
                            Edit Ticket
                        </h2>
                        {editingTicket?.ticket_id && (
                            <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                ID: {editingTicket.ticket_id}
                            </span>
                        )}
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
                        {/* Client Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="client_name"
                                value={ticketForm.client_name || ""}
                                onChange={handleChange}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.client_name ? "border-red-500" : "border-gray-300"}`}
                                placeholder="John Doe"
                                disabled={submitting}
                            />
                            {errors.client_name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.client_name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={ticketForm.email || ""}
                                onChange={handleChange}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                placeholder="client@example.com"
                                disabled={submitting}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Issue Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="issue_type"
                                value={ticketForm.issue_type || ""}
                                onChange={handleChange}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.issue_type ? "border-red-500" : "border-gray-300"}`}
                                placeholder="Hardware / Software / Network"
                                disabled={submitting}
                            />
                            {errors.issue_type && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.issue_type}
                                </p>
                            )}
                        </div>

                        {/* Device Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="device_type"
                                value={ticketForm.device_type || ""}
                                onChange={handleChange}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.device_type ? "border-red-500" : "border-gray-300"}`}
                                placeholder="Subject"
                                disabled={submitting}
                            />
                            {errors.device_type && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.device_type}
                                </p>
                            )}
                        </div>

                        {/* Priority */}
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
                                menuPortalTarget={menuPortalTarget}
                                menuPosition="fixed"
                                error={errors.priority}
                            />
                            {errors.priority && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.priority}
                                </p>
                            )}
                        </div>

                        {/* Status */}
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
                                menuPortalTarget={menuPortalTarget}
                                menuPosition="fixed"
                                error={errors.status}
                            />
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Assigned Technician */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assigned Technician
                            </label>
                            <Select
                                name="assigned_technician"
                                value={selectedTechnician}
                                onChange={handleTechnicianChange}
                                options={users}
                                isLoading={loadingUsers}
                                isDisabled={submitting || loadingUsers}
                                placeholder={
                                    loadingUsers
                                        ? "Loading users..."
                                        : "Select a technician"
                                }
                                isClearable
                                isSearchable
                                styles={customSelectStyles}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                noOptionsMessage={() => "No users found"}
                                menuPortalTarget={menuPortalTarget}
                                menuPosition="fixed"
                            />
                            {users.length === 0 && !loadingUsers && (
                                <p className="text-xs text-amber-600 mt-1">
                                    No users found. Please add users first.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Problem Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Problem Description{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="problem_description"
                            value={ticketForm.problem_description || ""}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.problem_description ? "border-red-500" : "border-gray-300"}`}
                            placeholder="Describe the issue in detail..."
                            disabled={submitting}
                        />
                        {errors.problem_description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.problem_description}
                            </p>
                        )}
                    </div>

                    {/* Attachment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attachment
                        </label>

                        {/* Show existing image if no new file selected */}
                        {existingImageUrl && !file && (
                            <div className="mb-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-indigo-50">
                                    {isExistingPdf ? (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#dc2626"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#6366f1"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="2"
                                                ry="2"
                                            />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-gray-600 text-xs font-medium leading-tight">
                                        Current attachment
                                    </p>
                                    <a
                                        href={buildImageUrl(existingImageUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline text-xs truncate block"
                                    >
                                        View file
                                    </a>
                                </div>
                                <span className="text-xs text-gray-400 shrink-0">
                                    Upload below to replace
                                </span>
                            </div>
                        )}

                        {!file ? (
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 text-center py-8 px-4"
                                style={{
                                    borderColor: dragError
                                        ? "#f87171"
                                        : dragging
                                          ? "#6366f1"
                                          : "#e5e7eb",
                                    background: dragError
                                        ? "rgba(248,113,113,0.04)"
                                        : dragging
                                          ? "rgba(99,102,241,0.04)"
                                          : "rgba(249,250,251,0.5)",
                                }}
                            >
                                <div className="flex flex-col items-center gap-2 pointer-events-none select-none">
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-gray-300"
                                    >
                                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                                        <path d="M12 12v9" />
                                        <path d="m16 16-4-4-4 4" />
                                    </svg>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold text-indigo-600">
                                            Click to upload
                                        </span>{" "}
                                        or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        PNG, JPG, WEBP or PDF — up to 5 MB
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept={ACCEPTED_EXTENSIONS}
                                    onChange={(e) => {
                                        if (e.target.files[0])
                                            setNewFile(e.target.files[0]);
                                        e.target.value = "";
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50/50 px-4 py-3 text-sm">
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                    style={{
                                        background: isPdf
                                            ? "rgba(220,38,38,0.08)"
                                            : "rgba(99,102,241,0.08)",
                                    }}
                                >
                                    {isPdf ? (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#dc2626"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#6366f1"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="2"
                                                ry="2"
                                            />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-gray-800 font-medium leading-tight">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {isPdf ? "PDF document" : "Image"} ·{" "}
                                        {(file.size / 1024).toFixed(0)} KB
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
                                >
                                    Replace
                                </button>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                                >
                                    <X size={14} />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept={ACCEPTED_EXTENSIONS}
                                    onChange={(e) => {
                                        if (e.target.files[0])
                                            setNewFile(e.target.files[0]);
                                        e.target.value = "";
                                    }}
                                />
                            </div>
                        )}

                        {dragError && (
                            <p className="text-xs text-red-500 mt-1.5 font-medium">
                                {dragError}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
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
                            disabled={submitting || loadingUsers}
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
                                <span>Update Ticket</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTicketForm;
