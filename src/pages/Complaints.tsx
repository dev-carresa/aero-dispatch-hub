
import { useState } from "react";
import { ComplaintsHeader } from "@/components/complaints/ComplaintsHeader";
import { ComplaintsFilters } from "@/components/complaints/ComplaintsFilters";
import { ComplaintsTable } from "@/components/complaints/ComplaintsTable";
import { sampleComplaints } from "@/data/sampleComplaints";
import { Complaint } from "@/types/complaint";

const Complaints = () => {
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(sampleComplaints);

  const handleFilter = (filters: any) => {
    let results = [...sampleComplaints];

    if (filters.bookingReference) {
      results = results.filter(complaint => 
        complaint.bookingReference.toLowerCase().includes(filters.bookingReference.toLowerCase())
      );
    }

    if (filters.fleetId) {
      results = results.filter(complaint => complaint.fleetId.toString() === filters.fleetId);
    }

    if (filters.status) {
      results = results.filter(complaint => complaint.status === filters.status);
    }

    // Date filtering could be implemented here
    // This is simplified for demo purposes

    setFilteredComplaints(results);
  };

  return (
    <div className="space-y-6">
      <ComplaintsHeader />
      
      <ComplaintsFilters onFilter={handleFilter} />
      
      <ComplaintsTable complaints={filteredComplaints} />
    </div>
  );
};

export default Complaints;
