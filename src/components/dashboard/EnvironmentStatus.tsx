import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnvironmentStatusProps {
  hasAlert: boolean
}

export function EnvironmentStatus({ hasAlert }: EnvironmentStatusProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={hasAlert ? "alert" : "safe"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex items-center gap-3 rounded-xl border p-3.5",
          hasAlert
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-green-200 bg-green-50 text-green-700"
        )}
      >
        {hasAlert ? (
          <AlertTriangle className="h-5 w-5 shrink-0" />
        ) : (
          <ShieldCheck className="h-5 w-5 shrink-0" />
        )}
        <div>
          <p className="text-sm font-medium">
            {hasAlert ? "Alerta de Risco" : "Ambiente Seguro"}
          </p>
          <p className={cn(
            "text-xs",
            hasAlert ? "text-red-600/70" : "text-green-600/70"
          )}>
            {hasAlert
              ? "Valores acima do limite detectados"
              : "Todos os indicadores estão normais"}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
