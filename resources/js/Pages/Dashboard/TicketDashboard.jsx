// import MyTable from "@/TableComponents/MyTable";
// import axios from "axios";
// import React, { use, useEffect, useMemo, useState } from "react";

// const TICKET_PRIORITY_STYLES = {
//     high: "bg-red-50 text-red-600 border border-red-200",
//     medium: "bg-orange-50 text-orange-600 border border-orange-200",
//     low: "bg-green-100 text-green-700 border border-green-200",
//     urgent: "bg-red-100 text-red-700 border border-red-200",
// };

// const TICKET_STATUS_STYLES = {
//     open: "bg-blue-100 text-blue-700 border border-blue-200",
//     "in-progress": "bg-amber-100 text-amber-700 border border-amber-200",
//     resolved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
//     closed: "bg-gray-100 text-gray-500 border border-gray-200",
//     pending: "bg-orange-100 text-orange-700 border border-orange-200",
// };

// const TicketDashboard = () => {
//     const [allTickets, setAllTickets] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [reloadTrigger, setReloadTrigger] = useState(0);
//     const [ticketsLoading, setTicketsLoading] = useState(true);

//     useEffect(() => {
//         const fetchTickets = async () => {
//             setTicketsLoading(true);
//             try {
//                 const response = await axios.get(route("ourtickets.index"));
//                 setAllTickets(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setTicketsLoading(false);
//             }
//         };
//         fetchTickets();
//     }, [reloadTrigger]);

//     // Tickets — exclude closed
//     const visibleTickets = allTickets.filter(
//         (t) => t.status?.toLowerCase() !== "closed",
//     );
//     // Tickets Table Columns
//     const ticketColumns = useMemo(
//         () => [
//             {
//                 Header: "#",
//                 accessor: (row, idx) => idx + 1,
//             },
//             {
//                 Header: "Ticket ID",
//                 accessor: (row) => (
//                     <span className="font-mono text-xs  text-gray-700 px-2 py-0.5 ">
//                         {row.ticket_id ?? `#${row.id}`}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Client",
//                 accessor: (row) => (
//                     <div className="font-medium text-gray-900">
//                         {row.client_name}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Issue Type",
//                 accessor: (row) => row.issue_type ?? "—",
//             },
//             {
//                 Header: "Device",
//                 accessor: (row) => row.device_type ?? "—",
//             },
//             {
//                 Header: "Description",
//                 accessor: (row) => (
//                     <span
//                         className="block truncate max-w-[200px]"
//                         title={row.problem_description}
//                     >
//                         {row.problem_description ?? "—"}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Priority",
//                 accessor: (row) => {
//                     const priorityKey = row.priority?.toLowerCase();
//                     return (
//                         <span
//                             className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
//                                 TICKET_PRIORITY_STYLES[priorityKey] ??
//                                 "bg-gray-100 text-gray-500 border border-gray-200"
//                             }`}
//                         >
//                             {row.priority ?? "—"}
//                         </span>
//                     );
//                 },
//             },
//             {
//                 Header: "Technician",
//                 accessor: (row) =>
//                     row.technician_name ?? (
//                         <span className="text-gray-300">Unassigned</span>
//                     ),
//             },
//             {
//                 Header: "Status",
//                 accessor: (row) => {
//                     const statusKey = row.status
//                         ?.toLowerCase()
//                         .replace(/\s+/g, "-");
//                     return (
//                         <span
//                             className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap ${
//                                 TICKET_STATUS_STYLES[statusKey] ??
//                                 "bg-gray-100 text-gray-500 border border-gray-200"
//                             }`}
//                         >
//                             {row.status ?? "—"}
//                         </span>
//                     );
//                 },
//             },
//             {
//                 Header: "Created",
//                 accessor: (row) =>
//                     row.created_at
//                         ? new Date(row.created_at).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                               year: "numeric",
//                           })
//                         : "—",
//             },
//         ],
//         [],
//     );
//     return (
//         <div>
//             {/* Tickets Table */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
//                 <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//                     <h2 className="font-semibold text-gray-800">
//                         Support Tickets
//                     </h2>
//                 </div>

//                 {ticketsLoading ? (
//                     <div className="py-16 text-center text-gray-400 text-sm">
//                         Loading tickets…
//                     </div>
//                 ) : visibleTickets.length === 0 ? (
//                     <div className="py-16 text-center text-gray-400 text-sm">
//                         No active tickets found.
//                     </div>
//                 ) : (
//                     <MyTable columns={ticketColumns} data={visibleTickets} />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default TicketDashboard;

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";

const TicketDashboard = () => {
    const [allTickets, setAllTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const res = await axios.get(route("ourtickets.index"));
                setAllTickets(res.data.data);
            } catch (err) {
                console.error("fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const openTickets = useMemo(
        () => allTickets.filter((t) => t.status?.toLowerCase() === "open"),
        [allTickets],
    );

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-64">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />

            <div className="px-6 py-5 flex items-start justify-between">
                {/* Left: count + label */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Tickets
                    </p>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-gray-900 tabular-nums">
                                {openTickets.length}
                            </span>
                            <span className="text-sm font-medium text-blue-600">
                                Open Ticket{openTickets.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Raise new tickets or check details and status of existing tickets.
                    </p>
                </div>

                {/* Right: icon */}
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg
                        className="w-6 h-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                        />
                    </svg>
                </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 border-t border-gray-100">
                <Link
                    href="/ticket"
                    className="py-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default TicketDashboard;
