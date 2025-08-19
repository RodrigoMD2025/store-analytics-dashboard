import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SyncChart } from "@/components/dashboard/SyncChart";
import { ClienteSelect } from "@/components/dashboard/ClienteSelect";
import { RecentLogs } from "@/components/dashboard/RecentLogs";
import { LojasTable } from "@/components/dashboard/LojasTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/useDashboardData";
import { 
  Store, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Activity,
  Calendar,
  Users
} from "lucide-react";

const Index = () => {
  const [selectedCliente, setSelectedCliente] = useState<string | null>(null);
  const { stats, clientes, logs, lojas, loading } = useDashboardData(selectedCliente);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader totalClientes={0} />
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-3 w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    sincronizadas: stats.totalSincronizadas,
    atrasadas: stats.totalAtrasadas,
    total: stats.totalLojas
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        totalClientes={stats.totalClientes}
        ultimaAtualizacao={stats.ultimaExecucao}
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6">
          {/* Filtros */}
          <div className="flex items-center justify-between">
            <ClienteSelect
              clientes={clientes}
              selectedCliente={selectedCliente}
              onClienteChange={(value) => {
                console.log('Callback onClienteChange recebido na Index.tsx:', value);
                setSelectedCliente(value);
              }}
            />
          </div>

          {/* Métricas principais */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total de Lojas"
              value={stats.totalLojas.toLocaleString('pt-BR')}
              subtitle="Lojas monitoradas"
              icon={Store}
              variant="default"
            />
            
            <MetricCard
              title="Lojas Sincronizadas"
              value={stats.totalSincronizadas.toLocaleString('pt-BR')}
              subtitle={`${stats.percentualSincronizacao.toFixed(1)}% do total`}
              icon={CheckCircle}
              variant="success"
            />
            
            <MetricCard
              title="Lojas Atrasadas"
              value={stats.totalAtrasadas.toLocaleString('pt-BR')}
              subtitle={`${(100 - stats.percentualSincronizacao).toFixed(1)}% do total`}
              icon={XCircle}
              variant="danger"
            />
            
            <MetricCard
              title="Taxa de Sucesso"
              value={`${stats.sucessos + stats.erros > 0 ? ((stats.sucessos / (stats.sucessos + stats.erros)) * 100).toFixed(1) : 0}%`}
              subtitle={`${stats.sucessos} sucessos, ${stats.erros} erros`}
              icon={TrendingUp}
              variant={stats.erros === 0 ? "success" : "warning"}
            />
          </div>

          {/* Gráficos e logs */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Status de Sincronização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SyncChart data={chartData} />
              </CardContent>
            </Card>
            
            <RecentLogs logs={logs} />
          </div>

          {/* Tabela de lojas */}
          <LojasTable lojas={lojas} />

          {/* Estatísticas adicionais */}
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Execuções Hoje"
              value={stats.executacoesHoje}
              subtitle="Processamentos realizados"
              icon={Calendar}
              variant="default"
            />
            
            <MetricCard
              title="Clientes Ativos"
              value={stats.totalClientes}
              subtitle="Total de clientes"
              icon={Users}
              variant="default"
            />
            
            <MetricCard
              title="Última Execução"
              value="Recente"
              subtitle={stats.ultimaExecucao}
              icon={Activity}
              variant="default"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
