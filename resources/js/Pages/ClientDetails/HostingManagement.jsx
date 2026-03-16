import AddHostingForm from "@/AddFormComponents/AddHostingForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const HostingManagement = () => {
    const [allHosting, setAllHosting] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingHosting, setEditingHosting] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // For fetching the Hosting data
    useEffect(() => {
        const fetchHosting = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourhostings.index"));
                
                // Check if response.data is an array, if not, extract the array
                let hostingData = response.data;
                
                // Handle different possible response structures
                if (Array.isArray(hostingData)) {
                    setAllHosting(hostingData);
                } else if (hostingData && typeof hostingData === 'object') {
                    // Check for common pagination patterns
                    if (hostingData.data && Array.isArray(hostingData.data)) {
                        // Laravel pagination returns { data: [...] }
                        setAllHosting(hostingData.data);
                    } else if (hostingData.hostings && Array.isArray(hostingData.hostings)) {
                        // Custom wrapped response
                        setAllHosting(hostingData.hostings);
                    } else {
                        // If it's a single object, wrap it in an array
                        // Or if it's an object with numeric keys, convert to array
                        const possibleArray = Object.values(hostingData).filter(item => 
                            item && typeof item === 'object' && !Array.isArray(item)
                        );
                        
                        if (possibleArray.length > 0) {
                            setAllHosting(possibleArray);
                        } else {
                            console.warn("Unexpected data format:", hostingData);
                            setAllHosting([]); // Set empty array as fallback
                        }
                    }
                } else {
                    console.warn("Data is not an array or object:", hostingData);
                    setAllHosting([]); // Set empty array as fallback
                }
            } catch (error) {
                console.error("fetching error ", error);
                setAllHosting([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchHosting();
    }, [reloadTrigger]);

    // For delete the hosting
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this hosting?")) {
            try {
                const response = await axios.delete(
                    route("ourhostings.destroy", { id: id }),
                );
                console.log(response.data);
                setReloadTrigger((prev) => !prev);
            } catch (error) {
                console.log(error);
            }
        }
    };

    // handleedit
    const handleEdit = (hosting) => {
        setEditingHosting(hosting);
        setShowAddForm(true);
    };

    // Handlapdate after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourhostings.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating hosting", error);
            throw error;
        }
    };

    // Define table columns
    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
            },
            {
                Header: "Client Name",
                accessor: "client_name",
                Cell: ({ value }) => value || "N/A",
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
                    if (!renewalDate) return <span className="text-gray-500">N/A</span>;
                    
                    const today = new Date();
                    const renewal = new Date(renewalDate);
                    const daysUntilRenewal = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24));
                    
                    if (daysUntilRenewal < 0) {
                        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Expired</span>;
                    } else if (daysUntilRenewal <= 7) {
                        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Expiring Soon</span>;
                    } else {
                        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>;
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
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    // Log the data to debug
    console.log("allHosting data:", allHosting);
    console.log("Is array:", Array.isArray(allHosting));

    return (
        <>
            <AdminWrapper>
                <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                                Hosting Management
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage all your hosting plans and subscriptions
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setShowAddForm(true);
                                setEditingHosting(null);
                            }}
                            className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <Plus size={18} />
                            Create New Hosting
                        </button>
                    </div>

                    {/* Table Component */}
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                            <p className="mt-2 text-gray-600">Loading hosting data...</p>
                        </div>
                    ) : (
                        <MyTable 
                            columns={columns} 
                            data={Array.isArray(allHosting) ? allHosting : []} 
                        />
                    )}

                    {/* Add/Edit Form Modal */}
                    {(showAddForm || editingHosting) && (
                        <AddHostingForm
                            editingHosting={editingHosting}
                            setShowAddForm={setShowAddForm}
                            setEditingHosting={setEditingHosting}
                            setReloadTrigger={setReloadTrigger}
                            handleUpdate={handleUpdate}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default HostingManagement;