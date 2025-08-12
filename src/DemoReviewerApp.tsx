import { useMemo, useState } from "react";
import {
  Star,
  Download,
  Edit3,
  CheckCircle2,
  RefreshCw,
  FileJson,
  BarChart3,
  PieChart as PieChartIcon,
  ListChecks,
  Trash2,
  TestTube2,
  Maximize2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// shadcn/ui components used by the app
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// ---------------------------------------------
// Types
// ---------------------------------------------
interface ContextRow {
  survey: string;
  site?: string;
  code: string;
  label: string;
  value: string | number;
}

interface Section {
  id: string;
  title: string;
  cluster: string;
  aiText: string;
  humanText: string;
  rating: number;
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
}

// ---------------------------------------------
// Demo Data (multi-survey context + recs)
// ---------------------------------------------
const initialSections: Section[] = [
  {
    id: "overview",
    title: "Context Overview",
    cluster: "Multi-sector",
    aiText:
      "Based on 312 household interviews across 8 hromadas (May 2025), most respondents reported reduced access to services due to insecurity and rising prices. Displacement remains fluid; host communities are absorbing needs. Priority is safe water, basic health services, and cash for essential goods.",
    humanText: "",
    rating: 0,
    accepted: false,
    // Programming suggestions disabled for overview
    hasRecs: false,
    aiRecs: [],
    humanRecs: [],
    acceptRecs: false,
    narrativeFields: ["loc_hromada", "sample_n", "dates"],
    recFields: [],
    chart: "none",
    chartData: [],
    // three deployments of the same questionnaire schema (site instances)
    contextRows: [
      { survey: "MSNA-2025", site: "Rivne", code: "loc_hromada", label: "Hromada", value: "Rivne-1" },
      { survey: "MSNA-2025", site: "Rivne", code: "sample_n", label: "Households Surveyed", value: "312" },
      { survey: "MSNA-2025", site: "Rivne", code: "dates", label: "Data Collection Window", value: "2025-05-12 → 2025-05-20" },
      { survey: "MSNA-2025", site: "Kovel", code: "loc_hromada", label: "Hromada", value: "Kovel-2" },
      { survey: "MSNA-2025", site: "Kovel", code: "sample_n", label: "Households Surveyed", value: "198" },
      { survey: "MSNA-2025", site: "Kovel", code: "dates", label: "Data Collection Window", value: "2025-05-15 → 2025-05-22" },
      { survey: "MSNA-2025", site: "Lutsk", code: "loc_hromada", label: "Hromada", value: "Lutsk-3" },
      { survey: "MSNA-2025", site: "Lutsk", code: "sample_n", label: "Households Surveyed", value: "276" },
      { survey: "MSNA-2025", site: "Lutsk", code: "dates", label: "Data Collection Window", value: "2025-05-10 → 2025-05-18" },
    ],
  },
  {
    id: "wash",
    title: "WASH Findings",
    cluster: "WASH",
    aiText:
      "62% of households report access to improved water sources; however, 38% rely on trucking or surface water with inconsistent chlorination. Primary barriers are cost of water and distance to points. Priority actions: chlorination support, spare parts for pumps, and hygiene kit distribution targeting displaced households.",
    humanText: "",
    rating: 0,
    accepted: false,
    hasRecs: true,
    aiRecs: [
      "Support chlorination at communal water points and monitor residuals weekly.",
      "Provide spare parts for borehole pumps in rural sites.",
      "Targeted hygiene kits for newly displaced HHs.",
    ],
    humanRecs: [],
    acceptRecs: false,
    narrativeFields: ["w_source_main", "w_treat", "dist_to_point_km"],
    recFields: ["w_source_main", "w_treat", "dist_to_point_km"],
    chart: "bar",
    chartData: [
      { category: "Improved", value: 62 },
      { category: "Unimproved", value: 22 },
      { category: "Trucked", value: 16 },
    ],
    // three deployments (Rivne, Kovel, Lutsk) with the same schema
    contextRows: [
      { survey: "MSNA-2025", site: "Rivne", code: "w_source_main", label: "Main Water Source", value: "piped 41% | borehole 21%" },
      { survey: "MSNA-2025", site: "Rivne", code: "w_treat", label: "Water Treatment", value: "boil 18% | chlorine 27%" },
      { survey: "MSNA-2025", site: "Rivne", code: "dist_to_point_km", label: "Avg Distance to Point (km)", value: "1.3" },
      { survey: "MSNA-2025", site: "Kovel", code: "w_source_main", label: "Main Water Source", value: "piped 36% | borehole 24%" },
      { survey: "MSNA-2025", site: "Kovel", code: "w_treat", label: "Water Treatment", value: "boil 12% | chlorine 33%" },
      { survey: "MSNA-2025", site: "Kovel", code: "dist_to_point_km", label: "Avg Distance to Point (km)", value: "1.8" },
      { survey: "MSNA-2025", site: "Lutsk", code: "w_source_main", label: "Main Water Source", value: "piped 48% | borehole 19%" },
      { survey: "MSNA-2025", site: "Lutsk", code: "w_treat", label: "Water Treatment", value: "boil 16% | chlorine 22%" },
      { survey: "MSNA-2025", site: "Lutsk", code: "dist_to_point_km", label: "Avg Distance to Point (km)", value: "1.1" },
    ],
  },
  {
    id: "health",
    title: "Health Findings",
    cluster: "Health",
    aiText:
      "70% of facilities are fully functional; 30% report stockouts of essential medicines (analgesics, antibiotics). Top barriers: user fees and transport. Priority actions: preposition chronic medications and deploy mobile clinics to areas beyond 10 km from facilities.",
    humanText: "",
    rating: 0,
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
    chartData: [
      { name: "Functional", value: 70 },
      { name: "Limited", value: 20 },
      { name: "Closed", value: 10 },
    ],
    contextRows: [
      { survey: "MSNA-2025", site: "Rivne", code: "func_level", label: "Facility Functionality", value: "functional 70% | limited 20% | closed 10%" },
      { survey: "MSNA-2025", site: "Rivne", code: "stockouts_30d", label: "Stockouts (30 days)", value: "34% facilities" },
      { survey: "MSNA-2025", site: "Rivne", code: "dist_fac_km", label: "Avg Distance to Facility (km)", value: "8.6" },
      { survey: "MSNA-2025", site: "Kovel", code: "func_level", label: "Facility Functionality", value: "functional 66% | limited 24% | closed 10%" },
      { survey: "MSNA-2025", site: "Kovel", code: "stockouts_30d", label: "Stockouts (30 days)", value: "28% facilities" },
      { survey: "MSNA-2025", site: "Kovel", code: "dist_fac_km", label: "Avg Distance to Facility (km)", value: "11.2" },
      { survey: "MSNA-2025", site: "Lutsk", code: "func_level", label: "Facility Functionality", value: "functional 73% | limited 18% | closed 9%" },
      { survey: "MSNA-2025", site: "Lutsk", code: "stockouts_30d", label: "Stockouts (30 days)", value: "31% facilities" },
      { survey: "MSNA-2025", site: "Lutsk", code: "dist_fac_km", label: "Avg Distance to Facility (km)", value: "6.9" },
    ],
  },
  {
    id: "protection",
    title: "Protection Findings",
    cluster: "Protection",
    aiText:
      "Households report safety concerns at water points and markets, especially after dark. Documentation loss among displaced households (21%) limits access to services. Priority actions: information points on civil documentation, lighting near water points, and PSS group sessions for caregivers and adolescents.",
    humanText: "",
    rating: 0,
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
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} onClick={() => onChange(i)} className="p-1" title={`${i} star${i > 1 ? "s" : ""}`}>
          <Star className={i <= value ? "fill-current text-yellow-500" : "text-muted-foreground"} />
        </button>
      ))}
    </div>
  );
}

function ChartBlock({ section }: { section: Section }) {
  if (section.chart === "bar") {
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <BarChart data={section.chartData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  if (section.chart === "pie") {
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie dataKey="value" data={section.chartData} outerRadius={100} label>
              {section.chartData.map((_, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  return (
    <div className="h-24 grid place-items-center text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" /> No chart for this section.
      </div>
    </div>
  );
}

function getQuestionnaireId(rows: ContextRow[]): string {
  if (!rows || !rows.length) return "";
  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.survey] = (acc[r.survey] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function CodeBadges({ codes }: { codes: string[] }) {
  if (!codes || !codes.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {codes.map((c) => (
        <span key={c} className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-mono">
          {c}
        </span>
      ))}
    </div>
  );
}

// ---------- Weight helpers (demo provenance) ----------
function weightScheme(n: number): number[] {
  if (!n) return [];
  const arr = Array.from({ length: n }, (_, i) => n - i);
  const sum = arr.reduce((a, b) => a + b, 0);
  return arr.map((x) => x / sum);
}

function computeBaseWeights(fields: string[]): Record<string, number> {
  const ws = weightScheme(fields.length);
  const map: Record<string, number> = {};
  fields.forEach((code, i) => {
    map[code] = ws[i] || 0;
  });
  return map; // code -> weight
}

function countByCode(rows: ContextRow[]): Record<string, number> {
  const counts: Record<string, number> = {};
  rows.forEach((r) => {
    counts[r.code] = (counts[r.code] || 0) + 1;
  });
  return counts;
}

function WeightBar({ value }: { value: number }) {
  const pct = Math.round((value || 0) * 100);
  return (
    <div className="w-full h-2 bg-muted rounded">
      <div className="h-2 rounded" style={{ width: `${pct}%` }} />
    </div>
  );
}

function OdkContext({
  rows,
  focusCodes = [],
  narrativeFields = [],
  recFields = [],
}: {
  rows: ContextRow[];
  focusCodes?: string[];
  narrativeFields?: string[];
  recFields?: string[];
}) {
  const [filter, setFilter] = useState<string>("All");
  const [onlyRef, setOnlyRef] = useState<boolean>(false);
  const [q, setQ] = useState<string>("");
  const [expanded, setExpanded] = useState<boolean>(false);
  const [compact, setCompact] = useState<boolean>(true);
  const [showSiteCol, setShowSiteCol] = useState<boolean>(true);

  const surveys = useMemo(() => Array.from(new Set(rows.map((r) => r.survey))), [rows]);
  const sites = useMemo(() => Array.from(new Set(rows.map((r) => r.site).filter(Boolean))), [rows]);

  const narrBase = useMemo(() => computeBaseWeights(narrativeFields), [narrativeFields]);
  const recBase = useMemo(() => computeBaseWeights(recFields), [recFields]);
  const counts = useMemo(() => countByCode(rows), [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (filter !== "All") list = list.filter((r) => r.survey === filter);
    if (onlyRef && focusCodes.length) list = list.filter((r) => focusCodes.includes(r.code));
    if (q.trim()) {
      const qq = q.toLowerCase();
      list = list.filter(
        (r) =>
          (r.code || "").toLowerCase().includes(qq) ||
          (r.label || "").toLowerCase().includes(qq) ||
          String(r.value).toLowerCase().includes(qq) ||
          (r.site || "").toLowerCase().includes(qq)
      );
    }
    return list;
  }, [rows, filter, onlyRef, focusCodes, q]);

  function narrWeight(row: ContextRow) {
    const base = narrBase[row.code] || 0;
    if (!base) return 0;
    return base / (counts[row.code] || 1);
  }
  function recWeight(row: ContextRow) {
    const base = recBase[row.code] || 0;
    if (!base) return 0;
    return base / (counts[row.code] || 1);
  }

  const hasSite = sites.length > 0;

  function TableView({ maxHeight = "360px" }: { maxHeight?: string }) {
    return (
      <div className="rounded-lg border overflow-auto" style={{ maxHeight }}>
        <table className={`w-full text-sm ${compact ? "" : ""} min-w-[1100px]`}>
          <thead className="bg-muted/50 sticky top-0 z-10">
            <tr>
              <th className="px-2 py-2 text-left w-36">Survey</th>
              {hasSite && showSiteCol && <th className="px-2 py-2 text-left w-32">Site</th>}
              <th className="px-2 py-2 text-left w-40">Code</th>
              <th className="px-2 py-2 text-left w-64">Label</th>
              <th className="px-2 py-2 text-left w-[420px]">Value</th>
              <th className="px-2 py-2 text-left w-28">Used by</th>
              <th className="px-2 py-2 text-left w-40">Narr wt</th>
              <th className="px-2 py-2 text-left w-40">Recs wt</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => {
              const nw = narrWeight(r);
              const rw = recWeight(r);
              return (
                <tr key={idx} className={`border-t align-top ${nw || rw ? "bg-primary/5" : ""}`}>
                  <td className="px-2 py-2 whitespace-nowrap text-muted-foreground">{r.survey}</td>
                  {hasSite && showSiteCol && <td className="px-2 py-2 whitespace-nowrap">{r.site}</td>}
                  <td className="px-2 py-2 font-mono break-words">{r.code}</td>
                  <td className="px-2 py-2 whitespace-pre-wrap break-words">{r.label}</td>
                  <td className="px-2 py-2 whitespace-pre-wrap break-words">{r.value}</td>
                  <td className="px-2 py-2">
                    <div className="flex gap-2">
                      {nw > 0 && <Badge variant="outline">Narr</Badge>}
                      {rw > 0 && <Badge variant="outline">Recs</Badge>}
                    </div>
                  </td>
                  <td className="px-2 py-2 w-40">
                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <WeightBar value={nw} />
                      </div>
                      <span className="tabular-nums text-xs text-muted-foreground">{(nw * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 w-40">
                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <WeightBar value={rw} />
                      </div>
                      <span className="tabular-nums text-xs text-muted-foreground">{(rw * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-xs">Survey filter:</Label>
        <Button size="sm" variant={filter === "All" ? "default" : "outline"} onClick={() => setFilter("All")}>
          All
        </Button>
        {surveys.map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>
            {s}
          </Button>
        ))}
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <Checkbox id="onlyRef" checked={onlyRef} onCheckedChange={(v) => setOnlyRef(!!v)} />
          <Label htmlFor="onlyRef" className="text-xs">
            Only referenced
          </Label>
        </div>
        {hasSite && (
          <div className="flex items-center gap-2">
            <Checkbox id="showSite" checked={showSiteCol} onCheckedChange={(v) => setShowSiteCol(!!v)} />
            <Label htmlFor="showSite" className="text-xs">
              Show site
            </Label>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Checkbox id="dense" checked={compact} onCheckedChange={(v) => setCompact(!!v)} />
          <Label htmlFor="dense" className="text-xs">
            Compact
          </Label>
        </div>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search code/label/value/site" className="h-8 w-56" />
        <Button size="sm" variant="outline" className="ml-auto" onClick={() => setExpanded(true)} title="Expand">
          <Maximize2 className="h-4 w-4 mr-1" />
          Expand
        </Button>
      </div>

      <TableView maxHeight="360px" />

      <div className="text-xs text-muted-foreground">
        Tip: Highlighted rows indicate fields referenced by the AI draft and/or suggestions. Weights show relative contribution per field and are split across sites when the same field appears in multiple deployments.
      </div>

      {/* Fullscreen dialog for wide table view */}
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>ODK Context — Full View</DialogTitle>
          </DialogHeader>
          <TableView maxHeight="70vh" />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setExpanded(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SuggestionListEditor({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const [draft, setDraft] = useState("");
  function updateItem(i: number, val: string) {
    const next = [...items];
    next[i] = val;
    onChange(next);
  }
  function removeItem(i: number) {
    const next = items.filter((_, idx) => idx !== i);
    onChange(next);
  }
  function addItem() {
    if (!draft.trim()) return;
    onChange([...(items || []), draft.trim()]);
    setDraft("");
  }
  return (
    <div className="space-y-2">
      {items && items.length > 0 ? (
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input value={it} onChange={(e) => updateItem(idx, e.target.value)} className="flex-1" />
              <Button size="icon" variant="ghost" onClick={() => removeItem(idx)} title="Remove">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">No suggestions yet.</div>
      )}
      <div className="flex items-center gap-2">
        <Input placeholder="Add a suggestion…" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <Button onClick={addItem}>Add</Button>
      </div>
    </div>
  );
}

function SectionSidebar({
  sections,
  activeId,
  onSelect,
}: {
  sections: Section[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`w-full text-left rounded-xl border p-3 hover:bg-accent ${activeId === s.id ? "bg-accent" : "bg-background"}`}
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold">{s.title}</div>
            <Badge variant="secondary">{s.cluster}</Badge>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <StarRating value={s.rating} onChange={() => {}} />
            </div>
            <div className="flex items-center gap-2">
              {s.accepted ? (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" /> 
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Edit3 className="h-4 w-4" /> 
                </span>
              )}
              {s.hasRecs && (s.acceptRecs ? (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" /> 
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <ListChecks className="h-4 w-4" /> 
                </span>
              ))}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ---------- Helpers to build JSONL safely ----------
function buildFieldWeightMap(fields: string[], rows: ContextRow[]): Record<string, number> {
  const base = computeBaseWeights(fields);
  const counts = countByCode(rows);
  const out: Record<string, number> = {};
  Object.keys(base).forEach((code) => {
    const perInstance = base[code] / (counts[code] || 1);
    out[code] = perInstance * (counts[code] || 1); // same as base[code], but explicit
  });
  return out;
}

function buildNarrativeRow(s: Section) {
  const final_text = s.accepted && s.humanText && s.humanText.trim() ? s.humanText : s.aiText;
  const questionnaire_id = getQuestionnaireId(s.contextRows);
  return {
    type: "narrative",
    section_id: s.id,
    title: s.title,
    cluster: s.cluster,
    questionnaire_id,
    source_field_codes: s.narrativeFields || [],
    field_weights: buildFieldWeightMap(s.narrativeFields || [], s.contextRows || []),
    ai_text: s.aiText,
    human_text: s.humanText || "",
    rating: s.rating || null,
    accepted: !!s.accepted,
    final_text,
    context_rows: s.contextRows,
    prompt: `Write a concise ${s.cluster} assessment paragraph using the provided ODK context rows (survey, site, code, label, value).`,
    completion: final_text,
  };
}

function buildRecRow(s: Section) {
  const finalRecs = s.acceptRecs && s.humanRecs && s.humanRecs.length ? s.humanRecs : s.aiRecs;
  const questionnaire_id = getQuestionnaireId(s.contextRows);
  return {
    type: "recommendations",
    section_id: s.id,
    title: s.title,
    cluster: s.cluster,
    questionnaire_id,
    source_field_codes: s.recFields || [],
    field_weights: buildFieldWeightMap(s.recFields || [], s.contextRows || []),
    ai_suggestions: s.aiRecs,
    human_suggestions: s.humanRecs,
    accepted: !!s.acceptRecs,
    final_suggestions: finalRecs,
    context_rows: s.contextRows,
    prompt: `Propose 3–5 actionable programming recommendations for ${s.cluster} using the ODK context rows. Return a bullet list.`,
    completion: (finalRecs || []).map((r) => `- ${r}`).join("\n"),
  };
}

function buildJSONLLines(sections: Section[]) {
  const lines: string[] = [];
  sections.forEach((s) => {
    lines.push(JSON.stringify(buildNarrativeRow(s)));
    if (s.hasRecs) {
      lines.push(JSON.stringify(buildRecRow(s)));
    }
  });
  return lines;
}

export default function DemoReviewerApp() {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [activeId, setActiveId] = useState<string>(initialSections[0].id);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [role, setRole] = useState<"reviewer" | "user">("user");

  const active = useMemo(() => {
    const found = sections.find((s) => s.id === activeId);
    return found || sections[0];
  }, [sections, activeId]);

  const reviewedCount = useMemo(
    () =>
      sections.filter(
        (s) =>
          s.rating > 0 ||
          (s.humanText && s.humanText.trim()) ||
          s.accepted ||
          (s.hasRecs && s.humanRecs && s.humanRecs.length) ||
          (s.hasRecs && s.acceptRecs)
      ).length,
    [sections]
  );
  const reviewedPct = Math.round((reviewedCount / sections.length) * 100);

  function updateSection(id: string, patch: Partial<Section>) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function exportJSONL() {
    const lines = buildJSONLLines(sections);
    const blob = new Blob([lines.join("\n")], { type: "application/jsonl;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fine_tuning_dataset.jsonl";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Simple Self-Tests (runtime) ----------
  function runSelfTests() {
    try {
      const lines = buildJSONLLines(sections);
      const expected = sections.length + sections.filter((s) => s.hasRecs).length;
      if (lines.length !== expected) throw new Error(`Expected ${expected} JSONL rows in total.`);

      const parsed = lines.map((l, i) => {
        try {
          return JSON.parse(l);
        } catch (e) {
          throw new Error(`Line ${i + 1} is not valid JSON.`);
        }
      });

      parsed.forEach((row: any) => {
        if (typeof row.prompt !== "string" || !row.prompt.length) throw new Error("Missing prompt string.");
        if (!row.questionnaire_id) throw new Error("Missing questionnaire_id.");
        if (!row.field_weights || typeof row.field_weights !== "object") throw new Error("Missing field_weights map.");
        const fieldWeights = row.field_weights as Record<string, number>;
        const sum: number = Object.values(fieldWeights as Record<string, number>)
          .map((n: unknown) => Number(n))
          .reduce((a: number, b: number) => a + b, 0);
        const sourceCodes = (row.source_field_codes ?? []) as unknown[];
        if (sourceCodes.length && !(sum > 0.95 && sum <= 1.0001)) {
          throw new Error("Field weights should sum to ~1 across referenced codes.");
        }
        if (row.type === "recommendations" && row.final_suggestions.length) {
          if (typeof row.completion !== "string" || !row.completion.includes("\n")) {
            throw new Error("Recommendations completion should be a bullet list separated by newlines.");
          }
          // New test: number of bullets should equal number of final suggestions
          const bullets = row.completion.split("\n").filter((ln: string) => ln.trim().startsWith("- "));
          if (bullets.length !== row.final_suggestions.length) {
            throw new Error("Mismatch between suggestions and completion bullets.");
          }
        }
      });

      const recRows = parsed.filter((r: any) => r.type === "recommendations");
      const expectedRec = sections.filter((s) => s.hasRecs).length;
      if (recRows.length !== expectedRec) throw new Error("Incorrect number of recommendations rows.");

      const washNarr = parsed.find((r: any) => r.type === "narrative" && r.section_id === "wash");
      if (!washNarr || !Array.isArray(washNarr.source_field_codes) || !washNarr.source_field_codes.includes("w_source_main")) {
        throw new Error("WASH narrative should reference 'w_source_main'.");
      }
      const overviewRec = parsed.find((r: any) => r.type === "recommendations" && r.section_id === "overview");
      if (overviewRec) throw new Error("Overview must not produce recommendations row.");

      const anyRec = parsed.find((r: any) => r.type === "recommendations" && r.final_suggestions && r.final_suggestions.length);
      if (anyRec && !anyRec.completion.trim().startsWith("- ")) {
        throw new Error("Recommendations completion should start with '- '.");
      }

      if (lines.length > 1) {
        const joined = lines.join("\n");
        const split = joined.split("\n");
        if (split.length !== lines.length) throw new Error("JSONL join/split with \\n should preserve row count.");
      }

      alert("Self-tests passed ✅");
    } catch (err: any) {
      alert(`Self-tests failed: ${(err && err.message) || err}`);
    }
  }

  const focusCodes = useMemo(() => {
    const set = new Set([...(active.narrativeFields || []), ...(active.recFields || [])]);
    return Array.from(set);
  }, [active]);

  const questionnaireId = useMemo(() => getQuestionnaireId(active.contextRows), [active]);
  const finalNarrative = active.accepted && active.humanText.trim() ? active.humanText : active.aiText;
  const finalRecs = active.hasRecs && active.acceptRecs && active.humanRecs.length ? active.humanRecs : active.aiRecs;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-[min(1800px,100vw-2rem)] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 grid place-items-center rounded-xl bg-primary/10">
              <span className="font-bold">AI</span>
            </div>
            <div>
              <div className="text-lg font-semibold">Human-in-the-Loop Report Reviewer</div>
              <div className="text-xs text-muted-foreground">Demo — ODK → AI draft → SME review → export for fine-tuning</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block w-48">
              <Progress value={reviewedPct} />
            </div>
            <Badge variant="outline" className="mr-2">{reviewedPct}% reviewed</Badge>
            {/* Role switch */}
            <div className="flex items-center gap-1 border rounded-xl p-1">
              <Button size="sm" variant={role === "reviewer" ? "default" : "ghost"} onClick={() => setRole("reviewer")}>
                Reviewer
              </Button>
              <Button size="sm" variant={role === "user" ? "default" : "ghost"} onClick={() => setRole("user")}>
                User
              </Button>
            </div>
            {/* Tools only for reviewers */}
            {role === "reviewer" && (
              <>
                <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
                  <FileJson className="mr-2 h-4 w-4" /> Preview JSONL
                </Button>
                <Button onClick={exportJSONL}>
                  <Download className="mr-2 h-4 w-4" /> Export JSONL
                </Button>
                <Button variant="outline" onClick={runSelfTests} title="Run basic runtime tests">
                  <TestTube2 className="mr-2 h-4 w-4" /> Self‑tests
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[min(1800px,100vw-2rem)] px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-4 lg:col-span-3">
          <Card className="sticky top-[84px]">
            <CardHeader>
              <CardTitle className="text-base">Report Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <SectionSidebar sections={sections} activeId={activeId} onSelect={setActiveId} />
            </CardContent>
          </Card>
        </aside>

        {/* Main Panel */}
        <section className="md:col-span-8 lg:col-span-9 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{active.cluster}</div>
                <CardTitle>{active.title}</CardTitle>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Questionnaire: {questionnaireId || "—"}</Badge>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Rating</Label>
                  <StarRating value={active.rating} onChange={(v) => updateSection(active.id, { rating: v })} />
                </div>
                {role === "reviewer" && (
                  <>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex items-center gap-2">
                      <Checkbox id="accept" checked={active.accepted} onCheckedChange={(v) => updateSection(active.id, { accepted: !!v })} />
                      <Label htmlFor="accept" className="text-sm">Adopt my narrative as final</Label>
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ODK context & chart */}
              {role === "reviewer" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">ODK Context (multi-survey)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <OdkContext rows={active.contextRows} focusCodes={focusCodes} narrativeFields={active.narrativeFields} recFields={active.recFields} />
                    </CardContent>
                  </Card>
                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        {active.chart === "pie" ? <PieChartIcon className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />} Section Chart
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartBlock section={active} />
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        {active.chart === "pie" ? <PieChartIcon className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />} Section Chart
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartBlock section={active} />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Narrative Editor */}
              {role === "reviewer" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">AI Draft (Narrative)</div>
                    <Textarea value={active.aiText} readOnly className="min-h-[220px]" />
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-muted-foreground">Source fields referenced:</div>
                      <CodeBadges codes={active.narrativeFields} />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Your Narrative Revision</div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => updateSection(active.id, { humanText: active.aiText })}>
                          <Edit3 className="mr-2 h-4 w-4" /> Start from AI text
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => updateSection(active.id, { humanText: "" })}>
                          <RefreshCw className="mr-2 h-4 w-4" /> Clear
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      placeholder="Edit or replace the AI narrative with your expert analysis..."
                      value={active.humanText}
                      onChange={(e) => updateSection(active.id, { humanText: e.target.value })}
                      className="min-h-[220px]"
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      Final narrative used for export: <span className="font-medium">{active.accepted && active.humanText.trim() ? "Your revision" : "AI draft"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <div className="col-span-1">
                    <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Final Narrative</div>
                    <Textarea value={finalNarrative} readOnly className="min-h-[220px]" />
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-muted-foreground">Source fields referenced:</div>
                      <CodeBadges codes={active.narrativeFields} />
                    </div>
                  </div>
                </div>
              )}

              {/* Programming Suggestions Editor (hidden for overview) */}
              {active.hasRecs && role === "reviewer" && (
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ListChecks className="h-4 w-4" /> Programming Suggestions (Actions)
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Checkbox id="acceptRecs" checked={active.acceptRecs} onCheckedChange={(v) => updateSection(active.id, { acceptRecs: !!v })} />
                        <Label htmlFor="acceptRecs" className="text-sm">
                          Adopt my suggestions as final
                        </Label>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">AI Suggestions</div>
                          <ul className="space-y-2">
                            {active.aiRecs.map((r, i) => (
                              <li key={i} className="rounded-md border p-2 text-sm">
                                {r}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-2 space-y-1">
                            <div className="text-xs text-muted-foreground">Source fields referenced:</div>
                            <CodeBadges codes={active.recFields} />
                          </div>
                        </div>
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground">Your Suggestions</div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => updateSection(active.id, { humanRecs: active.aiRecs })}>
                                <Edit3 className="mr-2 h-4 w-4" /> Start from AI list
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => updateSection(active.id, { humanRecs: [] })}>
                                <RefreshCw className="mr-2 h-4 w-4" /> Clear
                              </Button>
                            </div>
                          </div>
                          <SuggestionListEditor items={active.humanRecs} onChange={(list) => updateSection(active.id, { humanRecs: list })} />
                          <div className="mt-2 text-xs text-muted-foreground">
                            Final list used for export: <span className="font-medium">{active.acceptRecs && active.humanRecs.length ? "Your suggestions" : "AI suggestions"}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {active.hasRecs && role === "user" && (
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ListChecks className="h-4 w-4" /> Programming Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(finalRecs || []).length ? (
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                          {(finalRecs || []).map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-muted-foreground">No suggestions provided.</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Section status — Narrative: <span className="font-medium">{active.accepted && active.humanText.trim() ? "Edited" : "AI"}</span>
                {active.hasRecs && (
                  <>
                    {" "}· Suggestions: <span className="font-medium">{active.acceptRecs && active.humanRecs.length ? "Edited" : "AI"}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground">
                  {active.rating > 0 ? `Rated ${active.rating}/5` : "Not rated yet"}
                </motion.div>
              </div>
            </CardFooter>
          </Card>

          {/* All-sections view */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Report Outline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sections.map((s) => {
                  const finalText = s.accepted && s.humanText.trim() ? s.humanText : s.aiText;
                  const finalRecsLocal = s.hasRecs && s.acceptRecs && s.humanRecs.length ? s.humanRecs : s.aiRecs;
                  return (
                    <div key={s.id} className="rounded-xl border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-sm">{s.title}</div>
                        <Badge variant="outline">{s.cluster}</Badge>
                      </div>
                      <div className="line-clamp-4 text-sm text-muted-foreground">{finalText}</div>
                      {s.hasRecs && (
                        <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {(finalRecsLocal || []).slice(0, 3).map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                          {finalRecsLocal && finalRecsLocal.length > 3 && <li>…</li>}
                        </ul>
                      )}
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Star className={s.rating > 0 ? "fill-current text-yellow-500" : "text-muted-foreground"} />
                          <span>{s.rating || "—"}</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setActiveId(s.id)}>
                          Open
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* JSONL Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>JSONL Preview</DialogTitle>
          </DialogHeader>
          <div className="rounded-xl bg-muted p-3 text-xs overflow-auto max-h-[50vh] whitespace-pre-wrap">
            {buildJSONLLines(sections).join("\n")}
          </div>
          <DialogFooter>
            <Button onClick={exportJSONL}>
              <Download className="mr-2 h-4 w-4" /> Download JSONL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
