import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import MyTable from "@/TableComponents/MyTable";




const FINANCE_STATUS_STYLES = {
    paid: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    unpaid: "bg-gray-100 text-gray-600 border border-gray-200",
    partial: "bg-blue-100 text-blue-700 border border-blue-200",
    partially_paid: "bg-blue-100 text-blue-700 border border-blue-200",
    pending: "bg-amber-100 text-amber-700 border border-amber-200",
    overdue: "bg-red-100 text-red-700 border border-red-200",
};

const FINANCE_STATUS_LABELS = {
    paid: "Paid",
    unpaid: "Unpaid",
    partial: "Partial",
    partially_paid: "Partially Paid",
    pending: "Pending",
    overdue: "Overdue",
};

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
    
    const [allTracking, setAllTracking] = useState([]);
    const [allClients, setAllClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [financeLoading, setFinanceLoading] = useState(true);
    const [clientsLoading, setClientsLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourprojects.index"));
                const data = response.data?.data ?? response.data;
                setAllProjects(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Fetching error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();

        const fetchTracking = async () => {
            setFinanceLoading(true);
            try {
                const response = await axios.get(route("ourfinance.index"));
                const trackingData = response.data.data;
                console.log(
                    "Finance statuses:",
                    trackingData.map((f) => f.status),
                );
                setAllTracking(trackingData);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setFinanceLoading(false);
            }
        };
        fetchTracking();

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



   



    

    // Finance Table Columns
    const financeColumns = useMemo(() => [
        {
            Header: "#",
            accessor: (row, idx) => idx + 1,
        },
        {
            Header: "Client",
            accessor: (row) => (
                <div className="font-medium text-gray-900">{row.client}</div>
            ),
        },
        {
            Header: "Project",
            accessor: "project",
        },
        {
            Header: "Invoice Date",
            accessor: "invoice_date",
        },
        {
            Header: "Due Date",
            accessor: "due_date",
        },
        {
            Header: "Amount",
            accessor: (row) => (
                <span className="font-medium text-gray-800">
                    {formatCurrency(row.amount)}
                </span>
            ),
        },
        {
            Header: "Paid",
            accessor: (row) => (
                <span className="text-emerald-600 font-medium">
                    {formatCurrency(row.paid_amount)}
                </span>
            ),
        },
        {
            Header: "Balance",
            accessor: (row) => {
                const balance = Number(row.amount ?? 0) - Number(row.paid_amount ?? 0);
                return (
                    <span className={`font-medium ${balance > 0 ? "text-amber-600" : "text-gray-400"}`}>
                        {formatCurrency(balance)}
                    </span>
                );
            },
        },
        {
            Header: "Status",
            accessor: (row) => {
                const statusKey = row.status?.toLowerCase();
                return (
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                            FINANCE_STATUS_STYLES[statusKey] ?? 
                            "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                    >
                        {FINANCE_STATUS_LABELS[statusKey] ?? row.status ?? "—"}
                    </span>
                );
            },
        },
        {
            Header: "Payment",
            accessor: (row) => {
                const paymentPct = row.amount
                    ? Math.min(
                          100,
                          Math.round(
                              (Number(row.paid_amount ?? 0) / Number(row.amount)) * 100
                          )
                      )
                    : 0;
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{ width: `${paymentPct}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-500 w-8">
                            {paymentPct}%
                        </span>
                    </div>
                );
            },
        },
    ], []);

    // Clients Table Columns
    const clientColumns = useMemo(() => [
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
                    <a href={`mailto:${row.email}`} className="text-blue-600 hover:underline">
                        {row.email}
                    </a>
                ) : "—",
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
                <span className="font-medium">{row.total_projects ?? "—"}</span>
            ),
        },
        {
            Header: "Revenue",
            accessor: (row) => (
                <span className="font-medium text-gray-800">
                    {row.total_revenue != null ? formatCurrency(row.total_revenue) : "—"}
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
                ) : "—";
            },
        },
    ], []);



    return (
        <div className="min-h-screen ">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Client Dashboard
                </h1>
                <p className="text-gray-500 text-sm">
                    View your projects, manage tickets, and track finances.
                </p>
            </div>

           

            {/* Finance Tracking Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">
                        Finance Tracking
                    </h2>
                </div>
                {financeLoading ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        Loading finance records…
                    </div>
                ) : allTracking.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No finance records found.
                    </div>
                ) : (
                    <MyTable 
                        columns={financeColumns} 
                        data={allTracking.filter(f => f.status?.toLowerCase() !== "paid")} 
                    />
                )}
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Clients</h2>
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
                        data={allClients.filter(c => c.payment_status?.toLowerCase() !== "paid")} 
                    />
                )}
            </div>



        
        </div>
    );
};

export default ClientDashboard;