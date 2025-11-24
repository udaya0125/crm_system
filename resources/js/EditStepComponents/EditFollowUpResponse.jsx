import React, { useState } from "react";
import axios from "axios";

const EditFollowUpResponse = ({ 
    data, 
    updateData, 
    nextStep, 
    prevStep, 
    companyId, 
    company,
    existingData 
}) => {
    const [formData, setFormData] = useState({
        response: data.follow_up_response || "",
        negativeReason: data.follow_up_reason || "",
        followUpDate: data.follow_up_date || "",
        followUpTime: data.follow_up_time || "",
        notes: data.follow_up_notes || "",
        meetingOutcome: data.meeting_outcome || "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Check if we're updating existing data or creating new
    const followUpResponseId = existingData?.id || null;

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

        if (formData.response === "positive" && !formData.meetingOutcome) {
            newErrors.meetingOutcome = "Meeting outcome is required for positive responses";
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
                follow_up_response: formData.response,
                meeting_outcome: formData.meetingOutcome,
                follow_up_notes: formData.notes,
                follow_up_reason: formData.negativeReason,
            };

            if (followUpResponseId) {
                // Update existing follow-up response
                await axios.put(
                    route('ourfollowupresponse.update', { id: followUpResponseId }),
                    backendData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': getCsrfToken(),
                        },
                    }
                );
                console.log("Follow-up response updated successfully");
            } else {
                // Create new follow-up response
                const response = await axios.post(
                    route('ourfollowupresponse.store'),
                    backendData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': getCsrfToken(),
                        },
                    }
                );
                console.log("Follow-up response created successfully:", response.data);
            }

            // Update parent component with the data
            updateData({
                follow_up_response: formData.response,
                meeting_outcome: formData.meetingOutcome,
                follow_up_notes: formData.notes,
                follow_up_reason: formData.negativeReason,
            });

            nextStep();
            
        } catch (error) {
            console.log("Error saving follow-up response", error);
            setErrors({ 
                submit: "Failed to save follow-up response. Please try again." 
            });
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

                            {/* Meeting Outcome */}
                            <div>
                                <label className="block text-sm text-green-700 mb-1">
                                    Meeting Outcome *
                                </label>
                                <textarea
                                    name="meetingOutcome"
                                    value={formData.meetingOutcome}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-green-300 rounded"
                                    placeholder="Describe the outcome of the meeting (e.g., Deal closed, next steps agreed, proposal accepted, demo scheduled, contract signed...)"
                                />
                                {errors.meetingOutcome && (
                                    <p className="text-red-500 text-xs mt-1">{errors.meetingOutcome}</p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm text-green-700 mb-1">Additional Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-green-300 rounded"
                                    placeholder="Any additional notes about the positive response..."
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
                                <label className="block text-sm text-red-700 mb-1">Reason for Negative Response *</label>
                                <textarea
                                    name="negativeReason"
                                    value={formData.negativeReason}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-red-300 rounded"
                                    placeholder="Why did the client decline or provide negative feedback?"
                                />
                                {errors.negativeReason && (
                                    <p className="text-red-500 text-xs mt-1">{errors.negativeReason}</p>
                                )}
                            </div>

                            {/* Meeting Outcome for Negative Response */}
                            <div>
                                <label className="block text-sm text-red-700 mb-1">Meeting Outcome</label>
                                <textarea
                                    name="meetingOutcome"
                                    value={formData.meetingOutcome}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-red-300 rounded"
                                    placeholder="Describe the outcome of the meeting (e.g., Client not interested, budget constraints, timing issues, went with competitor, no decision made...)"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm text-red-700 mb-1">Additional Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full p-2 border border-red-300 rounded"
                                    placeholder="Any additional notes about the negative response..."
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
                            disabled={
                                (isNegative && !formData.negativeReason) || 
                                (isPositive && !formData.meetingOutcome) || 
                                submitting
                            }
                            className={`px-6 py-2 text-white rounded ${
                                (isNegative && !formData.negativeReason) || 
                                (isPositive && !formData.meetingOutcome) || 
                                submitting
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

export default EditFollowUpResponse;