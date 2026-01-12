import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import Contract from "@/StepsComponents.jsx/Contract";
import CreateCompany from "@/StepsComponents.jsx/CreateCompany";
import FollowUpResponse from "@/StepsComponents.jsx/FollowUpResponse";
import InitialResponse from "@/StepsComponents.jsx/InitialResponse";
import Meeting from "@/StepsComponents.jsx/Meeting";
import React, { useState } from "react";
import CRMProgress from "./CRMProgress";

const CRM = () => {
    const [step, setStep] = useState(1);
    const [crmData, setCrmData] = useState({
        company: {},
        initialResponse: {},
        meeting: {},
        followUpResponse: {},
        contract: {},
    });
    const [companyId, setCompanyId] = useState(null);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
    const goToStep = (stepNumber) => setStep(stepNumber);

    const updateData = (stepName, data) => {
        setCrmData((prev) => ({
            ...prev,
            [stepName]: { ...prev[stepName], ...data },
        }));
    };

    // Special function to handle company creation and capture the ID
    const updateCompanyData = (data, createdCompanyId = null) => {
        updateData("company", data);

        // If we have a company ID from the API response, set it
        if (createdCompanyId) {
            setCompanyId(createdCompanyId);
            console.log("Company ID set:", createdCompanyId);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <CreateCompany
                        data={crmData.company}
                        updateData={updateCompanyData} // Use the special function
                        nextStep={nextStep}
                    />
                );
            case 2:
                return (
                    <InitialResponse
                        data={crmData.initialResponse}
                        updateData={(data) =>
                            updateData("initialResponse", data)
                        }
                        nextStep={nextStep}
                        prevStep={prevStep}
                        companyId={companyId} // Pass companyId here
                    />
                );
            case 3:
                return (
                    <Meeting
                        data={crmData.meeting}
                        updateData={(data) => updateData("meeting", data)}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        companyId={companyId} // Pass companyId to Meeting
                    />
                );
            case 4:
                return (
                    <FollowUpResponse
                        data={crmData.followUpResponse}
                        updateData={(data) =>
                            updateData("followUpResponse", data)
                        }
                        nextStep={nextStep}
                        prevStep={prevStep}
                        companyId={companyId} // Pass companyId to FollowUpResponse
                    />
                );
            case 5:
                return (
                    <Contract
                        data={crmData.contract}
                        updateData={(data) => updateData("contract", data)}
                        prevStep={prevStep}
                        companyId={companyId} // Pass companyId to Contract
                        onSubmit={() => {
                            console.log("Final CRM Data:", crmData);
                            alert("CRM Process Completed Successfully!");
                        }}
                    />
                );
            default:
                return <CreateCompany />;
        }
    };

    return (
        <div>
            <AdminWrapper>
                <div className="py-6">
                    <div className="">
                        <div className="overflow-hidden">
                            <CRMProgress
                                currentStep={step}
                                goToStep={goToStep}
                            />
                            <div className="">
                                {/* Debug info - remove in production */}
                                {/* <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                                    <strong>Current Step:</strong> {step} | 
                                    <strong> Company ID:</strong> {companyId ? companyId : "Not set yet"}
                                </div> */}
                                {renderStep()}
                            </div>
                        </div>
                    </div>
                </div>
            </AdminWrapper>
        </div>
    );
};

export default CRM;

// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import Contract from "@/StepsComponents.jsx/Contract";
// import CreateCompany from "@/StepsComponents.jsx/CreateCompany";
// import FollowUpResponse from "@/StepsComponents.jsx/FollowUpResponse";
// import InitialResponse from "@/StepsComponents.jsx/InitialResponse";
// import Meeting from "@/StepsComponents.jsx/Meeting";
// import React, { useState } from "react";
// import CRMProgress from "./CRMProgress";

// const CRM = () => {
//     const [step, setStep] = useState(1);
//     const [crmData, setCrmData] = useState({
//         company: {},
//         initialResponse: {},
//         meeting: {},
//         followUpResponse: {},
//         contract: {},
//     });
//     const [companyId, setCompanyId] = useState(null);

//     const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
//     const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
//     const goToStep = (stepNumber) => setStep(stepNumber);

//     const updateData = (stepName, data) => {
//         setCrmData((prev) => ({
//             ...prev,
//             [stepName]: { ...prev[stepName], ...data },
//         }));
//     };

//     // Special function to handle company creation and capture the ID
//     const updateCompanyData = (data, createdCompanyId = null) => {
//         updateData("company", data);

//         // If we have a company ID from the API response, set it
//         if (createdCompanyId) {
//             setCompanyId(createdCompanyId);
//             console.log("Company ID set:", createdCompanyId);
//         }
//     };

//     const renderStep = () => {
//         switch (step) {
//             case 1:
//                 return (
//                     <CreateCompany
//                         data={crmData.company}
//                         updateData={updateCompanyData}
//                         nextStep={nextStep}
//                     />
//                 );
//             case 2:
//                 return (
//                     <InitialResponse
//                         data={crmData.initialResponse}
//                         updateData={(data) =>
//                             updateData("initialResponse", data)
//                         }
//                         nextStep={nextStep}
//                         prevStep={prevStep}
//                         companyId={companyId}
//                     />
//                 );
//             case 3:
//                 return (
//                     <Meeting
//                         data={crmData.meeting}
//                         updateData={(data) => updateData("meeting", data)}
//                         nextStep={nextStep}
//                         prevStep={prevStep}
//                         companyId={companyId}
//                     />
//                 );
//             case 4:
//                 return (
//                     <FollowUpResponse
//                         data={crmData.followUpResponse}
//                         updateData={(data) =>
//                             updateData("followUpResponse", data)
//                         }
//                         nextStep={nextStep}
//                         prevStep={prevStep}
//                         companyId={companyId}
//                     />
//                 );
//             case 5:
//                 return (
//                     <Contract
//                         data={crmData.contract}
//                         updateData={(data) => updateData("contract", data)}
//                         prevStep={prevStep}
//                         companyId={companyId}
//                         onSubmit={() => {
//                             console.log("Final CRM Data:", crmData);
//                             alert("CRM Process Completed Successfully!");
//                         }}
//                     />
//                 );
//             default:
//                 return <CreateCompany />;
//         }
//     };

//     return (
//         <AdminWrapper>
//             <div className="min-h-screen bg-gray-50">
//                 {/* Mobile Header */}
//                 <div className="lg:hidden bg-white shadow-sm border-b">
//                     <div className="px-4 py-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h1 className="text-xl font-semibold text-gray-900">
//                                     CRM Process
//                                 </h1>
//                                 <p className="text-sm text-gray-600 mt-1">
//                                     Step {step} of 5
//                                 </p>
//                             </div>
//                             <div className="text-right">
//                                 <div className="text-xs text-gray-500">
//                                     Company ID
//                                 </div>
//                                 <div className="text-sm font-medium text-blue-600">
//                                     {companyId ? companyId : "Pending"}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="py-4 lg:py-8">
//                     <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8">
//                         <div className="overflow-hidden">
//                             {/* Desktop Header */}
//                             <div className="hidden lg:block mb-6 lg:mb-8">
//                                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                                     Customer Relationship Management
//                                 </h1>
//                                 <p className="text-gray-600 mt-2">
//                                     Complete the CRM process step by step
//                                 </p>
//                             </div>

//                             {/* Progress Bar */}
//                             <div className="mb-6 lg:mb-8">
//                                 <CRMProgress
//                                     currentStep={step}
//                                     goToStep={goToStep}
//                                 />
//                             </div>

//                             {/* Current Step Info - Mobile */}
//                             <div className="lg:hidden mb-4">
//                                 <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r">
//                                     <div className="flex items-center">
//                                         <div className="flex-shrink-0">
//                                             <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
//                                                 {step}
//                                             </span>
//                                         </div>
//                                         <div className="ml-3">
//                                             <p className="text-sm font-medium text-blue-800">
//                                                 Current Step
//                                             </p>
//                                             <p className="text-sm text-blue-700">
//                                                 {step === 1 && "Create Company"}
//                                                 {step === 2 && "Initial Response"}
//                                                 {step === 3 && "Meeting"}
//                                                 {step === 4 && "Follow-up Response"}
//                                                 {step === 5 && "Contract"}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Main Content */}
//                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                                 {/* Content Header */}
//                                 <div className="border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
//                                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                                         <div>
//                                             <h2 className="text-lg font-medium text-gray-900">
//                                                 {step === 1 && "Create New Company"}
//                                                 {step === 2 && "Initial Response"}
//                                                 {step === 3 && "Schedule Meeting"}
//                                                 {step === 4 && "Follow-up Response"}
//                                                 {step === 5 && "Create Contract"}
//                                             </h2>
//                                             <p className="mt-1 text-sm text-gray-600">
//                                                 {step === 1 && "Enter company details to begin the CRM process"}
//                                                 {step === 2 && "Record the initial response from the company"}
//                                                 {step === 3 && "Schedule and document meeting details"}
//                                                 {step === 4 && "Record follow-up communication"}
//                                                 {step === 5 && "Finalize the contract details"}
//                                             </p>
//                                         </div>
//                                         <div className="mt-3 sm:mt-0">
//                                             <div className="flex items-center space-x-2">
//                                                 <div className="hidden sm:block text-sm text-gray-500">
//                                                     Company ID:
//                                                 </div>
//                                                 <div className={`px-3 py-1 rounded-full text-sm font-medium ${companyId ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                                                     {companyId ? companyId : "Pending"}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Step Content */}
//                                 <div className="px-4 py-6 sm:px-6 lg:px-8">
//                                     <div className="max-w-4xl mx-auto">
//                                         {renderStep()}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Navigation Instructions - Mobile */}
//                             <div className="lg:hidden mt-4">
//                                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                                     <div className="flex items-center justify-between">
//                                         <button
//                                             onClick={prevStep}
//                                             disabled={step === 1}
//                                             className={`px-4 py-2 rounded-lg text-sm font-medium ${step === 1
//                                                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                                             }`}
//                                         >
//                                             Previous
//                                         </button>
//                                         <div className="text-center">
//                                             <span className="text-xs text-gray-500">
//                                                 Swipe or use buttons to navigate
//                                             </span>
//                                         </div>
//                                         <button
//                                             onClick={nextStep}
//                                             disabled={step === 5}
//                                             className={`px-4 py-2 rounded-lg text-sm font-medium ${step === 5
//                                                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                                 : 'bg-blue-600 text-white hover:bg-blue-700'
//                                             }`}
//                                         >
//                                             Next
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Help Text */}
//                             <div className="mt-6 lg:mt-8">
//                                 <div className="text-center text-sm text-gray-500">
//                                     <p>Need help? Contact support if you encounter any issues during the process.</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AdminWrapper>
//     );
// };

// export default CRM;
