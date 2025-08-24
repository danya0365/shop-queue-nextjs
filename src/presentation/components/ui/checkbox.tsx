import * as React from "react";
import { cn } from "@/src/utils/cn";
import { Check } from "lucide-react";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground absolute opacity-0 w-full h-full cursor-pointer"
        ref={ref}
        {...props}
      />
      <div
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary ring-offset-background peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-checked:bg-primary peer-checked:text-primary-foreground",
          className
        )}
      >
        <Check className="h-3 w-3 peer-checked:opacity-100 opacity-0 transition-opacity" />
      </div>
    </div>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
