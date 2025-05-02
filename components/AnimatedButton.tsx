import type React from "react"
import styles from "@/styles/animated-button.module.css"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  children: React.ReactNode
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ className, children, icon, ...props }) => {
  return (
    <button className={cn(styles.animatedButton, className)} {...props}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span className={styles.content}>
        {icon}
        {children}
      </span>
    </button>
  )
}
