// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Plus } from "lucide-react";
// import React from "react";

// const Leads = () => {
//     const [allLeads, setAllLeads] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingLead, setEditingLead] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);

//     // For fetching the lead data
//     useEffect(() => {
//         const fetchLeads = async () => {
//             try {
//                 const response = await axios.get(route("leads.index"));
//                 setAllLeads(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchLeads();
//     }, [reloadTrigger]);

//     // For delete the lead
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("leads.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (lead) => {
//         setEditingLead(lead);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("leads.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating lead", error);
//             throw error;
//         }
//     };
//     return (
//         <>
//             <AdminWrapper>
//                 <div className="container mx-auto py-4">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                         <div>
//                             <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
//                                 Leads
//                             </h1>
//                         </div>
//                         <button
//                             onClick={() => {
//                                 setShowAddForm(true);
//                             }}
//                             className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                         >
//                             <Plus size={18} />
//                             Create
//                         </button>
//                     </div>
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default Leads;


import AddLeadForm from "@/AddFormComponents/AddLeadForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";


const Leads = () => {
    const [allLeads, setAllLeads] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Fetch leads
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await axios.get(route("ourleads.index"));
                // Controller returns { success, data } — so use response.data.data
                setAllLeads(response.data.data);
            } catch (error) {
                console.error("Fetching error:", error);
            }
        };

        fetchLeads();
    }, [reloadTrigger]);

    // Delete a lead
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("ourleads.destroy", { id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    // Open edit form
    const handleEdit = (lead) => {
        setEditingLead(lead);
        setShowAddForm(true);
    };

    // Called by AddLeadForm to persist an update
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourleads.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Update error:", error);
            throw error;
        }
    };

    // Close form and clear editing state
    const handleCloseForm = () => {
        setShowAddForm(false);
        setEditingLead(null);
    };

    return (
        <AdminWrapper>
            <div className="container mx-auto py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                            Leads
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {/* Leads table */}
                <div className="overflow-x-auto rounded-xl shadow">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-indigo-50 text-indigo-700 uppercase tracking-widest text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Lead ID</th>
                                <th className="px-4 py-3 text-left">Client</th>
                                <th className="px-4 py-3 text-left">Company</th>
                                <th className="px-4 py-3 text-left">Phone</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allLeads.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-gray-400"
                                    >
                                        No leads found.
                                    </td>
                                </tr>
                            ) : (
                                allLeads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-3 font-mono text-indigo-600">
                                            {lead.lead_id}
                                        </td>
                                        <td className="px-4 py-3">
                                            {lead.client_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {lead.company_name || "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {lead.phone}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {lead.email || "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {lead.status ? (
                                                <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                                                    {lead.status}
                                                </span>
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(lead)}
                                                className="text-xs px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(lead.id)
                                                }
                                                className="text-xs px-3 py-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit modal */}
            {showAddForm && (
                <AddLeadForm
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                    handleUpdate={handleUpdate}
                    setReloadTrigger={setReloadTrigger}
                    onClose={handleCloseForm}
                />
            )}
        </AdminWrapper>
    );
};

export default Leads;
