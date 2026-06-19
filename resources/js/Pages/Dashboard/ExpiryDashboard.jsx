// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { Link } from "@inertiajs/react";

// const ExpiryDashboard = () => {
//     const [allExpiration, setAllExpiration] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchExpiration = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourexpirations.index"));
//                 const data = response.data.data || response.data;
//                 setAllExpiration(data);
//             } catch (error) {
//                 console.error("fetching error", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchExpiration();
//     }, []);

//     const expiringSoon = useMemo(() => {
//         const today = new Date();
//         return allExpiration.filter((item) => {
//             const expirationDate = new Date(item.expiration_date);
//             const diffTime = expirationDate - today;
//             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//             return diffDays <= 40 && diffDays >= 0;
//         });
//     }, [allExpiration]);

//     return (
//         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-64">
//             {/* Top accent bar */}
//             <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />

//             <div className="px-6 py-5 flex items-start justify-between">
//                 {/* Left: count + label */}
//                 <div>
//                     <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
//                         Expirations
//                     </p>
//                     {loading ? (
//                         <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
//                     ) : (
//                         <div className="flex items-baseline gap-2">
//                             <span className="text-4xl font-bold text-gray-900 tabular-nums">
//                                 {expiringSoon.length}
//                             </span>
//                             <span className="text-sm font-medium text-amber-600">
//                                 Expiring Soon
//                             </span>
//                         </div>
//                     )}
//                     <p className="text-xs text-gray-400 mt-1 leading-relaxed">
//                         Items expiring within the next 40 days.
//                     </p>
//                 </div>

//                 {/* Right: icon */}
//                 <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
//                     <svg
//                         className="w-6 h-6 text-amber-500"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={1.8}
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                     </svg>
//                 </div>
//             </div>

//             {/* Action buttons */}
//              <div className="grid grid-cols-1 border-t border-gray-100">
//                 <Link
//                     href="/expiration"
//                     className="py-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
//                 >
//                     View Details
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default ExpiryDashboard;



import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";

const ExpiryDashboard = () => {
    const [allExpiration, setAllExpiration] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchExpiration = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourexpirations.index"));
                const data = response.data.data || response.data;
                setAllExpiration(data);
            } catch (error) {
                console.error("fetching error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExpiration();
    }, []);

    const expiringSoon = useMemo(() => {
        const today = new Date();
        return allExpiration.filter((item) => {
            const expirationDate = new Date(item.expiration_date);
            const diffTime = expirationDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 40 && diffDays >= 0;
        });
    }, [allExpiration]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />

            <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-start justify-between gap-3">
                {/* Left: count + label */}
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Expirations
                    </p>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums">
                                {expiringSoon.length}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-amber-600 leading-snug">
                                Expiring Soon
                            </span>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Items expiring within the next 40 days.
                    </p>
                </div>

                {/* Right: icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 border-t border-gray-100">
                <Link
                    href="/expiration"
                    className="py-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ExpiryDashboard;