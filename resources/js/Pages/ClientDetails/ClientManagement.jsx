// import AddClientManagement from "@/AddFormComponents/AddClientManagement";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Edit, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import MyTable from "@/TableComponents/MyTable";

// const ClientManagement = () => {
//     const [allClients, setAllClients] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingClient, setEditingClient] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);

//     useEffect(() => {
//         const fetchClients = async () => {
//             try {
//                 const response = await axios.get(
//                     route("ourclientmanagement.index")
//                 );
//                 setAllClients(response.data.data);
//             } catch (error) {
//                 console.error("Fetching error:", error);
//             }
//         };
//         fetchClients();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this client?")) return;
//         try {
//             await axios.delete(route("ourclientmanagement.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const handleEdit = (client) => {
//         setEditingClient(client);
//         setShowAddForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourclientmanagement.update", { id }),
//             formData,
//             { headers: { "Content-Type": "multipart/form-data" } }
//         );
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//     };

//     // Define columns for react-table
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "Company",
//                 accessor: "company_name",
//                 Cell: ({ value }) => (
//                     <span className="font-medium text-stone-800">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Contact",
//                 accessor: "contact_person",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-600">{value || "—"}</span>
//                 ),
//             },
//             {
//                 Header: "Phone",
//                 accessor: "phone",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-600">{value || "—"}</span>
//                 ),
//             },
//             {
//                 Header: "Service",
//                 accessor: "service_type",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-600">{value || "—"}</span>
//                 ),
//             },
//             {
//                 Header: "Payment",
//                 accessor: "payment_status",
//                 Cell: ({ value }) => {
//                     let bgColor = "bg-yellow-100 text-yellow-700";
//                     if (value === "Paid") bgColor = "bg-green-100 text-green-700";
//                     if (value === "Overdue") bgColor = "bg-red-100 text-red-700";
                    
//                     return (
//                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor}`}>
//                             {value || "—"}
//                         </span>
//                     );
//                 },
//             },
//             {
//                 Header: "Actions",
//                 accessor: "id",
//                 disableSortBy: true,
//                 Cell: ({ row }) => (
//                     <div className=" space-x-2">
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
//                     <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
//                         Clients
//                     </h1>
//                     <button
//                         onClick={() => {
//                             setEditingClient(null);
//                             setShowAddForm(true);
//                         }}
//                         className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 {/* Client Table */}
//                 {allClients.length === 0 ? (
//                     <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-blue-100">
//                         No clients found.
//                     </div>
//                 ) : (
//                     <MyTable columns={columns} data={allClients} />
//                 )}
//             </div>

//             {/* Modal */}
//             {showAddForm && (
//                 <AddClientManagement
//                     reloadTrigger={reloadTrigger}
//                     setReloadTrigger={setReloadTrigger}
//                     editingClient={editingClient}
//                     setEditingClient={setEditingClient}
//                     setShowForm={setShowAddForm}
//                     handleUpdate={handleUpdate}
//                 />
//             )}
//         </AdminWrapper>
//     );
// };

// export default ClientManagement;

import AddClientManagement from "@/AddFormComponents/AddClientManagement";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import MyTable from "@/TableComponents/MyTable";

const ClientManagement = () => {
    const [allClients, setAllClients] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    route("ourclientmanagement.index")
                );
                setAllClients(response.data.data);
            } catch (error) {
                console.error("Fetching error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this client?")) return;
        try {
            await axios.delete(route("ourclientmanagement.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setShowAddForm(true);
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourclientmanagement.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        setReloadTrigger((prev) => !prev);
        return response.data;
    };

    // Define columns for react-table
    const columns = useMemo(
        () => [
            {
                Header: "Company",
                accessor: "company_name",
                Cell: ({ value }) => (
                    <span className="font-medium text-stone-800">{value}</span>
                ),
            },
            {
                Header: "Contact",
                accessor: "contact_person",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{value || "—"}</span>
                ),
            },
            {
                Header: "Phone",
                accessor: "phone",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{value || "—"}</span>
                ),
            },
            {
                Header: "Service",
                accessor: "service_type",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{value || "—"}</span>
                ),
            },
            {
                Header: "Payment",
                accessor: "payment_status",
                Cell: ({ value }) => {
                    let bgColor = "bg-yellow-100 text-yellow-700";
                    if (value === "Paid") bgColor = "bg-green-100 text-green-700";
                    if (value === "Overdue") bgColor = "bg-red-100 text-red-700";
                    
                    return (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor}`}>
                            {value || "—"}
                        </span>
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <div className=" space-x-2">
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
                    <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                        Clients
                    </h1>
                    <button
                        onClick={() => {
                            setEditingClient(null);
                            setShowAddForm(true);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {/* Client Table with integrated loading */}
                <MyTable 
                    columns={columns} 
                    data={allClients} 
                    loading={loading}
                />
            </div>

            {/* Modal */}
            {showAddForm && (
                <AddClientManagement
                    reloadTrigger={reloadTrigger}
                    setReloadTrigger={setReloadTrigger}
                    editingClient={editingClient}
                    setEditingClient={setEditingClient}
                    setShowForm={setShowAddForm}
                    handleUpdate={handleUpdate}
                />
            )}
        </AdminWrapper>
    );
};

export default ClientManagement;