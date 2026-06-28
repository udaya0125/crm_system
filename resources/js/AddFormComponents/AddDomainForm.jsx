// import axios from "axios";
// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import Select from "react-select";

// const EMPTY_FORM = {
//     domain_name: "",
//     client_id: "",
//     register: "",
//     purchase_date: "",
//     expiry_date: "",
//     auto_renewal_status: "",
//     dns_provider: "",
// };

// const AddDomainForm = ({ setReloadTrigger, onClose }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [domainForm, setDomainForm] = useState(EMPTY_FORM);
//     const [clients, setClients] = useState([]);
//     const [selectedClient, setSelectedClient] = useState(null);

//     useEffect(() => {
//         const fetchClients = async () => {
//             try {
//                 const response = await axios.get(route("ourclients.index"));
//                 setClients(response.data.data || response.data);
//             } catch (error) {
//                 console.error("Error fetching clients", error);
//             }
//         };
//         fetchClients();
//     }, []);

//     const clientOptions = clients.map((client) => ({
//         value: client.id,
//         label: client.organization_name || client.name,
//     }));

//     const customSelectStyles = {
//         control: (provided, state) => ({
//             ...provided,
//             minHeight: "42px",
//             borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
//             boxShadow: state.isFocused ? "0 0 0 2px rgba(99, 102, 241, 0.2)" : "none",
//             "&:hover": { borderColor: "#6366f1" },
//         }),
//         option: (provided, state) => ({
//             ...provided,
//             backgroundColor: state.isSelected
//                 ? "#6366f1"
//                 : state.isFocused
//                 ? "#e0e7ff"
//                 : "white",
//             color: state.isSelected ? "white" : "#111827",
//             cursor: "pointer",
//             "&:active": { backgroundColor: "#4f46e5" },
//         }),
//         placeholder: (provided) => ({
//             ...provided,
//             color: "#9ca3af",
//         }),
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setDomainForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleClientChange = (selectedOption) => {
//         setSelectedClient(selectedOption);
//         setDomainForm((prev) => ({
//             ...prev,
//             client_id: selectedOption ? selectedOption.value : "",
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         for (const key in domainForm) {
//             if (domainForm[key] !== null && domainForm[key] !== "") {
//                 formData.append(key, domainForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);
//             await axios.post(route("ourdomains.store"), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//             onClose();
//         } catch (error) {
//             console.log("Error creating domain", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const inputClass =
//         "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";
//     const labelClass = "block text-sm font-medium text-gray-700 mb-1";

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">

//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6 pb-4 border-b">
//                     <h2 className="text-2xl font-bold text-stone-800">Add New Domain</h2>
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-4">

//                     <div>
//                         <label className={labelClass}>
//                             Client <span className="text-red-500">*</span>
//                         </label>
//                         <Select
//                             name="client_id"
//                             value={selectedClient}
//                             onChange={handleClientChange}
//                             options={clientOptions}
//                             placeholder="Select Client"
//                             isDisabled={submitting}
//                             isClearable
//                             isSearchable
//                             styles={customSelectStyles}
//                             className="react-select-container"
//                             classNamePrefix="react-select"
//                             noOptionsMessage={() => "No clients found"}
//                         />
//                     </div>

//                     <div>
//                         <label className={labelClass}>Domain Name *</label>
//                         <input
//                             type="text"
//                             name="domain_name"
//                             value={domainForm.domain_name}
//                             onChange={handleChange}
//                             placeholder="e.g. example.com"
//                             className={inputClass}
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className={labelClass}>Registrar *</label>
//                         <input
//                             type="text"
//                             name="register"
//                             value={domainForm.register}
//                             onChange={handleChange}
//                             placeholder="e.g. GoDaddy, Namecheap"
//                             className={inputClass}
//                             required
//                         />
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>Purchase Date *</label>
//                             <input
//                                 type="date"
//                                 name="purchase_date"
//                                 value={domainForm.purchase_date}
//                                 onChange={handleChange}
//                                 className={inputClass}
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className={labelClass}>Expiry Date *</label>
//                             <input
//                                 type="date"
//                                 name="expiry_date"
//                                 value={domainForm.expiry_date}
//                                 onChange={handleChange}
//                                 className={inputClass}
//                                 required
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className={labelClass}>Auto Renewal Status *</label>
//                         <select
//                             name="auto_renewal_status"
//                             value={domainForm.auto_renewal_status}
//                             onChange={handleChange}
//                             className={inputClass}
//                             required
//                         >
//                             <option value="">Select status</option>
//                             <option value="active">Active</option>
//                             <option value="inactive">Inactive</option>
//                         </select>
//                     </div>

//                     <div>
//                         <label className={labelClass}>DNS Provider</label>
//                         <input
//                             type="text"
//                             name="dns_provider"
//                             value={domainForm.dns_provider}
//                             onChange={handleChange}
//                             placeholder="e.g. Cloudflare"
//                             className={inputClass}
//                         />
//                     </div>

//                     {/* Actions */}
//                     <div className="flex justify-end gap-3 pt-4">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-50 transition"
//                             disabled={submitting}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-6 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium tracking-wide hover:bg-indigo-700 disabled:opacity-60 transition"
//                         >
//                             {submitting ? "Saving..." : "Create Domain"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddDomainForm;


import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";

const EMPTY_FORM = {
    domain_name: "",
    client_id: "",
    register: "",
    purchase_date: "",
    expiry_date: "",
    auto_renewal_status: "",
    dns_provider: "",
};

const AddDomainForm = ({ setReloadTrigger, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [domainForm, setDomainForm] = useState(EMPTY_FORM);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

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

    const clientOptions = clients.map((client) => ({
        value: client.id,
        label: client.organization_name || client.name,
    }));

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: "42px",
            borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
            boxShadow: state.isFocused ? "0 0 0 2px rgba(99, 102, 241, 0.2)" : "none",
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
        placeholder: (provided) => ({
            ...provided,
            color: "#9ca3af",
        }),
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDomainForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleClientChange = (selectedOption) => {
        setSelectedClient(selectedOption);
        setDomainForm((prev) => ({
            ...prev,
            client_id: selectedOption ? selectedOption.value : "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in domainForm) {
            if (domainForm[key] !== null && domainForm[key] !== "") {
                formData.append(key, domainForm[key]);
            }
        }

        setSubmitting(true);
        try {
            await axios.post(route("ourdomains.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Domain created successfully!");
            setReloadTrigger((prev) => !prev);
            onClose();
        } catch (error) {
            console.log("Error creating domain", error);
            toast.error("Failed to create domain.");
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass =
        "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold text-stone-800">Add New Domain</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className={labelClass}>
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
                    </div>

                    <div>
                        <label className={labelClass}>Domain Name *</label>
                        <input
                            type="text"
                            name="domain_name"
                            value={domainForm.domain_name}
                            onChange={handleChange}
                            placeholder="e.g. example.com"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Registrar *</label>
                        <input
                            type="text"
                            name="register"
                            value={domainForm.register}
                            onChange={handleChange}
                            placeholder="e.g. GoDaddy, Namecheap"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Purchase Date *</label>
                            <input
                                type="date"
                                name="purchase_date"
                                value={domainForm.purchase_date}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Expiry Date *</label>
                            <input
                                type="date"
                                name="expiry_date"
                                value={domainForm.expiry_date}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Auto Renewal Status *</label>
                        <select
                            name="auto_renewal_status"
                            value={domainForm.auto_renewal_status}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        >
                            <option value="">Select status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>DNS Provider</label>
                        <input
                            type="text"
                            name="dns_provider"
                            value={domainForm.dns_provider}
                            onChange={handleChange}
                            placeholder="e.g. Cloudflare"
                            className={inputClass}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-50 transition"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium tracking-wide hover:bg-indigo-700 disabled:opacity-60 transition"
                        >
                            {submitting ? "Saving..." : "Create Domain"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDomainForm;
