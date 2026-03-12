import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Edit,
    X,
    Eye,
    CheckCircle,
    Square,
    User,
    FileText,
    Users,
    Plus,
} from "lucide-react";
import parse from "html-react-parser";
import EditTask from "@/EditFormComponents/EditTask";
import AddTask from "@/AddFormComponents/AddTask";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/TableComponents/MyTable";

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskLists, setTaskLists] = useState([]);
    const [modalMode, setModalMode] = useState("add");
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedTaskList, setSelectedTaskList] = useState(null);
    const [showTaskListPopup, setShowTaskListPopup] = useState(false);
    const user = usePage().props.auth.user;

    // Custom parser to replace HTML elements with Lucide icons
    const parseWithIcons = (html) => {
        if (!html) return null;

        const elements = parse(html);

        const replaceElements = (node) => {
            if (!node || typeof node !== "object") return node;

            if (Array.isArray(node)) {
                return node.map(replaceElements);
            }

            if (node.props && node.props.children) {
                // Replace ul/ol with custom styled lists
                if (node.type === "ul" || node.type === "ol") {
                    const children = React.Children.map(
                        node.props.children,
                        (child, index) => {
                            if (child && child.props && child.type === "li") {
                                return React.cloneElement(child, {
                                    className: `${
                                        child.props.className || ""
                                    } flex items-start gap-2 py-1`,
                                    children: (
                                        <>
                                            {node.type === "ul" ? (
                                                <CheckCircle
                                                    size={12}
                                                    className="mt-1.5 text-blue-500 flex-shrink-0"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-blue-600 w-5 flex-shrink-0">
                                                    {index + 1}.
                                                </span>
                                            )}
                                            <span className="flex-1">
                                                {replaceElements(
                                                    child.props.children
                                                )}
                                            </span>
                                        </>
                                    ),
                                });
                            }
                            return child;
                        }
                    );

                    return React.createElement(node.type, {
                        ...node.props,
                        className: `${
                            node.props.className || ""
                        } space-y-2 my-2`,
                        children: children,
                    });
                }

                // Replace checkboxes/todo items
                if (
                    node.props.className &&
                    node.props.className.includes("ql-direction")
                ) {
                    const children = React.Children.map(
                        node.props.children,
                        (child) => {
                            if (child && child.props && child.type === "span") {
                                const isChecked =
                                    child.props.style?.textDecoration ===
                                    "line-through";
                                return React.cloneElement(child, {
                                    children: (
                                        <div className="flex items-center gap-2">
                                            {isChecked ? (
                                                <CheckCircle
                                                    size={16}
                                                    className="text-green-500 flex-shrink-0"
                                                />
                                            ) : (
                                                <Square
                                                    size={16}
                                                    className="text-gray-400 flex-shrink-0"
                                                />
                                            )}
                                            <span
                                                className={
                                                    isChecked
                                                        ? "line-through text-gray-500"
                                                        : ""
                                                }
                                            >
                                                {child.props.children}
                                            </span>
                                        </div>
                                    ),
                                });
                            }
                            return child;
                        }
                    );

                    return React.createElement("div", {
                        ...node.props,
                        children: children,
                    });
                }

                const newChildren = React.Children.map(
                    node.props.children,
                    replaceElements
                );
                return React.cloneElement(node, { children: newChildren });
            }

            return node;
        };

        return replaceElements(elements);
    };

    // Fetch tasks and task lists
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch tasks
                const tasksResponse = await axios.get(route("ourtask.index"));
                setTasks(tasksResponse.data.data);

                // Fetch task lists (for dropdown in form)
                const taskListsResponse = await axios.get(
                    route("tasklists.index")
                );
                setTaskLists(taskListsResponse.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchAllData();
    }, [reloadTrigger]);

    // Handle edit task
    const handleEdit = (task) => {
        // Don't allow editing if task is completed
        if (task.is_completed) {
            return;
        }
        setEditingTask(task);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    // Handle delete task
    const handleDelete = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await axios.delete(route("ourtask.destroy", taskId));
                setReloadTrigger((prev) => !prev);
                if (selectedTask?.id === taskId) {
                    setSelectedTask(null);
                }
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    // Handle add task
    const handleAddTask = async (newTask) => {
        try {
            await axios.post(route("ourtask.store"), newTask);
            setReloadTrigger((prev) => !prev);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    };

    // Handle update task
    const handleUpdate = async (updatedTask) => {
        try {
            await axios.put(
                route("ourtask.update", editingTask.id),
                updatedTask
            );
            setReloadTrigger((prev) => !prev);
            setIsModalOpen(false);
            setEditingTask(null);
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    };

    // Open add modal
    const openAddModal = () => {
        setEditingTask(null);
        setModalMode("add");
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        setModalMode("add");
    };

    // Handle click on task list cell
    const handleTaskListClick = (taskList) => {
        if (taskList) {
            setSelectedTaskList(taskList);
            setShowTaskListPopup(true);
        }
    };

    // Close task list popup
    const closeTaskListPopup = () => {
        setShowTaskListPopup(false);
        setSelectedTaskList(null);
    };

    // Define columns for MyTable
    const columns = useMemo(
        () => [
            {
                Header: "S/N",
                accessor: (row, index) => index + 1,
                id: "rowIndex",
                width: 50,
            },
            {
                Header: "Status",
                accessor: "is_completed",
                Cell: ({ value }) => (
                    <div className="flex items-center gap-2">
                        <span
                            className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                                value
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                            {value ? "Complete" : "Incomplete"}
                        </span>
                    </div>
                ),
                width: 140,
            },
            {
                Header: "Title",
                accessor: "title",
                Cell: ({ value }) => (
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium text-gray-900 `}>
                            {value}
                        </span>
                    </div>
                ),
            },
            {
                Header: "Due Time",
                Cell: ({ row }) => {
                    const { due_date, due_time, is_completed } = row.original;

                    const dateTimeString = due_time
                        ? `${due_date}T${due_time}`
                        : `${due_date}T00:00`;

                    const dueDateTime = new Date(dateTimeString);
                    const isOverdue = dueDateTime < new Date() && !is_completed;

                    const formattedDate = `${String(
                        dueDateTime.getDate()
                    ).padStart(2, "0")}/${String(
                        dueDateTime.getMonth() + 1
                    ).padStart(2, "0")}/${dueDateTime.getFullYear()}`;

                    return (
                        <div className="flex flex-col lg:flex-row items-center gap-2">
                            <span
                                className={`px-3 py-1 text-xs rounded-full ${
                                    isOverdue
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                }`}
                            >
                                {formattedDate}
                            </span>
                        </div>
                    );
                },
                width: 200,
            },
            {
                Header: "Task List",
                accessor: "task_list.title",
                Cell: ({ row }) => {
                    const taskList = row.original.task_list;

                    return (
                        <div
                            className="flex flex-col gap-1 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                            onClick={() => handleTaskListClick(taskList)}
                            title="Click to view task list details"
                        >
                            <span className="font-medium text-sm text-gray-900 hover:text-blue-600">
                                {taskList?.title || "No task list"}
                            </span>
                        </div>
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "id",
                Cell: ({ row }) => {
                    const task = row.original;
                    const isCompleted = task.is_completed;

                    return (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedTask(task)}
                                className={`p-2  transition-colors flex items-center justify-center ${
                                    selectedTask?.id === task.id
                                        ? " text-blue-700 "
                                        : " text-gray-700 "
                                }`}
                                title="View task details"
                            >
                                <Eye size={16} />
                            </button>

                            {/* Only show edit button if task is NOT completed AND user role is 'user' */}
                            {/* {!isCompleted && user.role === "user" && ( */}
                                <button
                                    onClick={() => handleEdit(task)}
                                    className="text-indigo-600 hover:text-indigo-900 transition duration-200"
                                    title="Edit task"
                                >
                                    <Edit size={16} />
                                </button>
                            {/* )} */}
                        </div>
                    );
                },
                width: 160,
            },
        ],
        [selectedTask, user.role]
    );

    return (
        <AdminWrapper>
            <div className="container mx-auto py-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Task Management
                    </h1>
                    {/* Add Task Button - Only show if user role is 'user' */}
                    {/* {user.role === "user" && ( */}
                        <div className="mb-4">
                            <button
                                onClick={openAddModal}
                                className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                            >
                                <Plus size={18} />
                                <span>Create Task</span>
                            </button>
                        </div>
                    {/* )} */}
                </div>

                {/* Tasks Table - Using MyTable component */}
                <MyTable columns={columns} data={tasks} />

                {/* Task Details Section - Below the Table */}
                {selectedTask && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 mt-6">
                        {/* Task Information */}
                        <div className="p-6">
                            <div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FileText
                                            size={24}
                                            className="text-blue-600"
                                        />
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {selectedTask.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!selectedTask.is_completed &&
                                            user.role === "user" && (
                                                <button
                                                    onClick={() =>
                                                        handleEdit(selectedTask)
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded hover:bg-blue-50"
                                                    title="Edit task"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            )}

                                        <button
                                            onClick={() =>
                                                setSelectedTask(null)
                                            }
                                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                            title="Close details"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>

                                {selectedTask.descriptions &&
                                selectedTask.descriptions.length > 0 ? (
                                    <div className="space-y-4">
                                        {selectedTask.descriptions
                                            .slice()
                                            .reverse()
                                            .map((description, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                                                >
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                            {selectedTask
                                                                .task_list
                                                                ?.assigned_user
                                                                ?.name ? (
                                                                <User
                                                                    size={20}
                                                                    className="text-blue-600"
                                                                />
                                                            ) : (
                                                                <span className="text-sm font-semibold text-blue-600">
                                                                    {selectedTask.task_list?.assigned_user?.name?.charAt(
                                                                        0
                                                                    ) || "U"}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div className="font-medium text-gray-800">
                                                                    {selectedTask
                                                                        .task_list
                                                                        ?.assigned_user
                                                                        ?.name && (
                                                                        <h2 className="font-medium text-gray-800">
                                                                            {
                                                                                selectedTask
                                                                                    .task_list
                                                                                    .assigned_user
                                                                                    .name
                                                                            }
                                                                        </h2>
                                                                    )}
                                                                </div>
                                                                <div className="flex gap-2 items-center">
                                                                    <Calendar
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-gray-400"
                                                                    />
                                                                    <p className="text-xs text-gray-500">
                                                                        {description.created_at
                                                                            ? new Date(
                                                                                  description.created_at
                                                                              ).toLocaleString()
                                                                            : "Unknown date"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pl-14">
                                                        <div className="prose max-w-none text-md text-gray-700 pl-4 py-2">
                                                            {/* Using custom parser with Lucide icons */}
                                                            {parseWithIcons(
                                                                description.content ||
                                                                    ""
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                                        <FileText
                                            size={64}
                                            className="mx-auto text-gray-300 mb-3"
                                        />
                                        <h4 className="text-lg font-medium text-gray-500 mb-2">
                                            No descriptions available
                                        </h4>
                                        <p className="text-gray-400 text-sm">
                                            There are no descriptions for this
                                            task yet.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Task List Details Popup - Fixed positioning */}
                {showTaskListPopup && selectedTaskList && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {selectedTaskList.title}
                                    </h2>
                                    <button
                                        onClick={closeTaskListPopup}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-md font-semibold text-gray-700">
                                        Description
                                    </h4>
                                    {/* Task List Description with HTML parsing */}
                                    {selectedTaskList.description && (
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                            <div className="text-gray-600">
                                                {parseWithIcons(
                                                    selectedTaskList.description
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Assigned By Admin */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <User
                                                size={20}
                                                className="text-green-600"
                                            />
                                            <h4 className="text-md font-semibold text-gray-700">
                                                Assigned By
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                {selectedTaskList.creator
                                                    ?.name ? (
                                                    <User
                                                        size={20}
                                                        className="text-green-600"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-semibold text-green-600">
                                                        {selectedTaskList.creator?.name?.charAt(
                                                            0
                                                        ) || "U"}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {selectedTaskList.creator
                                                        ?.name || "Unknown"}
                                                </p>
                                                {selectedTaskList.creator
                                                    ?.email && (
                                                    <p className="text-sm text-gray-500">
                                                        {
                                                            selectedTaskList
                                                                .creator.email
                                                        }
                                                    </p>
                                                )}
                                                {selectedTaskList.creator
                                                    ?.role && (
                                                    <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">
                                                        {
                                                            selectedTaskList
                                                                .creator.role
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Assigned To */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Users
                                                size={20}
                                                className="text-blue-600"
                                            />
                                            <h4 className="text-md font-semibold text-gray-700">
                                                Assigned To
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                {selectedTaskList.assigned_user
                                                    ?.name ? (
                                                    <User
                                                        size={20}
                                                        className="text-blue-600"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-semibold text-blue-600">
                                                        {selectedTaskList.assigned_user?.name?.charAt(
                                                            0
                                                        ) || "U"}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {selectedTaskList
                                                        .assigned_user?.name ||
                                                        "Unassigned"}
                                                </p>
                                                {selectedTaskList.assigned_user
                                                    ?.email && (
                                                    <p className="text-sm text-gray-500">
                                                        {
                                                            selectedTaskList
                                                                .assigned_user
                                                                .email
                                                        }
                                                    </p>
                                                )}
                                                {selectedTaskList.assigned_user
                                                    ?.role && (
                                                    <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">
                                                        {
                                                            selectedTaskList
                                                                .assigned_user
                                                                .role
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Close Button */}
                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={closeTaskListPopup}
                                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Task Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            {modalMode === "edit" ? (
                                editingTask?.is_completed ? (
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-gray-800">
                                                View Task (Completed)
                                            </h2>
                                            <button
                                                onClick={closeModal}
                                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                        <div className="text-center py-12">
                                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                                Task is Completed
                                            </h3>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                                This task has been marked as
                                                completed and cannot be edited.
                                            </p>
                                            <div className="flex gap-3 justify-center">
                                                <button
                                                    onClick={closeModal}
                                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <EditTask
                                        onUpdateTask={handleUpdate}
                                        onClose={closeModal}
                                        editingTask={editingTask}
                                        taskLists={taskLists}
                                    />
                                )
                            ) : (
                                <AddTask
                                    onAddTask={handleAddTask}
                                    onClose={closeModal}
                                    taskLists={taskLists}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminWrapper>
    );
};

export default Task;