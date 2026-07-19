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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500" />

            <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-start justify-between gap-3">
                {/* Left: count + label */}
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Hosting
                    </p>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums">
                                {renewalsDueSoon.length}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-violet-600 leading-snug">
                                Renewal{renewalsDueSoon.length !== 1 ? "s" : ""} Due
                            </span>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Hosting renewals due within the next 45 days.
                    </p>
                </div>

                {/* Right: icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-violet-500"
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