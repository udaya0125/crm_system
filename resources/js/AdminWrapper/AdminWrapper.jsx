// import React, { useState, useEffect } from "react";
// import AdminNavBar from "./AdminNavBar";
// import AdminSideBar from "./AdminSideBar";
// import { usePage } from "@inertiajs/react";

// const AdminWrapper = ({ children }) => {
//     const [isMobileOpen, setIsMobileOpen] = useState(false);
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const { props } = usePage();
//     const user = props?.auth?.user || null;

//     const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
//     const toggleCollapse = () => setIsCollapsed(!isCollapsed);

//     // Close mobile sidebar on window resize & adjust layout
//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth >= 1024) {
//                 setIsMobileOpen(false);
//             }
//         };

//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <AdminNavBar onMenuToggle={toggleMobile} />

//             <AdminSideBar
//                 isMobileOpen={isMobileOpen}
//                 onMobileToggle={toggleMobile}
//                 user={user}
//                 isCollapsed={isCollapsed}
//                 onToggleCollapse={toggleCollapse}
//             />

//             <main
//                 className={`pt-16 min-h-screen  transition-all duration-300 ${
//                     isCollapsed ? "lg:ml-16" : "lg:ml-64"
//                 }`}
//             >
//                 <div className="p-6">{children}</div>
//             </main>
//         </div>
//     );
// };

// export default AdminWrapper;


import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import AdminSideBar from "./AdminSideBar";
import { usePage } from "@inertiajs/react";
import AdminFooter from "./AdminFooter";

const AdminWrapper = ({ children }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { props } = usePage();
    const user = props?.auth?.user || null;

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    // Close mobile sidebar on window resize & adjust layout
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="min-h-screen  flex flex-col">
            <AdminNavBar onMenuToggle={toggleMobile} />

            <AdminSideBar
                isMobileOpen={isMobileOpen}
                onMobileToggle={toggleMobile}
                user={user}
                isCollapsed={isCollapsed}
                onToggleCollapse={toggleCollapse}
            />

            <main
                className={`flex-1 pt-16 transition-all duration-300 bg-[#eaebef]  px-4 lg:px-6 ${
                    isCollapsed ? "lg:ml-16" : "lg:ml-64"
                }`}
            >
                <div className="">
                    {children}
                </div>
            </main>
            
            <AdminFooter isCollapsed={isCollapsed} />
        </div>
    );
};

export default AdminWrapper;