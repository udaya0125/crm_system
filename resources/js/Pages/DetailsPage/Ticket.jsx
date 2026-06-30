// import AddTicketForm from "@/AddFormComponents/AddTicketForm";
// import EditTicketForm from "@/EditFormComponents/EditTicketForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Edit, Plus, Trash2, Eye } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";
// import MyTable from "@/TableComponents/MyTable";
// import { Head } from "@inertiajs/react";
// import PageLoader from "@/Loader/PageLoader";
// import TicketPopup from "./TicketPopup";

// const Ticket = () => {
//     const [allTickets, setAllTickets] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [editingTicket, setEditingTicket] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [viewingTicket, setViewingTicket] = useState(null); // 👈 new

//     useEffect(() => {
//         const fetchTickets = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(route("ourtickets.index"));
//                 setAllTickets(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchTickets();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this ticket?")) {
//             return;
//         }

//         try {
//             const response = await axios.delete(
//                 route("ourtickets.destroy", { id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (ticket) => {
//         setEditingTicket(ticket);
//         setShowEditForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourtickets.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating ticket", error);
//             throw error;
//         }
//     };

//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S.N.",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
//             {
//                 Header: "Ticket Details",
//                 accessor: "ticket_id",
//                 Cell: ({ row }) => (
//                     <div className="flex flex-col">
//                         <span className="font-mono text-indigo-600 font-semibold">
//                             {row.original.ticket_id}
//                         </span>
//                         <span className="text-gray-700">
//                             {row.original.client_name}
//                         </span>
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Category",
//                 accessor: "issue_type",
//             },
//             {
//                 Header: "Priority",
//                 accessor: "priority",
//                 Cell: ({ value }) => (
//                     <span
//                         className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
//                             value === "high"
//                                 ? "bg-red-100 text-red-700"
//                                 : value === "medium"
//                                   ? "bg-yellow-100 text-yellow-700"
//                                   : "bg-green-100 text-green-700"
//                         }`}
//                     >
//                         {value}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Technician",
//                 accessor: "technician_name",
//                 Cell: ({ value }) => value || "—",
//             },
//             {
//                 Header: "Status",
//                 accessor: "status",
//                 Cell: ({ value }) => (
//                     <span
//                         className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
//                             value === "open"
//                                 ? "bg-blue-100 text-blue-700"
//                                 : value === "in_progress"
//                                   ? "bg-orange-100 text-orange-700"
//                                   : value === "waiting_parts"
//                                     ? "bg-purple-100 text-purple-700"
//                                     : value === "client_approval"
//                                       ? "bg-yellow-100 text-yellow-700"
//                                       : value === "completed"
//                                         ? "bg-green-100 text-green-700"
//                                         : "bg-gray-100 text-gray-600"
//                         }`}
//                     >
//                         {value?.replace("_", " ")}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Actions",
//                 accessor: "id",
//                 Cell: ({ row }) => (
//                     <div className="flex gap-2">
//                         {/* 👁 View */}
//                         <button
//                             onClick={() => setViewingTicket(row.original)}
//                             className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
//                             title="View ticket"
//                         >
//                             <Eye size={16} />
//                         </button>
//                         {/* ✏️ Edit */}
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
//                             title="Edit ticket"
//                         >
//                             <Edit size={16} />
//                         </button>
//                         {/* 🗑 Delete */}
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                             title="Delete ticket"
//                         >
//                             <Trash2 size={16} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [],
//     );

//     return (
//         <div>
//             <AdminWrapper>
//                 <Head title="Tickets" />
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                             Tickets
//                         </h1>
//                     </div>
//                     <button
//                         onClick={() => {
//                             setEditingTicket(null);
//                             setShowAddForm(true);
//                         }}
//                         className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 {loading ? (
//                     <PageLoader />
//                 ) : (
//                     <MyTable columns={columns} data={allTickets} />
//                 )}
//             </AdminWrapper>

//             {/* Add Form Modal */}
//             {showAddForm && (
//                 <AddTicketForm
//                     setShowForm={setShowAddForm}
//                     setReloadTrigger={setReloadTrigger}
//                 />
//             )}

//             {/* Edit Form Modal */}
//             {showEditForm && editingTicket && (
//                 <EditTicketForm
//                     editingTicket={editingTicket}
//                     setEditingTicket={setEditingTicket}
//                     setShowForm={setShowEditForm}
//                     setReloadTrigger={setReloadTrigger}
//                     handleUpdate={handleUpdate}
//                 />
//             )}

//             {/* View Ticket Popup */}
//             {viewingTicket && (
//                 <TicketPopup
//                     ticket={viewingTicket}
//                     onClose={() => setViewingTicket(null)}
//                 />
//             )}
//         </div>
//     );
// };

// export default Ticket;

import AddTicketForm from "@/AddFormComponents/AddTicketForm";
import EditTicketForm from "@/EditFormComponents/EditTicketForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Edit, Plus, Trash2, Eye } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import MyTable from "@/TableComponents/MyTable";
import { Head } from "@inertiajs/react";
import PageLoader from "@/Loader/PageLoader";
import TicketPopup from "./TicketPopup";
import toast, { Toaster } from "react-hot-toast";

const Ticket = () => {
    const [allTickets, setAllTickets] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [viewingTicket, setViewingTicket] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourtickets.index"));
                setAllTickets(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
                toast.error("Failed to load tickets.");
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, [reloadTrigger]);

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this ticket?"))
            return;

        toast.promise(axios.delete(route("ourtickets.destroy", { id })), {
            loading: "Deleting ticket...",
            success: () => {
                setReloadTrigger((prev) => !prev);
                return "Ticket deleted successfully!";
            },
            error: "Failed to delete ticket.",
        });
    };

    const handleEdit = (ticket) => {
        setEditingTicket(ticket);
        setShowEditForm(true);
    };

    // No try/catch here — child's toast.promise handles errors
    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourtickets.update", { id }),
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
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Ticket Details",
                accessor: "ticket_id",
                Cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-mono text-indigo-600 font-semibold">
                            {row.original.ticket_id}
                        </span>
                        <span className="text-gray-700">
                            {row.original.client_name}
                        </span>
                    </div>
                ),
            },
            {
                Header: "Category",
                accessor: "issue_type",
            },
            {
                Header: "Priority",
                accessor: "priority",
                Cell: ({ value }) => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                            value === "high"
                                ? "bg-red-100 text-red-700"
                                : value === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-kkkgreen-700"
                        }`}
                    >
                        {value}
                    </span>
                ),
            },
            {
                Header: "Technician",
                accessor: "technician_name",
                Cell: ({ value }) => value || "—",
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                            value === "open"
                                ? "bg-blue-100 text-blue-700"
                                : value === "in_progress"
                                  ? "bg-orange-100 text-orange-700"
                                  : value === "waiting_parts"
                                    ? "bg-purple-100 text-purple-700"
                                    : value === "client_approval"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : value === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {value?.replace("_", " ")}
                    </span>
                ),
            },
            {
                Header: "Created At",
                accessor: "created_at",
                Cell: ({ value }) => (
                    <div className="flex flex-col">
                        <span className="text-gray-700">
                            {new Date(value).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                        <span className="text-gray-400 text-xs">
                            {new Date(value).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                            })}
                        </span>
                    </div>
                ),
            },
            {
                Header: "Actions",
                accessor: "id",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewingTicket(row.original)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                            title="View ticket"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit ticket"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete ticket"
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
        <div>
            <AdminWrapper>
                <Toaster position="top-right" />
                <Head title="Tickets" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                            Tickets
                        </h1>
                    </div>
                    <button
                        onClick={() => {
                            setEditingTicket(null);
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
                    <MyTable columns={columns} data={allTickets} />
                )}
            </AdminWrapper>

            {showAddForm && (
                <AddTicketForm
                    setShowForm={setShowAddForm}
                    setReloadTrigger={setReloadTrigger}
                />
            )}

            {showEditForm && editingTicket && (
                <EditTicketForm
                    editingTicket={editingTicket}
                    setEditingTicket={setEditingTicket}
                    setShowForm={setShowEditForm}
                    setReloadTrigger={setReloadTrigger}
                    handleUpdate={handleUpdate}
                />
            )}

            {viewingTicket && (
                <TicketPopup
                    ticket={viewingTicket}
                    onClose={() => setViewingTicket(null)}
                />
            )}
        </div>
    );
};

export default Ticket;
