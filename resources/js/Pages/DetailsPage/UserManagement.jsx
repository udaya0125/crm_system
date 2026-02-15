// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import React, { useEffect, useMemo, useState } from "react";
// import { useTable, useSortBy, usePagination } from "react-table";
// import {
//     ChevronUp,
//     ChevronDown,
//     ChevronLeft,
//     ChevronRight,
//     SquarePen,
//     Trash,
// } from "lucide-react";
// import axios from "axios";
// import AddUserForm from "@/AddFormComponents/AddUserForm";
// import EditUserForm from "@/EditStepComponents/EditUserForm";

// const UserManagement = () => {
//     const [allUser, setAllUser] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     // Use Effect - Fetch Users
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 setLoading(true);
//                 setError("");
//                 const response = await axios.get(route("ouruser.index"));
//                 setAllUser(response.data.users);
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 setError("Failed to fetch users. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUser();
//     }, [reloadTrigger]);

//     // Define columns
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S/N",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//             },
//             {
//                 Header: "Email",
//                 accessor: "email",
//             },
//             {
//                 Header: "Role",
//                 accessor: "role",
//                 Cell: ({ value }) => (
//                     <span
//                         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                             value === "admin"
//                                 ? "bg-red-100 text-red-800"
//                                 : value === "editor"
//                                 ? "bg-blue-100 text-blue-800"
//                                 : "bg-green-100 text-green-800"
//                         }`}
//                     >
//                         {value}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Actions",
//                 id: "actions",
//                 Cell: ({ row }) => (
//                     <div className="flex space-x-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="text-indigo-600 hover:text-indigo-900 transition duration-200"
//                         >
//                             <SquarePen
//                                 size={21}
//                                 className="inline-block mr-1"
//                             />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="text-red-600 hover:text-red-900 transition duration-200"
//                         >
//                             <Trash size={21} className="inline-block mr-1" />
//                         </button>
//                     </div>
//                 ),
//                 disableSortBy: true,
//             },
//         ],
//         []
//     );

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
//             data: allUser,
//             initialState: { pageIndex: 0, pageSize: 10 },
//         },
//         useSortBy,
//         usePagination
//     );

//     // handleDelete
//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this user?")) {
//             return;
//         }

//         try {
//             const response = await axios.delete(
//                 route("ouruser.destroy", { id: id })
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//             alert("Failed to delete user. Please try again.");
//         }
//     };

//     // handleEdit
//     const handleEdit = (user) => {
//         setEditingUser(user);
//         setShowEditForm(true);
//     };

//     // Handle cancel edit
//     const handleCancelEdit = () => {
//         setEditingUser(null);
//         setShowEditForm(false);
//     };

//     // Handle cancel add
//     const handleCancelAdd = () => {
//         setShowAddForm(false);
//     };

//     // Handle form success
//     const handleFormSuccess = () => {
//         setReloadTrigger((prev) => !prev);
//         setShowAddForm(false);
//         setShowEditForm(false);
//         setEditingUser(null);
//     };

//     // Handle add new user
//     const handleAddNew = () => {
//         setShowAddForm(true);
//     };

//     return (
//         <div>
//             <AdminWrapper>
//                 <div className="">
//                     <div className="flex justify-between items-center mb-6">
//                         <h1 className="text-2xl font-bold">User Management</h1>
//                         <button
//                             onClick={handleAddNew}
//                             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 flex items-center gap-2"
//                         >
//                             <span>Add New User</span>
//                         </button>
//                     </div>

//                     {/* Error Message */}
//                     {error && (
//                         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                             {error}
//                         </div>
//                     )}

//                     {/* Loading State */}
//                     {loading && (
//                         <div className="flex justify-center items-center py-8">
//                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//                         </div>
//                     )}

//                     {/* Users Table */}
//                     {!loading && (
//                         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//                             {allUser.length === 0 ? (
//                                 <div className="text-center py-8 text-gray-500">
//                                     No users found. Click "Add New User" to
//                                     create one.
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="overflow-x-auto">
//                                         <table
//                                             {...getTableProps()}
//                                             className="min-w-full divide-y divide-gray-200"
//                                         >
//                                             <thead className="bg-gray-50">
//                                                 {headerGroups.map(
//                                                     (headerGroup) => (
//                                                         <tr
//                                                             {...headerGroup.getHeaderGroupProps()}
//                                                         >
//                                                             {headerGroup.headers.map(
//                                                                 (column) => (
//                                                                     <th
//                                                                         {...column.getHeaderProps(
//                                                                             column.getSortByToggleProps()
//                                                                         )}
//                                                                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                                                                     >
//                                                                         <div className="flex items-center">
//                                                                             {column.render(
//                                                                                 "Header"
//                                                                             )}
//                                                                             {column.isSorted ? (
//                                                                                 column.isSortedDesc ? (
//                                                                                     <ChevronDown
//                                                                                         size={
//                                                                                             16
//                                                                                         }
//                                                                                         className="ml-1"
//                                                                                     />
//                                                                                 ) : (
//                                                                                     <ChevronUp
//                                                                                         size={
//                                                                                             16
//                                                                                         }
//                                                                                         className="ml-1"
//                                                                                     />
//                                                                                 )
//                                                                             ) : (
//                                                                                 ""
//                                                                             )}
//                                                                         </div>
//                                                                     </th>
//                                                                 )
//                                                             )}
//                                                         </tr>
//                                                     )
//                                                 )}
//                                             </thead>
//                                             <tbody
//                                                 {...getTableBodyProps()}
//                                                 className="bg-white divide-y divide-gray-200"
//                                             >
//                                                 {page.map((row) => {
//                                                     prepareRow(row);
//                                                     return (
//                                                         <tr
//                                                             {...row.getRowProps()}
//                                                             className="hover:bg-gray-50"
//                                                         >
//                                                             {row.cells.map(
//                                                                 (cell) => (
//                                                                     <td
//                                                                         {...cell.getCellProps()}
//                                                                         className="px-6 py-4 whitespace-nowrap"
//                                                                     >
//                                                                         {cell.render(
//                                                                             "Cell"
//                                                                         )}
//                                                                     </td>
//                                                                 )
//                                                             )}
//                                                         </tr>
//                                                     );
//                                                 })}
//                                             </tbody>
//                                         </table>
//                                     </div>

//                                     {/* Pagination */}
//                                     <div className="flex items-center justify-between flex-col md:flex-row mt-4 px-6 py-3 bg-gray-50 border-t border-gray-200">
//                                         <div className="flex items-center mb-4 md:mb-0">
//                                             <span className="text-sm text-gray-700 mr-2">
//                                                 Show
//                                             </span>
//                                             <select
//                                                 value={pageSize}
//                                                 onChange={(e) =>
//                                                     setPageSize(
//                                                         Number(e.target.value)
//                                                     )
//                                                 }
//                                                 className="border border-gray-300 rounded-md px-2 py-1 text-sm"
//                                             >
//                                                 {[5, 10, 20, 50].map((size) => (
//                                                     <option
//                                                         key={size}
//                                                         value={size}
//                                                     >
//                                                         {size}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             <span className="text-sm text-gray-700 ml-2">
//                                                 entries
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <button
//                                                 onClick={() => gotoPage(0)}
//                                                 disabled={!canPreviousPage}
//                                                 className={`p-1 rounded ${
//                                                     !canPreviousPage
//                                                         ? "opacity-50 cursor-not-allowed"
//                                                         : "hover:bg-gray-200"
//                                                 }`}
//                                             >
//                                                 <ChevronLeft size={20} />
//                                             </button>
//                                             <button
//                                                 onClick={() => previousPage()}
//                                                 disabled={!canPreviousPage}
//                                                 className={`px-3 py-1 rounded ${
//                                                     !canPreviousPage
//                                                         ? "opacity-50 cursor-not-allowed"
//                                                         : "hover:bg-gray-200"
//                                                 }`}
//                                             >
//                                                 Previous
//                                             </button>
//                                             <span className="text-sm text-gray-700">
//                                                 Page{" "}
//                                                 <strong>{pageIndex + 1}</strong>{" "}
//                                                 of{" "}
//                                                 <strong>
//                                                     {pageOptions.length}
//                                                 </strong>
//                                             </span>
//                                             <button
//                                                 onClick={() => nextPage()}
//                                                 disabled={!canNextPage}
//                                                 className={`px-3 py-1 rounded ${
//                                                     !canNextPage
//                                                         ? "opacity-50 cursor-not-allowed"
//                                                         : "hover:bg-gray-200"
//                                                 }`}
//                                             >
//                                                 Next
//                                             </button>
//                                             <button
//                                                 onClick={() =>
//                                                     gotoPage(pageCount - 1)
//                                                 }
//                                                 disabled={!canNextPage}
//                                                 className={`p-1 rounded ${
//                                                     !canNextPage
//                                                         ? "opacity-50 cursor-not-allowed"
//                                                         : "hover:bg-gray-200"
//                                                 }`}
//                                             >
//                                                 <ChevronRight size={20} />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     )}

//                     {/* Add User Form Modal */}
//                     {showAddForm && (
//                         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                             <div className="bg-white rounded-lg w-full max-w-md">
//                                 <AddUserForm
//                                     onSuccess={handleFormSuccess}
//                                     onCancel={handleCancelAdd}
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {/* Edit User Form Modal */}
//                     {showEditForm && (
//                         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                             <div className="bg-white rounded-lg w-full max-w-md">
//                                 <EditUserForm
//                                     editingUser={editingUser}
//                                     onSuccess={handleFormSuccess}
//                                     onCancel={handleCancelEdit}
//                                 />
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </AdminWrapper>
//         </div>
//     );
// };

// export default UserManagement;


import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { useEffect, useMemo, useState } from "react";
import {
    Plus,
    SquarePen,
    Trash,
} from "lucide-react";
import axios from "axios";
import AddUserForm from "@/AddFormComponents/AddUserForm";
import EditUserForm from "@/EditStepComponents/EditUserForm";
import MyTable from "@/TableComponents/MyTable";


const UserManagement = () => {
    const [allUser, setAllUser] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Use Effect - Fetch Users
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await axios.get(route("ouruser.index"));
                setAllUser(response.data.users);
            } catch (error) {
                console.error("fetching error ", error);
                setError("Failed to fetch users. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [reloadTrigger]);

    // Define columns for MyTable
    const columns = useMemo(
        () => [
            {
                Header: "S/N",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Role",
                accessor: "role",
                Cell: ({ value }) => (
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            value === "admin"
                                ? "bg-red-100 text-red-800"
                                : value === "editor"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                        }`}
                    >
                        {value}
                    </span>
                ),
            },
            {
                Header: "Actions",
                id: "actions",
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-indigo-600 hover:text-indigo-900 transition duration-200"
                        >
                            <SquarePen
                                size={21}
                                className="inline-block mr-1"
                            />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition duration-200"
                        >
                            <Trash size={21} className="inline-block mr-1" />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    // handleDelete
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            const response = await axios.delete(
                route("ouruser.destroy", { id: id })
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
            alert("Failed to delete user. Please try again.");
        }
    };

    // handleEdit
    const handleEdit = (user) => {
        setEditingUser(user);
        setShowEditForm(true);
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditingUser(null);
        setShowEditForm(false);
    };

    // Handle cancel add
    const handleCancelAdd = () => {
        setShowAddForm(false);
    };

    // Handle form success
    const handleFormSuccess = () => {
        setReloadTrigger((prev) => !prev);
        setShowAddForm(false);
        setShowEditForm(false);
        setEditingUser(null);
    };

    // Handle add new user
    const handleAddNew = () => {
        setShowAddForm(true);
    };

    return (
        <div>
            <AdminWrapper>
                <div className="container mx-auto  py-4 ">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">User Management</h1>
                        <button
                            onClick={handleAddNew}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={18} />
                        <span>Create</span>
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {/* Users Table - Using MyTable component */}
                    {!loading && (
                        <>
                            {allUser.length === 0 ? (
                                <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-500">
                                    No users found. Click "Add New User" to
                                    create one.
                                </div>
                            ) : (
                                <MyTable columns={columns} data={allUser} />
                            )}
                        </>
                    )}

                    {/* Add User Form Modal */}
                    {showAddForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg w-full max-w-md">
                                <AddUserForm
                                    onSuccess={handleFormSuccess}
                                    onCancel={handleCancelAdd}
                                />
                            </div>
                        </div>
                    )}

                    {/* Edit User Form Modal */}
                    {showEditForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg w-full max-w-md">
                                <EditUserForm
                                    editingUser={editingUser}
                                    onSuccess={handleFormSuccess}
                                    onCancel={handleCancelEdit}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </AdminWrapper>
        </div>
    );
};

export default UserManagement;
