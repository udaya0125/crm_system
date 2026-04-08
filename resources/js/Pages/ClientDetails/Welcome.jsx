import { Link, usePage } from "@inertiajs/react";
import React from "react";

const Welcome = () => {
    const user = usePage().props.auth.user;
    const isAdmin = user?.roles === "Admin";
    const isUser = user?.roles === "User";

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@300;400&display=swap');
                :root {
                    --ink: #0e0e0e;
                    --gold: #c8a96e;
                    --gold-light: #e8d5b0;
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeUp {
                    animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
                .font-cormorant { font-family: 'Cormorant Garamond', serif; }
                .font-jost { font-family: 'Jost', sans-serif; }
                .nav-cta-btn {
                    color: #c8a96e;
                    border: 1px solid rgba(200, 169, 110, 0.45);
                    transition: all 0.3s ease;
                }
                .nav-cta-btn:hover {
                    background: #c8a96e;
                    color: #0e0e0e;
                    border-color: #c8a96e;
                }
                .btn-signin-custom {
                    background: #0e0e0e;
                    transition: all 0.3s ease;
                }
                .btn-signin-custom:hover {
                    background: #2a2a2a;
                    transform: translateY(-1px);
                    box-shadow: 0 10px 32px rgba(0, 0, 0, 0.12);
                }
                .nav-link-custom {
                    color: rgba(245, 243, 239, 0.65);
                    transition: color 0.25s ease;
                }
                .nav-link-custom:hover { color: #e8d5b0; }
                .card-title-size { font-size: clamp(2.8rem, 5vw, 4rem); }
            `}</style>

            <div className="font-jost min-h-screen flex flex-col bg-white">
                {/* ── NAVBAR ── */}
                <nav
                    className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-14 py-5"
                    style={{
                        background: "rgba(14, 14, 14, 0.92)",
                        backdropFilter: "blur(16px)",
                        borderBottom: "1px solid rgba(200, 169, 110, 0.12)",
                    }}
                >
                    <div>
                        <img
                            src="/images/logo2.png"
                            alt="Sait"
                            className="h-[65px] w-auto opacity-[0.92]"
                        />
                    </div>
                    <div className="hidden md:flex items-center gap-9">
                        {user ? (
                            <a
                                href="/dashboard"
                                className="nav-cta-btn font-jost font-normal text-[0.75rem] tracking-[0.2em] uppercase no-underline px-[26px] py-[10px] rounded-[2px]"
                            >
                                Dashboard
                            </a>
                        ) : (
                            <a
                                href="/login"
                                className="nav-cta-btn font-jost font-normal text-[0.75rem] tracking-[0.2em] uppercase no-underline px-[26px] py-[10px] rounded-[2px]"
                            >
                                Sign In
                            </a>
                        )}
                    </div>
                </nav>

                {/* ── BODY ── */}
                <main className="flex-1 flex items-center justify-center pt-20">
                    <div className="animate-fadeUp text-center max-w-[520px] px-8">
                        <h1 className="font-cormorant font-light card-title-size text-[#0e0e0e] leading-[1.1] mb-2 tracking-[-0.01em]">
                            Welcome to{" "}
                            <em className="italic text-[#c8a96e]">
                                CRM System
                            </em>
                        </h1>

                        <p className="font-jost font-light text-[0.95rem] leading-[1.85] text-[#6b6b6b] mb-11 tracking-[0.02em]">
                            Transform how you manage customer relationships with
                            tools that simplify communication, track sales
                            pipelines, and foster collaboration. Join thousands
                            of businesses that trust our platform to deliver
                            measurable results.
                        </p>

                        {user ? (
                            <a
                                href="/dashboard"
                                className="btn-signin-custom font-jost font-normal text-[0.75rem] tracking-[0.22em] uppercase text-white no-underline px-12 py-4 rounded-[2px] inline-block"
                            >
                                Dashboard
                            </a>
                        ) : (
                            <a
                                href="/login"
                                className="btn-signin-custom font-jost font-normal text-[0.75rem] tracking-[0.22em] uppercase text-white no-underline px-12 py-4 rounded-[2px] inline-block"
                            >
                                Sign In
                            </a>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Welcome;




// import { Link, usePage } from "@inertiajs/react";
// import React from "react";

// const Welcome = () => {
//     const user = usePage().props.auth.user;
//     const isAdmin = user?.roles === "Admin";
//     const isUser = user?.roles === "User";
//     return (
//         <>
//             <style>{`
//         :root {
//           --ink: #0e0e0e;
//           --gold: #c8a96e;
//           --gold-light: #e8d5b0;
//         }

//         * { margin: 0; padding: 0; box-sizing: border-box; }

//         .welcome-root {
//           font-family: 'Jost', sans-serif;
//           min-height: 100vh;
//           display: flex;
//           flex-direction: column;
//           background: #ffffff;
//         }

//         /* ── NAVBAR (unchanged) ── */
//         .nav {
//           position: fixed;
//           top: 0; left: 0; right: 0;
//           z-index: 50;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 20px 56px;
//           background: rgba(14, 14, 14, 0.92);
//           backdrop-filter: blur(16px);
//           border-bottom: 1px solid rgba(200, 169, 110, 0.12);
//         }

//         .nav-logo img {
//           height: 65px;
//           width: auto;

//           opacity: 0.92;
//         }

//         .nav-links {
//           display: flex;
//           align-items: center;
//           gap: 36px;
//         }

//         .nav-link {
//           font-family: 'Jost', sans-serif;
//           font-weight: 300;
//           font-size: 0.78rem;
//           letter-spacing: 0.18em;
//           text-transform: uppercase;
//           color: rgba(245, 243, 239, 0.65);
//           text-decoration: none;
//           transition: color 0.25s ease;
//         }

//         .nav-link:hover { color: var(--gold-light); }

//         .nav-cta {
//           font-family: 'Jost', sans-serif;
//           font-weight: 400;
//           font-size: 0.75rem;
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//           color: var(--gold);
//           text-decoration: none;
//           border: 1px solid rgba(200, 169, 110, 0.45);
//           padding: 10px 26px;
//           border-radius: 2px;
//           transition: all 0.3s ease;
//         }

//         .nav-cta:hover {
//           background: var(--gold);
//           color: var(--ink);
//           border-color: var(--gold);
//         }

//         /* ── BODY ── */
//         .body {
//           flex: 1;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding-top: 80px;
//         }

//         .card {
//           text-align: center;
//           max-width: 520px;
//           padding: 0 32px;
//           animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//           opacity: 0;
//         }

//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(24px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         .card-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-weight: 300;
//           font-size: clamp(2.8rem, 5vw, 4rem);
//           color: var(--ink);
//           line-height: 1.1;
//           margin-bottom: 8px;
//           letter-spacing: -0.01em;
//         }

//         .card-title em {
//           font-style: italic;
//           color: var(--gold);
//         }

//         .card-description {
//           font-family: 'Jost', sans-serif;
//           font-weight: 300;
//           font-size: 0.95rem;
//           line-height: 1.85;
//           color: #6b6b6b;
//           margin-bottom: 44px;
//           letter-spacing: 0.02em;
//         }

//         .btn-signin {
//           font-family: 'Jost', sans-serif;
//           font-weight: 400;
//           font-size: 0.75rem;
//           letter-spacing: 0.22em;
//           text-transform: uppercase;
//           color: #ffffff;
//           text-decoration: none;
//           background: var(--ink);
//           padding: 16px 48px;
//           border-radius: 2px;
//           display: inline-block;
//           transition: all 0.3s ease;
//         }

//         .btn-signin:hover {
//           background: #2a2a2a;
//           transform: translateY(-1px);
//           box-shadow: 0 10px 32px rgba(0, 0, 0, 0.12);
//         }

//         @media (max-width: 768px) {
//           .nav { padding: 18px 24px; }
//           .nav-links { display: none; }
//         }
//       `}</style>

//             <div className="welcome-root">
//                 {/* ── NAVBAR ── */}
//                 <nav className="nav">
//                     <div className="nav-logo">
//                         <img src="/images/logo2.png" alt="Sait" />
//                     </div>
//                     <div className="nav-links">
//                         <a href="/login" className="nav-cta">
//                             Sign In
//                         </a>
//                     </div>
//                 </nav>

//                 {/* ── BODY ── */}
//                 <main className="body">
//                     <div className="card">
//                         <h1 className="card-title">
//                             Welcome to <em>CRM System</em>
//                         </h1>

//                         <p className="card-description">
//                             Transform how you manage customer relationships with
//                             tools that simplify communication, track sales
//                             pipelines, and foster collaboration. Join thousands
//                             of businesses that trust our platform to deliver
//                             measurable results.
//                         </p>

//                         {user ? (
//                             <a
//                                 href="/dashboard"
//                                 className="btn-signin"
//                             >
//                                 Dashboard
//                             </a>
//                         ) : (
//                             <a
//                                 href="/login"
//                                 className="btn-signin"
//                             >
//                                 Sign In
//                             </a>
//                         )}
//                     </div>
//                 </main>
//             </div>
//         </>
//     );
// };

// export default Welcome;


