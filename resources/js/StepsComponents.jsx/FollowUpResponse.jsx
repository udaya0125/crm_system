// import React, { useState, useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import toast from "react-hot-toast";

// const FollowUpResponse = ({
//     data,
//     updateData,
//     nextStep,
//     prevStep,
//     companyId,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [existingResponseId, setExistingResponseId] = useState(null);
//     const [isChecking, setIsChecking] = useState(false);

//     const {
//         register,
//         handleSubmit,
//         control,
//         watch,
//         formState: { errors },
//         setValue,
//         setError,
//         clearErrors,
//         reset,
//     } = useForm({
//         defaultValues: {
//             response: data.response || "",
//             negativeReason: data.negativeReason || "",
//             followUpDate: data.followUpDate || "",
//             followUpTime: data.followUpTime || "",
//             notes: data.notes || "",
//             meetingOutcome: data.meetingOutcome || "",
//         },
//     });

//     // Watch the response value to conditionally show sections
//     const response = watch("response");
//     const isPositive = response === "positive";
//     const isNegative = response === "negative";

//     // React Quill modules configuration
//     const quillModules = {
//         toolbar: [
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ indent: "-1" }, { indent: "+1" }],
//             ["link"],
//             ["clean"],
//         ],
//     };

//     const quillFormats = [
//         "header",
//         "bold",
//         "italic",
//         "underline",
//         "strike",
//         "list",
//         "bullet",
//         "indent",
//         "link",
//     ];

//     useEffect(() => {
//         console.log("Company ID in FollowUpResponse:", companyId);
//         console.log("Data in FollowUpResponse:", data);

//         if (data.followUpResponseId) {
//             setExistingResponseId(data.followUpResponseId);
//         } else {
//             setExistingResponseId(null);
//         }
//     }, [companyId, data]);

//     // const checkExistingResponse = async () => {
//     //     if (!companyId) return;

//     //     try {
//     //         setIsChecking(true);
//     //         const response = await axios.get(
//     //             route("ourfollowupresponse.check", { companyId })
//     //         );

//     //         if (response.data.exists && response.data.id) {
//     //             setExistingResponseId(response.data.id);
//     //         }
//     //     } catch (error) {
//     //         console.log("Error checking existing response:", error);
//     //     } finally {
//     //         setIsChecking(false);
//     //     }
//     // };

//     const storeFollowUpResponse = async (followUpData) => {
//         try {
//             const response = await axios.post(
//                 route("ourfollowupresponse.store"),
//                 followUpData,
//                 { headers: { "Content-Type": "application/json" } }
//             );
//             return response.data;
//         } catch (error) {
//             console.log("Error creating follow-up response", error);
//             throw error;
//         }
//     };

//     const updateFollowUpResponse = async (followUpData, id) => {
//         try {
//             const response = await axios.put(
//                 route("ourfollowupresponse.update", { id }),
//                 followUpData,
//                 { headers: { "Content-Type": "application/json" } }
//             );
//             return response.data;
//         } catch (error) {
//             console.log("Error updating follow-up response", error);
//             throw error;
//         }
//     };

//     const validateForm = (data) => {
//         const newErrors = {};

//         if (!companyId) {
//             newErrors.companyId = "Company ID is required.";
//         }

//         if (!data.response) {
//             newErrors.response = "Response type is required";
//         }

//         if (data.response === "negative") {
//             const negativeReasonText = data.negativeReason
//                 ?.replace(/<[^>]*>/g, "")
//                 .trim();
//             if (!negativeReasonText) {
//                 newErrors.negativeReason =
//                     "Reason is required for negative responses";
//             }
//         }

//         if (data.response === "positive") {
//             const meetingOutcomeText = data.meetingOutcome
//                 ?.replace(/<[^>]*>/g, "")
//                 .trim();
//             if (!meetingOutcomeText) {
//                 newErrors.meetingOutcome =
//                     "Meeting outcome is required for positive responses";
//             }
//         }

//         return newErrors;
//     };

//     const onSubmit = async (formData) => {
//         const validationErrors = validateForm(formData);

//         if (Object.keys(validationErrors).length > 0) {
//             Object.keys(validationErrors).forEach((key) => {
//                 setError(key, {
//                     type: "manual",
//                     message: validationErrors[key],
//                 });
//             });
//             return;
//         }

//         try {
//             setSubmitting(true);

//             const apiData = {
//                 company_id: companyId,
//                 follow_up_response: formData.response,
//                 meeting_outcome: formData.meetingOutcome,
//                 follow_up_notes: formData.notes,
//                 follow_up_reason: formData.negativeReason,
//             };

//             let result;

//             if (existingResponseId) {
//                 result = await updateFollowUpResponse(
//                     apiData,
//                     existingResponseId
//                 );
//                 toast.success("Follow-up response updated successfully!");
//             } else {
//                 result = await storeFollowUpResponse(apiData);
//                 toast.success("Follow-up response recorded successfully!");

//                 if (result.id || result.follow_up_id) {
//                     const newId = result.id || result.follow_up_id;
//                     setExistingResponseId(newId);
//                     updateData({ ...formData, followUpResponseId: newId });
//                 }
//             }

//             updateData({
//                 ...formData,
//                 followUpResponseId:
//                     existingResponseId || result?.id || result?.follow_up_id,
//             });

//             if (isPositive) {
//                 nextStep();
//             } else {
//                 setTimeout(() => window.location.reload(), 1500);
//             }
//         } catch (error) {
//             console.log("Error processing follow-up response", error);
//             if (error.response?.data?.errors) {
//                 const apiErrors = error.response.data.errors;
//                 const formattedErrors = {};

//                 Object.keys(apiErrors).forEach((key) => {
//                     switch (key) {
//                         case "follow_up_response":
//                             formattedErrors.response = apiErrors[key][0];
//                             break;
//                         case "follow_up_reason":
//                             formattedErrors.negativeReason = apiErrors[key][0];
//                             break;
//                         case "meeting_outcome":
//                             formattedErrors.meetingOutcome = apiErrors[key][0];
//                             break;
//                         case "follow_up_notes":
//                             formattedErrors.notes = apiErrors[key][0];
//                             break;
//                         case "company_id":
//                             formattedErrors.companyId = apiErrors[key][0];
//                             break;
//                         default:
//                             formattedErrors[key] = apiErrors[key][0];
//                     }
//                 });

//                 Object.keys(formattedErrors).forEach((fieldName) => {
//                     setError(fieldName, {
//                         type: "server",
//                         message: formattedErrors[fieldName],
//                     });
//                 });
//             } else {
//                 const action = existingResponseId ? "updating" : "creating";
//                 toast.error(
//                     `Error ${action} follow-up response. Please try again.`
//                 );
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const canSubmit =
//         !submitting &&
//         companyId &&
//         response &&
//         ((isNegative &&
//             watch("negativeReason")
//                 ?.replace(/<[^>]*>/g, "")
//                 .trim()) ||
//             (isPositive &&
//                 watch("meetingOutcome")
//                     ?.replace(/<[^>]*>/g, "")
//                     .trim()));

//     const getButtonText = () => {
//         if (submitting) return existingResponseId ? "Updating..." : "Saving...";
//         if (isPositive)
//             return existingResponseId ? "Update & Next" : "Save & Next";
//         return existingResponseId ? "Update & Complete" : "Save & Complete";
//     };

//     if (isChecking) {
//         return (
//             <div className="max-w-4xl w-full mx-auto p-4 sm:p-6">
//                 <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 text-center">
//                     <p className="text-gray-600">
//                         Checking for existing follow-up response...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     if (!companyId) {
//         return (
//             <div className="max-w-4xl w-full mx-auto p-4 sm:p-6">
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
//                     <h3 className="text-red-800 font-medium text-base sm:text-lg mb-2">
//                         Error: Company Information Missing
//                     </h3>
//                     <p className="text-red-600 text-sm mb-4">
//                         Unable to save follow-up response because company
//                         information is missing.
//                     </p>
//                     <button
//                         type="button"
//                         onClick={prevStep}
//                         className="px-4 py-2 sm:px-6 sm:py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
//                     >
//                         Back to Previous Step
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-7xl w-full mx-auto ">
//             <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className="mb-6">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Follow-up Response *
//                         </label>
//                         {errors.response && (
//                             <p className="text-red-500 text-xs mb-2">
//                                 {errors.response.message}
//                             </p>
//                         )}
//                         <Controller
//                             name="response"
//                             control={control}
//                             rules={{ required: "Response type is required" }}
//                             render={({ field }) => (
//                                 <select
//                                     {...field}
//                                     className={`w-full p-2.5 sm:p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 ${
//                                         errors.response
//                                             ? "border-red-300"
//                                             : "border-gray-300"
//                                     }`}
//                                 >
//                                     <option value="">
//                                         -- Select Response Type --
//                                     </option>
//                                     <option value="positive">Positive</option>
//                                     <option value="negative">Negative</option>
//                                 </select>
//                             )}
//                         />
//                     </div>

//                     {isPositive && (
//                         <div className="space-y-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
//                             <h3 className="font-medium text-green-800 text-sm sm:text-base">
//                                 Positive Response Details
//                             </h3>

//                             <div>
//                                 <label className="block text-xs sm:text-sm text-green-700 mb-1">
//                                     Meeting Outcome *
//                                 </label>
//                                 <Controller
//                                     name="meetingOutcome"
//                                     control={control}
//                                     rules={{
//                                         validate: (value) => {
//                                             const textContent = value
//                                                 ?.replace(/<[^>]*>/g, "")
//                                                 .trim();
//                                             return (
//                                                 textContent?.length > 0 ||
//                                                 "Meeting outcome is required"
//                                             );
//                                         },
//                                     }}
//                                     render={({ field }) => (
//                                         <div
//                                             className={`border rounded-md focus-within:ring-2 focus-within:ring-green-500 ${
//                                                 errors.meetingOutcome
//                                                     ? "border-red-300"
//                                                     : "border-green-300"
//                                             }`}
//                                         >
//                                             <ReactQuill
//                                                 {...field}
//                                                 theme="snow"
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 placeholder="Describe the outcome of the meeting..."
//                                                 className="h-52 sm:h-48"
//                                                 onChange={(content) => {
//                                                     field.onChange(content);
//                                                     if (errors.meetingOutcome)
//                                                         clearErrors(
//                                                             "meetingOutcome"
//                                                         );
//                                                 }}
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                                 {errors.meetingOutcome && (
//                                     <p className="text-red-500 text-xs mt-1">
//                                         {errors.meetingOutcome.message}
//                                     </p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-xs sm:text-sm text-green-700 mb-1">
//                                     Additional Notes
//                                 </label>
//                                 <Controller
//                                     name="notes"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="border border-green-300 rounded-md focus-within:ring-2 focus-within:ring-green-500">
//                                             <ReactQuill
//                                                 {...field}
//                                                 theme="snow"
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 placeholder="Any additional notes..."
//                                                 className="h-52 sm:h-48"
//                                                 onChange={(content) =>
//                                                     field.onChange(content)
//                                                 }
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {isNegative && (
//                         <div className="space-y-4 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
//                             <h3 className="font-medium text-red-800 text-sm sm:text-base">
//                                 Response Details
//                             </h3>

//                             <div>
//                                 <label className="block text-xs sm:text-sm text-red-700 mb-1">
//                                     Reason for Negative Response *
//                                 </label>
//                                 <Controller
//                                     name="negativeReason"
//                                     control={control}
//                                     rules={{
//                                         validate: (value) => {
//                                             const textContent = value
//                                                 ?.replace(/<[^>]*>/g, "")
//                                                 .trim();
//                                             return (
//                                                 textContent?.length > 0 ||
//                                                 "Reason is required"
//                                             );
//                                         },
//                                     }}
//                                     render={({ field }) => (
//                                         <div
//                                             className={`border rounded-md focus-within:ring-2 focus-within:ring-red-500 ${
//                                                 errors.negativeReason
//                                                     ? "border-red-300"
//                                                     : "border-red-300"
//                                             }`}
//                                         >
//                                             <ReactQuill
//                                                 {...field}
//                                                 theme="snow"
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 placeholder="Why did the client decline?"
//                                                 className="h-52 sm:h-48"
//                                                 onChange={(content) => {
//                                                     field.onChange(content);
//                                                     if (errors.negativeReason)
//                                                         clearErrors(
//                                                             "negativeReason"
//                                                         );
//                                                 }}
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                                 {errors.negativeReason && (
//                                     <p className="text-red-500 text-xs mt-1">
//                                         {errors.negativeReason.message}
//                                     </p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-xs sm:text-sm text-red-700 mb-1">
//                                     Meeting Outcome
//                                 </label>
//                                 <Controller
//                                     name="meetingOutcome"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="border border-red-300 rounded-md focus-within:ring-2 focus-within:ring-red-500">
//                                             <ReactQuill
//                                                 {...field}
//                                                 theme="snow"
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 placeholder="Describe the outcome..."
//                                                 className="h-52 sm:h-48"
//                                                 onChange={(content) =>
//                                                     field.onChange(content)
//                                                 }
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-xs sm:text-sm text-red-700 mb-1">
//                                     Additional Notes
//                                 </label>
//                                 <Controller
//                                     name="notes"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="border border-red-300 rounded-md focus-within:ring-2 focus-within:ring-red-500">
//                                             <ReactQuill
//                                                 {...field}
//                                                 theme="snow"
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 placeholder="Any additional notes..."
//                                                 className="h-52 sm:h-48"
//                                                 onChange={(content) =>
//                                                     field.onChange(content)
//                                                 }
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6">
//                         <button
//                             type="button"
//                             onClick={prevStep}
//                             disabled={submitting}
//                             className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
//                         >
//                             Back
//                         </button>

//                         <button
//                             type="submit"
//                             disabled={!canSubmit || submitting}
//                             className={`px-4 py-2 text-white rounded text-sm transition-colors ${
//                                 !canSubmit || submitting
//                                     ? "bg-gray-400 cursor-not-allowed"
//                                     : existingResponseId
//                                     ? "bg-blue-600 hover:bg-yellow-700"
//                                     : isPositive
//                                     ? "bg-green-600 hover:bg-green-700"
//                                     : "bg-blue-600 hover:bg-blue-700"
//                             }`}
//                         >
//                             {getButtonText()}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default FollowUpResponse;



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

    // Custom styles for ReactQuill editor
    const quillStyles = `
        .custom-quill-editor .ql-container {
            min-height: 160px !important;
            height: auto !important;
            font-size: 14px;
            border-radius: 0 0 0.375rem 0.375rem;
        }
        .custom-quill-editor .ql-toolbar {
            border-radius: 0.375rem 0.375rem 0 0;
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

    // Get CSS class for ReactQuill based on field and validation state
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

    // Get input CSS class
    const getInputClassName = (fieldName) => {
        const baseClass = "w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none text-sm";
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

    // Get section CSS class based on response type
    const getSectionClassName = () => {
        if (isPositive)
            return "space-y-4 p-4 sm:p-5 bg-green-50 rounded-lg border border-green-200 mb-5";
        if (isNegative)
            return "space-y-4 p-4 sm:p-5 bg-red-50 rounded-lg border border-red-200 mb-5";
        return "space-y-4 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200 mb-5";
    };

    useEffect(() => {
        console.log("Company ID in FollowUpResponse:", companyId);
        console.log("Data in FollowUpResponse:", data);

        if (data.followUpResponseId) {
            setExistingResponseId(data.followUpResponseId);
        } else {
            setExistingResponseId(null);
        }
    }, [companyId, data]);

    const storeFollowUpResponse = async (followUpData) => {
        try {
            const response = await axios.post(
                route("ourfollowupresponse.store"),
                followUpData,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error) {
            console.log("Error creating follow-up response", error);
            throw error;
        }
    };

    const updateFollowUpResponse = async (followUpData, id) => {
        try {
            const response = await axios.put(
                route("ourfollowupresponse.update", { id }),
                followUpData,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error) {
            console.log("Error updating follow-up response", error);
            throw error;
        }
    };

    const validateForm = (data) => {
        const newErrors = {};

        if (!companyId) {
            newErrors.companyId = "Company ID is required.";
        }

        if (!data.response) {
            newErrors.response = "Response type is required";
        }

        if (data.response === "negative") {
            const negativeReasonText = data.negativeReason
                ?.replace(/<[^>]*>/g, "")
                .trim();
            if (!negativeReasonText) {
                newErrors.negativeReason =
                    "Reason is required for negative responses";
            }
        }

        if (data.response === "positive") {
            const meetingOutcomeText = data.meetingOutcome
                ?.replace(/<[^>]*>/g, "")
                .trim();
            if (!meetingOutcomeText) {
                newErrors.meetingOutcome =
                    "Meeting outcome is required for positive responses";
            }
        }

        return newErrors;
    };

    const onSubmit = async (formData) => {
        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            Object.keys(validationErrors).forEach((key) => {
                setError(key, {
                    type: "manual",
                    message: validationErrors[key],
                });
            });
            return;
        }

        try {
            setSubmitting(true);

            const apiData = {
                company_id: companyId,
                follow_up_response: formData.response,
                meeting_outcome: formData.meetingOutcome,
                follow_up_notes: formData.notes,
                follow_up_reason: formData.negativeReason,
            };

            let result;

            if (existingResponseId) {
                result = await updateFollowUpResponse(
                    apiData,
                    existingResponseId
                );
                toast.success("Follow-up response updated successfully!");
            } else {
                result = await storeFollowUpResponse(apiData);
                toast.success("Follow-up response recorded successfully!");

                if (result.id || result.follow_up_id) {
                    const newId = result.id || result.follow_up_id;
                    setExistingResponseId(newId);
                    updateData({ ...formData, followUpResponseId: newId });
                }
            }

            updateData({
                ...formData,
                followUpResponseId:
                    existingResponseId || result?.id || result?.follow_up_id,
            });

            if (isPositive) {
                nextStep();
            } else {
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (error) {
            console.log("Error processing follow-up response", error);
            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                const formattedErrors = {};

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

                Object.keys(formattedErrors).forEach((fieldName) => {
                    setError(fieldName, {
                        type: "server",
                        message: formattedErrors[fieldName],
                    });
                });
            } else {
                const action = existingResponseId ? "updating" : "creating";
                toast.error(
                    `Error ${action} follow-up response. Please try again.`
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const canSubmit =
        !submitting &&
        companyId &&
        response &&
        ((isNegative &&
            watch("negativeReason")
                ?.replace(/<[^>]*>/g, "")
                .trim()) ||
            (isPositive &&
                watch("meetingOutcome")
                    ?.replace(/<[^>]*>/g, "")
                    .trim()));

    const getButtonText = () => {
        if (submitting) return existingResponseId ? "Updating..." : "Saving...";
        if (isPositive)
            return existingResponseId ? "Update & Next" : "Save & Next";
        return existingResponseId ? "Update & Complete" : "Save & Complete";
    };

    if (isChecking) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-600">
                        Checking for existing follow-up response...
                    </p>
                </div>
            </div>
        );
    }

    if (!companyId) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h3 className="text-red-800 font-medium text-base sm:text-lg mb-2">
                        Error: Company Information Missing
                    </h3>
                    <p className="text-red-600 text-sm mb-4">
                        Unable to save follow-up response because company
                        information is missing.
                    </p>
                    <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium transition-colors"
                    >
                        Back to Previous Step
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <style>{quillStyles}</style>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-5 sm:mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Follow-up Response *
                        </label>
                        {errors.response && (
                            <p className="text-red-500 text-xs mb-2">
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
                                    className={getInputClassName("response")}
                                >
                                    <option value="">
                                        -- Select Response Type --
                                    </option>
                                    <option value="positive">Positive</option>
                                    <option value="negative">Negative</option>
                                </select>
                            )}
                        />
                    </div>

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
                                                onChange={(content) => {
                                                    field.onChange(content);
                                                    if (errors.negativeReason)
                                                        clearErrors(
                                                            "negativeReason"
                                                        );
                                                }}
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
                                            onChange={(content) => {
                                                field.onChange(content);
                                                if (errors.meetingOutcome)
                                                    clearErrors(
                                                        "meetingOutcome"
                                                    );
                                            }}
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
                            disabled={!canSubmit || submitting}
                            className={`px-5 py-2.5 text-white rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto ${
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