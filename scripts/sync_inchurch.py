import urllib.request
import urllib.error
import base64
import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

# Credenciais inChurch
INCHURCH_KEY = os.getenv("INCHURCH_API_KEY", "36e07f73-f366-498f-81a9-6c237e29d42d")
INCHURCH_SECRET = os.getenv("INCHURCH_API_SECRET", "eyD00jqlxxMH5pk7l8UvdDsZSiMi2o8YA0jDCGMoTXg63JP1hjKnNmMFzpI673yB")

# Credenciais Supabase
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "https://yzfklvqyveugjlbissmq.supabase.co")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY", "sb_publishable_TQjjlByEUZFuFkJ5NqLP9Q_ND6u4VOz")

inchurch_headers = {
    "Authorization": f"Basic {base64.b64encode(f'{INCHURCH_KEY}:{INCHURCH_SECRET}'.encode('utf-8')).decode('utf-8')}",
    "Content-Type": "application/json",
    "X-API-Version": "v1"
}

supabase_headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def fetch_inchurch(endpoint):
    url = f"https://api.inchurch.com.br/public{endpoint}"
    req = urllib.request.Request(url, headers=inchurch_headers)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def sync_cells():
    print("\n--- Sincronizando Células da inChurch ---")
    data = fetch_inchurch("/v1/cell/?page_size=100")
    results = data.get("results", []) if isinstance(data, dict) else data
    print(f"Total de células obtidas na inChurch: {len(results)}")
    
    cells_to_upsert = []
    for c in results:
        loc = c.get("location") or {}
        cells_to_upsert.append({
            "id": c.get("id"),
            "name": c.get("name"),
            "image": c.get("image"),
            "category": c.get("category"),
            "leaders": c.get("leaders") or [],
            "supervisors": c.get("supervisors") or [],
            "auxiliaries": c.get("auxiliaries") or [],
            "weekdays": c.get("weekdays") or [],
            "frequency": c.get("frequency") or 0,
            "location": loc,
            "address": c.get("address"),
            "latitude": loc.get("latitude"),
            "longitude": loc.get("longitude"),
            "raw_data": c
        })
        
    url = f"{SUPABASE_URL}/rest/v1/cells"
    req = urllib.request.Request(url, headers=supabase_headers, data=json.dumps(cells_to_upsert).encode('utf-8'), method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"✅ Sucesso ao sincronizar {len(cells_to_upsert)} células no Supabase! Status: {resp.status}")
    except urllib.error.HTTPError as e:
        print(f"❌ Erro ao enviar células para o Supabase: HTTP {e.code} - {e.read().decode('utf-8')}")

def sync_members():
    print("\n--- Sincronizando Membros da inChurch ---")
    page = 1
    total_members = 0
    all_members = []
    
    while True:
        data = fetch_inchurch(f"/v1/people/?page={page}&page_size=100")
        results = data.get("results", []) if isinstance(data, dict) else data
        if not results:
            break
        all_members.extend(results)
        total_members += len(results)
        print(f"Página {page}: {len(results)} membros carregados (Total acumulado: {total_members})")
        if not data.get("next"):
            break
        page += 1
        
    print(f"Total de membros prontos para o Supabase: {len(all_members)}")
    
    # Processar em lotes de 50 para o Supabase
    batch_size = 50
    for i in range(0, len(all_members), batch_size):
        batch = all_members[i:i+batch_size]
        members_to_upsert = []
        for m in batch:
            members_to_upsert.append({
                "id": m.get("id"),
                "full_name": m.get("full_name") or "Sem Nome",
                "photo": m.get("photo"),
                "status": m.get("status"),
                "church_profile": m.get("church_profile"),
                "is_pastor": m.get("is_pastor", False),
                "is_leader": m.get("is_leader", False),
                "gender": m.get("gender"),
                "birthday": m.get("birthday"),
                "cpf": m.get("cpf"),
                "rg": m.get("rg"),
                "baptized": m.get("baptized", False),
                "baptism_date": m.get("baptism_date"),
                "marital_status": m.get("marital_status"),
                "marriage_date": m.get("marriage_date"),
                "email": m.get("email"),
                "phone": m.get("phone"),
                "mobile_phone": m.get("mobile_phone"),
                "has_whatsapp": m.get("has_whatsapp", False),
                "membership_number": str(m.get("membership_number") or ""),
                "occupation": m.get("occupation"),
                "membership_type": m.get("membership_type"),
                "location": m.get("location") or {},
                "roles": m.get("roles") or [],
                "is_active": m.get("is_active", True),
                "raw_data": m
            })
            
        url = f"{SUPABASE_URL}/rest/v1/members"
        req = urllib.request.Request(url, headers=supabase_headers, data=json.dumps(members_to_upsert).encode('utf-8'), method="POST")
        try:
            with urllib.request.urlopen(req) as resp:
                print(f"✅ Lote {i//batch_size + 1} ({len(members_to_upsert)} membros) gravado no Supabase.")
        except urllib.error.HTTPError as e:
            print(f"❌ Erro ao enviar lote de membros para o Supabase: HTTP {e.code} - {e.read().decode('utf-8')}")

if __name__ == "__main__":
    print("Iniciando sincronização completa da inChurch -> Supabase...")
    sync_cells()
    sync_members()
