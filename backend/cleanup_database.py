#!/usr/bin/env python3
"""
Script de Limpeza do Banco de Dados Supabase (Versão Final)
Executa remoções em lotes para evitar timeout e envia resumo via Telegram.
"""

import os
import time
import json
import logging
import requests
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from supabase import create_client, Client
from dotenv import load_dotenv

# ======================================
# 🔧 CONFIGURAÇÕES INICIAIS
# ======================================

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("limpeza_banco.log", encoding="utf-8")
    ]
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")

BATCH_SIZE = 500
SLEEP_SECONDS = 1
FUSO = ZoneInfo("America/Sao_Paulo")

# ======================================
# 🔌 FUNÇÕES AUXILIARES
# ======================================

def enviar_mensagem_telegram(mensagem: str):
    """Envia mensagem para o Telegram"""
    if not TELEGRAM_BOT_TOKEN or not ADMIN_CHAT_ID:
        logging.warning("⚠️ Variáveis TELEGRAM_BOT_TOKEN e ADMIN_CHAT_ID não configuradas. Notificação não enviada.")
        return

    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": ADMIN_CHAT_ID,
            "text": mensagem,
            "parse_mode": "Markdown"
        }
        response = requests.post(url, data=payload, timeout=15)
        if response.status_code == 200:
            logging.info("📩 Notificação enviada ao Telegram com sucesso.")
        else:
            logging.warning(f"⚠️ Falha ao enviar notificação Telegram: {response.text}")
    except Exception as e:
        logging.error(f"❌ Erro ao enviar mensagem Telegram: {e}")


def init_supabase() -> Client:
    """Inicializa o cliente Supabase"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        logging.error("Variáveis SUPABASE_URL e SUPABASE_KEY não configuradas.")
        return None
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logging.info("Cliente Supabase inicializado com sucesso.")
        return supabase
    except Exception as e:
        logging.error(f"Erro ao inicializar cliente Supabase: {e}")
        return None


def limpar_em_lotes(supabase, tabela, campo_data, dias, nome_tabela_amigavel):
    """Executa a limpeza da tabela em lotes"""
    try:
        data_limite = datetime.now(FUSO) - timedelta(days=dias)
        logging.info(f"🧹 Limpando {nome_tabela_amigavel} anteriores a {data_limite.strftime('%d/%m/%Y')}")

        total_removidos = 0
        while True:
            try:
                registros = supabase.table(tabela).select("id").lt(campo_data, data_limite.isoformat()).limit(BATCH_SIZE).execute()
                if not registros.data:
                    break

                ids = [r["id"] for r in registros.data]
                supabase.table(tabela).delete().in_("id", ids).execute()
                total_removidos += len(ids)

                logging.info(f"🗑️ {len(ids)} removidos (total: {total_removidos}) de {tabela}")
                time.sleep(SLEEP_SECONDS)
            except Exception as e:
                logging.warning(f"⚠️ Erro ao limpar lote de {tabela}: {e}")
                break

        if total_removidos == 0:
            logging.info(f"✅ Nenhum registro antigo encontrado em {tabela}.")
        else:
            logging.info(f"✅ {total_removidos} registros removidos de {tabela}.")
        return total_removidos

    except Exception as e:
        logging.error(f"❌ Falha ao limpar {tabela}: {e}")
        return 0


def gerar_relatorio_limpeza(estatisticas):
    """Gera e salva o relatório da limpeza"""
    try:
        relatorio = {
            "data_limpeza": datetime.now(FUSO).isoformat(),
            "resumo": {
                "total_registros_removidos": sum(estatisticas.values()),
                "execucoes_removidas": estatisticas.get("execucoes", 0),
                "lojas_removidas": estatisticas.get("lojas", 0),
                "metricas_removidas": estatisticas.get("metricas", 0),
                "logs_removidos": estatisticas.get("logs", 0),
            }
        }

        with open("relatorio_limpeza_banco.json", "w", encoding="utf-8") as f:
            json.dump(relatorio, f, indent=2, ensure_ascii=False, default=str)

        logging.info("✅ Relatório de limpeza salvo em 'relatorio_limpeza_banco.json'")
        return relatorio
    except Exception as e:
        logging.error(f"❌ Erro ao gerar relatório: {e}")
        return None


# ======================================
# 🧠 FUNÇÃO PRINCIPAL
# ======================================

def main():
    inicio = time.time()
    logging.info("🚀 Iniciando limpeza otimizada do banco de dados...")
    supabase = init_supabase()
    if not supabase:
        return

    estatisticas = {
        "execucoes": limpar_em_lotes(supabase, "execucoes", "executado_em", 30, "execuções"),
        "lojas": limpar_em_lotes(supabase, "lojas_dados", "data_coleta", 30, "dados de lojas"),
        "metricas": limpar_em_lotes(supabase, "metricas_periodicas", "data_referencia", 30, "métricas"),
        "logs": limpar_em_lotes(supabase, "logs", "created_at", 7, "logs do sistema"),
    }

    relatorio = gerar_relatorio_limpeza(estatisticas)
    duracao = round(time.time() - inicio, 2)

    # ------------------------------------------
    # 📢 Envio automático do resumo para Telegram
    # ------------------------------------------
    if relatorio:
        total = relatorio["resumo"]["total_registros_removidos"]
        mensagem = (
            f"🧹 *Limpeza de Banco de Dados - Concluída com Sucesso*\n\n"
            f"📅 *Data:* {datetime.now(FUSO).strftime('%d/%m/%Y %H:%M:%S')}\n"
            f"🗑️ *Total removido:* {total} registros\n"
            f"📊 Execuções: {estatisticas['execucoes']}\n"
            f"🏪 Lojas: {estatisticas['lojas']}\n"
            f"📈 Métricas: {estatisticas['metricas']}\n"
            f"📝 Logs: {estatisticas['logs']}\n"
            f"⏱️ *Duração:* {duracao} segundos"
        )
        enviar_mensagem_telegram(mensagem)
        logging.info("🏁 Limpeza concluída e notificada.")
    else:
        enviar_mensagem_telegram("⚠️ *Falha ao gerar relatório de limpeza do banco.*")
        logging.error("⚠️ Falha ao gerar relatório.")

# ======================================
if __name__ == "__main__":
    main()
