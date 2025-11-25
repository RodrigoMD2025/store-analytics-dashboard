import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interfaces
interface PlayerDetails {
    player_uid: string;
    cnpj: string;
    cliente_nome: string;
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
    sincronizada: boolean;
}

interface MusicFile {
    folder: string;
    isrc: string;
    filename: string;
    file_size: number;
    is_valid: boolean;
    corruption_check: boolean;
    metadata: any;
    updated_at: string;
}

interface FilesByFolder {
    music: MusicFile[];
    sazonal: MusicFile[];
    spots: MusicFile[];
}

export function usePlayerDetails(playerUid: string) {
    const [playerDetails, setPlayerDetails] = useState<PlayerDetails | null>(null);
    const [files, setFiles] = useState<FilesByFolder>({
        music: [],
        sazonal: [],
        spots: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPlayerDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1. Buscar dados do monitoring_status (mais recente)
                const { data: monitoringData, error: monitoringError } = await supabase
                    .from('monitoring_status')
                    .select('*')
                    .eq('player_uid', playerUid)
                    .order('recorded_at', { ascending: false })
                    .limit(1)
                    .single();

                if (monitoringError) {
                    // Se não encontrar no monitoring_status, tentar buscar nome do cliente em lojas_dados
                    const { data: lojaData } = await supabase
                        .from('lojas_dados')
                        .select('loja_nome, identificador, sincronizada')
                        .eq('identificador', playerUid)
                        .limit(1)
                        .single();

                    setPlayerDetails({
                        player_uid: playerUid,
                        cnpj: '',
                        cliente_nome: lojaData?.loja_nome || 'Desconhecido',
                        recorded_at: new Date().toISOString(),
                        music_total: 0,
                        music_downloaded: 0,
                        music_missing: 0,
                        music_percentage: 0,
                        sazonal_total: 0,
                        sazonal_downloaded: 0,
                        sazonal_missing: 0,
                        sazonal_percentage: 0,
                        spots_count: 0,
                        spots_list: [],
                        sync_status: 'offline',
                        last_sync_duration: 0,
                        sincronizada: lojaData?.sincronizada || false
                    });
                } else {
                    // Tentar buscar nome do cliente e status de sincronização em lojas_dados
                    const { data: lojaData } = await supabase
                        .from('lojas_dados')
                        .select('loja_nome, sincronizada')
                        .eq('identificador', playerUid)
                        .limit(1)
                        .single();

                    setPlayerDetails({
                        ...monitoringData as PlayerDetails,
                        cliente_nome: lojaData?.loja_nome || 'Desconhecido',
                        sincronizada: lojaData?.sincronizada || false
                    });
                }

                // 2. Buscar arquivos do music_files
                const { data: filesData, error: filesError } = await supabase
                    .from('music_files')
                    .select('*')
                    .eq('player_uid', playerUid);

                if (filesError) {
                    console.error('Erro ao buscar arquivos:', filesError);
                } else if (filesData) {
                    // Agrupar arquivos por pasta
                    const filesByFolder: FilesByFolder = {
                        music: [],
                        sazonal: [],
                        spots: []
                    };

                    filesData.forEach((file: any) => {
                        const musicFile: MusicFile = {
                            folder: file.folder,
                            isrc: file.isrc,
                            filename: file.filename,
                            file_size: file.file_size,
                            is_valid: file.is_valid,
                            corruption_check: file.corruption_check,
                            metadata: file.metadata,
                            updated_at: file.updated_at
                        };

                        if (file.folder === 'music') {
                            filesByFolder.music.push(musicFile);
                        } else if (file.folder === 'sazonal') {
                            filesByFolder.sazonal.push(musicFile);
                        } else if (file.folder === 'spots') {
                            filesByFolder.spots.push(musicFile);
                        }
                    });

                    setFiles(filesByFolder);
                }

            } catch (err: any) {
                console.error('Erro ao carregar detalhes do player:', err);
                setError(err.message || 'Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };

        if (playerUid) {
            loadPlayerDetails();
        }
    }, [playerUid]);

    return {
        playerDetails,
        files,
        loading,
        error
    };
}
