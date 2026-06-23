// import { useState, useRef, useCallback } from "react";

// const CATEGORIES = [
//     {
//         group: "Digital Marketing",
//         items: [
//             "Social Media Promotional Flyer",
//             "Social Media Reel",
//             "Boost",
//             "Branding (Logo, Guideline)",
//             "Content Making Shoot",
//             "Print Designs",
//             "Campaign Designs",
//             "Digital Flyer",
//             "Digital Issue / Support",
//             "QR Making",
//             "Social Media Setups",
//         ],
//     },
//     {
//         group: "Domain and Hosting",
//         items: [
//             "Domain Registration",
//             "Create Hosting",
//             "Email Creation",
//             "Email / Domain Issue / Support",
//             "Renewal and Payment",
//             "Outlook Setup",
//             "Email Signature Creation / Setup",
//         ],
//     },
//     {
//         group: "OTA",
//         items: [
//             "OTA Access – Login, Account Setup",
//             "Bookings – Reservations, Changes, Cancellations",
//             "Rates & Inventory",
//             "Payments & Billing",
//             "Property Content",
//             "Promotions & Visibility",
//             "Integrations – Channel Manager",
//             "Website Bookings",
//             "Technical Support",
//             "Disputes & Chargebacks",
//             "Google Business Profile",
//             "Tripadvisor",
//             "OTA Training",
//             "Other OTA Inquiries",
//         ],
//     },
//     {
//         group: "Photography",
//         items: ["Issue and Support", "Post Production", "Schedule a Shoot"],
//     },
//     {
//         group: "Sales and Marketing",
//         items: [
//             "Invoice",
//             "Payment and Billing",
//             "Proposal and Agreement",
//             "Quotation",
//         ],
//     },
//     {
//         group: "Videography",
//         items: ["Issue and Support", "Post Production", "Schedule a Shoot"],
//     },
//     {
//         group: "Website Development",
//         items: [
//             "Add New Feature",
//             "Content Updates / Management",
//             "Issue and Debugging",
//             "Layout / Design",
//             "System Training",
//             "System Updates / Upgrades",
//             "Technical Support",
//         ],
//     },
//     {
//         group: "Enquiry",
//         items: ["General Enquiry"],
//     },
// ];

// const PRIORITIES = [
//     { value: "High" },
//     { value: "Medium" },
//     { value: "Low" },
//     { value: "Super" },
// ];

// function ChevronDown() {
//     return (
//         <svg
//             width="14"
//             height="14"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M6 9l6 6 6-6" />
//         </svg>
//     );
// }

// function UploadIcon() {
//     return (
//         <svg
//             width="28"
//             height="28"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="text-gray-400"
//         >
//             <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
//             <path d="M12 12v9" />
//             <path d="m16 16-4-4-4 4" />
//         </svg>
//     );
// }


// function SendIcon() {
//     return (
//         <svg
//             width="16"
//             height="16"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="m22 2-7 20-4-9-9-4Z" />
//             <path d="M22 2 11 13" />
//         </svg>
//     );
// }

// function InputField({ label, id, icon, required, error, children }) {
//     return (
//         <div className="flex flex-col gap-1.5">
//             <label
//                 htmlFor={id}
//                 className="flex items-center gap-1.5 text-sm font-medium text-gray-600"
//             >
//                 {icon && <span className="text-gray-400">{icon}</span>}
//                 {label}
//                 {required && <span className="text-red-400 text-xs">*</span>}
//             </label>
//             {children}
//             {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
//         </div>
//     );
// }

// const inputCls =
//     "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 hover:border-gray-300";

// const WebTicket = () => {
//     const [form, setForm] = useState({
//         name: "",
//         email: "",
//         subject: "",
//         category: "",
//         priority: "",
//         description: "",
//     });
//     const [errors, setErrors] = useState({});
//     const [files, setFiles] = useState([]);
//     const [dragging, setDragging] = useState(false);
//     const [submitted, setSubmitted] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const fileInputRef = useRef(null);

//     const set = (key) => (e) =>
//         setForm((f) => ({ ...f, [key]: e.target.value }));

//     const addFiles = useCallback((incoming) => {
//         setFiles((prev) => {
//             const existing = new Set(prev.map((f) => f.name));
//             return [...prev, ...incoming.filter((f) => !existing.has(f.name))];
//         });
//     }, []);

//     const removeFile = (name) =>
//         setFiles((f) => f.filter((x) => x.name !== name));

//     const onDrop = (e) => {
//         e.preventDefault();
//         setDragging(false);
//         addFiles([...e.dataTransfer.files]);
//     };

//     const validate = () => {
//         const e = {};
//         if (!form.name.trim()) e.name = "Name is required";
//         if (!form.email.trim()) e.email = "Email is required";
//         else if (!/\S+@\S+\.\S+/.test(form.email))
//             e.email = "Enter a valid email";
//         if (!form.subject.trim()) e.subject = "Subject is required";
//         if (!form.category) e.category = "Please select a category";
//         if (!form.priority) e.priority = "Please select a priority";
//         if (!form.description.trim()) e.description = "Description is required";
//         setErrors(e);
//         return Object.keys(e).length === 0;
//     };

//     const handleSubmit = async () => {
//         if (!validate()) return;
//         setSubmitting(true);
//         await new Promise((r) => setTimeout(r, 900));
//         setSubmitting(false);
//         setSubmitted(true);
//     };

//     const handleReset = () => {
//         setForm({
//             name: "",
//             email: "",
//             subject: "",
//             category: "",
//             priority: "",
//             description: "",
//         });
//         setFiles([]);
//         setErrors({});
//         setSubmitted(false);
//     };

//     if (submitted) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//                 <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 max-w-md w-full text-center">
//                     <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
//                         <svg
//                             width="32"
//                             height="32"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="#10b981"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                         >
//                             <circle cx="12" cy="12" r="10" />
//                             <path d="m9 12 2 2 4-4" />
//                         </svg>
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-900 mb-2">
//                         Ticket submitted!
//                     </h2>
//                     <p className="text-sm text-gray-500 mb-1">
//                         Thanks,{" "}
//                         <span className="font-medium text-gray-700">
//                             {form.name}
//                         </span>
//                         . We'll review your ticket and get back to you at{" "}
//                         <span className="font-medium text-indigo-600">
//                             {form.email}
//                         </span>
//                         .
//                     </p>
//                     <div className="mt-6 bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm border border-gray-100">
//                         <div className="flex justify-between">
//                             <span className="text-gray-500">Category</span>
//                             <span className="text-gray-800 font-medium">
//                                 {form.category}
//                             </span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-gray-500">Priority</span>
//                             <span className="font-medium text-gray-800">
//                                 {form.priority}
//                             </span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-gray-500">Subject</span>
//                             <span className="text-gray-800 font-medium text-right max-w-[60%] truncate">
//                                 {form.subject}
//                             </span>
//                         </div>
//                     </div>
//                     <button
//                         onClick={handleReset}
//                         className="mt-6 w-full rounded-lg bg-indigo-600 text-white text-sm font-medium py-2.5 hover:bg-indigo-700 active:scale-95 transition"
//                     >
//                         Submit another ticket
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <main className="max-w-3xl mx-auto px-4 py-8">
//                 <div className="mb-6">
//                     <h1 className="text-2xl font-semibold text-gray-900">
//                         Create a ticket
//                     </h1>
//                     <p className="text-sm text-gray-500 mt-1">
//                         Fill out the form below and we'll get back to you as
//                         soon as possible.
//                     </p>
//                 </div>

//                 <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//                     {/* Section: Contact info */}
//                     <div className="px-6 pt-6 pb-5 border-b border-gray-100">
//                         <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
//                             Contact info
//                         </p>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <InputField
//                                 label="Name"
//                                 id="name"
//                                 required
//                                 error={errors.name}
//                             >
//                                 <input
//                                     id="name"
//                                     type="text"
//                                     placeholder="Your full name"
//                                     value={form.name}
//                                     onChange={set("name")}
//                                     className={
//                                         inputCls +
//                                         (errors.name
//                                             ? " border-red-300 focus:border-red-400 focus:ring-red-100"
//                                             : "")
//                                     }
//                                 />
//                             </InputField>

//                             <InputField
//                                 label="Email"
//                                 id="email"
//                                 required
//                                 error={errors.email}
//                             >
//                                 <input
//                                     id="email"
//                                     type="email"
//                                     placeholder="you@company.com"
//                                     value={form.email}
//                                     onChange={set("email")}
//                                     className={
//                                         inputCls +
//                                         (errors.email
//                                             ? " border-red-300 focus:border-red-400 focus:ring-red-100"
//                                             : "")
//                                     }
//                                 />
//                             </InputField>
//                         </div>
//                     </div>

//                     {/* Section: Ticket details */}
//                     <div className="px-6 pt-5 pb-5 border-b border-gray-100 space-y-4">
//                         <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
//                             Ticket details
//                         </p>

//                         <InputField
//                             label="Subject"
//                             id="subject"
//                             required
//                             error={errors.subject}
//                         >
//                             <input
//                                 id="subject"
//                                 type="text"
//                                 placeholder="Brief summary of your issue"
//                                 value={form.subject}
//                                 onChange={set("subject")}
//                                 className={
//                                     inputCls +
//                                     (errors.subject
//                                         ? " border-red-300 focus:border-red-400 focus:ring-red-100"
//                                         : "")
//                                 }
//                             />
//                         </InputField>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             {/* Category */}
//                             <InputField
//                                 label="Category"
//                                 id="category"
//                                 required
//                                 error={errors.category}
//                             >
//                                 <div className="relative">
//                                     <select
//                                         id="category"
//                                         value={form.category}
//                                         onChange={set("category")}
//                                         className={
//                                             inputCls +
//                                             " appearance-none pr-9 cursor-pointer " +
//                                             (errors.category
//                                                 ? "border-red-300 focus:border-red-400 focus:ring-red-100"
//                                                 : "")
//                                         }
//                                     >
//                                         <option value="" disabled>
//                                             Select a category
//                                         </option>
//                                         {CATEGORIES.map((g) => (
//                                             <optgroup
//                                                 key={g.group}
//                                                 label={g.group}
//                                             >
//                                                 {g.items.map((item) => (
//                                                     <option
//                                                         key={item}
//                                                         value={item}
//                                                     >
//                                                         {item}
//                                                     </option>
//                                                 ))}
//                                             </optgroup>
//                                         ))}
//                                     </select>
//                                     <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//                                         <ChevronDown />
//                                     </span>
//                                 </div>
//                             </InputField>

//                             {/* Priority - simplified select dropdown */}
//                             <InputField
//                                 label="Priority"
//                                 id="priority"
//                                 required
//                                 error={errors.priority}
//                             >
//                                 <div className="relative">
//                                     <select
//                                         id="priority"
//                                         value={form.priority}
//                                         onChange={(e) => {
//                                             setForm((f) => ({
//                                                 ...f,
//                                                 priority: e.target.value,
//                                             }));
//                                             if (errors.priority)
//                                                 setErrors((er) => {
//                                                     const n = { ...er };
//                                                     delete n.priority;
//                                                     return n;
//                                                 });
//                                         }}
//                                         className={[
//                                             inputCls,
//                                             "appearance-none cursor-pointer font-medium",
//                                             "pr-9",
//                                             errors.priority
//                                                 ? "border-red-300 focus:border-red-400 focus:ring-red-100"
//                                                 : "",
//                                         ].join(" ")}
//                                     >
//                                         <option value="" disabled>
//                                             Select priority
//                                         </option>
//                                         {PRIORITIES.map((p) => (
//                                             <option
//                                                 key={p.value}
//                                                 value={p.value}
//                                             >
//                                                 {p.value}
//                                             </option>
//                                         ))}
//                                     </select>

//                                     {/* Chevron */}
//                                     <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//                                         <ChevronDown />
//                                     </span>
//                                 </div>
//                             </InputField>
//                         </div>

//                         <InputField
//                             label="Description"
//                             id="description"
//                             required
//                             error={errors.description}
//                         >
//                             <textarea
//                                 id="description"
//                                 rows={5}
//                                 placeholder="Describe your issue in detail — include steps to reproduce, error messages, screenshots, or anything else that helps us understand the problem..."
//                                 value={form.description}
//                                 onChange={set("description")}
//                                 className={
//                                     inputCls +
//                                     " resize-y min-h-[120px] leading-relaxed " +
//                                     (errors.description
//                                         ? "border-red-300 focus:border-red-400 focus:ring-red-100"
//                                         : "")
//                                 }
//                             />
//                         </InputField>
//                     </div>

//                     {/* Section: Attachments */}
//                     <div className="px-6 pt-5 pb-6">
//                         <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
//                             Attachments
//                         </p>

//                         <div
//                             onDragOver={(e) => {
//                                 e.preventDefault();
//                                 setDragging(true);
//                             }}
//                             onDragLeave={() => setDragging(false)}
//                             onDrop={onDrop}
//                             onClick={() => fileInputRef.current?.click()}
//                             className={`rounded-xl border-2 border-dashed cursor-pointer transition text-center py-8 px-4 ${
//                                 dragging
//                                     ? "border-indigo-400 bg-indigo-50"
//                                     : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40"
//                             }`}
//                         >
//                             <div className="flex flex-col items-center gap-2 pointer-events-none select-none">
//                                 <UploadIcon />
//                                 <p className="text-sm text-gray-600">
//                                     <span className="font-medium text-indigo-600">
//                                         Click to upload
//                                     </span>{" "}
//                                     or drag and drop
//                                 </p>
//                                 <p className="text-xs text-gray-400">
//                                     PNG, JPG, PDF, ZIP, DOC — up to 10 MB each
//                                 </p>
//                             </div>
//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 multiple
//                                 className="hidden"
//                                 accept="image/*,.pdf,.zip,.doc,.docx"
//                                 onChange={(e) => {
//                                     addFiles([...e.target.files]);
//                                     e.target.value = "";
//                                 }}
//                             />
//                         </div>

//                         {files.length > 0 && (
//                             <ul className="mt-3 space-y-2">
//                                 {files.map((f) => (
//                                     <li
//                                         key={f.name}
//                                         className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
//                                     >
                                      
//                                         <span className="flex-1 truncate text-gray-700">
//                                             {f.name}
//                                         </span>
//                                         <span className="text-xs text-gray-400 shrink-0">
//                                             {(f.size / 1024).toFixed(0)} KB
//                                         </span>
//                                         <button
//                                             type="button"
//                                             onClick={() => removeFile(f.name)}
//                                             className="shrink-0 text-gray-400 hover:text-red-500 transition p-0.5 rounded"
//                                             aria-label={`Remove ${f.name}`}
//                                         >
                                           
//                                         </button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}

//                         {/* Submit */}
//                         <button
//                             type="button"
//                             onClick={handleSubmit}
//                             disabled={submitting}
//                             className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold py-3 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition"
//                         >
//                             {submitting ? (
//                                 <>
//                                     <svg
//                                         className="animate-spin w-4 h-4"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                     >
//                                         <circle
//                                             className="opacity-25"
//                                             cx="12"
//                                             cy="12"
//                                             r="10"
//                                             stroke="currentColor"
//                                             strokeWidth="3"
//                                         />
//                                         <path
//                                             className="opacity-75"
//                                             fill="currentColor"
//                                             d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                                         />
//                                     </svg>
//                                     Submitting…
//                                 </>
//                             ) : (
//                                 <>
//                                     <SendIcon />
//                                     Submit ticket
//                                 </>
//                             )}
//                         </button>

//                         <p className="text-center text-xs text-gray-400 mt-3">
//                             Fields marked{" "}
//                             <span className="text-red-400">*</span> are required
//                         </p>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default WebTicket;




// import { useState, useRef, useCallback } from "react";

// const CATEGORIES = [
//     {
//         group: "Digital Marketing",
//         items: [
//             "Social Media Promotional Flyer",
//             "Social Media Reel",
//             "Boost",
//             "Branding (Logo, Guideline)",
//             "Content Making Shoot",
//             "Print Designs",
//             "Campaign Designs",
//             "Digital Flyer",
//             "Digital Issue / Support",
//             "QR Making",
//             "Social Media Setups",
//         ],
//     },
//     {
//         group: "Domain and Hosting",
//         items: [
//             "Domain Registration",
//             "Create Hosting",
//             "Email Creation",
//             "Email / Domain Issue / Support",
//             "Renewal and Payment",
//             "Outlook Setup",
//             "Email Signature Creation / Setup",
//         ],
//     },
//     {
//         group: "OTA",
//         items: [
//             "OTA Access – Login, Account Setup",
//             "Bookings – Reservations, Changes, Cancellations",
//             "Rates & Inventory",
//             "Payments & Billing",
//             "Property Content",
//             "Promotions & Visibility",
//             "Integrations – Channel Manager",
//             "Website Bookings",
//             "Technical Support",
//             "Disputes & Chargebacks",
//             "Google Business Profile",
//             "Tripadvisor",
//             "OTA Training",
//             "Other OTA Inquiries",
//         ],
//     },
//     {
//         group: "Photography",
//         items: ["Issue and Support", "Post Production", "Schedule a Shoot"],
//     },
//     {
//         group: "Sales and Marketing",
//         items: [
//             "Invoice",
//             "Payment and Billing",
//             "Proposal and Agreement",
//             "Quotation",
//         ],
//     },
//     {
//         group: "Videography",
//         items: ["Issue and Support", "Post Production", "Schedule a Shoot"],
//     },
//     {
//         group: "Website Development",
//         items: [
//             "Add New Feature",
//             "Content Updates / Management",
//             "Issue and Debugging",
//             "Layout / Design",
//             "System Training",
//             "System Updates / Upgrades",
//             "Technical Support",
//         ],
//     },
//     {
//         group: "Enquiry",
//         items: ["General Enquiry"],
//     },
// ];

// const PRIORITIES = [
//     { value: "High" },
//     { value: "Medium" },
//     { value: "Low" },
//     { value: "Super" },
// ];

// function UploadIcon() {
//     return (
//         <svg
//             width="32"
//             height="32"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="text-gray-300"
//         >
//             <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
//             <path d="M12 12v9" />
//             <path d="m16 16-4-4-4 4" />
//         </svg>
//     );
// }

// function SendIcon() {
//     return (
//         <svg
//             width="16"
//             height="16"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="m22 2-7 20-4-9-9-4Z" />
//             <path d="M22 2 11 13" />
//         </svg>
//     );
// }

// function CheckIcon() {
//     return (
//         <svg
//             width="20"
//             height="20"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <polyline points="20 6 9 17 4 12" />
//         </svg>
//     );
// }

// function XIcon() {
//     return (
//         <svg
//             width="14"
//             height="14"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <line x1="18" y1="6" x2="6" y2="18" />
//             <line x1="6" y1="6" x2="18" y2="18" />
//         </svg>
//     );
// }

// function InputField({ label, id, icon, required, error, children }) {
//     return (
//         <div className="flex flex-col gap-1.5">
//             <label
//                 htmlFor={id}
//                 className="flex items-center gap-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider"
//             >
//                 {icon && <span className="text-gray-400">{icon}</span>}
//                 {label}
//                 {required && <span className="text-rose-400">*</span>}
//             </label>
//             {children}
//             {error && (
//                 <p className="text-xs text-rose-500 mt-0.5 font-medium">
//                     {error}
//                 </p>
//             )}
//         </div>
//     );
// }

// const inputCls =
//     "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] hover:border-gray-300";

// const WebTicket = () => {
//     const [form, setForm] = useState({
//         name: "",
//         email: "",
//         subject: "",
//         category: "",
//         priority: "",
//         description: "",
//     });
//     const [errors, setErrors] = useState({});
//     const [files, setFiles] = useState([]);
//     const [dragging, setDragging] = useState(false);
//     const [submitted, setSubmitted] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const fileInputRef = useRef(null);

//     const set = (key) => (e) =>
//         setForm((f) => ({ ...f, [key]: e.target.value }));

//     const addFiles = useCallback((incoming) => {
//         setFiles((prev) => {
//             const existing = new Set(prev.map((f) => f.name));
//             return [...prev, ...incoming.filter((f) => !existing.has(f.name))];
//         });
//     }, []);

//     const removeFile = (name) =>
//         setFiles((f) => f.filter((x) => x.name !== name));

//     const onDrop = (e) => {
//         e.preventDefault();
//         setDragging(false);
//         addFiles([...e.dataTransfer.files]);
//     };

//     const validate = () => {
//         const e = {};
//         if (!form.name.trim()) e.name = "Name is required";
//         if (!form.email.trim()) e.email = "Email is required";
//         else if (!/\S+@\S+\.\S+/.test(form.email))
//             e.email = "Enter a valid email";
//         if (!form.subject.trim()) e.subject = "Subject is required";
//         if (!form.category) e.category = "Please select a category";
//         if (!form.priority) e.priority = "Please select a priority";
//         if (!form.description.trim()) e.description = "Description is required";
//         setErrors(e);
//         return Object.keys(e).length === 0;
//     };

//     const handleSubmit = async () => {
//         if (!validate()) return;
//         setSubmitting(true);
//         await new Promise((r) => setTimeout(r, 900));
//         setSubmitting(false);
//         setSubmitted(true);
//     };

//     const handleReset = () => {
//         setForm({
//             name: "",
//             email: "",
//             subject: "",
//             category: "",
//             priority: "",
//             description: "",
//         });
//         setFiles([]);
//         setErrors({});
//         setSubmitted(false);
//     };

//     if (submitted) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 flex items-center justify-center p-4">
//                 <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
//                     <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/50">
//                         <CheckIcon />
//                     </div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                         Ticket submitted!
//                     </h2>
//                     <p className="text-sm text-gray-500 mb-1 leading-relaxed">
//                         Thanks,{" "}
//                         <span className="font-semibold text-gray-700">
//                             {form.name}
//                         </span>
//                         . We'll review your ticket and get back to you at{" "}
//                         <span className="font-semibold text-indigo-600">
//                             {form.email}
//                         </span>
//                         .
//                     </p>
//                     <div className="mt-8 bg-gray-50 rounded-2xl p-5 text-left space-y-3 text-sm border border-gray-100">
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-500 text-xs uppercase tracking-wider font-medium">
//                                 Category
//                             </span>
//                             <span className="text-gray-900 font-medium">
//                                 {form.category}
//                             </span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-500 text-xs uppercase tracking-wider font-medium">
//                                 Priority
//                             </span>
//                             <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium text-xs">
//                                 {form.priority}
//                             </span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-500 text-xs uppercase tracking-wider font-medium">
//                                 Subject
//                             </span>
//                             <span className="text-gray-900 font-medium text-right max-w-[60%] truncate">
//                                 {form.subject}
//                             </span>
//                         </div>
//                     </div>
//                     <button
//                         onClick={handleReset}
//                         className="mt-8 w-full rounded-2xl bg-gray-900 text-white text-sm font-semibold py-3.5 hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gray-900/10"
//                     >
//                         Submit another ticket
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50">
//             <main className="max-w-3xl mx-auto px-4 py-12">
//                 <div className="mb-8 text-center">
//                     <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
//                         Create a ticket
//                     </h1>
//                     <p className="text-sm text-gray-500 mt-2">
//                         Fill out the form below and we'll get back to you as
//                         soon as possible.
//                     </p>
//                 </div>

//                 <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200">
//                     {/* Section: Contact info */}
//                     <div className="px-8 pt-8 pb-6 border-b border-gray-100">
//                         <div className="flex items-center gap-3 mb-6">
//                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//                                 Contact info
//                             </p>
//                         </div>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                             <InputField
//                                 label="Name"
//                                 id="name"
//                                 required
//                                 error={errors.name}
//                             >
//                                 <input
//                                     id="name"
//                                     type="text"
//                                     placeholder="Your full name"
//                                     value={form.name}
//                                     onChange={set("name")}
//                                     className={
//                                         inputCls +
//                                         (errors.name
//                                             ? " border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
//                                             : "")
//                                     }
//                                 />
//                             </InputField>

//                             <InputField
//                                 label="Email"
//                                 id="email"
//                                 required
//                                 error={errors.email}
//                             >
//                                 <input
//                                     id="email"
//                                     type="email"
//                                     placeholder="you@company.com"
//                                     value={form.email}
//                                     onChange={set("email")}
//                                     className={
//                                         inputCls +
//                                         (errors.email
//                                             ? " border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
//                                             : "")
//                                     }
//                                 />
//                             </InputField>
//                         </div>
//                     </div>

//                     {/* Section: Ticket details */}
//                     <div className="px-8 pt-6 pb-6 border-b border-gray-100 space-y-5">
//                         <div className="flex items-center gap-3 mb-2">
//                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//                                 Ticket details
//                             </p>
//                         </div>

//                         <InputField
//                             label="Subject"
//                             id="subject"
//                             required
//                             error={errors.subject}
//                         >
//                             <input
//                                 id="subject"
//                                 type="text"
//                                 placeholder="Brief summary of your issue"
//                                 value={form.subject}
//                                 onChange={set("subject")}
//                                 className={
//                                     inputCls +
//                                     (errors.subject
//                                         ? " border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
//                                         : "")
//                                 }
//                             />
//                         </InputField>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                             {/* Category */}
//                             <InputField
//                                 label="Category"
//                                 id="category"
//                                 required
//                                 error={errors.category}
//                             >
//                                 <div className="relative">
//                                     <select
//                                         id="category"
//                                         value={form.category}
//                                         onChange={set("category")}
//                                         className={
//                                             inputCls +
//                                             " appearance-none pr-10 cursor-pointer " +
//                                             (errors.category
//                                                 ? "border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
//                                                 : "")
//                                         }
//                                     >
//                                         <option value="" disabled>
//                                             Select a category
//                                         </option>
//                                         {CATEGORIES.map((g) => (
//                                             <optgroup
//                                                 key={g.group}
//                                                 label={g.group}
//                                                 className="font-semibold"
//                                             >
//                                                 {g.items.map((item) => (
//                                                     <option
//                                                         key={item}
//                                                         value={item}
//                                                         className="font-normal"
//                                                     >
//                                                         {item}
//                                                     </option>
//                                                 ))}
//                                             </optgroup>
//                                         ))}
//                                     </select>
//                                     <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    
//                                     </span>
//                                 </div>
//                             </InputField>

//                             {/* Priority */}
//                             <InputField
//                                 label="Priority"
//                                 id="priority"
//                                 required
//                                 error={errors.priority}
//                             >
//                                 <div className="relative">
//                                     <select
//                                         id="priority"
//                                         value={form.priority}
//                                         onChange={(e) => {
//                                             setForm((f) => ({
//                                                 ...f,
//                                                 priority: e.target.value,
//                                             }));
//                                             if (errors.priority)
//                                                 setErrors((er) => {
//                                                     const n = { ...er };
//                                                     delete n.priority;
//                                                     return n;
//                                                 });
//                                         }}
//                                         className={[
//                                             inputCls,
//                                             "appearance-none cursor-pointer font-medium",
//                                             "pr-10",
//                                             errors.priority
//                                                 ? "border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
//                                                 : "",
//                                         ].join(" ")}
//                                     >
//                                         <option value="" disabled>
//                                             Select priority
//                                         </option>
//                                         {PRIORITIES.map((p) => (
//                                             <option
//                                                 key={p.value}
//                                                 value={p.value}
                                               
//                                             >
//                                                 {p.value}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                       
//                                     </span>
//                                 </div>
//                             </InputField>
//                         </div>

//                         <InputField
//                             label="Description"
//                             id="description"
//                             required
//                             error={errors.description}
//                         >
//                             <textarea
//                                 id="description"
//                                 rows={5}
//                                 placeholder="Describe your issue in detail — include steps to reproduce, error messages, screenshots, or anything else that helps us understand the problem..."
//                                 value={form.description}
//                                 onChange={set("description")}
//                                 className={
//                                     inputCls +
//                                     " resize-y min-h-[120px] leading-relaxed " +
//                                     (errors.description
//                                         ? "border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
//                                         : "")
//                                 }
//                             />
//                         </InputField>
//                     </div>

//                     {/* Section: Attachments */}
//                     <div className="px-8 pt-6 pb-8">
//                         <div className="flex items-center gap-3 mb-4">
//                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//                                 Attachments
//                             </p>
//                         </div>

//                         <div
//                             onDragOver={(e) => {
//                                 e.preventDefault();
//                                 setDragging(true);
//                             }}
//                             onDragLeave={() => setDragging(false)}
//                             onDrop={onDrop}
//                             onClick={() => fileInputRef.current?.click()}
//                             className={`rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 text-center py-10 px-4 ${
//                                 dragging
//                                     ? "border-indigo-400 bg-indigo-50/50 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]"
//                                     : "border-gray-200 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30"
//                             }`}
//                         >
//                             <div className="flex flex-col items-center gap-3 pointer-events-none select-none">
//                                 <UploadIcon />
//                                 <div>
//                                     <p className="text-sm text-gray-600">
//                                         <span className="font-semibold text-indigo-600 hover:text-indigo-700">
//                                             Click to upload
//                                         </span>{" "}
//                                         or drag and drop
//                                     </p>
//                                     <p className="text-xs text-gray-400 mt-1">
//                                         PNG, JPG, PDF, ZIP, DOC — up to 10 MB each
//                                     </p>
//                                 </div>
//                             </div>
//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 multiple
//                                 className="hidden"
//                                 accept="image/*,.pdf,.zip,.doc,.docx"
//                                 onChange={(e) => {
//                                     addFiles([...e.target.files]);
//                                     e.target.value = "";
//                                 }}
//                             />
//                         </div>

//                         {files.length > 0 && (
//                             <ul className="mt-4 space-y-2">
//                                 {files.map((f) => (
//                                     <li
//                                         key={f.name}
//                                         className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-sm group hover:bg-gray-100 transition-colors"
//                                     >
//                                         <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
//                                             <svg
//                                                 width="16"
//                                                 height="16"
//                                                 viewBox="0 0 24 24"
//                                                 fill="none"
//                                                 stroke="#6366f1"
//                                                 strokeWidth="2"
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                             >
//                                                 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                                                 <polyline points="14 2 14 8 20 8" />
//                                             </svg>
//                                         </div>
//                                         <span className="flex-1 truncate text-gray-700 font-medium">
//                                             {f.name}
//                                         </span>
//                                         <span className="text-xs text-gray-400 shrink-0">
//                                             {(f.size / 1024).toFixed(0)} KB
//                                         </span>
//                                         <button
//                                             type="button"
//                                             onClick={() => removeFile(f.name)}
//                                             className="shrink-0 text-gray-400 hover:text-rose-500 transition-colors p-1 rounded hover:bg-rose-50"
//                                             aria-label={`Remove ${f.name}`}
//                                         >
//                                             <XIcon />
//                                         </button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}

//                         {/* Submit */}
//                         <button
//                             type="button"
//                             onClick={handleSubmit}
//                             disabled={submitting}
//                             className="mt-6 w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold py-3.5 hover:bg-gray-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-gray-900/10"
//                         >
//                             {submitting ? (
//                                 <>
//                                     <svg
//                                         className="animate-spin w-4 h-4"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                     >
//                                         <circle
//                                             className="opacity-25"
//                                             cx="12"
//                                             cy="12"
//                                             r="10"
//                                             stroke="currentColor"
//                                             strokeWidth="3"
//                                         />
//                                         <path
//                                             className="opacity-75"
//                                             fill="currentColor"
//                                             d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                                         />
//                                     </svg>
//                                     Submitting…
//                                 </>
//                             ) : (
//                                 <>
//                                     <SendIcon />
//                                     Submit ticket
//                                 </>
//                             )}
//                         </button>

//                         <p className="text-center text-xs text-gray-400 mt-4">
//                             Fields marked{" "}
//                             <span className="text-rose-400 font-medium">*</span>{" "}
//                             are required
//                         </p>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default WebTicket;



import { useState, useRef, useCallback } from "react";

const CATEGORIES = [
    {
        group: "Digital Marketing",
        items: [
            "Social Media Promotional Flyer",
            "Social Media Reel",
            "Boost",
            "Branding (Logo, Guideline)",
            "Content Making Shoot",
            "Print Designs",
            "Campaign Designs",
            "Digital Flyer",
            "Digital Issue / Support",
            "QR Making",
            "Social Media Setups",
        ],
    },
    {
        group: "Domain and Hosting",
        items: [
            "Domain Registration",
            "Create Hosting",
            "Email Creation",
            "Email / Domain Issue / Support",
            "Renewal and Payment",
            "Outlook Setup",
            "Email Signature Creation / Setup",
        ],
    },
    {
        group: "OTA",
        items: [
            "OTA Access – Login, Account Setup",
            "Bookings – Reservations, Changes, Cancellations",
            "Rates & Inventory",
            "Payments & Billing",
            "Property Content",
            "Promotions & Visibility",
            "Integrations – Channel Manager",
            "Website Bookings",
            "Technical Support",
            "Disputes & Chargebacks",
            "Google Business Profile",
            "Tripadvisor",
            "OTA Training",
            "Other OTA Inquiries",
        ],
    },
    {
        group: "Photography",
        items: ["Issue and Support", "Post Production", "Schedule a Shoot"],
    },
    {
        group: "Sales and Marketing",
        items: [
            "Invoice",
            "Payment and Billing",
            "Proposal and Agreement",
            "Quotation",
        ],
    },
    {
        group: "Videography",
        items: ["Issue and Support", "Post Production", "Schedule a Shoot"],
    },
    {
        group: "Website Development",
        items: [
            "Add New Feature",
            "Content Updates / Management",
            "Issue and Debugging",
            "Layout / Design",
            "System Training",
            "System Updates / Upgrades",
            "Technical Support",
        ],
    },
    {
        group: "Enquiry",
        items: ["General Enquiry"],
    },
];

const PRIORITIES = [
    { value: "High" },
    { value: "Medium" },
    { value: "Low" },
    { value: "Super" },
];

function UploadIcon() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300"
        >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="m16 16-4-4-4 4" />
        </svg>
    );
}

function SendIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function InputField({ label, id, required, error, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
                {label}
                {required && <span className="text-rose-400">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-xs text-rose-500 mt-0.5 font-medium">
                    {error}
                </p>
            )}
        </div>
    );
}

const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#0b78b9] focus:shadow-[0_0_0_4px_rgba(11,120,185,0.1)] hover:border-gray-300";

const WebTicket = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        category: "",
        priority: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const set = (key) => (e) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const addFiles = useCallback((incoming) => {
        setFiles((prev) => {
            const existing = new Set(prev.map((f) => f.name));
            return [...prev, ...incoming.filter((f) => !existing.has(f.name))];
        });
    }, []);

    const removeFile = (name) =>
        setFiles((f) => f.filter((x) => x.name !== name));

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        addFiles([...e.dataTransfer.files]);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email))
            e.email = "Enter a valid email";
        if (!form.subject.trim()) e.subject = "Subject is required";
        if (!form.category) e.category = "Please select a category";
        if (!form.priority) e.priority = "Please select a priority";
        if (!form.description.trim()) e.description = "Description is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 900));
        setSubmitting(false);
        setSubmitted(true);
    };

    const handleReset = () => {
        setForm({
            name: "",
            email: "",
            subject: "",
            category: "",
            priority: "",
            description: "",
        });
        setFiles([]);
        setErrors({});
        setSubmitted(false);
    };

    if (submitted) {
        return (
            <div
                className="min-h-screen relative"
                style={{ background: "#f0f4f8" }}
            >
                {/* Blue top half background */}
                <div
                    className="absolute top-0 left-0 right-0"
                    style={{ height: "52%", zIndex: 0 }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=1400&q=80&fit=crop"
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ opacity: 0.18 }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(135deg, #063d5ecc 0%, #0b78b999 50%, #1a9fd4bb 100%)",
                        }}
                    />
                </div>

                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Logo */}
                    <header className="px-8 pt-7 pb-2 flex-shrink-0">
                        <img
                            src="/images/logo2.png"
                            alt="Company Logo"
                            className="h-20 w-auto object-contain"
                        />
                    </header>

                    <div className="flex-1 flex flex-col items-center justify-start px-4 pt-6 pb-16">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 max-w-md w-full text-center">
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                                style={{ background: "rgba(11,120,185,0.08)" }}
                            >
                                <svg
                                    width="36"
                                    height="36"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#0b78b9"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Ticket submitted!
                            </h2>
                            <p className="text-sm text-gray-500 mb-1 leading-relaxed">
                                Thanks,{" "}
                                <span className="font-semibold text-gray-700">
                                    {form.name}
                                </span>
                                . We'll review your ticket and get back to you
                                at{" "}
                                <span
                                    className="font-semibold"
                                    style={{ color: "#0b78b9" }}
                                >
                                    {form.email}
                                </span>
                                .
                            </p>
                            <div className="mt-8 bg-gray-50 rounded-2xl p-5 text-left space-y-3 text-sm border border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                                        Category
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                        {form.category}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                                        Priority
                                    </span>
                                    <span
                                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        style={{
                                            background: "rgba(11,120,185,0.08)",
                                            color: "#0b78b9",
                                        }}
                                    >
                                        {form.priority}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                                        Subject
                                    </span>
                                    <span className="text-gray-900 font-medium text-right max-w-[60%] truncate">
                                        {form.subject}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleReset}
                                className="mt-8 w-full rounded-2xl text-white text-sm font-semibold py-3.5 active:scale-[0.98] transition-all duration-200 shadow-lg"
                                style={{ background: "#0b78b9" }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        "#0969a2")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        "#0b78b9")
                                }
                            >
                                Submit another ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen relative"
            style={{ background: "#f0f4f8" }}
        >
            {/* ── Blue background — covers top portion, sits behind everything ── */}
            <div
                className="absolute top-0 left-0 right-0"
                style={{ height: "640px", zIndex: 0 }}
            >
                {/* Photo */}
                <img
                    src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=1400&q=80&fit=crop"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: 0.18 }}
                />
                {/* Blue gradient overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(135deg, #063d5ecc 0%, #0b78b999 50%, #1a9fd4bb 100%)",
                    }}
                />
            </div>

            {/* ── All page content sits above the blue bg ── */}
            <div
                className="relative flex flex-col min-h-screen"
                style={{ zIndex: 1 }}
            >
                {/* Logo */}
                <header className="px-8 pt-7 pb-2 flex-shrink-0 flex justify-center">
                    <img
                        src="/images/logo2.png"
                        alt="Company Logo"
                        className="h-20 w-auto object-contain"
                    />
                </header>

                {/* Hero text — inside the blue band */}
                <div className="text-center px-4 pt-6 pb-10">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        We're here to help you resolve any issue.
                    </h1>
                    <p
                        className="text-sm mt-3 max-w-md mx-auto leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                        Submit a ticket and our dedicated support team will get
                        back to you promptly — usually within a few hours.
                    </p>
                </div>

                {/* Form card */}
                <div className="flex justify-center px-4 pt-0 pb-0">
                    <div className="w-full max-w-2xl">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Section: Contact info */}
                            <div className="px-7 pt-7 pb-6 border-b border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
                                    Contact info
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <InputField
                                        label="Name"
                                        id="name"
                                        required
                                        error={errors.name}
                                    >
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Your full name"
                                            value={form.name}
                                            onChange={set("name")}
                                            className={
                                                inputCls +
                                                (errors.name
                                                    ? " border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
                                                    : "")
                                            }
                                        />
                                    </InputField>
                                    <InputField
                                        label="Email"
                                        id="email"
                                        required
                                        error={errors.email}
                                    >
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="you@company.com"
                                            value={form.email}
                                            onChange={set("email")}
                                            className={
                                                inputCls +
                                                (errors.email
                                                    ? " border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
                                                    : "")
                                            }
                                        />
                                    </InputField>
                                </div>
                            </div>

                            {/* Section: Ticket details */}
                            <div className="px-7 pt-6 pb-6 border-b border-gray-100 space-y-5">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Ticket details
                                </p>

                                <InputField
                                    label="Subject"
                                    id="subject"
                                    required
                                    error={errors.subject}
                                >
                                    <input
                                        id="subject"
                                        type="text"
                                        placeholder="Brief summary of your issue"
                                        value={form.subject}
                                        onChange={set("subject")}
                                        className={
                                            inputCls +
                                            (errors.subject
                                                ? " border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
                                                : "")
                                        }
                                    />
                                </InputField>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <InputField
                                        label="Category"
                                        id="category"
                                        required
                                        error={errors.category}
                                    >
                                        <div className="relative">
                                            <select
                                                id="category"
                                                value={form.category}
                                                onChange={set("category")}
                                                className={
                                                    inputCls +
                                                    " appearance-none pr-10 cursor-pointer " +
                                                    (errors.category
                                                        ? "border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
                                                        : "")
                                                }
                                            >
                                                <option value="" disabled>
                                                    Select a category
                                                </option>
                                                {CATEGORIES.map((g) => (
                                                    <optgroup
                                                        key={g.group}
                                                        label={g.group}
                                                        className="font-semibold"
                                                    >
                                                        {g.items.map((item) => (
                                                            <option
                                                                key={item}
                                                                value={item}
                                                                className="font-normal"
                                                            >
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="6 9 12 15 18 9" />
                                                </svg>
                                            </span>
                                        </div>
                                    </InputField>

                                    <InputField
                                        label="Priority"
                                        id="priority"
                                        required
                                        error={errors.priority}
                                    >
                                        <div className="relative">
                                            <select
                                                id="priority"
                                                value={form.priority}
                                                onChange={(e) => {
                                                    setForm((f) => ({
                                                        ...f,
                                                        priority:
                                                            e.target.value,
                                                    }));
                                                    if (errors.priority)
                                                        setErrors((er) => {
                                                            const n = { ...er };
                                                            delete n.priority;
                                                            return n;
                                                        });
                                                }}
                                                className={[
                                                    inputCls,
                                                    "appearance-none cursor-pointer font-medium pr-10",
                                                    errors.priority
                                                        ? "border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
                                                        : "",
                                                ].join(" ")}
                                            >
                                                <option value="" disabled>
                                                    Select priority
                                                </option>
                                                {PRIORITIES.map((p) => (
                                                    <option
                                                        key={p.value}
                                                        value={p.value}
                                                    >
                                                        {p.value}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="6 9 12 15 18 9" />
                                                </svg>
                                            </span>
                                        </div>
                                    </InputField>
                                </div>

                                <InputField
                                    label="Description"
                                    id="description"
                                    required
                                    error={errors.description}
                                >
                                    <textarea
                                        id="description"
                                        rows={4}
                                        placeholder="Describe your issue in detail — include steps to reproduce, error messages, screenshots, or anything else that helps us understand the problem..."
                                        value={form.description}
                                        onChange={set("description")}
                                        className={
                                            inputCls +
                                            " resize-y min-h-[120px] leading-relaxed " +
                                            (errors.description
                                                ? "border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
                                                : "")
                                        }
                                    />
                                </InputField>
                            </div>

                            {/* Section: Attachments */}
                            <div className="px-7 pt-6 pb-7">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    Attachments
                                </p>

                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragging(true);
                                    }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={onDrop}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className={`rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 text-center py-9 px-4`}
                                    style={{
                                        borderColor: dragging
                                            ? "#0b78b9"
                                            : "#e5e7eb",
                                        background: dragging
                                            ? "rgba(11,120,185,0.04)"
                                            : "rgba(249,250,251,0.5)",
                                    }}
                                >
                                    <div className="flex flex-col items-center gap-3 pointer-events-none select-none">
                                        <UploadIcon />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                <span
                                                    className="font-semibold"
                                                    style={{ color: "#0b78b9" }}
                                                >
                                                    Click to upload
                                                </span>{" "}
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                PNG, JPG, PDF, ZIP, DOC — up to
                                                10 MB each
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        className="hidden"
                                        accept="image/*,.pdf,.zip,.doc,.docx"
                                        onChange={(e) => {
                                            addFiles([...e.target.files]);
                                            e.target.value = "";
                                        }}
                                    />
                                </div>

                                {files.length > 0 && (
                                    <ul className="mt-4 space-y-2">
                                        {files.map((f) => (
                                            <li
                                                key={f.name}
                                                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                                    style={{
                                                        background:
                                                            "rgba(11,120,185,0.08)",
                                                    }}
                                                >
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="#0b78b9"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                        <polyline points="14 2 14 8 20 8" />
                                                    </svg>
                                                </div>
                                                <span className="flex-1 truncate text-gray-700 font-medium">
                                                    {f.name}
                                                </span>
                                                <span className="text-xs text-gray-400 shrink-0">
                                                    {(f.size / 1024).toFixed(0)}{" "}
                                                    KB
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFile(f.name)
                                                    }
                                                    className="shrink-0 text-gray-400 hover:text-rose-500 transition-colors p-1 rounded hover:bg-rose-50"
                                                    aria-label={`Remove ${f.name}`}
                                                >
                                                    <XIcon />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Submit */}
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="mt-6 w-full flex items-center justify-center gap-2.5 rounded-2xl text-white text-sm font-semibold py-3.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                                    style={{ background: "#0b78b9" }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                            "#0969a2")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background =
                                            "#0b78b9")
                                    }
                                >
                                    {submitting ? (
                                        <>
                                            <svg
                                                className="animate-spin w-4 h-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                />
                                            </svg>
                                            Submitting…
                                        </>
                                    ) : (
                                        <>
                                            <SendIcon />
                                            Submit ticket
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Fields marked{" "}
                                    <span className="text-rose-400 font-medium">
                                        *
                                    </span>{" "}
                                    are required
                                </p>
                            </div>
                        </div>

                        {/* ── Text block below the form card ── */}
                        <div className="px-2 pt-10 pb-16 text-center">
                            <div
                                className="w-8 h-0.5 rounded-full mx-auto mb-5"
                                style={{ background: "#0b78b9" }}
                            />
                            <h2 className="text-2xl font-bold text-gray-800 leading-snug mb-3">
                                We're here to help you resolve any issue.
                            </h2>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
                                Submit a ticket and our dedicated support team
                                will get back to you promptly — usually within a
                                few hours.
                            </p>

                            {/* Feature pills */}
                            <div className="flex flex-wrap justify-center gap-2 mt-6">
                                {[
                                    "⚡ Fast response",
                                    "🔒 Secure & private",
                                    "📎 File attachments",
                                ].map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs font-medium px-3 py-1.5 rounded-full text-gray-500"
                                        style={{
                                            background: "rgba(11,120,185,0.07)",
                                            border: "0.5px solid rgba(11,120,185,0.15)",
                                            color: "#0b78b9",
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebTicket;