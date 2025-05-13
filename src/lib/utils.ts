
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BookingStatus } from "@/components/bookings/types/booking"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusBadgeColor(status: BookingStatus) {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
  }
}
