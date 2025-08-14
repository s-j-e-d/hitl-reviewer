// src/data/ua.demo.sections.ts (improved)
// -----------------------------------------------------------------------------
// Goals of this rev:
// 1) Keep your runtime self-tests happy (e.g., WASH narrative references
//    'w_source_main'; Overview has no recs).
// 2) Make the demo feel real: coherent %s across cards/charts/text, consistent
//    site coverage, concise labels, and fields that match the narrative.
// 3) Add two extra sections (Food Security, Shelter/NFI) to make the sidebar
//    richer while keeping everything lightweight.
// -----------------------------------------------------------------------------

// Shared types
export interface ContextRow {
  survey: string;
  site?: string;
  code: string;
  label: string;
  value: string | number;
}

export interface RatingsDims {
  helpfulness: number; // 0..5
  honesty: number;     // 0..5
  harmlessness: number;// 0..5
}

export interface Section {
  id: string;
  title: string;
  cluster: string;
  aiText: string;
  humanText: string;
  rating: number;       // overall (avg of dims)
  ratings: RatingsDims; // per-dimension
  accepted: boolean;
  hasRecs: boolean;
  aiRecs: string[];
  humanRecs: string[];
  acceptRecs: boolean;
  narrativeFields: string[];
  recFields: string[];
  chart: "none" | "bar" | "pie";
  chartData: any[];
  contextRows: ContextRow[];

  // NEW (for chart titles/axis labels)
  chartTitle?: string;
  xLabel?: string;
  yLabel?: string;
}

// Demo data
export const initialSections: Section[] = [
  // ---------------------------------------------------------------------------
  // 1) OVERVIEW — no recs (self-test expects that), tidy context rows
  // ---------------------------------------------------------------------------
  {
    id: "overview",
    title: "Context Overview",
    cluster: "Multi-sector",
    aiText:
      "Between 10–22 May 2025, teams completed 786 household interviews across Rivne-1, Kovel-2 and Lutsk-3 hromadas (MSNA-2025). Rising prices and disrupted services continue to shape needs, with host communities absorbing a fluid displaced population. While access remains comparatively better in Lutsk-3, respondents in Kovel-2 cite longer travel times to key services and in Rivne-1 highlight budget pressure from higher utility and food costs. Across sites, priority concerns converge on reliable access to safe water, basic health care, and purchasing power for essential goods.",
    humanText: "",
    rating: 0,
    ratings: { helpfulness: 0, honesty: 0, harmlessness: 0 },
    accepted: false,
    hasRecs: false, // keep false so no rec row is produced
    aiRecs: [],
    humanRecs: [],
    acceptRecs: false,
    narrativeFields: ["loc_hromada", "sample_n", "dates"],
    recFields: [],
    chart: "none",
    chartData: [],
    contextRows: [
      { survey: "MSNA-2025", site: "Rivne", code: "loc_hromada", label: "Hromada", value: "Rivne-1" },
      { survey: "MSNA-2025", site: "Rivne", code: "sample_n", label: "Households Surveyed", value: 312 },
      { survey: "MSNA-2025", site: "Rivne", code: "dates", label: "Data Collection Window", value: "2025-05-12 → 2025-05-20" },

      { survey: "MSNA-2025", site: "Kovel", code: "loc_hromada", label: "Hromada", value: "Kovel-2" },
      { survey: "MSNA-2025", site: "Kovel", code: "sample_n", label: "Households Surveyed", value: 198 },
      { survey: "MSNA-2025", site: "Kovel", code: "dates", label: "Data Collection Window", value: "2025-05-15 → 2025-05-22" },

      { survey: "MSNA-2025", site: "Lutsk", code: "loc_hromada", label: "Hromada", value: "Lutsk-3" },
      { survey: "MSNA-2025", site: "Lutsk", code: "sample_n", label: "Households Surveyed", value: 276 },
      { survey: "MSNA-2025", site: "Lutsk", code: "dates", label: "Data Collection Window", value: "2025-05-10 → 2025-05-18" },
    ],
  },

  // ---------------------------------------------------------------------------
  // 2) WASH — bar chart with tidy categories; keep w_source_main for self-tests
  // ---------------------------------------------------------------------------
  {
    id: "wash",
    title: "WASH Findings",
    cluster: "WASH",
    aiText:
      "Across the three hromadas, 62% of households report using improved sources while 38% rely on unimproved or trucked options with inconsistent treatment. Source patterns vary by site: in Rivne piped (41%) and boreholes (21%) dominate; Kovel shows a smaller piped share (36%) and a higher reliance on boreholes (24%); Lutsk has the highest piped coverage (48%) but still reports borehole use (19%). Chlorination is not universal—reported at 27% in Rivne, 33% in Kovel, and 22% in Lutsk—indicating gaps in residual monitoring. Distance to water points is a practical barrier, especially in Kovel (1.8 km on average) compared to Rivne (1.3 km) and Lutsk (1.1 km). Households in Kovel therefore face the highest collection burden, while Rivne and Lutsk point to affordability and quality concerns. Priority is to standardize chlorination at communal points, supply spare parts for borehole pumps in rural pockets, and target hygiene kits to newly displaced households.",
    humanText: "",
    rating: 0,
    ratings: { helpfulness: 0, honesty: 0, harmlessness: 0 },
    accepted: false,
    hasRecs: true,
    aiRecs: [
      "Support chlorination at communal water points and monitor residuals weekly.",
      "Provide spare parts for borehole pumps in rural sites.",
      "Targeted hygiene kits for newly displaced HHs.",
    ],
    humanRecs: [],
    acceptRecs: false,
    narrativeFields: ["w_source_main", "w_treat", "dist_to_point_km"], // keep 'w_source_main'
    recFields: ["w_source_main", "w_treat", "dist_to_point_km"],
    chart: "bar",
    chartTitle: "Household Main Water Source",
    xLabel: "Source type",
    yLabel: "% of households",
    chartData: [
      { category: "Improved", value: 62 },
      { category: "Unimproved", value: 22 },
      { category: "Trucked", value: 16 },
    ],
    contextRows: [
      { survey: "MSNA-2025", site: "Rivne", code: "w_source_main", label: "Main Water Source", value: "piped 41% | borehole 21%" },
      { survey: "MSNA-2025", site: "Rivne", code: "w_treat", label: "Water Treatment", value: "boil 18% | chlorine 27%" },
      { survey: "MSNA-2025", site: "Rivne", code: "dist_to_point_km", label: "Avg Distance to Point (km)", value: 1.3 },

      { survey: "MSNA-2025", site: "Kovel", code: "w_source_main", label: "Main Water Source", value: "piped 36% | borehole 24%" },
      { survey: "MSNA-2025", site: "Kovel", code: "w_treat", label: "Water Treatment", value: "boil 12% | chlorine 33%" },
      { survey: "MSNA-2025", site: "Kovel", code: "dist_to_point_km", label: "Avg Distance to Point (km)", value: 1.8 },

      { survey: "MSNA-2025", site: "Lutsk", code: "w_source_main", label: "Main Water Source", value: "piped 48% | borehole 19%" },
      { survey: "MSNA-2025", site: "Lutsk", code: "w_treat", label: "Water Treatment", value: "boil 16% | chlorine 22%" },
      { survey: "MSNA-2025", site: "Lutsk", code: "dist_to_point_km", label: "Avg Distance to Point (km)", value: 1.1 },
    ],
  },

  // ---------------------------------------------------------------------------
  // 3) HEALTH — pie chart with 100% split, concise labels
  // ---------------------------------------------------------------------------
  {
    id: "health",
    title: "Health Findings",
    cluster: "Health",
    aiText:
      "Facility functionality is generally strong, with 70% reported fully functional and 20% operating with limitations; 10% are closed. Medicine availability is uneven: recent stockouts affected roughly a third of facilities in Rivne (34%) and about a third in Lutsk (31%), with somewhat lower levels in Kovel (28%). Geographic access remains a constraint for more remote settlements—average distance to the nearest facility peaks in Kovel (11.2 km) versus Rivne (8.6 km) and Lutsk (6.9 km). Households in Kovel are most likely to defer care due to travel and cost, while Rivne and Lutsk cite user fees and intermittent medicine availability. Priority actions are to preposition chronic medications (e.g., hypertension, diabetes) to peripheral points, deploy mobile clinics to settlements >10 km from facilities—especially in Kovel hromada—and consider temporary fee waivers for vulnerable groups across sites.",
    humanText: "",
    rating: 0,
    ratings: { helpfulness: 0, honesty: 0, harmlessness: 0 },
    accepted: false,
    hasRecs: true,
    aiRecs: [
      "Preposition chronic meds (HTN, DM) to peripheral facilities.",
      "Deploy mobile clinics to settlements >10 km from nearest facility.",
      "Waive user fees temporarily for vulnerable groups.",
    ],
    humanRecs: [],
    acceptRecs: false,
    narrativeFields: ["func_level", "stockouts_30d", "dist_fac_km"],
    recFields: ["func_level", "stockouts_30d", "dist_fac_km"],
    chart: "pie",
    chartTitle: "Facility Functionality Status",
    chartData: [
      { name: "Functional", value: 70 },
      { name: "Limited", value: 20 },
      { name: "Closed", value: 10 },
    ],
    contextRows: [
      { survey: "MSNA-2025", site: "Rivne", code: "func_level", label: "Facility Functionality", value: "functional 70% | limited 20% | closed 10%" },
      { survey: "MSNA-2025", site: "Rivne", code: "stockouts_30d", label: "Stockouts (30 days)", value: "34% facilities" },
      { survey: "MSNA-2025", site: "Rivne", code: "dist_fac_km", label: "Avg Distance to Facility (km)", value: 8.6 },

      { survey: "MSNA-2025", site: "Kovel", code: "func_level", label: "Facility Functionality", value: "functional 66% | limited 24% | closed 10%" },
      { survey: "MSNA-2025", site: "Kovel", code: "stockouts_30d", label: "Stockouts (30 days)", value: "28% facilities" },
      { survey: "MSNA-2025", site: "Kovel", code: "dist_fac_km", label: "Avg Distance to Facility (km)", value: 11.2 },

      { survey: "MSNA-2025", site: "Lutsk", code: "func_level", label: "Facility Functionality", value: "functional 73% | limited 18% | closed 9%" },
      { survey: "MSNA-2025", site: "Lutsk", code: "stockouts_30d", label: "Stockouts (30 days)", value: "31% facilities" },
      { survey: "MSNA-2025", site: "Lutsk", code: "dist_fac_km", label: "Avg Distance to Facility (km)", value: 6.9 },
    ],
  },

  // ---------------------------------------------------------------------------
  // 4) PROTECTION — no chart; keep concise labels and clear hotspots
  // ---------------------------------------------------------------------------
  {
    id: "protection",
    title: "Protection Findings",
    cluster: "Protection",
    aiText:
      "Perceived safety is consistently higher during daytime than after dark, with notable night-time concerns around water points and markets. Reported day/night safety is 78%/44% in Rivne, 81%/47% in Kovel, and 76%/51% in Lutsk—indicating the sharpest drop after dark in Rivne. Documentation loss among displaced households remains a barrier to services (≈21% in Rivne, 18% in Kovel, 22% in Lutsk). Households frequently identify markets and water points as hotspots for harassment or theft. Priorities include installing solar lighting near key water points and market approaches (especially in Rivne and Lutsk), operating civil documentation help desks with legal aid partners (targeting areas with higher reported loss), and running group-based PSS for caregivers and adolescents to normalize help-seeking and strengthen coping.",
    humanText: "",
    rating: 0,
    ratings: { helpfulness: 0, honesty: 0, harmlessness: 0 },
    accepted: false,
    hasRecs: true,
    aiRecs: [
      "Install solar lighting at water points and market approaches.",
      "Run civil documentation help desks with legal aid partners.",
      "Facilitate PSS group sessions for caregivers and adolescents.",
    ],
    humanRecs: [],
    acceptRecs: false,
    narrativeFields: ["safety_day_night", "lost_docs", "hotspots"],
    recFields: ["safety_day_night", "lost_docs", "hotspots"],
    chart: "none",
    chartData: [],
    contextRows: [
      { survey: "MSNA-2025", site: "Rivne", code: "safety_day_night", label: "Perceived Safety (day/night)", value: "78% / 44%" },
      { survey: "MSNA-2025", site: "Rivne", code: "lost_docs", label: "Missing Documentation", value: "21% of HH" },
      { survey: "MSNA-2025", site: "Rivne", code: "hotspots", label: "Hotspots", value: "markets, water points" },

      { survey: "MSNA-2025", site: "Kovel", code: "safety_day_night", label: "Perceived Safety (day/night)", value: "81% / 47%" },
      { survey: "MSNA-2025", site: "Kovel", code: "lost_docs", label: "Missing Documentation", value: "18% of HH" },
      { survey: "MSNA-2025", site: "Kovel", code: "hotspots", label: "Hotspots", value: "markets, water points" },

      { survey: "MSNA-2025", site: "Lutsk", code: "safety_day_night", label: "Perceived Safety (day/night)", value: "76% / 51%" },
      { survey: "MSNA-2025", site: "Lutsk", code: "lost_docs", label: "Missing Documentation", value: "22% of HH" },
      { survey: "MSNA-2025", site: "Lutsk", code: "hotspots", label: "Hotspots", value: "markets, water points" },
    ],
  },

  // ---------------------------------------------------------------------------
  // 5) FOOD SECURITY — new; bar chart; markets function but prices high
  // ---------------------------------------------------------------------------
  {
    id: "food",
    title: "Food Security Findings",
    cluster: "Food Security",
    aiText:
      "Food access is strained by prices and reduced income: 42% of households fall into poor/borderline Food Consumption Score (FCS) and most report recent stress coping (rCSI ≥4). Markets are operating—typically 5–6 days/week—but purchasing power is weak. Site patterns are consistent: in Rivne, acceptable/borderline/poor FCS stands at 57/29/14 with 72% reporting food price increases; Kovel shows 59/26/15 with 69% reporting increases; Lutsk 58/29/13 with 70% increases. rCSI ≥4 is common across sites (55–60%), suggesting reliance on less preferred food, borrowing, or meal size reduction. Priorities are to scale multipurpose cash for households with borderline/poor FCS and high rCSI, introduce value-capped e-vouchers where markets function (e.g., Rivne and Lutsk six days/week), and link highly vulnerable households to livelihoods or social protection referrals.",
    humanText: "",
    rating: 0,
    ratings: { helpfulness: 0, honesty: 0, harmlessness: 0 },
    accepted: false,
    hasRecs: true,
    aiRecs: [
      "Scale MPC to households with borderline/poor FCS and high rCSI.",
      "Introduce value-capped e-vouchers in sites with functioning markets.",
      "Coordinate with livelihoods actors on income-restoration activities.",
    ],
    humanRecs: [],
    acceptRecs: false,
    narrativeFields: ["fcs_cat", "rcsi_high", "mkt_function", "price_increase"],
    recFields: ["fcs_cat", "rcsi_high", "mkt_function", "price_increase"],
    chart: "bar",
    chartTitle: "Household Food Consumption Score (FCS)",
    xLabel: "FCS category",
    yLabel: "% of households",
    chartData: [
      { category: "Acceptable", value: 58 },
      { category: "Borderline", value: 28 },
      { category: "Poor", value: 14 },
    ],
    contextRows: [
      { survey: "MSNA-2025", site: "Rivne", code: "fcs_cat", label: "FCS Category", value: "acceptable 57% | borderline 29% | poor 14%" },
      { survey: "MSNA-2025", site: "Rivne", code: "rcsi_high", label: "rCSI ≥4 (7 days)", value: "58% of HH" },
      { survey: "MSNA-2025", site: "Rivne", code: "mkt_function", label: "Market Functionality", value: "open 6 days/week" },
      { survey: "MSNA-2025", site: "Rivne", code: "price_increase", label: "Food Price Increase Reported", value: "72% of HH" },

      { survey: "MSNA-2025", site: "Kovel", code: "fcs_cat", label: "FCS Category", value: "acceptable 59% | borderline 26% | poor 15%" },
      { survey: "MSNA-2025", site: "Kovel", code: "rcsi_high", label: "rCSI ≥4 (7 days)", value: "55% of HH" },
      { survey: "MSNA-2025", site: "Kovel", code: "mkt_function", label: "Market Functionality", value: "open 5 days/week" },
      { survey: "MSNA-2025", site: "Kovel", code: "price_increase", label: "Food Price Increase Reported", value: "69% of HH" },

      { survey: "MSNA-2025", site: "Lutsk", code: "fcs_cat", label: "FCS Category", value: "acceptable 58% | borderline 29% | poor 13%" },
      { survey: "MSNA-2025", site: "Lutsk", code: "rcsi_high", label: "rCSI ≥4 (7 days)", value: "60% of HH" },
      { survey: "MSNA-2025", site: "Lutsk", code: "mkt_function", label: "Market Functionality", value: "open 6 days/week" },
      { survey: "MSNA-2025", site: "Lutsk", code: "price_increase", label: "Food Price Increase Reported", value: "70% of HH" },
    ],
  },

  // ---------------------------------------------------------------------------
  // 6) SHELTER / NFI — new; pie chart; simple winterization signal
  // ---------------------------------------------------------------------------
  {
    id: "shelter",
    title: "Shelter & NFI Findings",
    cluster: "Shelter/NFI",
    aiText:
      "Housing damage and overcrowding remain salient: 23% of households report repairable damage and 17% live in overcrowded conditions (>3 persons/room). Winterization gaps persist, with 41% lacking sufficient heating items. Site patterns suggest concentrated needs: Rivne reports 41% with winter gaps and 17% overcrowding; Kovel 39% and 15%; Lutsk 42% and 18%, indicating the highest current winterization need in Lutsk. Given that 17% of households fall into severe/collective accommodation or face major constraints, rapid minor repairs (sealing kits, basic materials) can lift adequacy for a meaningful share. Priorities include repair kits for households with repairable damage, winter top-ups (blankets, heaters) for elderly and single-headed households, and light insulation of corridors/common areas in collective sites.",
    humanText: "",
    rating: 0,
    ratings: { helpfulness: 0, honesty: 0, harmlessness: 0 },
    accepted: false,
    hasRecs: true,
    aiRecs: [
      "Distribute sealing/repair kits to households with repairable damage.",
      "Provide winter top-ups (blankets, heaters) for vulnerable HHs.",
      "Community-level insulation of collective corridors/common areas.",
    ],
    humanRecs: [],
    acceptRecs: false,
    narrativeFields: ["house_damage", "overcrowding", "winter_need"],
    recFields: ["house_damage", "overcrowding", "winter_need"],
    chart: "pie",
    chartTitle: "Housing Condition (Households)",
    chartData: [
      { name: "Adequate", value: 60 },
      { name: "Damaged (repairable)", value: 23 },
      { name: "Severe/Collective", value: 17 },
    ],
    contextRows: [
      { survey: "MSNA-2025", site: "Rivne", code: "house_damage", label: "Housing Condition", value: "adequate 60% | repairable 23% | severe/collective 17%" },
      { survey: "MSNA-2025", site: "Rivne", code: "overcrowding", label: "Overcrowding (>3/room)", value: "17% of HH" },
      { survey: "MSNA-2025", site: "Rivne", code: "winter_need", label: "Winterization Gap", value: "41% of HH" },

      { survey: "MSNA-2025", site: "Kovel", code: "house_damage", label: "Housing Condition", value: "adequate 62% | repairable 22% | severe/collective 16%" },
      { survey: "MSNA-2025", site: "Kovel", code: "overcrowding", label: "Overcrowding (>3/room)", value: "15% of HH" },
      { survey: "MSNA-2025", site: "Kovel", code: "winter_need", label: "Winterization Gap", value: "39% of HH" },

      { survey: "MSNA-2025", site: "Lutsk", code: "house_damage", label: "Housing Condition", value: "adequate 59% | repairable 24% | severe/collective 17%" },
      { survey: "MSNA-2025", site: "Lutsk", code: "overcrowding", label: "Overcrowding (>3/room)", value: "18% of HH" },
      { survey: "MSNA-2025", site: "Lutsk", code: "winter_need", label: "Winterization Gap", value: "42% of HH" },
    ],
  },
];
