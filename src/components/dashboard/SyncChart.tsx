import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SyncChartProps {
  data: {
    sincronizadas: number;
    atrasadas: number;
    total: number;
  };
}

const COLORS = {
  sincronizadas: 'hsl(var(--accent))',
  atrasadas: 'hsl(var(--destructive))'
};

export function SyncChart({ data }: SyncChartProps) {
  const chartData = [
    {
      name: 'Sincronizadas',
      value: data.sincronizadas,
      percentage: ((data.sincronizadas / data.total) * 100).toFixed(1)
    },
    {
      name: 'Atrasadas', 
      value: data.atrasadas,
      percentage: ((data.atrasadas / data.total) * 100).toFixed(1)
    }
  ];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; percentage: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-card-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} lojas ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? COLORS.sincronizadas : COLORS.atrasadas}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontSize: '14px',
              color: 'hsl(var(--foreground))'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}