// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Head, Link, usePage } from "@inertiajs/react";
// import React, { useEffect, useState, useMemo } from "react";
// import {
//     Building2,
//     User,
//     Users,
//     ClipboardCheck,
//     Calendar,
//     AlertTriangle,
// } from "lucide-react";
// import MyTable from "@/TableComponents/MyTable";
// import ClientDashboard from "../Dashboard/ClientDashboard";
// import BackToTop from "@/AdminWrapper/BackToTop";
// import TicketDashboard from "../Dashboard/TicketDashboard";
// import DomainDashboard from "../Dashboard/DomainDashboard";
// import ProjectDashboard from "../Dashboard/ProjectDashboard";
// import ExpiryDashboard from "../Dashboard/ExpiryDashboard";
// import FinanceDashboard from "../Dashboard/FinanceDashboard";
// import HostingDashboard from "../Dashboard/HostingDashboard";

// const Dashboard = () => {
//     const [loading, setLoading] = useState(false);
//     const cards = [
//         {
//             title: "",
//             breadcrumb: "Tasks",
//             icon: Users,
//             link: "/tasks",
//         },
//         {
//             title: "To Do List",
//             breadcrumb: "To Do",
//             icon: ClipboardCheck,
//             link: "/todo",
//         },
//     ];

//     const developerCards = [
//         {
//             title: "Projects",
//             breadcrumb: "Projects",
//             icon: Users,
//             link: "/project-management",
//         },
//         {
//             title: "To Do List",
//             breadcrumb: "To Do",
//             icon: ClipboardCheck,
//             link: "/todo",
//         },
//     ];

//     const technicianCards = [
//         {
//             title: "Tickets",
//             breadcrumb: "Tickets",
//             icon: Users,
//             link: "/ticket",
//         },
//         {
//             title: "To Do List",
//             breadcrumb: "To Do",
//             icon: ClipboardCheck,
//             link: "/todo",
//         },
//     ];

//     const accountantCards = [
//         {
//             title: "Leads",
//             breadcrumb: "Leads",
//             icon: Users,
//             link: "/leads",
//         },
//         {
//             title: "Clients",
//             breadcrumb: "Clients",
//             icon: Users,
//             link: "/client-management",
//         },
//         {
//             title: "Finance Tracking",
//             breadcrumb: "Finance Tracking",
//             icon: Users,
//             link: "/payment-finance-tracking",
//         },
//         {
//             title: "To Do List",
//             breadcrumb: "To Do",
//             icon: ClipboardCheck,
//             link: "/todo",
//         },
//     ];

//     const user = usePage().props.auth.user;
//     const isAdmin = user?.role === "admin";
//     const isManager = user?.role === "manager";
//     const isDeveloper = user?.role === "developer";
//     const isTechnician = user?.role === "technician";
//     const isAccountant = user?.role === "accountant";
//     const isUser = user?.role === "user";

//     // Admin and the Manager can see all the dashboard
//     // saleteam can see
//     // projectmanager can see
//     // developer can see task created and assigned to them, and project progress
//     // technician can see
//     // accountant can see  finance dashboard, and invoice management
//     // support can see
//     // user can see

//     // Role options for React Select
//     // const roleOptions = [
//     //     { value: "admin", label: "Admin" },
//     //     { value: "salesteam", label: "Sales Team" },
//     //     { value: "projectmanager", label: "Project Manager" },
//     //     { value: "developer", label: "Developer" },
//     //     { value: "technician", label: "Technician" },
//     //     { value: "accountant", label: "Accountant" },
//     //     { value: "support", label: "Support" },
//     //     { value: "user", label: "User" },
//     // ];

//     // Loading spinner component
//     const LoadingSpinner = () => (
//         <div className="flex items-center justify-center min-h-[400px]">
//             <div className="text-center">
//                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//                 <p className="mt-4 text-gray-600">Loading dashboard...</p>
//             </div>
//         </div>
//     );

//     return (
//         <>
//             <Head title="Dashboard" />

//             <AdminWrapper>
//                 {loading ? (
//                     <LoadingSpinner />
//                 ) : (
//                     <>
//                         {isAdmin && (
//                             <>
//                                 <h2 className="text-2xl mb-6 lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                                     Admin Dashboard
//                                 </h2>
//                                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//                                     <ClientDashboard />
//                                     <DomainDashboard />
//                                     <ProjectDashboard />
//                                     <ExpiryDashboard />
//                                     <FinanceDashboard />
//                                     <HostingDashboard />
//                                     <TicketDashboard />
//                                 </div>
//                             </>
//                         )}

//                         {isManager && (
//                             <>
//                                 <h2 className="text-2xl mb-6 lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                                     Manager Dashboard
//                                 </h2>
//                                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//                                     {/* <ProjectDashboard /> */}
//                                     <ExpiryDashboard />
//                                     <DomainDashboard />
//                                     <HostingDashboard />
//                                 </div>
//                             </>
//                         )}

//                         {isUser && (
//                             <>
//                                 <div className="max-w-7xl mx-auto py-4">
//                                     <h2 className="text-2xl mb-6 lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                                         Dashboard
//                                     </h2>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                                         {cards.map((card, index) => {
//                                             const Icon = card.icon;

//                                             return (
//                                                 <Link
//                                                     key={index}
//                                                     href={card.link}
//                                                     className="block"
//                                                 >
//                                                     <div className="bg-white rounded-2xl p-6 min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
//                                                         {/* Card Top Breadcrumb */}
//                                                         <div className="flex items-center gap-2 mb-6">
//                                                             <span className="text-xl font-semibold text-gray-800">
//                                                                 Home
//                                                             </span>
//                                                             <span className="text-sm text-gray-500">
//                                                                 |{" "}
//                                                                 {
//                                                                     card.breadcrumb
//                                                                 }
//                                                             </span>
//                                                         </div>

//                                                         {/* Card Content */}
//                                                         <div className="flex items-center gap-6">
//                                                             <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
//                                                                 <Icon className="w-7 h-7 text-gray-700" />
//                                                             </div>

//                                                             <h3 className="text-lg font-medium text-gray-800">
//                                                                 {card.title}
//                                                             </h3>
//                                                         </div>
//                                                     </div>
//                                                 </Link>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             </>
//                         )}

//                         {isDeveloper && (
//                             <>
//                                 <div className="max-w-7xl mx-auto py-4">
//                                     <h2 className="text-2xl mb-6 lg:text-3xl font-bold tracking-tight text-gray-900 uppercase ">
//                                         Dashboard
//                                     </h2>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                                         {developerCards.map((card, index) => {
//                                             const Icon = card.icon;

//                                             return (
//                                                 <Link
//                                                     key={index}
//                                                     href={card.link}
//                                                     className="block"
//                                                 >
//                                                     <div className="bg-white rounded-2xl p-6 min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
//                                                         {/* Card Top Breadcrumb */}
//                                                         <div className="flex items-center gap-2 mb-6">
//                                                             <span className="text-xl font-semibold text-gray-800">
//                                                                 Home
//                                                             </span>
//                                                             <span className="text-sm text-gray-500">
//                                                                 |{" "}
//                                                                 {
//                                                                     card.breadcrumb
//                                                                 }
//                                                             </span>
//                                                         </div>

//                                                         {/* Card Content */}
//                                                         <div className="flex items-center gap-6">
//                                                             <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
//                                                                 <Icon className="w-7 h-7 text-gray-700" />
//                                                             </div>

//                                                             <h3 className="text-lg font-medium text-gray-800">
//                                                                 {card.title}
//                                                             </h3>
//                                                         </div>
//                                                     </div>
//                                                 </Link>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             </>
//                         )}

//                         {isAccountant && (
//                             <>
//                                 <div className="max-w-7xl mx-auto py-4">
//                                     <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-6">
//                                         Dashboard
//                                     </h2>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                                         {accountantCards.map((card, index) => {
//                                             const Icon = card.icon;

//                                             return (
//                                                 <Link
//                                                     key={index}
//                                                     href={card.link}
//                                                     className="block"
//                                                 >
//                                                     <div className="bg-white rounded-2xl p-6 min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
//                                                         {/* Card Top Breadcrumb */}
//                                                         <div className="flex items-center gap-2 mb-6">
//                                                             <span className="text-xl font-semibold text-gray-800">
//                                                                 Home
//                                                             </span>
//                                                             <span className="text-sm text-gray-500">
//                                                                 |{" "}
//                                                                 {
//                                                                     card.breadcrumb
//                                                                 }
//                                                             </span>
//                                                         </div>

//                                                         {/* Card Content */}
//                                                         <div className="flex items-center gap-6">
//                                                             <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
//                                                                 <Icon className="w-7 h-7 text-gray-700" />
//                                                             </div>

//                                                             <h3 className="text-lg font-medium text-gray-800">
//                                                                 {card.title}
//                                                             </h3>
//                                                         </div>
//                                                     </div>
//                                                 </Link>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             </>
//                         )}

//                         {isTechnician && (
//                             <>
//                                 <div className="max-w-7xl mx-auto py-4">
//                                     <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-6">
//                                         Dashboard
//                                     </h2>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                                         {technicianCards.map((card, index) => {
//                                             const Icon = card.icon;

//                                             return (
//                                                 <Link
//                                                     key={index}
//                                                     href={card.link}
//                                                     className="block"
//                                                 >
//                                                     <div className="bg-white rounded-2xl p-6 min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
//                                                         {/* Card Top Breadcrumb */}
//                                                         <div className="flex items-center gap-2 mb-6">
//                                                             <span className="text-xl font-semibold text-gray-800">
//                                                                 Home
//                                                             </span>
//                                                             <span className="text-sm text-gray-500">
//                                                                 |{" "}
//                                                                 {
//                                                                     card.breadcrumb
//                                                                 }
//                                                             </span>
//                                                         </div>

//                                                         {/* Card Content */}
//                                                         <div className="flex items-center gap-6">
//                                                             <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
//                                                                 <Icon className="w-7 h-7 text-gray-700" />
//                                                             </div>

//                                                             <h3 className="text-lg font-medium text-gray-800">
//                                                                 {card.title}
//                                                             </h3>
//                                                         </div>
//                                                     </div>
//                                                 </Link>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             </>
//                         )}

//                         <BackToTop />
//                     </>
//                 )}
//             </AdminWrapper>
//         </>
//     );
// };

// export default Dashboard;


import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Head, Link, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { ClipboardCheck, Users } from "lucide-react";
import ClientDashboard from "../Dashboard/ClientDashboard";
import BackToTop from "@/AdminWrapper/BackToTop";
import TicketDashboard from "../Dashboard/TicketDashboard";
import DomainDashboard from "../Dashboard/DomainDashboard";
import ProjectDashboard from "../Dashboard/ProjectDashboard";
import ExpiryDashboard from "../Dashboard/ExpiryDashboard";
import FinanceDashboard from "../Dashboard/FinanceDashboard";
import HostingDashboard from "../Dashboard/HostingDashboard";
import PageLoader from "@/Loader/PageLoader";

// ─── Reusable card ────────────────────────────────────────────────────────────
const DashboardCard = ({ title, breadcrumb, icon: Icon, link }) => (
    <Link href={link} className="block">
        <div className="bg-white rounded-2xl p-5 sm:p-6 min-h-[160px] sm:min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <span className="text-base sm:text-xl font-semibold text-gray-800">
                    Home
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                    | {breadcrumb}
                </span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-100 shrink-0">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-800 leading-snug">
                    {title}
                </h3>
            </div>
        </div>
    </Link>
);

// ─── Card grids per role ──────────────────────────────────────────────────────
const userCards = [
    { title: "Tasks", breadcrumb: "Tasks", icon: Users, link: "/tasks" },
    { title: "To Do List", breadcrumb: "To Do", icon: ClipboardCheck, link: "/todo" },
];

const developerCards = [
    { title: "Projects", breadcrumb: "Projects", icon: Users, link: "/project-management" },
    { title: "To Do List", breadcrumb: "To Do", icon: ClipboardCheck, link: "/todo" },
];

const technicianCards = [
    { title: "Tickets", breadcrumb: "Tickets", icon: Users, link: "/ticket" },
    { title: "To Do List", breadcrumb: "To Do", icon: ClipboardCheck, link: "/todo" },
];

const accountantCards = [
    { title: "Leads", breadcrumb: "Leads", icon: Users, link: "/leads" },
    { title: "Clients", breadcrumb: "Clients", icon: Users, link: "/client-management" },
    { title: "Finance Tracking", breadcrumb: "Finance Tracking", icon: Users, link: "/payment-finance-tracking" },
    { title: "To Do List", breadcrumb: "To Do", icon: ClipboardCheck, link: "/todo" },
];

// ─── Card grid wrapper ────────────────────────────────────────────────────────
const CardGrid = ({ label, cards }) => (
    <div className="w-full py-4 px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-5 sm:mb-6">
            {label}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cards.map((card, i) => (
                <DashboardCard key={i} {...card} />
            ))}
        </div>
    </div>
);

// ─── Loading spinner ──────────────────────────────────────────────────────────


// ─── Main component ───────────────────────────────────────────────────────────
const Dashboard = () => {
    const [loading] = useState(false);

    const user = usePage().props.auth.user;
    const isAdmin     = user?.role === "admin";
    const isManager   = user?.role === "manager";
    const isDeveloper = user?.role === "developer";
    const isTechnician= user?.role === "technician";
    const isAccountant= user?.role === "accountant";
    const isUser      = user?.role === "user";

    return (
        <>
            <Head title="Dashboard" />

            <AdminWrapper>
                {loading ? (
                    <PageLoader />
                ) : (
                    <>
                        {/* ── Admin ─────────────────────────────────────── */}
                        {isAdmin && (
                            <div className="px-4 sm:px-0">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-5 sm:mb-6">
                                    Admin Dashboard
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                                    <ClientDashboard />
                                    <DomainDashboard />
                                    <ProjectDashboard />
                                    <ExpiryDashboard />
                                    <FinanceDashboard />
                                    <HostingDashboard />
                                    <TicketDashboard />
                                </div>
                            </div>
                        )}

                        {/* ── Manager ───────────────────────────────────── */}
                        {isManager && (
                            <div className="px-4 sm:px-0">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-5 sm:mb-6">
                                    Manager Dashboard
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                                    <ExpiryDashboard />
                                    <DomainDashboard />
                                    <HostingDashboard />
                                </div>
                            </div>
                        )}

                        {/* ── Role-based card grids ─────────────────────── */}
                        {isUser       && <CardGrid label="Dashboard" cards={userCards} />}
                        {isDeveloper  && <CardGrid label="Dashboard" cards={developerCards} />}
                        {isAccountant && <CardGrid label="Dashboard" cards={accountantCards} />}
                        {isTechnician && <CardGrid label="Dashboard" cards={technicianCards} />}

                        <BackToTop />
                    </>
                )}
            </AdminWrapper>
        </>
    );
};

export default Dashboard;
