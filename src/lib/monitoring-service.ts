import { supabase } from "./supabase"
import { DB_CONFIG } from "./db"
import type { MonitoringRecord } from "@/types"
import type { RealtimeChannel } from "@supabase/supabase-js"

const { table, columns, initialLimit } = DB_CONFIG

/**
 * Gera um valor de umidade simulado (mock) baseado no timestamp do registro.
 * Produz valores entre 45–65% com variação suave e determinística,
 * de forma que o mesmo registro sempre resulte no mesmo valor.
 * Remova quando o sensor de umidade estiver disponível.
 */
function mockHumidity(timestamp: string): number {
  const ms = new Date(timestamp).getTime()
  const base = 55
  const amplitude = 10
  const period = 1000 * 60 * 60 * 6 // ciclo de 6 horas
  const value = base + amplitude * Math.sin((2 * Math.PI * ms) / period)
  return Math.round(value * 10) / 10
}

/** Converte uma linha do banco no tipo interno MonitoringRecord */
function rowToRecord(row: Record<string, unknown>): MonitoringRecord {
  const timestamp = String(row[columns.timestamp])
  return {
    id: String(row[columns.id]),
    timestamp,
    temperature: Number(row[columns.temperature]),
    humidity: mockHumidity(timestamp),
    ...(columns.controller ? { controller: String(row[columns.controller] ?? "") } : {}),
  }
}

/** Busca os registros mais recentes */
export async function fetchRecords(): Promise<MonitoringRecord[]> {
  if (!supabase) throw new Error("Supabase não configurado")

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(columns.timestamp, { ascending: true })
    .limit(initialLimit)

  if (error) throw error

  return (data ?? []).map(rowToRecord)
}

/** Insere um novo registro manualmente pelo front.
 *  Apenas o campo de temperatura é enviado ao banco — umidade é mock. */
export async function insertRecord(
  temperature: number,
): Promise<MonitoringRecord> {
  if (!supabase) throw new Error("Supabase não configurado")

  const { data, error } = await supabase
    .from(table)
    .insert({ [columns.temperature]: Math.round(temperature * 10) / 10 })
    .select()
    .single()

  if (error) throw error

  return rowToRecord(data)
}

/** Cria uma subscription realtime para novos registros.
 *  Chama onInsert a cada nova linha inserida na tabela. */
export function subscribeToRecords(
  onInsert: (record: MonitoringRecord) => void
): RealtimeChannel {
  if (!supabase) throw new Error("Supabase não configurado")

  const channel = supabase
    .channel("monitoring-realtime")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table },
      (payload) => {
        onInsert(rowToRecord(payload.new as Record<string, unknown>))
      }
    )
    .subscribe()

  return channel
}

/** Remove a subscription realtime */
export async function unsubscribeFromRecords(
  channel: RealtimeChannel
): Promise<void> {
  if (!supabase) return
  await supabase.removeChannel(channel)
}
