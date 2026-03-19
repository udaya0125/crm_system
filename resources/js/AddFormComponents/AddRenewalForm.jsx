import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddRenewalForm = ({ editingRenewal, setEditingRenewal, setShowForm }) => {
    const [submitting, setSubmitting] = useState(false);
    const [renewalForm, setRenewalForm] = useState({
        contract_id: "",
        client_name: "",
        service_type: "",
        start_date: "",
        expiry_date: "",
        amount: "",
        renewal_period: "",
        responsible_staff: "",
        status: "",
    });

    //  Use Effect
    useEffect(() => {
        if (editingRenewal) {
            setRenewalForm({
                ...editingRenewal,
                image: null,
            });
            setShowForm(true);
        } else {
            setRenewalForm({
                contract_id: "",
                client_name: "",
                service_type: "",
                start_date: "",
                expiry_date: "",
                amount: "",
                renewal_period: "",
                responsible_staff: "",
                status: "",
            });
        }
    }, [editingRenewal]);

    // Handle Create Renewal
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("renewals.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating renewal", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in renewalForm) {
            if (renewalForm[key] !== null && renewalForm[key] !== "") {
                formData.append(key, renewalForm[key]);
            }
        }
        try {
            setSubmitting(true);

            if (editingRenewal) {
                // Editing existing renewal
                await handleUpdate(formData, editingRenewal.id);
            } else {
                // Creating new renewal
                await handleCreate(formData);
            }
            setRenewalForm({
                contract_id: "",
                client_name: "",
                service_type: "",
                start_date: "",
                expiry_date: "",
                amount: "",
                renewal_period: "",
                responsible_staff: "",
                status: "",
            });

            setShowForm(false);
            setEditingRenewal(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle  change for image and the others

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setRenewalForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">Add New Renewal</h2>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setEditingRenewal(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRenewalForm;
