import axios from "axios";
import { X } from "lucide-react";
import React, { useState } from "react";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const emptyForm = {
    client_name: "",
    company_name: "",
    phone: "",
    email: "",
    service_interested: "",
    lead_source: "",
    assigned_salesperson: "",
    next_followup_date: "",
    notes: "",
    status: "",
};

const statusOptions = [
    { value: "New", label: "New" },
    { value: "Contacted", label: "Contacted" },
    { value: "Qualified", label: "Qualified" },
    { value: "Proposal Sent", label: "Proposal Sent" },
    { value: "Negotiation", label: "Negotiation" },
    { value: "Won", label: "Won" },
    { value: "Lost", label: "Lost" },
];

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
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
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
];

const AddLeadForm = ({ setReloadTrigger, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [leadForm, setLeadForm] = useState(emptyForm);

    const handleCreate = async (formData) => {
        await axios.post(route("ourleads.store"), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setReloadTrigger((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in leadForm) {
            if (leadForm[key] !== null && leadForm[key] !== "") {
                formData.append(key, leadForm[key]);
            }
        }
        try {
            setSubmitting(true);
            await handleCreate(formData);
            toast.success("Lead created successfully!");
            setLeadForm(emptyForm);
            onClose();
        } catch (error) {
            console.error("Error creating lead:", error);
            toast.error("Failed to create lead.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setLeadForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleStatusChange = (selectedOption) => {
        setLeadForm((prev) => ({
            ...prev,
            status: selectedOption ? selectedOption.value : "",
        }));
    };

    const handleNotesChange = (content) => {
        setLeadForm((prev) => ({ ...prev, notes: content }));
    };

    const inputClass =
        "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition";
    const labelClass =
        "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider";

    const selectStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: "#e5e7eb",
            borderRadius: "0.5rem",
            padding: "0.15rem 0",
            fontSize: "0.875rem",
            "&:hover": { borderColor: "#e5e7eb" },
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: "0.875rem",
            backgroundColor: state.isSelected
                ? "#818cf8"
                : state.isFocused
                  ? "#e0e7ff"
                  : "white",
            color: state.isSelected ? "white" : "#111827",
            "&:active": { backgroundColor: "#a5b4fc" },
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: "0.5rem",
            overflow: "hidden",
        }),
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold text-stone-800">
                        Add New Lead
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                Client Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="client_name"
                                value={leadForm.client_name}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Company Name</label>
                            <input
                                type="text"
                                name="company_name"
                                value={leadForm.company_name}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Acme Corp"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={leadForm.phone}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="+977 9800000000"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={leadForm.email}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                Service Interested
                            </label>
                            <input
                                type="text"
                                name="service_interested"
                                value={leadForm.service_interested}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Web Development"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Lead Source</label>
                            <input
                                type="text"
                                name="lead_source"
                                value={leadForm.lead_source}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Referral / Facebook / etc."
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                Assigned Salesperson
                            </label>
                            <input
                                type="text"
                                name="assigned_salesperson"
                                value={leadForm.assigned_salesperson}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Jane Smith"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                Next Follow-up Date
                            </label>
                            <input
                                type="date"
                                name="next_followup_date"
                                value={leadForm.next_followup_date}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                Status <span className="text-red-500">*</span>
                            </label>
                            <Select
                                name="status"
                                value={
                                    statusOptions.find(
                                        (o) => o.value === leadForm.status,
                                    ) || null
                                }
                                onChange={handleStatusChange}
                                options={statusOptions}
                                placeholder="— Select Status —"
                                isClearable
                                styles={selectStyles}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Notes</label>
                        <div className="quill-wrapper border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-300">
                            <ReactQuill
                                theme="snow"
                                value={leadForm.notes || ""}
                                onChange={handleNotesChange}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Add formatted notes here..."
                                className="quill-editor-custom"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Saving..." : "Create Lead"}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .quill-editor-custom {
                    display: flex;
                    flex-direction: column;
                    height: 250px;
                }
                .quill-editor-custom .ql-container {
                    flex: 1;
                    overflow-y: auto;
                    font-size: 14px;
                    font-family: inherit;
                }
                .quill-editor-custom .ql-editor {
                    min-height: 200px;
                    max-height: 400px;
                    overflow-y: auto;
                }
                .quill-editor-custom .ql-toolbar {
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    border: none;
                    border-bottom: 1px solid #e5e7eb;
                    background-color: #f9fafb;
                }
                .quill-editor-custom .ql-container {
                    border: none;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }
                .quill-editor-custom .ql-editor::-webkit-scrollbar {
                    width: 8px;
                }
                .quill-editor-custom .ql-editor::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                .quill-editor-custom .ql-editor::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .quill-editor-custom .ql-editor::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};

export default AddLeadForm;
