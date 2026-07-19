import AddHostingForm from "@/AddFormComponents/AddHostingForm";
import EditHostingForm from "@/EditFormComponents/EditHostingForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import PageLoader from "@/Loader/PageLoader";
import toast, { Toaster } from "react-hot-toast";

const HostingManagement = () => {
    const [allHosting, setAllHosting] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingHosting, setEditingHosting] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHosting = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourhostings.index"));
                let hostingData = response.data;

                if (Array.isArray(hostingData)) {
                    setAllHosting(hostingData);
                } else if (hostingData && typeof hostingData === "object") {
                    if (hostingData.data && Array.isArray(hostingData.data)) {
                        setAllHosting(hostingData.data);
                    } else if (
                        hostingData.hostings &&
                        Array.isArray(hostingData.hostings)
                    ) {
                        setAllHosting(hostingData.hostings);
                    } else {
                        const possibleArray = Object.values(hostingData).filter(
                            (item) =>
                                item &&
                                typeof item === "object" &&
                                !Array.isArray(item),
                        );
                        setAllHosting(
                            possibleArray.length > 0 ? possibleArray : [],
                        );
                    }
                } else {
                    setAllHosting([]);
                }
            } catch (error) {
                console.error("Fetching error", error);
                setAllHosting([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHosting();
    }, [reloadTrigger]);

    // Delete hosting
    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this hosting?"))
            return;

        toast.promise(axios.delete(route("ourhostings.destroy", { id })), {
            loading: "Deleting hosting...",
            success: () => {
                setReloadTrigger((prev) => !prev);
                return "Hosting deleted successfully!";
            },
            error: "Failed to delete hosting.",
        });
    };

    const handleEdit = (hosting) => {
        setEditingHosting(hosting);
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourhostings.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );
        return response.data;
    };

    const columns = React.useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                Header: "Client",
                accessor: (row) =>
                    row.client?.organization_name ?? row.client?.name ?? "—",
                id: "client",
            },
            {
                Header: "Hosting Plan",
                accessor: "hosting_plan",
            },
            {
                Header: "Hosting Provider",
                accessor: "hosting_provider",
            },
            {
                Header: "Disk Usage",
                accessor: "disk_usage",
                Cell: ({ value }) => value || "N/A",
            },
            {
                Header: "Renewal Date",
                accessor: "renewal_date",
                Cell: ({ value }) => {
                    if (!value) return "N/A";
                    return new Date(value).toLocaleDateString();
                },
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ row }) => {
                    const renewalDate = row.original.renewal_date;
                    if (!renewalDate)
                        return <span className="text-gray-500">N/A</span>;

                    const today = new Date();
                    const renewal = new Date(renewalDate);
                    const daysUntilRenewal = Math.ceil(
                        (renewal - today) / (1000 * 60 * 60 * 24),
                    );

                    if (daysUntilRenewal < 0) {
                        return (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Expired
                            </span>
                        );
                    } else if (daysUntilRenewal <= 7) {
                        return (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                Expiring Soon
                            </span>
                        );
                    } else {
                        return (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Active
                            </span>
                        );
                    }
                },
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
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
            <Toaster position="top-right" />
            <Head title="Hosting Management" />
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                            Hosting Management
                        </h1>
                    </div>
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
                    <MyTable
                        columns={columns}
                        data={Array.isArray(allHosting) ? allHosting : []}
                    />
                )}

                {showAddForm && (
                    <AddHostingForm
                        setShowAddForm={setShowAddForm}
                        setReloadTrigger={setReloadTrigger}
                    />
                )}

                {editingHosting && (
                    <EditHostingForm
                        editingHosting={editingHosting}
                        setEditingHosting={setEditingHosting}
                        setReloadTrigger={setReloadTrigger}
                        handleUpdate={handleUpdate}
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default HostingManagement;
