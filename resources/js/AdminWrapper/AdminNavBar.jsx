import React, { useState, useRef, useEffect } from "react";
import { Menu, UserCircle, Settings, LogOut, ChevronDown } from "lucide-react";
import { Link, usePage, router } from "@inertiajs/react";

const AdminNavBar = ({ onMenuToggle }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const { auth } = usePage().props;
    const user = auth?.user;

    const toggleUserMenu = () => {
        setIsUserMenuOpen((prev) => !prev);
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

    // Close menu when clicking outside or pressing Escape
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setIsUserMenuOpen(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsUserMenuOpen(false);
    }, [window.location.pathname]);

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

                    {/* Right side - User menu */}
                    <div className="flex items-center space-x-4">
                        {/* Optional: Add notifications or other icons here */}

                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={toggleUserMenu}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                aria-expanded={isUserMenuOpen}
                                aria-haspopup="true"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8  rounded-full flex items-center justify-center overflow-hidden">
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
                                        {/* <span className="text-xs text-gray-500 block">
                                            {user?.role || "Admin"}
                                        </span> */}
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

                                    {/* Menu items */}
                                    <div className="py-1">
                                        <Link
                                            href={""}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                            onClick={() =>
                                                setIsUserMenuOpen(false)
                                            }
                                        >
                                            <UserCircle className="w-4 h-4 mr-3 text-gray-400" />
                                            Profile
                                        </Link>
                                        <Link
                                            href={""}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                            onClick={() =>
                                                setIsUserMenuOpen(false)
                                            }
                                        >
                                            <Settings className="w-4 h-4 mr-3 text-gray-400" />
                                            Settings
                                        </Link>
                                    </div>

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
