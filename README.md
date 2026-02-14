 OpenCart Performance Testing Project

This repository contains a complete performance testing project for the
OpenCart e-commerce platform using Apache JMeter.

The goal of this project is to demonstrate **how to design, execute, analyse,
and document performance tests**, not to claim production-level capacity.
All tests are executed in a **local XAMPP environment**, and results are
presented with clear context and limitations.

---

## Project Objectives

- Design realistic performance scenarios for an e-commerce application
- Measure response time, error rate, and throughput
- Identify system limits in a controlled environment
- Observe behaviour under load, stress, spikes, and long-running usage
- Produce clear evidence using JMeter HTML reports
- Document results in a structured and professional way

---

## Test Coverage

The project includes the following performance test types:

- **Configuration testing**
  - HTTP vs HTTPS
  - Cache enabled vs disabled

- **Load testing**
  - Gradual increase in concurrent users
  - Identification of stable operating range

- **Stress testing**
  - Pushing beyond limits to find breaking points

- **Spike testing**
  - Sudden traffic increases and drops
  - Recovery behaviour observation

- **Endurance / Soak testing**
  - Long-running stability checks
  - Detection of degradation over time

- **Volume testing**
  - Increased data and transaction load

- **Scalability (designed)**
  - Documented but not executed due to local environment limits

---

## Tools and Technologies

- **Apache JMeter** 5.6.3
- **JMeter Plugins**
  - Concurrency Thread Group
  - AutoStop Listener
  - PerfMon Monitoring
  - Throughput Shaping Timer
- **Environment**
  - Windows
  - XAMPP (local OpenCart installation)

---

## Project Structure

OpenCart_Performance_Testing_Project/
│
├── OpenCart_Performance_Testing_Project.jmx
├── OpenCart_Performance_Test_Traking.xlsx
│
├── PT-CONF-01-http-Report/
├── PT-CONF-01-https-Report/
├── PT-CONF-02-cache-off-Report/
├── PT-CONF-02-cache-on-Report/
├── PT-LOAD-01-Report/
├── PT-LOAD-02-Report/
├── PT-STRESS-01-Report/
├── PT-STRESS-02-Report/
├── PT-SPIKE-01-Report/
├── PT-SPIKE-02-Report/
├── PT-END-01-Report/
├── PT-END-02-Report/
├── PT-SOAK-01-Report/
├── PT-VOL-01-Report/
├── PT-VOL-02-Report/
│
├── TEST_PLAN.md
├── TEST_ROADMAP.md
├── TRACEABILITY.md
└── TEST_SUMMARY.md

---

## Key Artifacts

- **JMeter Test Plan**
  - `OpenCart_Performance_Testing_Project.jmx`
  - Single JMX with multiple Thread Groups
  - Scenarios can be enabled or disabled per run

- **Tracking Spreadsheet**
  - `OpenCart_Performance_Test_Traking.xlsx`
  - Contains SLA targets, execution notes, and decisions

- **HTML Reports**
  - One report folder per scenario
  - Used as execution evidence

- **Documentation**
  - `TEST_PLAN.md` – how testing is designed and executed
  - `TEST_ROADMAP.md` – execution order and strategy
  - `TRACEABILITY.md` – scenario-to-evidence mapping
  - `TEST_SUMMARY.md` – results and conclusions

---

## Important Notes on Results

- All tests are executed on a **single local machine**
- High concurrency failures are **expected and documented**
- Results should **not** be interpreted as production benchmarks
- The value of this project is in **methodology, analysis, and transparency**

---

## How to Use This Project

1. Open the JMX file in Apache JMeter
2. Enable the scenario you want to execute
3. Run a small validation test first
4. Execute the full scenario
5. Review the generated HTML report
6. Record outcomes in the tracking spreadsheet

---

## Why This Project Matters

This repository shows:
- Structured performance testing design
- Clear scenario modelling
- Honest interpretation of results
- Professional documentation
- Real-world constraints handled correctly

It is intended as a **portfolio project** demonstrating practical
performance testing skills.

---

## Author

**George Petre**  