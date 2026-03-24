// import AddRenewalForm from "@/AddFormComponents/AddRenewalForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const ContractRenewalManagement = () => {
//         const [allRenewal, setAllRenewal] = useState([]);
//         const [reloadTrigger, setReloadTrigger] = useState(false);
//         const [editingRenewal, setEditingRenewal] = useState(null);
//         const [showAddForm, setShowAddForm] = useState(false);
    
//         // For fetching the renewal data
//         useEffect(() => {
//             const fetchRenewal = async () => {
//                 try {
//                     const response = await axios.get(route("renewals.index"));
//                     setAllRenewal(response.data);
//                 } catch (error) {
//                     console.error("fetching error ", error);
//                 }
//             };
    
//             fetchRenewal();
//         }, [reloadTrigger]);
    
//         // For delete the renewal
//         const handleDelete = async (id) => {
//             try {
//                 const response = await axios.delete(
//                     route("renewals.destroy", { id: id }),
//                 );
//                 console.log(response.data);
//                 setReloadTrigger((prev) => !prev);
//             } catch (error) {
//                 console.log(error);
//             }
//         };
    
//         // handleedit
//         const handleEdit = (renewal) => {
//             setEditingRenewal(renewal);
//         };
    
//         // Handlapdate after the  edit
//         const handleUpdate = async (formData, id) => {
//             try {
//                 formData.append("_method", "PUT");
//                 const response = await axios.post(
//                     route("renewals.update", { id }),
//                     formData,
//                     {
//                         headers: {
//                             "Content-Type": "multipart/form-data",
//                         },
//                     },
//                 );
//                 setReloadTrigger((prev) => !prev);
//                 return response.data;
//             } catch (error) {
//                 console.log("Error updating renewal", error);
//                 throw error;
//             }
//         };
//     return (
//         <>
//             <AdminWrapper>
//                 <div className="container mx-auto py-4">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                         <div>
//                             <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
//                                 Contract Renewals
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
//                     {showAddForm && (
//                         <AddRenewalForm
//                             editingRenewal={editingRenewal}
//                             setShowForm={setShowAddForm}
//                             setEditingRenewal={setEditingRenewal}
//                         />
//                     )}
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default ContractRenewalManagement;


import AddRenewalForm from "@/AddFormComponents/AddRenewalForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

const ContractRenewalManagement = () => {
    const [allRenewal, setAllRenewal] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingRenewal, setEditingRenewal] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // For fetching the renewal data
    useEffect(() => {
        const fetchRenewal = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("renewals.index"));
                setAllRenewal(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRenewal();
    }, [reloadTrigger]);

    // For delete the renewal
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this renewal?")) {
            return;
        }
        
        try {
            const response = await axios.delete(
                route("renewals.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (renewal) => {
        setEditingRenewal(renewal);
        setShowAddForm(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("renewals.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating renewal", error);
            throw error;
        }
    };

    // Close form
    const handleCloseForm = () => {
        setShowAddForm(false);
        setEditingRenewal(null);
    };

    // Define columns for MyTable
    const columns = useMemo(
        () => [
            {
                Header: "s/n",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                Header: "Contract",
                accessor: "contract_name",
                Cell: ({ value }) => (
                    <span className="font-medium text-gray-900">{value}</span>
                ),
            },
            {
                Header: "Client",
                accessor: (row) => row.client?.organization_name ?? row.client?.name ?? "—",
                id: "client",
            },
            {
                Header: "Previous Renewal",
                accessor: "last_renewal_date",
                Cell: ({ value }) => {
                    if (!value) return "N/A";
                    return new Date(value).toLocaleDateString();
                },
            },
            {
                Header: "Next Renewal",
                accessor: "next_renewal_date",
                Cell: ({ value }) => {
                    if (!value) return "N/A";
                    const nextDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const daysUntilRenewal = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
                    
                    let statusColor = "";
                    let statusText = "";
                    
                    if (daysUntilRenewal < 0) {
                        statusColor = "text-red-600 bg-red-100";
                        statusText = `Overdue by ${Math.abs(daysUntilRenewal)} days`;
                    } else if (daysUntilRenewal <= 7) {
                        statusColor = "text-orange-600 bg-orange-100";
                        statusText = `${daysUntilRenewal} days left`;
                    } else if (daysUntilRenewal <= 30) {
                        statusColor = "text-yellow-600 bg-yellow-100";
                        statusText = `${daysUntilRenewal} days left`;
                    } else {
                        statusColor = "text-green-600 bg-green-100";
                        const monthsRemaining = Math.floor(daysUntilRenewal / 30);
                        statusText = `${monthsRemaining} month${monthsRemaining !== 1 ? 's' : ''} left`;
                    }
                    
                    return (
                        <div>
                            <div className="text-sm text-gray-900">
                                {nextDate.toLocaleDateString()}
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                                {statusText}
                            </span>
                        </div>
                    );
                },
            },
            {
                Header: "Renewal Amount",
                accessor: "renewal_amount",
                Cell: ({ value }) => (
                    <span className="font-medium text-green-600">
                        NPR {Number(value).toLocaleString()}
                    </span>
                ),
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => {
                    const statusStyles = {
                        pending: "bg-yellow-100 text-yellow-700",
                        completed: "bg-green-100 text-green-700",
                        cancelled: "bg-red-100 text-red-700",
                        scheduled: "bg-blue-100 text-blue-700",
                    };
                    return (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[value] || "bg-gray-100 text-gray-600"}`}>
                            {value || "Pending"}
                        </span>
                    );
                },
            },
            {
                Header: "Actions",
                id: "actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit renewal"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete renewal"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <>
            <AdminWrapper>
                <div className="container mx-auto py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                                Contract Renewals
                            </h1>
                        </div>
                        <button
                            onClick={() => {
                                setEditingRenewal(null);
                                setShowAddForm(true);
                            }}
                            className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <Plus size={18} />
                            Create
                        </button>
                    </div>

                    {/* MyTable Component with integrated loading */}
                    <MyTable 
                        columns={columns} 
                        data={allRenewal} 
                        loading={loading}
                    />

                    {/* Add/Edit Renewal Form */}
                    {showAddForm && (
                        <AddRenewalForm
                            editingRenewal={editingRenewal}
                            setShowForm={handleCloseForm}
                            setEditingRenewal={setEditingRenewal}
                            setReloadTrigger={setReloadTrigger}
                            handleUpdate={handleUpdate}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default ContractRenewalManagement;