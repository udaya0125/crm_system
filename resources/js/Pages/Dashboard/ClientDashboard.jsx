import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import MyTable from "@/TableComponents/MyTable";

const PAYMENT_STATUS_STYLES = {
    paid: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    unpaid: "bg-gray-100 text-gray-600 border border-gray-200",
    pending: "bg-amber-100 text-amber-700 border border-amber-200",
    overdue: "bg-red-100 text-red-700 border border-red-200",
    partial: "bg-blue-100 text-blue-700 border border-blue-200",
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(amount ?? 0);

const ClientDashboard = () => {
    const [allClients, setAllClients] = useState([]);
    const [clientsLoading, setClientsLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    useEffect(() => {
        const fetchClients = async () => {
            setClientsLoading(true);
            try {
                const response = await axios.get(
                    route("ourclientmanagement.index"),
                );
                setAllClients(response.data.data);
            } catch (error) {
                console.error("Fetching error:", error);
            } finally {
                setClientsLoading(false);
            }
        };
        fetchClients();
    }, [reloadTrigger]);

    // Clients Table Columns
    const clientColumns = useMemo(
        () => [
            {
                Header: "#",
                accessor: (row, idx) => idx + 1,
            },
            {
                Header: "Company",
                accessor: (row) => (
                    <div>
                        <div className="font-medium text-gray-900">
                            {row.company_name}
                        </div>
                        {row.address && (
                            <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">
                                {row.address}
                            </div>
                        )}
                    </div>
                ),
            },
            {
                Header: "Contact Person",
                accessor: (row) => row.contact_person ?? "—",
            },
            {
                Header: "Email",
                accessor: (row) =>
                    row.email ? (
                        <a
                            href={`mailto:${row.email}`}
                            className="text-blue-600 hover:underline"
                        >
                            {row.email}
                        </a>
                    ) : (
                        "—"
                    ),
            },
            {
                Header: "Phone",
                accessor: (row) => row.phone ?? "—",
            },
            {
                Header: "Service Type",
                accessor: (row) => row.service_type ?? "—",
            },
            {
                Header: "Account Manager",
                accessor: (row) => row.account_manager ?? "—",
            },
            {
                Header: "Projects",
                accessor: (row) => (
                    <span className="font-medium">
                        {row.total_projects ?? "—"}
                    </span>
                ),
            },
            {
                Header: "Revenue",
                accessor: (row) => (
                    <span className="font-medium text-gray-800">
                        {row.total_revenue != null
                            ? formatCurrency(row.total_revenue)
                            : "—"}
                    </span>
                ),
            },
            {
                Header: "Payment Status",
                accessor: (row) => {
                    const paymentStatusKey = row.payment_status?.toLowerCase();
                    return row.payment_status ? (
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap ${
                                PAYMENT_STATUS_STYLES[paymentStatusKey] ??
                                "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                        >
                            {row.payment_status}
                        </span>
                    ) : (
                        "—"
                    );
                },
            },
        ],
        [],
    );

    return (
        <div>
            {/* Clients Table */}
            <div className=" overflow-hidden mb-8">
                <div className="flex items-center justify-between py-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Clients</h2>
                </div>
                {clientsLoading ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        Loading clients…
                    </div>
                ) : allClients.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No clients found.
                    </div>
                ) : (
                    <MyTable
                        columns={clientColumns}
                        data={allClients.filter(
                            (c) => c.payment_status?.toLowerCase() !== "paid",
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
