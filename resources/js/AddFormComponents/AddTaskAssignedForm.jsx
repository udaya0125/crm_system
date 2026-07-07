import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddTaskAssignedForm = ({ showForm, setShowForm, editingTaskAssigned, setEditingTaskAssigned, handleUpdate }) => {
    const [submitting, setSubmitting] = useState(false);
    const [taskAssignedForm, setTaskAssignedForm] = useState({
        title: "",
        department:"",
        assigned_id: "",
        user_id: "",
        priority: "",
        start_date: "",
        due_date: "",
        description: "",
        status: "",
        attachment: "",
    });
    //  Use Effect
    useEffect(() => {
        if (editingTaskAssigned) {
            setTaskAssignedForm({
                ...editingTaskAssigned,
                image: null,
            });
            setShowForm(true);
        } else {
            setTaskAssignedForm({
                title: "",
                department: "",
                assigned_id: "",
                user_id: "",
                priority: "",
                start_date: "",
                due_date: "",
                description: "",
                status: "",
                attachment: "",
            });
        }
    }, [editingTaskAssigned]);

    // Handle Create Task Assigned
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourtaskassigned.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating task assigned", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in taskAssignedForm) {
            if (taskAssignedForm[key] !== null && taskAssignedForm[key] !== "") {
                formData.append(key, taskAssignedForm[key]);
            }
        }
        try {
            setSubmitting(true);

            if (editingTaskAssigned) {
                // Editing existing task assigned
                await handleUpdate(formData, editingTaskAssigned.id);
            } else {
                // Creating new task assigned
                await handleCreate(formData);
            }
            setTaskAssignedForm({
                title: "",
                department: "",
                assigned_id: "",
                user_id: "",
                priority: "",
                start_date: "",
                due_date: "",
                description: "",
                status: "",
                attachment: "",
            });

            setShowForm(false);
            setEditingTaskAssigned(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle  change for image and the others

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setTaskAssignedForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    if (!showForm) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New Task
                    </h2>
                    <button
                        onClick={() => {
                            setShowForm(false);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTaskAssignedForm;
