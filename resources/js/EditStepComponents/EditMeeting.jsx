import React, { useState } from "react";

const EditMeeting = ({ data, updateData, nextStep, prevStep }) => {
    const [meetingData, setMeetingData] = useState({
        meetingDate: data.meetingDate || "",
        meetingTime: data.meetingTime || "",
        meetingType: data.meetingType || "virtual",
        meetingPlatform: data.meetingPlatform || "",
        meetingLocation: data.meetingLocation || "",
        attendees: data.attendees || [],
        meetingNotes: data.meetingNotes || "",
        actionItems: data.actionItems || [],
        nextSteps: data.nextSteps || "",
        meetingOutcome: data.meetingOutcome || "",
        keyDiscussionPoints: data.keyDiscussionPoints || "",
    });

    const handleChange = (field, value) => {
        const updatedData = { ...meetingData, [field]: value };
        setMeetingData(updatedData);
        updateData(updatedData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* <h2 className="text-2xl font-bold mb-6">Meeting Details</h2> */}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Meeting Scheduling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meeting Date
                        </label>
                        <input
                            type="date"
                            value={meetingData.meetingDate}
                            onChange={(e) =>
                                handleChange("meetingDate", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meeting Time
                        </label>
                        <input
                            type="time"
                            value={meetingData.meetingTime}
                            onChange={(e) =>
                                handleChange("meetingTime", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Meeting Type and Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meeting Type
                        </label>
                        <select
                            value={meetingData.meetingType}
                            onChange={(e) =>
                                handleChange("meetingType", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="virtual">Virtual</option>
                            <option value="in-person">In-Person</option>
                            <option value="phone">Phone Call</option>
                        </select>
                    </div>

                    {meetingData.meetingType === "virtual" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platform
                            </label>
                            <select
                                value={meetingData.meetingPlatform}
                                onChange={(e) =>
                                    handleChange(
                                        "meetingPlatform",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Platform</option>
                                <option value="zoom">Zoom</option>
                                <option value="teams">Microsoft Teams</option>
                                <option value="google-meet">Google Meet</option>
                                <option value="webex">Webex</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    )}

                    {meetingData.meetingType === "in-person" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        value={meetingData.attendees.join(", ")}
                        onChange={(e) =>
                            handleChange(
                                "attendees",
                                e.target.value
                                    .split(",")
                                    .map((item) => item.trim())
                            )
                        }
                        placeholder="Enter attendee names separated by commas"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Key Discussion Points */}
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

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                    <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditMeeting;