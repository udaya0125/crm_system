import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import { Trash2, Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";

const Payment = () => {
    const [allPayment, setAllPayment] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(true);

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [password, setPassword] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility

    // Search state
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPayment = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourpayments.index"));
                setAllPayment(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
                toast.error("Failed to load payments");
            } finally {
                setLoading(false);
            }
        };

        fetchPayment();
    }, [reloadTrigger]);

    const openDeleteModal = (id) => {
        setDeleteItemId(id);
        setPassword("");
        setShowPassword(false); // Reset password visibility when opening modal
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteItemId(null);
        setPassword("");
        setShowPassword(false); // Reset password visibility when closing modal
    };

    const handleDelete = async () => {
        if (!deleteItemId) {
            toast.error("No Payment Selected For Deletion");
            return;
        }

        if (!password) {
            toast.error("Password is required for deletion");
            return;
        }

        setDeleting(true);
        try {
            // Step 1: Verify password
            const verifyResponse = await axios.post(route("password.verify"), {
                password: password,
            });

            if (!verifyResponse.data.verified) {
                toast.error("Incorrect password");
                setDeleting(false);
                return;
            }

            // Step 2: Delete
            await axios.delete(
                route("ourpayments.destroy", { id: deleteItemId })
            );

            toast.success("Payment deleted successfully");
            setReloadTrigger((prev) => !prev);
            closeDeleteModal();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 422) {
                toast.error("Password verification failed");
            } else {
                toast.error("Something went wrong while deleting");
            }
        } finally {
            setDeleting(false);
        }
    };

    // Filtered data based on search
    const filteredData = useMemo(() => {
        if (!search.trim()) return allPayment;

        return allPayment.filter((payment) =>
            [
                payment.customer_name,
                payment.service_type,
                payment.payment_reference,
                payment.invoice_reference,
                payment.paymentmode,
            ]
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase()),
        );
    }, [allPayment, search]);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // Define columns for MyTable
    const columns = useMemo(
        () => [
            {
                Header: "s/n",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                Header: "Customer Name",
                accessor: "customer_name",
            },
            {
                Header: "Amount",
                accessor: "amount",
                Cell: ({ value }) => (
                    <span>NPR {parseFloat(value).toLocaleString()}</span>
                ),
            },
            {
                Header: "Service Type",
                accessor: "service_type",
            },
            {
                Header: "Payment Reference",
                accessor: "payment_reference",
            },
            {
                Header: "Payment Mode",
                accessor: "paymentmode",
            },
            {
                Header: "Invoice Reference",
                accessor: "invoice_reference",
            },
            {
                Header: "Received Date",
                accessor: "receiveddate",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <button
                        onClick={() => openDeleteModal(row.original.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                ),
            },
        ],
        []
    );

    return (
        <AdminWrapper>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Payment Management
                    </h1>
                    <span className="text-sm text-gray-500">
                        {filteredData.length} record(s)
                    </span>
                </div>

                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by customer, service type, payment reference, invoice reference, or payment mode..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* MyTable Component with integrated loading */}
                <MyTable 
                    columns={columns} 
                    data={filteredData} 
                    loading={loading}
                />

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
                            <h2 className="text-lg font-bold text-gray-800 mb-1">
                                Confirm Deletion
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Enter your password to permanently delete this
                                payment.
                            </p>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleDelete()
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            <div className="flex gap-3 justify-end mt-4">
                                <button
                                    onClick={closeDeleteModal}
                                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminWrapper>
    );
};

export default Payment;


// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import MyTable from "@/TableComponents/MyTable";
// import axios from "axios";
// import { Trash2 } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";
// import { toast } from "react-toastify";


// const Payment = () => {
//     const [allPayment, setAllPayment] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [loading, setLoading] = useState(true);

//     // Delete modal state
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [deleteItemId, setDeleteItemId] = useState(null);
//     const [password, setPassword] = useState("");
//     const [deleting, setDeleting] = useState(false);

//     useEffect(() => {
//         const fetchPayment = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourpayments.index"));
//                 setAllPayment(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 toast.error("Failed to load payments");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPayment();
//     }, [reloadTrigger]);

//     const openDeleteModal = (id) => {
//         setDeleteItemId(id);
//         setPassword("");
//         setShowDeleteModal(true);
//     };

//     const closeDeleteModal = () => {
//         setShowDeleteModal(false);
//         setDeleteItemId(null);
//         setPassword("");
//     };

//     const handleDelete = async () => {
//         if (!deleteItemId) {
//             toast.error("No Payment Selected For Deletion");
//             return;
//         }

//         if (!password) {
//             toast.error("Password is required for deletion");
//             return;
//         }

//         setDeleting(true);
//         try {
//             // Step 1: Verify password
//             const verifyResponse = await axios.post(route("password.verify"), {
//                 password: password,
//             });

//             if (!verifyResponse.data.verified) {
//                 toast.error("Incorrect password");
//                 setDeleting(false);
//                 return;
//             }

//             // Step 2: Delete
//             await axios.delete(
//                 route("ourpayments.destroy", { id: deleteItemId })
//             );

//             toast.success("Payment deleted successfully");
//             setReloadTrigger((prev) => !prev);
//             closeDeleteModal();
//         } catch (error) {
//             console.error(error);
//             if (error.response?.status === 422) {
//                 toast.error("Password verification failed");
//             } else {
//                 toast.error("Something went wrong while deleting");
//             }
//         } finally {
//             setDeleting(false);
//         }
//     };

//     // Define columns for MyTable
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "s/n",
//                 accessor: "index",
//                 Cell: ({ row }) => <span>{row.index + 1}</span>,
//             },
//             {
//                 Header: "Customer Name",
//                 accessor: "customer_name",
//             },
//             {
//                 Header: "Amount",
//                 accessor: "amount",
//                 Cell: ({ value }) => (
//                     <span>NPR {parseFloat(value).toLocaleString()}</span>
//                 ),
//             },
//             {
//                 Header: "Service Type",
//                 accessor: "service_type",
//             },
//             {
//                 Header: "Payment Reference",
//                 accessor: "payment_reference",
//             },
//             {
//                 Header: "Payment Mode",
//                 accessor: "paymentmode",
//             },
//             {
//                 Header: "Invoice Reference",
//                 accessor: "invoice_reference",
//             },
//             {
//                 Header: "Received Date",
//                 accessor: "receiveddate",
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <button
//                         onClick={() => openDeleteModal(row.original.id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                     >
//                         <Trash2 size={16} />
//                     </button>
//                 ),
//             },
//         ],
//         []
//     );

//     // Prepare data for the table
//     const tableData = useMemo(() => {
//         if (loading) return [];
//         return allPayment;
//     }, [allPayment, loading]);

//     return (
//         <AdminWrapper>
//             <div className="p-6">
//                 <h1 className="text-2xl font-bold mb-6 text-gray-800">
//                     Payment Management
//                 </h1>

//                 {loading ? (
//                     <div className="text-center py-10 text-gray-400">
//                         Loading payments...
//                     </div>
//                 ) :
//                 //  allPayment.length === 0 ? (
//                 //     <div className="text-center py-10 text-gray-400">
//                 //         No payments found.
//                 //     </div>
//                 // ) :
//                  (
//                     <MyTable columns={columns} data={tableData} />
//                 )}

//                 {/* Delete Confirmation Modal */}
//                 {showDeleteModal && (
//                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                         <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
//                             <h2 className="text-lg font-bold text-gray-800 mb-1">
//                                 Confirm Deletion
//                             </h2>
//                             <p className="text-sm text-gray-500 mb-4">
//                                 Enter your password to permanently delete this
//                                 payment.
//                             </p>

//                             <input
//                                 type="password"
//                                 placeholder="Your password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 mb-4"
//                             />

//                             <div className="flex gap-3 justify-end">
//                                 <button
//                                     onClick={closeDeleteModal}
//                                     className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleDelete}
//                                     disabled={deleting}
//                                     className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
//                                 >
//                                     {deleting ? "Deleting..." : "Delete"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// export default Payment;



// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import MyTable from "@/TableComponents/MyTable";
// import axios from "axios";
// import { Trash2 } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";
// import { toast } from "react-toastify";

// const Payment = () => {
//     const [allPayment, setAllPayment] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [loading, setLoading] = useState(true);

//     // Delete modal state
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [deleteItemId, setDeleteItemId] = useState(null);
//     const [password, setPassword] = useState("");
//     const [deleting, setDeleting] = useState(false);

//     useEffect(() => {
//         const fetchPayment = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourpayments.index"));
//                 setAllPayment(response.data.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 toast.error("Failed to load payments");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPayment();
//     }, [reloadTrigger]);

//     const openDeleteModal = (id) => {
//         setDeleteItemId(id);
//         setPassword("");
//         setShowDeleteModal(true);
//     };

//     const closeDeleteModal = () => {
//         setShowDeleteModal(false);
//         setDeleteItemId(null);
//         setPassword("");
//     };

//     const handleDelete = async () => {
//         if (!deleteItemId) {
//             toast.error("No Payment Selected For Deletion");
//             return;
//         }

//         if (!password) {
//             toast.error("Password is required for deletion");
//             return;
//         }

//         setDeleting(true);
//         try {
//             // Step 1: Verify password
//             const verifyResponse = await axios.post(route("password.verify"), {
//                 password: password,
//             });

//             if (!verifyResponse.data.verified) {
//                 toast.error("Incorrect password");
//                 setDeleting(false);
//                 return;
//             }

//             // Step 2: Delete
//             await axios.delete(
//                 route("ourpayments.destroy", { id: deleteItemId })
//             );

//             toast.success("Payment deleted successfully");
//             setReloadTrigger((prev) => !prev);
//             closeDeleteModal();
//         } catch (error) {
//             console.error(error);
//             if (error.response?.status === 422) {
//                 toast.error("Password verification failed");
//             } else {
//                 toast.error("Something went wrong while deleting");
//             }
//         } finally {
//             setDeleting(false);
//         }
//     };

//     // Define columns for MyTable
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "s/n",
//                 accessor: "index",
//                 Cell: ({ row }) => <span>{row.index + 1}</span>,
//             },
//             {
//                 Header: "Customer Name",
//                 accessor: "customer_name",
//             },
//             {
//                 Header: "Amount",
//                 accessor: "amount",
//                 Cell: ({ value }) => (
//                     <span>NPR {parseFloat(value).toLocaleString()}</span>
//                 ),
//             },
//             {
//                 Header: "Service Type",
//                 accessor: "service_type",
//             },
//             {
//                 Header: "Payment Reference",
//                 accessor: "payment_reference",
//             },
//             {
//                 Header: "Payment Mode",
//                 accessor: "paymentmode",
//             },
//             {
//                 Header: "Invoice Reference",
//                 accessor: "invoice_reference",
//             },
//             {
//                 Header: "Received Date",
//                 accessor: "receiveddate",
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <button
//                         onClick={() => openDeleteModal(row.original.id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                     >
//                         <Trash2 size={16} />
//                     </button>
//                 ),
//             },
//         ],
//         []
//     );

//     return (
//         <AdminWrapper>
//             <div className="p-6">
//                 <h1 className="text-2xl font-bold mb-6 text-gray-800">
//                     Payment Management
//                 </h1>

//                 {/* MyTable Component with integrated loading */}
//                 <MyTable 
//                     columns={columns} 
//                     data={allPayment} 
//                     loading={loading}
//                 />

//                 {/* Delete Confirmation Modal */}
//                 {showDeleteModal && (
//                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                         <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
//                             <h2 className="text-lg font-bold text-gray-800 mb-1">
//                                 Confirm Deletion
//                             </h2>
//                             <p className="text-sm text-gray-500 mb-4">
//                                 Enter your password to permanently delete this
//                                 payment.
//                             </p>

//                             <input
//                                 type="password"
//                                 placeholder="Your password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 mb-4"
//                             />

//                             <div className="flex gap-3 justify-end">
//                                 <button
//                                     onClick={closeDeleteModal}
//                                     className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleDelete}
//                                     disabled={deleting}
//                                     className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
//                                 >
//                                     {deleting ? "Deleting..." : "Delete"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// export default Payment;

