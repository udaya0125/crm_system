import { Edit, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import AddOrganizationForm from "@/AddPasswordComponents/AddOrganizationForm";
import MyTable from "@/TableComponents/MyTable";
import EditOrganizationForm from "@/EditPasswordComponents/EditOrganizationForm";
import { Head } from "@inertiajs/react";
import PageLoader from "@/Loader/PageLoader";

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
                const response = await axios.get(
                    route("ourorganizations.index"),
                );
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
        if (!confirm("Are you sure you want to delete this organization?"))
            return;
        try {
            await axios.delete(route("ourorganizations.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error", error);
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
        // setReloadTrigger((prev) => !prev);
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
                Cell: ({ value }) => <span className="font-medium text-gray-800">{value}</span>,
            },
            {
                Header: "Domain",
                accessor: "domain",
                Cell: ({ value }) => (
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
                    )
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
        []
    );

    return (
        <AdminWrapper>
            <Head title="Organization " />
            <div className="container mx-auto py-4">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                    Organizations 
                </h1>
                <button
                    onClick={() => {
                        setShowAddForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* <MyTable 
                columns={columns} 
                data={allOrganizations} 
                loading={loading}
            /> */}

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


// import { Edit, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import AddOrganizationForm from "@/AddPasswordComponents/AddOrganizationForm";
// import MyTable from "@/TableComponents/MyTable";
// import EditOrganizationForm from "@/EditPasswordComponents/EditOrganizationForm";
// import { Head } from "@inertiajs/react";
// import PageLoader from "@/Loader/PageLoader";

// const Organization = () => {
//     const [allOrganizations, setAllOrganizations] = useState([]);
//     const [editingOrganization, setEditingOrganization] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchOrganizations = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourorganizations.index"));
//                 setAllOrganizations(response.data.data ?? response.data);
//             } catch (error) {
//                 console.error("Fetching error", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchOrganizations();
//     }, []);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this organization?")) return;
//         try {
//             await axios.delete(route("ourorganizations.destroy", { id }));
//             setAllOrganizations((prev) => prev.filter((org) => org.id !== id));
//         } catch (error) {
//             console.error("Delete error", error);
//         }
//     };

//     const handleEdit = (organization) => {
//         setEditingOrganization(organization);
//         setShowEditForm(true);
//     };

//     const handleCreate = (newOrg) => {
//         setAllOrganizations((prev) => [...prev, newOrg]);
//     };

//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourorganizations.update", { id }),
//             formData,
//             { headers: { "Content-Type": "multipart/form-data" } },
//         );
//         const updated = response.data.data ?? response.data;
//         setAllOrganizations((prev) =>
//             prev.map((org) => (org.id === id ? { ...org, ...updated } : org))
//         );
//         return response.data;
//     };

//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S.N.",
//                 accessor: "index",
//                 Cell: ({ row }) => <span>{row.index + 1}</span>,
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//                 Cell: ({ value }) => (
//                     <span className="font-medium text-gray-800">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Domain",
//                 accessor: "domain",
//                 Cell: ({ value }) =>
//                     value ? (
//                         <a
//                             href={value.startsWith("http") ? value : `https://${value}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:underline"
//                         >
//                             {value}
//                         </a>
//                     ) : (
//                         <span>-</span>
//                     ),
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
//                             title="Edit"
//                         >
//                             <Edit size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
//                             title="Delete"
//                         >
//                             <Trash2 size={16} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         []
//     );

//     return (
//         <AdminWrapper>
//             <Head title="Organization" />
//             <div className="container mx-auto py-4">
//                 <div className="mb-8 flex justify-between items-center">
//                     <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                         Organizations
//                     </h1>
//                     <button
//                         onClick={() => setShowAddForm(true)}
//                         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                     >
//                         <Plus size={18} />
//                         <span>Create</span>
//                     </button>
//                 </div>

//                 {loading ? (
//                     <PageLoader />
//                 ) : (
//                     <MyTable columns={columns} data={allOrganizations} />
//                 )}

//                 <AddOrganizationForm
//                     showForm={showAddForm}
//                     setShowForm={setShowAddForm}
//                     onCreated={handleCreate}
//                 />

//                 <EditOrganizationForm
//                     showForm={showEditForm}
//                     setShowForm={setShowEditForm}
//                     editingOrganization={editingOrganization}
//                     setEditingOrganization={setEditingOrganization}
//                     handleUpdate={handleUpdate}
//                 />
//             </div>
//         </AdminWrapper>
//     );
// };

// export default Organization;


// import { Pencil, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import AddOrganizationForm from "@/AddFormComponents/AddOrganizationForm";

// const Organization = () => {
//     const [allOrganizations, setAllOrganizations] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingOrganization, setEditingOrganization] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     useEffect(() => {
//         const fetchOrganizations = async () => {
//             try {
//                 const response = await axios.get(
//                     route("ourorganizations.index"),
//                 );
//                 // Controller returns { status, data } — unwrap it
//                 setAllOrganizations(response.data.data ?? response.data);
//             } catch (error) {
//                 console.error("Fetching error", error);
//             }
//         };
//         fetchOrganizations();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this organization?"))
//             return;
//         try {
//             await axios.delete(route("ourorganizations.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Delete error", error);
//         }
//     };

//     const handleEdit = (organization) => {
//         setEditingOrganization(organization); // useEffect in form opens it automatically
//     };

//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourorganizations.update", { id }),
//             formData,
//             { headers: { "Content-Type": "multipart/form-data" } },
//         );
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//     };

//     return (
//         <AdminWrapper>
//             {/* Page Header */}
//             <div className="mb-8 flex justify-between items-center">
//                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                     Organizations Management
//                 </h1>
//                 <button
//                     onClick={() => {
//                         setEditingOrganization(null);
//                         setShowForm(true);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* Table */}
//             <div className="bg-white rounded-xl shadow overflow-hidden">
//                 <table className="w-full text-sm text-left">
//                     <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
//                         <tr>
//                             <th className="px-6 py-3">#</th>
//                             <th className="px-6 py-3">Name</th>
//                             <th className="px-6 py-3">Domain</th>
//                             <th className="px-6 py-3 text-right">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                         {allOrganizations.length === 0 ? (
//                             <tr>
//                                 <td
//                                     colSpan={4}
//                                     className="px-6 py-10 text-center text-gray-400"
//                                 >
//                                     No organizations found.
//                                 </td>
//                             </tr>
//                         ) : (
//                             allOrganizations.map((item, index) => (
//                                 <tr
//                                     key={item.id}
//                                     className="hover:bg-gray-50 transition"
//                                 >
//                                     <td className="px-6 py-4 text-gray-500">
//                                         {index + 1}
//                                     </td>
//                                     <td className="px-6 py-4 font-medium text-gray-800">
//                                         {item.name}
//                                     </td>
//                                     <td className="px-6 py-4 text-gray-600">
//                                         {item.domain ? (
//                                             <a
//                                                 href={
//                                                     item.domain.startsWith(
//                                                         "http",
//                                                     )
//                                                         ? item.domain
//                                                         : `https://${item.domain}`
//                                                 }
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-blue-600 hover:underline"
//                                             >
//                                                 {item.domain}
//                                             </a>
//                                         ) : (
//                                             "-"
//                                         )}
//                                     </td>
//                                     <td className="px-6 py-4 flex justify-end gap-2">
//                                         <button
//                                             onClick={() => handleEdit(item)}
//                                             className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
//                                             title="Edit"
//                                         >
//                                             <Pencil size={16} />
//                                         </button>
//                                         <button
//                                             onClick={() =>
//                                                 handleDelete(item.id)
//                                             }
//                                             className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
//                                             title="Delete"
//                                         >
//                                             <Trash2 size={16} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Modal Form */}
//             <AddOrganizationForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingOrganization={editingOrganization}
//                 setEditingOrganization={setEditingOrganization}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default Organization;