"use client";

import { useState, useMemo } from "react";
import { IpoDocument } from "@/lib/types";
import LeadManagersCell from "./LeadManagersCell";
import AnchorInvestorsCell, { totalAmount } from "./AnchorInvestorsCell";

const PAGE_SIZE = 10;

function fmt(n: number) {
  if (n >= 10000) return `₹${(n / 100).toFixed(1)}B`;
  if (n >= 100)   return `₹${(n / 100).toFixed(2)}B`;
  return `₹${n.toFixed(0)}Cr`;
}

type SortCol = "company" | "year" | "ipo_type" | "anchors" | "amount";

function ColHead({
  col, label, sortCol, sortDir, onSort, align = "left",
}: {
  col: SortCol; label: string; sortCol: SortCol; sortDir: "asc" | "desc";
  onSort: (c: SortCol) => void; align?: string;
}) {
  const active = sortCol === col;
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        padding: "10px 14px", textAlign: align as "left" | "right",
        cursor: "pointer", userSelect: "none",
        fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em",
        whiteSpace: "nowrap", fontFamily: "'Courier New', monospace",
        color: active ? "var(--yellow)" : "var(--text-dim)",
        borderBottom: "1px solid var(--border)", background: "var(--surface)",
        transition: "color 0.15s",
      }}
    >
      {label} <span style={{ opacity: 0.5 }}>{active ? (sortDir === "asc" ? "↑" : "↓") : "⇅"}</span>
    </th>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[240, 70, 60, 200, 260].map((w, i) => (
        <td key={i} style={{ padding: "14px" }}>
          <div style={{
            height: 12, width: w, maxWidth: "100%",
            background: "var(--raised)", borderRadius: 3,
            animation: "pulse 1.6s ease-in-out infinite",
          }} />
        </td>
      ))}
    </tr>
  );
}

interface Props {
  data: IpoDocument[];
  loading: boolean;
  error: string | null;
}

export default function DataTable({ data, loading, error }: Props) {
  const [sortCol, setSortCol] = useState<SortCol>("year");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage]       = useState(1);

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("desc"); }
    setPage(1);
  };

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      let va: string | number, vb: string | number;
      if      (sortCol === "company")  { va = a.company_name; vb = b.company_name; }
      else if (sortCol === "ipo_type") { va = a.ipo_type; vb = b.ipo_type; }
      else if (sortCol === "year")     { va = a.year; vb = b.year; }
      else if (sortCol === "anchors")  { va = a.anchor_investors_data?.length || 0; vb = b.anchor_investors_data?.length || 0; }
      else                             { va = totalAmount(a.anchor_investors_data); vb = totalAmount(b.anchor_investors_data); }
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return sortDir === "asc" ? va - (vb as number) : (vb as number) - va;
    });
  }, [data, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageData   = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sp = { sortCol, sortDir, onSort: handleSort };

  const exportCSV = () => {
    const rows = [["Company","Type","Year","Lead Managers","Anchor Investors","Amounts (Cr)","Total (Cr)"]];
    sorted.forEach((d) => rows.push([
      `"${d.company_name}"`, d.ipo_type, String(d.year),
      `"${d.lead_managers?.map((m) => m.manager_name).join("; ")}"`,
      `"${d.anchor_investors_data?.map((a) => a.anchor_investor_name).join("; ")}"`,
      `"${d.anchor_investors_data?.map((a) => a.amount_in_cr).join("; ")}"`,
      totalAmount(d.anchor_investors_data).toFixed(2),
    ]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ipo_anchors.csv";
    a.click();
  };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{
        padding: "10px 14px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--bg)",
      }}>
        <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Courier New', monospace" }}>
          {loading ? "querying…" : error ? "error" : `${sorted.length} records`}
        </span>
        <button
          onClick={exportCSV}
          disabled={!sorted.length || loading}
          style={{
            background: "transparent",
            border: `1px solid ${sorted.length && !loading ? "var(--border-hi)" : "var(--border)"}`,
            borderRadius: 4, padding: "4px 12px",
            color: sorted.length && !loading ? "var(--text)" : "var(--text-dim)",
            fontSize: 10, cursor: sorted.length && !loading ? "pointer" : "not-allowed",
            fontFamily: "'Courier New', monospace", transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => { if (sorted.length) { (e.currentTarget as HTMLElement).style.borderColor = "var(--yellow)40"; (e.currentTarget as HTMLElement).style.color = "var(--yellow)"; } }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hi)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
        >
          ↓ export csv
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <ColHead col="company"  label="Company"          {...sp} />
              <ColHead col="ipo_type" label="Type"             {...sp} />
              <ColHead col="year"     label="Year"             {...sp} />
              <th style={{ padding: "10px 14px", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-dim)", fontFamily: "'Courier New', monospace", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                Lead Managers
              </th>
              <ColHead col="anchors"  label="Anchor Investors" {...sp} />
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading && error && (
              <tr>
                <td colSpan={5} style={{ padding: "56px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>⚠</div>
                  <div style={{ fontSize: 13, color: "var(--red)", marginBottom: 4 }}>{error}</div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Check MONGODB_URI in .env.local</div>
                </td>
              </tr>
            )}

            {!loading && !error && pageData.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "56px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 8, color: "var(--text-faint)" }}>◎</div>
                  <div style={{ fontSize: 13, color: "var(--text-dim)" }}>No IPOs match the selected filters</div>
                </td>
              </tr>
            )}

            {!loading && !error && pageData.map((d, i) => {
              const rowBg = i % 2 === 0 ? "var(--surface)" : "var(--raised)";
              return (
                <tr
                  key={d._id || i}
                  style={{ background: rowBg, transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--border-hi)"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = rowBg}
                >
                  <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 600, color: "var(--text-hi)", verticalAlign: "top", minWidth: 200 }}>
                    {d.company_name}
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top" }}>
                    <span style={{
                      background:  d.ipo_type === "mainboard" ? "var(--raised)" : "var(--surface)",
                      color:       d.ipo_type === "mainboard" ? "var(--green)" : "var(--amber)",
                      border:      `1px solid ${d.ipo_type === "mainboard" ? "var(--border)" : "var(--border)"}`,
                      borderRadius: 3, padding: "2px 7px",
                      fontSize: 9, fontFamily: "'Courier New', monospace",
                      textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap",
                    }}>
                      {d.ipo_type}
                    </span>
                  </td>
                  <td style={{ padding: "13px 14px", fontSize: 12, color: "var(--text)", fontFamily: "'Courier New', monospace", verticalAlign: "top", whiteSpace: "nowrap" }}>
                    {d.year}
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top", minWidth: 220, maxWidth: 300 }}>
                    <LeadManagersCell managers={d.lead_managers || []} />
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top", minWidth: 280, maxWidth: 380 }}>
                    <AnchorInvestorsCell investors={d.anchor_investors_data || []} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div style={{
          borderTop: "1px solid var(--border)", padding: "10px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "var(--bg)",
        }}>
          <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Courier New', monospace" }}>
            {page}/{totalPages} · {sorted.length} records
          </span>
          <div style={{ display: "flex", gap: 3 }}>
            {[
              { label: "«", onClick: () => setPage(1), disabled: page === 1 },
              { label: "‹", onClick: () => setPage((p) => p - 1), disabled: page === 1 },
              ...getPagRange(page, totalPages).map((p) =>
                p === "…" ? { label: "…", onClick: () => {}, disabled: true, ellipsis: true }
                           : { label: String(p), onClick: () => setPage(p as number), disabled: false, active: p === page }
              ),
              { label: "›", onClick: () => setPage((p) => p + 1), disabled: page === totalPages },
              { label: "»", onClick: () => setPage(totalPages), disabled: page === totalPages },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                disabled={btn.disabled}
                style={{
                  background: (btn as {active?: boolean}).active ? "var(--yellow)" : "transparent",
                  border: `1px solid ${(btn as {active?: boolean}).active ? "var(--yellow)" : (btn as {ellipsis?: boolean}).ellipsis ? "transparent" : "var(--text-dim)"}`,
                  borderRadius: 3, padding: "4px 8px",
                  color: (btn as {active?: boolean}).active ? "var(--bg)" : btn.disabled ? "var(--text-dim)" : "var(--text)",
                  cursor: btn.disabled ? "default" : "pointer",
                  fontSize: 10, fontFamily: "'Courier New', monospace",
                  fontWeight: (btn as {active?: boolean}).active ? 700 : 400,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}

function getPagRange(cur: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 4)   return [1, 2, 3, 4, 5, "…", total];
  if (cur >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", cur - 1, cur, cur + 1, "…", total];
}
