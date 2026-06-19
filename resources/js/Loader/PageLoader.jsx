import React, { useEffect, useRef } from "react";

const PageLoader = () => {
    const pipRefs = [useRef(null), useRef(null), useRef(null)];
    const currentRef = useRef(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            pipRefs[currentRef.current].current?.classList.remove(
                "!bg-[#534AB7]",
            );
            currentRef.current = (currentRef.current + 1) % 3;
            pipRefs[currentRef.current].current?.classList.add("!bg-[#534AB7]");
        }, 2400);

        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <>
            {/* Keyframe injection — Tailwind doesn't ship these by default */}
            <style>{`
                @keyframes orbit-a  { to { transform: rotate(360deg);  } }
                @keyframes orbit-b  { to { transform: rotate(-360deg); } }
                @keyframes orbit-c  { to { transform: rotate(360deg);  } }
                @keyframes pulse-dot {
                    0%, 100% { transform: translate(-50%, -50%) scale(1);   opacity: 1;   }
                    50%      { transform: translate(-50%, -50%) scale(2);   opacity: 0.4; }
                }
                @keyframes bar-fill {
                    0%   { width: 0%;   opacity: 1; }
                    70%  { width: 100%; opacity: 1; }
                    85%  { width: 100%; opacity: 0; }
                    86%  { width: 0%;   opacity: 0; }
                    100% { width: 0%;   opacity: 1; }
                }
                @keyframes ticker {
                    0%,  20% { transform: translateY(0);      }
                    33%, 53% { transform: translateY(-1.6em); }
                    66%, 86% { transform: translateY(-3.2em); }
                    100%     { transform: translateY(-3.2em); }
                }

                .animate-orbit-a   { animation: orbit-a   1.8s linear      infinite; }
                .animate-orbit-b   { animation: orbit-b   1.2s linear      infinite; }
                .animate-orbit-c   { animation: orbit-c   0.8s linear      infinite; }
                .animate-pulse-dot { animation: pulse-dot  1.4s ease-in-out infinite; }
                .animate-bar-fill  { animation: bar-fill   2.4s ease-in-out infinite; }
                .animate-ticker    { animation: ticker      7.2s ease-in-out infinite; }
            `}</style>

            <div
                className="flex flex-col items-center justify-center min-h-[420px]"
                aria-label="CRM page loading"
            >
                {/* ── Ring stack ── */}
                <div className="relative w-[100px] h-[100px] mb-7">
                    {/* Static track rings */}
                    <div className="absolute inset-0 rounded-full border border-black/[0.07]" />
                    <div className="absolute inset-[14px] rounded-full border border-black/[0.07]" />
                    <div className="absolute inset-[28px] rounded-full border border-black/[0.07]" />

                    {/* Spinning ring — purple */}
                    <div
                        className="absolute inset-0 rounded-full border-2 border-transparent animate-orbit-a"
                        style={{
                            borderTopColor: "#534AB7",
                            borderRightColor: "rgba(83,74,183,0.25)",
                        }}
                    />

                    {/* Spinning ring — teal */}
                    <div
                        className="absolute inset-[14px] rounded-full border-2 border-transparent animate-orbit-b"
                        style={{
                            borderBottomColor: "#1D9E75",
                            borderLeftColor: "rgba(29,158,117,0.2)",
                        }}
                    />

                    {/* Spinning ring — coral */}
                    <div
                        className="absolute inset-[28px] rounded-full border-2 border-transparent animate-orbit-c"
                        style={{
                            borderTopColor: "#D85A30",
                            borderRightColor: "rgba(216,90,48,0.2)",
                        }}
                    />

                    {/* Accent dots */}
                    <div className="absolute top-0.5 left-0.5 w-[5px] h-[5px] rounded-full bg-[#534AB7] opacity-50" />
                    <div className="absolute bottom-0.5 right-0.5 w-[5px] h-[5px] rounded-full bg-[#534AB7] opacity-50" />
                    <div className="absolute top-1/2 -right-0.5 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#1D9E75] opacity-60" />
                    <div className="absolute top-1/2 -left-0.5 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#1D9E75] opacity-60" />

                    {/* Center pulse dot */}
                    <div
                        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#534AB7] animate-pulse-dot"
                        style={{ transform: "translate(-50%, -50%)" }}
                    />
                </div>

                {/* ── Progress bar ── */}
                {/* <div className="w-20 h-[3px] bg-black/[0.07] rounded-full overflow-hidden mb-5">
                    <div
                        className="h-full rounded-full animate-bar-fill"
                        style={{
                            background:
                                "linear-gradient(90deg, #534AB7, #1D9E75)",
                        }}
                    />
                </div> */}

                {/* ── Labels ── */}
                {/* <div className="flex flex-col items-center gap-1">

                
                    <div
                        className="text-[12px] font-medium tracking-[0.12em] uppercase text-gray-500 overflow-hidden"
                        style={{ height: "1.6em" }}
                    >
                        <div className="animate-ticker text-center">
                            <span className="block h-[1.6em] leading-[1.6em] whitespace-nowrap">Loading</span>
                            <span className="block h-[1.6em] leading-[1.6em] whitespace-nowrap">Fetching data</span>
                            <span className="block h-[1.6em] leading-[1.6em] whitespace-nowrap">Almost there</span>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default PageLoader;
