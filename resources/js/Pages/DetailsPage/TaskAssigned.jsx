import AddTaskAssignedForm from "@/AddFormComponents/AddTaskAssignedForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const TaskAssigned = () => {
    const [allTaskAssigned, setAllTaskAssigned] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTaskAssigned, setEditingTaskAssigned] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // For fetching the task assigned data
    useEffect(() => {
        const fetchTaskAssigned = async () => {
            try {
                const response = await axios.get(route("ourtaskassigned.index"));
                setAllTaskAssigned(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchTaskAssigned();
    }, [reloadTrigger]);

    // For delete the task assigned
    const handleDelete = async (id) => {
         if (!window.confirm("Are you sure you want to delete this task assigned?"))
            return;
        try {
            const response = await axios.delete(
                route("ourtaskassigned.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (taskAssigned) => {
        setEditingTaskAssigned(taskAssigned);
    };

    // Handlapdate after the  edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourtaskassigned.update", { id }),
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
            console.log("Error updating task assigned", error);
            throw error;
        }
    };
    return (
        <>
            <AdminWrapper>
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                            Task Assigned
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                <AddTaskAssignedForm
                    showForm={showForm}
                    setShowForm={setShowForm}
                    setReloadTrigger={setReloadTrigger}
                    editingTaskAssigned={editingTaskAssigned}
                    setEditingTaskAssigned={setEditingTaskAssigned}
                    handleUpdate={handleUpdate}
                />
            </AdminWrapper>
        </>
    );
};

export default TaskAssigned;
