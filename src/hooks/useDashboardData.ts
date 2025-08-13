import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Cliente {
  id: string;
  nome: string;
  email: string;
}

interface LogExecucao {
  id: string;
  cliente_nome: string;
  status: 'sucesso' | 'erro' | 'sem_dados';
  detalhes: string | null;
  total_lojas: number;
  executado_em: string;
  origem: string;
}

interface DashboardStats {
  totalLojas: number;
  totalSincronizadas: number;
  totalAtrasadas: number;
  percentualSincronizacao: number;
  ultimaExecucao: string;
  totalClientes: number;
  executacoesHoje: number;
  sucessos: number;
  erros: number;
}

export function useDashboardData(clienteId: string | null = null) {
  const [stats, setStats] = useState<DashboardStats>({
    totalLojas: 0,
    totalSincronizadas: 0,
    totalAtrasadas: 0,
    percentualSincronizacao: 0,
    ultimaExecucao: '',
    totalClientes: 0,
    executacoesHoje: 0,
    sucessos: 0,
    erros: 0
  });
  
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [logs, setLogs] = useState<LogExecucao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Buscar clientes
        const { data: clientesData, error: clientesError } = await supabase
          .from('clientes')
          .select('id, nome, email')
          .eq('ativo', true);

        if (clientesError) throw clientesError;

        // Buscar logs de execução
        let logsQuery = supabase
          .from('logs_execucao')
          .select('*')
          .order('executado_em', { ascending: false });

        // Filtrar por cliente se selecionado
        if (clienteId) {
          const clienteSelecionado = clientesData?.find(c => c.id.toString() === clienteId);
          if (clienteSelecionado) {
            logsQuery = logsQuery.eq('cliente_nome', clienteSelecionado.nome);
          }
        }

        const { data: logsData, error: logsError } = await logsQuery;

        if (logsError) throw logsError;

        // Transformar dados para o formato esperado
        const clientesFormatados = (clientesData || []).map(cliente => ({
          id: cliente.id.toString(),
          nome: cliente.nome,
          email: cliente.email
        }));

        const logsFormatados = (logsData || []).map(log => ({
          id: log.id.toString(),
          cliente_nome: log.cliente_nome,
          status: log.status as 'sucesso' | 'erro' | 'sem_dados',
          detalhes: log.detalhes,
          total_lojas: log.total_lojas || 0,
          executado_em: log.executado_em,
          origem: log.origem || 'local'
        }));

        setClientes(clientesFormatados);
        setLogs(logsFormatados);

        // Calcular estatísticas
        const filteredLogs = logsData || [];
        const sucessos = filteredLogs.filter(log => log.status === 'sucesso').length;
        const erros = filteredLogs.filter(log => log.status === 'erro').length;
        const totalLojas = filteredLogs.reduce((acc, log) => acc + (log.total_lojas || 0), 0);
        
        // Simular dados de sincronização (85% sincronizadas)
        const sincronizadas = Math.floor(totalLojas * 0.85);
        const atrasadas = totalLojas - sincronizadas;
        
        const hoje = new Date().toDateString();
        const executacoesHoje = filteredLogs.filter(log => 
          new Date(log.executado_em).toDateString() === hoje
        ).length;
        
        const ultimaExecucao = filteredLogs.length > 0 
          ? new Date(filteredLogs[0].executado_em)
          : new Date();
        
        setStats({
          totalLojas,
          totalSincronizadas: sincronizadas,
          totalAtrasadas: atrasadas,
          percentualSincronizacao: totalLojas > 0 ? (sincronizadas / totalLojas) * 100 : 0,
          ultimaExecucao: ultimaExecucao.toLocaleString('pt-BR'),
          totalClientes: clienteId ? 1 : (clientesData?.length || 0),
          executacoesHoje,
          sucessos,
          erros
        });
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [clienteId]);

  return {
    stats,
    clientes,
    logs,
    loading
  };
}