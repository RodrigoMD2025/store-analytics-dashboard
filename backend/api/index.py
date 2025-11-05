import os
import requests
from flask import Flask, request, jsonify
import sys
import traceback

app = Flask(__name__)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
AUTHORIZED_CHAT_ID = os.getenv("ADMIN_CHAT_ID")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_OWNER = "RodrigoMD2025"
REPO_NAME = "store-analytics-dashboard"

@app.route("/", methods=["GET", "POST"])
def telegram_webhook():
    # Check for required environment variables first
    required_vars = ["TELEGRAM_BOT_TOKEN", "AUTHORIZED_CHAT_ID", "GITHUB_TOKEN"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        error_msg = f"Missing environment variables: {', '.join(missing_vars)}"
        print(f"ERROR: {error_msg}", file=sys.stderr)
        # Try to notify the admin if the token is present
        if os.getenv("TELEGRAM_BOT_TOKEN") and os.getenv("AUTHORIZED_CHAT_ID"):
            try:
                requests.post(f"https://api.telegram.org/bot{os.getenv('TELEGRAM_BOT_TOKEN')}/sendMessage", data={
                    "chat_id": os.getenv("AUTHORIZED_CHAT_ID"),
                    "text": f"🚨 Bot Error: {error_msg}",
                })
            except Exception as e:
                print(f"ERROR: Failed to send error notification to Telegram: {e}", file=sys.stderr)
        return jsonify({"ok": False, "error": error_msg}), 500

    try:
        if request.method == "GET":
            print("INFO: GET request received, serving status page.", file=sys.stderr)
            return "<html><body><h1>Telegram Bot Webhook</h1><p>The bot is running.</p></body></html>"

        # Handle POST request
        data = request.get_json()
        print(f"INFO: POST request received: {data}", file=sys.stderr)

        if not data or "message" not in data:
            print("ERROR: Invalid message format", file=sys.stderr)
            return jsonify({"ok": False, "error": "Mensagem inválida"}), 400

        chat_id = str(data["message"]["chat"]["id"])
        text = data["message"].get("text", "").strip().lower()

        if chat_id != str(AUTHORIZED_CHAT_ID):
            print(f"WARNING: Unauthorized chat_id: {chat_id}", file=sys.stderr)
            return jsonify({"ok": True})

        if text == "/mdonline":
            print("INFO: Received /mdonline command from authorized user.", file=sys.stderr)
            
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
                print("INFO: GitHub Action workflow triggered successfully.", file=sys.stderr)
            else:
                msg = f"❌ Falha ao iniciar workflow. Código: {r.status_code}. Resposta: {r.text}"
                print(f"ERROR: Failed to trigger GitHub Action workflow. Status: {r.status_code}, Response: {r.text}", file=sys.stderr)

            requests.post(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage", data={
                "chat_id": chat_id,
                "text": msg,
            })

        return jsonify({"ok": True})

    except Exception as e:
        print(f"FATAL: An error occurred in telegram_webhook: {e}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return jsonify({"ok": False, "error": "Internal server error"}), 500

def handler(event, context):
    """Vercel compatibility"""
    return app(event, context)
