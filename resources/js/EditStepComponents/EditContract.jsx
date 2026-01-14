import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

const EditContract = ({
    data,
    updateData,
    prevStep,
    onSubmit,
    companyId,
    company,
    existingData,
}) => {
    const [contractFile, setContractFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [existingContract, setExistingContract] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [fileError, setFileError] = useState("");
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const contractId = existingData?.id || null;

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            contractFile: null,
        },
    });

    const getCsrfToken = () => {
        if (typeof document === "undefined") return "";
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute("content") : "";
    };

    useEffect(() => {
        if (!initialized && existingData && existingData.id) {
            setExistingContract(existingData);
            const name = existingData.image
                ? getFileNameFromPath(existingData.image)
                : "";
            setFileName(name);

            updateData({
                contractFile: null,
                fileName: name,
                filePath: existingData.image,
                image_url: existingData.image_url,
            });

            setInitialized(true);
        }
    }, [existingData, initialized, updateData]);

    const getFileNameFromPath = (path) => {
        if (!path) return "";
        return path.split("/").pop() || path;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileError("");
        clearErrors("contractFile");

        // Only allow PDF and images
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/gif",
            "image/svg+xml",
            "application/pdf",
        ];

        if (!allowed.includes(file.type)) {
            const errorMsg =
                "Only PDF and image files (JPG, PNG, GIF, SVG) are allowed.";
            setFileError(errorMsg);
            setError("contractFile", { type: "manual", message: errorMsg });
            toast.error(errorMsg);
            return;
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            const errorMsg = `File size too large (${fileSizeMB} MB). Maximum size is 2MB.`;
            setFileError(errorMsg);
            setError("contractFile", { type: "manual", message: errorMsg });
            toast.error(errorMsg);
            return;
        }

        setContractFile(file);
        setFileName(file.name);
        setValue("contractFile", file);
        setExistingContract(null);

        updateData({
            contractFile: file,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
        });

        toast.success("File selected successfully!");
    };

    const handleRemoveFile = () => {
        const removedFileName = fileName || "File";
        setContractFile(null);
        setFileName("");
        setFileError("");
        setExistingContract(null);
        setValue("contractFile", null);
        clearErrors("contractFile");

        updateData({
            contractFile: null,
            fileName: "",
            fileSize: "",
            fileType: "",
        });

        toast.success(`${removedFileName} removed successfully!`);
    };

    const onFormSubmit = async (formData) => {
        if (!existingContract && !contractFile) {
            setError("contractFile", {
                type: "manual",
                message: "Contract file is required",
            });
            toast.error("Please select a contract file to upload.");
            return;
        }

        if (contractFile && contractFile.size > 2 * 1024 * 1024) {
            const errorMsg =
                "File size exceeds 2MB limit. Please select a smaller file.";
            setFileError(errorMsg);
            setError("contractFile", { type: "manual", message: errorMsg });
            toast.error(errorMsg);
            return;
        }

        const submitToast = toast.loading("Uploading contract...");

        try {
            setSubmitting(true);

            if (contractFile) {
                const fd = new FormData();
                fd.append("company_id", companyId);
                fd.append("image", contractFile);
                fd.append("_method", contractId ? "PUT" : "POST");

                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": getCsrfToken(),
                    },
                };

                if (contractId) {
                    await axios.post(
                        route("ourcontract.update", { id: contractId }),
                        fd,
                        config
                    );
                    toast.success("Contract updated successfully!", {
                        id: submitToast,
                    });
                } else {
                    await axios.post(route("ourcontract.store"), fd, config);
                    toast.success("Contract uploaded successfully!", {
                        id: submitToast,
                    });
                }
            } else if (existingContract) {
                toast.success("Contract information saved!", {
                    id: submitToast,
                });
            }

            updateData({
                contractFile,
                fileName,
                fileSize: contractFile?.size,
                fileType: contractFile?.type,
                existingContract,
            });

            onSubmit();
            toast.success("CRM process completed successfully!");

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.log("Error saving contract", error);
            console.log("Error response:", error.response?.data);

            let msg = "Failed to save contract. Please try again.";
            if (error.response?.data?.errors?.image) {
                msg = error.response.data.errors.image[0];
            } else if (error.response?.data?.message) {
                msg = error.response.data.message;
            } else if (error.response?.data?.error) {
                msg = error.response.data.error;
            }

            setError("submit", { type: "manual", message: msg });
            toast.error(msg, { id: submitToast, duration: 5000 });
        } finally {
            setSubmitting(false);
        }
    };

    const getDisplayUrl = () => {
        if (existingContract?.image_url) return existingContract.image_url;
        if (existingContract?.image) {
            if (existingContract.image.startsWith("http"))
                return existingContract.image;
            return `${imgurl}/${existingContract.image}`;
        }
        return null;
    };

    const displayUrl = getDisplayUrl();

    const renderFilePreview = () => {
        if (!contractFile) return null;

        const fileSizeMB = (contractFile.size / (1024 * 1024)).toFixed(2);
        const isPdf = contractFile.type === "application/pdf";

        return (
            <div className="flex flex-col items-center w-full h-full justify-center">
                <div className="w-full max-w-md h-64 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg mb-4">
                    {isPdf ? (
                        <div className="flex flex-col items-center">
                            <svg
                                className="w-20 h-20 text-red-500"
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
                    ) : (
                        <img
                            src={URL.createObjectURL(contractFile)}
                            alt="Contract preview"
                            className="max-w-full max-h-56 object-contain rounded"
                        />
                    )}
                </div>

                <div className="text-center">
                    <span className="text-sm font-medium text-gray-900 truncate max-w-xs block mx-auto">
                        {fileName}
                    </span>
                    <span className="ml-1 text-gray-500 text-sm">
                        ({fileSizeMB} MB)
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="mt-4 bg-red-100 text-red-600 px-4 py-2 rounded text-sm hover:bg-red-200 whitespace-nowrap transition-colors"
                >
                    Remove File
                </button>
            </div>
        );
    };

    const renderExistingContract = () => {
        const isPdf = existingContract?.image?.endsWith(".pdf");

        return (
            <div className="flex flex-col justify-center items-center w-full h-full">
                <div className="w-full max-w-md h-64 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg mb-4">
                    {isPdf ? (
                        <div className="flex flex-col items-center">
                            <svg
                                className="w-20 h-20 text-red-500"
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
                    ) : (
                        <img
                            src={displayUrl}
                            alt="Current contract"
                            className="max-w-full max-h-56 object-contain rounded"
                            onError={(e) => {
                                e.target.style.display = "none";
                                if (e.target.nextSibling)
                                    e.target.nextSibling.style.display =
                                        "block";
                            }}
                        />
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-2 items-center justify-center flex-wrap">
                    {displayUrl && (
                        <a
                            href={displayUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm whitespace-nowrap px-4 py-2 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                        >
                            View Current Contract
                        </a>
                    )}
                    <label
                        htmlFor="contract-upload"
                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 whitespace-nowrap transition-colors"
                    >
                        Replace File
                    </label>
                    <input
                        {...register("contractFile")}
                        id="contract-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.svg"
                        disabled={submitting}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl w-full mx-auto p-4">
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                noValidate
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Contract Document *
                        </label>
                        <span className="text-xs text-gray-500">
                            PDF and Images only (Max 2MB)
                        </span>
                    </div>

                    {fileError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600 flex items-center">
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

                    <div
                        className={`flex flex-col justify-center px-3 py-4 border-2 border-dashed rounded-lg transition-colors h-[400px]
                            ${
                                errors.contractFile || fileError
                                    ? "border-red-300 bg-red-50"
                                    : contractFile
                                    ? "border-green-300 bg-green-50"
                                    : existingContract
                                    ? "border-blue-300 bg-blue-50"
                                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                            }`}
                    >
                        <div className="space-y-2 text-center w-full h-full">
                            {existingContract && !contractFile ? (
                                renderExistingContract()
                            ) : contractFile ? (
                                renderFilePreview()
                            ) : (
                                <>
                                    <svg
                                        className="mx-auto h-16 w-16 text-gray-400"
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

                                    {/* Upload the contract file by clicking the button below. */}
                                    <div className="mt-4">
                                        <label
                                            htmlFor="contract-upload"
                                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                            {...register("contractFile")}
                                            id="contract-upload"
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
                                    <p className="text-xs text-gray-400">
                                        Maximum file size: 2MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {existingContract && !contractFile && (
                        <p className="text-sm text-gray-500 text-center px-2">
                            Current contract file is saved. Upload a new file to
                            replace it.
                        </p>
                    )}
                </div>

                {errors.contractFile && !fileError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">
                            {errors.contractFile.message}
                        </p>
                    </div>
                )}

                {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">
                            {errors.submit.message}
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between pt-4 gap-3 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={submitting}
                        className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                        Previous
                    </button>

                    <button
                        type="submit"
                        disabled={
                            (!existingContract && !contractFile) ||
                            submitting ||
                            fileError
                        }
                        className={`px-6 py-2.5 text-white rounded-md transition-colors text-sm font-medium w-full sm:w-auto ${
                            (!existingContract && !contractFile) ||
                            submitting ||
                            fileError
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
                                Saving...
                            </span>
                        ) : (
                            "Complete CRM Process"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditContract;
