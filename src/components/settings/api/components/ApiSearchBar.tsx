
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ApiSearchBarProps {
  onSearch: (query: string) => void;
}

export function ApiSearchBar({ onSearch }: ApiSearchBarProps) {
  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        type="search" 
        placeholder="Search APIs..." 
        className="pl-8"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
