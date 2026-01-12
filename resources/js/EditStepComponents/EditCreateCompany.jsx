// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import toast from "react-hot-toast";

// const EditCreateCompany = ({
//     data,
//     updateData,
//     nextStep,
//     company,
//     companyId,
// }) => {
//     const [submitting, setSubmitting] = React.useState(false);
//     const [commentValue, setCommentValue] = React.useState("");

//     const {
//         register,
//         handleSubmit,
//         setValue,
//         setError,
//         watch,
//         formState: { errors },
//     } = useForm({
//         mode: "onChange",
//         defaultValues: {
//             companyName: "",
//             firstName: "",
//             lastName: "",
//             client_member: "",
//             designation: "",
//             noOfRooms: "",
//             phone: "",
//             email: "",
//             address: "",
//             website: "",
//             source: "",
//             responsiblePerson: "",
//             comment: "",
//             messenger: "",
//             messengerContact: "",
//         },
//     });

//     const selectedMessenger = watch("messenger");

//     // Initialize form from props
//     useEffect(() => {
//         if (data) {
//             Object.keys(data).forEach((key) => {
//                 if (data[key] !== undefined) {
//                     setValue(key, data[key]);
//                     if (key === "comment") {
//                         setCommentValue(data[key]);
//                     }
//                 }
//             });
//         }
//     }, [data, setValue]);

//     // Sync form changes to parent
//     useEffect(() => {
//         const subscription = watch((value) => {
//             updateData(value);
//         });
//         return () => subscription.unsubscribe();
//     }, [watch, updateData]);

//     const handleCommentChange = (value) => {
//         setCommentValue(value);
//         setValue("comment", value);
//         updateData({ ...watch(), comment: value });
//     };

//     const quillModules = {
//         toolbar: [
//             [{ header: [1, 2, 3, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
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
//         "link",
//     ];

//     const getCsrfToken = () => {
//         if (typeof document === "undefined") return "";
//         const metaTag = document.querySelector('meta[name="csrf-token"]');
//         return metaTag ? metaTag.getAttribute("content") : "";
//     };

//     const onSubmit = async (formData) => {
//         try {
//             setSubmitting(true);
//             const loadingToast = toast.loading(
//                 companyId ? "Updating company..." : "Creating company..."
//             );

//             if (companyId) {
//                 await handleUpdateCompany(formData);
//                 toast.success("Company updated successfully!", { id: loadingToast });
//             } else {
//                 await handleCreateCompany(formData);
//                 toast.success("Company created successfully!", { id: loadingToast });
//             }

//             nextStep();
//         } catch (error) {
//             console.log("Error saving company data", error);
//             toast.error(
//                 error.message || "Failed to save company data. Please try again."
//             );
//             setError("submit", {
//                 type: "manual",
//                 message: "Failed to save company data. Please try again.",
//             });
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleUpdateCompany = async (formData) => {
//         const fieldMapping = {
//             companyName: "company_name",
//             firstName: "first_name",
//             lastName: "last_name",
//             client_member: "client_member",
//             designation: "designation",
//             noOfRooms: "no_of_rooms",
//             phone: "phone_no",
//             email: "email",
//             address: "address",
//             website: "website",
//             source: "source",
//             responsiblePerson: "responsible_person",
//             comment: "comment",
//             messenger: "preffered_message",
//             messengerContact: "message_contact",
//         };

//         const backendData = {};
//         Object.keys(formData).forEach((key) => {
//             const backendKey = fieldMapping[key] || key;
//             backendData[backendKey] = formData[key];
//         });

//         try {
//             const response = await axios.put(
//                 route("ourcompany.update", { id: companyId }),
//                 backendData,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         "X-CSRF-TOKEN": getCsrfToken(),
//                     },
//                 }
//             );

//             updateData(formData, companyId);
//         } catch (error) {
//             console.error("Error updating company:", error);
//             let errorMessage = "Failed to update company";
//             if (error.response?.data) {
//                 errorMessage = error.response.data.message || errorMessage;
//                 if (error.response.data.errors) {
//                     const validationErrors = error.response.data.errors;
//                     errorMessage = "Please check the form for errors";
//                     const backendToFrontendMapping = Object.fromEntries(
//                         Object.entries(fieldMapping).map(([frontend, backend]) => [backend, frontend])
//                     );
//                     Object.keys(validationErrors).forEach((field) => {
//                         const frontendField = backendToFrontendMapping[field] || field;
//                         setError(frontendField, {
//                             type: "server",
//                             message: validationErrors[field][0],
//                         });
//                     });
//                 }
//             }
//             throw new Error(errorMessage);
//         }
//     };

//     const handleCreateCompany = async (formData) => {
//         const fieldMapping = {
//             companyName: "company_name",
//             firstName: "first_name",
//             lastName: "last_name",
//             client_member: "client_member",
//             designation: "designation",
//             noOfRooms: "no_of_rooms",
//             phone: "phone_no",
//             email: "email",
//             address: "address",
//             website: "website",
//             source: "source",
//             responsiblePerson: "responsible_person",
//             comment: "comment",
//             messenger: "preffered_message",
//             messengerContact: "message_contact",
//         };

//         const backendData = {};
//         Object.keys(formData).forEach((key) => {
//             const backendKey = fieldMapping[key] || key;
//             backendData[backendKey] = formData[key];
//         });

//         try {
//             const response = await axios.post(
//                 route("ourcompany.store"),
//                 backendData,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         "X-CSRF-TOKEN": getCsrfToken(),
//                     },
//                 }
//             );

//             updateData(formData, response.data.company_id);
//         } catch (error) {
//             console.error("Error creating company:", error);
//             let errorMessage = "Failed to create company";
//             if (error.response?.data) {
//                 errorMessage = error.response.data.message || errorMessage;
//                 if (error.response.data.errors) {
//                     const validationErrors = error.response.data.errors;
//                     errorMessage = "Please check the form for errors";
//                     const backendToFrontendMapping = Object.fromEntries(
//                         Object.entries(fieldMapping).map(([frontend, backend]) => [backend, frontend])
//                     );
//                     Object.keys(validationErrors).forEach((field) => {
//                         const frontendField = backendToFrontendMapping[field] || field;
//                         setError(frontendField, {
//                             type: "server",
//                             message: validationErrors[field][0],
//                         });
//                     });
//                 }
//             }
//             throw new Error(errorMessage);
//         }
//     };

//     const getInputClassName = (fieldName) => {
//         const baseClass =
//             "w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";
//         return errors[fieldName]
//             ? `${baseClass} border-red-500 focus:ring-red-500 focus:border-red-500`
//             : baseClass;
//     };

//     // Only adds error border — height handled via global CSS override
//     const getQuillClassName = (fieldName) => {
//         return errors[fieldName] ? "border border-red-500 rounded-md" : "";
//     };

//     return (
//         <div className="max-w-7xl mx-auto w-full p-4 sm:p-6">
//             <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
//                 <form onSubmit={handleSubmit(onSubmit)} noValidate>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                         {/* Company Name */}
//                         <div className="col-span-full">
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Company Name *
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("companyName", {
//                                     required: "Company name is required",
//                                 })}
//                                 className={getInputClassName("companyName")}
//                                 placeholder="Enter company name"
//                             />
//                             {errors.companyName && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {errors.companyName.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* First Name */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                               Client Full Name *
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("firstName", {
//                                     required: "First name is required",
//                                 })}
//                                 className={getInputClassName("firstName")}
//                                 placeholder="Enter first name"
//                             />
//                             {errors.firstName && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {errors.firstName.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Last Name */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                Client Last Name *
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("lastName", {
//                                     required: "Last name is required",
//                                 })}
//                                 className={getInputClassName("lastName")}
//                                 placeholder="Enter last name"
//                             />
//                             {errors.lastName && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {errors.lastName.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Client Member */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Client Member
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("client_member")}
//                                 className={getInputClassName("client_member")}
//                                 placeholder="Enter client member"
//                             />
//                         </div>

//                         {/* Designation */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Designation
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("designation")}
//                                 className={getInputClassName("designation")}
//                                 placeholder="Enter designation"
//                             />
//                         </div>

//                         {/* Number of Rooms */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Number of Rooms
//                             </label>
//                             <input
//                                 type="number"
//                                 {...register("noOfRooms", {
//                                     min: {
//                                         value: 0,
//                                         message: "Number of rooms cannot be negative",
//                                     },
//                                 })}
//                                 min="0"
//                                 className={getInputClassName("noOfRooms")}
//                                 placeholder="Enter number of rooms"
//                             />
//                             {errors.noOfRooms && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {errors.noOfRooms.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Phone */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Phone *
//                             </label>
//                             <input
//                                 type="tel"
//                                 {...register("phone", {
//                                     required: "Phone number is required",
//                                     pattern: {
//                                         value: /^[\+]?[1-9][\d]{0,15}$/,
//                                         message: "Please enter a valid phone number",
//                                     },
//                                 })}
//                                 className={getInputClassName("phone")}
//                                 placeholder="Enter phone number"
//                             />
//                             {errors.phone && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {errors.phone.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Email */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Email *
//                             </label>
//                             <input
//                                 type="email"
//                                 {...register("email", {
//                                     required: "Email is required",
//                                     pattern: {
//                                         value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                                         message: "Please enter a valid email address",
//                                     },
//                                 })}
//                                 className={getInputClassName("email")}
//                                 placeholder="Enter email address"
//                             />
//                             {errors.email && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {errors.email.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Address */}
//                         <div className="col-span-full">
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Address
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("address")}
//                                 rows="2"
//                                 className={getInputClassName("address")}
//                                 placeholder="Enter full address"
//                             />
//                         </div>

//                         {/* Website */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Website
//                             </label>
//                             <input
//                                 type="url"
//                                 {...register("website", {
//                                     pattern: {
//                                         value: /^https?:\/\/.+\..+/,
//                                         message: "Please enter a valid website URL",
//                                     },
//                                 })}
//                                 className={getInputClassName("website")}
//                                 placeholder="https://example.com"
//                             />
//                             {errors.website && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {errors.website.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Source */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Source
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("source")}
//                                 className={getInputClassName("source")}
//                                 placeholder="Enter source"
//                             />
//                         </div>

//                         {/* Responsible Person */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Responsible Person
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("responsiblePerson")}
//                                 className={getInputClassName("responsiblePerson")}
//                                 placeholder="Enter responsible person"
//                             />
//                         </div>

//                         {/* Messenger */}
//                         <div className="col-span-full">
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                         Preferred Contact
//                                     </label>
//                                     <select
//                                         {...register("messenger")}
//                                         className={getInputClassName("messenger")}
//                                     >
//                                         <option value="">Select messenger</option>
//                                         <option value="whatsapp">WhatsApp</option>                                      
//                                         <option value="viber">Viber</option>                                      
//                                         <option value="other">Other</option>
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                         Contact Number
//                                     </label>
//                                     <input
//                                         type="text"
//                                         {...register("messengerContact", {
//                                             required: selectedMessenger
//                                                 ? "Messenger contact is required when messenger is selected"
//                                                 : false,
//                                         })}
//                                         className={getInputClassName("messengerContact")}
//                                         placeholder={
//                                             selectedMessenger
//                                                 ? `Enter ${selectedMessenger} contact`
//                                                 : "Enter contact"
//                                         }
//                                     />
//                                     {errors.messengerContact && (
//                                         <p className="mt-1 text-sm text-red-600">
//                                             {errors.messengerContact.message}
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Comment */}
//                         <div className="col-span-full">
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Comment
//                             </label>
//                             <div className="[&_.ql-editor]:min-h-[150px] [&_.ql-toolbar]:p-2 [&_.ql-container]:p-2">
//                                 <ReactQuill
//                                     value={commentValue}
//                                     onChange={handleCommentChange}
//                                     modules={quillModules}
//                                     formats={quillFormats}
//                                     className={getQuillClassName("comment")}
//                                     placeholder="Enter any additional comments or notes"
//                                     theme="snow"
//                                 />
//                             </div>
//                             {errors.comment && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {errors.comment.message}
//                                 </p>
//                             )}
//                         </div>
//                     </div>

//                     {/* Submit Error */}
//                     {errors.submit && (
//                         <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
//                             <p className="text-sm text-red-600">
//                                 {errors.submit.message}
//                             </p>
//                         </div>
//                     )}

//                     {/* Submit Button */}
//                     <div className="mt-6 sm:mt-8 flex sm:justify-end">
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {submitting
//                                 ? "Saving..."
//                                 : companyId
//                                 ? "Update Company"
//                                 : "Create Company"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditCreateCompany;




import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form"; 
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const EditCreateCompany = ({
    data,
    updateData,
    nextStep,
    companyId,
}) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        setError,
        watch, 
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            companyName: "",
            fullName: "",
            designation: "",
            phone: "",
            email: "",
            address: "",
            responsiblePerson: "",
            ourTeam: "",
            client_member: "",
            comment: "",
        },
    });

    // Initialize form from props - FIXED VERSION
    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            console.log("Initializing form with data:", data); 
            
            // Direct mapping of data fields to form fields
            // If data comes from backend with snake_case, map to camelCase
            const formData = {
                companyName: data.company_name || data.companyName || "",
                fullName: data.full_name || data.fullName || "",
                designation: data.designation || "",
                phone: data.phone_no || data.phone || "",
                email: data.email || "",
                address: data.address || "",
                responsiblePerson: data.responsible_person || data.responsiblePerson || "",
                ourTeam: data.our_team || data.ourTeam || "",
                client_member: data.client_member || "",
                comment: data.comment || "",
            };
            
            // Set each form field value
            Object.keys(formData).forEach((key) => {
                setValue(key, formData[key]);
            });
        }
    }, [data, setValue]);


    console.log("EditCreateCompany received data:", data);

    // Sync form changes to parent
    useEffect(() => {
        const subscription = watch((value) => {
            updateData(value);
        });
        return () => subscription.unsubscribe();
    }, [watch, updateData]);

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "list",
        "bullet",
        "link",
    ];

    const getCsrfToken = () => {
        if (typeof document === "undefined") return "";
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute("content") : "";
    };

    const onSubmit = async (formData) => {
        const toastId = toast.loading(
            companyId ? "Updating company..." : "Creating company..."
        );

        try {
            const apiData = {
                company_name: formData.companyName,
                full_name: formData.fullName,
                designation: formData.designation,
                phone_no: formData.phone,
                email: formData.email,
                address: formData.address,
                responsible_person: formData.responsiblePerson,
                our_team: formData.ourTeam,
                client_member: formData.client_member,
                comment: formData.comment,
            };

            let result;
            let finalCompanyId = companyId;

            if (companyId) {
                result = await axios.put(
                    route("ourcompany.update", { id: companyId }),
                    apiData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": getCsrfToken(),
                        },
                    }
                );
            } else {
                result = await axios.post(
                    route("ourcompany.store"),
                    apiData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": getCsrfToken(),
                        },
                    }
                );
                finalCompanyId = result.data.company_id;
            }

            // Update parent with the complete data including ID
            updateData({ 
                ...formData, 
                id: finalCompanyId 
            }, finalCompanyId);

            toast.success(
                companyId 
                    ? "Company updated successfully" 
                    : "Company created successfully",
                { id: toastId }
            );

            nextStep();
        } catch (error) {
            console.error("Error saving company:", error);
            
            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                
                // Map backend field names to frontend field names
                const fieldMapping = {
                    company_name: "companyName",
                    full_name: "fullName",
                    phone_no: "phone",
                    responsible_person: "responsiblePerson",
                    client_member: "client_member",
                    our_team: "ourTeam",
                    email: "email",
                    // Add other mappings as needed
                };

                Object.keys(apiErrors).forEach((key) => {
                    const frontendField = fieldMapping[key] || key;
                    setError(frontendField, {
                        type: "server",
                        message: apiErrors[key][0],
                    });
                });

                toast.error("Please fix the form errors", { id: toastId });
            } else {
                toast.error(
                    error.response?.data?.message || 
                    "Failed to save company data. Please try again.",
                    { id: toastId }
                );
            }
        }
    };

    const inputClass = (name) =>
        `w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 ${
            errors[name] ? "border-red-500" : "border-gray-300"
        }`;

    return (
        <div className="max-w-7xl mx-auto w-full">
            <div className="bg-white p-6 rounded-lg shadow border">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Company Name - Required */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Company Name *
                            </label>
                            <input
                                {...register("companyName", {
                                    required: "Company name is required",
                                })}
                                className={inputClass("companyName")}
                                placeholder="Enter company name"
                            />
                            {errors.companyName && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errors.companyName.message}
                                </p>
                            )}
                        </div>

                        {/* Full Name - Required */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Client Full Name *
                            </label>
                            <input
                                {...register("fullName", {
                                    required: "Full name is required",
                                })}
                                className={inputClass("fullName")}
                                placeholder="Enter client full name"
                            />
                            {errors.fullName && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        {/* Designation - Optional */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Designation
                            </label>
                            <input
                                {...register("designation")}
                                className={inputClass("designation")}
                                placeholder="Enter designation"
                            />
                        </div>

                        {/* Phone - Required */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Phone *
                            </label>
                            <input
                                {...register("phone", {
                                    required: "Phone is required",
                                })}
                                className={inputClass("phone")}
                                placeholder="Enter phone number"
                            />
                            {errors.phone && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Email - Required */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Please enter a valid email address",
                                    },
                                })}
                                className={inputClass("email")}
                                placeholder="Enter email address"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Address - Optional */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Address
                            </label>
                            <input
                                {...register("address")}
                                className={inputClass("address")}
                                placeholder="Enter company address"
                            />
                        </div>

                        {/* Responsible Person - Optional */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Responsible Person
                            </label>
                            <input
                                {...register("responsiblePerson")}
                                className={inputClass("responsiblePerson")}
                                placeholder="Enter responsible person"
                            />
                        </div>

                        {/* Our Team & Client Member Section */}
                        <div className="sm:col-span-2">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Meeting With ...
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Our Team - Required */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Our Team *
                                    </label>
                                    <input
                                        {...register("ourTeam", {
                                            required: "Our team is required",
                                        })}
                                        className={inputClass("ourTeam")}
                                        placeholder="Enter our team members"
                                    />
                                    {errors.ourTeam && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.ourTeam.message}
                                        </p>
                                    )}
                                </div>

                                {/* Client Member - Required */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Client Member *
                                    </label>
                                    <input
                                        {...register("client_member", {
                                            required: "Client member is required",
                                        })}
                                        className={inputClass("client_member")}
                                        placeholder="Enter client members"
                                    />
                                    {errors.client_member && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.client_member.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Comment - Optional */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Comment
                            </label>
                            <Controller
                                name="comment"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                        theme="snow"
                                        modules={quillModules}
                                        formats={quillFormats}
                                        className="h-32 [&_.ql-editor]:min-h-[100px]"
                                        placeholder="Enter any additional comments or notes..."
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 mt-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                        >
                            {isSubmitting
                                ? companyId
                                    ? "Updating..."
                                    : "Creating..."
                                : "Next"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCreateCompany;