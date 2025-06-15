
import React from "react"

type SystemPanelProps = React.PropsWithChildren<{
  className?: string
  glow?: boolean
  as?: React.ElementType
}>

export function SystemPanel({ children, className = '', glow = false, as: Component = "div" }: SystemPanelProps) {
  return (
    <Component
      className={`system-panel ${glow ? "system-panel-glow" : ""} ${className} w-full max-w-full sm:max-w-4xl`}
      style={{ minWidth: 0 }}
    >
      {children}
    </Component>
  )
}
export default SystemPanel
