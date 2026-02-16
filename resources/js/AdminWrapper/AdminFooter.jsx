import React from "react";

const AdminFooter = ({ isCollapsed = false }) => {
    return (
        <footer 
            className={`border-t border-blue-200 bg-[#eaebef] transition-all duration-300 ${
                isCollapsed ? "lg:ml-16" : "lg:ml-64"
            }`}
        >
            <div className="max-w-full mx-auto py-4 px-6">
                <p className="font-bold  text-gray-700 text-center">
                    © Copyright{" "}
                    <a 
                        href="https://www.sait.com.np/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-900 text-lg hover:text-blue-800 hover:underline transition-colors duration-200"
                    >
                        S.A I.T Solution
                    </a>
                    . All Rights Reserved
                </p>
            </div>
        </footer>
    );
};

export default AdminFooter;