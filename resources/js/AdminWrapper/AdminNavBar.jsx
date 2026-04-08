import React, { useState, useRef, useEffect } from "react";
import {
    Menu,
    UserCircle,
    Settings,
    LogOut,
    ChevronDown,
    Bell,
    Check,
    X,
} from "lucide-react";
import { Link, usePage, router } from "@inertiajs/react";
import axios from "axios";

const AdminNavBar = ({ onMenuToggle }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const userMenuRef = useRef(null);
    const notificationRef = useRef(null);
    const { auth } = usePage().props;
    const user = auth?.user;

    // Check The Role of the User whether the role is admin
    const isAdmin = user?.role === "admin";

    // Check The Role of the User whether the role is user
    const isUser = user?.role === "user";

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route("notifications.index"));
            setNotifications(response.data);
            setUnreadCount(response.data.filter((n) => !n.is_read).length);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Optional: Set up polling for new notifications (every 30 seconds)
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    const toggleUserMenu = () => {
        setIsUserMenuOpen((prev) => !prev);
        if (isNotificationOpen) setIsNotificationOpen(false);
    };

    const toggleNotification = () => {
        setIsNotificationOpen((prev) => !prev);
        if (isUserMenuOpen) setIsUserMenuOpen(false);

        // Fetch fresh notifications when opening the dropdown
        if (!isNotificationOpen) {
            fetchNotifications();
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(route("logout"));
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/login";
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.patch(
                route("notifications.markAsRead", notificationId),
            );

            // Update local state
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === notificationId
                        ? { ...notif, is_read: true }
                        : notif,
                ),
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch(route("notifications.markAllAsRead"));

            // Update local state
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, is_read: true })),
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(route("notifications.destroy", notificationId));

            // Update local state
            const notification = notifications.find(
                (n) => n.id === notificationId,
            );
            setNotifications((prev) =>
                prev.filter((notif) => notif.id !== notificationId),
            );
            if (notification && !notification.is_read) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const clearAllNotifications = async () => {
        try {
            await axios.delete(route("notifications.clearAll"));

            // Update local state
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error("Error clearing all notifications:", error);
        }
    };

    // Close menus when clicking outside or pressing Escape key
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target) &&
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setIsUserMenuOpen(false);
                setIsNotificationOpen(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                setIsUserMenuOpen(false);
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, []);

    // Close menus when route changes
    useEffect(() => {
        setIsUserMenuOpen(false);
        setIsNotificationOpen(false);
    }, [window.location.pathname]);

    // Format time relative to now
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
        } else if (diffInHours > 0) {
            return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
        } else {
            return "Just now";
        }
    };

    return (
        <nav className="fixed top-0 right-0 w-full lg:w-[98%] h-16 bg-white border-b border-gray-200 z-30">
            <div className="h-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-full">
                    {/* Left side - Menu toggle and branding */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onMenuToggle}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Right side - Notifications and User menu */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={toggleNotification}
                                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                aria-label="Toggle notifications"
                            >
                                <Bell className="w-5 h-5 text-gray-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications dropdown */}
                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Notifications
                                        </h3>
                                        {isAdmin && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    {notifications.length >
                                                        0 && (
                                                        <>
                                                            {unreadCount >
                                                                0 && (
                                                                <button
                                                                    onClick={
                                                                        markAllAsRead
                                                                    }
                                                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50"
                                                                >
                                                                    Mark all
                                                                    read
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={
                                                                    clearAllNotifications
                                                                }
                                                                className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50"
                                                            >
                                                                Clear all
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        {loading ? (
                                            <div className="px-4 py-8 text-center text-gray-500">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                                <p className="text-sm mt-2">
                                                    Loading notifications...
                                                </p>
                                            </div>
                                        ) : notifications.length > 0 ? (
                                            notifications.map(
                                                (notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                                                            !notification.is_read
                                                                ? "bg-blue-50"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <p className="text-sm text-gray-900">
                                                                            {
                                                                                notification.message
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-gray-400 mt-1">
                                                                            {formatTime(
                                                                                notification.created_at,
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    {/* <div className="flex items-center space-x-1 ml-2">
                                                                        {!notification.is_read && (
                                                                            <button
                                                                                onClick={() =>
                                                                                    markAsRead(
                                                                                        notification.id,
                                                                                    )
                                                                                }
                                                                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                                                                                title="Mark as read"
                                                                            >
                                                                                <Check className="w-3 h-3" />
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={() =>
                                                                                deleteNotification(
                                                                                    notification.id,
                                                                                )
                                                                            }
                                                                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                                            title="Delete notification"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <div className="px-4 py-8 text-center text-gray-500">
                                                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p className="text-sm">
                                                    No notifications
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={toggleUserMenu}
                                className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                aria-expanded={isUserMenuOpen}
                                aria-haspopup="true"
                            >
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                                        {user?.image ? (
                                            <img
                                                src={user.image}
                                                alt={`${
                                                    user?.name || "User"
                                                } profile`}
                                                className="w-full h-full rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <UserCircle className="w-6 h-6 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <span className="text-sm font-medium text-gray-900 block">
                                            {user?.name || "Guest"}
                                        </span>
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                        isUserMenuOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* User dropdown menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
                                    {/* User info section */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {user?.name || "Guest"}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate mt-1">
                                            {user?.email || ""}
                                        </p>
                                    </div>

                                    {/* Profile and Settings links */}
                                    {/* <div className="py-1">
                                        <Link
                                            href="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                        >
                                            <UserCircle className="w-4 h-4 mr-3" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                        >
                                            <Settings className="w-4 h-4 mr-3" />
                                            Settings
                                        </Link>
                                    </div> */}

                                    {/* Logout section */}
                                    <div className="border-t border-gray-100 pt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 focus:outline-none focus:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavBar;


// import React, { useState, useRef, useEffect } from "react";
// import { Menu, UserCircle, Settings, LogOut, ChevronDown } from "lucide-react";
// import { Link, usePage, router } from "@inertiajs/react";

// const AdminNavBar = ({ onMenuToggle }) => {
//     const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//     const userMenuRef = useRef(null);
//     const { auth } = usePage().props;
//     const user = auth?.user;

//     const toggleUserMenu = () => {
//         setIsUserMenuOpen((prev) => !prev);
//     };

//     const handleLogout = async () => {
//         try {
//             await axios.post(route("logout"));
//             window.location.href = "/login";
//         } catch (error) {
//             console.error("Logout error:", error);
//             window.location.href = "/login";
//         }
//     };

//     // Close menu when clicking outside or pressing Escape key
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (
//                 userMenuRef.current &&
//                 !userMenuRef.current.contains(event.target)
//             ) {
//                 setIsUserMenuOpen(false);
//             }
//         };

//         const handleEscapeKey = (event) => {
//             if (event.key === "Escape") {
//                 setIsUserMenuOpen(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         document.addEventListener("keydown", handleEscapeKey);

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//             document.removeEventListener("keydown", handleEscapeKey);
//         };
//     }, []);

//     // Close menu when route changes
//     useEffect(() => {
//         setIsUserMenuOpen(false);
//     }, [window.location.pathname]);

//     return (
//         <nav className="fixed top-0 right-0 w-full lg:w-[98%] h-16 bg-white border-b border-gray-200 z-30">
//             <div className="h-full px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center justify-between h-full">
//                     {/* Left side - Menu toggle and branding */}
//                     <div className="flex items-center space-x-4">
//                         <button
//                             onClick={onMenuToggle}
//                             className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                             aria-label="Toggle menu"
//                         >
//                             <Menu className="w-5 h-5 text-gray-600" />
//                         </button>
//                     </div>

//                     {/* Right side - User menu */}
//                     <div className="flex items-center space-x-4">
//                         {/* Optional: Add notifications or other icons here */}

//                         <div className="relative" ref={userMenuRef}>
//                             <button
//                                 onClick={toggleUserMenu}
//                                 className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                                 aria-expanded={isUserMenuOpen}
//                                 aria-haspopup="true"
//                             >
//                                 <div className="flex items-center space-x-3">
//                                     <div className="w-8 h-8  rounded-full flex items-center justify-center overflow-hidden">
//                                         {user?.image ? (
//                                             <img
//                                                 src={user.image}
//                                                 alt={`${
//                                                     user?.name || "User"
//                                                 } profile`}
//                                                 className="w-full h-full rounded-full object-cover"
//                                                 onError={(e) => {
//                                                     e.target.style.display =
//                                                         "none";
//                                                 }}
//                                             />
//                                         ) : (
//                                             <UserCircle className="w-6 h-6 text-gray-500" />
//                                         )}
//                                     </div>
//                                     <div className="hidden sm:block text-left">
//                                         <span className="text-sm font-medium text-gray-900 block">
//                                             {user?.name || "Guest"}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <ChevronDown
//                                     className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
//                                         isUserMenuOpen ? "rotate-180" : ""
//                                     }`}
//                                 />
//                             </button>

//                             {/* User dropdown menu */}
//                             {isUserMenuOpen && (
//                                 <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
//                                     {/* User info section */}
//                                     <div className="px-4 py-3 border-b border-gray-100">
//                                         <p className="text-sm font-medium text-gray-900 truncate">
//                                             {user?.name || "Guest"}
//                                         </p>
//                                         <p className="text-sm text-gray-500 truncate mt-1">
//                                             {user?.email || ""}
//                                         </p>
//                                     </div>

//                                     {/* Logout section */}
//                                     <div className="border-t border-gray-100 pt-1">
//                                         <button
//                                             onClick={handleLogout}
//                                             className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 focus:outline-none focus:bg-red-50"
//                                         >
//                                             <LogOut className="w-4 h-4 mr-3" />
//                                             Sign Out
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default AdminNavBar;


