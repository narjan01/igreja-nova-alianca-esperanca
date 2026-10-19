import urllib.request
import json
import sys
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

h = {'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZmtsdnF5dmV1Z2psYmlzc21xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjQyMDY5NywiZXhwIjoyMTA3OTk2Njk3fQ.bJs_F1eBURMdxHWBFDt6pK8JU1LHB7F7G9CUa7ZlXyU'}
req = urllib.request.Request('https://yzfklvqyveugjlbissmq.supabase.co/rest/v1/events?select=id,title,start_datetime,end_datetime,image,raw_data&order=id.desc&limit=20', headers=h)
evs = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))

now = datetime.now()
print(f"Data/hora atual: {now.isoformat()}\n")

for e in evs:
    title = e['title']
    start = e['start_datetime']
    end = e['end_datetime']
    raw = e.get('raw_data', {})
    print(f"ID {e['id']} | {title[:35]:35} | start: {start} | end: {end} | raw_sub_deadline: {raw.get('subscription_deadline')}")
