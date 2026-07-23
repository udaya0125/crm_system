import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import TaskReportDetailPopup from "./TaskReportDetailPopup";

const UserCard = ({ user, onClick }) => {
    const initials = (user.name || "")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const openCount = (user.in_progress_tasks || 0) + (user.pending_tasks || 0);

    return (
        <button
            type="button"
            onClick={() => onClick(user)}
            className="text-left bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#2F5D50]/30 transition-all"
        >
            <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-[#EAF2EF] text-[#2F5D50] font-bold flex items-center justify-center text-sm shrink-0">
                    {initials}
                </span>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                    </p>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                        {user.role}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                    <p className="text-base font-bold text-gray-900">
                        {user.total_tasks}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        Total
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-base font-bold text-[#2F5D50]">
                        {user.completed_tasks}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        Done
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-base font-bold text-amber-600">
                        {openCount}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        Open
                    </p>
                </div>
            </div>
        </button>
    );
};

const TaskReport = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await axios.get(route("ourtaskreport.index"));
                setUsers(res.data?.data || []);
            } catch (err) {
                console.log("Error fetching users summary", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <AdminWrapper>
            <div className="bg-[#F3F4F7] -m-6 p-6 h-full overflow-y-auto">
                <div className="mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Task Report
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {users.length} team member{users.length === 1 ? "" : "s"} —
                        click a card to see their full task history.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-10">
                        Loading team...
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-10 text-center">
                        <p className="text-sm text-gray-400 italic">
                            No team members with tasks yet
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {users.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onClick={(u) => setSelectedUserId(u.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <TaskReportDetailPopup
                userId={selectedUserId}
                onClose={() => setSelectedUserId(null)}
            />
        </AdminWrapper>
    );
};

export default TaskReport;