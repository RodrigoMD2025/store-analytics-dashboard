import { useParams, useNavigate } from "react-router-dom";
import { usePlayerDetails } from "@/hooks/usePlayerDetails";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowLeft,
    Monitor,
    Music,
    Radio,
    CheckCircle,
    XCircle,
    FileMusic,
    Calendar,
    HardDrive
} from "lucide-react";

const PlayerDetails = () => {
    const { uid } = useParams<{ uid: string }>();
    const navigate = useNavigate();
    const { playerDetails, files, loading, error } = usePlayerDetails(uid || '');

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-6">
                    <Button onClick={() => navigate('/')} variant="outline" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                    <Card className="border-destructive">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                                <p className="text-lg font-semibold text-destructive">Erro ao carregar dados</p>
                                <p className="text-sm text-muted-foreground mt-2">{error}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-6">
                    <Skeleton className="h-10 w-32 mb-6" />
                    <Skeleton className="h-8 w-96 mb-2" />
                    <Skeleton className="h-4 w-64 mb-6" />

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader className="pb-2">
                                    <Skeleton className="h-4 w-24" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-8 w-16 mb-2" />
                                    <Skeleton className="h-3 w-20" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!playerDetails) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-6">
                    <Button onClick={() => navigate('/')} variant="outline" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">Player não encontrado</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    const formatCNPJ = (cnpj: string) => {
        if (!cnpj) return 'Não disponível';
        const cleaned = cnpj.replace(/\D/g, '');
        if (cleaned.length !== 14) return cnpj;
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };

    const formatMissingFiles = (count: number, type: 'music' | 'sazonal') => {
        if (count === 0) return '0 Faixas';
        return count === 1 ? '1 Faixa' : `${count} Faixas`;
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                {/* Botão Voltar */}
                <Button onClick={() => navigate('/')} variant="outline" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Dashboard
                </Button>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Monitor className="h-8 w-8 text-primary" />
                        Detalhes do Player
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {playerDetails.cliente_nome} • {playerDetails.cnpj || 'CNPJ não disponível'}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono mt-1">
                        {playerDetails.player_uid}
                    </p>
                </div>

                {/* Métricas Principais */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <MetricCard
                        title="Sincronização Music"
                        value={`${playerDetails.music_percentage.toFixed(1)}%`}
                        subtitle={`${playerDetails.music_downloaded} de ${playerDetails.music_total} arquivos`}
                        icon={Music}
                        variant={playerDetails.music_percentage >= 90 ? "success" : "warning"}
                    />

                    <MetricCard
                        title="Sincronização Sazonal"
                        value={`${playerDetails.sazonal_percentage.toFixed(1)}%`}
                        subtitle={`${playerDetails.sazonal_downloaded} de ${playerDetails.sazonal_total} arquivos`}
                        icon={Calendar}
                        variant={playerDetails.sazonal_percentage >= 90 ? "success" : "warning"}
                    />

                    <MetricCard
                        title="Total de Spots"
                        value={playerDetails.spots_count.toString()}
                        subtitle="Spots ativos"
                        icon={Radio}
                        variant="default"
                    />

                    <MetricCard
                        title="Status Playlist"
                        value={playerDetails.sincronizada ? 'Sincronizada' : 'Atrasada'}
                        subtitle={`Última atualização: ${formatDate(playerDetails.recorded_at)}`}
                        icon={playerDetails.sincronizada ? CheckCircle : XCircle}
                        variant={playerDetails.sincronizada ? "success" : "danger"}
                    />
                </div>

                {/* Tabelas de Arquivos */}
                <div className="grid gap-6 md:grid-cols-3 mb-6">
                    {/* Music */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileMusic className="h-5 w-5 text-primary" />
                                Playlist Principal ({files.music.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {files.music.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Nenhum arquivo encontrado
                                </p>
                            ) : (
                                <div className="max-h-96 overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Arquivo</TableHead>
                                                <TableHead>Tamanho</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {files.music.map((file, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="text-xs">{file.filename}</TableCell>
                                                    <TableCell className="text-xs">{formatFileSize(file.file_size)}</TableCell>
                                                    <TableCell>
                                                        {file.is_valid ? (
                                                            <Badge variant="secondary" className="text-xs">OK</Badge>
                                                        ) : (
                                                            <Badge variant="destructive" className="text-xs">Erro</Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Sazonal */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Pasta Sazonal ({files.sazonal.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {files.sazonal.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Nenhum arquivo encontrado
                                </p>
                            ) : (
                                <div className="max-h-96 overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Arquivo</TableHead>
                                                <TableHead>Tamanho</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {files.sazonal.map((file, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="text-xs">{file.filename}</TableCell>
                                                    <TableCell className="text-xs">{formatFileSize(file.file_size)}</TableCell>
                                                    <TableCell>
                                                        {file.is_valid ? (
                                                            <Badge variant="secondary" className="text-xs">OK</Badge>
                                                        ) : (
                                                            <Badge variant="destructive" className="text-xs">Erro</Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Spots */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Radio className="h-5 w-5 text-primary" />
                                Pasta Spots ({files.spots.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {files.spots.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Nenhum arquivo encontrado
                                </p>
                            ) : (
                                <div className="max-h-96 overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Arquivo</TableHead>
                                                <TableHead>Tamanho</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {files.spots.slice(0, 10).map((file, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="text-xs">{file.filename}</TableCell>
                                                    <TableCell className="text-xs">{formatFileSize(file.file_size)}</TableCell>
                                                    <TableCell>
                                                        {file.is_valid ? (
                                                            <Badge variant="secondary" className="text-xs">OK</Badge>
                                                        ) : (
                                                            <Badge variant="destructive" className="text-xs">Erro</Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {files.spots.length > 10 && (
                                        <p className="text-xs text-muted-foreground text-center mt-2">
                                            +{files.spots.length - 10} arquivos adicionais
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Informações Adicionais */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-primary" />
                            Informações do Sistema
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium">Player UID</p>
                                <p className="text-sm text-muted-foreground font-mono">{playerDetails.player_uid}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">CNPJ</p>
                                <p className="text-sm text-muted-foreground">{formatCNPJ(playerDetails.cnpj)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Arquivos Faltantes (Music)</p>
                                <p className="text-sm text-muted-foreground">{formatMissingFiles(playerDetails.music_missing, 'music')}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Arquivos Faltantes (Sazonal)</p>
                                <p className="text-sm text-muted-foreground">{formatMissingFiles(playerDetails.sazonal_missing, 'sazonal')}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Última Sincronização</p>
                                <p className="text-sm text-muted-foreground">{formatDate(playerDetails.recorded_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Duração da Última Sincronização</p>
                                <p className="text-sm text-muted-foreground">{playerDetails.last_sync_duration}s</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PlayerDetails;
