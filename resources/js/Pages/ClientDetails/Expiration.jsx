import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AddExpirationForm from "@/AddFormComponents/AddExpirationForm";
import EditExpirationForm from "@/EditFormComponents/EditExpirationForm";
import { Edit, Plus, Trash2, Calendar, Search, X } from "lucide-react";
import { Head } from "@inertiajs/react";
import MyTable from "@/TableComponents/MyTable";
import PageLoader from "@/Loader/PageLoader";
import toast, { Toaster } from "react-hot-toast";

const Expiration = () => {
    const [allExpiration, setAllExpiration] = useState([]);
    const [filteredExpirations, setFilteredExpirations] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingExpiration, setEditingExpiration] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTitle, setSelectedTitle] = useState("all");
    const [uniqueTitles, setUniqueTitles] = useState([]);

    useEffect(() => {
        const fetchExpiration = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourexpirations.index"));
                const data = response.data.data || response.data;
                setAllExpiration(data);
                setFilteredExpirations(data);
                const titles = [...new Set(data.map((item) => item.title))];
                setUniqueTitles(titles);
            } catch (error) {
                console.error("fetching error ", error);
                toast.error("Error loading expirations");
            } finally {
                setLoading(false);
            }
        };

        fetchExpiration();
    }, [reloadTrigger]);

    useEffect(() => {
        let filtered = allExpiration;

        if (selectedTitle !== "all") {
            filtered = filtered.filter((item) => item.title === selectedTitle);
        }

        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter((item) => {
                const clientName =
                    item.client?.organization_name?.toLowerCase() ||
                    item.client?.name?.toLowerCase() ||
                    "";
                const title = item.title?.toLowerCase() || "";
                return clientName.includes(query) || title.includes(query);
            });
        }

        setFilteredExpirations(filtered);
    }, [searchQuery, selectedTitle, allExpiration]);

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this expiration?"))
            return;

        toast.promise(
            axios.delete(route("ourexpirations.destroy", { id })),
            {
                loading: "Deleting expiration...",
                success: () => {
                    setReloadTrigger((prev) => !prev);
                    return "Expiration deleted successfully!";
                },
                error: "Failed to delete expiration.",
            }
        );
    };

    const handleEdit = (expiration) => {
        setEditingExpiration(expiration);
        setShowEditModal(true);
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourexpirations.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    };

    const handleCreate = async (formData) => {
        const response = await axios.post(
            route("ourexpirations.store"),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    };

    const handleFormSuccess = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setEditingExpiration(null);
        setReloadTrigger((prev) => !prev);
        setSearchQuery("");
        setSelectedTitle("all");
    };

    const closeAddModal = () => setShowAddModal(false);
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingExpiration(null);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedTitle("all");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getDaysRemaining = (expirationDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expDate = new Date(expirationDate);
        expDate.setHours(0, 0, 0, 0);
        return Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
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
                Header: "Title",
                accessor: "title",
                Cell: ({ value }) => (
                    <div className="text-sm font-medium text-gray-900">{value}</div>
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
                Header: "Last Renewal",
                accessor: "last_renewal_date",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900">{formatDate(value)}</div>
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
                Cell: ({ value }) => {
                    const daysRemaining = getDaysRemaining(value);

                    let statusColor, bgColor, statusText;

                    if (daysRemaining < 0) {
                        statusColor = "text-red-600";
                        bgColor = "bg-red-100";
                        statusText = `Overdue by ${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? "day" : "days"}`;
                    } else if (daysRemaining <= 7) {
                        statusColor = "text-red-700";
                        bgColor = "bg-red-100";
                        statusText = `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} left`;
                    } else if (daysRemaining <= 30) {
                        statusColor = "text-red-500";
                        bgColor = "bg-red-50";
                        statusText = `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} left`;
                    } else {
                        statusColor = "text-green-600";
                        bgColor = "bg-green-50";
                        const monthsRemaining = Math.floor(daysRemaining / 30);
                        statusText = `${monthsRemaining} ${monthsRemaining === 1 ? "month" : "months"} left`;
                    }

                    return (
                        <div>
                            <div className="text-sm text-gray-900">{formatDate(value)}</div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${statusColor}`}>
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
                            className="text-indigo-600 hover:text-indigo-900 transition duration-200"
                            title="Edit expiration"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition duration-200"
                            title="Delete expiration"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
                disableSortBy: true,
            },
        ],
        []
    );

    return (
        <AdminWrapper>
            <Toaster position="top-right" />
            <Head title="Expiration Management" />
            <div className="container mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Expiration Management
                    </h1>
                    <button
                        onClick={() => {
                            setShowAddModal(true);
                            setEditingExpiration(null);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                {!loading && allExpiration.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by client name or title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <X size={18} className="text-gray-400 hover:text-gray-600" />
                                    </button>
                                )}
                            </div>

                            <div className="relative">
                                <select
                                    value={selectedTitle}
                                    onChange={(e) => setSelectedTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="all">All Titles</option>
                                    {uniqueTitles.map((title, index) => (
                                        <option key={index} value={title}>
                                            {title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {(searchQuery || selectedTitle !== "all") && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                >
                                    <X size={18} />
                                    <span>Clear Filters</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {loading ? (
                    <PageLoader />
                ) : (
                    <MyTable columns={columns} data={filteredExpirations} />
                )}

                {!loading && filteredExpirations.length === 0 && allExpiration.length > 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200 mt-8">
                        <Search className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 text-lg">No matching expirations found</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Try adjusting your search or filter criteria
                        </p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm inline-flex items-center gap-2"
                        >
                            <X size={16} />
                            <span>Clear Filters</span>
                        </button>
                    </div>
                )}

                {showAddModal && (
                    <div className="fixed inset-0 z-50 backdrop-blur-sm overflow-y-auto">
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                            onClick={closeAddModal}
                        />
                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
                                <AddExpirationForm
                                    handleCreate={handleCreate}
                                    onSuccess={handleFormSuccess}
                                    onCancel={closeAddModal}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {showEditModal && editingExpiration && (
                    <div className="fixed inset-0 z-50 backdrop-blur-sm overflow-y-auto">
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                            onClick={closeEditModal}
                        />
                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
                                <EditExpirationForm
                                    editingExpiration={editingExpiration}
                                    handleUpdate={handleUpdate}
                                    onSuccess={handleFormSuccess}
                                    onCancel={closeEditModal}
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
