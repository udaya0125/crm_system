// import MyTable from "@/TableComponents/MyTable";
// import axios from "axios";
// import React, { use, useEffect, useMemo, useState } from "react";

// const HostingDashboard = () => {
//     const [allHosting, setAllHosting] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [reloadTrigger, setReloadTrigger] = useState(0);

//     useEffect(() => {
//         const fetchHosting = async () => {
//             try {
//                 const response = await axios.get(route("ourhostings.index"));
//                 setAllHosting(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         fetchHosting();
//     }, [reloadTrigger]);

//     // Hosting Table Columns
//     const hostingColumns = useMemo(
//         () => [
//             {
//                 Header: "#",
//                 accessor: (row, idx) => idx + 1,
//             },
//             {
//                 Header: "Client",
//                 accessor: (row) => (
//                     <div className="font-medium text-gray-900">
//                         {row.client?.organization_name ??
//                             row.client?.name ??
//                             "—"}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Hosting Provider",
//                 accessor: (row) => row.hosting_provider ?? "—",
//             },
//             {
//                 Header: "Hosting Plan",
//                 accessor: (row) => row.hosting_plan ?? "—",
//             },
//             {
//                 Header: "Disk Usage",
//                 accessor: (row) => row.disk_usage ?? "—",
//             },
//             {
//                 Header: "Renewal Date",
//                 accessor: "renewal_date",
//             },
//             {
//                 Header: "Days Left",
//                 accessor: (row) => {
//                     if (!row.renewal_date) return "—";
//                     const daysLeft = Math.ceil(
//                         (new Date(row.renewal_date) - new Date()) /
//                             (1000 * 60 * 60 * 24),
//                     );
//                     const isExpired = daysLeft < 0;
//                     const isCritical = daysLeft <= 7 && daysLeft >= 0;

//                     return (
//                         <span
//                             className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
//                                 isExpired
//                                     ? "bg-red-100 text-red-700 border-red-200"
//                                     : isCritical
//                                       ? "bg-orange-100 text-orange-700 border-orange-200"
//                                       : "bg-amber-100 text-amber-700 border-amber-200"
//                             }`}
//                         >
//                             {isExpired
//                                 ? `Expired ${Math.abs(daysLeft)}d ago`
//                                 : `${daysLeft}d left`}
//                         </span>
//                     );
//                 },
//             },
//         ],
//         [],
//     );
//     return (
//         <div>
//             {/* Hosting Table */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//                     <h2 className="font-semibold text-gray-800">
//                         Hosting Renewals Due Soon
//                     </h2>
//                 </div>

//                 {allHosting.filter((h) => {
//                     if (!h.renewal_date) return false;
//                     const diff =
//                         (new Date(h.renewal_date) - new Date()) /
//                         (1000 * 60 * 60 * 24);
//                     return diff <= 30;
//                 }).length === 0 ? (
//                     <div className="py-16 text-center text-gray-400 text-sm">
//                         No hosting renewals due within 30 days.
//                     </div>
//                 ) : (
//                     <MyTable
//                         columns={hostingColumns}
//                         data={allHosting
//                             .filter((h) => {
//                                 if (!h.renewal_date) return false;
//                                 const diff =
//                                     (new Date(h.renewal_date) - new Date()) /
//                                     (1000 * 60 * 60 * 24);
//                                 return diff <= 30;
//                             })
//                             .sort(
//                                 (a, b) =>
//                                     new Date(a.renewal_date) -
//                                     new Date(b.renewal_date),
//                             )}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default HostingDashboard;


import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";

const HostingDashboard = () => {
    const [allHosting, setAllHosting] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHosting = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourhostings.index"));
                setAllHosting(response.data.data);
            } catch (error) {
                console.error("fetching error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHosting();
    }, []);

    const renewalsDueSoon = useMemo(() => {
        return allHosting.filter((h) => {
            if (!h.renewal_date) return false;
            const diff =
                (new Date(h.renewal_date) - new Date()) / (1000 * 60 * 60 * 24);
            return diff <= 45;
        });
    }, [allHosting]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-64">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500" />

            <div className="px-6 py-5 flex items-start justify-between">
                {/* Left: count + label */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Hosting
                    </p>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-gray-900 tabular-nums">
                                {renewalsDueSoon.length}
                            </span>
                            <span className="text-sm font-medium text-violet-600">
                                Renewal{renewalsDueSoon.length !== 1 ? "s" : ""} Due
                            </span>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Hosting renewals due within the next 45 days.
                    </p>
                </div>

                {/* Right: icon */}
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <svg
                        className="w-6 h-6 text-violet-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12H3a9 9 0 1018 0h-2M12 3v9m0 0l-3-3m3 3l3-3"
                        />
                        <rect x="3" y="19" width="18" height="2" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Action buttons */}
             <div className="grid grid-cols-1 border-t border-gray-100">
                <Link
                    href="/hosting-tracking"
                    className="py-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default HostingDashboard;