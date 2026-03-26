// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { toast } from "react-toastify";
// import MyTable from "@/TableComponents/MyTable";
// import { Eye } from "lucide-react";

// /* ─────────────────────────── helpers ─────────────────────────── */
// const fmt = (val, fallback = "—") =>
//     val !== null && val !== undefined && val !== "" ? val : fallback;

// const fmtCurrency = (val) =>
//     val != null
//         ? new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR" }).format(val)
//         : "—";

// const fmtDate = (val) => {
//     if (!val) return "—";
//     const d = new Date(val);
//     return isNaN(d)
//         ? val
//         : d.toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//           });
// };

// const getStatus = (expiry) => {
//     if (!expiry)
//         return {
//             label: "Unknown",
//             classes: "bg-slate-700 text-slate-300",
//             dot: "bg-slate-400",
//         };
//     const diff = Math.ceil(
//         (new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24),
//     );
//     if (diff < 0)
//         return {
//             label: "Expired",
//             classes: "bg-red-500/10 text-red-400 border border-red-500/20",
//             dot: "bg-red-400",
//         };
//     if (diff <= 30)
//         return {
//             label: "Expiring Soon",
//             classes:
//                 "bg-amber-500/10 text-amber-400 border border-amber-500/20",
//             dot: "bg-amber-400",
//         };
//     return {
//         label: "Active",
//         classes: "bg-green-500/10 text-green-400 border border-green-500/20",
//         dot: "bg-green-400",
//     };
// };

// /* ─────────────────────────── Sub-components ─────────────────────────── */
// const SectionLabel = ({ children }) => (
//     <div className="flex items-center gap-3 mb-3">
//         <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest whitespace-nowrap">
//             {children}
//         </span>
//         <div className="flex-1 h-px bg-gray-200" />
//     </div>
// );

// const Field = ({ label, value, valueClass = "text-gray-800" }) => (
//     <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
//         <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
//             {label}
//         </p>
//         <p className={`text-sm font-medium break-all ${valueClass}`}>{value}</p>
//     </div>
// );

// // const StatCard = ({ label, value, valueClass = "text-gray-900" }) => (
// //     <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
// //         <p className="text-xs text-gray-400 uppercase tracking-widest mb-1.5">
// //             {label}
// //         </p>
// //         <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
// //     </div>
// // );

// /* ─────────────────────────── Modal ─────────────────────────── */
// const DetailModal = ({ contract, matchedPayments, onClose }) => {
//     const status = getStatus(contract.expiry_date);
//     const totalPaid = matchedPayments.reduce(
//         (s, p) => s + parseFloat(p.amount || 0),
//         0,
//     );
//     const balance = parseFloat(contract.grand_total || 0) - totalPaid;
//     const serviceChips = contract.service_names
//         ? contract.service_names
//               .split(",")
//               .map((s) => s.trim())
//               .filter(Boolean)
//         : [];

//     const statusValueClass =
//         status.label === "Active"
//             ? "text-green-600"
//             : status.label === "Expiring Soon"
//               ? "text-amber-500"
//               : "text-red-500";

//     return (
//         <div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
//             onClick={(e) => e.target === e.currentTarget && onClose()}
//         >
//             <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
//                 {/* Modal Header */}
//                 <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-5 flex items-start justify-between gap-4">
//                     <div>
//                         <h2 className="text-lg font-bold text-gray-900">
//                             {contract.customer_name}
//                         </h2>
//                         <p className="text-xs text-gray-400 mt-0.5">
//                             Invoice{" "}
//                             <span className="text-indigo-600">
//                                 {fmt(contract.invoice_number)}
//                             </span>
//                             {" · "}
//                             {contract.service_type}
//                         </p>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white transition-colors text-sm flex-shrink-0"
//                     >
//                         ✕
//                     </button>
//                 </div>

//                 <div className="px-6 py-5 space-y-6">
//                     {/* Contract Details */}
//                     <div>
//                         <SectionLabel>Contract Details</SectionLabel>
//                         <div className="grid grid-cols-2 gap-3">
//                             <Field
//                                 label="Grand Total"
//                                 value={fmtCurrency(contract.grand_total)}
//                                 valueClass="text-indigo-600 font-bold text-base"
//                             />
//                             <Field
//                                 label="Balance Due"
//                                 value={fmtCurrency(balance)}
//                                 valueClass={`font-bold text-base ${balance > 0 ? "text-amber-500" : "text-green-600"}`}
//                             />
//                             <Field
//                                 label="Status"
//                                 value={status.label}
//                                 valueClass={statusValueClass}
//                             />
//                             <Field
//                                 label="Expiry Date"
//                                 value={fmtDate(contract.expiry_date)}
//                             />
//                             <Field
//                                 label="Duration"
//                                 value={`${fmt(contract.duration_value)} ${fmt(contract.duration_unit)}`}
//                             />
//                             <Field
//                                 label="Invoice Date"
//                                 value={fmtDate(contract.invoice_date)}
//                             />
//                             <Field
//                                 label="Service Type"
//                                 value={fmt(contract.service_type)}
//                             />
//                             <Field
//                                 label="Invoice No."
//                                 value={fmt(contract.invoice_number)}
//                                 valueClass="text-indigo-600"
//                             />
//                         </div>
//                     </div>

//                     {/* Services Included */}
//                     {serviceChips.length > 0 && (
//                         <div>
//                             <SectionLabel>Services Included</SectionLabel>
//                             <div className="flex flex-wrap gap-2">
//                                 {serviceChips.map((s, i) => (
//                                     <span
//                                         key={i}
//                                         className="bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs px-3 py-1 rounded-md"
//                                     >
//                                         {s}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Matched Payments */}
//                     <div>
//                         <SectionLabel>
//                             Matched Payments{" "}
//                             <span className="ml-1 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-normal normal-case tracking-normal">
//                                 {matchedPayments.length}
//                             </span>
//                         </SectionLabel>

//                         {matchedPayments.length === 0 ? (
//                             <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400 text-sm">
//                                 No matching payments found for this invoice.
//                             </div>
//                         ) : (
//                             <div className="space-y-3">
//                                 {matchedPayments.map((p) => (
//                                     <div
//                                         key={p.id}
//                                         className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4"
//                                     >
//                                         <div className="flex-1 min-w-0">
//                                             <p className="text-sm font-medium text-gray-800">
//                                                 {p.customer_name}
//                                             </p>
//                                             <p className="text-xs text-gray-400 mt-0.5">
//                                                 Ref: {fmt(p.payment_reference)}{" "}
//                                                 · Invoice:{" "}
//                                                 {fmt(p.invoice_reference)}
//                                             </p>
//                                             <div className="flex flex-wrap gap-2 mt-2">
//                                                 <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full">
//                                                     📅 {fmtDate(p.receiveddate)}
//                                                 </span>
//                                                 {p.paymentmode && (
//                                                     <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full">
//                                                         💳 {p.paymentmode}
//                                                     </span>
//                                                 )}
//                                                 <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full">
//                                                     🔖 {p.service_type}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <span className="text-green-600 font-bold text-base flex-shrink-0">
//                                             {fmtCurrency(p.amount)}
//                                         </span>
//                                     </div>
//                                 ))}

//                                 {/* Total row */}
//                                 <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
//                                     <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
//                                         Total Paid
//                                     </span>
//                                     <span className="text-green-600 font-bold text-base">
//                                         {fmtCurrency(totalPaid)}
//                                     </span>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// /* ─────────────────────────── Main Page ─────────────────────────── */
// const ClientDetails = () => {
//     const [allPayment, setAllPayment] = useState([]);
//     const [allService, setAllService] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [reloadTrigger, setReloadTrigger] = useState(0);
//     const [search, setSearch] = useState("");
//     const [selectedContract, setSelectedContract] = useState(null);

//     useEffect(() => {
//         const fetchAll = async () => {
//             setLoading(true);
//             try {
//                 const [payRes, svcRes] = await Promise.all([
//                     axios.get(route("ourpayments.index")),
//                     axios.get(route("ourservicecontracts.index")),
//                 ]);
//                 setAllPayment(payRes.data.data ?? []);
//                 setAllService(svcRes.data.data ?? []);
//             } catch (error) {
//                 console.error("Fetch error:", error);
//                 toast.error("Failed to load data");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchAll();
//     }, [reloadTrigger]);

//     /* Match payments where invoice_reference + customer_name both align */
//     // const getMatchedPayments = useCallback(
//     //     (contract) =>
//     //         allPayment.filter(
//     //             (p) =>
//     //                 p.invoice_reference?.trim().toLowerCase() ===
//     //                     contract.invoice_number?.trim().toLowerCase() &&
//     //                 p.customer_name?.trim().toLowerCase() ===
//     //                     contract.customer_name?.trim().toLowerCase()
//     //         ),
//     //     [allPayment]
//     // );

//     /* Match payments where EITHER invoice_reference OR customer_name aligns */
//     const getMatchedPayments = useCallback(
//         (contract) =>
//             allPayment.filter((p) => {
//                 const invoiceMatch =
//                     p.invoice_reference?.trim().toLowerCase() ===
//                     contract.invoice_number?.trim().toLowerCase();

//                 const customerMatch =
//                     p.customer_name?.trim().toLowerCase() ===
//                     contract.customer_name?.trim().toLowerCase();

//                 return invoiceMatch || customerMatch;
//             }),
//         [allPayment],
//     );

//     const filteredData = useMemo(() => {
//         if (!search.trim()) return allService;
//         const q = search.toLowerCase();
//         return allService.filter((c) =>
//             [c.customer_name, c.invoice_number, c.service_type]
//                 .join(" ")
//                 .toLowerCase()
//                 .includes(q),
//         );
//     }, [allService, search]);

//     // const activeCount = useMemo(
//     //     () =>
//     //         allService.filter(
//     //             (c) => getStatus(c.expiry_date).label === "Active",
//     //         ).length,
//     //     [allService],
//     // );
//     // const matchedCount = useMemo(
//     //     () => allService.filter((c) => getMatchedPayments(c).length > 0).length,
//     //     [allService, getMatchedPayments],
//     // );
//     // const totalRevenue = useMemo(
//     //     () => allPayment.reduce((s, p) => s + parseFloat(p.amount || 0), 0),
//     //     [allPayment],
//     // );

//     /* ── Table columns ── */
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S/N",
//                 accessor: "index",
//                 Cell: ({ row }) => row.index + 1,
//                 disableSortBy: true,
//             },
//             {
//                 Header: "Customer",
//                 accessor: "customer_name",
//                 Cell: ({ value }) => (
//                     <span className="font-medium ">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Invoice No.",
//                 accessor: "invoice_number",
//                 Cell: ({ value }) => (
//                     <span className="font-mono  text-xs">{fmt(value)}</span>
//                 ),
//             },
//             {
//                 Header: "Service Type",
//                 accessor: "service_type",
//                 Cell: ({ value }) => <span className="">{fmt(value)}</span>,
//             },
//             {
//                 Header: "Grand Total",
//                 accessor: "grand_total",
//                 Cell: ({ value }) => (
//                     <span className="text-indigo-600 font-semibold">
//                         {fmtCurrency(value)}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Duration",
//                 accessor: "duration",
//                 Cell: ({ row }) => (
//                     <span className=" text-xs">
//                         {fmt(row.original.duration_value)}{" "}
//                         {fmt(row.original.duration_unit)}
//                     </span>
//                 ),
//                 disableSortBy: true,
//             },
//             {
//                 Header: "Expiry",
//                 accessor: "expiry_date",
//                 Cell: ({ value }) => (
//                     <span className=" font-mono text-xs">{fmtDate(value)}</span>
//                 ),
//             },
//             {
//                 Header: "Status",
//                 accessor: "status",
//                 Cell: ({ row }) => {
//                     const status = getStatus(row.original.expiry_date);
//                     return (
//                         <span
//                             className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${status.classes}`}
//                         >
//                             <span
//                                 className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
//                             />
//                             {status.label}
//                         </span>
//                     );
//                 },
//                 disableSortBy: true,
//             },
//             {
//                 Header: "Payments",
//                 accessor: "payments",
//                 Cell: ({ row }) => {
//                     const payments = getMatchedPayments(row.original);
//                     return payments.length > 0 ? (
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 setSelectedContract(row.original);
//                             }}
//                             className="inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full hover:bg-green-500/20 transition-colors"
//                         >
//                             ✓ {payments.length} matched
//                         </button>
//                     ) : (
//                         <span className="text-xs text-slate-600">— none</span>
//                     );
//                 },
//                 disableSortBy: true,
//             },
//             {
//                 Header: "Details",
//                 accessor: "details",
//                 Cell: ({ row }) => (
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             setSelectedContract(row.original);
//                         }}
//                         className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
//                     >
//                         <Eye size={19} />
//                     </button>
//                 ),
//                 disableSortBy: true,
//             },
//         ],
//         [getMatchedPayments],
//     );

//     if (loading) {
//         return (
//             <AdminWrapper>
//                 <div className="p-6 flex items-center justify-center min-h-[400px]">
//                     <div className="flex items-center gap-3 text-slate-400 text-sm">
//                         <div className="w-5 h-5 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
//                         Loading data...
//                     </div>
//                 </div>
//             </AdminWrapper>
//         );
//     }

//     return (
//         <AdminWrapper>
//             <div className="p-6">
//                 {/* Page Header */}
//                 <div className="flex items-baseline gap-4 mb-8 border-b border-slate-700/50 pb-5">
//                     <h1 className="text-3xl font-bold  tracking-tight">
//                         Client Details
//                     </h1>
//                     <span className="text-xs text-slate-500 uppercase tracking-widest hidden sm:block">
//                         Service Contracts &amp; Payments
//                     </span>
//                 </div>

//                 {/* Stats Row */}
//                 {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
//                     <StatCard
//                         label="Total Contracts"
//                         value={allService.length}
//                     />
//                     <StatCard
//                         label="Active"
//                         value={activeCount}
//                         valueClass="text-indigo-400"
//                     />
//                     <StatCard
//                         label="With Payments"
//                         value={matchedCount}
//                         valueClass="text-green-400"
//                     />
//                     <StatCard
//                         label="Total Revenue"
//                         value={fmtCurrency(totalRevenue)}
//                         valueClass="text-green-400 text-xl"
//                     />
//                 </div> */}

//                 {/* Search */}
//                 <div className="mb-5">
//                     <input
//                         type="text"
//                         placeholder="Search by client, invoice, or service type..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         className="w-full md:w-80   text-black placeholder-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
//                     />
//                 </div>

//                 {/* MyTable */}
//                 <MyTable columns={columns} data={filteredData} />
//             </div>

//             {/* Detail Modal */}
//             {selectedContract && (
//                 <DetailModal
//                     contract={selectedContract}
//                     matchedPayments={getMatchedPayments(selectedContract)}
//                     onClose={() => setSelectedContract(null)}
//                 />
//             )}
//         </AdminWrapper>
//     );
// };

// export default ClientDetails;

import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import MyTable from "@/TableComponents/MyTable";
import { Eye } from "lucide-react";

/* ─────────────────────────── helpers ─────────────────────────── */
const fmt = (val, fallback = "—") =>
    val !== null && val !== undefined && val !== "" ? val : fallback;

const fmtCurrency = (val) =>
    val != null
        ? new Intl.NumberFormat("en-NP", {
              style: "currency",
              currency: "NPR",
          }).format(val)
        : "—";

const fmtDate = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    return isNaN(d)
        ? val
        : d.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
          });
};

const getStatus = (expiry) => {
    if (!expiry)
        return {
            label: "Unknown",
            classes: "bg-slate-700 text-slate-300",
            dot: "bg-slate-400",
        };
    const diff = Math.ceil(
        (new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24),
    );
    if (diff < 0)
        return {
            label: "Expired",
            classes: "bg-red-500/10 text-red-400 border border-red-500/20",
            dot: "bg-red-400",
        };
    if (diff <= 30)
        return {
            label: "Expiring Soon",
            classes:
                "bg-amber-500/10 text-amber-400 border border-amber-500/20",
            dot: "bg-amber-400",
        };
    return {
        label: "Active",
        classes: "bg-green-500/10 text-green-400 border border-green-500/20",
        dot: "bg-green-400",
    };
};

/* ─────────────────────────── Sub-components ─────────────────────────── */
const SectionLabel = ({ children }) => (
    <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest whitespace-nowrap">
            {children}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
    </div>
);

const Field = ({ label, value, valueClass = "text-gray-800" }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            {label}
        </p>
        <p className={`text-sm font-medium break-all ${valueClass}`}>{value}</p>
    </div>
);

/* ─────────────────────────── Modal ─────────────────────────── */
const DetailModal = ({ contract, matchedPayments, onClose }) => {
    const status = getStatus(contract.expiry_date);
    const totalPaid = matchedPayments.reduce(
        (s, p) => s + parseFloat(p.amount || 0),
        0,
    );
    const balance = parseFloat(contract.grand_total || 0) - totalPaid;
    const serviceChips = contract.service_names
        ? contract.service_names
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
        : [];

    const statusValueClass =
        status.label === "Active"
            ? "text-green-600"
            : status.label === "Expiring Soon"
              ? "text-amber-500"
              : "text-red-500";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Modal Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {contract.customer_name}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Invoice{" "}
                            <span className="text-indigo-600">
                                {fmt(contract.invoice_number)}
                            </span>
                            {" · "}
                            {contract.service_type}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white transition-colors text-sm flex-shrink-0"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 py-5 space-y-6">
                    {/* Contract Details */}
                    <div>
                        <SectionLabel>Contract Details</SectionLabel>
                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="Grand Total"
                                value={fmtCurrency(contract.grand_total)}
                                valueClass="text-indigo-600 font-bold text-base"
                            />
                            <Field
                                label="Balance Due"
                                value={fmtCurrency(balance)}
                                valueClass={`font-bold text-base ${balance > 0 ? "text-amber-500" : "text-green-600"}`}
                            />
                            <Field
                                label="Status"
                                value={status.label}
                                valueClass={statusValueClass}
                            />
                            <Field
                                label="Expiry Date"
                                value={fmtDate(contract.expiry_date)}
                            />
                            <Field
                                label="Duration"
                                value={`${fmt(contract.duration_value)} ${fmt(contract.duration_unit)}`}
                            />
                            <Field
                                label="Invoice Date"
                                value={fmtDate(contract.invoice_date)}
                            />
                            <Field
                                label="Service Type"
                                value={fmt(contract.service_type)}
                            />
                            <Field
                                label="Invoice No."
                                value={fmt(contract.invoice_number)}
                                valueClass="text-indigo-600"
                            />
                        </div>
                    </div>

                    {/* Services Included */}
                    {serviceChips.length > 0 && (
                        <div>
                            <SectionLabel>Services Included</SectionLabel>
                            <div className="flex flex-wrap gap-2">
                                {serviceChips.map((s, i) => (
                                    <span
                                        key={i}
                                        className="bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs px-3 py-1 rounded-md"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Matched Payments */}
                    <div>
                        <SectionLabel>
                            Matched Payments{" "}
                            <span className="ml-1 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-normal normal-case tracking-normal">
                                {matchedPayments.length}
                            </span>
                        </SectionLabel>

                        {matchedPayments.length === 0 ? (
                            <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400 text-sm">
                                No matching payments found for this invoice.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {matchedPayments.map((p) => (
                                    <div
                                        key={p.id}
                                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800">
                                                {p.customer_name}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Ref: {fmt(p.payment_reference)}{" "}
                                                · Invoice:{" "}
                                                {fmt(p.invoice_reference)}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full">
                                                    📅 {fmtDate(p.receiveddate)}
                                                </span>
                                                {p.paymentmode && (
                                                    <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full">
                                                        💳 {p.paymentmode}
                                                    </span>
                                                )}
                                                <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full">
                                                    🔖 {p.service_type}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-green-600 font-bold text-base flex-shrink-0">
                                            {fmtCurrency(p.amount)}
                                        </span>
                                    </div>
                                ))}

                                {/* Total row */}
                                <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                        Total Paid
                                    </span>
                                    <span className="text-green-600 font-bold text-base">
                                        {fmtCurrency(totalPaid)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────── Main Page ─────────────────────────── */
const ClientDetails = () => {
    const [allPayment, setAllPayment] = useState([]);
    const [allService, setAllService] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [search, setSearch] = useState("");
    const [selectedContract, setSelectedContract] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [payRes, svcRes] = await Promise.all([
                    axios.get(route("ourpayments.index")),
                    axios.get(route("ourservicecontracts.index")),
                ]);
                setAllPayment(payRes.data.data ?? []);
                setAllService(svcRes.data.data ?? []);
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [reloadTrigger]);

    /* Match payments where EITHER invoice_reference OR customer_name aligns */
    const getMatchedPayments = useCallback(
        (contract) =>
            allPayment.filter((p) => {
                const invoiceMatch =
                    p.invoice_reference?.trim().toLowerCase() ===
                    contract.invoice_number?.trim().toLowerCase();

                const customerMatch =
                    p.customer_name?.trim().toLowerCase() ===
                    contract.customer_name?.trim().toLowerCase();

                return invoiceMatch || customerMatch;
            }),
        [allPayment],
    );

    const filteredData = useMemo(() => {
        if (!search.trim()) return allService;
        const q = search.toLowerCase();
        return allService.filter((c) =>
            [c.customer_name, c.invoice_number, c.service_type]
                .join(" ")
                .toLowerCase()
                .includes(q),
        );
    }, [allService, search]);

    /* ── Table columns ── */
    const columns = useMemo(
        () => [
            {
                Header: "S/N",
                accessor: "index",
                Cell: ({ row }) => row.index + 1,
                disableSortBy: true,
            },
            {
                Header: "Customer",
                accessor: "customer_name",
                Cell: ({ value }) => (
                    <span className="font-medium ">{value}</span>
                ),
            },
            {
                Header: "Invoice No.",
                accessor: "invoice_number",
                Cell: ({ value }) => (
                    <span className="font-mono  text-xs">{fmt(value)}</span>
                ),
            },
            {
                Header: "Service Type",
                accessor: "service_type",
                Cell: ({ value }) => <span className="">{fmt(value)}</span>,
            },
            {
                Header: "Grand Total",
                accessor: "grand_total",
                Cell: ({ value }) => (
                    <span className="text-indigo-600 font-semibold">
                        {fmtCurrency(value)}
                    </span>
                ),
            },
            {
                Header: "Duration",
                accessor: "duration",
                Cell: ({ row }) => (
                    <span className=" text-xs">
                        {fmt(row.original.duration_value)}{" "}
                        {fmt(row.original.duration_unit)}
                    </span>
                ),
                disableSortBy: true,
            },
            {
                Header: "Expiry",
                accessor: "expiry_date",
                Cell: ({ value }) => (
                    <span className=" font-mono text-xs">{fmtDate(value)}</span>
                ),
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ row }) => {
                    const status = getStatus(row.original.expiry_date);
                    return (
                        <span
                            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${status.classes}`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                            />
                            {status.label}
                        </span>
                    );
                },
                disableSortBy: true,
            },
            {
                Header: "Payments",
                accessor: "payments",
                Cell: ({ row }) => {
                    const payments = getMatchedPayments(row.original);
                    return payments.length > 0 ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedContract(row.original);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full hover:bg-green-500/20 transition-colors"
                        >
                            ✓ {payments.length} matched
                        </button>
                    ) : (
                        <span className="text-xs text-slate-600">— none</span>
                    );
                },
                disableSortBy: true,
            },
            {
                Header: "Details",
                accessor: "details",
                Cell: ({ row }) => (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContract(row.original);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    >
                        <Eye size={19} />
                    </button>
                ),
                disableSortBy: true,
            },
        ],
        [getMatchedPayments],
    );

    return (
        <AdminWrapper>
            <div className="p-6">
                {/* Page Header */}
                <div className="flex items-baseline gap-4 mb-8 border-b border-slate-700/50 pb-5">
                    <h1 className="text-3xl font-bold  tracking-tight">
                        Client Details
                    </h1>
                    <span className="text-xs text-slate-500 uppercase tracking-widest hidden sm:block">
                        Service Contracts &amp; Payments
                    </span>
                </div>

                {/* Search */}
                <div className="mb-5">
                    <input
                        type="text"
                        placeholder="Search by client, invoice, or service type..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-80   text-black placeholder-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* MyTable with integrated loading */}
                <MyTable
                    columns={columns}
                    data={filteredData}
                    loading={loading}
                />
            </div>

            {/* Detail Modal */}
            {selectedContract && (
                <DetailModal
                    contract={selectedContract}
                    matchedPayments={getMatchedPayments(selectedContract)}
                    onClose={() => setSelectedContract(null)}
                />
            )}
        </AdminWrapper>
    );
};

export default ClientDetails;
