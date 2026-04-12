import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { MonitoringContextType, MonitoringRecord } from "@/types"
import { TEMP_ALERT_THRESHOLD, HUMIDITY_ALERT_THRESHOLD } from "@/types"
import { generateMockData, STORAGE_KEY } from "@/lib/mock-data"

function loadRecords(): MonitoringRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as MonitoringRecord[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore parse errors
  }
  const mock = generateMockData()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mock))
  return mock
}

const MonitoringContext = createContext<MonitoringContextType | null>(null)

export function MonitoringProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<MonitoringRecord[]>(loadRecords)

  const addRecord = useCallback((temperature: number, humidity: number) => {
    const newRecord: MonitoringRecord = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 8),
      timestamp: new Date().toISOString(),
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity * 10) / 10,
    }

    setRecords(prev => {
      const updated = [...prev, newRecord]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const latestRecord = records.length > 0 ? records[records.length - 1] : null

  const isTemperatureAlert = latestRecord !== null && latestRecord.temperature > TEMP_ALERT_THRESHOLD
  const isHumidityAlert = latestRecord !== null && latestRecord.humidity > HUMIDITY_ALERT_THRESHOLD
  const hasAlert = isTemperatureAlert || isHumidityAlert

  return (
    <MonitoringContext.Provider
      value={{ records, addRecord, latestRecord, isTemperatureAlert, isHumidityAlert, hasAlert }}
    >
      {children}
    </MonitoringContext.Provider>
  )
}

export function useMonitoringData(): MonitoringContextType {
  const context = useContext(MonitoringContext)
  if (!context) {
    throw new Error("useMonitoringData must be used within a MonitoringProvider")
  }
  return context
}
