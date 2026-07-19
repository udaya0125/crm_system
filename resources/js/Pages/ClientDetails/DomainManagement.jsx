import AddDomainForm from "@/AddFormComponents/AddDomainForm";
import EditDomainForm from "@/EditFormComponents/EditDomainForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { Head } from "@inertiajs/react";
import PageLoader from "@/Loader/PageLoader";
import toast, { Toaster } from "react-hot-toast";

const DomainManagement = () => {
    const [allDomain, setAllDomain] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingDomain, setEditingDomain] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        const fetchDomain = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourdomains.index"));
                setAllDomain(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDomain();
    }, [reloadTrigger]);

    // const handleDelete = async (id) => {
    //     toast.promise(
    //         axios.delete(route("ourdomains.destroy", { id })).then(() => {
    //             setReloadTrigger((prev) => !prev);
    //         }),
    //         {
    //             loading: "Deleting domain...",
    //             success: "Domain deleted successfully!",
    //             error: "Failed to delete domain.",
    //         }
    //     );
    // };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this domain?")) return;
        try {
            await axios.delete(route("ourdomains.destroy", { id }));
            setReloadTrigger((prev) => !prev);
            toast.success("Domain deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete domain.");
        }
    };

    const handleEdit = (domain) => {
        setEditingDomain(domain);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourdomains.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating domain", error);
            throw error;
        }
    };

    const handleCloseAdd = () => {
        setShowAddForm(false);
    };

    const handleCloseEdit = () => {
        setShowEditForm(false);
        setEditingDomain(null);
    };

    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                Header: "Domain",
                accessor: "domain_name",
                Cell: ({ value }) => (
                    <a
                        href={`https://${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-indigo-700 hover:text-indigo-900 hover:underline"
                    >
                        {value}
                    </a>
                ),
            },
            {
                Header: "Client",
                accessor: (row) =>
                    row.client?.organization_name ?? row.client?.name ?? "—",
                id: "client",
            },
            {
                Header: "Registrar",
                accessor: "register",
            },
            {
                Header: "Purchase",
                accessor: "purchase_date",
            },
            {
                Header: "Expiry",
                accessor: "expiry_date",
            },
            {
                Header: "Auto Renewal",
                accessor: "auto_renewal_status",
                Cell: ({ value }) => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            value === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                        }`}
                    >
                        {value}
                    </span>
                ),
            },
            {
                Header: "DNS",
                accessor: (row) => row.dns_provider ?? "—",
                id: "dns",
            },
            {
                Header: "Actions",
                id: "actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
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
            <Head title="Domain Management" />

            {/* Toast container — position top-right, indigo accent */}
            {/* <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: "8px",
                        fontSize: "14px",
                    },
                    success: {
                        iconTheme: {
                            primary: "#6366f1",
                            secondary: "#fff",
                        },
                    },
                }}
            /> */}
            <Toaster position="top-right" />

            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Domain Management
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
                    <MyTable columns={columns} data={allDomain} />
                )}
            </div>

            {/* Add Domain Form */}
            {showAddForm && (
                <AddDomainForm
                    setReloadTrigger={setReloadTrigger}
                    onClose={handleCloseAdd}
                />
            )}

            {/* Edit Domain Form */}
            {showEditForm && editingDomain && (
                <EditDomainForm
                    editingDomain={editingDomain}
                    handleUpdate={handleUpdate}
                    onClose={handleCloseEdit}
                />
            )}
        </AdminWrapper>
    );
};

export default DomainManagement;

