import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import gsap from "gsap";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";
import { Building2, Calendar, ChevronDown, X } from "lucide-react";

// Index-based palette — cycles so any role name from `users.role` gets its
// own unique, stable color instead of falling back to a single gray.
const ROLE_PALETTE = [
    { from: "#818CF8", to: "#6366F1" }, // indigo
    { from: "#FDBA74", to: "#F97316" }, // orange
    { from: "#6EE7B7", to: "#10B981" }, // emerald
    { from: "#F9A8D4", to: "#EC4899" }, // pink
    { from: "#7DD3FC", to: "#0EA5E9" }, // sky
    { from: "#FDE047", to: "#D97706" }, // amber
    { from: "#C4B5FD", to: "#8B5CF6" }, // violet
    { from: "#5EEAD4", to: "#14B8A6" }, // teal
    { from: "#FCA5A5", to: "#EF4444" }, // red
    { from: "#BEF264", to: "#84CC16" }, // lime
];
const roleGradient = (i) => ROLE_PALETTE[i % ROLE_PALETTE.length];

// ---------------------------------------------------------------------------
// Date range filter (same shape as TaskReports.jsx's DateRangeFilter)
// ---------------------------------------------------------------------------

const RANGE_PRESETS = [
    { key: "7d", label: "7 Days" },
    { key: "1m", label: "1 Month" },
    { key: "3m", label: "3 Months" },
    { key: "6m", label: "6 Months" },
    { key: "12m", label: "12 Months" },
    { key: "all", label: "All Time" },
    { key: "custom", label: "Custom" },
];

const DEFAULT_FILTER = { preset: "all", startDate: "", endDate: "" };

function toISODate(d) {
    return d.toISOString().split("T")[0];
}

function computeRange(presetKey) {
    if (presetKey === "all" || presetKey === "custom") return { startDate: "", endDate: "" };
    const end = new Date();
    const start = new Date();
    switch (presetKey) {
        case "7d":
            start.setDate(start.getDate() - 7);
            break;
        case "1m":
            start.setMonth(start.getMonth() - 1);
            break;
        case "3m":
            start.setMonth(start.getMonth() - 3);
            break;
        case "6m":
            start.setMonth(start.getMonth() - 6);
            break;
        case "12m":
            start.setMonth(start.getMonth() - 12);
            break;
        default:
            return { startDate: "", endDate: "" };
    }
    return { startDate: toISODate(start), endDate: toISODate(end) };
}

function fmtShort(dateStr) {
    if (!dateStr) return "";
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function filterLabel(filter) {
    if (filter.preset === "custom") {
        return filter.startDate && filter.endDate
            ? `${fmtShort(filter.startDate)} – ${fmtShort(filter.endDate)}`
            : "Custom range";
    }
    return RANGE_PRESETS.find((p) => p.key === filter.preset)?.label ?? "All Time";
}

function DateRangeFilter({ filter, onChange, accent }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleClick = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const isActive = filter.preset !== "all";

    const handlePresetClick = (preset) => {
        if (preset.key === "custom") {
            onChange({ preset: "custom", startDate: filter.startDate, endDate: filter.endDate });
            return;
        }
        onChange({ preset: preset.key, ...computeRange(preset.key) });
        setOpen(false);
    };

    const handleCustomDate = (field, value) => {
        onChange({ ...filter, preset: "custom", [field]: value });
    };

    return (
        <div className="relative" ref={rootRef}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border transition-colors ${
                    isActive
                        ? "border-transparent text-white shadow-sm"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
                style={isActive ? { background: accent } : undefined}
            >
                <Calendar size={12} strokeWidth={2.25} />
                <span className="max-w-[120px] truncate">{filterLabel(filter)}</span>
                <ChevronDown size={12} strokeWidth={2.5} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>

            {isActive && (
                <button
                    type="button"
                    onClick={() => onChange(DEFAULT_FILTER)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gray-900 text-white flex items-center justify-center shadow"
                    title="Clear filter"
                >
                    <X size={9} strokeWidth={3} />
                </button>
            )}

            {open && (
                <div className="absolute right-0 mt-2 z-20 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-3">
                    <div className="grid grid-cols-2 gap-1.5">
                        {RANGE_PRESETS.map((p) => {
                            const selected = filter.preset === p.key;
                            return (
                                <button
                                    key={p.key}
                                    type="button"
                                    onClick={() => handlePresetClick(p)}
                                    className={`text-xs font-medium px-2.5 py-1.5 rounded-xl transition-colors ${
                                        selected ? "text-white" : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                                    }`}
                                    style={selected ? { background: accent } : undefined}
                                >
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>

                    {filter.preset === "custom" && (
                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                                From
                                <input
                                    type="date"
                                    value={filter.startDate}
                                    max={filter.endDate || undefined}
                                    onChange={(e) => handleCustomDate("startDate", e.target.value)}
                                    className="mt-1 w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-2 py-1.5 normal-case font-normal focus:outline-none focus:ring-2 focus:ring-gray-200"
                                />
                            </label>
                            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                                To
                                <input
                                    type="date"
                                    value={filter.endDate}
                                    min={filter.startDate || undefined}
                                    onChange={(e) => handleCustomDate("endDate", e.target.value)}
                                    className="mt-1 w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-2 py-1.5 normal-case font-normal focus:outline-none focus:ring-2 focus:ring-gray-200"
                                />
                            </label>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={!filter.startDate || !filter.endDate}
                                className="w-full text-xs font-semibold text-white rounded-lg py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: accent }}
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function useTiltRef() {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const rotateX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
        const rotateY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
        const lift = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

        const handleMove = (e) => {
            const rect = el.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            rotateY(px * 6);
            rotateX(-py * 6);
            lift(-4);
        };
        const handleLeave = () => {
            rotateX(0);
            rotateY(0);
            lift(0);
        };

        el.addEventListener("mousemove", handleMove);
        el.addEventListener("mouseleave", handleLeave);
        return () => {
            el.removeEventListener("mousemove", handleMove);
            el.removeEventListener("mouseleave", handleLeave);
        };
    }, []);

    return ref;
}

function CardShell({ title, subtitle, icon: Icon, iconTint, headerExtra, children }) {
    const tiltRef = useTiltRef();
    return (
        <div
            ref={tiltRef}
            style={{ transformStyle: "preserve-3d", transformPerspective: 900, willChange: "transform" }}
            className="relative w-full rounded-[28px] p-px bg-gradient-to-br from-gray-200/70 via-gray-100 to-transparent "
        >
            <div className="relative bg-white rounded-[27px] h-full p-7 overflow-hidden">
                <div
                    className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full opacity-[0.08] blur-2xl"
                    style={{ background: iconTint }}
                />
                <div className="relative flex items-center justify-between gap-3 mb-6 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{ background: iconTint }}
                        >
                            <Icon className="text-white" size={20} strokeWidth={2.25} />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">{title}</h3>
                            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
                        </div>
                    </div>
                    {headerExtra}
                </div>
                <div className="relative">{children}</div>
            </div>
        </div>
    );
}

function ChartSkeleton() {
    return (
        <div className="h-72 flex items-center justify-center">
            <div className="relative w-44 h-44">
                <div className="absolute inset-0 rounded-full border-[10px] border-gray-100" />
                <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-indigo-400 border-r-indigo-200 animate-spin" />
            </div>
        </div>
    );
}

function EmptyState({ label }) {
    return (
        <div className="h-72 flex flex-col items-center justify-center text-gray-300 gap-2">
            <Building2 size={30} strokeWidth={1.5} />
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    );
}

// Shows the role's total plus a Completed / Pending & In Progress breakdown.
function BarTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const { role, total, completed, pending, colorIndex } = payload[0].payload;
    const other = Math.max(total - completed - pending, 0);
    return (
        <div className="bg-gray-900/95 backdrop-blur text-white shadow-2xl rounded-xl px-4 py-3 text-sm border border-white/10 min-w-[180px]">
            <div className="flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: roleGradient(colorIndex).to }} />
                {role}
            </div>
            <p className="text-gray-300 text-xs mt-0.5 mb-2">
                {Math.round(total)} task{Math.round(total) === 1 ? "" : "s"} total
            </p>
            <div className="space-y-1">
                <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Completed
                    </span>
                    <span className="font-medium text-white tabular-nums">{completed}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Pending / In Progress
                    </span>
                    <span className="font-medium text-white tabular-nums">{pending}</span>
                </div>
                {other > 0 && (
                    <div className="flex items-center justify-between gap-4 text-xs">
                        <span className="flex items-center gap-1.5 text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            Other
                        </span>
                        <span className="font-medium text-white tabular-nums">{other}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Total tasks grouped by assignee role ("department"), filtered by the
 * task's own `start_date` column. Fetches from
 * GET /ourtaskassigned/reports/department.
 */
const DepartmentReports = () => {
    const [byRole, setByRole] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(DEFAULT_FILTER);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const fetchDepartmentReport = async () => {
            setLoading(true);
            setError(null);
            setProgress(0);
            try {
                const response = await axios.get(route("ourtaskassigned.reports.department"), {
                    params: {
                        start_date: filter.startDate || undefined,
                        end_date: filter.endDate || undefined,
                    },
                });
                if (cancelled) return;
                setByRole(response.data.by_role ?? []);
            } catch (err) {
                console.error("Failed to fetch department report", err);
                if (!cancelled) setError("Couldn't load report data. Please try again.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchDepartmentReport();
        return () => {
            cancelled = true;
        };
    }, [filter.startDate, filter.endDate]);

    const hasData = !loading && !error && byRole.length > 0;

    useEffect(() => {
        if (!hasData) return;
        const tween = { value: 0 };
        gsap.to(tween, {
            value: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.1,
            onUpdate: () => setProgress(tween.value),
        });
    }, [hasData, byRole]);

    // completed/pending are carried unscaled alongside the animated total
    // so the tooltip always shows real counts, even mid-animation. Each row
    // is tagged with its index so the tooltip can look up its own color.
    const animatedByRole = useMemo(
        () => byRole.map((r, i) => ({ ...r, total: r.total * progress, colorIndex: i })),
        [byRole, progress]
    );

    const totalTasks = byRole.reduce((sum, r) => sum + Number(r.total), 0);

    return (
        <CardShell
            title="Department Task Reports"
            subtitle={totalTasks ? `${totalTasks} tasks across ${byRole.length} roles` : null}
            icon={Building2}
            iconTint="linear-gradient(135deg,#F97316,#EA580C)"
            headerExtra={
                <DateRangeFilter filter={filter} onChange={setFilter} accent="linear-gradient(135deg,#F97316,#EA580C)" />
            }
        >
            {loading ? (
                <ChartSkeleton />
            ) : error ? (
                <EmptyState label={error} />
            ) : byRole.length === 0 ? (
                <EmptyState label="No task data for this range" />
            ) : (
                <ResponsiveContainer width="100%" height={296}>
                    <BarChart data={animatedByRole} margin={{ top: 28, right: 8, left: -8, bottom: 0 }} barCategoryGap="30%">
                        <defs>
                            {byRole.map((r, i) => {
                                const grad = roleGradient(i);
                                return (
                                    <linearGradient id={`roleGrad-${i}`} key={i} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={grad.from} />
                                        <stop offset="100%" stopColor={grad.to} />
                                    </linearGradient>
                                );
                            })}
                        </defs>
                        <CartesianGrid vertical={false} stroke="#F1F5F9" />
                        <XAxis
                            dataKey="role"
                            tickLine={false}
                            axisLine={{ stroke: "#E2E8F0" }}
                            tick={{ fill: "#64748B", fontSize: 12.5, fontWeight: 500 }}
                        />
                        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} allowDecimals={false} />
                        <Tooltip cursor={{ fill: "#F8FAFC" }} content={<BarTooltip />} />
                        <Bar dataKey="total" radius={[10, 10, 4, 4]} maxBarSize={54} isAnimationActive={false}>
                            {animatedByRole.map((_, i) => (
                                <Cell key={i} fill={`url(#roleGrad-${i})`} />
                            ))}
                            <LabelList
                                dataKey="total"
                                position="top"
                                formatter={(v) => Math.round(v)}
                                style={{ fill: "#334155", fontSize: 12.5, fontWeight: 700 }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </CardShell>
    );
};

export default DepartmentReports;
