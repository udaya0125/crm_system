import React, { useEffect } from "react";
import {
    X,
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Hash,
    Tag,
    GitBranch,
    CreditCard,
    BookOpen,
    CheckCircle,
    XCircle,
    Smartphone,
} from "lucide-react";

const Field = ({ icon: Icon, label, value }) => {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "N/A"
    )
        return null;

    return (
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
                    {value}
                </p>
            </div>
        </div>
    );
};

// Only renders if at least one child Field is non-null (has value)
const FieldRow = ({ children }) => {
    const validChildren = React.Children.toArray(children).filter(Boolean);
    if (validChildren.length === 0) return null;

    return (
        <div
            className={`grid gap-x-4 border-b border-gray-100 last:border-0 ${
                validChildren.length === 1 ? "grid-cols-2" : "grid-cols-2"
            }`}
        >
            {children}
        </div>
    );
};

const SectionLabel = ({ label }) => (
    <p
        className="text-xs font-semibold uppercase tracking-widest mb-1 mt-4"
        style={{ color: "#0d77c3" }}
    >
        {label}
    </p>
);

const ClientDetailPopup = ({ client, onClose, showForm }) => {
    if (!client) return null;

    const hasValue = (val) =>
        val !== null && val !== undefined && val !== "" && val !== "N/A";

    const fullAddress = [
        client.street,
        client.city,
        client.state,
        client.country,
    ]
        .filter(hasValue)
        .join(", ");

    const phones = [
        client.mobile && {
            label: "Mobile",
            value: client.mobile,
            icon: Smartphone,
        },
        client.telone && { label: "Tel 1", value: client.telone, icon: Phone },
        client.teltwo && { label: "Tel 2", value: client.teltwo, icon: Phone },
    ].filter(Boolean);

    // Lock background scroll for as long as this popup is mounted.
    // (Scroll lock must track the popup's own open state, not the
    // unrelated `showForm` prop — otherwise the background stays
    // scrollable whenever this popup opens without showForm being true.)
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
                        background:
                            "linear-gradient(135deg, #0d77c3 0%, #085a96 100%)",
                    }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full text-white transition-colors"
                        style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                "rgba(255,255,255,0.3)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                "rgba(255,255,255,0.2)")
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
                            <h2 className="text-white text-xl font-bold leading-tight">
                                {client.name}
                            </h2>
                            {hasValue(client.branchname) && (
                                <p
                                    className="text-sm mt-0.5"
                                    style={{ color: "rgba(255,255,255,0.75)" }}
                                >
                                    {client.branchname}
                                </p>
                            )}
                            {hasValue(client.type) && (
                                <p
                                    className="text-xs mt-1 font-mono"
                                    style={{ color: "rgba(255,255,255,0.6)" }}
                                >
                                    {client.type}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Active status badge */}
                    <span
                        className={`absolute bottom-4 right-6 text-xs font-semibold px-3 py-1 rounded-full ${
                            client.activestatus === "yes"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {client.activestatus === "yes" ? "Active" : "Inactive"}
                    </span>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto -mt-4 bg-white rounded-t-2xl px-6 pt-4 pb-6">
                    {/* Identity section */}
                    {(hasValue(client.code) || hasValue(client.pannumber)) && (
                        <>
                            <SectionLabel label="Identity" />
                            <FieldRow>
                                <Field
                                    icon={Hash}
                                    label="Code"
                                    value={client.code}
                                />
                                <Field
                                    icon={CreditCard}
                                    label="PAN Number"
                                    value={client.pannumber}
                                />
                            </FieldRow>
                        </>
                    )}

                    {/* Basic info */}
                    {(hasValue(client.name) || hasValue(client.type)) && (
                        <>
                            <SectionLabel label="Basic Info" />
                            <FieldRow>
                                <Field
                                    icon={User}
                                    label="Name"
                                    value={client.name}
                                />
                                <Field
                                    icon={Tag}
                                    label="Type"
                                    value={client.type}
                                />
                            </FieldRow>
                            <FieldRow>
                                <Field
                                    icon={GitBranch}
                                    label="Branch"
                                    value={client.branchname}
                                />
                                <Field
                                    icon={BookOpen}
                                    label="Ledger Name"
                                    value={client.ledgername}
                                />
                            </FieldRow>
                        </>
                    )}

                    {/* Contact section */}
                    {(hasValue(client.email) ||
                        phones.length > 0 ||
                        hasValue(client.website)) && (
                        <>
                            <SectionLabel label="Contact" />
                            {hasValue(client.email) && (
                                <FieldRow>
                                    <Field
                                        icon={Mail}
                                        label="Email"
                                        value={client.email}
                                    />
                                    {hasValue(client.website) && (
                                        <Field
                                            icon={Globe}
                                            label="Website"
                                            value={client.website}
                                        />
                                    )}
                                </FieldRow>
                            )}
                            {phones.length > 0 && (
                                <FieldRow>
                                    {phones.slice(0, 2).map((p) => (
                                        <Field
                                            key={p.label}
                                            icon={p.icon}
                                            label={p.label}
                                            value={p.value}
                                        />
                                    ))}
                                </FieldRow>
                            )}
                            {phones.length === 3 && (
                                <FieldRow>
                                    <Field
                                        icon={phones[2].icon}
                                        label={phones[2].label}
                                        value={phones[2].value}
                                    />
                                </FieldRow>
                            )}
                        </>
                    )}

                    {/* Address section */}
                    {hasValue(fullAddress) && (
                        <>
                            <SectionLabel label="Address" />
                            <div className="border-b border-gray-100">
                                <Field
                                    icon={MapPin}
                                    label="Full Address"
                                    value={fullAddress}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-full text-sm font-medium text-white transition-colors"
                        style={{ backgroundColor: "#0d77c3" }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#085a96")
                        }
                        onMouseLeave={(e) =>
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

export default ClientDetailPopup;