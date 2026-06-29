import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const generateClientCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
};

const AddClientForm = ({ handleCreate, onSuccess, onCancel }) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [clientForm, setClientForm] = useState({
        type: "",
        name: "",
        branchname: "",
        code: generateClientCode(),
        pannumber: "",
        country: "",
        state: "",
        city: "",
        street: "",
        telone: "",
        teltwo: "",
        mobile: "",
        email: "",
        website: "",
        activestatus: "yes",
        ledgername: "",
    });

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

    const validateForm = () => {
        const newErrors = {};

        if (!clientForm.name.trim()) {
            newErrors.name = "Client name is required";
        }

        if (
            clientForm.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.email)
        ) {
            newErrors.email = "Please enter a valid email address";
        }

        if (clientForm.telone && !/^[\d\s\-+()]+$/.test(clientForm.telone)) {
            newErrors.telone = "Please enter a valid phone number";
        }

        if (clientForm.mobile && !/^[\d\s\-+()]+$/.test(clientForm.mobile)) {
            newErrors.mobile = "Please enter a valid mobile number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!validateForm()) return;

    //     const formData = new FormData();
    //     for (const key in clientForm) {
    //         if (clientForm[key] !== null && clientForm[key] !== "") {
    //             formData.append(key, clientForm[key]);
    //         }
    //     }

    //     try {
    //         setSubmitting(true);
    //         await handleCreate(formData);
    //         alert("Client created successfully!");
    //         if (onSuccess) onSuccess();
    //     } catch (error) {
    //         console.log("Error saving data", error);
    //         if (error.response && error.response.data.errors) {
    //             setErrors(error.response.data.errors);
    //         } else {
    //             alert("Error saving client. Please try again.");
    //         }
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        for (const key in clientForm) {
            if (clientForm[key] !== null && clientForm[key] !== "") {
                formData.append(key, clientForm[key]);
            }
        }

        try {
            setSubmitting(true);
            await toast.promise(handleCreate(formData), {
                loading: "Creating client...",
                success: "Client created successfully!",
                error: (err) => {
                    if (err.response?.data?.errors) {
                        setErrors(err.response.data.errors);
                    }
                    return "Failed to create client.";
                },
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            // errors already handled inside toast.promise
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const inputClass = (field) =>
        `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors[field] ? "border-red-500" : "border-gray-300"
        }`;

    return (
        <div className="p-6 text-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Client</h2>
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    type="button"
                    disabled={submitting}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1 - Name and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={clientForm.name}
                            onChange={handleChange}
                            className={inputClass("name")}
                            placeholder="Enter client name"
                            disabled={submitting}
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="type"
                            value={clientForm.type}
                            onChange={handleChange}
                            className={inputClass("type")}
                            placeholder="e.g. Individual, Company"
                            disabled={submitting}
                        />
                    </div>
                </div>

                {/* Row 2 - Branch Name only */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Name
                    </label>
                    <input
                        type="text"
                        name="branchname"
                        value={clientForm.branchname}
                        onChange={handleChange}
                        className={inputClass("branchname")}
                        placeholder="Enter branch name"
                        disabled={submitting}
                    />
                </div>

                {/* Row 3 - PAN Number and Ledger Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PAN Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="pannumber"
                            value={clientForm.pannumber}
                            onChange={handleChange}
                            className={inputClass("pannumber")}
                            placeholder="Enter PAN number"
                            disabled={submitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ledger Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="ledgername"
                            value={clientForm.ledgername}
                            onChange={handleChange}
                            className={inputClass("ledgername")}
                            placeholder="Enter ledger name"
                            disabled={submitting}
                        />
                    </div>
                </div>

                {/* Row 4 - Country, State, City */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={clientForm.country}
                            onChange={handleChange}
                            className={inputClass("country")}
                            placeholder="Country"
                            disabled={submitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={clientForm.state}
                            onChange={handleChange}
                            className={inputClass("state")}
                            placeholder="State"
                            disabled={submitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={clientForm.city}
                            onChange={handleChange}
                            className={inputClass("city")}
                            placeholder="City"
                            disabled={submitting}
                        />
                    </div>
                </div>

                {/* Row 5 - Street */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                    </label>
                    <input
                        type="text"
                        name="street"
                        value={clientForm.street}
                        onChange={handleChange}
                        className={inputClass("street")}
                        placeholder="Enter street address"
                        disabled={submitting}
                    />
                </div>

                {/* Row 6 - Tel One and Tel Two */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telephone 1
                        </label>
                        <input
                            type="tel"
                            name="telone"
                            value={clientForm.telone}
                            onChange={handleChange}
                            className={inputClass("telone")}
                            placeholder="Enter telephone number"
                            disabled={submitting}
                        />
                        {errors.telone && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.telone}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telephone 2
                        </label>
                        <input
                            type="tel"
                            name="teltwo"
                            value={clientForm.teltwo}
                            onChange={handleChange}
                            className={inputClass("teltwo")}
                            placeholder="Enter telephone number"
                            disabled={submitting}
                        />
                    </div>
                </div>

                {/* Row 7 - Mobile and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            value={clientForm.mobile}
                            onChange={handleChange}
                            className={inputClass("mobile")}
                            placeholder="Enter mobile number"
                            disabled={submitting}
                        />
                        {errors.mobile && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.mobile}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={clientForm.email}
                            onChange={handleChange}
                            className={inputClass("email")}
                            placeholder="Enter email address"
                            disabled={submitting}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Row 8 - Website and Active Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Website
                        </label>
                        <input
                            type="text"
                            name="website"
                            value={clientForm.website}
                            onChange={handleChange}
                            className={inputClass("website")}
                            placeholder="Enter website URL"
                            disabled={submitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Active Status
                        </label>
                        <select
                            name="activestatus"
                            value={clientForm.activestatus}
                            onChange={handleChange}
                            className={inputClass("activestatus")}
                            disabled={submitting}
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                                Creating...
                            </span>
                        ) : (
                            <span>Create Client</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddClientForm;

// import React, { useEffect, useState } from "react";
// import { X } from "lucide-react";

// const AddClientForm = ({
//     editingClient,
//     setEditingClient,
//     handleUpdate,
//     handleCreate,
//     onSuccess,
//     onCancel,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [clientForm, setClientForm] = useState({
//         type: "",
//         name: "",
//         branchname: "",
//         code: "",
//         pannumber: "",
//         country: "",
//         state: "",
//         city: "",
//         street: "",
//         telone: "",
//         teltwo: "",
//         mobile: "",
//         email: "",
//         website: "",
//         activestatus: "yes",
//         ledgername: "",
//     });

//     useEffect(() => {
//         document.body.style.overflow = "hidden";
//         document.body.style.position = "fixed";
//         document.body.style.width = "100%";
//         return () => {
//             document.body.style.overflow = "unset";
//             document.body.style.position = "static";
//             document.body.style.width = "auto";
//         };
//     }, []);

//     useEffect(() => {
//         if (editingClient) {
//             setClientForm({
//                 type: editingClient.type || "",
//                 name: editingClient.name || "",
//                 branchname: editingClient.branchname || "",
//                 code: editingClient.code || "",
//                 pannumber: editingClient.pannumber || "",
//                 country: editingClient.country || "",
//                 state: editingClient.state || "",
//                 city: editingClient.city || "",
//                 street: editingClient.street || "",
//                 telone: editingClient.telone || "",
//                 teltwo: editingClient.teltwo || "",
//                 mobile: editingClient.mobile || "",
//                 email: editingClient.email || "",
//                 website: editingClient.website || "",
//                 activestatus: editingClient.activestatus ? "yes" : "no",
//                 ledgername: editingClient.ledgername || "",
//             });
//         } else {
//             setClientForm({
//                 type: "",
//                 name: "",
//                 branchname: "",
//                 code: "",
//                 pannumber: "",
//                 country: "",
//                 state: "",
//                 city: "",
//                 street: "",
//                 telone: "",
//                 teltwo: "",
//                 mobile: "",
//                 email: "",
//                 website: "",
//                 activestatus: "yes",
//                 ledgername: "",
//             });
//         }
//         setErrors({});
//     }, [editingClient]);

//     const validateForm = () => {
//         const newErrors = {};

//         if (!clientForm.name.trim()) {
//             newErrors.name = "Client name is required";
//         }

//         if (
//             clientForm.email &&
//             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.email)
//         ) {
//             newErrors.email = "Please enter a valid email address";
//         }

//         if (clientForm.telone && !/^[\d\s\-+()]+$/.test(clientForm.telone)) {
//             newErrors.telone = "Please enter a valid phone number";
//         }

//         if (clientForm.mobile && !/^[\d\s\-+()]+$/.test(clientForm.mobile)) {
//             newErrors.mobile = "Please enter a valid mobile number";
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) return;

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
//                 alert("Client updated successfully!");
//             } else {
//                 await handleCreate(formData);
//                 alert("Client created successfully!");
//             }
//             if (onSuccess) onSuccess();
//         } catch (error) {
//             console.log("Error saving data", error);
//             if (error.response && error.response.data.errors) {
//                 setErrors(error.response.data.errors);
//             } else {
//                 alert("Error saving client. Please try again.");
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setClientForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//         if (errors[name]) {
//             setErrors((prev) => ({ ...prev, [name]: null }));
//         }
//     };

//     const inputClass = (field) =>
//         `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//             errors[field] ? "border-red-500" : "border-gray-300"
//         }`;

//     return (
//         <div className="p-6 text-gray-800 max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold">
//                     {editingClient ? "Edit Client" : "Add New Client"}
//                 </h2>
//                 <button
//                     onClick={onCancel}
//                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     type="button"
//                     disabled={submitting}
//                 >
//                     <X className="w-6 h-6" />
//                 </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* Row 1 - Name and Type */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={clientForm.name}
//                             onChange={handleChange}
//                             className={inputClass("name")}
//                             placeholder="Enter client name"
//                             disabled={submitting}
//                             required
//                         />
//                         {errors.name && (
//                             <p className="mt-1 text-sm text-red-600">
//                                 {errors.name}
//                             </p>
//                         )}
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Type
//                         </label>
//                         <input
//                             type="text"
//                             name="type"
//                             value={clientForm.type}
//                             onChange={handleChange}
//                             className={inputClass("type")}
//                             placeholder="e.g. Individual, Company"
//                             disabled={submitting}
//                         />
//                     </div>
//                 </div>

//                 {/* Row 2 - Branch Name and Code */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Branch Name
//                         </label>
//                         <input
//                             type="text"
//                             name="branchname"
//                             value={clientForm.branchname}
//                             onChange={handleChange}
//                             className={inputClass("branchname")}
//                             placeholder="Enter branch name"
//                             disabled={submitting}
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Code
//                         </label>
//                         <input
//                             type="text"
//                             name="code"
//                             value={clientForm.code}
//                             onChange={handleChange}
//                             className={inputClass("code")}
//                             placeholder="Enter client code"
//                             disabled={submitting}
//                         />
//                     </div>
//                 </div>

//                 {/* Row 3 - PAN Number and Ledger Name */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             PAN Number
//                         </label>
//                         <input
//                             type="text"
//                             name="pannumber"
//                             value={clientForm.pannumber}
//                             onChange={handleChange}
//                             className={inputClass("pannumber")}
//                             placeholder="Enter PAN number"
//                             disabled={submitting}
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Ledger Name
//                         </label>
//                         <input
//                             type="text"
//                             name="ledgername"
//                             value={clientForm.ledgername}
//                             onChange={handleChange}
//                             className={inputClass("ledgername")}
//                             placeholder="Enter ledger name"
//                             disabled={submitting}
//                         />
//                     </div>
//                 </div>

//                 {/* Row 4 - Country, State, City */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Country
//                         </label>
//                         <input
//                             type="text"
//                             name="country"
//                             value={clientForm.country}
//                             onChange={handleChange}
//                             className={inputClass("country")}
//                             placeholder="Country"
//                             disabled={submitting}
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             State
//                         </label>
//                         <input
//                             type="text"
//                             name="state"
//                             value={clientForm.state}
//                             onChange={handleChange}
//                             className={inputClass("state")}
//                             placeholder="State"
//                             disabled={submitting}
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             City
//                         </label>
//                         <input
//                             type="text"
//                             name="city"
//                             value={clientForm.city}
//                             onChange={handleChange}
//                             className={inputClass("city")}
//                             placeholder="City"
//                             disabled={submitting}
//                         />
//                     </div>
//                 </div>

//                 {/* Row 5 - Street */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Street Address
//                     </label>
//                     <input
//                         type="text"
//                         name="street"
//                         value={clientForm.street}
//                         onChange={handleChange}
//                         className={inputClass("street")}
//                         placeholder="Enter street address"
//                         disabled={submitting}
//                     />
//                 </div>

//                 {/* Row 6 - Tel One and Tel Two */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Telephone 1
//                         </label>
//                         <input
//                             type="tel"
//                             name="telone"
//                             value={clientForm.telone}
//                             onChange={handleChange}
//                             className={inputClass("telone")}
//                             placeholder="Enter telephone number"
//                             disabled={submitting}
//                         />
//                         {errors.telone && (
//                             <p className="mt-1 text-sm text-red-600">
//                                 {errors.telone}
//                             </p>
//                         )}
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Telephone 2
//                         </label>
//                         <input
//                             type="tel"
//                             name="teltwo"
//                             value={clientForm.teltwo}
//                             onChange={handleChange}
//                             className={inputClass("teltwo")}
//                             placeholder="Enter telephone number"
//                             disabled={submitting}
//                         />
//                     </div>
//                 </div>

//                 {/* Row 7 - Mobile and Email */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Mobile
//                         </label>
//                         <input
//                             type="tel"
//                             name="mobile"
//                             value={clientForm.mobile}
//                             onChange={handleChange}
//                             className={inputClass("mobile")}
//                             placeholder="Enter mobile number"
//                             disabled={submitting}
//                         />
//                         {errors.mobile && (
//                             <p className="mt-1 text-sm text-red-600">
//                                 {errors.mobile}
//                             </p>
//                         )}
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={clientForm.email}
//                             onChange={handleChange}
//                             className={inputClass("email")}
//                             placeholder="Enter email address"
//                             disabled={submitting}
//                         />
//                         {errors.email && (
//                             <p className="mt-1 text-sm text-red-600">
//                                 {errors.email}
//                             </p>
//                         )}
//                     </div>
//                 </div>

//                 {/* Row 8 - Website and Active Status */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Website
//                         </label>
//                         <input
//                             type="text"
//                             name="website"
//                             value={clientForm.website}
//                             onChange={handleChange}
//                             className={inputClass("website")}
//                             placeholder="Enter website URL"
//                             disabled={submitting}
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Active Status
//                         </label>
//                         <select
//                             name="activestatus"
//                             value={clientForm.activestatus}
//                             onChange={handleChange}
//                             className={inputClass("activestatus")}
//                             disabled={submitting}
//                         >
//                             <option value="yes">Yes</option>
//                             <option value="no">No</option>
//                         </select>
//                     </div>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                     <button
//                         type="button"
//                         onClick={onCancel}
//                         className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={submitting}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                         disabled={submitting}
//                     >
//                         {submitting ? (
//                             <span className="flex items-center">
//                                 <svg
//                                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <circle
//                                         className="opacity-25"
//                                         cx="12"
//                                         cy="12"
//                                         r="10"
//                                         stroke="currentColor"
//                                         strokeWidth="4"
//                                     />
//                                     <path
//                                         className="opacity-75"
//                                         fill="currentColor"
//                                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                                     />
//                                 </svg>
//                                 {editingClient ? "Updating..." : "Creating..."}
//                             </span>
//                         ) : (
//                             <span>
//                                 {editingClient ? "Update Client" : "Create Client"}
//                             </span>
//                         )}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddClientForm;
