import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Contract = ({ data, updateData, prevStep, onSubmit, companyId }) => {
    useEffect(() => {
        console.log("Company ID in Contract:", companyId);
        console.log("Data in Contract:", data);
    }, [companyId, data]);

    const [contractFile, setContractFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // React Hook Form initialization
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors, isValid },
        watch,
        trigger
    } = useForm({
        mode: "onChange",
        defaultValues: {
            contractFile: null,
            fileName: data.fileName || ""
        }
    });

    // Watch for file changes
    const watchedFile = watch("contractFile");

    // Axios store function for contract
    const storeContract = async (formData) => {
        try {
            console.log("Sending API request with data:", formData);

            const response = await axios.post(
                route("ourcontract.store"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.log("Error creating contract", error);
            throw error;
        }
    };

    // Function to generate preview for images
    const generateImagePreview = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setContractFile(file);
            setValue("contractFile", file);
            setValue("fileName", file.name);

            // Generate preview for image files
            if (file.type.startsWith("image/")) {
                const previewUrl = await generateImagePreview(file);
                setFilePreview(previewUrl);
            } else {
                setFilePreview(null);
            }

            // Update form data with file information
            updateData({
                contractFile: file,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
            });

            // Validate the file
            await trigger("contractFile");
            
            toast.success(`File "${file.name}" selected successfully`);
        }
    };

    const handleRemoveFile = () => {
        const fileName = contractFile?.name || 'File';
        setContractFile(null);
        setFilePreview(null);
        setValue("contractFile", null);
        setValue("fileName", "");
        
        updateData({
            contractFile: null,
            fileName: "",
            fileSize: "",
            fileType: "",
        });

        clearErrors("contractFile");
        
        // Show info toast for file removal
        toast.success(`${fileName} removed`);
    };

    // Custom validation function for file
    const validateFile = (file) => {
        if (!file) {
            return "Contract document is required";
        }

        // Validate file type
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "text/plain",
        ];

        if (!allowedTypes.includes(file.type)) {
            return "File type not allowed. Please upload PDF, DOC, DOCX, JPG, PNG, or TXT files.";
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            return "File size too large. Maximum size is 2MB.";
        }

        return true;
    };

    const onFormSubmit = async (formData) => {
        if (!companyId) {
            setError("companyId", {
                type: "manual",
                message: "Company ID is required. Please go back and select a company."
            });
            toast.error("Company information missing. Please go back and select a company.");
            return;
        }

        try {
            setSubmitting(true);
            
            // Show loading toast
            const loadingToast = toast.loading('Uploading contract...');

            // Create FormData for file upload
            const apiFormData = new FormData();
            apiFormData.append("company_id", companyId);
            apiFormData.append("image", formData.contractFile);

            console.log("Final API data being sent:", {
                company_id: companyId,
                file: formData.contractFile ? formData.contractFile.name : "No file",
            });

            // Store contract via API
            const result = await storeContract(apiFormData);
            console.log("Contract created successfully:", result);

            // Update parent component data
            updateData({
                contractFile: formData.contractFile,
                fileName: formData.fileName,
                fileSize: formData.contractFile.size,
                fileType: formData.contractFile.type,
                contractId: result.contract_id,
            });

            // Call parent onSubmit
            onSubmit();

            // Dismiss loading toast and show success
            toast.dismiss(loadingToast);
            toast.success('Contract uploaded successfully! CRM process completed.');

            // Reload the page after a short delay to allow the user to see the success message
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.log("Error creating contract", error);
            
            // Dismiss any loading toasts
            toast.dismiss();
            
            // Handle API validation errors
            if (error.response && error.response.data.errors) {
                const apiErrors = error.response.data.errors;

                // Map Laravel field names back to React field names
                Object.keys(apiErrors).forEach((key) => {
                    switch (key) {
                        case "image":
                            setError("contractFile", {
                                type: "server",
                                message: apiErrors[key][0]
                            });
                            toast.error(`File error: ${apiErrors[key][0]}`);
                            break;
                        case "company_id":
                            setError("companyId", {
                                type: "server",
                                message: apiErrors[key][0]
                            });
                            toast.error(`Company error: ${apiErrors[key][0]}`);
                            break;
                        default:
                            setError(key, {
                                type: "server",
                                message: apiErrors[key][0]
                            });
                            toast.error(`${key}: ${apiErrors[key][0]}`);
                    }
                });
            } else {
                toast.error("Error uploading contract. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Determine if form can be submitted
    const canSubmit = !submitting && companyId && contractFile && isValid;

    // Show error if companyId is missing
    if (!companyId) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-red-800 font-medium text-lg mb-2">
                        Error: Company Information Missing
                    </h3>
                    <p className="text-red-600 mb-4">
                        Unable to save contract details because company
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

    // File type icon component
    const FileIcon = ({ fileType }) => {
        if (fileType?.startsWith("image/")) {
            return null; 
        }

        const getIcon = () => {
            if (fileType === "application/pdf") {
                return (
                    <svg
                        className="w-12 h-12 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            } else if (
                fileType?.includes("word") ||
                fileType?.includes("document")
            ) {
                return (
                    <svg
                        className="w-12 h-12 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            } else if (fileType === "text/plain") {
                return (
                    <svg
                        className="w-12 h-12 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            } else {
                return (
                    <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 48 48"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                );
            }
        };

        return getIcon();
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    {/* Contract File Upload */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Contract Document *
                        </label>

                        {/* File Error Display */}
                        {errors.contractFile && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded">
                                <p className="text-red-500 text-sm">
                                    {errors.contractFile.message}
                                </p>
                            </div>
                        )}

                        <div
                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                                errors.contractFile
                                    ? "border-red-300"
                                    : "border-gray-300"
                            }`}
                        >
                            <div className="space-y-1 text-center w-full">
                                {contractFile ? (
                                    <div className="flex flex-col items-center">
                                        {/* Image Preview */}
                                        {filePreview ? (
                                            <div className="mb-4">
                                                <img
                                                    src={filePreview}
                                                    alt="File preview"
                                                    className="max-h-48 max-w-full rounded-lg shadow-sm border border-gray-200"
                                                />
                                            </div>
                                        ) : (
                                            <FileIcon
                                                fileType={contractFile.type}
                                            />
                                        )}

                                        <p className="text-sm text-gray-600 mt-2">
                                            {contractFile.name}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            disabled={submitting}
                                            className="mt-2 bg-red-100 text-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Remove File
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label
                                                htmlFor="contract-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="contract-upload"
                                                    name="contract-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                                    disabled={submitting}
                                                />
                                            </label>
                                            <p className="pl-1">
                                                or drag and drop
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PDF, DOC, DOCX, JPG, PNG, TXT up to 2MB
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Hidden file input for React Hook Form validation */}
                        <input
                            type="file"
                            {...register("contractFile", {
                                validate: validateFile
                            })}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                        />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={submitting}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                !canSubmit
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                        >
                            {submitting
                                ? "Uploading..."
                                : "Complete CRM Process"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Contract;