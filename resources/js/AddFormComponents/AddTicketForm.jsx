import { X } from "lucide-react";
import React from "react";

const AddTicketForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [ticketForm, setTicketForm] = useState({
        ticket_id: "",
        client_name: "",
        issue_type: "",
        device_type: "",
        problem_description: "",
        priority: "",
        assigned_technician: "",
        status: "",
    });

    //  Use Effect for setting the form data when editing and resetting when not editing
    useEffect(() => {
        if (editingTicket) {
            setTicketForm({
                ...editingTicket,
                image: null,
            });
            setShowForm(true);
        } else {
            setTicketForm({
                ticket_id: "",
                client_name: "",
                issue_type: "",
                device_type: "",
                problem_description: "",
                priority: "",
                assigned_technician: "",
                status: "",
            });
        }
    }, [editingTicket]);

    // Handle Create Ticket
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourtickets.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating ticket", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in ticketForm) {
            if (ticketForm[key] !== null && ticketForm[key] !== "") {
                formData.append(key, ticketForm[key]);
            }
        }
        try {
            setSubmitting(true);

            if (editingTicket) {
                // Editing existing ticket
                await handleUpdate(formData, editingTicket.id);
            } else {
                // Creating new ticket
                await handleCreate(formData);
            }
            setTicketForm({
                ticket_id: "",
                client_name: "",
                issue_type: "",
                device_type: "",
                problem_description: "",
                priority: "",
                assigned_technician: "",
                status: "",
            });

            setShowForm(false);
            setEditingTicket(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle  change for image and the others

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setTicketForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">Add New Gallery Item</h2>
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

export default AddTicketForm;
