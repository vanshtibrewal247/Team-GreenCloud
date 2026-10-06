import { UploadedDataset } from '../types/simulation';

export class DatasetService {
  /**
   * Generates a realistic sample workload dataset as CSV text
   */
  public generateSampleCsv(rowCount: number = 250): string {
    const headers = [
      'RequestID',
      'TimestampMs',
      'TaskSizeKB',
      'CpuReqMIPS',
      'MemoryReqMB',
      'DeadlineMs',
      'Priority',
      'SourceLocation',
    ];

    const rows: string[] = [headers.join(',')];
    const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];

    let currentTime = 100;

    for (let i = 1; i <= rowCount; i++) {
      currentTime += Math.floor(Math.random() * 40) + 10;
      const reqId = `REQ-${String(i).padStart(5, '0')}`;
      const taskSize = Math.floor(Math.random() * 800) + 120; // 120 - 920 KB
      const cpuMips = Math.floor(Math.random() * 1200) + 300; // 300 - 1500 MIPS
      const memoryMb = Math.floor(Math.random() * 512) + 64; // 64 - 576 MB
      const deadline = Math.floor(Math.random() * 180) + 60; // 60 - 240 ms
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const location = cities[Math.floor(Math.random() * cities.length)];

      rows.push([reqId, currentTime, taskSize, cpuMips, memoryMb, deadline, priority, location].join(','));
    }

    return rows.join('\n');
  }

  /**
   * Triggers a browser download of the sample CSV dataset
   */
  public downloadSampleDataset(filename: string = 'edge2co_workload_traces.csv'): void {
    const csvContent = this.generateSampleCsv(300);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Parses CSV text into an UploadedDataset structure
   */
  public parseCsvText(fileName: string, fileSize: number, text: string): UploadedDataset {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const rows = lines.slice(1);

    const previewRows: Array<Record<string, string | number>> = [];
    const sampleLimit = Math.min(rows.length, 5);

    for (let i = 0; i < sampleLimit; i++) {
      const values = rows[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
      const rowObj: Record<string, string | number> = {};
      headers.forEach((h, idx) => {
        const val = values[idx] ?? '';
        rowObj[h] = isNaN(Number(val)) || val === '' ? val : Number(val);
      });
      previewRows.push(rowObj);
    }

    return {
      fileName,
      fileSizeKb: Math.round(fileSize / 1024),
      rowCount: rows.length,
      colCount: headers.length,
      detectedFields: headers,
      previewRows,
    };
  }

  /**
   * Provides a pre-configured sample dataset for quick testing
   */
  public getPresetDemoDataset(): UploadedDataset {
    return {
      fileName: 'alibaba_cluster_trace_sample.csv',
      fileSizeKb: 142,
      rowCount: 1250,
      colCount: 8,
      detectedFields: [
        'RequestID',
        'TimestampMs',
        'TaskSizeKB',
        'CpuReqMIPS',
        'MemoryReqMB',
        'DeadlineMs',
        'Priority',
        'SourceLocation',
      ],
      previewRows: [
        { RequestID: 'REQ-00001', TimestampMs: 120, TaskSizeKB: 240, CpuReqMIPS: 450, MemoryReqMB: 128, DeadlineMs: 90, Priority: 'High', SourceLocation: 'Mumbai' },
        { RequestID: 'REQ-00002', TimestampMs: 145, TaskSizeKB: 580, CpuReqMIPS: 820, MemoryReqMB: 256, DeadlineMs: 140, Priority: 'Medium', SourceLocation: 'Delhi' },
        { RequestID: 'REQ-00003', TimestampMs: 180, TaskSizeKB: 180, CpuReqMIPS: 310, MemoryReqMB: 64, DeadlineMs: 75, Priority: 'Critical', SourceLocation: 'Bengaluru' },
        { RequestID: 'REQ-00004', TimestampMs: 210, TaskSizeKB: 720, CpuReqMIPS: 1150, MemoryReqMB: 512, DeadlineMs: 180, Priority: 'Low', SourceLocation: 'Chennai' },
        { RequestID: 'REQ-00005', TimestampMs: 235, TaskSizeKB: 310, CpuReqMIPS: 540, MemoryReqMB: 128, DeadlineMs: 110, Priority: 'Medium', SourceLocation: 'Hyderabad' },
      ],
    };
  }
}

export const datasetService = new DatasetService();
