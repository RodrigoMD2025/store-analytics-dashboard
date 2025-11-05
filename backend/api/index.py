import os
import requests
from flask import Flask, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
AUTHORIZED_CHAT_ID = os.getenv("ADMIN_CHAT_ID")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_OWNER = "RodrigoMD2025"
REPO_NAME = "store-analytics-dashboard"

@app.route("/", methods=["GET", "POST"])
def telegram_webhook():
    try:
        if request.method == "GET":
            logging.info("GET request received, serving status page.")
            return "<html><body><h1>Telegram Bot Webhook</h1><p>The bot is running.</p></body></html>"

        # Handle POST request
        data = request.get_json()
        logging.info(f"POST request received: {data}")

        if not data or "message" not in data:
            logging.error("Invalid message format")
            return jsonify({"ok": False, "error": "Mensagem inválida"}), 400

        chat_id = str(data["message"]["chat"]["id"])
        text = data["message"].get("text", "").strip().lower()

        if chat_id != str(AUTHORIZED_CHAT_ID):
            logging.warning(f"Unauthorized chat_id: {chat_id}")
            return jsonify({"ok": True})

        if text == "/mdonline":
            logging.info("Received /mdonline command from authorized user.")
            
            # 1️⃣ Confirm receipt
            requests.post(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage", data={
                "chat_id": chat_id,
                "text": "🚀 Solicitando relatório antecipado no GitHub Actions...",
            })

            # 2️⃣ Trigger workflow via GitHub API
            github_url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/dispatches"
            headers = {
                "Accept": "application/vnd.github.v3+json",
                "Authorization": f"Bearer {GITHUB_TOKEN}"
            }
            payload = {"event_type": "executar_mdonline"}

            r = requests.post(github_url, headers=headers, json=payload)
            
            if r.status_code == 204:
                msg = "✅ Workflow iniciado com sucesso! Aguarde o envio do relatório 📊"
                logging.info("GitHub Action workflow triggered successfully.")
            else:
                msg = f"❌ Falha ao iniciar workflow. Código: {r.status_code}. Resposta: {r.text}"
                logging.error(f"Failed to trigger GitHub Action workflow. Status: {r.status_code}, Response: {r.text}")

            requests.post(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage", data={
                "chat_id": chat_id,
                "text": msg,
            })

        return jsonify({"ok": True})

    except Exception as e:
        logging.error(f"An error occurred in telegram_webhook: {e}", exc_info=True)
        return jsonify({"ok": False, "error": "Internal server error"}), 500

def handler(event, context):
    """Vercel compatibility"""
    return app(event, context)