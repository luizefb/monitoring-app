import { useMonitoringData } from "@/hooks/useMonitoringData"
import { StatusCard } from "@/components/dashboard/StatusCard"
import { EnvironmentStatus } from "@/components/dashboard/EnvironmentStatus"
import { TemperatureChart } from "@/components/dashboard/TemperatureChart"
import { HistoryTable } from "@/components/dashboard/HistoryTable"

export function DashboardPage() {
  const { records, latestRecord, isTemperatureAlert, isHumidityAlert, hasAlert } =
    useMonitoringData()

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatusCard
          type="temperature"
          value={latestRecord?.temperature ?? null}
          isAlert={isTemperatureAlert}
        />
        <StatusCard
          type="humidity"
          value={latestRecord?.humidity ?? null}
          isAlert={isHumidityAlert}
        />
      </div>

      <EnvironmentStatus hasAlert={hasAlert} />
      <TemperatureChart records={records} />
      <HistoryTable records={records} />
    </div>
  )
}
