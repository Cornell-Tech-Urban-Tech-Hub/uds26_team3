# GO-Wanus Green

Urban design portfolio for the Gowanus Canal streetscape proposal. The site presents a six-section narrative — from existing-conditions analysis to stakeholder consensus — using interactive maps, scenario comparisons, agent-based simulation results, and an approval timeline.

## Getting started

Install dependencies:

```
npm install
```

Run the development server:

```
npm run dev
```

Open http://localhost:3000.

To build for production:

```
npm run build
npm run start
```

## Project structure

```
src/
  app/
    layout.tsx        global HTML shell, fonts
    page.tsx          single-page entry
    globals.css       CSS custom properties, base styles
  components/
    go-wanus/         all section and UI components
  lib/
    googleDrive.ts    Drive file ID helpers
public/
  line-race.html      embedded Apache ECharts animation (pollutant trajectories)
  *.png               static images used by the slider and timeline
```

## Sections

| # | ID | Title |
|---|-----|-------|
| 01 | `#research` | Insights — motivation and existing conditions |
| 02 | `#scenarios` | Transformation — intervention strategy and planting design |
| 03 | `#simulation` | Prediction — GAMA agent-based methodology |
| 04 | `#behavioral` | Behavioral Overflow — pedestrian and vehicle logic |
| 05 | `#financials` | Outcome & Prediction — pollutant trajectories and impact metrics |
| 06 | `#stakeholders` | Consensus & Action — budget table and 9-month approval timeline |

## Key components

- `BondStreetCompare` — before/after slider for 245 Bond Street. The "After" side plays a Google Drive video; falls back to a static image if no Drive ID is configured.
- `ScenarioMapPanel` — layered SVG map showing S0/S1/S2 intervention scenarios. Replace with a real MapLibre export when GIS data is ready.
- `InsightsSwitcher` — card-and-image panel for the four core site insights. Click a card to reveal its caption.
- `SpeciesAccordion` — expandable species lists grouped by flood tolerance and diversity.
- `ConsensusAction` — two-column layout with a budget table and an interactive timeline. Clicking a step shows a screenshot or embeds a live website.
- `LineRaceEmbed` — iframe wrapper for the ECharts line-race HTML file in `public/`.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BOND_AFTER_VIDEO` | Google Drive share URL or file ID for the "After" slider video. Optional; falls back to the hardcoded Drive ID in `lib/googleDrive.ts`. |

## Notes

- `BondStreetCompare` and `TransformationSlider` are loaded with `next/dynamic` and `ssr: false` to avoid hydration mismatches caused by `react-compare-slider` injecting inline styles on the client.
- `maplibre-gl` is installed but `ScenarioMapPanel` currently renders an SVG placeholder. Wire up real GIS layers by replacing the placeholder with a MapLibre `Map` instance once GIS exports are available.
- The ECharts animation (`public/line-race.html`) is self-contained. Edit it directly to update chart data or colors.
