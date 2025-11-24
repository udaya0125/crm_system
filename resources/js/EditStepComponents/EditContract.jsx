import React, { useState, useEffect } from "react";
import axios from "axios";

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
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Check if we're updating existing data or creating new
    const contractId = existingData?.id || null;

    // Helper function to get CSRF token safely
    const getCsrfToken = () => {
        if (typeof document === "undefined") return "";

        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute("content") : "";
    };

    // Load existing contract data when component mounts
    useEffect(() => {
        if (existingData && existingData.id) {
            setExistingContract(existingData);
            setFileName(
                existingData.image
                    ? getFileNameFromPath(existingData.image)
                    : ""
            );

            // Update parent component with existing data
            updateData({
                contractFile: null, // We don't have the actual file, just the path
                fileName: getFileNameFromPath(existingData.image),
                filePath: existingData.image,
                image_url: existingData.image_url, // If available from backend
            });
        }
    }, [existingData, updateData]);

    // Helper function to extract filename from path
    const getFileNameFromPath = (path) => {
        if (!path) return "";
        return path.split("/").pop() || path;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setContractFile(file);
            setFileName(file.name);

            // Clear existing contract when new file is selected
            setExistingContract(null);

            // Clear any previous file errors
            if (errors.file) {
                setErrors((prev) => ({ ...prev, file: "" }));
            }
        }
    };

    const handleRemoveFile = () => {
        setContractFile(null);
        setFileName("");
        setExistingContract(null);
    };

    const validateForm = () => {
        const newErrors = {};

        // If no existing contract and no new file, show error
        if (!existingContract && !contractFile) {
            newErrors.file = "Contract file is required";
        } else if (contractFile) {
            // Validate new file if one is selected
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
                "image/svg+xml",
                "application/pdf",
            ];

            if (!allowedTypes.includes(contractFile.type)) {
                newErrors.file =
                    "File type not allowed. Please upload PDF, JPG, PNG, GIF, or SVG files.";
            }

            if (contractFile.size > 2 * 1024 * 1024) {
                newErrors.file = "File size must be less than 2MB";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            // Always use the contractFile if available (new upload takes priority)
            if (contractFile) {
                // Create FormData for file upload
                const formData = new FormData();
                formData.append("company_id", companyId);
                formData.append("image", contractFile);

                if (contractId) {
                    // Update existing contract with new file
                    await axios.post(
                        route("ourcontract.update", { id: contractId }),
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                "X-CSRF-TOKEN": getCsrfToken(),
                            },
                        }
                    );
                    console.log("Contract updated successfully");
                } else {
                    // Create new contract
                    const response = await axios.post(
                        route("ourcontract.store"),
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                "X-CSRF-TOKEN": getCsrfToken(),
                            },
                        }
                    );
                    console.log(
                        "Contract created successfully:",
                        response.data
                    );
                }
            } else if (existingContract && !contractFile) {
                // No new file selected, but we have existing contract
                console.log("Using existing contract file");

                // If we have contractId but no new file, we might want to update other fields
                // or just proceed with the existing file
                if (contractId) {
                    // You can make a PATCH request here if you need to update other fields
                    // without changing the file
                    console.log("Keeping existing contract file");
                }
            }

            // Update parent component with the data
            updateData({
                contractFile: contractFile,
                fileName: fileName,
                fileSize: contractFile?.size,
                fileType: contractFile?.type,
                existingContract: existingContract,
            });

            // Call the onSubmit callback
            onSubmit();
        } catch (error) {
            console.log("Error saving contract", error);

            let errorMessage = "Failed to save contract. Please try again.";

            if (error.response?.data?.errors?.image) {
                errorMessage = error.response.data.errors.image[0];
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            setErrors({ submit: errorMessage });
        } finally {
            setSubmitting(false);
        }
    };

    // Get the display URL for the existing contract
    const getDisplayUrl = () => {
        if (existingContract?.image_url) {
            return existingContract.image_url;
        }
        if (existingContract?.image) {
            // If it's a full URL, use it directly
            if (existingContract.image.startsWith("http")) {
                return existingContract.image;
            }
            // Otherwise, construct the URL from the path
            return `/storage/${existingContract.image}`;
        }
        return null;
    };

    const displayUrl = getDisplayUrl();

    return (
        <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contract File Upload */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        {existingContract && !contractFile
                            ? "Update Contract Document"
                            : "Upload Contract Document"}{" "}
                        *
                    </label>

                    {errors.file && (
                        <p className="text-red-500 text-sm mb-2">
                            {errors.file}
                        </p>
                    )}

                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {existingContract && !contractFile ? (
                                <div className="flex flex-col items-center">
                                    <img src={displayUrl} alt="Current Contract" className="w-full h-24" />
                                    <div className="flex flex-col gap-2">
                                        {displayUrl && (
                                            <a
                                                href={displayUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                                            >
                                                View Current Contract
                                            </a>
                                        )}
                                        <div className="mt-2">
                                            <label
                                                htmlFor="contract-upload"
                                                className="cursor-pointer bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-200"
                                            >
                                                Replace File
                                            </label>
                                            <input
                                                id="contract-upload"
                                                name="contract-upload"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png,.gif,.svg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : contractFile ? (
                                <div className="flex flex-col items-center">
                                    <div className="text-4xl mb-2">
                                        {getFileIcon(fileName)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="font-medium">
                                            {fileName}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="mt-2 bg-red-100 text-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-red-200"
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
                                    <div className="flex text-sm text-gray-600">
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
                                                accept=".pdf,.jpg,.jpeg,.png,.gif,.svg"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PDF, JPG, PNG, GIF, SVG up to 2MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {existingContract && !contractFile && (
                        <p className="text-sm text-gray-500 text-center">
                            Current contract file is saved. Upload a new file to
                            replace it.
                        </p>
                    )}
                </div>

                {/* Error Message */}
                {errors.submit && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={submitting}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        disabled={
                            (!existingContract && !contractFile) || submitting
                        }
                        className={`px-6 py-2 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            (!existingContract && !contractFile) || submitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        {submitting ? "Saving..." : "Complete CRM Process"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditContract;
