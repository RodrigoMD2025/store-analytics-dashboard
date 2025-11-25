import { usePlayerMonitoring } from "@/hooks/usePlayerMonitoring";
import { PlayersTable } from "@/components/players/PlayersTable";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Monitor,
    CheckCircle,
    XCircle,
    TrendingUp,
    Activity,
    Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PlayerMonitoring = () => {
    const { stats, players, loading, error } = usePlayerMonitoring();
    const navigate = useNavigate();

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-6">
                    <Button onClick={() => navigate('/')} variant="outline" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Dashboard
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
                    <Skeleton className="h-10 w-48 mb-6" />

                    {/* Header */}
                    <div className="mb-6">
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </div>

                    {/* Métricas */}
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

                    {/* Tabela */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                {/* Botão Voltar */}
                <Button onClick={() => navigate('/')} variant="outline" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Dashboard
                </Button>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Monitor className="h-8 w-8 text-primary" />
                        Monitoramento de Players
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Acompanhe o status e sincronização de todos os players Music Delivery
                    </p>
                </div>

                {/* Métricas Principais */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <MetricCard
                        title="Total de Players"
                        value={stats.totalPlayers.toString()}
                        subtitle="Players cadastrados"
                        icon={Monitor}
                        variant="default"
                    />

                    <MetricCard
                        title="Players Online"
                        value={stats.playersOnline.toString()}
                        subtitle={`${stats.playersOffline} offline`}
                        icon={CheckCircle}
                        variant="success"
                    />

                    <MetricCard
                        title="Sincronização Music"
                        value={`${stats.averageMusicSync.toFixed(1)}%`}
                        subtitle="Média geral"
                        icon={TrendingUp}
                        variant={stats.averageMusicSync >= 90 ? "success" : "warning"}
                    />

                    <MetricCard
                        title="Sincronização Sazonal"
                        value={`${stats.averageSazonalSync.toFixed(1)}%`}
                        subtitle="Média geral"
                        icon={Activity}
                        variant={stats.averageSazonalSync >= 90 ? "success" : "warning"}
                    />
                </div>

                {/* Métricas Secundárias */}
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <MetricCard
                        title="Total de Spots"
                        value={stats.totalSpots.toString()}
                        subtitle="Spots ativos"
                        icon={Radio}
                        variant="default"
                    />

                    <MetricCard
                        title="Players Críticos"
                        value={players.filter(p =>
                            (p.music_percentage + p.sazonal_percentage) / 2 < 80
                        ).length.toString()}
                        subtitle="Sincronização < 80%"
                        icon={XCircle}
                        variant="danger"
                    />

                    <MetricCard
                        title="Última Atualização"
                        value="Recente"
                        subtitle={stats.lastUpdate}
                        icon={Activity}
                        variant="default"
                    />
                </div>

                {/* Tabela de Players */}
                <PlayersTable players={players} />
            </div>
        </div>
    );
};

export default PlayerMonitoring;
