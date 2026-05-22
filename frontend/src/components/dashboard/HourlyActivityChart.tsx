import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock } from 'lucide-react';
import type { HourlyDistribution } from '@/hooks/useStoreAnalytics';

interface HourlyActivityChartProps {
  data: HourlyDistribution[];
  loading?: boolean;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-card-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">
          {payload[0].value} {payload[0].value === 1 ? 'loja' : 'lojas'}
        </p>
      </div>
    );
  }
  return null;
}

export function HourlyActivityChart({ data, loading }: HourlyActivityChartProps) {
  const chartData = data.map(d => ({ hora: `${String(d.hour).padStart(2, '0')}h`, count: d.count, hour: d.hour }));
  const maxCount = Math.max(...data.map(d => d.count), 1);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Atividade por Hora
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis
                dataKey="hora"
                tick={{ fontSize: 10 }}
                interval={2}
                className="text-muted-foreground"
              />
              <YAxis
                domain={[0, maxCount]}
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="hsl(var(--chart-1))"
                radius={[3, 3, 0, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Distribuição das atualizações das lojas ao longo do dia
        </p>
      </CardContent>
    </Card>
  );
}
