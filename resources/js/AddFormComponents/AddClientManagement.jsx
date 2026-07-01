// import React, { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import axios from "axios";
// import Select from "react-select";

// const AddClientManagement = ({
//     reloadTrigger,
//     setReloadTrigger,
//     setShowForm,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [allLeads, setAllLeads] = useState([]);
//     const [selectedLead, setSelectedLead] = useState(null);
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);
//     const [leadError, setLeadError] = useState("");
//     const [clientForm, setClientForm] = useState({
//         lead_id: "",
//         company_name: "",
//         contact_person: "",
//         phone: "",
//         email: "",
//         address: "",
//         service_type: "",
//         account_manager: "",
//         total_projects: "",
//         total_revenue: "",
//         payment_status: "",
//     });

//     const paymentStatusOptions = [
//         { value: "Paid", label: "Paid" },
//         { value: "Pending", label: "Pending" },
//         { value: "Overdue", label: "Overdue" },
//         { value: "Partial", label: "Partial" },
//     ];

//     // Fetch won leads
//     useEffect(() => {
//         const fetchLeads = async () => {
//             try {
//                 const response = await axios.get(route("ourleads.index"));
//                 const wonLeads = (response.data.data ?? []).filter(
//                     (lead) => lead.status && lead.status.toLowerCase() === "won"
//                 );
//                 setAllLeads(wonLeads);
//             } catch (error) {
//                 console.error("Fetching leads error:", error);
//             }
//         };
//         fetchLeads();
//     }, [reloadTrigger]);

//     const buildOption = (lead) => ({
//         value: lead.id,
//         label: lead.client_name,
//         company_name: lead.company_name || "",
//         phone: lead.phone || "",
//         email: lead.email || "",
//     });

//     const leadOptions = allLeads.map(buildOption);

//     const companyOptions =
//         selectedLead && selectedLead.company_name
//             ? [{ value: selectedLead.company_name, label: selectedLead.company_name }]
//             : [];

//     const resetForm = () => {
//         setClientForm({
//             lead_id: "",
//             company_name: "",
//             contact_person: "",
//             phone: "",
//             email: "",
//             address: "",
//             service_type: "",
//             account_manager: "",
//             total_projects: "",
//             total_revenue: "",
//             payment_status: "",
//         });
//         setSelectedLead(null);
//         setSelectedCompany(null);
//         setSelectedPaymentStatus(null);
//         setLeadError("");
//     };

//     const filterOption = (option, inputValue) => {
//         if (!inputValue) return true;
//         const search = inputValue.toLowerCase();
//         return (
//             option.label?.toLowerCase().includes(search) ||
//             option.data?.company_name?.toLowerCase().includes(search)
//         );
//     };

//     const handleLeadChange = (option) => {
//         setSelectedLead(option);
//         setLeadError("");
//         if (option) {
//             setSelectedCompany(null);
//             setClientForm((prev) => ({ ...prev, lead_id: option.value, company_name: "" }));
//         } else {
//             setSelectedCompany(null);
//             setClientForm((prev) => ({ ...prev, lead_id: "", company_name: "" }));
//         }
//     };

//     const handleCompanyChange = (option) => {
//         setSelectedCompany(option);
//         setClientForm((prev) => ({ ...prev, company_name: option ? option.value : "" }));
//     };

//     const handlePaymentStatusChange = (option) => {
//         setSelectedPaymentStatus(option);
//         setClientForm((prev) => ({ ...prev, payment_status: option ? option.value : "" }));
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setClientForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!selectedLead) {
//             setLeadError("Please select a lead.");
//             return;
//         }

//         const formData = new FormData();
//         for (const key in clientForm) {
//             if (clientForm[key] !== null && clientForm[key] !== "") {
//                 formData.append(key, clientForm[key]);
//             }
//         }

//         try {
//             setSubmitting(true);
//             await axios.post(route("ourclientmanagement.store"), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//             resetForm();
//             setShowForm(false);
//         } catch (error) {
//             console.error("Error creating client:", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleClose = () => {
//         resetForm();
//         setShowForm(false);
//     };

//     const selectStyles = (hasError = false) => ({
//         control: (base, state) => ({
//             ...base,
//             borderColor: hasError ? "#ef4444" : state.isFocused ? "#6366f1" : "#e5e7eb",
//             borderRadius: "0.5rem",
//             boxShadow: state.isFocused
//                 ? hasError ? "0 0 0 2px rgba(239,68,68,0.2)" : "0 0 0 2px rgba(99,102,241,0.25)"
//                 : "none",
//             fontSize: "0.875rem",
//             minHeight: "38px",
//             backgroundColor: "white",
//             "&:hover": { borderColor: hasError ? "#ef4444" : "#6366f1" },
//         }),
//         option: (base, state) => ({
//             ...base,
//             backgroundColor: state.isSelected ? "#6366f1" : state.isFocused ? "#eef2ff" : "white",
//             color: state.isSelected ? "white" : "#1c1917",
//             fontSize: "0.875rem",
//             cursor: "pointer",
//             paddingTop: "8px",
//             paddingBottom: "8px",
//         }),
//         singleValue: (base) => ({ ...base, color: "#1c1917", fontSize: "0.875rem" }),
//         placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "0.875rem" }),
//         menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//         menu: (base) => ({
//             ...base,
//             borderRadius: "0.5rem",
//             boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
//         }),
//         clearIndicator: (base) => ({ ...base, color: "#9ca3af", padding: "0 6px", "&:hover": { color: "#ef4444" }, cursor: "pointer" }),
//         dropdownIndicator: (base) => ({ ...base, color: "#9ca3af", padding: "0 8px", "&:hover": { color: "#6366f1" } }),
//         indicatorSeparator: (base) => ({ ...base, backgroundColor: "#e5e7eb" }),
//         input: (base) => ({ ...base, color: "#1c1917" }),
//     });

//     const formatLeadOptionLabel = ({ label }) => (
//         <div className="py-0.5">
//             <div className="font-medium text-stone-800 text-sm">{label}</div>
//         </div>
//     );

//     const inputClass =
//         "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition";
//     const labelClass =
//         "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6 pb-4 border-b sticky top-0 bg-white z-10">
//                     <h2 className="text-2xl font-bold text-stone-800">Add New Client</h2>
//                     <button type="button" onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition">
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Select Lead *</label>
//                             <Select
//                                 options={leadOptions}
//                                 value={selectedLead}
//                                 onChange={handleLeadChange}
//                                 formatOptionLabel={formatLeadOptionLabel}
//                                 filterOption={filterOption}
//                                 styles={selectStyles(!!leadError)}
//                                 placeholder="Search by name or company..."
//                                 isClearable
//                                 isSearchable
//                                 noOptionsMessage={() => "No leads found"}
//                                 menuPortal={document.body}
//                                 menuPosition="fixed"
//                             />
//                             {leadError && <p className="mt-1 text-xs text-red-500">{leadError}</p>}
//                         </div>
//                         <div>
//                             <label className={labelClass}>Company Name</label>
//                             <Select
//                                 options={companyOptions}
//                                 value={selectedCompany}
//                                 onChange={handleCompanyChange}
//                                 styles={selectStyles()}
//                                 placeholder={selectedLead ? "Select company..." : "Select a lead first..."}
//                                 isClearable
//                                 isSearchable
//                                 isDisabled={!selectedLead}
//                                 noOptionsMessage={() => "No company affiliated to this lead"}
//                                 menuPortal={document.body}
//                                 menuPosition="fixed"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Contact Person</label>
//                             <input type="text" name="contact_person" value={clientForm.contact_person} onChange={handleChange} placeholder="Contact person" className={inputClass} />
//                         </div>
//                         <div>
//                             <label className={labelClass}>Phone</label>
//                             <input type="text" name="phone" value={clientForm.phone} onChange={handleChange} placeholder="Phone number" className={inputClass} />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Email</label>
//                             <input type="email" name="email" value={clientForm.email} onChange={handleChange} placeholder="Email address" className={inputClass} />
//                         </div>
//                         <div>
//                             <label className={labelClass}>Address</label>
//                             <input type="text" name="address" value={clientForm.address} onChange={handleChange} placeholder="Full address" className={inputClass} />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Service Type</label>
//                             <input type="text" name="service_type" value={clientForm.service_type} onChange={handleChange} placeholder="e.g. Web Development" className={inputClass} />
//                         </div>
//                         <div>
//                             <label className={labelClass}>Account Manager</label>
//                             <input type="text" name="account_manager" value={clientForm.account_manager} onChange={handleChange} placeholder="Manager name" className={inputClass} />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Total Projects</label>
//                             <input type="number" name="total_projects" value={clientForm.total_projects} onChange={handleChange} placeholder="0" min="0" className={inputClass} />
//                         </div>
//                         <div>
//                             <label className={labelClass}>Total Revenue</label>
//                             <input type="number" name="total_revenue" value={clientForm.total_revenue} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className={inputClass} />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Payment Status</label>
//                             <Select
//                                 options={paymentStatusOptions}
//                                 value={selectedPaymentStatus}
//                                 onChange={handlePaymentStatusChange}
//                                 styles={selectStyles()}
//                                 placeholder="-- Select Status --"
//                                 isClearable
//                                 isSearchable={false}
//                                 menuPortal={document.body}
//                                 menuPosition="fixed"
//                             />
//                         </div>
//                         <div />
//                     </div>

//                     <div className="flex justify-end gap-3 pt-4 border-t">
//                         <button type="button" onClick={handleClose} className="px-5 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
//                             Cancel
//                         </button>
//                         <button type="submit" disabled={submitting} className="px-6 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
//                             {submitting ? "Saving..." : "Create Client"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddClientManagement;

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import Select from "react-select";

const AddClientManagement = ({
    reloadTrigger,
    setReloadTrigger,
    setShowForm,
    onStoreSuccess,
    onStoreError,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [allLeads, setAllLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);
    const [leadError, setLeadError] = useState("");
    const [clientForm, setClientForm] = useState({
        lead_id: "",
        company_name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        service_type: "",
        account_manager: "",
        total_projects: "",
        total_revenue: "",
        payment_status: "",
    });

    const paymentStatusOptions = [
        { value: "paid", label: "Paid" },
        { value: "pending", label: "Pending" },
        { value: "overdue", label: "Overdue" },
        { value: "partial", label: "Partial" },
    ];

    // Fetch won leads
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await axios.get(route("ourleads.index"));
                const wonLeads = (response.data.data ?? []).filter(
                    (lead) => lead.status && lead.status.toLowerCase() === "won"
                );
                setAllLeads(wonLeads);
            } catch (error) {
                console.error("Fetching leads error:", error);
            }
        };
        fetchLeads();
    }, [reloadTrigger]);

    const buildOption = (lead) => ({
        value: lead.id,
        label: lead.client_name,
        company_name: lead.company_name || "",
        phone: lead.phone || "",
        email: lead.email || "",
    });

    const leadOptions = allLeads.map(buildOption);

    const companyOptions =
        selectedLead && selectedLead.company_name
            ? [{ value: selectedLead.company_name, label: selectedLead.company_name }]
            : [];

    const resetForm = () => {
        setClientForm({
            lead_id: "",
            company_name: "",
            contact_person: "",
            phone: "",
            email: "",
            address: "",
            service_type: "",
            account_manager: "",
            total_projects: "",
            total_revenue: "",
            payment_status: "",
        });
        setSelectedLead(null);
        setSelectedCompany(null);
        setSelectedPaymentStatus(null);
        setLeadError("");
    };

    const filterOption = (option, inputValue) => {
        if (!inputValue) return true;
        const search = inputValue.toLowerCase();
        return (
            option.label?.toLowerCase().includes(search) ||
            option.data?.company_name?.toLowerCase().includes(search)
        );
    };

    const handleLeadChange = (option) => {
        setSelectedLead(option);
        setLeadError("");
        if (option) {
            setSelectedCompany(null);
            setClientForm((prev) => ({ ...prev, lead_id: option.value, company_name: "" }));
        } else {
            setSelectedCompany(null);
            setClientForm((prev) => ({ ...prev, lead_id: "", company_name: "" }));
        }
    };

    const handleCompanyChange = (option) => {
        setSelectedCompany(option);
        setClientForm((prev) => ({ ...prev, company_name: option ? option.value : "" }));
    };

    const handlePaymentStatusChange = (option) => {
        setSelectedPaymentStatus(option);
        setClientForm((prev) => ({ ...prev, payment_status: option ? option.value : "" }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedLead) {
            setLeadError("Please select a lead.");
            return;
        }

        const formData = new FormData();
        for (const key in clientForm) {
            if (clientForm[key] !== null && clientForm[key] !== "") {
                formData.append(key, clientForm[key]);
            }
        }

        try {
            setSubmitting(true);
            await axios.post(route("ourclientmanagement.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            // Notify parent — parent fires toast + reloadTrigger
            onStoreSuccess?.();
            resetForm();
            setShowForm(false);
        } catch (error) {
            console.error("Error creating client:", error);
            onStoreError?.();
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        resetForm();
        setShowForm(false);
    };

    const selectStyles = (hasError = false) => ({
        control: (base, state) => ({
            ...base,
            borderColor: hasError ? "#ef4444" : state.isFocused ? "#6366f1" : "#e5e7eb",
            borderRadius: "0.5rem",
            boxShadow: state.isFocused
                ? hasError ? "0 0 0 2px rgba(239,68,68,0.2)" : "0 0 0 2px rgba(99,102,241,0.25)"
                : "none",
            fontSize: "0.875rem",
            minHeight: "38px",
            backgroundColor: "white",
            "&:hover": { borderColor: hasError ? "#ef4444" : "#6366f1" },
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#6366f1" : state.isFocused ? "#eef2ff" : "white",
            color: state.isSelected ? "white" : "#1c1917",
            fontSize: "0.875rem",
            cursor: "pointer",
            paddingTop: "8px",
            paddingBottom: "8px",
        }),
        singleValue: (base) => ({ ...base, color: "#1c1917", fontSize: "0.875rem" }),
        placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "0.875rem" }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        menu: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        }),
        clearIndicator: (base) => ({ ...base, color: "#9ca3af", padding: "0 6px", "&:hover": { color: "#ef4444" }, cursor: "pointer" }),
        dropdownIndicator: (base) => ({ ...base, color: "#9ca3af", padding: "0 8px", "&:hover": { color: "#6366f1" } }),
        indicatorSeparator: (base) => ({ ...base, backgroundColor: "#e5e7eb" }),
        input: (base) => ({ ...base, color: "#1c1917" }),
    });

    const formatLeadOptionLabel = ({ label }) => (
        <div className="py-0.5">
            <div className="font-medium text-stone-800 text-sm">{label}</div>
        </div>
    );

    const inputClass =
        "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition";
    const labelClass =
        "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-stone-800">Add New Client</h2>
                    <button type="button" onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Select Lead <span className="text-red-500">*</span></label>
                            <Select
                                options={leadOptions}
                                value={selectedLead}
                                onChange={handleLeadChange}
                                formatOptionLabel={formatLeadOptionLabel}
                                filterOption={filterOption}
                                styles={selectStyles(!!leadError)}
                                placeholder="Search by name or company..."
                                isClearable
                                isSearchable
                                noOptionsMessage={() => "No leads found"}
                                menuPortal={document.body}
                                menuPosition="fixed"
                            />
                            {leadError && <p className="mt-1 text-xs text-red-500">{leadError}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Company Name <span className="text-red-500">*</span></label>
                            <Select
                                options={companyOptions}
                                value={selectedCompany}
                                onChange={handleCompanyChange}
                                styles={selectStyles()}
                                placeholder={selectedLead ? "Select company..." : "Select a lead first..."}
                                isClearable
                                isSearchable
                                isDisabled={!selectedLead}
                                noOptionsMessage={() => "No company affiliated to this lead"}
                                menuPortal={document.body}
                                menuPosition="fixed"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Contact Person <span className="text-red-500">*</span></label>
                            <input type="text" name="contact_person" value={clientForm.contact_person} onChange={handleChange} placeholder="Contact person" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Phone <span className="text-red-500">*</span></label>
                            <input type="text" name="phone" value={clientForm.phone} onChange={handleChange} placeholder="Phone number" className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                            <input type="email" name="email" value={clientForm.email} onChange={handleChange} placeholder="Email address" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Address</label>
                            <input type="text" name="address" value={clientForm.address} onChange={handleChange} placeholder="Full address" className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Service Type <span className="text-red-500">*</span></label>
                            <input type="text" name="service_type" value={clientForm.service_type} onChange={handleChange} placeholder="e.g. Web Development" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Account Manager <span className="text-red-500">*</span></label>
                            <input type="text" name="account_manager" value={clientForm.account_manager} onChange={handleChange} placeholder="Manager name" className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Total Projects</label>
                            <input type="number" name="total_projects" value={clientForm.total_projects} onChange={handleChange} placeholder="0" min="0" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Total Revenue</label>
                            <input type="number" name="total_revenue" value={clientForm.total_revenue} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Payment Status</label>
                            <Select
                                options={paymentStatusOptions}
                                value={selectedPaymentStatus}
                                onChange={handlePaymentStatusChange}
                                styles={selectStyles()}
                                placeholder="-- Select Status --"
                                isClearable
                                isSearchable={false}
                                menuPortal={document.body}
                                menuPosition="fixed"
                            />
                        </div>
                        <div />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={handleClose} className="px-5 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} className="px-6 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
                            {submitting ? "Saving..." : "Create Client"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClientManagement;


// import React, { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import axios from "axios";
// import Select from "react-select";

// const AddClientManagement = ({
//     reloadTrigger,
//     setReloadTrigger,
//     editingClient,
//     setEditingClient,
//     setShowForm,
//     handleUpdate,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [allLeads, setAllLeads] = useState([]);
//     const [selectedLead, setSelectedLead] = useState(null);
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);
//     const [leadError, setLeadError] = useState("");
//     const [clientForm, setClientForm] = useState({
//         lead_id: "",
//         company_name: "",
//         contact_person: "",
//         phone: "",
//         email: "",
//         address: "",
//         service_type: "",
//         account_manager: "",
//         total_projects: "",
//         total_revenue: "",
//         payment_status: "",
//     });

//     // Payment status options
//     const paymentStatusOptions = [
//         { value: "Paid", label: "Paid" },
//         { value: "Pending", label: "Pending" },
//         { value: "Overdue", label: "Overdue" },
//         { value: "Partial", label: "Partial" },
//     ];

//     // Populate form when editing
//     useEffect(() => {
//         if (editingClient) {
//             setClientForm({
//                 lead_id: editingClient.lead_id || "",
//                 company_name: editingClient.company_name || "",
//                 contact_person: editingClient.contact_person || "",
//                 phone: editingClient.phone || "",
//                 email: editingClient.email || "",
//                 address: editingClient.address || "",
//                 service_type: editingClient.service_type || "",
//                 account_manager: editingClient.account_manager || "",
//                 total_projects: editingClient.total_projects || "",
//                 total_revenue: editingClient.total_revenue || "",
//                 payment_status: editingClient.payment_status || "",
//             });

//             // Set payment status if it exists
//             if (editingClient.payment_status) {
//                 const statusOption = paymentStatusOptions.find(
//                     (option) => option.value === editingClient.payment_status,
//                 );
//                 setSelectedPaymentStatus(statusOption || null);
//             }
//         } else {
//             resetForm();
//         }
//     }, [editingClient]);

//     // Pre-select lead + company when editing and leads are loaded
//     useEffect(() => {
//         if (editingClient && allLeads.length > 0) {
//             const match = allLeads.find(
//                 (lead) => String(lead.id) === String(editingClient.lead_id),
//             );
//             if (match) {
//                 setSelectedLead(buildOption(match));
//                 // Pre-select the saved company_name on edit
//                 setSelectedCompany(
//                     editingClient.company_name
//                         ? {
//                               value: editingClient.company_name,
//                               label: editingClient.company_name,
//                           }
//                         : null,
//                 );
//             }
//         }
//     }, [allLeads, editingClient]);

//     // Fetch leads
//     // useEffect(() => {
//     //     const fetchLeads = async () => {
//     //         try {
//     //             const response = await axios.get(route("ourleads.index"));
//     //             setAllLeads(response.data.data ?? []);
//     //         } catch (error) {
//     //             console.error("Fetching leads error:", error);
//     //         }
//     //     };
//     //     fetchLeads();
//     // }, [reloadTrigger]);

//     // Fetch leads - only those with status "Won" (case-insensitive)
//     useEffect(() => {
//         const fetchLeads = async () => {
//             try {
//                 const response = await axios.get(route("ourleads.index"));
//                 // Filter leads to only show those with status "Won" (case-insensitive)
//                 const allLeads = response.data.data ?? [];
//                 const wonLeads = allLeads.filter(
//                     (lead) =>
//                         lead.status && lead.status.toLowerCase() === "won",
//                 );
//                 setAllLeads(wonLeads);
//             } catch (error) {
//                 console.error("Fetching leads error:", error);
//             }
//         };
//         fetchLeads();
//     }, [reloadTrigger]);

//     // Helper: build a react-select option from a lead object
//     const buildOption = (lead) => ({
//         value: lead.id,
//         label: lead.client_name,
//         company_name: lead.company_name || "",
//         phone: lead.phone || "",
//         email: lead.email || "",
//     });

//     // All lead options
//     const leadOptions = allLeads.map(buildOption);

//     // Company options — ONLY the company affiliated to the selected lead
//     const companyOptions =
//         selectedLead && selectedLead.company_name
//             ? [
//                   {
//                       value: selectedLead.company_name,
//                       label: selectedLead.company_name,
//                   },
//               ]
//             : [];

//     const resetForm = () => {
//         setClientForm({
//             lead_id: "",
//             company_name: "",
//             contact_person: "",
//             phone: "",
//             email: "",
//             address: "",
//             service_type: "",
//             account_manager: "",
//             total_projects: "",
//             total_revenue: "",
//             payment_status: "",
//         });
//         setSelectedLead(null);
//         setSelectedCompany(null);
//         setSelectedPaymentStatus(null);
//         setLeadError("");
//     };

//     // Search leads by client_name AND company_name
//     const filterOption = (option, inputValue) => {
//         if (!inputValue) return true;
//         const search = inputValue.toLowerCase();
//         return (
//             option.label?.toLowerCase().includes(search) ||
//             option.data?.company_name?.toLowerCase().includes(search)
//         );
//     };

//     // Selecting a lead only sets lead_id — company stays empty for manual selection
//     const handleLeadChange = (option) => {
//         setSelectedLead(option);
//         setLeadError("");
//         if (option) {
//             setSelectedCompany(null); // reset company; user must pick manually
//             setClientForm((prev) => ({
//                 ...prev,
//                 lead_id: option.value,
//                 company_name: "", // not auto-filled
//             }));
//         } else {
//             // Lead cleared — reset company too
//             setSelectedCompany(null);
//             setClientForm((prev) => ({
//                 ...prev,
//                 lead_id: "",
//                 company_name: "",
//             }));
//         }
//     };

//     const handleCompanyChange = (option) => {
//         setSelectedCompany(option);
//         setClientForm((prev) => ({
//             ...prev,
//             company_name: option ? option.value : "",
//         }));
//     };

//     const handlePaymentStatusChange = (option) => {
//         setSelectedPaymentStatus(option);
//         setClientForm((prev) => ({
//             ...prev,
//             payment_status: option ? option.value : "",
//         }));
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setClientForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleCreate = async (formData) => {
//         await axios.post(route("ourclientmanagement.store"), formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });
//         setReloadTrigger((prev) => !prev);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!selectedLead) {
//             setLeadError("Please select a lead.");
//             return;
//         }

//         const formData = new FormData();
//         for (const key in clientForm) {
//             if (clientForm[key] !== null && clientForm[key] !== "") {
//                 formData.append(key, clientForm[key]);
//             }
//         }

//         try {
//             setSubmitting(true);
//             if (editingClient) {
//                 await handleUpdate(formData, editingClient.id);
//             } else {
//                 await handleCreate(formData);
//             }
//             resetForm();
//             setShowForm(false);
//             setEditingClient(null);
//         } catch (error) {
//             console.error("Error saving client:", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleClose = () => {
//         resetForm();
//         setEditingClient(null);
//         setShowForm(false);
//     };

//     // Shared react-select styles — accepts optional error flag
//     const selectStyles = (hasError = false) => ({
//         control: (base, state) => ({
//             ...base,
//             borderColor: hasError
//                 ? "#ef4444"
//                 : state.isFocused
//                   ? "#6366f1"
//                   : "#e5e7eb",
//             borderRadius: "0.5rem",
//             boxShadow: state.isFocused
//                 ? hasError
//                     ? "0 0 0 2px rgba(239,68,68,0.2)"
//                     : "0 0 0 2px rgba(99,102,241,0.25)"
//                 : "none",
//             fontSize: "0.875rem",
//             minHeight: "38px",
//             backgroundColor: "white",
//             "&:hover": {
//                 borderColor: hasError ? "#ef4444" : "#6366f1",
//             },
//         }),
//         option: (base, state) => ({
//             ...base,
//             backgroundColor: state.isSelected
//                 ? "#6366f1"
//                 : state.isFocused
//                   ? "#eef2ff"
//                   : "white",
//             color: state.isSelected ? "white" : "#1c1917",
//             fontSize: "0.875rem",
//             cursor: "pointer",
//             paddingTop: "8px",
//             paddingBottom: "8px",
//         }),
//         singleValue: (base) => ({
//             ...base,
//             color: "#1c1917",
//             fontSize: "0.875rem",
//         }),
//         placeholder: (base) => ({
//             ...base,
//             color: "#9ca3af",
//             fontSize: "0.875rem",
//         }),
//         menuPortal: (base) => ({
//             ...base,
//             zIndex: 9999,
//         }),
//         menu: (base) => ({
//             ...base,
//             borderRadius: "0.5rem",
//             boxShadow:
//                 "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
//         }),
//         clearIndicator: (base) => ({
//             ...base,
//             color: "#9ca3af",
//             padding: "0 6px",
//             "&:hover": { color: "#ef4444" },
//             cursor: "pointer",
//         }),
//         dropdownIndicator: (base) => ({
//             ...base,
//             color: "#9ca3af",
//             padding: "0 8px",
//             "&:hover": { color: "#6366f1" },
//         }),
//         indicatorSeparator: (base) => ({
//             ...base,
//             backgroundColor: "#e5e7eb",
//         }),
//         input: (base) => ({
//             ...base,
//             color: "#1c1917",
//         }),
//     });

//     // Lead option: only client name, no company name
//     const formatLeadOptionLabel = ({ label }) => (
//         <div className="py-0.5">
//             <div className="font-medium text-stone-800 text-sm">{label}</div>
//         </div>
//     );

//     const inputClass =
//         "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition";
//     const labelClass =
//         "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6 pb-4 border-b sticky top-0 bg-white z-10">
//                     <h2 className="text-2xl font-bold text-stone-800">
//                         {editingClient ? "Edit Client" : "Add New Client"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Lead Selection and Company Name - Same Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Select Lead *</label>
//                             <Select
//                                 options={leadOptions}
//                                 value={selectedLead}
//                                 onChange={handleLeadChange}
//                                 formatOptionLabel={formatLeadOptionLabel}
//                                 filterOption={filterOption}
//                                 styles={selectStyles(!!leadError)}
//                                 placeholder="Search by name or company..."
//                                 isClearable
//                                 isSearchable
//                                 noOptionsMessage={() => "No leads found"}
//                                 menuPortal={document.body}
//                                 menuPosition="fixed"
//                             />
//                             {leadError && (
//                                 <p className="mt-1 text-xs text-red-500">
//                                     {leadError}
//                                 </p>
//                             )}
//                         </div>
//                         <div>
//                             <label className={labelClass}>Company Name</label>
//                             <Select
//                                 options={companyOptions}
//                                 value={selectedCompany}
//                                 onChange={handleCompanyChange}
//                                 styles={selectStyles()}
//                                 placeholder={
//                                     selectedLead
//                                         ? "Select company..."
//                                         : "Select a lead first..."
//                                 }
//                                 isClearable
//                                 isSearchable
//                                 isDisabled={!selectedLead}
//                                 noOptionsMessage={() =>
//                                     "No company affiliated to this lead"
//                                 }
//                                 menuPortal={document.body}
//                                 menuPosition="fixed"
//                             />
//                         </div>
//                     </div>

//                     {/* Contact Person and Phone - Same Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Contact Person</label>
//                             <input
//                                 type="text"
//                                 name="contact_person"
//                                 value={clientForm.contact_person}
//                                 onChange={handleChange}
//                                 placeholder="Contact person"
//                                 className={inputClass}
//                             />
//                         </div>
//                         <div>
//                             <label className={labelClass}>Phone</label>
//                             <input
//                                 type="text"
//                                 name="phone"
//                                 value={clientForm.phone}
//                                 onChange={handleChange}
//                                 placeholder="Phone number"
//                                 className={inputClass}
//                             />
//                         </div>
//                     </div>

//                     {/* Email and Address - Same Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Email</label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={clientForm.email}
//                                 onChange={handleChange}
//                                 placeholder="Email address"
//                                 className={inputClass}
//                             />
//                         </div>
//                         <div>
//                             <label className={labelClass}>Address</label>
//                             <input
//                                 type="text"
//                                 name="address"
//                                 value={clientForm.address}
//                                 onChange={handleChange}
//                                 placeholder="Full address"
//                                 className={inputClass}
//                             />
//                         </div>
//                     </div>

//                     {/* Service Type & Account Manager - Same Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Service Type</label>
//                             <input
//                                 type="text"
//                                 name="service_type"
//                                 value={clientForm.service_type}
//                                 onChange={handleChange}
//                                 placeholder="e.g. Web Development"
//                                 className={inputClass}
//                             />
//                         </div>
//                         <div>
//                             <label className={labelClass}>
//                                 Account Manager
//                             </label>
//                             <input
//                                 type="text"
//                                 name="account_manager"
//                                 value={clientForm.account_manager}
//                                 onChange={handleChange}
//                                 placeholder="Manager name"
//                                 className={inputClass}
//                             />
//                         </div>
//                     </div>

//                     {/* Total Projects & Total Revenue - Same Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Total Projects</label>
//                             <input
//                                 type="number"
//                                 name="total_projects"
//                                 value={clientForm.total_projects}
//                                 onChange={handleChange}
//                                 placeholder="0"
//                                 min="0"
//                                 className={inputClass}
//                             />
//                         </div>
//                         <div>
//                             <label className={labelClass}>Total Revenue</label>
//                             <input
//                                 type="number"
//                                 name="total_revenue"
//                                 value={clientForm.total_revenue}
//                                 onChange={handleChange}
//                                 placeholder="0.00"
//                                 min="0"
//                                 step="0.01"
//                                 className={inputClass}
//                             />
//                         </div>
//                     </div>

//                     {/* Payment Status - Now using react-select */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Payment Status</label>
//                             <Select
//                                 options={paymentStatusOptions}
//                                 value={selectedPaymentStatus}
//                                 onChange={handlePaymentStatusChange}
//                                 styles={selectStyles()}
//                                 placeholder="-- Select Status --"
//                                 isClearable
//                                 isSearchable={false}
//                                 menuPortal={document.body}
//                                 menuPosition="fixed"
//                             />
//                         </div>
//                         <div>{/* Empty div for spacing */}</div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex justify-end gap-3 pt-4 border-t">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-5 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-6 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
//                         >
//                             {submitting
//                                 ? "Saving..."
//                                 : editingClient
//                                   ? "Update Client"
//                                   : "Create Client"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddClientManagement;