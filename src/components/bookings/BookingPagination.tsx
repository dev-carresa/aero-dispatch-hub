
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BookingPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BookingPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BookingPaginationProps) {
  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end of the page range
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust if we're at the edges
    if (currentPage <= 3) {
      end = Math.min(totalPages - 1, 4);
    }
    
    if (currentPage >= totalPages - 2) {
      start = Math.max(2, totalPages - 3);
    }
    
    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('ellipsis-start');
    }
    
    // Add pages in the middle
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('ellipsis-end');
    }
    
    // Always add last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }} 
            className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
          />
        </PaginationItem>
        
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={page}>
              <PaginationLink 
                href="#" 
                isActive={currentPage === page} 
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page as number);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }} 
            className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
