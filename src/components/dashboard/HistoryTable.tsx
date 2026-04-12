import { useMemo } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { TEMP_ALERT_THRESHOLD, HUMIDITY_ALERT_THRESHOLD } from "@/types"
import type { MonitoringRecord } from "@/types"

interface HistoryTableProps {
  records: MonitoringRecord[]
}

export function HistoryTable({ records }: HistoryTableProps) {
  const sorted = useMemo(
    () => [...records].reverse().slice(0, 30),
    [records]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-72 overflow-y-auto rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data / Hora</TableHead>
                <TableHead className="text-right">Temp (°C)</TableHead>
                <TableHead className="text-right">Umidade (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(record.timestamp), "dd/MM/yyyy HH:mm", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums font-medium",
                      record.temperature > TEMP_ALERT_THRESHOLD
                        ? "text-red-600"
                        : "text-temp"
                    )}
                  >
                    {record.temperature.toFixed(1)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums font-medium",
                      record.humidity > HUMIDITY_ALERT_THRESHOLD
                        ? "text-red-600"
                        : "text-humidity"
                    )}
                  >
                    {record.humidity.toFixed(1)}
                  </TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
