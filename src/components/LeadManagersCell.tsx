"use client";

import { useState } from "react";
import { LeadManager } from "@/lib/types";

const PREVIEW = 2;

export default function LeadManagersCell({ managers = [] }: { managers: LeadManager[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!managers.length) return <span style={{ color: "var(--text-faint)" }}>—</span>;

  const overflow  = managers.length - PREVIEW;
  const hasMore   = overflow > 0;
  const displayed = expanded ? managers : managers.slice(0, PREVIEW);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {displayed.map((m, i) => (
          <span key={i} style={{
            background: "var(--raised)",
            border: "1px solid var(--border)",
            borderRadius: 3,
            padding: "2px 8px",
            fontSize: 11,
            color: "var(--text)",
            fontFamily: "'Courier New', monospace",
            whiteSpace: "nowrap",
          }}>
            {m.manager_name}
          </span>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded((x) => !x); }}
          style={{
            alignSelf: "flex-start", background: "none", border: "none",
            padding: 0, cursor: "pointer",
            fontSize: 10, color: expanded ? "var(--text-dim)" : "var(--green)",
            fontFamily: "'Courier New', monospace",
            textDecoration: "underline", textUnderlineOffset: 2,
          }}
        >
          {expanded ? "▲ less" : `▼ +${overflow} more`}
        </button>
      )}
    </div>
  );
}
