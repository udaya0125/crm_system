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
            setFileName(
                existingData.image
                    ? getFileNameFromPath(existingData.image)
                    : ""
            );

            updateData({
                contractFile: null,
                fileName: getFileNameFromPath(existingData.image),
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
        if (file) {
            const allowed = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
                "image/svg+xml",
                "application/pdf",
            ];

            if (!allowed.includes(file.type)) {
                setError("contractFile", {
                    type: "manual",
                    message:
                        "File type not allowed. Please upload PDF, JPG, PNG, GIF, or SVG files.",
                });
                toast.error("Invalid file type. Please upload PDF, JPG, PNG, GIF, or SVG files.");
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                setError("contractFile", {
                    type: "manual",
                    message: "File size must be less than 2MB",
                });
                toast.error("File size must be less than 2MB");
                return;
            }

            clearErrors("contractFile");

            setContractFile(file);
            setFileName(file.name);
            setValue("contractFile", file);

            setExistingContract(null);
            toast.success("File selected successfully!");
        }
    };

    const handleRemoveFile = () => {
        setContractFile(null);
        setFileName("");
        setExistingContract(null);
        setValue("contractFile", null);
        clearErrors("contractFile");
        toast.success("File removed successfully!");
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

        const submitToast = toast.loading("Uploading contract...");

        try {
            setSubmitting(true);

            // Debug logs
            console.log('Contract ID:', contractId);
            console.log('Contract File:', contractFile);
            console.log('File exists:', !!contractFile);
            console.log('File name:', contractFile?.name);
            console.log('File size:', contractFile?.size);
            console.log('File type:', contractFile?.type);

            if (contractFile) {
                const formData = new FormData();
                formData.append("company_id", companyId);
                formData.append("image", contractFile); // Changed to "image" to match controller
                formData.append("_method", contractId ? "PUT" : "POST"); // For proper method spoofing

                // Debug FormData
                console.log("FormData contents:");
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }

                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": getCsrfToken(),
                    },
                };

                if (contractId) {
                    // Using POST with _method=PUT for Laravel method spoofing
                    await axios.post(
                        route("ourcontract.update", { id: contractId }),
                        formData,
                        config
                    );
                    toast.success("Contract updated successfully!", { id: submitToast });
                } else {
                    await axios.post(route("ourcontract.store"), formData, config);
                    toast.success("Contract uploaded successfully!", { id: submitToast });
                }
            } else if (existingContract) {
                // If no new file but existing contract, just proceed
                console.log("Using existing contract, no file change");
                toast.success("Contract information saved!", { id: submitToast });
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
            
            // Wait a moment for everything to process, then force full page reload
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
        if (contractFile) {
            if (contractFile.type === 'application/pdf') {
                return (
                    <div className="flex flex-col items-center">
                        <div className="w-full h-24 flex items-center justify-center bg-gray-100 border border-gray-300">
                            <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-sm mt-2">{fileName}</span>
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="mt-2 bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200"
                        >
                            Remove File
                        </button>
                    </div>
                );
            } else {
                return (
                    <div className="flex flex-col items-center">
                        <img 
                            src={URL.createObjectURL(contractFile)} 
                            alt="Contract preview" 
                            className="w-full h-24 object-contain" 
                        />
                        <span className="text-sm mt-2">{fileName}</span>
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="mt-2 bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200"
                        >
                            Remove File
                        </button>
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className="max-w-7xl mx-auto mt-4">
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                noValidate
            >
                {/* File upload section */}
                <div className="space-y-4">
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {existingContract && !contractFile ? (
                                <div className="flex flex-col items-center">
                                    {existingContract.image?.endsWith('.pdf') ? (
                                        <div className="w-full h-24 flex items-center justify-center bg-gray-100 border border-gray-300">
                                            <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <img
                                            src={displayUrl}
                                            alt="Current contract"
                                            className="w-full h-24 object-contain"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                    )}
                                    <div className="flex flex-col gap-2 mt-2">
                                        {displayUrl && (
                                            <a
                                                href={displayUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline text-sm"
                                            >
                                                View Current Contract
                                            </a>
                                        )}
                                        <label
                                            htmlFor="contract-upload"
                                            className="cursor-pointer bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200"
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
                                        />
                                    </div>
                                </div>
                            ) : contractFile ? (
                                renderFilePreview()
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
                                    <label
                                        htmlFor="contract-upload"
                                        className="cursor-pointer text-indigo-600 hover:text-indigo-500 font-medium"
                                    >
                                        Upload a file
                                    </label>
                                    <input
                                        {...register("contractFile")}
                                        id="contract-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                        accept=".pdf,.jpg,.jpeg,.png,.gif,.svg"
                                    />
                                    <p className="text-xs text-gray-500">
                                        PDF, JPG, PNG, GIF, SVG up to 2MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {existingContract && !contractFile && (
                        <p className="text-sm text-gray-500 text-center">
                            Current contract file is saved. Upload a new file to replace it.
                        </p>
                    )}
                </div>

                {/* Error Messages */}
                {errors.contractFile && (
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

                <div className="flex justify-between pt-6">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={submitting}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    >
                        Previous
                    </button>

                    <button
                        type="submit"
                        disabled={
                            (!existingContract && !contractFile) || submitting
                        }
                        className={`px-6 py-2 text-white rounded-md transition-colors ${
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