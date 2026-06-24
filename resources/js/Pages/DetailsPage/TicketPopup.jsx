// import React, { useState, useCallback, useRef, useEffect } from "react";
// import { X, User, Tag, Monitor, AlertCircle, FileText, Mail, Calendar, Hash, Eye } from "lucide-react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     "pdfjs-dist/build/pdf.worker.min.mjs",
//     import.meta.url
// ).toString();

// const statusConfig = {
//     open: { label: "Open", bg: "bg-blue-100", text: "text-blue-700" },
//     in_progress: { label: "In Progress", bg: "bg-orange-100", text: "text-orange-700" },
//     waiting_parts: { label: "Waiting Parts", bg: "bg-purple-100", text: "text-purple-700" },
//     client_approval: { label: "Client Approval", bg: "bg-yellow-100", text: "text-yellow-700" },
//     completed: { label: "Completed", bg: "bg-green-100", text: "text-green-700" },
//     closed: { label: "Closed", bg: "bg-gray-100", text: "text-gray-600" },
// };

// const priorityConfig = {
//     High: { bg: "bg-red-100", text: "text-red-700" },
//     Medium: { bg: "bg-yellow-100", text: "text-yellow-700" },
//     Low: { bg: "bg-green-100", text: "text-green-700" },
//     // fallback for lowercase
//     high: { bg: "bg-red-100", text: "text-red-700" },
//     medium: { bg: "bg-yellow-100", text: "text-yellow-700" },
//     low: { bg: "bg-green-100", text: "text-green-700" },
// };

// // ─── PDF Viewer ────────────────────────────────────────────────────────────────
// const PdfViewer = ({ url }) => {
//     const [numPages, setNumPages] = useState(null);
//     const [scale, setScale] = useState(1.0);
//     const [pdfLoading, setPdfLoading] = useState(true);
//     const [pdfError, setPdfError] = useState(null);
//     const [currentPageInView, setCurrentPageInView] = useState(1);

//     const containerRef = useRef(null);
//     const pageRefs = useRef([]);

//     const onDocumentLoadSuccess = useCallback(({ numPages }) => {
//         setNumPages(numPages);
//         setPdfLoading(false);
//         setPdfError(null);
//         pageRefs.current = pageRefs.current.slice(0, numPages);
//     }, []);

//     const onDocumentLoadError = useCallback((err) => {
//         console.error("PDF load error:", err);
//         setPdfError("Failed to load PDF.");
//         setPdfLoading(false);
//     }, []);

//     useEffect(() => {
//         if (!numPages) return;
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((entry) => {
//                     if (entry.isIntersecting) {
//                         setCurrentPageInView(parseInt(entry.target.dataset.page, 10) + 1);
//                     }
//                 });
//             },
//             { threshold: 0.5 }
//         );
//         pageRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
//         return () => { pageRefs.current.forEach((ref) => { if (ref) observer.unobserve(ref); }); };
//     }, [numPages, scale]);

//     const zoomIn = () => setScale((p) => Math.min(p + 0.2, 2.0));
//     const zoomOut = () => setScale((p) => Math.max(p - 0.2, 0.6));
//     const resetZoom = () => setScale(1.0);

//     return (
//         <div className="flex flex-col h-full">
//             {/* PDF toolbar */}
//             <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg shrink-0">
//                 <div className="flex items-center gap-2">
//                     <FileText size={14} className="text-red-500" />
//                     <span className="text-xs font-medium text-gray-600">PDF Document</span>
//                     {numPages && (
//                         <span className="text-xs text-gray-400">
//                             — Page <span className="font-medium text-gray-600">{currentPageInView}</span> of {numPages}
//                         </span>
//                     )}
//                 </div>
//                 <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
//                     <button
//                         onClick={zoomOut}
//                         disabled={scale <= 0.6}
//                         className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
//                     >
//                         <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
//                         </svg>
//                     </button>
//                     <span className="px-2 text-xs font-medium text-gray-600 min-w-[42px] text-center">
//                         {Math.round(scale * 100)}%
//                     </span>
//                     <button
//                         onClick={zoomIn}
//                         disabled={scale >= 2.0}
//                         className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
//                     >
//                         <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                         </svg>
//                     </button>
//                     <button
//                         onClick={resetZoom}
//                         className="px-2 py-1 text-xs hover:bg-gray-100 rounded-md transition-colors text-gray-500"
//                     >
//                         reset
//                     </button>
//                 </div>
//             </div>

//             {/* PDF scroll area */}
//             <div
//                 ref={containerRef}
//                 className="flex-1 overflow-auto bg-gray-100 rounded-b-lg"
//                 style={{ scrollbarWidth: "thin", scrollbarColor: "#9CA3AF #F3F4F6" }}
//             >
//                 {pdfLoading && !pdfError && (
//                     <div className="flex flex-col items-center justify-center py-16">
//                         <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-indigo-600" />
//                         <p className="text-gray-400 text-xs mt-3">Loading PDF…</p>
//                     </div>
//                 )}
//                 {pdfError && (
//                     <div className="flex flex-col items-center justify-center py-16 text-center px-4">
//                         <AlertCircle size={32} className="text-red-400 mb-2" />
//                         <p className="text-sm text-red-600">{pdfError}</p>
//                     </div>
//                 )}
//                 {!pdfError && (
//                     <Document
//                         file={url}
//                         onLoadSuccess={onDocumentLoadSuccess}
//                         onLoadError={onDocumentLoadError}
//                         loading={null}
//                         className="flex flex-col items-center py-4 gap-4"
//                     >
//                         {numPages &&
//                             Array.from({ length: numPages }, (_, i) => (
//                                 <div
//                                     key={`page_${i + 1}`}
//                                     ref={(el) => (pageRefs.current[i] = el)}
//                                     data-page={i}
//                                 >
//                                     <Page
//                                         pageNumber={i + 1}
//                                         scale={scale}
//                                         renderTextLayer={true}
//                                         renderAnnotationLayer={true}
//                                         className="shadow-md bg-white overflow-hidden"
//                                         loading={
//                                             <div className="w-[400px] h-[500px] bg-gray-200 animate-pulse" />
//                                         }
//                                     />
//                                 </div>
//                             ))}
//                     </Document>
//                 )}
//             </div>
//         </div>
//     );
// };

// // ─── Detail Row ────────────────────────────────────────────────────────────────
// const DetailRow = ({ icon: Icon, label, value, children }) => (
//     <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
//         <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
//             <Icon size={14} className="text-indigo-500" />
//         </div>
//         <div className="flex-1 min-w-0">
//             <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">{label}</p>
//             {children || <p className="text-sm text-gray-800 font-medium break-words">{value || "—"}</p>}
//         </div>
//     </div>
// );

// // ─── Main Popup ────────────────────────────────────────────────────────────────
// const TicketPopup = ({ ticket, onClose }) => {
//     const isPdf = ticket.image && ticket.image.toLowerCase().endsWith(".pdf");
//     const hasAttachment = !!ticket.image;

//     const status = statusConfig[ticket.status] || { label: ticket.status, bg: "bg-gray-100", text: "text-gray-600" };
//     const priority = priorityConfig[ticket.priority] || { bg: "bg-gray-100", text: "text-gray-600" };

//     const formatDate = (dateStr) => {
//         if (!dateStr) return "—";
//         return new Date(dateStr).toLocaleString("en-US", {
//             year: "numeric", month: "short", day: "numeric",
//             hour: "2-digit", minute: "2-digit",
//         });
//     };

//     // Close on backdrop click
//     const handleBackdropClick = (e) => {
//         if (e.target === e.currentTarget) onClose();
//     };

//     // Close on Escape
//     useEffect(() => {
//         const handler = (e) => { if (e.key === "Escape") onClose(); };
//         window.addEventListener("keydown", handler);
//         return () => window.removeEventListener("keydown", handler);
//     }, [onClose]);

//     return (
//         <div
//             className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
//             onClick={handleBackdropClick}
//         >
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">

//                 {/* Header */}
//                 <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
//                     <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
//                             <Eye size={16} className="text-white" />
//                         </div>
//                         <div>
//                             <h2 className="text-base font-bold text-gray-900">Ticket Details</h2>
//                             <p className="text-xs text-indigo-600 font-mono font-semibold">{ticket.ticket_id}</p>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${status.bg} ${status.text}`}>
//                             {status.label}
//                         </span>
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${priority.bg} ${priority.text}`}>
//                             {ticket.priority}
//                         </span>
//                         <button
//                             onClick={onClose}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-1"
//                         >
//                             <X size={18} className="text-gray-500" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Body */}
//                 <div className={`flex-1 overflow-hidden flex ${hasAttachment ? "flex-row" : "flex-col"}`}>

//                     {/* ── Left panel: Details ── */}
//                     <div className={`overflow-y-auto ${hasAttachment ? "w-80 shrink-0 border-r border-gray-100" : "w-full max-w-2xl mx-auto"} px-6 py-2`}>

//                         <DetailRow icon={Hash} label="Ticket ID" value={ticket.ticket_id} />
//                         <DetailRow icon={User} label="Client Name" value={ticket.client_name} />
//                         <DetailRow icon={Mail} label="Email" value={ticket.email} />
//                         <DetailRow icon={Tag} label="Issue Type" value={ticket.issue_type} />
//                         <DetailRow icon={Monitor} label="Device Type" value={ticket.device_type} />

//                         <DetailRow icon={User} label="Assigned Technician">
//                             {ticket.technician_name ? (
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
//                                         <span className="text-xs font-bold text-indigo-600">
//                                             {ticket.technician_name.charAt(0).toUpperCase()}
//                                         </span>
//                                     </div>
//                                     <span className="text-sm text-gray-800 font-medium">{ticket.technician_name}</span>
//                                 </div>
//                             ) : (
//                                 <span className="text-sm text-gray-400 italic">Unassigned</span>
//                             )}
//                         </DetailRow>

//                         <DetailRow icon={FileText} label="Problem Description">
//                             <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
//                                 {ticket.problem_description || "—"}
//                             </p>
//                         </DetailRow>

//                         {/* Mobile: open attachment link if no side panel */}
//                         {hasAttachment && (
//                             <div className="mt-2 pb-2 md:hidden">
//                                 <a
//                                     href={ticket.image}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
//                                 >
//                                     <Eye size={12} /> View attachment
//                                 </a>
//                             </div>
//                         )}
//                     </div>

//                     {/* ── Right panel: Attachment ── */}
//                     {hasAttachment && (
//                         <div className="flex-1 flex flex-col overflow-hidden p-4 bg-gray-50 hidden md:flex">
//                             <div className="shrink-0 mb-3 flex items-center justify-between">
//                                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                     Attachment
//                                 </span>
//                                 <a
//                                     href={ticket.image}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
//                                 >
//                                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                                     </svg>
//                                     Open in new tab
//                                 </a>
//                             </div>

//                             <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white">
//                                 {isPdf ? (
//                                     <PdfViewer url={ticket.image} />
//                                 ) : (
//                                     <div className="w-full h-full flex items-center justify-center bg-gray-50 p-4">
//                                         <img
//                                             src={ticket.image}
//                                             alt="Ticket attachment"
//                                             className="max-w-full max-h-full object-contain rounded-lg shadow-md"
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TicketPopup;





// import React, { useState, useCallback, useRef, useEffect } from "react";
// import {
//     X,
//     User,
//     Tag,
//     Monitor,
//     AlertCircle,
//     FileText,
//     Mail,
//     Calendar,
//     Hash,
//     Eye,
//     Wrench,
//     Clock,
//     Paperclip,
// } from "lucide-react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     "pdfjs-dist/build/pdf.worker.min.mjs",
//     import.meta.url,
// ).toString();

// const statusConfig = {
//     open: {
//         label: "Open",
//         bg: "bg-blue-100",
//         text: "text-blue-700",
//         dot: "bg-blue-500",
//     },
//     in_progress: {
//         label: "In Progress",
//         bg: "bg-orange-100",
//         text: "text-orange-700",
//         dot: "bg-orange-500",
//     },
//     waiting_parts: {
//         label: "Waiting Parts",
//         bg: "bg-purple-100",
//         text: "text-purple-700",
//         dot: "bg-purple-500",
//     },
//     client_approval: {
//         label: "Client Approval",
//         bg: "bg-yellow-100",
//         text: "text-yellow-700",
//         dot: "bg-yellow-500",
//     },
//     completed: {
//         label: "Completed",
//         bg: "bg-green-100",
//         text: "text-green-700",
//         dot: "bg-green-500",
//     },
//     closed: {
//         label: "Closed",
//         bg: "bg-gray-100",
//         text: "text-gray-600",
//         dot: "bg-gray-400",
//     },
// };

// const priorityConfig = {
//     High: {
//         bg: "bg-red-100",
//         text: "text-red-700",
//         dot: "bg-red-500",
//         border: "border-red-200",
//     },
//     Medium: {
//         bg: "bg-yellow-100",
//         text: "text-yellow-700",
//         dot: "bg-yellow-500",
//         border: "border-yellow-200",
//     },
//     Low: {
//         bg: "bg-green-100",
//         text: "text-green-700",
//         dot: "bg-green-500",
//         border: "border-green-200",
//     },
//     high: {
//         bg: "bg-red-100",
//         text: "text-red-700",
//         dot: "bg-red-500",
//         border: "border-red-200",
//     },
//     medium: {
//         bg: "bg-yellow-100",
//         text: "text-yellow-700",
//         dot: "bg-yellow-500",
//         border: "border-yellow-200",
//     },
//     low: {
//         bg: "bg-green-100",
//         text: "text-green-700",
//         dot: "bg-green-500",
//         border: "border-green-200",
//     },
// };

// // ─── PDF Viewer ────────────────────────────────────────────────────────────────
// const PdfViewer = ({ url }) => {
//     const [numPages, setNumPages] = useState(null);
//     const [scale, setScale] = useState(1.0);
//     const [pdfLoading, setPdfLoading] = useState(true);
//     const [pdfError, setPdfError] = useState(null);
//     const [currentPageInView, setCurrentPageInView] = useState(1);

//     const containerRef = useRef(null);
//     const pageRefs = useRef([]);

//     const onDocumentLoadSuccess = useCallback(({ numPages }) => {
//         setNumPages(numPages);
//         setPdfLoading(false);
//         setPdfError(null);
//         pageRefs.current = pageRefs.current.slice(0, numPages);
//     }, []);

//     const onDocumentLoadError = useCallback((err) => {
//         console.error("PDF load error:", err);
//         setPdfError("Failed to load PDF.");
//         setPdfLoading(false);
//     }, []);

//     useEffect(() => {
//         if (!numPages) return;
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((entry) => {
//                     if (entry.isIntersecting) {
//                         setCurrentPageInView(
//                             parseInt(entry.target.dataset.page, 10) + 1,
//                         );
//                     }
//                 });
//             },
//             { threshold: 0.5 },
//         );
//         pageRefs.current.forEach((ref) => {
//             if (ref) observer.observe(ref);
//         });
//         return () => {
//             pageRefs.current.forEach((ref) => {
//                 if (ref) observer.unobserve(ref);
//             });
//         };
//     }, [numPages, scale]);

//     const zoomIn = () => setScale((p) => Math.min(p + 0.2, 2.0));
//     const zoomOut = () => setScale((p) => Math.max(p - 0.2, 0.6));
//     const resetZoom = () => setScale(1.0);

//     return (
//         <div className="flex flex-col h-full">
//             {/* PDF toolbar */}
//             <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg shrink-0">
//                 <div className="flex items-center gap-2">
//                     <FileText size={14} className="text-red-500" />
//                     <span className="text-xs font-medium text-gray-600">
//                         PDF Document
//                     </span>
//                     {numPages && (
//                         <span className="text-xs text-gray-400">
//                             — Page{" "}
//                             <span className="font-medium text-gray-600">
//                                 {currentPageInView}
//                             </span>{" "}
//                             of {numPages}
//                         </span>
//                     )}
//                 </div>
//                 <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
//                     <button
//                         onClick={zoomOut}
//                         disabled={scale <= 0.6}
//                         className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
//                     >
//                         <svg
//                             className="w-3.5 h-3.5 text-gray-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M20 12H4"
//                             />
//                         </svg>
//                     </button>
//                     <span className="px-2 text-xs font-medium text-gray-600 min-w-[42px] text-center">
//                         {Math.round(scale * 100)}%
//                     </span>
//                     <button
//                         onClick={zoomIn}
//                         disabled={scale >= 2.0}
//                         className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
//                     >
//                         <svg
//                             className="w-3.5 h-3.5 text-gray-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M12 4v16m8-8H4"
//                             />
//                         </svg>
//                     </button>
//                     <button
//                         onClick={resetZoom}
//                         className="px-2 py-1 text-xs hover:bg-gray-100 rounded-md transition-colors text-gray-500"
//                     >
//                         reset
//                     </button>
//                 </div>
//             </div>

//             {/* PDF scroll area */}
//             <div
//                 ref={containerRef}
//                 className="flex-1 overflow-auto bg-gray-100 rounded-b-lg"
//                 style={{
//                     scrollbarWidth: "thin",
//                     scrollbarColor: "#9CA3AF #F3F4F6",
//                 }}
//             >
//                 {pdfLoading && !pdfError && (
//                     <div className="flex flex-col items-center justify-center py-16">
//                         <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-indigo-600" />
//                         <p className="text-gray-400 text-xs mt-3">
//                             Loading PDF…
//                         </p>
//                     </div>
//                 )}
//                 {pdfError && (
//                     <div className="flex flex-col items-center justify-center py-16 text-center px-4">
//                         <AlertCircle size={32} className="text-red-400 mb-2" />
//                         <p className="text-sm text-red-600">{pdfError}</p>
//                     </div>
//                 )}
//                 {!pdfError && (
//                     <Document
//                         file={url}
//                         onLoadSuccess={onDocumentLoadSuccess}
//                         onLoadError={onDocumentLoadError}
//                         loading={null}
//                         className="flex flex-col items-center py-4 gap-4"
//                     >
//                         {numPages &&
//                             Array.from({ length: numPages }, (_, i) => (
//                                 <div
//                                     key={`page_${i + 1}`}
//                                     ref={(el) => (pageRefs.current[i] = el)}
//                                     data-page={i}
//                                 >
//                                     <Page
//                                         pageNumber={i + 1}
//                                         scale={scale}
//                                         renderTextLayer={true}
//                                         renderAnnotationLayer={true}
//                                         className="shadow-md bg-white overflow-hidden"
//                                         loading={
//                                             <div className="w-[400px] h-[500px] bg-gray-200 animate-pulse" />
//                                         }
//                                     />
//                                 </div>
//                             ))}
//                     </Document>
//                 )}
//             </div>
//         </div>
//     );
// };

// // ─── Info Card ─────────────────────────────────────────────────────────────────
// const InfoCard = ({
//     icon: Icon,
//     label,
//     value,
//     children,
//     accent = "indigo",
// }) => {
//     const accentMap = {
//         indigo: {
//             wrap: "bg-indigo-50 border-indigo-100",
//             icon: "text-indigo-500",
//             label: "text-indigo-400",
//         },
//         violet: {
//             wrap: "bg-violet-50 border-violet-100",
//             icon: "text-violet-500",
//             label: "text-violet-400",
//         },
//         sky: {
//             wrap: "bg-sky-50 border-sky-100",
//             icon: "text-sky-500",
//             label: "text-sky-400",
//         },
//         rose: {
//             wrap: "bg-rose-50 border-rose-100",
//             icon: "text-rose-500",
//             label: "text-rose-400",
//         },
//         teal: {
//             wrap: "bg-teal-50 border-teal-100",
//             icon: "text-teal-500",
//             label: "text-teal-400",
//         },
//         amber: {
//             wrap: "bg-amber-50 border-amber-100",
//             icon: "text-amber-500",
//             label: "text-amber-400",
//         },
//     };
//     const a = accentMap[accent] || accentMap.indigo;

//     return (
//         <div className={`rounded-xl border p-4 flex flex-col gap-2 ${a.wrap}`}>
//             <div className="flex items-center gap-2">
//                 <Icon size={14} className={a.icon} />
//                 <span
//                     className={`text-[10px] font-bold uppercase tracking-widest ${a.label}`}
//                 >
//                     {label}
//                 </span>
//             </div>
//             {children || (
//                 <p className="text-sm font-semibold text-gray-800 truncate">
//                     {value || "—"}
//                 </p>
//             )}
//         </div>
//     );
// };

// // ─── Main Popup ────────────────────────────────────────────────────────────────
// const TicketPopup = ({ ticket, onClose }) => {
//     const isPdf = ticket.image && ticket.image.toLowerCase().endsWith(".pdf");
//     const hasAttachment = !!ticket.image;

//     const status = statusConfig[ticket.status] || {
//         label: ticket.status,
//         bg: "bg-gray-100",
//         text: "text-gray-600",
//         dot: "bg-gray-400",
//     };
//     const priority = priorityConfig[ticket.priority] || {
//         bg: "bg-gray-100",
//         text: "text-gray-600",
//         dot: "bg-gray-400",
//         border: "border-gray-200",
//     };

//     // Prevent background scroll when popup is open
//     // Prevent background scroll when popup is open
//     useEffect(() => {
//         document.body.style.overflow = "hidden";
//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, []);

//     const formatDate = (dateStr) => {
//         if (!dateStr) return "—";
//         return new Date(dateStr).toLocaleString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     const handleBackdropClick = (e) => {
//         if (e.target === e.currentTarget) onClose();
//     };

//     useEffect(() => {
//         const handler = (e) => {
//             if (e.key === "Escape") onClose();
//         };
//         window.addEventListener("keydown", handler);
//         return () => window.removeEventListener("keydown", handler);
//     }, [onClose]);

//     return (
//         <div
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={handleBackdropClick}
//         >
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
//                 {/* ── Header (unchanged) ── */}
//                 <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
//                     <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
//                             <Eye size={16} className="text-white" />
//                         </div>
//                         <div>
//                             <h2 className="text-base font-bold text-gray-900">
//                                 Ticket Details
//                             </h2>
//                             <p className="text-xs text-indigo-600 font-mono font-semibold">
//                                 {ticket.ticket_id}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <span
//                             className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${status.bg} ${status.text}`}
//                         >
//                             <span
//                                 className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
//                             />
//                             {status.label}
//                         </span>
//                         <span
//                             className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${priority.bg} ${priority.text} ${priority.border}`}
//                         >
//                             <span
//                                 className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}
//                             />
//                             {ticket.priority}
//                         </span>
//                         <button
//                             onClick={onClose}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-1"
//                         >
//                             <X size={18} className="text-gray-500" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* ── Scrollable Body ── */}
//                 <div
//                     className="flex-1 overflow-y-auto"
//                     style={{
//                         scrollbarWidth: "thin",
//                         scrollbarColor: "#C7D2FE #F5F3FF",
//                     }}
//                 >
//                     <div className="px-6 py-5 space-y-6">
//                         {/* ── Details Grid ── */}
//                         <div>
//                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
//                                 Client & Ticket Info
//                             </p>
//                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                                 <InfoCard
//                                     icon={Hash}
//                                     label="Ticket ID"
//                                     value={ticket.ticket_id}
//                                     accent="indigo"
//                                 />
//                                 <InfoCard
//                                     icon={User}
//                                     label="Client"
//                                     value={ticket.client_name}
//                                     accent="violet"
//                                 />
//                                 <InfoCard
//                                     icon={Mail}
//                                     label="Email"
//                                     value={ticket.email}
//                                     accent="sky"
//                                 />
//                                 <InfoCard
//                                     icon={Tag}
//                                     label="Category"
//                                     value={ticket.issue_type}
//                                     accent="rose"
//                                 />
//                                 <InfoCard
//                                     icon={FileText}
//                                     label="Subject"
//                                     value={ticket.device_type}
//                                     accent="teal"
//                                 />

//                                 <InfoCard
//                                     icon={Wrench}
//                                     label="Technician"
//                                     accent="amber"
//                                 >
//                                     {ticket.technician_name ? (
//                                         <div className="flex items-center gap-2">
//                                             <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
//                                                 <span className="text-[10px] font-bold text-amber-700">
//                                                     {ticket.technician_name
//                                                         .charAt(0)
//                                                         .toUpperCase()}
//                                                 </span>
//                                             </div>
//                                             <span className="text-sm font-semibold text-gray-800 truncate">
//                                                 {ticket.technician_name}
//                                             </span>
//                                         </div>
//                                     ) : (
//                                         <span className="text-sm text-gray-400 italic">
//                                             Unassigned
//                                         </span>
//                                     )}
//                                 </InfoCard>
//                             </div>
//                         </div>

//                         {/* ── Timestamps ── */}
//                         <div className="grid grid-cols-2 gap-3">
//                             <InfoCard
//                                 icon={Calendar}
//                                 label="Created At"
//                                 accent="indigo"
//                             >
//                                 <p className="text-sm font-semibold text-gray-800">
//                                     {formatDate(ticket.created_at)}
//                                 </p>
//                             </InfoCard>
//                             <InfoCard
//                                 icon={Clock}
//                                 label="Last Updated"
//                                 accent="violet"
//                             >
//                                 <p className="text-sm font-semibold text-gray-800">
//                                     {formatDate(ticket.updated_at)}
//                                 </p>
//                             </InfoCard>
//                         </div>

//                         {/* ── Problem Description ── */}
//                         <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
//                             <div className="flex items-center gap-2 mb-3">
//                                 <FileText
//                                     size={14}
//                                     className="text-indigo-500"
//                                 />
//                                 <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
//                                     Problem Description
//                                 </span>
//                             </div>
//                             <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
//                                 {ticket.problem_description || "—"}
//                             </p>
//                         </div>

//                         {/* ── Attachment ── */}
//                         {hasAttachment && (
//                             <div>
//                                 <div className="flex items-center justify-between mb-3">
//                                     <div className="flex items-center gap-2">
//                                         <Paperclip
//                                             size={14}
//                                             className="text-gray-400"
//                                         />
//                                         <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
//                                             Attachment
//                                         </span>
//                                     </div>
//                                     <a
//                                         href={ticket.image}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
//                                     >
//                                         <svg
//                                             className="w-3 h-3"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             viewBox="0 0 24 24"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
//                                             />
//                                         </svg>
//                                         Open in new tab
//                                     </a>
//                                 </div>

//                                 <div
//                                     className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden"
//                                     style={{ height: isPdf ? "480px" : "auto" }}
//                                 >
//                                     {isPdf ? (
//                                         <PdfViewer url={ticket.image} />
//                                     ) : (
//                                         <div className="w-full flex items-center justify-center p-4 bg-gray-50">
//                                             <img
//                                                 src={ticket.image}
//                                                 alt="Ticket attachment"
//                                                 className="max-w-full max-h-[400px] object-contain rounded-lg shadow-md"
//                                             />
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TicketPopup;


import React, { useState, useCallback, useRef, useEffect } from "react";
import {
    X,
    User,
    Tag,
    Monitor,
    AlertCircle,
    FileText,
    Mail,
    Calendar,
    Hash,
    Eye,
    Wrench,
    Clock,
    Paperclip,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

 const imgurl = import.meta.env.VITE_IMAGE_PATH;

// ─── Storage URL Helper ────────────────────────────────────────────────────────
// Converts a stored path (e.g. "attachments/file.pdf") to a public /storage/ URL.
// If the path is already a full http/https URL it is returned unchanged.
const storageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${imgurl}/${path.replace(/^\//, "")}`;
};

// ─── Status / Priority Config ──────────────────────────────────────────────────
const statusConfig = {
    open: {
        label: "Open",
        bg: "bg-blue-100",
        text: "text-blue-700",
        dot: "bg-blue-500",
    },
    in_progress: {
        label: "In Progress",
        bg: "bg-orange-100",
        text: "text-orange-700",
        dot: "bg-orange-500",
    },
    waiting_parts: {
        label: "Waiting Parts",
        bg: "bg-purple-100",
        text: "text-purple-700",
        dot: "bg-purple-500",
    },
    client_approval: {
        label: "Client Approval",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        dot: "bg-yellow-500",
    },
    completed: {
        label: "Completed",
        bg: "bg-green-100",
        text: "text-green-700",
        dot: "bg-green-500",
    },
    closed: {
        label: "Closed",
        bg: "bg-gray-100",
        text: "text-gray-600",
        dot: "bg-gray-400",
    },
};

const priorityConfig = {
    High: {
        bg: "bg-red-100",
        text: "text-red-700",
        dot: "bg-red-500",
        border: "border-red-200",
    },
    Medium: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        dot: "bg-yellow-500",
        border: "border-yellow-200",
    },
    Low: {
        bg: "bg-green-100",
        text: "text-green-700",
        dot: "bg-green-500",
        border: "border-green-200",
    },
    high: {
        bg: "bg-red-100",
        text: "text-red-700",
        dot: "bg-red-500",
        border: "border-red-200",
    },
    medium: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        dot: "bg-yellow-500",
        border: "border-yellow-200",
    },
    low: {
        bg: "bg-green-100",
        text: "text-green-700",
        dot: "bg-green-500",
        border: "border-green-200",
    },
};

// ─── PDF Viewer ────────────────────────────────────────────────────────────────
const PdfViewer = ({ url }) => {
    const [numPages, setNumPages] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [pdfLoading, setPdfLoading] = useState(true);
    const [pdfError, setPdfError] = useState(null);
    const [currentPageInView, setCurrentPageInView] = useState(1);

    const containerRef = useRef(null);
    const pageRefs = useRef([]);

    const onDocumentLoadSuccess = useCallback(({ numPages }) => {
        setNumPages(numPages);
        setPdfLoading(false);
        setPdfError(null);
        pageRefs.current = pageRefs.current.slice(0, numPages);
    }, []);

    const onDocumentLoadError = useCallback((err) => {
        console.error("PDF load error:", err);
        setPdfError("Failed to load PDF.");
        setPdfLoading(false);
    }, []);

    useEffect(() => {
        if (!numPages) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setCurrentPageInView(
                            parseInt(entry.target.dataset.page, 10) + 1,
                        );
                    }
                });
            },
            { threshold: 0.5 },
        );
        pageRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });
        return () => {
            pageRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [numPages, scale]);

    const zoomIn = () => setScale((p) => Math.min(p + 0.2, 2.0));
    const zoomOut = () => setScale((p) => Math.max(p - 0.2, 0.6));
    const resetZoom = () => setScale(1.0);

    return (
        <div className="flex flex-col h-full">
            {/* PDF toolbar */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg shrink-0">
                <div className="flex items-center gap-2">
                    <FileText size={14} className="text-red-500" />
                    <span className="text-xs font-medium text-gray-600">
                        PDF Document
                    </span>
                    {numPages && (
                        <span className="text-xs text-gray-400">
                            — Page{" "}
                            <span className="font-medium text-gray-600">
                                {currentPageInView}
                            </span>{" "}
                            of {numPages}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
                    <button
                        onClick={zoomOut}
                        disabled={scale <= 0.6}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
                    >
                        <svg
                            className="w-3.5 h-3.5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                            />
                        </svg>
                    </button>
                    <span className="px-2 text-xs font-medium text-gray-600 min-w-[42px] text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={zoomIn}
                        disabled={scale >= 2.0}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
                    >
                        <svg
                            className="w-3.5 h-3.5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={resetZoom}
                        className="px-2 py-1 text-xs hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                    >
                        reset
                    </button>
                </div>
            </div>

            {/* PDF scroll area */}
            <div
                ref={containerRef}
                className="flex-1 overflow-auto bg-gray-100 rounded-b-lg"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#9CA3AF #F3F4F6",
                }}
            >
                {pdfLoading && !pdfError && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-indigo-600" />
                        <p className="text-gray-400 text-xs mt-3">
                            Loading PDF…
                        </p>
                    </div>
                )}
                {pdfError && (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                        <AlertCircle size={32} className="text-red-400 mb-2" />
                        <p className="text-sm text-red-600">{pdfError}</p>
                    </div>
                )}
                {!pdfError && (
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null}
                        className="flex flex-col items-center py-4 gap-4"
                    >
                        {numPages &&
                            Array.from({ length: numPages }, (_, i) => (
                                <div
                                    key={`page_${i + 1}`}
                                    ref={(el) => (pageRefs.current[i] = el)}
                                    data-page={i}
                                >
                                    <Page
                                        pageNumber={i + 1}
                                        scale={scale}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                        className="shadow-md bg-white overflow-hidden"
                                        loading={
                                            <div className="w-[400px] h-[500px] bg-gray-200 animate-pulse" />
                                        }
                                    />
                                </div>
                            ))}
                    </Document>
                )}
            </div>
        </div>
    );
};

// ─── Info Card ─────────────────────────────────────────────────────────────────
const InfoCard = ({
    icon: Icon,
    label,
    value,
    children,
    accent = "indigo",
}) => {
    const accentMap = {
        indigo: {
            wrap: "bg-indigo-50 border-indigo-100",
            icon: "text-indigo-500",
            label: "text-indigo-400",
        },
        violet: {
            wrap: "bg-violet-50 border-violet-100",
            icon: "text-violet-500",
            label: "text-violet-400",
        },
        sky: {
            wrap: "bg-sky-50 border-sky-100",
            icon: "text-sky-500",
            label: "text-sky-400",
        },
        rose: {
            wrap: "bg-rose-50 border-rose-100",
            icon: "text-rose-500",
            label: "text-rose-400",
        },
        teal: {
            wrap: "bg-teal-50 border-teal-100",
            icon: "text-teal-500",
            label: "text-teal-400",
        },
        amber: {
            wrap: "bg-amber-50 border-amber-100",
            icon: "text-amber-500",
            label: "text-amber-400",
        },
    };
    const a = accentMap[accent] || accentMap.indigo;

    return (
        <div className={`rounded-xl border p-4 flex flex-col gap-2 ${a.wrap}`}>
            <div className="flex items-center gap-2">
                <Icon size={14} className={a.icon} />
                <span
                    className={`text-[10px] font-bold uppercase tracking-widest ${a.label}`}
                >
                    {label}
                </span>
            </div>
            {children || (
                <p className="text-sm font-semibold text-gray-800 truncate">
                    {value || "—"}
                </p>
            )}
        </div>
    );
};

// ─── Main Popup ────────────────────────────────────────────────────────────────
const TicketPopup = ({ ticket, onClose }) => {
    // ── Derive the public URL once from the stored path ──────────────────────
    const attachmentUrl = storageUrl(ticket.image);
    const isPdf =
        attachmentUrl && attachmentUrl.toLowerCase().endsWith(".pdf");
    const hasAttachment = !!attachmentUrl;

    const status = statusConfig[ticket.status] || {
        label: ticket.status,
        bg: "bg-gray-100",
        text: "text-gray-600",
        dot: "bg-gray-400",
    };
    const priority = priorityConfig[ticket.priority] || {
        bg: "bg-gray-100",
        text: "text-gray-600",
        dot: "bg-gray-400",
        border: "border-gray-200",
    };

    // Prevent background scroll when popup is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                            <Eye size={16} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                Ticket Details
                            </h2>
                            <p className="text-xs text-indigo-600 font-mono font-semibold">
                                {ticket.ticket_id}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${status.bg} ${status.text}`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                            />
                            {status.label}
                        </span>
                        <span
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${priority.bg} ${priority.text} ${priority.border}`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}
                            />
                            {ticket.priority}
                        </span>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-1"
                        >
                            <X size={18} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* ── Scrollable Body ── */}
                <div
                    className="flex-1 overflow-y-auto"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#C7D2FE #F5F3FF",
                    }}
                >
                    <div className="px-6 py-5 space-y-6">
                        {/* ── Details Grid ── */}
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                                Client & Ticket Info
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <InfoCard
                                    icon={Hash}
                                    label="Ticket ID"
                                    value={ticket.ticket_id}
                                    accent="indigo"
                                />
                                <InfoCard
                                    icon={User}
                                    label="Client"
                                    value={ticket.client_name}
                                    accent="violet"
                                />
                                <InfoCard
                                    icon={Mail}
                                    label="Email"
                                    value={ticket.email}
                                    accent="sky"
                                />
                                <InfoCard
                                    icon={Tag}
                                    label="Category"
                                    value={ticket.issue_type}
                                    accent="rose"
                                />
                                <InfoCard
                                    icon={FileText}
                                    label="Subject"
                                    value={ticket.device_type}
                                    accent="teal"
                                />
                                <InfoCard
                                    icon={Wrench}
                                    label="Technician"
                                    accent="amber"
                                >
                                    {ticket.technician_name ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                                                <span className="text-[10px] font-bold text-amber-700">
                                                    {ticket.technician_name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-800 truncate">
                                                {ticket.technician_name}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">
                                            Unassigned
                                        </span>
                                    )}
                                </InfoCard>
                            </div>
                        </div>

                        {/* ── Timestamps ── */}
                        <div className="grid grid-cols-2 gap-3">
                            <InfoCard
                                icon={Calendar}
                                label="Created At"
                                accent="indigo"
                            >
                                <p className="text-sm font-semibold text-gray-800">
                                    {formatDate(ticket.created_at)}
                                </p>
                            </InfoCard>
                            <InfoCard
                                icon={Clock}
                                label="Last Updated"
                                accent="violet"
                            >
                                <p className="text-sm font-semibold text-gray-800">
                                    {formatDate(ticket.updated_at)}
                                </p>
                            </InfoCard>
                        </div>

                        {/* ── Problem Description ── */}
                        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText
                                    size={14}
                                    className="text-indigo-500"
                                />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                                    Problem Description
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {ticket.problem_description || "—"}
                            </p>
                        </div>

                        {/* ── Attachment ── */}
                        {hasAttachment && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Paperclip
                                            size={14}
                                            className="text-gray-400"
                                        />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            Attachment
                                        </span>
                                    </div>
                                    <a
                                        href={attachmentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                                    >
                                        <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                        Open in new tab
                                    </a>
                                </div>

                                <div
                                    className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden"
                                    style={{ height: isPdf ? "480px" : "auto" }}
                                >
                                    {isPdf ? (
                                        <PdfViewer url={attachmentUrl} />
                                    ) : (
                                        <div className="w-full flex items-center justify-center p-4 bg-gray-50">
                                            <img
                                                src={attachmentUrl}
                                                alt="Ticket attachment"
                                                className="max-w-full max-h-[400px] object-contain rounded-lg shadow-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketPopup;