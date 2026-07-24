// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//     Bell,
//     Check,
//     ChevronDown,
//     LogOut,
//     Menu,
//     User,
//     UserCircle,
//     X,
// } from "lucide-react";
// import { usePage , Link } from "@inertiajs/react";
// import axios from "axios";

// const AdminNavBar = ({ onMenuToggle, isCollapsed = false }) => {
//     const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//     const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//     const [notifications, setNotifications] = useState([]);
//     const [unreadCount, setUnreadCount] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const userMenuRef = useRef(null);
//     const notificationRef = useRef(null);
//     const { props, url } = usePage();
//     const { auth } = props;
//     const user = auth?.user;
//     const isAdmin = user?.role === "admin";
//     const canUseRoutes = typeof route === "function";

//     const fetchNotifications = useCallback(async () => {
//         if (!canUseRoutes) return;

//         try {
//             setLoading(true);
//             const response = await axios.get(route("notifications.index"));
//             const data = Array.isArray(response.data) ? response.data : [];
//             setNotifications(data);
//             setUnreadCount(
//                 data.filter((notification) => !notification.is_read).length,
//             );
//         } catch (error) {
//             console.error("Error fetching notifications:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [canUseRoutes]);

//     useEffect(() => {
//         fetchNotifications();
//         const interval = window.setInterval(fetchNotifications, 30000);

//         return () => window.clearInterval(interval);
//     }, [fetchNotifications]);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             const clickedOutsideUser =
//                 userMenuRef.current &&
//                 !userMenuRef.current.contains(event.target);
//             const clickedOutsideNotifications =
//                 notificationRef.current &&
//                 !notificationRef.current.contains(event.target);

//             if (clickedOutsideUser && clickedOutsideNotifications) {
//                 setIsUserMenuOpen(false);
//                 setIsNotificationOpen(false);
//             }
//         };

//         const handleEscapeKey = (event) => {
//             if (event.key === "Escape") {
//                 setIsUserMenuOpen(false);
//                 setIsNotificationOpen(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         document.addEventListener("keydown", handleEscapeKey);

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//             document.removeEventListener("keydown", handleEscapeKey);
//         };
//     }, []);

//     useEffect(() => {
//         setIsUserMenuOpen(false);
//         setIsNotificationOpen(false);
//     }, [url]);

//     const toggleUserMenu = () => {
//         setIsUserMenuOpen((current) => !current);
//         setIsNotificationOpen(false);
//     };

//     const toggleNotification = () => {
//         setIsNotificationOpen((current) => {
//             const next = !current;
//             if (next) fetchNotifications();
//             return next;
//         });
//         setIsUserMenuOpen(false);
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

//     const markAsRead = async (notificationId) => {
//         if (!canUseRoutes) return;

//         try {
//             await axios.patch(
//                 route("notifications.markAsRead", notificationId),
//             );
//             setNotifications((current) =>
//                 current.map((notification) =>
//                     notification.id === notificationId
//                         ? { ...notification, is_read: true }
//                         : notification,
//                 ),
//             );
//             setUnreadCount((current) => Math.max(0, current - 1));
//         } catch (error) {
//             console.error("Error marking notification as read:", error);
//         }
//     };

//     const markAllAsRead = async () => {
//         if (!canUseRoutes) return;

//         try {
//             await axios.patch(route("notifications.markAllAsRead"));
//             setNotifications((current) =>
//                 current.map((notification) => ({
//                     ...notification,
//                     is_read: true,
//                 })),
//             );
//             setUnreadCount(0);
//         } catch (error) {
//             console.error("Error marking all notifications as read:", error);
//         }
//     };

//     const deleteNotification = async (notificationId) => {
//         if (!canUseRoutes) return;

//         try {
//             await axios.delete(route("notifications.destroy", notificationId));
//             const notification = notifications.find(
//                 (item) => item.id === notificationId,
//             );
//             setNotifications((current) =>
//                 current.filter((item) => item.id !== notificationId),
//             );

//             if (notification && !notification.is_read) {
//                 setUnreadCount((current) => Math.max(0, current - 1));
//             }
//         } catch (error) {
//             console.error("Error deleting notification:", error);
//         }
//     };

//     const clearAllNotifications = async () => {
//         if (!canUseRoutes) return;

//         try {
//             await axios.delete(route("notifications.clearAll"));
//             setNotifications([]);
//             setUnreadCount(0);
//         } catch (error) {
//             console.error("Error clearing all notifications:", error);
//         }
//     };

//     const formatTime = (timestamp) => {
//         const date = new Date(timestamp);
//         const diffInSeconds = Math.max(
//             0,
//             Math.floor((new Date() - date) / 1000),
//         );
//         const diffInMinutes = Math.floor(diffInSeconds / 60);
//         const diffInHours = Math.floor(diffInMinutes / 60);
//         const diffInDays = Math.floor(diffInHours / 24);

//         if (Number.isNaN(date.getTime())) return "";
//         if (diffInDays > 0)
//             return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
//         if (diffInHours > 0)
//             return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
//         if (diffInMinutes > 0) {
//             return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
//         }
//         return "Just now";
//     };

//     const initials = (user?.name || "Guest")
//         .split(" ")
//         .filter(Boolean)
//         .slice(0, 2)
//         .map((part) => part[0])
//         .join("")
//         .toUpperCase();

//     return (
//         <nav
//             className={[
//                 "fixed right-0 top-0 z-30 h-16 border-b border-slate-200 bg-white/90 shadow-sm shadow-slate-200/50 backdrop-blur transition-all duration-300",
//                 isCollapsed ? "lg:left-16" : "lg:left-64",
//                 "left-0",
//             ].join(" ")}
//         >
//             <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
//                 <div className="flex min-w-0 items-center gap-3">
//                     <button
//                         type="button"
//                         onClick={onMenuToggle}
//                         className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
//                         aria-label="Open menu"
//                     >
//                         <Menu className="h-5 w-5" />
//                     </button>
//                     {/* <div className="hidden min-w-0 sm:block">
//                         <img src="/images/logo2.png" alt="" className="h-8 w-8" />
//                     </div> */}
//                 </div>

//                 <div className="flex items-center gap-2">
//                     <div className="relative" ref={notificationRef}>
//                         <button
//                             type="button"
//                             onClick={toggleNotification}
//                             className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             aria-label="Toggle notifications"
//                             aria-expanded={isNotificationOpen}
//                         >
//                             <Bell className="h-5 w-5" />
//                             {unreadCount > 0 && (
//                                 <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
//                                     {unreadCount > 9 ? "9+" : unreadCount}
//                                 </span>
//                             )}
//                         </button>

//                         {isNotificationOpen && (
//                             <div className="absolute right-[-4.25rem] mt-3 w-[calc(100vw-2rem)] max-w-96 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-200/80 sm:right-0">
//                                 <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
//                                     <div>
//                                         <h3 className="text-sm font-bold text-slate-900">
//                                             Notifications
//                                         </h3>
//                                         <p className="text-xs text-slate-500">
//                                             {unreadCount} unread
//                                         </p>
//                                     </div>
//                                     {isAdmin && notifications.length > 0 && (
//                                         <div className="flex items-center gap-1">
//                                             {unreadCount > 0 && (
//                                                 <button
//                                                     type="button"
//                                                     onClick={markAllAsRead}
//                                                     className="rounded-md px-2 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
//                                                 >
//                                                     Mark read
//                                                 </button>
//                                             )}
//                                             <button
//                                                 type="button"
//                                                 onClick={clearAllNotifications}
//                                                 className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
//                                             >
//                                                 Clear
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="max-h-96 overflow-y-auto">
//                                     {loading ? (
//                                         <div className="px-4 py-10 text-center text-sm text-slate-500">
//                                             <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
//                                             <span className="mt-3 block">
//                                                 Loading notifications...
//                                             </span>
//                                         </div>
//                                     ) : notifications.length > 0 ? (
//                                         notifications.map((notification) => (
//                                             <div
//                                                 key={notification.id}
//                                                 className={[
//                                                     "border-b border-slate-100 px-4 py-3 last:border-0",
//                                                     notification.is_read
//                                                         ? "bg-white"
//                                                         : "bg-blue-50/70",
//                                                 ].join(" ")}
//                                             >
//                                                 <div className="flex items-start gap-3">
//                                                     <span
//                                                         className={[
//                                                             "mt-1 h-2 w-2 shrink-0 rounded-full",
//                                                             notification.is_read
//                                                                 ? "bg-slate-300"
//                                                                 : "bg-blue-600",
//                                                         ].join(" ")}
//                                                     />
//                                                     <div className="min-w-0 flex-1">
//                                                         <p className="break-words text-sm text-slate-800">
//                                                             {
//                                                                 notification.message
//                                                             }
//                                                         </p>
//                                                         <p className="mt-1 text-xs text-slate-400">
//                                                             {formatTime(
//                                                                 notification.created_at,
//                                                             )}
//                                                         </p>
//                                                     </div>
//                                                     {isAdmin && (
//                                                         <div className="flex shrink-0 items-center gap-1">
//                                                             {!notification.is_read && (
//                                                                 <button
//                                                                     type="button"
//                                                                     onClick={() =>
//                                                                         markAsRead(
//                                                                             notification.id,
//                                                                         )
//                                                                     }
//                                                                     className="rounded-md p-1 text-blue-700 transition hover:bg-blue-100"
//                                                                     title="Mark as read"
//                                                                 >
//                                                                     <Check className="h-4 w-4" />
//                                                                 </button>
//                                                             )}
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() =>
//                                                                     deleteNotification(
//                                                                         notification.id,
//                                                                     )
//                                                                 }
//                                                                 className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//                                                                 title="Delete notification"
//                                                             >
//                                                                 <X className="h-4 w-4" />
//                                                             </button>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <div className="px-4 py-10 text-center">
//                                             <Bell className="mx-auto h-10 w-10 text-slate-300" />
//                                             <p className="mt-3 text-sm font-medium text-slate-700">
//                                                 No notifications
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     <div className="relative" ref={userMenuRef}>
//                         <button
//                             type="button"
//                             onClick={toggleUserMenu}
//                             className="flex h-10 items-center gap-2 rounded-lg border border-transparent px-1.5 pr-2 text-slate-700 transition hover:border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-2"
//                             aria-expanded={isUserMenuOpen}
//                             aria-haspopup="true"
//                         >
//                             <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xs font-bold text-blue-700">
//                                 {user?.image ? (
//                                     <img
//                                         src={`${imgurl}/${user.image}`}
//                                         alt={`${user?.name || "User"} profile`}
//                                         className="h-full w-full object-cover"
//                                     />
//                                 ) : initials ? (
//                                     initials
//                                 ) : (
//                                     <UserCircle className="h-6 w-6" />
//                                 )}
//                             </span>
//                             <span className="hidden min-w-0 text-left sm:block">
//                                 <span className="block max-w-36 truncate text-sm font-semibold text-slate-900">
//                                     {user?.name || "Guest"}
//                                 </span>
//                                 <span className="block max-w-36 truncate text-xs capitalize text-slate-500">
//                                     {user?.role || "User"}
//                                 </span>
//                             </span>
//                             <ChevronDown
//                                 className={[
//                                     "h-4 w-4 shrink-0 text-slate-400 transition",
//                                     isUserMenuOpen ? "rotate-180" : "",
//                                 ].join(" ")}
//                             />
//                         </button>

//                         {isUserMenuOpen && (
//                             <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-200/80">
//                                 <div className="border-b border-slate-100 px-4 py-3">
//                                     <p className="truncate text-sm font-bold text-slate-900">
//                                         {user?.name || "Guest"}
//                                     </p>
//                                     <p className="mt-1 truncate text-sm text-slate-500">
//                                         {user?.email || ""}
//                                     </p>
//                                 </div>

//                                 <Link
//                                     href="/profile"
//                                     className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:bg-slate-50"
//                                 >
//                                     <User className="h-4 w-4" />
//                                     Profile
//                                 </Link>

//                                 <button
//                                     type="button"
//                                     onClick={handleLogout}
//                                     className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:bg-red-50"
//                                 >
//                                     <LogOut className="h-4 w-4" />
//                                     Sign Out
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default AdminNavBar;


import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Bell,
    Check,
    ChevronDown,
    LogOut,
    Menu,
    User,
    UserCircle,
    X,
} from "lucide-react";
import { usePage , Link } from "@inertiajs/react";
import axios from "axios";

const NOTIFICATION_ROLES = ["admin", "manager", "accountant"];

const AdminNavBar = ({ onMenuToggle, isCollapsed = false }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const userMenuRef = useRef(null);
    const notificationRef = useRef(null);
    const { props, url } = usePage();
    const { auth } = props;
    const user = auth?.user;
    const isAdmin = user?.role === "admin";
    const canViewNotifications = NOTIFICATION_ROLES.includes(user?.role);
    const canUseRoutes = typeof route === "function";

    const fetchNotifications = useCallback(async () => {
        if (!canUseRoutes || !canViewNotifications) return;

        try {
            setLoading(true);
            const response = await axios.get(route("notifications.index"));
            const data = Array.isArray(response.data) ? response.data : [];
            setNotifications(data);
            setUnreadCount(
                data.filter((notification) => !notification.is_read).length,
            );
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [canUseRoutes, canViewNotifications]);

    useEffect(() => {
        if (!canViewNotifications) return;

        fetchNotifications();
        const interval = window.setInterval(fetchNotifications, 30000);

        return () => window.clearInterval(interval);
    }, [fetchNotifications, canViewNotifications]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedOutsideUser =
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target);
            const clickedOutsideNotifications =
                notificationRef.current &&
                !notificationRef.current.contains(event.target);

            if (clickedOutsideUser && clickedOutsideNotifications) {
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

    useEffect(() => {
        setIsUserMenuOpen(false);
        setIsNotificationOpen(false);
    }, [url]);

    const toggleUserMenu = () => {
        setIsUserMenuOpen((current) => !current);
        setIsNotificationOpen(false);
    };

    const toggleNotification = () => {
        setIsNotificationOpen((current) => {
            const next = !current;
            if (next) fetchNotifications();
            return next;
        });
        setIsUserMenuOpen(false);
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

    const markAsRead = async (notificationId) => {
        if (!canUseRoutes) return;

        try {
            await axios.patch(
                route("notifications.markAsRead", notificationId),
            );
            setNotifications((current) =>
                current.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, is_read: true }
                        : notification,
                ),
            );
            setUnreadCount((current) => Math.max(0, current - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        if (!canUseRoutes) return;

        try {
            await axios.patch(route("notifications.markAllAsRead"));
            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    is_read: true,
                })),
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const deleteNotification = async (notificationId) => {
        if (!canUseRoutes) return;

        try {
            await axios.delete(route("notifications.destroy", notificationId));
            const notification = notifications.find(
                (item) => item.id === notificationId,
            );
            setNotifications((current) =>
                current.filter((item) => item.id !== notificationId),
            );

            if (notification && !notification.is_read) {
                setUnreadCount((current) => Math.max(0, current - 1));
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const clearAllNotifications = async () => {
        if (!canUseRoutes) return;

        try {
            await axios.delete(route("notifications.clearAll"));
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error("Error clearing all notifications:", error);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const diffInSeconds = Math.max(
            0,
            Math.floor((new Date() - date) / 1000),
        );
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (Number.isNaN(date.getTime())) return "";
        if (diffInDays > 0)
            return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
        if (diffInHours > 0)
            return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
        if (diffInMinutes > 0) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
        }
        return "Just now";
    };

    const initials = (user?.name || "Guest")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

    return (
        <nav
            className={[
                "fixed right-0 top-0 z-30 h-16 border-b border-slate-200 bg-white/90 shadow-sm shadow-slate-200/50 backdrop-blur transition-all duration-300",
                isCollapsed ? "lg:left-20" : "lg:left-64",
                "left-0",
            ].join(" ")}
        >
            <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuToggle}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {canViewNotifications && (
                        <div className="relative" ref={notificationRef}>
                            <button
                                type="button"
                                onClick={toggleNotification}
                                className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Toggle notifications"
                                aria-expanded={isNotificationOpen}
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {isNotificationOpen && (
                                <div className="absolute right-[-4.25rem] mt-3 w-[calc(100vw-2rem)] max-w-96 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-200/80 sm:right-0">
                                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">
                                                Notifications
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                {unreadCount} unread
                                            </p>
                                        </div>
                                        {isAdmin && notifications.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                {unreadCount > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={markAllAsRead}
                                                        className="rounded-md px-2 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                                                    >
                                                        Mark read
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={clearAllNotifications}
                                                    className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        {loading ? (
                                            <div className="px-4 py-10 text-center text-sm text-slate-500">
                                                <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                                                <span className="mt-3 block">
                                                    Loading notifications...
                                                </span>
                                            </div>
                                        ) : notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={[
                                                        "border-b border-slate-100 px-4 py-3 last:border-0",
                                                        notification.is_read
                                                            ? "bg-white"
                                                            : "bg-blue-50/70",
                                                    ].join(" ")}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span
                                                            className={[
                                                                "mt-1 h-2 w-2 shrink-0 rounded-full",
                                                                notification.is_read
                                                                    ? "bg-slate-300"
                                                                    : "bg-blue-600",
                                                            ].join(" ")}
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="break-words text-sm text-slate-800">
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>
                                                            <p className="mt-1 text-xs text-slate-400">
                                                                {formatTime(
                                                                    notification.created_at,
                                                                )}
                                                            </p>
                                                        </div>
                                                        {isAdmin && (
                                                            <div className="flex shrink-0 items-center gap-1">
                                                                {!notification.is_read && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            markAsRead(
                                                                                notification.id,
                                                                            )
                                                                        }
                                                                        className="rounded-md p-1 text-blue-700 transition hover:bg-blue-100"
                                                                        title="Mark as read"
                                                                    >
                                                                        <Check className="h-4 w-4" />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        deleteNotification(
                                                                            notification.id,
                                                                        )
                                                                    }
                                                                    className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                                                    title="Delete notification"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-10 text-center">
                                                <Bell className="mx-auto h-10 w-10 text-slate-300" />
                                                <p className="mt-3 text-sm font-medium text-slate-700">
                                                    No notifications
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="relative" ref={userMenuRef}>
                        <button
                            type="button"
                            onClick={toggleUserMenu}
                            className="flex h-10 items-center gap-2 rounded-lg border border-transparent px-1.5 pr-2 text-slate-700 transition hover:border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-2"
                            aria-expanded={isUserMenuOpen}
                            aria-haspopup="true"
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                {user?.image ? (
                                    <img
                                        src={`${imgurl}/${user.image}`}
                                        alt={`${user?.name || "User"} profile`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : initials ? (
                                    initials
                                ) : (
                                    <UserCircle className="h-6 w-6" />
                                )}
                            </span>
                            <span className="hidden min-w-0 text-left sm:block">
                                <span className="block max-w-36 truncate text-sm font-semibold text-slate-900">
                                    {user?.name || "Guest"}
                                </span>
                                <span className="block max-w-36 truncate text-xs capitalize text-slate-500">
                                    {user?.role || "User"}
                                </span>
                            </span>
                            <ChevronDown
                                className={[
                                    "h-4 w-4 shrink-0 text-slate-400 transition",
                                    isUserMenuOpen ? "rotate-180" : "",
                                ].join(" ")}
                            />
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-200/80">
                                <div className="border-b border-slate-100 px-4 py-3">
                                    <p className="truncate text-sm font-bold text-slate-900">
                                        {user?.name || "Guest"}
                                    </p>
                                    <p className="mt-1 truncate text-sm text-slate-500">
                                        {user?.email || ""}
                                    </p>
                                </div>

                                <Link
                                    href="/profile"
                                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:bg-slate-50"
                                >
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavBar;

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//     Bell,
//     Check,
//     ChevronDown,
//     LogOut,
//     Menu,
//     User,
//     UserCircle,
//     X,
// } from "lucide-react";
// import { usePage , Link } from "@inertiajs/react";
// import axios from "axios";

// const AdminNavBar = ({ onMenuToggle, isCollapsed = false }) => {
//     const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//     const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//     const [notifications, setNotifications] = useState([]);
//     const [unreadCount, setUnreadCount] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const userMenuRef = useRef(null);
//     const notificationRef = useRef(null);
//     const { props, url } = usePage();
//     const { auth } = props;
//     const user = auth?.user;
//     const isAdmin = user?.role === "admin";
//     const canUseRoutes = typeof route === "function";

//     const fetchNotifications = useCallback(async () => {
//         if (!canUseRoutes) return;

//         try {
//             setLoading(true);
//             const response = await axios.get(route("notifications.index"));
//             const data = Array.isArray(response.data) ? response.data : [];
//             setNotifications(data);
//             setUnreadCount(
//                 data.filter((notification) => !notification.is_read).length,
//             );
//         } catch (error) {
//             console.error("Error fetching notifications:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [canUseRoutes]);

//     useEffect(() => {
//         fetchNotifications();
//         const interval = window.setInterval(fetchNotifications, 30000);

//         return () => window.clearInterval(interval);
//     }, [fetchNotifications]);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             const clickedOutsideUser =
//                 userMenuRef.current &&
//                 !userMenuRef.current.contains(event.target);
//             const clickedOutsideNotifications =
//                 notificationRef.current &&
//                 !notificationRef.current.contains(event.target);

//             if (clickedOutsideUser && clickedOutsideNotifications) {
//                 setIsUserMenuOpen(false);
//                 setIsNotificationOpen(false);
//             }
//         };

//         const handleEscapeKey = (event) => {
//             if (event.key === "Escape") {
//                 setIsUserMenuOpen(false);
//                 setIsNotificationOpen(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         document.addEventListener("keydown", handleEscapeKey);

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//             document.removeEventListener("keydown", handleEscapeKey);
//         };
//     }, []);

//     useEffect(() => {
//         setIsUserMenuOpen(false);
//         setIsNotificationOpen(false);
//     }, [url]);

//     const toggleUserMenu = () => {
//         setIsUserMenuOpen((current) => !current);
//         setIsNotificationOpen(false);
//     };

//     const toggleNotification = () => {
//         setIsNotificationOpen((current) => {
//             const next = !current;
//             if (next) fetchNotifications();
//             return next;
//         });
//         setIsUserMenuOpen(false);
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

//     const markAsRead = async (notificationId) => {
//         if (!canUseRoutes) return;

//         try {
//             await axios.patch(
//                 route("notifications.markAsRead", notificationId),
//             );
//             setNotifications((current) =>
//                 current.map((notification) =>
//                     notification.id === notificationId
//                         ? { ...notification, is_read: true }
//                         : notification,
//                 ),
//             );
//             setUnreadCount((current) => Math.max(0, current - 1));
//         } catch (error) {
//             console.error("Error marking notification as read:", error);
//         }
//     };

//     const markAllAsRead = async () => {
//         if (!canUseRoutes) return;

//         try {
//             await axios.patch(route("notifications.markAllAsRead"));
//             setNotifications((current) =>
//                 current.map((notification) => ({
//                     ...notification,
//                     is_read: true,
//                 })),
//             );
//             setUnreadCount(0);
//         } catch (error) {
//             console.error("Error marking all notifications as read:", error);
//         }
//     };

//     const deleteNotification = async (notificationId) => {
//         if (!canUseRoutes) return;

//         try {
//             await axios.delete(route("notifications.destroy", notificationId));
//             const notification = notifications.find(
//                 (item) => item.id === notificationId,
//             );
//             setNotifications((current) =>
//                 current.filter((item) => item.id !== notificationId),
//             );

//             if (notification && !notification.is_read) {
//                 setUnreadCount((current) => Math.max(0, current - 1));
//             }
//         } catch (error) {
//             console.error("Error deleting notification:", error);
//         }
//     };

//     const clearAllNotifications = async () => {
//         if (!canUseRoutes) return;

//         try {
//             await axios.delete(route("notifications.clearAll"));
//             setNotifications([]);
//             setUnreadCount(0);
//         } catch (error) {
//             console.error("Error clearing all notifications:", error);
//         }
//     };

//     const formatTime = (timestamp) => {
//         const date = new Date(timestamp);
//         const diffInSeconds = Math.max(
//             0,
//             Math.floor((new Date() - date) / 1000),
//         );
//         const diffInMinutes = Math.floor(diffInSeconds / 60);
//         const diffInHours = Math.floor(diffInMinutes / 60);
//         const diffInDays = Math.floor(diffInHours / 24);

//         if (Number.isNaN(date.getTime())) return "";
//         if (diffInDays > 0)
//             return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
//         if (diffInHours > 0)
//             return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
//         if (diffInMinutes > 0) {
//             return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
//         }
//         return "Just now";
//     };

//     const initials = (user?.name || "Guest")
//         .split(" ")
//         .filter(Boolean)
//         .slice(0, 2)
//         .map((part) => part[0])
//         .join("")
//         .toUpperCase();

//     return (
//         <nav
//             className={[
//                 "fixed right-0 top-0 z-30 h-16 border-b border-slate-200 bg-white/90 shadow-sm shadow-slate-200/50 backdrop-blur transition-all duration-300",
//                 isCollapsed ? "lg:left-20" : "lg:left-64",
//                 "left-0",
//             ].join(" ")}
//         >
//             <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
//                 <div className="flex min-w-0 items-center gap-3">
//                     <button
//                         type="button"
//                         onClick={onMenuToggle}
//                         className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
//                         aria-label="Open menu"
//                     >
//                         <Menu className="h-5 w-5" />
//                     </button>
//                 </div>

//                 <div className="flex items-center gap-2">
//                     <div className="relative" ref={notificationRef}>
//                         <button
//                             type="button"
//                             onClick={toggleNotification}
//                             className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             aria-label="Toggle notifications"
//                             aria-expanded={isNotificationOpen}
//                         >
//                             <Bell className="h-5 w-5" />
//                             {unreadCount > 0 && (
//                                 <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
//                                     {unreadCount > 9 ? "9+" : unreadCount}
//                                 </span>
//                             )}
//                         </button>

//                         {isNotificationOpen && (
//                             <div className="absolute right-[-4.25rem] mt-3 w-[calc(100vw-2rem)] max-w-96 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-200/80 sm:right-0">
//                                 <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
//                                     <div>
//                                         <h3 className="text-sm font-bold text-slate-900">
//                                             Notifications
//                                         </h3>
//                                         <p className="text-xs text-slate-500">
//                                             {unreadCount} unread
//                                         </p>
//                                     </div>
//                                     {isAdmin && notifications.length > 0 && (
//                                         <div className="flex items-center gap-1">
//                                             {unreadCount > 0 && (
//                                                 <button
//                                                     type="button"
//                                                     onClick={markAllAsRead}
//                                                     className="rounded-md px-2 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
//                                                 >
//                                                     Mark read
//                                                 </button>
//                                             )}
//                                             <button
//                                                 type="button"
//                                                 onClick={clearAllNotifications}
//                                                 className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
//                                             >
//                                                 Clear
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="max-h-96 overflow-y-auto">
//                                     {loading ? (
//                                         <div className="px-4 py-10 text-center text-sm text-slate-500">
//                                             <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
//                                             <span className="mt-3 block">
//                                                 Loading notifications...
//                                             </span>
//                                         </div>
//                                     ) : notifications.length > 0 ? (
//                                         notifications.map((notification) => (
//                                             <div
//                                                 key={notification.id}
//                                                 className={[
//                                                     "border-b border-slate-100 px-4 py-3 last:border-0",
//                                                     notification.is_read
//                                                         ? "bg-white"
//                                                         : "bg-blue-50/70",
//                                                 ].join(" ")}
//                                             >
//                                                 <div className="flex items-start gap-3">
//                                                     <span
//                                                         className={[
//                                                             "mt-1 h-2 w-2 shrink-0 rounded-full",
//                                                             notification.is_read
//                                                                 ? "bg-slate-300"
//                                                                 : "bg-blue-600",
//                                                         ].join(" ")}
//                                                     />
//                                                     <div className="min-w-0 flex-1">
//                                                         <p className="break-words text-sm text-slate-800">
//                                                             {
//                                                                 notification.message
//                                                             }
//                                                         </p>
//                                                         <p className="mt-1 text-xs text-slate-400">
//                                                             {formatTime(
//                                                                 notification.created_at,
//                                                             )}
//                                                         </p>
//                                                     </div>
//                                                     {isAdmin && (
//                                                         <div className="flex shrink-0 items-center gap-1">
//                                                             {!notification.is_read && (
//                                                                 <button
//                                                                     type="button"
//                                                                     onClick={() =>
//                                                                         markAsRead(
//                                                                             notification.id,
//                                                                         )
//                                                                     }
//                                                                     className="rounded-md p-1 text-blue-700 transition hover:bg-blue-100"
//                                                                     title="Mark as read"
//                                                                 >
//                                                                     <Check className="h-4 w-4" />
//                                                                 </button>
//                                                             )}
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() =>
//                                                                     deleteNotification(
//                                                                         notification.id,
//                                                                     )
//                                                                 }
//                                                                 className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//                                                                 title="Delete notification"
//                                                             >
//                                                                 <X className="h-4 w-4" />
//                                                             </button>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <div className="px-4 py-10 text-center">
//                                             <Bell className="mx-auto h-10 w-10 text-slate-300" />
//                                             <p className="mt-3 text-sm font-medium text-slate-700">
//                                                 No notifications
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     <div className="relative" ref={userMenuRef}>
//                         <button
//                             type="button"
//                             onClick={toggleUserMenu}
//                             className="flex h-10 items-center gap-2 rounded-lg border border-transparent px-1.5 pr-2 text-slate-700 transition hover:border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-2"
//                             aria-expanded={isUserMenuOpen}
//                             aria-haspopup="true"
//                         >
//                             <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xs font-bold text-blue-700">
//                                 {user?.image ? (
//                                     <img
//                                         src={`${imgurl}/${user.image}`}
//                                         alt={`${user?.name || "User"} profile`}
//                                         className="h-full w-full object-cover"
//                                     />
//                                 ) : initials ? (
//                                     initials
//                                 ) : (
//                                     <UserCircle className="h-6 w-6" />
//                                 )}
//                             </span>
//                             <span className="hidden min-w-0 text-left sm:block">
//                                 <span className="block max-w-36 truncate text-sm font-semibold text-slate-900">
//                                     {user?.name || "Guest"}
//                                 </span>
//                                 <span className="block max-w-36 truncate text-xs capitalize text-slate-500">
//                                     {user?.role || "User"}
//                                 </span>
//                             </span>
//                             <ChevronDown
//                                 className={[
//                                     "h-4 w-4 shrink-0 text-slate-400 transition",
//                                     isUserMenuOpen ? "rotate-180" : "",
//                                 ].join(" ")}
//                             />
//                         </button>

//                         {isUserMenuOpen && (
//                             <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-200/80">
//                                 <div className="border-b border-slate-100 px-4 py-3">
//                                     <p className="truncate text-sm font-bold text-slate-900">
//                                         {user?.name || "Guest"}
//                                     </p>
//                                     <p className="mt-1 truncate text-sm text-slate-500">
//                                         {user?.email || ""}
//                                     </p>
//                                 </div>

//                                 <Link
//                                     href="/profile"
//                                     className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:bg-slate-50"
//                                 >
//                                     <User className="h-4 w-4" />
//                                     Profile
//                                 </Link>

//                                 <button
//                                     type="button"
//                                     onClick={handleLogout}
//                                     className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:bg-red-50"
//                                 >
//                                     <LogOut className="h-4 w-4" />
//                                     Sign Out
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default AdminNavBar;
