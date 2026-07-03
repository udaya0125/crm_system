// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { toast } from "react-toastify";
// import MyTable from "@/TableComponents/MyTable";
// import { Eye } from "lucide-react";
// import PageLoader from "@/Loader/PageLoader";

// /* ─────────────────────────── helpers ─────────────────────────── */
// const fmt = (val, fallback = "—") =>
//     val !== null && val !== undefined && val !== "" ? val : fallback;

// const fmtCurrency = (val) =>
//     val != null
//         ? new Intl.NumberFormat("en-NP", {
//               style: "currency",
//               currency: "NPR",
//           }).format(val)
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

//     /* ── Table columns ── */
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S.N.",
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

//     return (
//         <AdminWrapper>
//             <div>
//                 {/* Page Header */}
//                 <div className="flex justify-between items-baseline gap-4  pb-5">
//                     <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                         Client Details
//                     </h1>
//                     {/* <span className="text-xs text-slate-500 uppercase tracking-widest hidden sm:block">
//                         Service Contracts &amp; Payments
//                     </span> */}
//                     {/* Search */}
//                     <div className="">
//                         <input
//                             type="text"
//                             placeholder="Search by client, invoice, or service type..."
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             className="w-full md:w-80   text-black placeholder-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
//                         />
//                     </div>
//                 </div>

//                 {/* Search */}
//                 {/* <div className="mb-5">
//                     <input
//                         type="text"
//                         placeholder="Search by client, invoice, or service type..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         className="w-full md:w-80   text-black placeholder-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
//                     />
//                 </div> */}

//                 {/* MyTable with integrated loading */}

//                 {loading ? (
//                     <PageLoader/>
//                 ) : (
//                     <MyTable
//                         columns={columns}
//                         data={filteredData}
//                     />
//                 )}
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
import {
    Eye,
    Building2,
    ChevronDown,
    ChevronUp,
    CalendarDays,
    CreditCard,
    Bookmark,
} from "lucide-react";
import PageLoader from "@/Loader/PageLoader";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    createColumnHelper,
    flexRender,
} from "@tanstack/react-table";

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

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);
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
                                                <span className="flex items-center gap-1 bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full">
                                                    <CalendarDays
                                                        size={14}
                                                        className="text-blue-500"
                                                    />{" "}
                                                    {fmtDate(p.receiveddate)}
                                                </span>

                                                {p.paymentmode && (
                                                    <span className="flex items-center gap-1 bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full">
                                                        <CreditCard
                                                            size={14}
                                                            className="text-green-500"
                                                        />{" "}
                                                        {p.paymentmode}
                                                    </span>
                                                )}

                                                <span className="flex items-center gap-1 bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full">
                                                    <Bookmark
                                                        size={14}
                                                        className="text-amber-500"
                                                    />{" "}
                                                    {p.service_type}
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

const columnHelper = createColumnHelper();

/* ─────────────────────────── Main Page ─────────────────────────── */
const ClientDetails = () => {
    const [allPayment, setAllPayment] = useState([]);
    const [allService, setAllService] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedContract, setSelectedContract] = useState(null);

    // Accordion: only ONE customer group open at a time. null = all closed.
    const [openGroup, setOpenGroup] = useState(null);

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

    const toggleGroup = (key) => {
        setOpenGroup((prev) => (prev === key ? null : key));
    };

    // Search across customer, invoice number, and service type
    const globalFilterFn = (row, columnId, filterValue) => {
        const c = row.original;
        const haystack = [c.customer_name, c.invoice_number, c.service_type]
            .join(" ")
            .toLowerCase();
        return haystack.includes(String(filterValue).toLowerCase());
    };

    /* ── Table columns (customer_name pulled out into the group header) ── */
    const columns = useMemo(
        () => [
            columnHelper.display({
                id: "sn",
                header: "S.N.",
                cell: ({ groupIndex }) => (
                    <span className="text-gray-400 text-xs font-mono">
                        {groupIndex + 1}
                    </span>
                ),
            }),
            columnHelper.accessor("invoice_number", {
                header: "Invoice No.",
                cell: (info) => (
                    <span className="font-mono text-xs">
                        {fmt(info.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor("service_type", {
                header: "Service Type",
                cell: (info) => <span>{fmt(info.getValue())}</span>,
            }),
            columnHelper.accessor("grand_total", {
                header: "Grand Total",
                cell: (info) => (
                    <span className="text-indigo-600 font-semibold">
                        {fmtCurrency(info.getValue())}
                    </span>
                ),
            }),
            columnHelper.display({
                id: "duration",
                header: "Duration",
                cell: ({ row }) => (
                    <span className="text-xs">
                        {fmt(row.original.duration_value)}{" "}
                        {fmt(row.original.duration_unit)}
                    </span>
                ),
            }),
            columnHelper.accessor("expiry_date", {
                header: "Expiry",
                cell: (info) => (
                    <span className="font-mono text-xs">
                        {fmtDate(info.getValue())}
                    </span>
                ),
            }),
            columnHelper.display({
                id: "status",
                header: "Status",
                cell: ({ row }) => {
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
            }),
            columnHelper.display({
                id: "payments",
                header: "Payments",
                cell: ({ row }) => {
                    const payments = getMatchedPayments(row.original);
                    return payments.length > 0 ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedContract(row.original);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-green-600 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full hover:bg-green-500/20 transition-colors"
                        >
                            ✓ {payments.length} matched
                        </button>
                    ) : (
                        <span className="text-xs text-gray-400">— none</span>
                    );
                },
            }),
            columnHelper.display({
                id: "details",
                header: "Details",
                meta: { className: "text-right", cellClassName: "text-right" },
                cell: ({ row }) => (
                    <div className="flex justify-end">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedContract(row.original);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                ),
            }),
        ],
        [getMatchedPayments],
    );

    // react-table drives filtering + cell rendering.
    // Grouping / group order is handled manually below (same pattern as
    // the Payments page) so the accordion + newest-on-top logic works
    // identically across both tables.
    const table = useReactTable({
        data: allService,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    // Latest payment date per customer (case-insensitive, trimmed match on
    // customer_name — same matching rule used in getMatchedPayments). This
    // is what actually drives group order: a customer's position is based
    // on when THEY last paid, not when their service contract was created.
    const latestPaymentByCustomer = useMemo(() => {
        const map = new Map();
        allPayment.forEach((p) => {
            const key = (p.customer_name || "Unknown").trim().toLowerCase();
            const paidAt = new Date(p.created_at || p.receiveddate || 0);
            const current = map.get(key);
            if (!current || paidAt > current) {
                map.set(key, paidAt);
            }
        });
        return map;
    }, [allPayment]);

    // Group the FILTERED contract rows by customer_name, then order the
    // GROUPS (not the contracts) by each customer's most recent payment
    // date, newest first. A customer with no payments yet falls back to
    // their contract's created_at so they still appear, just below anyone
    // who has actually paid recently. Within a group, contracts stay in
    // whatever order the filtered rows arrived in (newest contract first,
    // since ServiceContract::latest() already orders that way).
    const groupedContracts = useMemo(() => {
        const map = new Map();
        const order = [];

        table.getFilteredRowModel().rows.forEach((row) => {
            const key = (row.original.customer_name || "Unknown").trim();
            if (!map.has(key)) {
                map.set(key, []);
                order.push(key);
            }
            map.get(key).push(row);
        });

        const groups = order.map((key) => {
            const rows = map.get(key);
            const total = rows.reduce(
                (sum, r) => sum + parseFloat(r.original.grand_total || 0),
                0,
            );

            const lookupKey = key.toLowerCase();
            const latestPayment = latestPaymentByCustomer.get(lookupKey);
            // Fallback: no payments yet for this customer — use their
            // newest contract's created_at so they still sort sensibly.
            const fallbackDate = new Date(rows[0]?.original?.created_at || 0);
            const rankDate = latestPayment || fallbackDate;

            return { key, rows, total, rankDate };
        });

        // Sort groups newest-payment-first. This is the step that makes a
        // brand-new payment jump that customer straight to the top, even if
        // their service contract itself is old.
        groups.sort((a, b) => b.rankDate - a.rankDate);

        return groups;
    }, [
        table.getFilteredRowModel().rows,
        globalFilter,
        allService,
        latestPaymentByCustomer,
    ]);

    // If a search narrows results so the open group no longer exists, close it.
    useEffect(() => {
        if (openGroup && !groupedContracts.some((g) => g.key === openGroup)) {
            setOpenGroup(null);
        }
    }, [groupedContracts, openGroup]);

    return (
        <AdminWrapper>
            <div>
                {/* Page Header */}
                <div className="flex justify-between items-baseline gap-4 pb-5">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Client Details
                    </h1>
                    <div className="">
                        <input
                            type="text"
                            placeholder="Search by client, invoice, or service type..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full md:w-80 border border-gray-300 text-black placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                {loading ? (
                    <PageLoader />
                ) : (
                    <div className="relative overflow-x-auto rounded-lg border border-gray-100">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                {table.getHeaderGroups().map((hg) => (
                                    <tr key={hg.id}>
                                        {hg.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className={[
                                                    "px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider",
                                                    header.column.columnDef.meta
                                                        ?.className ?? "",
                                                ].join(" ")}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>

                            <tbody>
                                {groupedContracts.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="px-6 py-12 text-center text-gray-400"
                                        >
                                            No service contracts found.
                                        </td>
                                    </tr>
                                ) : (
                                    groupedContracts.map((group) => {
                                        const isOpen = openGroup === group.key;
                                        return (
                                            <React.Fragment key={group.key}>
                                                {/* Group header row — one per customer, clickable */}
                                                <tr
                                                    onClick={() =>
                                                        toggleGroup(group.key)
                                                    }
                                                    className="bg-indigo-50/60 border-t-2 border-indigo-100 cursor-pointer hover:bg-indigo-100/60 transition-colors select-none"
                                                >
                                                    <td
                                                        colSpan={columns.length}
                                                        className="px-5 py-3"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-indigo-400">
                                                                    {isOpen ? (
                                                                        <ChevronUp
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <ChevronDown
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    )}
                                                                </span>
                                                                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                                    <Building2
                                                                        size={
                                                                            13
                                                                        }
                                                                        className="text-indigo-600"
                                                                    />
                                                                </div>
                                                                <span className="font-semibold text-indigo-700 tracking-wide uppercase text-xs">
                                                                    {group.key}
                                                                </span>
                                                                {group.rows
                                                                    .length >
                                                                    1 && (
                                                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
                                                                        {
                                                                            group
                                                                                .rows
                                                                                .length
                                                                        }{" "}
                                                                        contracts
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs font-semibold text-indigo-600">
                                                                {fmtCurrency(
                                                                    group.total,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Data rows inside this group — only rendered when open */}
                                                {isOpen &&
                                                    group.rows.map(
                                                        (row, index) => (
                                                            <tr
                                                                key={row.id}
                                                                className="border-t border-gray-50 hover:bg-gray-50/70 transition-colors"
                                                            >
                                                                {row
                                                                    .getVisibleCells()
                                                                    .map(
                                                                        (
                                                                            cell,
                                                                        ) => (
                                                                            <td
                                                                                key={
                                                                                    cell.id
                                                                                }
                                                                                className={[
                                                                                    "px-5 py-3",
                                                                                    cell
                                                                                        .column
                                                                                        .columnDef
                                                                                        .meta
                                                                                        ?.cellClassName ??
                                                                                        "",
                                                                                ].join(
                                                                                    " ",
                                                                                )}
                                                                            >
                                                                                {flexRender(
                                                                                    cell
                                                                                        .column
                                                                                        .columnDef
                                                                                        .cell,
                                                                                    {
                                                                                        ...cell.getContext(),
                                                                                        groupIndex:
                                                                                            index,
                                                                                    },
                                                                                )}
                                                                            </td>
                                                                        ),
                                                                    )}
                                                            </tr>
                                                        ),
                                                    )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-400">
                            <span>
                                {groupedContracts.length}{" "}
                                {groupedContracts.length === 1
                                    ? "customer"
                                    : "customers"}
                            </span>
                            <span>
                                {table.getFilteredRowModel().rows.length} total
                                contracts
                            </span>
                        </div>
                    </div>
                )}
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

// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import PageLoader from "@/Loader/PageLoader";
// import { Head } from "@inertiajs/react";
// import axios from "axios";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import React, { useEffect, useState, useCallback } from "react";
// import { toast } from "react-toastify";

// const fmt = (val, fallback = "—") =>
//     val !== null && val !== undefined && val !== "" ? val : fallback;

// const fmtCurrency = (val) =>
//     val != null
//         ? new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR" }).format(val)
//         : "—";

// const fmtDate = (val) => {
//     if (!val) return "—";
//     const d = new Date(val);
//     return isNaN(d) ? val : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
// };

// const getStatus = (expiry) => {
//     if (!expiry) return { label: "Unknown", classes: "bg-gray-100 text-gray-500" };
//     const diff = Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));
//     if (diff < 0) return { label: "Expired", classes: "bg-red-50 text-red-600 border border-red-200" };
//     if (diff <= 30) return { label: "Expiring Soon", classes: "bg-amber-50 text-amber-600 border border-amber-200" };
//     return { label: "Active", classes: "bg-green-50 text-green-600 border border-green-200" };
// };

// const ClientCard = ({ contract }) => {
//     const [open, setOpen] = useState(false);
//     const status = getStatus(contract.expiry_date);

//     return (
//         <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//             {/* Header row - always visible */}
//             <button
//                 onClick={() => setOpen((o) => !o)}
//                 className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
//             >
//                 <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 flex-wrap">
//                         <h3 className="font-semibold text-gray-900">{contract.customer_name}</h3>
//                         <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.classes}`}>
//                             {status.label}
//                         </span>
//                     </div>
//                     <p className="text-xs text-gray-400 mt-1">
//                         Invoice {fmt(contract.invoice_number)} · {contract.service_type}
//                     </p>
//                 </div>

//                 <div className="flex items-center gap-6 flex-shrink-0">
//                     <div className="text-right">
//                         <p className="text-xs text-gray-400">Grand Total</p>
//                         <p className="font-bold text-indigo-600 text-sm">{fmtCurrency(contract.grand_total)}</p>
//                     </div>
//                     <div className="text-right">
//                         <p className="text-xs text-gray-400">Balance</p>
//                         <p className={`font-bold text-sm ${contract.balance > 0 ? "text-amber-500" : "text-green-600"}`}>
//                             {fmtCurrency(contract.balance)}
//                         </p>
//                     </div>
//                     <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
//                         {contract.payments.length} payment{contract.payments.length !== 1 ? "s" : ""}
//                     </span>
//                     {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
//                 </div>
//             </button>

//             {/* Expanded detail */}
//             {open && (
//                 <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-3">
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
//                         <div>
//                             <p className="text-xs text-gray-400">Duration</p>
//                             <p>{fmt(contract.duration_value)} {fmt(contract.duration_unit)}</p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-gray-400">Expiry Date</p>
//                             <p>{fmtDate(contract.expiry_date)}</p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-gray-400">Invoice Date</p>
//                             <p>{fmtDate(contract.invoice_date)}</p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-gray-400">Total Paid</p>
//                             <p className="text-green-600 font-semibold">{fmtCurrency(contract.total_paid)}</p>
//                         </div>
//                     </div>

//                     <div>
//                         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Payments</p>
//                         {contract.payments.length === 0 ? (
//                             <p className="text-sm text-gray-400 italic">No payments recorded yet.</p>
//                         ) : (
//                             <div className="space-y-2">
//                                 {contract.payments.map((p) => (
//                                     <div
//                                         key={p.id}
//                                         className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2.5"
//                                     >
//                                         <div>
//                                             <p className="text-sm text-gray-700">{fmtDate(p.receiveddate)} · {fmt(p.paymentmode)}</p>
//                                             <p className="text-xs text-gray-400">Ref: {fmt(p.payment_reference)}</p>
//                                         </div>
//                                         <span className="text-green-600 font-semibold text-sm">{fmtCurrency(p.amount)}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// const ClientDetails = () => {
//     const [contracts, setContracts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [search, setSearch] = useState("");

//     const fetchData = useCallback(async (q = "") => {
//         setLoading(true);
//         try {
//             const res = await axios.get(route('clientdetails.index'), { params: { search: q } });
//             setContracts(res.data.data ?? []);
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to load client details");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         const t = setTimeout(() => fetchData(search), 300); // debounce
//         return () => clearTimeout(t);
//     }, [search, fetchData]);

//     return (
//         <AdminWrapper>
//             <Head title="Client Details" />
//             <div>
//                 <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
//                     <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                         Client Details
//                     </h1>
//                     <input
//                         type="text"
//                         placeholder="Search by client, invoice, or service type..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                 </div>

//                 {loading ? (
//                     <PageLoader />
//                 ) : contracts.length === 0 ? (
//                     <p className="text-center text-gray-400 py-10">No results found.</p>
//                 ) : (
//                     <div className="space-y-3">
//                         {contracts.map((c) => (
//                             <ClientCard key={c.id} contract={c} />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// export default ClientDetails;
