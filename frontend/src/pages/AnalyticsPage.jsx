// src/pages/AnalyticsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AnalyticsPage.css";

const API_BASE =  process.env.REACT_APP_API_BASE || "http://localhost:4000";

export default function AnalyticsPage({ inline = false, code: propCode }) {
  // if inline, use the passed-in prop; otherwise grab from URL
  const { code: paramCode } = useParams();
  const code = inline ? propCode : paramCode;

  const navigate = useNavigate();
  const [clicks, setClicks] = useState(null);

  const fetchClicks = async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/${code}`);
      const { clicks } = await res.json();
      setClicks(clicks);
    } catch {
      setClicks("–");
    }
  };

  useEffect(() => {
    fetchClicks();
  }, [code]);

  const showInfo = () =>
    alert(
      "You can see analytics anytime by typing /analytics between the url and the urlCode\n" +
        "for example shaw.ty/analytics/yourUrlCode"
    );

  return (
    <div className={inline ? "analytics-panel" : "analytics-page"}>
      {!inline && (
        <h1 className="analytics-header">
          Analytics for URL: <code>{code}</code>
        </h1>
      )}

      <div className="clicks-card">
        <div className="clicks-count">
          {clicks == null ? "UwU" : clicks}
        </div>
      </div>

      <div className="panel-actions">
        <button
          type="button"
          className="shadcn-button info-button"
          onClick={showInfo}
        >
          Info
        </button>
        <button
          type="button"
          className="shadcn-button refresh-button"
          onClick={fetchClicks}
        >
          Refresh
        </button>
      </div>

      {!inline && (
        <button
          type="button"
          className="shadcn-button another-btn"
          onClick={() => navigate("/")}
        >
          Back Home
        </button>
      )}
    </div>
  );
}
