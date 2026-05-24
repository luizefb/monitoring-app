import { Thermometer, Droplets, Activity, Database, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HUMIDITY_ALERT_THRESHOLD, TEMP_ALERT_THRESHOLD } from "@/types"

export function ExplanationPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-foreground">Sobre</h1>

      <Card>
        <CardHeader>
          <CardTitle>Sobre o sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Este sistema ajuda a acompanhar a <span className="font-medium text-foreground">temperatura</span> e a{" "}
            <span className="font-medium text-foreground">umidade</span> de um data center. A ideia é mostrar, de forma
            simples, se o ambiente está dentro do esperado e como os valores estão evoluindo ao longo do tempo.
          </p>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-start gap-2">
              <Activity className="mt-0.5 h-4 w-4 text-foreground/70" />
              <p>
                O dashboard atualiza automaticamente quando novas medições são enviadas.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Database className="mt-0.5 h-4 w-4 text-foreground/70" />
              <p>
                Você vê o valor mais recente, o histórico de medições e um gráfico para identificar tendências e picos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como interpretar o dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            O sistema aponta <span className="font-medium text-foreground">risco</span> quando a temperatura ou a umidade
            passam do limite definido para o data center. Quando isso acontece, aparece{" "}
            <span className="font-medium text-foreground">Alerta de Risco</span> e os cards ficam destacados em vermelho.
          </p>

          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-start gap-2">
              <Thermometer className="mt-0.5 h-4 w-4 text-temp" />
              <p>
                Temperatura entra em risco quando{" "}
                <span className="font-medium text-foreground">
                  temperatura &gt; {TEMP_ALERT_THRESHOLD}°C
                </span>
                .
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Droplets className="mt-0.5 h-4 w-4 text-humidity/70" />
              <p>
                Umidade entra em risco quando{" "}
                <span className="font-medium text-foreground">umidade &gt; {HUMIDITY_ALERT_THRESHOLD}%</span>.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 text-red-600" />
              <p>
                Se qualquer um dos dois estiver acima do limite, o ambiente é marcado como{" "}
                <span className="font-medium text-foreground">em risco</span>.
              </p>
            </div>
          </div>

          <p>
            A seção <span className="font-medium text-foreground">Médias do mês</span> mostra a média das medições do mês
            atual, ajudando a entender o comportamento geral do ambiente (além do valor “agora”).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
