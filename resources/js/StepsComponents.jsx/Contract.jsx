import React, { useState } from "react";

const Contract = ({ data, updateData, prevStep, onSubmit }) => {
    const [contractFile, setContractFile] = useState(null);
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setContractFile(file);
            setFileName(file.name);
            // Update form data with file information
            updateData({
                contractFile: file,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
            });
        }
    };

    const handleRemoveFile = () => {
        setContractFile(null);
        setFileName("");
        updateData({
            contractFile: null,
            fileName: "",
            fileSize: "",
            fileType: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission with all contract data
        onSubmit();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contract Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contract File Upload */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Upload Contract Document
                    </label>

                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {contractFile ? (
                                <div className="flex flex-col items-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-green-500"
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
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PDF, DOC, DOCX, JPG, PNG up to 10MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                    <button
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Complete CRM Process
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Contract;
