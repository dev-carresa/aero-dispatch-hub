
type StatItem = {
  title: string;
  value: string;
  change: string;
  duration: string;
};

interface InvoiceStatsProps {
  stats: StatItem[];
}

import { Card, CardContent } from "@/components/ui/card";

export const InvoiceStats = ({ stats }: InvoiceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover-scale shadow-sm card-gradient">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold">{stat.value}</p>
              <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.duration}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
