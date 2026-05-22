import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SyncChart } from "@/components/dashboard/SyncChart";
import { ClienteSelect } from "@/components/dashboard/ClienteSelect";
import { RecentLogs } from "@/components/dashboard/RecentLogs";
import { LojasTable } from "@/components/dashboard/LojasTable";
import { ClienteSummaryTable } from "@/components/dashboard/ClienteSummaryTable";
import { HourlyActivityChart } from "@/components/dashboard/HourlyActivityChart";
import { SyncTrendChart } from "@/components/dashboard/SyncTrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useStoreAnalytics } from "@/hooks/useStoreAnalytics";
import {
  Store,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Calendar,
  Users,
  Wifi
} from "lucide-react";

const Index = () => {
  const [selectedCliente, setSelectedCliente] = useState<string | null>(null);
  const { stats, clientes, logs, lojas, loading } = useDashboardData(selectedCliente);
  const selectedClienteNome = selectedCliente
    ? clientes.find(c => c.id === selectedCliente)?.nome || null
    : null;
  const analytics = useStoreAnalytics(7, selectedClienteNome);

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
          <div className="flex items-center justify-between animate-fade-in">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
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

          {/* Análises estatísticas */}
          <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
            <HourlyActivityChart
              data={analytics.hourlyDistribution}
              loading={analytics.loading}
            />
            <SyncTrendChart
              data={analytics.syncTrend}
              loading={analytics.loading}
            />
          </div>

          {/* Gráficos e logs */}
          <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
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

          {/* Tabela de lojas ou resumo por cliente */}
          {selectedCliente === null ? (
            <ClienteSummaryTable
              lojas={lojas}
              onClienteClick={(clienteNome) => {
                const cliente = clientes.find(c => c.nome === clienteNome);
                if (cliente) setSelectedCliente(cliente.id);
              }}
            />
          ) : (
            <LojasTable lojas={lojas} />
          )}

          {/* Saúde do Sistema */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
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

            <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Lojas Online / Offline
                </CardTitle>
                <Wifi className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {analytics.onlineOfflineRatio.online}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {analytics.onlineOfflineRatio.total}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {analytics.loading ? '...' : `${Math.round((analytics.onlineOfflineRatio.online / Math.max(analytics.onlineOfflineRatio.total, 1)) * 100)}% online`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="text-xs text-muted-foreground">
                      {analytics.onlineOfflineRatio.offline} crítica
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Saúde das Execuções
                </CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {analytics.executionHealth.total}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    execuções (7d)
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                    ✅ {analytics.executionHealth.success}
                  </Badge>
                  <Badge variant="destructive" className="text-xs px-1.5 py-0 h-5">
                    ❌ {analytics.executionHealth.error}
                  </Badge>
                  {analytics.executionHealth.noData > 0 && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                      ⏸️ {analytics.executionHealth.noData}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
