import { useState, useEffect } from "react";
import { ArrowUp, ChevronUp } from "lucide-react";

const BackToTop = () => {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(Math.min(pct, 100));
            setVisible(scrollTop > 300);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className={`
        fixed bottom-8 right-8 z-50
        w-12 h-12
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${
            visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
        }
      `}
        >
            {/* SVG Progress Ring */}
            <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 48 48"
                style={{ pointerEvents: "none" }}
            >
                {/* Track */}
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="none"
                    className="stroke-gray-200"
                    strokeWidth="2.5"
                />
                {/* Progress */}
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="none"
                    className="stroke-blue-500"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: "stroke-dashoffset 0.15s ease-out",
                        willChange: "stroke-dashoffset",
                    }}
                />
            </svg>

            {/* Inner circle + icon */}
            <span
                className="
        relative z-10
        w-9 h-9 rounded-full
        bg-white
        flex items-center justify-center
        shadow-md
        transition-all duration-200
        border border-gray-200
      "
            >
                <ChevronUp
                    size={18}
                    strokeWidth={2}
                    className="text-blue-600"
                />
            </span>
        </button>
    );
};

export default BackToTop;
