import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { MonitoringRecord } from "@/types"

interface TemperatureChartProps {
  records: MonitoringRecord[]
}

export function TemperatureChart({ records }: TemperatureChartProps) {
  const chartData = useMemo(() => {
    const last20 = records.slice(-20)
    return last20.map((r) => ({
      time: format(new Date(r.timestamp), "HH:mm", { locale: ptBR }),
      fullTime: format(new Date(r.timestamp), "dd/MM HH:mm", { locale: ptBR }),
      temperatura: r.temperature,
      umidade: r.humidity,
    }))
  }, [records])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56 w-full" style={{ minWidth: 0, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e4df" />
              <XAxis
                dataKey="time"
                stroke="#9b958e"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9b958e"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e8e4df",
                  borderRadius: "8px",
                  color: "#1a1a1a",
                  fontSize: "13px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
                labelFormatter={(_label, payload) => {
                  if (payload?.[0]?.payload?.fullTime) {
                    return payload[0].payload.fullTime
                  }
                  return _label
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", color: "#6b6560" }}
              />
              <Line
                type="monotone"
                dataKey="temperatura"
                name="Temperatura (°C)"
                stroke="#c2410c"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: "#c2410c" }}
              />
              <Line
                type="monotone"
                dataKey="umidade"
                name="Umidade (%)"
                stroke="#0e7490"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: "#0e7490" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
