
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InvoiceFilterForm } from "@/components/invoices/InvoiceFilterForm";
import { InvoicePreview } from "@/components/invoices/InvoicePreview"; 
import { SuccessNotification } from "@/components/invoices/SuccessNotification";
import { mockBookings } from "@/data/mockBookings";

const GenerateInvoice = () => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date(2025, 0, 15)); // Pre-set dates for demo
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date(2025, 0, 25));
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["completed"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bookings, setBookings] = useState<any[] | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Load example data on component mount
  useEffect(() => {
    handleGenerateInvoice();
  }, []);

  // Handle booking status selection
  const handleStatusChange = (statusId: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses(prev => [...prev, statusId]);
    } else {
      setSelectedStatuses(prev => prev.filter(id => id !== statusId));
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    generatePaginatedBookings(page);
  };

  // Generate paginated invoice data
  const generatePaginatedBookings = (page: number) => {
    // Filter bookings based on selected statuses and date range
    const filteredBookings = mockBookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return (
        selectedStatuses.includes(booking.status) &&
        bookingDate >= dateFrom! &&
        bookingDate <= dateTo!
      );
    });
    
    // Calculate pagination values
    setTotalItems(filteredBookings.length);
    setTotalPages(Math.ceil(filteredBookings.length / itemsPerPage));
    
    // Get current page of bookings
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredBookings.length);
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);
    
    setBookings(paginatedBookings);
  };

  // Generate invoice
  const handleGenerateInvoice = () => {
    if (!dateFrom || !dateTo) {
      toast.error("Please select date range");
      return;
    }
    
    setIsGenerating(true);
    setSuccessMessage(null);

    // Simulate API call
    setTimeout(() => {
      generatePaginatedBookings(currentPage);
      setIsGenerating(false);
      toast.success("Invoice data generated successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Invoice</h1>
        <p className="text-muted-foreground">
          Create a new invoice by selecting bookings from a specific date range
        </p>
      </div>

      <SuccessNotification message={successMessage} />

      <InvoiceFilterForm
        dateFrom={dateFrom}
        dateTo={dateTo}
        selectedStatuses={selectedStatuses}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onStatusChange={handleStatusChange}
        onGenerateInvoice={handleGenerateInvoice}
        isGenerating={isGenerating}
      />

      {bookings && (
        <InvoicePreview 
          bookings={bookings} 
          dateFrom={dateFrom} 
          dateTo={dateTo}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default GenerateInvoice;
