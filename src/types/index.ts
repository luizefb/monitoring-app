export interface MonitoringRecord {
  id: string
  timestamp: string
  temperature: number
  humidity: number
}

export interface MonitoringContextType {
  records: MonitoringRecord[]
  addRecord: (temperature: number, humidity: number) => void
  latestRecord: MonitoringRecord | null
  isTemperatureAlert: boolean
  isHumidityAlert: boolean
  hasAlert: boolean
}

export const TEMP_ALERT_THRESHOLD = 30
export const HUMIDITY_ALERT_THRESHOLD = 70
