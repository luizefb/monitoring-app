import { useMonitoringData } from "@/hooks/useMonitoringData"
import { StatusCard } from "@/components/dashboard/StatusCard"
import { EnvironmentStatus } from "@/components/dashboard/EnvironmentStatus"
import { TemperatureChart } from "@/components/dashboard/TemperatureChart"
import { HistoryTable } from "@/components/dashboard/HistoryTable"

export function DashboardPage() {
  const {
    records,
    latestRecord,
    isTemperatureAlert,
    isHumidityAlert,
    hasAlert,
    isLoading,
    error,
  } = useMonitoringData()

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-border bg-muted"
            />
          ))}
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
