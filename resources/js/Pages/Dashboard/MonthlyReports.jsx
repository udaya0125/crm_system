import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import gsap from "gsap";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar, ChevronDown, X } from "lucide-react";

const COMPLETED_COLOR = "#059669";
const COMPLETED_COLOR_SOFT = "#10B981";

// ---------------------------------------------------------------------------
// Date range filter — only 7 Days / All Time / Custom for this chart
// ---------------------------------------------------------------------------

const RANGE_PRESETS = [
    { key: "7d", label: "7 Days" },
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
                    <div className="grid grid-cols-3 gap-1.5">
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
            className="relative w-full rounded-[28px] p-px bg-gradient-to-br from-gray-200/70 via-gray-100 to-transparent"
        >
            <div className="relative bg-white rounded-[27px] h-full p-7 overflow-hidden">
                <div
                    className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.10] blur-3xl"
                    style={{ background: iconTint }}
                />
                <div
                    className="pointer-events-none absolute -bottom-16 -left-16 w-40 h-40 rounded-full opacity-[0.06] blur-3xl"
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
        <div className="h-80 flex items-center justify-center">
            <div className="relative w-44 h-44">
                <div className="absolute inset-0 rounded-full border-[10px] border-gray-100" />
                <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-emerald-400 border-r-emerald-200 animate-spin" />
            </div>
        </div>
    );
}

function EmptyState({ label }) {
    return (
        <div className="h-80 flex flex-col items-center justify-center text-gray-300 gap-2">
            <TrendingUp size={30} strokeWidth={1.5} />
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    );
}

function LineTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const total = Math.round(payload[0]?.value ?? 0);
    return (
        <div className="bg-gray-900/95 backdrop-blur text-white shadow-2xl rounded-xl px-4 py-2.5 text-sm border border-white/10 min-w-[140px]">
            <p className="font-semibold">{label}</p>
            <div className="flex items-center justify-between gap-4 text-xs mt-1">
                <span className="flex items-center gap-1.5 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COMPLETED_COLOR_SOFT }} />
                    Completed
                </span>
                <span className="font-medium text-white tabular-nums">{total}</span>
            </div>
        </div>
    );
}

/**
 * Monthly count of Completed tasks, filtered by the task's own `start_date`
 * column. Fetches from GET /ourtaskassigned/reports/monthly.
 */
const MonthlyReports = () => {
    const [filter, setFilter] = useState(DEFAULT_FILTER);
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [progress, setProgress] = useState(0);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        const fetchTrend = async () => {
            setLoading(true);
            setError(null);
            hasAnimatedRef.current = false;
            setProgress(0);
            try {
                const response = await axios.get(route("ourtaskassigned.reports.monthly"), {
                    params: {
                        start_date: filter.startDate || undefined,
                        end_date: filter.endDate || undefined,
                    },
                });
                if (cancelled) return;
                setSeries(response.data.series ?? []);
            } catch (err) {
                console.error("Failed to fetch monthly trend", err);
                if (!cancelled) setError("Couldn't load the monthly trend.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchTrend();
        return () => {
            cancelled = true;
        };
    }, [filter.startDate, filter.endDate]);

    const hasData = !loading && !error && series.length > 0;

    useEffect(() => {
        if (!hasData || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        const tween = { value: 0 };
        gsap.to(tween, {
            value: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.1,
            onUpdate: () => setProgress(tween.value),
        });
    }, [hasData]);

    const animatedSeries = useMemo(
        () => series.map((row) => ({ ...row, total: (row.total ?? 0) * progress })),
        [series, progress]
    );

    const totalCompleted = series.reduce((sum, row) => sum + (row.total ?? 0), 0);
    const peak = series.reduce((max, row) => Math.max(max, row.total ?? 0), 0);

    return (
        <CardShell
            title="Completed Tasks Trend"
            subtitle={hasData ? `${totalCompleted} completed over this period` : null}
            icon={TrendingUp}
            iconTint="linear-gradient(135deg,#10B981,#059669)"
            headerExtra={
                <DateRangeFilter filter={filter} onChange={setFilter} accent="linear-gradient(135deg,#10B981,#059669)" />
            }
        >
            {loading ? (
                <ChartSkeleton />
            ) : error ? (
                <EmptyState label={error} />
            ) : !hasData ? (
                <EmptyState label="No completed tasks in this period yet" />
            ) : (
                <>
                    {peak > 0 && (
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-4xl font-bold text-gray-900 tabular-nums">{totalCompleted}</span>
                            <span className="text-xs font-medium text-gray-400">tasks completed</span>
                        </div>
                    )}
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={animatedSeries} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
                            <defs>
                                <linearGradient id="completedFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={COMPLETED_COLOR_SOFT} stopOpacity={0.35} />
                                    <stop offset="100%" stopColor={COMPLETED_COLOR_SOFT} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} stroke="#F1F5F9" />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={{ stroke: "#E2E8F0" }}
                                tick={{ fill: "#64748B", fontSize: 12 }}
                            />
                            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} allowDecimals={false} />
                            <Tooltip cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }} content={<LineTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="total"
                                name="Completed"
                                stroke={COMPLETED_COLOR}
                                strokeWidth={2.5}
                                fill="url(#completedFill)"
                                dot={{ r: 3, fill: COMPLETED_COLOR, strokeWidth: 0 }}
                                activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </>
            )}
        </CardShell>
    );
};

export default MonthlyReports;