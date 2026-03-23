// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const Payment = () => {
//     const [allPayment, setAllPayment] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);

//     // For fetching the user data
//     useEffect(() => {
//         const fetchPayment = async () => {
//             try {
//                 const response = await axios.get(route("ourpayments.index"));
//                 setAllPayment(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchPayment();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!id) {
//             toast.error("No Invoice Selected For Deletion");
//             return;
//         }

//         if (!password) {
//             toast.error("Password is required for deletion");
//             return;
//         }

//         try {
//             // 🔐 Step 1: Verify password
//             const verifyResponse = await axios.post(route("password.verify"), {
//                 password: password,
//             });

//             if (!verifyResponse.data.verified) {
//                 toast.error("Incorrect password");
//                 return;
//             }

//             // 🗑️ Step 2: Delete using DELETE method (RESTful)
//             const deleteResponse = await axios.delete(
//                 route("ourpayments.destroy", { id: id }),
//             );

//             // ✅ Success
//             toast.success("Payment deleted successfully");
//             setReloadTrigger((prev) => !prev);

//             // Optional: reset states
//             setPassword("");
//             setDeleteItemId(null);
//         } catch (error) {
//             console.error(error);

//             if (error.response?.status === 422) {
//                 toast.error("Password verification failed");
//             } else {
//                 toast.error("Something went wrong while deleting");
//             }
//         }
//     };
//     return (
//         <>
//             <AdminWrapper>
//                 <h1 className="text-2xl font-bold mb-4">Payment Management</h1>
//             </AdminWrapper>
//         </>
//     );
// };

// export default Payment;

import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/TableComponents/MyTable";
import axios from "axios";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
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
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteItemId(null);
        setPassword("");
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

    // Prepare data for the table
    const tableData = useMemo(() => {
        if (loading) return [];
        return allPayment;
    }, [allPayment, loading]);

    return (
        <AdminWrapper>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Payment Management
                </h1>

                {loading ? (
                    <div className="text-center py-10 text-gray-400">
                        Loading payments...
                    </div>
                ) :
                //  allPayment.length === 0 ? (
                //     <div className="text-center py-10 text-gray-400">
                //         No payments found.
                //     </div>
                // ) :
                 (
                    <MyTable columns={columns} data={tableData} />
                )}

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

                            <input
                                type="password"
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 mb-4"
                            />

                            <div className="flex gap-3 justify-end">
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
