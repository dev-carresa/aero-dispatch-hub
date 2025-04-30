
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Airport } from "@/types/airport";
import { getMeetingPointsByAirport } from "@/data/sampleMeetingPoints";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface AirportsTableProps {
  airports: Airport[];
  filters: {
    search: string;
    country: string;
  };
}

export function AirportsTable({ airports, filters }: AirportsTableProps) {
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>(airports);

  useEffect(() => {
    let result = airports;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (airport) =>
          airport.name.toLowerCase().includes(searchLower) ||
          airport.code.toLowerCase().includes(searchLower) ||
          airport.city.toLowerCase().includes(searchLower)
      );
    }

    if (filters.country) {
      result = result.filter((airport) => airport.country === filters.country);
    }

    setFilteredAirports(result);
  }, [airports, filters]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Airport Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>City / Country</TableHead>
            <TableHead className="text-center">Meeting Points</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAirports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center py-6">
                  <p className="text-lg font-medium text-muted-foreground">No airports found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search filters</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredAirports.map((airport, index) => {
              const meetingPoints = getMeetingPointsByAirport(airport.id);
              return (
                <TableRow key={airport.id} className={index % 2 === 0 ? "hover:bg-gray-50" : "bg-gray-50/50 hover:bg-gray-50"}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {airport.imageUrl ? (
                        <div className="h-10 w-10 rounded overflow-hidden bg-gray-100">
                          <img src={airport.imageUrl} alt={airport.name} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-700 font-semibold">{airport.code.substring(0, 2)}</span>
                        </div>
                      )}
                      <span>{airport.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {airport.code}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {airport.city}, {airport.country}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={meetingPoints.length > 0 ? "default" : "secondary"}>
                      {meetingPoints.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        asChild
                      >
                        <Link to={`/airports/${airport.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="h-8"
                        asChild
                      >
                        <Link to={`/airports/meeting-points/new?airportId=${airport.id}`}>
                          Add Meeting Point
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
