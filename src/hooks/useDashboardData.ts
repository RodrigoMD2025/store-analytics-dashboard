import { useState, useEffect } from 'react';

// Mock data - Substitua por dados reais do Supabase
const mockClientes = [
  { id: '1', nome: 'Cliente A', email: 'clientea@email.com' },
  { id: '2', nome: 'Cliente B', email: 'clienteb@email.com' },
  { id: '3', nome: 'Cliente C', email: 'clientec@email.com' },
];

const mockLogs = [
  {
    id: '1',
    cliente_nome: 'Cliente A',
    status: 'sucesso' as const,
    detalhes: 'Relatório gerado com 156 lojas',
    total_lojas: 156,
    executado_em: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    origem: 'GitHub Actions'
  },
  {
    id: '2', 
    cliente_nome: 'Cliente B',
    status: 'erro' as const,
    detalhes: 'Falha no login - verifique credenciais',
    total_lojas: 0,
    executado_em: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 horas atrás
    origem: 'GitHub Actions'
  },
  {
    id: '3',
    cliente_nome: 'Cliente C', 
    status: 'sucesso' as const,
    detalhes: 'Relatório gerado com 89 lojas',
    total_lojas: 89,
    executado_em: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 horas atrás
    origem: 'Execução Local'
  },
  {
    id: '4',
    cliente_nome: 'Cliente A',
    status: 'sem_dados' as const,
    detalhes: 'Nenhuma loja encontrada no sistema',
    total_lojas: 0,
    executado_em: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 horas atrás
    origem: 'GitHub Actions'
  }
];

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
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    const loadData = async () => {
      setLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filtrar logs por cliente se selecionado
      const filteredLogs = clienteId 
        ? mockLogs.filter(log => log.cliente_nome.includes(clienteId === '1' ? 'Cliente A' : clienteId === '2' ? 'Cliente B' : 'Cliente C'))
        : mockLogs;
      
      // Calcular estatísticas baseadas nos logs filtrados
      const sucessos = filteredLogs.filter(log => log.status === 'sucesso').length;
      const erros = filteredLogs.filter(log => log.status === 'erro').length;
      const totalLojas = filteredLogs.reduce((acc, log) => acc + log.total_lojas, 0);
      
      // Mock de dados de sincronização
      const sincronizadas = Math.floor(totalLojas * 0.85); // 85% sincronizadas
      const atrasadas = totalLojas - sincronizadas;
      
      const hoje = new Date().toDateString();
      const executacoesHoje = filteredLogs.filter(log => 
        new Date(log.executado_em).toDateString() === hoje
      ).length;
      
      const ultimaExecucao = filteredLogs.length > 0 
        ? new Date(Math.max(...filteredLogs.map(log => new Date(log.executado_em).getTime())))
        : new Date();
      
      setStats({
        totalLojas,
        totalSincronizadas: sincronizadas,
        totalAtrasadas: atrasadas,
        percentualSincronizacao: totalLojas > 0 ? (sincronizadas / totalLojas) * 100 : 0,
        ultimaExecucao: ultimaExecucao.toLocaleString('pt-BR'),
        totalClientes: clienteId ? 1 : mockClientes.length,
        executacoesHoje,
        sucessos,
        erros
      });
      
      setLoading(false);
    };
    
    loadData();
  }, [clienteId]);

  return {
    stats,
    clientes: mockClientes,
    logs: mockLogs,
    loading
  };
}