// import Checkbox from '@/Components/Checkbox';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
// import GuestLayout from '@/Layouts/GuestLayout';
// import { Head, Link, useForm } from '@inertiajs/react';

// export default function Login({ status, canResetPassword }) {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (
//         <GuestLayout>
//             <Head title="Log in" />

//             {status && (
//                 <div className="mb-4 text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}

//             <form onSubmit={submit}>
//                 <div>
//                     <InputLabel htmlFor="email" value="Email" />

//                     <TextInput
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={data.email}
//                         className="mt-1 block w-full"
//                         autoComplete="username"
//                         isFocused={true}
//                         onChange={(e) => setData('email', e.target.value)}
//                     />

//                     <InputError message={errors.email} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="password" value="Password" />

//                     <TextInput
//                         id="password"
//                         type="password"
//                         name="password"
//                         value={data.password}
//                         className="mt-1 block w-full"
//                         autoComplete="current-password"
//                         onChange={(e) => setData('password', e.target.value)}
//                     />

//                     <InputError message={errors.password} className="mt-2" />
//                 </div>

//                 <div className="mt-4 block">
//                     <label className="flex items-center">
//                         <Checkbox
//                             name="remember"
//                             checked={data.remember}
//                             onChange={(e) =>
//                                 setData('remember', e.target.checked)
//                             }
//                         />
//                         <span className="ms-2 text-sm text-gray-600">
//                             Remember me
//                         </span>
//                     </label>
//                 </div>

//                 <div className="mt-4 flex items-center justify-end">
//                     {canResetPassword && (
//                         <Link
//                             href={route('password.request')}
//                             className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         >
//                             Forgot your password?
//                         </Link>
//                     )}

//                     <PrimaryButton className="ms-4" disabled={processing}>
//                         Log in
//                     </PrimaryButton>
//                 </div>
//             </form>
//         </GuestLayout>
//     );
// }

import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="bg-white rounded-3xl shadow-xl py-4">
                    <div className="w-full max-w-md px-6 ">
                        {/* Logo/Brand  */}
                        <div className="text-center ">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4">
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Welcome back
                            </h1>
                            <p className="text-slate-500 mt-2">
                                Sign in to your CRM account
                            </p>
                        </div>

                        {/* Login Form */}
                        <div className=" shadow-slate-200/50 p-8">
                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-600 text-center">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit}>
                                <div className="space-y-5">
                                    {/* Email Input */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Email address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="you@company.com"
                                                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                                autoComplete="username"
                                                required
                                                autoFocus
                                            />
                                        </div>
                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter your password"
                                                className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                                autoComplete="current-password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError
                                            message={errors.password}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing
                                            ? "Signing in..."
                                            : "Sign in"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
