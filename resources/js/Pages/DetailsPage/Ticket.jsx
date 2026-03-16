// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Plus } from "lucide-react";
// import React, { useState } from "react";

// const Ticket = () => {
//     const [allTickets, setAllTickets] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTicket, setEditingTicket] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);


//         // For fetching the ticket data
//     useEffect(() => {
//         const fetchTickets = async () => {
//             try {
//                 const response = await axios.get(route("ourtickets.index"));
//                 setAllTickets(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchTickets();
//     }, [reloadTrigger]);

//     // For delete the ticket
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourtickets.destroy", { id: id })
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (ticket) => {
//         setEditingTicket(ticket);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourtickets.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating ticket", error);
//             throw error;
//         }
//     };
//     return (
//         <>
//             <AdminWrapper>
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
//                             Gallery
//                         </h1>
//                     </div>
//                     <button
//                         onClick={() => {
//                             setShowAddForm(true);
//                         }}
//                         className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default Ticket;



// import AddTicketForm from "@/AddFormComponents/AddTicketForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";


// const Ticket = () => {
//     const [allTickets, setAllTickets] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTicket, setEditingTicket] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);

//     useEffect(() => {
//         const fetchTickets = async () => {
//             try {
//                 const response = await axios.get(route("ourtickets.index"));
//                 setAllTickets(response.data.data); // fixed: was response.data
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         fetchTickets();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourtickets.destroy", { id })
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (ticket) => {
//         setEditingTicket(ticket);
//         setShowAddForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourtickets.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating ticket", error);
//             throw error;
//         }
//     };

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
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

//                 {/* Tickets Table */}
//                 <div className="overflow-x-auto rounded-xl shadow">
//                     <table className="min-w-full bg-white text-sm">
//                         <thead className="bg-indigo-50 text-indigo-700 uppercase tracking-widest text-xs">
//                             <tr>
//                                 <th className="px-4 py-3 text-left">Ticket ID</th>
//                                 <th className="px-4 py-3 text-left">Client</th>
//                                 <th className="px-4 py-3 text-left">Issue Type</th>
//                                 <th className="px-4 py-3 text-left">Device</th>
//                                 <th className="px-4 py-3 text-left">Priority</th>
//                                 <th className="px-4 py-3 text-left">Technician</th>
//                                 <th className="px-4 py-3 text-left">Status</th>
//                                 <th className="px-4 py-3 text-left">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {allTickets.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={8} className="text-center py-10 text-gray-400">
//                                         No tickets found.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 allTickets.map((ticket) => (
//                                     <tr key={ticket.id} className="hover:bg-gray-50 transition">
//                                         <td className="px-4 py-3 font-mono text-indigo-600">{ticket.ticket_id}</td>
//                                         <td className="px-4 py-3">{ticket.client_name}</td>
//                                         <td className="px-4 py-3">{ticket.issue_type}</td>
//                                         <td className="px-4 py-3">{ticket.device_type}</td>
//                                         <td className="px-4 py-3">
//                                             <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
//                                                 ticket.priority === "high"
//                                                     ? "bg-red-100 text-red-700"
//                                                     : ticket.priority === "medium"
//                                                     ? "bg-yellow-100 text-yellow-700"
//                                                     : "bg-green-100 text-green-700"
//                                             }`}>
//                                                 {ticket.priority}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-3">{ticket.assigned_technician || "—"}</td>
//                                         <td className="px-4 py-3">
//                                             <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
//                                                 ticket.status === "open"
//                                                     ? "bg-blue-100 text-blue-700"
//                                                     : ticket.status === "in_progress"
//                                                     ? "bg-orange-100 text-orange-700"
//                                                     : "bg-gray-100 text-gray-600"
//                                             }`}>
//                                                 {ticket.status}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-3 flex gap-2">
//                                             <button
//                                                 onClick={() => handleEdit(ticket)}
//                                                 className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition font-medium"
//                                             >
//                                                 Edit
//                                             </button>
//                                             <button
//                                                 onClick={() => handleDelete(ticket.id)}
//                                                 className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition font-medium"
//                                             >
//                                                 Delete
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </AdminWrapper>

//             {/* Add/Edit Form Modal */}
//             {showAddForm && (
//                 <AddTicketForm
//                     editingTicket={editingTicket}
//                     setEditingTicket={setEditingTicket}
//                     setShowForm={setShowAddForm}
//                     setReloadTrigger={setReloadTrigger}
//                     handleUpdate={handleUpdate}
//                 />
//             )}
//         </>
//     );
// };

// export default Ticket;

import AddTicketForm from "@/AddFormComponents/AddTicketForm";
import EditTicketForm from "@/EditFormComponents/EditTicketForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";

import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import MyTable from "@/TableComponents/MyTable";

const Ticket = () => {
    const [allTickets, setAllTickets] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(route("ourtickets.index"));
                setAllTickets(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        fetchTickets();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this ticket?')) {
            return;
        }
        
        try {
            const response = await axios.delete(
                route("ourtickets.destroy", { id })
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (ticket) => {
        setEditingTicket(ticket);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourtickets.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating ticket", error);
            throw error;
        }
    };

    // Define columns for react-table
    const columns = useMemo(
        () => [
            {
                Header: 'Ticket ID',
                accessor: 'ticket_id',
                Cell: ({ value }) => (
                    <span className="font-mono text-indigo-600">{value}</span>
                )
            },
            {
                Header: 'Client',
                accessor: 'client_name'
            },
            {
                Header: 'Issue Type',
                accessor: 'issue_type'
            },
            {
                Header: 'Device',
                accessor: 'device_type'
            },
            {
                Header: 'Priority',
                accessor: 'priority',
                Cell: ({ value }) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        value === "high"
                            ? "bg-red-100 text-red-700"
                            : value === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                    }`}>
                        {value}
                    </span>
                )
            },
            {
                Header: 'Technician',
                accessor: 'technician_name',
                Cell: ({ value }) => value || "—"
            },
            {
                Header: 'Status',
                accessor: 'status',
                Cell: ({ value }) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
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
                    }`}>
                        {value?.replace('_', ' ')}
                    </span>
                )
            },
            {
                Header: 'Actions',
                accessor: 'id',
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition font-medium"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition font-medium"
                        >
                            Delete
                        </button>
                    </div>
                )
            }
        ],
        [] // Empty dependency array since handleEdit and handleDelete are stable
    );

    return (
        <>
            <AdminWrapper>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
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

                {/* Tickets Table */}
                {allTickets.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-blue-100 shadow-sm">
                        No tickets found.
                    </div>
                ) : (
                    <MyTable columns={columns} data={allTickets} />
                )}
            </AdminWrapper>

            {/* Add Form Modal */}
            {showAddForm && (
                <AddTicketForm
                    setShowForm={setShowAddForm}
                    setReloadTrigger={setReloadTrigger}
                />
            )}

            {/* Edit Form Modal */}
            {showEditForm && editingTicket && (
                <EditTicketForm
                    editingTicket={editingTicket}
                    setEditingTicket={setEditingTicket}
                    setShowForm={setShowEditForm}
                    setReloadTrigger={setReloadTrigger}
                    handleUpdate={handleUpdate}
                />
            )}
        </>
    );
};

export default Ticket;