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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";

/* ─── Reusable field input ─────────────────────────────────────────────────── */
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
            toast.success("Profile updated successfully.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setValue("password", "");
            setValue("password_confirmation", "");
        } catch (error) {
            if (error.response?.data?.errors) {
                Object.entries(error.response.data.errors).forEach(
                    ([key, messages]) => {
                        setError(key, { type: "manual", message: messages[0] });
                    },
                );
                toast.error("Please fix the errors and try again.", {
                    position: "top-right",
                    autoClose: 4000,
                });
            } else {
                toast.error("Something went wrong. Please try again.", {
                    position: "top-right",
                    autoClose: 4000,
                });
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

            {/* ── Toast container ──────────────────────────────────── */}
            <ToastContainer />

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
                                <Shield size={11} className="text-gray-500" />
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

                    {/* ── Personal information card ─────────────────── */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-3">
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
                                                message: "At least 2 characters",
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
                                                message: "Invalid email address",
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
                                                message: "Max 20 characters",
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
                                        type={showPassword ? "text" : "password"}
                                        hasLeftIcon
                                        hasRightIcon
                                        hasError={!!errors.password}
                                        placeholder="New password"
                                        {...register("password", {
                                            minLength: {
                                                value: 6,
                                                message: "Minimum 6 characters",
                                            },
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
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
                                        type={showConfirmPassword ? "text" : "password"}
                                        hasLeftIcon
                                        hasRightIcon
                                        hasError={!!errors.password_confirmation}
                                        placeholder="Confirm new password"
                                        {...register("password_confirmation")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.password_confirmation.message}
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
