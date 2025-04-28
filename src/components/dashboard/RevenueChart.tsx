
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CalendarIcon, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
  { name: 'Aug', revenue: 4000 },
  { name: 'Sep', revenue: 2780 },
  { name: 'Oct', revenue: 1890 },
  { name: 'Nov', revenue: 3578 },
  { name: 'Dec', revenue: 3910 },
];

export function RevenueChart() {
  return (
    <Card className="col-span-1 lg:col-span-2 hover-scale shadow-sm card-gradient">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Monthly Revenue</CardTitle>
          <CardDescription>Revenue overview for the current year</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>2025</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Export</span>
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export as PNG</DropdownMenuItem>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Print Chart</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Revenue']}
                labelStyle={{ fontWeight: 'bold' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: 'none'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563eb" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                dot={{ r: 3, strokeWidth: 2, stroke: '#2563eb', fill: 'white' }}
                activeDot={{ r: 5, strokeWidth: 0, fill: '#2563eb' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
