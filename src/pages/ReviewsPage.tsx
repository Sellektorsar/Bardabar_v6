"use client";

import { Reviews } from "../../components/Reviews";
import type { Review } from "../types";

interface ReviewsPageProps {
  reviews: Review[];
}

export function ReviewsPage({ reviews }: ReviewsPageProps) {
  return <Reviews reviews={reviews} />;
}
