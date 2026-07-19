import {
    Check,
    Copy,
    Eye,
    EyeOff,
    LockKeyhole,
    X,
    Calendar,
    User,
    Tag,
    FileText,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const PasswordPopup = ({ showPopup, setShowPopup, password }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordCopied, setPasswordCopied] = useState(false);
    const [usernameCopied, setUsernameCopied] = useState(false);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    useEffect(() => {
        if (showPopup) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showPopup]);

    if (!showPopup || !password) return null;

    const maskedPassword = "•".repeat(Math.min((password.password ?? "").length, 12));

    const handleCopyPassword = async () => {
        if (!password.password) return;
        try {
            await navigator.clipboard.writeText(password.password);
            setPasswordCopied(true);
            window.setTimeout(() => setPasswordCopied(false), 2000);
        } catch (error) {
            console.error("Unable to copy password", error);
        }
    };

    const handleCopyUsername = async () => {
        if (!password.username) return;
        try {
            await navigator.clipboard.writeText(password.username);
            setUsernameCopied(true);
            window.setTimeout(() => setUsernameCopied(false), 2000);
        } catch (error) {
            console.error("Unable to copy username", error);
        }
    };

    const handleClose = () => {
        setShowPassword(false);
        setPasswordCopied(false);
        setUsernameCopied(false);
        setShowPopup(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                {/* ── Header ── */}
                <div className="bg-indigo-600 px-4 pt-4 pb-3.5 shrink-0">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                                <LockKeyhole size={16} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-white leading-tight">
                                    Password Details
                                </h2>
                                <p className="text-[11px] text-white/55 mt-0.5 leading-none">
                                    {password.organization?.name ?? "—"}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors shrink-0"
                            aria-label="Close"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="overflow-y-auto flex-1 px-4 py-3.5 space-y-3">

                    {/* Classification */}
                    <section>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            Classification
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                            {[
                                { label: "Category",       value: password.category?.name },
                                { label: "Sub Category",   value: password.sub_category?.name },
                                { label: "Child Category", value: password.sub_sub_category?.name },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-2"
                                >
                                    <div className="flex items-center gap-1 text-gray-400 mb-1">
                                        <Tag size={10} />
                                        <span className="text-[10px] leading-none">{label}</span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-700 truncate">
                                        {value || <span className="text-gray-300 font-normal">—</span>}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="h-px bg-gray-100" />

                    {/* ── Credentials ── */}
                    <section>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            Credentials
                        </p>

                        <div className="border border-gray-100 rounded-xl overflow-hidden">

                            {/* Section header bar */}
                            <div className="px-3.5 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                <LockKeyhole size={11} className="text-gray-400" />
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                    Login Info
                                </span>
                            </div>

                            {/* Username row */}
                            <div className="flex items-center gap-3 px-3.5 py-3 border-b border-gray-100">
                                <div className="w-7 h-7 rounded-[7px] bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                                    <User size={13} className="text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-gray-400 leading-none mb-1">
                                        Username
                                    </p>
                                    <p className="text-[13px] font-medium text-gray-800 truncate">
                                        {password.username || (
                                            <span className="text-gray-300 font-normal">—</span>
                                        )}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyUsername}
                                    disabled={!password.username}
                                    title="Copy username"
                                    aria-label="Copy username"
                                    className={`w-[26px] h-[26px] rounded-[6px] border flex items-center justify-center transition-all shrink-0 disabled:opacity-40 ${
                                        usernameCopied
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-500"
                                            : "border-gray-200 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100"
                                    }`}
                                >
                                    {usernameCopied ? <Check size={12} /> : <Copy size={12} />}
                                </button>
                            </div>

                            {/* Password row */}
                            <div className="flex items-center gap-3 px-3.5 py-3">
                                <div className="w-7 h-7 rounded-[7px] bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                    <LockKeyhole size={13} className="text-indigo-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-gray-400 leading-none mb-1">
                                        Password
                                    </p>
                                    <p className="font-mono text-[13px] font-medium text-gray-800 tracking-wider truncate">
                                        {showPassword ? password.password : maskedPassword}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        title={showPassword ? "Hide" : "Show"}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="w-[26px] h-[26px] rounded-[6px] border border-gray-200 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all"
                                    >
                                        {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCopyPassword}
                                        disabled={!password.password}
                                        title="Copy password"
                                        aria-label="Copy password"
                                        className={`w-[26px] h-[26px] rounded-[6px] border flex items-center justify-center transition-all disabled:opacity-40 ${
                                            passwordCopied
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-500"
                                                : "border-gray-200 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100"
                                        }`}
                                    >
                                        {passwordCopied ? <Check size={12} /> : <Copy size={12} />}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* Expiry */}
                    {password.expirydate && (
                        <>
                            <div className="h-px bg-gray-100" />
                            <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                    <Calendar size={13} className="text-red-500" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-red-400 uppercase tracking-wide font-bold mb-0.5">
                                        Expires
                                    </p>
                                    <p className="text-xs font-semibold text-red-700 leading-none">
                                        {password.expirydate}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Note */}
                    {password.note && (
                        <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-1 text-[10px] text-amber-600 mb-1.5 font-semibold">
                                <FileText size={10} />
                                Note
                            </div>
                            <p className="text-xs text-amber-900 leading-relaxed">
                                {password.note}
                            </p>
                        </div>
                    )}

                    {/* Image attachment */}
                    {password.image && (
                        <>
                            <div className="h-px bg-gray-100" />
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                    Attachment
                                </p>
                                <div className="rounded-xl overflow-hidden border border-gray-100">
                                    <img
                                        src={`${imgurl}/${password.image}`}
                                        alt="Password entry"
                                        className="w-full max-h-40 object-cover"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                </div>

                {/* ── Footer ── */}
                <div className="px-4 py-3 border-t border-gray-100 flex justify-end shrink-0 bg-white">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PasswordPopup;
