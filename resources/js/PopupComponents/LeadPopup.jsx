import React, { useEffect } from "react";
import {
    X,
    User,
    Building2,
    Phone,
    Mail,
    Briefcase,
    RadioTower,
    UserCheck,
    CalendarClock,
    StickyNote,
    BadgeCheck,
    Hash,
} from "lucide-react";
import parse from "html-react-parser";

const statusColors = {
    New: "bg-blue-100 text-blue-700",
    Contacted: "bg-yellow-100 text-yellow-700",
    Qualified: "bg-purple-100 text-purple-700",
    Proposal: "bg-orange-100 text-orange-700",
    Won: "bg-green-100 text-green-700",
    Lost: "bg-red-100 text-red-700",
};

const Field = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-3.5">
        <div
            className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#e8f2fb" }}
        >
            <Icon size={15} style={{ color: "#0d77c3" }} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                {label}
            </p>
            <p className="text-sm text-gray-800 font-medium break-words">
                {value || <span className="text-gray-300 font-normal">—</span>}
            </p>
        </div>
    </div>
);

const FieldRow = ({ children }) => (
    <div className="grid grid-cols-2 gap-x-4 border-b border-gray-100 last:border-0">
        {children}
    </div>
);

const LeadPopup = ({ lead, onClose }) => {
    if (!lead) return null;

    const statusClass =
        statusColors[lead.status] || "bg-gray-100 text-gray-600";

    const formattedDate = lead.next_followup_date
        ? new Date(lead.next_followup_date).toLocaleDateString("en-AU", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

          useEffect(() => {
                document.body.style.overflow = "hidden";
                return () => {
                    document.body.style.overflow = "";
                };
            }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div
                    className="px-6 pt-6 pb-10 relative"
                    style={{
                        background: "linear-gradient(135deg, #0d77c3 0%, #085a96 100%)",
                    }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full text-white transition-colors"
                        style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                        onMouseEnter={e =>
                            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")
                        }
                        onMouseLeave={e =>
                            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")
                        }
                    >
                        <X size={16} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                        >
                            <User size={24} className="text-white" />
                        </div>
                        <div>
                            <p
                                className="text-xs font-mono tracking-widest mb-0.5"
                                style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                                {lead.lead_id}
                            </p>
                            <h2 className="text-white text-xl font-bold leading-tight">
                                {lead.client_name}
                            </h2>
                            {lead.company_name && (
                                <p
                                    className="text-sm mt-0.5"
                                    style={{ color: "rgba(255,255,255,0.75)" }}
                                >
                                    {lead.company_name}
                                </p>
                            )}
                        </div>
                    </div>

                    {lead.status && (
                        <span
                            className={`absolute bottom-4 right-6 text-xs font-semibold px-3 py-1 rounded-full ${statusClass}`}
                        >
                            {lead.status}
                        </span>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto -mt-4 bg-white rounded-t-2xl px-6 pt-4 pb-6">

                    {/* Row 1: Lead ID + Client Name */}
                    <FieldRow>
                        <Field icon={Hash} label="Lead ID" value={lead.lead_id} />
                        <Field icon={User} label="Client Name" value={lead.client_name} />
                    </FieldRow>

                    {/* Row 2: Company + Service Interested */}
                    <FieldRow>
                        <Field icon={Building2} label="Company" value={lead.company_name} />
                        <Field icon={Briefcase} label="Service Interested" value={lead.service_interested} />
                    </FieldRow>

                    {/* Row 3: Phone + Email */}
                    <FieldRow>
                        <Field icon={Phone} label="Phone" value={lead.phone} />
                        <Field icon={Mail} label="Email" value={lead.email} />
                    </FieldRow>

                    {/* Row 4: Lead Source + Assigned Salesperson */}
                    <FieldRow>
                        <Field icon={RadioTower} label="Lead Source" value={lead.lead_source} />
                        <Field icon={UserCheck} label="Assigned Salesperson" value={lead.assigned_salesperson} />
                    </FieldRow>

                    {/* Row 5: Next Follow-up + Status */}
                    <FieldRow>
                        <Field icon={CalendarClock} label="Next Follow-up Date" value={formattedDate} />
                        <Field icon={BadgeCheck} label="Status" value={lead.status} />
                    </FieldRow>

                    {/* Notes — full width, separate */}
                    <div className="mt-2 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: "#e8f2fb" }}
                            >
                                <StickyNote size={15} style={{ color: "#0d77c3" }} />
                            </div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Notes
                            </p>
                        </div>
                        <div
                            className="rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                            style={{
                                backgroundColor: "#f0f7fd",
                                border: "1px solid #d0e8f7",
                            }}
                        >
                            {lead.notes ? (
                                parse(lead.notes)
                            ) : (
                                <span className="text-gray-400 italic">
                                    No notes added.
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-full text-sm font-medium text-white transition-colors"
                        style={{ backgroundColor: "#0d77c3" }}
                        onMouseEnter={e =>
                            (e.currentTarget.style.backgroundColor = "#085a96")
                        }
                        onMouseLeave={e =>
                            (e.currentTarget.style.backgroundColor = "#0d77c3")
                        }
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadPopup;