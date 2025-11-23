import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import {
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Info,
    Trash,
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import axios from "axios";
import { Link } from "@inertiajs/react"; 

const Company = () => {
    // States
    const [allCompany, setAllCompany] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    // Use Effect
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourcompany.index"));
                setAllCompany(response.data);
                setError(null);
            } catch (error) {
                console.error("fetching error ", error);
                setError("Failed to fetch companies. Please try again later.");
                setAllCompany([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("ourcompany.delete", { id: id })
            );
            console.log(response.data);
            setReloadTrigger((prev) => prev + 1);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDetails = (slug) => {
        // This will now be handled by the Link component
        console.log("View details for company slug:", slug);
    };

    console.log("All Companies:", allCompany);
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
                    <Link href={`/crm/details/${row.original.slug}`}>
                        {value}
                    </Link>
                ),
            },
            {
                Header: "Email",
                accessor: "email",
                Cell: ({ row, value }) => (
                    <Link href={`/crm/details/${row.original.slug}`}>
                        {value}
                    </Link>
                ),
            },
            {
                Header: "Phone",
                accessor: "phone_no",
                Cell: ({ row, value }) => (
                    <Link href={`/crm/details/${row.original.slug}`}>
                        {value}
                    </Link>
                ),
            },
            {
                Header: "Designation",
                accessor: "designation",
                Cell: ({ row, value }) => (
                    <Link href={`/crm/details/${row.original.slug}`}>
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

                    return (
                        <div className="flex space-x-2">
                            <Link className="text-blue-600 hover:text-blue-800">
                                <Info />
                            </Link>

                            <button
                                onClick={() => handleDelete(id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <Trash />
                            </button>
                        </div>
                    );
                },
            },
        ],
        []
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
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: allCompany,
            initialState: { pageIndex: 0, pageSize: 5 },
        },
        useSortBy,
        usePagination
    );

    return (
        <AdminWrapper>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Companies
                        </h1>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg shadow">
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
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                                                    className="hover:bg-gray-50"
                                                >
                                                    {row.cells.map((cell) => (
                                                        <td
                                                            {...cell.getCellProps()}
                                                            className="px-6 py-4 whitespace-nowrap"
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
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                No companies found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between flex-col md:flex-row mt-4">
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
                                    {[5, 10, 20].map((size) => (
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
        </AdminWrapper>
    );
};

export default Company;
