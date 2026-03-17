'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-brand-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand-primary data-[state=checked]:text-black",
          "appearance-none bg-transparent border-white/20 rounded cursor-pointer checked:bg-brand-primary checked:border-brand-primary relative",
          "before:content-[''] before:absolute before:inset-0 before:flex before:items-center before:justify-center before:text-black before:font-bold before:opacity-0 checked:before:opacity-100",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
