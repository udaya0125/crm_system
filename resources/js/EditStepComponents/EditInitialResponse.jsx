import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const EditInitialResponse = ({ data, updateData, nextStep, prevStep, companyId, existingData }) => {
    const [submitting, setSubmitting] = React.useState(false);

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

    const responseType = watch("response");
    const isPositive = responseType === "positive";
    const isNegative = responseType === "negative";

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean'],
        ],
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link',
    ];

    const handleQuillChange = (fieldName, value) => {
        setValue(fieldName, value, { shouldValidate: true });
        trigger(fieldName);
    };

    const getCsrfToken = () => {
        if (typeof document === 'undefined') return '';
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute('content') : '';
    };

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
            toast.error("Failed to check existing responses");
            return { exists: false, id: null };
        }
    };

    const onSubmit = async (formData) => {
        try {
            setSubmitting(true);
            const loadingToast = toast.loading('Saving initial response...');

            const backendData = {
                company_id: companyId,
                initial_response: formData.response,
                meeting_outcome: formData.meetingOutcomes,
                initial_notes: formData.notes,
                initial_reason: formData.negativeReason,
            };

            let savedResponseId = existingData;

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
                toast.dismiss(loadingToast);
                toast.success("Initial response updated successfully!");
            } else {
                const existingResponse = await checkExistingInitialResponse();
                if (existingResponse.exists && existingResponse.id) {
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
                    toast.dismiss(loadingToast);
                    toast.success("Existing response updated successfully!");
                } else {
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
                    toast.dismiss(loadingToast);
                    toast.success("Initial response created successfully!");
                }
            }

            updateData({
                initial_response: formData.response,
                meeting_outcome: formData.meetingOutcomes,
                initial_notes: formData.notes,
                initial_reason: formData.negativeReason,
                initial_response_id: savedResponseId,
            });

            if (formData.response === "negative") {
                toast.success("Negative response recorded successfully! Page will reload in a moment...", {
                    duration: 4000,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                nextStep();
            }
        } catch (error) {
            console.log("Error saving initial response", error);
            toast.dismiss();
            setError("submit", {
                type: "manual",
                message: "Failed to save initial response. Please try again."
            });

            if (error.response) {
                toast.error(`Server error: ${error.response.status} - ${error.response.data.message || 'Please try again.'}`);
            } else if (error.request) {
                toast.error("Network error: Please check your connection and try again.");
            } else {
                toast.error("Failed to save initial response. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

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
            return "space-y-4 p-4 sm:p-5 bg-green-50 rounded-lg border border-green-200 mb-5";
        } else if (isNegative) {
            return "space-y-4 p-4 sm:p-5 bg-red-50 rounded-lg border border-red-200 mb-5";
        }
        return "space-y-4 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200 mb-5";
    };

    const handleBackClick = () => {
        toast.success("Returning to previous step...");
        prevStep();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <style jsx>{`
                .custom-quill-height .ql-container {
                    min-height: 150px !important;
                }
                .custom-quill-height .ql-editor {
                    min-height: 130px !important;
                }
                @media (min-width: 640px) {
                    .custom-quill-height .ql-container {
                        min-height: 200px !important;
                    }
                    .custom-quill-height .ql-editor {
                        min-height: 180px !important;
                    }
                }
            `}</style>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
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
                            onChange={(e) => {
                                register("response").onChange(e);
                                if (e.target.value === "positive") {
                                    toast.success("Positive response selected!");
                                } else if (e.target.value === "negative") {
                                    toast.error("Negative response selected.");
                                }
                            }}
                        >
                            <option value="">-- Select Response Type --</option>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                        </select>
                    </div>

                    {/* Conditional Sections */}
                    {(isPositive || isNegative) && (
                        <div className={getSectionClassName()}>
                            <h3 className={`text-sm font-semibold mb-3 ${isPositive ? 'text-green-800' : 'text-red-800'}`}>
                                {isPositive ? 'Meeting Details' : 'Response Details'}
                            </h3>

                            {/* Negative Reason */}
                            {isNegative && (
                                <div className="mb-4">
                                    <label className="block text-sm mb-1 text-red-700">
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
                            <div className="mb-4">
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

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{errors.submit.message}</p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleBackClick}
                            disabled={submitting}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 w-full sm:w-auto"
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-4 py-2 text-white rounded transition-colors duration-200 w-full sm:w-auto ${
                                submitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : isPositive
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700"
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