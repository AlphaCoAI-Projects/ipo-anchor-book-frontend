"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { IpoDocument } from "@/lib/types";

// ─── Master Dashboard Hook ────────────────────────────────────────────────────
export function useDashboard() {
  // ── Filter option lists ────────────────────────────────────────────────────
  const [brlmOptions,    setBrlmOptions]    = useState<string[]>([]);
  const [companyOptions, setCompanyOptions] = useState<string[]>([]);
  const [fundOptions,    setFundOptions]    = useState<string[]>([]);
  const [yearOptions,    setYearOptions]    = useState<string[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  // ── Selected filter values ─────────────────────────────────────────────────
  const [selectedBRLMs,     setSelectedBRLMs]     = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedFunds,     setSelectedFunds]     = useState<string[]>([]);
  const [selectedYears,     setSelectedYears]     = useState<string[]>([]);
  const [selectedTypes,     setSelectedTypes]     = useState<string[]>([]);

  // ── Query results ──────────────────────────────────────────────────────────
  const [data,    setData]    = useState<IpoDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // ── Debounce timer ─────────────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load all filter options on mount ──────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setOptionsLoading(true);
      try {
        const [brlms, companies, funds, years] = await Promise.all([
          fetch("/api/filters/lead-managers").then((r) => r.json()),
          fetch("/api/filters/companies").then((r) => r.json()),
          fetch("/api/filters/funds").then((r) => r.json()),
          fetch("/api/filters/years").then((r) => r.json()),
        ]);
        setBrlmOptions(brlms);
        setCompanyOptions(companies);
        setFundOptions(funds);
        setYearOptions(years.map(String));
      } catch {
        setError("Failed to load filter options.");
      } finally {
        setOptionsLoading(false);
      }
    };
    load();
  }, []);

  // ── Fire query whenever filters change (300ms debounce) ───────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadManagers: selectedBRLMs,
            companies:    selectedCompanies,
            funds:        selectedFunds,
            years:        selectedYears.map(Number),
            ipoType:      selectedTypes,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setData(await res.json());
      } catch {
        setError("Unable to load data from server.");
        setData([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [selectedBRLMs, selectedCompanies, selectedFunds, selectedYears, selectedTypes]);

  const clearAllFilters = useCallback(() => {
    setSelectedBRLMs([]);
    setSelectedCompanies([]);
    setSelectedFunds([]);
    setSelectedYears([]);
    setSelectedTypes([]);
  }, []);

  const activeFilterCount =
    selectedBRLMs.length + selectedCompanies.length +
    selectedFunds.length + selectedYears.length + selectedTypes.length;

  return {
    brlmOptions, companyOptions, fundOptions, yearOptions, optionsLoading,
    selectedBRLMs,     setSelectedBRLMs,
    selectedCompanies, setSelectedCompanies,
    selectedFunds,     setSelectedFunds,
    selectedYears,     setSelectedYears,
    selectedTypes,     setSelectedTypes,
    data, loading, error,
    clearAllFilters, activeFilterCount,
  };
}
