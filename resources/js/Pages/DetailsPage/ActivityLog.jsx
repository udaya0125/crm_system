import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import MyTable from "@/TableComponents/MyTable";


const ActivityLog = () => {
    const [allLogs, setAllLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourlogs.index"));
                const data = response.data?.data ?? response.data;
                setAllLogs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Fetching error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return allLogs.filter(
            (log) =>
                log.name?.toLowerCase().includes(q) ||
                log.title?.toLowerCase().includes(q) ||
                log.ip_address?.toLowerCase().includes(q)
        );
    }, [allLogs, search]);

    const columns = useMemo(
        () => [
            {
                Header: "#",
                id: "row_number",
                Cell: ({ row }) => (
                    <span className="text-gray-400 text-sm">{row.index + 1}</span>
                ),
                disableSortBy: true,
            },
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ value }) => (
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {value?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                            {value ?? "Unknown"}
                        </span>
                    </div>
                ),
            },
            {
                Header: "Action",
                accessor: "title",
            },
            {
                Header: "IP Address",
                accessor: "ip_address",
                Cell: ({ value }) => (
                    <span className="text-sm text-gray-500 font-mono">
                        {value ?? "—"}
                    </span>
                ),
            },
            {
                Header: "Date & Time",
                accessor: "created_at",
                Cell: ({ value }) => (
                    <span className="text-sm text-gray-500">
                        {value ? new Date(value).toLocaleString() : "—"}
                    </span>
                ),
            },
        ],
        []
    );

    return (
        <AdminWrapper>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Activity Log
                    </h1>
                    <span className="text-sm text-gray-500">
                        {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Search
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Search by name, action, or IP..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div> */}

                {/* Loading */}
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                        <svg
                            className="animate-spin h-5 w-5 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                            />
                        </svg>
                        Loading logs...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-sm">
                        No activity logs found.
                    </div>
                ) : (
                    <MyTable columns={columns} data={filtered} />
                )}
            </div>
        </AdminWrapper>
    );
};

export default ActivityLog;