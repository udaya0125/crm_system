import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const FollowUpResponse = ({
    data,
    updateData,
    nextStep,
    prevStep,
    companyId,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [existingResponseId, setExistingResponseId] = useState(null);
    const [isChecking, setIsChecking] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
        setValue,
        setError,
        clearErrors,
        reset,
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

    // React Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            ['link'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'link'
    ];

    useEffect(() => {
        console.log("Company ID in FollowUpResponse:", companyId);
        console.log("Data in FollowUpResponse:", data);
        
        // Check if we already have a follow-up response ID stored from previous steps
        if (data.followUpResponseId) {
            setExistingResponseId(data.followUpResponseId);
            console.log("Existing follow-up response ID from props:", data.followUpResponseId);
        } else {
            // Only check API if we don't have an ID from props
            checkExistingResponse();
        }
    }, [companyId, data]);

    // Function to check if we should update existing response
    const checkExistingResponse = async () => {
        if (!companyId) return;

        try {
            setIsChecking(true);
            console.log("Checking for existing follow-up response for company:", companyId);
            
            // Check if there's already a follow-up response for this company
            const response = await axios.get(
                route("ourfollowupresponse.check", { companyId })
            );
            
            if (response.data.exists && response.data.id) {
                setExistingResponseId(response.data.id);
                console.log("Found existing follow-up response via API:", response.data.id);
                
                // If we found existing data, you might want to pre-fill the form
                // You can add logic here to fetch and pre-fill the existing data
            }
        } catch (error) {
            console.log("Error checking existing response:", error);
            // Don't show error toast for this as it's just a check
        } finally {
            setIsChecking(false);
        }
    };

    // Axios store function for follow-up response
    const storeFollowUpResponse = async (followUpData) => {
        try {
            console.log("Creating new follow-up response with data:", followUpData);

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

    // Axios update function for follow-up response
    const updateFollowUpResponse = async (followUpData, id) => {
        try {
            console.log("Updating existing response with ID:", id, "Data:", followUpData);

            const response = await axios.put(
                route("ourfollowupresponse.update", { id }),
                followUpData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.log("Error updating follow-up response", error);
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
        if (data.response === "negative") {
            const negativeReasonText = data.negativeReason?.replace(/<[^>]*>/g, '').trim();
            if (!negativeReasonText) {
                newErrors.negativeReason = "Reason is required for negative responses";
            }
        }

        if (data.response === "positive") {
            const meetingOutcomeText = data.meetingOutcome?.replace(/<[^>]*>/g, '').trim();
            if (!meetingOutcomeText) {
                newErrors.meetingOutcome = "Meeting outcome is required for positive responses";
            }
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
            console.log("Existing response ID:", existingResponseId);

            let result;

            // Determine whether to update or create
            if (existingResponseId) {
                // Update existing record
                result = await updateFollowUpResponse(apiData, existingResponseId);
                console.log("Follow-up response updated successfully:", result);
                toast.success("Follow-up response updated successfully!");
            } else {
                // Create new record
                result = await storeFollowUpResponse(apiData);
                console.log("Follow-up response created successfully:", result);
                
                // Store the new ID for future updates
                if (result.id || result.follow_up_id) {
                    const newId = result.id || result.follow_up_id;
                    setExistingResponseId(newId);
                    // Update parent with the new ID
                    updateData({
                        ...formData,
                        followUpResponseId: newId
                    });
                }
                toast.success("Follow-up response recorded successfully!");
            }

            // Update parent component data
            updateData({
                ...formData,
                followUpResponseId: existingResponseId || result?.id || result?.follow_up_id
            });

            // Only go to next step for positive responses
            if (isPositive) {
                nextStep();
            } else {
                // For negative responses, reload the page after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.log("Error processing follow-up response", error);
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
                const action = existingResponseId ? "updating" : "creating";
                toast.error(`Error ${action} follow-up response. Please try again.`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Determine if form can be submitted
    const canSubmit =
        !submitting &&
        companyId &&
        response &&
        ((isNegative && watch("negativeReason")?.replace(/<[^>]*>/g, '').trim()) ||
            (isPositive && watch("meetingOutcome")?.replace(/<[^>]*>/g, '').trim()));

    // Get button text based on response type and whether we're updating
    const getButtonText = () => {
        if (submitting) return existingResponseId ? "Updating..." : "Saving...";
        if (isPositive) return existingResponseId ? "Update & Next" : "Save & Next";
        return existingResponseId ? "Update & Complete" : "Save & Complete";
    };

    // Show loading while checking for existing response
    if (isChecking) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                    <p>Checking for existing follow-up response...</p>
                </div>
            </div>
        );
    }

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
                {/* Status Indicator */}
                {existingResponseId && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-blue-600 text-sm">
                            <strong>Note:</strong> You are updating an existing follow-up response.
                        </p>
                    </div>
                )}

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

                            {/* Meeting Outcome with React Quill */}
                            <div>
                                <label className="block text-sm text-green-700 mb-1">
                                    Meeting Outcome *
                                </label>
                                <Controller
                                    name="meetingOutcome"
                                    control={control}
                                    rules={{
                                        validate: value => {
                                            const textContent = value?.replace(/<[^>]*>/g, '').trim();
                                            return textContent?.length > 0 || "Meeting outcome is required for positive responses";
                                        }
                                    }}
                                    render={({ field }) => (
                                        <div className={`border rounded-md focus-within:ring-2 focus-within:ring-green-500 ${
                                            errors.meetingOutcome ? 'border-red-300' : 'border-green-300'
                                        }`}>
                                            <ReactQuill
                                                {...field}
                                                theme="snow"
                                                modules={quillModules}
                                                formats={quillFormats}
                                                placeholder="Describe the outcome of the meeting (e.g., Deal closed, next steps agreed, proposal accepted, demo scheduled, contract signed...)"
                                                className="h-40 mb-12"
                                                onChange={(content) => {
                                                    field.onChange(content);
                                                    // Clear error when user starts typing
                                                    if (errors.meetingOutcome) {
                                                        clearErrors('meetingOutcome');
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                                {errors.meetingOutcome && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.meetingOutcome.message}
                                    </p>
                                )}
                            </div>

                            {/* Notes with React Quill */}
                            <div>
                                <label className="block text-sm text-green-700 mb-1">
                                    Additional Notes
                                </label>
                                <Controller
                                    name="notes"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="border border-green-300 rounded-md focus-within:ring-2 focus-within:ring-green-500">
                                            <ReactQuill
                                                {...field}
                                                theme="snow"
                                                modules={quillModules}
                                                formats={quillFormats}
                                                placeholder="Any additional notes about the positive response..."
                                                className="h-32 mb-10"
                                                onChange={(content) => {
                                                    field.onChange(content);
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    {/* Negative Section */}
                    {isNegative && (
                        <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                            <h3 className="font-medium text-red-800">
                                Response Details
                            </h3>

                            {/* Reason with React Quill */}
                            <div>
                                <label className="block text-sm text-red-700 mb-1">
                                    Reason for Negative Response *
                                </label>
                                <Controller
                                    name="negativeReason"
                                    control={control}
                                    rules={{
                                        validate: value => {
                                            const textContent = value?.replace(/<[^>]*>/g, '').trim();
                                            return textContent?.length > 0 || "Reason is required for negative responses";
                                        }
                                    }}
                                    render={({ field }) => (
                                        <div className={`border rounded-md focus-within:ring-2 focus-within:ring-red-500 ${
                                            errors.negativeReason ? 'border-red-300' : 'border-red-300'
                                        }`}>
                                            <ReactQuill
                                                {...field}
                                                theme="snow"
                                                modules={quillModules}
                                                formats={quillFormats}
                                                placeholder="Why did the client decline or provide negative feedback?"
                                                className="h-40 mb-12"
                                                onChange={(content) => {
                                                    field.onChange(content);
                                                    // Clear error when user starts typing
                                                    if (errors.negativeReason) {
                                                        clearErrors('negativeReason');
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                                {errors.negativeReason && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.negativeReason.message}
                                    </p>
                                )}
                            </div>

                            {/* Meeting Outcome with React Quill */}
                            <div>
                                <label className="block text-sm text-red-700 mb-1">
                                    Meeting Outcome
                                </label>
                                <Controller
                                    name="meetingOutcome"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="border border-red-300 rounded-md focus-within:ring-2 focus-within:ring-red-500">
                                            <ReactQuill
                                                {...field}
                                                theme="snow"
                                                modules={quillModules}
                                                formats={quillFormats}
                                                placeholder="Describe the outcome of the meeting (e.g., Client not interested, budget constraints, timing issues, went with competitor, no decision made...)"
                                                className="h-32 mb-10"
                                                onChange={(content) => {
                                                    field.onChange(content);
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Notes with React Quill */}
                            <div>
                                <label className="block text-sm text-red-700 mb-1">
                                    Additional Notes
                                </label>
                                <Controller
                                    name="notes"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="border border-red-300 rounded-md focus-within:ring-2 focus-within:ring-red-500">
                                            <ReactQuill
                                                {...field}
                                                theme="snow"
                                                modules={quillModules}
                                                formats={quillFormats}
                                                placeholder="Any additional notes about the negative response..."
                                                className="h-24 mb-8"
                                                onChange={(content) => {
                                                    field.onChange(content);
                                                }}
                                            />
                                        </div>
                                    )}
                                />
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
                                    : existingResponseId
                                    ? "bg-yellow-600 hover:bg-yellow-700"
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