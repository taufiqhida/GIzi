# Test Credentials - Sobat Giziku

## Admin
- Email: superadmin@sobatgizi.com
- Password: admin123

## Dokter
- Email: dokter@sobatgizi.com
- Password: dokter123

## Pasien
- Email: pasien@sobatgizi.com
- Password: pasien123

## Custom Admin (created via seed_admin.py)
- Email: admin@puskesmasbugangan.my.id
- Password: BugaganGizi2026

## Security Notes
- Public /api/auth/register only allows role=pasien (forced)
- Admin/dokter creation requires existing admin via /api/admin/users
- Brute force lockout: 5 fails/IP or 15 fails/email per 15 min
- Password policy: min 8 chars, mix of letters+digits
- Change password: POST /api/auth/change-password (requires auth)
