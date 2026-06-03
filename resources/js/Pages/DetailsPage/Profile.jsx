// import React, { useState } from "react";
// import { Save, User, Camera, Mail, Lock, Eye, EyeOff } from "lucide-react";
// import { usePage } from "@inertiajs/react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";

// const Profile = () => {
//     const { auth } = usePage().props;
//     const currentUser = auth.user;

//     const [isSaving, setIsSaving] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [successMessage, setSuccessMessage] = useState("");

//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         reset,
//         watch,
//         setError,
//         clearErrors,
//         setValue,
//     } = useForm({
//         defaultValues: {
//             name: currentUser.name || "",
//             email: currentUser.email || "",
//             contact: currentUser.contact || "",
//             password: "",
//             password_confirmation: "",
//             image: null,
//         },
//     });

//     const watchPassword = watch("password");
//     const watchConfirmPassword = watch("password_confirmation");

//     React.useEffect(() => {
//         if (watchConfirmPassword && watchPassword !== watchConfirmPassword) {
//             setError("password_confirmation", {
//                 type: "manual",
//                 message: "Passwords do not match",
//             });
//         } else {
//             clearErrors("password_confirmation");
//         }
//     }, [watchPassword, watchConfirmPassword]);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         if (file.size > 2 * 1024 * 1024) {
//             setError("image", { type: "manual", message: "Image size must be less than 2MB" });
//             return;
//         }

//         setValue("image", file);
//         const reader = new FileReader();
//         reader.onloadend = () => setImagePreview(reader.result);
//         reader.readAsDataURL(file);
//         clearErrors("image");
//     };

//     const handleFormSubmit = async (data) => {
//         if (data.password || data.password_confirmation) {
//             if (data.password !== data.password_confirmation) {
//                 setError("password_confirmation", {
//                     type: "manual",
//                     message: "Passwords do not match",
//                 });
//                 return;
//             }
//         }

//         setIsSaving(true);
//         setSuccessMessage("");

//         const formData = new FormData();
//         formData.append("_method", "PUT");
//         formData.append("role", currentUser.role);

//         if (data.name)    formData.append("name", data.name);
//         if (data.email)   formData.append("email", data.email);
//         if (data.contact) formData.append("contact", data.contact);
//         if (data.password) formData.append("password", data.password);
//         if (data.image instanceof File) formData.append("image", data.image);

//         try {
//             await axios.post(
//                 route("ourusers.update", { id: currentUser.id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );

//             setSuccessMessage("Profile updated successfully!");
//             setValue("password", "");
//             setValue("password_confirmation", "");
//             setTimeout(() => setSuccessMessage(""), 4000);
//         } catch (error) {
//             if (error.response?.data?.errors) {
//                 Object.entries(error.response.data.errors).forEach(([key, messages]) => {
//                     setError(key, { type: "manual", message: messages[0] });
//                 });
//             }
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     const handleCancel = () => {
//         reset({
//             name: currentUser.name || "",
//             email: currentUser.email || "",
//             contact: currentUser.contact || "",
//             password: "",
//             password_confirmation: "",
//             image: null,
//         });
//         setImagePreview(null);
//         clearErrors();
//         setSuccessMessage("");
//     };

//     return (
//         <AdminWrapper>
//             <div className="p-6">
//                 <div className="">
//                     {/* Page Header */}
//                     <div className="mb-8">
//                         <h1 className="text-3xl font-bold text-gray-900 mb-1">Account Settings</h1>
//                         <p className="text-gray-500">Manage your profile and security settings</p>
//                     </div>

//                     <form onSubmit={handleSubmit(handleFormSubmit)}>
//                         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

//                             {/* Profile Banner */}
//                             <div
//                                 className="relative px-8 py-12 bg-cover bg-center"
//                                 style={{
//                                     backgroundImage:
//                                         "url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
//                                 }}
//                             >
//                                 <div className="absolute inset-0 bg-black bg-opacity-40" />
//                                 <div className="relative z-10 flex flex-col items-center">
//                                     <div className="relative">
//                                         <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
//                                             <img
//                                                 src={
//                                                     imagePreview
//                                                         ? imagePreview
//                                                         : currentUser.image
//                                                         ? `${imgurl}/${currentUser.image}`
//                                                         : "/user/user01.png"
//                                                 }
//                                                 alt={currentUser.name}
//                                                 className="w-full h-full object-cover"
//                                             />
//                                         </div>
//                                         <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
//                                             <Camera size={16} className="text-gray-700" />
//                                             <input
//                                                 type="file"
//                                                 accept="image/jpg,image/jpeg,image/png"
//                                                 onChange={handleImageChange}
//                                                 className="hidden"
//                                             />
//                                         </label>
//                                     </div>
//                                     <p className="text-white text-sm mt-3">Click the camera icon to change photo</p>
//                                     <p className="text-blue-100 text-xs mt-1">JPG or PNG · Max 2 MB</p>
//                                     {errors.image && (
//                                         <p className="text-red-300 text-sm mt-1">{errors.image.message}</p>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="p-8 space-y-10">
//                                 {/* Success Banner */}
//                                 {successMessage && (
//                                     <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
//                                         {successMessage}
//                                     </div>
//                                 )}

//                                 {/* ── Personal Information ── */}
//                                 <div className="space-y-5">
//                                     <div className="flex items-center gap-2">
//                                         <User className="text-blue-600" size={22} />
//                                         <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
//                                     </div>

//                                     {/* Name */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                             Full Name <span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             {...register("name", {
//                                                 required: "Name is required",
//                                                 minLength: { value: 2, message: "Name must be at least 2 characters" },
//                                             })}
//                                             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
//                                                 errors.name ? "border-red-400" : "border-gray-300"
//                                             }`}
//                                             placeholder="Enter your full name"
//                                         />
//                                         {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
//                                     </div>

//                                     {/* Email */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                             Email Address <span className="text-red-500">*</span>
//                                         </label>
//                                         <div className="relative">
//                                             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                                             <input
//                                                 type="email"
//                                                 {...register("email", {
//                                                     required: "Email is required",
//                                                     pattern: {
//                                                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                                                         message: "Invalid email address",
//                                                     },
//                                                 })}
//                                                 className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
//                                                     errors.email ? "border-red-400" : "border-gray-300"
//                                                 }`}
//                                                 placeholder="your.email@example.com"
//                                             />
//                                         </div>
//                                         {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//                                     </div>

//                                     {/* Contact */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact</label>
//                                         <input
//                                             type="text"
//                                             {...register("contact", {
//                                                 maxLength: { value: 20, message: "Contact must be 20 characters or less" },
//                                             })}
//                                             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
//                                                 errors.contact ? "border-red-400" : "border-gray-300"
//                                             }`}
//                                             placeholder="Enter your contact number"
//                                         />
//                                         {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
//                                     </div>

//                                     {/* Role — read-only */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
//                                         <input
//                                             type="text"
//                                             value={currentUser.role || ""}
//                                             disabled
//                                             className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
//                                         />
//                                         <p className="text-gray-400 text-xs mt-1">Role cannot be changed</p>
//                                     </div>
//                                 </div>

//                                 {/* Divider */}
//                                 <div className="border-t border-gray-200" />

//                                 {/* ── Change Password ── */}
//                                 <div className="space-y-5">
//                                     <div className="flex items-center gap-2">
//                                         <Lock className="text-blue-600" size={22} />
//                                         <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
//                                     </div>

//                                     <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
//                                         Leave these fields empty if you don't want to change your password.
//                                     </div>

//                                     {/* New Password */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
//                                         <div className="relative">
//                                             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                                             <input
//                                                 type={showPassword ? "text" : "password"}
//                                                 {...register("password", {
//                                                     minLength: { value: 6, message: "Password must be at least 6 characters" },
//                                                 })}
//                                                 className={`w-full pl-10 pr-11 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
//                                                     errors.password ? "border-red-400" : "border-gray-300"
//                                                 }`}
//                                                 placeholder="New password (min. 6 characters)"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => setShowPassword(!showPassword)}
//                                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                             >
//                                                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                             </button>
//                                         </div>
//                                         {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
//                                     </div>

//                                     {/* Confirm Password */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
//                                         <div className="relative">
//                                             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                                             <input
//                                                 type={showConfirmPassword ? "text" : "password"}
//                                                 {...register("password_confirmation")}
//                                                 className={`w-full pl-10 pr-11 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
//                                                     errors.password_confirmation ? "border-red-400" : "border-gray-300"
//                                                 }`}
//                                                 placeholder="Confirm new password"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                             >
//                                                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                             </button>
//                                         </div>
//                                         {errors.password_confirmation && (
//                                             <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Action Buttons */}
//                                 <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
//                                     <button
//                                         type="button"
//                                         onClick={handleCancel}
//                                         className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         disabled={isSaving}
//                                         className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md"
//                                     >
//                                         <Save size={18} />
//                                         {isSaving ? "Saving..." : "Save Changes"}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </AdminWrapper>
//     );
// };

// export default Profile;

import React, { useState } from "react";
import {
    Save,
    User,
    Camera,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Phone,
    Shield,
} from "lucide-react";
import { Head, usePage } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";

/* ─── Reusable field input ─────────────────────────────────────────────────── */
// forwardRef is required so react-hook-form's register() can attach its ref
// and correctly read defaultValues / control the input value.
const FieldInput = React.forwardRef(
    ({ hasError, hasLeftIcon, hasRightIcon, ...props }, ref) => (
        <input
            ref={ref}
            {...props}
            className={[
                "w-full py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400",
                "outline-none transition-all duration-150",
                "focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-black/5",
                hasLeftIcon ? "pl-9" : "pl-3.5",
                hasRightIcon ? "pr-10" : "pr-3.5",
                hasError
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200",
            ].join(" ")}
        />
    ),
);

/* ─── Component ────────────────────────────────────────────────────────────── */
const Profile = () => {
    const { auth } = usePage().props;
    const currentUser = auth.user;

    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
        clearErrors,
        setValue,
    } = useForm({
        defaultValues: {
            name: currentUser.name || "",
            email: currentUser.email || "",
            contact: currentUser.contact || "",
            password: "",
            password_confirmation: "",
            image: null,
        },
    });

    const watchPassword = watch("password");
    const watchConfirmPassword = watch("password_confirmation");

    React.useEffect(() => {
        if (watchConfirmPassword && watchPassword !== watchConfirmPassword) {
            setError("password_confirmation", {
                type: "manual",
                message: "Passwords do not match",
            });
        } else {
            clearErrors("password_confirmation");
        }
    }, [watchPassword, watchConfirmPassword]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            setError("image", {
                type: "manual",
                message: "Image must be under 2MB",
            });
            return;
        }
        setValue("image", file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        clearErrors("image");
    };

    const handleFormSubmit = async (data) => {
        if (data.password || data.password_confirmation) {
            if (data.password !== data.password_confirmation) {
                setError("password_confirmation", {
                    type: "manual",
                    message: "Passwords do not match",
                });
                return;
            }
        }
        setIsSaving(true);
        setSuccessMessage("");
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("role", currentUser.role);
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.contact) formData.append("contact", data.contact);
        if (data.password) formData.append("password", data.password);
        if (data.image instanceof File) formData.append("image", data.image);
        try {
            await axios.post(
                route("ourusers.update", { id: currentUser.id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setSuccessMessage("Changes saved successfully.");
            setValue("password", "");
            setValue("password_confirmation", "");
            setTimeout(() => setSuccessMessage(""), 4000);
        } catch (error) {
            if (error.response?.data?.errors) {
                Object.entries(error.response.data.errors).forEach(
                    ([key, messages]) => {
                        setError(key, { type: "manual", message: messages[0] });
                    },
                );
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        reset({
            name: currentUser.name || "",
            email: currentUser.email || "",
            contact: currentUser.contact || "",
            password: "",
            password_confirmation: "",
            image: null,
        });
        setImagePreview(null);
        clearErrors();
        setSuccessMessage("");
    };

    const initials = currentUser.name
        ? currentUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U";

    return (
        <AdminWrapper>
            <Head title="Profile" />
            <div className="min-h-screen">
                    {/* Page header */}
                    <div className="mb-8">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">
                            Settings
                        </p>
                        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                            Your Profile
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        {/* ── Avatar card ─────────────────────────────────── */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-3 flex items-center gap-5">
                            <div className="relative flex-shrink-0">
                                <div className="w-[68px] h-[68px] rounded-[14px] overflow-hidden border border-gray-100 bg-gradient-to-br from-gray-100 to-gray-200">
                                    {imagePreview || currentUser.image ? (
                                        <img
                                            src={
                                                imagePreview ||
                                                `${imgurl}/${currentUser.image}`
                                            }
                                            alt={currentUser.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg font-semibold">
                                            {initials}
                                        </div>
                                    )}
                                </div>

                                {/* Camera button */}
                                <label className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-gray-900 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                                    <Camera size={12} className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/jpg,image/jpeg,image/png"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-semibold text-gray-900 truncate">
                                    {currentUser.name}
                                </p>
                                <p className="text-sm text-gray-400 truncate mt-0.5">
                                    {currentUser.email}
                                </p>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gray-100 rounded-full">
                                    <Shield
                                        size={11}
                                        className="text-gray-500"
                                    />
                                    <span className="text-[11px] text-gray-500 font-medium capitalize">
                                        {currentUser.role}
                                    </span>
                                </div>
                            </div>

                            {errors.image && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.image.message}
                                </p>
                            )}
                        </div>

                        {/* ── Success bar ──────────────────────────────────── */}
                        {successMessage && (
                            <div className="mb-3 flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 animate-[slideDown_0.3s_ease]">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {successMessage}
                            </div>
                        )}

                        {/* ── Personal information card ─────────────────── */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-3">
                            {/* Section header */}
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 shrink-0 mt-px" />
                                <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-900">
                                    Personal Information
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                                        Full name
                                    </label>
                                    <div className="relative">
                                        <User
                                            size={15}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                        <FieldInput
                                            type="text"
                                            hasLeftIcon
                                            hasError={!!errors.name}
                                            placeholder="Your full name"
                                            {...register("name", {
                                                required: "Name is required",
                                                minLength: {
                                                    value: 2,
                                                    message:
                                                        "At least 2 characters",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            size={15}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                        <FieldInput
                                            type="email"
                                            hasLeftIcon
                                            hasError={!!errors.email}
                                            placeholder="you@example.com"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message:
                                                        "Invalid email address",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Contact */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                                        Contact number
                                    </label>
                                    <div className="relative">
                                        <Phone
                                            size={15}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                        <FieldInput
                                            type="text"
                                            hasLeftIcon
                                            hasError={!!errors.contact}
                                            placeholder="+977 98XXXXXXXX"
                                            {...register("contact", {
                                                maxLength: {
                                                    value: 20,
                                                    message:
                                                        "Max 20 characters",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.contact && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.contact.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── Password card ──────────────────────────────── */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                            <div className="flex items-center gap-2.5 mb-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 shrink-0 mt-px" />
                                <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-900">
                                    Change Password
                                </h2>
                            </div>
                            <p className="text-[11px] text-gray-400 mb-5 ml-4">
                                Leave empty to keep your current password
                            </p>

                            <div className="space-y-4">
                                {/* New password */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                                        New password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            size={15}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                        <FieldInput
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            hasLeftIcon
                                            hasRightIcon
                                            hasError={!!errors.password}
                                            placeholder="New password"
                                            {...register("password", {
                                                minLength: {
                                                    value: 6,
                                                    message:
                                                        "Minimum 6 characters",
                                                },
                                            })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={15} />
                                            ) : (
                                                <Eye size={15} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm password */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                                        Confirm password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            size={15}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                        <FieldInput
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            hasLeftIcon
                                            hasRightIcon
                                            hasError={
                                                !!errors.password_confirmation
                                            }
                                            placeholder="Confirm new password"
                                            {...register(
                                                "password_confirmation",
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={15} />
                                            ) : (
                                                <Eye size={15} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors.password_confirmation
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── Action buttons ─────────────────────────────── */}
                        <div className="flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-800 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="relative overflow-hidden flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                <Save size={15} />
                                {isSaving ? "Saving…" : "Save changes"}
                            </button>
                        </div>
                    </form>
              
            </div>
        </AdminWrapper>
    );
};

export default Profile;
