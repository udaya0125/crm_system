import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import React, { use, useEffect, useMemo, useState } from "react";

const TICKET_PRIORITY_STYLES = {
    high: "bg-red-50 text-red-600 border border-red-200",
    medium: "bg-orange-50 text-orange-600 border border-orange-200",
    low: "bg-gray-100 text-gray-500 border border-gray-200",
    urgent: "bg-red-100 text-red-700 border border-red-200",
};

const TICKET_STATUS_STYLES = {
    open: "bg-blue-100 text-blue-700 border border-blue-200",
    "in-progress": "bg-amber-100 text-amber-700 border border-amber-200",
    resolved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    closed: "bg-gray-100 text-gray-500 border border-gray-200",
    pending: "bg-orange-100 text-orange-700 border border-orange-200",
};

const TicketDashboard = () => {
    const [allTickets, setAllTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [ticketsLoading, setTicketsLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            setTicketsLoading(true);
            try {
                const response = await axios.get(route("ourtickets.index"));
                setAllTickets(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setTicketsLoading(false);
            }
        };
        fetchTickets();
    }, [reloadTrigger]);

    // Tickets — exclude closed
    const visibleTickets = allTickets.filter(
        (t) => t.status?.toLowerCase() !== "closed",
    );
    // Tickets Table Columns
    const ticketColumns = useMemo(
        () => [
            {
                Header: "#",
                accessor: (row, idx) => idx + 1,
            },
            {
                Header: "Ticket ID",
                accessor: (row) => (
                    <span className="font-mono text-xs  text-gray-700 px-2 py-0.5 ">
                        {row.ticket_id ?? `#${row.id}`}
                    </span>
                ),
            },
            {
                Header: "Client",
                accessor: (row) => (
                    <div className="font-medium text-gray-900">
                        {row.client_name}
                    </div>
                ),
            },
            {
                Header: "Issue Type",
                accessor: (row) => row.issue_type ?? "—",
            },
            {
                Header: "Device",
                accessor: (row) => row.device_type ?? "—",
            },
            {
                Header: "Description",
                accessor: (row) => (
                    <span
                        className="block truncate max-w-[200px]"
                        title={row.problem_description}
                    >
                        {row.problem_description ?? "—"}
                    </span>
                ),
            },
            {
                Header: "Priority",
                accessor: (row) => {
                    const priorityKey = row.priority?.toLowerCase();
                    return (
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                TICKET_PRIORITY_STYLES[priorityKey] ??
                                "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                        >
                            {row.priority ?? "—"}
                        </span>
                    );
                },
            },
            {
                Header: "Technician",
                accessor: (row) =>
                    row.technician_name ?? (
                        <span className="text-gray-300">Unassigned</span>
                    ),
            },
            {
                Header: "Status",
                accessor: (row) => {
                    const statusKey = row.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-");
                    return (
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap ${
                                TICKET_STATUS_STYLES[statusKey] ??
                                "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                        >
                            {row.status ?? "—"}
                        </span>
                    );
                },
            },
            {
                Header: "Created",
                accessor: (row) =>
                    row.created_at
                        ? new Date(row.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                          })
                        : "—",
            },
        ],
        [],
    );
    return (
        <div>
            {/* Tickets Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">
                        Support Tickets
                    </h2>
                </div>

                {ticketsLoading ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        Loading tickets…
                    </div>
                ) : visibleTickets.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No active tickets found.
                    </div>
                ) : (
                    <MyTable columns={ticketColumns} data={visibleTickets} />
                )}
            </div>
        </div>
    );
};

export default TicketDashboard;
