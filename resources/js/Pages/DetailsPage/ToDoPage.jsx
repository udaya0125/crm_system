import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import {
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit,
    Trash2,
    X,
    Eye,
    FileText,
    Calendar,
    CheckCircle,
    Square,
} from "lucide-react";
import AddTodo from "@/AddFormComponents/AddTodo";
import EditTodo from "@/EditFormComponents/EditTodo";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import parse from "html-react-parser";

const ToDOPage = () => {
    const [allTodo, setAllTodo] = React.useState([]);
    const [reloadTrigger, setReloadTrigger] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [editingTodo, setEditingTodo] = useState(null);

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourtodo.index"));
                setAllTodo(response.data.data || []);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodo();
    }, [reloadTrigger]);

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

    // handleDelete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this todo?")) {
            return;
        }

        try {
            await axios.delete(route("ourtodo.destroy", { id: id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleEdit - Opens edit modal
    const handleEdit = (todo) => {
        // Don't allow editing if todo is completed
        if (todo.is_completed) {
            return;
        }
        setEditingTodo(todo);
        setIsEditModalOpen(true);
    };

    // Handle Add Todo
    const handleAdd = async (formData) => {
        try {
            const response = await axios.post(route("ourtodo.store"), formData);
            setReloadTrigger((prev) => !prev);
            setIsAddModalOpen(false);
            return response.data;
        } catch (error) {
            console.log("Error adding todo", error);
            throw error;
        }
    };

    // Handle Update Todo
    const handleUpdate = async (formData, id) => {
        try {
            const response = await axios.put(
                route("ourtodo.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setReloadTrigger((prev) => !prev);
            setEditingTodo(null);
            setIsEditModalOpen(false);
            return response.data;
        } catch (error) {
            console.log("Error updating todo", error);
            throw error;
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "No due date";
        const date = new Date(dateString);
        const isOverdue = date < new Date() && !selectedTodo?.is_completed;

        return (
            <div className="flex flex-col lg:flex-row items-center gap-2">
                <span
                    className={`px-3 py-1 text-xs rounded-full ${
                        isOverdue
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                >
                    {String(date.getDate()).padStart(2, "0")}/
                    {String(date.getMonth() + 1).padStart(2, "0")}/
                    {date.getFullYear()}
                </span>
            </div>
        );
    };

    // Define columns for react-table
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
                        <span className={`text-sm font-medium text-gray-900`}>
                            {value}
                        </span>
                    </div>
                ),
            },
            // {
            //     Header: "Description",
            //     accessor: "descriptions",
            //     Cell: ({ value }) => {
            //         const latestDescription = value?.length > 0 ? value[0]?.description : null;
            //         const truncatedText = latestDescription 
            //             ? (latestDescription.length > 100 
            //                 ? latestDescription.substring(0, 100) + '...' 
            //                 : latestDescription)
            //             : "No description";
                    
            //         return (
            //             <div className="text-sm text-gray-900">
            //                 {latestDescription ? (
            //                     <div className="max-w-xs">
            //                         {truncatedText}
            //                     </div>
            //                 ) : (
            //                     <span className="text-gray-400">
            //                         No description
            //                     </span>
            //                 )}
            //             </div>
            //         );
            //     },
            // },
            {
                Header: "Due Date",
                accessor: "due_date",
                Cell: ({ value }) => formatDate(value),
                width: 200,
            },
            {
                Header: "Actions",
                accessor: "id",
                Cell: ({ row }) => {
                    const todo = row.original;
                    const isCompleted = todo.is_completed;

                    return (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedTodo(todo)}
                                className={`p-2 rounded transition-colors flex items-center justify-center ${
                                    selectedTodo?.id === todo.id
                                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                title="View todo details"
                            >
                                <Eye size={16} />
                            </button>

                            {/* Only show edit button if todo is NOT completed */}
                            {!isCompleted && (
                                <button
                                    onClick={() => handleEdit(todo)}
                                    className="p-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center"
                                    title="Edit todo"
                                >
                                    <Edit size={16} />
                                </button>
                            )}

                            <button
                                onClick={() => handleDelete(todo.id)}
                                className="p-2 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                                title="Delete todo"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                },
                width: 160,
            },
        ],
        [selectedTodo]
    );

    // Create table instance
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: allTodo,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useSortBy,
        usePagination
    );

    // Open add modal
    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    // Close add modal
    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    // Close edit modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTodo(null);
    };

    return (
        <AdminWrapper>
            <div className="">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        ToDo List
                    </h1>
                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-700 w-[150px] text-white font-semibold py-2.5 px-5 rounded-lg shadow transition duration-200 flex items-center gap-2"
                    >
                        Add New ToDo
                    </button>
                </div>

                {/* Todo List Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table
                                    {...getTableProps()}
                                    className="min-w-full divide-y divide-gray-200"
                                >
                                    <thead className="bg-gray-100">
                                        {headerGroups.map((headerGroup) => (
                                            <tr
                                                {...headerGroup.getHeaderGroupProps()}
                                            >
                                                {headerGroup.headers.map(
                                                    (column) => (
                                                        <th
                                                            {...column.getHeaderProps(
                                                                column.getSortByToggleProps()
                                                            )}
                                                            className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                            style={{
                                                                width: column.width,
                                                            }}
                                                        >
                                                            <div className="flex items-center">
                                                                {column.render(
                                                                    "Header"
                                                                )}
                                                                {column.isSorted ? (
                                                                    column.isSortedDesc ? (
                                                                        <ChevronDown
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="ml-1"
                                                                        />
                                                                    ) : (
                                                                        <ChevronUp
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="ml-1"
                                                                        />
                                                                    )
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div>
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody
                                        {...getTableBodyProps()}
                                        className="bg-white divide-y divide-gray-200"
                                    >
                                        {page.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={columns.length}
                                                    className="px-6 py-8 text-center text-gray-500"
                                                >
                                                    <div className="flex flex-col items-center justify-center py-8">
                                                        <FileText
                                                            size={64}
                                                            className="text-gray-300 mb-4"
                                                        />
                                                        <p className="text-lg text-gray-500 mb-2">
                                                            No todos found
                                                        </p>
                                                        <p className="text-gray-400">
                                                            Add your first todo
                                                            to get started!
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            page.map((row) => {
                                                prepareRow(row);
                                                const todo = row.original;

                                                return (
                                                    <tr
                                                        {...row.getRowProps()}
                                                        className={`hover:bg-gray-50 transition-colors ${
                                                            selectedTodo?.id ===
                                                            todo.id
                                                                ? "bg-blue-50"
                                                                : ""
                                                        }`}
                                                    >
                                                        {row.cells.map(
                                                            (cell) => (
                                                                <td
                                                                    {...cell.getCellProps()}
                                                                    className="px-6 py-4"
                                                                >
                                                                    {cell.render(
                                                                        "Cell"
                                                                    )}
                                                                </td>
                                                            )
                                                        )}
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-700 mr-2">
                                        Show
                                    </span>
                                    <select
                                        value={pageSize}
                                        onChange={(e) =>
                                            setPageSize(Number(e.target.value))
                                        }
                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                    >
                                        {[5, 10, 20, 30, 50].map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="text-sm text-gray-700 ml-2">
                                        entries
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => gotoPage(0)}
                                        disabled={!canPreviousPage}
                                        className={`p-1 rounded ${
                                            !canPreviousPage
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-gray-200"
                                        }`}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => previousPage()}
                                        disabled={!canPreviousPage}
                                        className={`px-3 py-1 rounded ${
                                            !canPreviousPage
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-gray-200"
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page <strong>{pageIndex + 1}</strong> of{" "}
                                        <strong>{pageOptions.length}</strong>
                                    </span>
                                    <button
                                        onClick={() => nextPage()}
                                        disabled={!canNextPage}
                                        className={`px-3 py-1 rounded ${
                                            !canNextPage
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-gray-200"
                                        }`}
                                    >
                                        Next
                                    </button>
                                    <button
                                        onClick={() => gotoPage(pageCount - 1)}
                                        disabled={!canNextPage}
                                        className={`p-1 rounded ${
                                            !canNextPage
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-gray-200"
                                        }`}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Todo Details Section - Below the Table */}
                {selectedTodo && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Todo Information */}
                        <div className="p-6">
                            <div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FileText
                                            size={24}
                                            className="text-blue-600"
                                        />
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {selectedTodo.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!selectedTodo.is_completed && (
                                            <button
                                                onClick={() =>
                                                    handleEdit(selectedTodo)
                                                }
                                                className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded hover:bg-blue-50"
                                                title="Edit todo"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() =>
                                                setSelectedTodo(null)
                                            }
                                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                            title="Close details"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>

                                {selectedTodo.descriptions &&
                                selectedTodo.descriptions.length > 0 ? (
                                    <div className="space-y-4">
                                        {selectedTodo.descriptions
                                            .slice()
                                            .reverse()
                                            .map((description, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                                                >
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <span className="text-sm font-semibold text-blue-600">
                                                                T
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div className="font-medium text-gray-800">
                                                                    <h2 className="font-medium text-gray-800">
                                                                        Todo
                                                                        Description
                                                                    </h2>
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
                                                                description.description ||
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
                                            todo yet.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Todo Modal */}
                {isAddModalOpen && (
                    <AddTodo
                        onClose={closeAddModal}
                        handleAdd={handleAdd}
                        reloadTrigger={reloadTrigger}
                        setReloadTrigger={setReloadTrigger}
                    />
                )}

                {/* Edit Todo Modal */}
                {isEditModalOpen && editingTodo && (
                    <EditTodo
                        editingTodo={editingTodo}
                        onClose={closeEditModal}
                        handleUpdate={handleUpdate}
                        reloadTrigger={reloadTrigger}
                        setReloadTrigger={setReloadTrigger}
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default ToDOPage;