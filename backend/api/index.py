import os
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
AUTHORIZED_CHAT_ID = os.getenv("ADMIN_CHAT_ID")  # mesmo usado no workflow
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_OWNER = "RodrigoMD2025"
REPO_NAME = "store-analytics-dashboard"

@app.route("/", methods=["POST"])
def telegram_webhook():
    data = request.get_json()
    
    if not data or "message" not in data:
        return jsonify({"ok": False, "error": "Mensagem inválida"}), 400

    chat_id = str(data["message"]["chat"]["id"])
    text = data["message"].get("text", "").strip().lower()

    # Apenas o chat autorizado pode disparar o comando
    if chat_id != str(AUTHORIZED_CHAT_ID):
        return jsonify({"ok": True})

    if text == "/mdonline":
        # 1️⃣ Confirma recebimento
        requests.post(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage", data={
            "chat_id": chat_id,
            "text": "🚀 Solicitando relatório antecipado no GitHub Actions...",
        })

        # 2️⃣ Dispara o workflow via GitHub API
        github_url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/dispatches"
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"Bearer {GITHUB_TOKEN}"
        }
        payload = {"event_type": "executar_mdonline"}

        r = requests.post(github_url, headers=headers, json=payload)
        if r.status_code == 204:
            msg = "✅ Workflow iniciado com sucesso! Aguarde o envio do relatório 📊"
        else:
            msg = f"❌ Falha ao iniciar workflow. Código: {r.status_code}"

        requests.post(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage", data={
            "chat_id": chat_id,
            "text": msg,
        })

    return jsonify({"ok": True})

def handler(event, context):
    """Compatibilidade com Vercel"""
    return app(event, context)
