import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";

const DomainDashboard = () => {
    const [allDomain, setAllDomain] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDomain = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourdomains.index"));
                setAllDomain(response.data.data);
            } catch (error) {
                console.error("fetching error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDomain();
    }, []);

    const expiringDomains = useMemo(() => {
        return allDomain.filter((d) => {
            if (!d.expiry_date) return false;
            const diff =
                (new Date(d.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
            return diff <= 45;
        });
    }, [allDomain]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-64">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 to-cyan-500" />

            <div className="px-6 py-5 flex items-start justify-between">
                {/* Left: count + label */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Domains
                    </p>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-gray-900 tabular-nums">
                                {expiringDomains.length}
                            </span>
                            <span className="text-sm font-medium text-sky-600">
                                Expiring Soon
                            </span>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Domains expiring within the next 45 days.
                    </p>
                </div>

                {/* Right: icon */}
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                    <svg
                        className="w-6 h-6 text-sky-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                        />
                    </svg>
                </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 border-t border-gray-100">
                <Link
                    href="/domain-tracking"
                    className="py-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default DomainDashboard;




// import MyTable from "@/TableComponents/MyTable";
// import axios from "axios";
// import React, { use, useEffect, useMemo, useState } from "react";

// const DomainDashboard = () => {
//     const [allDomain, setAllDomain] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(0);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchDomain = async () => {
//             try {
//                 const response = await axios.get(route("ourdomains.index"));
//                 setAllDomain(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         fetchDomain();
//     }, [reloadTrigger]);
//     // Domains Table Columns
//     const domainColumns = useMemo(
//         () => [
//             {
//                 Header: "#",
//                 accessor: (row, idx) => idx + 1,
//             },
//             {
//                 Header: "Domain",
//                 accessor: (row) => (
//                     <div className="font-medium text-gray-900">
//                         {row.domain_name}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Client",
//                 accessor: (row) =>
//                     row.client?.organization_name ?? row.client?.name ?? "—",
//             },
//             {
//                 Header: "Registrar",
//                 accessor: "register",
//             },
//             {
//                 Header: "Purchase Date",
//                 accessor: "purchase_date",
//             },
//             {
//                 Header: "Expiry Date",
//                 accessor: "expiry_date",
//             },
//             {
//                 Header: "Days Left",
//                 accessor: (row) => {
//                     if (!row.expiry_date) return "—";
//                     const daysLeft = Math.ceil(
//                         (new Date(row.expiry_date) - new Date()) /
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
//             {
//                 Header: "Auto Renewal",
//                 accessor: (row) => (
//                     <span
//                         className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${
//                             row.auto_renewal_status?.toLowerCase() === "active"
//                                 ? "bg-emerald-100 text-emerald-700 border-emerald-200"
//                                 : "bg-gray-100 text-gray-500 border-gray-200"
//                         }`}
//                     >
//                         {row.auto_renewal_status ?? "—"}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "DNS Provider",
//                 accessor: (row) => row.dns_provider ?? "—",
//             },
//         ],
//         [],
//     );
//     return (
//         <div>
//             {/* Domain Table */}
//             <div className="mb-8">
//                 <div className="flex items-center gap-3 mb-6">
//                     <h3 className="text-xl font-semibold py-4 text-gray-800">
//                         Domains Expiring Within 30 Days
//                     </h3>
//                 </div>

//                 {allDomain.filter((d) => {
//                     if (!d.expiry_date) return false;
//                     const diff =
//                         (new Date(d.expiry_date) - new Date()) /
//                         (1000 * 60 * 60 * 24);
//                     return diff <= 30;
//                 }).length === 0 ? (
//                     <div className="py-16 text-center text-gray-400 text-sm">
//                         No domains expiring within 30 days.
//                     </div>
//                 ) : (
//                     <MyTable
//                         columns={domainColumns}
//                         data={allDomain
//                             .filter((d) => {
//                                 if (!d.expiry_date) return false;
//                                 const diff =
//                                     (new Date(d.expiry_date) - new Date()) /
//                                     (1000 * 60 * 60 * 24);
//                                 return diff <= 30;
//                             })
//                             .sort(
//                                 (a, b) =>
//                                     new Date(a.expiry_date) -
//                                     new Date(b.expiry_date),
//                             )}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DomainDashboard;
