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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />

            <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-start justify-between gap-3">
                {/* Left: count + label */}
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Tickets
                    </p>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums">
                                {openTickets.length}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-blue-600 leading-snug">
                                Open Ticket{openTickets.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Raise new tickets or check details and status of existing tickets.
                    </p>
                </div>

                {/* Right: icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500"
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