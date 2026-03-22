// import MyTable from "@/TableComponents/MyTable";
// import axios from "axios";
// import React, { useEffect, useMemo, useState } from "react";

// const ExpiryDashboard = () => {
//     const [allExpiration, setAllExpiration] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [reloadTrigger, setReloadTrigger] = useState(0);

//     // For fetching the expiration data
//     useEffect(() => {
//         const fetchExpiration = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourexpirations.index"));
//                 const data = response.data.data || response.data;
//                 setAllExpiration(data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 alert("Error loading expirations");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchExpiration();
//     }, [reloadTrigger]);

//     // Filter expirations with less than 30 days remaining
//     const getExpiringSoon = () => {
//         const today = new Date();
//         return allExpiration.filter((item) => {
//             const expirationDate = new Date(item.expiration_date);
//             const diffTime = expirationDate - today;
//             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//             return diffDays <= 30 && diffDays >= 0; // Include only future expirations within 30 days
//         });
//     };

//     // Calculate days remaining
//     const getDaysRemaining = (expirationDate) => {
//         const today = new Date();
//         const expDate = new Date(expirationDate);
//         const diffTime = expDate - today;
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         return diffDays;
//     };

//     // Get status badge color based on days remaining
//     const getStatusColor = (daysRemaining) => {
//         if (daysRemaining <= 7) return "bg-red-100 text-red-800";
//         if (daysRemaining <= 15) return "bg-orange-100 text-orange-800";
//         if (daysRemaining <= 30) return "bg-yellow-100 text-yellow-800";
//         return "bg-green-100 text-green-800";
//     };

//     const expiringSoon = getExpiringSoon();

//     // Define columns for react-table
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
//                 Header: "Last Renewal",
//                 accessor: "last_renewal_date",
//                 Cell: ({ value }) => (
//                     <div className="text-sm text-gray-500">
//                         {value ? new Date(value).toLocaleDateString() : "N/A"}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Expiration Date",
//                 accessor: "expiration_date",
//                 Cell: ({ value }) => (
//                     <div className="text-sm text-gray-900 font-medium">
//                         {new Date(value).toLocaleDateString()}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Status",
//                 accessor: "status",
//                 Cell: ({ row }) => {
//                     const daysRemaining = getDaysRemaining(
//                         row.original.expiration_date,
//                     );
//                     const statusColor = getStatusColor(daysRemaining);
//                     const statusText =
//                         daysRemaining <= 7
//                             ? "Critical"
//                             : daysRemaining <= 15
//                               ? "Warning"
//                               : daysRemaining <= 30
//                                 ? "Attention"
//                                 : "Good";

//                     return (
//                         <span
//                             className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}
//                         >
//                             {statusText}
//                         </span>
//                     );
//                 },
//             },
//         ],
//         [],
//     );
//     return (
//         <div>
//             {/* Expiring Soon Table */}
//             <div className="mb-8">
//                 <div className="flex items-center gap-3 mb-6">
//                     <h3 className="text-xl font-semibold text-gray-800">
//                         Expiring Within 30 Days
//                     </h3>
//                 </div>

//                 {expiringSoon.length === 0 ? (
//                     <div className="text-center py-8 text-gray-500">
//                         No items expiring within the next 30 days
//                     </div>
//                 ) : (
//                     <MyTable columns={columns} data={expiringSoon} />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ExpiryDashboard;


import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";

const ExpiryDashboard = () => {
    const [allExpiration, setAllExpiration] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchExpiration = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourexpirations.index"));
                const data = response.data.data || response.data;
                setAllExpiration(data);
            } catch (error) {
                console.error("fetching error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExpiration();
    }, []);

    const expiringSoon = useMemo(() => {
        const today = new Date();
        return allExpiration.filter((item) => {
            const expirationDate = new Date(item.expiration_date);
            const diffTime = expirationDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 40 && diffDays >= 0;
        });
    }, [allExpiration]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-64">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />

            <div className="px-6 py-5 flex items-start justify-between">
                {/* Left: count + label */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Expirations
                    </p>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-gray-900 tabular-nums">
                                {expiringSoon.length}
                            </span>
                            <span className="text-sm font-medium text-amber-600">
                                Expiring Soon
                            </span>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Items expiring within the next 40 days.
                    </p>
                </div>

                {/* Right: icon */}
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <svg
                        className="w-6 h-6 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Action buttons */}
             <div className="grid grid-cols-1 border-t border-gray-100">
                <Link
                    href="/expiration"
                    className="py-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ExpiryDashboard;
