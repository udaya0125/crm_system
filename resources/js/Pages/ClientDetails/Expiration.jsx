import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AddExpirationForm from "@/AddFormComponents/AddExpirationForm";
import { Edit, Plus, Trash2, Calendar, Search, X } from "lucide-react";
import { Head } from "@inertiajs/react";
import MyTable from "@/TableComponents/MyTable";

const Expiration = () => {
    const [allExpiration, setAllExpiration] = useState([]);
    const [filteredExpirations, setFilteredExpirations] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingExpiration, setEditingExpiration] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTitle, setSelectedTitle] = useState("all");
    const [uniqueTitles, setUniqueTitles] = useState([]);

    // For fetching the expiration data
    useEffect(() => {
        const fetchExpiration = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourexpirations.index"));
                const data = response.data.data || response.data;
                setAllExpiration(data);
                setFilteredExpirations(data);

                // Extract unique titles for filter dropdown
                const titles = [...new Set(data.map((item) => item.title))];
                setUniqueTitles(titles);
            } catch (error) {
                console.error("fetching error ", error);
                alert("Error loading expirations");
            } finally {
                setLoading(false);
            }
        };

        fetchExpiration();
    }, [reloadTrigger]);

    // Filter effect - runs when search query or selected title changes
    useEffect(() => {
        let filtered = allExpiration;

        // Apply title filter
        if (selectedTitle !== "all") {
            filtered = filtered.filter((item) => item.title === selectedTitle);
        }

        // Apply search query (client name or title)
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
        // Reset filters
        setSearchQuery("");
        setSelectedTitle("all");
    };

    // Close all modals
    const closeModals = () => {
        setShowModal(false);
        setEditingExpiration(null);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery("");
        setSelectedTitle("all");
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

    // Calculate days remaining
    const getDaysRemaining = (expirationDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time part for accurate day calculation

        const expDate = new Date(expirationDate);
        expDate.setHours(0, 0, 0, 0); // Reset time part for accurate day calculation

        // Calculate difference in days
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
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
                    const daysRemaining = getDaysRemaining(value);

                    // Determine color and status text based on days remaining
                    let statusColor = "";
                    let bgColor = "";
                    let statusText = "";

                    if (daysRemaining < 0) {
                        // Expired
                        statusColor = "text-red-600";
                        bgColor = "bg-red-100";
                        statusText = `Overdue by ${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'day' : 'days'}`;
                    } else if (daysRemaining <= 7) {
                        // Less than or equal to 7 days - proper red
                        statusColor = "text-red-700";
                        bgColor = "bg-red-100";
                        statusText = `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`;
                    } else if (daysRemaining <= 30) {
                        // Less than or equal to 30 days - light red with countdown
                        statusColor = "text-red-500";
                        bgColor = "bg-red-50";
                        statusText = `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`;
                    } else {
                        // More than 30 days - green
                        statusColor = "text-green-600";
                        bgColor = "bg-green-50";
                        const monthsRemaining = Math.floor(daysRemaining / 30);
                        statusText = `${monthsRemaining} ${monthsRemaining === 1 ? 'month' : 'months'} left`;
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
            // {
            //     Header: "Expiration Date",
            //     accessor: "expiration_date",
            //     Cell: ({ value }) => (
            //         <div className="text-sm text-gray-900">
            //             {formatDate(value)}
            //         </div>
            //     ),
            // },
            // {
            //     Header: "Status",
            //     accessor: "status",
            //     Cell: ({ row }) => {
            //         const daysRemaining = getDaysRemaining(
            //             row.original.expiration_date,
            //         );

            //         // Determine color and status text based on days remaining
            //         let statusColor = "";
            //         let bgColor = "";
            //         let statusText = "";

            //         if (daysRemaining < 0) {
            //             // Expired
            //             statusColor = "text-red-600";
            //             bgColor = "bg-red-100";
            //             statusText = `Overdue by ${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? "day" : "days"}`;
            //         } else if (daysRemaining <= 7) {
            //             // Less than or equal to 7 days - proper red
            //             statusColor = "text-red-700";
            //             bgColor = "bg-red-100";
            //             statusText = `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} left`;
            //         } else if (daysRemaining <= 30) {
            //             // Less than or equal to 30 days - light red with countdown
            //             statusColor = "text-red-500";
            //             bgColor = "bg-red-50";
            //             statusText = `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} left`;
            //         } else {
            //             // More than 30 days - green
            //             statusColor = "text-green-600";
            //             bgColor = "bg-green-50";
            //             const monthsRemaining = Math.floor(daysRemaining / 30);
            //             statusText = `${monthsRemaining} ${monthsRemaining === 1 ? "month" : "months"} left`;
            //         }

            //         return (
            //             <span
            //                 className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${statusColor}`}
            //             >
            //                 {statusText}
            //             </span>
            //         );
            //     },
            // },
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
        [],
    );

    return (
        <AdminWrapper>
            <Head title="Expiration Management" />
            <div className="container mx-auto py-4">
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

                {/* Search and Filter Section */}
                {!loading && allExpiration.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by client name or title..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <X
                                            size={18}
                                            className="text-gray-400 hover:text-gray-600"
                                        />
                                    </button>
                                )}
                            </div>

                            {/* Title Filter Dropdown */}
                            <div className="relative">
                                <select
                                    value={selectedTitle}
                                    onChange={(e) =>
                                        setSelectedTitle(e.target.value)
                                    }
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

                            {/* Clear Filters Button */}
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
                        {filteredExpirations.length > 0 ? (
                            <div className="overflow-hidden">
                                <MyTable
                                    columns={columns}
                                    data={filteredExpirations}
                                />
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                {allExpiration.length > 0 ? (
                                    <>
                                        <Search className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                        <p className="text-gray-500 text-lg">
                                            No matching expirations found
                                        </p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Try adjusting your search or filter
                                            criteria
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm inline-flex items-center gap-2"
                                        >
                                            <X size={16} />
                                            <span>Clear Filters</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                        <p className="text-gray-500 text-lg">
                                            No expirations found
                                        </p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Add your first expiration to get
                                            started
                                        </p>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm inline-flex items-center gap-2"
                                        >
                                            <Plus size={16} />
                                            <span>Add Expiration</span>
                                        </button>
                                    </>
                                )}
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

// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import AddExpirationForm from "@/AddFormComponents/AddExpirationForm";
// import { Edit, Plus, Trash2, Calendar, Search, X, Clock } from "lucide-react";
// import { Head } from "@inertiajs/react";
// import MyTable from "@/TableComponents/MyTable";

// const Expiration = () => {
//     const [allExpiration, setAllExpiration] = useState([]);
//     const [filteredExpirations, setFilteredExpirations] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingExpiration, setEditingExpiration] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [loading, setLoading] = useState(true);

//     // Search and filter states
//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedTitle, setSelectedTitle] = useState("all");
//     const [uniqueTitles, setUniqueTitles] = useState([]);

//     // For fetching the expiration data
//     useEffect(() => {
//         const fetchExpiration = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourexpirations.index"));
//                 const data = response.data.data || response.data;
//                 setAllExpiration(data);
//                 setFilteredExpirations(data);

//                 // Extract unique titles for filter dropdown
//                 const titles = [...new Set(data.map(item => item.title))];
//                 setUniqueTitles(titles);
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 alert("Error loading expirations");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchExpiration();
//     }, [reloadTrigger]);

//     // Filter effect - runs when search query or selected title changes
//     useEffect(() => {
//         let filtered = allExpiration;

//         // Apply title filter
//         if (selectedTitle !== "all") {
//             filtered = filtered.filter(item => item.title === selectedTitle);
//         }

//         // Apply search query (client name or title)
//         if (searchQuery.trim() !== "") {
//             const query = searchQuery.toLowerCase().trim();
//             filtered = filtered.filter(item => {
//                 const clientName = item.client?.organization_name?.toLowerCase() ||
//                                   item.client?.name?.toLowerCase() ||
//                                   "";
//                 const title = item.title?.toLowerCase() || "";

//                 return clientName.includes(query) || title.includes(query);
//             });
//         }

//         setFilteredExpirations(filtered);
//     }, [searchQuery, selectedTitle, allExpiration]);

//     // For delete the expiration
//     const handleDelete = async (id) => {
//         if (
//             !window.confirm("Are you sure you want to delete this expiration?")
//         ) {
//             return;
//         }

//         try {
//             await axios.delete(route("ourexpirations.destroy", { id: id }));
//             setReloadTrigger((prev) => !prev);
//             alert("Expiration deleted successfully!");
//         } catch (error) {
//             console.log(error);
//             alert("Error deleting expiration");
//         }
//     };

//     // handleEdit
//     const handleEdit = (expiration) => {
//         setEditingExpiration(expiration);
//         setShowModal(true);
//     };

//     // Handle update after the edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourexpirations.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             return response.data;
//         } catch (error) {
//             console.log("Error updating expiration", error);
//             throw error;
//         }
//     };

//     // Handle create
//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(
//                 route("ourexpirations.store"),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             return response.data;
//         } catch (error) {
//             console.log("Error creating expiration", error);
//             throw error;
//         }
//     };

//     // Handle successful form submission
//     const handleFormSuccess = () => {
//         setShowModal(false);
//         setEditingExpiration(null);
//         setReloadTrigger((prev) => !prev);
//         // Reset filters
//         setSearchQuery("");
//         setSelectedTitle("all");
//     };

//     // Close all modals
//     const closeModals = () => {
//         setShowModal(false);
//         setEditingExpiration(null);
//     };

//     // Clear all filters
//     const clearFilters = () => {
//         setSearchQuery("");
//         setSelectedTitle("all");
//     };

//     // Format date function
//     const formatDate = (dateString) => {
//         if (!dateString) return "N/A";
//         return new Date(dateString).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//         });
//     };

//     // Calculate days remaining
//     const getDaysRemaining = (expirationDate) => {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); // Reset time part for accurate day calculation

//         const expDate = new Date(expirationDate);
//         expDate.setHours(0, 0, 0, 0); // Reset time part for accurate day calculation

//         // Calculate difference in days
//         const diffTime = expDate - today;
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//         return diffDays;
//     };

//     // Get status color based on days remaining
//     const getStatusColor = (daysRemaining) => {
//         if (daysRemaining < 0) {
//             return {
//                 bgColor: "bg-red-100",
//                 textColor: "text-red-600",
//                 label: "Overdue"
//             };
//         } else if (daysRemaining <= 7) {
//             return {
//                 bgColor: "bg-red-100",
//                 textColor: "text-red-700",
//                 label: "Critical"
//             };
//         } else if (daysRemaining <= 30) {
//             return {
//                 bgColor: "bg-red-50",
//                 textColor: "text-red-500",
//                 label: "Warning"
//             };
//         } else {
//             return {
//                 bgColor: "bg-green-50",
//                 textColor: "text-green-600",
//                 label: "Good"
//             };
//         }
//     };

//     // Get status text
//     const getStatusText = (daysRemaining) => {
//         if (daysRemaining < 0) {
//             return `Overdue by ${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'day' : 'days'}`;
//         } else {
//             return `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`;
//         }
//     };

//     // Separate table for days remaining view
//     const DaysRemainingTable = ({ data }) => {
//         const [sortConfig, setSortConfig] = useState({ key: 'daysRemaining', direction: 'asc' });

//         // Calculate days remaining for each item and sort
//         const sortedData = useMemo(() => {
//             const dataWithDays = data.map(item => ({
//                 ...item,
//                 daysRemaining: getDaysRemaining(item.expiration_date),
//                 status: getStatusColor(getDaysRemaining(item.expiration_date))
//             }));

//             return [...dataWithDays].sort((a, b) => {
//                 if (sortConfig.key === 'daysRemaining') {
//                     return sortConfig.direction === 'asc'
//                         ? a.daysRemaining - b.daysRemaining
//                         : b.daysRemaining - a.daysRemaining;
//                 }
//                 return 0;
//             });
//         }, [data, sortConfig]);

//         const requestSort = (key) => {
//             setSortConfig(prev => ({
//                 key,
//                 direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
//             }));
//         };

//         // Group by status for summary cards
//         const summary = useMemo(() => {
//             const dataWithDays = data.map(item => ({
//                 ...item,
//                 daysRemaining: getDaysRemaining(item.expiration_date)
//             }));

//             return {
//                 critical: dataWithDays.filter(item => {
//                     const days = getDaysRemaining(item.expiration_date);
//                     return days > 0 && days <= 7;
//                 }).length,
//                 warning: dataWithDays.filter(item => {
//                     const days = getDaysRemaining(item.expiration_date);
//                     return days > 7 && days <= 30;
//                 }).length,
//                 good: dataWithDays.filter(item => {
//                     const days = getDaysRemaining(item.expiration_date);
//                     return days > 30;
//                 }).length,
//                 overdue: dataWithDays.filter(item => {
//                     const days = getDaysRemaining(item.expiration_date);
//                     return days < 0;
//                 }).length
//             };
//         }, [data]);

//         return (
//             <div className="space-y-6">
//                 {/* Summary Cards */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div className="bg-red-100 rounded-lg p-4 border border-red-200">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-red-800">Critical (≤7 days)</p>
//                                 <p className="text-2xl font-bold text-red-900">{summary.critical}</p>
//                             </div>
//                             <div className="p-3 bg-red-200 rounded-full">
//                                 <Clock className="w-5 h-5 text-red-700" />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-red-50 rounded-lg p-4 border border-red-100">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-red-600">Warning (8-30 days)</p>
//                                 <p className="text-2xl font-bold text-red-700">{summary.warning}</p>
//                             </div>
//                             <div className="p-3 bg-red-100 rounded-full">
//                                 <Clock className="w-5 h-5 text-red-500" />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-green-50 rounded-lg p-4 border border-green-100">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-green-600">Good (>30 days)</p>
//                                 <p className="text-2xl font-bold text-green-700">{summary.good}</p>
//                             </div>
//                             <div className="p-3 bg-green-100 rounded-full">
//                                 <Clock className="w-5 h-5 text-green-600" />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-red-100 rounded-lg p-4 border border-red-200">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-red-800">Overdue</p>
//                                 <p className="text-2xl font-bold text-red-900">{summary.overdue}</p>
//                             </div>
//                             <div className="p-3 bg-red-200 rounded-full">
//                                 <Clock className="w-5 h-5 text-red-700" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Days Remaining Table */}
//                 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//                     <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//                         <h3 className="text-lg font-semibold text-gray-900">Days Remaining Overview</h3>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Title
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Client
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Expiration Date
//                                     </th>
//                                     <th
//                                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                                         onClick={() => requestSort('daysRemaining')}
//                                     >
//                                         <div className="flex items-center gap-1">
//                                             Days Remaining
//                                             {sortConfig.key === 'daysRemaining' && (
//                                                 <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
//                                             )}
//                                         </div>
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Status
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Actions
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {sortedData.map((item) => {
//                                     const daysRemaining = getDaysRemaining(item.expiration_date);
//                                     const status = getStatusColor(daysRemaining);
//                                     const statusText = getStatusText(daysRemaining);

//                                     return (
//                                         <tr key={item.id} className="hover:bg-gray-50">
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                 {item.title}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {item.client?.organization_name || item.client?.name || "N/A"}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {formatDate(item.expiration_date)}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <span className={`text-sm font-semibold ${
//                                                     daysRemaining < 0 ? 'text-red-600' :
//                                                     daysRemaining <= 7 ? 'text-red-700' :
//                                                     daysRemaining <= 30 ? 'text-red-500' :
//                                                     'text-green-600'
//                                                 }`}>
//                                                     {daysRemaining < 0 ?
//                                                         `-${Math.abs(daysRemaining)}` :
//                                                         daysRemaining
//                                                     } days
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
//                                                     {status.label}
//                                                 </span>
//                                                 <span className="ml-2 text-xs text-gray-500">
//                                                     ({statusText})
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 <div className="flex gap-2">
//                                                     <button
//                                                         onClick={() => handleEdit(item)}
//                                                         className="text-indigo-600 hover:text-indigo-900 transition duration-200"
//                                                         title="Edit expiration"
//                                                     >
//                                                         <Edit size={16} />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDelete(item.id)}
//                                                         className="text-red-600 hover:text-red-900 transition duration-200"
//                                                         title="Delete expiration"
//                                                     >
//                                                         <Trash2 size={16} />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     // Define main table columns
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "SN",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
//             {
//                 Header: "Title",
//                 accessor: "title",
//                 Cell: ({ value }) => (
//                     <div className="text-sm font-medium text-gray-900">
//                         {value}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Client",
//                 accessor: "client",
//                 Cell: ({ row }) => (
//                     <div className="text-sm text-gray-900">
//                         {row.original.client?.organization_name ||
//                             row.original.client?.name ||
//                             "N/A"}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Contact Phone",
//                 accessor: "client.contact_phone",
//                 Cell: ({ row }) => (
//                     <div className="text-sm text-gray-900">
//                         {row.original.client?.contact_phone ? (
//                             <a
//                                 href={`tel:${row.original.client.contact_phone}`}
//                                 className="text-blue-600 hover:underline"
//                             >
//                                 {row.original.client.contact_phone}
//                             </a>
//                         ) : (
//                             "N/A"
//                         )}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Last Renewal",
//                 accessor: "last_renewal_date",
//                 Cell: ({ value }) => (
//                     <div className="text-sm text-gray-900">
//                         {formatDate(value)}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Duration (Months)",
//                 accessor: "duration",
//                 Cell: ({ value }) => (
//                     <div className="text-sm text-gray-900">
//                         {value} {value === 1 ? "month" : "months"}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Expiration Date",
//                 accessor: "expiration_date",
//                 Cell: ({ value, row }) => {
//                     const daysRemaining = getDaysRemaining(value);
//                     const status = getStatusColor(daysRemaining);
//                     const statusText = getStatusText(daysRemaining);

//                     return (
//                         <div>
//                             <div className="text-sm text-gray-900">
//                                 {formatDate(value)}
//                             </div>
//                             <span
//                                 className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}
//                             >
//                                 {statusText}
//                             </span>
//                         </div>
//                     );
//                 },
//             },
//             {
//                 Header: "Actions",
//                 accessor: "id",
//                 Cell: ({ row }) => (
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="text-indigo-600 hover:text-indigo-900 transition duration-200"
//                             title="Edit expiration"
//                         >
//                             <Edit size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="text-red-600 hover:text-red-900 transition duration-200"
//                             title="Delete expiration"
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
//             <Head title="Expiration Management" />
//             <div className="container mx-auto py-4">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                     <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                         Expiration Management
//                     </h1>
//                     <button
//                         onClick={() => {
//                             setShowModal(true);
//                             setEditingExpiration(null);
//                         }}
//                         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
//                     >
//                         <Plus size={18} />
//                         <span>Create</span>
//                     </button>
//                 </div>

//                 {/* Search and Filter Section */}
//                 {!loading && allExpiration.length > 0 && (
//                     <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             {/* Search Input */}
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Search size={18} className="text-gray-400" />
//                                 </div>
//                                 <input
//                                     type="text"
//                                     placeholder="Search by client name or title..."
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                 />
//                                 {searchQuery && (
//                                     <button
//                                         onClick={() => setSearchQuery("")}
//                                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                     >
//                                         <X size={18} className="text-gray-400 hover:text-gray-600" />
//                                     </button>
//                                 )}
//                             </div>

//                             {/* Title Filter Dropdown */}
//                             <div className="relative">
//                                 <select
//                                     value={selectedTitle}
//                                     onChange={(e) => setSelectedTitle(e.target.value)}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                                 >
//                                     <option value="all">All Titles</option>
//                                     {uniqueTitles.map((title, index) => (
//                                         <option key={index} value={title}>
//                                             {title}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Clear Filters Button */}
//                             {(searchQuery || selectedTitle !== "all") && (
//                                 <button
//                                     onClick={clearFilters}
//                                     className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
//                                 >
//                                     <X size={18} />
//                                     <span>Clear Filters</span>
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {/* Loading State */}
//                 {loading && (
//                     <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
//                         <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//                         <p className="mt-4 text-gray-600">
//                             Loading expirations...
//                         </p>
//                     </div>
//                 )}

//                 {/* Days Remaining Table */}
//                 {!loading && filteredExpirations.length > 0 && (
//                     <div className="mt-8">
//                         <DaysRemainingTable data={filteredExpirations} />
//                     </div>
//                 )}

//                 {/* Main Expirations Table */}
//                 {!loading && (
//                     <div className="mt-8">
//                         {filteredExpirations.length > 0 ? (
//                             <div className="overflow-hidden">
//                                 <div className="mb-4">
//                                     <h2 className="text-xl font-semibold text-gray-900">All Expirations</h2>
//                                 </div>
//                                 <MyTable
//                                     columns={columns}
//                                     data={filteredExpirations}
//                                 />
//                             </div>
//                         ) : (
//                             <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
//                                 {allExpiration.length > 0 ? (
//                                     <>
//                                         <Search className="w-12 h-12 mx-auto text-gray-400 mb-3" />
//                                         <p className="text-gray-500 text-lg">
//                                             No matching expirations found
//                                         </p>
//                                         <p className="text-gray-400 text-sm mt-1">
//                                             Try adjusting your search or filter criteria
//                                         </p>
//                                         <button
//                                             onClick={clearFilters}
//                                             className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm inline-flex items-center gap-2"
//                                         >
//                                             <X size={16} />
//                                             <span>Clear Filters</span>
//                                         </button>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
//                                         <p className="text-gray-500 text-lg">
//                                             No expirations found
//                                         </p>
//                                         <p className="text-gray-400 text-sm mt-1">
//                                             Add your first expiration to get started
//                                         </p>
//                                         <button
//                                             onClick={() => setShowModal(true)}
//                                             className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm inline-flex items-center gap-2"
//                                         >
//                                             <Plus size={16} />
//                                             <span>Add Expiration</span>
//                                         </button>
//                                     </>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Expiration Modal */}
//                 {showModal && (
//                     <div className="fixed inset-0 z-50 overflow-y-auto">
//                         <div
//                             className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//                             onClick={closeModals}
//                         />

//                         <div className="flex items-center justify-center min-h-screen p-4">
//                             <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
//                                 <AddExpirationForm
//                                     editingExpiration={editingExpiration}
//                                     handleUpdate={handleUpdate}
//                                     handleCreate={handleCreate}
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

// export default Expiration;
