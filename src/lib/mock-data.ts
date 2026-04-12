import type { MonitoringRecord } from "@/types"

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

export function generateMockData(): MonitoringRecord[] {
  const records: MonitoringRecord[] = []
  const now = Date.now()

  const baseTemps = [22, 23, 24, 25, 24, 26, 27, 25, 23, 22, 24, 28, 26, 25, 24]
  const baseHumidity = [45, 48, 50, 52, 55, 53, 58, 60, 55, 50, 48, 52, 56, 54, 50]

  for (let i = 0; i < 15; i++) {
    const hoursAgo = (14 - i) * 2
    const timestamp = new Date(now - hoursAgo * 60 * 60 * 1000).toISOString()

    records.push({
      id: generateId() + i,
      timestamp,
      temperature: baseTemps[i] + Math.random() * 2 - 1,
      humidity: baseHumidity[i] + Math.random() * 4 - 2,
    })
  }

  return records.map(r => ({
    ...r,
    temperature: Math.round(r.temperature * 10) / 10,
    humidity: Math.round(r.humidity * 10) / 10,
  }))
}

export const STORAGE_KEY = "monitoring-records"
