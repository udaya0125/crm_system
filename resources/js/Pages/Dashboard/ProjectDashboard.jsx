import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import React, { use, useEffect, useMemo, useState } from "react";

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

const ProjectDashboard = () => {
    const [allProjects, setAllProjects] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [loading, setLoading] = useState(true);

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
            const tasks =
                typeof projectDescription === "string"
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
        (project) =>
            project.status?.toLowerCase().replace(/\s+/g, "-") !== "completed",
    );

    // Projects Table Columns
    const projectColumns = useMemo(
        () => [
            {
                Header: "#",
                accessor: (row, idx) => idx + 1,
            },
            {
                Header: "Project",
                accessor: (row) => (
                    <div>
                        <div className="font-medium text-gray-900">
                            {row.project_title}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                            {row.client_name}
                        </div>
                    </div>
                ),
            },
            {
                Header: "Service",
                accessor: "service_type",
            },
            {
                Header: "Start",
                accessor: "start_date",
            },
            {
                Header: "Deadline",
                accessor: "deadline",
            },
            {
                Header: "Team",
                accessor: (row) => row.assigned_team_name ?? "—",
            },
            {
                Header: "Priority",
                accessor: (row) => {
                    const priorityKey = row.priority?.toLowerCase();
                    return (
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                PRIORITY_STYLES[priorityKey] ??
                                "bg-gray-100 text-gray-500"
                            }`}
                        >
                            {row.priority}
                        </span>
                    );
                },
            },
            {
                Header: "Status",
                accessor: (row) => {
                    const statusKey = row.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-");
                    return (
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                STATUS_STYLES[statusKey] ??
                                "bg-gray-100 text-gray-500"
                            }`}
                        >
                            {row.status}
                        </span>
                    );
                },
            },
            {
                Header: "Progress",
                accessor: (row) => (
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{
                                    width: `${row.completion ?? 0}%`,
                                }}
                            />
                        </div>
                        <span className="text-xs text-gray-500 w-8">
                            {row.completion ?? 0}%
                        </span>
                    </div>
                ),
            },
            {
                Header: "Tasks",
                accessor: (row) => {
                    const taskProgress = getTaskProgress(
                        row.project_description,
                    );
                    return taskProgress ? (
                        <span>
                            {taskProgress.completed}/{taskProgress.total} done
                        </span>
                    ) : (
                        <span className="text-gray-300">—</span>
                    );
                },
            },
        ],
        [],
    );
    return (
        <div>
            {/* Projects Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">
                        Completed Projects
                    </h2>
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
                    <MyTable
                        columns={projectColumns}
                        data={completedProjects}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectDashboard;
