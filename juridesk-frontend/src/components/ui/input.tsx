import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus-visible:border-[#aa7d33] focus-visible:ring-4 focus-visible:ring-[#aa7d33]/10 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
