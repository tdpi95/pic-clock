import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: number) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, onValueChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value)
      if (onValueChange) {
        onValueChange(value)
      }
      if (props.onChange) {
        props.onChange(event)
      }
    }

    return (
      <input
        type="range"
        ref={ref}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700 accent-indigo-500",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
          className
        )}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
