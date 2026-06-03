import React, { useEffect, useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Activity,
    Building2,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Key,
    Landmark,
    LayoutDashboard,
    ListFilter,
    Menu,
    Receipt,
    ScrollText,
    UserCircle,
    UserCog,
    X,
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
    const currentUrl = url.split("?")[0];

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
                id: "report",
                label: "Report",
                icon: ClipboardList,
                show: true,
                items: [
                    { href: "/todo", label: "To Do List" },
                    {
                        href: "/ticket",
                        label: "Ticket Management",
                        show: can.adminOrTechnician,
                    },
                    {
                        href: "/project-management",
                        label: "Project Management",
                        show: can.adminOrDeveloper,
                    },
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
            label: "Finance Tracking",
            tooltip: "Payment & Finance Tracking",
            icon: Landmark,
            show: can.adminOrAccountant,
        },
        {
            href: "/client-details",
            label: "Client Details",
            icon: UserCircle,
            show: can.admin,
        },
        {
            href: "/payment-management",
            label: "Payment",
            icon: Receipt,
            show: can.admin,
        },
        {
            href: "/service-contracts",
            label: "Service Contracts",
            icon: ScrollText,
            show: can.admin,
        },
        {
            href: "/user-management",
            label: "User Management",
            icon: UserCog,
            show: can.admin,
        },
        {
            href: "/activity-log",
            label: "Activity Log",
            icon: Activity,
            show: can.admin,
        },
    ];

    useEffect(() => {
        const activeGroups = groups.reduce((next, group) => {
            const visibleItems = group.items.filter((item) => item.show !== false);
            if (isGroupActive(visibleItems)) {
                next[group.id] = true;
            }
            return next;
        }, {});

        if (Object.keys(activeGroups).length > 0) {
            setOpenGroups((current) => ({ ...current, ...activeGroups }));
        }
    }, [groups, url]);

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

    const navItemClass = (active) =>
        [
            "group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200",
            isCollapsed ? "justify-center" : "",
            active
                ? "border-l-4 border-blue-600 bg-blue-50 font-semibold text-blue-700"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700",
        ].join(" ");

    const subItemClass = (active) =>
        [
            "flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors duration-200",
            active
                ? "bg-blue-100 font-medium text-blue-700"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700",
        ].join(" ");

    const Tooltip = ({ children }) => (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 opacity-0 shadow-lg shadow-slate-200/70 transition group-hover:opacity-100">
            {children}
        </span>
    );

    const NavLink = ({ href, label, tooltip, icon: Icon }) => {
        const active = isActive(href);

        return (
            <Link
                href={href}
                onClick={closeMobileMenu}
                className={navItemClass(active)}
                title={isCollapsed ? label : undefined}
            >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{label}</span>}
                {/* {isCollapsed && <Tooltip>{tooltip || label}</Tooltip>} */}
            </Link>
        );
    };

    const NavGroup = ({ group }) => {
        const visibleItems = group.items.filter((item) => item.show !== false);
        const active = isGroupActive(visibleItems);
        const Icon = group.icon;
        const isOpen = Boolean(openGroups[group.id]);

        if (visibleItems.length === 0 || group.show === false) return null;

        if (isCollapsed) {
            return (
                <div className="group/flyout relative">
                    <button
                        type="button"
                        className={navItemClass(active)}
                        title={group.label}
                    >
                        <Icon className="h-5 w-5 shrink-0" />
                        {/* <Tooltip>{group.label}</Tooltip> */}
                    </button>
                    <div className="invisible fixed top-24 ml-12 z-50 min-w-56 rounded-lg border border-gray-200 bg-white p-2 opacity-0 shadow-lg transition group-hover/flyout:visible group-hover/flyout:opacity-100">
                        <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                            {group.label}
                        </p>
                        <div className="space-y-1">
                            {visibleItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                    className={subItemClass(isActive(item.href))}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className={`${navItemClass(active)} w-full justify-between`}
                    aria-expanded={isOpen}
                >
                    <span className="flex min-w-0 items-center gap-3">
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="truncate">{group.label}</span>
                    </span>
                    {isOpen ? (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                </button>

                {isOpen && (
                    <div className="ml-5 mt-1 space-y-0.5 border-l border-gray-200 pl-3">
                        {visibleItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className={subItemClass(isActive(item.href))}
                            >
                                <span className="mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        ))}
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
                    "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white shadow-xl shadow-slate-200/60 transition-all duration-300",
                    isCollapsed ? "w-16" : "w-64",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                ].join(" ")}
            >
                <div
                    className={[
                        "flex h-16 shrink-0 items-center border-b border-slate-200",
                        isCollapsed ? "justify-center" : "justify-between",
                        isCollapsed ? "px-3" : "px-4",
                    ].join(" ")}
                >
                    {!isCollapsed && (
                        <Link
                            href="/dashboard"
                            className="flex min-w-0 items-center gap-3"
                            onClick={closeMobileMenu}
                        >
                            <img
                                src="/images/logo2.png"
                                alt="S.A I.T Solution"
                                className="h-10 w-auto max-w-[170px] object-contain"
                            />
                        </Link>
                    )}

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:inline-flex"
                            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={onMobileToggle}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                            aria-label="Close sidebar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <nav
                    className={[
                        "flex-1 overflow-y-auto py-4",
                        isCollapsed ? "px-2" : "px-3",
                    ].join(" ")}
                >
                    <div className="space-y-1">
                        <NavLink
                            href="/dashboard"
                            label="Dashboard"
                            icon={LayoutDashboard}
                        />

                        {!isCollapsed && (
                            <p className="px-3 pb-1 pt-5 text-xs font-bold uppercase tracking-wide text-slate-400">
                                Pages
                            </p>
                        )}

                        {groups.map((group) => (
                            <NavGroup key={group.id} group={group} />
                        ))}

                        {quickLinks
                            .filter((link) => link.show !== false)
                            .map((link) => (
                                <NavLink key={link.href} {...link} />
                            ))}
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default AdminSideBar;
