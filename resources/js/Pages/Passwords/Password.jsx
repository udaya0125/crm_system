import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import AddPasswordForm from "@/AddFormComponents/AddPasswordForm";

const Password = () => {
    const [allPassword, setAllPassword] = useState([]);
    const [allOrganization, setAllOrganization] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [allSubCategory, setAllSubCategory] = useState([]);
    const [allChildCategory, setAllChildCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingPassword, setEditingPassword] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchPassword = async () => {
            try {
                const response = await axios.get(route("ourpasswords.index"));
                setAllPassword(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        const fetchOrganization = async () => {
            try {
                const response = await axios.get(route("ourorganizations.index"));
                setAllOrganization(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        const fetchCategory = async () => {
            try {
                const response = await axios.get(route("ourcategories.index"));
                setAllCategory(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        const fetchSubCategory = async () => {
            try {
                const response = await axios.get(route("oursubcategories.index"));
                setAllSubCategory(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        const fetchChildCategory = async () => {
            try {
                const response = await axios.get(route("ourchildcategories.index"));
                setAllChildCategory(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchPassword();
        fetchOrganization();
        fetchCategory();
        fetchSubCategory();
        fetchChildCategory();
    }, [reloadTrigger]);

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
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Error updating password", error);
            throw error;
        }
    };

    return (
        <AdminWrapper>
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    Password Management
                </h1>
                <button
                    onClick={() => {
                        setEditingPassword(null);
                        setShowForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* Password Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">#</th>
                            <th className="px-6 py-4">Organization</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Username</th>
                            <th className="px-6 py-4">Expiry Date</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {allPassword.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-8 text-center text-gray-400"
                                >
                                    No passwords found.
                                </td>
                            </tr>
                        ) : (
                            allPassword.map((pwd, index) => (
                                <tr
                                    key={pwd.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4 text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {pwd.organization?.name ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {pwd.category?.name ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {pwd.username}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {pwd.expirydate ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(pwd)}
                                            className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pwd.id)}
                                            className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
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

            <AddPasswordForm
                showForm={showForm}
                setShowForm={setShowForm}
                setReloadTrigger={setReloadTrigger}
                editingPassword={editingPassword}
                setEditingPassword={setEditingPassword}
                handleUpdate={handleUpdate}
                allOrganization={allOrganization}
                allCategory={allCategory}
                allSubCategory={allSubCategory}
                allChildCategory={allChildCategory}
            />
        </AdminWrapper>
    );
};

export default Password;