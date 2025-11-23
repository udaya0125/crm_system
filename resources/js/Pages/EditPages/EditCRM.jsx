import React, { useEffect, useState } from "react";
import EditCrmProgress from "./EditCrmProgress";
import EditCreateCompany from "@/EditStepComponents/EditCreateCompany";
import EditInitialResponse from "@/EditStepComponents/EditInitialResponse";
import EditMeeting from "@/EditStepComponents/EditMeeting";
import EditFollowUpResponse from "@/EditStepComponents/EditFollowUpResponse";
import EditContract from "@/EditStepComponents/EditContract";
import { Link } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";

const EditCRM = () => {
    const [step, setStep] = useState(1);
    const [allCompany, setAllCompany] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [crmData, setCrmData] = useState({
        company: {},
        initialResponse: {},
        meeting: {},
        followUpResponse: {},
        contract: {},
    });
    const [companyId, setCompanyId] = useState(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourcompany.index"));
                setAllCompany(response.data);
                setError(null);
            } catch (error) {
                console.error("fetching error ", error);
                setError("Failed to fetch companies. Please try again later.");
                setAllCompany([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [reloadTrigger]);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
    const goToStep = (stepNumber) => setStep(stepNumber);

    const updateForm = (stepName, data) => {
        setCrmData((prev) => ({
            ...prev,
            [stepName]: { ...prev[stepName], ...data },
        }));
    };

    // Special function to handle company creation and capture the ID
    const updateCompanyData = (data, createdCompanyId = null) => {
        updateForm("company", data);

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
                    <EditCreateCompany
                        data={crmData.company}
                        updateData={updateCompanyData} // Use the special function
                        allCompany={allCompany}
                        setAllCompany={setAllCompany}
                        nextStep={nextStep}
                    />
                );
            case 2:
                return (
                    <EditInitialResponse
                        data={crmData.initialResponse}
                        updateData={(data) =>
                            updateForm("initialResponse", data)
                        }
                        nextStep={nextStep}
                        prevStep={prevStep}
                        companyId={companyId} // Pass companyId here
                    />
                );
            case 3:
                return (
                    <EditMeeting
                        data={crmData.meeting}
                        updateData={(data) => updateForm("meeting", data)}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        companyId={companyId} // Pass companyId to Meeting
                    />
                );
            case 4:
                return (
                    <EditFollowUpResponse
                        data={crmData.followUpResponse}
                        updateData={(data) =>
                            updateForm("followUpResponse", data)
                        }
                        nextStep={nextStep}
                        prevStep={prevStep}
                        companyId={companyId} // Pass companyId to FollowUpResponse
                    />
                );
            case 5:
                return (
                    <EditContract
                        data={crmData.contract}
                        updateData={(data) => updateForm("contract", data)}
                        prevStep={prevStep}
                        companyId={companyId} // Pass companyId to Contract
                        onSubmit={() => {
                            console.log("Final CRM Data:", crmData);
                            alert("CRM Process Completed Successfully!");
                        }}
                    />
                );
            default:
                return <EditCreateCompany />;
        }
    };

    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/company" className="flex items-center ml-4">
                    <ChevronLeft /> Back to CRM Dashboard
                </Link>
                <div className="mt-6 bg-white shadow-sm rounded-lg">
                    <div className=" overflow-hidden">
                        <EditCrmProgress
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
        </div>
    );
};

export default EditCRM;
