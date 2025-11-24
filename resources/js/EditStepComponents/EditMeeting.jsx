import React, { useState } from "react";
import axios from "axios";

const EditMeeting = ({ data, updateData, nextStep, prevStep, companyId, meetingId, existingData }) => {
    // Initialize state directly with existing data or default values
    const [meetingData, setMeetingData] = useState(() => {
        if (existingData && Object.keys(existingData).length > 0) {
            console.log("Initializing with existing meeting data:", existingData);
            return {
                meetingDate: existingData.meeting_date || "",
                meetingTime: existingData.meeting_time || "",
                meetingType: existingData.meeting_type || "virtual",
                meetingPlatform: existingData.meeting_platform || "",
                meetingLocation: existingData.meeting_location || "", // Fixed: Added meeting_location
                attendees: existingData.attendee || "",
                meetingNotes: "",
                actionItems: "",
                nextSteps: "",
                meetingOutcome: "",
                keyDiscussionPoints: existingData.agenda || "",
            };
        } else if (data && Object.keys(data).length > 0) {
            return data;
        } else {
            return {
                meetingDate: "",
                meetingTime: "",
                meetingType: "virtual",
                meetingPlatform: "",
                meetingLocation: "", // Fixed: Added meeting_location
                attendees: "",
                meetingNotes: "",
                actionItems: "",
                nextSteps: "",
                meetingOutcome: "",
                keyDiscussionPoints: "",
            };
        }
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Helper function to get CSRF token safely
    const getCsrfToken = () => {
        if (typeof document === 'undefined') return '';
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute('content') : '';
    };

    const handleChange = (field, value) => {
        const updatedData = { ...meetingData, [field]: value };
        setMeetingData(updatedData);
        updateData(updatedData);
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
                meeting_date: meetingData.meetingDate,
                meeting_time: meetingData.meetingTime,
                meeting_type: meetingData.meetingType,
                meeting_platform: meetingData.meetingType === "virtual" ? meetingData.meetingPlatform : null, // Only include for virtual
                meeting_location: meetingData.meetingType === "in-person" ? meetingData.meetingLocation : null, // Fixed: Added meeting_location
                attendee: meetingData.attendees,
                agenda: meetingData.keyDiscussionPoints,
            };

            console.log("Submitting meeting data:", backendData);
            console.log("Meeting ID:", meetingId);

            if (meetingId) {
                // Update existing meeting
                const response = await axios.put(
                    `/ourmeeting/${meetingId}`,
                    backendData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': getCsrfToken(),
                        },
                    }
                );
                console.log("Meeting updated successfully:", response.data);
            } else {
                // Create new meeting
                const response = await axios.post(
                    '/ourmeeting',
                    backendData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': getCsrfToken(),
                        },
                    }
                );
                console.log("Meeting created successfully:", response.data);
                
                // If creating new, update the meetingId in parent component if needed
                if (response.data.meeting_id) {
                    console.log("New meeting ID:", response.data.meeting_id);
                }
            }

            nextStep();
            
        } catch (error) {
            console.error("Error saving meeting data", error);
            if (error.response) {
                console.error("Server response:", error.response.data);
                setErrors({ 
                    submit: `Failed to save meeting data: ${error.response.data.message || 'Please try again.'}` 
                });
            } else {
                setErrors({ submit: "Failed to save meeting data. Please try again." });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!meetingData.meetingDate) {
            newErrors.meetingDate = "Meeting date is required";
        }

        if (!meetingData.meetingTime) {
            newErrors.meetingTime = "Meeting time is required";
        }

        if (!meetingData.meetingType) {
            newErrors.meetingType = "Meeting type is required";
        }

        if (meetingData.meetingType === "virtual" && !meetingData.meetingPlatform) {
            newErrors.meetingPlatform = "Platform is required for virtual meetings";
        }

        if (meetingData.meetingType === "in-person" && !meetingData.meetingLocation) {
            newErrors.meetingLocation = "Location is required for in-person meetings"; // Fixed: Added validation
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Helper function to get input className with error state
    const getInputClassName = (fieldName) => {
        const baseClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
        return errors[fieldName]
            ? `${baseClass} border-red-500 focus:ring-red-500`
            : baseClass;
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {meetingId ? "Edit Meeting" : "Create Meeting"}
                </h2>
                {meetingId && (
                    <p className="text-sm text-gray-600">Meeting ID: {meetingId}</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Meeting Scheduling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meeting Date *
                        </label>
                        <input
                            type="date"
                            value={meetingData.meetingDate}
                            onChange={(e) =>
                                handleChange("meetingDate", e.target.value)
                            }
                            className={getInputClassName("meetingDate")}
                            required
                        />
                        {errors.meetingDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.meetingDate}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meeting Time *
                        </label>
                        <input
                            type="time"
                            value={meetingData.meetingTime}
                            onChange={(e) =>
                                handleChange("meetingTime", e.target.value)
                            }
                            className={getInputClassName("meetingTime")}
                            required
                        />
                        {errors.meetingTime && (
                            <p className="mt-1 text-sm text-red-600">{errors.meetingTime}</p>
                        )}
                    </div>
                </div>

                {/* Meeting Type and Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meeting Type *
                        </label>
                        <select
                            value={meetingData.meetingType}
                            onChange={(e) =>
                                handleChange("meetingType", e.target.value)
                            }
                            className={getInputClassName("meetingType")}
                        >
                            <option value="virtual">Virtual</option>
                            <option value="in-person">In-Person</option>
                            <option value="phone">Phone Call</option>
                        </select>
                        {errors.meetingType && (
                            <p className="mt-1 text-sm text-red-600">{errors.meetingType}</p>
                        )}
                    </div>

                    {meetingData.meetingType === "virtual" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platform *
                            </label>
                            <select
                                value={meetingData.meetingPlatform}
                                onChange={(e) =>
                                    handleChange(
                                        "meetingPlatform",
                                        e.target.value
                                    )
                                }
                                className={getInputClassName("meetingPlatform")}
                            >
                                <option value="">Select Platform</option>
                                <option value="zoom">Zoom</option>
                                <option value="teams">Microsoft Teams</option>
                                <option value="google-meet">Google Meet</option>
                                <option value="webex">Webex</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.meetingPlatform && (
                                <p className="mt-1 text-sm text-red-600">{errors.meetingPlatform}</p>
                            )}
                        </div>
                    )}

                    {meetingData.meetingType === "in-person" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                value={meetingData.meetingLocation}
                                onChange={(e) =>
                                    handleChange(
                                        "meetingLocation",
                                        e.target.value
                                    )
                                }
                                placeholder="Meeting venue or address"
                                className={getInputClassName("meetingLocation")} // Fixed: Added error styling
                            />
                            {errors.meetingLocation && (
                                <p className="mt-1 text-sm text-red-600">{errors.meetingLocation}</p>
                            )}
                        </div>
                    )}

                    {meetingData.meetingType === "phone" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Call Details
                            </label>
                            <input
                                type="text"
                                value="Phone call - no platform or location needed"
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            />
                        </div>
                    )}
                </div>

                {/* Attendees */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attendees
                    </label>
                    <input
                        type="text"
                        value={meetingData.attendees}
                        onChange={(e) =>
                            handleChange("attendees", e.target.value)
                        }
                        placeholder="Enter attendee names separated by commas"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Separate multiple attendees with commas
                    </p>
                </div>

                {/* Key Discussion Points & Agenda */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Discussion Points & Agenda
                    </label>
                    <textarea
                        value={meetingData.keyDiscussionPoints}
                        onChange={(e) => 
                            handleChange("keyDiscussionPoints", e.target.value)
                        }
                        rows="4"
                        placeholder="Enter key discussion points, important decisions, budget discussions, timeline discussions, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Error Message */}
                {errors.submit && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={submitting}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Saving...' : meetingId ? 'Update Meeting' : 'Create Meeting'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditMeeting;