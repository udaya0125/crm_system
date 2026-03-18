import { X } from "lucide-react";
import React from "react";

const AddLeadForm = ({ editingLead, setEditingLead }) => {
    const [submitting, setSubmitting] = useState(false);
    const [leadForm, setLeadForm] = useState({
        lead_id: "",
        client_name: "",
        company_name: "",
        phone: "",
        email: "",
        service_interested: "",
        lead_source: "",
        assigned_salesperson: "",
        next_followup_date: "",
        notes: "",
        status: "",
    });

    //  Use Effect
    useEffect(() => {
        if (editingLead) {
            setLeadForm({
                ...editingLead,
                image: null,
            });
            setShowForm(true);
        } else {
            setLeadForm({
                lead_id: "",
                client_name: "",
                company_name: "",
                phone: "",
                email: "",
                service_interested: "",
                lead_source: "",
                assigned_salesperson: "",
                next_followup_date: "",
                notes: "",
                status: "",
            });
        }
    }, [editingLead]);

    // Handle Create Lead
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("leads.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating lead", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in leadForm) {
            if (leadForm[key] !== null && leadForm[key] !== "") {
                formData.append(key, leadForm[key]);
            }
        }
        try {
            setSubmitting(true);

            if (editingLead) {
                // Editing existing lead
                await handleUpdate(formData, editingLead.id);
            } else {
                // Creating new lead
                await handleCreate(formData);
            }
            setLeadForm({
                lead_id: "",
                client_name: "",
                company_name: "",
                phone: "",
                email: "",
                service_interested: "",
                lead_source: "",
                assigned_salesperson: "",
                next_followup_date: "",
                notes: "",
                status: "",
            });

            setShowForm(false);
            setEditingLead(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle  change for image and the others

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setLeadForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">Add New Lead</h2>
                    <button
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddLeadForm;
