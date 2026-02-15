import AddClientForm from "@/AddFormComponents/AddClientForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { Edit, Plus, Trash2, Building } from "lucide-react";
import { Head } from "@inertiajs/react";
import MyTable from "@/TableComponents/MyTable";

const Client = () => {
    const [allClients, setAllClients] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

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
        setShowModal(true);
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
        setShowModal(false);
        setEditingClient(null);
        setReloadTrigger((prev) => !prev);
    };

    // Close all modals
    const closeModals = () => {
        setShowModal(false);
        setEditingClient(null);
    };

    // Define table columns
    const columns = useMemo(
        () => [
            {
                Header: "SN",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Organization",
                accessor: "organization_name",
                Cell: ({ value }) => (
                    <div className="text-sm font-medium text-gray-900">
                        {value}
                    </div>
                ),
            },
            {
                Header: "Contact Person",
                accessor: "contact_person",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900"> {value} </div>
                ),
            },

            {
                Header: "Phone",
                accessor: "contact_phone",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">
                        <a
                            href={`tel:${value}`}
                            className="text-blue-500 hover:underline"
                        >
                            {value}
                        </a>
                    </div>
                ),
            },

            {
                Header: "Email",
                accessor: "email",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">
                        {value || "N/A"}
                    </div>
                ),
            },
            {
                Header: "Actions",
                accessor: "id",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
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
                            setShowModal(true);
                            setEditingClient(null);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
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
                        {allClients.length > 0 ? (
                            <MyTable columns={columns} data={allClients} />
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                <Building className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-gray-500 text-lg">
                                    No clients found
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Add your first client to get started
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Client Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                            onClick={closeModals}
                        />

                        {/* Modal Content */}
                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
                                <AddClientForm
                                    editingClient={editingClient}
                                    setEditingClient={setEditingClient}
                                    handleUpdate={handleUpdate}
                                    handleCreate={handleCreate}
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
