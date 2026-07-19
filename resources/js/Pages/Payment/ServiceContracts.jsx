import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import MyTable from "@/TableComponents/MyTable";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { Head } from "@inertiajs/react";
import PageLoader from "@/Loader/PageLoader";

const ServiceContracts = () => {
    const [allService, setAllService] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(false);

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [password, setPassword] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 

    // Search state
    const [search, setSearch] = useState("");

    // Fetch service contracts
    useEffect(() => {
        const fetchService = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    route("ourservicecontracts.index"),
                );
                setAllService(response.data.data ?? []);
            } catch (error) {
                console.error("Fetching error:", error);
                toast.error("Failed to load service contracts");
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [reloadTrigger]);

    // Open delete confirmation modal
    const openDeleteModal = useCallback((id) => {
        setDeleteItemId(id);
        setPassword("");
        setShowPassword(false); // Reset password visibility when opening modal
        setShowDeleteModal(true);
    }, []);

    // Close delete modal
    const closeDeleteModal = useCallback(() => {
        setShowDeleteModal(false);
        setDeleteItemId(null);
        setPassword("");
        setShowPassword(false); // Reset password visibility when closing modal
    }, []);

    // Handle delete
    const handleDelete = useCallback(async () => {
        if (!deleteItemId) {
            toast.error("No contract selected for deletion");
            return;
        }
        if (!password) {
            toast.error("Password is required for deletion");
            return;
        }

        setDeleteLoading(true);
        try {
            // Step 1: Verify password
            const verifyResponse = await axios.post(route("password.verify"), {
                password,
            });
            if (!verifyResponse.data.verified) {
                toast.error("Incorrect password");
                return;
            }

            // Step 2: Delete the contract
            await axios.delete(
                route("ourservicecontracts.destroy", { id: deleteItemId }),
            );

            toast.success("Service contract deleted successfully");
            setReloadTrigger((prev) => !prev);
            closeDeleteModal();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 422) {
                toast.error("Password verification failed");
            } else {
                toast.error("Something went wrong while deleting");
            }
        } finally {
            setDeleteLoading(false);
        }
    }, [deleteItemId, password, closeDeleteModal]);

    // Filtered data based on search
    const filteredData = useMemo(() => {
        if (!search.trim()) return allService;

        return allService.filter((contract) =>
            [
                contract.customer_name,
                contract.service_type,
                contract.invoice_number,
            ]
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase()),
        );
    }, [allService, search]);

    // Helper: calculate remaining time until expiry
const getRemainingTime = (expiryDate) => {
    if (!expiryDate) return { label: "N/A", color: "gray" };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return {
            label: `Expired ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""} ago`,
            color: "red",
            days: diffDays,
        };
    }

    if (diffDays === 0) {
        return { label: "Expires today", color: "red", days: diffDays };
    }

    // Convert to years / months / days breakdown for a nicer display
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    let label = "";
    if (years > 0) label += `${years}y `;
    if (months > 0) label += `${months}m `;
    if (years === 0) label += `${days}d`;
    label = label.trim() || `${diffDays}d`;

    let color = "green";
    if (diffDays <= 30) color = "yellow";
    if (diffDays <= 7) color = "orange";

    return { label: `${label} left`, color, days: diffDays };
};

// Badge color map (Tailwind)
const badgeColorMap = {
    red: "bg-red-50 text-red-700 border-red-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    green: "bg-green-50 text-green-700 border-green-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
};

    // Define table columns
    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                Header: "Invoice No.",
                accessor: "invoice_number",
                Cell: ({ value }) => (
                    <span className="font-medium text-blue-600">{value}</span>
                ),
            },
            {
                Header: "Customer",
                accessor: "customer_name",
            },
            {
                Header: "Service Type",
                accessor: "service_type",
            },
            {
                Header: "Grand Total",
                accessor: "grand_total",
                Cell: ({ value }) => (
                    <span>{Number(value).toLocaleString()}</span>
                ),
            },
            {
                Header: "Duration",
                accessor: "duration",
                Cell: ({ row }) => (
                    <span>
                        {row.original.duration_value}{" "}
                        {row.original.duration_unit}
                    </span>
                ),
            },
            {
                Header: "Expiry Date",
                accessor: "expiry_date",
            },
            {
    Header: "Remaining Time",
    accessor: "remaining_time",
    Cell: ({ row }) => {
        const { label, color } = getRemainingTime(row.original.expiry_date);
        return (
            <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${badgeColorMap[color]}`}
            >
                {label}
            </span>
        );
    },
},
            {
                Header: "Invoice Date",
                accessor: "invoice_date",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <button
                        onClick={() => openDeleteModal(row.original.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                ),
                disableSortBy: true,
            },
        ],
        [openDeleteModal],
    );

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <AdminWrapper>
                <Head title="Service Contracts" />
                <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                            Service Contracts
                        </h2>
                        {/* <span className="text-sm text-gray-500">
                            {filteredData.length} record(s)
                        </span> */}
                        <div className="">
                        <input
                            type="text"
                            placeholder="Search by customer, service type, or invoice number..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    </div>

                    {/* Search */}
                    {/* <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by customer, service type, or invoice number..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div> */}

                    {/* MyTable Component with integrated loading */}
                    {loading ? (
                        <PageLoader />

                    ):(
                        <MyTable
                            columns={columns}
                            data={filteredData}
                        />
                    )}
                    {/* <MyTable
                        columns={columns}
                        data={filteredData}
                        loading={loading}
                    /> */}
                </div>
            </AdminWrapper>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            Confirm Deletion
                        </h3>
                        <p className="text-sm text-gray-500 mb-5">
                            This action is irreversible. Enter your password to
                            proceed.
                        </p>

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleDelete()
                                }
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        <div className="flex gap-3 justify-end mt-5">
                            <button
                                onClick={closeDeleteModal}
                                disabled={deleteLoading}
                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-60"
                            >
                                {deleteLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ServiceContracts;
