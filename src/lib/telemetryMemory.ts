export interface TelemetryLogItem {
  sessionId: string;
  path: string;
  title?: string;
  placeId?: string;
  storyId?: string;
  deviceType?: string;
  timestamp: string;
}

const memoryLogs: TelemetryLogItem[] = [];

export function recordMemoryLog(item: TelemetryLogItem) {
  memoryLogs.unshift(item);
  if (memoryLogs.length > 500) {
    memoryLogs.pop();
  }
}

export function getMemoryLogs(): TelemetryLogItem[] {
  return memoryLogs;
}
