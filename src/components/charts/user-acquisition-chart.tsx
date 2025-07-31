  'use client';

  import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
  } from 'recharts';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

  interface AcquisitionDataItem {
    channel: string;
    users: number;
  }

  interface UserAcquisitionChartProps {
    data: AcquisitionDataItem[];
  }

  export function UserAcquisitionChart({ data }: UserAcquisitionChartProps) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>User Acquisition by Channel</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }
