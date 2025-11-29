import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, ChevronRight } from "lucide-react";

interface LojaData {
    id: string;
    loja_nome: string;
    identificador: string;
    cliente_nome: string;
    sincronizada: boolean;
}

interface ClienteSummaryTableProps {
    lojas: LojaData[];
    onClienteClick?: (clienteNome: string) => void;
}

interface ClienteSummary {
    clienteNome: string;
    totalLojas: number;
    lojasSincronizadas: number;
    lojasAtrasadas: number;
    taxaSucesso: number;
}

export function ClienteSummaryTable({ lojas, onClienteClick }: ClienteSummaryTableProps) {
    // Agrupar lojas por cliente
    const clienteSummaries: ClienteSummary[] = Object.values(
        lojas.reduce((acc, loja) => {
            const clienteNome = loja.cliente_nome;

            if (!acc[clienteNome]) {
                acc[clienteNome] = {
                    clienteNome,
                    totalLojas: 0,
                    lojasSincronizadas: 0,
                    lojasAtrasadas: 0,
                    taxaSucesso: 0,
                };
            }

            acc[clienteNome].totalLojas++;
            if (loja.sincronizada) {
                acc[clienteNome].lojasSincronizadas++;
            } else {
                acc[clienteNome].lojasAtrasadas++;
            }

            return acc;
        }, {} as Record<string, ClienteSummary>)
    ).map(summary => ({
        ...summary,
        taxaSucesso: summary.totalLojas > 0
            ? Math.round((summary.lojasSincronizadas / summary.totalLojas) * 100)
            : 0
    })).sort((a, b) => b.totalLojas - a.totalLojas); // Ordenar por total de lojas (maior primeiro)

    if (clienteSummaries.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Resumo por Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <p>Nenhum dado disponível</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Resumo por Cliente
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Cliente</TableHead>
                                <TableHead className="text-center">Total de Lojas</TableHead>
                                <TableHead className="text-center">Lojas Sincronizadas</TableHead>
                                <TableHead className="text-center">Lojas Atrasadas</TableHead>
                                <TableHead className="text-center">Taxa de Sucesso</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clienteSummaries.map((cliente) => (
                                <TableRow
                                    key={cliente.clienteNome}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onClienteClick?.(cliente.clienteNome)}
                                >
                                    <TableCell className="font-medium">{cliente.clienteNome}</TableCell>
                                    <TableCell className="text-center">{cliente.totalLojas}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-green-600 dark:text-green-400 font-medium">
                                            {cliente.lojasSincronizadas}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-red-600 dark:text-red-400 font-medium">
                                            {cliente.lojasAtrasadas}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant={
                                                cliente.taxaSucesso === 100 ? "default" :
                                                    cliente.taxaSucesso >= 80 ? "secondary" :
                                                        "destructive"
                                            }
                                        >
                                            {cliente.taxaSucesso}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    <p>Clique em um cliente para ver os detalhes das lojas</p>
                </div>
            </CardContent>
        </Card>
    );
}
