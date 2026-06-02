
import AddLeadForm from "@/AddFormComponents/AddLeadForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditLeadForm from "@/EditFormComponents/EditLeadForm";
import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

const Leads = () => {
    const [allLeads, setAllLeads] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // Fetch leads
    useEffect(() => {
        const fetchLeads = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourleads.index"));
                setAllLeads(response.data.data);
            } catch (error) {
                console.error("Fetching error:", error);
            } finally {
                setLoading(false);
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
        setShowEditForm(true);
    };

    // Called by EditLeadForm to persist an update
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

    // Close add form
    const handleCloseAddForm = () => {
        setShowAddForm(false);
    };

    // Close edit form
    const handleCloseEditForm = () => {
        setShowEditForm(false);
        setEditingLead(null);
    };

    // Define columns for react-table
    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
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
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <Trash2 size={16} />
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
                <MyTable
                    columns={columns}
                    data={allLeads}
                    loading={loading}
                />
            </div>

            {/* Add modal */}
            {showAddForm && (
                <AddLeadForm
                    setReloadTrigger={setReloadTrigger}
                    onClose={handleCloseAddForm}
                />
            )}

            {/* Edit modal */}
            {showEditForm && editingLead && (
                <EditLeadForm
                    editingLead={editingLead}
                    handleUpdate={handleUpdate}
                    onClose={handleCloseEditForm}
                />
            )}
        </AdminWrapper>
    );
};

export default Leads;



// import AddLeadForm from "@/AddFormComponents/AddLeadForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import MyTable from "@/TableComponents/MyTable";
// import axios from "axios";
// import { Edit, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";

// const Leads = () => {
//     const [allLeads, setAllLeads] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [editingLead, setEditingLead] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);

//     // Fetch leads
//     useEffect(() => {
//         const fetchLeads = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourleads.index"));
//                 setAllLeads(response.data.data);
//             } catch (error) {
//                 console.error("Fetching error:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchLeads();
//     }, [reloadTrigger]);

//     // Delete a lead
//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this lead?")) return;
//         try {
//             await axios.delete(route("ourleads.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Delete error:", error);
//         }
//     };

//     // Open edit form
//     const handleEdit = (lead) => {
//         setEditingLead(lead);
//         setShowAddForm(true);
//     };

//     // Called by AddLeadForm to persist an update
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourleads.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Update error:", error);
//             throw error;
//         }
//     };

//     // Close form and clear editing state
//     const handleCloseForm = () => {
//         setShowAddForm(false);
//         setEditingLead(null);
//     };

//     // Define columns for react-table
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "s/n",
//                 accessor: "index",
//                 Cell: ({ row }) => <span>{row.index + 1}</span>,
//             },
//             {
//                 Header: "Lead ID",
//                 accessor: "lead_id",
//                 Cell: ({ value }) => (
//                     <span className="font-mono text-indigo-600">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Client",
//                 accessor: "client_name",
//                 Cell: ({ value }) => (
//                     <span className="font-medium">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Company",
//                 accessor: "company_name",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-500">{value || "—"}</span>
//                 ),
//             },
//             {
//                 Header: "Phone",
//                 accessor: "phone",
//             },
//             {
//                 Header: "Email",
//                 accessor: "email",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-500">{value || "—"}</span>
//                 ),
//             },
//             {
//                 Header: "Status",
//                 accessor: "status",
//                 Cell: ({ value }) => {
//                     if (!value) return "—";
//                     return (
//                         <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
//                             {value}
//                         </span>
//                     );
//                 },
//             },
//             {
//                 Header: "Actions",
//                 accessor: "id",
//                 disableSortBy: true,
//                 Cell: ({ row }) => (
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
//                         >
//                             <Edit size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                         >
//                             <Trash2 size={16} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         []
//     );

//     return (
//         <AdminWrapper>
//             <div className="container mx-auto py-4">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
//                             Leads
//                         </h1>
//                     </div>
//                     <button
//                         onClick={() => setShowAddForm(true)}
//                         className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 {/* Leads table with integrated loading */}
//                 <MyTable 
//                     columns={columns} 
//                     data={allLeads} 
//                     loading={loading}
//                 />
//             </div>

//             {/* Add / Edit modal */}
//             {showAddForm && (
//                 <AddLeadForm
//                     editingLead={editingLead}
//                     setEditingLead={setEditingLead}
//                     handleUpdate={handleUpdate}
//                     setReloadTrigger={setReloadTrigger}
//                     onClose={handleCloseForm}
//                 />
//             )}
//         </AdminWrapper>
//     );
// };

// export default Leads;


