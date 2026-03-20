import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Link, usePage } from "@inertiajs/react";
import React, { useEffect, useState, useMemo } from "react";
import {
    Building2,
    User,
    Users,
    ClipboardCheck,
    Calendar,
    AlertTriangle,
} from "lucide-react";
import MyTable from "@/TableComponents/MyTable";
import ClientDashboard from "../Dashboard/ClientDashboard";

const Dashboard = () => {
    const [allExpiration, setAllExpiration] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const cards = [
        {
            title: "Task Management",
            breadcrumb: "Tasks",
            icon: Users,
            link: "/tasks",
        },
        {
            title: "To Do List",
            breadcrumb: "To Do",
            icon: ClipboardCheck,
            link: "/todo",
        },
    ];

    // For fetching the expiration data
    useEffect(() => {
        const fetchExpiration = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourexpirations.index"));
                const data = response.data.data || response.data;
                setAllExpiration(data);
            } catch (error) {
                console.error("fetching error ", error);
                alert("Error loading expirations");
            } finally {
                setLoading(false);
            }
        };

        fetchExpiration();
    }, [reloadTrigger]);

    const user = usePage().props.auth.user;
    const isAdmin = user?.role === "admin";
    const isUser = user?.role === "user";

    // Filter expirations with less than 30 days remaining
    const getExpiringSoon = () => {
        const today = new Date();
        return allExpiration.filter((item) => {
            const expirationDate = new Date(item.expiration_date);
            const diffTime = expirationDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 30 && diffDays >= 0; // Include only future expirations within 30 days
        });
    };

    // Calculate days remaining
    const getDaysRemaining = (expirationDate) => {
        const today = new Date();
        const expDate = new Date(expirationDate);
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Get status badge color based on days remaining
    const getStatusColor = (daysRemaining) => {
        if (daysRemaining <= 7) return "bg-red-100 text-red-800";
        if (daysRemaining <= 15) return "bg-orange-100 text-orange-800";
        if (daysRemaining <= 30) return "bg-yellow-100 text-yellow-800";
        return "bg-green-100 text-green-800";
    };

    const expiringSoon = getExpiringSoon();

    // Define columns for react-table
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
                Header: "Last Renewal",
                accessor: "last_renewal_date",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-500">
                        {value ? new Date(value).toLocaleDateString() : "N/A"}
                    </div>
                ),
            },
            {
                Header: "Expiration Date",
                accessor: "expiration_date",
                Cell: ({ value }) => (
                    <div className="text-sm text-gray-900 font-medium">
                        {new Date(value).toLocaleDateString()}
                    </div>
                ),
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ row }) => {
                    const daysRemaining = getDaysRemaining(
                        row.original.expiration_date,
                    );
                    const statusColor = getStatusColor(daysRemaining);
                    const statusText =
                        daysRemaining <= 7
                            ? "Critical"
                            : daysRemaining <= 15
                              ? "Warning"
                              : daysRemaining <= 30
                                ? "Attention"
                                : "Good";

                    return (
                        <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}
                        >
                            {statusText}
                        </span>
                    );
                },
            },
        ],
        [],
    );

    // Loading spinner component
    const LoadingSpinner = () => (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
        </div>
    );

    return (
        <>
            <AdminWrapper>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {isAdmin && (
                            <div className="mx-auto py-4">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                    Admin Dashboard
                                </h2>

                                {/* Expiring Soon Table */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            Expiring Within 30 Days
                                        </h3>
                                    </div>

                                    {expiringSoon.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No items expiring within the next 30 days
                                        </div>
                                    ) : (
                                        <MyTable
                                            columns={columns}
                                            data={expiringSoon}
                                        />
                                    )}
                                </div>
                                 <ClientDashboard/>
                            </div>
                           
                        )}

                        {isUser && (
                            <>
                                <div className="max-w-7xl mx-auto py-4">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-10">
                                        Dashboard
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {cards.map((card, index) => {
                                            const Icon = card.icon;

                                            return (
                                                <Link
                                                    key={index}
                                                    href={card.link}
                                                    className="block"
                                                >
                                                    <div className="bg-white rounded-2xl p-6 min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
                                                        {/* Card Top Breadcrumb */}
                                                        <div className="flex items-center gap-2 mb-6">
                                                            <span className="text-xl font-semibold text-gray-800">
                                                                Home
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                | {card.breadcrumb}
                                                            </span>
                                                        </div>

                                                        {/* Card Content */}
                                                        <div className="flex items-center gap-6">
                                                            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
                                                                <Icon className="w-7 h-7 text-gray-700" />
                                                            </div>

                                                            <h3 className="text-lg font-medium text-gray-800">
                                                                {card.title}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </AdminWrapper>
        </>
    );
};

export default Dashboard;