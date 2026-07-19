import React, { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Layers, ChevronDown, ChevronUp } from "lucide-react";
import PageLoader from "@/Loader/PageLoader";

const GroupedTable = ({
    rows = [],
    groupKey, // e.g. "category" or "sub_category"
    columns,
    loading = false,
    emptyMessage = "No records found.",
    footerLeft,
    footerRight,
}) => {
    // ── accordion state: only ONE group open at a time, all closed by default ──
    const [openGroupId, setOpenGroupId] = useState(null);

    const toggleGroup = (id) => {
        setOpenGroupId((prev) => (prev === id ? null : id));
    };

    // ── 1. group flat rows by the parent key ──────────────────────────────────
    const grouped = useMemo(() => {
        const map = {};
        rows.forEach((row) => {
            const parent = row[groupKey];
            const id = parent?.id ?? "__none__";
            const name = parent?.name ?? "Uncategorised";
            if (!map[id]) map[id] = { id, name, children: [] };
            map[id].children.push(row);
        });
        return Object.values(map);
    }, [rows, groupKey]);

    // ── 2. react-table instance (data is the full flat list) ─────────────────
    //    We only use it for column meta / header rendering; the tbody is manual
    //    so we can inject group-header rows between data rows.
    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const headerGroups = table.getHeaderGroups();

    return (
        <div className="relative">
            {/* ── Loading overlay ── */}

            <table className="w-full text-sm text-left">
                {/* ── thead (driven by react-table) ── */}
                <thead className="bg-gray-50 border-b border-gray-100">
                    {headerGroups.map((hg) => (
                        <tr key={hg.id}>
                            {hg.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className={[
                                        "px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider",
                                        header.column.columnDef.meta
                                            ?.className ?? "",
                                    ].join(" ")}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                {/* ── tbody (manual so group rows can be injected) ── */}
                <tbody>
                    {grouped.length === 0 && !loading ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-12 text-center text-gray-400"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        grouped.map((group) => {
                            const isOpen = openGroupId === group.id;

                            return (
                                <React.Fragment key={group.id}>
                                    {/* Group header row (clickable) */}
                                    <tr
                                        onClick={() => toggleGroup(group.id)}
                                        className="bg-indigo-50/60 border-t-2 border-indigo-100 cursor-pointer select-none hover:bg-indigo-100/60 transition-colors"
                                    >
                                        <td
                                            colSpan={columns.length}
                                            className="px-5 py-3"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                        <Layers
                                                            size={13}
                                                            className="text-indigo-600"
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-indigo-700 tracking-wide uppercase text-xs">
                                                        {group.name}
                                                    </span>
                                                    <span className="text-[11px] text-indigo-400 font-normal normal-case">
                                                        ({group.children.length}
                                                        )
                                                    </span>
                                                </div>
                                                {isOpen ? (
                                                    <ChevronUp
                                                        size={16}
                                                        className="text-indigo-500 flex-shrink-0"
                                                    />
                                                ) : (
                                                    <ChevronDown
                                                        size={16}
                                                        className="text-indigo-500 flex-shrink-0"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Data rows inside this group — only rendered when open */}
                                    {isOpen &&
                                        group.children.map((row, index) => {
                                            // Create a fake react-table row so flexRender works
                                            const tableRow = table
                                                .getRowModel()
                                                .rows.find(
                                                    (r) => r.original === row,
                                                );

                                            return (
                                                <tr
                                                    key={row.id ?? index}
                                                    className="border-t border-gray-50 hover:bg-gray-50/70 transition-colors"
                                                >
                                                    {tableRow
                                                        ? tableRow
                                                              .getVisibleCells()
                                                              .map((cell) => (
                                                                  <td
                                                                      key={
                                                                          cell.id
                                                                      }
                                                                      className={[
                                                                          "px-5 py-3",
                                                                          cell
                                                                              .column
                                                                              .columnDef
                                                                              .meta
                                                                              ?.cellClassName ??
                                                                              "",
                                                                      ].join(
                                                                          " ",
                                                                      )}
                                                                  >
                                                                      {flexRender(
                                                                          cell
                                                                              .column
                                                                              .columnDef
                                                                              .cell,
                                                                          // Inject the local group index so columns can use it
                                                                          {
                                                                              ...cell.getContext(),
                                                                              groupIndex:
                                                                                  index,
                                                                          },
                                                                      )}
                                                                  </td>
                                                              ))
                                                        : null}
                                                </tr>
                                            );
                                        })}
                                </React.Fragment>
                            );
                        })
                    )}
                </tbody>
            </table>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-400">
                <span>{footerLeft}</span>
                <span>{footerRight}</span>
            </div>
        </div>
    );
};

export default GroupedTable;
