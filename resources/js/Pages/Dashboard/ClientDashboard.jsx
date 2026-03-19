import React, { useState, useEffect } from "react";
import axios from "axios";

const STATUS_STYLES = {
    completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "in-progress": "bg-blue-100 text-blue-700 border border-blue-200",
    pending: "bg-amber-100 text-amber-700 border border-amber-200",
    cancelled: "bg-red-100 text-red-700 border border-red-200",
};

const PRIORITY_STYLES = {
    high: "bg-red-50 text-red-600 border border-red-200",
    medium: "bg-orange-50 text-orange-600 border border-orange-200",
    low: "bg-gray-100 text-gray-500 border border-gray-200",
};

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

const TICKET_STATUS_STYLES = {
    open: "bg-blue-100 text-blue-700 border border-blue-200",
    "in-progress": "bg-amber-100 text-amber-700 border border-amber-200",
    resolved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    closed: "bg-gray-100 text-gray-500 border border-gray-200",
    pending: "bg-orange-100 text-orange-700 border border-orange-200",
};

const TICKET_PRIORITY_STYLES = {
    high: "bg-red-50 text-red-600 border border-red-200",
    medium: "bg-orange-50 text-orange-600 border border-orange-200",
    low: "bg-gray-100 text-gray-500 border border-gray-200",
    urgent: "bg-red-100 text-red-700 border border-red-200",
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(amount ?? 0);

const ClientDashboard = () => {
    const [allProjects, setAllProjects] = useState([]);
    const [allTracking, setAllTracking] = useState([]);
    const [allClients, setAllClients] = useState([]);
    const [allTickets, setAllTickets] = useState([]);
    const [allDomain, setAllDomain] = useState([]);
    const [loading, setLoading] = useState(true);
    const [financeLoading, setFinanceLoading] = useState(true);
    const [clientsLoading, setClientsLoading] = useState(true);
    const [ticketsLoading, setTicketsLoading] = useState(true);
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
        const fetchDomain = async () => {
            try {
                const response = await axios.get(route("ourdomains.index"));
                setAllDomain(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        fetchDomain();

        
    }, [reloadTrigger]);

    const getTaskProgress = (projectDescription) => {
        try {
            const tasks =
                typeof projectDescription === "string"
                    ? JSON.parse(projectDescription)
                    : projectDescription;
            if (!Array.isArray(tasks) || tasks.length === 0) return null;
            const completed = tasks.filter((t) => t.completed).length;
            return { completed, total: tasks.length };
        } catch {
            return null;
        }
    };

    const completedProjects = allProjects.filter(
        (project) =>
            project.status?.toLowerCase().replace(/\s+/g, "-") !== "completed",
    );

    // Finance summary calculations
    const totalInvoiced = allTracking.reduce(
        (sum, f) => sum + Number(f.amount ?? 0),
        0,
    );
    const totalPaid = allTracking.reduce(
        (sum, f) => sum + Number(f.paid_amount ?? 0),
        0,
    );
    const totalOutstanding = totalInvoiced - totalPaid;

    // Clients summary calculations
    const totalRevenue = allClients.reduce(
        (sum, c) => sum + Number(c.total_revenue ?? 0),
        0,
    );
    const totalProjectsCount = allClients.reduce(
        (sum, c) => sum + Number(c.total_projects ?? 0),
        0,
    );

    // Tickets — exclude closed
    const visibleTickets = allTickets.filter(
        (t) => t.status?.toLowerCase() !== "closed",
    );

    // Ticket summary counts
    const openTickets = visibleTickets.filter(
        (t) => t.status?.toLowerCase() === "open",
    ).length;
    const inProgressTickets = visibleTickets.filter(
        (t) => t.status?.toLowerCase() === "in-progress",
    ).length;
    const resolvedTickets = visibleTickets.filter(
        (t) => t.status?.toLowerCase() === "resolved",
    ).length;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Client Dashboard
                </h1>
                <p className="text-gray-500 text-sm">
                    View your projects, manage tickets, and track finances.
                </p>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">
                        Completed Projects
                    </h2>
                    <button
                        onClick={() => setReloadTrigger((v) => v + 1)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ↻ Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        Loading projects…
                    </div>
                ) : completedProjects.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No completed projects found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                    <th className="px-6 py-3 text-left font-medium">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Project
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Service
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Start
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Deadline
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Team
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Progress
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Tasks
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {completedProjects.map((project, idx) => {
                                    const taskProgress = getTaskProgress(
                                        project.project_description,
                                    );
                                    const statusKey = project.status
                                        ?.toLowerCase()
                                        .replace(/\s+/g, "-");
                                    const priorityKey =
                                        project.priority?.toLowerCase();

                                    return (
                                        <tr
                                            key={project.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-gray-400">
                                                {idx + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {project.project_title}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5">
                                                    {project.client_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {project.service_type}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {project.start_date}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {project.deadline}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {project.assigned_team ?? (
                                                    <span className="text-gray-300">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${PRIORITY_STYLES[priorityKey] ?? "bg-gray-100 text-gray-500"}`}
                                                >
                                                    {project.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[statusKey] ?? "bg-gray-100 text-gray-500"}`}
                                                >
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full transition-all"
                                                            style={{
                                                                width: `${project.completion ?? 0}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 w-8">
                                                        {project.completion ??
                                                            0}
                                                        %
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {taskProgress ? (
                                                    <span>
                                                        {taskProgress.completed}
                                                        /{taskProgress.total}{" "}
                                                        done
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Finance Tracking Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">
                        Finance Tracking
                    </h2>
                    <button
                        onClick={() => setReloadTrigger((v) => v + 1)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ↻ Refresh
                    </button>
                </div>

                {!financeLoading && allTracking.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
                            <p className="text-xs text-gray-500 mb-1">
                                Total Invoiced
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                                {formatCurrency(totalInvoiced)}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
                            <p className="text-xs text-gray-500 mb-1">
                                Total Paid
                            </p>
                            <p className="text-lg font-semibold text-emerald-600">
                                {formatCurrency(totalPaid)}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
                            <p className="text-xs text-gray-500 mb-1">
                                Outstanding
                            </p>
                            <p className="text-lg font-semibold text-amber-600">
                                {formatCurrency(totalOutstanding)}
                            </p>
                        </div>
                    </div>
                )}

                {financeLoading ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        Loading finance records…
                    </div>
                ) : allTracking.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No finance records found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                    <th className="px-6 py-3 text-left font-medium">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Project
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Invoice Date
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Paid
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Balance
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Payment
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allTracking
                                    .filter(
                                        (f) =>
                                            f.status?.toLowerCase() !== "paid",
                                    )
                                    .map((finance, idx) => {
                                        const balance =
                                            Number(finance.amount ?? 0) -
                                            Number(finance.paid_amount ?? 0);
                                        const statusKey =
                                            finance.status?.toLowerCase();
                                        const paymentPct = finance.amount
                                            ? Math.min(
                                                  100,
                                                  Math.round(
                                                      (Number(
                                                          finance.paid_amount ??
                                                              0,
                                                      ) /
                                                          Number(
                                                              finance.amount,
                                                          )) *
                                                          100,
                                                  ),
                                              )
                                            : 0;

                                        return (
                                            <tr
                                                key={finance.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-gray-400">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">
                                                        {finance.client}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {finance.project}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {finance.invoice_date}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {finance.due_date}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-800">
                                                    {formatCurrency(
                                                        finance.amount,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-emerald-600 font-medium">
                                                    {formatCurrency(
                                                        finance.paid_amount,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`font-medium ${balance > 0 ? "text-amber-600" : "text-gray-400"}`}
                                                    >
                                                        {formatCurrency(
                                                            balance,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${FINANCE_STATUS_STYLES[statusKey] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}
                                                    >
                                                        {FINANCE_STATUS_LABELS[
                                                            statusKey
                                                        ] ??
                                                            finance.status ??
                                                            "—"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-emerald-500 rounded-full transition-all"
                                                                style={{
                                                                    width: `${paymentPct}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-500 w-8">
                                                            {paymentPct}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Clients</h2>
                    <button
                        onClick={() => setReloadTrigger((v) => v + 1)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ↻ Refresh
                    </button>
                </div>

                {!clientsLoading && allClients.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
                            <p className="text-xs text-gray-500 mb-1">
                                Total Clients
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                                {allClients.length}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
                            <p className="text-xs text-gray-500 mb-1">
                                Total Projects
                            </p>
                            <p className="text-lg font-semibold text-blue-600">
                                {totalProjectsCount}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
                            <p className="text-xs text-gray-500 mb-1">
                                Total Revenue
                            </p>
                            <p className="text-lg font-semibold text-emerald-600">
                                {formatCurrency(totalRevenue)}
                            </p>
                        </div>
                    </div>
                )}

                {clientsLoading ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        Loading clients…
                    </div>
                ) : allClients.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No clients found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                    <th className="px-6 py-3 text-left font-medium">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Company
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Contact Person
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Service Type
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Account Manager
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Projects
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Revenue
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Payment Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allClients
                                    .filter(
                                        (c) =>
                                            c.payment_status?.toLowerCase() !==
                                            "paid",
                                    )
                                    .map((client, idx) => {
                                        const paymentStatusKey =
                                            client.payment_status?.toLowerCase();

                                        return (
                                            <tr
                                                key={client.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-gray-400">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">
                                                        {client.company_name}
                                                    </div>
                                                    {client.address && (
                                                        <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">
                                                            {client.address}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">
                                                    {client.contact_person ?? (
                                                        <span className="text-gray-300">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {client.email ? (
                                                        <a
                                                            href={`mailto:${client.email}`}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {client.email}
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-300">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {client.phone ?? (
                                                        <span className="text-gray-300">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {client.service_type ?? (
                                                        <span className="text-gray-300">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {client.account_manager ?? (
                                                        <span className="text-gray-300">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-700 font-medium">
                                                    {client.total_projects ?? (
                                                        <span className="text-gray-300">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-800">
                                                    {client.total_revenue !=
                                                    null ? (
                                                        formatCurrency(
                                                            client.total_revenue,
                                                        )
                                                    ) : (
                                                        <span className="text-gray-300">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {client.payment_status ? (
                                                        <span
                                                            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap ${PAYMENT_STATUS_STYLES[paymentStatusKey] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}
                                                        >
                                                            {
                                                                client.payment_status
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">
                        Support Tickets
                    </h2>
                    <button
                        onClick={() => setReloadTrigger((v) => v + 1)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ↻ Refresh
                    </button>
                </div>

                {/* Tickets Summary Cards */}
                {!ticketsLoading && visibleTickets.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
                            <p className="text-xs text-gray-500 mb-1">Open</p>
                            <p className="text-lg font-semibold text-blue-600">
                                {openTickets}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
                            <p className="text-xs text-gray-500 mb-1">
                                In Progress
                            </p>
                            <p className="text-lg font-semibold text-amber-600">
                                {inProgressTickets}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
                            <p className="text-xs text-gray-500 mb-1">
                                Resolved
                            </p>
                            <p className="text-lg font-semibold text-emerald-600">
                                {resolvedTickets}
                            </p>
                        </div>
                    </div>
                )}

                {ticketsLoading ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        Loading tickets…
                    </div>
                ) : visibleTickets.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No active tickets found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                    <th className="px-6 py-3 text-left font-medium">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Ticket ID
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Issue Type
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Device
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Technician
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Created
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {visibleTickets.map((ticket, idx) => {
                                    const statusKey = ticket.status
                                        ?.toLowerCase()
                                        .replace(/\s+/g, "-");
                                    const priorityKey =
                                        ticket.priority?.toLowerCase();

                                    return (
                                        <tr
                                            key={ticket.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-gray-400">
                                                {idx + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                                    {ticket.ticket_id ??
                                                        `#${ticket.id}`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {ticket.client_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {ticket.issue_type ?? (
                                                    <span className="text-gray-300">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {ticket.device_type ?? (
                                                    <span className="text-gray-300">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 max-w-[200px]">
                                                <span
                                                    className="line-clamp-2 block truncate"
                                                    title={
                                                        ticket.problem_description
                                                    }
                                                >
                                                    {ticket.problem_description ?? (
                                                        <span className="text-gray-300">
                                                            —
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${TICKET_PRIORITY_STYLES[priorityKey] ?? "bg-gray-100 text-gray-500 border border-gray-200"}`}
                                                >
                                                    {ticket.priority ?? "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {ticket.technician_name ?? (
                                                    <span className="text-gray-300">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap ${TICKET_STATUS_STYLES[statusKey] ?? "bg-gray-100 text-gray-500 border border-gray-200"}`}
                                                >
                                                    {ticket.status ?? "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                {ticket.created_at ? (
                                                    new Date(
                                                        ticket.created_at,
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        },
                                                    )
                                                ) : (
                                                    <span className="text-gray-300">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Domain Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">
                        Domains Expiring Soon
                    </h2>
                    <button
                        onClick={() => setReloadTrigger((v) => v + 1)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ↻ Refresh
                    </button>
                </div>

                {allDomain.filter((d) => {
                    if (!d.expiry_date) return false;
                    const diff =
                        (new Date(d.expiry_date) - new Date()) /
                        (1000 * 60 * 60 * 24);
                    return diff <= 30;
                }).length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No domains expiring within 30 days.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                    <th className="px-6 py-3 text-left font-medium">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Domain
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Registrar
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Purchase Date
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Expiry Date
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Days Left
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Auto Renewal
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        DNS Provider
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allDomain
                                    .filter((d) => {
                                        if (!d.expiry_date) return false;
                                        const diff =
                                            (new Date(d.expiry_date) -
                                                new Date()) /
                                            (1000 * 60 * 60 * 24);
                                        return diff <= 30;
                                    })
                                    .sort(
                                        (a, b) =>
                                            new Date(a.expiry_date) -
                                            new Date(b.expiry_date),
                                    )
                                    .map((domain, idx) => {
                                        const daysLeft = Math.ceil(
                                            (new Date(domain.expiry_date) -
                                                new Date()) /
                                                (1000 * 60 * 60 * 24),
                                        );
                                        const isExpired = daysLeft < 0;
                                        const isCritical =
                                            daysLeft <= 7 && daysLeft >= 0;

                                        return (
                                            <tr
                                                key={domain.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-gray-400">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">
                                                        {domain.domain_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {domain.client
                                                        ?.company_name ??
                                                        domain.client_id ?? (
                                                            <span className="text-gray-300">
                                                                —
                                                            </span>
                                                        )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {domain.register}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {domain.purchase_date}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {domain.expiry_date}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                            isExpired
                                                                ? "bg-red-100 text-red-700 border-red-200"
                                                                : isCritical
                                                                  ? "bg-orange-100 text-orange-700 border-orange-200"
                                                                  : "bg-amber-100 text-amber-700 border-amber-200"
                                                        }`}
                                                    >
                                                        {isExpired
                                                            ? `Expired ${Math.abs(daysLeft)}d ago`
                                                            : `${daysLeft}d left`}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${
                                                            domain.auto_renewal_status?.toLowerCase() ===
                                                            "active"
                                                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                                : "bg-gray-100 text-gray-500 border-gray-200"
                                                        }`}
                                                    >
                                                        {domain.auto_renewal_status ??
                                                            "—"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {domain.dns_provider ?? (
                                                        <span className="text-gray-300">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
