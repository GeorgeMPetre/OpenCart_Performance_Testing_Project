# OpenCart Performance Testing – Test Summary

## Overview
This project demonstrates performance testing for an OpenCart application using
Apache JMeter. All tests are executed locally using XAMPP and are designed to
show methodology, analysis, and reporting rather than production capacity.

## What Was Tested
- Configuration impact (HTTP/HTTPS, cache).
- Load handling under gradual growth.
- Behaviour under extreme stress.
- Recovery after sudden spikes.
- Stability during long-running tests.
- Performance under higher data volume.

## Environment Notes
- Load generator and application under test were hosted on separate machines.

## Key Observations
- The application remained stable during moderate load tests.
- Stress tests clearly exposed system limits.
- Spike tests showed recovery once load was reduced.
- Endurance and soak tests did not show clear degradation within the test window.
- Scalability testing was designed but not executed due to environment limits.

## Evidence
- HTML reports stored per scenario.
- Central tracking spreadsheet with notes and decisions.
- JMeter test plan containing all scenarios.

## Conclusion
The project provides a complete, well-documented performance testing example.
It clearly shows how to design tests, execute them, analyse results, and explain
limitations in a professional and transparent way.

## Author
George Petre
