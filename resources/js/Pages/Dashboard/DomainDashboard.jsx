import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import React, { use, useEffect, useMemo, useState } from "react";

const DomainDashboard = () => {
    const [allDomain, setAllDomain] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDomain = async () => {
            try {
                const response = await axios.get(route("ourdomains.index"));
                setAllDomain(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        fetchDomain();
    }, [reloadTrigger]);
    // Domains Table Columns
    const domainColumns = useMemo(
        () => [
            {
                Header: "#",
                accessor: (row, idx) => idx + 1,
            },
            {
                Header: "Domain",
                accessor: (row) => (
                    <div className="font-medium text-gray-900">
                        {row.domain_name}
                    </div>
                ),
            },
            {
                Header: "Client",
                accessor: (row) =>
                    row.client?.organization_name ?? row.client?.name ?? "—",
            },
            {
                Header: "Registrar",
                accessor: "register",
            },
            {
                Header: "Purchase Date",
                accessor: "purchase_date",
            },
            {
                Header: "Expiry Date",
                accessor: "expiry_date",
            },
            {
                Header: "Days Left",
                accessor: (row) => {
                    if (!row.expiry_date) return "—";
                    const daysLeft = Math.ceil(
                        (new Date(row.expiry_date) - new Date()) /
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
            {
                Header: "Auto Renewal",
                accessor: (row) => (
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${
                            row.auto_renewal_status?.toLowerCase() === "active"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                    >
                        {row.auto_renewal_status ?? "—"}
                    </span>
                ),
            },
            {
                Header: "DNS Provider",
                accessor: (row) => row.dns_provider ?? "—",
            },
        ],
        [],
    );
    return (
        <div>
            {/* Domain Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">
                        Domains Expiring Soon
                    </h2>
                </div>

                {allDomain.filter((d) => {
                    if (!d.expiry_date) return false;
                    const diff =
                        (new Date(d.expiry_date) - new Date()) /
                        (1000 * 60 * 60 * 24);
                    return diff <= 30;
                }).length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No domains expiring within 30 days.
                    </div>
                ) : (
                    <MyTable
                        columns={domainColumns}
                        data={allDomain
                            .filter((d) => {
                                if (!d.expiry_date) return false;
                                const diff =
                                    (new Date(d.expiry_date) - new Date()) /
                                    (1000 * 60 * 60 * 24);
                                return diff <= 30;
                            })
                            .sort(
                                (a, b) =>
                                    new Date(a.expiry_date) -
                                    new Date(b.expiry_date),
                            )}
                    />
                )}
            </div>
        </div>
    );
};

export default DomainDashboard;
