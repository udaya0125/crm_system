import React from "react";
import {
    X,
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    UserCheck,
    FolderOpen,
    DollarSign,
    CreditCard,
    Hash,
} from "lucide-react";

const paymentColors = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-700",
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

const ClientPopup = ({ client, onClose }) => {
    if (!client) return null;

    const paymentClass =
        paymentColors[client.payment_status] || "bg-gray-100 text-gray-600";

    const formattedRevenue = client.total_revenue
        ? `$${Number(client.total_revenue).toLocaleString("en-AU", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          })}`
        : null;

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
                            <Building2 size={24} className="text-white" />
                        </div>
                        <div>
                            {/* {client.lead_id && (
                                <p
                                    className="text-xs font-mono tracking-widest mb-0.5"
                                    style={{ color: "rgba(255,255,255,0.7)" }}
                                >
                                    {client.lead_id}
                                </p>
                            )} */}
                            <h2 className="text-white text-xl font-bold leading-tight">
                                {client.company_name}
                            </h2>
                            {client.contact_person && (
                                <p
                                    className="text-sm mt-0.5"
                                    style={{ color: "rgba(255,255,255,0.75)" }}
                                >
                                    {client.contact_person}
                                </p>
                            )}
                        </div>
                    </div>

                    {client.payment_status && (
                        <span
                            className={`absolute bottom-4 right-6 text-xs font-semibold px-3 py-1 rounded-full ${paymentClass}`}
                        >
                            {client.payment_status}
                        </span>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto -mt-4 bg-white rounded-t-2xl px-6 pt-4 pb-6">

                    {/* Row 1: Lead ID + Company Name */}
                    <FieldRow>
                        {/* <Field icon={Hash} label="Lead ID" value={client.lead_id} /> */}
                        <Field icon={Building2} label="Company Name" value={client.company_name} />
                    </FieldRow>

                    {/* Row 2: Contact Person + Email */}
                    <FieldRow>
                        <Field icon={User} label="Contact Person" value={client.contact_person} />
                        <Field icon={Mail} label="Email" value={client.email} />
                    </FieldRow>

                    {/* Row 3: Phone + Address */}
                    <FieldRow>
                        <Field icon={Phone} label="Phone" value={client.phone} />
                        <Field icon={MapPin} label="Address" value={client.address} />
                    </FieldRow>

                    {/* Row 4: Service Type + Account Manager */}
                    <FieldRow>
                        <Field icon={Briefcase} label="Service Type" value={client.service_type} />
                        <Field icon={UserCheck} label="Account Manager" value={client.account_manager} />
                    </FieldRow>

                    {/* Row 5: Total Projects + Total Revenue */}
                    <FieldRow>
                        <Field icon={FolderOpen} label="Total Projects" value={client.total_projects} />
                        <Field icon={DollarSign} label="Total Revenue" value={formattedRevenue} />
                    </FieldRow>

                    {/* Row 6: Payment Status — alone or paired if needed */}
                    <div className="border-b border-gray-100">
                        <div className="grid grid-cols-2 gap-x-4">
                            <Field icon={CreditCard} label="Payment Status" value={client.payment_status} />
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

export default ClientPopup;