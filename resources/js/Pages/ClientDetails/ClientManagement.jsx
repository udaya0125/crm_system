import AddClientManagement from "@/AddFormComponents/AddClientManagement";
import EditClientManagement from "@/EditFormComponents/EditClientManagement";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import MyTable from "@/TableComponents/MyTable";
import { Head } from "@inertiajs/react";
import PageLoader from "@/Loader/PageLoader";
import ClientPopup from "../../PopupComponents/ClientPopup";
import toast, { Toaster } from "react-hot-toast";

const ClientManagement = () => {
    const [allClients, setAllClients] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [viewingClient, setViewingClient] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    route("ourclientmanagement.index"),
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
            toast.success("Client deleted successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete client. Please try again.");
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setShowEditForm(true);
    };

    const handleView = (client) => {
        setViewingClient(client);
    };

    // Called by AddClientManagement on successful store
    const handleStoreSuccess = () => {
        setReloadTrigger((prev) => !prev);
        toast.success("Client created successfully.");
    };

    // Called by AddClientManagement on store error
    const handleStoreError = () => {
        toast.error("Failed to create client. Please try again.");
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        try {
            const response = await axios.post(
                route("ourclientmanagement.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setReloadTrigger((prev) => !prev);
            toast.success("Client updated successfully.");
            return response.data;
        } catch (error) {
            toast.error("Failed to update client. Please try again.");
            throw error;
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
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
                    if (value === "Paid")
                        bgColor = "bg-green-100 text-green-700";
                    if (value === "Overdue")
                        bgColor = "bg-red-100 text-red-700";

                    return (
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor}`}
                        >
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
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleView(row.original)}
                            className="p-2 rounded-full transition-colors"
                            style={{ color: "#0d77c3" }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                    "#e8f2fb")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                    "transparent")
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
        [],
    );

    return (
        <AdminWrapper>
            <Head title="Client Management" />

            {/* Toast container — mounted once at the top level */}
            {/* <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: "8px",
                        fontSize: "14px",
                    },
                    success: {
                        iconTheme: {
                            primary: "#4f46e5",
                            secondary: "#fff",
                        },
                    },
                }}
            /> */}

            <Toaster position="top-right" />

            <div className="container mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Client Management
                    </h1>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {loading ? (
                    <PageLoader />
                ) : (
                    <MyTable columns={columns} data={allClients} />
                )}
            </div>

            {/* View Popup */}
            {viewingClient && (
                <ClientPopup
                    client={viewingClient}
                    onClose={() => setViewingClient(null)}
                />
            )}

            {/* Add Modal */}
            {showAddForm && (
                <AddClientManagement
                    reloadTrigger={reloadTrigger}
                    setReloadTrigger={setReloadTrigger}
                    setShowForm={setShowAddForm}
                    onStoreSuccess={handleStoreSuccess}
                    onStoreError={handleStoreError}
                />
            )}

            {/* Edit Modal */}
            {showEditForm && editingClient && (
                <EditClientManagement
                    reloadTrigger={reloadTrigger}
                    setReloadTrigger={setReloadTrigger}
                    editingClient={editingClient}
                    setEditingClient={setEditingClient}
                    setShowForm={setShowEditForm}
                    handleUpdate={handleUpdate}
                />
            )}
        </AdminWrapper>
    );
};

export default ClientManagement;
