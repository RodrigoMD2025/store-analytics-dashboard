import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HourlyDistribution {
  hour: number;
  count: number;
}

export interface SyncTrendPoint {
  date: string;
  percentage: number;
  totalLojas: number;
}

export interface OnlineOfflineRatio {
  online: number;
  warning: number;
  offline: number;
  total: number;
}

export interface ClientDelay {
  clientName: string;
  avgDelayHours: number;
  totalStores: number;
}

export interface ExecutionHealth {
  success: number;
  error: number;
  noData: number;
  total: number;
}

export interface StoreAnalyticsData {
  hourlyDistribution: HourlyDistribution[];
  syncTrend: SyncTrendPoint[];
  onlineOfflineRatio: OnlineOfflineRatio;
  clientDelays: ClientDelay[];
  executionHealth: ExecutionHealth;
  loading: boolean;
}

function buildHourLabels(): HourlyDistribution[] {
  return Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
}

export function useStoreAnalytics(days = 7, clienteNome?: string | null) {
  const [data, setData] = useState<StoreAnalyticsData>({
    hourlyDistribution: buildHourLabels(),
    syncTrend: [],
    onlineOfflineRatio: { online: 0, warning: 0, offline: 0, total: 0 },
    clientDelays: [],
    executionHealth: { success: 0, error: 0, noData: 0, total: 0 },
    loading: true,
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - days);
        const sinceStr = sinceDate.toISOString();

        let lojasQuery = supabase
          .from('lojas_dados')
          .select('identificador, atualizado_em, sincronizada, tempo_atraso_horas, cliente_nome, data_coleta')
          .gte('data_coleta', sinceStr)
          .order('data_coleta', { ascending: false });

        if (clienteNome) {
          lojasQuery = lojasQuery.eq('cliente_nome', clienteNome);
        }

        const { data: lojas, error: lojasError } = await lojasQuery;
        if (lojasError) throw lojasError;

        let execQuery = supabase
          .from('execucoes')
          .select('executado_em, percentual_sincronizadas, total_lojas, status')
          .gte('executado_em', sinceStr)
          .order('executado_em', { ascending: true });

        if (clienteNome) {
          execQuery = execQuery.eq('cliente_nome', clienteNome);
        }

        const { data: execucoes, error: execError } = await execQuery;
        if (execError) throw execError;

        const latestByStore = new Map<string, typeof lojas[0]>();
        for (const loja of lojas || []) {
          const key = loja.identificador || `${loja.cliente_nome}_${Math.random()}`;
          if (!latestByStore.has(key)) {
            latestByStore.set(key, loja);
          }
        }
        const uniqueLojas = Array.from(latestByStore.values());

        const hourlyDist = buildHourLabels();
        let onlineCount = 0;
        let warningCount = 0;
        let offlineCount = 0;
        const delayMap = new Map<string, { totalDelay: number; count: number }>();

        for (const loja of uniqueLojas) {
          if (loja.atualizado_em) {
            const hour = new Date(loja.atualizado_em).getHours();
            hourlyDist[hour].count += 1;
          }

          const horas = loja.tempo_atraso_horas ?? 0;
          if (horas < 24) {
            onlineCount++;
          } else if (horas < 72) {
            warningCount++;
          } else {
            offlineCount++;
          }

          if (loja.cliente_nome) {
            const entry = delayMap.get(loja.cliente_nome) || { totalDelay: 0, count: 0 };
            entry.totalDelay += horas;
            entry.count += 1;
            delayMap.set(loja.cliente_nome, entry);
          }
        }

        const clientDelays = Array.from(delayMap.entries())
          .map(([clientName, { totalDelay, count }]) => ({
            clientName,
            avgDelayHours: count > 0 ? Math.round((totalDelay / count) * 100) / 100 : 0,
            totalStores: count,
          }))
          .sort((a, b) => b.avgDelayHours - a.avgDelayHours);

        const dateMap = new Map<string, { percentages: number[]; totals: number[] }>();
        let execSuccess = 0;
        let execErrorCount = 0;
        let execNoData = 0;

        for (const exec of execucoes || []) {
          if (exec.status === 'sucesso') execSuccess++;
          else if (exec.status === 'erro') execErrorCount++;
          else if (exec.status === 'sem_dados') execNoData++;

          if (exec.executado_em && exec.percentual_sincronizadas != null) {
            const day = new Date(exec.executado_em).toISOString().split('T')[0];
            const entry = dateMap.get(day) || { percentages: [], totals: [] };
            entry.percentages.push(exec.percentual_sincronizadas);
            entry.totals.push(exec.total_lojas || 0);
            dateMap.set(day, entry);
          }
        }

        const syncTrend = Array.from(dateMap.entries())
          .map(([date, { percentages, totals }]) => ({
            date,
            percentage: percentages.length > 0
              ? Math.round((percentages.reduce((a, b) => a + b, 0) / percentages.length) * 100) / 100
              : 0,
            totalLojas: Math.max(...totals),
          }));

        const totalExecucoes = execSuccess + execErrorCount + execNoData;

        setData({
          hourlyDistribution: hourlyDist,
          syncTrend,
          onlineOfflineRatio: {
            online: onlineCount,
            warning: warningCount,
            offline: offlineCount,
            total: uniqueLojas.length,
          },
          clientDelays,
          executionHealth: {
            success: execSuccess,
            error: execErrorCount,
            noData: execNoData,
            total: totalExecucoes,
          },
          loading: false,
        });
      } catch (err) {
        console.error('Erro ao carregar análises:', err);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    loadAnalytics();
  }, [days, clienteNome]);

  return data;
}
