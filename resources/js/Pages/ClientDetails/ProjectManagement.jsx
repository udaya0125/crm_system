import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Plus, Pencil, Trash2, Eye, Search, X, Edit } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import AddProjectForm from "@/AddFormComponents/AddProjectForm";
import EditProjectForm from "@/EditFormComponents/EditProjectForm";
import MyTable from "@/TableComponents/MyTable";
import TaskManagementModal from "./TaskManagementModal";

const ProjectManagement = () => {
    const [allProjects, setAllProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedProjectForTasks, setSelectedProjectForTasks] =
        useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");

    // Fetch projects
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

    // Filter projects based on search term and priority
    useEffect(() => {
        let filtered = [...allProjects];

        // Apply search filter (title and client)
        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (project) =>
                    project.project_title?.toLowerCase().includes(term) ||
                    project.client_name?.toLowerCase().includes(term),
            );
        }

        // Apply priority filter
        if (priorityFilter !== "all") {
            filtered = filtered.filter(
                (project) =>
                    project.priority?.toLowerCase() ===
                    priorityFilter.toLowerCase(),
            );
        }

        setFilteredProjects(filtered);
    }, [allProjects, searchTerm, priorityFilter]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setPriorityFilter("all");
    };

    // Delete project
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?"))
            return;
        try {
            await axios.delete(route("ourprojects.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    // Open edit form
    const handleEdit = (project) => {
        setEditingProject(project);
        setShowEditForm(true);
    };

    // Open task management modal
    const handleViewTasks = (project) => {
        setSelectedProjectForTasks(project);
        setShowTaskModal(true);
    };

    // Called by EditProjectForm after a successful PUT
    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourprojects.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );
        setReloadTrigger((prev) => !prev);
        return response.data;
    };

    // Handle task updates from TaskManagementModal
    const handleTaskUpdate = async (projectId, updatedTasks) => {
        try {
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append(
                "project_description",
                JSON.stringify(updatedTasks),
            );

            // Calculate completion based on tasks
            const completedTasks = updatedTasks.filter(
                (task) => task.completed,
            ).length;
            const completionPercentage =
                updatedTasks.length > 0
                    ? Math.round((completedTasks / updatedTasks.length) * 100)
                    : 0;
            formData.append("completion", completionPercentage);

            await axios.post(
                route("ourprojects.update", { id: projectId }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );

            setReloadTrigger((prev) => !prev);
            setShowTaskModal(false);
            setSelectedProjectForTasks(null);
        } catch (error) {
            console.error("Error updating tasks:", error);
        }
    };

    // Close add form
    const handleCloseAddForm = () => {
        setShowAddForm(false);
    };

    // Close edit form
    const handleCloseEditForm = () => {
        setShowEditForm(false);
        setEditingProject(null);
    };

    // Close task modal
    const handleCloseTaskModal = () => {
        setShowTaskModal(false);
        setSelectedProjectForTasks(null);
    };

    // Priority badge color
    const priorityColor = (priority) => {
        const map = {
            high: "bg-red-100 text-red-700",
            medium: "bg-amber-100 text-amber-700",
            low: "bg-emerald-100 text-emerald-700",
        };
        return map[priority?.toLowerCase()] ?? "bg-gray-100 text-gray-600";
    };

    // Status badge color
    const statusColor = (status) => {
        const map = {
            completed: "bg-emerald-100 text-emerald-700",
            "in progress": "bg-blue-100 text-blue-700",
            pending: "bg-amber-100 text-amber-700",
            cancelled: "bg-red-100 text-red-700",
        };
        return map[status?.toLowerCase()] ?? "bg-gray-100 text-gray-600";
    };

    // Define table columns with proper accessors and custom cell renderers
    const columns = useMemo(
        () => [
            {
                Header: "S/N",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "ID",
                accessor: "project_id",
                Cell: ({ value }) => (
                    <span className="font-mono text-xs ">
                        {value}
                    </span>
                ),
            },
            {
                Header: "Title",
                accessor: "project_title",
                Cell: ({ value }) => (
                    <span className="font-semibold text-stone-800">
                        {value}
                    </span>
                ),
            },
            {
                Header: "Client",
                accessor: "client_name",
            },
            {
                Header: "Service",
                accessor: "service_type",
            },
            {
                Header: "Deadline",
                accessor: "deadline",
                Cell: ({ value }) => (
                    <span className="whitespace-nowrap">{value}</span>
                ),
            },
            {
                Header: "Team",
                accessor: (row) => row.assigned_team_name ?? "—",
            },
            {
                Header: "Priority",
                accessor: "priority",
                Cell: ({ value }) => (
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${priorityColor(value)}`}
                    >
                        {value}
                    </span>
                ),
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => (
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(value)}`}
                    >
                        {value}
                    </span>
                ),
            },
            {
                Header: "Progress",
                accessor: "completion",
                Cell: ({ value }) => (
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-stone-200 rounded-full h-1.5 min-w-[60px]">
                            <div
                                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${value ?? 0}%` }}
                            />
                        </div>
                        <span className="text-xs text-stone-500 w-8 text-right">
                            {value ?? 0}%
                        </span>
                    </div>
                ),
            },
            {
                Header: "Actions",
                id: "actions",
                Cell: ({ row }) => (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => handleViewTasks(row.original)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="View/Manage Tasks"
                        >
                            <Eye size={15} />
                        </button>
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit Project"
                        >
                            <Edit size={15} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Project"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <>
            <AdminWrapper>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                            Project Management
                        </h1>
                        {!loading && (
                            <p className="text-sm text-stone-500 mt-1 tracking-wide">
                                {filteredProjects.length} project
                                {filteredProjects.length !== 1 ? "s" : ""} total
                                {filteredProjects.length !==
                                    allProjects.length &&
                                    ` (filtered from ${allProjects.length})`}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setEditingProject(null);
                            setShowAddForm(true);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {/* Search and Filter Bar - Only show when not loading */}
                {!loading && (
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-stone-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by project title or client name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <X
                                        size={18}
                                        className="text-stone-400 hover:text-stone-600"
                                    />
                                </button>
                            )}
                        </div>

                        {/* Priority Filter */}
                        <div className="sm:w-64">
                            <select
                                value={priorityFilter}
                                onChange={(e) =>
                                    setPriorityFilter(e.target.value)
                                }
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                            >
                                <option value="all">All Priorities</option>
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                        </div>

                        {/* Clear Filters Button (shown only when filters are active) */}
                        {(searchTerm || priorityFilter !== "all") && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2.5 text-sm text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-2"
                            >
                                <X size={16} />
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* No Results Message - Only show when not loading and no filtered results */}
                {!loading &&
                    filteredProjects.length === 0 &&
                    allProjects.length > 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-stone-400 bg-stone-50 rounded-lg mb-4">
                            <p className="text-lg font-medium tracking-wide">
                                No matching projects
                            </p>
                            <p className="text-sm mt-1">
                                Try adjusting your search or filter criteria.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                {/* Projects Table - Using MyTable with integrated loading */}
                <MyTable
                    columns={columns}
                    data={filteredProjects}
                    loading={loading}
                />
            </AdminWrapper>

            {/* Add Modal */}
            {showAddForm && (
                <AddProjectForm
                    onClose={handleCloseAddForm}
                    setReloadTrigger={setReloadTrigger}
                />
            )}

            {/* Edit Modal */}
            {showEditForm && editingProject && (
                <EditProjectForm
                    editingProject={editingProject}
                    onClose={handleCloseEditForm}
                    onUpdate={handleUpdate}
                    setReloadTrigger={setReloadTrigger}
                />
            )}

            {/* Task Management Modal */}
            {showTaskModal && selectedProjectForTasks && (
                <TaskManagementModal
                    project={selectedProjectForTasks}
                    onClose={handleCloseTaskModal}
                    onSave={handleTaskUpdate}
                />
            )}
        </>
    );
};

export default ProjectManagement;

// import AdminWrapper from '@/AdminWrapper/AdminWrapper';
// import { Plus, Pencil, Trash2, Eye, Search, X, Edit } from 'lucide-react';
// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import AddProjectForm from '@/AddFormComponents/AddProjectForm';
// import EditProjectForm from '@/EditFormComponents/EditProjectForm';
// import MyTable from '@/TableComponents/MyTable';
// import TaskManagementModal from './TaskManagementModal';

// const ProjectManagement = () => {
//     const [allProjects, setAllProjects] = useState([]);
//     const [filteredProjects, setFilteredProjects] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingProject, setEditingProject] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false); // New state for edit form
//     const [selectedProjectForTasks, setSelectedProjectForTasks] = useState(null);
//     const [showTaskModal, setShowTaskModal] = useState(false);

//     // Search and filter states
//     const [searchTerm, setSearchTerm] = useState('');
//     const [priorityFilter, setPriorityFilter] = useState('all');

//     // Fetch projects
//     useEffect(() => {
//         const fetchProjects = async () => {
//             try {
//                 const response = await axios.get(route("ourprojects.index"));
//                 const data = response.data?.data ?? response.data;
//                 setAllProjects(Array.isArray(data) ? data : []);
//             } catch (error) {
//                 console.error("Fetching error:", error);
//             }
//         };

//         fetchProjects();
//     }, [reloadTrigger]);

//     // Filter projects based on search term and priority
//     useEffect(() => {
//         let filtered = [...allProjects];

//         // Apply search filter (title and client)
//         if (searchTerm.trim() !== '') {
//             const term = searchTerm.toLowerCase();
//             filtered = filtered.filter(project =>
//                 project.project_title?.toLowerCase().includes(term) ||
//                 project.client_name?.toLowerCase().includes(term)
//             );
//         }

//         // Apply priority filter
//         if (priorityFilter !== 'all') {
//             filtered = filtered.filter(project =>
//                 project.priority?.toLowerCase() === priorityFilter.toLowerCase()
//             );
//         }

//         setFilteredProjects(filtered);
//     }, [allProjects, searchTerm, priorityFilter]);

//     // Clear all filters
//     const clearFilters = () => {
//         setSearchTerm('');
//         setPriorityFilter('all');
//     };

//     // Delete project
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this project?")) return;
//         try {
//             await axios.delete(route("ourprojects.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Delete error:", error);
//         }
//     };

//     // Open edit form
//     const handleEdit = (project) => {
//         setEditingProject(project);
//         setShowEditForm(true); // Show edit form instead of add form
//     };

//     // Open task management modal
//     const handleViewTasks = (project) => {
//         setSelectedProjectForTasks(project);
//         setShowTaskModal(true);
//     };

//     // Called by EditProjectForm after a successful PUT
//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourprojects.update", { id }),
//             formData,
//             { headers: { "Content-Type": "multipart/form-data" } }
//         );
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//     };

//     // Handle task updates from TaskManagementModal
//     const handleTaskUpdate = async (projectId, updatedTasks) => {
//         try {
//             const formData = new FormData();
//             formData.append("_method", "PUT");
//             formData.append("project_description", JSON.stringify(updatedTasks));

//             // Calculate completion based on tasks
//             const completedTasks = updatedTasks.filter(task => task.completed).length;
//             const completionPercentage = updatedTasks.length > 0
//                 ? Math.round((completedTasks / updatedTasks.length) * 100)
//                 : 0;
//             formData.append("completion", completionPercentage);

//             await axios.post(
//                 route("ourprojects.update", { id: projectId }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );

//             setReloadTrigger((prev) => !prev);
//             setShowTaskModal(false);
//             setSelectedProjectForTasks(null);
//         } catch (error) {
//             console.error("Error updating tasks:", error);
//         }
//     };

//     // Close add form
//     const handleCloseAddForm = () => {
//         setShowAddForm(false);
//     };

//     // Close edit form
//     const handleCloseEditForm = () => {
//         setShowEditForm(false);
//         setEditingProject(null);
//     };

//     // Close task modal
//     const handleCloseTaskModal = () => {
//         setShowTaskModal(false);
//         setSelectedProjectForTasks(null);
//     };

//     // Priority badge color
//     const priorityColor = (priority) => {
//         const map = {
//             high: "bg-red-100 text-red-700",
//             medium: "bg-amber-100 text-amber-700",
//             low: "bg-emerald-100 text-emerald-700",
//         };
//         return map[priority?.toLowerCase()] ?? "bg-gray-100 text-gray-600";
//     };

//     // Status badge color
//     const statusColor = (status) => {
//         const map = {
//             completed: "bg-emerald-100 text-emerald-700",
//             "in progress": "bg-blue-100 text-blue-700",
//             pending: "bg-amber-100 text-amber-700",
//             cancelled: "bg-red-100 text-red-700",
//         };
//         return map[status?.toLowerCase()] ?? "bg-gray-100 text-gray-600";
//     };

//     // Define table columns with proper accessors and custom cell renderers
//     const columns = useMemo(() => [
//         {
//             Header: 'ID',
//             accessor: 'project_id',
//             Cell: ({ value }) => (
//                 <span className="font-mono text-xs text-stone-500">{value}</span>
//             ),
//         },
//         {
//             Header: 'Title',
//             accessor: 'project_title',
//             Cell: ({ value }) => (
//                 <span className="font-semibold text-stone-800">{value}</span>
//             ),
//         },
//         {
//             Header: 'Client',
//             accessor: 'client_name',
//         },
//         {
//             Header: 'Service',
//             accessor: 'service_type',
//         },
//         {
//             Header: 'Deadline',
//             accessor: 'deadline',
//             Cell: ({ value }) => (
//                 <span className="whitespace-nowrap">{value}</span>
//             ),
//         },
//         {
//             Header: 'Team',
//             accessor: (row) => row.assigned_team_name  ?? "—",
//         },
//         {
//             Header: 'Priority',
//             accessor: 'priority',
//             Cell: ({ value }) => (
//                 <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${priorityColor(value)}`}>
//                     {value}
//                 </span>
//             ),
//         },
//         {
//             Header: 'Status',
//             accessor: 'status',
//             Cell: ({ value }) => (
//                 <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(value)}`}>
//                     {value}
//                 </span>
//             ),
//         },
//         {
//             Header: 'Progress',
//             accessor: 'completion',
//             Cell: ({ value }) => (
//                 <div className="flex items-center gap-2">
//                     <div className="flex-1 bg-stone-200 rounded-full h-1.5 min-w-[60px]">
//                         <div
//                             className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
//                             style={{ width: `${value ?? 0}%` }}
//                         />
//                     </div>
//                     <span className="text-xs text-stone-500 w-8 text-right">
//                         {value ?? 0}%
//                     </span>
//                 </div>
//             ),
//         },
//         {
//             Header: 'Actions',
//             id: 'actions',
//             Cell: ({ row }) => (
//                 <div className="flex items-center justify-center gap-2">
//                     <button
//                         onClick={() => handleViewTasks(row.original)}
//                         className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
//                         title="View/Manage Tasks"
//                     >
//                         <Eye size={15} />
//                     </button>
//                     <button
//                         onClick={() => handleEdit(row.original)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
//                         title="Edit Project"
//                     >
//                         <Edit size={15} />
//                     </button>
//                     <button
//                         onClick={() => handleDelete(row.original.id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                         title="Delete Project"
//                     >
//                         <Trash2 size={15} />
//                     </button>
//                 </div>
//             ),
//         },
//     ], []);

//     return (
//         <>
//             <AdminWrapper>
//                 {/* Header */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
//                             Project Management
//                         </h1>
//                         <p className="text-sm text-stone-500 mt-1 tracking-wide">
//                             {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} total
//                             {filteredProjects.length !== allProjects.length &&
//                                 ` (filtered from ${allProjects.length})`}
//                         </p>
//                     </div>
//                     <button
//                         onClick={() => {
//                             setEditingProject(null);
//                             setShowAddForm(true);
//                         }}
//                         className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 {/* Search and Filter Bar */}
//                 <div className="mb-6 flex flex-col sm:flex-row gap-4">
//                     {/* Search Input */}
//                     <div className="flex-1 relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Search size={18} className="text-stone-400" />
//                         </div>
//                         <input
//                             type="text"
//                             placeholder="Search by project title or client name..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full pl-10 pr-10 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         />
//                         {searchTerm && (
//                             <button
//                                 onClick={() => setSearchTerm('')}
//                                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                             >
//                                 <X size={18} className="text-stone-400 hover:text-stone-600" />
//                             </button>
//                         )}
//                     </div>

//                     {/* Priority Filter */}
//                     <div className="sm:w-64">
//                         <select
//                             value={priorityFilter}
//                             onChange={(e) => setPriorityFilter(e.target.value)}
//                             className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
//                         >
//                             <option value="all">All Priorities</option>
//                             <option value="high">High Priority</option>
//                             <option value="medium">Medium Priority</option>
//                             <option value="low">Low Priority</option>
//                         </select>
//                     </div>

//                     {/* Clear Filters Button (shown only when filters are active) */}
//                     {(searchTerm || priorityFilter !== 'all') && (
//                         <button
//                             onClick={clearFilters}
//                             className="px-4 py-2.5 text-sm text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-2"
//                         >
//                             <X size={16} />
//                             Clear Filters
//                         </button>
//                     )}
//                 </div>

//                 {/* No Results Message */}
//                 {filteredProjects.length === 0 && allProjects.length > 0 && (
//                     <div className="flex flex-col items-center justify-center py-12 text-stone-400 bg-stone-50 rounded-lg mb-4">
//                         <p className="text-lg font-medium tracking-wide">No matching projects</p>
//                         <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
//                         <button
//                             onClick={clearFilters}
//                             className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
//                         >
//                             Clear all filters
//                         </button>
//                     </div>
//                 )}

//                 {/* Projects Table */}
//                 {allProjects.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center py-24 text-stone-400">
//                         <p className="text-lg font-medium tracking-wide">No projects yet</p>
//                         <p className="text-sm mt-1">Click "Create" to add your first project.</p>
//                     </div>
//                 ) : (
//                     filteredProjects.length > 0 && (
//                         <MyTable
//                             columns={columns}
//                             data={filteredProjects}
//                         />
//                     )
//                 )}
//             </AdminWrapper>

//             {/* Add Modal */}
//             {showAddForm && (
//                 <AddProjectForm
//                     onClose={handleCloseAddForm}
//                     setReloadTrigger={setReloadTrigger}
//                 />
//             )}

//             {/* Edit Modal */}
//             {showEditForm && editingProject && (
//                 <EditProjectForm
//                     editingProject={editingProject}
//                     onClose={handleCloseEditForm}
//                     onUpdate={handleUpdate}
//                     setReloadTrigger={setReloadTrigger}
//                 />
//             )}

//             {/* Task Management Modal */}
//             {showTaskModal && selectedProjectForTasks && (
//                 <TaskManagementModal
//                     project={selectedProjectForTasks}
//                     onClose={handleCloseTaskModal}
//                     onSave={handleTaskUpdate}
//                 />
//             )}
//         </>
//     );
// };

// export default ProjectManagement;
