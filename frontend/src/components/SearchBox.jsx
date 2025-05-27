// src/pages/SearchPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useShortener from "../hooks/useShortener";
import AnalyticsPage from "../pages/AnalyticsPage";
import "../styles/SearchBox.css";

export default function SearchPage() {
  const {
    url,
    setUrl,
    handleSubmit,
    shortUrl,
    clicksOpen,
    toggleClicks,
    advOpen,
    expiresIn,
    toggleAdv,
    setExpiresIn,
    formatExpiry,
  } = useShortener();

  const navigate = useNavigate();

  // extract just the “code” part from the shortUrl
  const code = shortUrl?.split("/").pop();

  // when you collapse the panel it just hides (no route‐push here)
  const onToggle = () => {
    toggleClicks();
  };

  const resetPage = () => window.location.reload();

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <h1 className="title">Shawty Url</h1>
      <a href="https://x.com/pyschonoice" target='_blank'>
        <h4 className="subtitle">@pyschonoice</h4>
      </a>
      {!shortUrl && (
        <>
          {/* — URL + Expiry Accordion — */}
          <div className="input-group">
            <input
              className="shadcn-input"
              type="url"
              placeholder="Enter a URL to shorten"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button type="submit" className="shadcn-button">
              Shorten
            </button>
          </div>

          <div className="accordion">
            <div className="accordion-header" onClick={toggleAdv}>
              <div>Set Expiry Time</div>
              <div className="expiry-header-right">
                <div className="expiry-label">
                  Currently {formatExpiry(expiresIn)}
                </div>
                <span className={`icon ${!advOpen ? "open" : ""}`}>›</span>
              </div>
            </div>
            {advOpen && (
              <div className="accordion-panel">
                <div className="slider-group">
                  <span className="range-label">Min: 1h</span>
                  <input
                    className="slider"
                    type="range"
                    min="1"
                    max="720"
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                  />
                  <span className="range-label">Max: 30d</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {shortUrl && (
        <>
          {/* — Shortened Result + Copy — */}
          <div className="result-block">
            <div className="input-group">
              <input
                className="shadcn-input"
                type="text"
                readOnly
                value={shortUrl}
              />
              <button
                type="button"
                className="shadcn-button"
                onClick={() => {
                  if (
                    navigator.clipboard &&
                    window.isSecureContext
                  ) {
                    navigator.clipboard.writeText(shortUrl).catch(() => {
                      /* fallback */
                    });
                  } else {
                    const ta = document.createElement("textarea");
                    ta.value = shortUrl;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand("copy");
                    document.body.removeChild(ta);
                  }
                }}
              >
                Copy
              </button>
            </div>
          </div>

          {/* — Analytics Accordion — */}
          <div className="accordion">
            <div className="accordion-header" onClick={onToggle}>
              <span>Show Clicks</span>
              <span className={`icon ${clicksOpen ? "open" : ""}`}>›</span>
            </div>
            {clicksOpen && (
              <div className="accordion-panel">
                {/* render AnalyticsPage inline */}
                <AnalyticsPage inline code={code} />
              </div>
            )}
          </div>

          {/* — Reset / Shorten Another — */}
          <button
            type="button"
            className="shadcn-button another-btn"
            onClick={resetPage}
          >
            Shorten Another Url
          </button>
        </>
      )}
    </form>
  );
}
