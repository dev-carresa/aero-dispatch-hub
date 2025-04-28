
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const data = [
  { name: 'Website', bookings: 120, color: '#2563eb' },
  { name: 'Mobile', bookings: 98, color: '#3b82f6' },
  { name: 'Phone', bookings: 86, color: '#60a5fa' },
  { name: 'Agent', bookings: 72, color: '#93c5fd' },
  { name: 'Affiliate', bookings: 43, color: '#bfdbfe' },
];

export function BookingSourcesChart() {
  return (
    <Card className="hover-scale shadow-sm card-gradient">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Booking Sources</CardTitle>
          <CardDescription>Bookings by source channel</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>This Month</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 20,
              }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip
                labelStyle={{ fontWeight: 'bold' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: 'none'
                }}
              />
              <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
