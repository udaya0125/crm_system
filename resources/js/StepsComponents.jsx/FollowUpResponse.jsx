import React, { useState } from "react";

const FollowUpResponse = ({ data, updateData, nextStep, prevStep }) => {
    const [formData, setFormData] = useState({
        response: data.response || "",
        negativeReason: data.negativeReason || "",
        followUpDate: data.followUpDate || "",
        followUpTime: data.followUpTime || "",
        notes: data.notes || "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.response) {
            newErrors.response = "Response type is required";
        }

        if (formData.response === "negative" && !formData.negativeReason) {
            newErrors.negativeReason = "Reason is required for negative responses";
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

    const isPositive = formData.response === "positive";
    const isNegative = formData.response === "negative";

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit}>

                    {/* Response Dropdown */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Follow-up Response *
                        </label>

                        {errors.response && (
                            <p className="text-red-500 text-sm mb-2">{errors.response}</p>
                        )}

                        <select
                            name="response"
                            value={formData.response}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-gray-300 focus:ring focus:ring-blue-200"
                        >
                            <option value="">-- Select Response Type --</option>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                        </select>
                    </div>

                    {/* Positive Section */}
                    {isPositive && (
                        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
                            <h3 className="font-medium text-green-800">Positive Response Details</h3>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm text-green-700 mb-1">Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-green-300 rounded"
                                    placeholder="Notes about the positive response..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Negative Section */}
                    {isNegative && (
                        <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                            <h3 className="font-medium text-red-800">Response Details</h3>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm text-red-700 mb-1">Reason *</label>
                                <textarea
                                    name="negativeReason"
                                    value={formData.negativeReason}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-red-300 rounded"
                                    placeholder="Why did the client decline?"
                                />
                                {errors.negativeReason && (
                                    <p className="text-red-500 text-xs mt-1">{errors.negativeReason}</p>
                                )}
                            </div>

                            {/* Follow-up Date */}
                            <div>
                                <label className="block text-sm text-red-700 mb-1">Follow-up Date</label>
                                <input
                                    type="date"
                                    name="followUpDate"
                                    value={formData.followUpDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full p-2 border border-red-300 rounded"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm text-red-700 mb-1">Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full p-2 border border-red-300 rounded"
                                    placeholder="Additional notes..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-4 mt-6">
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={isNegative && !formData.negativeReason}
                            className={`px-6 py-2 text-white rounded ${
                                isNegative && !formData.negativeReason
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : isPositive
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {isPositive ? "Next" : "Complete"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FollowUpResponse;