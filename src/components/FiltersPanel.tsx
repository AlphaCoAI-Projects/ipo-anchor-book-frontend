"use client";

import Slicer from "./Slicer";

interface Props {
  brlmOptions: string[]; companyOptions: string[]; fundOptions: string[]; yearOptions: string[];
  selectedBRLMs: string[];     setSelectedBRLMs: (v: string[]) => void;
  selectedCompanies: string[]; setSelectedCompanies: (v: string[]) => void;
  selectedFunds: string[];     setSelectedFunds: (v: string[]) => void;
  selectedYears: string[];     setSelectedYears: (v: string[]) => void;
  selectedTypes: string[];     setSelectedTypes: (v: string[]) => void;
  activeFilterCount: number;   clearAllFilters: () => void;
  disabled: boolean;
}

export default function FiltersPanel({
  brlmOptions, companyOptions, fundOptions, yearOptions,
  selectedBRLMs, setSelectedBRLMs, selectedCompanies, setSelectedCompanies,
  selectedFunds, setSelectedFunds, selectedYears, setSelectedYears,
  selectedTypes, setSelectedTypes, activeFilterCount, clearAllFilters, disabled,
}: Props) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "16px 18px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 9, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "'Courier New', monospace" }}>
            ◈ slicers
          </span>
          <span style={{
            background: "var(--raised)", border: "1px solid var(--border)",
            borderRadius: 3, padding: "1px 8px",
            fontSize: 9, color: "var(--text-faint)", fontFamily: "'Courier New', monospace",
          }}>
            AND across · OR within
          </span>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            style={{
              background: "var(--surface)", border: "1px solid var(--border-hi)",
              borderRadius: 4, padding: "3px 10px",
              color: "var(--red)", fontSize: 9, cursor: "pointer",
              fontFamily: "'Courier New', monospace",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--red)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--red)"; }}
          >
            ✕ clear all ({activeFilterCount})
          </button>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Slicer label="Lead Manager / BRLM"  options={brlmOptions}    selected={selectedBRLMs}     onChange={setSelectedBRLMs}     color="var(--yellow)" disabled={disabled} />
        <Slicer label="Company"              options={companyOptions} selected={selectedCompanies} onChange={setSelectedCompanies} color="var(--green)" disabled={disabled} />
        <Slicer label="Fund / Anchor"        options={fundOptions}    selected={selectedFunds}     onChange={setSelectedFunds}     color="var(--teal)" disabled={disabled} />
        <Slicer label="Year"                 options={yearOptions}    selected={selectedYears}     onChange={setSelectedYears}     color="var(--amber)" disabled={disabled} />
        <Slicer label="IPO Type"             options={["mainboard","sme"]} selected={selectedTypes} onChange={setSelectedTypes}   color="var(--purple)" disabled={disabled} />
      </div>
    </div>
  );
}
