// import React from "react";
// import { Link, usePage } from "@inertiajs/react";
// import {
//     X,
//     Menu,
//     ListFilter,
//     Building,
//     User2,
//     CheckSquare,
//     Users,
//     ClipboardList,
//     ListTodo,
// } from "lucide-react";

// const AdminSideBar = ({
//     isMobileOpen,
//     onMobileToggle,
//     isCollapsed,
//     onToggleCollapse,
// }) => {
//     const { url } = usePage();
//     const currentPath = url.split("/")[1];

//     const isActive = (href) => {
//         const path = href.replace("/", "");
//         return currentPath === path;
//     };

//     // Get authenticated user from auth prop
//     const { auth } = usePage().props;
//     const user = auth?.user;

//     // Check The Role of the User whether the role is admin
//     const isAdmin = user?.role === "admin";

//     // Check The Role of the User whether the role is user
//     const isUser = user?.role === "user";

//     return (
//         <>
//             {isMobileOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//                     onClick={onMobileToggle}
//                 />
//             )}

//             <div
//                 className={`
//                     fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300
//                     ${isCollapsed ? "w-16" : "w-64"}
//                     ${
//                         isMobileOpen
//                             ? "translate-x-0"
//                             : "-translate-x-full lg:translate-x-0"
//                     }
//                 `}
//             >
//                 {/* Header */}
//                 <div
//                     className={`flex items-center justify-between p-4 border-b h-16 ${
//                         isCollapsed ? "px-3" : ""
//                     }`}
//                 >
//                     {!isCollapsed && (
//                         <div className="text-lg font-bold text-gray-800 whitespace-nowrap">
//                             Sales System
//                         </div>
//                     )}
//                     <div className="flex items-center space-x-1">
//                         {/* Collapse Toggle Button - Only show on desktop */}
//                         <button
//                             onClick={onToggleCollapse}
//                             className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//                             title={
//                                 isCollapsed
//                                     ? "Expand sidebar"
//                                     : "Collapse sidebar"
//                             }
//                         >
//                             <Menu className="w-4 h-4 text-gray-600" />
//                         </button>

//                         {/* Mobile Close Button */}
//                         <button
//                             onClick={onMobileToggle}
//                             className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//                         >
//                             <X className="w-4 h-4" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Menu Items */}
//                 <div
//                     className={`p-2 space-y-1 ${isCollapsed ? "px-2" : "px-3"}`}
//                 >
//                     {/* //-----------------------------------------
//                         // CRM Link
//                         //----------------------------------------- */}
//                     <Link
//                         href="/"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${
//                                 isActive("/")
//                                     ? "bg-gray-200 text-gray-600 "
//                                     : "text-gray-600 hover:bg-gray-50"
//                             }
//                         `}
//                         title={isCollapsed ? "CRM" : ""}
//                     >
//                         <ListFilter
//                             className={`
//                             ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                             ${
//                                 isActive("/")
//                                     ? "text-gray-600"
//                                     : "text-gray-500 group-hover:text-gray-700"
//                             }
//                         `}
//                         />
//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 CRM
//                             </span>
//                         )}
//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 CRM
//                             </div>
//                         )}
//                     </Link>

//                     {/* //-----------------------------------------
//                         // Company Link
//                         //----------------------------------------- */}
//                     <Link
//                         href="/company"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${
//                                 isActive("/company")
//                                     ? "bg-gray-200 text-gray-600"
//                                     : "text-gray-600 hover:bg-gray-50"
//                             }
//                         `}
//                         title={isCollapsed ? "Company" : ""}
//                     >
//                         <Building
//                             className={`
//                             ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                             ${
//                                 isActive("/company")
//                                     ? "text-gray-600"
//                                     : "text-gray-500 group-hover:text-gray-700"
//                             }
//                         `}
//                         />
//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 Company
//                             </span>
//                         )}
//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 Company
//                             </div>
//                         )}
//                     </Link>

//                     {/* //-----------------------------------------
//                         // Tasks Link
//                         //----------------------------------------- */}
//                     <Link
//                         href="/tasks"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${
//                                 isActive("/tasks")
//                                     ? "bg-gray-200 text-gray-600"
//                                     : "text-gray-600 hover:bg-gray-50"
//                             }
//                         `}
//                         title={isCollapsed ? "Tasks" : ""}
//                     >
//                         <CheckSquare
//                             className={`
//                             ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                             ${
//                                 isActive("/tasks")
//                                     ? "text-gray-600"
//                                     : "text-gray-500 group-hover:text-gray-700"
//                             }
//                         `}
//                         />
//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 Tasks
//                             </span>
//                         )}
//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 Tasks
//                             </div>
//                         )}
//                     </Link>

//                     {/* //-----------------------------------------
//                         // To Do Page Link
//                         //----------------------------------------- */}
//                     <Link
//                         href="/todo"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${
//                                 isActive("/todo")
//                                     ? "bg-gray-200 text-gray-600"
//                                     : "text-gray-600 hover:bg-gray-50"
//                             }
//                         `}
//                         title={isCollapsed ? "To Do" : ""}
//                     >
//                         <ListTodo
//                             className={`
//                             ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                             ${
//                                 isActive("/todo")
//                                     ? "text-gray-600"
//                                     : "text-gray-500 group-hover:text-gray-700"
//                             }
//                         `}
//                         />
//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 To Do
//                             </span>
//                         )}
//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 To Do
//                             </div>
//                         )}
//                     </Link>

//                     {/* Admin Links */}
//                     {isAdmin && (
//                         <>
//                             {/* //-----------------------------------------
//                                 // User Management Link for Admin
//                                 //----------------------------------------- */}
//                             <Link
//                                 href="/user-management"
//                                 className={`
//                                 flex items-center rounded-lg transition-colors duration-200 group relative
//                                 ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                                 ${
//                                     isActive("/user-management")
//                                         ? "bg-gray-200 text-gray-600 "
//                                         : "text-gray-600 hover:bg-gray-50"
//                                 }
//                             `}
//                                 title={isCollapsed ? "User Management" : ""}
//                             >
//                                 <Users
//                                     className={`
//                                 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                                 ${
//                                     isActive("/user-management")
//                                         ? "text-gray-600"
//                                         : "text-gray-500 group-hover:text-gray-700"
//                                 }
//                             `}
//                                 />
//                                 {!isCollapsed && (
//                                     <span className="ml-3 font-medium whitespace-nowrap">
//                                         User Management
//                                     </span>
//                                 )}
//                                 {isCollapsed && (
//                                     <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                         User Management
//                                     </div>
//                                 )}
//                             </Link>

//                             {/* //-----------------------------------------
//                                 // Task Assignments Link for Admins
//                                 //----------------------------------------- */}
//                             <Link
//                                 href="/task-assignments"
//                                 className={`
//                                 flex items-center rounded-lg transition-colors duration-200 group relative
//                                 ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                                 ${
//                                     isActive("/task-assignments")
//                                         ? "bg-gray-200 text-gray-600 "
//                                         : "text-gray-600 hover:bg-gray-50"
//                                 }
//                             `}
//                                 title={isCollapsed ? "Task Assignments" : ""}
//                             >
//                                 <ClipboardList
//                                     className={`
//                                 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                                 ${
//                                     isActive("/task-assignments")
//                                         ? "text-gray-600"
//                                         : "text-gray500 group-hover:text-gray-700"
//                                 }
//                             `}
//                                 />
//                                 {!isCollapsed && (
//                                     <span className="ml-3 font-medium whitespace-nowrap">
//                                         Task Assignments
//                                     </span>
//                                 )}
//                                 {isCollapsed && (
//                                     <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                         Task Assignments
//                                     </div>
//                                 )}
//                             </Link>
//                         </>
//                     )}

//                     {/* //-----------------------------------------
//                         // Client Link for Both Admin and User
//                         //----------------------------------------- */}
//                     <Link
//                         href="/client"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${
//                                 isActive("/client")
//                                     ? "bg-gray-200 text-gray-600"
//                                     : "text-gray-600 hover:bg-gray-50"
//                             }
//                         `}
//                         title={isCollapsed ? "Client" : ""}
//                     >
//                         <CheckSquare
//                             className={`
//                             ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                             ${
//                                 isActive("/client")
//                                     ? "text-gray-600"
//                                     : "text-gray-500 group-hover:text-gray-700"
//                             }
//                         `}
//                         />
//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 Client
//                             </span>
//                         )}
//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 Client
//                             </div>
//                         )}
//                     </Link>

//                     {/* //-----------------------------------------
//                         // Expiration Link for Both Admin and User
//                         //----------------------------------------- */}
//                     <Link
//                         href="/expiration"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${
//                                 isActive("/expiration")
//                                     ? "bg-gray-200 text-gray-600"
//                                     : "text-gray-600 hover:bg-gray-50"
//                             }
//                         `}
//                         title={isCollapsed ? "Expiration" : ""}
//                     >
//                         <CheckSquare
//                             className={`
//                             ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                             ${
//                                 isActive("/expiration")
//                                     ? "text-gray-600"
//                                     : "text-gray-500 group-hover:text-gray-700"
//                             }
//                         `}
//                         />
//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 Expiration
//                             </span>
//                         )}
//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 Expiration
//                             </div>
//                         )}
//                     </Link>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AdminSideBar;


import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    FiMenu,
    FiX,
    FiChevronDown,
    FiChevronRight,
    FiUsers,
    FiUser,
    FiCreditCard,
    FiBookOpen,
    FiList,
    FiCheckSquare,
    FiClipboard,
    FiHome,
} from "react-icons/fi";
import {
    Building,
    LayoutDashboard,
    ListFilter,
    CheckSquare,
    Users,
    ClipboardList,
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

    // Dropdown states
    const [isLeadManagementOpen, setIsLeadManagementOpen] = useState(false);
    const [isTaskManagementOpen, setIsTaskManagementOpen] = useState(false);
    const [isClientManagementOpen, setIsClientManagementOpen] = useState(false);

    // Hover states for collapsed dropdowns
    const [isLeadHovered, setIsLeadHovered] = useState(false);
    const [isTaskHovered, setIsTaskHovered] = useState(false);
    const [isClientHovered, setIsClientHovered] = useState(false);

    // Get authenticated user from auth prop
    const { auth } = usePage().props;
    const user = auth?.user;

    // Check The Role of the User
    const isAdmin = user?.role === "admin";
    const isUser = user?.role === "user";
    const isAdminOrTechnician = user?.role === "admin" || user?.role === "technician";
    const isAdminOrDeveloper = user?.role === "admin" || user?.role === "developer";
    const isAdminOrAccountant = user?.role === "admin" || user?.role === "accountant";
    const isAdminOrManager = user?.role === "admin" || user?.role === "manager";

    console.log("Current User Role:", user?.role);

    const isActive = (href) => {
        const path = href.replace("/", "");
        return currentPath === path || url.startsWith(href + "/");
    };

    // Check if any route in a group is active
    const isGroupActive = (routes) => {
        return routes.some((route) => {
            const routePath = route.replace("/", "");
            return currentPath === routePath || url.startsWith(route + "/");
        });
    };

    // Toggle functions for expanded view
    const toggleLeadManagement = () => {
        if (!isCollapsed) {
            setIsLeadManagementOpen(!isLeadManagementOpen);
        }
    };

    const toggleTaskManagement = () => {
        if (!isCollapsed) {
            setIsTaskManagementOpen(!isTaskManagementOpen);
        }
    };

    const toggleClientManagement = () => {
        if (!isCollapsed) {
            setIsClientManagementOpen(!isClientManagementOpen);
        }
    };

    // Hover handlers for collapsed view
    const handleLeadMouseEnter = () => setIsLeadHovered(true);
    const handleLeadMouseLeave = () => setIsLeadHovered(false);
    const handleTaskMouseEnter = () => setIsTaskHovered(true);
    const handleTaskMouseLeave = () => setIsTaskHovered(false);
    const handleClientMouseEnter = () => setIsClientHovered(true);
    const handleClientMouseLeave = () => setIsClientHovered(false);

    // Common link styles
    const linkBaseClasses =
        "flex items-center rounded-lg transition-colors duration-200 group relative";
    const linkCollapsedClasses = isCollapsed ? "p-3 justify-center" : "p-3";
    const linkActiveClasses = (href) =>
        isActive(href)
            ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700";

    const dropdownButtonClasses = (isActive) => `
        flex items-center justify-between w-full p-3 rounded-lg transition-colors duration-200
        ${isActive ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
    `;

    // Icon style function
    const iconClasses = (isItemActive, customClass = "w-5 h-5") => `
        ${isCollapsed ? customClass : customClass}
        ${isItemActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}
    `;

    // Tooltip for collapsed state
    const Tooltip = ({ children }) => (
        <div
            className="fixed left-12 ml-6 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
            style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                color: "#374151",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
        >
            {children}
        </div>
    );

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
                    fixed left-0 top-0 h-screen border-r z-50 transition-all duration-300
                    ${isCollapsed ? "w-16" : "w-64"}
                    ${
                        isMobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }
                `}
                style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                }}
            >
                {/* Content Container */}
                <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div
                        className={`flex items-center justify-between p-4 border-b h-16 ${
                            isCollapsed ? "px-3" : ""
                        }`}
                        style={{ borderColor: "#e5e7eb" }}
                    >
                        {!isCollapsed && (
                            <Link
                                href="/dashboard"
                                className="text-xl font-bold text-gray-800 whitespace-nowrap"
                            >
                                <img
                                    src="/images/logo2.png"
                                    alt="Logo"
                                    className="h-10 w-auto"
                                />
                            </Link>
                        )}
                        <div className="flex items-center space-x-1">
                            {/* Collapse Toggle Button - Only show on desktop */}
                            <button
                                onClick={onToggleCollapse}
                                className="hidden lg:flex p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title={
                                    isCollapsed
                                        ? "Expand sidebar"
                                        : "Collapse sidebar"
                                }
                            >
                                <FiMenu className="w-4 h-4 text-gray-600" />
                            </button>

                            {/* Mobile Close Button */}
                            <button
                                onClick={onMobileToggle}
                                className="lg:hidden p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                                <FiX className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div
                        className={`flex-1 overflow-y-auto ${isCollapsed ? "px-2" : "px-3"} py-2`}
                    >
                        <div className="space-y-1">
                            {/* Dashboard Link */}
                            <Link
                                href="/dashboard"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/dashboard")}
                                `}
                            >
                                <LayoutDashboard
                                    className={iconClasses(
                                        isActive("/dashboard"),
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Dashboard
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Dashboard</Tooltip>}
                            </Link>

                            {/* Section Header */}
                            {!isCollapsed && (
                                <div className="pt-4 px-3">
                                    <h1 className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                                        Pages
                                    </h1>
                                </div>
                            )}

                            {/* Company Management Dropdown (formerly CRM & Company) */}
                            {/* {!isCollapsed ? (
                                // Expanded view
                                <div className="space-y-1">
                                    <button
                                        onClick={toggleLeadManagement}
                                        className={dropdownButtonClasses(
                                            isGroupActive(["/crm", "/company"]),
                                        )}
                                    >
                                        <div className="flex items-center">
                                            <ListFilter
                                                className={iconClasses(
                                                    isGroupActive([
                                                        "/crm",
                                                        "/company",
                                                    ]),
                                                )}
                                            />
                                            <span className="ml-3 font-medium whitespace-nowrap">
                                                CRM
                                            </span>
                                        </div>
                                        {isLeadManagementOpen ? (
                                            <FiChevronDown className="w-4 h-4 transition-transform duration-200" />
                                        ) : (
                                            <FiChevronRight className="w-4 h-4 transition-transform duration-200" />
                                        )}
                                    </button>

                                   
                                    {isLeadManagementOpen && (
                                        <div className="ml-9 space-y-0.5">
                                            
                                            <Link
                                                href="/crm"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/crm") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    CRM
                                                </span>
                                            </Link>

                                            
                                            <Link
                                                href="/company"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/company") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    Companies
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Collapsed view with hover dropdown
                                <div
                                    className="relative"
                                    onMouseEnter={handleLeadMouseEnter}
                                    onMouseLeave={handleLeadMouseLeave}
                                >
                                    <button
                                        onClick={() => {
                                            if (isCollapsed) {
                                                setIsLeadHovered(
                                                    !isLeadHovered,
                                                );
                                            }
                                        }}
                                        className={`
                                            flex items-center justify-center w-full p-3 rounded-lg transition-colors duration-200 group
                                            ${isGroupActive(["/crm", "/company"]) ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                        `}
                                    >
                                        <ListFilter
                                            className={iconClasses(
                                                isGroupActive([
                                                    "/crm",
                                                    "/company",
                                                ]),
                                            )}
                                        />
                                      
                                    </button>

                                    {isLeadHovered && (
                                        <div
                                            className="fixed left-10 top-28 ml-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1"
                                            onMouseEnter={handleLeadMouseEnter}
                                            onMouseLeave={handleLeadMouseLeave}
                                        >
                                            <Link
                                                href="/crm"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/crm") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <span className="whitespace-nowrap">
                                                    CRM
                                                </span>
                                            </Link>
                                            <Link
                                                href="/company"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/company") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <span className="whitespace-nowrap">
                                                    Companies
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )} */}

                            {!isCollapsed ? (
                                // Expanded view
                                <div className="space-y-1">
                                    {isAdminOrAccountant && (
                                        <button
                                            onClick={toggleLeadManagement}
                                            className={dropdownButtonClasses(
                                                isGroupActive([
                                                    "/leads",
                                                    "/client-management",
                                                ]),
                                            )}
                                        >
                                            <div className="flex items-center">
                                                <ListFilter
                                                    className={iconClasses(
                                                        isGroupActive([
                                                            "/leads",
                                                            "/client-management",
                                                        ]),
                                                    )}
                                                />
                                                <span className="ml-3 font-medium whitespace-nowrap">
                                                    CRM
                                                </span>
                                            </div>
                                            {isLeadManagementOpen ? (
                                                <FiChevronDown className="w-4 h-4 transition-transform duration-200" />
                                            ) : (
                                                <FiChevronRight className="w-4 h-4 transition-transform duration-200" />
                                            )}
                                        </button>
                                    )}

                                    {isLeadManagementOpen && (
                                        <div className="ml-9 space-y-0.5">
                                            <Link
                                                href="/leads"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/leads") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    Leads
                                                </span>
                                            </Link>

                                            <Link
                                                href="/client-management"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/client-management") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    Client Management
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Collapsed view with hover dropdown
                                <div
                                    className="relative"
                                    onMouseEnter={handleLeadMouseEnter}
                                    onMouseLeave={handleLeadMouseLeave}
                                >
                                    <button
                                        onClick={() => {
                                            if (isCollapsed) {
                                                setIsLeadHovered(
                                                    !isLeadHovered,
                                                );
                                            }
                                        }}
                                        className={`
                                            flex items-center justify-center w-full p-3 rounded-lg transition-colors duration-200 group
                                            ${isGroupActive(["/leads", "/client-management"]) ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                        `}
                                    >
                                        <ListFilter
                                            className={iconClasses(
                                                isGroupActive([
                                                    "/leads",
                                                    "/client-management",
                                                ]),
                                            )}
                                        />
                                    </button>

                                    {isLeadHovered && (
                                        <div
                                            className="fixed left-10 top-28 ml-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1"
                                            onMouseEnter={handleLeadMouseEnter}
                                            onMouseLeave={handleLeadMouseLeave}
                                        >
                                            <Link
                                                href="/leads"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/leads") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <span className="whitespace-nowrap">
                                                    Leads
                                                </span>
                                            </Link>
                                            <Link
                                                href="/client-management"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/client-management") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <span className="whitespace-nowrap">
                                                    Client Management
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Report Dropdown (formerly Tasks & Todo) */}
                            {!isCollapsed ? (
                                // Expanded view
                                <div className="space-y-1">
                                    <button
                                        onClick={toggleTaskManagement}
                                        className={dropdownButtonClasses(
                                            isGroupActive([
                                                "/ticket",
                                                "/todo",
                                                "/project-management",
                                            ]),
                                        )}
                                    >
                                        <div className="flex items-center">
                                            <FiBookOpen
                                                className={iconClasses(
                                                    isGroupActive([
                                                        "/ticket",
                                                        "/todo",
                                                        "/project-management",
                                                    ]),
                                                )}
                                            />
                                            <span className="ml-3 font-medium whitespace-nowrap">
                                                Report
                                            </span>
                                        </div>
                                        {isTaskManagementOpen ? (
                                            <FiChevronDown className="w-4 h-4 transition-transform duration-200" />
                                        ) : (
                                            <FiChevronRight className="w-4 h-4 transition-transform duration-200" />
                                        )}
                                    </button>

                                    {/* Dropdown Content */}
                                    {isTaskManagementOpen && (
                                        <div className="ml-9 space-y-0.5">
                                            {/* Tasks Link */}
                                            {/* <Link
                                                href="/tasks"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/tasks") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    Task Management
                                                </span>
                                            </Link> */}

                                            {/* Todo Link */}
                                            <Link
                                                href="/todo"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/todo") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    To Do List
                                                </span>
                                            </Link>

                                            {isAdminOrTechnician && (
                                                <Link
                                                    href="/ticket"
                                                    className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/ticket") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                    <span className="text-sm whitespace-nowrap">
                                                        Ticket Management
                                                    </span>
                                                </Link>
                                            )}

                                            {isAdminOrDeveloper && (
                                                <Link
                                                    href="/project-management"
                                                    className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/project-management") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                    <span className="text-sm whitespace-nowrap">
                                                        Project Management
                                                    </span>
                                                </Link>
                                            )}

                                            {/* Task Assignments Link - Only for Admin */}
                                            {/* {isAdmin && (
                                                <Link
                                                    href="/task-assignments"
                                                    className={`
                                                        flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                        ${isActive("/task-assignments") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                    `}
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                    <span className="text-sm whitespace-nowrap">
                                                        Task Assignments
                                                    </span>
                                                </Link>
                                            )} */}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Collapsed view with hover dropdown
                                <div
                                    className="relative"
                                    onMouseEnter={handleTaskMouseEnter}
                                    onMouseLeave={handleTaskMouseLeave}
                                >
                                    <button
                                        onClick={() => {
                                            if (isCollapsed) {
                                                setIsTaskHovered(
                                                    !isTaskHovered,
                                                );
                                            }
                                        }}
                                        className={`
                                            flex items-center justify-center w-full p-3 rounded-lg transition-colors duration-200 group
                                            ${isGroupActive(["/ticket", "/todo", "/project-management"]) ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                        `}
                                    >
                                        <FiBookOpen
                                            className={iconClasses(
                                                isGroupActive([
                                                    "/ticket",
                                                    "/todo",
                                                    "/project-management",
                                                ]),
                                            )}
                                        />
                                        {/* <Tooltip>Report</Tooltip> */}
                                    </button>

                                    {/* Collapsed dropdown - appears on hover */}
                                    {isTaskHovered && (
                                        <div
                                            className="fixed left-10 top-44 ml-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px] py-1"
                                            onMouseEnter={handleTaskMouseEnter}
                                            onMouseLeave={handleTaskMouseLeave}
                                        >
                                            {/* <Link
                                                href="/tasks"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/tasks") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <span className="whitespace-nowrap">
                                                    Task Management
                                                </span>
                                            </Link> */}
                                            <Link
                                                href="/todo"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/todo") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <span className="whitespace-nowrap">
                                                    To Do List
                                                </span>
                                            </Link>

                                            {isAdminOrTechnician && (
                                                <Link
                                                    href="/ticket"
                                                    className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/ticket") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                                >
                                                    <span className="whitespace-nowrap">
                                                        Ticket
                                                    </span>
                                                </Link>
                                            )}

                                            {isAdminOrDeveloper && (
                                                <Link
                                                    href="/project-management"
                                                    className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/project-management") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                                >
                                                    <span className="whitespace-nowrap">
                                                        Project Management
                                                    </span>
                                                </Link>
                                            )}
                                            {/* {isAdmin && (
                                                <Link
                                                    href="/task-assignments"
                                                    className={`
                                                        flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                        ${isActive("/task-assignments") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                    `}
                                                >
                                                    <span className="whitespace-nowrap">
                                                        Task Assignments
                                                    </span>
                                                </Link>
                                            )} */}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Company Dropdown (formerly Client & Expiration) */}
                            {!isCollapsed ? (
                                // Expanded view
                                <div className="space-y-1">
                                    {isAdminOrManager && (
                                        <button
                                            onClick={toggleClientManagement}
                                            className={dropdownButtonClasses(
                                                isGroupActive([
                                                    "/client",
                                                    "/expiration",
                                                    "/hosting-tracking",
                                                    "/domain-tracking",
                                                ]),
                                            )}
                                        >
                                            <div className="flex items-center">
                                                <FiCheckSquare
                                                    className={iconClasses(
                                                        isGroupActive([
                                                            "/client",
                                                            "/expiration",
                                                        ]),
                                                    )}
                                                />
                                                <span className="ml-3 font-medium whitespace-nowrap">
                                                    Company
                                                </span>
                                            </div>

                                            {isClientManagementOpen ? (
                                                <FiChevronDown className="w-4 h-4 transition-transform duration-200" />
                                            ) : (
                                                <FiChevronRight className="w-4 h-4 transition-transform duration-200" />
                                            )}
                                        </button>
                                    )}

                                    {/* Dropdown Content */}
                                    {isClientManagementOpen && (
                                        <div className="ml-9 space-y-0.5">
                                            {/* Client Link */}
                                            <Link
                                                href="/client"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/client") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    Clients
                                                </span>
                                            </Link>

                                            {/* Expiration Link */}
                                            <Link
                                                href="/expiration"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/expiration") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    Expirations
                                                </span>
                                            </Link>

                                            <Link
                                                href="/hosting-tracking"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/hosting-tracking") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    Hosting Management
                                                </span>
                                            </Link>
                                            <Link
                                                href="/domain-tracking"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/domain-tracking") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    Domain Management
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Collapsed view with hover dropdown
                                <div
                                    className="relative"
                                    onMouseEnter={handleClientMouseEnter}
                                    onMouseLeave={handleClientMouseLeave}
                                >
                                    <button
                                        onClick={() => {
                                            if (isCollapsed) {
                                                setIsClientHovered(
                                                    !isClientHovered,
                                                );
                                            }
                                        }}
                                        className={`
                                            flex items-center justify-center w-full p-3 rounded-lg transition-colors duration-200 group
                                            ${isGroupActive(["/client", "/expiration", "/hosting-tracking", "/domain-tracking"]) ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                        `}
                                    >
                                        <FiCheckSquare
                                            className={iconClasses(
                                                isGroupActive([
                                                    "/client",
                                                    "/expiration",
                                                    "/hosting-tracking",
                                                    "/domain-tracking",
                                                ]),
                                            )}
                                        />
                                        {/* <Tooltip>Company</Tooltip> */}
                                    </button>

                                    {/* Collapsed dropdown - appears on hover */}
                                    {isClientHovered && (
                                        <div
                                            className="fixed left-10 top-64 ml-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1"
                                            onMouseEnter={
                                                handleClientMouseEnter
                                            }
                                            onMouseLeave={
                                                handleClientMouseLeave
                                            }
                                        >
                                            <Link
                                                href="/client"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/client") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <span className="whitespace-nowrap">
                                                    Clients
                                                </span>
                                            </Link>
                                            <Link
                                                href="/expiration"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/expiration") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <span className="whitespace-nowrap">
                                                    Expirations
                                                </span>
                                            </Link>
                                            <Link
                                                href="/hosting-tracking"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/hosting-tracking") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <span className="whitespace-nowrap">
                                                    Hosting Management
                                                </span>
                                            </Link>
                                            <Link
                                                href="/domain-tracking"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/domain-tracking") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <span className="whitespace-nowrap">
                                                    Domain Management
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* <Link
                                href="/client-management"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/client-management")}
                                `}
                            >
                                <LayoutDashboard
                                    className={iconClasses(
                                        isActive("/client-management"),
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Client Management
                                    </span>
                                )}
                                {isCollapsed && (
                                    <Tooltip>Client Management</Tooltip>
                                )}
                            </Link> */}

                            {/* <Link
                                href="/leads"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/leads")}
                                `}
                            >
                                <LayoutDashboard
                                    className={iconClasses(isActive("/leads"))}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Leads
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Leads</Tooltip>}
                            </Link> */}

                            {isAdminOrAccountant && (
                                <Link
                                    href="/payment-finance-tracking"
                                    className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/payment-finance-tracking")}
                                `}
                                >
                                    <LayoutDashboard
                                        className={iconClasses(
                                            isActive(
                                                "/payment-finance-tracking",
                                            ),
                                        )}
                                    />
                                    {!isCollapsed && (
                                        <span className="ml-3 font-medium whitespace-nowrap">
                                            Finance Tracking
                                        </span>
                                    )}
                                    {isCollapsed && (
                                        <Tooltip>
                                            Payment & Finance Tracking
                                        </Tooltip>
                                    )}
                                </Link>
                            )}

                            {/* <Link
                                href="/ticket"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/ticket")}
                                `}
                            >
                                <LayoutDashboard
                                    className={iconClasses(isActive("/ticket"))}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Ticket
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Ticket</Tooltip>}
                            </Link> */}

                            {/* <Link
                                href="/project-management"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/project-management")}
                                `}
                            >
                                <LayoutDashboard
                                    className={iconClasses(
                                        isActive("/project-management"),
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Project Management
                                    </span>
                                )}
                                {isCollapsed && (
                                    <Tooltip>Project Management</Tooltip>
                                )}
                            </Link> */}

                            {/* <Link
                                href="/contract-renewal-management"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/contract-renewal-management")}
                                `}
                            >
                                <LayoutDashboard
                                    className={iconClasses(
                                        isActive(
                                            "/contract-renewal-management",
                                        ),
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Renewal Management
                                    </span>
                                )}
                                {isCollapsed && (
                                    <Tooltip>
                                        Contract Renewal Management
                                    </Tooltip>
                                )}
                            </Link> */}

                            {/* Admin Links */}
                            {isAdmin && (
                                <>
                                    <Link
                                        href="/client-details"
                                        className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/client-details")}
                                `}
                                    >
                                        <LayoutDashboard
                                            className={iconClasses(
                                                isActive("/client-details"),
                                            )}
                                        />
                                        {!isCollapsed && (
                                            <span className="ml-3 font-medium whitespace-nowrap">
                                                Client Details
                                            </span>
                                        )}
                                        {isCollapsed && (
                                            <Tooltip>Client Details</Tooltip>
                                        )}
                                    </Link>

                                    {/* User Management Link */}
                                    <Link
                                        href="/payment-management"
                                        className={`
                                            ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/payment-management")}
                                        `}
                                    >
                                        <FiUsers
                                            className={iconClasses(
                                                isActive("/payment-management"),
                                            )}
                                        />
                                        {!isCollapsed && (
                                            <span className="ml-3 font-medium whitespace-nowrap">
                                                Payment
                                            </span>
                                        )}
                                        {isCollapsed && (
                                            <Tooltip>Payment </Tooltip>
                                        )}
                                    </Link>

                                    {/* User Management Link */}
                                    <Link
                                        href="/service-contracts"
                                        className={`
                                            ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/service-contracts")}
                                        `}
                                    >
                                        <FiUsers
                                            className={iconClasses(
                                                isActive("/service-contracts"),
                                            )}
                                        />
                                        {!isCollapsed && (
                                            <span className="ml-3 font-medium whitespace-nowrap">
                                                Service Contracts
                                            </span>
                                        )}
                                        {isCollapsed && (
                                            <Tooltip>Service Contracts</Tooltip>
                                        )}
                                    </Link>
                                    {/* User Management Link */}
                                    <Link
                                        href="/user-management"
                                        className={`
                                            ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/user-management")}
                                        `}
                                    >
                                        <FiUsers
                                            className={iconClasses(
                                                isActive("/user-management"),
                                            )}
                                        />
                                        {!isCollapsed && (
                                            <span className="ml-3 font-medium whitespace-nowrap">
                                                User Management
                                            </span>
                                        )}
                                        {isCollapsed && (
                                            <Tooltip>User Management</Tooltip>
                                        )}
                                    </Link>

                                    <Link
                                        href="/activity-log"
                                        className={`
                                            ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/activity-log")}
                                        `}
                                    >
                                        <FiUsers
                                            className={iconClasses(
                                                isActive("/activity-log"),
                                            )}
                                        />
                                        {!isCollapsed && (
                                            <span className="ml-3 font-medium whitespace-nowrap">
                                                Activity Log
                                            </span>
                                        )}
                                        {isCollapsed && (
                                            <Tooltip>Activity Log</Tooltip>
                                        )}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSideBar;
