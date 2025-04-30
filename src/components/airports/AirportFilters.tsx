
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AirportFiltersProps {
  onFilterChange: (filters: { search: string; country: string }) => void;
  countries: string[];
}

export function AirportFilters({ onFilterChange, countries }: AirportFiltersProps) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ search: e.target.value, country });
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    onFilterChange({ search, country: value });
  };

  const handleReset = () => {
    setSearch("");
    setCountry("");
    onFilterChange({ search: "", country: "" });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex-grow">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          placeholder="Search by airport name, code, or city..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex w-full md:w-auto">
        <div className="mr-2">
          <Label htmlFor="country" className="sr-only">
            Country
          </Label>
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger id="country" className="w-[180px]">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Countries</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
