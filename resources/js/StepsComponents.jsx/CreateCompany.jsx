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
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateData(formData);
        nextStep();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter company name"
                            />
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter first name"
                            />
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter last name"
                            />
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter phone number"
                            />
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter email address"
                            />
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Source */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Source
                            </label>
                            <select
                                name="source"
                                value={formData.source}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select source</option>
                                <option value="website">Website</option>
                                <option value="referral">Referral</option>
                                <option value="social_media">
                                    Social Media
                                </option>
                                <option value="advertisement">
                                    Advertisement
                                </option>
                                <option value="cold_call">Cold Call</option>
                                <option value="other">Other</option>
                            </select>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter responsible person"
                            />
                        </div>

                        {/* Messenger */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Messenger
                            </label>
                            <select
                                name="messenger"
                                value={formData.messenger}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select messenger</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="telegram">Telegram</option>
                                <option value="viber">Viber</option>
                                <option value="skype">Skype</option>
                                <option value="other">Other</option>
                            </select>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter any additional comments or notes"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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
