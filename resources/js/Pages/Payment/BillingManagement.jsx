import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PageLoader from "@/Loader/PageLoader";
import ServiceContracts from "./ServiceContracts";
import Payment from "./Payment";
import ClientDetails from "./ClientDetails";

const TABS = [
    { key: "payments", label: "Payments" },
    { key: "contracts", label: "Service Contracts" },
    { key: "clients", label: "Client Details" },
];

const BillingManagement = () => {
    const [activeTab, setActiveTab] = useState("payments");
    const [allPayment, setAllPayment] = useState([]);
    const [allService, setAllService] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    // one shared fetch, used by all three tabs
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [payRes, svcRes] = await Promise.all([
                    axios.get(route("ourpayments.index")),
                    axios.get(route("ourservicecontracts.index")),
                ]);
                setAllPayment(payRes.data.data ?? []);
                setAllService(svcRes.data.data ?? []);
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error("Failed to load billing data");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [reloadTrigger]);

    // pass this to any tab that deletes something, so it can trigger a refetch
    const refetch = () => setReloadTrigger((prev) => prev + 1);

    return (
        <AdminWrapper>
            <Head title="Billing Management" />

            <div className="border-b border-gray-200 mb-6 flex gap-6">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === key
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {loading ? (
                <PageLoader />
            ) : (
                <>
                    {activeTab === "payments" && (
                        <Payment data={allPayment} refetch={refetch} />
                    )}
                    {activeTab === "contracts" && (
                        <ServiceContracts data={allService} refetch={refetch} />
                    )}
                    {activeTab === "clients" && (
                        <ClientDetails
                            payments={allPayment}
                            contracts={allService}
                            refetch={refetch}
                        />
                    )}
                </>
            )}
        </AdminWrapper>
    );
};

export default BillingManagement;
