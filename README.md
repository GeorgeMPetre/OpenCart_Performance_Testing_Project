OpenCart Performance Testing Project

Apache JMeter 5.6.3 | Full End-to-End Performance Suite | Load - Stress - Spike - Endurance - Soak - Volume - Configuration - Scalability

1 Project Overview

This repository contains a complete, end-to-end performance testing suite for OpenCart, executed on a controlled local XAMPP environment (Apache/PHP/MySQL on Windows).
The goal of the project is to assess performance behavior across multiple workload profiles, validate system stability, and identify scalability limits using Apache JMeter 5.6.3.

The entire test suite is implemented in one JMX test plan containing structured Thread Groups for all scenarios:

Load Testing (PT-LOAD-01 / PT-LOAD-02)

Stress Testing (PT-STRESS-01 / PT-STRESS-02)

Spike Testing (PT-SPIKE-01 / PT-SPIKE-02)

Endurance Testing (PT-END-01 / PT-END-02)

Soak Testing (PT-SOAK-01)

Volume Testing (PT-VOL-01 / PT-VOL-02)

Configuration Testing (HTTP vs HTTPS, Cache ON/OFF)

Scalability (Design-only due to environment limits)

The project follows best practices in performance engineering, including SLA alignment, AutoStop thresholds, throughput monitoring, resource analysis, and IEEE-829 traceability mapping.

2. Repository Structure
/opencart-performance-testing
│
├── OpenCart_Performance_Test_Traking.csv        # Single master JMeter test plan with all scenarios
│
├── /reports                         # One representative HTML report per scenario
│   ├── PT-LOAD-01/
│   ├── PT-LOAD-02/
│   ├── PT-STRESS-01/
│   ├── PT-STRESS-02/
│   ├── PT-SPIKE-01/
│   ├── PT-SPIKE-02/
│   ├── PT-END-01/
│   ├── PT-END-02/
│   ├── PT-SOAK-01/
│   ├── PT-VOL-01/
│   ├── PT-VOL-02/
│   ├── PT-CONF-01-HTTP/
│   ├── PT-CONF-01-HTTPS/
│   ├── PT-CONF-02-CACHEOFF/
│   ├── PT-CONF-02-CACHEON/
│   ├── PT-SCALE-01/ (Not Executed - Documentation Only)
│   └── PT-SCALE-02/ (Not Executed - Documentation Only)
│
├── /traceability
│   └── Performance_Traceability_Matrix.xlsx
│
├── /data
│   └── user_data.csv (if applicable)
│
└── README.md

3. Tools & Versions
Component	Version
Apache JMeter	5.6.3
Java	Compatible with JMeter 5.6.3
Plugins Used	CAU Thread Group, AutoStop Listener, PerfMon, Throughput Shaping Timer
Environment	Windows 11, XAMPP (Apache/PHP/MySQL)


4. Installing JMeter
This repository does not include JMeter binaries (best practice).
To run this project:
Step 1 — Install JMeter 5.6.3
Download: https://jmeter.apache.org/download_jmeter.cgi
Step 2 — Install JMeter Plugin Manager
Place the .jar in /lib/ext/.
Step 3 — Install required plugins

Inside JMeter GUI:
Options → Plugins Manager → Available Plugins

Install:
jpgc-casutg (Concurrency Thread Group)
jpgc-autostop (AutoStop Listener)
jpgc-perfmon (PerfMon Metrics)
jpgc-tst (Throughput Shaping Timer)

5. How to Run the Test Plan
Run a specific scenario

Each test scenario is a separate Thread Group.

Inside OpenCart_Performance_Testing_Project:
Expand Thread Groups
Select the scenario you want (e.g., PT-LOAD-01)
Disable all other Thread Groups
Run in Non-GUI for performance:

jmeter -n -t OpenCart_Performance_Testing_Project -l results.jtl -e -o HTMLReport

6. Service Level Agreement (SLA)
Metric	Threshold
Average Response Time	≤ 3 seconds
Error Rate	≤ 1%
Throughput	Must remain stable for duration of test
Resource Utilisation	CPU < 80%, Disk I/O low, Memory stable
These SLAs are applied across all scenarios.

7. Test Scenarios Summary
Below is a summarised version based on your full matrix.

Load Tests
Test ID	Description	Result
PT-LOAD-01	Stepped load 10→100→250→500 users	Pass – SLA met
PT-LOAD-02	Steady 100-user checkout flow	Pass – SLA met

Stress Tests
Test ID	Description	Result
PT-STRESS-01	Ramp to 300 users (AutoStop)	Fail – SLA breached at 150-175 users
PT-STRESS-02	500-user spike → drop to 10	Pass – System recovered

Spike Tests
Test ID	Description	Result
PT-SPIKE-01	50 → 500 instant spike	Pass
PT-SPIKE-02	500 → 50 sudden drop	Pass

Endurance Tests
Test ID	Description	Result
PT-END-01	100 users for 3 hours	Pass
PT-END-02	50 logged-in users for 4 hours	Pass

Soak Test
Test ID	Description	Result
PT-SOAK-01	15 users for 12 hours	Pass

Volume Tests
Test ID	Description	Result
PT-VOL-01	50 users search	Pass
PT-VOL-02	500 cart items	Pass

Configuration Tests
Test ID	Description	Result
PT-CONF-01-HTTP	HTTP baseline	Pass
PT-CONF-01-HTTPS	HTTPS overhead	Pass
PT-CONF-02 (Cache OFF)	Slightly higher CPU/disk	Pass
PT-CONF-02 (Cache ON)	Improved throughput	Pass

Scalability Tests (Not Executed – Environment Limited)
Test ID	Reason
PT-SCALE-01	XAMPP cannot handle 500 users for 30 min; requires cloud/multi-node
PT-SCALE-02	Requires load balancer + distributed JMeter
Both scenarios are design-only for documentation & portfolio demonstration.

8. Traceability Matrix
A full IEEE-829 aligned matrix is included:
OpenCart_Performance_Test_Traking.csv
It maps:
Test IDs
Case IDs
Scenario
SLA thresholds
Actual results
Performance metrics
Pass/Fail decisions
Environment limitations
Comments
This demonstrates professional documentation and test governance.

9. Limitations
Due to XAMPP architecture (Apache prefork + Windows I/O + single-node MySQL):
Max sustainable concurrency ≈ 100–150 users
Stress failure zone begins at 150–175 users
500-user tests require scaled infrastructure
TLS overhead affects HTTPS performance
Local machine cannot simulate distributed load
These limitations are documented to maintain transparency and scientific reliability.

10. Conclusion
This repository provides a complete, professional-grade performance testing suite for OpenCart, featuring:
Full end-to-end flows
Multi-scenario workload modeling
SLA validation
Resource monitoring
Spike, stress, endurance, soak, and volume tests
Configuration analysis
Proper not-executed justification for scalability tests
Clean, structured documentation suitable for a portfolio
It follows industry best practices for performance engineering, reporting, and GitHub repository structure.
