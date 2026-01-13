import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const InitialResponse = ({
    data,
    updateData,
    nextStep,
    prevStep,
    companyId,
}) => {
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        defaultValues: {
            response: data.response || "",
            negativeReason: data.negativeReason || "",
            followUpDate: data.followUpDate || "",
            followUpTime: data.followUpTime || "",
            notes: data.notes || "",
            meetingOutcomes: data.meetingOutcomes || "",
        }
    });

    useEffect(() => {
        console.log("Company ID in InitialResponse:", companyId);
        console.log("Data in InitialResponse:", data);
        setIsLoading(false);
    }, [companyId, data]);

    const responseValue = watch("response");
    const isPositive = responseValue === "positive";
    const isNegative = responseValue === "negative";

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
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

    const storeInitialResponse = async (responseData) => {
        try {
            console.log("Creating new initial response:", responseData);
            const response = await axios.post(
                route("ourinitialresponse.store"),
                responseData,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error) {
            console.error("Error creating initial response", error);
            throw error;
        }
    };

    const updateInitialResponse = async (responseData, id) => {
        try {
            console.log("Updating existing initial response:", id, responseData);
            const response = await axios.put(
                route("ourinitialresponse.update", { id }),
                responseData,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating initial response", error);
            throw error;
        }
    };

    const extractResponseId = (result) => {
        if (result.id) return result.id;
        if (result.data && result.data.id) return result.data.id;
        if (result.initialResponse && result.initialResponse.id) return result.initialResponse.id;
        if (result.response_id) return result.response_id;
        console.warn("Unexpected API response structure:", result);
        return null;
    };

    const onSubmit = async (formData) => {
        try {
            const apiData = {
                company_id: companyId,
                initial_response: formData.response,
                meeting_outcome: formData.meetingOutcomes,
                initial_notes: formData.notes,
                initial_reason: formData.negativeReason,
            };

            console.log("Final API data being sent:", apiData);

            let result;
            let responseId;

            if (data.initialResponseId) {
                result = await updateInitialResponse(apiData, data.initialResponseId);
                responseId = data.initialResponseId;
            } else {
                result = await storeInitialResponse(apiData);
                responseId = extractResponseId(result);
                if (!responseId) {
                    if (result.success || result.message) {
                        console.log("API indicates success but no ID returned.");
                        throw new Error("Initial Response ID not returned from API. Response structure: " + JSON.stringify(result));
                    } else {
                        throw new Error("Initial Response ID not returned from API and no success indicator found.");
                    }
                }
            }

            updateData({
                ...formData,
                initialResponseId: responseId
            });

            if (isPositive) {
                toast.success("Response saved successfully!");
                nextStep();
            } else {
                const successMessage = data.initialResponseId 
                    ? "Negative response updated successfully!" 
                    : "Negative response recorded successfully!";
                toast.success(successMessage);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }

        } catch (error) {
            console.error("Error processing initial response", error);
            if (error.response && error.response.data.errors) {
                const apiErrors = error.response.data.errors;
                Object.keys(apiErrors).forEach(key => {
                    switch(key) {
                        case 'initial_response':
                            setError('response', { type: 'server', message: apiErrors[key][0] });
                            break;
                        case 'initial_reason':
                            setError('negativeReason', { type: 'server', message: apiErrors[key][0] });
                            break;
                        case 'meeting_outcome':
                            setError('meetingOutcomes', { type: 'server', message: apiErrors[key][0] });
                            break;
                        case 'initial_notes':
                            setError('notes', { type: 'server', message: apiErrors[key][0] });
                            break;
                        case 'company_id':
                            setError('companyId', { type: 'server', message: apiErrors[key][0] });
                            break;
                        default:
                            setError(key, { type: 'server', message: apiErrors[key][0] });
                    }
                });
                toast.error("Please fix the validation errors above.");
            } else if (error.message.includes("Initial Response ID not returned")) {
                toast.error("Response was recorded but there was an issue with the confirmation. Please check the records manually.");
                console.error("ID Extraction Error:", error.message);
                if (isPositive) nextStep();
            } else {
                const errorMessage = data.initialResponseId 
                    ? "Error updating initial response. Please try again." 
                    : "Error creating initial response. Please try again.";
                toast.error(errorMessage);
            }
        }
    };

    const getInputClassName = (fieldName) => {
        const baseClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors duration-200";
        return errors[fieldName] 
            ? `${baseClass} border-red-500 focus:ring-red-500 focus:border-red-500` 
            : baseClass;
    };

    const canSubmit = () => {
        if (isSubmitting || !companyId || !responseValue) return false;
        if (isNegative) {
            const negativeReasonText = watch("negativeReason")?.replace(/<[^>]*>/g, '').trim();
            return !!negativeReasonText;
        }
        if (isPositive) {
            const meetingOutcomesText = watch("meetingOutcomes")?.replace(/<[^>]*>/g, '').trim();
            return !!meetingOutcomesText;
        }
        return false;
    };

    const getButtonText = () => {
        if (isSubmitting) return data.initialResponseId ? "Updating..." : "Saving...";
        if (isPositive) return data.initialResponseId ? "Update & Next" : "Save & Next";
        return data.initialResponseId ? "Update Response" : "Save Response";
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!companyId) {
        return (
            <div className="max-w-7xl mx-auto w-full p-4 sm:p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-red-800 font-medium text-lg mb-2">
                        Error: Company Information Missing
                    </h3>
                    <p className="text-red-600 mb-4">
                        Unable to save initial response because company
                        information is missing. Please go back and ensure a
                        company is properly selected.
                    </p>
                    <button
                        type="button"
                        onClick={prevStep}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 w-full sm:w-auto"
                    >
                        Back to Company Selection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto ">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit(onSubmit)}>
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
                            Initial Response *
                        </label>
                        {errors.response && (
                            <p className="text-red-500 text-sm mb-2">
                                {errors.response.message}
                            </p>
                        )}
                        <select
                            {...register("response", { required: "Response type is required" })}
                            className={getInputClassName('response')}
                        >
                            <option value="">-- Select Response Type --</option>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                        </select>
                    </div>

                    {/* Positive Section */}
                    {isPositive && (
                        <div className="space-y-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
                            <h3 className="font-medium text-green-800 text-base">
                                Meeting Details
                            </h3>

                            <div>
                                <label className="block text-sm text-green-700 mb-1">
                                    Meeting Outcomes *
                                </label>
                                <Controller
                                    name="meetingOutcomes"
                                    control={control}
                                    rules={{
                                        required: "Meeting outcomes are required for positive responses",
                                        validate: value => {
                                            const textContent = value?.replace(/<[^>]*>/g, '').trim();
                                            return textContent?.length > 0 || "Meeting outcomes are required for positive responses";
                                        }
                                    }}
                                    render={({ field }) => (
                                        <div className={`border rounded-md focus-within:ring-2 focus-within:ring-green-500 ${
                                            errors.meetingOutcomes ? 'border-red-300' : 'border-green-300'
                                        }`}>
                                            <ReactQuill
                                                {...field}
                                                theme="snow"
                                                modules={quillModules}
                                                formats={quillFormats}
                                                placeholder="Key outcomes and decisions from the meeting..."
                                                className="h-40 mb-12 text-sm"
                                            />
                                        </div>
                                    )}
                                />
                                {errors.meetingOutcomes && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.meetingOutcomes.message}
                                    </p>
                                )}
                            </div>

                            {/* Notes */}

                            <div>
                                <label className="block text-sm text-green-700 mb-1">
                                    Notes
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
                                                placeholder="Meeting notes and discussion points..."
                                                className="h-32 mb-10 text-sm"
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    {/* Negative Section */}
                    {isNegative && (
                        <div className="space-y-4 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200 mb-6">
                            <h3 className="font-medium text-red-800 text-base">
                                Response Details
                            </h3>

                            <div>
                                <label className="block text-sm text-red-700 mb-1">
                                    Reason *
                                </label>
                                <Controller
                                    name="negativeReason"
                                    control={control}
                                    rules={{
                                        required: "Reason is required for negative responses",
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
                                                placeholder="Why did the client decline?"
                                                className="h-40 mb-12 text-sm"
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

                            <div>
                                <label className="block text-sm text-red-700 mb-1">
                                    Meeting Outcomes
                                </label>
                                <Controller
                                    name="meetingOutcomes"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="border border-red-300 rounded-md focus-within:ring-2 focus-within:ring-red-500">
                                            <ReactQuill
                                                {...field}
                                                theme="snow"
                                                modules={quillModules}
                                                formats={quillFormats}
                                                placeholder="Key outcomes and learnings from the discussion..."
                                                className="h-32 mb-10 text-sm"
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-red-700 mb-1">
                                    Notes
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
                                                placeholder="Additional notes..."
                                                className="h-24 mb-8 text-sm"
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons  */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={!canSubmit() || isSubmitting}
                            className={`px-4 py-2 text-white rounded transition-colors w-full sm:w-auto ${
                                !canSubmit() || isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : data.initialResponseId
                                    ? "bg-blue-600 hover:bg-blue-700"
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

export default InitialResponse;