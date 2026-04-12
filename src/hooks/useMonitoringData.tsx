import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { MonitoringContextType, MonitoringRecord } from "@/types"
import { TEMP_ALERT_THRESHOLD, HUMIDITY_ALERT_THRESHOLD } from "@/types"
import { isSupabaseConfigured } from "@/lib/supabase"
import {
  fetchRecords,
  insertRecord,
  subscribeToRecords,
  unsubscribeFromRecords,
} from "@/lib/monitoring-service"
import { generateMockData, STORAGE_KEY } from "@/lib/mock-data"

// ─── Fallback: dados locais (sem Supabase) ────────────────────────────────────

function mockHumidityLocal(timestamp: string): number {
  const ms = new Date(timestamp).getTime()
  const base = 55
  const amplitude = 10
  const period = 1000 * 60 * 60 * 6
  return Math.round((base + amplitude * Math.sin((2 * Math.PI * ms) / period)) * 10) / 10
}

function loadLocalRecords(): MonitoringRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as MonitoringRecord[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  const mock = generateMockData()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mock))
  return mock
}

const MonitoringContext = createContext<MonitoringContextType | null>(null)

export function MonitoringProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<MonitoringRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setRecords(loadLocalRecords())
      setIsLoading(false)
      return
    }

    let cancelled = false

    fetchRecords()
      .then((data) => {
        if (!cancelled) {
          setRecords(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[Supabase] Erro ao carregar registros:", err)
          setError("Não foi possível conectar ao banco de dados.")
          setRecords(loadLocalRecords())
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  
  // desatualizado - alterar dps
  useEffect(() => {
    if (!isSupabaseConfigured || isLoading) return

    const channel = subscribeToRecords((newRecord) => {
      setRecords((prev) => {
        const exists = prev.some((r) => r.id === newRecord.id)
        return exists ? prev : [...prev, newRecord]
      })
    })

    return () => {
      unsubscribeFromRecords(channel)
    }
  }, [isLoading])

  //desatualizado - alterar dps
  const addRecord = useCallback(async (temperature: number) => {
    if (isSupabaseConfigured) {
      const record = await insertRecord(temperature)
      // O realtime já vai adicionar via subscription, mas inserimos
      // localmente para feedback imediato caso haja latência
      setRecords((prev) => {
        const exists = prev.some((r) => r.id === record.id)
        return exists ? prev : [...prev, record]
      })
    } else {
      const timestamp = new Date().toISOString()
      const newRecord: MonitoringRecord = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 8),
        timestamp,
        temperature: Math.round(temperature * 10) / 10,
        humidity: mockHumidityLocal(timestamp),
      }
      setRecords((prev) => {
        const updated = [...prev, newRecord]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
    }
  }, [])

  const latestRecord = records.length > 0 ? records[records.length - 1] : null
  const isTemperatureAlert =
    latestRecord !== null && latestRecord.temperature > TEMP_ALERT_THRESHOLD
  const isHumidityAlert =
    latestRecord !== null && latestRecord.humidity > HUMIDITY_ALERT_THRESHOLD
  const hasAlert = isTemperatureAlert || isHumidityAlert

  return (
    <MonitoringContext.Provider
      value={{
        records,
        addRecord,
        latestRecord,
        isTemperatureAlert,
        isHumidityAlert,
        hasAlert,
        isLoading,
        error,
        isLive: isSupabaseConfigured,
      }}
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
