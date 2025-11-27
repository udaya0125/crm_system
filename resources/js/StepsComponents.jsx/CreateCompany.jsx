import React from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateCompany = ({ data, updateData, nextStep }) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        defaultValues: {
            companyName: data.companyName || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            client_member: data.client_member || "",
            designation: data.designation || "",
            noOfRooms: data.noOfRooms || "",
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            website: data.website || "",
            source: data.source || "",
            responsiblePerson: data.responsiblePerson || "",
            comment: data.comment || "",
            messenger: data.messenger || "",
            messengerContact: data.messengerContact || "",
        }
    });

    // Watch messenger field to conditionally show validation
    const watchedMessenger = watch("messenger");

    // React Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['blockquote', 'code-block'],
            ['clean']
        ],
    };

    // React Quill formats
    const quillFormats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'list', 'bullet',
        'align',
        'link', 'image',
        'blockquote', 'code-block'
    ];

    // Axios store function
    const storeCompany = async (formData) => {
        try {
            const response = await axios.post(route("ourcompany.store"), formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Error creating company", error);
            throw error;
        }
    };

    // Axios update function
    const updateCompany = async (formData, id) => {
        try {
            const response = await axios.put(
                route("ourcompany.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.log("Error updating company", error);
            throw error;
        }
    };

    const onSubmit = async (formData) => {
        try {
            // Prepare data for API - map React field names to Laravel field names
            const apiData = {
                company_name: formData.companyName,
                first_name: formData.firstName,
                last_name: formData.lastName,
                client_member: formData.client_member,
                designation: formData.designation,
                no_of_rooms: formData.noOfRooms,
                phone_no: formData.phone,
                email: formData.email,
                address: formData.address,
                website: formData.website,
                source: formData.source,
                responsible_person: formData.responsiblePerson,
                preffered_message: formData.messenger,
                message_contact: formData.messengerContact,
                comment: formData.comment,
            };

            let result;
            let companyId;

            // Check if we're updating an existing company or creating a new one
            if (data.id) {
                // Update existing company
                console.log("Updating existing company with ID:", data.id);
                result = await updateCompany(apiData, data.id);
                companyId = data.id;
            } else {
                // Create new company
                console.log("Creating new company");
                result = await storeCompany(apiData);
                
                // Extract company ID from API response
                companyId = result.company_id || result.id;
                console.log("Created Company ID:", companyId);
                
                if (!companyId) {
                    throw new Error("Company ID not returned from API");
                }
            }

            // Update parent component data WITH THE COMPANY ID
            updateData({
                ...formData,
                id: companyId
            }, companyId);
            
            // Move to next step
            nextStep();
            
        } catch (error) {
            console.log("Error processing company", error);
            // Handle API validation errors
            if (error.response && error.response.data.errors) {
                const apiErrors = error.response.data.errors;
                
                // Map Laravel field names back to React field names
                Object.keys(apiErrors).forEach(key => {
                    switch(key) {
                        case 'company_name':
                            setError('companyName', { type: 'server', message: apiErrors[key][0] });
                            break;
                        case 'first_name':
                            setError('firstName', { type: 'server', message: apiErrors[key][0] });
                            break;
                        case 'last_name':
                            setError('lastName', { type: 'server', message: apiErrors[key][0] });
                            break;
                        case 'phone_no':
                            setError('phone', { type: 'server', message: apiErrors[key][0] });
                            break;
                        case 'preffered_message':
                            setError('messenger', { type: 'server', message: apiErrors[key][0] });
                            break;
                        case 'message_contact':
                            setError('messengerContact', { type: 'server', message: apiErrors[key][0] });
                            break;
                        case 'responsible_person':
                            setError('responsiblePerson', { type: 'server', message: apiErrors[key][0] });
                            break;
                        default:
                            setError(key, { type: 'server', message: apiErrors[key][0] });
                    }
                });
            } else {
                alert(`Error ${data.id ? 'updating' : 'creating'} company. Please try again.`);
            }
        }
    };

    // Helper function to get input className with error state
    const getInputClassName = (fieldName) => {
        const baseClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";
        return errors[fieldName] 
            ? `${baseClass} border-red-500 focus:ring-red-500 focus:border-red-500` 
            : baseClass;
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
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
                                className={getInputClassName('companyName')}
                                placeholder="Enter company name"
                            />
                            {errors.companyName && (
                                <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
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
                                className={getInputClassName('firstName')}
                                placeholder="Enter first name"
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
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
                                className={getInputClassName('lastName')}
                                placeholder="Enter last name"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
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
                                className={getInputClassName('client_member')}
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
                                className={getInputClassName('designation')}
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
                                    min: { value: 0, message: "Number of rooms cannot be negative" }
                                })}
                                min="0"
                                className={getInputClassName('noOfRooms')}
                                placeholder="Enter number of rooms"
                            />
                            {errors.noOfRooms && (
                                <p className="mt-1 text-sm text-red-600">{errors.noOfRooms.message}</p>
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
                                        message: "Please enter a valid phone number"
                                    }
                                })}
                                className={getInputClassName('phone')}
                                placeholder="Enter phone number"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
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
                                        message: "Please enter a valid email address"
                                    }
                                })}
                                className={getInputClassName('email')}
                                placeholder="Enter email address"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                {...register("address")}
                                className={getInputClassName('address')}
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
                                        message: "Please enter a valid website URL"
                                    }
                                })}
                                className={getInputClassName('website')}
                                placeholder="https://example.com"
                            />
                            {errors.website && (
                                <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
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
                                className={getInputClassName('source')}
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
                                className={getInputClassName('responsiblePerson')}
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
                                        className={getInputClassName('messenger')}
                                    >
                                        <option value="">Select messenger</option>
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="telegram">Telegram</option>
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
                                            required: watchedMessenger ? "Messenger contact is required when messenger is selected" : false
                                        })}
                                        className={getInputClassName('messengerContact')}
                                        placeholder={
                                            watchedMessenger
                                                ? `Enter ${watchedMessenger} contact`
                                                : "Enter contact"
                                        }
                                    />
                                    {errors.messengerContact && (
                                        <p className="mt-1 text-sm text-red-600">{errors.messengerContact.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Comment - React Quill Rich Text Editor */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comment
                            </label>
                            <Controller
                                name="comment"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        {...field}
                                        theme="snow"
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter any additional comments or notes..."
                                        className="h-48 mb-12"
                                        onChange={(content) => {
                                            field.onChange(content);
                                        }}
                                    />
                                )}
                            />
                            <style jsx>{`
                                :global(.ql-container) {
                                    border-bottom-left-radius: 0.375rem;
                                    border-bottom-right-radius: 0.375rem;
                                }
                                :global(.ql-toolbar) {
                                    border-top-left-radius: 0.375rem;
                                    border-top-right-radius: 0.375rem;
                                    border-bottom: none;
                                }
                                :global(.ql-editor) {
                                    min-height: 120px;
                                }
                                :global(.ql-editor.ql-blank::before) {
                                    font-style: normal;
                                    color: #9CA3AF;
                                }
                            `}</style>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-16 flex justify-end"> 
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting 
                                ? data.id 
                                    ? "Updating Company..." 
                                    : "Creating Company..."
                                : "Next"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCompany;