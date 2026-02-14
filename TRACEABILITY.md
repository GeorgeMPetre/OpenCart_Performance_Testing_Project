# Performance Testing Traceability Matrix

This file links each performance testing scenario to its objective and execution evidence.
It provides a clear overview of what was tested and where supporting results can be found.

Detailed thresholds, parameters, and execution outcomes are maintained in the
performance test tracking file (Excel).

---

## Scenario traceability

| Scenario ID | Test Type | Purpose | Evidence | Status | Notes |
|------------|----------|---------|----------|--------|-------|
| PT-CONF-01-http | Config | HTTP baseline | HTML report |  |  |
| PT-CONF-01-https | Config | HTTPS baseline | HTML report |  |  |
| PT-CONF-02-cache-off | Config | Cache disabled impact | HTML report |  |  |
| PT-CONF-02-cache-on | Config | Cache enabled impact | HTML report |  |  |
| PT-LOAD-01 | Load | Gradual user increase | HTML report |  |  |
| PT-LOAD-02 | Load | Alternate load profile | HTML report |  |  |
| PT-STRESS-01 | Stress | Find breaking point | HTML report |  |  |
| PT-STRESS-02 | Stress | Confirm failure range | HTML report |  |  |
| PT-SPIKE-01 | Spike | Sudden traffic increase | HTML report |  |  |
| PT-SPIKE-02 | Spike | Alternate spike pattern | HTML report |  |  |
| PT-END-01 | Endurance | Long run stability | HTML report |  |  |
| PT-END-02 | Endurance | Extended endurance | HTML report |  |  |
| PT-SOAK-01 | Soak | Degradation check | HTML report |  |  |
| PT-VOL-01 | Volume | High data volume | HTML report |  |  |
| PT-VOL-02 | Volume | Alternate volume | HTML report |  |  |

---

## Status handling

- Status values are maintained in the **performance test tracking file**.
- This matrix references the latest execution state only.
- Valid status values are:
  - **PASS** – Scenario met defined thresholds
  - **FAIL** – Scenario breached one or more thresholds
  - **INFO** – Observational run, no strict pass/fail decision
  - **NOT RUN** – Scenario not executed
