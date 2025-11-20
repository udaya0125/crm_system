import React, { useState } from "react";

const CreateCompany = ({ data, updateData, nextStep }) => {
    const [formData, setFormData] = useState({
        companyName: data.companyName || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        client: data.client || "",
        company: data.company || "",
        noOfRooms: data.noOfRooms || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        website: data.website || "",
        source: data.source || "",
        responsiblePerson: data.responsiblePerson || "",
        comment: data.comment || "",
        messenger: data.messenger || "",
        messengerContact: data.messengerContact || "", // Added missing field
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required field validation
        if (!formData.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        }
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = "Please enter a valid phone number";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Website validation (if provided)
        if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
            newErrors.website = "Please enter a valid website URL";
        }

        // Messenger contact validation (if messenger is selected)
        if (formData.messenger && !formData.messengerContact.trim()) {
            newErrors.messengerContact = "Messenger contact is required when messenger is selected";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            updateData(formData);
            nextStep();
        }
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
                 {/* <h2 className="text-2xl font-bold ">Company Details</h2> */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                className={getInputClassName('companyName')}
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
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className={getInputClassName('firstName')}
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
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className={getInputClassName('lastName')}
                                placeholder="Enter last name"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                            )}
                        </div>

                        {/* Client */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client
                            </label>
                            <input
                                type="text"
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                className={getInputClassName('client')}
                                placeholder="Enter client name"
                            />
                        </div>

                        {/* Company */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className={getInputClassName('company')}
                                placeholder="Enter company"
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
                                value={formData.noOfRooms}
                                onChange={handleChange}
                                min="0"
                                className={getInputClassName('noOfRooms')}
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
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className={getInputClassName('phone')}
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
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={getInputClassName('email')}
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
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className={getInputClassName('address')}
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
                                value={formData.website}
                                onChange={handleChange}
                                className={getInputClassName('website')}
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
                                value={formData.source}
                                onChange={handleChange}
                                className={getInputClassName('source')}
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
                                value={formData.responsiblePerson}
                                onChange={handleChange}
                                className={getInputClassName('responsiblePerson')}
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
                                        value={formData.messenger}
                                        onChange={handleChange}
                                        className={getInputClassName('messenger')}
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
                                        value={formData.messengerContact}
                                        onChange={handleChange}
                                        className={getInputClassName('messengerContact')}
                                        placeholder={
                                            formData.messenger
                                                ? `Enter ${formData.messenger} contact`
                                                : "Enter contact"
                                        }
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
                                value={formData.comment}
                                onChange={handleChange}
                                rows="4"
                                className={getInputClassName('comment')}
                                placeholder="Enter any additional comments or notes"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCompany;