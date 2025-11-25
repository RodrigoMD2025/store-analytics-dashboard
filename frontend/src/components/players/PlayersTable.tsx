import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface PlayerStatus {
    player_uid: string;
    cnpj: string;
    recorded_at: string;
    music_percentage: number;
    sazonal_percentage: number;
    spots_count: number;
    sync_status: string;
}

interface PlayersTableProps {
    players: PlayerStatus[];
}

export function PlayersTable({ players }: PlayersTableProps) {
    const getStatusBadge = (player: PlayerStatus) => {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const lastUpdate = new Date(player.recorded_at);
        const isOnline = lastUpdate > twoHoursAgo;

        const musicSync = player.music_percentage;
        const sazonalSync = player.sazonal_percentage;
        const avgSync = (musicSync + sazonalSync) / 2;

        if (!isOnline) {
            return (
                <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                    <XCircle className="h-3 w-3" />
                    Offline
                </Badge>
            );
        }

        if (avgSync >= 95) {
            return (
                <Badge variant="secondary" className="flex items-center gap-1 w-fit bg-green-500/10 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-3 w-3" />
                    Ótimo
                </Badge>
            );
        }

        if (avgSync >= 80) {
            return (
                <Badge variant="outline" className="flex items-center gap-1 w-fit text-yellow-700 dark:text-yellow-400">
                    <AlertTriangle className="h-3 w-3" />
                    Atenção
                </Badge>
            );
        }

        return (
            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                <XCircle className="h-3 w-3" />
                Crítico
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffMins < 60) {
            return `${diffMins} min atrás`;
        }
        if (diffHours < 24) {
            return `${diffHours}h atrás`;
        }
        return date.toLocaleString('pt-BR');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    Players Ativos ({players.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {players.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                        Nenhum player encontrado
                    </p>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Player UID</TableHead>
                                    <TableHead>CNPJ</TableHead>
                                    <TableHead className="text-center">Music</TableHead>
                                    <TableHead className="text-center">Sazonal</TableHead>
                                    <TableHead className="text-center">Spots</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Última Atualização</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {players.map((player) => (
                                    <TableRow key={player.player_uid}>
                                        <TableCell className="font-mono text-sm">
                                            {player.player_uid.substring(0, 12)}...
                                        </TableCell>
                                        <TableCell>{player.cnpj || '-'}</TableCell>
                                        <TableCell className="text-center">
                                            <span className={`font-semibold ${player.music_percentage >= 95 ? 'text-green-600' :
                                                    player.music_percentage >= 80 ? 'text-yellow-600' :
                                                        'text-red-600'
                                                }`}>
                                                {player.music_percentage.toFixed(1)}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`font-semibold ${player.sazonal_percentage >= 95 ? 'text-green-600' :
                                                    player.sazonal_percentage >= 80 ? 'text-yellow-600' :
                                                        'text-red-600'
                                                }`}>
                                                {player.sazonal_percentage.toFixed(1)}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {player.spots_count}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(player)}
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-muted-foreground">
                                            {formatDate(player.recorded_at)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
