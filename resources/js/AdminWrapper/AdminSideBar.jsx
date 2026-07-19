// import React, { useEffect, useMemo, useState } from "react";
// import { Link, usePage } from "@inertiajs/react";
// import {
//     Activity,
//     Building2,
//     ChevronDown,
//     ChevronRight,
//     ClipboardList,
//     Key,
//     Landmark,
//     LayoutDashboard,
//     ListFilter,
//     Menu,
//     Receipt,
//     ScrollText,
//     UserCircle,
//     UserCog,
//     X,
// } from "lucide-react";

// const AdminSideBar = ({
//     isMobileOpen,
//     onMobileToggle,
//     isCollapsed,
//     onToggleCollapse,
// }) => {
//     const { url, props } = usePage();
//     const user = props?.auth?.user;
//     const role = user?.role;
//     const [openGroups, setOpenGroups] = useState({});
//     const currentUrl = url.split("?")[0];

//     const can = {
//         admin: role === "admin",
//         adminOrTechnician: role === "admin" || role === "technician",
//         adminOrDeveloper: role === "admin" || role === "developer",
//         adminOrAccountant: role === "admin" || role === "accountant",
//         adminOrManager: role === "admin" || role === "manager",
//     };

//     const isActive = (href) =>
//         currentUrl === href || currentUrl.startsWith(`${href}/`);
//     const isGroupActive = (items) => items.some((item) => isActive(item.href));

//     const groups = useMemo(
//         () => [
//             {
//                 id: "crm",
//                 label: "CRM",
//                 icon: ListFilter,
//                 show: can.adminOrAccountant,
//                 items: [
//                     { href: "/leads", label: "Leads" },
//                     { href: "/client-management", label: "Client Management" },
//                 ],
//             },
//             {
//                 id: "report",
//                 label: "Report",
//                 icon: ClipboardList,
//                 show: true,
//                 items: [
//                     { href: "/todo", label: "To Do List" },
//                     {
//                         href: "/ticket",
//                         label: "Ticket Management",
//                     },
//                     {
//                         href: "/project-management",
//                         label: "Project Management",
//                         show: can.adminOrDeveloper,
//                     },
//                 ],
//             },
//             {
//                 id: "company",
//                 label: "Company",
//                 icon: Building2,
//                 show: can.adminOrManager,
//                 items: [
//                     { href: "/client", label: "Clients" },
//                     { href: "/expiration", label: "Expirations" },
//                     { href: "/hosting-tracking", label: "Hosting Management" },
//                     { href: "/domain-tracking", label: "Domain Management" },
//                 ],
//             },
//             {
//                 id: "passwords",
//                 label: "Password Manager",
//                 icon: Key,
//                 show: true,
//                 items: [
//                     { href: "/category", label: "Categories" },
//                     { href: "/sub-category", label: "Sub Categories" },
//                     { href: "/sub-sub-category", label: "Sub Sub Categories" },
//                     { href: "/organization", label: "Organizations" },
//                     { href: "/password", label: "Passwords" },
//                 ],
//             },
//         ],
//         [
//             can.adminOrAccountant,
//             can.adminOrDeveloper,
//             can.adminOrManager,
//             can.adminOrTechnician,
//         ],
//     );

//     const quickLinks = [
//         {
//             href: "/payment-finance-tracking",
//             label: "Finance Tracking",
//             tooltip: "Payment & Finance Tracking",
//             icon: Landmark,
//             show: can.adminOrAccountant,
//         },
//          {
//             href: "/task-assigned",
//             label: "Task Assigned",
//             tooltip: "Task Assigned",
//             icon: ClipboardList,
//         },
//         {
//             href: "/client-details",
//             label: "Client Details",
//             icon: UserCircle,
//             show: can.admin,
//         },
//         {
//             href: "/payment-management",
//             label: "Payment",
//             icon: Receipt,
//             show: can.admin,
//         },
//         {
//             href: "/service-contracts",
//             label: "Service Contracts",
//             icon: ScrollText,
//             show: can.admin,
//         },
//         {
//             href: "/user-management",
//             label: "User Management",
//             icon: UserCog,
//             show: can.admin,
//         },
//         {
//             href: "/activity-log",
//             label: "Activity Log",
//             icon: Activity,
//             show: can.admin,
//         },
//     ];

//     useEffect(() => {
//         const activeGroups = groups.reduce((next, group) => {
//             const visibleItems = group.items.filter((item) => item.show !== false);
//             if (isGroupActive(visibleItems)) {
//                 next[group.id] = true;
//             }
//             return next;
//         }, {});

//         if (Object.keys(activeGroups).length > 0) {
//             setOpenGroups((current) => ({ ...current, ...activeGroups }));
//         }
//     }, [groups, url]);

//     const toggleGroup = (groupId) => {
//         if (isCollapsed) return;
//         setOpenGroups((current) => ({
//             ...current,
//             [groupId]: !current[groupId],
//         }));
//     };

//     const closeMobileMenu = () => {
//         if (isMobileOpen) onMobileToggle();
//     };

//     const navItemClass = (active) =>
//         [
//             "group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200",
//             isCollapsed ? "justify-center" : "",
//             active
//                 ? "border-l-4 border-blue-600 bg-blue-50 font-semibold text-blue-700"
//                 : "text-gray-600 hover:bg-blue-50 hover:text-blue-700",
//         ].join(" ");

//     const subItemClass = (active) =>
//         [
//             "flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors duration-200",
//             active
//                 ? "bg-blue-100 font-medium text-blue-700"
//                 : "text-gray-600 hover:bg-blue-50 hover:text-blue-700",
//         ].join(" ");

//     const Tooltip = ({ children }) => (
//         <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 opacity-0 shadow-lg shadow-slate-200/70 transition group-hover:opacity-100">
//             {children}
//         </span>
//     );

//     const NavLink = ({ href, label, tooltip, icon: Icon }) => {
//         const active = isActive(href);

//         return (
//             <Link
//                 href={href}
//                 onClick={closeMobileMenu}
//                 className={navItemClass(active)}
//                 title={isCollapsed ? label : undefined}
//             >
//                 <Icon className="h-5 w-5 shrink-0" />
//                 {!isCollapsed && <span className="truncate">{label}</span>}
//                 {/* {isCollapsed && <Tooltip>{tooltip || label}</Tooltip>} */}
//             </Link>
//         );
//     };

//     const NavGroup = ({ group }) => {
//         const visibleItems = group.items.filter((item) => item.show !== false);
//         const active = isGroupActive(visibleItems);
//         const Icon = group.icon;
//         const isOpen = Boolean(openGroups[group.id]);

//         if (visibleItems.length === 0 || group.show === false) return null;

//         if (isCollapsed) {
//             return (
//                 <div className="group/flyout relative">
//                     <button
//                         type="button"
//                         className={navItemClass(active)}
//                         title={group.label}
//                     >
//                         <Icon className="h-5 w-5 shrink-0" />
//                         {/* <Tooltip>{group.label}</Tooltip> */}
//                     </button>
//                     <div className="invisible fixed top-24 ml-12 z-50 min-w-56 rounded-lg border border-gray-200 bg-white p-2 opacity-0 shadow-lg transition group-hover/flyout:visible group-hover/flyout:opacity-100">
//                         <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
//                             {group.label}
//                         </p>
//                         <div className="space-y-1">
//                             {visibleItems.map((item) => (
//                                 <Link
//                                     key={item.href}
//                                     href={item.href}
//                                     onClick={closeMobileMenu}
//                                     className={subItemClass(isActive(item.href))}
//                                 >
//                                     {item.label}
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             );
//         }

//         return (
//             <div>
//                 <button
//                     type="button"
//                     onClick={() => toggleGroup(group.id)}
//                     className={`${navItemClass(active)} w-full justify-between`}
//                     aria-expanded={isOpen}
//                 >
//                     <span className="flex min-w-0 items-center gap-3">
//                         <Icon className="h-5 w-5 shrink-0" />
//                         <span className="truncate">{group.label}</span>
//                     </span>
//                     {isOpen ? (
//                         <ChevronDown className="h-4 w-4 shrink-0" />
//                     ) : (
//                         <ChevronRight className="h-4 w-4 shrink-0" />
//                     )}
//                 </button>

//                 {isOpen && (
//                     <div className="ml-5 mt-1 space-y-0.5 border-l border-gray-200 pl-3">
//                         {visibleItems.map((item) => (
//                             <Link
//                                 key={item.href}
//                                 href={item.href}
//                                 onClick={closeMobileMenu}
//                                 className={subItemClass(isActive(item.href))}
//                             >
//                                 <span className="mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
//                                 <span className="truncate">{item.label}</span>
//                             </Link>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <>
//             {isMobileOpen && (
//                 <button
//                     type="button"
//                     className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
//                     aria-label="Close sidebar"
//                     onClick={onMobileToggle}
//                 />
//             )}

//             <aside
//                 className={[
//                     "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white shadow-xl shadow-slate-200/60 transition-all duration-300",
//                     isCollapsed ? "w-16" : "w-64",
//                     isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
//                 ].join(" ")}
//             >
//                 <div
//                     className={[
//                         "flex h-16 shrink-0 items-center border-b border-slate-200",
//                         isCollapsed ? "justify-center" : "justify-between",
//                         isCollapsed ? "px-3" : "px-4",
//                     ].join(" ")}
//                 >
//                     {!isCollapsed && (
//                         <Link
//                             href="/dashboard"
//                             className="flex min-w-0 items-center gap-3"
//                             onClick={closeMobileMenu}
//                         >
//                             <img
//                                 src="/images/logo2.png"
//                                 alt="S.A I.T Solution"
//                                 className="h-10 w-auto max-w-[170px] object-contain"
//                             />
//                         </Link>
//                     )}

//                     <div className="flex items-center gap-1">
//                         <button
//                             type="button"
//                             onClick={onToggleCollapse}
//                             className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:inline-flex"
//                             title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//                         >
//                             <Menu className="h-5 w-5" />
//                         </button>
//                         <button
//                             type="button"
//                             onClick={onMobileToggle}
//                             className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
//                             aria-label="Close sidebar"
//                         >
//                             <X className="h-5 w-5" />
//                         </button>
//                     </div>
//                 </div>

//                 <nav
//                     className={[
//                         "flex-1 overflow-y-auto py-4",
//                         isCollapsed ? "px-2" : "px-3",
//                     ].join(" ")}
//                 >
//                     <div className="space-y-1">
//                         <NavLink
//                             href="/dashboard"
//                             label="Dashboard"
//                             icon={LayoutDashboard}
//                         />

//                         {!isCollapsed && (
//                             <p className="px-3 pb-1 pt-5 text-xs font-bold uppercase tracking-wide text-slate-400">
//                                 Pages
//                             </p>
//                         )}

//                         {groups.map((group) => (
//                             <NavGroup key={group.id} group={group} />
//                         ))}

//                         {quickLinks
//                             .filter((link) => link.show !== false)
//                             .map((link) => (
//                                 <NavLink key={link.href} {...link} />
//                             ))}
//                     </div>
//                 </nav>
//             </aside>
//         </>
//     );
// };

// export default AdminSideBar;




import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import {
    Activity,
    Bell,
    Building2,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Key,
    Landmark,
    LayoutDashboard,
    ListFilter,
    LogOut,
    Menu,
    Receipt,
    ScrollText,
    Search,
    User,
    UserCircle,
    UserCog,
} from "lucide-react";

const AdminSideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url, props } = usePage();
    const user = props?.auth?.user;
    const role = user?.role;
    const [openGroups, setOpenGroups] = useState({});
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const currentUrl = url.split("?")[0];
    const imgurl = import.meta.env.VITE_IMAGE_PATH;
    const canUseRoutes = typeof route === "function";

    const can = {
        admin: role === "admin",
        adminOrTechnician: role === "admin" || role === "technician",
        adminOrDeveloper: role === "admin" || role === "developer",
        adminOrAccountant: role === "admin" || role === "accountant",
        adminOrManager: role === "admin" || role === "manager",
    };

    const isActive = (href) =>
        currentUrl === href || currentUrl.startsWith(`${href}/`);
    const isGroupActive = (items) => items.some((item) => isActive(item.href));

    const groups = useMemo(
        () => [
            {
                id: "crm",
                label: "CRM",
                icon: ListFilter,
                show: can.adminOrAccountant,
                items: [
                    { href: "/leads", label: "Leads" },
                    { href: "/client-management", label: "Client Management" },
                ],
            },
            {
                id: "company",
                label: "Company",
                icon: Building2,
                show: can.adminOrManager,
                items: [
                    { href: "/client", label: "Clients" },
                    { href: "/expiration", label: "Expirations" },
                    { href: "/hosting-tracking", label: "Hosting Management" },
                    { href: "/domain-tracking", label: "Domain Management" },
                ],
            },
            // {
            //     id: "report",
            //     label: "Report",
            //     icon: ClipboardList,
            //     show: true,
            //     items: [
            //         { href: "/todo", label: "To Do List" },
            //         { href: "/ticket", label: "Ticket Management" },
            //         {
            //             href: "/project-management",
            //             label: "Project Management",
            //             show: can.adminOrDeveloper,
            //         },
            //     ],
            // },
            {
                id: "payment-management",
                label: "Payment Management",
                icon: Building2,
                show: can.adminOrManager,
                items: [
                    {
                        href: "/payment-management",
                        label: "Payment Management",
                    },
                    { href: "/service-contracts", label: "Service Contracts" },
                    { href: "/client-details", label: "Client Details" },
                ],
            },
            {
                id: "passwords",
                label: "Password Manager",
                icon: Key,
                show: true,
                items: [
                    { href: "/category", label: "Categories" },
                    { href: "/sub-category", label: "Sub Categories" },
                    { href: "/sub-sub-category", label: "Sub Sub Categories" },
                    { href: "/organization", label: "Organizations" },
                    { href: "/password", label: "Passwords" },
                ],
            },
            {
                id: "user-management",
                label: "User Management",
                icon: User,
                show: can.adminOrManager,
                items: [
                    { href: "/user-management", label: "User Management" },
                    { href: "/activity-log", label: "Activity Log" },
                ],
            },
        ],
        [
            can.adminOrAccountant,
            can.adminOrDeveloper,
            can.adminOrManager,
            can.adminOrTechnician,
        ],
    );

    const quickLinks = [
        {
            href: "/payment-finance-tracking",
            label: "Finance",
            icon: Landmark,
            show: can.adminOrAccountant,
        },
        {
            href: "/task-assigned",
            label: "Task Assigned",
            icon: ClipboardList,
        },
        // {
        //     href: "/client-details",
        //     label: "Client Details",
        //     icon: UserCircle,
        //     show: can.admin,
        // },
        // {
        //     href: "/payment-management",
        //     label: "Payment",
        //     icon: Receipt,
        //     show: can.admin,
        // },
        // {
        //     href: "/service-contracts",
        //     label: "Contracts",
        //     icon: ScrollText,
        //     show: can.admin,
        // },
        {
            href: "/todo",
            label: "Todo",
            icon: ScrollText,
        },
        {
            href: "/ticket",
            label: "Ticket",
            icon: ScrollText,
        },
        {
            href: "/project-management",
            label: "Project Management",
            icon: UserCog,
            show: can.adminOrDeveloper,
        },

        // {
        //     href: "/user-management",
        //     label: "Users",
        //     icon: UserCog,
        //     show: can.admin,
        // },
        // {
        //     href: "/activity-log",
        //     label: "Activity Log",
        //     icon: Activity,
        //     show: can.admin,
        // },
    ];

    useEffect(() => {
        const activeGroups = groups.reduce((next, group) => {
            const visibleItems = group.items.filter(
                (item) => item.show !== false,
            );
            if (isGroupActive(visibleItems)) {
                next[group.id] = true;
            }
            return next;
        }, {});

        if (Object.keys(activeGroups).length > 0) {
            setOpenGroups((current) => ({ ...current, ...activeGroups }));
        }
    }, [groups, url]);

    useEffect(() => {
        setIsProfileMenuOpen(false);
    }, [url]);

    const toggleGroup = (groupId) => {
        if (isCollapsed) return;
        setOpenGroups((current) => ({
            ...current,
            [groupId]: !current[groupId],
        }));
    };

    const closeMobileMenu = () => {
        if (isMobileOpen) onMobileToggle();
    };

    const handleLogout = async () => {
        try {
            if (canUseRoutes) {
                await axios.post(route("logout"));
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            window.location.href = "/login";
        }
    };

    const initials = (user?.name || "Guest")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

    // ---- Visual primitives ----

    const GridTile = ({ href, label, icon: Icon }) => {
        const active = isActive(href);

        if (isCollapsed) {
            return (
                <Link
                    href={href}
                    onClick={closeMobileMenu}
                    title={label}
                    className={[
                        "flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-200",
                        active
                            ? "bg-gray-900 text-white shadow-sm"
                            : "bg-white text-gray-900 hover:bg-gray-50",
                    ].join(" ")}
                >
                    <Icon className="h-4 w-4" />
                </Link>
            );
        }

        return (
            <Link
                href={href}
                onClick={closeMobileMenu}
                className={[
                    "flex flex-col items-center justify-center gap-2 rounded-2xl px-3 py-4 text-center transition-colors duration-200",
                    active
                        ? "bg-gray-900 text-white shadow-sm"
                        : "bg-white text-gray-900 ring-1 ring-inset ring-gray-100 hover:bg-gray-50",
                ].join(" ")}
            >
                <span
                    className={[
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        active
                            ? "bg-white/15 text-white"
                            : "bg-gray-100 text-gray-900",
                    ].join(" ")}
                >
                    <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold leading-tight">
                    {label}
                </span>
            </Link>
        );
    };

    const GroupSection = ({ group }) => {
        const visibleItems = group.items.filter((item) => item.show !== false);
        const active = isGroupActive(visibleItems);
        const Icon = group.icon;
        const isOpen = Boolean(openGroups[group.id]);
        const triggerRef = useRef(null);
        const closeTimeoutRef = useRef(null);
        const [flyoutPos, setFlyoutPos] = useState(null);

        if (visibleItems.length === 0 || group.show === false) return null;

        if (isCollapsed) {
            const clearCloseTimeout = () => {
                if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current);
                    closeTimeoutRef.current = null;
                }
            };

            const showFlyout = () => {
                clearCloseTimeout();
                const rect = triggerRef.current?.getBoundingClientRect();
                if (rect) {
                    setFlyoutPos({
                        top: rect.top,
                        left: rect.right + 8,
                    });
                }
            };

            const scheduleHideFlyout = () => {
                clearCloseTimeout();
                // Small delay avoids the flyout closing when the pointer
                // crosses the gap between the button and the flyout itself.
                closeTimeoutRef.current = setTimeout(() => {
                    setFlyoutPos(null);
                }, 120);
            };

            useEffect(() => clearCloseTimeout, []);

            return (
                <div
                    className="relative"
                    onMouseEnter={showFlyout}
                    onMouseLeave={scheduleHideFlyout}
                >
                    <button
                        ref={triggerRef}
                        type="button"
                        className={[
                            "flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-200",
                            active
                                ? "bg-gray-900 text-white shadow-sm"
                                : "bg-white text-gray-900 hover:bg-gray-50",
                        ].join(" ")}
                        title={group.label}
                    >
                        <Icon className="h-4 w-4" />
                    </button>

                    {flyoutPos &&
                        createPortal(
                            <div
                                style={{
                                    position: "fixed",
                                    top: flyoutPos.top,
                                    left: flyoutPos.left,
                                }}
                                className="z-[100] min-w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-lg"
                                onMouseEnter={showFlyout}
                                onMouseLeave={scheduleHideFlyout}
                            >
                                <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wide text-gray-900">
                                    {group.label}
                                </p>
                                <div className="space-y-0.5">
                                    {visibleItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeMobileMenu}
                                            className={[
                                                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors duration-200",
                                                isActive(item.href)
                                                    ? "bg-gray-900 font-medium text-white"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                            ].join(" ")}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>,
                            document.body,
                        )}
                </div>
            );
        }

        return (
            <div>
                <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className={[
                        "flex w-full items-center justify-between rounded-xl px-1 py-1.5 text-xs font-bold uppercase tracking-wide transition",
                        active
                            ? "text-gray-900"
                            : "text-gray-600 hover:text-gray-600",
                    ].join(" ")}
                    aria-expanded={isOpen}
                >
                    <span className="flex items-center gap-2">
                        {isOpen ? (
                            <ChevronDown
                                className={[
                                    "h-3.5 w-3.5",
                                    active ? "text-gray-900" : "",
                                ].join(" ")}
                            />
                        ) : (
                            <ChevronRight
                                className={[
                                    "h-3.5 w-3.5",
                                    active ? "text-gray-900" : "",
                                ].join(" ")}
                            />
                        )}
                        {group.label}
                    </span>
                </button>

                {isOpen && (
                    <div className="mt-1 space-y-0.5 pl-2">
                        {visibleItems.map((item) => {
                            const itemActive = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                    className={[
                                        "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors duration-200",
                                        itemActive
                                            ? "bg-gray-900 font-medium text-white"
                                            : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                                    ].join(" ")}
                                >
                                    <span
                                        className={[
                                            "h-1.5 w-1.5 shrink-0 rounded-full",
                                            itemActive
                                                ? "bg-amber-400"
                                                : "bg-amber-300/70",
                                        ].join(" ")}
                                    />
                                    <span className="truncate">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {isMobileOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
                    aria-label="Close sidebar"
                    onClick={onMobileToggle}
                />
            )}

            <aside
                className={[
                    "fixed left-0 top-0 z-50 flex h-screen flex-col bg-amber-50/60 transition-all duration-300",
                    isCollapsed ? "w-20" : "w-64",
                    isMobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0",
                ].join(" ")}
            >
                <div className="flex h-full flex-col  bg-white p-4 shadow-xl shadow-amber-100/60">
                    {/* Logo + collapse toggle */}
                    <div
                        className={[
                            "flex items-center pb-3 border-b border-slate-200",
                            isCollapsed ? "justify-center" : "justify-between",
                        ].join(" ")}
                    >
                        {!isCollapsed ? (
                            <Link
                                href="/dashboard"
                                className="flex min-w-0 items-center gap-2"
                                onClick={closeMobileMenu}
                            >
                                <img
                                    src="/images/logo2.png"
                                    alt="S.A I.T Solution"
                                    className="h-9 w-[150px] max-w-[500px] object-contain"
                                />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={closeMobileMenu}
                                    className="hidden"
                                >
                                    <img
                                        src="/images/logo2.png"
                                        alt="S.A I.T Solution"
                                        className="h-8 w-8 object-contain"
                                    />
                                </Link>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            className="hidden rounded-full p-2 text-gray-900 transition hover:bg-gray-100 hover:text-gray-900 lg:inline-flex"
                            title={
                                isCollapsed
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto pr-1 py-4">
                        {/* Grid tiles: Dashboard + quick links */}
                        <div
                            className={[
                                isCollapsed
                                    ? "flex flex-col items-center gap-2"
                                    : "grid grid-cols-2 gap-2",
                            ].join(" ")}
                        >
                            <GridTile
                                href="/dashboard"
                                label="Dashboard"
                                icon={LayoutDashboard}
                            />
                            {quickLinks
                                .filter((link) => link.show !== false)
                                .map((link) => (
                                    <GridTile key={link.href} {...link} />
                                ))}
                        </div>

                        {/* Collapsible groups */}
                        {!isCollapsed && (
                            <p className="px-1 text-xs font-bold uppercase tracking-wide text-gray-300">
                                Menu
                            </p>
                        )}
                        <div
                            className={
                                isCollapsed
                                    ? "flex flex-col items-center gap-2"
                                    : "space-y-3"
                            }
                        >
                            {groups.map((group) => (
                                <GroupSection key={group.id} group={group} />
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSideBar;

// import React, { useEffect, useMemo, useState } from "react";
// import { Link, usePage } from "@inertiajs/react";
// import axios from "axios";
// import {
//     Activity,
//     Bell,
//     Building2,
//     ChevronDown,
//     ChevronRight,
//     ClipboardList,
//     Key,
//     Landmark,
//     LayoutDashboard,
//     ListFilter,
//     LogOut,
//     Menu,
//     Receipt,
//     ScrollText,
//     Search,
//     User,
//     UserCircle,
//     UserCog,
// } from "lucide-react";

// const AdminSideBar = ({
//     isMobileOpen,
//     onMobileToggle,
//     isCollapsed,
//     onToggleCollapse,
// }) => {
//     const { url, props } = usePage();
//     const user = props?.auth?.user;
//     const role = user?.role;
//     const [openGroups, setOpenGroups] = useState({});
//     const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//     const currentUrl = url.split("?")[0];
//     const imgurl = import.meta.env.VITE_IMAGE_PATH;
//     const canUseRoutes = typeof route === "function";

//     const can = {
//         admin: role === "admin",
//         adminOrTechnician: role === "admin" || role === "technician",
//         adminOrDeveloper: role === "admin" || role === "developer",
//         adminOrAccountant: role === "admin" || role === "accountant",
//         adminOrManager: role === "admin" || role === "manager",
//     };

//     const isActive = (href) =>
//         currentUrl === href || currentUrl.startsWith(`${href}/`);
//     const isGroupActive = (items) => items.some((item) => isActive(item.href));

//     const groups = useMemo(
//         () => [
//             {
//                 id: "crm",
//                 label: "CRM",
//                 icon: ListFilter,
//                 show: can.adminOrAccountant,
//                 items: [
//                     { href: "/leads", label: "Leads" },
//                     { href: "/client-management", label: "Client Management" },
//                 ],
//             },
//             {
//                 id: "company",
//                 label: "Company",
//                 icon: Building2,
//                 show: can.adminOrManager,
//                 items: [
//                     { href: "/client", label: "Clients" },
//                     { href: "/expiration", label: "Expirations" },
//                     { href: "/hosting-tracking", label: "Hosting Management" },
//                     { href: "/domain-tracking", label: "Domain Management" },
//                 ],
//             },
//             // {
//             //     id: "report",
//             //     label: "Report",
//             //     icon: ClipboardList,
//             //     show: true,
//             //     items: [
//             //         { href: "/todo", label: "To Do List" },
//             //         { href: "/ticket", label: "Ticket Management" },
//             //         {
//             //             href: "/project-management",
//             //             label: "Project Management",
//             //             show: can.adminOrDeveloper,
//             //         },
//             //     ],
//             // },
//             {
//                 id: "payment-management",
//                 label: "Payment Management",
//                 icon: Building2,
//                 show: can.adminOrManager,
//                 items: [
//                     {
//                         href: "/payment-management",
//                         label: "Payment Management",
//                     },
//                     { href: "/service-contracts", label: "Service Contracts" },
//                     { href: "/client-details", label: "Client Details" },
//                 ],
//             },
//             {
//                 id: "passwords",
//                 label: "Password Manager",
//                 icon: Key,
//                 show: true,
//                 items: [
//                     { href: "/category", label: "Categories" },
//                     { href: "/sub-category", label: "Sub Categories" },
//                     { href: "/sub-sub-category", label: "Sub Sub Categories" },
//                     { href: "/organization", label: "Organizations" },
//                     { href: "/password", label: "Passwords" },
//                 ],
//             },
//             {
//                 id: "user-management",
//                 label: "User Management",
//                 icon: User,
//                 show: can.adminOrManager,
//                 items: [
//                     { href: "/user-management", label: "User Management" },
//                     { href: "/activity-log", label: "Activity Log" },
//                 ],
//             },
//         ],
//         [
//             can.adminOrAccountant,
//             can.adminOrDeveloper,
//             can.adminOrManager,
//             can.adminOrTechnician,
//         ],
//     );

//     const quickLinks = [
//         {
//             href: "/payment-finance-tracking",
//             label: "Finance",
//             icon: Landmark,
//             show: can.adminOrAccountant,
//         },
//         {
//             href: "/task-assigned",
//             label: "Task Assigned",
//             icon: ClipboardList,
//         },
//         // {
//         //     href: "/client-details",
//         //     label: "Client Details",
//         //     icon: UserCircle,
//         //     show: can.admin,
//         // },
//         // {
//         //     href: "/payment-management",
//         //     label: "Payment",
//         //     icon: Receipt,
//         //     show: can.admin,
//         // },
//         // {
//         //     href: "/service-contracts",
//         //     label: "Contracts",
//         //     icon: ScrollText,
//         //     show: can.admin,
//         // },
//         {
//             href: "/todo",
//             label: "Todo",
//             icon: ScrollText,
//         },
//         {
//             href: "/ticket",
//             label: "Ticket",
//             icon: ScrollText,
//         },
//         {
//             href: "/project-management",
//             label: "Project Management",
//             icon: UserCog,
//             show: can.adminOrDeveloper,
//         },

//         // {
//         //     href: "/user-management",
//         //     label: "Users",
//         //     icon: UserCog,
//         //     show: can.admin,
//         // },
//         // {
//         //     href: "/activity-log",
//         //     label: "Activity Log",
//         //     icon: Activity,
//         //     show: can.admin,
//         // },
//     ];

//     useEffect(() => {
//         const activeGroups = groups.reduce((next, group) => {
//             const visibleItems = group.items.filter(
//                 (item) => item.show !== false,
//             );
//             if (isGroupActive(visibleItems)) {
//                 next[group.id] = true;
//             }
//             return next;
//         }, {});

//         if (Object.keys(activeGroups).length > 0) {
//             setOpenGroups((current) => ({ ...current, ...activeGroups }));
//         }
//     }, [groups, url]);

//     useEffect(() => {
//         setIsProfileMenuOpen(false);
//     }, [url]);

//     const toggleGroup = (groupId) => {
//         if (isCollapsed) return;
//         setOpenGroups((current) => ({
//             ...current,
//             [groupId]: !current[groupId],
//         }));
//     };

//     const closeMobileMenu = () => {
//         if (isMobileOpen) onMobileToggle();
//     };

//     const handleLogout = async () => {
//         try {
//             if (canUseRoutes) {
//                 await axios.post(route("logout"));
//             }
//         } catch (error) {
//             console.error("Logout error:", error);
//         } finally {
//             window.location.href = "/login";
//         }
//     };

//     const initials = (user?.name || "Guest")
//         .split(" ")
//         .filter(Boolean)
//         .slice(0, 2)
//         .map((part) => part[0])
//         .join("")
//         .toUpperCase();

//     // ---- Visual primitives ----

//     const GridTile = ({ href, label, icon: Icon }) => {
//         const active = isActive(href);

//         if (isCollapsed) {
//             return (
//                 <Link
//                     href={href}
//                     onClick={closeMobileMenu}
//                     title={label}
//                     className={[
//                         "flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-200",
//                         active
//                             ? "bg-gray-900 text-white shadow-sm"
//                             : "bg-white text-gray-500 hover:bg-gray-50",
//                     ].join(" ")}
//                 >
//                     <Icon className="h-4 w-4" />
//                 </Link>
//             );
//         }

//         return (
//             <Link
//                 href={href}
//                 onClick={closeMobileMenu}
//                 className={[
//                     "flex flex-col items-center justify-center gap-2 rounded-2xl px-3 py-4 text-center transition-colors duration-200",
//                     active
//                         ? "bg-gray-900 text-white shadow-sm"
//                         : "bg-white text-gray-500 ring-1 ring-inset ring-gray-100 hover:bg-gray-50",
//                 ].join(" ")}
//             >
//                 <span
//                     className={[
//                         "flex h-8 w-8 items-center justify-center rounded-full",
//                         active
//                             ? "bg-white/15 text-white"
//                             : "bg-gray-100 text-gray-500",
//                     ].join(" ")}
//                 >
//                     <Icon className="h-4 w-4" />
//                 </span>
//                 <span className="text-xs font-semibold leading-tight">
//                     {label}
//                 </span>
//             </Link>
//         );
//     };

//     const GroupSection = ({ group }) => {
//         const visibleItems = group.items.filter((item) => item.show !== false);
//         const active = isGroupActive(visibleItems);
//         const Icon = group.icon;
//         const isOpen = Boolean(openGroups[group.id]);

//         if (visibleItems.length === 0 || group.show === false) return null;

//         if (isCollapsed) {
//             return (
//                 <div className="group/flyout relative">
//                     <button
//                         type="button"
//                         className={[
//                             "flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-200",
//                             active
//                                 ? "bg-gray-900 text-white shadow-sm"
//                                 : "bg-white text-gray-500 hover:bg-gray-50",
//                         ].join(" ")}
//                         title={group.label}
//                     >
//                         <Icon className="h-4 w-4" />
//                     </button>
//                     <div className="invisible absolute left-full top-0 ml-2 z-[999] min-w-56 rounded-2xl border border-gray-100 bg-white p-2 opacity-0 shadow-lg transition group-hover/flyout:visible group-hover/flyout:opacity-100">
//                         <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wide text-gray-400">
//                             {group.label}
//                         </p>
//                         <div className="space-y-0.5">
//                             {visibleItems.map((item) => (
//                                 <Link
//                                     key={item.href}
//                                     href={item.href}
//                                     onClick={closeMobileMenu}
//                                     className={[
//                                         "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors duration-200",
//                                         isActive(item.href)
//                                             ? "bg-gray-900 font-medium text-white"
//                                             : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
//                                     ].join(" ")}
//                                 >
//                                     {item.label}
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             );
//         }

//         return (
//             <div>
//                 {/* <button
//                     type="button"
//                     onClick={() => toggleGroup(group.id)}
//                     className="flex w-full items-center justify-between rounded-xl px-1 py-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 transition hover:text-gray-600"
//                     aria-expanded={isOpen}
//                 >
//                     <span className="flex items-center gap-2">
//                         {isOpen ? (
//                             <ChevronDown className="h-3.5 w-3.5" />
//                         ) : (
//                             <ChevronRight className="h-3.5 w-3.5" />
//                         )}
//                         {group.label}
//                     </span>
//                 </button> */}

//                 <button
//                     type="button"
//                     onClick={() => toggleGroup(group.id)}
//                     className={[
//                         "flex w-full items-center justify-between rounded-xl px-1 py-1.5 text-xs font-bold uppercase tracking-wide transition",
//                         active
//                             ? "text-gray-900"
//                             : "text-gray-400 hover:text-gray-600",
//                     ].join(" ")}
//                     aria-expanded={isOpen}
//                 >
//                     <span className="flex items-center gap-2">
//                         {isOpen ? (
//                             <ChevronDown
//                                 className={[
//                                     "h-3.5 w-3.5",
//                                     active ? "text-gray-900" : "",
//                                 ].join(" ")}
//                             />
//                         ) : (
//                             <ChevronRight
//                                 className={[
//                                     "h-3.5 w-3.5",
//                                     active ? "text-gray-900" : "",
//                                 ].join(" ")}
//                             />
//                         )}
//                         {group.label}
//                     </span>
//                 </button>

//                 {isOpen && (
//                     <div className="mt-1 space-y-0.5 pl-2">
//                         {visibleItems.map((item) => {
//                             const itemActive = isActive(item.href);
//                             return (
//                                 <Link
//                                     key={item.href}
//                                     href={item.href}
//                                     onClick={closeMobileMenu}
//                                     className={[
//                                         "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors duration-200",
//                                         itemActive
//                                             ? "bg-gray-900 font-medium text-white"
//                                             : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
//                                     ].join(" ")}
//                                 >
//                                     <span
//                                         className={[
//                                             "h-1.5 w-1.5 shrink-0 rounded-full",
//                                             itemActive
//                                                 ? "bg-amber-400"
//                                                 : "bg-amber-300/70",
//                                         ].join(" ")}
//                                     />
//                                     <span className="truncate">
//                                         {item.label}
//                                     </span>
//                                 </Link>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <>
//             {isMobileOpen && (
//                 <button
//                     type="button"
//                     className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
//                     aria-label="Close sidebar"
//                     onClick={onMobileToggle}
//                 />
//             )}

//             <aside
//                 className={[
//                     "fixed left-0 top-0 z-50 flex h-screen flex-col bg-amber-50/60 transition-all duration-300",
//                     isCollapsed ? "w-20" : "w-64",
//                     isMobileOpen
//                         ? "translate-x-0"
//                         : "-translate-x-full lg:translate-x-0",
//                 ].join(" ")}
//             >
//                 <div className="flex h-full flex-col  bg-white p-4 shadow-xl shadow-amber-100/60">
//                     {/* Logo + collapse toggle */}
//                     <div
//                         className={[
//                             "flex items-center pb-3 border-b border-slate-200",
//                             isCollapsed ? "justify-center" : "justify-between",
//                         ].join(" ")}
//                     >
//                         {!isCollapsed ? (
//                             <Link
//                                 href="/dashboard"
//                                 className="flex min-w-0 items-center gap-2"
//                                 onClick={closeMobileMenu}
//                             >
//                                 <img
//                                     src="/images/logo2.png"
//                                     alt="S.A I.T Solution"
//                                     className="h-9 w-[150px] max-w-[500px] object-contain"
//                                 />
//                             </Link>
//                         ) : (
//                             <>
//                                 <Link
//                                     href="/dashboard"
//                                     onClick={closeMobileMenu}
//                                     className="hidden"
//                                 >
//                                     <img
//                                         src="/images/logo2.png"
//                                         alt="S.A I.T Solution"
//                                         className="h-8 w-8 object-contain"
//                                     />
//                                 </Link>
//                             </>
//                         )}

//                         <button
//                             type="button"
//                             onClick={onToggleCollapse}
//                             className="hidden rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 lg:inline-flex"
//                             title={
//                                 isCollapsed
//                                     ? "Expand sidebar"
//                                     : "Collapse sidebar"
//                             }
//                         >
//                             <Menu className="h-5 w-5" />
//                         </button>
//                     </div>

//                     <div className="flex-1 space-y-5 overflow-y-auto pr-1 py-4">
//                         {/* Grid tiles: Dashboard + quick links */}
//                         <div
//                             className={[
//                                 isCollapsed
//                                     ? "flex flex-col items-center gap-2"
//                                     : "grid grid-cols-2 gap-2",
//                             ].join(" ")}
//                         >
//                             <GridTile
//                                 href="/dashboard"
//                                 label="Dashboard"
//                                 icon={LayoutDashboard}
//                             />
//                             {quickLinks
//                                 .filter((link) => link.show !== false)
//                                 .map((link) => (
//                                     <GridTile key={link.href} {...link} />
//                                 ))}
//                         </div>

//                         {/* Collapsible groups */}
//                         {!isCollapsed && (
//                             <p className="px-1 text-xs font-bold uppercase tracking-wide text-gray-300">
//                                 Menu
//                             </p>
//                         )}
//                         <div
//                             className={
//                                 isCollapsed
//                                     ? "flex flex-col items-center gap-2"
//                                     : "space-y-3"
//                             }
//                         >
//                             {groups.map((group) => (
//                                 <GroupSection key={group.id} group={group} />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </aside>
//         </>
//     );
// };

// export default AdminSideBar;

// import React, { useEffect, useMemo, useState } from "react";
// import { Link, usePage } from "@inertiajs/react";
// import {
//     Activity,
//     Building2,
//     ChevronDown,
//     ChevronRight,
//     ClipboardList,
//     Key,
//     Landmark,
//     LayoutDashboard,
//     ListFilter,
//     Menu,
//     Receipt,
//     ScrollText,
//     UserCircle,
//     UserCog,
// } from "lucide-react";

// const AdminSideBar = ({
//     isMobileOpen,
//     onMobileToggle,
//     isCollapsed,
//     onToggleCollapse,
// }) => {
//     const { url, props } = usePage();
//     const user = props?.auth?.user;
//     const role = user?.role;
//     const [openGroups, setOpenGroups] = useState({});
//     const currentUrl = url.split("?")[0];
//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const can = {
//         admin: role === "admin",
//         adminOrTechnician: role === "admin" || role === "technician",
//         adminOrDeveloper: role === "admin" || role === "developer",
//         adminOrAccountant: role === "admin" || role === "accountant",
//         adminOrManager: role === "admin" || role === "manager",
//     };

//     const isActive = (href) =>
//         currentUrl === href || currentUrl.startsWith(`${href}/`);
//     const isGroupActive = (items) => items.some((item) => isActive(item.href));

//     const groups = useMemo(
//         () => [
//             {
//                 id: "crm",
//                 label: "CRM",
//                 icon: ListFilter,
//                 show: can.adminOrAccountant,
//                 items: [
//                     { href: "/leads", label: "Leads" },
//                     { href: "/client-management", label: "Client Management" },
//                 ],
//             },
//             {
//                 id: "report",
//                 label: "Report",
//                 icon: ClipboardList,
//                 show: true,
//                 items: [
//                     { href: "/todo", label: "To Do List" },
//                     { href: "/ticket", label: "Ticket Management" },
//                     {
//                         href: "/project-management",
//                         label: "Project Management",
//                         show: can.adminOrDeveloper,
//                     },
//                 ],
//             },
//             {
//                 id: "company",
//                 label: "Company",
//                 icon: Building2,
//                 show: can.adminOrManager,
//                 items: [
//                     { href: "/client", label: "Clients" },
//                     { href: "/expiration", label: "Expirations" },
//                     { href: "/hosting-tracking", label: "Hosting Management" },
//                     { href: "/domain-tracking", label: "Domain Management" },
//                 ],
//             },
//             {
//                 id: "passwords",
//                 label: "Password Manager",
//                 icon: Key,
//                 show: true,
//                 items: [
//                     { href: "/category", label: "Categories" },
//                     { href: "/sub-category", label: "Sub Categories" },
//                     { href: "/sub-sub-category", label: "Sub Sub Categories" },
//                     { href: "/organization", label: "Organizations" },
//                     { href: "/password", label: "Passwords" },
//                 ],
//             },
//         ],
//         [
//             can.adminOrAccountant,
//             can.adminOrDeveloper,
//             can.adminOrManager,
//             can.adminOrTechnician,
//         ],
//     );

//     const quickLinks = [
//         {
//             href: "/payment-finance-tracking",
//             label: "Finance Tracking",
//             icon: Landmark,
//             show: can.adminOrAccountant,
//         },
//         {
//             href: "/task-assigned",
//             label: "Task Assigned",
//             icon: ClipboardList,
//         },
//         {
//             href: "/client-details",
//             label: "Client Details",
//             icon: UserCircle,
//             show: can.admin,
//         },
//         {
//             href: "/payment-management",
//             label: "Payment",
//             icon: Receipt,
//             show: can.admin,
//         },
//         {
//             href: "/service-contracts",
//             label: "Service Contracts",
//             icon: ScrollText,
//             show: can.admin,
//         },
//         {
//             href: "/user-management",
//             label: "User Management",
//             icon: UserCog,
//             show: can.admin,
//         },
//         {
//             href: "/activity-log",
//             label: "Activity Log",
//             icon: Activity,
//             show: can.admin,
//         },
//     ];

//     useEffect(() => {
//         const activeGroups = groups.reduce((next, group) => {
//             const visibleItems = group.items.filter((item) => item.show !== false);
//             if (isGroupActive(visibleItems)) {
//                 next[group.id] = true;
//             }
//             return next;
//         }, {});

//         if (Object.keys(activeGroups).length > 0) {
//             setOpenGroups((current) => ({ ...current, ...activeGroups }));
//         }
//     }, [groups, url]);

//     const toggleGroup = (groupId) => {
//         if (isCollapsed) return;
//         setOpenGroups((current) => ({
//             ...current,
//             [groupId]: !current[groupId],
//         }));
//     };

//     const closeMobileMenu = () => {
//         if (isMobileOpen) onMobileToggle();
//     };

//     // ---- Jobgio-style visual primitives ----

//     const iconChipClass = (active) =>
//         [
//             "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
//             active ? "bg-white text-gray-900" : "bg-gray-100 text-gray-500",
//         ].join(" ");

//     const navItemClass = (active) =>
//         [
//             "group relative flex items-center gap-3 rounded-2xl py-2 pr-3 text-sm font-medium transition-colors duration-200",
//             isCollapsed ? "justify-center px-2" : "pl-2",
//             active
//                 ? "bg-gray-900 text-white shadow-sm"
//                 : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
//         ].join(" ");

//     const subItemClass = (active) =>
//         [
//             "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors duration-200",
//             active
//                 ? "bg-gray-900 font-medium text-white"
//                 : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
//         ].join(" ");

//     const NavLink = ({ href, label, icon: Icon }) => {
//         const active = isActive(href);

//         return (
//             <Link
//                 href={href}
//                 onClick={closeMobileMenu}
//                 className={navItemClass(active)}
//                 title={isCollapsed ? label : undefined}
//             >
//                 <span className={iconChipClass(active)}>
//                     <Icon className="h-4 w-4" />
//                 </span>
//                 {!isCollapsed && <span className="truncate">{label}</span>}
//             </Link>
//         );
//     };

//     const NavGroup = ({ group }) => {
//         const visibleItems = group.items.filter((item) => item.show !== false);
//         const active = isGroupActive(visibleItems);
//         const Icon = group.icon;
//         const isOpen = Boolean(openGroups[group.id]);

//         if (visibleItems.length === 0 || group.show === false) return null;

//         if (isCollapsed) {
//             return (
//                 <div className="group/flyout relative">
//                     <button
//                         type="button"
//                         className={navItemClass(active)}
//                         title={group.label}
//                     >
//                         <span className={iconChipClass(active)}>
//                             <Icon className="h-4 w-4" />
//                         </span>
//                     </button>
//                     <div className="invisible fixed top-24 ml-3 z-50 min-w-56 rounded-2xl border border-gray-100 bg-white p-2 opacity-0 shadow-lg transition group-hover/flyout:visible group-hover/flyout:opacity-100">
//                         <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wide text-gray-400">
//                             {group.label}
//                         </p>
//                         <div className="space-y-1">
//                             {visibleItems.map((item) => (
//                                 <Link
//                                     key={item.href}
//                                     href={item.href}
//                                     onClick={closeMobileMenu}
//                                     className={subItemClass(isActive(item.href))}
//                                 >
//                                     {item.label}
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             );
//         }

//         return (
//             <div>
//                 <button
//                     type="button"
//                     onClick={() => toggleGroup(group.id)}
//                     className={`${navItemClass(active)} w-full justify-between`}
//                     aria-expanded={isOpen}
//                 >
//                     <span className="flex min-w-0 items-center gap-3">
//                         <span className={iconChipClass(active)}>
//                             <Icon className="h-4 w-4" />
//                         </span>
//                         <span className="truncate">{group.label}</span>
//                     </span>
//                     {isOpen ? (
//                         <ChevronDown className="h-4 w-4 shrink-0" />
//                     ) : (
//                         <ChevronRight className="h-4 w-4 shrink-0" />
//                     )}
//                 </button>

//                 {isOpen && (
//                     <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-100 pl-3">
//                         {visibleItems.map((item) => (
//                             <Link
//                                 key={item.href}
//                                 href={item.href}
//                                 onClick={closeMobileMenu}
//                                 className={subItemClass(isActive(item.href))}
//                             >
//                                 <span className="mr-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
//                                 <span className="truncate">{item.label}</span>
//                             </Link>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <>
//             {isMobileOpen && (
//                 <button
//                     type="button"
//                     className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
//                     aria-label="Close sidebar"
//                     onClick={onMobileToggle}
//                 />
//             )}

//             <aside
//                 className={[
//                     "fixed left-0 top-0 z-50 flex h-screen flex-col bg-gray-100  transition-all duration-300",
//                     isCollapsed ? "w-24" : "w-72",
//                     isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
//                 ].join(" ")}
//             >
//                 <div className="flex h-full flex-col  bg-white p-4 shadow-xl shadow-gray-200/60">
//                     {/* Logo + collapse toggle */}
//                     <div
//                         className={[
//                             "flex items-center pb-4",
//                             isCollapsed ? "justify-center" : "justify-between",
//                         ].join(" ")}
//                     >
//                         {!isCollapsed ? (
//                             <Link
//                                 href="/dashboard"
//                                 className="flex min-w-0 items-center gap-2"
//                                 onClick={closeMobileMenu}
//                             >
//                                 <img
//                                     src="/images/logo2.png"
//                                     alt="S.A I.T Solution"
//                                     className="h-9 w-auto max-w-[150px] object-contain"
//                                 />
//                             </Link>
//                         ) : (
//                             <Link href="/dashboard" onClick={closeMobileMenu}>
//                                 <img
//                                     src="/images/logo2.png"
//                                     alt="S.A I.T Solution"
//                                     className="h-8 w-8 object-contain"
//                                 />
//                             </Link>
//                         )}

//                         <button
//                             type="button"
//                             onClick={onToggleCollapse}
//                             className="hidden rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 lg:inline-flex"
//                             title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//                         >
//                             <Menu className="h-5 w-5" />
//                         </button>
//                     </div>

//                     {/* Nav */}
//                     <nav className="flex-1 space-y-1 overflow-y-auto">
//                         <NavLink
//                             href="/dashboard"
//                             label="Dashboard"
//                             icon={LayoutDashboard}
//                         />

//                         {groups.map((group) => (
//                             <NavGroup key={group.id} group={group} />
//                         ))}

//                         {quickLinks
//                             .filter((link) => link.show !== false)
//                             .map((link) => (
//                                 <NavLink key={link.href} {...link} />
//                             ))}
//                     </nav>

//                     {/* Profile card */}
//                     {/* <div
//                         className={[
//                             "mt-4 flex items-center gap-3 rounded-2xl bg-gray-50 p-3",
//                             isCollapsed ? "justify-center px-2" : "",
//                         ].join(" ")}
//                     >
//                         <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xs font-bold text-gray-600">
//                             {user?.image ? (
//                                 <img
//                                     src={`${imgurl}/${user.image}`}
//                                     alt={`${user?.name || "User"} profile`}
//                                     className="h-full w-full object-cover"
//                                 />
//                             ) : (
//                                 <UserCircle className="h-6 w-6" />
//                             )}
//                         </span>

//                         {!isCollapsed && (
//                             <div className="min-w-0">
//                                 <p className="truncate text-sm font-bold text-gray-900">
//                                     {user?.name || "Guest"}
//                                 </p>
//                                 <p className="truncate text-xs text-gray-400">
//                                     {user?.email || ""}
//                                 </p>
//                             </div>
//                         )}
//                     </div> */}
//                 </div>
//             </aside>
//         </>
//     );
// };

// export default AdminSideBar;
