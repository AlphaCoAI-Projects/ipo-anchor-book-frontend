"use client";

import { IpoDocument } from "@/lib/types";
import { totalAmount } from "./AnchorInvestorsCell";

function fmt(n: number) {
  // if (n >= 10000) return `₹${(n / 100).toFixed(1)}B`;
  // if (n >= 100)   return `₹${(n / 100).toFixed(2)}B`;
  return `₹${n.toFixed(0)}Cr`;
}

function Card({ label, value, sub, color, loading }: {
  label: string; value: string | number; sub?: string; color?: string; loading?: boolean;
}) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 6, padding: "16px 18px",
    }}>
      <div style={{
        fontSize: 8, textTransform: "uppercase", letterSpacing: "0.14em",
        color: "var(--text-faint)", fontFamily: "'Courier New', monospace", marginBottom: 8,
      }}>{label}</div>
      {loading ? (
        <div style={{ height: 24, width: "55%", background: "var(--raised)", borderRadius: 3, animation: "pulse 1.6s infinite" }} />
      ) : (
        <div style={{
          fontSize: 22, fontWeight: 700, color: color || "var(--text)",
          fontFamily: "'Courier New', monospace", lineHeight: 1,
        }}>{value}</div>
      )}
      {sub && <div style={{ fontSize: 9, color: "var(--text-faint)", marginTop: 5, fontFamily: "'Courier New', monospace" }}>{sub}</div>}
    </div>
  );
}

export default function StatsPanel({
  data, loading, activeFilterCount,
}: {
  data: IpoDocument[]; loading: boolean; activeFilterCount: number;
}) {
  const totalAmt  = data.reduce((s, d) => s + totalAmount(d.anchor_investors_data), 0);
  const avgAmt    = data.length ? totalAmt / data.length : 0;
  const totAnchors = data.reduce((s, d) => s + (d.anchor_investors_data?.length || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Card label="IPOs Matched"   value={loading ? "—" : data.length}              color="var(--yellow)" loading={loading} sub="results" />
      <Card label="Total Anchor"   value={loading ? "—" : fmt(totalAmt)}            color="var(--green)" loading={loading} sub="combined" />
      <Card label="Avg per IPO"    value={loading ? "—" : (data.length ? fmt(avgAmt) : "—")}        loading={loading} sub="allocation" />
      <Card label="Total Anchors"  value={loading ? "—" : totAnchors}              color="var(--teal)" loading={loading} sub="investor slots" />
      <Card
        label="Active Filters"
        value={activeFilterCount}
        color={activeFilterCount ? "var(--amber)" : undefined}
        sub={activeFilterCount ? "filters on" : "showing all"}
      />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}
