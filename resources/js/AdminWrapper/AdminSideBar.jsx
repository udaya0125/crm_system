import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Home,
    Users,
    FolderTree,
    Package,
    BookOpen,
    Settings,
    X
} from "lucide-react";

const AdminSideBar = ({ isMobileOpen, onMobileToggle, user }) => {
    const { url } = usePage();
    const currentPath = url.split("/")[1] || "dashboard";

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
                    fixed left-0 top-0 h-screen bg-white border-r z-50 transition-all duration-300
                    w-64
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b h-16">
                    <div className="text-lg font-bold text-gray-800">Sales System</div>
                    <button
                        onClick={onMobileToggle}
                        className="lg:hidden p-1 hover:bg-gray-100 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Menu Items (NO MAP, NO ROLE) */}
                <div className="p-4 space-y-1">

                    {/* Dashboard */}
                    <Link
                        href="/dashboard"
                        className={`flex items-center p-3 rounded-lg transition-colors ${
                            isActive("/dashboard")
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <Home className={`w-5 h-5 ${isActive("/dashboard") ? "text-blue-600" : "text-gray-500"}`} />
                        <span className="ml-3 font-medium">Dashboard</span>
                    </Link>

                    {/* Users */}
                    <Link
                        href="/users"
                        className={`flex items-center p-3 rounded-lg transition-colors ${
                            isActive("/users")
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <Users className={`w-5 h-5 ${isActive("/users") ? "text-blue-600" : "text-gray-500"}`} />
                        <span className="ml-3 font-medium">Users</span>
                    </Link>

                    {/* Categories */}
                    <Link
                        href="/categories"
                        className={`flex items-center p-3 rounded-lg transition-colors ${
                            isActive("/categories")
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <FolderTree className={`w-5 h-5 ${isActive("/categories") ? "text-blue-600" : "text-gray-500"}`} />
                        <span className="ml-3 font-medium">Categories</span>
                    </Link>

                    {/* Products */}
                    <Link
                        href="/products"
                        className={`flex items-center p-3 rounded-lg transition-colors ${
                            isActive("/products")
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <Package className={`w-5 h-5 ${isActive("/products") ? "text-blue-600" : "text-gray-500"}`} />
                        <span className="ml-3 font-medium">Products</span>
                    </Link>

                    {/* Blogs */}
                    <Link
                        href="/blogs"
                        className={`flex items-center p-3 rounded-lg transition-colors ${
                            isActive("/blogs")
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <BookOpen className={`w-5 h-5 ${isActive("/blogs") ? "text-blue-600" : "text-gray-500"}`} />
                        <span className="ml-3 font-medium">Blogs</span>
                    </Link>

                    {/* Settings */}
                    <Link
                        href="/settings"
                        className={`flex items-center p-3 rounded-lg transition-colors ${
                            isActive("/settings")
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <Settings className={`w-5 h-5 ${isActive("/settings") ? "text-blue-600" : "text-gray-500"}`} />
                        <span className="ml-3 font-medium">Settings</span>
                    </Link>
                </div>

                {/* User Info */}
                {/* {user && (
                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                )} */}
            </div>
        </>
    );
};

export default AdminSideBar;
