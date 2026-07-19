import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import PageLoader from "@/Loader/PageLoader";
import { Head } from "@inertiajs/react";
import axios from "axios";
import {
    Trash2,
    Eye,
    EyeOff,
    Building2,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    createColumnHelper,
    flexRender,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const Payment = () => {
    const [allPayment, setAllPayment] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(true);

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [password, setPassword] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Search
    const [globalFilter, setGlobalFilter] = useState("");

    // Accordion: only ONE customer group open at a time. null = all closed.
    const [openGroup, setOpenGroup] = useState(null);

    useEffect(() => {
        const fetchPayment = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourpayments.index"));
                setAllPayment(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
                toast.error("Failed to load payments");
            } finally {
                setLoading(false);
            }
        };

        fetchPayment();
    }, [reloadTrigger]);

    const openDeleteModal = (id) => {
        setDeleteItemId(id);
        setPassword("");
        setShowPassword(false);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteItemId(null);
        setPassword("");
        setShowPassword(false);
    };

    const handleDelete = async () => {
        if (!deleteItemId) {
            toast.error("No Payment Selected For Deletion");
            return;
        }

        if (!password) {
            toast.error("Password is required for deletion");
            return;
        }

        setDeleting(true);
        try {
            const verifyResponse = await axios.post(route("password.verify"), {
                password: password,
            });

            if (!verifyResponse.data.verified) {
                toast.error("Incorrect password");
                setDeleting(false);
                return;
            }

            await axios.delete(
                route("ourpayments.destroy", { id: deleteItemId })
            );

            toast.success("Payment deleted successfully");
            setReloadTrigger((prev) => !prev);
            closeDeleteModal();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 422) {
                toast.error("Password verification failed");
            } else {
                toast.error("Something went wrong while deleting");
            }
        } finally {
            setDeleting(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    // Toggle a group: clicking the open one closes it, clicking any other
    // group closes the previous one and opens the new one.
    const toggleGroup = (key) => {
        setOpenGroup((prev) => (prev === key ? null : key));
    };

    // Search across every relevant field
    const globalFilterFn = (row, columnId, filterValue) => {
        const p = row.original;
        const haystack = [
            p.customer_name,
            p.service_type,
            p.payment_reference,
            p.invoice_reference,
            p.paymentmode,
            p.receiveddate,
            String(p.amount ?? ""),
        ]
            .join(" ")
            .toLowerCase();
        return haystack.includes(String(filterValue).toLowerCase());
    };

    // Columns WITHOUT customer_name — that's shown once in the group header instead
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
            columnHelper.accessor("amount", {
                header: "Amount",
                cell: (info) => (
                    <span>
                        NPR {parseFloat(info.getValue() || 0).toLocaleString()}
                    </span>
                ),
            }),
            columnHelper.accessor("service_type", {
                header: "Service Type",
            }),
            columnHelper.accessor("payment_reference", {
                header: "Payment Reference",
            }),
            columnHelper.accessor("paymentmode", {
                header: "Payment Mode",
            }),
            columnHelper.accessor("invoice_reference", {
                header: "Invoice Reference",
            }),
            columnHelper.accessor("receiveddate", {
                header: "Received Date",
            }),
            columnHelper.display({
                id: "actions",
                header: "Actions",
                meta: { className: "text-right", cellClassName: "text-right" },
                cell: (info) => (
                    <div className="flex justify-end">
                        <button
                            onClick={() => openDeleteModal(info.row.original.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            }),
        ],
        []
    );

    // react-table drives filtering + cell rendering.
    // Sorting/grouping-by-column is intentionally NOT used here — we want
    // full control over group order (newest customer activity on top),
    // so grouping is done manually below on the FILTERED rows.
    const table = useReactTable({
        data: allPayment,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    // Group the FILTERED rows by customer_name.
    // Data arrives newest-first from the backend (Payment::latest()), and
    // getFilteredRowModel() preserves that order — so the first time a
    // customer appears is always their most recent payment. That first
    // appearance sets the group's position: whichever customer paid most
    // recently ends up on top, and all their other payments stay grouped
    // with them no matter when those happened.
    const groupedRows = useMemo(() => {
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

        return order.map((key) => {
            const rows = map.get(key);
            const total = rows.reduce(
                (sum, r) => sum + parseFloat(r.original.amount || 0),
                0
            );
            return { key, rows, total };
        });
    }, [table.getFilteredRowModel().rows, globalFilter, allPayment]);

    // If a search narrows results so the open group no longer exists, close it.
    useEffect(() => {
        if (openGroup && !groupedRows.some((g) => g.key === openGroup)) {
            setOpenGroup(null);
        }
    }, [groupedRows, openGroup]);

    return (
        <AdminWrapper>
            <Head title="Payment Management" />
            <div className="">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Payment Management
                    </h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by customer, service type, payment reference, invoice reference, or payment mode..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                                          header.column.columnDef
                                                              .header,
                                                          header.getContext()
                                                      )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>

                            <tbody>
                                {groupedRows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="px-6 py-12 text-center text-gray-400"
                                        >
                                            No payments found.
                                        </td>
                                    </tr>
                                ) : (
                                    groupedRows.map((group) => {
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
                                                                            size={16}
                                                                        />
                                                                    ) : (
                                                                        <ChevronDown
                                                                            size={16}
                                                                        />
                                                                    )}
                                                                </span>
                                                                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                                    <Building2
                                                                        size={13}
                                                                        className="text-indigo-600"
                                                                    />
                                                                </div>
                                                                <span className="font-semibold text-indigo-700 tracking-wide uppercase text-xs">
                                                                    {group.key}
                                                                </span>
                                                                {group.rows.length >
                                                                    1 && (
                                                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
                                                                        {
                                                                            group
                                                                                .rows
                                                                                .length
                                                                        }{" "}
                                                                        payments
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs font-semibold text-indigo-600">
                                                                NPR{" "}
                                                                {group.total.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Data rows inside this group — only rendered when open */}
                                                {isOpen &&
                                                    group.rows.map((row, index) => (
                                                        <tr
                                                            key={row.id}
                                                            className="border-t border-gray-50 hover:bg-gray-50/70 transition-colors"
                                                        >
                                                            {row
                                                                .getVisibleCells()
                                                                .map((cell) => (
                                                                    <td
                                                                        key={cell.id}
                                                                        className={[
                                                                            "px-5 py-3",
                                                                            cell.column
                                                                                .columnDef
                                                                                .meta
                                                                                ?.cellClassName ??
                                                                                "",
                                                                        ].join(
                                                                            " "
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
                                                                            }
                                                                        )}
                                                                    </td>
                                                                ))}
                                                        </tr>
                                                    ))}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-400">
                            <span>
                                {groupedRows.length}{" "}
                                {groupedRows.length === 1
                                    ? "customer"
                                    : "customers"}
                            </span>
                            <span>
                                {table.getFilteredRowModel().rows.length} total
                                payments
                            </span>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
                            <h2 className="text-lg font-bold text-gray-800 mb-1">
                                Confirm Deletion
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Enter your password to permanently delete this
                                payment.
                            </p>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleDelete()
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            <div className="flex gap-3 justify-end mt-4">
                                <button
                                    onClick={closeDeleteModal}
                                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminWrapper>
    );
};

export default Payment;



// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import PageLoader from "@/Loader/PageLoader";
// import { Head } from "@inertiajs/react";
// import axios from "axios";
// import {
//     Trash2,
//     Eye,
//     EyeOff,
//     Building2,
//     ChevronDown,
//     ChevronUp,
//     Receipt,
//     CalendarDays,
//     CreditCard,
//     FileText,
//     Hash,
// } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";
// import { toast } from "react-toastify";
// import {
//     useReactTable,
//     getCoreRowModel,
//     getFilteredRowModel,
// } from "@tanstack/react-table";

// const Payment = () => {
//     const [allPayment, setAllPayment] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [loading, setLoading] = useState(true);

//     // Delete modal state
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [deleteItemId, setDeleteItemId] = useState(null);
//     const [password, setPassword] = useState("");
//     const [deleting, setDeleting] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     // Search
//     const [globalFilter, setGlobalFilter] = useState("");

//     // Accordion: only ONE customer card open at a time. null = all closed.
//     const [openGroup, setOpenGroup] = useState(null);

//     useEffect(() => {
//         const fetchPayment = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourpayments.index"));
//                 setAllPayment(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 toast.error("Failed to load payments");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPayment();
//     }, [reloadTrigger]);

//     const openDeleteModal = (id) => {
//         setDeleteItemId(id);
//         setPassword("");
//         setShowPassword(false);
//         setShowDeleteModal(true);
//     };

//     const closeDeleteModal = () => {
//         setShowDeleteModal(false);
//         setDeleteItemId(null);
//         setPassword("");
//         setShowPassword(false);
//     };

//     const handleDelete = async () => {
//         if (!deleteItemId) {
//             toast.error("No Payment Selected For Deletion");
//             return;
//         }

//         if (!password) {
//             toast.error("Password is required for deletion");
//             return;
//         }

//         setDeleting(true);
//         try {
//             const verifyResponse = await axios.post(route("password.verify"), {
//                 password: password,
//             });

//             if (!verifyResponse.data.verified) {
//                 toast.error("Incorrect password");
//                 setDeleting(false);
//                 return;
//             }

//             await axios.delete(
//                 route("ourpayments.destroy", { id: deleteItemId })
//             );

//             toast.success("Payment deleted successfully");
//             setReloadTrigger((prev) => !prev);
//             closeDeleteModal();
//         } catch (error) {
//             console.error(error);
//             if (error.response?.status === 422) {
//                 toast.error("Password verification failed");
//             } else {
//                 toast.error("Something went wrong while deleting");
//             }
//         } finally {
//             setDeleting(false);
//         }
//     };

//     const togglePasswordVisibility = () => setShowPassword(!showPassword);

//     // Toggle a group: clicking the open one closes it, clicking any other
//     // card closes the previous one and opens the new one.
//     const toggleGroup = (key) => {
//         setOpenGroup((prev) => (prev === key ? null : key));
//     };

//     // Search across every relevant field
//     const globalFilterFn = (row, columnId, filterValue) => {
//         const p = row.original;
//         const haystack = [
//             p.customer_name,
//             p.service_type,
//             p.payment_reference,
//             p.invoice_reference,
//             p.paymentmode,
//             p.receiveddate,
//             String(p.amount ?? ""),
//         ]
//             .join(" ")
//             .toLowerCase();
//         return haystack.includes(String(filterValue).toLowerCase());
//     };

//     // react-table is used purely for its filtering engine here — no columns
//     // needed since we're rendering cards, not a <table>.
//     const table = useReactTable({
//         data: allPayment,
//         columns: [],
//         state: { globalFilter },
//         onGlobalFilterChange: setGlobalFilter,
//         globalFilterFn,
//         getCoreRowModel: getCoreRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//     });

//     // Group the FILTERED rows by customer_name.
//     // Data arrives newest-first from the backend (Payment::latest()), and
//     // getFilteredRowModel() preserves that order — so the first time a
//     // customer appears is always their most recent payment. That first
//     // appearance sets the group's position: whichever customer paid most
//     // recently ends up on top, and all their other payments stay grouped
//     // with them no matter when those happened.
//     const groupedPayments = useMemo(() => {
//         const map = new Map();
//         const order = [];

//         table.getFilteredRowModel().rows.forEach((row) => {
//             const key = (row.original.customer_name || "Unknown").trim();
//             if (!map.has(key)) {
//                 map.set(key, []);
//                 order.push(key);
//             }
//             map.get(key).push(row.original);
//         });

//         return order.map((key) => {
//             const payments = map.get(key);
//             const total = payments.reduce(
//                 (sum, p) => sum + parseFloat(p.amount || 0),
//                 0
//             );
//             return { key, payments, total };
//         });
//     }, [table.getFilteredRowModel().rows, globalFilter, allPayment]);

//     // If a search narrows results so the open card no longer exists, close it.
//     useEffect(() => {
//         if (openGroup && !groupedPayments.some((g) => g.key === openGroup)) {
//             setOpenGroup(null);
//         }
//     }, [groupedPayments, openGroup]);

//     return (
//         <AdminWrapper>
//             <Head title="Payment Management" />
//             <div className="">
//                 <div className="flex items-center justify-between mb-6">
//                     <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                         Payment Management
//                     </h1>
//                     <div className="mb-4">
//                         <input
//                             type="text"
//                             placeholder="Search by customer, service type, payment reference, invoice reference, or payment mode..."
//                             value={globalFilter}
//                             onChange={(e) => setGlobalFilter(e.target.value)}
//                             className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                 </div>

//                 {loading ? (
//                     <PageLoader />
//                 ) : groupedPayments.length === 0 ? (
//                     <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
//                         No payments found.
//                     </div>
//                 ) : (
//                     <div className="space-y-3">
//                         {groupedPayments.map((group) => {
//                             const isOpen = openGroup === group.key;
//                             return (
//                                 <div
//                                     key={group.key}
//                                     className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
//                                         isOpen
//                                             ? "border-indigo-200 shadow-md shadow-indigo-50"
//                                             : "border-gray-100 hover:border-gray-200"
//                                     }`}
//                                 >
//                                     {/* Card header — click to expand/collapse */}
//                                     <button
//                                         onClick={() => toggleGroup(group.key)}
//                                         className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
//                                     >
//                                         <div className="flex items-center gap-3 min-w-0">
//                                             <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
//                                                 <Building2
//                                                     size={18}
//                                                     className="text-indigo-600"
//                                                 />
//                                             </div>
//                                             <div className="min-w-0">
//                                                 <div className="flex items-center gap-2">
//                                                     <h3 className="font-semibold text-gray-800 truncate">
//                                                         {group.key}
//                                                     </h3>
//                                                     {group.payments.length > 1 && (
//                                                         <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 flex-shrink-0">
//                                                             {group.payments.length}{" "}
//                                                             payments
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                                 <p className="text-xs text-gray-400 mt-0.5">
//                                                     Latest:{" "}
//                                                     {group.payments[0]
//                                                         ?.receiveddate ?? "—"}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-center gap-4 flex-shrink-0">
//                                             <span className="text-sm font-semibold text-gray-700">
//                                                 NPR {group.total.toLocaleString()}
//                                             </span>
//                                             <span className="text-gray-400">
//                                                 {isOpen ? (
//                                                     <ChevronUp size={18} />
//                                                 ) : (
//                                                     <ChevronDown size={18} />
//                                                 )}
//                                             </span>
//                                         </div>
//                                     </button>

//                                     {/* Expanded payment list */}
//                                     {isOpen && (
//                                         <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 space-y-3">
//                                             {group.payments.map((payment) => (
//                                                 <div
//                                                     key={payment.id}
//                                                     className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
//                                                 >
//                                                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 flex-1 min-w-0">
//                                                         <div>
//                                                             <p className="text-[10px] uppercase tracking-wide text-gray-400 flex items-center gap-1">
//                                                                 <Receipt size={11} />
//                                                                 Amount
//                                                             </p>
//                                                             <p className="text-sm font-semibold text-gray-800">
//                                                                 NPR{" "}
//                                                                 {parseFloat(
//                                                                     payment.amount ||
//                                                                         0
//                                                                 ).toLocaleString()}
//                                                             </p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-[10px] uppercase tracking-wide text-gray-400 flex items-center gap-1">
//                                                                 <FileText size={11} />
//                                                                 Service
//                                                             </p>
//                                                             <p className="text-sm text-gray-700 truncate">
//                                                                 {payment.service_type ||
//                                                                     "—"}
//                                                             </p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-[10px] uppercase tracking-wide text-gray-400 flex items-center gap-1">
//                                                                 <CreditCard
//                                                                     size={11}
//                                                                 />
//                                                                 Mode
//                                                             </p>
//                                                             <p className="text-sm text-gray-700 truncate">
//                                                                 {payment.paymentmode ||
//                                                                     "—"}
//                                                             </p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-[10px] uppercase tracking-wide text-gray-400 flex items-center gap-1">
//                                                                 <CalendarDays
//                                                                     size={11}
//                                                                 />
//                                                                 Received
//                                                             </p>
//                                                             <p className="text-sm text-gray-700 truncate">
//                                                                 {payment.receiveddate ||
//                                                                     "—"}
//                                                             </p>
//                                                         </div>
//                                                         <div className="col-span-2 sm:col-span-2">
//                                                             <p className="text-[10px] uppercase tracking-wide text-gray-400 flex items-center gap-1">
//                                                                 <Hash size={11} />
//                                                                 Payment Ref
//                                                             </p>
//                                                             <p className="text-sm text-gray-700 truncate">
//                                                                 {payment.payment_reference ||
//                                                                     "—"}
//                                                             </p>
//                                                         </div>
//                                                         <div className="col-span-2 sm:col-span-2">
//                                                             <p className="text-[10px] uppercase tracking-wide text-gray-400 flex items-center gap-1">
//                                                                 <Hash size={11} />
//                                                                 Invoice Ref
//                                                             </p>
//                                                             <p className="text-sm text-gray-700 truncate">
//                                                                 {payment.invoice_reference ||
//                                                                     "—"}
//                                                             </p>
//                                                         </div>
//                                                     </div>

//                                                     <button
//                                                         onClick={() =>
//                                                             openDeleteModal(
//                                                                 payment.id
//                                                             )
//                                                         }
//                                                         className="self-end sm:self-center p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
//                                                     >
//                                                         <Trash2 size={16} />
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             );
//                         })}

//                         {/* Footer summary */}
//                         <div className="flex items-center justify-between text-xs text-gray-400 px-2 pt-2">
//                             <span>
//                                 {groupedPayments.length}{" "}
//                                 {groupedPayments.length === 1
//                                     ? "customer"
//                                     : "customers"}
//                             </span>
//                             <span>
//                                 {table.getFilteredRowModel().rows.length} total
//                                 payments
//                             </span>
//                         </div>
//                     </div>
//                 )}

//                 {/* Delete Confirmation Modal */}
//                 {showDeleteModal && (
//                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                         <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
//                             <h2 className="text-lg font-bold text-gray-800 mb-1">
//                                 Confirm Deletion
//                             </h2>
//                             <p className="text-sm text-gray-500 mb-4">
//                                 Enter your password to permanently delete this
//                                 payment.
//                             </p>

//                             <div className="relative">
//                                 <input
//                                     type={showPassword ? "text" : "password"}
//                                     placeholder="Your password"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     onKeyDown={(e) =>
//                                         e.key === "Enter" && handleDelete()
//                                     }
//                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
//                                     autoFocus
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={togglePasswordVisibility}
//                                     className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
//                                 >
//                                     {showPassword ? (
//                                         <EyeOff size={18} />
//                                     ) : (
//                                         <Eye size={18} />
//                                     )}
//                                 </button>
//                             </div>

//                             <div className="flex gap-3 justify-end mt-4">
//                                 <button
//                                     onClick={closeDeleteModal}
//                                     className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleDelete}
//                                     disabled={deleting}
//                                     className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
//                                 >
//                                     {deleting ? "Deleting..." : "Delete"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// export default Payment;