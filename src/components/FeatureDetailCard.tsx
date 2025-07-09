// components/FeatureDetailCard.tsx

import React from "react";

type FeatureDetailCardProps = {
  properties: Record<string, any> | null;
};

const toTitleCase = (str: string) =>
  str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function FeatureDetailCard({
  properties,
}: FeatureDetailCardProps) {
  if (!properties) return null;

  const handleCopy = () => {
    const text = Object.entries(properties)
      .filter(([_, v]) => v !== null && v !== "")
      .map(([k, v]) => `${toTitleCase(k)}: ${v}`)
      .join("\n");

    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div className="feature-card">
      <h3>Selected Feature</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {Object.entries(properties)
          .filter(([_, v]) => v !== null && v !== "")
          .map(([k, v]) => (
            <p key={k} style={{ marginBottom: "0.25rem" }}>
              <strong>{toTitleCase(k)}:</strong> {String(v)}
            </p>
          ))}
      </div>
      <button
        onClick={handleCopy}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          background: "var(--primary-color)",
          color: "#fff",
          border: "none",
          borderRadius: "0.25rem",
          cursor: "pointer",
          fontSize: "0.875rem",
          alignSelf: "start",
        }}
      >
        Copy to Clipboard
      </button>
    </div>
  );
}
