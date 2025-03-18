# Database Granular Data Access  

## 📌 Introduktion  
Dette dokument giver trin-for-trin instruktioner til, hvordan du som **integrator** tilkobler dig PostgreSQL-databasen, der benytter **granular data access control**.  

**Databaseindhold:**  
Databasen repræsenterer en **employee-database** med følgende felter:  
- **`name`** (Navn på medarbejderen)  
- **`salary`** (Løn for medarbejderen)  

**Adgangsrestriktioner:**  
| Rolle   | Kan se `name` | Kan se `salary` | Kan tilføje/slette |
|---------|--------------|-----------------|---------------------|
| Reader  | ✅            | ❌              | ❌                  |
| Writer  | ✅            | ✅              | ✅ (kan indsætte)    |
| Admin   | ✅            | ✅              | ✅ (kan alt)         |

---

## 🛠 Forberedelse  
For at forbinde til databasen skal du:  

1. **Aftale IP-adressen** på maskinen, hvor databasen kører.  
2. **Installere PostgreSQL** (hvis det ikke allerede er installeret):  
   👉 [Download PostgreSQL](https://www.postgresql.org/download/)  
   **Vigtigt:** Sørg for at inkludere `psql CLI` i installationen.  

---

## 🔗 Opret forbindelse til databasen  
Når PostgreSQL er installeret, åbner du din **CLI (Terminal, PowerShell eller cmd)**.  

Forbind til databasen som **Reader** ved at køre følgende kommando:  

```sh
psql -U reader -h <x.x.x.x> -p 5432 -d granular_db -W
```
*(Erstat `<x.x.x.x>` med den angivne IP-adresse)*  

Efter login kan du tjekke den nuværende bruger:
```sql
SELECT current_user;
```

---

## ✅ Test af adgangsrettigheder  

### **🔍 Reader (Kun navn synligt)**  
Test om **Reader** kun har adgang til `name`-kolonnen:  

```sql
SELECT * FROM employees;  -- Skal kun returnere 'id' og 'name'
SELECT salary FROM employees; -- Skal fejle
```

---

### **✍️ Writer (Kan skrive, se alt)**  
Forbind som **Writer** og test om du kan tilføje en ny medarbejder:  

```sh
psql -U writer -h <x.x.x.x> -p 5432 -d granular_db -W
```

Indsæt en ny medarbejder og tjek adgangen:  
```sql
INSERT INTO employees (name, salary) VALUES ('Charlie', 70000);
SELECT * FROM employees;  -- Skal returnere alle kolonner
```

---

### **👑 Admin (Fuld adgang)**  
Forbind som **Admin** og test fuld kontrol over databasen:  

```sh
psql -U admin -h <x.x.x.x> -p 5432 -d granular_db -W
```

Slet den tidligere indsatte bruger og tjek adgangsrettighederne:  
```sql
DELETE FROM employees WHERE name='Charlie';  -- Skal lykkes
GRANT ALL ON employees TO admin;
```

---

## ❗ Fejlfinding  
| Problem | Løsning |
|---------|---------|
| **"psql: could not connect to server"** | Tjek om PostgreSQL kører (`systemctl status postgresql` eller `docker ps`) |
| **"password authentication failed"** | Kontrollér brugernavn og adgangskode |
| **"permission denied"** | Sørg for, at du bruger den korrekte rolle (`reader`, `writer`, `admin`) |
| **Kan ikke tilgå databasen eksternt** | Tjek `pg_hba.conf`, `listen_addresses = '*'`, og firewallindstillinger |

---

## 🎯 Konklusion  
Hvis alle testene lykkes, har du nu verificeret, at **granular data access control** fungerer korrekt i PostgreSQL.  
- **Reader** kan kun se **navne**.  
- **Writer** kan tilføje og se **alle felter**.  
- **Admin** har **fuld kontrol**.  

God fornøjelse med integrationen! 🚀  
