#!/usr/bin/env python3
"""
Script de Limpeza do Banco de Dados Supabase
Remove dados antigos para manter o banco otimizado
"""

import os
import logging
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from supabase import create_client, Client
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Configuração do log
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("limpeza_banco.log", encoding="utf-8")
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

def limpar_execucoes_antigas(supabase, dias=30):
    """Remove execuções antigas da tabela execucoes"""
    try:
        data_limite = datetime.now(ZoneInfo("America/Sao_Paulo")) - timedelta(days=dias)
        logging.info(f"🗑️ Removendo execuções anteriores a {data_limite.strftime('%d/%m/%Y')}")
        
        # Contar registros antes da limpeza
        response = supabase.table('execucoes').select('id').lt('executado_em', data_limite.isoformat()).execute()
        total_antigo = len(response.data) if response.data else 0
        
        if total_antigo == 0:
            logging.info("✅ Nenhuma execução antiga encontrada para remoção")
            return 0
        
        # Remover execuções antigas
        response = supabase.table('execucoes').delete().lt('executado_em', data_limite.isoformat()).execute()
        
        if response.data:
            logging.info(f"✅ {len(response.data)} execuções antigas removidas")
            return len(response.data)
        else:
            logging.warning("⚠️ Nenhuma execução foi removida")
            return 0
            
    except Exception as e:
        logging.error(f"❌ Erro ao limpar execuções antigas: {e}")
        return 0

def limpar_lojas_dados_antigos(supabase, dias=30):
    """Remove dados antigos da tabela lojas_dados"""
    try:
        data_limite = datetime.now(ZoneInfo("America/Sao_Paulo")) - timedelta(days=dias)
        logging.info(f"🗑️ Removendo dados de lojas anteriores a {data_limite.strftime('%d/%m/%Y')}")
        
        # Contar registros antes da limpeza
        response = supabase.table('lojas_dados').select('id').lt('data_coleta', data_limite.isoformat()).execute()
        total_antigo = len(response.data) if response.data else 0
        
        if total_antigo == 0:
            logging.info("✅ Nenhum dado antigo de lojas encontrado para remoção")
            return 0
        
        # Remover dados antigos
        response = supabase.table('lojas_dados').delete().lt('data_coleta', data_limite.isoformat()).execute()
        
        if response.data:
            logging.info(f"✅ {len(response.data)} registros de lojas antigos removidos")
            return len(response.data)
        else:
            logging.warning("⚠️ Nenhum registro de lojas foi removido")
            return 0
            
    except Exception as e:
        logging.error(f"❌ Erro ao limpar dados de lojas antigos: {e}")
        return 0

def limpar_metricas_antigas(supabase, dias=30):
    """Remove métricas antigas da tabela metricas_periodicas"""
    try:
        data_limite = datetime.now(ZoneInfo("America/Sao_Paulo")) - timedelta(days=dias)
        logging.info(f"🗑️ Removendo métricas anteriores a {data_limite.strftime('%d/%m/%Y')}")
        
        # Contar registros antes da limpeza
        response = supabase.table('metricas_periodicas').select('id').lt('data_referencia', data_limite.isoformat()).execute()
        total_antigo = len(response.data) if response.data else 0
        
        if total_antigo == 0:
            logging.info("✅ Nenhuma métrica antiga encontrada para remoção")
            return 0
        
        # Remover métricas antigas
        response = supabase.table('metricas_periodicas').delete().lt('data_referencia', data_limite.isoformat()).execute()
        
        if response.data:
            logging.info(f"✅ {len(response.data)} métricas antigas removidas")
            return len(response.data)
        else:
            logging.warning("⚠️ Nenhuma métrica foi removida")
            return 0
            
    except Exception as e:
        logging.error(f"❌ Erro ao limpar métricas antigas: {e}")
        return 0

def limpar_logs_antigos(supabase, dias=7):
    """Remove logs antigos (se existir tabela de logs)"""
    try:
        # Verificar se existe tabela de logs
        response = supabase.table('logs').select('count').limit(1).execute()
        if not response.data:
            logging.info("ℹ️ Tabela 'logs' não encontrada, pulando limpeza")
            return 0
        
        data_limite = datetime.now(ZoneInfo("America/Sao_Paulo")) - timedelta(days=dias)
        logging.info(f"🗑️ Removendo logs anteriores a {data_limite.strftime('%d/%m/%Y')}")
        
        # Contar registros antes da limpeza
        response = supabase.table('logs').select('id').lt('created_at', data_limite.isoformat()).execute()
        total_antigo = len(response.data) if response.data else 0
        
        if total_antigo == 0:
            logging.info("✅ Nenhum log antigo encontrado para remoção")
            return 0
        
        # Remover logs antigos
        response = supabase.table('logs').delete().lt('created_at', data_limite.isoformat()).execute()
        
        if response.data:
            logging.info(f"✅ {len(response.data)} logs antigos removidos")
            return len(response.data)
        else:
            logging.warning("⚠️ Nenhum log foi removido")
            return 0
            
    except Exception as e:
        logging.info(f"ℹ️ Erro ao verificar tabela de logs (pode não existir): {e}")
        return 0

def gerar_relatorio_limpeza(estatisticas):
    """Gera relatório da limpeza realizada"""
    try:
        relatorio = {
            'data_limpeza': datetime.now(ZoneInfo("America/Sao_Paulo")).isoformat(),
            'resumo': {
                'total_registros_removidos': sum(estatisticas.values()),
                'execucoes_removidas': estatisticas['execucoes'],
                'lojas_removidas': estatisticas['lojas'],
                'metricas_removidas': estatisticas['metricas'],
                'logs_removidos': estatisticas['logs']
            },
            'detalhes': estatisticas
        }
        
        # Salvar relatório
        with open('relatorio_limpeza_banco.json', 'w', encoding='utf-8') as f:
            import json
            json.dump(relatorio, f, indent=2, ensure_ascii=False, default=str)
        
        logging.info("✅ Relatório de limpeza salvo em 'relatorio_limpeza_banco.json'")
        
        # Exibir resumo no console
        print("\n" + "="*60)
        print("🧹 RELATÓRIO DE LIMPEZA DO BANCO")
        print("="*60)
        print(f"📅 Data da limpeza: {relatorio['data_limpeza']}")
        print(f"🗑️ Total de registros removidos: {relatorio['resumo']['total_registros_removidos']}")
        print(f"📊 Execuções removidas: {relatorio['resumo']['execucoes_removidas']}")
        print(f"🏪 Dados de lojas removidos: {relatorio['resumo']['lojas_removidas']}")
        print(f"📈 Métricas removidas: {relatorio['resumo']['metricas_removidas']}")
        print(f"📝 Logs removidos: {relatorio['resumo']['logs_removidos']}")
        print("="*60)
        
        return relatorio
        
    except Exception as e:
        logging.error(f"❌ Erro ao gerar relatório de limpeza: {e}")
        return None

def main():
    """Função principal"""
    logging.info("🚀 Iniciando limpeza do banco de dados...")
    
    try:
        supabase = init_supabase()
        if not supabase:
            logging.error("❌ Falha ao conectar com Supabase")
            return
        
        # Executar limpeza em todas as tabelas
        estatisticas = {
            'execucoes': limpar_execucoes_antigas(supabase, dias=30),
            'lojas': limpar_lojas_dados_antigos(supabase, dias=30),
            'metricas': limpar_metricas_antigas(supabase, dias=30),
            'logs': limpar_logs_antigos(supabase, dias=7)
        }
        
        # Gerar relatório
        relatorio = gerar_relatorio_limpeza(estatisticas)
        
        if relatorio:
            logging.info("✅ Limpeza do banco concluída com sucesso!")
            logging.info(f"🗑️ Total de registros removidos: {relatorio['resumo']['total_registros_removidos']}")
        else:
            logging.error("❌ Falha na geração do relatório")
            
    except Exception as e:
        logging.error(f"❌ Erro crítico na limpeza: {e}")

if __name__ == "__main__":
    main()
