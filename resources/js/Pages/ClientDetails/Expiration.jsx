import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AddExpirationForm from "@/AddFormComponents/AddExpirationForm";
import { Edit, Plus, Trash2, Calendar } from "lucide-react";
import { Head } from "@inertiajs/react";
import MyTable from "@/TableComponents/MyTable";

const Expiration = () => {
    const [allExpiration, setAllExpiration] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingExpiration, setEditingExpiration] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // For fetching the expiration data
    useEffect(() => {
        const fetchExpiration = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourexpirations.index"));
                setAllExpiration(response.data.data || response.data);
            } catch (error) {
                console.error("fetching error ", error);
                alert("Error loading expirations");
            } finally {
                setLoading(false);
            }
        };

        fetchExpiration();
    }, [reloadTrigger]);

    // For delete the expiration
    const handleDelete = async (id) => {
        if (
            !window.confirm("Are you sure you want to delete this expiration?")
        ) {
            return;
        }

        try {
            await axios.delete(route("ourexpirations.destroy", { id: id }));
            setReloadTrigger((prev) => !prev);
            alert("Expiration deleted successfully!");
        } catch (error) {
            console.log(error);
            alert("Error deleting expiration");
        }
    };

    // handleEdit
    const handleEdit = (expiration) => {
        setEditingExpiration(expiration);
        setShowModal(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourexpirations.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.log("Error updating expiration", error);
            throw error;
        }
    };

    // Handle create
    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(
                route("ourexpirations.store"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.log("Error creating expiration", error);
            throw error;
        }
    };

    // Handle successful form submission
    const handleFormSuccess = () => {
        setShowModal(false);
        setEditingExpiration(null);
        setReloadTrigger((prev) => !prev);
    };

    // Close all modals
    const closeModals = () => {
        setShowModal(false);
        setEditingExpiration(null);
    };

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Calculate time remaining in months and days
    const getTimeRemaining = (expirationDate) => {
        const today = new Date();
        const expDate = new Date(expirationDate);

        // Calculate difference in months
        const yearDiff = expDate.getFullYear() - today.getFullYear();
        const monthDiff = expDate.getMonth() - today.getMonth();
        const totalMonths = yearDiff * 12 + monthDiff;

        // Calculate days for more precision
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return { totalMonths, diffDays };
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
                Header: "Title",
                accessor: "title",
                Cell: ({ value }) => (
                    <div className="text-sm font-medium text-gray-900">
                        {value}
                    </div>
                ),
            },
            {
                Header: "Client",
                accessor: "client",
                Cell: ({ row }) => (
                    <div className="text-sm text-gray-900">
                        {row.original.client?.organization_name ||
                            row.original.client?.name ||
                            "N/A"}
                    </div>
                ),
            },
            {
                Header: "Contact Phone",
                accessor: "client.contact_phone",
                Cell: ({ row }) => (
                    <div className="text-sm text-gray-900">
                        {row.original.client?.contact_phone ? (
                            <a
                                href={`tel:${row.original.client.contact_phone}`}
                                className="text-blue-600 hover:underline"
                            >
                                {row.original.client.contact_phone}
                            </a>
                        ) : (
                            "N/A"
                        )}
                    </div>
                ),
            },

            {
                Header: "Last Renewal",
                accessor: "last_renewal_date",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">
                        {formatDate(value)}
                    </div>
                ),
            },
            {
                Header: "Duration (Months)",
                accessor: "duration",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">
                        {value} {value === 1 ? "month" : "months"}
                    </div>
                ),
            },
            {
                Header: "Expiration Date",
                accessor: "expiration_date",
                Cell: ({ value, row }) => {
                    const { totalMonths, diffDays } = getTimeRemaining(value);
                    let statusColor = "text-green-600";
                    let bgColor = "bg-green-50";
                    let statusText = "";

                    if (diffDays < 0) {
                        statusColor = "text-red-600";
                        bgColor = "bg-red-50";
                        statusText = `${Math.abs(totalMonths)} ${Math.abs(totalMonths) === 1 ? "month" : "months"} overdue`;
                    } else if (totalMonths > 0) {
                        if (totalMonths <= 1) {
                            statusColor = "text-yellow-600";
                            bgColor = "bg-yellow-50";
                        } else if (totalMonths <= 3) {
                            statusColor = "text-orange-600";
                            bgColor = "bg-orange-50";
                        }
                        statusText = `${totalMonths} ${totalMonths === 1 ? "month" : "months"} left`;
                    } else {
                        statusColor = "text-yellow-600";
                        bgColor = "bg-yellow-50";
                        statusText = `${diffDays} ${diffDays === 1 ? "day" : "days"} left`;
                    }

                    return (
                        <div>
                            <div className="text-sm text-gray-900">
                                {formatDate(value)}
                            </div>
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${statusColor}`}
                            >
                                {statusText}
                            </span>
                        </div>
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "id",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit expiration"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete expiration"
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
            <Head title="Expiration Management" />
            <div className="container mx-auto  py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Expiration Management
                    </h1>
                    <button
                        onClick={() => {
                            setShowModal(true);
                            setEditingExpiration(null);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600">
                            Loading expirations...
                        </p>
                    </div>
                )}

                {/* Expirations Table */}
                {!loading && (
                    <div className="mt-8">
                        {allExpiration.length > 0 ? (
                            <div className="  overflow-hidden">
                                <MyTable
                                    columns={columns}
                                    data={allExpiration}
                                />
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-gray-500 text-lg">
                                    No expirations found
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Add your first expiration to get started
                                </p>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm inline-flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    <span>Add Expiration</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Expiration Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                            onClick={closeModals}
                        />

                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
                                <AddExpirationForm
                                    editingExpiration={editingExpiration}
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

export default Expiration;
