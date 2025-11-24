# 📋 Politica de Confidențialitate și Prelucrare Date

**Platformă Educațională NumLit Games**  
**Data ultimei actualizări:** {DATA_CURENTA}

---

## 1. Introducere

Bun venit la NumLit Games! Această platformă educațională este destinată elevilor și profesorilor pentru învățare interactivă prin jocuri. Respectăm confidențialitatea datelor tale și ne angajăm să protejăm informațiile personale în conformitate cu Regulamentul General privind Protecția Datelor (GDPR - Regulamentul UE 2016/679) și Legea nr. 190/2018 privind protecția datelor în România.

---

## 2. Date Personale Colectate

### 2.1. Date de autentificare (Google OAuth)

Când te autentifici cu Google, colectăm automat:

- **Adresa de email**
- **Numele complet**
- **Poza de profil (avatar)**
- **ID-ul unic Google**

**Notă importantă:** Parola ta Google **NU** este stocată sau accesibilă pe platformă. Autentificarea este gestionată complet de Google.

### 2.2. Date de activitate educațională

Pentru monitorizarea progresului educațional, colectăm:

- **Numărul de autentificări** pe platformă
- **Jocurile accesate**: nume joc, data și ora accesării
- **Timpul petrecut** pe platformă (măsurat în secunde)
- **Ultima dată de login**

### 2.3. Date tehnice

- **Session cookies**: Pentru menținerea sesiunii de autentificare
- **Local storage**: Pentru preferințe locale (setări jocuri)

---

## 3. Scopul Prelucrării Datelor

### 3.1. Temeiul legal (GDPR Art. 6)

Prelucrăm datele tale pe baza:

- **Consimțământul tău explicit** (GDPR Art. 6(1)(a)) - prin autentificarea pe platformă
- **Interes legitim** (GDPR Art. 6(1)(f)) - pentru funcționarea platformei educaționale

### 3.2. Scopuri specifice

Datele sunt prelucrate pentru:

1. **Funcționarea platformei**
   - Crearea și gestionarea contului tău
   - Autentificare securizată
   - Personalizarea experienței

2. **Monitorizare progres educațional**
   - Profesorii pot vedea ce jocuri sunt preferate
   - Analiza timpului petrecut pe platformă
   - Identificarea nevoilor educaționale

3. **Îmbunătățirea serviciilor**
   - Optimizarea jocurilor educaționale
   - Dezvoltarea de conținut nou
   - Rezolvarea problemelor tehnice

4. **Administrare**
   - Gestionarea accesului (elevi vs. profesori/administratori)
   - Asigurarea securității platformei
   - Respectarea obligațiilor legale

---

## 4. Destinatarii Datelor

### 4.1. Cine are acces la datele tale?

| Categorie | Acces Date | Scop |
|-----------|-----------|------|
| **Administratori/Profesori** | Nume, email, statistici activitate | Monitorizare progres educațional |
| **Alți elevi** | **NICIUN ACCES** | - |
| **Furnizori terți** | Google (OAuth), Supabase (stocare date) | Infrastructură tehnică |

### 4.2. Transferuri internaționale

Datele sunt stocate pe serverele **Supabase** (AWS) localizate în **Uniunea Europeană**, asigurând conformitatea cu GDPR.

**Nu transferăm date în afara UE fără garanții adecvate.**

---

## 5. Securitatea Datelor (GDPR Art. 32)

Implementăm măsuri tehnice și organizatorice adecvate:

### 5.1. Măsuri tehnice

- ✅ **Autentificare OAuth 2.0** prin Google (fără stocarea parolelor)
- ✅ **Criptare HTTPS/TLS** pentru toate comunicările
- ✅ **Row Level Security (RLS)** în baza de date - fiecare utilizator accesează doar datele proprii
- ✅ **Audit logs** pentru acțiuni administrative
- ✅ **Backup-uri automate** zilnice

### 5.2. Măsuri organizatorice

- ✅ **Acces restricționat** la baza de date (doar administratori autorizați)
- ✅ **Politici de securitate** clare pentru administratori
- ✅ **Monitorizare incidente** de securitate
- ✅ **Proceduri de notificare** a breșelor de securitate (în max. 72h conform GDPR)

---

## 6. Drepturile Tale (GDPR Capitolul III)

Conform GDPR, ai următoarele drepturi:

### 6.1. Dreptul de acces (Art. 15)

Poți solicita o copie a datelor personale pe care le deținem despre tine.

**Cum exerciți:** Contactează administratorul platformei prin email.

### 6.2. Dreptul la rectificare (Art. 16)

Poți corecta datele personale incorecte sau incomplete.

**Cum exerciți:** Modifică-ți profilul sau contactează administratorul.

### 6.3. Dreptul la ștergere / "Dreptul de a fi uitat" (Art. 17)

Poți solicita ștergerea datelor tale în următoarele cazuri:

- Nu mai sunt necesare scopurilor pentru care au fost colectate
- Îți retragi consimțământul
- Te opui prelucrării
- Datele au fost prelucrate ilegal

**Cum exerciți:** Contactează administratorul pentru ștergerea contului.

### 6.4. Dreptul la restricționarea prelucrării (Art. 18)

Poți solicita limitarea temporară a prelucrării datelor.

### 6.5. Dreptul la portabilitatea datelor (Art. 20)

Poți primi datele tale într-un format structurat, utilizat în mod curent și care poate fi citit automat (JSON/CSV).

### 6.6. Dreptul la opoziție (Art. 21)

Poți obiecta la prelucrarea datelor pentru motive legate de situația ta particulară.

**Excepție:** Datele necesare pentru funcționarea platformei nu pot fi restricționate fără a pierde accesul.

### 6.7. Dreptul de a depune plângere (Art. 77)

Poți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP):

- **Website:** [www.dataprotection.ro](http://www.dataprotection.ro)
- **Email:** anspdcp@dataprotection.ro
- **Telefon:** +40 21 252 5599
- **Adresă:** B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București

---

## 7. Retenția Datelor

### 7.1. Perioada de păstrare

| Tip Date | Perioada | Justificare |
|----------|----------|-------------|
| Date cont activ | Cât timp contul este activ | Funcționare platformă |
| Date cont inactiv | 2 ani de la ultima autentificare | Posibilitate reactivare |
| Activity logs | 1 an | Analize educaționale |
| Date cont șters | 30 zile (apoi ștergere completă) | Recuperare accidentală |

### 7.2. Ștergerea automată

Datele sunt șterse automat:

- **După 30 zile** de la solicitarea ștergerii contului
- **După 2 ani** de inactivitate (cu notificare prealabilă)

---

## 8. Cookie-uri și Tehnologii Similare

### 8.1. Cookie-uri utilizate

Platforma folosește **DOAR cookie-uri esențiale** pentru funcționare:

| Tip Cookie | Scop | Durată |
|------------|------|--------|
| Session cookie | Autentificare | Sesiune |
| Auth token | Păstrare sesiune Google | 7 zile |

### 8.2. Ce NU folosim

❌ Cookie-uri de publicitate  
❌ Cookie-uri de tracking terț (Google Analytics, Facebook Pixel, etc.)  
❌ Cookie-uri de social media  

### 8.3. Gestionare cookie-uri

Poți șterge cookie-urile oricând din setările browser-ului. **Notă:** Ștergerea cookie-urilor de autentificare te va deconecta de pe platformă.

---

## 9. Minori (Sub 16 ani)

### 9.1. Consimțământ parental

Conform GDPR Art. 8, pentru copiii **sub 16 ani**, este necesar **consimțământul părintelui/tutorelui legal** pentru prelucrarea datelor personale.

### 9.2. Notă pentru părinți/tutori

Te rugăm să citești această politică împreună cu copilul tău înainte de a utiliza platforma. Profesorii pot vedea statistici de utilizare pentru a înțelege mai bine nevoile educaționale ale elevilor.

### 9.3. Protecții suplimentare

- Datele minorilor sunt tratate cu **grijă sporită**
- **Nu sunt partajate** cu terțe părți (cu excepția furnizorilor de infrastructură)
- Părinții pot solicita oricând **accesul, rectificarea sau ștergerea** datelor copilului

---

## 10. Modificări ale Politicii

### 10.1. Actualizări

Ne rezervăm dreptul de a actualiza această politică pentru a reflecta:

- Modificări legislative
- Îmbunătățiri ale platformei
- Feedback utilizatori

### 10.2. Notificări

Modificările **semnificative** vor fi comunicate prin:

- ✅ Notificare pe platformă (banner vizibil)
- ✅ Email către toți utilizatorii
- ✅ Cererea de reacceptare (pentru modificări majore)

### 10.3. Istoric versiuni

Versiunile anterioare ale politicii sunt disponibile la cerere.

---

## 11. Încălcări de Securitate (Data Breach)

### 11.1. Notificare autoritate

În caz de încălcare a securității datelor, vom notifica **ANSPDCP în maximum 72 de ore** (conform GDPR Art. 33).

### 11.2. Notificare utilizatori

Dacă încălcarea reprezintă un **risc ridicat** pentru drepturile tale, vei fi notificat direct prin email (conform GDPR Art. 34).

---

## 12. Contact și Operator Date

### 12.1. Operator date cu caracter personal

**Nume operator:** [COMPLETEAZĂ CU NUMELE ȘCOLII/INSTITUȚIEI]  
**Adresă:** [COMPLETEAZĂ CU ADRESA]  
**Email:** [COMPLETEAZĂ CU EMAIL]  
**Telefon:** [COMPLETEAZĂ CU TELEFON]

### 12.2. Responsabil cu protecția datelor (DPO - dacă este cazul)

**Nume DPO:** [COMPLETEAZĂ SAU "NU ESTE NECESAR" dacă ești sub 250 angajați]  
**Email DPO:** [COMPLETEAZĂ]

### 12.3. Exercitarea drepturilor

Pentru exercitarea drepturilor GDPR sau întrebări despre această politică, contactează-ne la:

📧 **Email:** [EMAIL ADMINISTRATOR]  
📞 **Telefon:** [TELEFON]  
⏰ **Program:** Luni-Vineri, 9:00-17:00

**Termen de răspuns:** Maximum **30 zile** de la primirea cererii (conform GDPR Art. 12).

---

## 13. Conformitate și Bază Legală

Această platformă este conformă cu:

- ✅ **Regulamentul (UE) 2016/679** - GDPR (Regulamentul General privind Protecția Datelor)
- ✅ **Legea nr. 190/2018** privind măsuri de punere în aplicare a GDPR în România
- ✅ **Directiva ePrivacy** (Directiva 2002/58/CE modificată prin Directiva 2009/136/CE)
- ✅ **Legea educației naționale** nr. 1/2011 (pentru scopuri educaționale)

---

## 14. Dispoziții Finale

### 14.1. Limba aplicabilă

Versiunea în limba **română** a acestei politici prevalează în caz de discrepanțe cu traduceri.

### 14.2. Legea aplicabilă

Această politică este guvernată de **legea română** și GDPR.

### 14.3. Soluționare litigii

Orice litigiu va fi soluționat:

1. **Prin negociere** directă cu operatorul
2. **Prin plângere la ANSPDCP** (autoritatea de supraveghere)
3. **Prin instanțele judecătorești competente** din România

---

## 15. Acceptare

**Prin autentificarea pe platforma NumLit Games, confirmi că:**

✅ Ai citit și înțeles această Politică de Confidențialitate  
✅ Ești de acord cu prelucrarea datelor tale personale conform scopurilor menționate  
✅ Dacă ai sub 16 ani, ai consimțământul părintelui/tutorelui legal  

---

**Data ultimei actualizări:** {COMPLETEAZĂ CU DATA CURENTĂ}  
**Versiune:** 1.0

---

## 📞 Contact Rapid

**Pentru orice întrebări despre datele tale personale:**

📧 Email: [EMAIL ADMINISTRATOR]  
📞 Telefon: [TELEFON]  
🏢 Adresă: [ADRESA FIZICĂ]

**Autoritate de supraveghere (ANSPDCP):**

📧 anspdcp@dataprotection.ro  
📞 +40 21 252 5599  
🌐 www.dataprotection.ro

---

**© {AN CURENT} NumLit Games | Platformă Educațională Conformă GDPR 🇪🇺**

