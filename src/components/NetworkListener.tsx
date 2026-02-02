import { useEffect, useState } from "react";

export default function NetworkBanner() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const updateStatus = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener("online", updateStatus);
        window.addEventListener("offline", updateStatus);

        updateStatus();

        return () => {
            window.removeEventListener("online", updateStatus);
            window.removeEventListener("offline", updateStatus);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                background: "red",
                color: "white",
                padding: "10px",
                textAlign: "center",
                zIndex: 9999,
                fontSize: "16px",
                fontWeight: "bold",
            }}
        >
            Internet aloqasi uzildi! Iltimos tarmoqqa ulaning.
        </div>
    );
}
