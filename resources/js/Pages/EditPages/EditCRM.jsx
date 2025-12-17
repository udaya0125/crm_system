// import React, { useEffect, useState } from "react";
// import EditCrmProgress from "./EditCrmProgress";
// import EditCreateCompany from "@/EditStepComponents/EditCreateCompany";
// import EditInitialResponse from "@/EditStepComponents/EditInitialResponse";
// import EditMeeting from "@/EditStepComponents/EditMeeting";
// import EditFollowUpResponse from "@/EditStepComponents/EditFollowUpResponse";
// import EditContract from "@/EditStepComponents/EditContract";
// import { Link } from "@inertiajs/react";
// import { ChevronLeft } from "lucide-react";

// const EditCRM = ({ company }) => {
//     const [step, setStep] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [reloadTrigger, setReloadTrigger] = useState(0);
//     const [crmData, setCrmData] = useState({
//         company: {},
//         initialResponse: {},
//         meeting: {},
//         followUpResponse: {},
//         contract: {},
//     });
//     const [companyId, setCompanyId] = useState(null);

//     // Initialize with company data when component mounts
//     useEffect(() => {
//         if (company) {
//             console.log("Company data received:", company);
//             setCompanyId(company.id);

//             // Set the company data for editing
//             setCrmData((prev) => ({
//                 ...prev,
//                 company: {
//                     companyName: company.company_name || "",
//                     firstName: company.first_name || "",
//                     lastName: company.last_name || "",
//                     client_member: company.client_member || "",
//                     designation: company.designation || "",
//                     noOfRooms: company.no_of_rooms || "",
//                     phone: company.phone_no || "",
//                     email: company.email || "",
//                     address: company.address || "",
//                     website: company.website || "",
//                     source: company.source || "",
//                     responsiblePerson: company.responsible_person || "",
//                     comment: company.comment || "",
//                     messenger: company.preffered_message || "",
//                     messengerContact: company.message_contact || "",
//                 },
//                 initialResponse: company.initial_responses || {},
//                 meeting: company.meetings || {},
//                 followUpResponse: company.follow_up_responses || {},
//                 contract: company.contracts || {},
//             }));
//         }
//     }, [company]);

//     const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
//     const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
//     const goToStep = (stepNumber) => setStep(stepNumber);

//     const updateForm = (stepName, data) => {
//         setCrmData((prev) => ({
//             ...prev,
//             [stepName]: { ...prev[stepName], ...data },
//         }));
//     };

//     // Special function to handle company creation and capture the ID
//     const updateCompanyData = (data, createdCompanyId = null) => {
//         updateForm("company", data);

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
//                     <EditCreateCompany
//                         data={crmData.company}
//                         updateData={updateCompanyData}
//                         company={company} // Pass the full company object
//                         nextStep={nextStep}
//                         companyId={companyId} // Pass companyId for updates
//                     />
//                 );
//             case 2:
//                 return (
//                     <EditInitialResponse
//                         data={crmData.initialResponse}
//                         updateData={(data) =>
//                             updateForm("initialResponse", data)
//                         }
//                         nextStep={nextStep}
//                         prevStep={prevStep}
//                         companyId={companyId}
//                         company={company}
//                         existingData={company.initial_responses} // Pass existing data
//                     />
//                 );
//             case 3:
//                 return (
//                     <EditMeeting
//                         data={crmData.meeting}
//                         updateData={(data) => updateForm("meeting", data)}
//                         nextStep={nextStep}
//                         prevStep={prevStep}
//                         companyId={companyId}
//                         company={company}
//                         existingData={company.meetings} // Pass existing data
//                         meetingId={crmData.meeting.id}
//                     />
//                 );
//             case 4:
//                 return (
//                     <EditFollowUpResponse
//                         data={crmData.followUpResponse}
//                         updateData={(data) =>
//                             updateForm("followUpResponse", data)
//                         }
//                         nextStep={nextStep}
//                         prevStep={prevStep}
//                         companyId={companyId}
//                         company={company}
//                         existingData={company.follow_up_responses} // Pass existing data
//                     />
//                 );
//             case 5:
//                 return (
//                     <EditContract
//                         data={crmData.contract}
//                         updateData={(data) => updateForm("contract", data)}
//                         prevStep={prevStep}
//                         companyId={companyId}
//                         company={company}
//                         existingData={company.contracts} // Pass existing data
//                         onSubmit={() => {
//                             console.log("Final CRM Data:", crmData);
//                             alert("CRM Process Completed Successfully!");
//                         }}
//                     />
//                 );
//             default:
//                 return <EditCreateCompany />;
//         }
//     };

//     return (
//         <div className="py-8">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <Link href="/company" className="flex items-center ml-4">
//                     <ChevronLeft /> Back to CRM Dashboard
//                 </Link>
//                 <div className="mt-6 bg-white shadow-sm rounded-lg">
//                     <div className="overflow-hidden">
//                         <EditCrmProgress
//                             currentStep={step}
//                             goToStep={goToStep}
//                         />
//                         <div className="">{renderStep()}</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditCRM;



import React, { useEffect, useState } from "react";
import EditCrmProgress from "./EditCrmProgress";
import EditCreateCompany from "@/EditStepComponents/EditCreateCompany";
import EditInitialResponse from "@/EditStepComponents/EditInitialResponse";
import EditMeeting from "@/EditStepComponents/EditMeeting";
import EditFollowUpResponse from "@/EditStepComponents/EditFollowUpResponse";
import EditContract from "@/EditStepComponents/EditContract";
import { Link } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";

const EditCRM = ({ company }) => {
    const [step, setStep] = useState(1);
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

    // Initialize with company data when component mounts
    useEffect(() => {
        if (company) {
            console.log("Company data received:", company);
            setCompanyId(company.id);

            // Set the company data for editing - FIXED MAPPING
            setCrmData((prev) => ({
                ...prev,
                company: {
                    companyName: company.company_name || "",
                    fullName: company.full_name || "", // Changed from firstName/lastName
                    designation: company.designation || "",
                    phone: company.phone_no || "",
                    email: company.email || "",
                    address: company.address || "",
                    responsiblePerson: company.responsible_person || "",
                    ourTeam: company.our_team || "", // Added this field
                    client_member: company.client_member || "",
                    comment: company.comment || "",
                    follow_up_date: company.follow_up_date || "", // Added if needed
                },
                initialResponse: company.initial_responses || {},
                meeting: company.meetings || {},
                followUpResponse: company.follow_up_responses || {},
                contract: company.contracts || {},
            }));
        }
    }, [company]);

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
                        updateData={updateCompanyData}
                        company={company} // Pass the full company object
                        nextStep={nextStep}
                        companyId={companyId} // Pass companyId for updates
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
                        companyId={companyId}
                        company={company}
                        existingData={company.initial_responses} // Pass existing data
                    />
                );
            case 3:
                return (
                    <EditMeeting
                        data={crmData.meeting}
                        updateData={(data) => updateForm("meeting", data)}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        companyId={companyId}
                        company={company}
                        existingData={company.meetings} // Pass existing data
                        meetingId={crmData.meeting.id}
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
                        companyId={companyId}
                        company={company}
                        existingData={company.follow_up_responses} // Pass existing data
                    />
                );
            case 5:
                return (
                    <EditContract
                        data={crmData.contract}
                        updateData={(data) => updateForm("contract", data)}
                        prevStep={prevStep}
                        companyId={companyId}
                        company={company}
                        existingData={company.contracts} // Pass existing data
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
                    <div className="overflow-hidden">
                        <EditCrmProgress
                            currentStep={step}
                            goToStep={goToStep}
                        />
                        <div className="">{renderStep()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCRM;