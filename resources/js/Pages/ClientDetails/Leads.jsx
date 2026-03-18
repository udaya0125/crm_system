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
import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

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
                setAllLeads(response.data.data);
            } catch (error) {
                console.error("Fetching error:", error);
            }
        };

        fetchLeads();
    }, [reloadTrigger]);

    // Delete a lead
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this lead?")) return;
        try {
            await axios.delete(route("ourleads.destroy", { id }));
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
                { headers: { "Content-Type": "multipart/form-data" } }
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

    // Define columns for react-table
    const columns = useMemo(
        () => [
            {
                Header: "Lead ID",
                accessor: "lead_id",
                Cell: ({ value }) => (
                    <span className="font-mono text-indigo-600">{value}</span>
                ),
            },
            {
                Header: "Client",
                accessor: "client_name",
                Cell: ({ value }) => (
                    <span className="font-medium">{value}</span>
                ),
            },
            {
                Header: "Company",
                accessor: "company_name",
                Cell: ({ value }) => (
                    <span className="text-gray-500">{value || "—"}</span>
                ),
            },
            {
                Header: "Phone",
                accessor: "phone",
            },
            {
                Header: "Email",
                accessor: "email",
                Cell: ({ value }) => (
                    <span className="text-gray-500">{value || "—"}</span>
                ),
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => {
                    if (!value) return "—";
                    return (
                        <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                            {value}
                        </span>
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-xs px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition font-medium"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-xs px-3 py-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition font-medium"
                        >
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

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
                {allLeads.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-blue-100">
                        No leads found.
                    </div>
                ) : (
                    <MyTable columns={columns} data={allLeads} />
                )}
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
