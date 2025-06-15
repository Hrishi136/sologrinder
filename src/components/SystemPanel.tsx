
import React from "react"

type SystemPanelProps = React.PropsWithChildren<{
  className?: string
  glow?: boolean
  as?: React.ElementType
}>

export function SystemPanel({ children, className = '', glow = false, as: Component = "div" }: SystemPanelProps) {
  return (
    <Component className={`system-panel ${glow ? "system-panel-glow" : ""} ${className}`}>
      {children}
    </Component>
  )
}

export default SystemPanel
