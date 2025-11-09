// Shared/options/assets_condition.js

// Conditions for Repair (asset can still be serviced)
export const assets_condition_repair = [
  // Operational / Excellent
  { label: "Brand New", value: "brand_new" },
  { label: "Unused (Stored)", value: "unused" },
  { label: "Excellent (Like New)", value: "excellent" },
  { label: "Good (Fully Functional)", value: "good" },
  { label: "Fair (Working with Signs of Use)", value: "fair" },

  // Functional but with issues
  { label: "Minor Damage", value: "minor_damage" },
  { label: "Needs Cleaning / Maintenance", value: "needs_cleaning" },
  { label: "Needs Servicing", value: "needs_servicing" },
  { label: "Needs Calibration", value: "needs_calibration" },
  { label: "Intermittent Issue", value: "intermittent_issue" },
  { label: "Slow Performance", value: "slow_performance" },

  // Damaged / Repairable
  { label: "Partially Functional", value: "partially_functional" },
  { label: "Needs Repair", value: "needs_repair" },
  { label: "Damaged - Cosmetic Only", value: "cosmetic_damage" },
  { label: "Damaged - Functional", value: "functional_damage" },
];

// Conditions for Replacement (asset should be replaced)
export const assets_condition_replace = [
  { label: "Defective / Faulty", value: "defective" },
  { label: "Outdated / Obsolete", value: "obsolete" },
  { label: "Decommissioned", value: "decommissioned" },
  { label: "Disposed / Recycled", value: "disposed" },
  { label: "Scrapped / Beyond Repair", value: "scrapped" },
];
