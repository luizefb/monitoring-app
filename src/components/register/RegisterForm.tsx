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
  const [humidity, setHumidity] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const temp = parseFloat(temperature)
    const hum = parseFloat(humidity)

    if (isNaN(temp) || isNaN(hum)) {
      toast.error("Preencha ambos os campos corretamente")
      return
    }

    if (temp < -50 || temp > 100) {
      toast.error("Temperatura deve estar entre -50°C e 100°C")
      return
    }

    if (hum < 0 || hum > 100) {
      toast.error("Umidade deve estar entre 0% e 100%")
      return
    }

    addRecord(temp, hum)
    setTemperature("")
    setHumidity("")
    toast.success("Registro salvo com sucesso!")
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
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="humidity">Umidade (%)</Label>
            <Input
              id="humidity"
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder="Ex: 55.0"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            <Send className="h-4 w-4" />
            Registrar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
