// import React from "react";

// const CRMProgress = ({ currentStep = 1 }) => {
//   const steps = [
//     { number: 1, label: "Company" },
//     { number: 2, label: "Response" },
//     { number: 3, label: "Meeting" },
//     { number: 4, label: "Follow-up" },
//     { number: 5, label: "Contract" },
//   ];

//   return (
//     <div className="w-full max-w-7xl">
//       <div className="relative">
//         {/* Progress line background */}
//         <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />

//         <div
//           className="absolute top-4 left-0 h-0.5 bg-blue-500 transition-all duration-500 ease-out"
//           style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
//         />

//         {/* Steps */}
//         <div className="relative flex justify-between">
//           {steps.map((step) => {
//             const isCompleted = currentStep > step.number;
//             const isCurrent = currentStep === step.number;
//             const isPending = currentStep < step.number;

//             return (
//               <div key={step.number} className="flex flex-col items-center">
//                 {/* Circle */}
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
//                     isCompleted
//                       ? "bg-blue-500 text-white scale-100"
//                       : isCurrent
//                       ? "bg-blue-500 text-white scale-110 shadow-lg shadow-blue-200"
//                       : "bg-white border-2 border-gray-200 text-gray-400"
//                   }`}
//                 >
//                   {isCompleted ? (
//                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                     </svg>
//                   ) : (
//                     step.number
//                   )}
//                 </div>

//                 {/* Label */}
//                 <span
//                   className={`mt-2 text-xs font-medium transition-colors duration-300 ${
//                     isCompleted || isCurrent ? "text-gray-700" : "text-gray-400"
//                   }`}
//                 >
//                   {step.label}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CRMProgress



import React from "react";

const CRMProgress = ({ currentStep = 1 }) => {
    const steps = [
        { number: 1, label: "Company" },
        { number: 2, label: "Response" },
        { number: 3, label: "Meeting" },
        { number: 4, label: "Follow-up" },
        { number: 5, label: "Contract" },
    ];

    const handleStepClick = (stepNumber) => {
        const demo = document.querySelector("[data-demo-step]");
        if (demo) demo.dataset.demoStep = stepNumber;
    };

    return (
        <div className="w-full max-w-7xl mx-auto mb-8">
            <div className="flex border-b border-gray-200">
                {steps.map((step) => {
                    const isCurrent = currentStep === step.number;

                    return (
                        <button
                            key={step.number}
                            onClick={() => handleStepClick(step.number)}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                                isCurrent
                                    ? "text-blue-600 "
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {step.label}
                            {isCurrent && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CRMProgress;
