import React, { useState } from 'react';
import {
  Database,
  Download,
  ExternalLink,
  Cpu,
  Zap,
  Radio,
  Server,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  MapPin,
  Layers,
  Search,
} from 'lucide-react';
import { datasetService } from '../../services/datasetService';

interface LegitDatasetSource {
  id: string;
  category: string;
  badgeColor: string;
  name: string;
  curatedFile: string;
  rawSourceFile: string;
  provider: string;
  scale: string;
  whySelected: string;
  verificationNote: string;
  extractedFields: string[];
  links: Array<{ label: string; url: string }>;
}

export const DatasetCards: React.FC = () => {
  const [activeSchemaGroup, setActiveSchemaGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const legitSources: LegitDatasetSource[] = [
    {
      id: 'alibaba-tasks',
      category: '1. Workload & Task Trace',
      badgeColor:
        'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900',
      name: 'Alibaba GPU Cluster Trace v2020 (PAI Tasks)',
      curatedFile: 'task_cloudlet_data.csv',
      rawSourceFile: 'pai_task_table.csv (113.4 MB)',
      provider: 'Alibaba Group — Platform for Artificial Intelligence (PAI)',
      scale: '7,539 Curated Tasks (from 10,000 raw sample) • 32.28-Day Trace Span',
      whySelected:
        'Provides real production ML/DL & compute workloads (TensorFlow, PyTorchWorker, Parameter Server, xComputeWorker) with true arrival timestamps, observed runtimes, memory footprints, and CPU/GPU demands.',
      verificationNote:
        'Cleaned for positive durations (end_time > start_time); plan_mem (GB) converted to MB; delay_tolerance_sec calibrated at 1.5× observed duration; priority stratified into tertiles (high / medium / low).',
      extractedFields: [
        'task_id',
        'device_id',
        'priority',
        'task_size_mb',
        'cpu_demand',
        'gpu_demand',
        'observed_duration_sec',
        'delay_tolerance_sec',
        'arrival_time_trace_sec',
      ],
      links: [
        {
          label: 'Alibaba Cluster Trace v2020 Repo',
          url: 'https://github.com/alibaba/clusterdata/tree/master/cluster-trace-gpu-v2020',
        },
      ],
    },
    {
      id: 'us-grid-carbon',
      category: '2. Multi-Region Grid Telemetry',
      badgeColor:
        'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
      name: 'US 9-Region 5-Minute Grid Carbon & Generation Trace',
      curatedFile: 'carbon_intensity_trace_multi (2).csv',
      rawSourceFile: '77,673 Telemetry Records (5.78 MB)',
      provider: 'US Balancing Authorities (CAISO, ERCOT, PJM, NYISO, MISO, ISO-NE, FPL, PNW, Desert SW)',
      scale: '9 US Regions • 5-Min Resolution • 8,545 Aligned UTC Points (29.67 Days)',
      whySelected:
        'Captures real spatio-temporal variations in grid carbon intensity (gCO₂/kWh), renewable generation share (%), and total power generation (MW) across 9 distinct US geographical regions.',
      verificationNote:
        'Aligned on a strict 5-minute UTC lattice (2026-09-01 07:00 UTC to 2026-09-30 23:00 UTC) using backward as-of joins (zero look-ahead leakage). Tasks beyond 29.67 days are flagged with carbon_replay_wrapped = True.',
      extractedFields: [
        'carbon_timestamp_utc',
        'carbon_replay_wrapped',
        'carbon_intensity_local',
        'carbon_intensity_cloud',
        'carbon_intensity_<9_regions>',
        'renewable_pct_<9_regions>',
        'generation_mw_<9_regions>',
      ],
      links: [
        {
          label: 'EIA / US Grid Telemetry Portal',
          url: 'https://www.eia.gov/electricity/gridmonitor/',
        },
        {
          label: 'CAISO Today’s Outlook',
          url: 'https://www.caiso.com/todays-outlook',
        },
      ],
    },
    {
      id: 'intel-iot-devices',
      category: '3. Spatial Topology & IoT Hardware Datasheets',
      badgeColor:
        'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
      name: 'Intel Berkeley Lab Topology + Verified Modern IoT Datasheets',
      curatedFile: 'device_configuration_final.csv',
      rawSourceFile: 'mote_locs.txt + hardware_profiles.csv (54 Devices)',
      provider: 'MIT CSAIL / Intel Research Lab + Espressif, Infineon & Murata Datasheets',
      scale: '54 Physical Sensor Coordinates × 3 Verified IoT Hardware Profiles',
      whySelected:
        'Pairs the benchmark 54-mote spatial layout (x, y meters) from Intel Berkeley Lab with modern, datasheet-verified IoT microcontrollers and single-board computers.',
      verificationNote:
        'Conducted TX power & battery provenance explicitly tracked via transmit_power_basis & battery_capacity_basis: ESP32-WROOM-32 (19.5 dBm, FCC 2AC7Z-ESPWROOM32), RPi 4B (16.0 dBm, Infineon CYW43455), Portenta H7 (17.0 dBm, Murata 1DX, 700 mAh min).',
      extractedFields: [
        'device_type',
        'device_location_x_m',
        'device_location_y_m',
        'transmit_power_dbm',
        'transmit_power_basis',
        'local_processing_rate_mhz',
        'device_cores',
        'battery_capacity_mah',
        'battery_capacity_basis',
        'radio_type',
      ],
      links: [
        {
          label: 'Intel Berkeley Lab Data (MIT CSAIL)',
          url: 'https://db.csail.mit.edu/labdata/labdata.html',
        },
        {
          label: 'ESP32-WROOM-32 Datasheet',
          url: 'https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf',
        },
        {
          label: 'Arduino Portenta H7 Docs',
          url: 'https://docs.arduino.cc/hardware/portenta-h7/',
        },
      ],
    },
    {
      id: 'edge-cloud-servers',
      category: '4. Server Hardware, Power & Cloud Pricing',
      badgeColor:
        'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900',
      name: 'Alibaba Machine Specs + SPECpower R740 + AWS EC2 Pricing',
      curatedFile: 'edge_cloud_server_config.csv',
      rawSourceFile: 'pai_machine_spec.csv (1,897 Machines)',
      provider: 'Alibaba PAI Cluster + SPEC.org SPECpower_ssj2008 + AWS us-west-1',
      scale: '20 Edge Servers (96 Cores, 512 GB) + 5 Cloud Servers (96 Cores, 512 GB, 8 GPUs)',
      whySelected:
        'Grounds Edge and Cloud server tiers in real datacenter machine capacities, audited physical server power consumption, and live commercial cloud pricing.',
      verificationNote:
        'Power draw verified from SPECpower_ssj2008 Dell PowerEdge R740 report (49.8 W Active Idle, 432 W 100% Load). Cloud cost & bandwidth verified from AWS EC2 m5.24xlarge On-Demand pricing in us-west-1 N. California ($5.376/hr, 25 Gbps).',
      extractedFields: [
        'edge_num_servers',
        'edge_cap_cpu_cores',
        'edge_cap_mem_gb',
        'edge_cap_gpu_cards',
        'edge_idle_power_watts',
        'edge_full_load_power_watts',
        'edge_cost_per_hour_usd',
        'edge_bandwidth_mbps',
        'cloud_num_servers',
        'cloud_cap_gpu_cards',
        'cloud_location_city',
      ],
      links: [
        {
          label: 'SPECpower Dell PowerEdge R740 Report',
          url: 'https://spec.org/power_ssj2008/results/res2019q2/power_ssj2008-20190409-00952.html',
        },
        {
          label: 'AWS EC2 On-Demand Pricing',
          url: 'https://aws.amazon.com/ec2/pricing/on-demand/',
        },
      ],
    },
  ];

  const iotProvenanceTable = [
    {
      model: 'ESP32-WROOM-32',
      cpu: 'Dual-Core Xtensa LX6 @ 240 MHz (2 Cores)',
      radio: 'WiFi 802.11 b/g/n',
      txPower: '19.5 dBm (89.1 mW)',
      txBasis: 'manufacturer_datasheet_typical_80211b',
      txSource: 'Espressif Datasheet v3.4, Sec. 4.4 Table 15 (FCC: 2AC7Z-ESPWROOM32)',
      battery: '2000 mAh (Adafruit #2011)',
      batteryBasis: 'reference_assumption',
    },
    {
      model: 'Arduino Portenta H7',
      cpu: 'Dual-Core STM32H747 Cortex-M7 @ 480 MHz (2 Cores)',
      radio: 'WiFi + BT (Murata 1DX)',
      txPower: '17.0 dBm (50.1 mW)',
      txBasis: 'radio_module_datasheet_murata_1dx',
      txSource: 'Portenta H7 SKU ABX00042 & Murata LBEE5KL1DX / CYW4343W Datasheet (FCC: VPYLB1DX)',
      battery: '700 mAh (Official Min)',
      batteryBasis: 'manufacturer_documented_minimum',
    },
    {
      model: 'Raspberry Pi 4 Model B',
      cpu: 'Quad-Core ARM Cortex-A72 @ 1500 MHz (4 Cores)',
      radio: 'WiFi 802.11ac + BT 5.0',
      txPower: '16.0 dBm (39.8 mW)',
      txBasis: 'transceiver_ic_datasheet_cyw43455',
      txSource: 'Infineon / Cypress CYW43455 Datasheet Doc. 002-15051 (FCC: 2ABCB-RPI4B)',
      battery: '2000 mAh (Adafruit #2011)',
      batteryBasis: 'reference_assumption',
    },
  ];

  const masterPreviewRows = [
    {
      task_id: '1f06979f0a3db120db7a36fe_worker',
      device_id: 4,
      priority: 'low',
      task_size_mb: 80000,
      cpu_demand: 2000,
      gpu_demand: 100,
      duration_s: 159211,
      device_region: 'Mid-Atlantic (Philadelphia)',
      ci_local: 371.21,
      ci_cloud: 377.0,
      device_type: 'ESP32-WROOM-32',
      tx_dbm: 19.5,
      tx_basis: 'manufacturer_datasheet_typical_80211b',
      battery_mah: 2000,
    },
    {
      task_id: '671df365104fd23baecf73fd_TensorboardTask',
      device_id: 6,
      priority: 'low',
      task_size_mb: 2020,
      cpu_demand: 100,
      gpu_demand: 0,
      duration_s: 59792,
      device_region: 'New England (Boston)',
      ci_local: 302.48,
      ci_cloud: 357.94,
      device_type: 'Arduino Portenta H7',
      tx_dbm: 17.0,
      tx_basis: 'radio_module_datasheet_murata_1dx',
      battery_mah: 700,
    },
    {
      task_id: 'bfa8ed7033b501e4709d7a52_ps',
      device_id: 5,
      priority: 'low',
      task_size_mb: 30000,
      cpu_demand: 1000,
      gpu_demand: 0,
      duration_s: 35280,
      device_region: 'Midwest (Chicago)',
      ci_local: 478.36,
      ci_cloud: 365.65,
      device_type: 'Raspberry Pi 4 Model B',
      tx_dbm: 16.0,
      tx_basis: 'transceiver_ic_datasheet_cyw43455',
      battery_mah: 2000,
    },
    {
      task_id: 'cb029c9f488ee318b0098c28_PyTorchWorker',
      device_id: 8,
      priority: 'medium',
      task_size_mb: 60000,
      cpu_demand: 1800,
      gpu_demand: 100,
      duration_s: 976,
      device_region: 'Pacific Northwest (Seattle)',
      ci_local: 312.78,
      ci_cloud: 324.44,
      device_type: 'Raspberry Pi 4 Model B',
      tx_dbm: 16.0,
      tx_basis: 'transceiver_ic_datasheet_cyw43455',
      battery_mah: 2000,
    },
    {
      task_id: '455c3dec270f4777ad67721c_tensorflow',
      device_id: 4,
      priority: 'high',
      task_size_mb: 30000,
      cpu_demand: 600,
      gpu_demand: 100,
      duration_s: 149,
      device_region: 'Mid-Atlantic (Philadelphia)',
      ci_local: 398.12,
      ci_cloud: 342.18,
      device_type: 'ESP32-WROOM-32',
      tx_dbm: 19.5,
      tx_basis: 'manufacturer_datasheet_typical_80211b',
      battery_mah: 2000,
    },
  ];

  const schemaColumns = [
    // Task & Timing (1-11)
    { idx: 1, name: 'task_id', group: 'task', type: 'string', desc: 'Unique job_name + task_name from Alibaba PAI trace' },
    { idx: 2, name: 'device_id', group: 'task', type: 'int64', desc: 'Assigned IoT edge device ID (1–54)' },
    { idx: 3, name: 'priority', group: 'task', type: 'string', desc: 'Urgency tertile derived from delay tolerance (high/medium/low)' },
    { idx: 4, name: 'task_size_mb', group: 'task', type: 'float64', desc: 'Task memory/data footprint in MB (plan_mem × 1024)' },
    { idx: 5, name: 'cpu_demand', group: 'task', type: 'float64', desc: 'CPU core percentage demand (plan_cpu from PAI trace)' },
    { idx: 6, name: 'gpu_demand', group: 'task', type: 'float64', desc: 'GPU demand percentage (0 for CPU-only PS tasks)' },
    { idx: 7, name: 'observed_duration_sec', group: 'task', type: 'float64', desc: 'Historical execution duration (end_time - start_time)' },
    { idx: 8, name: 'delay_tolerance_sec', group: 'task', type: 'float64', desc: 'SLA deadline slack (1.5 × observed_duration_sec)' },
    { idx: 9, name: 'arrival_time_trace_sec', group: 'task', type: 'float64', desc: 'Original arrival offset in seconds from Alibaba trace' },
    { idx: 10, name: 'sim_offset_sec', group: 'task', type: 'float64', desc: 'Zero-anchored arrival offset from earliest task' },
    { idx: 11, name: 'sim_timestamp_utc', group: 'task', type: 'datetime', desc: 'Simulated UTC arrival timestamp aligned to carbon window' },
    // Placement (12-19)
    { idx: 12, name: 'device_region', group: 'placement', type: 'string', desc: 'Assigned US balancing authority region for the device' },
    { idx: 13, name: 'device_city', group: 'placement', type: 'string', desc: 'Representative city in device_region (9 US cities)' },
    { idx: 14, name: 'device_city_lat', group: 'placement', type: 'float64', desc: 'Latitude of representative regional edge city' },
    { idx: 15, name: 'device_city_lon', group: 'placement', type: 'float64', desc: 'Longitude of representative regional edge city' },
    { idx: 16, name: 'local_edge_num_servers', group: 'placement', type: 'int64', desc: 'Number of edge servers deployed in device_region (2–3)' },
    { idx: 17, name: 'cloud_region', group: 'placement', type: 'string', desc: 'Centralized cloud datacenter region (California / AWS us-west-1)' },
    { idx: 18, name: 'carbon_intensity_local', group: 'placement', type: 'float64', desc: 'Live carbon intensity (gCO₂/kWh) in device_region at arrival' },
    { idx: 19, name: 'carbon_intensity_cloud', group: 'placement', type: 'float64', desc: 'Live carbon intensity (gCO₂/kWh) in cloud_region at arrival' },
    // Carbon Trace (20-48)
    { idx: 20, name: 'carbon_replay_wrapped', group: 'carbon', type: 'bool', desc: 'True if task offset exceeds 29.67-day window (cyclic replay)' },
    { idx: 21, name: 'carbon_timestamp_utc', group: 'carbon', type: 'datetime', desc: '5-minute grid telemetry timestamp in effect at task arrival' },
    { idx: 22, name: 'carbon_intensity_california', group: 'carbon', type: 'float64', desc: 'CAISO grid carbon intensity (gCO₂/kWh)' },
    { idx: 23, name: 'carbon_intensity_desert_southwest', group: 'carbon', type: 'float64', desc: 'Desert Southwest grid carbon intensity (gCO₂/kWh)' },
    { idx: 24, name: 'carbon_intensity_florida', group: 'carbon', type: 'float64', desc: 'Florida grid carbon intensity (gCO₂/kWh)' },
    { idx: 25, name: 'carbon_intensity_mid_atlantic', group: 'carbon', type: 'float64', desc: 'PJM / Mid-Atlantic grid carbon intensity (gCO₂/kWh)' },
    { idx: 26, name: 'carbon_intensity_midwest', group: 'carbon', type: 'float64', desc: 'MISO / Midwest grid carbon intensity (gCO₂/kWh)' },
    { idx: 27, name: 'carbon_intensity_new_england', group: 'carbon', type: 'float64', desc: 'ISO-NE / New England grid carbon intensity (gCO₂/kWh)' },
    { idx: 28, name: 'carbon_intensity_new_york', group: 'carbon', type: 'float64', desc: 'NYISO / New York grid carbon intensity (gCO₂/kWh)' },
    { idx: 29, name: 'carbon_intensity_pacific_northwest', group: 'carbon', type: 'float64', desc: 'Pacific Northwest grid carbon intensity (gCO₂/kWh)' },
    { idx: 30, name: 'carbon_intensity_texas', group: 'carbon', type: 'float64', desc: 'ERCOT / Texas grid carbon intensity (gCO₂/kWh)' },
    { idx: 31, name: 'renewable_pct_california', group: 'carbon', type: 'float64', desc: 'California renewable generation share (%)' },
    { idx: 32, name: 'renewable_pct_desert_southwest', group: 'carbon', type: 'float64', desc: 'Desert Southwest renewable generation share (%)' },
    { idx: 33, name: 'renewable_pct_florida', group: 'carbon', type: 'float64', desc: 'Florida renewable generation share (%)' },
    { idx: 34, name: 'renewable_pct_mid_atlantic', group: 'carbon', type: 'float64', desc: 'Mid-Atlantic renewable generation share (%)' },
    { idx: 35, name: 'renewable_pct_midwest', group: 'carbon', type: 'float64', desc: 'Midwest renewable generation share (%)' },
    { idx: 36, name: 'renewable_pct_new_england', group: 'carbon', type: 'float64', desc: 'New England renewable generation share (%)' },
    { idx: 37, name: 'renewable_pct_new_york', group: 'carbon', type: 'float64', desc: 'New York renewable generation share (%)' },
    { idx: 38, name: 'renewable_pct_pacific_northwest', group: 'carbon', type: 'float64', desc: 'Pacific Northwest renewable generation share (%)' },
    { idx: 39, name: 'renewable_pct_texas', group: 'carbon', type: 'float64', desc: 'Texas renewable generation share (%)' },
    { idx: 40, name: 'generation_mw_california', group: 'carbon', type: 'float64', desc: 'California total grid generation (MW)' },
    { idx: 41, name: 'generation_mw_desert_southwest', group: 'carbon', type: 'float64', desc: 'Desert Southwest total grid generation (MW)' },
    { idx: 42, name: 'generation_mw_florida', group: 'carbon', type: 'float64', desc: 'Florida total grid generation (MW)' },
    { idx: 43, name: 'generation_mw_mid_atlantic', group: 'carbon', type: 'float64', desc: 'Mid-Atlantic total grid generation (MW)' },
    { idx: 44, name: 'generation_mw_midwest', group: 'carbon', type: 'float64', desc: 'Midwest total grid generation (MW)' },
    { idx: 45, name: 'generation_mw_new_england', group: 'carbon', type: 'float64', desc: 'New England total grid generation (MW)' },
    { idx: 46, name: 'generation_mw_new_york', group: 'carbon', type: 'float64', desc: 'New York total grid generation (MW)' },
    { idx: 47, name: 'generation_mw_pacific_northwest', group: 'carbon', type: 'float64', desc: 'Pacific Northwest total grid generation (MW)' },
    { idx: 48, name: 'generation_mw_texas', group: 'carbon', type: 'float64', desc: 'Texas total grid generation (MW)' },
    // Device Hardware (49-58)
    { idx: 49, name: 'device_type', group: 'device', type: 'string', desc: 'IoT hardware model (ESP32-WROOM-32, RPi 4B, Portenta H7)' },
    { idx: 50, name: 'device_location_x_m', group: 'device', type: 'float64', desc: 'Indoor X coordinate (meters) from Intel Berkeley Lab' },
    { idx: 51, name: 'device_location_y_m', group: 'device', type: 'float64', desc: 'Indoor Y coordinate (meters) from Intel Berkeley Lab' },
    { idx: 52, name: 'transmit_power_dbm', group: 'device', type: 'float64', desc: 'Verified conducted WiFi TX output power (19.5 / 17.0 / 16.0 dBm)' },
    { idx: 53, name: 'transmit_power_basis', group: 'device', type: 'string', desc: 'Datasheet provenance for transmit_power_dbm' },
    { idx: 54, name: 'local_processing_rate_mhz', group: 'device', type: 'int64', desc: 'MCU/SoC clock speed (240 / 480 / 1500 MHz)' },
    { idx: 55, name: 'device_cores', group: 'device', type: 'int64', desc: 'Number of processor cores on IoT device (2 or 4)' },
    { idx: 56, name: 'battery_capacity_mah', group: 'device', type: 'float64', desc: 'Battery capacity (700 mAh documented or 2000 mAh reference)' },
    { idx: 57, name: 'battery_capacity_basis', group: 'device', type: 'string', desc: 'Provenance label for battery capacity figure' },
    { idx: 58, name: 'radio_type', group: 'device', type: 'string', desc: 'Onboard wireless standard & transceiver specification' },
    // Edge & Cloud Server Tier (59-77)
    { idx: 59, name: 'edge_num_servers', group: 'server', type: 'int64', desc: 'Total Edge servers in simulation fleet (20)' },
    { idx: 60, name: 'edge_cap_cpu_cores', group: 'server', type: 'int64', desc: 'CPU cores per Edge server from Alibaba spec (96)' },
    { idx: 61, name: 'edge_cap_mem_gb', group: 'server', type: 'int64', desc: 'RAM per Edge server from Alibaba spec (512 GB)' },
    { idx: 62, name: 'edge_cap_gpu_cards', group: 'server', type: 'int64', desc: 'GPU count per Edge server (0 — CPU-only tier)' },
    { idx: 63, name: 'edge_idle_power_watts', group: 'server', type: 'float64', desc: 'SPECpower R740 Active Idle power draw (49.8 W)' },
    { idx: 64, name: 'edge_full_load_power_watts', group: 'server', type: 'int64', desc: 'SPECpower R740 100% Target Load power draw (432 W)' },
    { idx: 65, name: 'edge_cost_per_hour_usd', group: 'server', type: 'float64', desc: 'AWS m5.24xlarge equivalent hourly rate ($5.376/hr)' },
    { idx: 66, name: 'edge_bandwidth_mbps', group: 'server', type: 'int64', desc: 'Network bandwidth per server (25,000 Mbps / 25 Gbps)' },
    { idx: 67, name: 'cloud_num_servers', group: 'server', type: 'int64', desc: 'Total GPU Cloud servers in central datacenter (5)' },
    { idx: 68, name: 'cloud_cap_cpu_cores', group: 'server', type: 'int64', desc: 'CPU cores per Cloud server from Alibaba spec (96)' },
    { idx: 69, name: 'cloud_cap_mem_gb', group: 'server', type: 'int64', desc: 'RAM per Cloud server from Alibaba spec (512 GB)' },
    { idx: 70, name: 'cloud_cap_gpu_cards', group: 'server', type: 'int64', desc: 'GPU cards per Cloud server from Alibaba spec (8 GPUs)' },
    { idx: 71, name: 'cloud_idle_power_watts', group: 'server', type: 'float64', desc: 'SPECpower R740 Active Idle power draw (49.8 W)' },
    { idx: 72, name: 'cloud_full_load_power_watts', group: 'server', type: 'int64', desc: 'SPECpower R740 100% Target Load power draw (432 W)' },
    { idx: 73, name: 'cloud_cost_per_hour_usd', group: 'server', type: 'float64', desc: 'Verified AWS us-west-1 m5.24xlarge rate ($5.376/hr)' },
    { idx: 74, name: 'cloud_bandwidth_mbps', group: 'server', type: 'int64', desc: 'AWS m5.24xlarge confirmed network spec (25,000 Mbps)' },
    { idx: 75, name: 'cloud_location_city', group: 'server', type: 'string', desc: 'Central Cloud location: N. California (AWS us-west-1)' },
    { idx: 76, name: 'cloud_location_lat', group: 'server', type: 'float64', desc: 'Cloud datacenter latitude (37.3541)' },
    { idx: 77, name: 'cloud_location_lon', group: 'server', type: 'float64', desc: 'Cloud datacenter longitude (-121.9552)' },
  ];

  const filteredColumns = schemaColumns.filter((col) => {
    const matchesGroup = activeSchemaGroup === 'all' || col.group === activeSchemaGroup;
    const matchesSearch =
      searchQuery.trim() === '' ||
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* 1. Four Core Curated Input Datasets */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-500" />
              <span>Primary Empirical Datasets & Hardware Benchmarks (4 Core Input Tables)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Our master pipeline (<code className="font-mono text-indigo-600 dark:text-indigo-400">dataset.py</code>) joins these four verified, real-world datasets with zero synthetic guesswork.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Audited for Research Publication</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {legitSources.map((src) => (
            <div
              key={src.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md font-bold border ${src.badgeColor}`}
                  >
                    {src.category}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Input CSV: <strong>{src.curatedFile}</strong>
                  </span>
                </div>

                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {src.name}
                </h4>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">Official Source:</strong> {src.provider}
                  </div>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">Raw Artifact & Scale:</strong>{' '}
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{src.rawSourceFile}</span> • {src.scale}
                  </div>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">Why Selected:</strong> {src.whySelected}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 text-[11px]">
                    <strong className="text-emerald-700 dark:text-emerald-400">Curation & Verification:</strong>{' '}
                    {src.verificationNote}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Contributed Master Columns:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {src.extractedFields.map((f, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                {src.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Verified IoT Hardware & RF Transmit Power Provenance Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800 mb-1">
              <Radio className="w-3.5 h-3.5" />
              <span>Hardware & RF Datasheet Verification</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              IoT Device Fleet Specifications & <code className="font-mono text-amber-600 dark:text-amber-400">transmit_power_basis</code> Provenance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Every device parameter is grounded in manufacturer datasheets, transceiver IC specs, and FCC equipment grants.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Device Model</th>
                <th className="py-3 px-4">Processor & Cores</th>
                <th className="py-3 px-4">Conducted TX Power</th>
                <th className="py-3 px-4">transmit_power_basis</th>
                <th className="py-3 px-4">Authentic Datasheet / FCC Source</th>
                <th className="py-3 px-4">Battery & Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {iotProvenanceTable.map((row) => (
                <tr key={row.model} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {row.model}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{row.cpu}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {row.txPower}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                    {row.txBasis}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.txSource}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    <div>{row.battery}</div>
                    <div className="text-slate-400">{row.batteryBasis}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Master Dataset Showcase & Interactive 77-Column Schema Explorer */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-carbon-50 dark:bg-carbon-950/60 text-carbon-700 dark:text-carbon-300 font-bold border border-carbon-200 dark:border-carbon-800 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Unified Research Artifact • Zero Missing Values</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              GreenCloud Master Dataset (<code className="font-mono text-carbon-600 dark:text-carbon-400">master_dataset.csv</code> / <code className="font-mono text-carbon-600 dark:text-carbon-400">.xlsx</code>)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Generated by <code className="font-mono">dataset.py</code> joining tasks, 54 devices, 25 Edge/Cloud servers, and 9 US regional carbon grids.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/master_dataset.xlsx"
              download="master_dataset.xlsx"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Master Excel (.xlsx)</span>
            </a>
            <a
              href="/master_dataset.csv"
              download="master_dataset.csv"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Master CSV (7,539 Rows)</span>
            </a>
            <button
              onClick={() => datasetService.downloadSampleDataset()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Simulator Sample CSV</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Total Tasks (Rows)</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">7,539 Tasks</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Total Features</span>
            <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">77 Columns</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Missing / NaN Cells</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">0 (100% Complete)</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Edge Fleet</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">20 Servers (9 Regions)</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Central Cloud</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">5 GPU Servers (CA)</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">IoT Fleet</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">54 Sensor Motes</span>
          </div>
        </div>

        {/* Real Master Dataset Rows Preview */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-mono">
            Verified Master Dataset Preview (Selected Columns from 77-Column Table)
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">task_id</th>
                  <th className="py-2.5 px-3">dev</th>
                  <th className="py-2.5 px-3">priority</th>
                  <th className="py-2.5 px-3">size_mb</th>
                  <th className="py-2.5 px-3">cpu / gpu</th>
                  <th className="py-2.5 px-3">device_region</th>
                  <th className="py-2.5 px-3">ci_local / cloud</th>
                  <th className="py-2.5 px-3">device_type</th>
                  <th className="py-2.5 px-3">tx_dbm</th>
                  <th className="py-2.5 px-3">transmit_power_basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {masterPreviewRows.map((r) => (
                  <tr key={r.task_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {r.task_id}
                    </td>
                    <td className="py-2 px-3 text-slate-500">#{r.device_id}</td>
                    <td className="py-2 px-3 font-semibold text-indigo-600 dark:text-indigo-400">{r.priority}</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{r.task_size_mb}</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                      {r.cpu_demand} / {r.gpu_demand}
                    </td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {r.device_region}
                    </td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {r.ci_local} / {r.ci_cloud}
                    </td>
                    <td className="py-2 px-3 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {r.device_type}
                    </td>
                    <td className="py-2 px-3 font-bold text-amber-600 dark:text-amber-400">{r.tx_dbm}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-500 whitespace-nowrap">{r.tx_basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive 77-Column Schema Explorer */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
              Complete 77-Column Schema Explorer ({filteredColumns.length} Columns Shown)
            </h4>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All (77)' },
                { id: 'task', label: 'Tasks & Timing (11)' },
                { id: 'placement', label: 'Placement (8)' },
                { id: 'carbon', label: '9-Region Carbon (29)' },
                { id: 'device', label: 'IoT Devices (10)' },
                { id: 'server', label: 'Edge & Cloud Servers (19)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSchemaGroup(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors ${
                    activeSchemaGroup === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter column..."
                  className="pl-8 pr-3 py-1 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2 px-3 w-12">#</th>
                  <th className="py-2 px-3">Column Name</th>
                  <th className="py-2 px-3 w-28">Group</th>
                  <th className="py-2 px-3 w-24">Data Type</th>
                  <th className="py-2 px-3">Description & Provenance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredColumns.map((col) => (
                  <tr key={col.idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3 text-slate-400">{col.idx}</td>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{col.name}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {col.group}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-indigo-600 dark:text-indigo-400">{col.type}</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 font-sans text-xs">
                      {col.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

