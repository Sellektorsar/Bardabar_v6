"use client";

import { Contact } from "../../components/Contact";
import type { SiteSettings } from "../types";

interface ContactPageProps {
  settings: SiteSettings;
}

export function ContactPage({ settings }: ContactPageProps) {
  return <Contact settings={settings} />;
}
