# 🛡️ Panduan Keamanan VPS — Sobat Giziku

## Bagian 1: Keamanan Aplikasi (sudah diterapkan)

✅ **SECRET_KEY wajib dari env** — backend fail-fast kalau SECRET_KEY hilang/lemah  
✅ **Brute force protection** — 5 percobaan login gagal per IP / 15 attempts per email = lockout 15 menit  
✅ **Password policy** — minimal 8 karakter, harus ada huruf + angka  
✅ **Register publik tidak bisa jadi admin** — semua user baru otomatis role `pasien`. Admin/dokter dibuat oleh admin via dashboard  
✅ **Security headers** — `X-Frame-Options`, `X-Content-Type-Options`, `HSTS`, `Referrer-Policy`, `Permissions-Policy`  
✅ **Endpoint ganti password** — `POST /api/auth/change-password` (perlu login + password lama)  
✅ **CORS bisa di-restrict** via `CORS_ORIGINS=https://gizi.puskesmasbugangan.my.id` di `.env`  
✅ **TTL index** — login_attempts auto-deleted setelah 24 jam (DB tidak menumpuk)

---

## Bagian 2: Keamanan VPS (WAJIB SETUP)

### 2.1 SSH Hardening
```bash
# Generate SSH key di laptop (kalau belum punya)
ssh-keygen -t ed25519 -C "your@email.com"

# Upload ke VPS
ssh-copy-id root@VPS_IP

# Edit /etc/ssh/sshd_config:
sudo nano /etc/ssh/sshd_config
```
Set:
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222              # ganti dari 22 ke port acak
MaxAuthTries 3
ClientAliveInterval 300
```
```bash
sudo systemctl restart sshd
```

### 2.2 Firewall (UFW)
```bash
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp      # SSH port baru
sudo ufw allow 80/tcp        # HTTP (untuk redirect ke HTTPS)
sudo ufw allow 443/tcp       # HTTPS
sudo ufw enable
sudo ufw status
```
⚠️ **JANGAN** buka port 27017 (MongoDB) atau 8001 (FastAPI) ke publik!

### 2.3 Fail2ban (auto-block IP bandel)
```bash
sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```
Tambahkan:
```ini
[sshd]
enabled = true
port = 2222
maxretry = 3
bantime = 86400          # ban 24 jam
findtime = 600
```
```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status
```

### 2.4 MongoDB Authentication (PENTING!)
```bash
mongosh
```
```javascript
use admin
db.createUser({
  user: "sobatadmin",
  pwd: "PASSWORD-PANJANG-RANDOM-DISINI",
  roles: [{ role: "root", db: "admin" }]
})
exit
```
Edit `/etc/mongod.conf`:
```yaml
security:
  authorization: enabled
net:
  port: 27017
  bindIp: 127.0.0.1      # HANYA listen di localhost
```
```bash
sudo systemctl restart mongod
```
Update backend `.env`:
```
MONGO_URL="mongodb://sobatadmin:PASSWORD-PANJANG-RANDOM@localhost:27017"
```

### 2.5 SSL/HTTPS (WAJIB)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d gizi.puskesmasbugangan.my.id
# Auto-renew sudah di setup oleh certbot
sudo systemctl status certbot.timer
```

### 2.6 Auto-update keamanan
```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### 2.7 Backup OTOMATIS (KRITIS untuk anti-ransomware)
Buat script `/root/backup_mongo.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mongo"
mkdir -p $BACKUP_DIR
mongodump --uri="mongodb://sobatadmin:PASS@localhost:27017" --out=$BACKUP_DIR/$DATE
# Hapus backup lebih dari 7 hari
find $BACKUP_DIR -maxdepth 1 -type d -mtime +7 -exec rm -rf {} \;
# Upload ke cloud (Google Drive / S3 / Wasabi)
# rclone copy $BACKUP_DIR/$DATE remote:sobatgizi-backup/$DATE
```
```bash
chmod +x /root/backup_mongo.sh
crontab -e
# Backup setiap hari jam 3 pagi
0 3 * * * /root/backup_mongo.sh >> /var/log/mongo_backup.log 2>&1
```

⚡ **Best practice anti-ransomware:**
- Backup ke **lokasi terpisah** (Google Drive, AWS S3, Wasabi, BackBlaze B2)
- Pakai `rclone` untuk upload otomatis ke cloud
- **Jangan** simpan backup hanya di VPS yang sama!

### 2.8 Monitor & Audit
```bash
# Install monitoring sederhana
sudo apt install htop iotop netstat-nat

# Lihat process mencurigakan
ps aux | sort -k 3 -r | head

# Lihat koneksi aktif
sudo netstat -tunap

# Cek login history
last -a | head
```

---

## Bagian 3: Frontend & Nginx Hardening

### 3.1 Config Nginx hardening (`/etc/nginx/sites-available/gizi`)
```nginx
server {
    listen 443 ssl http2;
    server_name gizi.puskesmasbugangan.my.id;

    ssl_certificate /etc/letsencrypt/live/gizi.puskesmasbugangan.my.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gizi.puskesmasbugangan.my.id/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Hide server version
    server_tokens off;

    # Rate limiting (login endpoint)
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Body size limit
    client_max_body_size 5M;

    # Frontend (React build)
    root /var/www/sobatgizi/frontend/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Rate limit login khusus
    location /api/auth/login {
        limit_req zone=login burst=3 nodelay;
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket
    location /ws {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name gizi.puskesmasbugangan.my.id;
    return 301 https://$server_name$request_uri;
}
```

---

## Bagian 4: Setup Pertama Kali

```bash
# 1. Setelah pull repo & install deps
cd /var/www/sobatgizi/backend
source venv/bin/activate

# 2. Generate SECRET_KEY 64 char
openssl rand -hex 32

# 3. Buat .env (jangan commit!)
nano .env
```
Isi `.env`:
```
MONGO_URL="mongodb://sobatadmin:PASS_MONGODB@localhost:27017"
DB_NAME="sobat_giziku"
SECRET_KEY="64-char-hex-yang-tadi-di-generate"
CORS_ORIGINS="https://gizi.puskesmasbugangan.my.id"
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

```bash
# 4. Set permission .env (cuma owner yg bisa baca)
chmod 600 .env

# 5. Seed admin pertama
SEED_ADMIN_EMAIL=admin@puskesmasbugangan.my.id \
SEED_ADMIN_PASSWORD=PasswordKuat$(date +%s) \
python seed_admin.py

# 6. Restart service
sudo systemctl restart sobatgizi
sudo systemctl restart nginx
```

---

## ✅ Security Checklist

- [ ] SSH pakai key, password disabled, port bukan 22
- [ ] UFW firewall enabled (cuma allow 80, 443, SSH custom port)
- [ ] Fail2ban running
- [ ] MongoDB auth enabled, bindIp `127.0.0.1` saja
- [ ] HTTPS/SSL Let's Encrypt aktif
- [ ] Auto-update keamanan aktif (`unattended-upgrades`)
- [ ] Backup MongoDB otomatis ke cloud eksternal (S3/Drive)
- [ ] `.env` permission 600
- [ ] `SECRET_KEY` panjang & random (64+ hex chars)
- [ ] Admin password sudah diganti dari default
- [ ] Nginx server_tokens off & rate limit login
- [ ] User OS `non-root` dipakai untuk run aplikasi (bukan root)

---

## 🚨 Jika sudah kena ransomware:
1. **JANGAN bayar tebusan** — tidak ada jaminan data dikembalikan
2. **Putuskan VPS dari internet** segera (cabut IP/port via panel)
3. **Restore dari backup** cloud (S3/Drive) ke VPS baru
4. Ganti **semua password** & SECRET_KEY
5. Audit log untuk cari vector serangan
6. Laporkan ke provider VPS & Polisi Cyber (id-cert@cert.or.id)

Dengan backup otomatis ke cloud, kerugian ransomware **paling parah** = downtime 1-2 jam untuk restore.
