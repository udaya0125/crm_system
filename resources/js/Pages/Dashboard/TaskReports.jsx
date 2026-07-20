import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import gsap from "gsap";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    Sector,
} from "recharts";
import { ClipboardList, Users } from "lucide-react";

const AGENT_COLORS = [
    "#6366F1", "#F97316", "#10B981", "#EC4899", "#0EA5E9",
    "#F59E0B", "#8B5CF6", "#14B8A6", "#EF4444", "#84CC16",
    "#3B82F6", "#D946EF", "#22C55E", "#F43F5E",
];

// Keys are lower-cased for a case-insensitive lookup against whatever
// casing the `status` column actually uses (Pending, pending, PENDING...).
const STATUS_META = {
    closed: { from: "#34D399", to: "#059669" },
    open: { from: "#60A5FA", to: "#2563EB" },
    onprocess: { from: "#FBBF24", to: "#D97706" },
    "on process": { from: "#FBBF24", to: "#D97706" },
    onhold: { from: "#F87171", to: "#DC2626" },
    "on hold": { from: "#F87171", to: "#DC2626" },
    pending: { from: "#A78BFA", to: "#7C3AED" },
    completed: { from: "#34D399", to: "#059669" },
    inprogress: { from: "#38BDF8", to: "#0284C7" },
    "in progress": { from: "#38BDF8", to: "#0284C7" },
};
const STATUS_FALLBACK = { from: "#CBD5E1", to: "#64748B" };
const statusMeta = (status) => STATUS_META[String(status).toLowerCase()] ?? STATUS_FALLBACK;

/**
 * Tilts a card toward the cursor with GSAP quickTo tweens — cheap,
 * interruptible, and reset smoothly on mouse-leave.
 */
function useTiltRef() {
    const ref = useRef(null);
    const quickRef = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const rotateX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
        const rotateY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
        const lift = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
        quickRef.current = { rotateX, rotateY, lift };

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

function CardShell({ title, subtitle, icon: Icon, iconTint, children }) {
    const tiltRef = useTiltRef();
    return (
        <div
            ref={tiltRef}
            style={{ transformStyle: "preserve-3d", transformPerspective: 900, willChange: "transform" }}
            className="relative flex-1 min-w-[360px] rounded-[28px] p-px bg-gradient-to-br from-gray-200/70 via-gray-100 to-transparent shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_48px_-18px_rgba(30,41,59,0.22)] transition-shadow duration-300"
        >
            <div className="relative bg-white rounded-[27px] h-full p-7 overflow-hidden">
                <div
                    className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full opacity-[0.08] blur-2xl"
                    style={{ background: iconTint }}
                />
                <div className="relative flex items-center gap-3 mb-6">
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
            <ClipboardList size={30} strokeWidth={1.5} />
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    );
}

function GlassTooltip({ title, lines, dotColor }) {
    return (
        <div className="bg-gray-900/95 backdrop-blur text-white shadow-2xl rounded-xl px-4 py-2.5 text-sm border border-white/10">
            <div className="flex items-center gap-2 font-semibold">
                {dotColor && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />}
                {title}
            </div>
            {lines.map((l, i) => (
                <p key={i} className="text-gray-300 text-xs mt-0.5">{l}</p>
            ))}
        </div>
    );
}

function PieTooltip({ active, payload, total, colorOf }) {
    if (!active || !payload?.length) return null;
    const { agent, total: value } = payload[0].payload;
    const pct = total ? ((value / total) * 100).toFixed(1) : "0.0";
    return (
        <GlassTooltip
            title={agent}
            dotColor={colorOf(payload[0])}
            lines={[`${Math.round(value)} task${Math.round(value) === 1 ? "" : "s"} · ${pct}%`]}
        />
    );
}

function BarTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const { status, total } = payload[0].payload;
    return (
        <GlassTooltip
            title={status}
            dotColor={statusMeta(status).to}
            lines={[`${Math.round(total)} task${Math.round(total) === 1 ? "" : "s"}`]}
        />
    );
}

// Enlarged, glowing sector rendered under the hovered slice for a tactile feel.
function renderActiveShape(props) {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
        <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius + 8}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
            cornerRadius={6}
        />
    );
}

const TaskReports = () => {
    const [byAgent, setByAgent] = useState([]);
    const [byStatus, setByStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    // 0 -> 1 reveal progress, driven by a single GSAP tween once data lands.
    // Both charts and every number scale off this same value so the whole
    // panel grows in together instead of each piece animating on its own.
    const [progress, setProgress] = useState(0);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        const fetchReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(route("ourtaskassigned.reports"));
                if (cancelled) return;
                setByAgent(response.data.by_agent ?? []);
                setByStatus(response.data.by_status ?? []);
            } catch (err) {
                console.error("Failed to fetch task reports", err);
                if (!cancelled) setError("Couldn't load report data. Please try again.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchReports();
        return () => {
            cancelled = true;
        };
    }, []);

    const hasData = !loading && !error && (byAgent.length > 0 || byStatus.length > 0);

    useEffect(() => {
        if (!hasData || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        const tween = { value: 0 };
        gsap.to(tween, {
            value: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.1,
            onUpdate: () => setProgress(tween.value),
        });
    }, [hasData]);

    const animatedByAgent = useMemo(
        () => byAgent.map((a) => ({ ...a, total: a.total * progress })),
        [byAgent, progress]
    );
    const animatedByStatus = useMemo(
        () => byStatus.map((s) => ({ ...s, total: s.total * progress })),
        [byStatus, progress]
    );

    const totalAgentTasks = byAgent.reduce((sum, a) => sum + Number(a.total), 0);
    const activeAgent = activeIndex !== null ? byAgent[activeIndex] : null;

    return (
        <div className="flex flex-wrap gap-6">
            {/* Agent breakdown */}
            <CardShell
                title="Agent Task Reports"
                subtitle={totalAgentTasks ? `${totalAgentTasks} tasks across ${byAgent.length} agents` : null}
                icon={Users}
                iconTint="linear-gradient(135deg,#6366F1,#8B5CF6)"
            >
                {loading ? (
                    <ChartSkeleton />
                ) : error ? (
                    <EmptyState label={error} />
                ) : byAgent.length === 0 ? (
                    <EmptyState label="No task data yet" />
                ) : (
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="relative w-full md:w-1/2 h-64 shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <defs>
                                        {byAgent.map((_, i) => (
                                            <radialGradient id={`agentGrad-${i}`} key={i} cx="35%" cy="35%" r="70%">
                                                <stop offset="0%" stopColor={AGENT_COLORS[i % AGENT_COLORS.length]} stopOpacity={0.88} />
                                                <stop offset="100%" stopColor={AGENT_COLORS[i % AGENT_COLORS.length]} stopOpacity={1} />
                                            </radialGradient>
                                        ))}
                                    </defs>
                                    <Pie
                                        data={animatedByAgent}
                                        dataKey="total"
                                        nameKey="agent"
                                        innerRadius={64}
                                        outerRadius={96}
                                        paddingAngle={3}
                                        cornerRadius={6}
                                        strokeWidth={0}
                                        isAnimationActive={false}
                                        activeIndex={activeIndex}
                                        activeShape={renderActiveShape}
                                        onMouseEnter={(_, i) => setActiveIndex(i)}
                                        onMouseLeave={() => setActiveIndex(null)}
                                    >
                                        {animatedByAgent.map((_, i) => (
                                            <Cell key={i} fill={`url(#agentGrad-${i})`} className="cursor-pointer outline-none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={
                                            <PieTooltip
                                                total={totalAgentTasks}
                                                colorOf={(p) => AGENT_COLORS[animatedByAgent.indexOf(p.payload) % AGENT_COLORS.length]}
                                            />
                                        }
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* center label — counts up on load, swaps to the hovered agent */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-gray-900 tabular-nums">
                                    {activeAgent ? activeAgent.total : Math.round(totalAgentTasks * progress)}
                                </span>
                                <span className="text-[11px] uppercase tracking-wide text-gray-400 max-w-[110px] text-center truncate">
                                    {activeAgent ? activeAgent.agent : "Total tasks"}
                                </span>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 max-h-64 overflow-y-auto pr-1 space-y-1.5">
                            {byAgent.map((a, i) => {
                                const pct = totalAgentTasks ? (a.total / totalAgentTasks) * 100 : 0;
                                const color = AGENT_COLORS[i % AGENT_COLORS.length];
                                const isActive = activeIndex === i;
                                return (
                                    <div
                                        key={a.agent_id ?? a.agent}
                                        onMouseEnter={() => setActiveIndex(i)}
                                        onMouseLeave={() => setActiveIndex(null)}
                                        className={`px-2.5 py-1.5 rounded-xl transition-colors cursor-default ${
                                            isActive ? "bg-gray-50 ring-1 ring-gray-100" : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                                <span className="text-gray-700 truncate font-medium">{a.agent}</span>
                                            </div>
                                            <span className="text-gray-400 shrink-0 ml-2 text-xs font-medium tabular-nums">
                                                {Math.round(a.total * progress)} · {pct.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden ml-4">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${pct * progress}%`, backgroundColor: color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardShell>

            {/* Status breakdown */}
            <CardShell
                title="Task Status Reports"
                subtitle={byStatus.length ? "Total tasks per status" : null}
                icon={ClipboardList}
                iconTint="linear-gradient(135deg,#10B981,#059669)"
            >
                {loading ? (
                    <ChartSkeleton />
                ) : error ? (
                    <EmptyState label={error} />
                ) : byStatus.length === 0 ? (
                    <EmptyState label="No task data yet" />
                ) : (
                    <ResponsiveContainer width="100%" height={296}>
                        <BarChart data={animatedByStatus} margin={{ top: 28, right: 8, left: -8, bottom: 0 }} barCategoryGap="30%">
                            <defs>
                                {byStatus.map((s, i) => {
                                    const meta = statusMeta(s.status);
                                    return (
                                        <linearGradient id={`statusGrad-${i}`} key={i} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={meta.from} />
                                            <stop offset="100%" stopColor={meta.to} />
                                        </linearGradient>
                                    );
                                })}
                            </defs>
                            <CartesianGrid vertical={false} stroke="#F1F5F9" />
                            <XAxis
                                dataKey="status"
                                tickLine={false}
                                axisLine={{ stroke: "#E2E8F0" }}
                                tick={{ fill: "#64748B", fontSize: 12.5, fontWeight: 500 }}
                            />
                            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                            <Tooltip cursor={{ fill: "#F8FAFC" }} content={<BarTooltip />} />
                            <Bar dataKey="total" radius={[10, 10, 4, 4]} maxBarSize={54} isAnimationActive={false}>
                                {animatedByStatus.map((_, i) => (
                                    <Cell key={i} fill={`url(#statusGrad-${i})`} />
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
        </div>
    );
};

export default TaskReports;