import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { use, useState } from "react";

const ActivityLog = () => {
    const [allLogs, setAllLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourlogs.index"));
                const data = response.data?.data ?? response.data;
                setAllLogs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Fetching error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);
    return (
        <>
            <AdminWrapper>
                <h1 className="text-2xl font-bold mb-4">Activity Log</h1>
            </AdminWrapper>
        </>
    );
};

export default ActivityLog;
