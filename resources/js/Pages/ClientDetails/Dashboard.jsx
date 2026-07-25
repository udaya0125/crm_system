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

// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Head, Link, usePage } from "@inertiajs/react";
// import React, { useState, useEffect } from "react";
// import { ClipboardCheck, Users, ArrowUpRight, Sunrise, Sun, Sunset, Moon } from "lucide-react";
// import ClientDashboard from "../Dashboard/ClientDashboard";
// import BackToTop from "@/AdminWrapper/BackToTop";
// import TicketDashboard from "../Dashboard/TicketDashboard";
// import DomainDashboard from "../Dashboard/DomainDashboard";
// import ProjectDashboard from "../Dashboard/ProjectDashboard";
// import ExpiryDashboard from "../Dashboard/ExpiryDashboard";
// import FinanceDashboard from "../Dashboard/FinanceDashboard";
// import HostingDashboard from "../Dashboard/HostingDashboard";
// import PageLoader from "@/Loader/PageLoader";

// // ─── Accent tokens ─────────────────────────────────────────────────────────────
// const ACCENTS = {
//     indigo: {
//         gradient: "from-indigo-500 to-violet-600",
//         blob: "bg-indigo-400/20",
//         ring: "group-hover:ring-indigo-200/70",
//         border: "group-hover:border-indigo-200",
//         underline: "bg-indigo-500",
//         arrowHover: "group-hover:bg-indigo-600 group-hover:border-indigo-600",
//     },
//     emerald: {
//         gradient: "from-emerald-500 to-teal-600",
//         blob: "bg-emerald-400/20",
//         ring: "group-hover:ring-emerald-200/70",
//         border: "group-hover:border-emerald-200",
//         underline: "bg-emerald-500",
//         arrowHover: "group-hover:bg-emerald-600 group-hover:border-emerald-600",
//     },
//     amber: {
//         gradient: "from-amber-500 to-orange-600",
//         blob: "bg-amber-400/20",
//         ring: "group-hover:ring-amber-200/70",
//         border: "group-hover:border-amber-200",
//         underline: "bg-amber-500",
//         arrowHover: "group-hover:bg-amber-600 group-hover:border-amber-600",
//     },
//     rose: {
//         gradient: "from-rose-500 to-pink-600",
//         blob: "bg-rose-400/20",
//         ring: "group-hover:ring-rose-200/70",
//         border: "group-hover:border-rose-200",
//         underline: "bg-rose-500",
//         arrowHover: "group-hover:bg-rose-600 group-hover:border-rose-600",
//     },
// };

// // ─── Greeting header ───────────────────────────────────────────────────────────
// const getGreetingMeta = (hour) => {
//     if (hour < 5)  return { text: "Good night", Icon: Moon };
//     if (hour < 12) return { text: "Good morning", Icon: Sunrise };
//     if (hour < 17) return { text: "Good afternoon", Icon: Sun };
//     if (hour < 21) return { text: "Good evening", Icon: Sunset };
//     return { text: "Good night", Icon: Moon };
// };

// const GreetingHeader = ({ name, role }) => {
//     const [now, setNow] = useState(new Date());

//     useEffect(() => {
//         const timer = setInterval(() => setNow(new Date()), 1000);
//         return () => clearInterval(timer);
//     }, []);

//     const { text: greeting, Icon: GreetingIcon } = getGreetingMeta(now.getHours());

//     const time = now.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: true,
//     });

//     const date = now.toLocaleDateString("en-US", {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//     });

//     const firstName = name?.split(" ")[0] || "there";

//     return (
//         <div className="relative overflow-hidden rounded-3xl mb-6 sm:mb-8 mx-4 sm:mx-0
//             bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
//             {/* ambient glow accents */}
//             <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />
//             <div className="pointer-events-none absolute -bottom-24 -left-10 w-64 h-64 rounded-full bg-fuchsia-500/10 blur-3xl" />

//             <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 sm:p-8">
//                 {/* left: greeting + role */}
//                 <div>
//                     <div className="flex items-center gap-2 mb-2">
//                         <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm">
//                             <GreetingIcon className="w-5 h-5 text-amber-300" />
//                         </span>
//                         <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-indigo-200/80">
//                             {role ? `${role} workspace` : "Workspace"}
//                         </span>
//                     </div>
//                     <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
//                         {greeting}, <span className="text-indigo-300">{firstName}</span>
//                     </h1>
//                     <p className="mt-2 text-sm sm:text-base text-slate-300/90">
//                         Here's what's happening across your workspace today.
//                     </p>
//                 </div>

//                 {/* right: live clock */}
//                 <div className="flex items-center gap-4 lg:gap-5">
//                     <div className="text-right">
//                         <div className="flex items-center justify-end gap-2">
//                             <span className="relative flex h-2 w-2">
//                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
//                                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
//                             </span>
//                             <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400">
//                                 Live
//                             </span>
//                         </div>
//                         <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tabular-nums tracking-tight mt-1">
//                             {time}
//                         </div>
//                         <div className="text-xs sm:text-sm text-slate-400 mt-1">
//                             {date}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ─── Reusable card ────────────────────────────────────────────────────────────
// const DashboardCard = ({ title, breadcrumb, icon: Icon, link, accent = "indigo" }) => {
//     const a = ACCENTS[accent] ?? ACCENTS.indigo;

//     return (
//         <Link href={link} className="group block">
//             <div
//                 className={`relative overflow-hidden bg-white rounded-2xl p-5 sm:p-6 min-h-[160px] sm:min-h-[180px]
//                 border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]
//                 ring-1 ring-transparent transition-all duration-300 cursor-pointer
//                 hover:-translate-y-1.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.08)]
//                 ${a.ring} ${a.border}`}
//             >
//                 {/* ambient glow blob */}
//                 <div
//                     className={`pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl
//                     opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${a.blob}`}
//                 />

//                 {/* header row */}
//                 <div className="relative flex items-center justify-between mb-6 sm:mb-8">
//                     <div className="flex items-center gap-2">
//                         <span className="text-sm sm:text-base font-medium text-gray-400">
//                             Home
//                         </span>
//                         <span className="text-gray-300">/</span>
//                         <span className="text-sm sm:text-base font-semibold text-gray-700">
//                             {breadcrumb}
//                         </span>
//                     </div>
//                     <span
//                         className={`flex items-center justify-center w-8 h-8 rounded-full border border-gray-200
//                         text-gray-400 transition-all duration-300
//                         group-hover:text-white ${a.arrowHover}`}
//                     >
//                         <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
//                     </span>
//                 </div>

//                 {/* body */}
//                 <div className="relative flex items-center gap-4 sm:gap-5">
//                     <div
//                         className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl shrink-0
//                         bg-gradient-to-br ${a.gradient} shadow-lg shadow-black/10
//                         transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3`}
//                     >
//                         <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
//                     </div>
//                     <div>
//                         <h3 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight leading-snug">
//                             {title}
//                         </h3>
//                         <span
//                             className={`block h-0.5 w-0 rounded-full mt-1.5 transition-all duration-500
//                             group-hover:w-10 ${a.underline}`}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </Link>
//     );
// };

// // ─── Card grids per role ──────────────────────────────────────────────────────
// const userCards = [
//     { title: "Tasks", breadcrumb: "Tasks", icon: Users, link: "/tasks", accent: "indigo" },
//     { title: "To Do List", breadcrumb: "To Do", icon: ClipboardCheck, link: "/todo", accent: "emerald" },
// ];

// const developerCards = [
//     { title: "Projects", breadcrumb: "Projects", icon: Users, link: "/project-management", accent: "indigo" },
//     { title: "To Do List", breadcrumb: "To Do", icon: ClipboardCheck, link: "/todo", accent: "emerald" },
// ];

// const technicianCards = [
//     { title: "Tickets", breadcrumb: "Tickets", icon: Users, link: "/ticket", accent: "amber" },
//     { title: "To Do List", breadcrumb: "To Do", icon: ClipboardCheck, link: "/todo", accent: "emerald" },
// ];

// const accountantCards = [
//     { title: "Leads", breadcrumb: "Leads", icon: Users, link: "/leads", accent: "rose" },
//     { title: "Clients", breadcrumb: "Clients", icon: Users, link: "/client-management", accent: "indigo" },
//     { title: "Finance Tracking", breadcrumb: "Finance Tracking", icon: Users, link: "/payment-finance-tracking", accent: "amber" },
//     { title: "To Do List", breadcrumb: "To Do", icon: ClipboardCheck, link: "/todo", accent: "emerald" },
// ];

// // ─── Card grid wrapper ────────────────────────────────────────────────────────
// const CardGrid = ({ label, cards }) => (
//     <div className="w-full py-4 px-4 sm:px-0">
//         <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-5 sm:mb-6">
//             {label}
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//             {cards.map((card, i) => (
//                 <DashboardCard key={i} {...card} />
//             ))}
//         </div>
//     </div>
// );

// // ─── Main component ───────────────────────────────────────────────────────────
// const Dashboard = () => {
//     const [loading] = useState(false);

//     const user = usePage().props.auth.user;
//     const isAdmin      = user?.role === "admin";
//     const isManager    = user?.role === "manager";
//     const isDeveloper  = user?.role === "developer";
//     const isTechnician = user?.role === "technician";
//     const isAccountant = user?.role === "accountant";
//     const isUser       = user?.role === "user";

//     return (
//         <>
//             <Head title="Dashboard" />

//             <AdminWrapper>
//                 {loading ? (
//                     <PageLoader />
//                 ) : (
//                     <>
//                         {/* ── Greeting (shown for every role) ───────────── */}
//                         <GreetingHeader name={user?.name} role={user?.role} />

//                         {/* ── Admin ─────────────────────────────────────── */}
//                         {isAdmin && (
//                             <div className="px-4 sm:px-0">
//                                 <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-5 sm:mb-6">
//                                     Admin Dashboard
//                                 </h2>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
//                                     <ClientDashboard />
//                                     <DomainDashboard />
//                                     <ProjectDashboard />
//                                     <ExpiryDashboard />
//                                     <FinanceDashboard />
//                                     <HostingDashboard />
//                                     <TicketDashboard />
//                                 </div>
//                             </div>
//                         )}

//                         {/* ── Manager ───────────────────────────────────── */}
//                         {isManager && (
//                             <div className="px-4 sm:px-0">
//                                 <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-5 sm:mb-6">
//                                     Manager Dashboard
//                                 </h2>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
//                                     <ExpiryDashboard />
//                                     <DomainDashboard />
//                                     <HostingDashboard />
//                                 </div>
//                             </div>
//                         )}

//                         {/* ── Role-based card grids ─────────────────────── */}
//                         {isUser       && <CardGrid label="Dashboard" cards={userCards} />}
//                         {isDeveloper  && <CardGrid label="Dashboard" cards={developerCards} />}
//                         {isAccountant && <CardGrid label="Dashboard" cards={accountantCards} />}
//                         {isTechnician && <CardGrid label="Dashboard" cards={technicianCards} />}

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
import React, { useState, useEffect } from "react";
import {
    ClipboardCheck,
    Users,
    ArrowUpRight,
    Sunrise,
    Sun,
    Sunset,
    Moon,
} from "lucide-react";
import ClientDashboard from "../Dashboard/ClientDashboard";
import BackToTop from "@/AdminWrapper/BackToTop";
import TicketDashboard from "../Dashboard/TicketDashboard";
import DomainDashboard from "../Dashboard/DomainDashboard";
import ProjectDashboard from "../Dashboard/ProjectDashboard";
import ExpiryDashboard from "../Dashboard/ExpiryDashboard";
import FinanceDashboard from "../Dashboard/FinanceDashboard";
import HostingDashboard from "../Dashboard/HostingDashboard";
import PageLoader from "@/Loader/PageLoader";
import MonthlyReports from "../Dashboard/MonthlyReports";
import TaskReports from "../Dashboard/TaskReports";
import DepartmentReports from "../Dashboard/DepartmentReports";
import TaskDashboard from "../Dashboard/TaskDashboard";

// ─── Accent tokens ─────────────────────────────────────────────────────────────
const ACCENTS = {
    indigo: {
        gradient: "from-indigo-500 to-violet-600",
        blob: "bg-indigo-400/20",
        ring: "group-hover:ring-indigo-200/70",
        border: "group-hover:border-indigo-200",
        underline: "bg-indigo-500",
        arrowHover: "group-hover:bg-indigo-600 group-hover:border-indigo-600",
    },
    emerald: {
        gradient: "from-emerald-500 to-teal-600",
        blob: "bg-emerald-400/20",
        ring: "group-hover:ring-emerald-200/70",
        border: "group-hover:border-emerald-200",
        underline: "bg-emerald-500",
        arrowHover: "group-hover:bg-emerald-600 group-hover:border-emerald-600",
    },
    amber: {
        gradient: "from-amber-500 to-orange-600",
        blob: "bg-amber-400/20",
        ring: "group-hover:ring-amber-200/70",
        border: "group-hover:border-amber-200",
        underline: "bg-amber-500",
        arrowHover: "group-hover:bg-amber-600 group-hover:border-amber-600",
    },
    rose: {
        gradient: "from-rose-500 to-pink-600",
        blob: "bg-rose-400/20",
        ring: "group-hover:ring-rose-200/70",
        border: "group-hover:border-rose-200",
        underline: "bg-rose-500",
        arrowHover: "group-hover:bg-rose-600 group-hover:border-rose-600",
    },
};

// ─── Greeting header ───────────────────────────────────────────────────────────
const getGreetingMeta = (hour) => {
    if (hour < 5) return { text: "Good night", Icon: Moon };
    if (hour < 12) return { text: "Good morning", Icon: Sunrise };
    if (hour < 17) return { text: "Good afternoon", Icon: Sun };
    if (hour < 21) return { text: "Good evening", Icon: Sunset };
    return { text: "Good night", Icon: Moon };
};

const GreetingHeader = ({ name, role }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { text: greeting, Icon: GreetingIcon } = getGreetingMeta(
        now.getHours(),
    );

    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const firstName = name?.split(" ")[0] || "there";

    return (
        <div
            className="relative overflow-hidden rounded-2xl border  sm:rounded-3xl mb-6 sm:mb-8 mx-3 sm:mx-4 md:mx-0
            bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl"
        >
            {/* ambient glow accents */}
            <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 w-64 h-64 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div
                className="relative flex flex-col items-center text-center
                sm:items-start sm:text-left
                md:flex-row md:items-center md:justify-between md:text-left
                gap-5 sm:gap-6 p-5 sm:p-7 md:p-8"
            >
                {/* left: greeting + role */}
                <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 backdrop-blur-sm">
                            <GreetingIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                        </span>
                        <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-indigo-200/80">
                            {role ? `${role} workspace` : "Workspace"}
                        </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                        {greeting},{" "}
                        <span className="text-indigo-300">{firstName}</span>
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-300/90">
                        Here's what's happening across your workspace today.
                    </p>
                </div>

                {/* right: live clock */}
                <div className="flex items-center gap-4 lg:gap-5">
                    <div className="text-center sm:text-right">
                        <div className="flex items-center justify-center sm:justify-end gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                            </span>
                            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400">
                                Live
                            </span>
                        </div>
                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tabular-nums tracking-tight mt-1">
                            {time}
                        </div>
                        <div className="text-[11px] sm:text-xs md:text-sm text-slate-400 mt-1">
                            {date}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Reusable card ────────────────────────────────────────────────────────────
const DashboardCard = ({
    title,
    breadcrumb,
    icon: Icon,
    link,
    accent = "indigo",
}) => {
    const a = ACCENTS[accent] ?? ACCENTS.indigo;

    return (
        <Link href={link} className="group block">
            <div
                className={`relative overflow-hidden bg-white rounded-2xl p-4 sm:p-5 md:p-6 min-h-[150px] sm:min-h-[165px] md:min-h-[180px]
                border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]
                ring-1 ring-transparent transition-all duration-300 cursor-pointer
                hover:-translate-y-1.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.08)]
                ${a.ring} ${a.border}`}
            >
                {/* ambient glow blob */}
                <div
                    className={`pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${a.blob}`}
                />

                {/* header row */}
                <div className="relative flex items-center justify-between mb-5 sm:mb-6 md:mb-8">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm md:text-base font-medium text-gray-400">
                            Home
                        </span>
                        <span className="text-gray-300">/</span>
                        <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-700">
                            {breadcrumb}
                        </span>
                    </div>
                    <span
                        className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200
                        text-gray-400 transition-all duration-300 shrink-0
                        group-hover:text-white ${a.arrowHover}`}
                    >
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                </div>

                {/* body */}
                <div className="relative flex items-center gap-3 sm:gap-4 md:gap-5">
                    <div
                        className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl shrink-0
                        bg-gradient-to-br ${a.gradient} shadow-lg shadow-black/10
                        transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3`}
                    >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 tracking-tight leading-snug">
                            {title}
                        </h3>
                        <span
                            className={`block h-0.5 w-0 rounded-full mt-1.5 transition-all duration-500
                            group-hover:w-10 ${a.underline}`}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};

// ─── Card grids per role ──────────────────────────────────────────────────────
const userCards = [
    {
        title: "Tasks",
        breadcrumb: "Tasks",
        icon: Users,
        link: "/task-assigned",
        accent: "indigo",
    },
    {
        title: "To Do List",
        breadcrumb: "To Do",
        icon: ClipboardCheck,
        link: "/todo",
        accent: "emerald",
    },
    {
        title: "Tickets",
        breadcrumb: "Tickets",
        icon: Users,
        link: "/ticket",
        accent: "amber",
    },
];

const developerCards = [
    {
        title: "Projects",
        breadcrumb: "Projects",
        icon: Users,
        link: "/project-management",
        accent: "indigo",
    },
    {
        title: "To Do List",
        breadcrumb: "To Do",
        icon: ClipboardCheck,
        link: "/todo",
        accent: "emerald",
    },
    {
        title: "Tasks",
        breadcrumb: "Tasks",
        icon: Users,
        link: "/task-assigned",
        accent: "indigo",
    },
    {
        title: "Tickets",
        breadcrumb: "Tickets",
        icon: Users,
        link: "/ticket",
        accent: "amber",
    },
];

const technicianCards = [
    {
        title: "Tickets",
        breadcrumb: "Tickets",
        icon: Users,
        link: "/ticket",
        accent: "amber",
    },
    {
        title: "To Do List",
        breadcrumb: "To Do",
        icon: ClipboardCheck,
        link: "/todo",
        accent: "emerald",
    },
    {
        title: "Tasks",
        breadcrumb: "Tasks",
        icon: Users,
        link: "/task-assigned",
        accent: "indigo",
    },
];

const accountantCards = [
    {
        title: "Leads",
        breadcrumb: "Leads",
        icon: Users,
        link: "/leads",
        accent: "rose",
    },
    {
        title: "Clients",
        breadcrumb: "Clients",
        icon: Users,
        link: "/client-management",
        accent: "indigo",
    },
    {
        title: "Finance Tracking",
        breadcrumb: "Finance Tracking",
        icon: Users,
        link: "/payment-finance-tracking",
        accent: "amber",
    },
    {
        title: "To Do List",
        breadcrumb: "To Do",
        icon: ClipboardCheck,
        link: "/todo",
        accent: "emerald",
    },
    {
        title: "Tasks",
        breadcrumb: "Tasks",
        icon: Users,
        link: "/task-assigned",
        accent: "indigo",
    },
    {
        title: "Tickets",
        breadcrumb: "Tickets",
        icon: Users,
        link: "/ticket",
        accent: "amber",
    },
];

// ─── Card grid wrapper ────────────────────────────────────────────────────────
const CardGrid = ({ label, cards }) => (
    <div className="w-full">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-4 sm:mb-5 md:mb-6">
            {label}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {cards.map((card, i) => (
                <DashboardCard key={i} {...card} />
            ))}
        </div>
    </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const Dashboard = () => {
    const [loading] = useState(false);

    const user = usePage().props.auth.user;
    const isAdmin = user?.role === "admin";
    const isManager = user?.role === "manager";
    const isDeveloper = user?.role === "developer";
    const isTechnician = user?.role === "technician";
    const isAccountant = user?.role === "accountant";
    const isUser = user?.role === "user";
    const isAdminOrManager = isAdmin || isManager;

    return (
        <>
            <Head title="Dashboard" />

            <AdminWrapper>
                {loading ? (
                    <PageLoader />
                ) : (
                    <>
                        {/* ── Greeting (shown for every role) ───────────── */}
                        <GreetingHeader name={user?.name} role={user?.role} />

                        {/* ── Admin ─────────────────────────────────────── */}
                        {isAdminOrManager && (
                            <div className="">
                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-4 sm:mb-5 md:mb-6">
                                    {isAdmin
                                        ? "Admin Dashboard"
                                        : "Manager Dashboard"}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8">
                                    <ClientDashboard />
                                    <DomainDashboard />
                                    <ProjectDashboard />
                                    <ExpiryDashboard />
                                    <FinanceDashboard />
                                    <HostingDashboard />
                                    <TicketDashboard />
                                    <TaskDashboard />
                                </div>
                                <div className="grid grid-cols-1  gap-4 sm:gap-5 md:gap-6 mb-8">
                                    <MonthlyReports />
                                    <DepartmentReports />
                                    <TaskReports />
                                </div>
                            </div>
                        )}

                        {/* ── Manager ───────────────────────────────────── */}
                        {isAccountant && (
                            <div className="">
                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-4 sm:mb-5 md:mb-6">
                                    Accountant Dashboard
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8">
                                    <ClientDashboard />
                                    <ExpiryDashboard />
                                    <DomainDashboard />
                                    <FinanceDashboard />
                                    <HostingDashboard />
                                </div>
                            </div>
                        )}

                        {/* ── Role-based card grids ─────────────────────── */}
                        {isUser && (
                            <CardGrid label="Dashboard" cards={userCards} />
                        )}
                        {isDeveloper && (
                            <CardGrid
                                label="Dashboard"
                                cards={developerCards}
                            />
                        )}
                        {/* {isAccountant && (
                            <CardGrid
                                label="Dashboard"
                                cards={accountantCards}
                            />
                        )} */}
                        {isTechnician && (
                            <CardGrid
                                label="Dashboard"
                                cards={technicianCards}
                            />
                        )}

                        <BackToTop />
                    </>
                )}
            </AdminWrapper>
        </>
    );
};

export default Dashboard;

// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Head, Link, usePage } from "@inertiajs/react";
// import React, { useState } from "react";
// import { ClipboardCheck, Users } from "lucide-react";
// import ClientDashboard from "../Dashboard/ClientDashboard";
// import BackToTop from "@/AdminWrapper/BackToTop";
// import TicketDashboard from "../Dashboard/TicketDashboard";
// import DomainDashboard from "../Dashboard/DomainDashboard";
// import ProjectDashboard from "../Dashboard/ProjectDashboard";
// import ExpiryDashboard from "../Dashboard/ExpiryDashboard";
// import FinanceDashboard from "../Dashboard/FinanceDashboard";
// import HostingDashboard from "../Dashboard/HostingDashboard";
// import PageLoader from "@/Loader/PageLoader";

// // ─── Reusable card ────────────────────────────────────────────────────────────
// const DashboardCard = ({ title, breadcrumb, icon: Icon, link }) => (
//     <Link href={link} className="block">
//         <div className="bg-white rounded-2xl p-5 sm:p-6 min-h-[160px] sm:min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
//             <div className="flex items-center gap-2 mb-5 sm:mb-6">
//                 <span className="text-base sm:text-xl font-semibold text-gray-800">
//                     Home
//                 </span>
//                 <span className="text-xs sm:text-sm text-gray-500">
//                     | {breadcrumb}
//                 </span>
//             </div>
//             <div className="flex items-center gap-4 sm:gap-6">
//                 <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-100 shrink-0">
//                     <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" />
//                 </div>
//                 <h3 className="text-base sm:text-lg font-medium text-gray-800 leading-snug">
//                     {title}
//                 </h3>
//             </div>
//         </div>
//     </Link>
// );

// // ─── Card grids per role ──────────────────────────────────────────────────────
// const userCards = [
//     { title: "Tasks", breadcrumb: "Tasks", icon: Users, link: "/tasks" },
//     { title: "To Do List", breadcrumb: "To Do", icon: ClipboardCheck, link: "/todo" },
// ];

// const developerCards = [
//     { title: "Projects", breadcrumb: "Projects", icon: Users, link: "/project-management" },
//     { title: "To Do List", breadcrumb: "To Do", icon: ClipboardCheck, link: "/todo" },
// ];

// const technicianCards = [
//     { title: "Tickets", breadcrumb: "Tickets", icon: Users, link: "/ticket" },
//     { title: "To Do List", breadcrumb: "To Do", icon: ClipboardCheck, link: "/todo" },
// ];

// const accountantCards = [
//     { title: "Leads", breadcrumb: "Leads", icon: Users, link: "/leads" },
//     { title: "Clients", breadcrumb: "Clients", icon: Users, link: "/client-management" },
//     { title: "Finance Tracking", breadcrumb: "Finance Tracking", icon: Users, link: "/payment-finance-tracking" },
//     { title: "To Do List", breadcrumb: "To Do", icon: ClipboardCheck, link: "/todo" },
// ];

// // ─── Card grid wrapper ────────────────────────────────────────────────────────
// const CardGrid = ({ label, cards }) => (
//     <div className="w-full py-4 px-4 sm:px-0">
//         <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-5 sm:mb-6">
//             {label}
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//             {cards.map((card, i) => (
//                 <DashboardCard key={i} {...card} />
//             ))}
//         </div>
//     </div>
// );

// // ─── Loading spinner ──────────────────────────────────────────────────────────

// // ─── Main component ───────────────────────────────────────────────────────────
// const Dashboard = () => {
//     const [loading] = useState(false);

//     const user = usePage().props.auth.user;
//     const isAdmin     = user?.role === "admin";
//     const isManager   = user?.role === "manager";
//     const isDeveloper = user?.role === "developer";
//     const isTechnician= user?.role === "technician";
//     const isAccountant= user?.role === "accountant";
//     const isUser      = user?.role === "user";

//     return (
//         <>
//             <Head title="Dashboard" />

//             <AdminWrapper>
//                 {loading ? (
//                     <PageLoader />
//                 ) : (
//                     <>
//                         {/* ── Admin ─────────────────────────────────────── */}
//                         {isAdmin && (
//                             <div className="px-4 sm:px-0">
//                                 <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-5 sm:mb-6">
//                                     Admin Dashboard
//                                 </h2>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
//                                     <ClientDashboard />
//                                     <DomainDashboard />
//                                     <ProjectDashboard />
//                                     <ExpiryDashboard />
//                                     <FinanceDashboard />
//                                     <HostingDashboard />
//                                     <TicketDashboard />
//                                 </div>
//                             </div>
//                         )}

//                         {/* ── Manager ───────────────────────────────────── */}
//                         {isManager && (
//                             <div className="px-4 sm:px-0">
//                                 <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase mb-5 sm:mb-6">
//                                     Manager Dashboard
//                                 </h2>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
//                                     <ExpiryDashboard />
//                                     <DomainDashboard />
//                                     <HostingDashboard />
//                                 </div>
//                             </div>
//                         )}

//                         {/* ── Role-based card grids ─────────────────────── */}
//                         {isUser       && <CardGrid label="Dashboard" cards={userCards} />}
//                         {isDeveloper  && <CardGrid label="Dashboard" cards={developerCards} />}
//                         {isAccountant && <CardGrid label="Dashboard" cards={accountantCards} />}
//                         {isTechnician && <CardGrid label="Dashboard" cards={technicianCards} />}

//                         <BackToTop />
//                     </>
//                 )}
//             </AdminWrapper>
//         </>
//     );
// };

// export default Dashboard;
