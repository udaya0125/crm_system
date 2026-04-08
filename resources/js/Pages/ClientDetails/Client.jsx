import AddClientForm from "@/AddFormComponents/AddClientForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { Edit, Plus, Trash2, Building, Search, X } from "lucide-react";
import { Head } from "@inertiajs/react";
import MyTable from "@/TableComponents/MyTable";
import EditClientForm from "@/EditFormComponents/EditClientForm";

const Client = () => {
    const [allClients, setAllClients] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // For fetching the client data
    useEffect(() => {
        const fetchClient = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourclients.index"));
                setAllClients(response.data.data || response.data);
            } catch (error) {
                console.error("fetching error ", error);
                alert("Error loading clients");
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [reloadTrigger]);

    // Filter clients by name
    const filteredClients = useMemo(() => {
        if (!searchQuery.trim()) return allClients;
        return allClients.filter((client) =>
            client.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allClients, searchQuery]);

    // For delete the client
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this client?")) {
            return;
        }

        try {
            const response = await axios.delete(
                route("ourclients.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
            alert("Error deleting client");
        }
    };

    // Handle edit
    const handleEdit = (client) => {
        setEditingClient(client);
        setShowEditModal(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourclients.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.log("Error updating client", error);
            throw error;
        }
    };

    // Handle Create Client
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourclients.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error) {
            console.log("Error creating client", error);
            throw error;
        }
    };

    // Handle successful form submission
    const handleFormSuccess = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setEditingClient(null);
        setReloadTrigger((prev) => !prev);
    };

    // Close all modals
    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setEditingClient(null);
    };

    // Define table columns
    const columns = useMemo(
        () => [
           {
                Header: "S/N",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ value }) => (
                    <div className="text-sm font-medium text-gray-900">
                        {value}
                    </div>
                ),
            },
            {
                Header: "Type",
                accessor: "type",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">
                        {value || "N/A"}
                    </div>
                ),
            },
            {
                Header: "Branch",
                accessor: "branchname",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">
                        {value || "N/A"}
                    </div>
                ),
            },
            {
                Header: "Code",
                accessor: "code",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">
                        {value || "N/A"}
                    </div>
                ),
            },
            {
                Header: "Pan Number",
                accessor: "pannumber",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">
                        {value || "N/A"}
                    </div>
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
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-indigo-600 hover:text-indigo-900 transition duration-200"
                            title="Edit client"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition duration-200"
                            title="Delete client"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
                disableSortBy: true,
            },
        ],
        [],
    );

    return (
        <AdminWrapper>
            <Head title="Client Management" />
            <div className="container mx-auto py-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold">
                        Client Management
                    </h1>
                    <button
                        onClick={() => {
                            setShowAddModal(true);
                            setEditingClient(null);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-sm">
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

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600">Loading clients...</p>
                    </div>
                )}

                {/* Clients Table - Only show when not loading */}
                {!loading && (
                    <div className="mt-8">
                        {filteredClients.length > 0 ? (
                            <MyTable columns={columns} data={filteredClients} />
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                <Building className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-gray-500 text-lg">
                                    {searchQuery
                                        ? `No clients found matching "${searchQuery}"`
                                        : "No clients found"}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {searchQuery
                                        ? "Try a different search term"
                                        : "Add your first client to get started"}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Add Client Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
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
                {showEditModal && editingClient && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
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
            </div>
        </AdminWrapper>
    );
};

export default Client;



// import AddClientForm from "@/AddFormComponents/AddClientForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import React, { useEffect, useState, useMemo } from "react";
// import { Edit, Plus, Trash2, Building } from "lucide-react";
// import { Head } from "@inertiajs/react";
// import MyTable from "@/TableComponents/MyTable";
// import EditClientForm from "@/EditFormComponents/EditClientForm";

// const Client = () => {
//     const [allClients, setAllClients] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingClient, setEditingClient] = useState(null);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [loading, setLoading] = useState(true);

//     // For fetching the client data
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

//     // For delete the client
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this client?")) {
//             return;
//         }

//         try {
//             const response = await axios.delete(
//                 route("ourclients.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//             alert("Error deleting client");
//         }
//     };

//     // Handle edit
//     const handleEdit = (client) => {
//         setEditingClient(client);
//         setShowEditModal(true);
//     };

//     // Handle update after the edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourclients.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             return response.data;
//         } catch (error) {
//             console.log("Error updating client", error);
//             throw error;
//         }
//     };

//     // Handle Create Client
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourclients.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//         } catch (error) {
//             console.log("Error creating client", error);
//             throw error;
//         }
//     };

//     // Handle successful form submission
//     const handleFormSuccess = () => {
//         setShowAddModal(false);
//         setShowEditModal(false);
//         setEditingClient(null);
//         setReloadTrigger((prev) => !prev);
//     };

//     // Close all modals
//     const closeModals = () => {
//         setShowAddModal(false);
//         setShowEditModal(false);
//         setEditingClient(null);
//     };

//     // Define table columns
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "SN",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//                 Cell: ({ value }) => (
//                     <div className="text-sm font-medium text-gray-900">
//                         {value}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Type",
//                 accessor: "type",
//                 Cell: ({ value }) => (
//                     <div className="text-sm text-gray-900">
//                         {value || "N/A"}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Branch",
//                 accessor: "branchname",
//                 Cell: ({ value }) => (
//                     <div className="text-sm text-gray-900">
//                         {value || "N/A"}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Email",
//                 accessor: "code",
//                 Cell: ({ value }) => (
//                     <div className="text-sm text-gray-900">
//                         {value || "N/A"}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Pan Number",
//                 accessor: "pannumber",
//                 Cell: ({ value }) => (
//                     <div className="text-sm text-gray-900">
//                         {value || "N/A"}
//                     </div>
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
//                 Cell: ({ row }) => (
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="text-indigo-600 hover:text-indigo-900 transition duration-200"
//                             title="Edit client"
//                         >
//                             <Edit size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="text-red-600 hover:text-red-900 transition duration-200"
//                             title="Delete client"
//                         >
//                             <Trash2 size={16} />
//                         </button>
//                     </div>
//                 ),
//                 disableSortBy: true,
//             },
//         ],
//         [],
//     );

//     return (
//         <AdminWrapper>
//             <Head title="Client Management" />
//             <div className="container mx-auto py-4">
//                 <div className="flex justify-between items-center mb-6">
//                     <h1 className="text-2xl lg:text-3xl font-bold">
//                         Client Management
//                     </h1>
//                     <button
//                         onClick={() => {
//                             setShowAddModal(true);
//                             setEditingClient(null);
//                         }}
//                         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                     >
//                         <Plus size={18} />
//                         <span>Create</span>
//                     </button>
//                 </div>

//                 {/* Loading State */}
//                 {loading && (
//                     <div className="text-center py-16">
//                         <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//                         <p className="mt-4 text-gray-600">Loading clients...</p>
//                     </div>
//                 )}

//                 {/* Clients Table - Only show when not loading */}
//                 {!loading && (
//                     <div className="mt-8">
//                         {allClients.length > 0 ? (
//                             <MyTable columns={columns} data={allClients} />
//                         ) : (
//                             <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
//                                 <Building className="w-12 h-12 mx-auto text-gray-400 mb-3" />
//                                 <p className="text-gray-500 text-lg">
//                                     No clients found
//                                 </p>
//                                 <p className="text-gray-400 text-sm mt-1">
//                                     Add your first client to get started
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Add Client Modal */}
//                 {showAddModal && (
//                     <div className="fixed inset-0 z-50 overflow-y-auto">
//                         {/* Backdrop */}
//                         <div
//                             className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//                             onClick={closeModals}
//                         />

//                         {/* Modal Content */}
//                         <div className="flex items-center justify-center min-h-screen p-4">
//                             <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
//                                 <AddClientForm
//                                     handleCreate={handleCreate}
//                                     onSuccess={handleFormSuccess}
//                                     onCancel={closeModals}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Edit Client Modal */}
//                 {showEditModal && editingClient && (
//                     <div className="fixed inset-0 z-50 overflow-y-auto">
//                         {/* Backdrop */}
//                         <div
//                             className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//                             onClick={closeModals}
//                         />

//                         {/* Modal Content */}
//                         <div className="flex items-center justify-center min-h-screen p-4">
//                             <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
//                                 <EditClientForm
//                                     editingClient={editingClient}
//                                     handleUpdate={handleUpdate}
//                                     onSuccess={handleFormSuccess}
//                                     onCancel={closeModals}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// export default Client;

