import React from "react";

const EditCrmProgress = ({ currentStep = 1 }) => {
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
        <div className="w-full max-w-7xl ">
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

export default EditCrmProgress;
