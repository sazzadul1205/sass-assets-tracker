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

// Conditions for Upgrade (asset works but can be improved or modernized)
export const assets_condition_upgrade = [
  { label: "Outdated Specifications", value: "outdated_specifications" },
  { label: "Insufficient Performance", value: "insufficient_performance" },
  { label: "Low Capacity / Storage", value: "low_capacity" },
  { label: "Incompatible with New Systems", value: "incompatible_systems" },
  { label: "Missing Modern Features", value: "missing_features" },
  { label: "Requires Software Upgrade", value: "software_upgrade_needed" },
  { label: "Requires Hardware Upgrade", value: "hardware_upgrade_needed" },
  { label: "Energy Inefficient", value: "energy_inefficient" },
  { label: "Needs Modernization", value: "needs_modernization" },
  { label: "Upgradable for Better Performance", value: "upgradable" },
];

// Conditions for Inspection (asset is under evaluation or periodic check)
export const assets_condition_inspection = [
  // General Condition
  { label: "Physical Condition Check", value: "physical_check" },
  { label: "Visual Inspection", value: "visual_inspection" },
  { label: "Operational Test", value: "operational_test" },
  { label: "Performance Assessment", value: "performance_assessment" },
  { label: "Safety Compliance Check", value: "safety_check" },

  // Preventive / Periodic Maintenance
  { label: "Routine Inspection", value: "routine_inspection" },
  { label: "Preventive Maintenance Review", value: "preventive_maintenance" },
  { label: "Calibration Verification", value: "calibration_verification" },
  { label: "Warranty Validation", value: "warranty_validation" },
  { label: "End-of-Life Evaluation", value: "end_of_life_evaluation" },

  // Specific Findings
  { label: "Minor Wear Detected", value: "minor_wear" },
  { label: "Potential Issue Identified", value: "potential_issue" },
  { label: "Requires Further Testing", value: "requires_further_testing" },
  { label: "Compliant / In Good Condition", value: "compliant_good" },
  { label: "Non-Compliant / Needs Action", value: "non_compliant" },
];
