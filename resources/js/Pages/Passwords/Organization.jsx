import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import AddOrganizationForm from "@/AddPasswordComponents/AddOrganizationForm";
import MyTable from "@/TableComponents/MyTable";
import EditOrganizationForm from "@/EditPasswordComponents/EditOrganizationForm";
import { Head } from "@inertiajs/react";
import PageLoader from "@/Loader/PageLoader";
import toast, { Toaster } from "react-hot-toast";

const Organization = () => {
    const [allOrganizations, setAllOrganizations] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingOrganization, setEditingOrganization] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrganizations = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourorganizations.index"));
                setAllOrganizations(response.data.data ?? response.data);
            } catch (error) {
                console.error("Fetching error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrganizations();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this organization?")) return;
        try {
            await axios.delete(route("ourorganizations.destroy", { id }));
            setReloadTrigger((prev) => !prev);
            toast.success("Organization deleted successfully!");
        } catch (error) {
            console.error("Delete error", error);
            toast.error("Failed to delete organization.");
        }
    };

    const handleEdit = (organization) => {
        setEditingOrganization(organization);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourorganizations.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );
        setReloadTrigger((prev) => !prev);
        return response.data;
    };

    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ value }) => (
                    <span className="font-medium text-gray-800">{value}</span>
                ),
            },
            {
                Header: "Domain",
                accessor: "domain",
                Cell: ({ value }) =>
                    value ? (
                        <a
                            href={value.startsWith("http") ? value : `https://${value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {value}
                        </a>
                    ) : (
                        <span>-</span>
                    ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
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
            <Head title="Organization" />
            <Toaster position="top-right" />
            <div className="container mx-auto py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Organizations
                    </h1>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {loading ? (
                    <PageLoader />
                ) : (
                    <MyTable columns={columns} data={allOrganizations} />
                )}

                <AddOrganizationForm
                    showForm={showAddForm}
                    setShowForm={setShowAddForm}
                    setReloadTrigger={setReloadTrigger}
                />

                <EditOrganizationForm
                    showForm={showEditForm}
                    setShowForm={setShowEditForm}
                    editingOrganization={editingOrganization}
                    setEditingOrganization={setEditingOrganization}
                    setReloadTrigger={setReloadTrigger}
                    handleUpdate={handleUpdate}
                />
            </div>
        </AdminWrapper>
    );
};

export default Organization;
