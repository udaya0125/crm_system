// import AddFinanceTrackingForm from "@/AddFormComponents/AddFinanceTrackingForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Edit2, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const FinanceTracking = () => {
//     const [allTracking, setAllTracking] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTracking, setEditingTracking] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);

//     useEffect(() => {
//         const fetchTracking = async () => {
//             try {
//                 // ✅ Fixed: was ourtracking.index
//                 const response = await axios.get(route("ourfinance.index"));
//                 // ✅ Fixed: response.data is {status, data:[]} — extract the array
//                 setAllTracking(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         fetchTracking();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         try {
//             // ✅ Fixed: was ourtracking.destroy
//             await axios.delete(route("ourfinance.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (tracking) => {
//         setEditingTracking(tracking);
//         setShowAddForm(true); // ✅ Fixed: open form when editing
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             // ✅ Fixed: was ourtracking.update
//             const response = await axios.post(
//                 route("ourfinance.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating tracking", error);
//             throw error;
//         }
//     };

//     // ✅ Fixed: closing the form also clears editingTracking
//     const handleCloseForm = () => {
//         setShowAddForm(false);
//         setEditingTracking(null);
//     };

//     const statusStyles = {
//         paid: "bg-emerald-100 text-emerald-700",
//         pending: "bg-amber-100 text-amber-700",
//         overdue: "bg-red-100 text-red-700",
//     };

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
//                             setEditingTracking(null); // ensure fresh form
//                             setShowAddForm(true);
//                         }}
//                         className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 {/* Table */}
//                 <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-sm">
//                             <thead>
//                                 <tr className="bg-stone-50 border-b border-stone-200">
//                                     {["Invoice ID", "Client", "Project", "Invoice Date", "Due Date", "Amount", "Paid", "Balance", "Status", "Actions"].map(
//                                         (h) => (
//                                             <th
//                                                 key={h}
//                                                 className="text-left px-4 py-3 text-xs font-semibold tracking-widest text-stone-500 uppercase"
//                                             >
//                                                 {h}
//                                             </th>
//                                         )
//                                     )}
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-stone-100">
//                                 {allTracking.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={10} className="text-center py-12 text-stone-400">
//                                             No records found. Create one to get started.
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     allTracking.map((item) => (
//                                         <tr key={item.id} className="hover:bg-stone-50 transition-colors">
//                                             <td className="px-4 py-3 font-mono text-indigo-600 font-medium">{item.invoice_id}</td>
//                                             <td className="px-4 py-3 text-stone-700">{item.client}</td>
//                                             <td className="px-4 py-3 text-stone-600">{item.project}</td>
//                                             <td className="px-4 py-3 text-stone-500">{item.invoice_date}</td>
//                                             <td className="px-4 py-3 text-stone-500">{item.due_date}</td>
//                                             <td className="px-4 py-3 font-medium text-stone-800">${Number(item.amount).toLocaleString()}</td>
//                                             <td className="px-4 py-3 text-emerald-600">${Number(item.paid_amount).toLocaleString()}</td>
//                                             <td className="px-4 py-3 text-rose-600">${Number(item.balance).toLocaleString()}</td>
//                                             <td className="px-4 py-3">
//                                                 <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[item.status] ?? "bg-stone-100 text-stone-600"}`}>
//                                                     {item.status}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-3">
//                                                 <div className="flex items-center gap-2">
//                                                     <button
//                                                         onClick={() => handleEdit(item)}
//                                                         className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
//                                                     >
//                                                         <Edit2 size={15} />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDelete(item.id)}
//                                                         className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
//                                                     >
//                                                         <Trash2 size={15} />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Modal */}
//                 {showAddForm && (
//                     <AddFinanceTrackingForm
//                         editingTracking={editingTracking}
//                         setShowForm={handleCloseForm} // ✅ use unified close handler
//                         setReloadTrigger={setReloadTrigger}
//                         handleUpdate={handleUpdate}
//                     />
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// export default FinanceTracking;\


// import AddFinanceTrackingForm from "@/AddFormComponents/AddFinanceTrackingForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Edit2, Plus, Trash2, AlertCircle, Clock } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const FinanceTracking = () => {
//     const [allTracking, setAllTracking] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTracking, setEditingTracking] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [agingReport, setAgingReport] = useState({
//         "0-30 days": { total: 0, count: 0, invoices: [] },
//         "31-60 days": { total: 0, count: 0, invoices: [] },
//         "61-90 days": { total: 0, count: 0, invoices: [] },
//         "90+ days": { total: 0, count: 0, invoices: [] }
//     });

//     useEffect(() => {
//         const fetchTracking = async () => {
//             try {
//                 const response = await axios.get(route("ourfinance.index"));
//                 const trackingData = response.data.data;
//                 setAllTracking(trackingData);
//                 calculateAgingReport(trackingData);
//             } catch (error) {
//                 console.error("fetching error ", error);
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
//             "90+ days": { total: 0, count: 0, invoices: [] }
//         };

//         trackingData.forEach(item => {
//             // Check if invoice has balance (not fully paid) and is overdue
//             const balance = Number(item.balance);
//             if (balance > 0 && item.due_date) {
//                 const dueDate = new Date(item.due_date);
//                 dueDate.setHours(0, 0, 0, 0);
                
//                 // Calculate days overdue (only if due date is in the past)
//                 const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                
//                 if (daysOverdue > 0) {
//                     // Categorize based on days overdue
//                     if (daysOverdue <= 30) {
//                         report["0-30 days"].total += balance;
//                         report["0-30 days"].count += 1;
//                         report["0-30 days"].invoices.push({
//                             id: item.id,
//                             invoice_id: item.invoice_id,
//                             client: item.client,
//                             amount: balance,
//                             due_date: item.due_date,
//                             days: daysOverdue
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
//                             days: daysOverdue
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
//                             days: daysOverdue
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
//                             days: daysOverdue
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
//                 { headers: { "Content-Type": "multipart/form-data" } }
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
//         partially_paid: "bg-blue-100 text-blue-700"
//     };

//     const agingColors = {
//         "0-30 days": "bg-amber-50 border-amber-200",
//         "31-60 days": "bg-orange-50 border-orange-200",
//         "61-90 days": "bg-rose-50 border-rose-200",
//         "90+ days": "bg-red-50 border-red-200"
//     };

//     const totalOverdue = Object.values(agingReport).reduce((sum, category) => sum + category.total, 0);

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
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 {/* Aging Report Section */}
//                 {totalOverdue > 0 && (
//                     <div className="mb-8">
//                         {/* <div className="flex items-center gap-2 mb-4">
//                             <AlertCircle className="text-amber-600" size={24} />
//                             <h2 className="text-2xl font-bold text-stone-800">Aging Report</h2>
//                             <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
//                                 Total Overdue: ${totalOverdue.toLocaleString()}
//                             </span>
//                         </div> */}
                        
//                         {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                             {Object.entries(agingReport).map(([period, data]) => (
//                                 data.count > 0 && (
//                                     <div 
//                                         key={period} 
//                                         className={`rounded-xl border p-4 ${agingColors[period]}`}
//                                     >
//                                         <div className="flex justify-between items-start mb-3">
//                                             <div>
//                                                 <h3 className="font-semibold text-stone-800">{period}</h3>
//                                                 <p className="text-2xl font-bold text-stone-900">
//                                                     ${data.total.toLocaleString()}
//                                                 </p>
//                                             </div>
//                                             <span className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
//                                                 {data.count} {data.count === 1 ? 'invoice' : 'invoices'}
//                                             </span>
//                                         </div>
                                        
                                     
//                                         <div className="space-y-2 mt-3">
//                                             {data.invoices.slice(0, 3).map(invoice => (
//                                                 <div key={invoice.id} className="text-xs flex justify-between items-center bg-white/30 p-2 rounded">
//                                                     <div>
//                                                         <span className="font-mono font-medium">{invoice.invoice_id}</span>
//                                                         <span className="text-stone-600 ml-2">- {invoice.client}</span>
//                                                     </div>
//                                                     <div className="flex items-center gap-2">
//                                                         <span className="font-medium">${invoice.amount.toLocaleString()}</span>
//                                                         <span className="flex items-center gap-1 text-amber-700">
//                                                             <Clock size={12} />
//                                                             {invoice.days}d
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                             {data.invoices.length > 3 && (
//                                                 <p className="text-xs text-stone-600 mt-2 text-center">
//                                                     +{data.invoices.length - 3} more invoices
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 )
//                             ))}
//                         </div> */}
//                     </div>
//                 )}

//                 {/* Table */}
//                 <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-sm">
//                             <thead>
//                                 <tr className="bg-stone-50 border-b border-stone-200">
//                                     {["Invoice ID", "Client", "Project", "Invoice Date", "Due Date", "Amount", "Paid", "Balance", "Status", "Days Overdue", "Actions"].map(
//                                         (h) => (
//                                             <th
//                                                 key={h}
//                                                 className="text-left px-4 py-3 text-xs font-semibold tracking-widest text-stone-500 uppercase"
//                                             >
//                                                 {h}
//                                             </th>
//                                         )
//                                     )}
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-stone-100">
//                                 {allTracking.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={11} className="text-center py-12 text-stone-400">
//                                             No records found. Create one to get started.
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     allTracking.map((item) => {
//                                         const balance = Number(item.balance);
//                                         const dueDate = new Date(item.due_date);
//                                         const today = new Date();
//                                         today.setHours(0, 0, 0, 0);
//                                         const daysOverdue = balance > 0 && dueDate < today 
//                                             ? Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
//                                             : 0;
                                        
//                                         return (
//                                             <tr key={item.id} className="hover:bg-stone-50 transition-colors">
//                                                 <td className="px-4 py-3 font-mono text-indigo-600 font-medium">{item.invoice_id}</td>
//                                                 <td className="px-4 py-3 text-stone-700">{item.client}</td>
//                                                 <td className="px-4 py-3 text-stone-600">{item.project}</td>
//                                                 <td className="px-4 py-3 text-stone-500">{item.invoice_date}</td>
//                                                 <td className="px-4 py-3 text-stone-500">{item.due_date}</td>
//                                                 <td className="px-4 py-3 font-medium text-stone-800">${Number(item.amount).toLocaleString()}</td>
//                                                 <td className="px-4 py-3 text-emerald-600">${Number(item.paid_amount).toLocaleString()}</td>
//                                                 <td className="px-4 py-3 text-rose-600">${balance.toLocaleString()}</td>
//                                                 <td className="px-4 py-3">
//                                                     <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[item.status] ?? "bg-stone-100 text-stone-600"}`}>
//                                                         {item.status}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-4 py-3">
//                                                     {daysOverdue > 0 ? (
//                                                         <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
//                                                             daysOverdue <= 30 ? 'bg-amber-100 text-amber-700' :
//                                                             daysOverdue <= 60 ? 'bg-orange-100 text-orange-700' :
//                                                             daysOverdue <= 90 ? 'bg-rose-100 text-rose-700' :
//                                                             'bg-red-100 text-red-700'
//                                                         }`}>
//                                                             {daysOverdue} days
//                                                         </span>
//                                                     ) : (
//                                                         <span className="text-stone-400">-</span>
//                                                     )}
//                                                 </td>
//                                                 <td className="px-4 py-3">
//                                                     <div className="flex items-center gap-2">
//                                                         <button
//                                                             onClick={() => handleEdit(item)}
//                                                             className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
//                                                         >
//                                                             <Edit2 size={15} />
//                                                         </button>
//                                                         <button
//                                                             onClick={() => handleDelete(item.id)}
//                                                             className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
//                                                         >
//                                                             <Trash2 size={15} />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

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


import AddFinanceTrackingForm from "@/AddFormComponents/AddFinanceTrackingForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import { Edit2, Trash2, Clock } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

const FinanceTracking = () => {
    const [allTracking, setAllTracking] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTracking, setEditingTracking] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [agingReport, setAgingReport] = useState({
        "0-30 days": { total: 0, count: 0, invoices: [] },
        "31-60 days": { total: 0, count: 0, invoices: [] },
        "61-90 days": { total: 0, count: 0, invoices: [] },
        "90+ days": { total: 0, count: 0, invoices: [] }
    });

    useEffect(() => {
        const fetchTracking = async () => {
            try {
                const response = await axios.get(route("ourfinance.index"));
                const trackingData = response.data.data;
                setAllTracking(trackingData);
                calculateAgingReport(trackingData);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        fetchTracking();
    }, [reloadTrigger]);

    const calculateAgingReport = (trackingData) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const report = {
            "0-30 days": { total: 0, count: 0, invoices: [] },
            "31-60 days": { total: 0, count: 0, invoices: [] },
            "61-90 days": { total: 0, count: 0, invoices: [] },
            "90+ days": { total: 0, count: 0, invoices: [] }
        };

        trackingData.forEach(item => {
            const balance = Number(item.balance);
            if (balance > 0 && item.due_date) {
                const dueDate = new Date(item.due_date);
                dueDate.setHours(0, 0, 0, 0);
                
                const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                
                if (daysOverdue > 0) {
                    if (daysOverdue <= 30) {
                        report["0-30 days"].total += balance;
                        report["0-30 days"].count += 1;
                        report["0-30 days"].invoices.push({
                            id: item.id,
                            invoice_id: item.invoice_id,
                            client: item.client,
                            amount: balance,
                            due_date: item.due_date,
                            days: daysOverdue
                        });
                    } else if (daysOverdue <= 60) {
                        report["31-60 days"].total += balance;
                        report["31-60 days"].count += 1;
                        report["31-60 days"].invoices.push({
                            id: item.id,
                            invoice_id: item.invoice_id,
                            client: item.client,
                            amount: balance,
                            due_date: item.due_date,
                            days: daysOverdue
                        });
                    } else if (daysOverdue <= 90) {
                        report["61-90 days"].total += balance;
                        report["61-90 days"].count += 1;
                        report["61-90 days"].invoices.push({
                            id: item.id,
                            invoice_id: item.invoice_id,
                            client: item.client,
                            amount: balance,
                            due_date: item.due_date,
                            days: daysOverdue
                        });
                    } else {
                        report["90+ days"].total += balance;
                        report["90+ days"].count += 1;
                        report["90+ days"].invoices.push({
                            id: item.id,
                            invoice_id: item.invoice_id,
                            client: item.client,
                            amount: balance,
                            due_date: item.due_date,
                            days: daysOverdue
                        });
                    }
                }
            }
        });

        setAgingReport(report);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(route("ourfinance.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (tracking) => {
        setEditingTracking(tracking);
        setShowAddForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourfinance.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating tracking", error);
            throw error;
        }
    };

    const handleCloseForm = () => {
        setShowAddForm(false);
        setEditingTracking(null);
    };

    const statusStyles = {
        unpaid: "bg-red-100 text-red-700",
        paid: "bg-emerald-100 text-emerald-700",
        pending: "bg-amber-100 text-amber-700",
        overdue: "bg-red-100 text-red-700",
        partially_paid: "bg-blue-100 text-blue-700"
    };

    const agingColors = {
        "0-30 days": "bg-amber-50 border-amber-200",
        "31-60 days": "bg-orange-50 border-orange-200",
        "61-90 days": "bg-rose-50 border-rose-200",
        "90+ days": "bg-red-50 border-red-200"
    };

    const totalOverdue = Object.values(agingReport).reduce((sum, category) => sum + category.total, 0);

    // Define columns for MyTable
    const columns = useMemo(() => [
        {
            Header: 'Invoice ID',
            accessor: 'invoice_id',
            Cell: ({ value }) => (
                <span className="font-mono text-indigo-600 font-medium">{value}</span>
            )
        },
        {
            Header: 'Client',
            accessor: 'client',
            Cell: ({ value }) => <span className="text-stone-700">{value}</span>
        },
        {
            Header: 'Project',
            accessor: 'project',
            Cell: ({ value }) => <span className="text-stone-600">{value}</span>
        },
        {
            Header: 'Invoice Date',
            accessor: 'invoice_date',
            Cell: ({ value }) => <span className="text-stone-500">{value}</span>
        },
        {
            Header: 'Due Date',
            accessor: 'due_date',
            Cell: ({ value }) => <span className="text-stone-500">{value}</span>
        },
        {
            Header: 'Amount',
            accessor: 'amount',
            Cell: ({ value }) => (
                <span className="font-medium text-stone-800">NPR {Number(value).toLocaleString()}</span>
            )
        },
        {
            Header: 'Paid',
            accessor: 'paid_amount',
            Cell: ({ value }) => (
                <span className="text-emerald-600">NPR {Number(value).toLocaleString()}</span>
            )
        },
        {
            Header: 'Balance',
            accessor: 'balance',
            Cell: ({ value }) => (
                <span className="text-rose-600">NPR {Number(value).toLocaleString()}</span>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[value] ?? "bg-stone-100 text-stone-600"}`}>
                    {value}
                </span>
            )
        },
        {
            Header: 'Days Overdue',
            accessor: (row) => {
                const balance = Number(row.balance);
                const dueDate = new Date(row.due_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const daysOverdue = balance > 0 && dueDate < today 
                    ? Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
                    : 0;
                return daysOverdue;
            },
            Cell: ({ value }) => {
                if (value > 0) {
                    return (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            value <= 30 ? 'bg-amber-100 text-amber-700' :
                            value <= 60 ? 'bg-orange-100 text-orange-700' :
                            value <= 90 ? 'bg-rose-100 text-rose-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {value} days
                        </span>
                    );
                }
                return <span className="text-stone-400">-</span>;
            }
        },
        {
            Header: 'Actions',
            accessor: 'id',
            Cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(row.original)}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
                    >
                        <Edit2 size={15} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            )
        }
    ], []);

    return (
        <AdminWrapper>
            <div className="container mx-auto py-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                        Finance Tracking
                    </h1>
                    <button
                        onClick={() => {
                            setEditingTracking(null);
                            setShowAddForm(true);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <span>+</span>
                        Create
                    </button>
                </div>

                {/* MyTable Component */}
                <MyTable columns={columns} data={allTracking} />

                {/* Modal */}
                {showAddForm && (
                    <AddFinanceTrackingForm
                        editingTracking={editingTracking}
                        setShowForm={handleCloseForm}
                        setReloadTrigger={setReloadTrigger}
                        handleUpdate={handleUpdate}
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default FinanceTracking;