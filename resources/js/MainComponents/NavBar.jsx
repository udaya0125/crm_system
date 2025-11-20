import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@inertiajs/react";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href={'/crm'} className="text-2xl font-light text-gray-900">
                           Sales System
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a
                            href="#home"
                            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                        >
                            Home
                        </a>
                        <a
                            href="#sales"
                            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                        >
                            Sales
                        </a>
                        <a
                            href="#services"
                            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                        >
                            Services
                        </a>
                        <a
                            href="#about"
                            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                        >
                            About
                        </a>
                        <a
                            href="#contact"
                            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                        >
                            Contact
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-gray-900 focus:outline-none"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <a
                            href="#home"
                            className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-sm font-medium"
                        >
                            Home
                        </a>
                        <a
                            href="#sales"
                            className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-sm font-medium"
                        >
                            Sales
                        </a>
                        <a
                            href="#services"
                            className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-sm font-medium"
                        >
                            Services
                        </a>
                        <a
                            href="#about"
                            className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-sm font-medium"
                        >
                            About
                        </a>
                        <a
                            href="#contact"
                            className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-sm font-medium"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
