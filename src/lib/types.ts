// ─── MongoDB Document Shape ───────────────────────────────────────────────────
export interface LeadManager {
  manager_name: string;
  manager_link?: string;
}

export interface AnchorInvestor {
  anchor_investor_name: string;
  amount_in_cr: string;
  [key: string]: unknown;
}

export interface IpoDocument {
  _id: string;
  company_name: string;
  ipo_type: "mainboard" | "sme" | string;
  year: number;
  scraped_at?: string;
  lead_managers: LeadManager[];
  anchor_investors_data: AnchorInvestor[];
}

// ─── API Request / Response ───────────────────────────────────────────────────
export interface DashboardQuery {
  leadManagers?: string[];
  companies?:    string[];
  funds?:        string[];
  years?:        number[];
  ipoType?:      string[];
}
