
import { useState, useMemo } from "react";
import { QualityReviewsHeader } from "@/components/quality-reviews/QualityReviewsHeader";
import { QualityReviewsStats } from "@/components/quality-reviews/QualityReviewsStats";
import { QualityReviewsFilters } from "@/components/quality-reviews/QualityReviewsFilters";
import { QualityReviewsTable } from "@/components/quality-reviews/QualityReviewsTable";
import { QualityReviewsPagination } from "@/components/quality-reviews/QualityReviewsPagination";
import { sampleReviews } from "@/data/sampleReviews";
import { QualityReview } from "@/types/qualityReview";

const QualityReviews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<any>({});
  
  // This would come from user context in a real application
  const isAdmin = true;
  const pageSize = 10;
  
  // Extract unique fleets and drivers for filter dropdowns
  const fleets = useMemo(() => {
    const uniqueFleets = new Map();
    sampleReviews.forEach(review => {
      if (!uniqueFleets.has(review.fleetId)) {
        uniqueFleets.set(review.fleetId, { id: review.fleetId, name: review.fleetName });
      }
    });
    return Array.from(uniqueFleets.values());
  }, []);
  
  const drivers = useMemo(() => {
    const uniqueDrivers = new Map();
    sampleReviews.forEach(review => {
      if (!uniqueDrivers.has(review.driverId)) {
        uniqueDrivers.set(review.driverId, { id: review.driverId, name: review.driverName });
      }
    });
    return Array.from(uniqueDrivers.values());
  }, []);
  
  // Apply filters to reviews
  const filteredReviews = useMemo(() => {
    return sampleReviews.filter(review => {
      // Filter by booking reference
      if (filters.bookingRef && !review.bookingReference.toLowerCase().includes(filters.bookingRef.toLowerCase())) {
        return false;
      }
      
      // Filter by fleet
      if (filters.fleetId && review.fleetId !== filters.fleetId) {
        return false;
      }
      
      // Filter by driver
      if (filters.driverId && review.driverId !== filters.driverId) {
        return false;
      }
      
      // Filter by score type
      if (filters.scoreType && review.score !== filters.scoreType) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const reviewDate = new Date(review.reviewDate);
        
        if (filters.dateRange.from && reviewDate < filters.dateRange.from) {
          return false;
        }
        
        if (filters.dateRange.to) {
          // Include the whole day for the end date
          const endDate = new Date(filters.dateRange.to);
          endDate.setHours(23, 59, 59);
          if (reviewDate > endDate) {
            return false;
          }
        }
      }
      
      return true;
    });
  }, [filters, sampleReviews]);
  
  // Paginate the filtered reviews
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredReviews.slice(startIndex, startIndex + pageSize);
  }, [filteredReviews, currentPage, pageSize]);
  
  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  
  // Reset to first page when filters change
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };
  
  return (
    <div className="space-y-6">
      <QualityReviewsHeader />
      
      <QualityReviewsStats reviews={sampleReviews} />
      
      <QualityReviewsFilters
        onFilterChange={handleFilterChange}
        fleets={fleets}
        drivers={drivers}
      />
      
      <QualityReviewsTable 
        reviews={paginatedReviews} 
        isAdmin={isAdmin} 
      />
      
      {totalPages > 1 && (
        <div className="flex justify-center">
          <QualityReviewsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default QualityReviews;
