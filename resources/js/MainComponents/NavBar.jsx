import React, { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("mousemove", handleMouseMove);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const navItems = [
        { name: "Home", href: "#home" },
        { name: "Sales", href: "#sales" },
        { name: "Services", href: "#services" },
        { name: "About", href: "#about" },
        { name: "Contact", href: "#contact" }
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
                    scrolled
                        ? "bg-black/40 backdrop-blur-2xl border-b border-white/10"
                        : "bg-black/20 backdrop-blur-xl"
                }`}
            >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl transition-all duration-1000"
                        style={{
                            background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
                            left: `${mousePos.x - 192}px`,
                            top: `${mousePos.y - 192}px`,
                        }}
                    ></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
                    <div className="flex justify-between items-center h-24">
                        {/* Logo */}
                        <a
                            href="/crm"
                            className="relative group flex items-center gap-2"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <Sparkles className="relative w-8 h-8 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">
                                <span className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
                                    Sales System
                                </span>
                            </span>
                        </a>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            {navItems.map((item, index) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="relative px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white transition-all duration-300 group"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <span className="relative z-10">{item.name}</span>
                                    <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"></div>
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300"></div>
                                </a>
                            ))}
                            
                            <div className="ml-4 h-8 w-px bg-white/10"></div>
                            
                            <button className="relative ml-4 px-6 py-2.5 text-sm font-semibold text-black bg-white rounded-full overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                                    Get Started
                                </span>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 animate-pulse"></div>
                                </div>
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden relative p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`md:hidden transition-all duration-500 ease-out ${
                        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                >
                    <div className="px-6 pb-8 pt-4 bg-black/60 backdrop-blur-2xl border-t border-white/10">
                        <div className="space-y-2">
                            {navItems.map((item, index) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-5 py-4 text-base font-medium text-white/80 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 group"
                                    style={{
                                        animation: isOpen ? `slideUp 0.5s ease-out ${index * 0.1}s both` : "none"
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{item.name}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </a>
                            ))}
                            
                            <button 
                                className="w-full mt-4 px-6 py-4 text-base font-semibold text-black bg-white rounded-xl hover:bg-gradient-to-r hover:from-violet-500 hover:via-fuchsia-500 hover:to-cyan-500 hover:text-white transition-all duration-500"
                                style={{
                                    animation: isOpen ? "slideUp 0.5s ease-out 0.5s both" : "none"
                                }}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
};

export default NavBar;