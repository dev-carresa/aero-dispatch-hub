
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Airport } from "@/types/airport";

interface AirportBreadcrumbsProps {
  airport?: Airport;
  currentPage?: string;
}

export function AirportBreadcrumbs({ airport, currentPage }: AirportBreadcrumbsProps) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/airports">Airports</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {airport && !currentPage && (
          <BreadcrumbPage>{airport.name} ({airport.code})</BreadcrumbPage>
        )}
        
        {airport && currentPage && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/airports/${airport.id}`}>
                {airport.name} ({airport.code})
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
