import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interfaces para os tipos de dados
interface PlayerStatus {
    player_uid: string;
    cnpj: string;
    recorded_at: string;
    music_total: number;
    music_downloaded: number;
    music_missing: number;
    music_percentage: number;
    sazonal_total: number;
    sazonal_downloaded: number;
    sazonal_missing: number;
    sazonal_percentage: number;
    spots_count: number;
    spots_list: any;
    sync_status: string;
    last_sync_duration: number;
}

interface PlayerStats {
    totalPlayers: number;
    playersOnline: number;
    playersOffline: number;
    averageMusicSync: number;
    averageSazonalSync: number;
    totalSpots: number;
    lastUpdate: string;
}

export function usePlayerMonitoring() {
    const [stats, setStats] = useState<PlayerStats>({
        totalPlayers: 0,
        playersOnline: 0,
        playersOffline: 0,
        averageMusicSync: 0,
        averageSazonalSync: 0,
        totalSpots: 0,
        lastUpdate: '',
    });

    const [players, setPlayers] = useState<PlayerStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPlayerData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Buscar o último status de cada player (agrupado por player_uid)
                const { data: latestStatuses, error: statusError } = await supabase
                    .from('monitoring_status')
                    .select('*')
                    .order('recorded_at', { ascending: false });

                if (statusError) throw statusError;

                // Agrupar por player_uid e pegar apenas o mais recente de cada
                const playerMap = new Map<string, PlayerStatus>();

                latestStatuses?.forEach((status) => {
                    if (!playerMap.has(status.player_uid)) {
                        playerMap.set(status.player_uid, status as PlayerStatus);
                    }
                });

                const uniquePlayers = Array.from(playerMap.values());

                // Calcular estatísticas
                const totalPlayers = uniquePlayers.length;

                // Considerar player offline se não atualizou há mais de 2 horas
                const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
                const playersOnline = uniquePlayers.filter(
                    (p) => new Date(p.recorded_at) > twoHoursAgo
                ).length;
                const playersOffline = totalPlayers - playersOnline;

                // Calcular médias de sincronização
                const avgMusic = totalPlayers > 0
                    ? uniquePlayers.reduce((sum, p) => sum + p.music_percentage, 0) / totalPlayers
                    : 0;

                const avgSazonal = totalPlayers > 0
                    ? uniquePlayers.reduce((sum, p) => sum + p.sazonal_percentage, 0) / totalPlayers
                    : 0;

                // Total de spots
                const totalSpots = uniquePlayers.reduce((sum, p) => sum + (p.spots_count || 0), 0);

                // Última atualização
                const lastUpdate = uniquePlayers.length > 0
                    ? uniquePlayers[0].recorded_at
                    : new Date().toISOString();

                setPlayers(uniquePlayers);
                setStats({
                    totalPlayers,
                    playersOnline,
                    playersOffline,
                    averageMusicSync: avgMusic,
                    averageSazonalSync: avgSazonal,
                    totalSpots,
                    lastUpdate: new Date(lastUpdate).toLocaleString('pt-BR'),
                });

            } catch (err: any) {
                console.error('Erro ao carregar dados dos players:', err);
                setError(err.message || 'Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };

        loadPlayerData();
    }, []);

    return {
        stats,
        players,
        loading,
        error,
    };
}
