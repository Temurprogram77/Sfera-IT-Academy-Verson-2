import React, { useEffect, useState } from "react";

// ------------------ Types ------------------
export interface Report {
  id?: number;
  reportName?: string;
  description?: string;
  status?: string;
  category?: string;
  department?: string;
  priority?: string;
  location?: string;
  reportType?: string;
  dangerType?: string;
  assignee?: string;
  reportUser?: string;
}

interface ReportsProps {
  url: string; // SSE endpointni parent beradi
  onReportsUpdate?: (reports: Report[]) => void; // parentga yuborish
}

// ------------------ Component ------------------
const Reports: React.FC<ReportsProps> = ({ url, onReportsUpdate }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [connected, setConnected] = useState(false);
  const [es, setEs] = useState<EventSource | null>(null);

  // ------------------ Helper: safe JSON parse ------------------
  const safeJsonParse = (raw: any) => {
    if (raw == null) return null;
    const s = String(raw).trim();
    if (!s) return null;
    if (s === "ping" || s === "keep-alive") return { _ping: true };
    try { return JSON.parse(s); } catch { return { _raw: raw }; }
  };

  // ------------------ Helper: normalize payload ------------------
  const normalizePayload = (parsed: any) => {
    if (!parsed) return null;
    if (parsed._ping) return { type: "ping" };
    if (Array.isArray(parsed)) return { type: "list", list: parsed };
    if (Array.isArray(parsed?.data)) return { type: "list", list: parsed.data };
    if (Array.isArray(parsed?.payload)) return { type: "list", list: parsed.payload };
    if (parsed && (parsed.id || parsed.reportName)) return { type: "single", item: parsed };
    return { type: "unknown", parsed };
  };

  // ------------------ Apply payload ------------------
  const applyPayload = (raw: any) => {
    const parsed = safeJsonParse(raw);
    if (!parsed) return;

    const norm = normalizePayload(parsed);
    if (!norm) return;

    if (norm.type === "ping") {
      console.log("🔁 ping event");
      return;
    }

    if (norm.type === "list") {
      setReports(norm.list);
      console.log("✅ list received:", norm.list);
      onReportsUpdate?.(norm.list);
      return;
    }

    if (norm.type === "single") {
      setReports(prev => {
        const idx = prev.findIndex(r => r.id === norm.item.id);
        const newArr = idx >= 0
          ? [...prev.slice(0, idx), norm.item, ...prev.slice(idx + 1)]
          : [norm.item, ...prev];
        onReportsUpdate?.(newArr);
        console.log("✅ single report received:", norm.item);
        return newArr;
      });
      return;
    }

    console.warn("⚠️ Unknown payload format:", norm);
  };

  // ------------------ SSE connection ------------------
  useEffect(() => {
    if (!url) return;

    // Close previous SSE if exists
    if (es) es.close();

    const source = new EventSource(url);
    setEs(source);

    source.onopen = () => {
      setConnected(true);
      console.log("✅ SSE Connected to", url);
    };

    source.onerror = (err) => {
      setConnected(false);
      console.error("❌ SSE Error", err);
    };

    source.addEventListener("reports", (ev) => {
      console.log("📩 reports event received:", ev.data);
      applyPayload(ev.data);
    });

    // Default event
    source.onmessage = (ev) => {
      console.log("📩 default message event:", ev.data);
      applyPayload(ev.data);
    };

    return () => source.close();
  }, [url]);

  // ------------------ Render ------------------
  return (
    <div style={{ padding: 20, fontFamily: "system-ui, sans-serif", color: "#fff", background: "#0b1020", minHeight: "100vh" }}>
      <h1>📡 Reports SSE Dashboard</h1>
      <div style={{ marginBottom: 10 }}>
        <span>Status: {connected ? "Connected ✅" : "Disconnected ❌"}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
        {reports.length === 0 && <div style={{ color: "#aaa" }}>No reports...</div>}
        {reports.map(r => (
          <div key={r.id ?? Math.random()} style={{ background: "rgba(255,255,255,.08)", borderRadius: 14, padding: 14 }}>
            <h3>{r.reportName ?? `Report #${r.id}`}</h3>
            <p>{r.description}</p>
            <p>Status: {r.status}</p>
            <p>Category: {r.category}</p>
            <p>Department: {r.department}</p>
            <p>Priority: {r.priority}</p>
            <p>Location: {r.location}</p>
            <p>Type: {r.reportType}</p>
            <p>Danger: {r.dangerType}</p>
            <p>Assignee: {r.assignee}</p>
            <p>Reporter: {r.reportUser}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;