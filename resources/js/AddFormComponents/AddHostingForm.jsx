import { X } from "lucide-react";
import React from "react";

const AddHostingForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [hostingForm, setHostingForm] = useState({
        hosting_plan: "",
        client_id: "",
        disk_usage: "",
        renewal_date: "",
        hosting_provider: "",
    });
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    //  Use Effect
    useEffect(() => {
        if (editingHosting) {
            setHostingForm({
                ...editingHosting,
                image: null,
            });
            setShowForm(true);
        } else {
            setHostingForm({
                hosting_plan: "",
                client_id: "",
                disk_usage: "",
                renewal_date: "",
                hosting_provider: "",
            });
        }
    }, [editingHosting]);

    // ✅ Fetch clients — same as AddExpirationForm
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(route("ourclients.index"));
                setClients(response.data.data || response.data);
            } catch (error) {
                console.error("Error fetching clients", error);
            }
        };
        fetchClients();
    }, []);

    // Handle Create Hosting
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("hosting.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating hosting", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in hostingForm) {
            if (hostingForm[key] !== null && hostingForm[key] !== "") {
                formData.append(key, hostingForm[key]);
            }
        }
        try {
            setSubmitting(true);

            if (editingHosting) {
                // Editing existing hosting
                await handleUpdate(formData, editingHosting.id);
            } else {
                // Creating new hosting
                await handleCreate(formData);
            }
            setHostingForm({
                hosting_plan: "",
                client_id: "",
                disk_usage: "",
                renewal_date: "",
                hosting_provider: "",
            });

            setShowForm(false);
            setEditingHosting(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle  change for image and the others

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setHostingForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">Add New Hosting Item</h2>
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

export default AddHostingForm;
