import React, { useEffect, useState } from "react";
import { router } from '@inertiajs/react';
import axios from "axios";

const EditCreateCompany = ({ data, updateData, nextStep, company, companyId }) => {
    const [companyData, setCompanyData] = useState({
        companyName: "",
        firstName: "",
        lastName: "",
        client_member: "",
        designation: "",
        noOfRooms: "",
        phone: "",
        email: "",
        address: "",
        website: "",
        source: "",
        responsiblePerson: "",
        comment: "",
        messenger: "",
        messengerContact: "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Initialize form data when component receives props
    useEffect(() => {
        if (data) {
            setCompanyData(data);
        }
    }, [data]);

    // Helper function to get CSRF token safely
    const getCsrfToken = () => {
        if (typeof document === 'undefined') return '';
        
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute('content') : '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            
            if (companyId) {
                // Update existing company
                await handleUpdateCompany();
            } else {
                // Create new company
                await handleCreateCompany();
            }
            
            // Move to next step
            nextStep();
            
        } catch (error) {
            console.log("Error saving company data", error);
            setErrors({ submit: "Failed to save company data. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateCompany = async () => {
        // Map frontend field names to backend field names
        const fieldMapping = {
            companyName: 'company_name',
            firstName: 'first_name',
            lastName: 'last_name',
            client_member: 'client_member',
            designation: 'designation',
            noOfRooms: 'no_of_rooms',
            phone: 'phone_no',
            email: 'email',
            address: 'address',
            website: 'website',
            source: 'source',
            responsiblePerson: 'responsible_person',
            comment: 'comment',
            messenger: 'preffered_message',
            messengerContact: 'message_contact',
        };

        const backendData = {};
        Object.keys(companyData).forEach(key => {
            const backendKey = fieldMapping[key] || key;
            backendData[backendKey] = companyData[key];
        });

        try {
            const response = await axios.put(
                route('ourcompany.update', { id: companyId }), 
                backendData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken(),
                    },
                }
            );

            console.log("Company updated successfully:", response.data);
            
            // Update parent component with the data
            updateData(companyData, companyId);
            
        } catch (error) {
            console.error("Error updating company:", error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message || 'Failed to update company');
            }
            throw error;
        }
    };

    const handleCreateCompany = async () => {
        // Map frontend field names to backend field names
        const fieldMapping = {
            companyName: 'company_name',
            firstName: 'first_name',
            lastName: 'last_name',
            client_member: 'client_member',
            designation: 'designation',
            noOfRooms: 'no_of_rooms',
            phone: 'phone_no',
            email: 'email',
            address: 'address',
            website: 'website',
            source: 'source',
            responsiblePerson: 'responsible_person',
            comment: 'comment',
            messenger: 'preffered_message',
            messengerContact: 'message_contact',
        };

        const backendData = {};
        Object.keys(companyData).forEach(key => {
            const backendKey = fieldMapping[key] || key;
            backendData[backendKey] = companyData[key];
        });

        try {
            const response = await axios.post(
                route('ourcompany.store'), 
                backendData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken(),
                    },
                }
            );

            console.log("Company created successfully:", response.data);
            
            // Update parent component with the data and new company ID
            updateData(companyData, response.data.company_id);
            
        } catch (error) {
            console.error("Error creating company:", error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message || 'Failed to create company');
            }
            throw error;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Update parent component in real-time
        updateData({ [name]: value });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required field validation
        if (!companyData.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        }
        if (!companyData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }
        if (!companyData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }
        if (!companyData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(companyData.phone.replace(/\s/g, ""))) {
            newErrors.phone = "Please enter a valid phone number";
        }
        if (!companyData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Website validation (if provided)
        if (companyData.website && !/^https?:\/\/.+\..+/.test(companyData.website)) {
            newErrors.website = "Please enter a valid website URL";
        }

        // Messenger contact validation (if messenger is selected)
        if (companyData.messenger && !companyData.messengerContact.trim()) {
            newErrors.messengerContact = "Messenger contact is required when messenger is selected";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Helper function to get input className with error state
    const getInputClassName = (fieldName) => {
        const baseClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";
        return errors[fieldName]
            ? `${baseClass} border-red-500 focus:ring-red-500 focus:border-red-500`
            : baseClass;
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {companyId ? 'Edit Company Details' : 'Create New Company'}
                    </h2>
                    {companyId && (
                        <p className="text-sm text-gray-600 mt-1">
                            Editing: {company?.company_name}
                        </p>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={companyData.companyName}
                                onChange={handleChange}
                                required
                                className={getInputClassName("companyName")}
                                placeholder="Enter company name"
                            />
                            {errors.companyName && (
                                <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                            )}
                        </div>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={companyData.firstName}
                                onChange={handleChange}
                                required
                                className={getInputClassName("firstName")}
                                placeholder="Enter first name"
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={companyData.lastName}
                                onChange={handleChange}
                                required
                                className={getInputClassName("lastName")}
                                placeholder="Enter last name"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                            )}
                        </div>

                        {/* Client Member */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Member
                            </label>
                            <input
                                type="text"
                                name="client_member"
                                value={companyData.client_member}
                                onChange={handleChange}
                                className={getInputClassName("client_member")}
                                placeholder="Enter client member"
                            />
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Designation
                            </label>
                            <input
                                type="text"
                                name="designation"
                                value={companyData.designation}
                                onChange={handleChange}
                                className={getInputClassName("designation")}
                                placeholder="Enter designation"
                            />
                        </div>

                        {/* Number of Rooms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Rooms
                            </label>
                            <input
                                type="number"
                                name="noOfRooms"
                                value={companyData.noOfRooms}
                                onChange={handleChange}
                                min="0"
                                className={getInputClassName("noOfRooms")}
                                placeholder="Enter number of rooms"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={companyData.phone}
                                onChange={handleChange}
                                required
                                className={getInputClassName("phone")}
                                placeholder="Enter phone number"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={companyData.email}
                                onChange={handleChange}
                                required
                                className={getInputClassName("email")}
                                placeholder="Enter email address"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={companyData.address}
                                onChange={handleChange}
                                rows="2"
                                className={getInputClassName("address")}
                                placeholder="Enter full address"
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={companyData.website}
                                onChange={handleChange}
                                className={getInputClassName("website")}
                                placeholder="https://example.com"
                            />
                            {errors.website && (
                                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                            )}
                        </div>

                        {/* Source */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Source
                            </label>
                            <input
                                type="text"
                                name="source"
                                value={companyData.source}
                                onChange={handleChange}
                                className={getInputClassName("source")}
                                placeholder="Enter source"
                            />
                        </div>

                        {/* Responsible Person */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Responsible Person
                            </label>
                            <input
                                type="text"
                                name="responsiblePerson"
                                value={companyData.responsiblePerson}
                                onChange={handleChange}
                                className={getInputClassName("responsiblePerson")}
                                placeholder="Enter responsible person"
                            />
                        </div>

                        {/* Messenger */}
                        <div className="md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Messenger Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Messenger
                                    </label>
                                    <select
                                        name="messenger"
                                        value={companyData.messenger}
                                        onChange={handleChange}
                                        className={getInputClassName("messenger")}
                                    >
                                        <option value="">Select messenger</option>
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="telegram">Telegram</option>
                                        <option value="viber">Viber</option>
                                        <option value="skype">Skype</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Messenger Contact */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Messenger Contact/Username
                                    </label>
                                    <input
                                        type="text"
                                        name="messengerContact"
                                        value={companyData.messengerContact}
                                        onChange={handleChange}
                                        className={getInputClassName("messengerContact")}
                                        placeholder={companyData.messenger ? `Enter ${companyData.messenger} contact` : "Enter contact"}
                                    />
                                    {errors.messengerContact && (
                                        <p className="mt-1 text-sm text-red-600">{errors.messengerContact}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Comment */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comment
                            </label>
                            <textarea
                                name="comment"
                                value={companyData.comment}
                                onChange={handleChange}
                                rows="4"
                                className={getInputClassName("comment")}
                                placeholder="Enter any additional comments or notes"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Saving...' : (companyId ? 'Update Company' : 'Create Company')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCreateCompany;