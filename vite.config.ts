import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Resolve versioned imports to their base packages
      "lucide-react@0.487.0": "lucide-react",
      "sonner@2.0.3": "sonner",
      "class-variance-authority@0.7.1": "class-variance-authority",
      "react-day-picker@8.10.1": "react-day-picker",
      "input-otp@1.4.2": "input-otp",
      "vaul@1.1.2": "vaul",
      "react-resizable-panels@2.1.7": "react-resizable-panels",
      "recharts@2.15.2": "recharts",
      "react-hook-form@7.55.0": "react-hook-form",
      "cmdk@1.1.1": "cmdk",
      "embla-carousel-react@8.6.0": "embla-carousel-react",
      // Radix UI packages
      "@radix-ui/react-slot": "@radix-ui/react-slot",
      "@radix-ui/react-menubar": "@radix-ui/react-menubar",
      "@radix-ui/react-dropdown-menu": "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-collapsible": "@radix-ui/react-collapsible",
      "@radix-ui/react-aspect-ratio": "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-toggle-group": "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip": "@radix-ui/react-tooltip",
      "@radix-ui/react-select": "@radix-ui/react-select",
      "@radix-ui/react-label": "@radix-ui/react-label",
      "@radix-ui/react-switch": "@radix-ui/react-switch",
      "@radix-ui/react-dialog": "@radix-ui/react-dialog",
      "@radix-ui/react-toggle": "@radix-ui/react-toggle",
      "@radix-ui/react-context-menu": "@radix-ui/react-context-menu",
      "@radix-ui/react-slider": "@radix-ui/react-slider",
      "@radix-ui/react-progress": "@radix-ui/react-progress",
      "@radix-ui/react-hover-card": "@radix-ui/react-hover-card",
      "@radix-ui/react-tabs": "@radix-ui/react-tabs",
      "@radix-ui/react-navigation-menu": "@radix-ui/react-navigation-menu",
      "@radix-ui/react-scroll-area": "@radix-ui/react-scroll-area",
      "@radix-ui/react-alert-dialog": "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar": "@radix-ui/react-avatar",
      "@radix-ui/react-separator": "@radix-ui/react-separator",
      "@radix-ui/react-accordion": "@radix-ui/react-accordion",
      "@radix-ui/react-checkbox": "@radix-ui/react-checkbox",
      "@radix-ui/react-popover": "@radix-ui/react-popover",
      // Supabase aliases for jsr: imports
      "jsr:@supabase/supabase-js": "@supabase/supabase-js",
    },
  },
  optimizeDeps: {
    include: [
      "lucide-react",
      "sonner",
      "clsx",
      "tailwind-merge",
      "date-fns",
      "@radix-ui/react-slot",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "class-variance-authority",
      "react-day-picker",
    ],
  },
});
