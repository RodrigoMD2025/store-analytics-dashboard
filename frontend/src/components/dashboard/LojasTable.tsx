import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Monitor, Download } from "lucide-react";

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
  const formatarTempoAtraso = (atualizadoEmString: string) => {
    if (!atualizadoEmString) {
      return 'N/A';
    }

    const atualizadoEm = new Date(atualizadoEmString);
    const agora = new Date();

    let diff = agora.getTime() - atualizadoEm.getTime();

    if (diff < 60 * 1000) { // Less than 1 minute
      return 'Atualizada';
    }

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= dias * (1000 * 60 * 60 * 24);
    const horas = Math.floor(diff / (1000 * 60 * 60));
    diff -= horas * (1000 * 60 * 60);
    const minutos = Math.floor(diff / (1000 * 60));

    return `${dias} dias ${horas}h ${minutos}min`;
  };

  const formatarData = (data: string) => {
    if (!data) return 'N/A';
    try {
      return format(new Date(data), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const handleExportCSV = () => {
    const headers = ["Loja", "Player ID", "Atualizado Em", "Tempo de Atraso", "Status"];
    const rows = lojas.map(loja => [
      loja.loja_nome,
      loja.identificador,
      formatarData(loja.atualizado_em),
      formatarTempoAtraso(loja.atualizado_em),
      loja.sincronizada ? "Sincronizada" : "Atrasada"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset-utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().split('T')[0];
    const clienteNome = lojas.length > 0 ? lojas[0].loja_nome.split(' ')[0] : 'cliente';
    link.setAttribute("href", url);
    link.setAttribute("download", `detalhes-lojas-${clienteNome}-${timestamp}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="flex items-center justify-between">
          <CardTitle>Detalhes das Lojas</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loja</TableHead>
                <TableHead>Player ID</TableHead>
                <TableHead>Atualizado em</TableHead>
                <TableHead>Tempo de Atraso</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lojas.map((loja) => (
                <TableRow key={loja.id}>
                  <TableCell className="font-medium">{loja.loja_nome}</TableCell>
                  <TableCell>
                    <Link to={`/player/${loja.identificador}`}>
                      <Button variant="ghost" size="sm" className="font-mono text-xs hover:bg-primary/10">
                        <Monitor className="h-3 w-3 mr-2" />
                        {loja.identificador}
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>{formatarData(loja.atualizado_em)}</TableCell>
                  <TableCell>
                    {formatarTempoAtraso(loja.atualizado_em)}
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