# OpenCart Performance Testing – Test Plan

## 1. Purpose
This test plan explains how performance testing is carried out for the OpenCart
application in this repository. It describes what is tested, how it is tested,
the environment used, and how results are evaluated and reported.

The goal is not to simulate production at scale, but to demonstrate a clear,
structured performance testing approach using realistic scenarios.

## 2. Project Context
The tests are executed against a local OpenCart installation running on XAMPP
on a Windows machine. All performance scenarios are managed inside a single
JMeter test plan (JMX) using multiple Thread Groups.

This approach keeps the project simple, organised, and easy to maintain.

## 3. Objectives
- Validate how OpenCart behaves under different traffic patterns.
- Measure response times, error rates, and throughput.
- Identify limits of the application in a local environment.
- Observe recovery behaviour after sudden load changes.
- Collect clear evidence using JMeter HTML reports.

## 4. Scope

### In scope
- Configuration comparisons (HTTP vs HTTPS, cache on vs off).
- Load testing.
- Stress testing.
- Spike testing.
- Endurance and soak testing.
- Volume testing.
- Monitoring via JMeter plugins.

### Out of scope
- Production capacity planning.
- Distributed or cloud-based load testing.

## 5. Test Environment
- Load generator and application under test were hosted on separate machines.
- Operating system: Windows
- Web stack: XAMPP (local)
- Tool: Apache JMeter 5.6.3
- Plugins used:
  - Concurrency Thread Group
  - AutoStop Listener
  - PerfMon
  - Throughput Shaping Timer

## 6. Test Design
Each performance scenario is implemented as a separate Thread Group within the
same JMX file. Scenarios can be enabled or disabled depending on the test run.

Detailed parameters such as user count, ramp-up, duration, and timers are
documented in the tracking spreadsheet.

## 7. SLAs and Evaluation
Each scenario is evaluated based on:
- Response time
- Error percentage
- Throughput stability
- Basic system resource behaviour

Exact SLA values and outcomes are recorded in:
`OpenCart_Performance_Test_Traking.xlsx`

## 8. Test Execution
1. Verify OpenCart and XAMPP are running correctly.
2. Run a small validation test to confirm scripts work.
3. Execute scenarios following the test roadmap.
4. Generate and store HTML reports per scenario.
5. Record results and observations in the tracking file.

## Risks and mitigations

- Local machine resources may become a bottleneck  
  Mitigation: Tests were executed using two separate machines (client and server) to reduce resource contention. CPU, memory, disk, and network usage were monitored during execution to support correct interpretation of results.

- Workload patterns may not reflect real user behaviour  
  Mitigation: Realistic user journeys, ramp-up patterns, and think times were applied to better simulate actual usage.

- Using static test data may distort results  
  Mitigation: Dynamic data and multiple users were used where possible to reduce caching and session bias.

- The test environment is not production-like  
  Mitigation: Results are treated as baseline indicators only, and environment limitations are clearly documented.

- Limited monitoring can hide root causes of failures  
  Mitigation: Response times, throughput, error rates, and server-side resource metrics were captured and reviewed.


## 10. Deliverables
- JMeter test plan (JMX)
- HTML performance reports
- Tracking spreadsheet
- Supporting documentation files

## 11. Ownership
All tests, analysis, and documentation are created and maintained by
George Petre.
