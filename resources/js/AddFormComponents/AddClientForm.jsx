import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const AddClientForm = ({ 
    editingClient, 
    setEditingClient, 
    handleUpdate, 
    handleCreate,
    onSuccess,
    onCancel 
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [clientForm, setClientForm] = useState({
        organization_name: "",
        contact_person: "",
        contact_phone: "",
        email: "",
    });

    // Add this useEffect to lock body scroll when form mounts
    useEffect(() => {
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
        };
    }, []);

    // Use Effect - populate form when editing
    useEffect(() => {
        if (editingClient) {
            setClientForm({
                organization_name: editingClient.organization_name || "",
                contact_person: editingClient.contact_person || "",
                contact_phone: editingClient.contact_phone || "",
                email: editingClient.email || "",
            });
        } else {
            setClientForm({
                organization_name: "",
                contact_person: "",
                contact_phone: "",
                email: "",
            });
        }
        // Clear errors when opening form
        setErrors({});
    }, [editingClient]);

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!clientForm.organization_name.trim()) {
            newErrors.organization_name = "Organization name is required";
        }
        
        if (!clientForm.contact_person.trim()) {
            newErrors.contact_person = "Contact person is required";
        }
        
        if (!clientForm.contact_phone.trim()) {
            newErrors.contact_phone = "Contact phone is required";
        } else if (!/^[\d\s\-+()]+$/.test(clientForm.contact_phone)) {
            newErrors.contact_phone = "Please enter a valid phone number";
        }
        
        if (clientForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const formData = new FormData();
        
        // Append all form data
        for (const key in clientForm) {
            if (clientForm[key] !== null && clientForm[key] !== "") {
                formData.append(key, clientForm[key]);
            }
        }

        try {
            setSubmitting(true);

            if (editingClient) {
                // Editing existing client
                await handleUpdate(formData, editingClient.id);
                alert('Client updated successfully!');
            } else {
                // Creating new client
                await handleCreate(formData);
                alert('Client created successfully!');
            }

            // Call success callback
            if (onSuccess) {
                onSuccess();
            }
            
        } catch (error) {
            console.log("Error saving data", error);
            
            // Handle validation errors from server
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Error saving client. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="p-6 text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold">
                        {editingClient ? 'Edit Client' : 'Add New Client'}
                    </h2>
                </div>
                <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    type="button"
                    disabled={submitting}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Row - Organization Name and Contact Person */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Organization Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Organization Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="organization_name"
                                value={clientForm.organization_name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.organization_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter organization name"
                                disabled={submitting}
                                required
                            />
                        </div>
                        {errors.organization_name && (
                            <p className="mt-1 text-sm text-red-600">{errors.organization_name}</p>
                        )}
                    </div>

                    {/* Contact Person Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Person <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="contact_person"
                                value={clientForm.contact_person}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.contact_person ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter contact person name"
                                disabled={submitting}
                                required
                            />
                        </div>
                        {errors.contact_person && (
                            <p className="mt-1 text-sm text-red-600">{errors.contact_person}</p>
                        )}
                    </div>
                </div>

                {/* Second Row - Contact Phone and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contact Phone Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="tel"
                                name="contact_phone"
                                value={clientForm.contact_phone}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.contact_phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter phone number"
                                disabled={submitting}
                                required
                            />
                        </div>
                        {errors.contact_phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={clientForm.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter email address"
                                disabled={submitting}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                {editingClient ? 'Updating...' : 'Creating...'}
                            </span>
                        ) : (
                            <span>{editingClient ? 'Update Client' : 'Create Client'}</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddClientForm;