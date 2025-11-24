# 📊 Ghid de Tracking Accesări Jocuri

## ✅ Implementare Automată

Platforma NumLit Games trackuiește **automat** fiecare accesare a unui joc prin sistemul `GameTracker`.

---

## 🎯 Ce se trackuiește automat?

### 1. **Număr de logări** (`total_logins`)
- Se incrementează la fiecare autentificare reală (SIGNED_IN event)
- **NU** la refresh sau navigare între rute
- **Exemplu**: Luni login → 1, Marți login → 2

### 2. **Număr de accesări jocuri** (`total_game_accesses`)
- Se incrementează la fiecare navigare la o rută de joc
- **Trackuire automată** prin `GameTracker` component
- **Exemplu**: Intri în "Calculează" → +1, intri în "Balanța Magică" → +1

### 3. **Timp petrecut** (`total_time_spent`)
- Se actualizează la fiecare 30 secunde
- Se salvează final la închidere tab/logout
- Acumula timpul total pe platformă (în secunde)

### 4. **Detalii accesări** (tabel `game_accesses`)
- Timestamp pentru fiecare accesare
- Nume joc și path
- Permite analize detaliate per joc

---

## 🚀 Cum funcționează tracking-ul automat?

### **Componenta `GameTracker`** (`src/components/GameTracker.tsx`)

```typescript
// Montată în App.tsx, monitorizează toate schimbările de rută
<GameTracker />
```

**Logică:**
1. Monitorizează `location.pathname` (React Router)
2. Verifică dacă ruta este un joc (există în `GAME_ROUTES`)
3. Inserează automat în `game_accesses` table
4. Trigger-ul SQL incrementează automat `total_game_accesses`

---

## ➕ Cum să adaugi un JOC NOU?

### **Pasul 1: Adaugă ruta în `GAME_ROUTES`** (`src/components/GameTracker.tsx`)

```typescript
const GAME_ROUTES: Record<string, string> = {
  // ... jocuri existente
  '/noul-meu-joc': 'Noul Meu Joc Awesome', // ⬅️ ADAUGĂ AICI
};
```

### **Pasul 2: Creează componenta jocului** (`src/pages/NoulMeuJoc.tsx`)

```typescript
export default function NoulMeuJoc() {
  // ✅ NU trebuie să adaugi nimic pentru tracking!
  // GameTracker detectează automat ruta /noul-meu-joc
  
  return <div>Jocul meu awesome</div>;
}
```

### **Pasul 3: Adaugă ruta în `App.tsx`**

```typescript
import NoulMeuJoc from "./pages/NoulMeuJoc";

// În Routes:
<Route path="/noul-meu-joc" element={<ProtectedRoute><NoulMeuJoc /></ProtectedRoute>} />
```

### **✅ GATA! Tracking-ul este AUTOMAT!**

---

## 📊 Ce vede profesorul în Admin Dashboard?

### **Stats Cards:**
- **Total Utilizatori**: Număr de conturi înregistrate
- **Accesări Jocuri**: Numărul TOTAL de clickuri pe jocuri (suma tuturor accesărilor)
- **Timp Total**: Timpul cumulat petrecut de toți utilizatorii
- **Medie/Utilizator**: Timpul mediu petrecut per utilizator

### **Tabel Utilizatori:**
Pentru fiecare elev:
- Nume și email
- **Accesări Jocuri**: Câte jocuri a accesat (suma)
- Timp petrecut total
- Ultima vizită
- Status (Admin/User)
- Buton pentru a face/revoca admin

### **Sortare:**
- Sortează după "Accesări Jocuri" (default)
- Sortează după "Timp Petrecut"

---

## 🔍 Query-uri utile în Supabase

### **Top 5 jocuri cele mai jucate:**
```sql
SELECT game_name, COUNT(*) as accesses
FROM game_accesses
GROUP BY game_name
ORDER BY accesses DESC
LIMIT 5;
```

### **Activitate per elev per joc:**
```sql
SELECT u.full_name, ga.game_name, COUNT(*) as times_played
FROM game_accesses ga
JOIN users u ON ga.user_id = u.id
GROUP BY u.full_name, ga.game_name
ORDER BY times_played DESC;
```

### **Elevi care nu au accesat niciun joc:**
```sql
SELECT full_name, email, total_game_accesses
FROM users
WHERE total_game_accesses = 0;
```

### **Activitate pe ultima săptămână:**
```sql
SELECT DATE(accessed_at) as date, COUNT(*) as accesses
FROM game_accesses
WHERE accessed_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(accessed_at)
ORDER BY date DESC;
```

---

## 🛠️ Structura Bazei de Date

### **Tabelul `users`:**
```sql
- id (UUID) - referință la auth.users
- email (TEXT)
- full_name (TEXT)
- avatar_url (TEXT)
- is_admin (BOOLEAN)
- total_logins (INTEGER) - număr autentificări
- total_game_accesses (INTEGER) - număr accesări jocuri ⭐
- total_time_spent (INTEGER) - secunde
- last_login (TIMESTAMP)
```

### **Tabelul `game_accesses`:**
```sql
- id (UUID)
- user_id (UUID) - referință la users
- game_name (TEXT) - ex: "Calculează"
- game_path (TEXT) - ex: "/calculeaza"
- accessed_at (TIMESTAMP)
```

### **Trigger automat:**
```sql
-- La fiecare INSERT în game_accesses
-- Incrementează automat users.total_game_accesses
CREATE TRIGGER trigger_increment_game_accesses
    AFTER INSERT ON game_accesses
    FOR EACH ROW
    EXECUTE FUNCTION increment_game_accesses();
```

---

## 🎓 Exemple practice

### **Exemplu 1: Elev activ**
```
Ion Popescu
- Se loghează Luni → total_logins = 1
- Accesează "Calculează" → total_game_accesses = 1
- Accesează "Balanța Magică" → total_game_accesses = 2
- Navighează înapoi la "Calculează" → total_game_accesses = 3
- Refresh (F5) → total_game_accesses = 4 (se contorizează din nou accesul)
- Petrecut 45 minute → total_time_spent = 2700 secunde
```

### **Exemplu 2: Adăugare joc nou "Descoperă Spațiul"**

1. **GameTracker.tsx:**
```typescript
const GAME_ROUTES: Record<string, string> = {
  // ...
  '/descopera-spatiul': 'Descoperă Spațiul', // ⬅️ ADAUGĂ
};
```

2. **Creează `src/pages/DescoperaS patiul.tsx`:**
```typescript
export default function DescoperaSpatiul() {
  return <div>🚀 Jocul meu despre spațiu!</div>;
}
```

3. **App.tsx:**
```typescript
import DescoperaSpatiul from "./pages/DescoperaSpatiul";

// În Routes:
<Route path="/descopera-spatiul" element={<ProtectedRoute><DescoperaSpatiul /></ProtectedRoute>} />
```

4. **✅ GATA! Tracking-ul funcționează automat!**

---

## 🚨 Note importante

1. **Refresh-ul (F5) contorizează o accesare nouă** - este intenționat, deoarece user-ul "reaccesează" jocul
2. **Navigarea înapoi la același joc contorizează din nou** - pentru a măsura engagement-ul real
3. **Tracking-ul funcționează DOAR pentru utilizatori autentificați**
4. **Rutele care NU sunt jocuri** (/, /login, /admin) **NU** sunt trackuite
5. **Adăugarea unui joc nou** necesită doar adăugarea în `GAME_ROUTES` - totul altceva este automat!

---

## 📞 Suport

Dacă ai întrebări despre tracking sau vrei să adaugi funcționalități noi:
1. Verifică `src/components/GameTracker.tsx` - logica de tracking
2. Verifică `supabase-schema.sql` - structura bazei de date
3. Verifică `src/pages/AdminDashboard.tsx` - cum se afișează datele

**Tracking-ul este 100% automat și scalabil! 🚀**

