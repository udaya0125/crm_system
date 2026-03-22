import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Link, usePage } from "@inertiajs/react";
import React, { useEffect, useState, useMemo } from "react";
import {
    Building2,
    User,
    Users,
    ClipboardCheck,
    Calendar,
    AlertTriangle,
} from "lucide-react";
import MyTable from "@/TableComponents/MyTable";
import ClientDashboard from "../Dashboard/ClientDashboard";
import BackToTop from "@/AdminWrapper/BackToTop";
import TicketDashboard from "../Dashboard/TicketDashboard";

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const cards = [
        {
            title: "Task Management",
            breadcrumb: "Tasks",
            icon: Users,
            link: "/tasks",
        },
        {
            title: "To Do List",
            breadcrumb: "To Do",
            icon: ClipboardCheck,
            link: "/todo",
        },
    ];

    const user = usePage().props.auth.user;
    const isAdmin = user?.role === "admin";
    const isManager = user?.role === "manager";
    const isAdminOrManager = isAdmin || isManager;
    const isUser = user?.role === "user";

    // Loading spinner component
    const LoadingSpinner = () => (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
        </div>
    );

    return (
        <>
            <div className="mx-auto py-4">
                <AdminWrapper>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {isAdmin && (
                                <>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                        Admin Dashboard
                                    </h2>
                                </>
                            )}

                            {isUser && (
                                <>
                                    <div className="max-w-7xl mx-auto py-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 mb-10">
                                            Dashboard
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {cards.map((card, index) => {
                                                const Icon = card.icon;

                                                return (
                                                    <Link
                                                        key={index}
                                                        href={card.link}
                                                        className="block"
                                                    >
                                                        <div className="bg-white rounded-2xl p-6 min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
                                                            {/* Card Top Breadcrumb */}
                                                            <div className="flex items-center gap-2 mb-6">
                                                                <span className="text-xl font-semibold text-gray-800">
                                                                    Home
                                                                </span>
                                                                <span className="text-sm text-gray-500">
                                                                    |{" "}
                                                                    {
                                                                        card.breadcrumb
                                                                    }
                                                                </span>
                                                            </div>

                                                            {/* Card Content */}
                                                            <div className="flex items-center gap-6">
                                                                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
                                                                    <Icon className="w-7 h-7 text-gray-700" />
                                                                </div>

                                                                <h3 className="text-lg font-medium text-gray-800">
                                                                    {card.title}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                            <TicketDashboard />
                            <BackToTop />
                        </>
                    )}
                </AdminWrapper>
            </div>
        </>
    );
};

export default Dashboard;
