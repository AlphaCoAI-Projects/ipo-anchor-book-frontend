"use client";

import { useState } from "react";
import { AnchorInvestor } from "@/lib/types";

const PREVIEW = 3;

function fmt(n: number) {
  // if (n >= 10000) return `₹${(n / 100).toFixed(1)}B`;
  // if (n >= 100)   return `₹${(n / 100).toFixed(2)}B`;
  return `₹${n.toFixed(0)}Cr`;
}

export function totalAmount(investors: AnchorInvestor[] = []) {
  return investors.reduce((s, a) => s + parseFloat(a.amount_in_cr || "0"), 0);
}

export default function AnchorInvestorsCell({ investors = [] }: { investors: AnchorInvestor[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!investors.length) return <span style={{ color: "var(--text-faint)" }}>—</span>;

  const sorted   = [...investors].sort((a, b) => parseFloat(b.amount_in_cr || "0") - parseFloat(a.amount_in_cr || "0"));
  const maxAmt   = parseFloat(sorted[0]?.amount_in_cr || "1");
  const overflow = investors.length - PREVIEW;
  const hasMore  = overflow > 0;
  const displayed = expanded ? sorted : sorted.slice(0, PREVIEW);
  const total    = totalAmount(investors);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {/* Summary badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
        <span style={{
          background: "var(--raised)", color: "var(--green)",
          border: "1px solid var(--border)",
          borderRadius: 3, padding: "1px 8px",
          fontSize: 10, fontFamily: "'Courier New', monospace", fontWeight: 700,
        }}>
          {investors.length} anchors
        </span>
        <span style={{ fontSize: 10, color: "var(--text)", fontFamily: "'Courier New', monospace" }}>
          {fmt(total)}
        </span>
      </div>

      {/* Investor rows */}
      {displayed.map((inv, i) => {
        const amt    = parseFloat(inv.amount_in_cr || "0");
        const barPct = Math.max(5, (amt / maxAmt) * 100);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {/* Mini bar */}
            <div style={{
              width: 48, height: 3, background: "var(--border)",
              borderRadius: 2, overflow: "hidden", flexShrink: 0,
            }}>
              <div style={{
                width: `${barPct}%`, height: "100%",
                background: "var(--green)",
                borderRadius: 2,
              }} />
            </div>
            {/* Name */}
            <span style={{
              fontSize: 11, color: "var(--text)", flex: 1,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {inv.anchor_investor_name}
            </span>
            {/* Amount */}
            <span style={{
              fontSize: 10, color: "var(--text)",
              fontFamily: "'Courier New', monospace", whiteSpace: "nowrap", flexShrink: 0,
            }}>
              ₹{amt.toFixed(0)}Cr
            </span>
          </div>
        );
      })}

      {hasMore && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded((x) => !x); }}
          style={{
            alignSelf: "flex-start", background: "none", border: "none",
            padding: 0, cursor: "pointer",
            fontSize: 10, color: expanded ? "var(--text-dim)" : "var(--text)",
            fontFamily: "'Courier New', monospace",
            textDecoration: "underline", textUnderlineOffset: 2, marginTop: 1,
          }}
        >
          {expanded ? "▲ show less" : `▼ +${overflow} more investors`}
        </button>
      )}
    </div>
  );
}
