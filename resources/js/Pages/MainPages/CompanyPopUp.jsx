import React, { useEffect, useState } from "react";
import {
    X,
    Building,
    Mail,
    Phone,
    MapPin,
    User,
    Users,
    FileText,
    Calendar,
    Clock,
    CheckCircle,
    Download,
    TrendingUp,
    ExternalLink,
    Image as ImageIcon,
} from "lucide-react";
import { Link } from "@inertiajs/react";

// Helper function to format agenda text with HTML parsing
const formatAgendaText = (text) => {
    if (!text) return "";

    // First, decode any HTML entities
    const decodeEntities = (str) => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = str;
        return textarea.value;
    };

    let decodedText = decodeEntities(text);

    // Preserve line breaks
    decodedText = decodedText.replace(/\n/g, "<br>");

    // Split by <br> tags to process line by line
    let lines = decodedText.split("<br>");
    let formattedLines = [];
    let inNumberedList = false;
    let inBulletList = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) {
            // Empty line - close lists if open
            if (inNumberedList) {
                formattedLines.push("</ol>");
                inNumberedList = false;
            }
            if (inBulletList) {
                formattedLines.push("</ul>");
                inBulletList = false;
            }
            formattedLines.push("<br>");
            continue;
        }

        // Check for numbered list items (1., 2., etc.)
        const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
        if (numberedMatch) {
            if (!inNumberedList) {
                // Close bullet list if open
                if (inBulletList) {
                    formattedLines.push("</ul>");
                    inBulletList = false;
                }
                formattedLines.push(
                    '<ol class="list-decimal pl-5 my-2 space-y-1">'
                );
                inNumberedList = true;
            }
            formattedLines.push(
                `<li class="ml-2 mb-1">${numberedMatch[2]}</li>`
            );
            continue;
        }

        // Check for bullet list items (-, *, •)
        const bulletMatch = line.match(/^([-*•])\s+(.+)$/);
        if (bulletMatch) {
            if (!inBulletList) {
                // Close numbered list if open
                if (inNumberedList) {
                    formattedLines.push("</ol>");
                    inNumberedList = false;
                }
                formattedLines.push(
                    '<ul class="list-disc pl-5 my-2 space-y-1">'
                );
                inBulletList = true;
            }
            formattedLines.push(`<li class="ml-2 mb-1">${bulletMatch[2]}</li>`);
            continue;
        }

        // Regular text - close any open lists
        if (inNumberedList) {
            formattedLines.push("</ol>");
            inNumberedList = false;
        }
        if (inBulletList) {
            formattedLines.push("</ul>");
            inBulletList = false;
        }

        // Add paragraph for regular text
        formattedLines.push(`<p class="my-1">${line}</p>`);
    }

    // Close any lists that are still open
    if (inNumberedList) {
        formattedLines.push("</ol>");
    }
    if (inBulletList) {
        formattedLines.push("</ul>");
    }

    // Join all lines
    let result = formattedLines.join("");

    // Remove consecutive <br> tags for cleaner output
    result = result.replace(/(<br>\s*){2,}/g, "<br>");

    return result;
};

const Modal = ({ isOpen, onClose, children }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            // Disable body scroll
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = "15px"; // Compensate for scrollbar width to prevent layout shift
        } else {
            // Enable body scroll
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0";
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                >
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    ></div>
                </div>

                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                >
                    &#8203;
                </span>

                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value, icon: Icon, className = "" }) => (
    <div className={`flex items-start py-2 ${className}`}>
        {Icon && (
            <Icon
                size={16}
                className="text-gray-500 mt-0.5 mr-3 flex-shrink-0"
            />
        )}
        <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 mb-1">
                {label}
            </div>
            <div className="text-sm text-gray-900 truncate" title={value}>
                {value || <span className="text-gray-400">N/A</span>}
            </div>
        </div>
    </div>
);

const Section = ({ title, children, icon: Icon, subtitle }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 shadow-sm">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon size={18} className="text-gray-700" />
                    </div>
                )}
                <div>
                    <h3 className="text-base font-semibold text-gray-900">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

const CompanyPopUp = ({
    selectedCompany,
    isModalOpen,
    closeModal,
    onSubmitFollowUp,
    followUpLoading,
    isSubmitting,
    setValue,
    errors,
    register,
    handleSubmit,
}) => {
    useEffect(() => {
        if (selectedCompany?.follow_up_date) {
            setValue(
                "followUpDate",
                selectedCompany.follow_up_date.split("T")[0]
            );
        }
    }, [selectedCompany, setValue]);

    if (!selectedCompany) return null;

    const hasMeeting = !!selectedCompany.meetings;
    const hasContract = !!selectedCompany.contracts;

    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const StepCard = ({
        number,
        title,
        isCompleted,
        isActive,
        icon: Icon,
        children,
    }) => (
        <div
            className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                isCompleted
                    ? "border-emerald-200 bg-white"
                    : isActive
                    ? "border-blue-200 bg-white"
                    : "border-gray-200 bg-white"
            }`}
        >
            <div
                className={`flex items-center justify-between p-4 ${
                    isCompleted
                        ? "bg-white"
                        : isActive
                        ? "bg-white"
                        : "bg-white"
                }`}
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted
                                ? "bg-emerald-100"
                                : isActive
                                ? "bg-blue-100"
                                : "bg-gray-100"
                        }`}
                    >
                        {isCompleted ? (
                            <CheckCircle
                                size={18}
                                className="text-emerald-600"
                            />
                        ) : Icon ? (
                            <Icon
                                size={18}
                                className={
                                    isActive ? "text-blue-600" : "text-gray-400"
                                }
                            />
                        ) : (
                            <span
                                className={`text-sm font-medium ${
                                    isActive ? "text-blue-600" : "text-gray-400"
                                }`}
                            >
                                {number}
                            </span>
                        )}
                    </div>
                    <div>
                        {/* <div className="text-xs text-gray-500">
                            Step {number}
                        </div> */}
                        <div className="text-sm font-medium text-gray-900">
                            {title}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-5 pt-4 border-t border-gray-100">{children}</div>
        </div>
    );

    const ContractImage = ({ imageUrl }) => {
        const [imageError, setImageError] = useState(false);

        const handleSimpleDownload = (imageUrl) => {
            const link = document.createElement("a");
            link.href = `${imgurl}/${imageUrl}`;
            link.download = imageUrl.split("/").pop() || "contract";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        return (
            <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                    {imageUrl ? (
                        <div className="relative">
                            {imageError ? (
                                <div className="aspect-video flex items-center justify-center bg-gray-100 min-h-[200px]">
                                    <div className="text-center p-6">
                                        <ImageIcon
                                            size={48}
                                            className="text-gray-300 mx-auto mb-3"
                                        />
                                        <p className="text-sm text-gray-500">
                                            Unable to load image
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={`${imgurl}/${imageUrl}`}
                                    alt="Contract"
                                    className="w-full h-auto max-h-[400px] object-contain"
                                    onError={() => setImageError(true)}
                                    loading="lazy"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="aspect-video flex items-center justify-center bg-gray-100 min-h-[200px]">
                            <div className="text-center p-6">
                                <ImageIcon
                                    size={48}
                                    className="text-gray-300 mx-auto mb-3"
                                />
                                <p className="text-sm text-gray-500">
                                    No contract image available
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {imageUrl && !imageError && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={`${imgurl}/${imageUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            <ExternalLink size={16} />
                            <span className="hidden sm:inline">
                                Open in New Tab
                            </span>
                            <span className="sm:hidden">View Full</span>
                        </a>
                        <button
                            onClick={() => handleSimpleDownload(imageUrl)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                            <Download size={16} />
                            Download
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="bg-white">
                {/* Header */}
                <div className="lg:sticky top-0 z-10 bg-white px-6 pt-6 pb-2 border-b border-gray-200">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="p-2.5 bg-gray-100 rounded-lg">
                                <Building className="w-6 h-6 text-gray-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2
                                    className="text-xl font-semibold text-gray-900 truncate"
                                    title={selectedCompany.company_name}
                                >
                                    {selectedCompany.company_name}
                                </h2>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                        <Calendar size={12} />
                                        <span>
                                            Created:{" "}
                                            {new Date(
                                                selectedCompany.created_at
                                            ).toLocaleDateString("en-US", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={closeModal}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-6 lg:sticky -top-2 self-start">
                            {/* CRM Steps */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <TrendingUp
                                                size={18}
                                                className="text-gray-700"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">
                                                CRM Pipeline
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Track progress through each
                                                stage
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Step 1: Meeting */}
                                        <StepCard
                                            number={1}
                                            title="Meeting"
                                            isCompleted={hasMeeting}
                                            isActive={!hasMeeting}
                                            icon={Calendar}
                                        >
                                            {hasMeeting ? (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InfoRow
                                                            label="Date"
                                                            value={
                                                                selectedCompany
                                                                    .meetings
                                                                    .meeting_date
                                                            }
                                                            icon={Calendar}
                                                        />
                                                        <InfoRow
                                                            label="Time"
                                                            value={
                                                                selectedCompany
                                                                    .meetings
                                                                    .meeting_time
                                                            }
                                                            icon={Clock}
                                                        />
                                                        <InfoRow
                                                            label="Type"
                                                            value={
                                                                selectedCompany
                                                                    .meetings
                                                                    .meeting_type
                                                            }
                                                            icon={Users}
                                                        />
                                                        {selectedCompany
                                                            .meetings
                                                            .meeting_location ? (
                                                            <InfoRow
                                                                label="Location"
                                                                value={
                                                                    selectedCompany
                                                                        .meetings
                                                                        .meeting_location
                                                                }
                                                                icon={MapPin}
                                                            />
                                                        ) : selectedCompany
                                                              .meetings
                                                              .phone_details ? (
                                                            <InfoRow
                                                                label="Phone Details"
                                                                value={
                                                                    selectedCompany
                                                                        .meetings
                                                                        .phone_details
                                                                }
                                                                icon={Phone}
                                                            />
                                                        ) : null}
                                                    </div>

                                                    {selectedCompany.meetings
                                                        .attendee && (
                                                        <div className="space-y-2">
                                                            <div className="text-xs font-medium text-gray-700">
                                                                Attendees
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {
                                                                    selectedCompany
                                                                        .meetings
                                                                        .attendee
                                                                }
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Fixed Agenda Section with HTML Parsing */}
                                                    {selectedCompany.meetings
                                                        .agenda && (
                                                        <div className="space-y-2">
                                                            <div className="text-xl text-start font-medium text-gray-700">
                                                                Agenda
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg agenda-content"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: formatAgendaText(
                                                                        selectedCompany
                                                                            .meetings
                                                                            .agenda
                                                                    ),
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 text-sm text-gray-500">
                                                    No meeting scheduled
                                                </div>
                                            )}
                                        </StepCard>

                                        {/* Step 2: Contract */}
                                        <StepCard
                                            number={2}
                                            title="Contract"
                                            isCompleted={hasContract}
                                            isActive={
                                                hasMeeting && !hasContract
                                            }
                                            icon={FileText}
                                        >
                                            {hasContract ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(
                                                                selectedCompany.contracts.created_at
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>

                                                    <ContractImage
                                                        imageUrl={
                                                            selectedCompany
                                                                .contracts.image
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 text-sm text-gray-500">
                                                    No contract uploaded
                                                </div>
                                            )}
                                        </StepCard>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6 lg:sticky -top-2 self-start">
                            {/* Company Details */}
                            <Section title="Company Details" icon={Building}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-3">
                                        <InfoRow
                                            label="Full Name"
                                            value={selectedCompany.full_name}
                                            icon={User}
                                        />
                                        <InfoRow
                                            label="Designation"
                                            value={selectedCompany.designation}
                                            icon={User}
                                        />
                                        <InfoRow
                                            label="Email"
                                            value={selectedCompany.email}
                                            icon={Mail}
                                        />
                                        <InfoRow
                                            label="Phone"
                                            value={selectedCompany.phone_no}
                                            icon={Phone}
                                        />
                                        <InfoRow
                                            label="Address"
                                            value={selectedCompany.address}
                                            icon={MapPin}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="pt-3 border-t border-gray-200">
                                        <div className="grid grid-cols-1 gap-3">
                                            <InfoRow
                                                label="Responsible Person"
                                                value={
                                                    selectedCompany.responsible_person
                                                }
                                                icon={User}
                                            />
                                            <InfoRow
                                                label="Our Team"
                                                value={selectedCompany.our_team}
                                                icon={Users}
                                            />
                                            <InfoRow
                                                label="Client Member"
                                                value={
                                                    selectedCompany.client_member
                                                }
                                                icon={Users}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            {/* Follow-up Date Card */}
                            <Section title="Next Follow-up" icon={Calendar}>
                                <div className="space-y-4">
                                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                        <div className="text-3xl font-bold text-blue-700 mb-1">
                                            {selectedCompany.follow_up_date
                                                ? new Date(
                                                      selectedCompany.follow_up_date
                                                  ).getDate()
                                                : "--"}
                                        </div>
                                        <div className="text-sm font-medium text-blue-600">
                                            {selectedCompany.follow_up_date
                                                ? new Date(
                                                      selectedCompany.follow_up_date
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          month: "long",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : "Not scheduled"}
                                        </div>
                                        <div className="text-xs text-blue-500 mt-2">
                                            Days until:{" "}
                                            {selectedCompany.follow_up_date
                                                ? Math.ceil(
                                                      (new Date(
                                                          selectedCompany.follow_up_date
                                                      ) -
                                                          new Date()) /
                                                          (1000 * 60 * 60 * 24)
                                                  )
                                                : "∞"}
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={handleSubmit(
                                            onSubmitFollowUp
                                        )}
                                        className="space-y-3"
                                    >
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Update Date
                                            </label>
                                            <input
                                                type="date"
                                                {...register("followUpDate", {
                                                    required:
                                                        "Follow-up date is required",
                                                })}
                                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                    errors.followUpDate
                                                        ? "border-red-300 bg-red-50"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            {errors.followUpDate && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {
                                                        errors.followUpDate
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={
                                                followUpLoading || isSubmitting
                                            }
                                            className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                                                followUpLoading || isSubmitting
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg"
                                            }`}
                                        >
                                            {followUpLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Updating...
                                                </span>
                                            ) : (
                                                "Update Follow-up"
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </Section>
                        </div>
                    </div>
                </div>

                <div className="lg:sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <div className="text-xs text-gray-500 sm:text-sm">
                            Last updated:{" "}
                            {new Date(
                                selectedCompany.updated_at
                            ).toLocaleString()}
                        </div>
                        <div className="flex w-full justify-between gap-2 sm:w-auto sm:justify-end">
                            <button
                                onClick={closeModal}
                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:flex-none sm:px-4 sm:py-2.5 sm:text-sm"
                            >
                                Close
                            </button>
                            <Link
                                href={`/crm/details/${selectedCompany.slug}`}
                                className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-gray-800 sm:flex-none sm:px-4 sm:py-2.5 sm:text-sm"
                            >
                                Edit Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CompanyPopUp;




// import React, { useEffect, useState } from "react";
// import {
//     X,
//     Building,
//     Mail,
//     Phone,
//     MapPin,
//     User,
//     Users,
//     FileText,
//     Calendar,
//     Clock,
//     CheckCircle,
//     Download,
//     TrendingUp,
//     ExternalLink,
//     Image as ImageIcon,
// } from "lucide-react";
// import { Link } from "@inertiajs/react";

// // Helper function to format agenda text with HTML parsing
// const formatAgendaText = (text) => {
//     if (!text) return "";

//     // First, decode any HTML entities
//     const decodeEntities = (str) => {
//         const textarea = document.createElement("textarea");
//         textarea.innerHTML = str;
//         return textarea.value;
//     };

//     let decodedText = decodeEntities(text);

//     // Preserve line breaks
//     decodedText = decodedText.replace(/\n/g, "<br>");

//     // Split by <br> tags to process line by line
//     let lines = decodedText.split("<br>");
//     let formattedLines = [];
//     let inNumberedList = false;
//     let inBulletList = false;

//     for (let i = 0; i < lines.length; i++) {
//         const line = lines[i].trim();

//         if (!line) {
//             // Empty line - close lists if open
//             if (inNumberedList) {
//                 formattedLines.push("</ol>");
//                 inNumberedList = false;
//             }
//             if (inBulletList) {
//                 formattedLines.push("</ul>");
//                 inBulletList = false;
//             }
//             formattedLines.push("<br>");
//             continue;
//         }

//         // Check for numbered list items (1., 2., etc.)
//         const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
//         if (numberedMatch) {
//             if (!inNumberedList) {
//                 // Close bullet list if open
//                 if (inBulletList) {
//                     formattedLines.push("</ul>");
//                     inBulletList = false;
//                 }
//                 formattedLines.push(
//                     '<ol class="list-decimal pl-5 my-2 space-y-1">'
//                 );
//                 inNumberedList = true;
//             }
//             formattedLines.push(
//                 `<li class="ml-2 mb-1">${numberedMatch[2]}</li>`
//             );
//             continue;
//         }

//         // Check for bullet list items (-, *, •)
//         const bulletMatch = line.match(/^([-*•])\s+(.+)$/);
//         if (bulletMatch) {
//             if (!inBulletList) {
//                 // Close numbered list if open
//                 if (inNumberedList) {
//                     formattedLines.push("</ol>");
//                     inNumberedList = false;
//                 }
//                 formattedLines.push(
//                     '<ul class="list-disc pl-5 my-2 space-y-1">'
//                 );
//                 inBulletList = true;
//             }
//             formattedLines.push(`<li class="ml-2 mb-1">${bulletMatch[2]}</li>`);
//             continue;
//         }

//         // Regular text - close any open lists
//         if (inNumberedList) {
//             formattedLines.push("</ol>");
//             inNumberedList = false;
//         }
//         if (inBulletList) {
//             formattedLines.push("</ul>");
//             inBulletList = false;
//         }

//         // Add paragraph for regular text
//         formattedLines.push(`<p class="my-1">${line}</p>`);
//     }

//     // Close any lists that are still open
//     if (inNumberedList) {
//         formattedLines.push("</ol>");
//     }
//     if (inBulletList) {
//         formattedLines.push("</ul>");
//     }

//     // Join all lines
//     let result = formattedLines.join("");

//     // Remove consecutive <br> tags for cleaner output
//     result = result.replace(/(<br>\s*){2,}/g, "<br>");

//     return result;
// };

// const Modal = ({ isOpen, onClose, children }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//             <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//                 <div
//                     className="fixed inset-0 transition-opacity"
//                     aria-hidden="true"
//                 >
//                     <div
//                         className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
//                         onClick={onClose}
//                     ></div>
//                 </div>

//                 <span
//                     className="hidden sm:inline-block sm:align-middle sm:h-screen"
//                     aria-hidden="true"
//                 >
//                     &#8203;
//                 </span>

//                 <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const InfoRow = ({ label, value, icon: Icon, className = "" }) => (
//     <div className={`flex items-start py-2 ${className}`}>
//         {Icon && (
//             <Icon
//                 size={16}
//                 className="text-gray-500 mt-0.5 mr-3 flex-shrink-0"
//             />
//         )}
//         <div className="flex-1 min-w-0">
//             <div className="text-xs font-medium text-gray-500 mb-1">
//                 {label}
//             </div>
//             <div className="text-sm text-gray-900 truncate" title={value}>
//                 {value || <span className="text-gray-400">N/A</span>}
//             </div>
//         </div>
//     </div>
// );

// const Section = ({ title, children, icon: Icon, subtitle }) => (
//     <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 shadow-sm">
//         <div className="flex items-start justify-between mb-4">
//             <div className="flex items-center gap-3">
//                 {Icon && (
//                     <div className="p-2 bg-gray-100 rounded-lg">
//                         <Icon size={18} className="text-gray-700" />
//                     </div>
//                 )}
//                 <div>
//                     <h3 className="text-base font-semibold text-gray-900">
//                         {title}
//                     </h3>
//                     {subtitle && (
//                         <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//         <div className="space-y-4">{children}</div>
//     </div>
// );

// const CompanyPopUp = ({
//     selectedCompany,
//     isModalOpen,
//     closeModal,
//     onSubmitFollowUp,
//     followUpLoading,
//     isSubmitting,
//     setValue,
//     errors,
//     register,
//     handleSubmit,
// }) => {
//     useEffect(() => {
//         if (selectedCompany?.follow_up_date) {
//             setValue(
//                 "followUpDate",
//                 selectedCompany.follow_up_date.split("T")[0]
//             );
//         }
//     }, [selectedCompany, setValue]);

//     if (!selectedCompany) return null;

//     const hasMeeting = !!selectedCompany.meetings;
//     const hasContract = !!selectedCompany.contracts;

//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const StepCard = ({
//         number,
//         title,
//         isCompleted,
//         isActive,
//         icon: Icon,
//         children,
//     }) => (
//         <div
//             className={`border rounded-xl overflow-hidden transition-all duration-200 ${
//                 isCompleted
//                     ? "border-emerald-200 bg-white"
//                     : isActive
//                     ? "border-blue-200 bg-white"
//                     : "border-gray-200 bg-white"
//             }`}
//         >
//             <div
//                 className={`flex items-center justify-between p-4 ${
//                     isCompleted
//                         ? "bg-white"
//                         : isActive
//                         ? "bg-white"
//                         : "bg-white"
//                 }`}
//             >
//                 <div className="flex items-center gap-4">
//                     <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                             isCompleted
//                                 ? "bg-emerald-100"
//                                 : isActive
//                                 ? "bg-blue-100"
//                                 : "bg-gray-100"
//                         }`}
//                     >
//                         {isCompleted ? (
//                             <CheckCircle
//                                 size={18}
//                                 className="text-emerald-600"
//                             />
//                         ) : Icon ? (
//                             <Icon
//                                 size={18}
//                                 className={
//                                     isActive ? "text-blue-600" : "text-gray-400"
//                                 }
//                             />
//                         ) : (
//                             <span
//                                 className={`text-sm font-medium ${
//                                     isActive ? "text-blue-600" : "text-gray-400"
//                                 }`}
//                             >
//                                 {number}
//                             </span>
//                         )}
//                     </div>
//                     <div>
//                         {/* <div className="text-xs text-gray-500">
//                             Step {number}
//                         </div> */}
//                         <div className="text-sm font-medium text-gray-900">
//                             {title}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="p-5 pt-4 border-t border-gray-100">{children}</div>
//         </div>
//     );

//     const ContractImage = ({ imageUrl }) => {
//         const [imageError, setImageError] = useState(false);

//         const handleSimpleDownload = (imageUrl) => {
//             const link = document.createElement("a");
//             link.href = `${imgurl}/${imageUrl}`;
//             link.download = imageUrl.split('/').pop() || "contract";
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         };

//         return (
//             <div className="space-y-4">
//                 <div className="border rounded-lg overflow-hidden bg-gray-50">
//                     {imageUrl ? (
//                         <div className="relative">
//                             {imageError ? (
//                                 <div className="aspect-video flex items-center justify-center bg-gray-100 min-h-[200px]">
//                                     <div className="text-center p-6">
//                                         <ImageIcon
//                                             size={48}
//                                             className="text-gray-300 mx-auto mb-3"
//                                         />
//                                         <p className="text-sm text-gray-500">
//                                             Unable to load image
//                                         </p>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <img
//                                     src={`${imgurl}/${imageUrl}`}
//                                     alt="Contract"
//                                     className="w-full h-auto max-h-[400px] object-contain"
//                                     onError={() => setImageError(true)}
//                                     loading="lazy"
//                                 />
//                             )}
//                         </div>
//                     ) : (
//                         <div className="aspect-video flex items-center justify-center bg-gray-100 min-h-[200px]">
//                             <div className="text-center p-6">
//                                 <ImageIcon
//                                     size={48}
//                                     className="text-gray-300 mx-auto mb-3"
//                                 />
//                                 <p className="text-sm text-gray-500">
//                                     No contract image available
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {imageUrl && !imageError && (
//                     <div className="flex flex-col sm:flex-row gap-3">
//                         <a
//                             href={`${imgurl}/${imageUrl}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
//                         >
//                             <ExternalLink size={16} />
//                             <span className="hidden sm:inline">Open in New Tab</span>
//                             <span className="sm:hidden">View Full</span>
//                         </a>
//                         <button
//                             onClick={() => handleSimpleDownload(imageUrl)}
//                             className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
//                         >
//                             <Download size={16} />
//                             Download
//                         </button>
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <Modal isOpen={isModalOpen} onClose={closeModal}>
//             <div className="bg-white">
//                 {/* Header */}
//                 <div className="lg:sticky top-0 z-10 bg-white px-6 pt-6 pb-2 border-b border-gray-200">
//                     <div className="flex items-start justify-between gap-4">
//                         <div className="flex items-start gap-4 flex-1 min-w-0">
//                             <div className="p-2.5 bg-gray-100 rounded-lg">
//                                 <Building className="w-6 h-6 text-gray-700" />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                                 <h2
//                                     className="text-xl font-semibold text-gray-900 truncate"
//                                     title={selectedCompany.company_name}
//                                 >
//                                     {selectedCompany.company_name}
//                                 </h2>
//                                 <div className="flex flex-wrap items-center gap-3 mt-2">
//                                     <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
//                                         <Calendar size={12} />
//                                         <span>
//                                             Created:{" "}
//                                             {new Date(
//                                                 selectedCompany.created_at
//                                             ).toLocaleDateString("en-US", {
//                                                 day: "numeric",
//                                                 month: "short",
//                                                 year: "numeric",
//                                             })}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <button
//                             onClick={closeModal}
//                             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0"
//                         >
//                             <X size={24} />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Content */}
//                 <div className="px-6 py-6 max-h-[70vh] overflow-y-auto ">
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                         {/* Left Column - Main Content */}
//                         <div className="lg:col-span-2 space-y-6 lg:sticky -top-2 self-start ">
//                             {/* CRM Steps */}
//                             <div className="space-y-6">
//                                 <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//                                     <div className="flex items-center gap-3 mb-5">
//                                         <div className="p-2 bg-gray-100 rounded-lg">
//                                             <TrendingUp
//                                                 size={18}
//                                                 className="text-gray-700"
//                                             />
//                                         </div>
//                                         <div>
//                                             <h3 className="text-base font-semibold text-gray-900">
//                                                 CRM Pipeline
//                                             </h3>
//                                             <p className="text-xs text-gray-500 mt-1">
//                                                 Track progress through each
//                                                 stage
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="space-y-6">
//                                         {/* Step 1: Meeting */}
//                                         <StepCard
//                                             number={1}
//                                             title="Meeting"
//                                             isCompleted={hasMeeting}
//                                             isActive={!hasMeeting}
//                                             icon={Calendar}
//                                         >
//                                             {hasMeeting ? (
//                                                 <div className="space-y-4">
//                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                         <InfoRow
//                                                             label="Date"
//                                                             value={
//                                                                 selectedCompany
//                                                                     .meetings
//                                                                     .meeting_date
//                                                             }
//                                                             icon={Calendar}
//                                                         />
//                                                         <InfoRow
//                                                             label="Time"
//                                                             value={
//                                                                 selectedCompany
//                                                                     .meetings
//                                                                     .meeting_time
//                                                             }
//                                                             icon={Clock}
//                                                         />
//                                                         <InfoRow
//                                                             label="Type"
//                                                             value={
//                                                                 selectedCompany
//                                                                     .meetings
//                                                                     .meeting_type
//                                                             }
//                                                             icon={Users}
//                                                         />
//                                                         {selectedCompany
//                                                             .meetings
//                                                             .meeting_location ? (
//                                                             <InfoRow
//                                                                 label="Location"
//                                                                 value={
//                                                                     selectedCompany
//                                                                         .meetings
//                                                                         .meeting_location
//                                                                 }
//                                                                 icon={MapPin}
//                                                             />
//                                                         ) : selectedCompany
//                                                               .meetings
//                                                               .phone_details ? (
//                                                             <InfoRow
//                                                                 label="Phone Details"
//                                                                 value={
//                                                                     selectedCompany
//                                                                         .meetings
//                                                                         .phone_details
//                                                                 }
//                                                                 icon={Phone}
//                                                             />
//                                                         ) : null}
//                                                     </div>

//                                                     {selectedCompany.meetings
//                                                         .attendee && (
//                                                         <div className="space-y-2">
//                                                             <div className="text-xs font-medium text-gray-700">
//                                                                 Attendees
//                                                             </div>
//                                                             <div className="text-sm text-gray-600">
//                                                                 {
//                                                                     selectedCompany
//                                                                         .meetings
//                                                                         .attendee
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                     )}

//                                                     {/* Fixed Agenda Section with HTML Parsing */}
//                                                     {selectedCompany.meetings
//                                                         .agenda && (
//                                                         <div className="space-y-2">
//                                                             <div className="text-xl text-start font-medium text-gray-700">
//                                                                 Agenda
//                                                             </div>
//                                                             <div
//                                                                 className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg agenda-content"
//                                                                 dangerouslySetInnerHTML={{
//                                                                     __html: formatAgendaText(
//                                                                         selectedCompany
//                                                                             .meetings
//                                                                             .agenda
//                                                                     ),
//                                                                 }}
//                                                             />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             ) : (
//                                                 <div className="text-center py-4 text-sm text-gray-500">
//                                                     No meeting scheduled
//                                                 </div>
//                                             )}
//                                         </StepCard>

//                                         {/* Step 2: Contract */}
//                                         <StepCard
//                                             number={2}
//                                             title="Contract"
//                                             isCompleted={hasContract}
//                                             isActive={
//                                                 hasMeeting && !hasContract
//                                             }
//                                             icon={FileText}
//                                         >
//                                             {hasContract ? (
//                                                 <div className="space-y-4">
//                                                     <div className="flex items-center justify-between">
//                                                         <div className="text-xs text-gray-500">
//                                                             {new Date(
//                                                                 selectedCompany.contracts.created_at
//                                                             ).toLocaleDateString()}
//                                                         </div>
//                                                     </div>

//                                                     <ContractImage
//                                                         imageUrl={
//                                                             selectedCompany
//                                                                 .contracts.image
//                                                         }
//                                                     />
//                                                 </div>
//                                             ) : (
//                                                 <div className="text-center py-4 text-sm text-gray-500">
//                                                     No contract uploaded
//                                                 </div>
//                                             )}
//                                         </StepCard>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Right Column - Sidebar */}
//                         <div className="space-y-6 lg:sticky -top-2 self-start">
//                             {/* Company Details */}
//                             <Section title="Company Details" icon={Building}>
//                                 <div className="space-y-4">
//                                     <div className="grid grid-cols-1 gap-3">
//                                         <InfoRow
//                                             label="Full Name"
//                                             value={selectedCompany.full_name}
//                                             icon={User}
//                                         />
//                                         <InfoRow
//                                             label="Designation"
//                                             value={selectedCompany.designation}
//                                             icon={User}
//                                         />
//                                         <InfoRow
//                                             label="Email"
//                                             value={selectedCompany.email}
//                                             icon={Mail}
//                                         />
//                                         <InfoRow
//                                             label="Phone"
//                                             value={selectedCompany.phone_no}
//                                             icon={Phone}
//                                         />
//                                         <InfoRow
//                                             label="Address"
//                                             value={selectedCompany.address}
//                                             icon={MapPin}
//                                             className="col-span-2"
//                                         />
//                                     </div>
//                                     <div className="pt-3 border-t border-gray-200">
//                                         <div className="grid grid-cols-1 gap-3">
//                                             <InfoRow
//                                                 label="Responsible Person"
//                                                 value={
//                                                     selectedCompany.responsible_person
//                                                 }
//                                                 icon={User}
//                                             />
//                                             <InfoRow
//                                                 label="Our Team"
//                                                 value={selectedCompany.our_team}
//                                                 icon={Users}
//                                             />
//                                             <InfoRow
//                                                 label="Client Member"
//                                                 value={
//                                                     selectedCompany.client_member
//                                                 }
//                                                 icon={Users}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Section>

//                             {/* Follow-up Date Card */}
//                             <Section title="Next Follow-up" icon={Calendar}>
//                                 <div className="space-y-4">
//                                     <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
//                                         <div className="text-3xl font-bold text-blue-700 mb-1">
//                                             {selectedCompany.follow_up_date
//                                                 ? new Date(
//                                                       selectedCompany.follow_up_date
//                                                   ).getDate()
//                                                 : "--"}
//                                         </div>
//                                         <div className="text-sm font-medium text-blue-600">
//                                             {selectedCompany.follow_up_date
//                                                 ? new Date(
//                                                       selectedCompany.follow_up_date
//                                                   ).toLocaleDateString(
//                                                       "en-US",
//                                                       {
//                                                           month: "long",
//                                                           year: "numeric",
//                                                       }
//                                                   )
//                                                 : "Not scheduled"}
//                                         </div>
//                                         <div className="text-xs text-blue-500 mt-2">
//                                             Days until:{" "}
//                                             {selectedCompany.follow_up_date
//                                                 ? Math.ceil(
//                                                       (new Date(
//                                                           selectedCompany.follow_up_date
//                                                       ) -
//                                                           new Date()) /
//                                                           (1000 * 60 * 60 * 24)
//                                                   )
//                                                 : "∞"}
//                                         </div>
//                                     </div>

//                                     <form
//                                         onSubmit={handleSubmit(
//                                             onSubmitFollowUp
//                                         )}
//                                         className="space-y-3"
//                                     >
//                                         <div>
//                                             <label className="block text-xs font-medium text-gray-700 mb-1">
//                                                 Update Date
//                                             </label>
//                                             <input
//                                                 type="date"
//                                                 {...register("followUpDate", {
//                                                     required:
//                                                         "Follow-up date is required",
//                                                 })}
//                                                 className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                                                     errors.followUpDate
//                                                         ? "border-red-300 bg-red-50"
//                                                         : "border-gray-300"
//                                                 }`}
//                                             />
//                                             {errors.followUpDate && (
//                                                 <p className="mt-1 text-xs text-red-600">
//                                                     {
//                                                         errors.followUpDate
//                                                             .message
//                                                     }
//                                                 </p>
//                                             )}
//                                         </div>
//                                         <button
//                                             type="submit"
//                                             disabled={
//                                                 followUpLoading || isSubmitting
//                                             }
//                                             className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
//                                                 followUpLoading || isSubmitting
//                                                     ? "bg-gray-400 cursor-not-allowed"
//                                                     : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg"
//                                             }`}
//                                         >
//                                             {followUpLoading ? (
//                                                 <span className="flex items-center justify-center gap-2">
//                                                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                                     Updating...
//                                                 </span>
//                                             ) : (
//                                                 "Update Follow-up"
//                                             )}
//                                         </button>
//                                     </form>
//                                 </div>
//                             </Section>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="lg:sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
//                     <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
//                         <div className="text-xs text-gray-500 sm:text-sm">
//                             Last updated:{" "}
//                             {new Date(
//                                 selectedCompany.updated_at
//                             ).toLocaleString()}
//                         </div>
//                         <div className="flex w-full justify-between gap-2 sm:w-auto sm:justify-end">
//                             <button
//                                 onClick={closeModal}
//                                 className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:flex-none sm:px-4 sm:py-2.5 sm:text-sm"
//                             >
//                                 Close
//                             </button>
//                             <Link
//                                 href={`/crm/details/${selectedCompany.slug}`}
//                                 className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-gray-800 sm:flex-none sm:px-4 sm:py-2.5 sm:text-sm"
//                             >
//                                 Edit Details
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default CompanyPopUp;

