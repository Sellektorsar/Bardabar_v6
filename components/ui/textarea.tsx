import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full resize-none rounded-md border border-input bg-secondary px-3 py-2 text-base outline-none transition-[color,box-shadow] md:text-sm",
        "text-white placeholder:text-muted-foreground",
        "focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
