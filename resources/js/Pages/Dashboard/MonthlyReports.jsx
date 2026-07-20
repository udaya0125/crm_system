
bash

cat > /home/claude/MonthlyReports.jsx << 'ENDOFFILE'
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import gsap from "gsap";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const AGENT_COLORS = [
    "#6366F1", "#F97316", "#10B981", "#EC4899", "#0EA5E9",
    "#F59E0B", "#8B5CF6", "#14B8A6", "#EF4444", "#84CC16",
    "#3B82F6", "#D946EF", "#22C55E", "#F43F5E",
];

// One fixed color per known role, cycling through AGENT_COLORS for
// anything unrecognized so it never collides visually with the others.
const ROLE_COLORS = {
    admin: "#6366F1",
    manager: "#F97316",
    agent: "#10B981",
    staff: "#EC4899",
    unknown: "#94A3B8",
};
const roleColor = (role, i) => ROLE_COLORS[String(role).toLowerCase()] ?? AGENT_COLORS[i % AGENT_COLORS.length];
const roleLabel = (role) => String(role).charAt(0).toUpperCase() + String(role).slice(1);

/**
 * Tilts a card toward the cursor with GSAP quickTo tweens — cheap,
 * interruptible, and reset smoothly on mouse-leave. Same behavior as
 * TaskReports.jsx's card, kept local here so this file has no dependency
 * on that one.
 */
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
            className="relative w-full rounded-[28px] p-px bg-gradient-to-br from-gray-200/70 via-gray-100 to-transparent shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_48px_-18px_rgba(30,41,59,0.22)] transition-shadow duration-300"
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
        <div className="h-80 flex items-center justify-center">
            <div className="relative w-44 h-44">
                <div className="absolute inset-0 rounded-full border-[10px] border-gray-100" />
                <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-indigo-400 border-r-indigo-200 animate-spin" />
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

function GlassTooltip({ title, lines }) {
    return (
        <div className="bg-gray-900/95 backdrop-blur text-white shadow-2xl rounded-xl px-4 py-2.5 text-sm border border-white/10 min-w-[140px]">
            <p className="font-semibold">{title}</p>
            {lines.map((l, i) => (
                <div key={i} className="flex items-center justify-between gap-4 text-xs mt-1">
                    <span className="flex items-center gap-1.5 text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                        {l.label}
                    </span>
                    <span className="font-medium text-white tabular-nums">{l.value}</span>
                </div>
            ))}
        </div>
    );
}

function LineTooltip({ active, payload, label, roles }) {
    if (!active || !payload?.length) return null;
    return (
        <GlassTooltip
            title={label}
            lines={roles.map((role, i) => ({
                label: roleLabel(role),
                value: Math.round(payload.find((p) => p.dataKey === role)?.value ?? 0),
                color: roleColor(role, i),
            }))}
        />
    );
}

/**
 * Monthly count of *completed* tasks, one line per assignee role.
 * Fetches from GET /ourtaskassigned/reports/monthly?months=6|12.
 */
const MonthlyReports = () => {
    const [monthsRange, setMonthsRange] = useState(6);
    const [series, setSeries] = useState([]);
    const [roles, setRoles] = useState([]);
    const [hiddenRoles, setHiddenRoles] = useState(() => new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 0 -> 1 reveal progress, driven by a single GSAP tween once data lands —
    // every line grows up from the baseline together instead of snapping in.
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
                    params: { months: monthsRange },
                });
                if (cancelled) return;
                setSeries(response.data.series ?? []);
                setRoles(response.data.roles ?? []);
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
    }, [monthsRange]);

    const hasData = !loading && !error && series.length > 0 && roles.length > 0;

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
        () =>
            series.map((row) => {
                const scaled = { ...row };
                roles.forEach((role) => {
                    scaled[role] = (row[role] ?? 0) * progress;
                });
                return scaled;
            }),
        [series, roles, progress]
    );

    const toggleRole = (role) => {
        setHiddenRoles((prev) => {
            const next = new Set(prev);
            next.has(role) ? next.delete(role) : next.add(role);
            return next;
        });
    };

    return (
        <CardShell
            title="Monthly Task Completion by Role"
            subtitle={hasData ? `Closed tasks over the last ${monthsRange} months` : null}
            icon={TrendingUp}
            iconTint="linear-gradient(135deg,#0EA5E9,#6366F1)"
            headerExtra={
                <div className="flex bg-gray-100 rounded-full p-1 text-xs font-medium">
                    {[6, 12].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMonthsRange(m)}
                            className={`px-3 py-1 rounded-full transition-colors ${
                                monthsRange === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {m}M
                        </button>
                    ))}
                </div>
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
                    {/* role legend / toggles */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {roles.map((role, i) => {
                            const isHidden = hiddenRoles.has(role);
                            const color = roleColor(role, i);
                            return (
                                <button
                                    key={role}
                                    onClick={() => toggleRole(role)}
                                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                                        isHidden
                                            ? "border-gray-100 text-gray-300 bg-gray-50"
                                            : "border-gray-100 text-gray-700 bg-white shadow-sm"
                                    }`}
                                >
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: isHidden ? "#D1D5DB" : color }}
                                    />
                                    {roleLabel(role)}
                                </button>
                            );
                        })}
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={animatedSeries} margin={{ top: 12, right: 16, left: -8, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#F1F5F9" />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={{ stroke: "#E2E8F0" }}
                                tick={{ fill: "#64748B", fontSize: 12 }}
                            />
                            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} allowDecimals={false} />
                            <Tooltip cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }} content={<LineTooltip roles={roles} />} />
                            {roles.map((role, i) =>
                                hiddenRoles.has(role) ? null : (
                                    <Line
                                        key={role}
                                        type="monotone"
                                        dataKey={role}
                                        name={roleLabel(role)}
                                        stroke={roleColor(role, i)}
                                        strokeWidth={2.5}
                                        dot={{ r: 3, fill: roleColor(role, i), strokeWidth: 0 }}
                                        activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                                        isAnimationActive={false}
                                    />
                                )
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </>
            )}
        </CardShell>
    );
};

export default MonthlyReports;