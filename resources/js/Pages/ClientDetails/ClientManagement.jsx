// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const ClientManagement = () => {
//     const [allClients, setAllClients] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingClient, setEditingClient] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);

//     // For fetching the client data
//     useEffect(() => {
//         const fetchClients = async () => {
//             try {
//                 const response = await axios.get(route("clients.index"));
//                 setAllClients(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchClients();
//     }, [reloadTrigger]);

//     // For delete the client
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("clients.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (client) => {
//         setEditingClient(client);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("clients.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating client", error);
//             throw error;
//         }
//     };
//     return (
//         <>
//             <AdminWrapper>
//                 <div className="container mx-auto py-4">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
//                             Clients
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
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default ClientManagement;


import AddClientManagement from "@/AddFormComponents/AddClientManagement";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";


const ClientManagement = () => {
    const [allClients, setAllClients] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(
                    route("ourclientmanagement.index") // fixed route name
                );
                setAllClients(response.data.data); // fixed: was response.data
            } catch (error) {
                console.error("Fetching error:", error);
            }
        };
        fetchClients();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this client?")) return;
        try {
            await axios.delete(route("ourclientmanagement.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setShowAddForm(true);
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourclientmanagement.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        setReloadTrigger((prev) => !prev);
        return response.data;
    };

    return (
        <AdminWrapper>
            <div className="container mx-auto py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                        Clients
                    </h1>
                    <button
                        onClick={() => {
                            setEditingClient(null);
                            setShowAddForm(true);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {/* Client Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Company</th>
                                <th className="px-4 py-3">Contact</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Service</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allClients.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center py-10 text-gray-400"
                                    >
                                        No clients found.
                                    </td>
                                </tr>
                            ) : (
                                allClients.map((client) => (
                                    <tr
                                        key={client.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-3 font-medium text-stone-800">
                                            {client.company_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {client.contact_person || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {client.phone || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {client.service_type || "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    client.payment_status === "Paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : client.payment_status === "Overdue"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {client.payment_status || "—"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(client)}
                                                className="text-indigo-600 hover:underline text-xs font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(client.id)}
                                                className="text-red-500 hover:underline text-xs font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showAddForm && (
                <AddClientManagement
                    reloadTrigger={reloadTrigger}
                    setReloadTrigger={setReloadTrigger}
                    editingClient={editingClient}
                    setEditingClient={setEditingClient}
                    setShowForm={setShowAddForm}
                    handleUpdate={handleUpdate}
                />
            )}
        </AdminWrapper>
    );
};

export default ClientManagement;