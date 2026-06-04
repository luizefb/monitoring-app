import { useMemo } from "react"
import { isSameMonth, parseISO } from "date-fns"
import { useMonitoringData } from "@/hooks/useMonitoringData"
import { StatusCard } from "@/components/dashboard/StatusCard"
import { EnvironmentStatus } from "@/components/dashboard/EnvironmentStatus"
import { TemperatureChart } from "@/components/dashboard/TemperatureChart"
import { HistoryTable } from "@/components/dashboard/HistoryTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Thermometer } from "lucide-react"

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

  const monthAverages = useMemo(() => {
    const now = new Date()
    const monthRecords = records.filter((r) => {
      const date = parseISO(r.timestamp)
      return !Number.isNaN(date.getTime()) && isSameMonth(date, now)
    })

    if (monthRecords.length === 0) {
      return { avgTemperature: null, avgHumidity: null, count: 0 }
    }

    const { sumTemperature, sumHumidity } = monthRecords.reduce(
      (acc, r) => ({
        sumTemperature: acc.sumTemperature + r.temperature,
        sumHumidity: acc.sumHumidity + r.humidity,
      }),
      { sumTemperature: 0, sumHumidity: 0 }
    )

    return {
      avgTemperature: sumTemperature / monthRecords.length,
      avgHumidity: sumHumidity / monthRecords.length,
      count: monthRecords.length,
    }
  }, [records])

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-foreground">Temperatura do Data Center</h1>

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

          <Card>
            <CardHeader>
              <CardTitle>Média de temperatira registrada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-temp" />
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Temperatura
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold tabular-nums text-foreground">
                      {monthAverages.avgTemperature !== null
                        ? monthAverages.avgTemperature.toFixed(1)
                        : "--"}
                    </span>
                    <span className="text-sm text-muted-foreground">°C</span>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-humidity/70" />
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Umidade
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold tabular-nums text-foreground">
                      {monthAverages.avgHumidity !== null
                        ? monthAverages.avgHumidity.toFixed(1)
                        : "--"}
                    </span>
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Baseado em {monthAverages.count} leituras do mês atual.
              </p>
            </CardContent>
          </Card>

          <EnvironmentStatus hasAlert={hasAlert} />
          <TemperatureChart records={records} />
          <HistoryTable records={records} />
        </>
      )}
    </div>
  )
}
