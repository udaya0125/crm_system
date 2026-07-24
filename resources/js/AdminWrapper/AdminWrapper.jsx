// import React, { useEffect, useState } from "react";
// import { usePage } from "@inertiajs/react";
// import AdminFooter from "./AdminFooter";
// import AdminNavBar from "./AdminNavBar";
// import AdminSideBar from "./AdminSideBar";

// const AdminWrapper = ({ children }) => {
//     const [isMobileOpen, setIsMobileOpen] = useState(false);
//     const [isCollapsed, setIsCollapsed] = useState(() => {
//         if (typeof window === "undefined") return false;
//         return window.localStorage.getItem("adminSidebarCollapsed") === "true";
//     });
//     const { props, url } = usePage();
//     const user = props?.auth?.user || null;

//     const toggleMobile = () => setIsMobileOpen((current) => !current);
//     const toggleCollapse = () => {
//         setIsCollapsed((current) => {
//             const next = !current;
//             window.localStorage.setItem("adminSidebarCollapsed", String(next));
//             return next;
//         });
//     };

//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth >= 1024) {
//                 setIsMobileOpen(false);
//             }
//         };

//         handleResize();
//         window.addEventListener("resize", handleResize);

//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     useEffect(() => {
//         setIsMobileOpen(false);
//     }, [url]);

//     return (
//         <div className="min-h-screen bg-slate-100 text-slate-900">
//             <AdminNavBar
//                 onMenuToggle={toggleMobile}
//                 isCollapsed={isCollapsed}
//             />

//             <AdminSideBar
//                 isMobileOpen={isMobileOpen}
//                 onMobileToggle={toggleMobile}
//                 user={user}
//                 isCollapsed={isCollapsed}
//                 onToggleCollapse={toggleCollapse}
//             />

//             <main
//                 className={[
//                     "min-h-[calc(100vh-4rem)] pt-16 transition-all duration-300",
//                     isCollapsed ? "lg:ml-16" : "lg:ml-64",
//                 ].join(" ")}
//             >
//                 <div className="p-6 lg:p-8">
//                     <div className="mx-auto w-full max-w-[1600px]">{children}</div>
//                 </div>
//             </main>

//             <AdminFooter isCollapsed={isCollapsed} />
//         </div>
//     );
// };

// export default AdminWrapper;



import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import AdminFooter from "./AdminFooter";
import AdminNavBar from "./AdminNavBar";
import AdminSideBar from "./AdminSideBar";

const AdminWrapper = ({ children }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.localStorage.getItem("adminSidebarCollapsed") === "true";
    });
    const { props, url } = usePage();
    const user = props?.auth?.user || null;

    const toggleMobile = () => setIsMobileOpen((current) => !current);
    const toggleCollapse = () => {
        setIsCollapsed((current) => {
            const next = !current;
            window.localStorage.setItem("adminSidebarCollapsed", String(next));
            return next;
        });
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [url]);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <AdminNavBar
                onMenuToggle={toggleMobile}
                isCollapsed={isCollapsed}
            />

            <AdminSideBar
                isMobileOpen={isMobileOpen}
                onMobileToggle={toggleMobile}
                user={user}
                isCollapsed={isCollapsed}
                onToggleCollapse={toggleCollapse}
            />

            <main
                className={[
                    "min-h-[calc(100vh-4rem)] pt-16 transition-all duration-300",
                    isCollapsed ? "lg:ml-24" : "lg:ml-72",
                ].join(" ")}
            >
                <div className="p-6 lg:p-8">
                    <div className="mx-auto w-full max-w-[1600px]">{children}</div>
                </div>
            </main>

            <AdminFooter isCollapsed={isCollapsed} />
        </div>
    );
};

export default AdminWrapper;
