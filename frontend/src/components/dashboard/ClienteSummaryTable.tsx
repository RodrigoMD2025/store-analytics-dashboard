import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, ChevronRight, Download, Search, ChevronLeft, ChevronsLeft, ChevronRight as ChevronRightIcon, ChevronsRight } from "lucide-react";

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

const ITEMS_PER_PAGE = 20;
const PAGINATION_THRESHOLD = 50;

export function ClienteSummaryTable({ lojas, onClienteClick }: ClienteSummaryTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Agrupar lojas por cliente
    const allClienteSummaries: ClienteSummary[] = useMemo(() => {
        return Object.values(
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
        })).sort((a, b) => b.totalLojas - a.totalLojas);
    }, [lojas]);

    // Filtrar por busca
    const filteredSummaries = useMemo(() => {
        if (!searchTerm) return allClienteSummaries;

        const lowerSearch = searchTerm.toLowerCase();
        return allClienteSummaries.filter(cliente =>
            cliente.clienteNome.toLowerCase().includes(lowerSearch)
        );
    }, [allClienteSummaries, searchTerm]);

    // Paginação
    const totalPages = Math.ceil(filteredSummaries.length / ITEMS_PER_PAGE);
    const shouldPaginate = filteredSummaries.length > PAGINATION_THRESHOLD;

    const paginatedSummaries = useMemo(() => {
        if (!shouldPaginate) return filteredSummaries;

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredSummaries.slice(startIndex, endIndex);
    }, [filteredSummaries, currentPage, shouldPaginate]);

    const displayedSummaries = shouldPaginate ? paginatedSummaries : filteredSummaries;

    // Resetar para primeira página ao buscar
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Exportar CSV
    const handleExportCSV = () => {
        const headers = ["Cliente", "Total de Lojas", "Lojas Sincronizadas", "Lojas Atrasadas", "Taxa de Sucesso (%)"];
        const rows = filteredSummaries.map(cliente => [
            cliente.clienteNome,
            cliente.totalLojas,
            cliente.lojasSincronizadas,
            cliente.lojasAtrasadas,
            cliente.taxaSucesso
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset-utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute("href", url);
        link.setAttribute("download", `resumo-clientes-${timestamp}.csv`);
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (allClienteSummaries.length === 0) {
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

    const startIndex = shouldPaginate ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 1;
    const endIndex = shouldPaginate ? Math.min(startIndex + displayedSummaries.length - 1, filteredSummaries.length) : filteredSummaries.length;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Resumo por Cliente
                    </CardTitle>
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

                {/* Busca */}
                <div className="flex items-center gap-2 pt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {filteredSummaries.length} {filteredSummaries.length === 1 ? 'cliente' : 'clientes'}
                    </div>
                </div>
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
                            {displayedSummaries.map((cliente) => (
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

                {/* Paginação */}
                {shouldPaginate && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {startIndex}-{endIndex} de{filteredSummaries.length} clientes
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="text-sm font-medium px-2">
                                Página {currentPage} de {totalPages}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="mt-4 text-sm text-muted-foreground">
                    <p>Clique em um cliente para ver os detalhes das lojas</p>
                </div>
            </CardContent>
        </Card>
    );
}
