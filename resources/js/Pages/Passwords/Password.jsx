import axios from "axios";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import AddPasswordForm from "@/AddPasswordComponents/AddPasswordForm";
import MyTable from "@/TableComponents/MyTable";
import EditPasswordForm from "@/EditPasswordComponents/EditPasswordForm";
import { Head } from "@inertiajs/react";
import PageLoader from "@/Loader/PageLoader";
import PasswordPopup from "../../PopupComponents/PasswordPopup";
import toast, { Toaster } from "react-hot-toast";

const Password = () => {
    const [allPassword, setAllPassword] = useState([]);
    const [allOrganization, setAllOrganization] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [allSubCategory, setAllSubCategory] = useState([]);
    const [allChildCategory, setAllChildCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingPassword, setEditingPassword] = useState(null);
    const [viewingPassword, setViewingPassword] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [
                    passwordsRes,
                    organizationsRes,
                    categoriesRes,
                    subCategoriesRes,
                    childCategoriesRes,
                ] = await Promise.all([
                    axios.get(route("ourpasswords.index")),
                    axios.get(route("ourorganizations.index")),
                    axios.get(route("ourcategories.index")),
                    axios.get(route("oursubcategories.index")),
                    axios.get(route("ourchildcategories.index")),
                ]);

                setAllPassword(passwordsRes.data.data);
                setAllOrganization(organizationsRes.data.data);
                setAllCategory(categoriesRes.data.data);
                setAllSubCategory(subCategoriesRes.data.data);
                setAllChildCategory(childCategoriesRes.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this password?")) return;
        try {
            await axios.delete(route("ourpasswords.destroy", { id }));
            setReloadTrigger((prev) => !prev);
            toast.success("Password deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete password.");
        }
    };

    const handleEdit = (password) => {
        setEditingPassword(password);
        setShowEditForm(true);
    };

    const handleView = (password) => {
        setViewingPassword(password);
        setShowPopup(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourpasswords.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Error updating password", error);
            throw error;
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                Header: "Organization",
                accessor: "organization",
                Cell: ({ row }) => (
                    <span className="font-medium text-gray-800">
                        {row.original.organization?.name ?? "—"}
                    </span>
                ),
            },
            {
                Header: "Category",
                accessor: "category",
                Cell: ({ row }) => (
                    <span className="text-gray-600">
                        {row.original.category?.name ?? "—"}
                    </span>
                ),
            },
            {
                Header: "Username",
                accessor: "username",
                Cell: ({ value }) => (
                    <span className="text-gray-600 font-mono text-xs">{value}</span>
                ),
            },
            {
                Header: "Expiry Date",
                accessor: "expirydate",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{value || "—"}</span>
                ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleView(row.original)}
                            className="text-emerald-600 hover:text-emerald-800 transition duration-200"
                            title="View details"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-indigo-600 hover:text-indigo-900 transition duration-200"
                            title="Edit"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition duration-200"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <AdminWrapper>
            <Head title="Password" />
            <Toaster position="top-right" />
            <div className="container mx-auto py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Password
                    </h1>
                    <button
                        onClick={() => {
                            setEditingPassword(null);
                            setShowAddForm(true);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {loading ? (
                    <PageLoader />
                ) : (
                    <MyTable columns={columns} data={allPassword} />
                )}

                <PasswordPopup
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    password={viewingPassword}
                />

                <AddPasswordForm
                    showForm={showAddForm}
                    setShowForm={setShowAddForm}
                    setReloadTrigger={setReloadTrigger}
                    allOrganization={allOrganization}
                    allCategory={allCategory}
                    allSubCategory={allSubCategory}
                    allChildCategory={allChildCategory}
                />

                <EditPasswordForm
                    showForm={showEditForm}
                    setShowForm={setShowEditForm}
                    setReloadTrigger={setReloadTrigger}
                    editingPassword={editingPassword}
                    setEditingPassword={setEditingPassword}
                    handleUpdate={handleUpdate}
                    allOrganization={allOrganization}
                    allCategory={allCategory}
                    allSubCategory={allSubCategory}
                    allChildCategory={allChildCategory}
                />
            </div>
        </AdminWrapper>
    );
};

export default Password;
