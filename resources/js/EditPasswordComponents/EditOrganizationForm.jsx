// import { X } from "lucide-react";
// import React, { useState, useEffect } from "react";

// const EditOrganizationForm = ({
//     editingOrganization,
//     setShowForm,
//     showForm,
//     setReloadTrigger,
//     handleUpdate,
//     setEditingOrganization,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [organizationForm, setOrganizationForm] = useState({
//         name: "",
//         domain: "",
//     });

//     useEffect(() => {
//         if (editingOrganization) {
//             setOrganizationForm({
//                 name: editingOrganization.name || "",
//                 domain: editingOrganization.domain || "",
//             });
//         }
//     }, [editingOrganization]);

//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();
//     //     const formData = new FormData();
//     //     for (const key in organizationForm) {
//     //         if (
//     //             organizationForm[key] !== null &&
//     //             organizationForm[key] !== ""
//     //         ) {
//     //             formData.append(key, organizationForm[key]);
//     //         }
//     //     }
//     //     try {
//     //         setSubmitting(true);
//     //         await handleUpdate(formData, editingOrganization.id);
//     //         setOrganizationForm({ name: "", domain: "" });
//     //         setShowForm(false);
//     //         setEditingOrganization(null);
//     //     } catch (error) {
//     //         console.error("Error updating data", error);
//     //     } finally {
//     //         setSubmitting(false);
//     //     }
//     // };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         for (const key in organizationForm) {
//             if (
//                 organizationForm[key] !== null &&
//                 organizationForm[key] !== undefined
//             ) {
//                 formData.append(key, organizationForm[key]); // ✅ empty string "" now passes through
//             }
//         }
//         try {
//             setSubmitting(true);
//             await handleUpdate(formData, editingOrganization.id);
//             setOrganizationForm({ name: "", domain: "" });
//             setShowForm(false);
//             setEditingOrganization(null);
//         } catch (error) {
//             console.error("Error updating data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setOrganizationForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingOrganization(null);
//         setOrganizationForm({ name: "", domain: "" });
//     };

//     if (!showForm || !editingOrganization) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Edit Organization
//                     </h2>
//                     <button
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={organizationForm.name}
//                             onChange={handleChange}
//                             required
//                             placeholder="Enter name"
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Domain
//                         </label>
//                         <input
//                             type="text"
//                             name="domain"
//                             value={organizationForm.domain}
//                             onChange={handleChange}
//                             placeholder="e.g. example.com"
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     <div className="flex justify-end gap-3 pt-2">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
//                         >
//                             {submitting ? "Updating..." : "Update"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditOrganizationForm;

import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditOrganizationForm = ({
    editingOrganization,
    setShowForm,
    showForm,
    setReloadTrigger,
    handleUpdate,
    setEditingOrganization,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [organizationForm, setOrganizationForm] = useState({
        name: "",
        domain: "",
    });

    useEffect(() => {
        if (editingOrganization) {
            setOrganizationForm({
                name: editingOrganization.name || "",
                domain: editingOrganization.domain || "",
            });
        }
    }, [editingOrganization]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in organizationForm) {
            if (organizationForm[key] !== null && organizationForm[key] !== undefined) {
                formData.append(key, organizationForm[key]);
            }
        }
        try {
            setSubmitting(true);
            await handleUpdate(formData, editingOrganization.id);
            toast.success("Organization updated successfully!");
            setOrganizationForm({ name: "", domain: "" });
            setShowForm(false);
            setEditingOrganization(null);
        } catch (error) {
            console.error("Error updating data", error);
            toast.error("Failed to update organization.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrganizationForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingOrganization(null);
        setOrganizationForm({ name: "", domain: "" });
    };

    if (!showForm || !editingOrganization) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Edit Organization
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={organizationForm.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Domain
                        </label>
                        <input
                            type="text"
                            name="domain"
                            value={organizationForm.domain}
                            onChange={handleChange}
                            placeholder="e.g. example.com"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {submitting ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOrganizationForm;
