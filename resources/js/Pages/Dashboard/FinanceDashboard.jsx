// import MyTable from "@/TableComponents/MyTable";
// import axios from "axios";
// import React, { useEffect, useMemo, useState } from "react";

// const FINANCE_STATUS_STYLES = {
//     paid: "bg-emerald-100 text-emerald-700 border border-emerald-200",
//     unpaid: "bg-gray-100 text-gray-600 border border-gray-200",
//     partial: "bg-blue-100 text-blue-700 border border-blue-200",
//     partially_paid: "bg-blue-100 text-blue-700 border border-blue-200",
//     pending: "bg-amber-100 text-amber-700 border border-amber-200",
//     overdue: "bg-red-100 text-red-700 border border-red-200",
// };

// const FINANCE_STATUS_LABELS = {
//     paid: "Paid",
//     unpaid: "Unpaid",
//     partial: "Partial",
//     partially_paid: "Partially Paid",
//     pending: "Pending",
//     overdue: "Overdue",
// };

// const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//         minimumFractionDigits: 2,
//     }).format(amount ?? 0);

// const FinanceDashboard = () => {
//     const [allTracking, setAllTracking] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [reloadTrigger, setReloadTrigger] = useState(0);
//     const [financeLoading, setFinanceLoading] = useState(true);

//     useEffect(() => {
//         const fetchTracking = async () => {
//             setFinanceLoading(true);
//             try {
//                 const response = await axios.get(route("ourfinance.index"));
//                 const trackingData = response.data.data;
//                 console.log(
//                     "Finance statuses:",
//                     trackingData.map((f) => f.status),
//                 );
//                 setAllTracking(trackingData);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setFinanceLoading(false);
//             }
//         };
//         fetchTracking();
//     }, [reloadTrigger]);

//     // Finance Table Columns
//     const financeColumns = useMemo(
//         () => [
//             {
//                 Header: "#",
//                 accessor: (row, idx) => idx + 1,
//             },
//             {
//                 Header: "Client",
//                 accessor: (row) => (
//                     <div className="font-medium text-gray-900">
//                         {row.client}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Project",
//                 accessor: "project",
//             },
//             {
//                 Header: "Invoice Date",
//                 accessor: "invoice_date",
//             },
//             {
//                 Header: "Due Date",
//                 accessor: "due_date",
//             },
//             {
//                 Header: "Amount",
//                 accessor: (row) => (
//                     <span className="font-medium text-gray-800">
//                         {formatCurrency(row.amount)}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Paid",
//                 accessor: (row) => (
//                     <span className="text-emerald-600 font-medium">
//                         {formatCurrency(row.paid_amount)}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Balance",
//                 accessor: (row) => {
//                     const balance =
//                         Number(row.amount ?? 0) - Number(row.paid_amount ?? 0);
//                     return (
//                         <span
//                             className={`font-medium ${balance > 0 ? "text-amber-600" : "text-gray-400"}`}
//                         >
//                             {formatCurrency(balance)}
//                         </span>
//                     );
//                 },
//             },
//             {
//                 Header: "Status",
//                 accessor: (row) => {
//                     const statusKey = row.status?.toLowerCase();
//                     return (
//                         <span
//                             className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
//                                 FINANCE_STATUS_STYLES[statusKey] ??
//                                 "bg-gray-100 text-gray-600 border border-gray-200"
//                             }`}
//                         >
//                             {FINANCE_STATUS_LABELS[statusKey] ??
//                                 row.status ??
//                                 "—"}
//                         </span>
//                     );
//                 },
//             },
//             {
//                 Header: "Payment",
//                 accessor: (row) => {
//                     const paymentPct = row.amount
//                         ? Math.min(
//                               100,
//                               Math.round(
//                                   (Number(row.paid_amount ?? 0) /
//                                       Number(row.amount)) *
//                                       100,
//                               ),
//                           )
//                         : 0;
//                     return (
//                         <div className="flex items-center gap-2">
//                             <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                                 <div
//                                     className="h-full bg-emerald-500 rounded-full transition-all"
//                                     style={{ width: `${paymentPct}%` }}
//                                 />
//                             </div>
//                             <span className="text-xs text-gray-500 w-8">
//                                 {paymentPct}%
//                             </span>
//                         </div>
//                     );
//                 },
//             },
//         ],
//         [],
//     );
//     return (
//         <div>
//             {/* Finance Tracking Section */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
//                 <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//                     <h2 className="font-semibold text-gray-800">
//                         Finance Tracking
//                     </h2>
//                 </div>
//                 {financeLoading ? (
//                     <div className="py-16 text-center text-gray-400 text-sm">
//                         Loading finance records…
//                     </div>
//                 ) : allTracking.length === 0 ? (
//                     <div className="py-16 text-center text-gray-400 text-sm">
//                         No finance records found.
//                     </div>
//                 ) : (
//                     <MyTable
//                         columns={financeColumns}
//                         data={allTracking.filter(
//                             (f) => f.status?.toLowerCase() !== "paid",
//                         )}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FinanceDashboard;


import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const FinanceDashboard = () => {
    const [allTracking, setAllTracking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTracking = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourfinance.index"));
                setAllTracking(response.data.data);
            } catch (error) {
                console.error("fetching error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTracking();
    }, []);

    const unpaidRecords = useMemo(
        () => allTracking.filter((f) => f.status?.toLowerCase() !== "paid"),
        [allTracking],
    );

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-64">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />

            <div className="px-6 py-5 flex items-start justify-between">
                {/* Left: count + label */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Finance
                    </p>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-gray-900 tabular-nums">
                                {unpaidRecords.length}
                            </span>
                            <span className="text-sm font-medium text-emerald-600">
                                Unpaid Record{unpaidRecords.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Track invoices and monitor outstanding payments.
                    </p>
                </div>

                {/* Right: icon */}
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <svg
                        className="w-6 h-6 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 border-t border-gray-100">
                <button className="py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors border-r border-gray-100">
                    My Finance
                </button>
                <button className="py-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors">
                    Add Record
                </button>
            </div>
        </div>
    );
};

export default FinanceDashboard;