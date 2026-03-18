import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Plus } from "lucide-react";
import React from "react";

const Leads = () => {
    const [allLeads, setAllLeads] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // For fetching the lead data
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await axios.get(route("leads.index"));
                setAllLeads(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchLeads();
    }, [reloadTrigger]);

    // For delete the lead
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("leads.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (lead) => {
        setEditingLead(lead);
    };

    // Handlapdate after the  edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("leads.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating lead", error);
            throw error;
        }
    };
    return (
        <>
            <AdminWrapper>
                <div className="container mx-auto py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                                Leads
                            </h1>
                        </div>
                        <button
                            onClick={() => {
                                setShowAddForm(true);
                            }}
                            className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <Plus size={18} />
                            Create
                        </button>
                    </div>
                </div>
            </AdminWrapper>
        </>
    );
};

export default Leads;
