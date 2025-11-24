import React, { useState } from "react";
import axios from "axios";

const EditInitialResponse = ({ data, updateData, nextStep, prevStep, companyId, initialResponseId }) => {
    const [formData, setFormData] = useState({
        response: data.initial_response || "",
        negativeReason: data.initial_reason || "",
        followUpDate: data.followUpDate || "",
        followUpTime: data.followUpTime || "",
        notes: data.initial_notes || "",
        meetingOutcomes: data.meeting_outcome || "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Helper function to get CSRF token safely
    const getCsrfToken = () => {
        if (typeof document === 'undefined') return '';
        
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute('content') : '';
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            // Map frontend field names to backend field names
            const backendData = {
                company_id: companyId,
                initial_response: formData.response,
                meeting_outcome: formData.meetingOutcomes,
                initial_notes: formData.notes,
                initial_reason: formData.negativeReason,
            };

            if (initialResponseId) {
                // Update existing initial response
                await axios.put(
                    route('ourinitialresponse.update', { id: initialResponseId }),
                    backendData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': getCsrfToken(),
                        },
                    }
                );
                console.log("Initial response updated successfully");
            } else {
                // Create new initial response
                const response = await axios.post(
                    route('ourinitialresponse.store'),
                    backendData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': getCsrfToken(),
                        },
                    }
                );
                console.log("Initial response created successfully:", response.data);
            }

            // Update parent component with the data
            updateData({
                initial_response: formData.response,
                meeting_outcome: formData.meetingOutcomes,
                initial_notes: formData.notes,
                initial_reason: formData.negativeReason,
            });

            nextStep();
            
        } catch (error) {
            console.log("Error saving initial response", error);
            setErrors({ submit: "Failed to save initial response. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    const isPositive = formData.response === "positive";
    const isNegative = formData.response === "negative";

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className=" p-6">
                <form onSubmit={handleSubmit}>

                    {/* Response Dropdown */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Initial Response *
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
                            <h3 className="font-medium text-green-800">Meeting Details</h3>

                            {/* Meeting Outcomes */}
                            <div>
                                <label className="block text-sm text-green-700 mb-1">Meeting Outcomes *</label>
                                <textarea
                                    name="meetingOutcomes"
                                    value={formData.meetingOutcomes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-green-300 rounded"
                                    placeholder="Key outcomes and decisions from the meeting..."
                                    required
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm text-green-700 mb-1">Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-green-300 rounded"
                                    placeholder="Meeting notes and discussion points..."
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

                            {/* Meeting Outcomes */}
                            <div>
                                <label className="block text-sm text-red-700 mb-1">Meeting Outcomes</label>
                                <textarea
                                    name="meetingOutcomes"
                                    value={formData.meetingOutcomes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-red-300 rounded"
                                    placeholder="Key outcomes and learnings from the discussion..."
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

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-4 mt-6">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={submitting}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={(isNegative && !formData.negativeReason) || submitting}
                            className={`px-6 py-2 text-white rounded ${
                                (isNegative && !formData.negativeReason) || submitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : isPositive
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {submitting ? 'Saving...' : (isPositive ? "Next" : "Complete")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInitialResponse;