import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

interface LojasTableProps {
  lojas: LojaData[];
}

export function LojasTable({ lojas }: LojasTableProps) {
  const formatarTempoAtraso = (horas: number, dias: number) => {
    if (dias > 0) {
      return `${dias} dia${dias > 1 ? 's' : ''}`;
    }
    if (horas > 0) {
      const totalMinutes = Math.round(horas * 60);
      if (totalMinutes === 0) {
        return 'Atualizada';
      }

      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;

      let result = '';
      if (h > 0) {
        result += `${h} hora${h > 1 ? 's' : ''}`;
      }
      if (m > 0) {
        if (result) {
          result += ' e ';
        }
        result += `${m} minuto${m > 1 ? 's' : ''}`;
      }
      return result;
    }
    return 'Atualizada';
  };

  const formatarData = (data: string) => {
    if (!data) return 'N/A';
    try {
      return format(new Date(data), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  if (lojas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detalhes das Lojas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>Nenhum dado de loja disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes das Lojas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loja</TableHead>
                <TableHead>Identificador</TableHead>
                <TableHead>Atualizado em</TableHead>
                <TableHead>Tempo de Atraso</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lojas.map((loja) => (
                <TableRow key={loja.id}>
                  <TableCell className="font-medium">{loja.loja_nome}</TableCell>
                  <TableCell>{loja.identificador}</TableCell>
                  <TableCell>{formatarData(loja.atualizado_em)}</TableCell>
                  <TableCell>
                    {formatarTempoAtraso(loja.tempo_atraso_horas, loja.tempo_atraso_dias)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={loja.sincronizada ? "default" : "destructive"}>
                      {loja.sincronizada ? "Sincronizada" : "Atrasada"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}