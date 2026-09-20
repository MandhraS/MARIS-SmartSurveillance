# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## MARIS - How the System Works

MARIS is a Smart Maritime Surveillance prototype that connects a satellite SAR observation to spill detection, risk assessment, drift backtracking, AIS correlation, source attribution, alerts, and an incident report. The dashboard uses local structured demo data, a local SAR demonstration scene, and a free OpenStreetMap tile layer. It does not claim live government, Sentinel-1 API, or production AIS access.

1. **Sentinel-1 SAR:** Radar can observe maritime areas day or night and through cloud cover. A surface film may dampen capillary waves, creating a darker low-backscatter signature.
2. **Detection:** The prototype demonstrates ingestion, preprocessing, water segmentation, anomaly detection, spill classification, boundary extraction, and risk assessment.
3. **Segmentation:** Water and candidate regions are separated so a suspected slick boundary and area can be estimated.
4. **Risk assessment:** Area, confidence, proximity to assets, and environmental context become an operational priority.
5. **Lagrangian backtracking:** Simulated wind and current vectors are followed backward to estimate where a drifting slick may have originated.
6. **AIS correlation:** Vessel identity, position, speed, heading, status, and destination provide movement context.
7. **Source attribution:** MARIS compares the backtracked origin with vessel trajectories, timing, proximity, and behavior changes.
8. **Dashboard:** Command KPIs, map overlays, SAR comparison, processing stages, incidents, alerts, vessel telemetry, analytics, and reports are shown in one workflow.

### Jury Questions - Quick Answers

- **Where is AI used?** The prototype represents anomaly classification and risk stages; it does not run a production ML model in the browser.
- **Why Sentinel-1 and SAR?** SAR supports broad-area observation in darkness and cloudy conditions and can reveal surface texture changes.
- **What is attribution?** A ranked estimate of which vessel best matches the spill origin evidence.
- **How is the source vessel identified?** Drift backtracking is compared with AIS trajectory intersection, timing, proximity, and behavior.
- **What happens after detection?** Operators can view the incident on the map, analyze the source, review alerts, and generate a report.
- **What is the key innovation?** Connecting satellite anomaly detection to explainable drift and vessel-correlation evidence in one workflow.
- **What is prototype/simulated?** Processing, detection overlays, AIS values, alerts, attribution scores, and environmental values are local demonstration data.
- **What would production add?** Authenticated Sentinel-1 ingestion, validated AIS providers, geospatial processing, model serving, audit storage, and authority workflows.
