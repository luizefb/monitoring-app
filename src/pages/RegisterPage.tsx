import { useMonitoringData } from "@/hooks/useMonitoringData"
import { RegisterForm } from "@/components/register/RegisterForm"
import { Thermometer, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"
import { TEMP_ALERT_THRESHOLD, HUMIDITY_ALERT_THRESHOLD } from "@/types"

export function RegisterPage() {
  const { latestRecord } = useMonitoringData()

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-foreground">Registro</h1>

      {latestRecord && (
        <div className="flex gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-card p-3">
            <Thermometer
              className={cn(
                "h-4 w-4",
                latestRecord.temperature > TEMP_ALERT_THRESHOLD
                  ? "text-red-600"
                  : "text-temp"
              )}
            />
            <span className="text-xs text-muted-foreground">Atual:</span>
            <span className="text-sm font-medium tabular-nums">
              {latestRecord.temperature.toFixed(1)}°C
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-card p-3">
            <Droplets
              className={cn(
                "h-4 w-4",
                latestRecord.humidity > HUMIDITY_ALERT_THRESHOLD
                  ? "text-red-600"
                  : "text-humidity"
              )}
            />
            <span className="text-xs text-muted-foreground">Atual:</span>
            <span className="text-sm font-medium tabular-nums">
              {latestRecord.humidity.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      <RegisterForm />
    </div>
  )
}
