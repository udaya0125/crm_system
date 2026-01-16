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
    const [fileError, setFileError] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors, isValid },
        watch,
        trigger,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            contractFile: null,
            fileName: data.fileName || "",
        },
    });

    const watchedFile = watch("contractFile");

    const storeContract = async (formData) => {
        try {
            console.log("Sending API request with data:", formData);
            const response = await axios.post(
                route("ourcontract.store"),
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            return response.data;
        } catch (error) {
            console.log("Error creating contract", error);
            throw error;
        }
    };

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
            // Clear previous errors
            setFileError("");
            clearErrors("contractFile");

            // Validate file size immediately - max 2MB
            if (file.size > 2 * 1024 * 1024) {
                const errorMsg = "File size too large. Maximum size is 2MB.";
                setFileError(errorMsg);
                setError("contractFile", {
                    type: "manual",
                    message: errorMsg,
                });
                toast.error(errorMsg);
                return;
            }

            // Validate file type - ONLY PDF and IMAGES allowed (JPG, PNG, GIF, SVG)
            const allowedTypes = [
                "application/pdf",
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif",
                "image/svg+xml",
            ];

            if (!allowedTypes.includes(file.type)) {
                const errorMsg =
                    "Only PDF and image files (JPG, PNG, GIF, SVG) are allowed.";
                setFileError(errorMsg);
                setError("contractFile", {
                    type: "manual",
                    message: errorMsg,
                });
                toast.error(errorMsg);
                return;
            }

            // If validations pass, proceed
            setContractFile(file);
            setValue("contractFile", file);
            setValue("fileName", file.name);

            if (file.type.startsWith("image/")) {
                const previewUrl = await generateImagePreview(file);
                setFilePreview(previewUrl);
            } else if (file.type === "application/pdf") {
                setFilePreview("pdf");
            } else {
                setFilePreview(null);
            }

            updateData({
                contractFile: file,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
            });

            await trigger("contractFile");
            toast.success(`File "${file.name}" selected successfully`);
        }
    };

    const handleRemoveFile = () => {
        const fileName = contractFile?.name || "File";
        setContractFile(null);
        setFilePreview(null);
        setFileError("");
        setValue("contractFile", null);
        setValue("fileName", "");

        updateData({
            contractFile: null,
            fileName: "",
            fileSize: "",
            fileType: "",
        });

        clearErrors("contractFile");
        toast.success(`${fileName} removed`);
    };

    const validateFile = (file) => {
        if (!file) return "Contract document is required";

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/svg+xml",
        ];

        if (!allowedTypes.includes(file.type)) {
            return "Only PDF and image files (JPG, PNG, GIF, SVG) are allowed.";
        }

        if (file.size > 2 * 1024 * 1024) {
            return "File size too large. Maximum size is 2MB.";
        }

        return true;
    };

    const onFormSubmit = async (formData) => {
        if (!companyId) {
            setError("companyId", {
                type: "manual",
                message:
                    "Company ID is required. Please go back and select a company.",
            });
            toast.error(
                "Company information missing. Please go back and select a company."
            );
            return;
        }

        try {
            setSubmitting(true);
            const loadingToast = toast.loading("Uploading contract...");

            const apiFormData = new FormData();
            apiFormData.append("company_id", companyId);
            apiFormData.append("image", formData.contractFile);

            console.log("Final API data being sent:", {
                company_id: companyId,
                file: formData.contractFile
                    ? formData.contractFile.name
                    : "No file",
            });

            const result = await storeContract(apiFormData);
            console.log("Contract created successfully:", result);

            updateData({
                contractFile: formData.contractFile,
                fileName: formData.fileName,
                fileSize: formData.contractFile.size,
                fileType: formData.contractFile.type,
                contractId: result.contract_id,
            });

            onSubmit();
            toast.dismiss(loadingToast);
            toast.success(
                "Contract uploaded successfully! CRM process completed."
            );

            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.log("Error creating contract", error);
            toast.dismiss();

            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                Object.keys(apiErrors).forEach((key) => {
                    switch (key) {
                        case "image":
                            setError("contractFile", {
                                type: "server",
                                message: apiErrors[key][0],
                            });
                            toast.error(`File error: ${apiErrors[key][0]}`);
                            break;
                        case "company_id":
                            setError("companyId", {
                                type: "server",
                                message: apiErrors[key][0],
                            });
                            toast.error(`Company error: ${apiErrors[key][0]}`);
                            break;
                        default:
                            setError(key, {
                                type: "server",
                                message: apiErrors[key][0],
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

    const canSubmit =
        !submitting && companyId && contractFile && isValid && !fileError;

    if (!companyId) {
        return (
            <div className="max-w-7xl mx-auto w-full p-4 sm:p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                    <h3 className="text-red-800 font-medium text-base sm:text-lg mb-2">
                        Error: Company Information Missing
                    </h3>
                    <p className="text-red-600 text-sm sm:text-base mb-4">
                        Unable to save contract details because company
                        information is missing. Please go back and ensure a
                        company is properly selected.
                    </p>
                    <button
                        type="button"
                        onClick={prevStep}
                        className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm font-medium"
                    >
                        Back to Previous Step
                    </button>
                </div>
            </div>
        );
    }

    const renderFilePreview = () => {
        if (!contractFile) return null;

        if (filePreview && filePreview !== "pdf") {
            return (
                <div className="mb-3 sm:mb-4">
                    <img
                        src={filePreview}
                        alt="File preview"
                        className="max-h-64 w-full max-w-full rounded-lg shadow-sm border border-gray-200 object-contain"
                    />
                </div>
            );
        } else if (contractFile.type === "application/pdf") {
            return (
                <div className="mb-3 sm:mb-4">
                    <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-100 border border-gray-300 rounded-lg">
                        <svg
                            className="w-16 h-16 sm:w-20 sm:h-20 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="mt-2 text-gray-700 font-medium">
                            PDF Document
                        </span>
                    </div>
                </div>
            );
        }

        return (
            <div className="mb-3 sm:mb-4">
                <svg
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20 text-gray-400"
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
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <form
                    onSubmit={handleSubmit(onFormSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                                Upload Contract Document *
                            </label>
                        </div>

                        {/* Display file error */}
                        {fileError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                                <p className="text-red-500 flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {fileError}
                                </p>
                            </div>
                        )}

                        {errors.contractFile && !fileError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                                <p className="text-red-500">
                                    {errors.contractFile.message}
                                </p>
                            </div>
                        )}

                        <div
                            className={`flex flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 border-2 border-dashed rounded-lg h-[400px]
                                ${
                                    errors.contractFile || fileError
                                        ? "border-red-300 bg-red-50"
                                        : contractFile
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-300 hover:border-gray-400 bg-gray-50"
                                }`}
                        >
                            <div className="text-center w-full h-full flex flex-col items-center justify-center">
                                {contractFile ? (
                                    <div className="flex flex-col items-center w-full">
                                        {renderFilePreview()}

                                        <p className="text-xs sm:text-sm text-gray-600 mt-2 px-2">
                                            {contractFile.name}
                                            <span className="ml-2 text-gray-500">
                                                (
                                                {(
                                                    contractFile.size /
                                                    (1024 * 1024)
                                                ).toFixed(2)}{" "}
                                                MB)
                                            </span>
                                        </p>

                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            disabled={submitting}
                                            className="mt-4 bg-red-100 text-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Remove File
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <svg
                                            className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-400"
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

                                        <div className="mt-6">
                                            <label
                                                htmlFor="contract-upload"
                                                className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <svg
                                                    className="w-5 h-5 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                                Upload a file
                                            </label>
                                            <input
                                                id="contract-upload"
                                                name="contract-upload"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png,.gif,.svg"
                                                disabled={submitting}
                                            />
                                        </div>

                                        <p className="mt-4 text-sm text-gray-500 px-1">
                                            Upload PDF or image files (JPG, PNG,
                                            GIF, SVG)
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Maximum file size: 2MB
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <input
                            type="file"
                            {...register("contractFile", {
                                validate: validateFile,
                            })}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.svg"
                        />
                    </div>

                    {/* Button Group */}

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 sm:pt-6 ">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={submitting}
                            className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium w-full sm:w-auto"
                        >
                            Previous
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={`px-6 py-2.5 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium w-full sm:w-auto ${
                                !canSubmit
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Uploading...
                                </span>
                            ) : (
                                "Complete CRM Process"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Contract;
