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
    const [formData, setFormData] = useState({
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

    const updateFormData = (stepName, data) => {
        setFormData((prev) => ({
            ...prev,
            [stepName]: { ...prev[stepName], ...data },
        }));
    };

    // Special function to handle company creation and capture the ID
    const updateCompanyData = (data, createdCompanyId = null) => {
        updateFormData("company", data);
        
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
                        data={formData.company}
                        updateData={updateCompanyData} // Use the special function
                        nextStep={nextStep}
                    />
                );
            case 2:
                return (
                    <InitialResponse
                        data={formData.initialResponse}
                        updateData={(data) =>
                            updateFormData("initialResponse", data)
                        }
                        nextStep={nextStep}
                        prevStep={prevStep}
                        companyId={companyId} // Pass companyId here
                    />
                );
            case 3:
                return (
                    <Meeting
                        data={formData.meeting}
                        updateData={(data) => updateFormData("meeting", data)}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        companyId={companyId} // Pass companyId to Meeting
                    />
                );
            case 4:
                return (
                    <FollowUpResponse
                        data={formData.followUpResponse}
                        updateData={(data) =>
                            updateFormData("followUpResponse", data)
                        }
                        nextStep={nextStep}
                        prevStep={prevStep}
                        companyId={companyId} // Pass companyId to FollowUpResponse
                    />
                );
            case 5:
                return (
                    <Contract
                        data={formData.contract}
                        updateData={(data) => updateFormData("contract", data)}
                        prevStep={prevStep}
                        companyId={companyId} // Pass companyId to Contract
                        onSubmit={() => {
                            console.log("Final CRM Data:", formData);
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
                <div className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className=" overflow-hidden">
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