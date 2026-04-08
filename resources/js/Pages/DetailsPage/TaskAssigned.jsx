import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import AddTaskAssigned from "@/AddFormComponents/AddTaskAssigned";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Edit, Plus, Trash2 } from "lucide-react";
import EditTaskAssigned from "@/EditFormComponents/EditTaskAssigned";
import MyTable from "@/TableComponents/MyTable";


const TaskAssigned = () => {
    // Get user from page props
    const { props } = usePage();
    const user = props.auth.user;

    // States
    const [allTaskList, setAllTaskList] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingTaskList, setEditingTaskList] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use Effect for fetching tasks
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(route("ourtasklist.index"));
                setAllTaskList(response.data.data || response.data || []);
                setError(null);
            } catch (error) {
                console.error("fetching error ", error);
                setError("Failed to load tasks");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [reloadTrigger]);

    // Use Effect for fetching users (admin only)
    useEffect(() => {
        const fetchUsers = async () => {
            // Only fetch users if current user is admin
            if (user.role !== "admin") return;

            try {
                const response = await axios.get(route("ouruser.index"));
                // Access the correct property from the response
                setUsers(response.data.users || response.data.data || []);
            } catch (error) {
                console.error("Error fetching users", error);
                setUsers([]); // Set to empty array to avoid errors
            }
        };

        fetchUsers();
    }, [user.role]);

    // handleDelete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await axios.delete(route("ourtasklist.destroy", { id: id }));
                setReloadTrigger((prev) => !prev);
            } catch (error) {
                console.log("Delete error:", error);
                alert(error.response?.data?.message || "Failed to delete task");
            }
        }
    };

    // handleEdit
    const handleEdit = (tasklist) => {
        // Check if user is admin before editing
        if (user.role !== "admin") {
            alert("Only admins can edit tasks");
            return;
        }
        setEditingTaskList(tasklist);
        setShowEditForm(true);
    };

    // Add new task
    const handleAddNew = () => {
        // Check if user is admin
        if (user.role !== "admin") {
            alert("Only admins can assign new tasks");
            return;
        }
        setShowAddForm(true);
    };

    // Define columns for the table
    const columns = useMemo(() => {
        const baseColumns = [
            {
                Header: "S/N",
                accessor: (row, index) => index + 1,
                id: "rowIndex",
                width: 50,
            },
            {
                Header: "Title",
                accessor: "title",
                Cell: ({ row }) => {
                    const isCurrentUserTask =
                        row.original.assigned_to === user.id;
                    return (
                        <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                                {row.original.title}
                            </div>
                            {isCurrentUserTask && (
                                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                    Your Task
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                Header: "Assigned To",
                accessor: "assigned_user",
                Cell: ({ value }) => {
                    return value ? (
                        <>
                            {value.name}
                            <div className="text-xs text-gray-500">
                                {value.email}
                            </div>
                        </>
                    ) : (
                        <span className="text-gray-400">Unknown User</span>
                    );
                },
            },
        ];

        // Add extra columns for admin
        if (user.role === "admin") {
            baseColumns.push({
                Header: "Assigned By",
                accessor: "creator",
                Cell: ({ value }) => {
                    return value ? (
                        <>
                            {value.name}
                            <div className="text-xs text-gray-500">
                                {value.email}
                            </div>
                        </>
                    ) : (
                        <span className="text-gray-400">Unknown</span>
                    );
                },
            });

            baseColumns.push({
                Header: "Actions",
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(row.original)}
                                className="text-indigo-600 hover:text-indigo-900 transition duration-200"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(row.original.id)}
                                className="text-red-600 hover:text-red-900 transition duration-200"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                },
                disableSortBy: true,
            });
        }

        return baseColumns;
    }, [user]);

    return (
        <AdminWrapper>
            <div className="container mx-auto  py-4">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        Task Assigned
                    </h1>
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                    >
                       <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                {/* Add Task Form - Only Admin can Add Task */}
                {user.role === "admin" && (
                    <AddTaskAssigned
                        setReloadTrigger={setReloadTrigger}
                        showForm={showAddForm}
                        setShowForm={setShowAddForm}
                        users={users}
                    />
                )}

                {/* Edit Task Form - Only Admin can Edit Task */}
                {user.role === "admin" && (
                    <EditTaskAssigned
                        editingTaskList={editingTaskList}
                        setEditingTaskList={setEditingTaskList}
                        setReloadTrigger={setReloadTrigger}
                        showForm={showEditForm}
                        setShowForm={setShowEditForm}
                        users={users}
                    />
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-600">Loading tasks...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Tasks Table */}
                {!isLoading && !error && (
                    <>
                        {allTaskList.length === 0 ? (
                            <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    {user.role === "admin"
                                        ? "No tasks assigned yet. Assign your first task!"
                                        : "No tasks assigned to you yet."}
                                </p>
                                {user.role === "admin" && (
                                    <button
                                        onClick={handleAddNew}
                                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                                    >
                                        Assign Your First Task
                                    </button>
                                )}
                            </div>
                        ) : (
                            <MyTable 
                                columns={columns} 
                                data={allTaskList}
                            />
                        )}
                    </>
                )}
            </div>
        </AdminWrapper>
    );
};

export default TaskAssigned;




// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { usePage } from "@inertiajs/react";
// import AddTaskAssigned from "@/AddFormComponents/AddTaskAssigned";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import {
//     ChevronUp,
//     ChevronDown,
//     ChevronLeft,
//     ChevronRight,
//     Edit,
//     Trash2,
// } from "lucide-react";
// import { useTable, useSortBy, usePagination } from "react-table";
// import EditTaskAssigned from "@/EditFormComponents/EditTaskAssigned";

// const TaskAssigned = () => {
//     // Get user from page props
//     const { props } = usePage();
//     const user = props.auth.user;

//     // States
//     const [allTaskList, setAllTaskList] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [editingTaskList, setEditingTaskList] = useState(null);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Use Effect for fetching tasks
//     useEffect(() => {
//         const fetchTasks = async () => {
//             try {
//                 setIsLoading(true);
//                 const response = await axios.get(route("ourtasklist.index"));
//                 setAllTaskList(response.data.data || response.data || []);
//                 setError(null);
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 setError("Failed to load tasks");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchTasks();
//     }, [reloadTrigger]);

//     // Use Effect for fetching users (admin only)
//     useEffect(() => {
//         const fetchUsers = async () => {
//             // Only fetch users if current user is admin
//             if (user.role !== "admin") return;

//             try {
//                 const response = await axios.get(route("ouruser.index"));
//                 // Access the correct property from the response
//                 setUsers(response.data.users || response.data.data || []);
//             } catch (error) {
//                 console.error("Error fetching users", error);
//                 setUsers([]); // Set to empty array to avoid errors
//             }
//         };

//         fetchUsers();
//     }, [user.role]);

//     // handleDelete
//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this task?")) {
//             try {
//                 await axios.delete(route("ourtasklist.destroy", { id: id }));
//                 setReloadTrigger((prev) => !prev);
//             } catch (error) {
//                 console.log("Delete error:", error);
//                 alert(error.response?.data?.message || "Failed to delete task");
//             }
//         }
//     };

//     // handleEdit
//     const handleEdit = (tasklist) => {
//         // Check if user is admin before editing
//         if (user.role !== "admin") {
//             alert("Only admins can edit tasks");
//             return;
//         }
//         setEditingTaskList(tasklist);
//         setShowEditForm(true);
//     };

//     // Add new task
//     const handleAddNew = () => {
//         // Check if user is admin
//         if (user.role !== "admin") {
//             alert("Only admins can assign new tasks");
//             return;
//         }
//         setShowAddForm(true);
//     };

//     // Define columns for react-table
//     const columns = useMemo(() => {
//         const baseColumns = [
//             {
//                 Header: "S/N",
//                 accessor: (row, index) => index + 1,
//                 id: "rowIndex",
//                 width: 50,
//             },
//             {
//                 Header: "Title",
//                 accessor: "title",
//                 Cell: ({ row }) => {
//                     const isCurrentUserTask =
//                         row.original.assigned_to === user.id;
//                     return (
//                         <div className="flex items-center">
//                             <div className="text-sm font-medium text-gray-900">
//                                 {row.original.title}
//                             </div>
//                             {isCurrentUserTask && (
//                                 <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
//                                     Your Task
//                                 </span>
//                             )}
//                         </div>
//                     );
//                 },
//             },
//             // {
//             //     Header: "Description",
//             //     accessor: "description",
//             //     Cell: ({ value }) => {
//             //         // Truncate long descriptions
//             //         const maxLength = 20;
//             //         if (value && value.length > maxLength) {
//             //             return value.slice(0, maxLength) + '...';
//             //         }
//             //         return value || '-';
//             //     },
//             // },
//             {
//                 Header: "Assigned To",
//                 accessor: "assigned_user",
//                 Cell: ({ value }) => {
//                     return value ? (
//                         <>
//                             {value.name}
//                             <div className="text-xs text-gray-500">
//                                 {value.email}
//                             </div>
//                         </>
//                     ) : (
//                         <span className="text-gray-400">Unknown User</span>
//                     );
//                 },
//             },
//         ];

//         // Add extra columns for admin
//         if (user.role === "admin") {
//             baseColumns.push({
//                 Header: "Assigned By",
//                 accessor: "creator",
//                 Cell: ({ value }) => {
//                     return value ? (
//                         <>
//                             {value.name}
//                             <div className="text-xs text-gray-500">
//                                 {value.email}
//                             </div>
//                         </>
//                     ) : (
//                         <span className="text-gray-400">Unknown</span>
//                     );
//                 },
//             });

//             baseColumns.push({
//                 Header: "Actions",
//                 accessor: "id",
//                 Cell: ({ row }) => {
//                     return (
//                         <div className="flex space-x-2">
//                             <button
//                                 onClick={() => handleEdit(row.original)}
//                                 className="text-indigo-600 hover:text-indigo-900 transition duration-200"
//                             >
//                                 <Edit size={16} />
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(row.original.id)}
//                                 className="text-red-600 hover:text-red-900 transition duration-200"
//                             >
//                                 <Trash2 size={16} />
//                             </button>
//                         </div>
//                     );
//                 },
//                 disableSortBy: true,
//             });
//         }

//         return baseColumns;
//     }, [user]);

//     // React Table instance
//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         page,
//         prepareRow,
//         canPreviousPage,
//         canNextPage,
//         pageOptions,
//         pageCount,
//         gotoPage,
//         nextPage,
//         previousPage,
//         setPageSize,
//         state: { pageIndex, pageSize },
//     } = useTable(
//         {
//             columns,
//             data: allTaskList,
//             initialState: { pageIndex: 0, pageSize: 10 },
//         },
//         useSortBy,
//         usePagination
//     );

//     return (
//         <AdminWrapper>
//             <div className="container mx-auto">
//                 {/* Header with role badge */}
//                 {/* <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                     <h1 className="text-3xl font-bold text-gray-800">
//                         Assigned Tasks
//                     </h1>
                   
//                     {user.role === "admin" && (
//                         <div className="flex justify-end mb-4">
//                             <button
//                                 onClick={handleAddNew}
//                                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
//                             >
//                                 + Assign New Task
//                             </button>
//                         </div>
//                     )}
//                 </div> */}

//                 <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                     <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
//                         ToDo List
//                     </h1>
//                     <button
//                         onClick={handleAddNew}
//                         className="bg-blue-600 hover:bg-blue-700 w-[170px] text-white font-semibold py-2.5 px-5 rounded-lg shadow transition duration-200 flex items-center gap-2"
//                     >
//                         Assign New Task
//                     </button>
//                 </div>

//                 {/* Add Task Form - Only Admin can Add Task */}
//                 {user.role === "admin" && (
//                     <AddTaskAssigned
//                         setReloadTrigger={setReloadTrigger}
//                         showForm={showAddForm}
//                         setShowForm={setShowAddForm}
//                         users={users}
//                     />
//                 )}

//                 {/* Edit Task Form - Only Admin can Edit Task */}
//                 {user.role === "admin" && (
//                     <EditTaskAssigned
//                         editingTaskList={editingTaskList}
//                         setEditingTaskList={setEditingTaskList}
//                         setReloadTrigger={setReloadTrigger}
//                         showForm={showEditForm}
//                         setShowForm={setShowEditForm}
//                         users={users}
//                     />
//                 )}

//                 {/* Loading State */}
//                 {isLoading && (
//                     <div className="text-center py-12">
//                         <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                         <p className="mt-2 text-gray-600">Loading tasks...</p>
//                     </div>
//                 )}

//                 {/* Error State */}
//                 {error && !isLoading && (
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//                         <p className="text-red-700">{error}</p>
//                     </div>
//                 )}

//                 {/* Tasks Table */}
//                 {!isLoading && !error && (
//                     <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
//                         {allTaskList.length === 0 ? (
//                             <div className="text-center py-12">
//                                 <p className="text-gray-500 text-lg">
//                                     {user.role === "admin"
//                                         ? "No tasks assigned yet. Assign your first task!"
//                                         : "No tasks assigned to you yet."}
//                                 </p>
//                                 {user.role === "admin" && (
//                                     <button
//                                         onClick={handleAddNew}
//                                         className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
//                                     >
//                                         Assign Your First Task
//                                     </button>
//                                 )}
//                             </div>
//                         ) : (
//                             <>
//                                 <div className="overflow-x-auto rounded-lg shadow">
//                                     <table
//                                         {...getTableProps()}
//                                         className="min-w-full divide-y divide-gray-200"
//                                     >
//                                         <thead className="bg-gray-50">
//                                             {headerGroups.map((headerGroup) => (
//                                                 <tr
//                                                     {...headerGroup.getHeaderGroupProps()}
//                                                 >
//                                                     {headerGroup.headers.map(
//                                                         (column) => (
//                                                             <th
//                                                                 {...column.getHeaderProps(
//                                                                     column.getSortByToggleProps()
//                                                                 )}
//                                                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                                                             >
//                                                                 <div className="flex items-center">
//                                                                     {column.render(
//                                                                         "Header"
//                                                                     )}
//                                                                     {column.isSorted ? (
//                                                                         column.isSortedDesc ? (
//                                                                             <ChevronDown
//                                                                                 size={
//                                                                                     16
//                                                                                 }
//                                                                                 className="ml-1"
//                                                                             />
//                                                                         ) : (
//                                                                             <ChevronUp
//                                                                                 size={
//                                                                                     16
//                                                                                 }
//                                                                                 className="ml-1"
//                                                                             />
//                                                                         )
//                                                                     ) : (
//                                                                         ""
//                                                                     )}
//                                                                 </div>
//                                                             </th>
//                                                         )
//                                                     )}
//                                                 </tr>
//                                             ))}
//                                         </thead>
//                                         <tbody
//                                             {...getTableBodyProps()}
//                                             className="bg-white divide-y divide-gray-200"
//                                         >
//                                             {page.map((row) => {
//                                                 prepareRow(row);
//                                                 const isCurrentUserTask =
//                                                     row.original.assigned_to ===
//                                                     user.id;
//                                                 return (
//                                                     <tr
//                                                         {...row.getRowProps()}
//                                                         className={`${
//                                                             isCurrentUserTask
//                                                                 ? "bg-blue-50"
//                                                                 : ""
//                                                         } hover:bg-gray-50 transition-colors`}
//                                                     >
//                                                         {row.cells.map(
//                                                             (cell) => (
//                                                                 <td
//                                                                     {...cell.getCellProps()}
//                                                                     className="px-6 py-4 whitespace-nowrap"
//                                                                 >
//                                                                     {cell.render(
//                                                                         "Cell"
//                                                                     )}
//                                                                 </td>
//                                                             )
//                                                         )}
//                                                     </tr>
//                                                 );
//                                             })}
//                                         </tbody>
//                                     </table>
//                                 </div>

//                                 {/* Pagination */}
//                                 <div className="flex items-center justify-between flex-col md:flex-row mt-4 space-y-4 md:space-y-0">
//                                     <div className="flex items-center">
//                                         <span className="text-sm text-gray-700 mr-2">
//                                             Show
//                                         </span>
//                                         <select
//                                             value={pageSize}
//                                             onChange={(e) =>
//                                                 setPageSize(
//                                                     Number(e.target.value)
//                                                 )
//                                             }
//                                             className="border border-gray-300 rounded-md px-2 py-1 text-sm"
//                                         >
//                                             {[5, 10, 20, 50].map((size) => (
//                                                 <option key={size} value={size}>
//                                                     {size}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         <span className="text-sm text-gray-700 ml-2">
//                                             entries
//                                         </span>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                         <button
//                                             onClick={() => gotoPage(0)}
//                                             disabled={!canPreviousPage}
//                                             className={`p-1 rounded ${
//                                                 !canPreviousPage
//                                                     ? "opacity-50 cursor-not-allowed"
//                                                     : "hover:bg-gray-200"
//                                             }`}
//                                         >
//                                             <ChevronLeft size={20} />
//                                         </button>
//                                         <button
//                                             onClick={() => previousPage()}
//                                             disabled={!canPreviousPage}
//                                             className={`px-3 py-1 rounded ${
//                                                 !canPreviousPage
//                                                     ? "opacity-50 cursor-not-allowed"
//                                                     : "hover:bg-gray-200"
//                                             }`}
//                                         >
//                                             Previous
//                                         </button>
//                                         <span className="text-sm text-gray-700">
//                                             Page{" "}
//                                             <strong>{pageIndex + 1}</strong> of{" "}
//                                             <strong>
//                                                 {pageOptions.length}
//                                             </strong>
//                                         </span>
//                                         <button
//                                             onClick={() => nextPage()}
//                                             disabled={!canNextPage}
//                                             className={`px-3 py-1 rounded ${
//                                                 !canNextPage
//                                                     ? "opacity-50 cursor-not-allowed"
//                                                     : "hover:bg-gray-200"
//                                             }`}
//                                         >
//                                             Next
//                                         </button>
//                                         <button
//                                             onClick={() =>
//                                                 gotoPage(pageCount - 1)
//                                             }
//                                             disabled={!canNextPage}
//                                             className={`p-1 rounded ${
//                                                 !canNextPage
//                                                     ? "opacity-50 cursor-not-allowed"
//                                                     : "hover:bg-gray-200"
//                                             }`}
//                                         >
//                                             <ChevronRight size={20} />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// export default TaskAssigned;

