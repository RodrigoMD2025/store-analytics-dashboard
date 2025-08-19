import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface LogExecucao {
  id: string;
  cliente_nome: string;
  status: 'sucesso' | 'erro' | 'sem_dados';
  detalhes: string | null;
  total_lojas: number;
  executado_em: string;
  origem: string;
}

const DailyExecutions = () => {
  const [dailyLogs, setDailyLogs] = useState<LogExecucao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const { data, error } = await supabase
          .from('logs_execucao')
          .select('*')
          .gte('executado_em', `${today}T00:00:00.000Z`)
          .lte('executado_em', `${today}T23:59:59.999Z`)
          .order('executado_em', { ascending: false });

        if (error) throw error;

        setDailyLogs(data || []);
      } catch (err: any) {
        console.error('Erro ao buscar logs diários:', err);
        setError('Erro ao carregar logs diários: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyLogs();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sucesso':
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case 'erro':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'sem_dados':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'sucesso':
        return 'secondary' as const;
      case 'erro':
        return 'destructive' as const;
      case 'sem_dados':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sucesso':
        return 'Sucesso';
      case 'erro':
        return 'Erro';
      case 'sem_dados':
        return 'Sem dados';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-6">Carregando logs...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-6 text-destructive">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Todas as Execuções de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyLogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma execução encontrada para hoje.
                </p>
              ) : (
                dailyLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between border-b border-border pb-3 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(log.status)}
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {log.cliente_nome}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(log.status)}>
                            {getStatusLabel(log.status)}
                          </Badge>
                          {log.total_lojas > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {log.total_lojas} lojas
                            </span>
                          )}
                        </div>
                        {log.detalhes && (
                          <p className="text-xs text-muted-foreground max-w-md">
                            {log.detalhes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(log.executado_em), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.origem}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyExecutions;
