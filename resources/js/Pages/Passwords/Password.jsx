// import axios from "axios";
// import { Edit, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import AddPasswordForm from "@/AddPasswordComponents/AddPasswordForm";
// import MyTable from "@/TableComponents/MyTable";
// import EditPasswordForm from "@/EditPasswordComponents/EditPasswordForm";
// import { Head } from "@inertiajs/react";
// import PageLoader from "@/Loader/PageLoader";

// const Password = () => {
//     const [allPassword, setAllPassword] = useState([]);
//     const [allOrganization, setAllOrganization] = useState([]);
//     const [allCategory, setAllCategory] = useState([]);
//     const [allSubCategory, setAllSubCategory] = useState([]);
//     const [allChildCategory, setAllChildCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingPassword, setEditingPassword] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchPassword = async () => {
//             try {
//                 const response = await axios.get(route("ourpasswords.index"));
//                 setAllPassword(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         const fetchOrganization = async () => {
//             try {
//                 const response = await axios.get(route("ourorganizations.index"));
//                 setAllOrganization(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 setAllCategory(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         const fetchSubCategory = async () => {
//             try {
//                 const response = await axios.get(route("oursubcategories.index"));
//                 setAllSubCategory(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         const fetchChildCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourchildcategories.index"));
//                 setAllChildCategory(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         setLoading(true);
//         Promise.all([
//             fetchPassword(),
//             fetchOrganization(),
//             fetchCategory(),
//             fetchSubCategory(),
//             fetchChildCategory()
//         ]).finally(() => setLoading(false));
//     }, [reloadTrigger]);

//     console.log("All Passwords: ", allPassword);

//     // Delete password
//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this password?")) return;
//         try {
//             await axios.delete(route("ourpasswords.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     // Open form for editing
//     const handleEdit = (password) => {
//         setEditingPassword(password);
//         setShowEditForm(true);
//     };

//     // Update existing password
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourpasswords.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error updating password", error);
//             throw error;
//         }
//     };

//     // Define table columns
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S.N.",
//                 accessor: "index",
//                 Cell: ({ row }) => <span>{row.index + 1}</span>,
//             },
//             {
//                 Header: "Organization",
//                 accessor: "organization",
//                 Cell: ({ row }) => (
//                     <span className="font-medium text-gray-800">
//                         {row.original.organization?.name ?? "—"}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Category",
//                 accessor: "category",
//                 Cell: ({ row }) => (
//                     <span className="text-gray-600">
//                         {row.original.category?.name ?? "—"}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Username",
//                 accessor: "username",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-600 font-mono text-xs">
//                         {value}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Expiry Date",
//                 accessor: "expirydate",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-600">
//                         {value || "—"}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="text-indigo-600 hover:text-indigo-900 transition duration-200"
//                         >
//                           <Edit size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="text-red-600 hover:text-red-900 transition duration-200"
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
//             <Head title="Password " />
//             <div className="container mx-auto py-4">
//             <div className="mb-8 flex justify-between items-center">
//                 <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
//                     Password 
//                 </h1>
//                 <button
//                     onClick={() => {
//                         setEditingPassword(null);
//                         setShowAddForm(true);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* Password Table */}
//             {/* <MyTable
//                 columns={columns} 
//                 data={allPassword} 
//                 loading={loading}
//             /> */}

//             {loading ? (
//                 <PageLoader />
//             ) : (
//                 <MyTable columns={columns} data={allPassword} />
//             )}

//             {/* Add Password Form */}
//             <AddPasswordForm
//                 showForm={showAddForm}
//                 setShowForm={setShowAddForm}
//                 setReloadTrigger={setReloadTrigger}
//                 allOrganization={allOrganization}
//                 allCategory={allCategory}
//                 allSubCategory={allSubCategory}
//                 allChildCategory={allChildCategory}
//             />

//             {/* Edit Password Form */}
//             <EditPasswordForm
//                 showForm={showEditForm}
//                 setShowForm={setShowEditForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingPassword={editingPassword}
//                 setEditingPassword={setEditingPassword}
//                 handleUpdate={handleUpdate}
//                 allOrganization={allOrganization}
//                 allCategory={allCategory}
//                 allSubCategory={allSubCategory}
//                 allChildCategory={allChildCategory}
//             />

//             </div>
//         </AdminWrapper>
//     );
// };

// export default Password;

import axios from "axios";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import AddPasswordForm from "@/AddPasswordComponents/AddPasswordForm";
import MyTable from "@/TableComponents/MyTable";
import EditPasswordForm from "@/EditPasswordComponents/EditPasswordForm";
import { Head } from "@inertiajs/react";
import PageLoader from "@/Loader/PageLoader";

const Password = () => {
    const [allPassword, setAllPassword] = useState([]);
    const [allOrganization, setAllOrganization] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [allSubCategory, setAllSubCategory] = useState([]);
    const [allChildCategory, setAllChildCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingPassword, setEditingPassword] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Fetch all data in parallel
                const [passwordsRes, organizationsRes, categoriesRes, subCategoriesRes, childCategoriesRes] = await Promise.all([
                    axios.get(route("ourpasswords.index")),
                    axios.get(route("ourorganizations.index")),
                    axios.get(route("ourcategories.index")),
                    axios.get(route("oursubcategories.index")),
                    axios.get(route("ourchildcategories.index"))
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

    console.log("All Passwords: ", allPassword);

    // Delete password
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this password?")) return;
        try {
            await axios.delete(route("ourpasswords.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error(error);
        }
    };

    // Open form for editing
    const handleEdit = (password) => {
        setEditingPassword(password);
        setShowEditForm(true);
    };

    // Update existing password
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourpasswords.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            // Trigger reload after successful update
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Error updating password", error);
            throw error;
        }
    };

    // Define table columns
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
                    <span className="text-gray-600 font-mono text-xs">
                        {value}
                    </span>
                ),
            },
            {
                Header: "Expiry Date",
                accessor: "expirydate",
                Cell: ({ value }) => (
                    <span className="text-gray-600">
                        {value || "—"}
                    </span>
                ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-indigo-600 hover:text-indigo-900 transition duration-200"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition duration-200"
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
            <Head title="Password" />
            <div className="container mx-auto py-4">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Password 
                    </h1>
                    <button
                        onClick={() => {
                            setEditingPassword(null);
                            setShowAddForm(true);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                {loading ? (
                    <PageLoader />
                ) : (
                    <MyTable columns={columns} data={allPassword} />
                )}

                {/* Add Password Form */}
                <AddPasswordForm
                    showForm={showAddForm}
                    setShowForm={setShowAddForm}
                    setReloadTrigger={setReloadTrigger}
                    allOrganization={allOrganization}
                    allCategory={allCategory}
                    allSubCategory={allSubCategory}
                    allChildCategory={allChildCategory}
                />

                {/* Edit Password Form */}
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



// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import AddPasswordForm from "@/AddFormComponents/AddPasswordForm";

// const Password = () => {
//     const [allPassword, setAllPassword] = useState([]);
//     const [allOrganization, setAllOrganization] = useState([]);
//     const [allCategory, setAllCategory] = useState([]);
//     const [allSubCategory, setAllSubCategory] = useState([]);
//     const [allChildCategory, setAllChildCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingPassword, setEditingPassword] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     useEffect(() => {
//         const fetchPassword = async () => {
//             try {
//                 const response = await axios.get(route("ourpasswords.index"));
//                 setAllPassword(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         const fetchOrganization = async () => {
//             try {
//                 const response = await axios.get(route("ourorganizations.index"));
//                 setAllOrganization(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 setAllCategory(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         const fetchSubCategory = async () => {
//             try {
//                 const response = await axios.get(route("oursubcategories.index"));
//                 setAllSubCategory(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         const fetchChildCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourchildcategories.index"));
//                 setAllChildCategory(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchPassword();
//         fetchOrganization();
//         fetchCategory();
//         fetchSubCategory();
//         fetchChildCategory();
//     }, [reloadTrigger]);

//     // Delete password
//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this password?")) return;
//         try {
//             await axios.delete(route("ourpasswords.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     // Open form for editing
//     const handleEdit = (password) => {
//         setEditingPassword(password);
//     };

//     // Update existing password
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourpasswords.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error updating password", error);
//             throw error;
//         }
//     };

//     return (
//         <AdminWrapper>
//             <div className="mb-8 flex justify-between items-center">
//                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                     Password Management
//                 </h1>
//                 <button
//                     onClick={() => {
//                         setEditingPassword(null);
//                         setShowForm(true);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* Password Table */}
//             <div className="bg-white rounded-xl shadow overflow-hidden">
//                 <table className="w-full text-sm text-left">
//                     <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
//                         <tr>
//                             <th className="px-6 py-4">#</th>
//                             <th className="px-6 py-4">Organization</th>
//                             <th className="px-6 py-4">Category</th>
//                             <th className="px-6 py-4">Username</th>
//                             <th className="px-6 py-4">Expiry Date</th>
//                             <th className="px-6 py-4">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                         {allPassword.length === 0 ? (
//                             <tr>
//                                 <td
//                                     colSpan={6}
//                                     className="px-6 py-8 text-center text-gray-400"
//                                 >
//                                     No passwords found.
//                                 </td>
//                             </tr>
//                         ) : (
//                             allPassword.map((pwd, index) => (
//                                 <tr
//                                     key={pwd.id}
//                                     className="hover:bg-gray-50 transition"
//                                 >
//                                     <td className="px-6 py-4 text-gray-500">
//                                         {index + 1}
//                                     </td>
//                                     <td className="px-6 py-4 font-medium text-gray-800">
//                                         {pwd.organization?.name ?? "—"}
//                                     </td>
//                                     <td className="px-6 py-4 text-gray-600">
//                                         {pwd.category?.name ?? "—"}
//                                     </td>
//                                     <td className="px-6 py-4 text-gray-600">
//                                         {pwd.username}
//                                     </td>
//                                     <td className="px-6 py-4 text-gray-600">
//                                         {pwd.expirydate ?? "—"}
//                                     </td>
//                                     <td className="px-6 py-4 flex items-center gap-2">
//                                         <button
//                                             onClick={() => handleEdit(pwd)}
//                                             className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition"
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(pwd.id)}
//                                             className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
//                                         >
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             <AddPasswordForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingPassword={editingPassword}
//                 setEditingPassword={setEditingPassword}
//                 handleUpdate={handleUpdate}
//                 allOrganization={allOrganization}
//                 allCategory={allCategory}
//                 allSubCategory={allSubCategory}
//                 allChildCategory={allChildCategory}
//             />
//         </AdminWrapper>
//     );
// };

// export default Password;

