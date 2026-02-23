"use client";

import { useDashboard } from "@/hooks/useDashboard";
import StatsPanel from "@/components/StatsPanel";
import FiltersPanel from "@/components/FiltersPanel";
import DataTable from "@/components/DataTable";

export default function DashboardPage() {
  const db = useDashboard();
  const filtersDisabled = db.optionsLoading || db.loading;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--bg)", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 1640, margin: "0 auto", padding: "0 28px", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Logo mark */}
            <div style={{
              width: 28, height: 28,
              background: "var(--green)",
              border: "1px solid var(--green)",
              borderRadius: 5,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13,
            }}>⚡</div>
            <div>
              <div style={{
                fontWeight: 700, fontSize: 14, letterSpacing: "0.01em",
                color: "var(--text-hi)", fontFamily: "'Courier New', monospace",
              }}>
                IPO ANCHOR ANALYTICS
              </div>
              <div style={{
                fontSize: 8, color: "var(--text-dim)", letterSpacing: "0.16em",
                fontFamily: "'Courier New', monospace", textTransform: "uppercase",
              }}>
                {db.loading ? "querying database…" : `${db.data.length} results`}
                {db.activeFilterCount > 0 && ` · ${db.activeFilterCount} filter${db.activeFilterCount > 1 ? "s" : ""} active`}
              </div>
            </div>
          </div>

          {/* Status dot */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: db.error ? "var(--red)" : db.loading ? "var(--amber)" : "var(--green)",
              boxShadow: `0 0 5px ${db.error ? "var(--red)" : db.loading ? "var(--amber)" : "var(--green)"}`,
            }} />
            <span style={{ fontSize: 9, color: "var(--text-faint)", fontFamily: "'Courier New', monospace", letterSpacing: "0.1em" }}>
              {db.error ? "ERROR" : db.loading ? "LOADING" : "LIVE"}
            </span>
          </div>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, maxWidth: 1640, margin: "0 auto", width: "100%", padding: "22px 28px" }}>
        <div className="dashboard-grid">
          {/* Left: Stats */}
          <aside className="stats-col">
            <StatsPanel
              data={db.data}
              loading={db.loading}
              activeFilterCount={db.activeFilterCount}
            />
          </aside>

          {/* Right: Filters + Table */}
          <main className="main-col">
            <FiltersPanel
              brlmOptions={db.brlmOptions}
              companyOptions={db.companyOptions}
              fundOptions={db.fundOptions}
              yearOptions={db.yearOptions}
              selectedBRLMs={db.selectedBRLMs}         setSelectedBRLMs={db.setSelectedBRLMs}
              selectedCompanies={db.selectedCompanies} setSelectedCompanies={db.setSelectedCompanies}
              selectedFunds={db.selectedFunds}         setSelectedFunds={db.setSelectedFunds}
              selectedYears={db.selectedYears}         setSelectedYears={db.setSelectedYears}
              selectedTypes={db.selectedTypes}         setSelectedTypes={db.setSelectedTypes}
              activeFilterCount={db.activeFilterCount}
              clearAllFilters={db.clearAllFilters}
              disabled={filtersDisabled}
            />
            <DataTable data={db.data} loading={db.loading} error={db.error} />
          </main>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid var(--border)", padding: "10px 28px",
        textAlign: "center", fontSize: 8,
        color: "var(--text-dim)", fontFamily: "'Courier New', monospace", letterSpacing: "0.1em",
      }}>
        IPO ANCHOR ANALYTICS · NEXT.JS + MONGODB · AND ACROSS CATEGORIES · OR WITHIN
      </footer>
    </div>
  );
}
