"use client";

import { useState, useRef, useEffect, useMemo } from "react";

const PREVIEW_LIMIT = 40;

interface SlicerProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  color?: string;
  disabled?: boolean;
}

export default function Slicer({
  label, options, selected, onChange,
  color = "var(--yellow)", disabled = false,
}: SlicerProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen]     = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Debounced search
  const [dSearch, setDSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDSearch(search), 150);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const visible = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(dSearch.toLowerCase())).slice(0, PREVIEW_LIMIT),
    [options, dSearch]
  );

  const toggle = (val: string) =>
    onChange(selected.includes(val) ? selected.filter((s) => s !== val) : [...selected, val]);

  const clear = (e: React.MouseEvent) => { e.stopPropagation(); onChange([]); setSearch(""); };

  return (
    <div ref={ref} style={{ position: "relative", flex: "1 1 190px", minWidth: 170 }}>
      {/* Trigger */}
      <div
        onClick={() => !disabled && setOpen((o) => !o)}
        style={{
          background: "var(--surface)",
          border: `1px solid ${open ? color : "var(--border-hi)"}`,
          borderRadius: 6,
          padding: "8px 11px",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          minHeight: 52,
          opacity: disabled ? 0.45 : 1,
          transition: "border-color 0.15s",
        }}
      >
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{
            fontSize: 9, color: "var(--text)", textTransform: "uppercase",
            letterSpacing: "0.12em", marginBottom: 4, fontFamily: "'Courier New', monospace",
          }}>
            {label}
          </div>
          {selected.length === 0 ? (
            <div style={{ color: "var(--text-faint)", fontSize: 12 }}>All</div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {selected.slice(0, 2).map((s) => (
                <span key={s} style={{
                  background: `${color}15`, color, border: `1px solid ${color}35`,
                  borderRadius: 3, padding: "1px 6px", fontSize: 10,
                  fontFamily: "'Courier New', monospace",
                }}>
                  {s.length > 14 ? s.slice(0, 14) + "…" : s}
                </span>
              ))}
              {selected.length > 2 && (
                <span style={{ color: "var(--text)", fontSize: 10, alignSelf: "center" }}>
                  +{selected.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        <span style={{
          color: "var(--text-faint)", marginLeft: 6, fontSize: 11,
          transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s",
        }}>▾</span>
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <div style={{
          position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0, zIndex: 300,
          background: "var(--surface)", border: `1px solid ${color}30`,
          borderRadius: 6, boxShadow: `0 16px 48px rgba(0,0,0,0.8), 0 0 0 1px ${color}10`,
          overflow: "hidden",
        }}>
          <div style={{ padding: "7px 7px 3px" }}>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search…`}
              style={{
                width: "100%", background: "var(--raised)", border: "1px solid var(--border)",
                borderRadius: 4, padding: "5px 9px", color: "var(--text-hi)", fontSize: 12,
                outline: "none", fontFamily: "'Courier New', monospace", boxSizing: "border-box",
              }}
            />
          </div>
          {selected.length > 0 && (
            <div style={{ padding: "2px 9px 3px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Courier New', monospace" }}>
                {selected.length} selected
              </span>
              <button onClick={clear} style={{
                background: "none", border: "none", color: "var(--red)", fontSize: 10,
                cursor: "pointer", fontFamily: "'Courier New', monospace",
              }}>✕ clear</button>
            </div>
          )}
          <div style={{ maxHeight: 210, overflowY: "auto" }}>
            {visible.length === 0 ? (
              <div style={{ padding: "18px", textAlign: "center", color: "var(--text-faint)", fontSize: 12 }}>
                No results
              </div>
            ) : visible.map((opt) => {
              const isSel = selected.includes(opt);
              return (
                <div
                  key={opt}
                  onClick={() => toggle(opt)}
                  style={{
                    padding: "7px 11px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                    background: isSel ? `${color}0e` : "transparent",
                    borderLeft: `2px solid ${isSel ? color : "transparent"}`,
                    fontSize: 12, color: isSel ? color : "var(--text)",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => { if (!isSel) (e.currentTarget as HTMLElement).style.background = "var(--raised)"; }}
                  onMouseLeave={(e) => { if (!isSel) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{
                    width: 13, height: 13, borderRadius: 2, flexShrink: 0,
                    border: `1.5px solid ${isSel ? color : "var(--border-hi)"}`,
                    background: isSel ? color : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {isSel && <span style={{ color: "var(--surface)", fontSize: 9, fontWeight: 900 }}>✓</span>}
                  </div>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
