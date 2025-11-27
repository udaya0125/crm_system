import React from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const EditMeeting = ({
    data,
    updateData,
    nextStep,
    prevStep,
    companyId,
    meetingId,
    existingData,
}) => {
    const [submitting, setSubmitting] = React.useState(false);

    // React Hook Form initialization
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            meetingDate: existingData?.meeting_date || data?.meetingDate || "",
            meetingTime: existingData?.meeting_time || data?.meetingTime || "",
            meetingType:
                existingData?.meeting_type || data?.meetingType || "virtual",
            meetingPlatform:
                existingData?.meeting_platform || data?.meetingPlatform || "",
            meetingLocation:
                existingData?.meeting_location || data?.meetingLocation || "",
            attendees: existingData?.attendee || data?.attendees || "",
            meetingNotes: data?.meetingNotes || "",
            actionItems: data?.actionItems || "",
            nextSteps: data?.nextSteps || "",
            meetingOutcome: data?.meetingOutcome || "",
            keyDiscussionPoints:
                existingData?.agenda || data?.keyDiscussionPoints || "",
        },
    });

    // React Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "blockquote", "code-block"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "blockquote",
        "code-block",
    ];

    // Watch meetingType for conditional fields
    const meetingType = watch("meetingType");
    const isVirtual = meetingType === "virtual";
    const isInPerson = meetingType === "in-person";
    const isPhone = meetingType === "phone";

    // Update parent component when form values change
    React.useEffect(() => {
        const subscription = watch((value) => {
            updateData(value);
        });
        return () => subscription.unsubscribe();
    }, [watch, updateData]);

    // Helper function to get CSRF token safely
    const getCsrfToken = () => {
        if (typeof document === "undefined") return "";
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute("content") : "";
    };

    const onSubmit = async (formData) => {
        try {
            setSubmitting(true);

            // Map frontend field names to backend field names
            const backendData = {
                company_id: companyId,
                meeting_date: formData.meetingDate,
                meeting_time: formData.meetingTime,
                meeting_type: formData.meetingType,
                meeting_platform: isVirtual ? formData.meetingPlatform : null,
                meeting_location: isInPerson ? formData.meetingLocation : null,
                attendee: formData.attendees,
                agenda: formData.keyDiscussionPoints,
            };

            console.log("Submitting meeting data:", backendData);
            console.log("Meeting ID:", meetingId);

            let response;
            if (meetingId) {
                // Update existing meeting
                response = await axios.put(
                    `/ourmeeting/${meetingId}`,
                    backendData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": getCsrfToken(),
                        },
                    }
                );
                console.log("Meeting updated successfully:", response.data);
                toast.success("Meeting updated successfully!");
            } else {
                // Create new meeting
                response = await axios.post("/ourmeeting", backendData, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": getCsrfToken(),
                    },
                });
                console.log("Meeting created successfully:", response.data);
                toast.success("Meeting created successfully!");

                if (response.data.meeting_id) {
                    console.log("New meeting ID:", response.data.meeting_id);
                }
            }

            nextStep();
        } catch (error) {
            console.error("Error saving meeting data", error);
            let errorMessage = "Failed to save meeting data. Please try again.";

            if (error.response) {
                console.error("Server response:", error.response.data);
                errorMessage = `Failed to save meeting data: ${
                    error.response.data.message || "Please try again."
                }`;
            }

            // Show error toast
            toast.error(errorMessage);
            
            setError("submit", {
                type: "manual",
                message: errorMessage,
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Helper function to get input className with error state
    const getInputClassName = (fieldName) => {
        const baseClass =
            "w-full px-3 py-2  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";
        return errors[fieldName]
            ? `${baseClass} border-red-500 focus:ring-red-500 bg-red-50`
            : baseClass;
    };

    return (
        <div className="max-w-7xl mx-auto p-6 ">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                noValidate
            >
                {/* Meeting Scheduling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meeting Date *
                        </label>
                        <input
                            type="date"
                            {...register("meetingDate", {
                                required: "Meeting date is required",
                            })}
                            className={getInputClassName("meetingDate")}
                        />
                        {errors.meetingDate && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.meetingDate.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meeting Time *
                        </label>
                        <input
                            type="time"
                            {...register("meetingTime", {
                                required: "Meeting time is required",
                            })}
                            className={getInputClassName("meetingTime")}
                        />
                        {errors.meetingTime && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.meetingTime.message}
                            </p>
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
                            {...register("meetingType", {
                                required: "Meeting type is required",
                            })}
                            className={getInputClassName("meetingType")}
                        >
                            <option value="virtual">Virtual</option>
                            <option value="in-person">In-Person</option>
                            <option value="phone">Phone Call</option>
                        </select>
                        {errors.meetingType && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.meetingType.message}
                            </p>
                        )}
                    </div>

                    {isVirtual && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platform *
                            </label>
                            <select
                                {...register("meetingPlatform", {
                                    required: isVirtual
                                        ? "Platform is required for virtual meetings"
                                        : false,
                                })}
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
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.meetingPlatform.message}
                                </p>
                            )}
                        </div>
                    )}

                    {isInPerson && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                {...register("meetingLocation", {
                                    required: isInPerson
                                        ? "Location is required for in-person meetings"
                                        : false,
                                })}
                                placeholder="Meeting venue or address"
                                className={getInputClassName("meetingLocation")}
                            />
                            {errors.meetingLocation && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.meetingLocation.message}
                                </p>
                            )}
                        </div>
                    )}

                    {isPhone && (
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
                        {...register("attendees")}
                        placeholder="Enter attendee names separated by commas"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Separate multiple attendees with commas
                    </p>
                </div>

                {/* Key Discussion Points & Agenda with React Quill */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Discussion Points & Agenda
                    </label>
                    <Controller
                        name="keyDiscussionPoints"
                        control={control}
                        render={({ field }) => (
                            <ReactQuill
                                {...field}
                                theme="snow"
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Enter key discussion points, important decisions, budget discussions, timeline discussions, etc."
                                className="rounded-md h-[250px] focus:outline-none focus:ring-2 focus:ring-blue-500 "
                            />
                        )}
                    />
                    {errors.keyDiscussionPoints && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.keyDiscussionPoints.message}
                        </p>
                    )}
                </div>

                {/* Error Message */}
                {errors.submit && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">
                            {errors.submit.message}
                        </p>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={submitting}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {submitting
                            ? "Saving..."
                            : meetingId
                            ? "Update Meeting"
                            : "Create Meeting"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditMeeting;