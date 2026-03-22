import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { useEffect, useMemo, useState } from "react";
import {
    Plus,
    SquarePen,
    Trash,
    Trash2,
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
                const response = await axios.get(route("ourusers.index"));
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
                                size={16}
                                className="inline-block mr-1"
                            />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition duration-200"
                        >
                            <Trash2 size={16} className="inline-block mr-1" />
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
                route("ourusers.destroy", { id: id })
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
