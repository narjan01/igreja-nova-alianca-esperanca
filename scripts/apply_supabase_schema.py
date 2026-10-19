import urllib.request
import urllib.error
import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

token = os.getenv("SUPABASE_ACCESS_TOKEN", "")
project_ref = os.getenv("SUPABASE_PROJECT_REF", "yzfklvqyveugjlbissmq")

if not token:
    print("Aviso: Defina a variável SUPABASE_ACCESS_TOKEN para executar via API.")
    sys.exit(1)

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
    "User-Agent": "Antigravity-Agent/1.0"
}

print(f"Executando schema.sql no projeto {project_ref}...")
with open(os.path.join(os.path.dirname(__file__), "..", "supabase", "schema.sql"), "r", encoding="utf-8") as f:
    sql_content = f.read()

query_url = f"https://api.supabase.com/v1/projects/{project_ref}/database/query"
query_payload = json.dumps({"query": sql_content}).encode('utf-8')

req_query = urllib.request.Request(query_url, headers=headers, data=query_payload, method="POST")
try:
    with urllib.request.urlopen(req_query) as resp:
        print(f"✅ Schema SQL executado com sucesso no Supabase! HTTP {resp.status}")
except urllib.error.HTTPError as e:
    print(f"❌ Erro HTTP ao executar SQL: {e.code} - {e.read().decode('utf-8')}")
except Exception as e:
    print(f"❌ Erro geral: {e}")
