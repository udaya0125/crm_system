import React from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const EditFollowUpResponse = ({
    data,
    updateData,
    nextStep,
    prevStep,
    companyId,
    company,
    existingData,
}) => {
    const [submitting, setSubmitting] = React.useState(false);

    // Check if we're updating existing data or creating new
    const followUpResponseId = existingData?.id || null;

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
            response:
                data?.follow_up_response ||
                existingData?.follow_up_response ||
                "",
            negativeReason:
                data?.follow_up_reason || existingData?.follow_up_reason || "",
            followUpDate:
                data?.follow_up_date || existingData?.follow_up_date || "",
            followUpTime:
                data?.follow_up_time || existingData?.follow_up_time || "",
            notes: data?.follow_up_notes || existingData?.follow_up_notes || "",
            meetingOutcome:
                data?.meeting_outcome || existingData?.meeting_outcome || "",
        },
    });

    // Watch response field to conditionally show sections
    const responseType = watch("response");
    const isPositive = responseType === "positive";
    const isNegative = responseType === "negative";

    // ReactQuill modules configuration
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link", "clean"],
            [{ color: [] }, { background: [] }],
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
        "color",
        "background",
    ];

    // Helper function to get CSRF token safely
    const getCsrfToken = () => {
        if (typeof document === "undefined") return "";

        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute("content") : "";
    };

    // Updated helper function with increased height
    const getQuillClassName = (fieldName) => {
        const baseClass = "custom-quill-editor rounded focus:outline-none";
        const isError = errors[fieldName];

        if (isPositive) {
            return isError
                ? `${baseClass} border-red-300 bg-red-50`
                : `${baseClass} border-green-300 bg-white`;
        } else if (isNegative) {
            return isError
                ? `${baseClass} border-red-300 bg-red-50`
                : `${baseClass} border-red-300 bg-white`;
        }

        return isError
            ? `${baseClass} border-red-300 bg-red-50`
            : `${baseClass} border-gray-300 bg-white`;
    };

    // Add custom CSS for Quill editor height
    const quillStyles = `
        .custom-quill-editor .ql-container {
            height: 200px !important; /* Increased from default ~150px */
            min-height: 200px !important;
            font-size: 14px;
        }
        .custom-quill-editor .ql-editor {
            min-height: 200px !important;
            max-height: 200px !important;
            overflow-y: auto;
        }
    `;

    const onSubmit = async (formData) => {
        try {
            setSubmitting(true);

            // Show loading toast
            const loadingToast = toast.loading(
                followUpResponseId 
                    ? "Updating follow-up response..." 
                    : "Creating follow-up response..."
            );

            // Map frontend field names to backend field names
            const backendData = {
                company_id: companyId,
                follow_up_response: formData.response,
                meeting_outcome: formData.meetingOutcome,
                follow_up_notes: formData.notes,
                follow_up_reason: formData.negativeReason,
                _method: followUpResponseId ? "PUT" : "POST", // Important for Laravel
            };

            let response;

            if (followUpResponseId) {
                // Update existing follow-up response
                console.log(
                    "Updating existing follow-up response with ID:",
                    followUpResponseId
                );

                response = await axios.put(
                    `/ourfollowupresponse/${followUpResponseId}`,
                    backendData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": getCsrfToken(),
                        },
                    }
                );

                console.log(
                    "Follow-up response updated successfully:",
                    response.data
                );
            } else {
                // Create new follow-up response
                console.log("Creating new follow-up response");
                response = await axios.post(
                    "/ourfollowupresponse",
                    backendData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": getCsrfToken(),
                        },
                    }
                );
                console.log(
                    "Follow-up response created successfully:",
                    response.data
                );
            }

            // Update parent component with the data
            const updatedData = {
                follow_up_response: formData.response,
                meeting_outcome: formData.meetingOutcome,
                follow_up_notes: formData.notes,
                follow_up_reason: formData.negativeReason,
                id: followUpResponseId || response.data.id, // Include the ID
            };

            updateData(updatedData);

            // Show success toast
            toast.success(
                `Follow-up response ${followUpResponseId ? "updated" : "created"} successfully!`,
                { id: loadingToast }
            );

            // Only proceed to next step for positive responses
            if (isPositive) {
                setTimeout(() => {
                    nextStep();
                }, 1000);
            } else {
                // For negative responses, reload the page after a short delay
                setTimeout(() => {
                    toast.success("Page will reload now...");
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }, 1000);
            }
        } catch (error) {
            console.error("Error saving follow-up response", error);

            // More detailed error logging
            if (error.response) {
                console.error("Server responded with:", error.response.status);
                console.error("Response data:", error.response.data);
                
                // Show specific error message from server if available
                const errorMessage = error.response.data?.message || 
                                   error.response.data?.error || 
                                   `Failed to ${followUpResponseId ? "update" : "save"} follow-up response`;
                
                toast.error(errorMessage);
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error("Network error: Please check your connection and try again.");
            } else {
                console.error("Error setting up request:", error.message);
                toast.error(`Error: ${error.message}`);
            }

            setError("submit", {
                type: "manual",
                message: `Failed to ${
                    followUpResponseId ? "update" : "save"
                } follow-up response. Please try again.`,
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Helper function to get input className with error state
    const getInputClassName = (fieldName) => {
        const baseClass =
            "w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none";
        const isError = errors[fieldName];

        if (isPositive) {
            return isError
                ? `${baseClass} border-red-300 bg-red-50`
                : `${baseClass} border-green-300 bg-white`;
        } else if (isNegative) {
            return isError
                ? `${baseClass} border-red-300 bg-red-50`
                : `${baseClass} border-red-300 bg-white`;
        }

        return isError
            ? `${baseClass} border-red-300 bg-red-50`
            : `${baseClass} border-gray-300 bg-white`;
    };

    const getSectionClassName = () => {
        if (isPositive) {
            return "space-y-4 p-4 bg-green-50 rounded-lg border border-green-200 mb-4";
        } else if (isNegative) {
            return "space-y-4 p-4 bg-red-50 rounded-lg border border-red-200 mb-4";
        }
        return "space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4";
    };

    // Get button text based on response type
    const getButtonText = () => {
        if (submitting) return "Saving...";
        if (isPositive) return "Next";
        return "Complete & Reload";
    };

    // Debug info (remove in production)
    const showDebugInfo = process.env.NODE_ENV === "development";

    return (
        <div className="max-w-7xl mx-auto p-4">
            {/* Add custom styles for Quill editor */}
            <style>{quillStyles}</style>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Response Dropdown */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Follow-up Response *
                        </label>

                        {errors.response && (
                            <p className="text-red-500 text-sm mb-2">
                                {errors.response.message}
                            </p>
                        )}

                        <select
                            {...register("response", {
                                required: "Response type is required",
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                        >
                            <option value="">-- Select Response Type --</option>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                        </select>
                    </div>

                    {/* Conditional Sections */}
                    {(isPositive || isNegative) && (
                        <div className={getSectionClassName()}>
                            <h3
                                className={`font-medium ${
                                    isPositive
                                        ? "text-green-800"
                                        : "text-red-800"
                                }`}
                            >
                                {isPositive
                                    ? "Positive Response Details"
                                    : "Response Details"}
                            </h3>

                            {/* Negative Reason - Only for negative responses */}
                            {isNegative && (
                                <div>
                                    <label
                                        className={`block text-sm mb-1 ${
                                            isNegative
                                                ? "text-red-700"
                                                : "text-green-700"
                                        }`}
                                    >
                                        Reason for Negative Response *
                                    </label>
                                    <Controller
                                        name="negativeReason"
                                        control={control}
                                        rules={{
                                            required: isNegative
                                                ? "Reason is required for negative responses"
                                                : false,
                                        }}
                                        render={({ field }) => (
                                            <ReactQuill
                                                {...field}
                                                theme="snow"
                                                modules={quillModules}
                                                formats={quillFormats}
                                                className={getQuillClassName(
                                                    "negativeReason"
                                                )}
                                                placeholder="Why did the client decline or provide negative feedback?"
                                            />
                                        )}
                                    />
                                    {errors.negativeReason && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.negativeReason.message}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Meeting Outcome */}
                            <div>
                                <label
                                    className={`block text-sm mb-1 ${
                                        isPositive
                                            ? "text-green-700"
                                            : "text-red-700"
                                    }`}
                                >
                                    {isPositive
                                        ? "Meeting Outcome *"
                                        : "Meeting Outcome"}
                                </label>
                                <Controller
                                    name="meetingOutcome"
                                    control={control}
                                    rules={{
                                        required: isPositive
                                            ? "Meeting outcome is required for positive responses"
                                            : false,
                                    }}
                                    render={({ field }) => (
                                        <ReactQuill
                                            {...field}
                                            theme="snow"
                                            modules={quillModules}
                                            formats={quillFormats}
                                            className={getQuillClassName(
                                                "meetingOutcome"
                                            )}
                                            placeholder={
                                                isPositive
                                                    ? "Describe the outcome of the meeting (e.g., Deal closed, next steps agreed, proposal accepted, demo scheduled, contract signed...)"
                                                    : "Describe the outcome of the meeting (e.g., Client not interested, budget constraints, timing issues, went with competitor, no decision made...)"
                                            }
                                        />
                                    )}
                                />
                                {errors.meetingOutcome && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.meetingOutcome.message}
                                    </p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label
                                    className={`block text-sm mb-1 ${
                                        isPositive
                                            ? "text-green-700"
                                            : "text-red-700"
                                    }`}
                                >
                                    Additional Notes
                                </label>
                                <Controller
                                    name="notes"
                                    control={control}
                                    render={({ field }) => (
                                        <ReactQuill
                                            {...field}
                                            theme="snow"
                                            modules={quillModules}
                                            formats={quillFormats}
                                            className={getQuillClassName(
                                                "notes"
                                            )}
                                            placeholder={
                                                isPositive
                                                    ? "Any additional notes about the positive response..."
                                                    : "Any additional notes about the negative response..."
                                            }
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    {/* Success/Error Messages */}
                    {errors.submit && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">
                                {errors.submit.message}
                            </p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-4 mt-6">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={submitting}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-6 py-2 text-white rounded transition-colors duration-200 ${
                                submitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : isPositive
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                            {getButtonText()}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFollowUpResponse;