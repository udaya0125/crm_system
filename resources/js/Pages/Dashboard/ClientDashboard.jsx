import React, { useState, useEffect } from "react";
import axios from "axios";

const STATUS_STYLES = {
    completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "in-progress": "bg-blue-100 text-blue-700 border border-blue-200",
    pending: "bg-amber-100 text-amber-700 border border-amber-200",
    cancelled: "bg-red-100 text-red-700 border border-red-200",
};

const PRIORITY_STYLES = {
    high: "bg-red-50 text-red-600 border border-red-200",
    medium: "bg-orange-50 text-orange-600 border border-orange-200",
    low: "bg-gray-100 text-gray-500 border border-gray-200",
};

const ClientDashboard = () => {
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourprojects.index"));
                const data = response.data?.data ?? response.data;
                setAllProjects(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Fetching error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [reloadTrigger]);

    

    const getTaskProgress = (projectDescription) => {
        try {
            const tasks = typeof projectDescription === "string"
                ? JSON.parse(projectDescription)
                : projectDescription;
            if (!Array.isArray(tasks) || tasks.length === 0) return null;
            const completed = tasks.filter((t) => t.completed).length;
            return { completed, total: tasks.length };
        } catch {
            return null;
        }
    };

    const completedProjects = allProjects.filter(
        (project) => project.status?.toLowerCase().replace(/\s+/g, "-") === "completed"
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Client Dashboard
                </h1>
                <p className="text-gray-500 text-sm">
                    View your projects, manage tickets, and track finances.
                </p>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">
                        Completed Projects
                    </h2>
                    <button
                        onClick={() => setReloadTrigger((v) => v + 1)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ↻ Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        Loading projects…
                    </div>
                ) : completedProjects.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No completed projects found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                    <th className="px-6 py-3 text-left font-medium">#</th>
                                    <th className="px-6 py-3 text-left font-medium">Project</th>
                                    <th className="px-6 py-3 text-left font-medium">Service</th>
                                    <th className="px-6 py-3 text-left font-medium">Start</th>
                                    <th className="px-6 py-3 text-left font-medium">Deadline</th>
                                    <th className="px-6 py-3 text-left font-medium">Team</th>
                                    <th className="px-6 py-3 text-left font-medium">Priority</th>
                                    <th className="px-6 py-3 text-left font-medium">Status</th>
                                    <th className="px-6 py-3 text-left font-medium">Progress</th>
                                    <th className="px-6 py-3 text-left font-medium">Tasks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {completedProjects.map((project, idx) => {
                                    const taskProgress = getTaskProgress(
                                        project.project_description
                                    );
                                    const statusKey = project.status
                                        ?.toLowerCase()
                                        .replace(/\s+/g, "-");
                                    const priorityKey =
                                        project.priority?.toLowerCase();

                                    return (
                                        <tr
                                            key={project.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-gray-400">
                                                {idx + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {project.project_title}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5">
                                                    {project.client_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {project.service_type}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {project.start_date}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {project.deadline}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {project.assigned_team ?? (
                                                    <span className="text-gray-300">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                        PRIORITY_STYLES[priorityKey] ??
                                                        "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {project.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                        STATUS_STYLES[statusKey] ??
                                                        "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full transition-all"
                                                            style={{
                                                                width: `${project.completion ?? 0}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 w-8">
                                                        {project.completion ?? 0}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {taskProgress ? (
                                                    <span>
                                                        {taskProgress.completed}/
                                                        {taskProgress.total} done
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;