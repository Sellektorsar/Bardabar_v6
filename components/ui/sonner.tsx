"use client";

import { cva } from "class-variance-authority";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

const toastVariants = cva(
  "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:shadow-lg",
  {
    variants: {
      variant: {
        default: "border",
        destructive: "group-[.toast]:bg-destructive group-[.toast]:text-destructive-foreground",
        success: "group-[.toast]:bg-background group-[.toast]:text-foreground border-green-500",
        loading: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
      },
    },
  },
);

export { Toaster, toastVariants };
