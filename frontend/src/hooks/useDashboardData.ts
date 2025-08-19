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

interface LojaData {
  id: string;
  loja_nome: string;
  identificador: string;
  atualizado_em: string;
  sincronizada: boolean;
  tempo_atraso_horas: number;
  tempo_atraso_dias: number;
  data_coleta: string;
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
  const [lojas, setLojas] = useState<LojaData[]>([]);
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
          .select('*');

        // Filtrar por cliente se selecionado
        if (clienteId) {
          const clienteSelecionado = clientesData?.find(c => c.id.toString() === clienteId);
          if (clienteSelecionado) {
            logsQuery = logsQuery.eq('cliente_nome', clienteSelecionado.nome);
          }
        }

        // Aplicar ordenação e limite no final
        logsQuery = logsQuery.order('executado_em', { ascending: false }).limit(3);

        const { data: logsData, error: logsError } = await logsQuery;

        if (logsError) throw logsError;

        // Buscar dados das lojas (apenas os mais recentes de cada cliente)
        let lojasQuery = supabase
          .from('lojas_dados')
          .select('*')
          .order('data_coleta', { ascending: false });

        // Filtrar por cliente se selecionado
        if (clienteId) {
          const clienteSelecionado = clientesData?.find(c => c.id.toString() === clienteId);
          if (clienteSelecionado) {
            // Buscar apenas os dados mais recentes para este cliente
            const { data: execucoesData } = await supabase
              .from('execucoes')
              .select('id')
              .eq('cliente_nome', clienteSelecionado.nome)
              .order('executado_em', { ascending: false })
              .limit(1);

            if (execucoesData && execucoesData.length > 0) {
              lojasQuery = lojasQuery.eq('execucao_id', execucoesData[0].id);
            } else {
              lojasQuery = lojasQuery.eq('cliente_nome', clienteSelecionado.nome);
            }
          }
        } else {
          // Para todos os clientes, buscar os dados da última execução de cada um
          const { data: latestExecutions, error: execError } = await supabase
            .from('execucoes')
            .select('id')
            .order('executado_em', { ascending: false })
            .limit(clientesData?.length || 1); // Limita ao número de clientes

          if (execError) throw execError;

          const executionIds = latestExecutions?.map(e => e.id) || [];

          if (executionIds.length > 0) {
            lojasQuery = lojasQuery.in('execucao_id', executionIds);
          } else {
            lojasQuery = lojasQuery.limit(0); // Nenhum dado se não houver execuções
          }
        }

        const { data: lojasData, error: lojasError } = await lojasQuery;

        if (lojasError) throw lojasError;

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

        const lojasFormatadas = (lojasData || []).map(loja => ({
          id: loja.id,
          loja_nome: loja.loja_nome,
          identificador: loja.identificador,
          atualizado_em: loja.atualizado_em,
          sincronizada: loja.sincronizada,
          tempo_atraso_horas: loja.tempo_atraso_horas,
          tempo_atraso_dias: loja.tempo_atraso_dias,
          data_coleta: loja.data_coleta
        }));

        setClientes(clientesFormatados);
        setLogs(logsFormatados);
        setLojas(lojasFormatadas);

        // Calcular estatísticas reais com base nos dados das lojas
        const totalLojas = lojasFormatadas.length;
        const sincronizadas = lojasFormatadas.filter(loja => loja.sincronizada).length;
        const atrasadas = totalLojas - sincronizadas;
        
        const sucessos = logsData ? logsData.filter(log => log.status === 'sucesso').length : 0;
        const erros = logsData ? logsData.filter(log => log.status === 'erro').length : 0;
        
        const hoje = new Date().toDateString();
        const executacoesHoje = logsData ? logsData.filter(log => 
          new Date(log.executado_em).toDateString() === hoje
        ).length : 0;
        
        const ultimaExecucao = logsData && logsData.length > 0 
          ? new Date(logsData[0].executado_em)
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
    lojas,
    loading
  };
}