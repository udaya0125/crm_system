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
    const followUpResponseId = existingData?.id || null;

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

    const responseType = watch("response");
    const isPositive = responseType === "positive";
    const isNegative = responseType === "negative";

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

    const getCsrfToken = () => {
        if (typeof document === "undefined") return "";
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute("content") : "";
    };

    const getQuillClassName = (fieldName) => {
        const baseClass = "custom-quill-editor rounded focus:outline-none w-full";
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

    const quillStyles = `
        .custom-quill-editor .ql-container {
            min-height: 160px !important;
            height: auto !important;
            font-size: 14px;
        }
        .custom-quill-editor .ql-editor {
            min-height: 160px !important;
            font-size: 14px;
        }
        @media (min-width: 640px) {
            .custom-quill-editor .ql-container,
            .custom-quill-editor .ql-editor {
                min-height: 200px !important;
            }
        }
    `;

    const onSubmit = async (formData) => {
        try {
            setSubmitting(true);
            const loadingToast = toast.loading(
                followUpResponseId
                    ? "Updating follow-up response..."
                    : "Creating follow-up response..."
            );

            const backendData = {
                company_id: companyId,
                follow_up_response: formData.response,
                meeting_outcome: formData.meetingOutcome,
                follow_up_notes: formData.notes,
                follow_up_reason: formData.negativeReason,
                _method: followUpResponseId ? "PUT" : "POST",
            };

            let response;
            if (followUpResponseId) {
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
            } else {
                response = await axios.post("/ourfollowupresponse", backendData, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": getCsrfToken(),
                    },
                });
            }

            const updatedData = {
                follow_up_response: formData.response,
                meeting_outcome: formData.meetingOutcome,
                follow_up_notes: formData.notes,
                follow_up_reason: formData.negativeReason,
                id: followUpResponseId || response.data.id,
            };

            updateData(updatedData);

            toast.success(
                `Follow-up response ${followUpResponseId ? "updated" : "created"} successfully!`,
                { id: loadingToast }
            );

            if (isPositive) {
                setTimeout(() => nextStep(), 1000);
            } else {
                setTimeout(() => {
                    toast.success("Page will reload now...");
                    setTimeout(() => window.location.reload(), 500);
                }, 1000);
            }
        } catch (error) {
            console.error("Error saving follow-up response", error);
            let errorMessage = "An unknown error occurred.";
            if (error.response) {
                errorMessage =
                    error.response.data?.message ||
                    error.response.data?.error ||
                    `Failed to ${followUpResponseId ? "update" : "save"} follow-up response`;
            } else if (error.request) {
                errorMessage = "Network error: Please check your connection.";
            } else {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
            setError("submit", {
                type: "manual",
                message: `Failed to ${followUpResponseId ? "update" : "save"} follow-up response.`,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const getInputClassName = (fieldName) => {
        const baseClass =
            "w-full p-2.5 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none text-sm";
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
        if (isPositive)
            return "space-y-4 p-4 sm:p-5 bg-green-50 rounded-lg border border-green-200 mb-5";
        if (isNegative)
            return "space-y-4 p-4 sm:p-5 bg-red-50 rounded-lg border border-red-200 mb-5";
        return "space-y-4 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200 mb-5";
    };

    const getButtonText = () => {
        if (submitting) return "Saving...";
        return isPositive ? "Next" : "Complete & Reload";
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <style>{quillStyles}</style>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Response Dropdown */}
                    <div className="mb-5 sm:mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Follow-up Response *
                        </label>
                        {errors.response && (
                            <p className="text-red-500 text-xs mb-2">
                                {errors.response.message}
                            </p>
                        )}
                        <select
                            {...register("response", {
                                required: "Response type is required",
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none text-sm"
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
                                className={`text-sm font-medium ${
                                    isPositive ? "text-green-800" : "text-red-800"
                                }`}
                            >
                                {isPositive
                                    ? "Positive Response Details"
                                    : "Response Details"}
                            </h3>

                            {isNegative && (
                                <div className="mt-3">
                                    <label className="block text-xs font-medium text-red-700 mb-1">
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
                                                className={getQuillClassName("negativeReason")}
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

                            <div className="mt-3">
                                <label
                                    className={`block text-xs font-medium mb-1 ${
                                        isPositive ? "text-green-700" : "text-red-700"
                                    }`}
                                >
                                    {isPositive ? "Meeting Outcome *" : "Meeting Outcome"}
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
                                            className={getQuillClassName("meetingOutcome")}
                                            placeholder={
                                                isPositive
                                                    ? "Describe the outcome (e.g., Deal closed, next steps agreed...)"
                                                    : "Describe the outcome (e.g., Client not interested, budget constraints...)"
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

                            <div className="mt-3">
                                <label
                                    className={`block text-xs font-medium mb-1 ${
                                        isPositive ? "text-green-700" : "text-red-700"
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
                                            className={getQuillClassName("notes")}
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

                    {errors.submit && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">
                                {errors.submit.message}
                            </p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={submitting}
                            className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 w-full sm:w-auto"
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-5 py-2.5 text-white rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto ${
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