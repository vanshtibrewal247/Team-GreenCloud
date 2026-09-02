# 🌱 GreenCloud

## Forecast-Driven Carbon-Aware Task Offloading in Edge-Cloud Computing

GreenCloud is a research project that investigates **forecast-driven, carbon-aware task offloading in collaborative edge-cloud environments**.

The project builds on the **Dynamic Workload Power Allocation (DWPA)** approach proposed by Chen et al. (2026) and extends the idea by introducing **workload forecasting** into the task-offloading decision process.

The goal is to determine whether having information about **future workload conditions** can improve task placement compared with a scheduler that only reacts to the current system state.

---

# 📌 Problem Statement

Modern edge-cloud systems consist of multiple geographically distributed edge servers connected to cloud infrastructure.

IoT devices continuously generate computational tasks, and these tasks can potentially be processed at:

- The local edge server
- Another edge server
- A central cloud server

The challenge is deciding **where and when each task should be processed**.

A good decision must consider several factors:

- Current workload
- Future workload
- Queue backlog
- Carbon intensity
- Energy consumption
- Network latency
- Available computing resources

The workload arriving at edge servers is dynamic and can change significantly over time.

Therefore, a scheduling decision that is optimal for the **current state** may not remain optimal in the near future.

---

# 🔴 The Limitation of Reactive Scheduling

The base paper proposes **DWPA (Dynamic Workload Power Allocation)**.

DWPA combines:

- Local processing
- Horizontal/peer edge-to-edge offloading
- Vertical edge-to-cloud offloading

and uses a Lyapunov optimization-based approach to balance carbon emissions and queue stability.

However, DWPA is **reactive**.

It primarily makes decisions based on:

```text
Current Queue
      +
Current System State
      +
Current Carbon Intensity
      ↓
Offloading Decision
```

It does not explicitly forecast future workload.

The exponential moving average used in the base paper estimates the present carbon intensity; it is not a future workload forecasting mechanism.

---

# 🟢 GreenCloud's Research Idea

GreenCloud introduces a **forecasting layer** before the scheduling decision.

Instead of only asking:

> "What is happening right now?"

GreenCloud additionally asks:

> "What is likely to happen next?"

The resulting architecture is:

```text
                 Current System State
                         │
                         ▼
                  ┌─────────────┐
                  │ Forecasting │
                  │    Layer    │
                  └──────┬──────┘
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
              ┌──────────┼──────────┐
              ▼          ▼          ▼
            Local       Peer       Cloud
```

The predicted workload becomes an additional input to the task-placement decision.

The project document identifies this forecasting layer as the primary novelty of GreenCloud over the reactive DWPA approach.

---

# 🎯 Research Question

The central research question is:

> **Does incorporating workload forecasting into task-offloading decisions reduce carbon emissions in an edge-cloud system compared to an approach that only reacts to the current system state, while keeping latency and queue stability within acceptable bounds?**

---

# 🧠 GreenCloud Approach

GreenCloud separates the system into two major components:

```text
┌───────────────────────────────┐
│       Machine Learning        │
│                               │
│     Workload Forecasting      │
└───────────────┬───────────────┘
                │
                │ Predicted Workload
                ▼
┌───────────────────────────────┐
│         EdgeCloudSim          │
│                               │
│  Edge + Cloud Environment     │
│  Task Generation              │
│  Network                      │
│  Queues                       │
│  Task Execution               │
└───────────────────────────────┘
```

The Machine Learning component provides **future workload information**.

EdgeCloudSim provides the **simulation environment** in which the scheduling decisions are executed and evaluated.

---

# 🏗️ System Architecture

```text
                         IoT Devices
                              │
                              │ Task Arrival
                              ▼
                    ┌──────────────────┐
                    │   Edge Server    │
                    │                  │
                    │ Current Queue    │
                    │ Current Load     │
                    └────────┬─────────┘
                             │
                             │ Workload History
                             ▼
                    ┌──────────────────┐
                    │ Machine Learning │
                    │                  │
                    │ Forecasting      │
                    └────────┬─────────┘
                             │
                             │ Future Load
                             ▼
                    ┌──────────────────┐
                    │    GreenCloud    │
                    │    Scheduler     │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
          Local          Peer Edge        Cloud
        Processing       Offloading      Offloading
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                       Task Execution
                             │
                             ▼
                        Evaluation
```

---

# 🌐 Edge-Cloud Environment

The system consists of:

- Multiple geographically distributed edge servers
- IoT devices generating computational tasks
- A central cloud server
- Communication links between devices and edge servers
- Communication between edge servers
- Edge-to-cloud communication

The base paper evaluates a system containing **five edge servers and one cloud center**, with real historical carbon-intensity data for the corresponding locations.

GreenCloud uses the same general collaborative edge-cloud concept while introducing forecasting into the decision process.

---

# 🔄 Task Offloading

Every incoming task has three possible execution directions:

### 1. Local Processing

The task remains on the edge server where it arrived.

```text
IoT Device
    │
    ▼
Edge Server
    │
    ▼
Execute Locally
```

### 2. Horizontal / Peer Offloading

The task is transferred to another edge server.

```text
Edge A
  │
  │ Task
  ▼
Edge B
```

This can be useful when another edge server has more available resources or a more favorable operating condition.

### 3. Vertical / Cloud Offloading

The task is transferred to the central cloud.

```text
Edge Server
     │
     │ Task
     ▼
   Cloud
```

GreenCloud maintains this three-way placement model from the base approach.

---

# ⚡ Why Carbon Awareness?

Electricity is not equally carbon-intensive everywhere or at every time.

Carbon intensity can vary depending on the local electricity generation mix.

For example:

```text
Location A
Carbon Intensity = Low

Location B
Carbon Intensity = High
```

If a task can be executed at either location, the scheduler may prefer the location with lower carbon impact, provided other constraints such as latency and resource availability remain acceptable.

The base paper explicitly considers changing carbon intensity across geographically distributed locations.

---

# 🔮 Why Forecasting?

Consider two edge servers.

### Current state

```text
Edge A → 40% Load
Edge B → 30% Load
```

A purely reactive scheduler may prefer Edge B because it currently has lower load.

But suppose the workload forecast is:

```text
             Current     Future

Edge A         40%         50%
Edge B         30%         90%
```

A predictive scheduler can recognize that sending additional work to Edge B may contribute to future congestion.

Therefore:

```text
Reactive:

Current State
     ↓
Decision


Predictive:

Current State
     +
Future Prediction
     ↓
Decision
```

GreenCloud investigates whether this additional information leads to better overall scheduling decisions.

---

# 🖥️ Why EdgeCloudSim?

GreenCloud uses **EdgeCloudSim** as the simulation environment because the research problem is fundamentally an **edge-cloud task-offloading problem**, rather than a conventional centralized cloud scheduling problem.

A simplified CloudSim-oriented environment is generally represented as:

```text
Users
  │
  ▼
Cloud Datacenter
  │
  ▼
VMs
  │
  ▼
Tasks
```

Our required environment is:

```text
             IoT Devices
              /   |   \
             /    |    \
            ▼     ▼     ▼
         Edge 1 Edge 2 Edge 3
            │     │     │
            └──┬──┴──┬──┘
               │     │
          Peer Offloading
               │
               ▼
             Cloud
```

The second architecture requires the simulation of an edge layer, dynamic task arrivals, network interactions, multiple edge nodes, and edge-to-edge as well as edge-to-cloud offloading.

Therefore, EdgeCloudSim provides a more appropriate foundation for evaluating GreenCloud.

---

# 🔬 What EdgeCloudSim Does

EdgeCloudSim is responsible for simulating the environment:

```text
Task Generation
      ↓
Edge Servers
      ↓
Queues
      ↓
Network
      ↓
Offloading
      ↓
Task Execution
      ↓
Metrics
```

It provides the environment in which GreenCloud's scheduling decisions can be evaluated.

---

# 🤖 What Machine Learning Does

The Machine Learning component has a focused responsibility:

```text
Historical Workload
        ↓
Learn Workload Patterns
        ↓
Predict Future Workload
        ↓
GreenCloud Scheduler
```

Machine Learning does **not** directly decide:

- Which edge server executes a task
- Whether to use the cloud
- How tasks are transmitted
- How the network is simulated

Instead:

> **Machine Learning provides the prediction, while the GreenCloud scheduler uses that prediction to make the offloading decision.**

---

# ⚙️ Decision Process

Conceptually, GreenCloud considers:

```text
Current Load
      +
Predicted Load
      +
Carbon Information
      +
Energy
      +
Latency
      ↓
Candidate Evaluation
      ↓
Offloading Decision
      ↓
Local / Peer / Cloud
```

The project document describes GreenCloud as using current load, predicted future load, carbon, energy, and latency in its placement decision.

---

# 🆚 GreenCloud vs DWPA

| Feature | DWPA | GreenCloud |
|---|---|---|
| Current workload | ✅ | ✅ |
| Queue information | ✅ | ✅ |
| Carbon awareness | ✅ | ✅ |
| Local processing | ✅ | ✅ |
| Peer offloading | ✅ | ✅ |
| Cloud offloading | ✅ | ✅ |
| Future workload prediction | ❌ | ✅ |
| Forecasting layer | ❌ | ✅ |
| Reactive decision | ✅ | Partially |
| Predictive decision | ❌ | ✅ |

The key difference is therefore **not replacing DWPA's edge-cloud architecture**, but investigating whether adding foresight through workload prediction can improve the scheduling process.

---

# 📊 Evaluation

GreenCloud will evaluate scheduling performance using metrics such as:

### Carbon Emissions

Total carbon impact associated with computation and communication.

### Energy Consumption

Energy consumed by the infrastructure.

### Latency

Time required for tasks and associated communication.

### Queue Stability

How effectively the system prevents queues from becoming excessively large.

### Task Completion

The ability of the system to successfully process incoming tasks.

The base paper emphasizes the trade-off between carbon emissions and queue stability, and GreenCloud extends this investigation by introducing future workload information.

---

# 🧪 Baseline Comparison

GreenCloud will be evaluated against multiple scheduling approaches.

The planned comparison includes:

```text
Round Robin
     │
CPU-Aware
     │
Carbon-Aware
     │
Threshold-Based
     │
DWPA-Style Reactive Baseline
     │
     ▼
GreenCloud
```

The purpose is to determine whether the addition of workload forecasting provides a measurable improvement over both simple scheduling strategies and a strong reactive carbon-aware baseline.

---

# 📁 Repository Structure

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

## MachineLearning/

Responsible for:

```text
Workload Data
     ↓
Preprocessing
     ↓
Forecasting
     ↓
Future Workload
```

## EdgeCloudSim/

Responsible for:

```text
IoT Devices
     ↓
Task Generation
     ↓
Edge/Cloud Environment
     ↓
GreenCloud Scheduling
     ↓
Task Execution
     ↓
Performance Evaluation
```

---

# 🔗 Overall Project Flow

The complete GreenCloud workflow is:

```text
                    ┌───────────────┐
                    │ IoT Workload  │
                    └───────┬───────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  EdgeCloudSim    │
                  │                  │
                  │ Current State    │
                  └────────┬─────────┘
                           │
                           │ Historical/
                           │ Current Workload
                           ▼
                  ┌──────────────────┐
                  │ Machine Learning │
                  │                  │
                  │ Workload         │
                  │ Forecasting      │
                  └────────┬─────────┘
                           │
                           │ Predicted Load
                           ▼
                  ┌──────────────────┐
                  │   GreenCloud     │
                  │    Scheduler     │
                  └────────┬─────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
           Local         Peer         Cloud
              │            │            │
              └────────────┼────────────┘
                           ▼
                    Task Execution
                           │
                           ▼
                       Metrics
                           │
                           ▼
                     Comparison
```

---

# 🎯 Expected Contribution

GreenCloud investigates whether **forecasting future workload can improve carbon-aware edge-cloud task offloading**.

The intended contribution is:

```text
Reactive Scheduling
       +
Future Workload Information
       ↓
Forecast-Driven Scheduling
       ↓
Potentially Better
Carbon / Latency / Queue Trade-off
```

The project does not assume beforehand that prediction will necessarily outperform the reactive approach.

Instead, the experimental evaluation is designed to **test this hypothesis quantitatively**.

---

# 📚 Base Paper

**Chen, P.-C.; Yen, L.-H.; Chen, Y.-W.; Jin, Z.-Y.; Tseng, C.-C. (2026).**

**"Dynamic Carbon-Aware Hybrid Task Offloading for Collaborative Edge-Cloud Computing."**

2026 IEEE Wireless Communications and Networking Conference (WCNC).

**DOI:** `10.1109/WCNC65185.2026.11555269`

The base paper proposes DWPA, a dynamic workload power allocation approach that combines local, horizontal peer, and vertical cloud offloading using Lyapunov optimization.

---

# 🚧 Project Status

**Research Prototype — Under Development**

### Completed / Defined

- [x] Research problem identified
- [x] DWPA base approach analyzed
- [x] Research gap identified
- [x] GreenCloud architecture defined
- [x] Machine Learning + EdgeCloudSim separation defined

### In Progress

- [ ] EdgeCloudSim environment
- [ ] Task generation
- [ ] Edge server configuration
- [ ] Workload dataset preparation
- [ ] Workload forecasting module
- [ ] GreenCloud scheduler
- [ ] Baseline implementations
- [ ] Carbon-aware evaluation
- [ ] Performance experiments
- [ ] Result analysis

---

# 🌱 GreenCloud in One Sentence

> **GreenCloud extends reactive carbon-aware edge-cloud scheduling with workload forecasting, enabling the scheduler to consider not only the current system state but also predicted future workload when deciding where tasks should execute.**