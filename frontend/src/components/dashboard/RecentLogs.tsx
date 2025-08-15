import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LogExecucao {
  id: string;
  cliente_nome: string;
  status: "sucesso" | "erro" | "sem_dados";
  detalhes: string;
  total_lojas: number;
  executado_em: string;
  origem: string;
}

interface RecentLogsProps {
  logs: LogExecucao[];
}

export function RecentLogs({ logs }: RecentLogsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sucesso":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "erro":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "sem_dados":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "sucesso":
        return "secondary" as const;
      case "erro":
        return "destructive" as const;
      case "sem_dados":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "sucesso":
        return "Sucesso";
      case "erro":
        return "Erro";
      case "sem_dados":
        return "Sem dados";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Execuções Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma execução recente encontrada
            </p>
          ) : (
            logs.slice(0, 10).map((log) => (
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
                    {formatDistanceToNow(new Date(log.executado_em), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
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
  );
}