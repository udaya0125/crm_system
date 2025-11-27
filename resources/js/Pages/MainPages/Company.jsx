import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import {
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Info,
    Trash,
    X,
    Search,
} from "lucide-react";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import { Link } from "@inertiajs/react";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

// Global Filter Component
const GlobalFilter = ({
    globalFilter,
    setGlobalFilter,
}) => {
    const [value, setValue] = useState(globalFilter);

    const onChange = useCallback((value) => {
        setGlobalFilter(value || undefined);
    }, [setGlobalFilter]);

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={value || ""}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder="Search by company name..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
        </div>
    );
};

const Company = () => {
    // States
    const [allCompany, setAllCompany] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [followUpLoading, setFollowUpLoading] = useState(false);

    // React Hook Form for follow-up date
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isSubmitting },
        setError: setFormError,
    } = useForm();

    // Fetch companies function
    const fetchCompany = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(route("ourcompany.index"));
            setAllCompany(response.data);
        } catch (error) {
            console.error("fetching error ", error);
            const errorMessage = "Failed to fetch companies. Please try again later.";
            setError(errorMessage);
            setAllCompany([]);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Use Effect
    useEffect(() => {
        fetchCompany();
    }, [reloadTrigger, fetchCompany]);

    // Reset form when selected company changes
    useEffect(() => {
        if (selectedCompany) {
            setValue("followUpDate", selectedCompany.follow_up_date || "");
        }
    }, [selectedCompany, setValue]);

    // Handle delete company
    const handleDelete = async (id) => {
        if (
            !confirm(
                "Are you sure you want to delete this company and all its related records? This action cannot be undone."
            )
        ) {
            return;
        }

        const deleteToast = toast.loading("Deleting company...");

        try {
            setDeleteLoading(id);
            const response = await axios.delete(
                route("ourcompany.delete", { id: id })
            );

            console.log("Delete response:", response.data);

            toast.success(response.data.message || "Company deleted successfully", {
                id: deleteToast,
            });

            setReloadTrigger((prev) => prev + 1);
        } catch (error) {
            console.error("Delete error:", error);
            const errorMessage =
                error.response?.data?.message || "Failed to delete company";
            toast.error(errorMessage, {
                id: deleteToast,
            });
        } finally {
            setDeleteLoading(null);
        }
    };

    // Handle view details
    const handleViewDetails = useCallback((company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    }, []);

    // Close modal
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedCompany(null);
        reset();
    }, [reset]);

    // Submit follow-up date
    const onSubmitFollowUp = async (formData) => {
        if (!selectedCompany) return;

        const updateToast = toast.loading("Updating follow-up date...");

        try {
            setFollowUpLoading(true);

            const apiData = {
                follow_up_date: formData.followUpDate,
            };

            const response = await axios.put(
                route("ourcompany.update", { id: selectedCompany.id }),
                apiData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Follow-up date updated:", response.data);

            // Update the local state with the new follow-up date
            setAllCompany((prevCompanies) =>
                prevCompanies.map((company) =>
                    company.id === selectedCompany.id
                        ? { ...company, follow_up_date: formData.followUpDate }
                        : company
                )
            );

            // Update selected company in modal
            setSelectedCompany((prev) => ({
                ...prev,
                follow_up_date: formData.followUpDate,
            }));

            toast.success("Follow-up date updated successfully!", {
                id: updateToast,
            });
        } catch (error) {
            console.error("Error updating follow-up date:", error);

            if (error.response && error.response.data.errors) {
                const apiErrors = error.response.data.errors;

                Object.keys(apiErrors).forEach((key) => {
                    if (key === "follow_up_date") {
                        setFormError("followUpDate", {
                            type: "server",
                            message: apiErrors[key][0],
                        });
                        toast.error(apiErrors[key][0], {
                            id: updateToast,
                        });
                    }
                });
            } else {
                const errorMessage = error.response?.data?.message || "Failed to update follow-up date. Please try again.";
                toast.error(errorMessage, {
                    id: updateToast,
                });
            }
        } finally {
            setFollowUpLoading(false);
        }
    };

    // Helper function to get input className with error state
    const getInputClassName = (fieldName) => {
        const baseClass =
            "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200";
        return errors[fieldName]
            ? `${baseClass} border-red-500 focus:ring-red-500 focus:border-red-500`
            : baseClass;
    };

    // Close modal when clicking outside or pressing escape
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen, closeModal]);

    // Columns definition
    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Company Name",
                accessor: "company_name",
                Cell: ({ row, value }) => (
                    <Link
                        href={`/crm/details/${row.original.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                        {value}
                    </Link>
                ),
            },
            {
                Header: "Email",
                accessor: "email",
                Cell: ({ row, value }) => (
                    <Link
                        href={`/crm/details/${row.original.slug}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                        {value}
                    </Link>
                ),
            },
            {
                Header: "Phone",
                accessor: "phone_no",
                Cell: ({ row, value }) => (
                    <Link
                        href={`/crm/details/${row.original.slug}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                        {value}
                    </Link>
                ),
            },
            {
                Header: "Designation",
                accessor: "designation",
                Cell: ({ row, value }) => (
                    <Link
                        href={`/crm/details/${row.original.slug}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                        {value}
                    </Link>
                ),
            },
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    const id = row.original.id;
                    const company = row.original;

                    return (
                        <div className="flex space-x-3">
                            <button
                                onClick={() => handleViewDetails(company)}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 rounded hover:bg-blue-50"
                                title="View Details"
                            >
                                <Info size={18} />
                            </button>

                            <button
                                onClick={() => handleDelete(id)}
                                disabled={deleteLoading === id}
                                className={`text-red-600 hover:text-red-800 transition-colors duration-200 p-1 rounded hover:bg-red-50 ${
                                    deleteLoading === id
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                title="Delete Company"
                            >
                                {deleteLoading === id ? (
                                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Trash size={18} />
                                )}
                            </button>
                        </div>
                    );
                },
            },
        ],
        [deleteLoading, handleViewDetails]
    );

    // React Table instance with global filter
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
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
        preGlobalFilteredRows,
    } = useTable(
        {
            columns,
            data: allCompany,
            initialState: { pageIndex: 0, pageSize: 5 },
            globalFilter: useMemo(() => (rows, columnIds, filterValue) => {
                return rows.filter(row => {
                    const companyName = row.values.company_name?.toString().toLowerCase() || '';
                    return companyName.includes(filterValue.toLowerCase());
                });
            }, []),
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    // Pagination handlers with toast
    const handleFirstPage = () => {
        gotoPage(0);
        toast.success("First page");
    };

    const handleLastPage = () => {
        gotoPage(pageCount - 1);
        toast.success("Last page");
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        toast.success(`Showing ${e.target.value} entries per page`);
    };

    // Clear search function
    const clearSearch = () => {
        setGlobalFilter(undefined);
        toast.success("Search cleared");
    };

    return (
        <AdminWrapper>
            {/* React Hot Toast Container */}
            {/* <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                    loading: {
                        duration: Infinity,
                        iconTheme: {
                            primary: '#3B82F6',
                            secondary: '#fff',
                        },
                    },
                }}
            /> */}

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Companies
                        </h1>
                        {allCompany.length > 0 && (
                            <span className="ml-3 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                                {allCompany.length} companies
                            </span>
                        )}
                    </div>

                    {/* Search Box */}
                    <div className="w-full md:w-auto mt-4 md:mt-0">
                        <div className="flex items-center space-x-2">
                            <div className="w-64">
                                <GlobalFilter
                                    globalFilter={globalFilter}
                                    setGlobalFilter={setGlobalFilter}
                                />
                            </div>
                            {globalFilter && (
                                <button
                                    onClick={clearSearch}
                                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">
                            Loading companies...
                        </p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">
                        <p className="font-medium">{error}</p>
                        <button
                            onClick={() => {
                                setReloadTrigger((prev) => prev + 1);
                                toast.loading("Reloading companies...");
                            }}
                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Search Results Info */}
                        {/* {globalFilter && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    Showing results for: "<strong>{globalFilter}</strong>"
                                    {page.length === 0 && " - No companies found"}
                                    {page.length > 0 && ` - ${page.length} company${page.length !== 1 ? 'ies' : ''} found`}
                                </p>
                            </div>
                        )} */}

                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table
                                {...getTableProps()}
                                className="min-w-full divide-y divide-gray-200"
                            >
                                <thead className="bg-gray-50">
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
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
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
                                    {page.length > 0 ? (
                                        page.map((row) => {
                                            prepareRow(row);
                                            return (
                                                <tr
                                                    {...row.getRowProps()}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    {row.cells.map((cell) => (
                                                        <td
                                                            {...cell.getCellProps()}
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                        >
                                                            {cell.render(
                                                                "Cell"
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={columns.length}
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <Info
                                                        size={48}
                                                        className="text-gray-300 mb-2"
                                                    />
                                                    <p className="text-lg font-medium text-gray-400">
                                                        {globalFilter ? "No matching companies found" : "No companies found"}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {globalFilter ? "Try adjusting your search terms" : "There are no companies to display at the moment."}
                                                    </p>
                                                    {globalFilter && (
                                                        <button
                                                            onClick={clearSearch}
                                                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                                                        >
                                                            Clear Search
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pageCount > 1 && (
                            <div className="flex items-center justify-between flex-col md:flex-row mt-6 space-y-4 md:space-y-0">
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-700 mr-2">
                                        Show
                                    </span>
                                    <select
                                        value={pageSize}
                                        onChange={handlePageSizeChange}
                                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {[5, 10, 20, 50].map((size) => (
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
                                        onClick={handleFirstPage}
                                        disabled={!canPreviousPage}
                                        className={`p-2 rounded transition-colors ${
                                            !canPreviousPage
                                                ? "opacity-50 cursor-not-allowed text-gray-400"
                                                : "text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            previousPage();
                                            toast.success("Previous page");
                                        }}
                                        disabled={!canPreviousPage}
                                        className={`px-4 py-2 text-sm rounded transition-colors ${
                                            !canPreviousPage
                                                ? "opacity-50 cursor-not-allowed text-gray-400"
                                                : "text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700 px-3">
                                        Page <strong>{pageIndex + 1}</strong> of{" "}
                                        <strong>{pageOptions.length}</strong>
                                    </span>
                                    <button
                                        onClick={() => {
                                            nextPage();
                                            toast.success("Next page");
                                        }}
                                        disabled={!canNextPage}
                                        className={`px-4 py-2 text-sm rounded transition-colors ${
                                            !canNextPage
                                                ? "opacity-50 cursor-not-allowed text-gray-400"
                                                : "text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        Next
                                    </button>
                                    <button
                                        onClick={handleLastPage}
                                        disabled={!canNextPage}
                                        className={`p-2 rounded transition-colors ${
                                            !canNextPage
                                                ? "opacity-50 cursor-not-allowed text-gray-400"
                                                : "text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Details Modal */}
            {isModalOpen && selectedCompany && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <h2 className="font-medium text-gray-600">
                                    Company Name:
                                </h2>
                                <h1 className="text-xl font-bold text-gray-800">
                                    {selectedCompany.company_name}
                                </h1>
                            </div>

                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 block mb-1">
                                            Company Name
                                        </label>
                                        <p className=" text-gray-900">
                                            {selectedCompany.company_name ||
                                                "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 block mb-1">
                                            Email Address
                                        </label>
                                        <p className="text-gray-900 break-all">
                                            {selectedCompany.email || "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 block mb-1">
                                            Phone Number
                                        </label>
                                        <p className="text-gray-900">
                                            {selectedCompany.phone_no || "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 block mb-1">
                                            Designation
                                        </label>
                                        <p className="text-gray-900">
                                            {selectedCompany.designation ||
                                                "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 block mb-1">
                                            Created Date
                                        </label>
                                        <p className="text-gray-900">
                                            {selectedCompany.created_at
                                                ? new Date(
                                                      selectedCompany.created_at
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          year: "numeric",
                                                          month: "long",
                                                          day: "numeric",
                                                      }
                                                  )
                                                : "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 block mb-1">
                                            Last Updated
                                        </label>
                                        <p className="text-gray-900">
                                            {selectedCompany.updated_at
                                                ? new Date(
                                                      selectedCompany.updated_at
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          year: "numeric",
                                                          month: "long",
                                                          day: "numeric",
                                                      }
                                                  )
                                                : "N/A"}
                                        </p>
                                    </div>

                                    {/* Follow Up Date Form */}
                                    <div>
                                        <form
                                            onSubmit={handleSubmit(
                                                onSubmitFollowUp
                                            )}
                                        >
                                            <label className="text-sm font-medium text-gray-500 block mb-1">
                                                Follow Up Date
                                            </label>
                                            <input
                                                type="date"
                                                {...register("followUpDate", {
                                                    required:
                                                        "Follow-up date is required",
                                                    validate: {
                                                        futureDate: (value) => {
                                                            if (!value)
                                                                return true;
                                                            const selectedDate =
                                                                new Date(value);
                                                            const today =
                                                                new Date();
                                                            today.setHours(
                                                                0,
                                                                0,
                                                                0,
                                                                0
                                                            );
                                                            return (
                                                                selectedDate >=
                                                                    today ||
                                                                "Follow-up date must be today or in the future"
                                                            );
                                                        },
                                                    },
                                                })}
                                                className={getInputClassName(
                                                    "followUpDate"
                                                )}
                                            />
                                            {errors.followUpDate && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        errors.followUpDate
                                                            .message
                                                    }
                                                </p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={
                                                    followUpLoading ||
                                                    isSubmitting
                                                }
                                                className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {followUpLoading
                                                    ? "Updating..."
                                                    : "Update Follow-up Date"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information Section */}
                            <div className="mt-8 flex border-t border-gray-200">
                                <div className="p-4 w-full">
                                    <div className="flex justify-between space-x-3">
                                        <button
                                            onClick={closeModal}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        >
                                            Close Preview
                                        </button>
                                        <Link
                                            href={`/crm/details/${selectedCompany.slug}`}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                            onClick={() => toast.success("Navigating to full details...")}
                                        >
                                            <Info size={16} className="mr-2" />
                                            View Full Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminWrapper>
    );
};

export default Company;