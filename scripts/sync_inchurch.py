import urllib.request
import urllib.error
import base64
import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

# Tentar carregar do .env caso exista
env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
if os.path.exists(env_file):
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

INCHURCH_KEY = os.getenv("INCHURCH_API_KEY", "36e07f73-f366-498f-81a9-6c237e29d42d")
INCHURCH_SECRET = os.getenv("INCHURCH_API_SECRET", "eyD00jqlxxMH5pk7l8UvdDsZSiMi2o8YA0jDCGMoTXg63JP1hjKnNmMFzpI673yB")
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "https://yzfklvqyveugjlbissmq.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("VITE_SUPABASE_ANON_KEY", ""))

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

def sync_cells():
    print("\n--- Sincronizando Células da inChurch ---")
    url = "https://api.inchurch.com.br/public/v1/cell/?limit=100"
    all_cells = []
    
    while url:
        req = urllib.request.Request(url, headers=inchurch_headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        results = data.get("results", []) if isinstance(data, dict) else data
        all_cells.extend(results)
        url = data.get("next") if isinstance(data, dict) else None
        
    print(f"Total de células obtidas na inChurch: {len(all_cells)}")
    
    cells_to_upsert = []
    for c in all_cells:
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
        
    url_supa = f"{SUPABASE_URL}/rest/v1/cells"
    req_supa = urllib.request.Request(url_supa, headers=supabase_headers, data=json.dumps(cells_to_upsert).encode('utf-8'), method="POST")
    try:
        with urllib.request.urlopen(req_supa, timeout=30) as resp:
            print(f"✅ Sucesso! {len(cells_to_upsert)} células sincronizadas no Supabase! HTTP {resp.status}")
    except urllib.error.HTTPError as e:
        print(f"❌ Erro ao enviar células: HTTP {e.code} - {e.read().decode('utf-8')}")

def sync_members():
    print("\n--- Sincronizando Membros da inChurch ---")
    url = "https://api.inchurch.com.br/public/v1/people/?limit=100&offset=0"
    all_members = []
    
    while url:
        req = urllib.request.Request(url, headers=inchurch_headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        results = data.get("results", []) if isinstance(data, dict) else data
        all_members.extend(results)
        print(f"Lote obtido: {len(results)} membros (Total acumulado: {len(all_members)})")
        url = data.get("next") if isinstance(data, dict) else None
        
    print(f"\nTotal final de membros obtidos da inChurch: {len(all_members)}")
    
    # Processar em lotes de 50 para o Supabase
    batch_size = 50
    for i in range(0, len(all_members), batch_size):
        batch = all_members[i:i+batch_size]
        members_to_upsert = []
        for m in batch:
            birthday = m.get("birthday")
            if birthday and len(str(birthday).strip()) == 0:
                birthday = None
                
            baptism_date = m.get("baptism_date")
            if baptism_date and len(str(baptism_date).strip()) == 0:
                baptism_date = None
                
            marriage_date = m.get("marriage_date")
            if marriage_date and len(str(marriage_date).strip()) == 0:
                marriage_date = None

            members_to_upsert.append({
                'id': m.get('id'),
                'full_name': m.get('full_name') or 'Sem Nome',
                'photo': m.get('photo'),
                'status': m.get('status'),
                'church_profile': m.get('church_profile'),
                'is_pastor': m.get('is_pastor', False),
                'is_leader': m.get('is_leader', False),
                'gender': m.get('gender'),
                'birthday': birthday,
                'cpf': m.get('cpf'),
                'rg': m.get('rg'),
                'baptized': m.get('baptized', False),
                'baptism_date': baptism_date,
                'marital_status': m.get('marital_status'),
                'marriage_date': marriage_date,
                'email': m.get('email'),
                'phone': m.get('phone'),
                'mobile_phone': m.get('mobile_phone'),
                'has_whatsapp': m.get('has_whatsapp', False),
                'membership_number': str(m.get('membership_number') or ''),
                'occupation': m.get('occupation'),
                'membership_type': m.get('membership_type'),
                'location': m.get('location') or {},
                'roles': m.get('roles') or [],
                'is_active': m.get('is_active', True),
                'raw_data': m
            })
            
        url_supa = f"{SUPABASE_URL}/rest/v1/members"
        req_supa = urllib.request.Request(url_supa, headers=supabase_headers, data=json.dumps(members_to_upsert).encode('utf-8'), method="POST")
        try:
            with urllib.request.urlopen(req_supa, timeout=30) as resp:
                print(f"✅ Lote {i//batch_size + 1} ({len(members_to_upsert)} membros) gravado no Supabase.")
        except urllib.error.HTTPError as e:
            print(f"❌ Erro ao enviar lote {i//batch_size + 1}: HTTP {e.code} - {e.read().decode('utf-8')}")

if __name__ == "__main__":
    print("Iniciando sincronização completa inChurch -> Supabase...")
    sync_cells()
    sync_members()
    print("\n🎉 Sincronização finalizada com sucesso!")
