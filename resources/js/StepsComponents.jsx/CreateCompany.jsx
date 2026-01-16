import React from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const CreateCompany = ({ data, updateData, nextStep }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        defaultValues: {
            companyName: data.companyName || "",
            fullName: data.fullName || "",
            designation: data.designation || "",
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            responsiblePerson: data.responsiblePerson || "",
            ourTeam: data.ourTeam || "",
            client_member: data.client_member || "",
            comment: data.comment || "",
        },
    });

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

    const storeCompany = async (payload) => {
        const response = await axios.post(
            route("ourcompany.store"),
            payload,
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    };

    const updateCompany = async (payload, id) => {
        const response = await axios.put(
            route("ourcompany.update", { id }),
            payload,
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    };

    // console.log("CreateCompany received data:", data);

    const onSubmit = async (formData) => {
        const toastId = toast.loading(
            data.id ? "Updating company..." : "Creating company..."
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

            let result, companyId;

            if (data.id) {
                result = await updateCompany(apiData, data.id);
                companyId = data.id;
            } else {
                result = await storeCompany(apiData);
                companyId = result.company_id;
            }

            updateData({ ...formData, id: companyId }, companyId);

            toast.success(
                data.id
                    ? "Company updated successfully"
                    : "Company created successfully",
                { id: toastId }
            );

            nextStep();
        } catch (error) {
            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;

                Object.keys(apiErrors).forEach((key) => {
                    const map = {
                        company_name: "companyName",
                        full_name: "fullName",
                        phone_no: "phone",
                        responsible_person: "responsiblePerson",
                        client_member: "client_member",
                        our_team: "ourTeam",
                    };

                    setError(map[key] || key, {
                        type: "server",
                        message: apiErrors[key][0],
                    });
                });

                toast.error("Please fix the form errors", { id: toastId });
            } else {
                toast.error("Something went wrong", { id: toastId });
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
                        {/* Company Name - Required  */}
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
                                <p className="text-xs text-red-600">
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
                                <p className="text-xs text-red-600">
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
                                <p className="text-xs text-red-600">
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
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                                className={inputClass("email")}
                                placeholder="Enter email address"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-600">
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
                                        <p className="text-xs text-red-600">
                                            {errors.ourTeam.message}
                                        </p>
                                    )}
                                </div>

                                {/* Client Member  - Required */}
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
                                        <p className="text-xs text-red-600">
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
                                        {...field}
                                        theme="snow"
                                        modules={quillModules}
                                        formats={quillFormats}
                                        className="h-32"
                                        placeholder="Enter any additional comments or notes..."
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-16 md:pt-8">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                        >
                            {isSubmitting
                                ? data.id
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

export default CreateCompany;



// import React from "react";
// import { useForm, Controller } from "react-hook-form";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import toast from "react-hot-toast";

// const CreateCompany = ({ data, updateData, nextStep }) => {
//     const {
//         register,
//         handleSubmit,
//         control,
//         watch,
//         formState: { errors, isSubmitting },
//         setError,
//     } = useForm({
//         defaultValues: {
//             companyName: data.companyName || "",
//             firstName: data.firstName || "",
//             lastName: data.lastName || "",
//             client_member: data.client_member || "",
//             designation: data.designation || "",
//             noOfRooms: data.noOfRooms || "",
//             phone: data.phone || "",
//             email: data.email || "",
//             address: data.address || "",
//             website: data.website || "",
//             source: data.source || "",
//             responsiblePerson: data.responsiblePerson || "",
//             comment: data.comment || "",
//             messenger: data.messenger || "",
//             messengerContact: data.messengerContact || "",
//         }
//     });

//     const watchedMessenger = watch("messenger");

//     const quillModules = {
//         toolbar: [
//             [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//             [{ 'font': [] }],
//             ['bold', 'italic', 'underline', 'strike'],
//             [{ 'color': [] }, { 'background': [] }],
//             [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//             [{ 'align': [] }],
//             ['link', 'image'],
//             ['blockquote', 'code-block'],
//             ['clean']
//         ],
//     };

//     const quillFormats = [
//         'header', 'font', 'size',
//         'bold', 'italic', 'underline', 'strike',
//         'color', 'background',
//         'list', 'bullet',
//         'align',
//         'link', 'image',
//         'blockquote', 'code-block'
//     ];

//     const storeCompany = async (formData) => {
//         try {
//             const response = await axios.post(route("ourcompany.store"), formData, {
//                 headers: { "Content-Type": "application/json" },
//             });
//             return response.data;
//         } catch (error) {
//             console.log("Error creating company", error);
//             throw error;
//         }
//     };

//     const updateCompany = async (formData, id) => {
//         try {
//             const response = await axios.put(
//                 route("ourcompany.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "application/json" } }
//             );
//             return response.data;
//         } catch (error) {
//             console.log("Error updating company", error);
//             throw error;
//         }
//     };

//     const onSubmit = async (formData) => {
//         const toastId = toast.loading(
//             data.id ? "Updating company..." : "Creating company..."
//         );

//         try {
//             const apiData = {
//                 company_name: formData.companyName,
//                 first_name: formData.firstName,
//                 last_name: formData.lastName,
//                 client_member: formData.client_member,
//                 designation: formData.designation,
//                 no_of_rooms: formData.noOfRooms,
//                 phone_no: formData.phone,
//                 email: formData.email,
//                 address: formData.address,
//                 website: formData.website,
//                 source: formData.source,
//                 responsible_person: formData.responsiblePerson,
//                 preffered_message: formData.messenger,
//                 message_contact: formData.messengerContact,
//                 comment: formData.comment,
//             };

//             let result, companyId;

//             if (data.id) {
//                 result = await updateCompany(apiData, data.id);
//                 companyId = data.id;
//             } else {
//                 result = await storeCompany(apiData);
//                 companyId = result.company_id || result.id;
//                 if (!companyId) {
//                     throw new Error("Company ID not returned from API");
//                 }
//             }

//             updateData({ ...formData, id: companyId }, companyId);

//             toast.success(
//                 data.id ? "Company updated successfully!" : "Company created successfully!",
//                 { id: toastId }
//             );
//             nextStep();
            
//         } catch (error) {
//             console.log("Error processing company", error);
            
//             if (error.response?.data?.errors) {
//                 const apiErrors = error.response.data.errors;
//                 Object.keys(apiErrors).forEach(key => {
//                     switch(key) {
//                         case 'company_name': setError('companyName', { type: 'server', message: apiErrors[key][0] }); break;
//                         case 'first_name': setError('firstName', { type: 'server', message: apiErrors[key][0] }); break;
//                         case 'last_name': setError('lastName', { type: 'server', message: apiErrors[key][0] }); break;
//                         case 'phone_no': setError('phone', { type: 'server', message: apiErrors[key][0] }); break;
//                         case 'preffered_message': setError('messenger', { type: 'server', message: apiErrors[key][0] }); break;
//                         case 'message_contact': setError('messengerContact', { type: 'server', message: apiErrors[key][0] }); break;
//                         case 'responsible_person': setError('responsiblePerson', { type: 'server', message: apiErrors[key][0] }); break;
//                         default: setError(key, { type: 'server', message: apiErrors[key][0] });
//                     }
//                 });
//                 toast.error("Please fix the form errors below", { id: toastId });
//             } else {
//                 toast.error(
//                     `Error ${data.id ? 'updating' : 'creating'} company. Please try again.`,
//                     { id: toastId }
//                 );
//             }
//         }
//     };

//     const getInputClassName = (fieldName) => {
//         const baseClass = "w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm";
//         return errors[fieldName] 
//             ? `${baseClass} border-red-500 focus:ring-red-500 focus:border-red-500` 
//             : baseClass;
//     };

//     return (
//         <div className="max-w-7xl mx-auto w-full ">
//             <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                         {/* Company Name */}
//                         <div className="sm:col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Company Name *
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("companyName", {
//                                     required: "Company name is required",
//                                 })}
//                                 className={getInputClassName('companyName')}
//                                 placeholder="Enter company name"
//                             />
//                             {errors.companyName && (
//                                 <p className="mt-1 text-xs text-red-600">{errors.companyName.message}</p>
//                             )}
//                         </div>

//                         {/* First Name */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                               Client First Name *
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("firstName", {
//                                     required: "First name is required",
//                                 })}
//                                 className={getInputClassName('firstName')}
//                                 placeholder="Enter first name"
//                             />
//                             {errors.firstName && (
//                                 <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
//                             )}
//                         </div>

//                         {/* Last Name */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                               Client Last Name *
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("lastName", {
//                                     required: "Last name is required",
//                                 })}
//                                 className={getInputClassName('lastName')}
//                                 placeholder="Enter last name"
//                             />
//                             {errors.lastName && (
//                                 <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
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
//                                 className={getInputClassName('client_member')}
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
//                                 className={getInputClassName('designation')}
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
//                                     min: { value: 0, message: "Number of rooms cannot be negative" }
//                                 })}
//                                 min="0"
//                                 className={getInputClassName('noOfRooms')}
//                                 placeholder="Enter number of rooms"
//                             />
//                             {errors.noOfRooms && (
//                                 <p className="mt-1 text-xs text-red-600">{errors.noOfRooms.message}</p>
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
//                                         message: "Please enter a valid phone number"
//                                     }
//                                 })}
//                                 className={getInputClassName('phone')}
//                                 placeholder="Enter phone number"
//                             />
//                             {errors.phone && (
//                                 <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
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
//                                         message: "Please enter a valid email address"
//                                     }
//                                 })}
//                                 className={getInputClassName('email')}
//                                 placeholder="Enter email address"
//                             />
//                             {errors.email && (
//                                 <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
//                             )}
//                         </div>

//                         {/* Address */}
//                         <div className="sm:col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Address
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("address")}
//                                 className={getInputClassName('address')}
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
//                                         message: "Please enter a valid website URL"
//                                     }
//                                 })}
//                                 className={getInputClassName('website')}
//                                 placeholder="https://example.com"
//                             />
//                             {errors.website && (
//                                 <p className="mt-1 text-xs text-red-600">{errors.website.message}</p>
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
//                                 className={getInputClassName('source')}
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
//                                 className={getInputClassName('responsiblePerson')}
//                                 placeholder="Enter responsible person"
//                             />
//                         </div>

//                         {/* Messenger */}
//                         <div className="sm:col-span-2">
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                         Preferred Contact
//                                     </label>
//                                     <select
//                                         {...register("messenger")}
//                                         className={getInputClassName('messenger')}
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
//                                             required: watchedMessenger ? "Messenger contact is required when messenger is selected" : false
//                                         })}
//                                         className={getInputClassName('messengerContact')}
//                                         placeholder={
//                                             watchedMessenger
//                                                 ? `Enter ${watchedMessenger} contact`
//                                                 : "Enter contact"
//                                         }
//                                     />
//                                     {errors.messengerContact && (
//                                         <p className="mt-1 text-xs text-red-600">{errors.messengerContact.message}</p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Comment */}
//                         <div className="sm:col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Comment
//                             </label>
//                             <Controller
//                                 name="comment"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <ReactQuill
//                                         {...field}
//                                         theme="snow"
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         placeholder="Enter any additional comments or notes..."
//                                         className="h-32 sm:h-40"
//                                         onChange={(content) => field.onChange(content)}
//                                     />
//                                 )}
//                             />
//                         </div>
//                     </div>

//                     {/* Submit Button */}
//                     <div className=" mt-8 flex justify-end pt-32 md:pt-14 lg:pt-8">
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {isSubmitting 
//                                 ? data.id 
//                                     ? "Updating Company..." 
//                                     : "Creating Company..."
//                                 : "Next"
//                             }
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreateCompany;


