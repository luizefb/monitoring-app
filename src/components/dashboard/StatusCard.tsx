import { motion } from "framer-motion"
import { Thermometer, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusCardProps {
  type: "temperature" | "humidity"
  value: number | null
  isAlert: boolean
}

const config = {
  temperature: {
    label: "Temperatura",
    unit: "°C",
    icon: Thermometer,
    bg: "bg-orange-50",
    alertBg: "bg-red-50",
    iconBg: "bg-orange-100",
    alertIconBg: "bg-red-100",
    iconColor: "text-temp",
    alertIconColor: "text-red-600",
  },
  humidity: {
    label: "Umidade",
    unit: "%",
    icon: Droplets,
    bg: "bg-cyan-50/60",
    alertBg: "bg-red-50/60",
    iconBg: "bg-cyan-100/60",
    alertIconBg: "bg-red-100/60",
    iconColor: "text-humidity/60",
    alertIconColor: "text-red-400",
  },
}

export function StatusCard({ type, value, isAlert }: StatusCardProps) {
  const c = config[type]
  const Icon = c.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: type === "temperature" ? 0 : 0.08 }}
      className={cn(
        "rounded-xl border border-border p-4",
        isAlert ? c.alertBg : c.bg
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {c.label}
            </p>
          </div>
          <div className="flex items-baseline gap-1">
            <motion.span
              key={value}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "text-3xl font-bold tabular-nums",
                isAlert ? "text-red-600" : "text-foreground"
              )}
            >
              {value !== null ? value.toFixed(1) : "--"}
            </motion.span>
            <span className="text-sm text-muted-foreground">{c.unit}</span>
          </div>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg",
            isAlert ? c.alertIconBg : c.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", isAlert ? c.alertIconColor : c.iconColor)} />
        </div>
      </div>
      {isAlert && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="mt-3 h-0.5 origin-left rounded-full bg-red-400"
        />
      )}
    </motion.div>
  )
}
