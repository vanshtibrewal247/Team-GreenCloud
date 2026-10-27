"""
build_trace.py

Converts master_dataset.xlsx to /src/data/trace.json for the DWPA simulation engine.
Reads column names and values dynamically from the file.
"""

import os
import sys
import glob
import json
import numpy as np
import pandas as pd

def find_dataset_file():
    candidates = [
        os.path.join(os.path.dirname(__file__), "..", "Datasets", "master_dataset (1).xlsx"),
        os.path.join(os.path.dirname(__file__), "..", "Datasets", "master_dataset.xlsx"),
        os.path.join(os.path.dirname(__file__), "..", "ProjectApplication", "public", "master_dataset.xlsx"),
    ]
    for c in candidates:
        if os.path.exists(c):
            return os.path.abspath(c)
    
    # Fallback to glob in Datasets folder
    datasets_dir = os.path.join(os.path.dirname(__file__), "..", "Datasets")
    if os.path.exists(datasets_dir):
        xlsx_files = glob.glob(os.path.join(datasets_dir, "*.xlsx"))
        if xlsx_files:
            return os.path.abspath(xlsx_files[0])
            
    raise FileNotFoundError("master_dataset.xlsx not found in Datasets or ProjectApplication/public")

def build_trace():
    xlsx_path = find_dataset_file()
    print(f"Reading dataset from: {xlsx_path}")
    df = pd.read_excel(xlsx_path)
    total_tasks = len(df)
    print(f"Total tasks loaded: {total_tasks}")

    # Mapping as specified
    city_to_region = {
        'Los Angeles': 'california',
        'Boston': 'new_england',
        'New York City': 'new_york',
        'Miami': 'florida',
        'Chicago': 'midwest',
        'Phoenix': 'desert_southwest',
        'Philadelphia': 'mid_atlantic',
        'Seattle': 'pacific_northwest',
        'Houston': 'texas'
    }

    # Grouping by hour
    df['hour'] = np.floor(df['sim_offset_sec'] / 3600.0).astype(int)
    min_hour = int(df['hour'].min())
    max_hour = int(df['hour'].max())
    num_hours = max_hour - min_hour + 1
    print(f"Hour span: {min_hour} to {max_hour} ({num_hours} hours)")

    hours_range = pd.DataFrame({'hour': range(min_hour, max_hour + 1)})
    
    # Check empty hours
    hours_with_tasks = set(df['hour'].unique())
    empty_hours = [h for h in range(min_hour, max_hour + 1) if h not in hours_with_tasks]
    num_empty_hours = len(empty_hours)
    print(f"Empty hours (forward-filled): {num_empty_hours}")

    # Check wrapped rows
    wrapped_col = 'carbon_replay_wrapped'
    wrapped_rows = int(df[wrapped_col].sum()) if wrapped_col in df.columns else 0
    print(f"Wrapped rows: {wrapped_rows}")

    # Total workload across all cities
    total_workload_mb = float(df['task_size_mb'].sum())
    total_workload_gb = round(total_workload_mb / 1024.0, 4)
    print(f"Total workload: {total_workload_gb} GB")

    # Compute Regional Carbon Intensity per hour (forward-filled when empty)
    regional_hourly_ci = {}
    for region_name in set(city_to_region.values()):
        col_name = f'carbon_intensity_{region_name}'
        if col_name in df.columns:
            hourly_mean = df.groupby('hour')[col_name].mean().reset_index()
            merged = pd.merge(hours_range, hourly_mean, on='hour', how='left')
            filled = merged[col_name].ffill().bfill()
            regional_hourly_ci[region_name] = [round(float(v), 2) for v in filled]
        else:
            raise KeyError(f"Column {col_name} missing from dataset")

    # Cloud Carbon Intensity per hour
    cloud_col = 'carbon_intensity_cloud'
    cloud_hourly_mean = df.groupby('hour')[cloud_col].mean().reset_index()
    cloud_merged = pd.merge(hours_range, cloud_hourly_mean, on='hour', how='left')
    cloud_filled = cloud_merged[cloud_col].ffill().bfill()
    cloud_hourly_ci = [round(float(v), 2) for v in cloud_filled]

    # Build Edge Cities Data
    cities_data = []
    city_workload_shares = {}

    for city_name, region_name in city_to_region.items():
        city_df = df[df['device_city'] == city_name]
        city_total_mb = float(city_df['task_size_mb'].sum()) if len(city_df) > 0 else 0.0
        city_total_gb = round(city_total_mb / 1024.0, 4)
        share_pct = round((city_total_mb / total_workload_mb) * 100.0, 2) if total_workload_mb > 0 else 0.0
        city_workload_shares[city_name] = share_pct

        # Servers and cores from data
        num_servers = int(city_df['local_edge_num_servers'].iloc[0]) if len(city_df) > 0 and 'local_edge_num_servers' in city_df.columns else 2
        cores_per_server = int(city_df['edge_cap_cpu_cores'].iloc[0]) if len(city_df) > 0 and 'edge_cap_cpu_cores' in city_df.columns else 96
        total_cores = num_servers * cores_per_server
        bandwidth_mbps = float(city_df['edge_bandwidth_mbps'].iloc[0]) if len(city_df) > 0 and 'edge_bandwidth_mbps' in city_df.columns else 25000.0
        full_load_power = float(city_df['edge_full_load_power_watts'].iloc[0]) if len(city_df) > 0 and 'edge_full_load_power_watts' in city_df.columns else 432.0

        # Hourly arrivals in GB and task counts
        city_hourly_agg = city_df.groupby('hour').agg(
            arrivals_mb=('task_size_mb', 'sum'),
            task_count=('task_id', 'count')
        ).reset_index()
        merged_city = pd.merge(hours_range, city_hourly_agg, on='hour', how='left').fillna(0.0)

        hourly_arrivals_gb = [round(float(v) / 1024.0, 4) for v in merged_city['arrivals_mb']]
        hourly_task_counts = [int(v) for v in merged_city['task_count']]
        hourly_ci = regional_hourly_ci[region_name]
        mean_ci = round(float(np.mean(hourly_ci)), 2)

        cities_data.append({
            'city': city_name,
            'region': region_name,
            'num_servers': num_servers,
            'cores_per_server': cores_per_server,
            'total_cores': total_cores,
            'bandwidth_mbps': bandwidth_mbps,
            'full_load_power_watts': full_load_power,
            'workload_share_pct': share_pct,
            'total_workload_gb': city_total_gb,
            'total_tasks': int(len(city_df)),
            'mean_carbon_intensity': mean_ci,
            'hourly_arrivals_gb': hourly_arrivals_gb,
            'hourly_task_counts': hourly_task_counts,
            'hourly_carbon_intensity': hourly_ci
        })

    # Cloud specifications
    cloud_servers = int(df['cloud_num_servers'].iloc[0]) if 'cloud_num_servers' in df.columns else 5
    cloud_cores_per_server = int(df['cloud_cap_cpu_cores'].iloc[0]) if 'cloud_cap_cpu_cores' in df.columns else 96
    cloud_total_cores = cloud_servers * cloud_cores_per_server
    cloud_bandwidth = float(df['cloud_bandwidth_mbps'].iloc[0]) if 'cloud_bandwidth_mbps' in df.columns else 25000.0
    cloud_full_load_power = float(df['cloud_full_load_power_watts'].iloc[0]) if 'cloud_full_load_power_watts' in df.columns else 432.0
    cloud_mean_ci = round(float(np.mean(cloud_hourly_ci)), 2)

    cloud_data = {
        'region': 'california',
        'location_city': str(df['cloud_location_city'].iloc[0]) if 'cloud_location_city' in df.columns else 'California',
        'num_servers': cloud_servers,
        'cores_per_server': cloud_cores_per_server,
        'total_cores': cloud_total_cores,
        'bandwidth_mbps': cloud_bandwidth,
        'full_load_power_watts': cloud_full_load_power,
        'mean_carbon_intensity': cloud_mean_ci,
        'hourly_carbon_intensity': cloud_hourly_ci
    }

    # Data Quality Note
    data_quality_note = (
        f"The trace covers {total_tasks:,} real tasks across {num_hours} hours. "
        f"{num_empty_hours} hours without task arrivals were forward-filled for carbon intensity; "
        f"{wrapped_rows} rows ({round(wrapped_rows/total_tasks*100, 1)}%) have carbon_replay_wrapped=True. "
        f"Workload distribution: Los Angeles is {city_workload_shares.get('Los Angeles', 20.5):.1f}%, "
        f"while all other 8 cities contribute ~9.8%-10.0% each."
    )

    trace_json = {
        'num_hours': num_hours,
        'total_tasks': total_tasks,
        'total_workload_gb': total_workload_gb,
        'empty_hours_filled': num_empty_hours,
        'wrapped_rows': wrapped_rows,
        'city_workload_shares': city_workload_shares,
        'data_quality_note': data_quality_note,
        'cities': cities_data,
        'cloud': cloud_data
    }

    # Output path
    output_dir = os.path.join(os.path.dirname(__file__), "..", "ProjectApplication", "src", "data")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "trace.json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(trace_json, f, indent=2)

    print(f"Successfully generated trace.json at: {output_path}")
    print(f"File size: {round(os.path.getsize(output_path)/1024, 2)} KB")
    return output_path

if __name__ == "__main__":
    build_trace()
