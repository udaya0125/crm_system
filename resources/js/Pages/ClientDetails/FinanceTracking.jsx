import AddFinanceTrackingForm from "@/AddFormComponents/AddFinanceTrackingForm";
import EditFinanceTrackingForm from "@/EditFormComponents/EditFinanceTrackingForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { Head } from "@inertiajs/react";
import PageLoader from "@/Loader/PageLoader";

const FinanceTracking = () => {
    const [allTracking, setAllTracking] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingTracking, setEditingTracking] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        const fetchTracking = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourfinance.index"));
                setAllTracking(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTracking();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (
            !window.confirm("Are you sure you want to delete this tracking entry?")
        ) {
            return;
        }
        try {
            await axios.delete(route("ourfinance.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (tracking) => {
        setEditingTracking(tracking);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourfinance.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating tracking", error);
            throw error;
        }
    };

    const statusStyles = {
        unpaid: "bg-red-100 text-red-700",
        paid: "bg-emerald-100 text-emerald-700",
        pending: "bg-amber-100 text-amber-700",
        overdue: "bg-red-100 text-red-700",
        partially_paid: "bg-blue-100 text-blue-700",
    };

    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                Header: "Invoice ID",
                accessor: "invoice_id",
                Cell: ({ value }) => (
                    <span className="font-mono text-indigo-600 font-medium">
                        {value}
                    </span>
                ),
            },
            {
                Header: "Client",
                accessor: "client",
                Cell: ({ value }) => (
                    <span className="text-stone-700">{value}</span>
                ),
            },
            {
                Header: "Project",
                accessor: "project",
                Cell: ({ value }) => (
                    <span className="text-stone-600">{value}</span>
                ),
            },
            // {
            //     Header: "Invoice Date",
            //     accessor: "invoice_date",
            //     Cell: ({ value }) => (
            //         <span className="text-stone-500">{value}</span>
            //     ),
            // },
            {
                Header: "Due Date",
                accessor: "due_date",
                Cell: ({ value }) => (
                    <span className="text-stone-500">{value}</span>
                ),
            },
            {
                Header: "Amount",
                accessor: "amount",
                Cell: ({ value }) => (
                    <span className="font-medium text-stone-800">
                        NPR {Number(value).toLocaleString()}
                    </span>
                ),
            },
            {
                Header: "Paid",
                accessor: "paid_amount",
                Cell: ({ value }) => (
                    <span className="text-emerald-600">
                        NPR {Number(value).toLocaleString()}
                    </span>
                ),
            },
            // {
            //     Header: "Balance",
            //     accessor: "balance",
            //     Cell: ({ value }) => (
            //         <span className="text-rose-600">
            //             NPR {Number(value).toLocaleString()}
            //         </span>
            //     ),
            // },
            {
                Header: "Balance",
                accessor: "balance",
                Cell: ({ value }) => (
                    <span
                        className={
                            Number(value) === 0
                                ? "text-green-600"
                                : "text-rose-600"
                        }
                    >
                        NPR {Number(value).toLocaleString()}
                    </span>
                ),
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => (
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[value] ?? "bg-stone-100 text-stone-600"}`}
                    >
                        {value}
                    </span>
                ),
            },
            {
                Header: "Days Overdue",
                accessor: (row) => {
                    const balance = Number(row.balance);
                    const dueDate = new Date(row.due_date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return balance > 0 && dueDate < today
                        ? Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
                        : 0;
                },
                Cell: ({ value }) => {
                    if (value > 0) {
                        return (
                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    value <= 30
                                        ? "bg-amber-100 text-amber-700"
                                        : value <= 60
                                          ? "bg-orange-100 text-orange-700"
                                          : value <= 90
                                            ? "bg-rose-100 text-rose-700"
                                            : "bg-red-100 text-red-700"
                                }`}
                            >
                                {value} days
                            </span>
                        );
                    }
                    return <span className="text-stone-400">---</span>;
                },
            },
            {
                Header: "Actions",
                accessor: "id",
                Cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
                        >
                            <Edit size={15} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <AdminWrapper>
            <Head title="Finance Tracking" />
            <div className="container mx-auto py-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Finance Tracking
                    </h1>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <span>+</span>
                        Create
                    </button>
                </div>

                {/* Table */}
                {/* <MyTable
                    columns={columns}
                    data={allTracking}
                    loading={loading}
                /> */}

                {loading ? (
                    <PageLoader />
                ) : (
                    <MyTable columns={columns} data={allTracking} />
                )}

                {/* Add Modal */}
                {showAddForm && (
                    <AddFinanceTrackingForm
                        setShowForm={() => setShowAddForm(false)}
                        setReloadTrigger={setReloadTrigger}
                    />
                )}

                {/* Edit Modal */}
                {showEditForm && editingTracking && (
                    <EditFinanceTrackingForm
                        editingTracking={editingTracking}
                        setShowForm={() => {
                            setShowEditForm(false);
                            setEditingTracking(null);
                        }}
                        handleUpdate={handleUpdate}
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default FinanceTracking;

// import AddFinanceTrackingForm from "@/AddFormComponents/AddFinanceTrackingForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import MyTable from "@/TableComponents/MyTable";
// import axios from "axios";
// import { Edit2, Trash2, Clock, Edit } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";

// const FinanceTracking = () => {
//     const [allTracking, setAllTracking] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [editingTracking, setEditingTracking] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [agingReport, setAgingReport] = useState({
//         "0-30 days": { total: 0, count: 0, invoices: [] },
//         "31-60 days": { total: 0, count: 0, invoices: [] },
//         "61-90 days": { total: 0, count: 0, invoices: [] },
//         "90+ days": { total: 0, count: 0, invoices: [] },
//     });

//     useEffect(() => {
//         const fetchTracking = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourfinance.index"));
//                 const trackingData = response.data.data;
//                 setAllTracking(trackingData);
//                 calculateAgingReport(trackingData);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchTracking();
//     }, [reloadTrigger]);

//     const calculateAgingReport = (trackingData) => {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const report = {
//             "0-30 days": { total: 0, count: 0, invoices: [] },
//             "31-60 days": { total: 0, count: 0, invoices: [] },
//             "61-90 days": { total: 0, count: 0, invoices: [] },
//             "90+ days": { total: 0, count: 0, invoices: [] },
//         };

//         trackingData.forEach((item) => {
//             const balance = Number(item.balance);
//             if (balance > 0 && item.due_date) {
//                 const dueDate = new Date(item.due_date);
//                 dueDate.setHours(0, 0, 0, 0);

//                 const daysOverdue = Math.floor(
//                     (today - dueDate) / (1000 * 60 * 60 * 24),
//                 );

//                 if (daysOverdue > 0) {
//                     if (daysOverdue <= 30) {
//                         report["0-30 days"].total += balance;
//                         report["0-30 days"].count += 1;
//                         report["0-30 days"].invoices.push({
//                             id: item.id,
//                             invoice_id: item.invoice_id,
//                             client: item.client,
//                             amount: balance,
//                             due_date: item.due_date,
//                             days: daysOverdue,
//                         });
//                     } else if (daysOverdue <= 60) {
//                         report["31-60 days"].total += balance;
//                         report["31-60 days"].count += 1;
//                         report["31-60 days"].invoices.push({
//                             id: item.id,
//                             invoice_id: item.invoice_id,
//                             client: item.client,
//                             amount: balance,
//                             due_date: item.due_date,
//                             days: daysOverdue,
//                         });
//                     } else if (daysOverdue <= 90) {
//                         report["61-90 days"].total += balance;
//                         report["61-90 days"].count += 1;
//                         report["61-90 days"].invoices.push({
//                             id: item.id,
//                             invoice_id: item.invoice_id,
//                             client: item.client,
//                             amount: balance,
//                             due_date: item.due_date,
//                             days: daysOverdue,
//                         });
//                     } else {
//                         report["90+ days"].total += balance;
//                         report["90+ days"].count += 1;
//                         report["90+ days"].invoices.push({
//                             id: item.id,
//                             invoice_id: item.invoice_id,
//                             client: item.client,
//                             amount: balance,
//                             due_date: item.due_date,
//                             days: daysOverdue,
//                         });
//                     }
//                 }
//             }
//         });

//         setAgingReport(report);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(route("ourfinance.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (tracking) => {
//         setEditingTracking(tracking);
//         setShowAddForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourfinance.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating tracking", error);
//             throw error;
//         }
//     };

//     const handleCloseForm = () => {
//         setShowAddForm(false);
//         setEditingTracking(null);
//     };

//     const statusStyles = {
//         unpaid: "bg-red-100 text-red-700",
//         paid: "bg-emerald-100 text-emerald-700",
//         pending: "bg-amber-100 text-amber-700",
//         overdue: "bg-red-100 text-red-700",
//         partially_paid: "bg-blue-100 text-blue-700",
//     };

//     const agingColors = {
//         "0-30 days": "bg-amber-50 border-amber-200",
//         "31-60 days": "bg-orange-50 border-orange-200",
//         "61-90 days": "bg-rose-50 border-rose-200",
//         "90+ days": "bg-red-50 border-red-200",
//     };

//     const totalOverdue = Object.values(agingReport).reduce(
//         (sum, category) => sum + category.total,
//         0,
//     );

//     // Define columns for MyTable
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "s/n",
//                 accessor: "index",
//                 Cell: ({ row }) => <span>{row.index + 1}</span>,
//             },
//             {
//                 Header: "Invoice ID",
//                 accessor: "invoice_id",
//                 Cell: ({ value }) => (
//                     <span className="font-mono text-indigo-600 font-medium">
//                         {value}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Client",
//                 accessor: "client",
//                 Cell: ({ value }) => (
//                     <span className="text-stone-700">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Project",
//                 accessor: "project",
//                 Cell: ({ value }) => (
//                     <span className="text-stone-600">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Invoice Date",
//                 accessor: "invoice_date",
//                 Cell: ({ value }) => (
//                     <span className="text-stone-500">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Due Date",
//                 accessor: "due_date",
//                 Cell: ({ value }) => (
//                     <span className="text-stone-500">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Amount",
//                 accessor: "amount",
//                 Cell: ({ value }) => (
//                     <span className="font-medium text-stone-800">
//                         NPR {Number(value).toLocaleString()}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Paid",
//                 accessor: "paid_amount",
//                 Cell: ({ value }) => (
//                     <span className="text-emerald-600">
//                         NPR {Number(value).toLocaleString()}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Balance",
//                 accessor: "balance",
//                 Cell: ({ value }) => (
//                     <span className="text-rose-600">
//                         NPR {Number(value).toLocaleString()}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Status",
//                 accessor: "status",
//                 Cell: ({ value }) => (
//                     <span
//                         className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[value] ?? "bg-stone-100 text-stone-600"}`}
//                     >
//                         {value}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Days Overdue",
//                 accessor: (row) => {
//                     const balance = Number(row.balance);
//                     const dueDate = new Date(row.due_date);
//                     const today = new Date();
//                     today.setHours(0, 0, 0, 0);
//                     const daysOverdue =
//                         balance > 0 && dueDate < today
//                             ? Math.floor(
//                                   (today - dueDate) / (1000 * 60 * 60 * 24),
//                               )
//                             : 0;
//                     return daysOverdue;
//                 },
//                 Cell: ({ value }) => {
//                     if (value > 0) {
//                         return (
//                             <span
//                                 className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
//                                     value <= 30
//                                         ? "bg-amber-100 text-amber-700"
//                                         : value <= 60
//                                           ? "bg-orange-100 text-orange-700"
//                                           : value <= 90
//                                             ? "bg-rose-100 text-rose-700"
//                                             : "bg-red-100 text-red-700"
//                                 }`}
//                             >
//                                 {value} days
//                             </span>
//                         );
//                     }
//                     return <span className="text-stone-400">-</span>;
//                 },
//             },
//             {
//                 Header: "Actions",
//                 accessor: "id",
//                 Cell: ({ row }) => (
//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
//                         >
//                             <Edit size={15} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
//                         >
//                             <Trash2 size={15} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [],
//     );

//     return (
//         <AdminWrapper>
//             <div className="container mx-auto py-4">
//                 {/* Header */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
//                         Finance Tracking
//                     </h1>
//                     <button
//                         onClick={() => {
//                             setEditingTracking(null);
//                             setShowAddForm(true);
//                         }}
//                         className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <span>+</span>
//                         Create
//                     </button>
//                 </div>

//                 {/* MyTable Component with integrated loading */}
//                 <MyTable
//                     columns={columns}
//                     data={allTracking}
//                     loading={loading}
//                 />

//                 {/* Modal */}
//                 {showAddForm && (
//                     <AddFinanceTrackingForm
//                         editingTracking={editingTracking}
//                         setShowForm={handleCloseForm}
//                         setReloadTrigger={setReloadTrigger}
//                         handleUpdate={handleUpdate}
//                     />
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// export default FinanceTracking;
