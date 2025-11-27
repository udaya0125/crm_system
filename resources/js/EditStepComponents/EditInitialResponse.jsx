import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditInitialResponse = ({ data, updateData, nextStep, prevStep, companyId, existingData }) => {
    const [submitting, setSubmitting] = React.useState(false);

    // React Hook Form initialization
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        trigger,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            response: data?.initial_response || "",
            negativeReason: data?.initial_reason || "",
            followUpDate: data?.followUpDate || "",
            followUpTime: data?.followUpTime || "",
            notes: data?.initial_notes || "",
            meetingOutcomes: data?.meeting_outcome || "",
        },
    });

    // Watch response field to conditionally show sections
    const responseType = watch("response");
    const isPositive = responseType === "positive";
    const isNegative = responseType === "negative";

    // React Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link'
    ];

    // Helper function to handle React Quill changes
    const handleQuillChange = (fieldName, value) => {
        setValue(fieldName, value, { shouldValidate: true });
        // Trigger validation for the field
        trigger(fieldName);
    };

    // Helper function to get CSRF token safely
    const getCsrfToken = () => {
        if (typeof document === 'undefined') return '';
        
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute('content') : '';
    };

    // Check if company already has an initial response
    const checkExistingInitialResponse = async () => {
        try {
            const response = await axios.get(
                route('companies.initial-responses', { company: companyId }),
                {
                    headers: {
                        'X-CSRF-TOKEN': getCsrfToken(),
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error checking existing initial response:", error);
            return { exists: false, id: null };
        }
    };

    console.log(existingData)

    const onSubmit = async (formData) => {
        try {
            setSubmitting(true);

            // Map frontend field names to backend field names
            const backendData = {
                company_id: companyId,
                initial_response: formData.response,
                meeting_outcome: formData.meetingOutcomes,
                initial_notes: formData.notes,
                initial_reason: formData.negativeReason,
            };

            let savedResponseId = existingData;

            console.log(existingData)

            // If we have an existingData, always update
            if (existingData) {
                await axios.put(
                    route('ourinitialresponse.update', { id: existingData }),
                    backendData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': getCsrfToken(),
                        },
                    }
                );
                console.log("Initial response updated successfully");
            } else {
                // Check if company already has an initial response
                const existingResponse = await checkExistingInitialResponse();
                console.log(existingResponse)
                if (existingResponse.exists && existingResponse.id) {
                    // Update existing response
                    await axios.put(
                        route('ourinitialresponse.update', { id: existingResponse.id }),
                        backendData,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': getCsrfToken(),
                            },
                        }
                    );
                    savedResponseId = existingResponse.id;
                    console.log("Existing initial response updated successfully");
                } else {
                    // Create new response
                    const response = await axios.post(
                        route('ourinitialresponse.store'),
                        backendData,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': getCsrfToken(),
                            },
                        }
                    );
                    savedResponseId = response.data.id;
                    console.log("Initial response created successfully:", response.data);
                }
            }

            // Update parent component with the data and the response ID
            updateData({
                initial_response: formData.response,
                meeting_outcome: formData.meetingOutcomes,
                initial_notes: formData.notes,
                initial_reason: formData.negativeReason,
                initial_response_id: savedResponseId,
            });

            nextStep();
            
        } catch (error) {
            console.log("Error saving initial response", error);
            setError("submit", {
                type: "manual",
                message: "Failed to save initial response. Please try again."
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Helper function to get React Quill className with error state
    const getQuillClassName = (fieldName, sectionType) => {
        const baseClass = "rounded focus:outline-none transition-colors duration-200 custom-quill-height";
        const isError = errors[fieldName];
        
        if (sectionType === "positive") {
            return isError 
                ? `${baseClass} border-red-300 bg-red-50` 
                : `${baseClass} border-green-300 bg-white`;
        } else if (sectionType === "negative") {
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

    return (
        <div className="max-w-7xl mx-auto p-4">
            <style jsx>{`
                .custom-quill-height .ql-container {
                    height: 200px !important;
                    min-height: 200px !important;
                }
                .custom-quill-height .ql-editor {
                    height: 150px !important;
                    min-height: 150px !important;
                }
            `}</style>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Response Dropdown */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Initial Response *
                        </label>

                        {errors.response && (
                            <p className="text-red-500 text-sm mb-2">{errors.response.message}</p>
                        )}

                        <select
                            {...register("response", {
                                required: "Response type is required",
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none transition-colors duration-200"
                        >
                            <option value="">-- Select Response Type --</option>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                        </select>
                    </div>

                    {/* Conditional Sections */}
                    {(isPositive || isNegative) && (
                        <div className={getSectionClassName()}>
                            <h3 className={`font-medium ${isPositive ? 'text-green-800' : 'text-red-800'}`}>
                                {isPositive ? 'Meeting Details' : 'Response Details'}
                            </h3>

                            {/* Negative Reason - Only for negative responses */}
                            {isNegative && (
                                <div>
                                    <label className={`block text-sm mb-1 ${isNegative ? 'text-red-700' : 'text-green-700'}`}>
                                        Reason *
                                    </label>
                                    <ReactQuill
                                        value={watch("negativeReason")}
                                        onChange={(value) => handleQuillChange("negativeReason", value)}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        className={getQuillClassName("negativeReason", "negative")}
                                        placeholder="Why did the client decline?"
                                    />
                                    <input
                                        type="hidden"
                                        {...register("negativeReason", {
                                            required: isNegative ? "Reason is required for negative responses" : false,
                                            validate: (value) => {
                                                if (isNegative && (!value || value === '<p><br></p>' || value.trim() === '')) {
                                                    return "Reason is required for negative responses";
                                                }
                                                return true;
                                            }
                                        })}
                                    />
                                    {errors.negativeReason && (
                                        <p className="text-red-500 text-xs mt-1">{errors.negativeReason.message}</p>
                                    )}
                                </div>
                            )}

                            {/* Meeting Outcomes */}
                            <div>
                                <label className={`block text-sm mb-1 ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                                    {isPositive ? "Meeting Outcomes *" : "Meeting Outcomes"}
                                </label>
                                <ReactQuill
                                    value={watch("meetingOutcomes")}
                                    onChange={(value) => handleQuillChange("meetingOutcomes", value)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    className={getQuillClassName("meetingOutcomes", isPositive ? "positive" : "negative")}
                                    placeholder={
                                        isPositive 
                                            ? "Key outcomes and decisions from the meeting..."
                                            : "Key outcomes and learnings from the discussion..."
                                    }
                                />
                                <input
                                    type="hidden"
                                    {...register("meetingOutcomes", {
                                        required: isPositive ? "Meeting outcomes are required for positive responses" : false,
                                        validate: (value) => {
                                            if (isPositive && (!value || value === '<p><br></p>' || value.trim() === '')) {
                                                return "Meeting outcomes are required for positive responses";
                                            }
                                            return true;
                                        }
                                    })}
                                />
                                {errors.meetingOutcomes && (
                                    <p className="text-red-500 text-xs mt-1">{errors.meetingOutcomes.message}</p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className={`block text-sm mb-1 ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                                    Notes
                                </label>
                                <ReactQuill
                                    value={watch("notes")}
                                    onChange={(value) => handleQuillChange("notes", value)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    className={getQuillClassName("notes", isPositive ? "positive" : "negative")}
                                    placeholder={
                                        isPositive
                                            ? "Meeting notes and discussion points..."
                                            : "Additional notes..."
                                    }
                                />
                                <input
                                    type="hidden"
                                    {...register("notes")}
                                />
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{errors.submit.message}</p>
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
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {submitting ? 'Saving...' : (isPositive ? "Next" : "Complete")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInitialResponse;