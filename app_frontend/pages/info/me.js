import { useState, useEffect } from 'react';

export default function MyInfo() {
    const [info, setInfo] = useState(null);
    const [infoList, setInfoList] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("jwt_access");
            try {
                const res = await fetch('http://127.0.0.1:3342/api/myinfo', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    throw new Error("Unauthorized");
                }
                const data = await res.json();
                setInfo(data);
                setInfoList(
                    Object.entries(data.data).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                    ))
                );
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
    
        fetchData(); // 🔁 เรียกฟังก์ชันนี้
    }, []);

    if (!info || !info.data) return <p>No profile data</p>;

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div style={{ fontSize: "64px" }}
                className="w-full flex flex-col justify-center items-center dark:drop-shadow-[0_0_0.3rem_#ffffff70]">
                <div>{info.data.fullname} Info</div>
                <ul>{infoList}</ul>
            </div>
        </main>
    );
}
