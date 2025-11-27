import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const Meeting = ({ data, updateData, nextStep, prevStep, companyId }) => {
    const [existingMeetingId, setExistingMeetingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting, isValid },
        setError,
        clearErrors
    } = useForm({
        mode: "onChange",
        defaultValues: {
            meetingDate: data.meetingDate || "",
            meetingTime: data.meetingTime || "",
            meetingType: data.meetingType || "virtual",
            meetingPlatform: data.meetingPlatform || "",
            meetingLocation: data.meetingLocation || "",
            attendees: Array.isArray(data.attendees) ? data.attendees.join(", ") : data.attendees || "",
            agenda: data.agenda || "",
        }
    });

    const meetingType = watch("meetingType");

    // React Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    useEffect(() => {
        console.log("Company ID in Meeting:", companyId);
        console.log("Data in Meeting:", data);
        
        // Check if meeting data already exists and has an ID
        if (data.meetingId) {
            setExistingMeetingId(data.meetingId);
        }
    }, [companyId, data]);

    // Clear companyId error when companyId becomes available
    useEffect(() => {
        if (companyId) {
            clearErrors("companyId");
        }
    }, [companyId, clearErrors]);

    // Clear meeting location when switching to virtual/phone
    useEffect(() => {
        if (meetingType !== "in-person") {
            setValue("meetingLocation", "");
            clearErrors("meetingLocation");
        }
    }, [meetingType, setValue, clearErrors]);

    // Clear meeting platform when switching to in-person/phone
    useEffect(() => {
        if (meetingType !== "virtual") {
            setValue("meetingPlatform", "");
            clearErrors("meetingPlatform");
        }
    }, [meetingType, setValue, clearErrors]);

    // Check if meeting exists for this company
    const checkExistingMeeting = async () => {
        if (!companyId) return null;
        
        try {
            const response = await axios.get(route("ourmeeting.check", { companyId }));
            return response.data;
        } catch (error) {
            console.log("Error checking existing meeting", error);
            return null;
        }
    };

    // Axios store function for meeting
    const storeMeeting = async (meetingData) => {
        try {
            console.log("Sending API request with data:", meetingData);

            const response = await axios.post(
                route("ourmeeting.store"),
                meetingData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.log("Error creating meeting", error);
            throw error;
        }
    };

    // Axios update function for meeting
    const updateMeeting = async (meetingData, meetingId) => {
        try {
            console.log("Updating meeting with ID:", meetingId, "Data:", meetingData);

            const response = await axios.put(
                route("ourmeeting.update", { id: meetingId }),
                meetingData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.log("Error updating meeting", error);
            throw error;
        }
    };

    const onSubmit = async (formData) => {
        if (!companyId) {
            setError("companyId", {
                type: "manual",
                message: "Company ID is required. Please go back and select a company."
            });
            toast.error("Company information is missing. Please go back and select a company.");
            return;
        }

        setIsLoading(true);

        // Show loading toast
        const loadingToast = toast.loading(
            existingMeetingId ? "Updating meeting..." : "Creating meeting..."
        );

        try {
            // Prepare data for API - map React field names to Laravel model field names
            const apiData = {
                company_id: companyId,
                meeting_date: formData.meetingDate,
                meeting_time: formData.meetingTime,
                meeting_type: formData.meetingType,
                meeting_platform: formData.meetingType === "virtual" ? formData.meetingPlatform : null,
                meeting_location: formData.meetingType === "in-person" ? formData.meetingLocation : null,
                attendee: formData.attendees,
                agenda: formData.agenda,
            };

            console.log("Final API data being sent:", apiData);

            let result;
            let meetingIdToStore = existingMeetingId;
            
            // Check if we're updating an existing meeting or creating a new one
            if (existingMeetingId) {
                // Update existing meeting
                result = await updateMeeting(apiData, existingMeetingId);
                console.log("Meeting updated successfully:", result);
                
                // Update loading toast to success
                toast.success("Meeting updated successfully!", { id: loadingToast });
            } else {
                // Create new meeting
                result = await storeMeeting(apiData);
                console.log("Meeting created successfully:", result);
                
                // Update loading toast to success
                toast.success("Meeting created successfully!", { id: loadingToast });
                
                // Store the new meeting ID for potential future updates
                if (result.meeting && result.meeting.id) {
                    meetingIdToStore = result.meeting.id;
                    setExistingMeetingId(result.meeting.id);
                } else if (result.meeting_id) {
                    meetingIdToStore = result.meeting_id;
                    setExistingMeetingId(result.meeting_id);
                } else if (result.data && result.data.id) {
                    meetingIdToStore = result.data.id;
                    setExistingMeetingId(result.data.id);
                }
            }

            // Update parent component data with meeting ID
            updateData({
                meetingId: meetingIdToStore,
                meetingDate: formData.meetingDate,
                meetingTime: formData.meetingTime,
                meetingType: formData.meetingType,
                meetingPlatform: formData.meetingPlatform,
                meetingLocation: formData.meetingLocation,
                attendees: formData.attendees.split(",").map(item => item.trim()).filter(item => item !== ""),
                agenda: formData.agenda,
            });

            // Show success message and move to next step
            setTimeout(() => {
                nextStep();
            }, 1000); // Small delay to show success message

        } catch (error) {
            console.log("Error saving meeting", error);
            
            // Update loading toast to error
            toast.error(
                `Error ${existingMeetingId ? 'updating' : 'creating'} meeting. Please try again.`, 
                { id: loadingToast }
            );
            
            // Handle API validation errors
            if (error.response && error.response.data.errors) {
                const apiErrors = error.response.data.errors;

                // Show validation error toast
                toast.error("Please check the form for errors.");

                // Map Laravel field names back to React field names
                Object.keys(apiErrors).forEach((key) => {
                    switch (key) {
                        case "meeting_date":
                            setError("meetingDate", { type: "server", message: apiErrors[key][0] });
                            break;
                        case "meeting_time":
                            setError("meetingTime", { type: "server", message: apiErrors[key][0] });
                            break;
                        case "meeting_type":
                            setError("meetingType", { type: "server", message: apiErrors[key][0] });
                            break;
                        case "meeting_platform":
                            setError("meetingPlatform", { type: "server", message: apiErrors[key][0] });
                            break;
                        case "meeting_location":
                            setError("meetingLocation", { type: "server", message: apiErrors[key][0] });
                            break;
                        case "attendee":
                            setError("attendees", { type: "server", message: apiErrors[key][0] });
                            break;
                        case "agenda":
                            setError("agenda", { type: "server", message: apiErrors[key][0] });
                            break;
                        case "company_id":
                            setError("companyId", { type: "server", message: apiErrors[key][0] });
                            break;
                        default:
                            setError(key, { type: "server", message: apiErrors[key][0] });
                    }
                });
            } else if (error.response && error.response.data.message) {
                // Show server error message
                toast.error(error.response.data.message);
            } else if (error.message) {
                // Show generic error message
                toast.error(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Determine if form can be submitted
    const canSubmit = companyId && isValid && !isSubmitting && !isLoading;

    // Show error if companyId is missing
    if (!companyId) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-red-800 font-medium text-lg mb-2">
                        Error: Company Information Missing
                    </h3>
                    <p className="text-red-600 mb-4">
                        Unable to save meeting details because company
                        information is missing. Please go back and ensure a
                        company is properly selected.
                    </p>
                    <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Back to Company Selection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Meeting Details
                    </h2>
                    {existingMeetingId && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            Editing Existing Meeting
                        </span>
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Company ID Error Display */}
                    {errors.companyId && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-red-500 text-sm">
                                {errors.companyId.message}
                            </p>
                        </div>
                    )}

                    {/* Meeting Scheduling */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meeting Date *
                            </label>
                            <input
                                type="date"
                                {...register("meetingDate", { 
                                    required: "Meeting date is required" 
                                })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.meetingDate
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.meetingDate && (
                                <p className="text-red-500 text-xs mt-1">
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
                                    required: "Meeting time is required" 
                                })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.meetingTime
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.meetingTime && (
                                <p className="text-red-500 text-xs mt-1">
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
                                    required: "Meeting type is required" 
                                })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.meetingType
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            >
                                <option value="virtual">Virtual</option>
                                <option value="in-person">In-Person</option>
                                <option value="phone">Phone Call</option>
                            </select>
                            {errors.meetingType && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.meetingType.message}
                                </p>
                            )}
                        </div>

                        {meetingType === "virtual" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Platform *
                                </label>
                                <select
                                    {...register("meetingPlatform", { 
                                        required: "Platform is required for virtual meetings" 
                                    })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.meetingPlatform
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Select Platform</option>
                                    <option value="zoom">Zoom</option>
                                    <option value="teams">
                                        Microsoft Teams
                                    </option>
                                    <option value="google-meet">
                                        Google Meet
                                    </option>
                                    <option value="webex">Webex</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.meetingPlatform && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.meetingPlatform.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {meetingType === "in-person" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    {...register("meetingLocation", { 
                                        required: "Location is required for in-person meetings" 
                                    })}
                                    placeholder="Meeting venue or address"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.meetingLocation
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.meetingLocation && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.meetingLocation.message}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Attendees */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attendees *
                        </label>
                        <input
                            type="text"
                            {...register("attendees", { 
                                required: "At least one attendee is required",
                                validate: value => {
                                    const attendees = value.split(",").map(item => item.trim()).filter(item => item !== "");
                                    return attendees.length > 0 || "At least one attendee is required";
                                }
                            })}
                            placeholder="Enter attendee names separated by commas"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.attendees
                                    ? "border-red-300"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.attendees && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.attendees.message}
                            </p>
                        )}
                    </div>

                    {/* Agenda with React Quill */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Key Discussion Points & Agenda *
                        </label>
                        <Controller
                            name="agenda"
                            control={control}
                            rules={{ 
                                required: "Agenda is required",
                                validate: value => {
                                    // Remove HTML tags and check if there's actual content
                                    const textContent = value.replace(/<[^>]*>/g, '').trim();
                                    return textContent.length > 0 || "Agenda is required";
                                }
                            }}
                            render={({ field }) => (
                                <div className={`border rounded-md focus-within:ring-2 focus-within:ring-blue-500 ${
                                    errors.agenda ? 'border-red-300' : 'border-gray-300'
                                }`}>
                                    <ReactQuill
                                        {...field}
                                        theme="snow"
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter key discussion points, important decisions, budget discussions, timeline discussions, etc."
                                        className="h-48 mb-12"
                                        onChange={(content) => {
                                            field.onChange(content);
                                        }}
                                    />
                                </div>
                            )}
                        />
                        {errors.agenda && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.agenda.message}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            You can format your agenda with headers, lists, and other formatting options
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={isSubmitting || isLoading}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                !canSubmit
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {isSubmitting || isLoading
                                ? (existingMeetingId ? "Updating..." : "Saving...") 
                                : (existingMeetingId ? "Update & Next" : "Save & Next")
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Meeting;