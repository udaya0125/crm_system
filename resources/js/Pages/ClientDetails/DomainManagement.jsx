// import AddDomainForm from "@/AddFormComponents/AddDomainForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const DomainManagement = () => {
//     const [allDomain, setAllDomain] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingDomain, setEditingDomain] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);

//     useEffect(() => {
//         const fetchDomain = async () => {
//             try {
//                 const response = await axios.get(route("ourdomains.index")); // ✅ fixed route name
//                 setAllDomain(response.data.data); // ✅ fixed: was response.data, now response.data.data
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         fetchDomain();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(route("ourdomains.destroy", { id })); // ✅ fixed route name
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (domain) => {
//         setEditingDomain(domain);
//         setShowAddForm(true); // ✅ open the form when editing
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourdomains.update", { id }), // ✅ fixed route name
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating domain", error);
//             throw error;
//         }
//     };

//     const handleCloseForm = () => {
//         setShowAddForm(false);
//         setEditingDomain(null);
//     };

//     return (
//         <AdminWrapper>
//             <div className="container mx-auto py-4">
//                 {/* Header */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
//                         Domain Management
//                     </h1>
//                     <button
//                         onClick={() => setShowAddForm(true)}
//                         className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 {/* Domain Table */}
//                 <div className="overflow-x-auto rounded-xl shadow">
//                     <table className="min-w-full bg-white text-sm">
//                         <thead className="bg-indigo-600 text-white uppercase tracking-wider text-xs">
//                             <tr>
//                                 <th className="px-4 py-3 text-left">#</th>
//                                 <th className="px-4 py-3 text-left">Domain</th>
//                                 <th className="px-4 py-3 text-left">Client</th>
//                                 <th className="px-4 py-3 text-left">Registrar</th>
//                                 <th className="px-4 py-3 text-left">Purchase</th>
//                                 <th className="px-4 py-3 text-left">Expiry</th>
//                                 <th className="px-4 py-3 text-left">Auto Renewal</th>
//                                 <th className="px-4 py-3 text-left">DNS</th>
//                                 <th className="px-4 py-3 text-left">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {allDomain.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={9} className="text-center py-8 text-gray-400">
//                                         No domains found.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 allDomain.map((domain, index) => (
//                                     <tr key={domain.id} className="hover:bg-gray-50 transition">
//                                         <td className="px-4 py-3">{index + 1}</td>
//                                         <td className="px-4 py-3 font-medium text-indigo-700">{domain.domain_name}</td>
//                                         <td className="px-4 py-3">{domain.client?.organization_name ?? domain.client?.name ?? "—"}</td>
//                                         <td className="px-4 py-3">{domain.register}</td>
//                                         <td className="px-4 py-3">{domain.purchase_date}</td>
//                                         <td className="px-4 py-3">{domain.expiry_date}</td>
//                                         <td className="px-4 py-3">
//                                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                                                 domain.auto_renewal_status === "active"
//                                                     ? "bg-green-100 text-green-700"
//                                                     : "bg-red-100 text-red-600"
//                                             }`}>
//                                                 {domain.auto_renewal_status}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-3">{domain.dns_provider ?? "—"}</td>
//                                         <td className="px-4 py-3 flex gap-2">
//                                             <button
//                                                 onClick={() => handleEdit(domain)}
//                                                 className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs hover:bg-amber-600 transition"
//                                             >
//                                                 Edit
//                                             </button>
//                                             <button
//                                                 onClick={() => handleDelete(domain.id)}
//                                                 className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition"
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
//             </div>

//             {/* ✅ Pass all required props to AddDomainForm */}
//             {showAddForm && (
//                 <AddDomainForm
//                     editingDomain={editingDomain}
//                     handleUpdate={handleUpdate}
//                     setReloadTrigger={setReloadTrigger}
//                     onClose={handleCloseForm}
//                 />
//             )}
//         </AdminWrapper>
//     );
// };

// export default DomainManagement;

import AddDomainForm from "@/AddFormComponents/AddDomainForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

const DomainManagement = () => {
    const [allDomain, setAllDomain] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingDomain, setEditingDomain] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const fetchDomain = async () => {
            try {
                const response = await axios.get(route("ourdomains.index"));
                setAllDomain(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        fetchDomain();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(route("ourdomains.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (domain) => {
        setEditingDomain(domain);
        setShowAddForm(true);
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

    const handleCloseForm = () => {
        setShowAddForm(false);
        setEditingDomain(null);
    };

    // Define columns for MyTable
    const columns = useMemo(
        () => [
            {
                Header: "#",
                accessor: (row, index) => index + 1,
                id: "serial",
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
            <div className="container mx-auto py-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
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

                {/* MyTable Component */}
                <MyTable columns={columns} data={allDomain} />
            </div>

            {/* Add/Edit Domain Form */}
            {showAddForm && (
                <AddDomainForm
                    editingDomain={editingDomain}
                    handleUpdate={handleUpdate}
                    setReloadTrigger={setReloadTrigger}
                    onClose={handleCloseForm}
                />
            )}
        </AdminWrapper>
    );
};

export default DomainManagement;
