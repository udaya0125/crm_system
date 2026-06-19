import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import MyTable from "@/TableComponents/MyTable";
import { Head } from "@inertiajs/react";
import PageLoader from "@/Loader/PageLoader";

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
                log.ip_address?.toLowerCase().includes(q),
        );
    }, [allLogs, search]);

    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
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
        [],
    );

    return (
        <AdminWrapper>
            <Head title="Activity Log" />
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Activity Log
                    </h1>
                    <span className="text-sm text-gray-500">
                        {filtered.length} record
                        {filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Search - Uncommented */}
                {/* <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Search by name, action, or IP..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div> */}

                {/* Pass loading prop to MyTable */}
                {/* <MyTable columns={columns} data={filtered} /> */}
                {loading ? (
                    <PageLoader />
                ) : (
                    <MyTable columns={columns} data={filtered} />
                )}
            </div>
        </AdminWrapper>
    );
};

export default ActivityLog;


// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import MyTable from "@/TableComponents/MyTable";

// const ActivityLog = () => {
//     const [allLogs, setAllLogs] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [search, setSearch] = useState("");

//     useEffect(() => {
//         const fetchLogs = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourlogs.index"));
//                 const data = response.data?.data ?? response.data;
//                 setAllLogs(Array.isArray(data) ? data : []);
//             } catch (error) {
//                 console.error("Fetching error:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchLogs();
//     }, []);

//     const filtered = useMemo(() => {
//         const q = search.toLowerCase();
//         return allLogs.filter(
//             (log) =>
//                 log.name?.toLowerCase().includes(q) ||
//                 log.title?.toLowerCase().includes(q) ||
//                 log.ip_address?.toLowerCase().includes(q),
//         );
//     }, [allLogs, search]);

//     const columns = useMemo(
//         () => [
//             {
//                 Header: "s/n",
//                 accessor: "index",
//                 Cell: ({ row }) => <span>{row.index + 1}</span>,
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//                 Cell: ({ value }) => (
//                     <div className="flex items-center gap-3">
//                         <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
//                             {value?.charAt(0).toUpperCase() ?? "?"}
//                         </div>
//                         <span className="text-sm font-medium text-gray-800">
//                             {value ?? "Unknown"}
//                         </span>
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Action",
//                 accessor: "title",
//             },
//             {
//                 Header: "IP Address",
//                 accessor: "ip_address",
//                 Cell: ({ value }) => (
//                     <span className="text-sm text-gray-500 font-mono">
//                         {value ?? "—"}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Date & Time",
//                 accessor: "created_at",
//                 Cell: ({ value }) => (
//                     <span className="text-sm text-gray-500">
//                         {value ? new Date(value).toLocaleString() : "—"}
//                     </span>
//                 ),
//             },
//         ],
//         [],
//     );

//     return (
//         <AdminWrapper>
//             <div className="p-6">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-6">
//                     <h1 className="text-2xl font-bold text-gray-800">
//                         Activity Log
//                     </h1>
//                     <span className="text-sm text-gray-500">
//                         {filtered.length} record
//                         {filtered.length !== 1 ? "s" : ""}
//                     </span>
//                 </div>

//                 {/* Search
//                 <div className="mb-2">
//                     <input
//                         type="text"
//                         placeholder="Search by name, action, or IP..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div> */}

//                 {/* Loading */}
//                 {loading ? (
//                     <div className="flex justify-center items-center py-8">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//                     </div>
//                 ) : 
//                 filtered.length === 0 ? (
//                     <div className="text-center py-16 text-gray-400 text-sm">
//                         No activity logs found.
//                     </div>
//                 ) : (
//                     <MyTable columns={columns} data={filtered} />
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// export default ActivityLog;
