# GreenCloud — EdgeCloudSim

## Why EdgeCloudSim instead of CloudSim?

GreenCloud is a **forecast-driven, carbon-aware task-offloading framework for edge-cloud computing**.

The project requires simulating a system where IoT devices generate tasks that can be processed:

- Locally at an edge server
- At another edge server through horizontal/peer offloading
- At a central cloud through vertical offloading

Our base paper, **Dynamic Carbon-Aware Hybrid Task Offloading for Collaborative Edge-Cloud Computing (DWPA)**, follows this type of collaborative edge-cloud architecture.

For this reason, we use **EdgeCloudSim rather than standard CloudSim**.

---

## CloudSim vs EdgeCloudSim

### CloudSim

CloudSim is primarily designed for modeling and simulating **cloud computing environments**.

A typical CloudSim setup focuses on:

```text
Users
  │
  ▼
Cloud Datacenter
  │
  ▼
Virtual Machines
  │
  ▼
Tasks
```

This is useful for studying:

- Cloud resource allocation
- VM provisioning
- Cloud scheduling
- Datacenter performance
- VM migration

However, our research requires more than a traditional centralized cloud environment.

---

### EdgeCloudSim

EdgeCloudSim extends the CloudSim ecosystem for **edge computing scenarios**.

Our required architecture is closer to:

```text
                 IoT Devices
                      │
             ┌────────┼────────┐
             │        │        │
             ▼        ▼        ▼
          Edge 1   Edge 2   Edge 3
             │        │        │
             └────┬───┴───┬────┘
                  │       │
             Peer Offloading
                  │
                  ▼
              Central Cloud
```

This makes EdgeCloudSim more suitable for our research because **the edge layer is a fundamental part of the experiment rather than simply a cloud extension**.

---

# Why GreenCloud needs EdgeCloudSim

## 1. Multiple geographically distributed edge servers

The base paper models multiple edge servers distributed across different locations, connected to a central cloud.

Our simulation therefore needs to represent:

```text
IoT Devices
     │
     ├──► Edge Server 1
     ├──► Edge Server 2
     ├──► Edge Server 3
     ├──► Edge Server 4
     └──► Edge Server 5
                 │
                 ▼
             Cloud
```

EdgeCloudSim is designed specifically around this edge-cloud structure.

---

## 2. Task offloading is central to our algorithm

GreenCloud does not simply send every task to a cloud VM.

For each task, the scheduler can choose:

```text
             Incoming Task
                   │
                   ▼
             Current Edge
              /    |    \
             /     |     \
            ▼      ▼      ▼
         Local    Peer   Cloud
```

The base DWPA approach similarly combines:

- Local processing
- Horizontal/peer edge offloading
- Vertical edge-to-cloud offloading

Therefore, our simulator needs to model **offloading between edge nodes as well as edge-to-cloud communication**.

---

## 3. Network latency matters

An important difference between edge and cloud computing is **where the computation takes place relative to the user**.

For example:

```text
IoT Device
    │
    │  Low latency
    ▼
Nearby Edge
```

versus:

```text
IoT Device
    │
    │  Higher network distance
    ▼
Central Cloud
```

GreenCloud considers latency as one of the factors involved in the placement decision.

Therefore, the simulation must account for the network characteristics of communication between:

- IoT devices → Edge
- Edge → Edge
- Edge → Cloud

---

## 4. Edge resources are limited

Cloud datacenters generally provide large amounts of computing resources.

Edge servers are much more constrained.

For example:

```text
Cloud
████████████████████
████████████████████

Edge 1
████

Edge 2
██████

Edge 3
███
```

This makes **queue buildup and workload distribution** important.

The DWPA paper specifically considers dynamically changing task queues and workload backlogs.

GreenCloud also uses predicted future workload as an additional scheduling signal.

---

# 5. Workload forecasting + EdgeCloudSim

The main novelty of GreenCloud is the addition of a **workload forecasting layer**.

The architecture is:

```text
                  Task Arrivals
                       │
                       ▼
              ┌─────────────────┐
              │ EdgeCloudSim     │
              │ Current System   │
              │ State            │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Machine Learning │
              │ Workload         │
              │ Forecasting      │
              └────────┬────────┘
                       │
                       ▼
                Predicted Load
                       │
                       ▼
              ┌─────────────────┐
              │ GreenCloud      │
              │ Scheduler       │
              └────────┬────────┘
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
           Local      Peer      Cloud
```

The ML component predicts future workload, while EdgeCloudSim provides the environment in which the scheduling decision is evaluated.

---

# 6. Why not use CloudSim alone?

Using standard CloudSim would require us to build or significantly adapt several edge-specific components ourselves.

Our research needs:

| Requirement | CloudSim | EdgeCloudSim |
|---|---:|---:|
| Cloud datacenter simulation | ✅ | ✅ |
| VM/task simulation | ✅ | ✅ |
| Edge computing environment | Limited | ✅ |
| Multiple edge nodes | Requires additional modeling | ✅ |
| Edge-to-cloud architecture | Requires modeling | ✅ |
| Edge network behavior | Limited for our use case | ✅ |
| IoT/edge workload modeling | Not the main focus | ✅ |
| Edge task offloading | Requires implementation | Better suited |
| Edge-cloud latency evaluation | Requires additional work | Better suited |

Therefore, EdgeCloudSim allows us to spend more effort on the **research contribution — forecasting and carbon-aware scheduling — instead of rebuilding an edge simulation environment from scratch.**

---

# 7. EdgeCloudSim's role in GreenCloud

EdgeCloudSim is **not the GreenCloud algorithm**.

It is the simulation environment used to evaluate GreenCloud.

The separation is:

```text
┌─────────────────────────────────────────┐
│              GreenCloud                 │
│                                         │
│  Workload Forecasting                   │
│  Carbon-Aware Scheduler                 │
│  Offloading Decision                    │
│  Baseline Algorithms                    │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│             EdgeCloudSim                │
│                                         │
│  Edge Servers                           │
│  Cloud                                  │
│  IoT Devices                            │
│  Network                                │
│  Tasks                                  │
│  Queues                                 │
│  Simulation                             │
└─────────────────────────────────────────┘
```

---

# Research Goal

The purpose of using EdgeCloudSim is to evaluate whether **forecasting future workload can improve carbon-aware task offloading** while maintaining acceptable:

- Carbon emissions
- Energy consumption
- Latency
- Queue stability
- Task completion

The project compares GreenCloud against reactive and traditional scheduling approaches.

The base paper itself identifies that DWPA is **reactive**, using the current queue state and current estimated carbon intensity without future workload forecasting. GreenCloud adds forecasting to investigate whether this foresight improves scheduling.

---

## Project Structure

```text
GreenCloud/
│
├── README.md
│
├── MachineLearning/
│   ├── data/
│   ├── models/
│   ├── preprocessing/
│   ├── training/
│   └── prediction/
│
└── EdgeCloudSim/
    ├── src/
    ├── config/
    ├── scenarios/
    └── results/
```

### MachineLearning

Responsible for:

```text
Historical Workload
        ↓
Preprocessing
        ↓
Forecasting Model
        ↓
Predicted Future Workload
```

Potential forecasting models:

- Moving Average
- Linear Regression
- Random Forest
- LSTM

### EdgeCloudSim

Responsible for:

```text
IoT Devices
     ↓
Task Generation
     ↓
Edge Servers
     ↓
Offloading
     ↓
Cloud
     ↓
Metrics
```

---

## Summary

**CloudSim is primarily suitable for studying cloud computing environments.**

**EdgeCloudSim is more appropriate for GreenCloud because our research is fundamentally about task offloading across a distributed edge-cloud system.**

We need to model the interaction between:

> **IoT devices + multiple edge servers + edge-to-edge offloading + edge-to-cloud offloading + network latency + dynamic workloads**

EdgeCloudSim provides the simulation foundation for this environment, while **GreenCloud provides the forecasting-driven scheduling intelligence on top of it**.

---

## Research Reference

Chen, P.-C.; Yen, L.-H.; Chen, Y.-W.; Jin, Z.-Y.; Tseng, C.-C. (2026).

**"Dynamic Carbon-Aware Hybrid Task Offloading for Collaborative Edge-Cloud Computing."**

2026 IEEE Wireless Communications and Networking Conference (WCNC).

DOI: `10.1109/WCNC65185.2026.11555269`