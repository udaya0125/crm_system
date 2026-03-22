import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import React, { use, useEffect, useMemo, useState } from "react";

const HostingDashboard = () => {
    const [allHosting, setAllHosting] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    useEffect(() => {
        const fetchHosting = async () => {
            try {
                const response = await axios.get(route("ourhostings.index"));
                setAllHosting(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        fetchHosting();
    }, [reloadTrigger]);

    // Hosting Table Columns
    const hostingColumns = useMemo(
        () => [
            {
                Header: "#",
                accessor: (row, idx) => idx + 1,
            },
            {
                Header: "Client",
                accessor: (row) => (
                    <div className="font-medium text-gray-900">
                        {row.client?.organization_name ??
                            row.client?.name ??
                            "—"}
                    </div>
                ),
            },
            {
                Header: "Hosting Provider",
                accessor: (row) => row.hosting_provider ?? "—",
            },
            {
                Header: "Hosting Plan",
                accessor: (row) => row.hosting_plan ?? "—",
            },
            {
                Header: "Disk Usage",
                accessor: (row) => row.disk_usage ?? "—",
            },
            {
                Header: "Renewal Date",
                accessor: "renewal_date",
            },
            {
                Header: "Days Left",
                accessor: (row) => {
                    if (!row.renewal_date) return "—";
                    const daysLeft = Math.ceil(
                        (new Date(row.renewal_date) - new Date()) /
                            (1000 * 60 * 60 * 24),
                    );
                    const isExpired = daysLeft < 0;
                    const isCritical = daysLeft <= 7 && daysLeft >= 0;

                    return (
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                isExpired
                                    ? "bg-red-100 text-red-700 border-red-200"
                                    : isCritical
                                      ? "bg-orange-100 text-orange-700 border-orange-200"
                                      : "bg-amber-100 text-amber-700 border-amber-200"
                            }`}
                        >
                            {isExpired
                                ? `Expired ${Math.abs(daysLeft)}d ago`
                                : `${daysLeft}d left`}
                        </span>
                    );
                },
            },
        ],
        [],
    );
    return (
        <div>
            {/* Hosting Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">
                        Hosting Renewals Due Soon
                    </h2>
                </div>

                {allHosting.filter((h) => {
                    if (!h.renewal_date) return false;
                    const diff =
                        (new Date(h.renewal_date) - new Date()) /
                        (1000 * 60 * 60 * 24);
                    return diff <= 30;
                }).length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No hosting renewals due within 30 days.
                    </div>
                ) : (
                    <MyTable
                        columns={hostingColumns}
                        data={allHosting
                            .filter((h) => {
                                if (!h.renewal_date) return false;
                                const diff =
                                    (new Date(h.renewal_date) - new Date()) /
                                    (1000 * 60 * 60 * 24);
                                return diff <= 30;
                            })
                            .sort(
                                (a, b) =>
                                    new Date(a.renewal_date) -
                                    new Date(b.renewal_date),
                            )}
                    />
                )}
            </div>
        </div>
    );
};

export default HostingDashboard;
