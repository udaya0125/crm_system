import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    X,
    Menu,
    ListFilter,
    Building,
    User2,
    CheckSquare, // For Tasks
    Users, // For User Management
    ClipboardList, // For Task Assignments
    ListTodo,
} from "lucide-react";

const AdminSideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url } = usePage();
    const currentPath = url.split("/")[1];

    const isActive = (href) => {
        const path = href.replace("/", "");
        return currentPath === path;
    };

    // Get authenticated user from auth prop
    const { auth } = usePage().props;
    const user = auth?.user;

    // Check The Role of the User
    const isAdmin = user?.role === "admin";

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
                            <Menu className="w-4 h-4 text-gray-600" />
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
                    {/* //-----------------------------------------
                        // CRM Link
                        //----------------------------------------- */}
                    <Link
                        href="/"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/")
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
                                isActive("/")
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

                    {/* //-----------------------------------------
                        // Company Link
                        //----------------------------------------- */}
                    <Link
                        href="/company"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/company")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Company" : ""}
                    >
                        <Building
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/company")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Company
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Company
                            </div>
                        )}
                    </Link>

                    {/* //-----------------------------------------
                        // Tasks Link
                        //----------------------------------------- */}
                    <Link
                        href="/tasks"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/tasks")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Tasks" : ""}
                    >
                        <CheckSquare
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/tasks")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Tasks
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Tasks
                            </div>
                        )}
                    </Link>

                    {/* //-----------------------------------------
                        // To Do Page Link
                        //----------------------------------------- */}
                    <Link
                        href="/todo"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/todo")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "To Do" : ""}
                    >
                        <ListTodo
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/todo")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                To Do
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                To Do
                            </div>
                        )}
                    </Link>

                    {/* Admin Links */}
                    {isAdmin && (
                        <>
                            {/* //-----------------------------------------
                                // User Management Link for Admin
                                //----------------------------------------- */}
                            <Link
                                href="/user-management"
                                className={`
                                flex items-center rounded-lg transition-colors duration-200 group relative
                                ${isCollapsed ? "p-3 justify-center" : "p-3"}
                                ${
                                    isActive("/user-management")
                                        ? "bg-gray-200 text-gray-600 "
                                        : "text-gray-600 hover:bg-gray-50"
                                }
                            `}
                                title={isCollapsed ? "User Management" : ""}
                            >
                                <Users
                                    className={`
                                ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                                ${
                                    isActive("/user-management")
                                        ? "text-gray-600"
                                        : "text-gray-500 group-hover:text-gray-700"
                                }
                            `}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        User Management
                                    </span>
                                )}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                        User Management
                                    </div>
                                )}
                            </Link>

                            {/* //-----------------------------------------
                                // Task Assignments Link for Admins
                                //----------------------------------------- */}
                            <Link
                                href="/task-assignments"
                                className={`
                                flex items-center rounded-lg transition-colors duration-200 group relative
                                ${isCollapsed ? "p-3 justify-center" : "p-3"}
                                ${
                                    isActive("/task-assignments")
                                        ? "bg-gray-200 text-gray-600 "
                                        : "text-gray-600 hover:bg-gray-50"
                                }
                            `}
                                title={isCollapsed ? "Task Assignments" : ""}
                            >
                                <ClipboardList
                                    className={`
                                ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                                ${
                                    isActive("/task-assignments")
                                        ? "text-gray-600"
                                        : "text-gray500 group-hover:text-gray-700"
                                }
                            `}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Task Assignments
                                    </span>
                                )}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                        Task Assignments
                                    </div>
                                )}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminSideBar;
