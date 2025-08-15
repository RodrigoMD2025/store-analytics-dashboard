#!/usr/bin/env python3
"""
Script de Análise e Melhoria das Tabelas Supabase
Analisa a estrutura atual e sugere melhorias para o sistema
"""

import os
import json
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import logging
from supabase import create_client, Client
import pandas as pd
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Configuração do log
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("analise_supabase.log", encoding="utf-8")
    ]
)

# Configurações do Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def init_supabase():
    """Inicializa o cliente Supabase"""
    try:
        if not SUPABASE_URL or not SUPABASE_KEY:
            logging.error("Variáveis SUPABASE_URL e SUPABASE_KEY devem estar configuradas")
            return None
        
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        logging.info("Cliente Supabase inicializado com sucesso")
        return supabase
    except Exception as e:
        logging.error(f"Erro ao inicializar Supabase: {e}")
        return None

def analisar_tabela_clientes(supabase):
    """Analisa a tabela de clientes"""
    try:
        logging.info("🔍 Analisando tabela 'clientes'...")
        
        # Buscar todos os clientes
        response = supabase.table('clientes').select('*').execute()
        
        if not response.data:
            logging.warning("Tabela 'clientes' está vazia")
            return {
                'total': 0,
                'estrutura': {},
                'problemas': ['Tabela vazia'],
                'sugestoes': ['Adicionar clientes de teste']
            }
        
        clientes = response.data
        logging.info(f"✅ Encontrados {len(clientes)} clientes")
        
        # Analisar estrutura
        estrutura = {}
        problemas = []
        sugestoes = []
        
        for cliente in clientes:
            # Verificar campos obrigatórios
            if not cliente.get('nome'):
                problemas.append(f"Cliente sem nome: {cliente.get('id')}")
            
            if not cliente.get('email'):
                sugestoes.append(f"Adicionar email para cliente: {cliente.get('nome')}")
            
            # Verificar se está ativo
            if cliente.get('ativo') is None:
                sugestoes.append(f"Definir status ativo para cliente: {cliente.get('nome')}")
        
        # Análise de dados
        ativos = [c for c in clientes if c.get('ativo')]
        inativos = [c for c in clientes if not c.get('ativo')]
        
        estrutura = {
            'total': len(clientes),
            'ativos': len(ativos),
            'inativos': len(inativos),
            'com_email': len([c for c in clientes if c.get('email')]),
            'sem_email': len([c for c in clientes if not c.get('email')])
        }
        
        return {
            'total': len(clientes),
            'estrutura': estrutura,
            'problemas': problemas,
            'sugestoes': sugestoes,
            'dados': clientes
        }
        
    except Exception as e:
        logging.error(f"Erro ao analisar tabela clientes: {e}")
        return None

def analisar_tabela_lojas_dados(supabase):
    """Analisa a tabela de dados das lojas"""
    try:
        logging.info("🔍 Analisando tabela 'lojas_dados'...")
        
        # Buscar dados das lojas
        response = supabase.table('lojas_dados').select('*').execute()
        
        if not response.data:
            logging.warning("Tabela 'lojas_dados' está vazia")
            return {
                'total': 0,
                'estrutura': {},
                'problemas': ['Tabela vazia'],
                'sugestoes': ['Executar script de coleta']
            }
        
        lojas = response.data
        logging.info(f"✅ Encontrados {len(lojas)} registros de lojas")
        
        # Análise temporal
        df = pd.DataFrame(lojas)
        df['data_coleta'] = pd.to_datetime(df['data_coleta'])
        
        # Última coleta
        ultima_coleta = df['data_coleta'].max()
        primeira_coleta = df['data_coleta'].min()
        
        # Análise por cliente
        clientes_unicos = df['cliente_nome'].nunique()
        lojas_unicas = df['loja_nome'].nunique()
        
        # Análise de sincronização
        sincronizadas = df['sincronizada'].sum()
        atrasadas = len(df) - sincronizadas
        
        estrutura = {
            'total_registros': len(lojas),
            'clientes_unicos': clientes_unicos,
            'lojas_unicas': lojas_unicas,
            'primeira_coleta': primeira_coleta.isoformat(),
            'ultima_coleta': ultima_coleta.isoformat(),
            'sincronizadas': int(sincronizadas),
            'atrasadas': int(atrasadas),
            'percentual_sincronizadas': round((sincronizadas / len(df)) * 100, 2) if len(df) > 0 else 0
        }
        
        # Identificar problemas
        problemas = []
        sugestoes = []
        
        # Verificar dados muito antigos
        data_limite = datetime.now(ZoneInfo("America/Sao_Paulo")) - timedelta(days=7)
        dados_antigos = df[df['data_coleta'] < data_limite]
        if len(dados_antigos) > 0:
            problemas.append(f"{len(dados_antigos)} registros com mais de 7 dias")
            sugestoes.append("Executar coleta de dados")
        
        # Verificar clientes sem dados recentes
        for cliente in df['cliente_nome'].unique():
            dados_cliente = df[df['cliente_nome'] == cliente]
            ultima_coleta_cliente = dados_cliente['data_coleta'].max()
            if ultima_coleta_cliente < data_limite:
                sugestoes.append(f"Verificar coleta para cliente: {cliente}")
        
        return {
            'total': len(lojas),
            'estrutura': estrutura,
            'problemas': problemas,
            'sugestoes': sugestoes,
            'dados': lojas[:10]  # Primeiros 10 registros para análise
        }
        
    except Exception as e:
        logging.error(f"Erro ao analisar tabela lojas_dados: {e}")
        return None

def analisar_tabela_execucoes(supabase):
    """Analisa a tabela de execuções"""
    try:
        logging.info("🔍 Analisando tabela 'execucoes'...")
        
        # Buscar execuções
        response = supabase.table('execucoes').select('*').execute()
        
        if not response.data:
            logging.warning("Tabela 'execucoes' está vazia")
            return {
                'total': 0,
                'estrutura': {},
                'problemas': ['Tabela vazia'],
                'sugestoes': ['Executar script de monitoramento']
            }
        
        execucoes = response.data
        logging.info(f"✅ Encontradas {len(execucoes)} execuções")
        
        # Análise temporal
        df = pd.DataFrame(execucoes)
        df['executado_em'] = pd.to_datetime(df['executado_em'])
        
        # Última execução
        ultima_execucao = df['executado_em'].max()
        primeira_execucao = df['executado_em'].min()
        
        # Análise por status
        status_counts = df['status'].value_counts()
        
        # Análise por origem
        origem_counts = df['origem'].value_counts()
        
        estrutura = {
            'total_execucoes': len(execucoes),
            'primeira_execucao': primeira_execucao.isoformat(),
            'ultima_execucao': ultima_execucao.isoformat(),
            'status_distribuicao': status_counts.to_dict(),
            'origem_distribuicao': origem_counts.to_dict()
        }
        
        # Identificar problemas
        problemas = []
        sugestoes = []
        
        # Verificar execuções com erro
        erros = df[df['status'] == 'erro']
        if len(erros) > 0:
            problemas.append(f"{len(erros)} execuções com erro")
            sugestoes.append("Verificar logs de erro")
        
        # Verificar execuções antigas
        data_limite = datetime.now(ZoneInfo("America/Sao_Paulo")) - timedelta(hours=6)
        execucoes_antigas = df[df['executado_em'] < data_limite]
        if len(execucoes_antigas) > 0:
            sugestoes.append("Verificar se o workflow está funcionando")
        
        return {
            'total': len(execucoes),
            'estrutura': estrutura,
            'problemas': problemas,
            'sugestoes': sugestoes,
            'dados': execucoes[:10]
        }
        
    except Exception as e:
        logging.error(f"Erro ao analisar tabela execucoes: {e}")
        return None

def analisar_tabela_metricas_periodicas(supabase):
    """Analisa a tabela de métricas periódicas"""
    try:
        logging.info("🔍 Analisando tabela 'metricas_periodicas'...")
        
        # Buscar métricas
        response = supabase.table('metricas_periodicas').select('*').execute()
        
        if not response.data:
            logging.warning("Tabela 'metricas_periodicas' está vazia")
            return {
                'total': 0,
                'estrutura': {},
                'problemas': ['Tabela vazia'],
                'sugestoes': ['Gerar métricas a partir dos dados existentes']
            }
        
        metricas = response.data
        logging.info(f"✅ Encontradas {len(metricas)} métricas")
        
        # Análise por período
        df = pd.DataFrame(metricas)
        df['data_referencia'] = pd.to_datetime(df['data_referencia'])
        
        # Última métrica
        ultima_metrica = df['data_referencia'].max()
        primeira_metrica = df['data_referencia'].min()
        
        # Análise por tipo de período
        periodo_counts = df['periodo'].value_counts()
        
        estrutura = {
            'total_metricas': len(metricas),
            'primeira_metrica': primeira_metrica.isoformat(),
            'ultima_metrica': ultima_metrica.isoformat(),
            'periodo_distribuicao': periodo_counts.to_dict()
        }
        
        return {
            'total': len(metricas),
            'estrutura': estrutura,
            'problemas': [],
            'sugestoes': ['Métricas estão sendo geradas corretamente'],
            'dados': metricas[:10]
        }
        
    except Exception as e:
        logging.error(f"Erro ao analisar tabela metricas_periodicas: {e}")
        return None

def gerar_relatorio_completo():
    """Gera relatório completo de análise"""
    try:
        logging.info("📊 Iniciando análise completa do Supabase...")
        
        supabase = init_supabase()
        if not supabase:
            return None
        
        # Analisar todas as tabelas
        analises = {
            'clientes': analisar_tabela_clientes(supabase),
            'lojas_dados': analisar_tabela_lojas_dados(supabase),
            'execucoes': analisar_tabela_execucoes(supabase),
            'metricas_periodicas': analisar_tabela_metricas_periodicas(supabase)
        }
        
        # Gerar resumo
        resumo = {
            'data_analise': datetime.now(ZoneInfo("America/Sao_Paulo")).isoformat(),
            'tabelas_analisadas': len(analises),
            'total_registros': sum(analise['total'] for analise in analises.values() if analise),
            'problemas_identificados': [],
            'sugestoes_gerais': []
        }
        
        # Consolidar problemas e sugestões
        for tabela, analise in analises.items():
            if analise:
                resumo['problemas_identificados'].extend([f"{tabela}: {p}" for p in analise['problemas']])
                resumo['sugestoes_gerais'].extend([f"{tabela}: {s}" for s in analise['sugestoes']])
        
        # Salvar relatório
        relatorio = {
            'resumo': resumo,
            'analises_detalhadas': analises
        }
        
        with open('relatorio_analise_supabase.json', 'w', encoding='utf-8') as f:
            json.dump(relatorio, f, indent=2, ensure_ascii=False, default=str)
        
        logging.info("✅ Relatório salvo em 'relatorio_analise_supabase.json'")
        
        # Exibir resumo no console
        print("\n" + "="*60)
        print("📊 RELATÓRIO DE ANÁLISE DO SUPABASE")
        print("="*60)
        print(f"📅 Data da análise: {resumo['data_analise']}")
        print(f"📋 Tabelas analisadas: {resumo['tabelas_analisadas']}")
        print(f"📊 Total de registros: {resumo['total_registros']}")
        
        if resumo['problemas_identificados']:
            print(f"\n⚠️ PROBLEMAS IDENTIFICADOS ({len(resumo['problemas_identificados'])}):")
            for problema in resumo['problemas_identificados']:
                print(f"  • {problema}")
        
        if resumo['sugestoes_gerais']:
            print(f"\n💡 SUGESTÕES ({len(resumo['sugestoes_gerais'])}):")
            for sugestao in resumo['sugestoes_gerais']:
                print(f"  • {sugestao}")
        
        print("\n" + "="*60)
        
        return relatorio
        
    except Exception as e:
        logging.error(f"Erro ao gerar relatório completo: {e}")
        return None

def main():
    """Função principal"""
    logging.info("🚀 Iniciando análise do Supabase...")
    
    try:
        relatorio = gerar_relatorio_completo()
        if relatorio:
            logging.info("✅ Análise concluída com sucesso!")
        else:
            logging.error("❌ Falha na análise")
            
    except Exception as e:
        logging.error(f"Erro crítico na análise: {e}")

if __name__ == "__main__":
    main()
