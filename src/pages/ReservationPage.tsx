"use client";

import { TableReservation } from "../../components/TableReservation";

interface ReservationPageProps {
  acceptsReservations: boolean;
}

export function ReservationPage({ acceptsReservations }: ReservationPageProps) {
  return <TableReservation acceptsReservations={acceptsReservations} />;
}
