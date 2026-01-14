import React, { useState, useEffect } from "react";
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
    const [submitting, setSubmitting] = useState(false);
    const [isPhone, setIsPhone] = useState(false);
    const [isInPerson, setIsInPerson] = useState(false);
    const [hasPhoneDetails, setHasPhoneDetails] = useState(false);
    const [hasMeetingLocation, setHasMeetingLocation] = useState(false);

    // Track if user has interacted with the form
    const [touchedFields, setTouchedFields] = useState({});

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        setError,
        clearErrors,
        trigger,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            meetingDate: existingData?.meeting_date || data?.meetingDate || "",
            meetingTime: existingData?.meeting_time || data?.meetingTime || "",
            meetingType:
                existingData?.meeting_type || data?.meetingType || "in-person",
            meetingLocation:
                existingData?.meeting_location || data?.meetingLocation || "",
            phoneDetails:
                existingData?.phone_details || data?.phoneDetails || "",
            attendees: existingData?.attendee
                ? Array.isArray(existingData.attendee)
                    ? existingData.attendee.join(", ")
                    : existingData.attendee
                : data?.attendees || "",
            keyDiscussionPoints:
                existingData?.agenda || data?.keyDiscussionPoints || "",
        },
    });

    const meetingType = watch("meetingType");
    const phoneDetails = watch("phoneDetails");
    const meetingLocation = watch("meetingLocation");

    // Track field interactions
    const handleFieldBlur = (fieldName) => {
        setTouchedFields((prev) => ({
            ...prev,
            [fieldName]: true,
        }));
    };

    // Update meeting type flags when meetingType changes
    useEffect(() => {
        const phone = meetingType === "phone";
        const inPerson = meetingType === "in-person";
        setIsPhone(phone);
        setIsInPerson(inPerson);
        setHasPhoneDetails(!!existingData?.phone_details);
        setHasMeetingLocation(!!existingData?.meeting_location);

        // Clear errors when switching meeting types
        if (meetingType === "phone") {
            clearErrors("meetingLocation");
        } else if (meetingType === "in-person") {
            clearErrors("phoneDetails");
        }
    }, [meetingType, existingData, clearErrors]);

    // Watch for changes and update parent data
    useEffect(() => {
        const subscription = watch((value) => {
            updateData({
                meetingDate: value.meetingDate,
                meetingTime: value.meetingTime,
                meetingType: value.meetingType,
                meetingLocation: value.meetingLocation,
                phoneDetails: value.phoneDetails,
                attendees: value.attendees,
                keyDiscussionPoints: value.keyDiscussionPoints,
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, updateData]);

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "blockquote"],
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
    ];

    const getCsrfToken = () => {
        if (typeof document === "undefined") return "";
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute("content") : "";
    };

    const validateAttendees = (value) => {
        if (!value) {
            return "Attendees are required";
        }
        const attendees = value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "");
        return attendees.length > 0 || "Please enter at least one attendee";
    };

    const validateAgenda = (value) => {
        if (!value) {
            return "Agenda is required";
        }
        const textContent = value.replace(/<[^>]*>/g, "").trim();
        return textContent.length > 0 || "Please enter some discussion points";
    };

    // FIXED: Validation functions that properly check meeting type
    const validatePhoneDetails = (value, meetingType) => {
        // Always validate on submission regardless of touched state
        if (meetingType === "phone" && (!value || value.trim() === "")) {
            return "Phone details are required for phone meetings";
        }
        return true;
    };

    const validateMeetingLocation = (value, meetingType) => {
        // Always validate on submission regardless of touched state
        if (meetingType === "in-person" && (!value || value.trim() === "")) {
            return "Location is required for in-person meetings";
        }
        return true;
    };

    const onSubmit = async (formData) => {
        if (!companyId) {
            setError("companyId", {
                type: "manual",
                message: "Company ID is required. Please select a company.",
            });
            toast.error("Company information is missing.");
            return;
        }

        // Mark all fields as touched before validation
        const allFields = [
            "meetingDate",
            "meetingTime",
            "meetingType",
            "attendees",
            "keyDiscussionPoints",
        ];
        if (isPhone) allFields.push("phoneDetails");
        if (isInPerson) allFields.push("meetingLocation");

        const newTouched = {};
        allFields.forEach((field) => {
            newTouched[field] = true;
        });
        setTouchedFields(newTouched);

        // Perform manual validation for conditional fields
        let isFormValid = true;

        // Validate phone details if meeting type is phone
        if (meetingType === "phone") {
            const phoneValidation = validatePhoneDetails(
                formData.phoneDetails,
                meetingType
            );
            if (phoneValidation !== true) {
                setError("phoneDetails", {
                    type: "manual",
                    message: phoneValidation,
                });
                isFormValid = false;
            } else {
                clearErrors("phoneDetails");
            }
        }

        // Validate meeting location if meeting type is in-person
        if (meetingType === "in-person") {
            const locationValidation = validateMeetingLocation(
                formData.meetingLocation,
                meetingType
            );
            if (locationValidation !== true) {
                setError("meetingLocation", {
                    type: "manual",
                    message: locationValidation,
                });
                isFormValid = false;
            } else {
                clearErrors("meetingLocation");
            }
        }

        // Trigger validation for all other fields
        const otherFieldsValid = await trigger();

        if (!isFormValid || !otherFieldsValid) {
            toast.error("Please fill in all required fields correctly");
            return;
        }

        try {
            setSubmitting(true);

            const apiData = {
                company_id: companyId,
                meeting_date: formData.meetingDate,
                meeting_time: formData.meetingTime,
                meeting_type: formData.meetingType,
                meeting_location: formData.meetingLocation || null,
                phone_details: formData.phoneDetails || null,
                attendee: formData.attendees,
                agenda: formData.keyDiscussionPoints,
            };

            console.log("Submitting meeting data:", apiData);
            console.log("Meeting ID:", meetingId);

            let response;
            if (meetingId) {
                response = await axios.put(
                    `/ourmeeting/${meetingId}`,
                    apiData,
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
                response = await axios.post("/ourmeeting", apiData, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": getCsrfToken(),
                    },
                });
                console.log("Meeting created successfully:", response.data);
                toast.success("Meeting created successfully!");
            }

            // Update local data with saved meeting ID if new meeting
            if (!meetingId && response.data?.id) {
                updateData({
                    meetingId: response.data.id,
                    ...formData,
                });
            }

            nextStep();
        } catch (error) {
            console.error("Error saving meeting data", error);

            let errorMessage = "Failed to save meeting data. Please try again.";

            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                Object.keys(apiErrors).forEach((key) => {
                    let formField = key;
                    // Map API field names to form field names
                    switch (key) {
                        case "meeting_date":
                            formField = "meetingDate";
                            break;
                        case "meeting_time":
                            formField = "meetingTime";
                            break;
                        case "meeting_type":
                            formField = "meetingType";
                            break;
                        case "meeting_location":
                            formField = "meetingLocation";
                            break;
                        case "phone_details":
                            formField = "phoneDetails";
                            break;
                        case "attendee":
                            formField = "attendees";
                            break;
                        case "agenda":
                            formField = "keyDiscussionPoints";
                            break;
                        case "company_id":
                            formField = "companyId";
                            break;
                        default:
                            console.warn(
                                `Unhandled server error for key: ${key}`
                            );
                            return;
                    }

                    setError(formField, {
                        type: "server",
                        message: apiErrors[key][0],
                    });
                });
                errorMessage = "Please check the form for errors.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
            setError("submit", {
                type: "manual",
                message: errorMessage,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const getInputClassName = (fieldName) => {
        const baseClass =
            "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200";
        return errors[fieldName]
            ? `${baseClass} border-red-500 focus:ring-red-500 bg-red-50`
            : `${baseClass} border-gray-300 focus:ring-blue-500`;
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {meetingId ? "Edit Meeting Details" : "Create New Meeting"}
                </h2>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200"
                noValidate
            >
                {/* Company ID Validation */}
                {errors.companyId && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-xs sm:text-sm text-red-600">
                            {errors.companyId.message}
                        </p>
                    </div>
                )}

                {/* Meeting Scheduling */}
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
                            onBlur={() => handleFieldBlur("meetingDate")}
                            className={getInputClassName("meetingDate")}
                        />
                        {errors.meetingDate && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.meetingDate.message}
                            </p>
                        )}
                    </div>

                    {/* Meeting Time */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meeting Time *
                        </label>
                        <input
                            type="time"
                            {...register("meetingTime", {
                                required: "Meeting time is required",
                            })}
                            onBlur={() => handleFieldBlur("meetingTime")}
                            className={getInputClassName("meetingTime")}
                        />
                        {errors.meetingTime && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.meetingTime.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Meeting Type & Conditional Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meeting Type *
                        </label>
                        <select
                            {...register("meetingType", {
                                required: "Meeting type is required",
                                onChange: (e) => {
                                    // Clear conditional field errors when type changes
                                    if (e.target.value === "phone") {
                                        clearErrors("meetingLocation");
                                    } else if (e.target.value === "in-person") {
                                        clearErrors("phoneDetails");
                                    }
                                },
                            })}
                            onBlur={() => handleFieldBlur("meetingType")}
                            className={getInputClassName("meetingType")}
                        >
                            <option value="in-person">In-Person</option>
                            <option value="phone">Phone Call</option>
                            <option value="on-office">On Office</option>
                        </select>
                        {errors.meetingType && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.meetingType.message}
                            </p>
                        )}
                    </div>

                    {/* Show location field for in-person meetings OR if there's existing location data */}
                    {(isInPerson ||
                        (existingData?.meeting_location &&
                            meetingType !== "phone")) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location *
                            </label>
                            <input
                                type="text"
                                {...register("meetingLocation", {
                                    required: isInPerson
                                        ? "Location is required for in-person meetings"
                                        : false,
                                })}
                                onBlur={() =>
                                    handleFieldBlur("meetingLocation")
                                }
                                placeholder="Meeting venue or address"
                                className={getInputClassName("meetingLocation")}
                            />
                            {errors.meetingLocation && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.meetingLocation.message}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Show phone details field for phone meetings OR if there's existing phone data */}
                    {(isPhone ||
                        (existingData?.phone_details &&
                            meetingType !== "in-person")) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Details *
                            </label>
                            <input
                                type="text"
                                {...register("phoneDetails", {
                                    required: isPhone
                                        ? "Phone details are required for phone meetings"
                                        : false,
                                })}
                                onBlur={() => handleFieldBlur("phoneDetails")}
                                placeholder="Enter phone number or call details"
                                className={getInputClassName("phoneDetails")}
                            />
                            {errors.phoneDetails && (
                                <p className="mt-1 text-xs text-red-600">
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
                            required: "Attendees are required",
                            validate: validateAttendees,
                        })}
                        onBlur={() => handleFieldBlur("attendees")}
                        placeholder="Enter attendee names separated by commas"
                        className={getInputClassName("attendees")}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Separate multiple attendees with commas
                    </p>
                    {errors.attendees && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.attendees.message}
                        </p>
                    )}
                </div>

                {/* Key Discussion Points & Agenda */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Key Discussion Points & Agenda *
                    </label>
                    <Controller
                        name="keyDiscussionPoints"
                        control={control}
                        rules={{
                            required: "Agenda is required",
                            validate: validateAgenda,
                        }}
                        render={({ field }) => (
                            <div
                                className={
                                    errors.keyDiscussionPoints
                                        ? "border border-red-300 rounded-md"
                                        : ""
                                }
                            >
                                <ReactQuill
                                    {...field}
                                    theme="snow"
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Enter key discussion points, important decisions, budget discussions, timeline discussions, etc."
                                    className="h-[200px] sm:h-[250px]"
                                    onChange={(content) => {
                                        field.onChange(content);
                                        // Mark as touched when user starts typing
                                        if (
                                            !touchedFields.keyDiscussionPoints
                                        ) {
                                            handleFieldBlur(
                                                "keyDiscussionPoints"
                                            );
                                        }
                                        // Clear error when user starts typing
                                        if (errors.keyDiscussionPoints) {
                                            const textContent = content
                                                .replace(/<[^>]*>/g, "")
                                                .trim();
                                            if (textContent.length > 0) {
                                                clearErrors(
                                                    "keyDiscussionPoints"
                                                );
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )}
                    />
                    {errors.keyDiscussionPoints && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.keyDiscussionPoints.message}
                        </p>
                    )}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">
                            {errors.submit.message}
                        </p>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-16 md:pt-8">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={submitting}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        {submitting
                            ? meetingId
                                ? "Updating..."
                                : "Saving..."
                            : meetingId
                            ? "Update Meeting"
                            : "Save Meeting"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditMeeting;
