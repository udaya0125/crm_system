// import AddClientForm from "@/AddFormComponents/AddClientForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import React, { useEffect, useState, useMemo } from "react";
// import { Edit, Eye, Plus, Trash2, Search, X } from "lucide-react";
// import { Head } from "@inertiajs/react";
// import MyTable from "@/TableComponents/MyTable";
// import EditClientForm from "@/EditFormComponents/EditClientForm";
// import ClientDetailPopup from "@/PopupComponents/ClientDetailPopup";
// import PageLoader from "@/Loader/PageLoader";

// const Client = () => {
//     const [allClients, setAllClients] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingClient, setEditingClient] = useState(null);
//     const [viewingClient, setViewingClient] = useState(null);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState("");

//     useEffect(() => {
//         const fetchClient = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourclients.index"));
//                 setAllClients(response.data.data || response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 alert("Error loading clients");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchClient();
//     }, [reloadTrigger]);

//     const filteredClients = useMemo(() => {
//         if (!searchQuery.trim()) return allClients;
//         return allClients.filter((client) =>
//             client.name?.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//     }, [allClients, searchQuery]);

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this client?")) return;
//         try {
//             await axios.delete(route("ourclients.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//             alert("Error deleting client");
//         }
//     };

//     const handleEdit = (client) => {
//         setEditingClient(client);
//         setShowEditModal(true);
//     };

//     const handleView = (client) => {
//         setViewingClient(client);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourclients.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             return response.data;
//         } catch (error) {
//             console.log("Error updating client", error);
//             throw error;
//         }
//     };

//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourclients.store"), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//         } catch (error) {
//             console.log("Error creating client", error);
//             throw error;
//         }
//     };

//     const handleFormSuccess = () => {
//         setShowAddModal(false);
//         setShowEditModal(false);
//         setEditingClient(null);
//         setReloadTrigger((prev) => !prev);
//     };

//     const closeModals = () => {
//         setShowAddModal(false);
//         setShowEditModal(false);
//         setEditingClient(null);
//     };

//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S.N.",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//                 Cell: ({ value }) => (
//                     <div className="text-sm font-medium text-gray-900">{value}</div>
//                 ),
//             },
//             {
//                 Header: "Type",
//                 accessor: "type",
//                 Cell: ({ value }) => (
//                     <div className="text-sm text-gray-900">{value || "—"}</div>
//                 ),
//             },
//             {
//                 Header: "Branch",
//                 accessor: "branchname",
//                 Cell: ({ value }) => (
//                     <div className="text-sm text-gray-900">{value || "—"}</div>
//                 ),
//             },
//             {
//                 Header: "Code",
//                 accessor: "code",
//                 Cell: ({ value }) => (
//                     <div className="text-sm text-gray-900">{value || "—"}</div>
//                 ),
//             },
//             {
//                 Header: "Pan Number",
//                 accessor: "pannumber",
//                 Cell: ({ value }) => (
//                     <div className="text-sm text-gray-900">{value || "—"}</div>
//                 ),
//             },
//             {
//                 Header: "Status",
//                 accessor: "activestatus",
//                 Cell: ({ value }) => (
//                     <span
//                         className={`px-2 py-1 text-xs rounded-full font-medium ${
//                             value === "yes"
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-red-100 text-red-700"
//                         }`}
//                     >
//                         {value === "yes" ? "Active" : "Inactive"}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Actions",
//                 accessor: "id",
//                 disableSortBy: true,
//                 Cell: ({ row }) => (
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => handleView(row.original)}
//                             className="p-2 rounded-full transition-colors"
//                             style={{ color: "#0d77c3" }}
//                             onMouseEnter={e =>
//                                 (e.currentTarget.style.backgroundColor = "#e8f2fb")
//                             }
//                             onMouseLeave={e =>
//                                 (e.currentTarget.style.backgroundColor = "transparent")
//                             }
//                             title="View details"
//                         >
//                             <Eye size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
//                             title="Edit client"
//                         >
//                             <Edit size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                             title="Delete client"
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
//             <Head title="Client Management" />
//             <div className="container mx-auto">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                         Client
//                     </h1>
//                     <button
//                         onClick={() => {
//                             setShowAddModal(true);
//                             setEditingClient(null);
//                         }}
//                         className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 {/* Search Bar */}
//                 <div className="relative max-w-sm mb-6">
//                     <Search
//                         size={16}
//                         className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                     />
//                     <input
//                         type="text"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         placeholder="Search by name..."
//                         className="w-full pl-9 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     />
//                     {searchQuery && (
//                         <button
//                             onClick={() => setSearchQuery("")}
//                             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                         >
//                             <X size={14} />
//                         </button>
//                     )}
//                 </div>

//                 {loading ? (
//                     <PageLoader />
//                 ) : (
//                     <MyTable columns={columns} data={filteredClients} />
//                 )}
//             </div>

//             {/* View Popup */}
//             {viewingClient && (
//                 <ClientDetailPopup
//                     client={viewingClient}
//                     onClose={() => setViewingClient(null)}
//                 />
//             )}

//             {/* Add Client Modal */}
//             {showAddModal && (
//                 <div className="fixed inset-0 z-50 backdrop-blur-sm overflow-y-auto">
//                     <div
//                         className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//                         onClick={closeModals}
//                     />
//                     <div className="flex items-center justify-center min-h-screen p-4">
//                         <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
//                             <AddClientForm
//                                 handleCreate={handleCreate}
//                                 onSuccess={handleFormSuccess}
//                                 onCancel={closeModals}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Edit Client Modal */}
//             {showEditModal && editingClient && (
//                 <div className="fixed inset-0 z-50 backdrop-blur-sm overflow-y-auto">
//                     <div
//                         className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//                         onClick={closeModals}
//                     />
//                     <div className="flex items-center justify-center min-h-screen p-4">
//                         <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
//                             <EditClientForm
//                                 editingClient={editingClient}
//                                 handleUpdate={handleUpdate}
//                                 onSuccess={handleFormSuccess}
//                                 onCancel={closeModals}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </AdminWrapper>
//     );
// };

// export default Client;


import AddClientForm from "@/AddFormComponents/AddClientForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { Edit, Eye, Plus, Trash2, Search, X } from "lucide-react";
import { Head } from "@inertiajs/react";
import MyTable from "@/TableComponents/MyTable";
import EditClientForm from "@/EditFormComponents/EditClientForm";
import ClientDetailPopup from "@/PopupComponents/ClientDetailPopup";
import PageLoader from "@/Loader/PageLoader";
import toast, { Toaster } from "react-hot-toast";

const Client = () => {
    const [allClients, setAllClients] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [viewingClient, setViewingClient] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchClient = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourclients.index"));
                setAllClients(response.data.data || response.data);
            } catch (error) {
                console.error("fetching error ", error);
                toast.error("Error loading clients");
            } finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, [reloadTrigger]);

    const filteredClients = useMemo(() => {
        if (!searchQuery.trim()) return allClients;
        return allClients.filter((client) =>
            client.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allClients, searchQuery]);

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this client?")) return;

        toast.promise(axios.delete(route("ourclients.destroy", { id })), {
            loading: "Deleting client...",
            success: () => {
                setReloadTrigger((prev) => !prev);
                return "Client deleted successfully!";
            },
            error: "Failed to delete client.",
        });
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setShowForm(true);
    };

    const handleView = (client) => {
        setViewingClient(client);
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourclients.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    };

    const handleCreate = async (formData) => {
        await axios.post(route("ourclients.store"), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingClient(null);
        setReloadTrigger((prev) => !prev);
    };

    const closeModals = () => {
        setShowForm(false);
        setEditingClient(null);
    };

    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ value }) => (
                    <div className="text-sm font-medium text-gray-900">{value}</div>
                ),
            },
            {
                Header: "Type",
                accessor: "type",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">{value || "—"}</div>
                ),
            },
            {
                Header: "Branch",
                accessor: "branchname",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">{value || "—"}</div>
                ),
            },
            {
                Header: "Code",
                accessor: "code",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">{value || "—"}</div>
                ),
            },
            {
                Header: "Pan Number",
                accessor: "pannumber",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">{value || "—"}</div>
                ),
            },
            {
                Header: "Status",
                accessor: "activestatus",
                Cell: ({ value }) => (
                    <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                            value === "yes"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {value === "yes" ? "Active" : "Inactive"}
                    </span>
                ),
            },
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleView(row.original)}
                            className="p-2 rounded-full transition-colors"
                            style={{ color: "#0d77c3" }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = "#e8f2fb")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = "transparent")
                            }
                            title="View details"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit client"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete client"
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
            <Toaster position="top-right" />
            <Head title="Client Management" />
            <div className="container mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Client
                    </h1>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditingClient(null);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-sm mb-6">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full pl-9 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {loading ? (
                    <PageLoader />
                ) : (
                    <MyTable columns={columns} data={filteredClients} />
                )}
            </div>

            {/* View Popup */}
            {viewingClient && (
                <ClientDetailPopup
                    client={viewingClient}
                    showForm={showForm}
                    setShowForm={setShowForm}
                    onClose={() => setViewingClient(null)}
                />
            )}

            {/* Add Client Modal */}
            {showForm && !editingClient && (
                <div className="fixed inset-0 z-50 backdrop-blur-sm overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={closeModals}
                    />
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
                            <AddClientForm
                                handleCreate={handleCreate}
                                onSuccess={handleFormSuccess}
                                onCancel={closeModals}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Client Modal */}
            {showForm && editingClient && (
                <div className="fixed inset-0 z-50 backdrop-blur-sm overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={closeModals}
                    />
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
                            <EditClientForm
                                editingClient={editingClient}
                                handleUpdate={handleUpdate}
                                onSuccess={handleFormSuccess}
                                onCancel={closeModals}
                            />
                        </div>
                    </div>
                </div>
            )}
        </AdminWrapper>
    );
};

export default Client;
