import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditCreateCompany = ({
    data,
    updateData,
    nextStep,
    company,
    companyId,
}) => {
    const [submitting, setSubmitting] = React.useState(false);
    const [commentValue, setCommentValue] = React.useState("");

    // React Hook Form initialization
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            companyName: "",
            firstName: "",
            lastName: "",
            client_member: "",
            designation: "",
            noOfRooms: "",
            phone: "",
            email: "",
            address: "",
            website: "",
            source: "",
            responsiblePerson: "",
            comment: "",
            messenger: "",
            messengerContact: "",
        },
    });

    // Watch messenger field to conditionally require messengerContact
    const selectedMessenger = watch("messenger");

    // Initialize form data when component receives props
    useEffect(() => {
        if (data) {
            Object.keys(data).forEach((key) => {
                if (data[key] !== undefined) {
                    setValue(key, data[key]);
                    if (key === "comment") {
                        setCommentValue(data[key]);
                    }
                }
            });
        }
    }, [data, setValue]);

    // Update parent component when form values change
    useEffect(() => {
        const subscription = watch((value) => {
            updateData(value);
        });
        return () => subscription.unsubscribe();
    }, [watch, updateData]);

    // Handle comment change
    const handleCommentChange = (value) => {
        setCommentValue(value);
        setValue("comment", value);
        updateData({ ...watch(), comment: value });
    };

    // React Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
        ],
    };

    // React Quill formats configuration
    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
    ];

    // Helper function to get CSRF token safely
    const getCsrfToken = () => {
        if (typeof document === "undefined") return "";

        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute("content") : "";
    };

    const onSubmit = async (formData) => {
        try {
            setSubmitting(true);

            if (companyId) {
                // Update existing company
                await handleUpdateCompany(formData);
            } else {
                // Create new company
                await handleCreateCompany(formData);
            }

            // Move to next step
            nextStep();
        } catch (error) {
            console.log("Error saving company data", error);
            setError("submit", {
                type: "manual",
                message: "Failed to save company data. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateCompany = async (formData) => {
        // Map frontend field names to backend field names
        const fieldMapping = {
            companyName: "company_name",
            firstName: "first_name",
            lastName: "last_name",
            client_member: "client_member",
            designation: "designation",
            noOfRooms: "no_of_rooms",
            phone: "phone_no",
            email: "email",
            address: "address",
            website: "website",
            source: "source",
            responsiblePerson: "responsible_person",
            comment: "comment",
            messenger: "preffered_message",
            messengerContact: "message_contact",
        };

        const backendData = {};
        Object.keys(formData).forEach((key) => {
            const backendKey = fieldMapping[key] || key;
            backendData[backendKey] = formData[key];
        });

        try {
            const response = await axios.put(
                route("ourcompany.update", { id: companyId }),
                backendData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": getCsrfToken(),
                    },
                }
            );

            console.log("Company updated successfully:", response.data);

            // Update parent component with the data
            updateData(formData, companyId);
        } catch (error) {
            console.error("Error updating company:", error);
            if (error.response && error.response.data) {
                throw new Error(
                    error.response.data.message || "Failed to update company"
                );
            }
            throw error;
        }
    };

    const handleCreateCompany = async (formData) => {
        // Map frontend field names to backend field names
        const fieldMapping = {
            companyName: "company_name",
            firstName: "first_name",
            lastName: "last_name",
            client_member: "client_member",
            designation: "designation",
            noOfRooms: "no_of_rooms",
            phone: "phone_no",
            email: "email",
            address: "address",
            website: "website",
            source: "source",
            responsiblePerson: "responsible_person",
            comment: "comment",
            messenger: "preffered_message",
            messengerContact: "message_contact",
        };

        const backendData = {};
        Object.keys(formData).forEach((key) => {
            const backendKey = fieldMapping[key] || key;
            backendData[backendKey] = formData[key];
        });

        try {
            const response = await axios.post(
                route("ourcompany.store"),
                backendData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": getCsrfToken(),
                    },
                }
            );

            console.log("Company created successfully:", response.data);

            // Update parent component with the data and new company ID
            updateData(formData, response.data.company_id);
        } catch (error) {
            console.error("Error creating company:", error);
            if (error.response && error.response.data) {
                throw new Error(
                    error.response.data.message || "Failed to create company"
                );
            }
            throw error;
        }
    };

    // Helper function to get input className with error state
    const getInputClassName = (fieldName) => {
        const baseClass =
            "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";
        return errors[fieldName]
            ? `${baseClass} border-red-500 focus:ring-red-500 focus:border-red-500`
            : baseClass;
    };

    // Helper function to get React Quill className with error state - UPDATED HEIGHT
    const getQuillClassName = (fieldName) => {
        const baseClass = "w-full h-[250px]"; // Changed from h-32 to h-96 (384px height)
        return errors[fieldName]
            ? `${baseClass} border-red-500 rounded-md`
            : baseClass;
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                {...register("companyName", {
                                    required: "Company name is required",
                                })}
                                className={getInputClassName("companyName")}
                                placeholder="Enter company name"
                            />
                            {errors.companyName && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.companyName.message}
                                </p>
                            )}
                        </div>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name *
                            </label>
                            <input
                                type="text"
                                {...register("firstName", {
                                    required: "First name is required",
                                })}
                                className={getInputClassName("firstName")}
                                placeholder="Enter first name"
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                {...register("lastName", {
                                    required: "Last name is required",
                                })}
                                className={getInputClassName("lastName")}
                                placeholder="Enter last name"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>

                        {/* Client Member */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Member
                            </label>
                            <input
                                type="text"
                                {...register("client_member")}
                                className={getInputClassName("client_member")}
                                placeholder="Enter client member"
                            />
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Designation
                            </label>
                            <input
                                type="text"
                                {...register("designation")}
                                className={getInputClassName("designation")}
                                placeholder="Enter designation"
                            />
                        </div>

                        {/* Number of Rooms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Rooms
                            </label>
                            <input
                                type="number"
                                {...register("noOfRooms", {
                                    min: {
                                        value: 0,
                                        message:
                                            "Number of rooms cannot be negative",
                                    },
                                })}
                                min="0"
                                className={getInputClassName("noOfRooms")}
                                placeholder="Enter number of rooms"
                            />
                            {errors.noOfRooms && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.noOfRooms.message}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone *
                            </label>
                            <input
                                type="tel"
                                {...register("phone", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[\+]?[1-9][\d]{0,15}$/,
                                        message:
                                            "Please enter a valid phone number",
                                    },
                                })}
                                className={getInputClassName("phone")}
                                placeholder="Enter phone number"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message:
                                            "Please enter a valid email address",
                                    },
                                })}
                                className={getInputClassName("email")}
                                placeholder="Enter email address"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <textarea
                                {...register("address")}
                                rows="2"
                                className={getInputClassName("address")}
                                placeholder="Enter full address"
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                {...register("website", {
                                    pattern: {
                                        value: /^https?:\/\/.+\..+/,
                                        message:
                                            "Please enter a valid website URL",
                                    },
                                })}
                                className={getInputClassName("website")}
                                placeholder="https://example.com"
                            />
                            {errors.website && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.website.message}
                                </p>
                            )}
                        </div>

                        {/* Source */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Source
                            </label>
                            <input
                                type="text"
                                {...register("source")}
                                className={getInputClassName("source")}
                                placeholder="Enter source"
                            />
                        </div>

                        {/* Responsible Person */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Responsible Person
                            </label>
                            <input
                                type="text"
                                {...register("responsiblePerson")}
                                className={getInputClassName(
                                    "responsiblePerson"
                                )}
                                placeholder="Enter responsible person"
                            />
                        </div>

                        {/* Messenger */}
                        <div className="md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Messenger Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Messenger
                                    </label>
                                    <select
                                        {...register("messenger")}
                                        className={getInputClassName(
                                            "messenger"
                                        )}
                                    >
                                        <option value="">
                                            Select messenger
                                        </option>
                                        <option value="whatsapp">
                                            WhatsApp
                                        </option>
                                        <option value="telegram">
                                            Telegram
                                        </option>
                                        <option value="viber">Viber</option>
                                        <option value="skype">Skype</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Messenger Contact */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Messenger Contact/Username
                                    </label>
                                    <input
                                        type="text"
                                        {...register("messengerContact", {
                                            required: selectedMessenger
                                                ? "Messenger contact is required when messenger is selected"
                                                : false,
                                        })}
                                        className={getInputClassName(
                                            "messengerContact"
                                        )}
                                        placeholder={
                                            selectedMessenger
                                                ? `Enter ${selectedMessenger} contact`
                                                : "Enter contact"
                                        }
                                    />
                                    {errors.messengerContact && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.messengerContact.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Comment - React Quill - UPDATED HEIGHT */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comment
                            </label>
                            <ReactQuill
                                value={commentValue}
                                onChange={handleCommentChange}
                                modules={quillModules}
                                formats={quillFormats}
                                className={getQuillClassName("comment")}
                                placeholder="Enter any additional comments or notes"
                                theme="snow"
                            />
                            {errors.comment && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.comment.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">
                                {errors.submit.message}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-14 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting
                                ? "Saving..."
                                : companyId
                                ? "Update Company"
                                : "Create Company"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCreateCompany;