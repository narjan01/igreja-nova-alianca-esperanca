import subprocess
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Ler variáveis do .env se existirem
env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
if os.path.exists(env_file):
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

token = os.getenv("CLOUDFLARE_API_TOKEN", "")
account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID", "68cac412a40235c66aa97e42b9d5b6a7")

if not token:
    print("Aviso: Defina CLOUDFLARE_API_TOKEN no .env ou nas variáveis de ambiente.")
    sys.exit(1)

env = os.environ.copy()
env["CLOUDFLARE_API_TOKEN"] = token
env["CLOUDFLARE_ACCOUNT_ID"] = account_id
env["CI"] = "1"

project_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

print("1. Compilando projeto frontend (npm run build)...", flush=True)
subprocess.run(["npm", "run", "build"], cwd=project_dir, shell=True, check=True)

print("\n2. Executando deploy no Cloudflare Pages...", flush=True)
cmd = "npx wrangler pages deploy dist --project-name=igreja-nova-alianca-esperanca --branch=main --commit-dirty=true"

proc = subprocess.Popen(
    cmd,
    cwd=project_dir,
    env=env,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    encoding='utf-8',
    errors='replace',
    shell=True
)

for line in proc.stdout:
    print(line, end='', flush=True)

proc.wait()
if proc.returncode == 0:
    print("\n🎉 Deploy realizado com sucesso no Cloudflare Pages!")
else:
    print(f"\n❌ Falha no deploy. Código: {proc.returncode}")
