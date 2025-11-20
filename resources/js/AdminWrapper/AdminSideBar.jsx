import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Settings, X, Menu, ListFilter, Users } from "lucide-react";

const AdminSideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url } = usePage();
    const currentPath = url.split("/")[1] || "crm";

    const isActive = (href) => {
        const path = href.replace("/", "");
        return currentPath === path;
    };

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            <div
                className={`
                    fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300
                    ${isCollapsed ? "w-16" : "w-64"}
                    ${
                        isMobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }
                `}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between p-4 border-b h-16 ${
                        isCollapsed ? "px-3" : ""
                    }`}
                >
                    {!isCollapsed && (
                        <div className="text-lg font-bold text-gray-800 whitespace-nowrap">
                            Sales System
                        </div>
                    )}
                    <div className="flex items-center space-x-1">
                        {/* Collapse Toggle Button - Only show on desktop */}
                        <button
                            onClick={onToggleCollapse}
                            className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            title={
                                isCollapsed
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                        >
                            {isCollapsed ? (
                                <Menu className="w-4 h-4 text-gray-600" />
                            ) : (
                                <Menu className="w-4 h-4 text-gray-600" />
                            )}
                        </button>

                        {/* Mobile Close Button */}
                        <button
                            onClick={onMobileToggle}
                            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Menu Items */}
                <div
                    className={`p-2 space-y-1 ${isCollapsed ? "px-2" : "px-3"}`}
                >
                    {/* CRM */}
                    <Link
                        href="/crm"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/crm")
                                    ? "bg-gray-200 text-gray-600 "
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "CRM" : ""}
                    >
                        <ListFilter
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/crm")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                CRM
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                CRM
                            </div>
                        )}
                    </Link>

                    {/* Users */}
                    {/* <Link
                        href="/users"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/users")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Users" : ""}
                    >
                        <Users
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/users")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Users
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Users
                            </div>
                        )}
                    </Link> */}

                    {/* Settings */}
                    {/* <Link
                        href="/settings"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/settings")
                                    ? "bg-gray-200 text-gray-600 "
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Settings" : ""}
                    >
                        <Settings
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/settings")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Settings
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Settings
                            </div>
                        )}
                    </Link> */}
                </div>
            </div>
        </>
    );
};

export default AdminSideBar;
