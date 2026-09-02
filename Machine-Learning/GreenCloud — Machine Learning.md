# GreenCloud — Machine Learning

## Why Machine Learning?

GreenCloud introduces a **workload forecasting layer** into the edge-cloud task-offloading process.

The key limitation we address in the base paper is that **DWPA is reactive**. DWPA makes its decisions using the current queue backlog and current estimated carbon intensity. It does not predict how the workload of an edge server will change in the future.

GreenCloud adds a predictive layer to answer a different question:

> **Instead of reacting after an edge server becomes overloaded, can we predict future workload and make the offloading decision in advance?**

---

# Reactive vs Predictive Scheduling

## 🔴 Reactive Approach

A reactive scheduler looks at the **current state** of the system.

For example:

```text
Current Time
     │
     ▼
┌───────────────┐
│ Edge Server 1 │
│ Queue = 90    │
└───────┬───────┘
        │
        ▼
 Queue is high
        │
        ▼
 Offload task
```

The scheduler reacts **after** the queue has already increased.

Conceptually:

```text
Observe current state
        ↓
Make decision
        ↓
Workload changes
        ↓
Observe again
        ↓
Make another decision
```

This is the approach we consider for the DWPA-style reactive baseline.

---

# 🟢 Predictive Approach

GreenCloud attempts to look ahead.

Suppose the current queue is:

```text
Edge Server 1
Current Load = 40%
```

A reactive scheduler may conclude:

```text
40% → Not overloaded
     → Process locally
```

But the workload forecasting model may predict:

```text
Current Load = 40%

Predicted:
Next interval = 65%
Following interval = 90%
```

GreenCloud can therefore make a more informed decision:

```text
Current Load
     +
Predicted Future Load
     ↓
Scheduling Decision
     ↓
Offload / Process Locally
```

The objective is to avoid waiting until the server is already heavily loaded.

---

# Why Prediction Matters in Edge Computing

Edge servers have limited computational resources compared with large cloud datacenters.

Workloads can also be dynamic and bursty.

The base paper models task arrivals using an **On-Off traffic model** to represent this changing workload behavior.

Consider:

```text
Time ───────────────────────────────►

Load
100%                         ████
 80%                    █████████
 60%              ███████████████
 40%         ███████
 20%    █████
      ─────────────────────────────
       t1    t2    t3    t4    t5
```

At `t1`, the server may look perfectly healthy.

But if the system knows that a workload spike is approaching, it can begin distributing tasks before the spike occurs.

---

# Reactive Problem

Consider two edge servers:

```text
              Current Load

Edge A  ───────── 40%
Edge B  ───────── 30%
```

A reactive scheduler may choose Edge B because it currently has less workload.

However:

```text
                Current     Future
Edge A             40%        50%
Edge B             30%        95%
```

If the task is sent to Edge B, Edge B may soon become overloaded.

The decision was correct **for the current state**, but potentially poor **for the near future**.

This is the problem GreenCloud investigates.

---

# Predictive Solution

GreenCloud adds:

```text
                 Historical Workload
                         │
                         ▼
                ┌────────────────┐
                │ ML Forecasting │
                └───────┬────────┘
                        │
                        ▼
                Future Workload
                        │
                        ▼
Current Load ───────────┤
Carbon ─────────────────┤
Energy ─────────────────┤
Latency ────────────────┤
                        ▼
                GreenCloud Scheduler
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
            Local      Peer      Cloud
```

Therefore, the scheduler considers both:

**"What is happening now?"**

and

**"What is likely to happen next?"**

---

# What Are We Predicting?

The Machine Learning module focuses primarily on **future workload**.

For every edge node, we want to estimate its workload for a future time interval.

For example:

```text
Historical workload

t1 → 20%
t2 → 25%
t3 → 30%
t4 → 45%
t5 → 50%

             ↓ ML Model

Predicted workload

t6 → 60%
t7 → 75%
t8 → 85%
```

The prediction is then passed to the GreenCloud scheduler.

---

# Forecasting Pipeline

```text
              Historical Data
                    │
                    ▼
             Data Preprocessing
                    │
                    ▼
             Feature Creation
                    │
                    ▼
             Forecasting Model
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
         MA         LR        RF
                              │
                              ▼
                             LSTM
                    │
                    ▼
            Predicted Workload
                    │
                    ▼
            GreenCloud Scheduler
```

---

# Models

We plan to evaluate forecasting models progressively rather than immediately jumping to a complex deep-learning model.

## 1. Moving Average

The simplest forecasting method.

```text
Recent workloads:
40, 50, 60

Prediction:
(40 + 50 + 60) / 3
= 50
```

This gives us a simple baseline for prediction.

---

## 2. Linear Regression

Linear Regression attempts to learn a trend in historical workload.

For example:

```text
20 → 30 → 40 → 50 → ?
```

The model identifies the increasing trend and predicts the next workload value.

---

## 3. Random Forest

Random Forest can capture more complex relationships between workload-related features.

Potential features can include:

```text
Current workload
Previous workload
Recent workload history
Time-related features
Queue information
```

The exact feature set will be determined during experimentation.

---

## 4. LSTM

LSTM is considered for sequential workload data where previous observations can influence future workload.

Conceptually:

```text
Workload History
20 → 30 → 25 → 40 → 50
                       │
                       ▼
                      LSTM
                       │
                       ▼
                 Future Load
```

LSTM is therefore the more complex forecasting option in our planned progression.

The project document explicitly proposes building the forecasting component from **Moving Average through Linear Regression, Random Forest, and potentially LSTM**.

---

# Why Not Immediately Use LSTM?

The goal is not simply to use the most complicated ML model.

We need to determine whether prediction itself provides a scheduling benefit.

Therefore, we establish progressively stronger forecasting models:

```text
Simple
  │
  ▼
Moving Average
  │
  ▼
Linear Regression
  │
  ▼
Random Forest
  │
  ▼
LSTM
  │
  ▼
More Complex
```

This allows us to answer two separate questions:

1. **Does forecasting improve task offloading?**
2. **Does a more sophisticated forecasting model provide additional benefit?**

---

# Prediction Is Not the Final Decision

An important distinction:

> **Machine Learning predicts workload. It does NOT decide where the task should go.**

The ML component produces:

```text
Predicted Load = 75%
```

The scheduler then uses that information along with other factors.

For example:

```text
             ML
             │
             ▼
       Predicted Load
             │
             │
Current Load ┤
Carbon       ┤
Energy       ┤
Latency      ┤
             ▼
      GreenCloud Score
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
     Local  Peer  Cloud
```

This separation keeps the architecture clean:

```text
Machine Learning
       │
       │ Prediction
       ▼
GreenCloud Scheduler
       │
       │ Decision
       ▼
EdgeCloudSim
       │
       │ Simulation
       ▼
Performance Metrics
```

---

# Reactive vs Predictive — Core Difference

| | Reactive | Predictive |
|---|---|---|
| Current workload | ✅ | ✅ |
| Current queue | ✅ | ✅ |
| Current carbon | ✅ | ✅ |
| Future workload | ❌ | ✅ |
| Forecasting model | ❌ | ✅ |
| Anticipates workload spikes | ❌ | ✅ |
| Decision based only on present | ✅ | ❌ |
| GreenCloud | ❌ | ✅ |

The base paper describes DWPA as a reactive approach that uses current queue backlog and current estimated carbon intensity, while GreenCloud adds explicit workload forecasting.

---

# The Research Hypothesis

Our central hypothesis is:

> **Adding workload forecasting to carbon-aware task offloading can reduce carbon emissions and improve resource utilization by allowing the scheduler to anticipate future workload changes, while maintaining acceptable latency and queue stability.**

This is directly aligned with the research question defined for GreenCloud.

---

# Machine Learning Module — Final Role

The Machine Learning module has one primary responsibility:

```text
Historical Workload
        ↓
Learn Workload Pattern
        ↓
Predict Future Workload
        ↓
Send Prediction to Scheduler
```

It does **not** directly perform:

- Task offloading
- Edge selection
- Cloud selection
- Carbon optimization
- Network simulation

Those responsibilities belong to the GreenCloud scheduler and EdgeCloudSim environment.

---

# Overall GreenCloud Architecture

```text
                         ┌──────────────┐
                         │ IoT Devices  │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ EdgeCloudSim │
                         └──────┬───────┘
                                │
                    Current Workload/Queue
                                │
                                ▼
                    ┌────────────────────┐
                    │ Machine Learning   │
                    │                    │
                    │ MA / LR / RF/LSTM │
                    └─────────┬──────────┘
                              │
                       Predicted Load
                              │
                              ▼
                    ┌────────────────────┐
                    │ GreenCloud         │
                    │ Scheduler          │
                    │                    │
                    │ Load               │
                    │ Predicted Load     │
                    │ Carbon             │
                    │ Energy             │
                    │ Latency            │
                    └─────────┬──────────┘
                              │
                  ┌───────────┼───────────┐
                  ▼           ▼           ▼
               Local        Peer        Cloud
                  │           │           │
                  └───────────┼───────────┘
                              ▼
                       Task Execution
                              │
                              ▼
                         Evaluation
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
                 Carbon    Latency    Queue
                 Energy               Stability
```

---

## 📌 Key Idea

**DWPA asks:**

> "Given the state of the system right now, what should I do?"

**GreenCloud asks:**

> "Given the state of the system right now, and what I predict will happen next, what should I do?"

That **forecasting layer is the core Machine Learning contribution of GreenCloud**.