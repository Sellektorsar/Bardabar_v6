"use client";

import { Gallery } from "../../components/Gallery";
import type { GalleryImage } from "../types";

interface GalleryPageProps {
  images: GalleryImage[];
}

export function GalleryPage({ images }: GalleryPageProps) {
  return <Gallery images={images} />;
}
