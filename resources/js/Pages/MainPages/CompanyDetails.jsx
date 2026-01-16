import AdminWrapper from "@/AdminWrapper/AdminWrapper";

import {
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Info,
    Trash,
    Search,
    Eye,
    Calendar,
    Phone,
    Mail,
    User,
    FileText,
    Clock,
    MapPin,
    Users,
} from "lucide-react";
import React, {
    useState,
    useMemo,
    useEffect,
    useCallback,
    useRef,
} from "react";
import {
    useTable,
    useSortBy,
    usePagination,
    useGlobalFilter,
} from "react-table";
import axios from "axios";
import { Link } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import CompanyPopUp from "./CompanyPopUp";

// Global Filter Component with Debounce
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
    const [value, setValue] = useState(globalFilter || "");
    const debounceTimeout = useRef(null);

    useEffect(() => {
        setValue(globalFilter || "");
    }, [globalFilter]);

    const onChange = useCallback(
        (newValue) => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }

            debounceTimeout.current = setTimeout(() => {
                setGlobalFilter(newValue || undefined);
            }, 300);
        },
        [setGlobalFilter]
    );

    return (
        <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder="Search by company name..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
        </div>
    );
};

const CompanyDetails = () => {
    const [allCompany, setAllCompany] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [followUpLoading, setFollowUpLoading] = useState(false);
    const abortControllerRef = useRef(null);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
        setError: setFormError,
        clearErrors,
    } = useForm();

    useEffect(() => {
        const fetchAllCompany = async () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(route("ourcompany.index"), {
                    signal: abortControllerRef.current.signal,
                });
                setAllCompany(response.data);
            } catch (error) {
                if (
                    error.name === "CanceledError" ||
                    error.name === "AbortError"
                ) {
                    return;
                }
                console.error("Fetching error", error);
                setError("Failed to load companies. Please try again.");
                toast.error("Failed to load companies");
            } finally {
                setLoading(false);
            }
        };

        fetchAllCompany();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [reloadTrigger]);

    const handleDelete = useCallback(async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this company and all its related records? This action cannot be undone."
            )
        ) {
            return;
        }

        const deleteToast = toast.loading("Deleting company...");
        try {
            setDeleteLoading(id);
            const response = await axios.delete(
                route("ourcompany.delete", { id })
            );
            toast.success(
                response.data.message || "Company deleted successfully",
                {
                    id: deleteToast,
                    duration: 3000,
                }
            );
            setReloadTrigger((prev) => prev + 1);
        } catch (error) {
            console.error("Delete error:", error);
            const errorMessage =
                error.response?.data?.message || "Failed to delete company";
            toast.error(errorMessage, {
                id: deleteToast,
                duration: 4000,
            });
        } finally {
            setDeleteLoading(null);
        }
    }, []);

    const handleViewDetails = useCallback(
        (company) => {
            setSelectedCompany(company);
            setIsModalOpen(true);
            reset();
            clearErrors();
        },
        [reset, clearErrors]
    );

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedCompany(null);
        reset();
        clearErrors();
    }, [reset, clearErrors]);

    const onSubmitFollowUp = useCallback(
        async (formData) => {
            if (!selectedCompany) return;

            const updateToast = toast.loading("Updating follow-up date...");
            try {
                setFollowUpLoading(true);
                const apiData = {
                    follow_up_date: formData.followUpDate,
                    _method: "PUT",
                };

                const response = await axios.post(
                    route("ourcompany.update", { id: selectedCompany.id }),
                    apiData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );

                setAllCompany((prevCompanies) =>
                    prevCompanies.map((company) =>
                        company.id === selectedCompany.id
                            ? {
                                  ...company,
                                  follow_up_date: formData.followUpDate,
                              }
                            : company
                    )
                );

                setSelectedCompany((prev) => ({
                    ...prev,
                    follow_up_date: formData.followUpDate,
                }));

                toast.success("Follow-up date updated successfully!", {
                    id: updateToast,
                    duration: 3000,
                });

                setTimeout(() => {
                    closeModal();
                }, 1000);
            } catch (error) {
                console.error("Error updating follow-up date:", error);

                if (error.response?.data?.errors) {
                    const apiErrors = error.response.data.errors;
                    Object.keys(apiErrors).forEach((key) => {
                        if (key === "follow_up_date") {
                            setFormError("followUpDate", {
                                type: "server",
                                message: apiErrors[key][0],
                            });
                            toast.error(apiErrors[key][0], {
                                id: updateToast,
                                duration: 4000,
                            });
                        }
                    });
                } else {
                    const errorMessage =
                        error.response?.data?.message ||
                        "Failed to update follow-up date.";
                    toast.error(errorMessage, {
                        id: updateToast,
                        duration: 4000,
                    });
                }
            } finally {
                setFollowUpLoading(false);
            }
        },
        [selectedCompany, setFormError, closeModal]
    );

    const columns = useMemo(
        () => [
            {
                Header: "S/N",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
                disableSortBy: true,
            },
            {
                Header: "Company Name",
                accessor: "company_name",
                Cell: ({ row, value }) => (
                    <Link
                        href={`/crm/details/${row.original.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline flex items-center gap-2"
                    >
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        {value || "N/A"}
                    </Link>
                ),
            },
            {
                Header: "Initial Response",
                accessor: "initial_responses",
                Cell: ({ value }) => (
                    <div className="max-w-[150px]">
                        {value ? (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            value.initial_response ===
                                            "positive"
                                                ? "bg-green-500"
                                                : value.initial_response ===
                                                  "negative"
                                                ? "bg-red-500"
                                                : "bg-yellow-500"
                                        }`}
                                    ></span>
                                    <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                            value.initial_response ===
                                            "positive"
                                                ? "bg-green-100 text-green-800"
                                                : value.initial_response ===
                                                  "negative"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {value.initial_response?.toUpperCase() ||
                                            "N/A"}
                                    </span>
                                </div>
                                {value.initial_notes && (
                                    <div
                                        className="text-xs text-gray-500 truncate"
                                        title={value.initial_notes.replace(
                                            /<[^>]*>/g,
                                            ""
                                        )}
                                    >
                                        {value.initial_notes
                                            .replace(/<[^>]*>/g, "")
                                            .substring(0, 40)}
                                        ...
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                <span>No response</span>
                            </div>
                        )}
                    </div>
                ),
            },
            {
                Header: "Meeting",
                accessor: "meetings",
                Cell: ({ value }) => (
                    <div className="max-w-[180px]">
                        {value ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar
                                        size={12}
                                        className="text-gray-500"
                                    />
                                    <span className="text-xs font-medium">
                                        {value.meeting_date}
                                    </span>
                                    <Clock
                                        size={12}
                                        className="text-gray-500"
                                    />
                                    <span className="text-xs">
                                        {value.meeting_time}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                                            value.meeting_type === "in-person"
                                                ? "bg-blue-100 text-blue-800"
                                                : value.meeting_type ===
                                                  "virtual"
                                                ? "bg-purple-100 text-purple-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {value.meeting_type === "in-person" && (
                                            <MapPin size={10} />
                                        )}
                                        {value.meeting_type === "virtual" && (
                                            <Phone size={10} />
                                        )}
                                        {value.meeting_type || "N/A"}
                                    </span>
                                    {value.attendee && (
                                        <span
                                            className="text-xs text-gray-500"
                                            title={value.attendee}
                                        >
                                            <Users
                                                size={10}
                                                className="inline mr-1"
                                            />
                                            {value.attendee.length > 15
                                                ? value.attendee.substring(
                                                      0,
                                                      15
                                                  ) + "..."
                                                : value.attendee}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Calendar size={14} />
                                <span>No meeting</span>
                            </div>
                        )}
                    </div>
                ),
            },
            {
                Header: "Follow-up",
                accessor: "follow_up_responses",
                Cell: ({ value }) => (
                    <div className="max-w-[150px]">
                        {value ? (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            value.follow_up_response ===
                                            "positive"
                                                ? "bg-green-500"
                                                : value.follow_up_response ===
                                                  "negative"
                                                ? "bg-red-500"
                                                : "bg-yellow-500"
                                        }`}
                                    ></span>
                                    <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                            value.follow_up_response ===
                                            "positive"
                                                ? "bg-green-100 text-green-800"
                                                : value.follow_up_response ===
                                                  "negative"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {value.follow_up_response?.toUpperCase() ||
                                            "N/A"}
                                    </span>
                                </div>
                                {value.follow_up_notes && (
                                    <div
                                        className="text-xs text-gray-500 truncate"
                                        title={value.follow_up_notes.replace(
                                            /<[^>]*>/g,
                                            ""
                                        )}
                                    >
                                        {value.follow_up_notes
                                            .replace(/<[^>]*>/g, "")
                                            .substring(0, 40)}
                                        ...
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                <span>No follow-up</span>
                            </div>
                        )}
                    </div>
                ),
            },
            {
                Header: "Contract",
                accessor: "contracts",
                Cell: ({ value }) => (
                    <div className="max-w-[120px]">
                        {value ? (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <FileText
                                        size={14}
                                        className="text-green-500"
                                    />
                                    <span className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                                        Contract
                                    </span>
                                </div>
                                {value.image && (
                                    <a
                                        href={`${imgurl}/${value.image}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                        title="View Contract"
                                    >
                                        <Eye size={10} />
                                        View File
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <FileText size={14} />
                                <span>No contract</span>
                            </div>
                        )}
                    </div>
                ),
            },
            {
                Header: "Contact Info",
                accessor: "contact_info",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <div className="space-y-1 max-w-[180px]">
                        <div className="flex items-center gap-2">
                            <Mail size={12} className="text-gray-500" />
                            <a
                                href={`mailto:${row.original.email}`}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline truncate"
                                title={row.original.email}
                            >
                                {row.original.email || "N/A"}
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={12} className="text-gray-500" />
                            <a
                                href={`tel:${row.original.phone_no}`}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                {row.original.phone_no || "N/A"}
                            </a>
                        </div>
                        {row.original.designation && (
                            <div className="flex items-center gap-2">
                                <User size={12} className="text-gray-500" />
                                <span
                                    className="text-xs text-gray-600 truncate"
                                    title={row.original.designation}
                                >
                                    {row.original.designation}
                                </span>
                            </div>
                        )}
                    </div>
                ),
            },
            {
                Header: "Follow-up Date",
                accessor: "follow_up_date",
                Cell: ({ value }) => {
                    if (!value)
                        return (
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar size={14} />
                                <span>N/A</span>
                            </div>
                        );

                    try {
                        const date = new Date(value);
                        if (isNaN(date.getTime())) {
                            return (
                                <span className="text-gray-500">
                                    Invalid Date
                                </span>
                            );
                        }

                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const followUpDate = new Date(date);
                        followUpDate.setHours(0, 0, 0, 0);
                        const isPastDue = followUpDate < today;
                        const isToday =
                            followUpDate.getTime() === today.getTime();

                        return (
                            <div
                                className={`flex items-center gap-2 ${
                                    isPastDue
                                        ? "text-red-600 font-medium"
                                        : isToday
                                        ? "text-orange-600 font-medium"
                                        : ""
                                }`}
                            >
                                <Calendar size={14} />
                                <div className="flex flex-col">
                                    <span className="whitespace-nowrap">
                                        {date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                    {(isPastDue || isToday) && (
                                        <span
                                            className={`text-xs px-1.5 py-0.5 rounded mt-1 w-fit ${
                                                isPastDue
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-orange-100 text-orange-800"
                                            }`}
                                        >
                                            {isPastDue ? "Past Due" : "Today"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    } catch (error) {
                        return (
                            <span className="text-gray-500">Invalid Date</span>
                        );
                    }
                },
            },
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                width: 100,
                Cell: ({ row }) => {
                    const id = row.original.id;
                    const company = row.original;
                    return (
                        <div className="flex space-x-1">
                            <button
                                onClick={() => handleViewDetails(company)}
                                className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 rounded hover:bg-blue-50"
                                title="View Details"
                                disabled={deleteLoading === id}
                            >
                                <Info size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(id)}
                                disabled={deleteLoading === id}
                                className={`text-red-600 hover:text-red-800 transition-colors p-1.5 rounded hover:bg-red-50 ${
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
        [handleDelete, handleViewDetails, deleteLoading]
    );

    const tableInstance = useTable(
        {
            columns,
            data: allCompany,
            initialState: {
                pageIndex: 0,
                pageSize: 10,
                sortBy: [{ id: "rowIndex", desc: false }],
            },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

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
    } = tableInstance;

    const handleFirstPage = () => {
        gotoPage(0);
    };

    const handleLastPage = () => {
        gotoPage(pageCount - 1);
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
    };

    const clearSearch = () => {
        setGlobalFilter(undefined);
    };

    const retryFetch = () => {
        setReloadTrigger((prev) => prev + 1);
        toast.loading("Reloading companies...");
    };

    return (
        <AdminWrapper>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: "#10B981",
                            secondary: "#fff",
                        },
                    },
                    error: {
                        duration: 4000,
                    },
                }}
            />

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center flex-wrap gap-2">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            Companies CRM
                        </h1>
                        {allCompany.length > 0 && (
                            <span className="px-2.5 py-1 text-xs sm:text-sm bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                                {allCompany.length}{" "}
                                {allCompany.length === 1
                                    ? "company"
                                    : "companies"}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                        <GlobalFilter
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                        {globalFilter && (
                            <button
                                onClick={clearSearch}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
                            >
                                Clear Search
                            </button>
                        )}
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
                            onClick={retryFetch}
                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
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
                                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
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
                                                                            14
                                                                        }
                                                                        className="ml-1"
                                                                    />
                                                                ) : (
                                                                    <ChevronUp
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="ml-1"
                                                                    />
                                                                )
                                                            ) : null}
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
                                                            className="px-4 py-3 align-middle"
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
                                                className="px-4 py-12 text-center text-gray-500"
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <Search
                                                        size={48}
                                                        className="text-gray-300 mb-4"
                                                    />
                                                    <p className="text-lg font-medium text-gray-400 mb-2">
                                                        {globalFilter
                                                            ? "No matching companies found"
                                                            : "No companies found"}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mb-4 max-w-md">
                                                        {globalFilter
                                                            ? "Try adjusting your search terms or clear the search to see all companies."
                                                            : "Get started by adding your first company."}
                                                    </p>
                                                    {globalFilter && (
                                                        <button
                                                            onClick={
                                                                clearSearch
                                                            }
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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

                        {pageCount > 1 && allCompany.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                                <div className="flex items-center flex-wrap gap-2 text-sm text-gray-700">
                                    <span>Showing</span>
                                    <span className="font-medium">
                                        {pageIndex * pageSize + 1}
                                    </span>
                                    <span>to</span>
                                    <span className="font-medium">
                                        {Math.min(
                                            (pageIndex + 1) * pageSize,
                                            allCompany.length
                                        )}
                                    </span>
                                    <span>of</span>
                                    <span className="font-medium">
                                        {allCompany.length}
                                    </span>
                                    <span>entries</span>
                                    <select
                                        value={pageSize}
                                        onChange={handlePageSizeChange}
                                        className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {[5, 10, 20, 50].map((size) => (
                                            <option key={size} value={size}>
                                                {size} per page
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={handleFirstPage}
                                        disabled={
                                            !canPreviousPage || pageIndex === 0
                                        }
                                        className={`p-1.5 rounded transition-colors ${
                                            !canPreviousPage || pageIndex === 0
                                                ? "opacity-50 cursor-not-allowed text-gray-400"
                                                : "text-gray-600 hover:bg-gray-200"
                                        }`}
                                        title="First Page"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={previousPage}
                                        disabled={!canPreviousPage}
                                        className={`px-3 py-1.5 text-sm rounded transition-colors ${
                                            !canPreviousPage
                                                ? "opacity-50 cursor-not-allowed text-gray-400"
                                                : "text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center mx-2">
                                        {Array.from(
                                            { length: Math.min(5, pageCount) },
                                            (_, i) => {
                                                let pageNum;
                                                if (pageCount <= 5) {
                                                    pageNum = i;
                                                } else if (pageIndex < 3) {
                                                    pageNum = i;
                                                } else if (
                                                    pageIndex >
                                                    pageCount - 4
                                                ) {
                                                    pageNum = pageCount - 5 + i;
                                                } else {
                                                    pageNum = pageIndex - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() =>
                                                            gotoPage(pageNum)
                                                        }
                                                        className={`w-8 h-8 mx-1 rounded text-sm ${
                                                            pageIndex ===
                                                            pageNum
                                                                ? "bg-blue-600 text-white"
                                                                : "text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        {pageNum + 1}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                    <button
                                        onClick={nextPage}
                                        disabled={!canNextPage}
                                        className={`px-3 py-1.5 text-sm rounded transition-colors ${
                                            !canNextPage
                                                ? "opacity-50 cursor-not-allowed text-gray-400"
                                                : "text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        Next
                                    </button>
                                    <button
                                        onClick={handleLastPage}
                                        disabled={
                                            !canNextPage ||
                                            pageIndex === pageCount - 1
                                        }
                                        className={`p-1.5 rounded transition-colors ${
                                            !canNextPage ||
                                            pageIndex === pageCount - 1
                                                ? "opacity-50 cursor-not-allowed text-gray-400"
                                                : "text-gray-600 hover:bg-gray-200"
                                        }`}
                                        title="Last Page"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <CompanyPopUp
                selectedCompany={selectedCompany}
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                onSubmitFollowUp={onSubmitFollowUp}
                followUpLoading={followUpLoading}
                isSubmitting={isSubmitting}
                setValue={setValue}
                errors={errors}
                register={register}
                handleSubmit={handleSubmit}
            />
        </AdminWrapper>
    );
};

export default CompanyDetails;
