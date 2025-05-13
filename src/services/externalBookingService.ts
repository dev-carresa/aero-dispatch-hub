
// Re-export all services from the external-booking module
import { connectionService } from './external-booking/connectionService';
import { fetchService } from './external-booking/fetchService';
import { saveService } from './external-booking/saveService';
import { statsService } from './external-booking/statsService';

/**
 * Service for interacting with external booking APIs and the local database
 */
export const externalBookingService = {
  // Connection service methods
  testBookingComConnection: connectionService.testBookingComConnection,
  
  // Fetch service methods
  fetchBookingsFromBookingCom: fetchService.fetchBookingsFromBookingCom,
  
  // Save service methods
  saveExternalBookings: saveService.saveExternalBookings,
  
  // Stats service methods
  getBookingStatsBySource: statsService.getBookingStatsBySource
};
