import React from "react";

const AddClientManagement = () => {
    const [submitting, setSubmitting] = useState(false);
    const [userForm, setUserForm] = useState({
        fullname: "",
        email: "",
        image: "",
        address: "",
        role: "",
        status: "",
        date: "",
        auth: "",
    });

    //  Use Effect
    useEffect(() => {
        if (editingUser) {
            setUserForm({
                ...editingUser,
                image: null,
            });
            setShowForm(true);
        } else {
            setUserForm({
                fullname: "",
                email: "",
                image: "",
                address: "",
                role: "",
                status: "",
                date: "",
                auth: "",
            });
        }
    }, [editingUser]);

    // Handle Create User
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("users.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating user", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in userForm) {
            if (userForm[key] !== null && userForm[key] !== "") {
                formData.append(key, userForm[key]);
            }
        }
        try {
            setSubmitting(true);

            if (editingUser) {
                // Editing existing user
                await handleUpdate(formData, editingUser.id);
            } else {
                // Creating new user
                await handleCreate(formData);
            }
            setUserForm({
                fullname: "",
                email: "",
                address: "",
                role: "",
                status: "",
                date: "",
                auth: "",
                image: null,
            });

            setShowForm(false);
            setEditingUser(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle  change for image and the others

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setUserForm((prev) => ({
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

export default AddClientManagement;
