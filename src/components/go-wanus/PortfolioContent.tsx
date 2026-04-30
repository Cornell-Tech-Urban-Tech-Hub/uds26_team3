"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { TreeDeciduous, Building2 } from "lucide-react";
import { GlassNav } from "./GlassNav";
import { LineRaceEmbed } from "./LineRaceEmbed";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { MethodologyAccordion } from "./MethodologyAccordion";
import { ScenarioControlDeck } from "./ScenarioControlDeck";
import { MindMapResearchSpine } from "./MindMapResearchSpine";
import { NarrativeCanopySplit } from "./NarrativeCanopySplit";
import { SectionPillar } from "./SectionPillar";
import { ConsensusAction } from "./ConsensusAction";
import { InsightsSwitcher } from "./InsightsSwitcher";
import { ScenarioMapPanel } from "./ScenarioMapPanel";
import { SpeciesAccordion } from "./SpeciesAccordion";
import { withBasePath } from "@/lib/withBasePath";

// Load slider components client-only to avoid SSR/hydration style mismatch
const BondStreetCompare = dynamic(
  () => import("./BondStreetCompare").then((m) => ({ default: m.BondStreetCompare })),
  { ssr: false }
);
const TransformationSlider = dynamic(
  () => import("./TransformationSlider").then((m) => ({ default: m.TransformationSlider })),
  { ssr: false }
);

const fadeInUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const cardGlass =
  "rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-[0_12px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-shadow hover:border-mint/15 hover:shadow-[0_16px_56px_rgba(0,0,0,0.45)]";

const references = {
  organizations: [
    {
      label: "Gowanus Canal Conservancy (GCC)",
      href: "https://gowanuscanalconservancy.org/",
      note: "Stakeholder reference used in the approval timeline.",
    },
    {
      label: "Gowanus Improvement District (BID)",
      href: "https://gowanusimprovementdistrict.org/get-involved",
      note: "BID participation and engagement reference.",
    },
    {
      label: "NYC Department of Transportation (DOT)",
      href: "https://www.nyc.gov/html/dot/html/home/home.shtml",
      note: "Pilot permitting and streetscape policy context.",
    },
    {
      label: "New York City Department of Parks & Recreation",
      href: "https://www.nycgovparks.org/",
      note: "Urban forestry coordination and tree stewardship context.",
    },
    {
      label: "NYC Department of Environmental Protection (DEP)",
      href: "https://www.nyc.gov/site/dep/index.page",
      note: "Stormwater and environmental infrastructure context.",
    },
  ],
  platforms: [
    {
      label: "OpenStreetMap",
      href: "https://www.openstreetmap.org/",
      note: "Basemap tiles and OSM embed are used in map modules.",
    },
    {
      label: "Apache ECharts",
      href: "https://echarts.apache.org/",
      note: "Line-race chart runtime for pollutant trajectories.",
    },
    {
      label: "QGIS",
      href: "https://qgis.org/",
      note: "Data processing and spatial analysis tool for preparing GIS layers.",
    },
    {
      label: "GAMA Platform",
      href: "https://gama-platform.org/",
      note: "Agent-based simulation framework referenced in methodology.",
    },
  ],
  data: [
    {
      label: "BID boundary and geometry",
      href: "https://raw.githubusercontent.com/Cornell-Tech-Urban-Tech-Hub/uds26_team3/main/public/data_from_gama/BID_vector.geojson",
      note: "Local dataset from public/data_from_gama.",
    },
    {
      label: "Canal geometry",
      href: "https://raw.githubusercontent.com/Cornell-Tech-Urban-Tech-Hub/uds26_team3/main/public/data_from_gama/canel.geojson",
      note: "Local dataset from public/data_from_gama.",
    },
    {
      label: "Tree inventory baseline",
      href: "https://raw.githubusercontent.com/Cornell-Tech-Urban-Tech-Hub/uds26_team3/main/public/data_from_gama/gowanus_bid_trees.geojson",
      note: "Local dataset for current tree distribution.",
    },
    {
      label: "Scenario trees (full/new) and street change",
      href: "https://raw.githubusercontent.com/Cornell-Tech-Urban-Tech-Hub/uds26_team3/main/public/data_from_gama/bid_trees_full.geojson",
      note: "Scenario datasets paired with bid_trees_new.geojson and street_change.geojson.",
    },
  ],
  papers: [
    {
      label:
        "Nowak, D. J., Crane, D. E., & Stevens, J. C. (2006). Air pollution removal by urban trees and shrubs in the United States. Urban Forestry & Urban Greening, 4(3-4), 115-123.",
      href: "https://doi.org/10.1016/j.ufug.2006.01.007",
      note: "DOI",
    },
    {
      label:
        "Shetty, N. H. (2023). Estimating stormwater infiltration and canopy interception for street tree pits in Manhattan, New York. Forests, 14(2), 216.",
      href: "https://doi.org/10.3390/f14020216",
      note: "DOI",
    },
    {
      label:
        "Westfall, J. A., Nowak, D. J., Henning, J. G., Lister, T. W., Edgar, C. B., Majewsky, M. A., & Sonti, N. F. (2020). Crown width models for woody plant species growing in urban areas of the U.S. Urban Ecosystems, 23(4), 905-917.",
      href: "https://doi.org/10.1007/s11252-020-00988-2",
      note: "DOI",
    },
    {
      label:
        "Mailloux, B. J., McGillis, C., Maenza-Gmelch, T., Culligan, P. J., He, M. Z., Kaspi, G., Miley, M., Komita-Moussa, E., Sanchez, T. R., Steiger, E., Zhao, H., & Cook, E. M. (2024). Large-scale determinants of street tree growth rates across an urban environment. PLoS ONE, 19(7), e0304447.",
      href: "https://doi.org/10.1371/journal.pone.0304447",
      note: "DOI",
    },
    {
      label:
        "Rosenzweig, C., Solecki, W., & Slosberg, R. (2006). Mitigating New York City's heat island with urban forestry, living roofs, and light surfaces (Final Report 06-06). New York State Energy Research and Development Authority.",
      href: "https://www.researchgate.net/publication/242139673_Mitigating_New_York_City's_heat_island_with_urban_forestry_living_roofs_and_light_surfaces",
      note: "Report PDF",
    },
    {
      label:
        "Nowak, D. J. (1996). Estimating leaf area and leaf biomass of open-grown deciduous urban trees. Forest Science, 42(4), 504-507.",
      href: "https://doi.org/10.1093/forestscience/42.4.504",
      note: "DOI",
    },
  ],
};

type FlowStep = { n: string; title: string; detail: string; loop: boolean };

function BehaviorFlowCard({
  title,
  subtitle,
  accent,
  steps,
}: {
  title: string;
  subtitle: string;
  accent: "mint" | "arch";
  steps: FlowStep[];
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const borderColor = accent === "mint" ? "border-mint/20" : "border-arch/20";
  const accentText = accent === "mint" ? "text-mint" : "text-arch";
  const spineColor = accent === "mint" ? "bg-mint/25" : "bg-arch/25";
  const activeBg = accent === "mint" ? "bg-mint/[0.07] border-mint/30" : "bg-arch/[0.07] border-arch/30";
  const loopBorder = accent === "mint" ? "border-dashed border-mint/30" : "border-dashed border-arch/30";

  return (
    <div className={`rounded-3xl border ${borderColor} bg-white/[0.03] p-6 backdrop-blur-sm`}>
      <p className={`font-[family-name:var(--font-display)] text-lg ${accentText}`}>{title}</p>
      <p className="mt-1 text-xs text-arch/50">{subtitle}</p>
      <div className="relative mt-5">
        <div className={`absolute left-4 top-0 h-full w-px ${spineColor}`} />
        <div className="space-y-1 pl-10">
          {steps.map((step, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                    isOpen ? activeBg : `border-white/[0.07] bg-white/[0.02] hover:${activeBg}`
                  } ${step.loop ? loopBorder : ""}`}
                >
                  <span className={`absolute left-[0.85rem] flex h-5 w-5 shrink-0 -translate-x-1/2 items-center justify-center rounded-full border text-[0.5rem] font-bold tabular-nums ${
                    isOpen
                      ? accent === "mint" ? "border-mint bg-mint text-base" : "border-arch bg-arch text-base"
                      : accent === "mint" ? "border-mint/40 bg-base text-mint" : "border-arch/40 bg-base text-arch"
                  }`}>
                    {step.n}
                  </span>
                  <span className="flex-1 text-sm font-medium text-cream">{step.title}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <svg className="h-3.5 w-3.5 text-cream/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && step.detail && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-3 pb-2 pt-1 text-xs leading-relaxed text-arch/60">
                        {step.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {i < steps.length - 1 && <div className="ml-3 h-1.5 w-px" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function PortfolioContent() {
  const [scenario, setScenario] = useState<"S0" | "S1" | "S2">("S2");

  return (
    <>
      <GlassNav />
      <main className="relative">
        {/* Hero */}
        <section className="relative flex min-h-[92vh] items-center overflow-hidden border-b border-white/[0.06] px-4 pb-24 pt-28 sm:px-6">
          <HeroAtmosphere />
          <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-mint/75">
                Gowanus BID · Urban Design Strategies and Case Studies
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-5xl font-light leading-[1.03] text-arch sm:text-6xl md:text-7xl lg:text-[5.2rem]">
                GO-Wanus Green:{" "}
                <span className="bg-gradient-to-r from-mint via-[#a78bfa] to-cream bg-clip-text text-transparent">
                  Beyond Static Planning
                </span>
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-xl leading-relaxed text-arch/80 sm:text-2xl">
                A community-supported, agent-based urban forestry roadmap for
                the Gowanus BID.
              </p>
              <p className="mt-10 text-base text-cream sm:text-lg">
                <span className="font-mono text-mint/80">Team</span> — Liu,
                Wang, Zhang, Yin, Yao
              </p>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#7dd3fc]/75">
                00 · Introduction
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-arch md:text-4xl">
                What Can a Green Future Bring?
              </h2>
            </div>
            <div className="mx-auto max-w-5xl">
              <BondStreetCompare />
            </div>
            <div className="mx-auto max-w-5xl">
              <NarrativeCanopySplit />
            </div>
          </div>
        </section>

        <MindMapResearchSpine />

        {/* Research — Problem */}
        <section
          id="research"
          className="scroll-mt-24 border-b border-white/[0.06] px-4 py-20 sm:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <SectionPillar
              step="01"
              eyebrow="Motivation & context"
              title="Insights"
            />
            <motion.p
              className="mt-6 max-w-3xl text-arch/80"
              {...fadeInUp}
            >
              As a former industrial community transitioning to residential
              mixed-use, creating a pedestrian and ecologically friendly
              environment is essential to attract new residents. However,
              Gowanus&apos;s industrial legacy, fragile ecological system, and budget
              limitations all make its green transformation challenging.
            </motion.p>
            <InsightsSwitcher />
          </div>
        </section>

        {/* Transformation — 02 + 02b bundled */}
        <section className="border-b border-white/[0.06] px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionPillar
              step="02"
              eyebrow="Spatial transformation"
              title="Transformation"
            />
            <p className="mt-6 max-w-3xl text-arch/80">
              To transform current conditions into the proposed green corridors,
              we developed a 2-step tree planting strategy that prioritizes
              ecologically vulnerable streets.
            </p>
            <div className="mt-10">
              <TransformationSlider />
            </div>

            {/* 02 · Intervention strategy */}
            <div className="mt-16 border-t border-white/[0.06] pt-14 scroll-mt-24" id="scenarios">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#7dd3fc]/75">
                02 · Intervention strategy
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-arch md:text-3xl">
                Intervention scenarios
              </h3>
              <p className="mt-2 text-cream/80">
                Click a scenario to view the corresponding spatial intervention.
                Planned tree locations are predefined to maximize ecological
                benefits.
              </p>
              <div className="mt-6">
                <ScenarioControlDeck
                  scenario={scenario}
                  onScenario={setScenario}
                />
              </div>
              <div className="mt-6 mx-auto max-w-5xl">
                <ScenarioMapPanel scenario={scenario} />
              </div>
              <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
                {[
                  {
                    id: "S0",
                    title: "Baseline",
                    body: "Current street conditions remain unchanged, including existing tree distribution, sidewalk widths, and stormwater flood risk. This reference scenario helps measure the benefits of future greening interventions.",
                  },
                  {
                    id: "S1",
                    title: "More Trees",
                    body: "Street trees increase by roughly 20%, with new planting prioritized where tree density is low and stormwater flood risk is high. The goal is stronger canopy coverage, shade, cooling, and water absorption.",
                  },
                  {
                    id: "S2",
                    title: "Trees & Sidewalks",
                    body: "This scenario adds trees and widens constrained sidewalks to create more room for tree beds and root systems, supporting healthier long-term growth while improving pedestrian comfort and accessibility.",
                  },
                ].map((item) => (
                  <motion.article
                    key={item.id}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-mint/75">
                      {item.id}
                    </p>
                    <h4 className="mt-2 font-[family-name:var(--font-display)] text-xl text-cream">
                      {item.title}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-arch/75">
                      {item.body}
                    </p>
                  </motion.article>
                ))}
              </div>
            </div>

            {/* 02b · Species & Planting Strategies */}
            <div className="mt-16 border-t border-white/[0.06] pt-14">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#7dd3fc]/75">
                02b · Planting design
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-arch md:text-3xl">
                Species and Planting Strategies
              </h3>
              <SpeciesAccordion />
              <motion.div
                className="mt-8 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl"
                {...fadeInUp}
              >
                <p className="mb-5 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-cream/50">Planting strategy</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { icon: "🌊", text: "Prioritize flood-prone corridors and low-canopy areas" },
                    { icon: "📐", text: "Match species to sidewalk width & available soil volume" },
                    { icon: "🪨", text: "Use tree beds & permeable paving to support root growth" },
                    { icon: "⚠️", text: "Avoid overrepresented species (e.g., London Plane, Honey Locust, Ginkgo)" },
                  ].map((p, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.08 * i, duration: 0.4 }}
                    >
                      <span className="text-xl">{p.icon}</span>
                      <p className="text-sm leading-relaxed text-cream/85">{p.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Simulation — Methodology */}
        <section
          id="simulation"
          className="scroll-mt-24 border-b border-white/[0.06] px-4 py-20 sm:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <SectionPillar
              step="03"
              eyebrow="Simulation methodology"
              title="Prediction"
            />
            <motion.p className="mt-6 max-w-3xl text-arch/80" {...fadeInUp}>
              We use GAMA to run spatially-explicit agents on Gowanus streets. Commuters, random locals,
              scenic visitors, joggers, and drivers each carry distinct routing and dwell
              heuristics, feeding crowding, shade, and Linger-based retail
              exposure for scenario comparison.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45 }}
            >
              <MethodologyAccordion />
            </motion.div>

            <motion.div
              className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="border-b border-mint/20 bg-gradient-to-r from-black/50 via-mint/[0.08] to-black/50 px-4 py-3 text-center text-sm font-semibold text-mint">
                Live demo
              </div>
              <video
                className="aspect-video min-h-[420px] w-full bg-black"
                src={withBasePath("/gama.mp4")}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="GAMA live demo"
              />
            </motion.div>
          </div>
        </section>

        {/* Behavioral Overflow */}
        <section
          id="behavioral"
          className="scroll-mt-24 border-b border-white/[0.06] px-4 py-20 sm:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <SectionPillar
              step="04"
              eyebrow="Agent behavior"
              title="Behavioral Overflow"
              subtitle="Where indirect behavioral effects accumulate — pedestrian rerouting toward shade and vehicle congestion from narrowed corridors."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <BehaviorFlowCard
                title="Pedestrians' Logic Flow"
                subtitle="Gowanus Trees: Simulation Overview and Process Chain"
                accent="mint"
                steps={[
                  { n: "1", title: "Choose Scenario", detail: "S0: Status Quo · S1: Added Trees · S2: Trees + Sidewalks", loop: false },
                  { n: "2", title: "Environment Setup & Scoring", detail: "Load roads/buildings; calculate green scores and sidewalk attractiveness.", loop: false },
                  { n: "3", title: "Agent Generation", detail: "Assigning behavior types: Commuters, Random Locals, Tourists, and Joggers.", loop: false },
                  { n: "4", title: "Run Simulation Loop", detail: "Real-time agent movement, path-finding, and dwell time monitoring.", loop: true },
                  { n: "5", title: "Impact Comparison", detail: "Compare scenario outputs across pedestrian flow, dwell time, and shade exposure.", loop: false },
                ]}
              />
              <BehaviorFlowCard
                title="Vehicles' Logic Flow"
                subtitle="Gowanus Vehicles simulation overview"
                accent="arch"
                steps={[
                  { n: "1", title: "Choose Scenario", detail: "S0 Before · S1 Trees · S2 Trees + Sidewalk", loop: false },
                  { n: "2", title: "Load Inputs", detail: "Road network, buildings, parking, bike lanes, demand, speeds, signals.", loop: false },
                  { n: "3", title: "Process Network", detail: "Filter drivable links, compute effective width, build weighted graph.", loop: false },
                  { n: "4", title: "Generate Vehicle Trips", detail: "Origin-destination demand, departure time sampling.", loop: false },
                  { n: "5", title: "Route Choice", detail: "Shortest path on weighted road graph (travel time, width penalty, preferences).", loop: false },
                  { n: "6", title: "Run Simulation Loop", detail: "Move vehicles, handle stops & signals, stuck timeout check, update travel time, check congestion/delay.", loop: true },
                  { n: "7", title: "Update Metrics", detail: "Aggregate trip completion, speed, and congestion data per scenario.", loop: false },
                  { n: "8", title: "Compare Results", detail: "Only in S2: Road width reduced → Higher congestion → Fewer trips complete within time limit.", loop: false },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Outcome & Prediction */}
        <section
          id="financials"
          className="scroll-mt-24 border-b border-white/[0.06] px-4 py-20 sm:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <SectionPillar
              step="05"
              eyebrow="Scenarios & impact"
              title="Outcome & Prediction"
              subtitle="Prediction outputs are grouped into numbers first, charts second, and spatial impact last. This keeps the section readable and professional."
            />

            <div className="mt-10">
              <LineRaceEmbed />
            </div>

            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="mt-8 h-px bg-white/[0.06]" />

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {/* Pedestrian Vitality */}
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-px w-6 bg-mint" />
                    <p className="font-[family-name:var(--font-display)] text-lg text-mint">
                      Pedestrian Vitality (S2 vs S0)
                    </p>
                  </div>
                  {[
                    {
                      label: "Pass-through flow",
                      value: "+41.5%",
                      color: "text-mint",
                      desc: "Adding trees and space increases overall pedestrian movement drastically compared to baseline.",
                    },
                    {
                      label: "Average dwell time",
                      value: "+83.1%",
                      color: "text-mint",
                      desc: "Time spent lingering rises from ~74s to ~135s.",
                    },
                  ].map((item) => (
                    <div key={item.label} className="border-t border-white/[0.06] py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-cream/40">
                            {item.label}
                          </p>
                          <p className="mt-1 max-w-xs text-sm leading-relaxed text-cream/65">
                            {item.desc}
                          </p>
                        </div>
                        <p className={`shrink-0 font-[family-name:var(--font-display)] text-3xl ${item.color}`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vehicle Trade-offs */}
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-px w-6 bg-arch" />
                    <p className="font-[family-name:var(--font-display)] text-lg text-arch">
                      Vehicle Trade-offs (S2 vs S0)
                    </p>
                  </div>
                  {[
                    {
                      label: "Completed trips",
                      value: "-10.7%",
                      color: "text-rust",
                      desc: "Completion rate drops from 90.8% to 81.1% due to narrowed road bottlenecks.",
                    },
                    {
                      label: "Emissions",
                      value: "-14.9%",
                      color: "text-rust",
                      desc: "Reduced vehicle miles traveled naturally reduces localized gas and PM emissions.",
                    },
                  ].map((item) => (
                    <div key={item.label} className="border-t border-white/[0.06] py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-cream/40">
                            {item.label}
                          </p>
                          <p className="mt-1 max-w-xs text-sm leading-relaxed text-cream/65">
                            {item.desc}
                          </p>
                        </div>
                        <p className={`shrink-0 font-[family-name:var(--font-display)] text-3xl ${item.color}`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>


            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <motion.div className={cardGlass} {...fadeInUp}>
                <div className="flex items-center gap-2 text-mint">
                  <TreeDeciduous className="h-5 w-5" />
                  <span className="font-mono text-xs uppercase tracking-widest">
                    Ecological ROI
                  </span>
                </div>
                <p className="mt-4 text-2xl font-[family-name:var(--font-display)] text-arch">
                  Up to{" "}
                  <span className="text-mint">21.4% increase</span> in 20-year
                  eco-benefit under S2 vs. baseline—driven by combined
                  hardscape and planting interventions.
                </p>
                <p className="mt-3 text-sm text-arch/70">
                  Figures are indicative of coupled green–infrastructure
                  benefits; calibrate to your i-Tree runs and BID geodata.
                </p>
              </motion.div>
              <motion.div className={cardGlass} {...fadeInUp}>
                <div className="flex items-center gap-2 text-rust">
                  <Building2 className="h-5 w-5" />
                  <span className="font-mono text-xs uppercase tracking-widest">
                    Economic data
                  </span>
                </div>
                <p className="mt-4 text-2xl font-[family-name:var(--font-display)] text-arch">
                  NYC DOT complete-street and corridor redesigns have
                  been associated with{" "}
                  <span className="text-rust">roughly 48–172% potential</span>{" "}
                  retail sales lift in published streetscape studies—context
                  and lease mix apply.
                </p>
                <p className="mt-3 text-sm text-arch/70">
                  Use with local sales tax / POS panels where available to
                  localize the range for the BID.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Consensus & Action */}
        <ConsensusAction />

        <section
          id="reference"
          className="scroll-mt-24 border-t border-white/[0.06] px-4 py-20 sm:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <SectionPillar
              step="07"
              eyebrow="Sources & citation"
              title="Reference"
              subtitle="Websites, tools, and local datasets used across this portfolio."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {[
                { title: "Organizations", items: references.organizations },
                { title: "Platforms & Tools", items: references.platforms },
                { title: "Datasets", items: references.data },
              ].map((group) => (
                <motion.div
                  key={group.title}
                  className={cardGlass}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-arch">
                    {group.title}
                  </h3>
                  <div className="mt-4 space-y-4">
                    {group.items.map((item) => (
                      <div key={item.label} className="border-t border-white/[0.07] pt-3">
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-mint/90 underline decoration-mint/30 underline-offset-2 hover:text-cream"
                        >
                          {item.label}
                        </a>
                        <p className="mt-1 text-xs leading-relaxed text-arch/65">
                          {item.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-[0_12px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl text-arch">
                Academic Papers
              </h3>
              <div className="mt-4 space-y-4">
                {references.papers.map((paper) => (
                  <div key={paper.href} className="border-t border-white/[0.07] pt-3">
                    <p className="text-sm leading-relaxed text-cream/90">
                      {paper.label}
                    </p>
                    <a
                      href={paper.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs text-mint/90 underline decoration-mint/30 underline-offset-2 hover:text-cream"
                    >
                      {paper.note}
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="border-t border-white/[0.06] px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-4 text-center text-sm text-arch/50 sm:flex-row sm:text-left">
            <p>GO-Wanus Green: research portfolio</p>
            <p className="font-mono text-xs">Gowanus BID</p>
          </div>
        </footer>
      </main>
    </>
  );
}
