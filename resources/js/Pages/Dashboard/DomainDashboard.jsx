// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { Link } from "@inertiajs/react";

// const DomainDashboard = () => {
//     const [allDomain, setAllDomain] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchDomain = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourdomains.index"));
//                 setAllDomain(response.data.data);
//             } catch (error) {
//                 console.error("fetching error", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchDomain();
//     }, []);

//     const expiringDomains = useMemo(() => {
//         return allDomain.filter((d) => {
//             if (!d.expiry_date) return false;
//             const diff =
//                 (new Date(d.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
//             return diff <= 45;
//         });
//     }, [allDomain]);

//     return (
//         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-64">
//             {/* Top accent bar */}
//             <div className="h-1 w-full bg-gradient-to-r from-sky-500 to-cyan-500" />

//             <div className="px-6 py-5 flex items-start justify-between">
//                 {/* Left: count + label */}
//                 <div>
//                     <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
//                         Domains
//                     </p>
//                     {loading ? (
//                         <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
//                     ) : (
//                         <div className="flex items-baseline gap-2">
//                             <span className="text-4xl font-bold text-gray-900 tabular-nums">
//                                 {expiringDomains.length}
//                             </span>
//                             <span className="text-sm font-medium text-sky-600">
//                                 Expiring Soon
//                             </span>
//                         </div>
//                     )}
//                     <p className="text-xs text-gray-400 mt-1 leading-relaxed">
//                         Domains expiring within the next 45 days.
//                     </p>
//                 </div>

//                 {/* Right: icon */}
//                 <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
//                     <svg
//                         className="w-6 h-6 text-sky-500"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={1.8}
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
//                         />
//                     </svg>
//                 </div>
//             </div>

//             {/* Action buttons */}
//             <div className="grid grid-cols-1 border-t border-gray-100">
//                 <Link
//                     href="/domain-tracking"
//                     className="py-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
//                 >
//                     View Details
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default DomainDashboard;




import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";

const DomainDashboard = () => {
    const [allDomain, setAllDomain] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDomain = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourdomains.index"));
                setAllDomain(response.data.data);
            } catch (error) {
                console.error("fetching error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDomain();
    }, []);

    const expiringDomains = useMemo(() => {
        return allDomain.filter((d) => {
            if (!d.expiry_date) return false;
            const diff =
                (new Date(d.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
            return diff <= 45;
        });
    }, [allDomain]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 to-cyan-500" />

            <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-start justify-between gap-3">
                {/* Left: count + label */}
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Domains
                    </p>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums">
                                {expiringDomains.length}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-sky-600 leading-snug">
                                Expiring Soon
                            </span>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Domains expiring within the next 45 days.
                    </p>
                </div>

                {/* Right: icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                    <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                        />
                    </svg>
                </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 border-t border-gray-100">
                <Link
                    href="/domain-tracking"
                    className="py-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default DomainDashboard;