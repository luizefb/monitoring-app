import { useState, type FormEvent } from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useMonitoringData } from "@/hooks/useMonitoringData"

export function RegisterForm() {
  const { addRecord } = useMonitoringData()
  const [temperature, setTemperature] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const temp = parseFloat(temperature)

    if (isNaN(temp)) {
      toast.error("Insira um valor de temperatura válido")
      return
    }

    if (temp < -50 || temp > 100) {
      toast.error("Temperatura deve estar entre -50°C e 100°C")
      return
    }

    setIsSaving(true)
    try {
      await addRecord(temp)
      setTemperature("")
      toast.success("Registro salvo com sucesso!")
    } catch {
      toast.error("Erro ao salvar o registro. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Registro</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="temperature">Temperatura (°C)</Label>
            <Input
              id="temperature"
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder="Ex: 25.5"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              disabled={isSaving}
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
            <Send className="h-4 w-4" />
            {isSaving ? "Salvando..." : "Registrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
