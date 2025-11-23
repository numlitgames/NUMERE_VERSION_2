# 🔐 Ghid de Configurare Autentificare Supabase

## 📋 Pași pentru Setup

### 1. Creează Proiect Supabase

1. Mergi la [https://supabase.com](https://supabase.com)
2. Creează un cont sau loghează-te
3. Click pe "New Project"
4. Completează detaliile:
   - **Project Name**: NumLit Games
   - **Database Password**: Salvează parola (o vei folosi mai târziu)
   - **Region**: Alege cel mai apropiat de tine
5. Așteaptă 1-2 minute până se creează proiectul

### 2. Configurează Google OAuth

1. În proiectul Supabase, mergi la **Authentication** → **Providers**
2. Găsește **Google** în listă
3. Click pe **Enable**
4. Deschide [Google Cloud Console](https://console.cloud.google.com)
5. Creează un proiect nou sau selectează unul existent
6. Mergi la **APIs & Services** → **Credentials**
7. Click pe **Create Credentials** → **OAuth 2.0 Client ID**
8. Selectează **Web application**
9. Adaugă URIs autorizate:
   - **Authorized JavaScript origins**:
     ```
     http://localhost:8080
     https://your-domain.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
10. Copiază **Client ID** și **Client Secret**
11. Lipește-le în Supabase la Google Provider
12. Click **Save**

### 3. Rulează Schema Bazei de Date

1. În Supabase, mergi la **SQL Editor**
2. Deschide fișierul `supabase-schema.sql` din proiect
3. Copiază tot conținutul
4. Lipește în SQL Editor
5. Click pe **Run** (sau Ctrl+Enter)
6. Verifică că toate tabelele s-au creat: `users`, `activity_logs`, `daily_stats`

### 4. Configurează Variabilele de Mediu

1. În Supabase, mergi la **Settings** → **API**
2. Copiază:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon/public key** (cheia lungă ce începe cu eyJ...)
3. Creează/editează fișierul `.env.local` în rădăcina proiectului:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Setează Primul Admin

După ce te loghezi prima dată cu Google:

1. Mergi în Supabase **SQL Editor**
2. Rulează următorul SQL (înlocuiește cu emailul tău):

```sql
UPDATE public.users 
SET is_admin = TRUE 
WHERE email = 'your-email@gmail.com';
```

3. Refreshează pagina și vei vedea butonul "Admin Dashboard"

## 🚀 Rulare Aplicație

```bash
# Instalează dependențele (dacă nu ai făcut deja)
npm install

# Pornește serverul de dezvoltare
npm run dev
```

Aplicația va rula pe: `http://localhost:8080`

## 🎯 Testare

### Test Autentificare:
1. Accesează `http://localhost:8080`
2. Ar trebui să fii redirecționat automat la `/login`
3. Click pe "Autentificare cu Google"
4. Selectează contul Google
5. După autentificare, vei fi redirecționat înapoi la platformă

### Test Admin Dashboard:
1. După ce ai setat `is_admin = TRUE` pentru contul tău
2. Accesează `http://localhost:8080/admin`
3. Ar trebui să vezi dashboard-ul cu:
   - Statistici generale (utilizatori, sesiuni, timp)
   - Lista tuturor utilizatorilor
   - Activitate zilnică
   - Posibilitatea de a face alți utilizatori admini

## 📊 Funcționalități Implementate

### ✅ Autentificare
- [x] Login cu Google OAuth
- [x] Sesiuni persistente
- [x] Auto-refresh token
- [x] Logout

### ✅ Tracking Utilizatori
- [x] Salvare date utilizator (nume, email, avatar)
- [x] Număr total de accesări (sesiuni)
- [x] Timp total petrecut pe platformă
- [x] Ultima vizită
- [x] Data înregistrării

### ✅ Tracking Activitate
- [x] Logging sesiuni individuale
- [x] Start/end time pentru fiecare sesiune
- [x] Update automat la fiecare 30 secunde
- [x] Salvare finală la închidere pagină

### ✅ Dashboard Admin
- [x] Statistici generale (cards)
- [x] Lista tutuși utilizatorilor
- [x] Sortare după:
  - Număr de accesări
  - Timp petrecut
- [x] Marcare/demarcare utilizatori ca admin
- [x] Activitate zilnică ultimele 7 zile
- [x] Protecție rute (doar admini pot accesa)

### ✅ Securitate
- [x] Row Level Security (RLS) în Supabase
- [x] Utilizatorii văd doar datele lor
- [x] Adminii văd toate datele
- [x] Protecție rute în frontend
- [x] Validare token automat

## 🗃️ Structura Bazei de Date

### Tabel: `users`
```
id (UUID, PK) - ID utilizator din auth.users
email (TEXT) - Email Google
full_name (TEXT) - Nume complet
avatar_url (TEXT) - URL avatar Google
is_admin (BOOLEAN) - Status admin
total_sessions (INTEGER) - Număr total sesiuni
total_time_spent (INTEGER) - Timp total în secunde
last_login (TIMESTAMP) - Ultima autentificare
created_at (TIMESTAMP) - Data creării
updated_at (TIMESTAMP) - Data ultimei actualizări
```

### Tabel: `activity_logs`
```
id (UUID, PK) - ID unic log
user_id (UUID, FK) - Referință la users
session_start (TIMESTAMP) - Început sesiune
session_end (TIMESTAMP) - Sfârșit sesiune
time_spent (INTEGER) - Timp petrecut în secunde
page_visits (JSONB) - Pagini vizitate
created_at (TIMESTAMP) - Data creării
```

### Tabel: `daily_stats`
```
id (UUID, PK) - ID unic
date (DATE) - Data
users_count (INTEGER) - Utilizatori activi
sessions_count (INTEGER) - Total sesiuni
total_time (INTEGER) - Timp total în secunde
created_at (TIMESTAMP) - Data creării
```

## 🔧 Funcții Utile SQL

### Incrementare sesiuni utilizator:
```sql
SELECT increment_user_sessions('user-uuid-here');
```

### Agregare statistici zilnice:
```sql
SELECT aggregate_daily_stats();
```

### Vezi toți admins:
```sql
SELECT * FROM users WHERE is_admin = TRUE;
```

### Vezi top 10 utilizatori după timp:
```sql
SELECT email, full_name, total_time_spent, total_sessions
FROM users
ORDER BY total_time_spent DESC
LIMIT 10;
```

## 🛠️ Troubleshooting

### Eroare "Missing Supabase environment variables"
- Verifică că `.env.local` există și conține variabilele corecte
- Restartează serverul de dezvoltare după modificarea `.env.local`

### Nu pot vedea Admin Dashboard
- Verifică că `is_admin = TRUE` în baza de date pentru contul tău
- Loghează-te din nou după setarea admin

### Timpul nu se trackează
- Verifică consola browser pentru erori
- Asigură-te că RLS policies sunt corect configurate
- Verifică că triggers sunt active în Supabase

### Google OAuth nu funcționează
- Verifică că redirect URI este corect în Google Cloud Console
- Asigură-te că Google Provider este enabled în Supabase
- Verifică că Client ID și Secret sunt corecte

## 📈 Viitor/Îmbunătățiri Posibile

- [ ] Export date în CSV/Excel
- [ ] Grafice interactive (Chart.js/Recharts)
- [ ] Filtrare date pe intervale de timp
- [ ] Notificări email pentru admini
- [ ] API pentru integrări externe
- [ ] Rapoarte automate săptămânale
- [ ] Tracking evenimente specifice (completări jocuri, scoruri)

## 📞 Suport

Dacă ai probleme:
1. Verifică console-ul browser (F12)
2. Verifică logs în Supabase Dashboard
3. Verifică că toate políticile RLS sunt active
4. Testează queries direct în SQL Editor

---

**Made with ❤️ for NumLit Educational Platform**

