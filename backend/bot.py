print("--- Python script starting ---")
import sys
sys.stdout.flush()

import os
import requests
import time
import traceback

# --- Configuration ---
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
AUTHORIZED_CHAT_ID = os.getenv("ADMIN_CHAT_ID")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_OWNER = "RodrigoMD2025"
REPO_NAME = "store-analytics-dashboard"

# --- Helper Functions ---

def trigger_github_action():
    """Triggers the GitHub Actions workflow."""
    print("INFO: Triggering GitHub Actions workflow...")
    sys.stdout.flush()
    github_url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/dispatches"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"Bearer {GITHUB_TOKEN}"
    }
    payload = {"event_type": "executar_mdonline"}

    try:
        r = requests.post(github_url, headers=headers, json=payload, timeout=10)
        if r.status_code == 204:
            print("INFO: GitHub Action workflow triggered successfully.")
            sys.stdout.flush()
            return "✅ Workflow iniciado com sucesso! Aguarde o envio do relatório 📊"
        else:
            error_message = f"❌ Falha ao iniciar workflow. Código: {r.status_code}. Resposta: {r.text}"
            print(f"ERROR: {error_message}", file=sys.stderr)
            sys.stderr.flush()
            return error_message
    except Exception as e:
        error_message = f"❌ Exceção ao tentar acionar o workflow: {e}"
        print(f"ERROR: {error_message}", file=sys.stderr)
        sys.stderr.flush()
        return error_message

def send_telegram_message(text):
    """Sends a message back to the admin chat on Telegram."""
    print(f"INFO: Sending message to Telegram: {text}")
    sys.stdout.flush()
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": AUTHORIZED_CHAT_ID,
        "text": text,
    }
    try:
        requests.post(url, data=payload, timeout=5)
    except Exception as e:
        print(f"ERROR: Failed to send message to Telegram: {e}", file=sys.stderr)
        sys.stderr.flush()

# --- Main Loop ---

def main():
    """Main function to start the long polling bot."""
    print("INFO: Bot started in long polling mode.")
    sys.stdout.flush()
    
    # Check for required environment variables
    required_vars = ["TELEGRAM_BOT_TOKEN", "AUTHORIZED_CHAT_ID", "GITHUB_TOKEN"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        error_msg = f"FATAL: Missing environment variables: {', '.join(missing_vars)}. Exiting."
        print(error_msg, file=sys.stderr)
        sys.stderr.flush()
        # Try to notify admin once before exiting
        if "TELEGRAM_BOT_TOKEN" not in missing_vars and "AUTHORIZED_CHAT_ID" not in missing_vars:
            send_telegram_message(f"🚨 Bot Error: {error_msg}")
        sys.exit(1)

    offset = 0
    while True:
        try:
            print("INFO: Polling for new updates...")
            sys.stdout.flush()
            url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates"
            params = {"offset": offset, "timeout": 60} # 60-second long poll
            
            response = requests.get(url, params=params, timeout=70)
            response.raise_for_status()
            
            updates = response.json().get("result", [])

            if updates:
                for update in updates:
                    offset = update["update_id"] + 1
                    
                    if "message" in update and "text" in update["message"]:
                        chat_id = str(update["message"]["chat"]["id"])
                        text = update["message"]["text"].strip().lower()

                        print(f"INFO: Received message '{text}' from chat_id {chat_id}")
                        sys.stdout.flush()

                        if chat_id == str(AUTHORIZED_CHAT_ID) and text == "/mdonline":
                            print("DEBUG: Inside /mdonline command handler.", file=sys.stderr)
                            sys.stderr.flush()
                            print("INFO: /mdonline command received from authorized user.")
                            sys.stdout.flush()
                            send_telegram_message("🚀 Solicitando relatório antecipado no GitHub Actions...")
                            response_message = trigger_github_action()
                            send_telegram_message(response_message)

        except requests.exceptions.RequestException as e:
            print(f"ERROR: Network error during polling: {e}", file=sys.stderr)
            sys.stderr.flush()
            time.sleep(15) # Wait before retrying on network errors
        except Exception as e:
            print(f"ERROR: An unexpected error occurred in the main loop: {e}", file=sys.stderr)
            traceback.print_exc(file=sys.stderr)
            sys.stderr.flush()
            time.sleep(30) # Wait longer for unexpected errors

if __name__ == "__main__":
    main()