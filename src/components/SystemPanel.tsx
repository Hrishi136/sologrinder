
import React from "react"

type SystemPanelProps = React.PropsWithChildren<{
  className?: string
  glow?: boolean
  as?: React.ElementType
}>

export function SystemPanel({ children, className = '', glow = false, as: Component = "div" }: SystemPanelProps) {
  return (
    <Component
      className={`system-panel ${glow ? "system-panel-glow" : ""} ${className} w-full max-w-full p-3 sm:p-4 md:p-6`}
      style={{ minWidth: 0, overflowX: 'hidden' }}
    >
      {children}
    </Component>
  )
}
export default SystemPanel
