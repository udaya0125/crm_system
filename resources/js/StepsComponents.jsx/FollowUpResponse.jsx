import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const FollowUpResponse = ({
    data,
    updateData,
    nextStep,
    prevStep,
    companyId,
}) => {
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
        setValue,
        setError,
        clearErrors,
    } = useForm({
        defaultValues: {
            response: data.response || "",
            negativeReason: data.negativeReason || "",
            followUpDate: data.followUpDate || "",
            followUpTime: data.followUpTime || "",
            notes: data.notes || "",
            meetingOutcome: data.meetingOutcome || "",
        },
    });

    // Watch the response value to conditionally show sections
    const response = watch("response");
    const isPositive = response === "positive";
    const isNegative = response === "negative";

    useEffect(() => {
        console.log("Company ID in FollowUpResponse:", companyId);
        console.log("Data in FollowUpResponse:", data);
    }, [companyId, data]);

    // Axios store function for follow-up response
    const storeFollowUpResponse = async (followUpData) => {
        try {
            console.log("Sending API request with data:", followUpData);

            const response = await axios.post(
                route("ourfollowupresponse.store"),
                followUpData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.log("Error creating follow-up response", error);
            throw error;
        }
    };

    // Custom validation function
    const validateForm = (data) => {
        const newErrors = {};

        // Check if companyId exists
        if (!companyId) {
            newErrors.companyId = "Company ID is required. Please go back and select a company.";
        }

        if (!data.response) {
            newErrors.response = "Response type is required";
        }

        // Conditional validation based on response type
        if (data.response === "negative" && !data.negativeReason) {
            newErrors.negativeReason = "Reason is required for negative responses";
        }

        if (data.response === "positive" && !data.meetingOutcome) {
            newErrors.meetingOutcome = "Meeting outcome is required for positive responses";
        }

        return newErrors;
    };

    const onSubmit = async (formData) => {
        // Manual validation
        const validationErrors = validateForm(formData);
        
        if (Object.keys(validationErrors).length > 0) {
            Object.keys(validationErrors).forEach((key) => {
                setError(key, { 
                    type: 'manual', 
                    message: validationErrors[key] 
                });
            });
            return;
        }

        try {
            setSubmitting(true);

            // Prepare data for API - map React field names to Laravel model field names
            const apiData = {
                company_id: companyId,
                follow_up_response: formData.response,
                meeting_outcome: formData.meetingOutcome,
                follow_up_notes: formData.notes,
                follow_up_reason: formData.negativeReason,
            };

            console.log("Final API data being sent:", apiData);

            // Store follow-up response via API
            const result = await storeFollowUpResponse(apiData);
            console.log("Follow-up response created successfully:", result);

            // Update parent component data
            updateData(formData);

            // Only go to next step for positive responses
            if (isPositive) {
                nextStep();
            } else {
                // For negative responses, show success message and then reload the page
                alert("Negative follow-up response recorded successfully!");
                
                // Reload the page after a short delay to allow the user to see the alert
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        } catch (error) {
            console.log("Error creating follow-up response", error);
            // Handle API validation errors
            if (error.response && error.response.data.errors) {
                const apiErrors = error.response.data.errors;
                const formattedErrors = {};

                // Map Laravel field names back to React field names
                Object.keys(apiErrors).forEach((key) => {
                    switch (key) {
                        case "follow_up_response":
                            formattedErrors.response = apiErrors[key][0];
                            break;
                        case "follow_up_reason":
                            formattedErrors.negativeReason = apiErrors[key][0];
                            break;
                        case "meeting_outcome":
                            formattedErrors.meetingOutcome = apiErrors[key][0];
                            break;
                        case "follow_up_notes":
                            formattedErrors.notes = apiErrors[key][0];
                            break;
                        case "company_id":
                            formattedErrors.companyId = apiErrors[key][0];
                            break;
                        default:
                            formattedErrors[key] = apiErrors[key][0];
                    }
                });

                // Set errors using react-hook-form
                Object.keys(formattedErrors).forEach((fieldName) => {
                    setError(fieldName, {
                        type: 'server',
                        message: formattedErrors[fieldName]
                    });
                });
            } else {
                alert("Error creating follow-up response. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Fixed: Determine if form can be submitted
    const canSubmit =
        !submitting &&
        companyId &&
        response &&
        ((isNegative && watch("negativeReason")) ||
            (isPositive && watch("meetingOutcome")));

    // Get button text based on response type
    const getButtonText = () => {
        if (submitting) return "Saving...";
        if (isPositive) return "Next";
        return "Complete";
    };

    // Show error if companyId is missing
    if (!companyId) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-red-800 font-medium text-lg mb-2">
                        Error: Company Information Missing
                    </h3>
                    <p className="text-red-600 mb-4">
                        Unable to save follow-up response because company
                        information is missing. Please go back and ensure a
                        company is properly selected.
                    </p>
                    <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Back to Previous Step
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Company ID Error Display */}
                    {errors.companyId && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-red-500 text-sm">
                                {errors.companyId.message}
                            </p>
                        </div>
                    )}

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

                        <Controller
                            name="response"
                            control={control}
                            rules={{ required: "Response type is required" }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 ${
                                        errors.response
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">-- Select Response Type --</option>
                                    <option value="positive">Positive</option>
                                    <option value="negative">Negative</option>
                                </select>
                            )}
                        />
                    </div>

                    {/* Positive Section */}
                    {isPositive && (
                        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
                            <h3 className="font-medium text-green-800">
                                Positive Response Details
                            </h3>

                            {/* Meeting Outcome */}
                            <div>
                                <label className="block text-sm text-green-700 mb-1">
                                    Meeting Outcome *
                                </label>
                                <textarea
                                    {...register("meetingOutcome")}
                                    rows="3"
                                    className={`w-full p-2 border rounded focus:ring focus:ring-green-200 focus:border-green-500 ${
                                        errors.meetingOutcome
                                            ? "border-red-300"
                                            : "border-green-300"
                                    }`}
                                    placeholder="Describe the outcome of the meeting (e.g., Deal closed, next steps agreed, proposal accepted, demo scheduled, contract signed...)"
                                />
                                {errors.meetingOutcome && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.meetingOutcome.message}
                                    </p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm text-green-700 mb-1">
                                    Additional Notes
                                </label>
                                <textarea
                                    {...register("notes")}
                                    rows="3"
                                    className="w-full p-2 border border-green-300 rounded focus:ring focus:ring-green-200 focus:border-green-500"
                                    placeholder="Any additional notes about the positive response..."
                                />
                                {errors.notes && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.notes.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Negative Section */}
                    {isNegative && (
                        <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                            <h3 className="font-medium text-red-800">
                                Response Details
                            </h3>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm text-red-700 mb-1">
                                    Reason for Negative Response *
                                </label>
                                <textarea
                                    {...register("negativeReason")}
                                    rows="3"
                                    className={`w-full p-2 border rounded focus:ring focus:ring-red-200 focus:border-red-500 ${
                                        errors.negativeReason
                                            ? "border-red-300"
                                            : "border-red-300"
                                    }`}
                                    placeholder="Why did the client decline or provide negative feedback?"
                                />
                                {errors.negativeReason && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.negativeReason.message}
                                    </p>
                                )}
                            </div>

                            {/* Meeting Outcome for Negative Response */}
                            <div>
                                <label className="block text-sm text-red-700 mb-1">
                                    Meeting Outcome
                                </label>
                                <textarea
                                    {...register("meetingOutcome")}
                                    rows="3"
                                    className="w-full p-2 border border-red-300 rounded focus:ring focus:ring-red-200 focus:border-red-500"
                                    placeholder="Describe the outcome of the meeting (e.g., Client not interested, budget constraints, timing issues, went with competitor, no decision made...)"
                                />
                                {errors.meetingOutcome && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.meetingOutcome.message}
                                    </p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm text-red-700 mb-1">
                                    Additional Notes
                                </label>
                                <textarea
                                    {...register("notes")}
                                    rows="2"
                                    className="w-full p-2 border border-red-300 rounded focus:ring focus:ring-red-200 focus:border-red-500"
                                    placeholder="Any additional notes about the negative response..."
                                />
                                {errors.notes && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.notes.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-4 mt-6">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={submitting}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={!canSubmit || submitting}
                            className={`px-6 py-2 text-white rounded transition-colors ${
                                !canSubmit || submitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : isPositive
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-blue-600 hover:bg-blue-700"
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

export default FollowUpResponse;