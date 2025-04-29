
import { useState } from "react";
import { DriverCommentsHeader } from "@/components/driver-comments/DriverCommentsHeader";
import { DriverCommentsFilters } from "@/components/driver-comments/DriverCommentsFilters";
import { DriverCommentsTable } from "@/components/driver-comments/DriverCommentsTable";
import { sampleDriverComments } from "@/data/sampleDriverComments";
import { DriverComment } from "@/types/driverComment";

const DriverComments = () => {
  const [filteredComments, setFilteredComments] = useState<DriverComment[]>(sampleDriverComments);

  const handleFilter = (filters: any) => {
    let results = [...sampleDriverComments];

    if (filters.driverName) {
      results = results.filter(comment => 
        comment.driverName.toLowerCase().includes(filters.driverName.toLowerCase())
      );
    }

    if (filters.bookingReference) {
      results = results.filter(comment => 
        comment.bookingReference && 
        comment.bookingReference.toLowerCase().includes(filters.bookingReference.toLowerCase())
      );
    }

    if (filters.status) {
      results = results.filter(comment => comment.status === filters.status);
    }

    // Date filtering could be implemented here
    // This is simplified for demo purposes

    setFilteredComments(results);
  };

  const handleRefresh = () => {
    // In a real app, this would refresh data from the API
    setFilteredComments(sampleDriverComments);
  };

  return (
    <div className="space-y-6">
      <DriverCommentsHeader onRefresh={handleRefresh} />
      
      <DriverCommentsFilters onFilter={handleFilter} />
      
      <DriverCommentsTable comments={filteredComments} />
    </div>
  );
};

export default DriverComments;
