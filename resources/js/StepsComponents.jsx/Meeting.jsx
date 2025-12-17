import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const Meeting = ({ data, updateData, nextStep, prevStep, companyId }) => {
    const [existingMeetingId, setExistingMeetingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [shouldValidate, setShouldValidate] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting, isValid },
        setError,
        clearErrors,
        trigger,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            meetingDate: data.meetingDate || "",
            meetingTime: data.meetingTime || "",
            meetingType: data.meetingType || "in-person",
            meetingLocation: data.meetingLocation || "",
            phoneDetails: data.phoneDetails || "",
            attendees: Array.isArray(data.attendees)
                ? data.attendees.join(", ")
                : data.attendees || "",
            agenda: data.agenda || "",
        },
    });

    const meetingType = watch("meetingType");
    const isPhoneCall = meetingType === "phone";
    const isInPerson = meetingType === "in-person";

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link", "image"],
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
        "indent",
        "link",
        "image",
    ];

    useEffect(() => {
        console.log("Company ID in Meeting:", companyId);
        console.log("Data in Meeting:", data);
        if (data.meetingId) {
            setExistingMeetingId(data.meetingId);
        }
    }, [companyId, data]);

    useEffect(() => {
        if (companyId) {
            clearErrors("companyId");
        }
    }, [companyId, clearErrors]);

    useEffect(() => {
        if (meetingType !== "in-person") {
            setValue("meetingLocation", "");
            clearErrors("meetingLocation");
        }
        if (meetingType !== "phone") {
            setValue("phoneDetails", "");
            clearErrors("phoneDetails");
        }
        
        // Trigger validation when meeting type changes
        trigger(["meetingLocation", "phoneDetails"]);
    }, [meetingType, setValue, clearErrors, trigger]);

    const checkExistingMeeting = async () => {
        if (!companyId) return null;
        try {
            const response = await axios.get(
                route("ourmeeting.check", { companyId })
            );
            return response.data;
        } catch (error) {
            console.log("Error checking existing meeting", error);
            return null;
        }
    };

    const storeMeeting = async (meetingData) => {
        try {
            const response = await axios.post(
                route("ourmeeting.store"),
                meetingData,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error) {
            console.log("Error creating meeting", error);
            throw error;
        }
    };

    const updateMeeting = async (meetingData, meetingId) => {
        try {
            const response = await axios.put(
                route("ourmeeting.update", { id: meetingId }),
                meetingData,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error) {
            console.log("Error updating meeting", error);
            throw error;
        }
    };

    const validateAgenda = (value) => {
        if (!value || value === "<p><br></p>" || value === "<p></p>") {
            return "Agenda is required";
        }
        
        // Remove HTML tags and check for actual content
        const textContent = value.replace(/<[^>]*>/g, "").trim();
        if (textContent.length === 0) {
            return "Agenda is required";
        }
        
        return true;
    };

    const validateAttendees = (value) => {
        if (!value || value.trim() === "") {
            return "At least one attendee is required";
        }
        
        const attendees = value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "");
        
        if (attendees.length === 0) {
            return "At least one attendee is required";
        }
        
        return true;
    };

    const validateLocation = (value) => {
        // Required for in-person meetings
        if (isInPerson && (!value || value.trim() === "")) {
            return "Location is required for in-person meetings";
        }
        return true;
    };

    const validatePhoneDetails = (value) => {
        // Required for phone meetings
        if (isPhoneCall && (!value || value.trim() === "")) {
            return "Phone details are required for phone calls";
        }
        return true;
    };

    const onSubmit = async (formData) => {
        // Set validation flag to true on submit
        setShouldValidate(true);
        
        // First check if companyId is present
        if (!companyId) {
            setError("companyId", {
                type: "manual",
                message:
                    "Company ID is required. Please go back and select a company.",
            });
            toast.error(
                "Company information is missing. Please go back and select a company."
            );
            return;
        }

        // Validate all fields before submitting
        const isFormValid = await trigger();
        if (!isFormValid) {
            toast.error("Please fill in all required fields correctly");
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading(
            existingMeetingId ? "Updating meeting..." : "Creating meeting..."
        );

        try {
            const apiData = {
                company_id: companyId,
                meeting_date: formData.meetingDate,
                meeting_time: formData.meetingTime,
                meeting_type: formData.meetingType,
                meeting_location:
                    formData.meetingType === "in-person"
                        ? formData.meetingLocation
                        : null,
                phone_details:
                    formData.meetingType === "phone"
                        ? formData.phoneDetails
                        : null,
                attendee: formData.attendees,
                agenda: formData.agenda,
            };

            console.log("Final API data being sent:", apiData);

            let result;
            let meetingIdToStore = existingMeetingId;

            if (existingMeetingId) {
                result = await updateMeeting(apiData, existingMeetingId);
                toast.success("Meeting updated successfully!", {
                    id: loadingToast,
                });
            } else {
                result = await storeMeeting(apiData);
                toast.success("Meeting created successfully!", {
                    id: loadingToast,
                });

                if (result.meeting?.id) {
                    meetingIdToStore = result.meeting.id;
                } else if (result.meeting_id) {
                    meetingIdToStore = result.meeting_id;
                } else if (result.data?.id) {
                    meetingIdToStore = result.data.id;
                }
                setExistingMeetingId(meetingIdToStore);
            }

            updateData({
                meetingId: meetingIdToStore,
                meetingDate: formData.meetingDate,
                meetingTime: formData.meetingTime,
                meetingType: formData.meetingType,
                meetingLocation: formData.meetingLocation,
                phoneDetails: formData.phoneDetails,
                attendees: formData.attendees
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item !== ""),
                agenda: formData.agenda,
            });

            setTimeout(() => nextStep(), 1000);
        } catch (error) {
            console.log("Error saving meeting", error);
            toast.error(
                `Error ${
                    existingMeetingId ? "updating" : "creating"
                } meeting. Please try again.`,
                { id: loadingToast }
            );

            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                Object.keys(apiErrors).forEach((key) => {
                    switch (key) {
                        case "meeting_date":
                            setError("meetingDate", {
                                type: "server",
                                message: apiErrors[key][0],
                            });
                            break;
                        case "meeting_time":
                            setError("meetingTime", {
                                type: "server",
                                message: apiErrors[key][0],
                            });
                            break;
                        case "meeting_type":
                            setError("meetingType", {
                                type: "server",
                                message: apiErrors[key][0],
                            });
                            break;
                        case "meeting_location":
                            setError("meetingLocation", {
                                type: "server",
                                message: apiErrors[key][0],
                            });
                            break;
                        case "phone_details":
                            setError("phoneDetails", {
                                type: "server",
                                message: apiErrors[key][0],
                            });
                            break;
                        case "attendee":
                            setError("attendees", {
                                type: "server",
                                message: apiErrors[key][0],
                            });
                            break;
                        case "agenda":
                            setError("agenda", {
                                type: "server",
                                message: apiErrors[key][0],
                            });
                            break;
                        case "company_id":
                            setError("companyId", {
                                type: "server",
                                message: apiErrors[key][0],
                            });
                            break;
                        default:
                            setError(key, {
                                type: "server",
                                message: apiErrors[key][0],
                            });
                    }
                });
                toast.error("Please check the form for errors.");
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.message) {
                toast.error(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!companyId) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                    <h3 className="text-red-800 font-medium text-base sm:text-lg mb-2">
                        Error: Company Information Missing
                    </h3>
                    <p className="text-red-600 text-sm mb-4">
                        Unable to save meeting details because company
                        information is missing. Please go back and ensure a
                        company is properly selected.
                    </p>
                    <button
                        type="button"
                        onClick={prevStep}
                        className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Back to Company Selection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                        Meeting Details
                    </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {errors.companyId && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                            <p className="text-red-500">
                                {errors.companyId.message}
                            </p>
                        </div>
                    )}

                    {/* Meeting Scheduling */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Meeting Date *
                                </label>
                                <input
                                    type="date"
                                    {...register("meetingDate", {
                                        required: "Meeting date is required",
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Meeting Time *
                                </label>
                                <input
                                    type="time"
                                    {...register("meetingTime", {
                                        required: "Meeting time is required",
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
                    </div>

                    {/* Meeting Type and Details */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meeting Type *
                            </label>
                            <select
                                {...register("meetingType", {
                                    required: "Meeting type is required",
                                })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.meetingType
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            >
                                <option value="in-person">In-Person</option>
                                <option value="phone">Phone Call</option>
                                <option value="on-office">On Office</option>
                            </select>
                            {errors.meetingType && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.meetingType.message}
                                </p>
                            )}
                        </div>

                        {meetingType === "in-person" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    {...register("meetingLocation", {
                                        required: "Location is required for in-person meetings",
                                        validate: validateLocation,
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

                        {isPhoneCall && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number / Call Details *
                                </label>
                                <input
                                    type="text"
                                    {...register("phoneDetails", {
                                        required: "Phone details are required for phone calls",
                                        validate: validatePhoneDetails,
                                    })}
                                    placeholder="Enter phone number or specific call instructions"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.phoneDetails
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Example: +1 (555) 123-4567, Ext. 123, or "Call will be initiated by our team"
                                </p>
                                {errors.phoneDetails && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.phoneDetails.message}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Attendees */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attendees *
                        </label>
                        <input
                            type="text"
                            {...register("attendees", {
                                required: "At least one attendee is required",
                                validate: validateAttendees,
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

                    {/* Agenda */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Key Discussion Points & Agenda *
                        </label>
                        <Controller
                            name="agenda"
                            control={control}
                            rules={{
                                required: "Agenda is required",
                                validate: validateAgenda,
                            }}
                            render={({ field }) => (
                                <div>
                                    <div className={`border rounded-md overflow-hidden ${errors.agenda ? 'border-red-300' : 'border-gray-300'} focus-within:ring-2 focus-within:ring-blue-500`}>
                                        <ReactQuill
                                            {...field}
                                            theme="snow"
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Enter key discussion points..."
                                            className="h-[200px] sm:h-[200px]"
                                            onChange={(content) => {
                                                field.onChange(content);
                                                // Trigger validation on change
                                                setTimeout(() => trigger("agenda"), 100);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        />
                        {errors.agenda && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.agenda.message}
                            </p>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={isSubmitting || isLoading}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting || isLoading
                                ? existingMeetingId
                                    ? "Updating..."
                                    : "Saving..."
                                : existingMeetingId
                                ? "Update & Next"
                                : "Save & Next"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Meeting;