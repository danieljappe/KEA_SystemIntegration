# 🔐 Railway PostgreSQL Integration – Granular Data Access

## 📌 Introduction
This guide describes how to connect to a **PostgreSQL** database hosted on **Railway** with **role-based access control**.

The database contains a `users` table with the following columns:
- `id` (serial primary key)
- `name` (text)
- `secret` (text)

---

## 🧱 Access Control

| Role   | View `id` | View `name` | View `secret` | Insert | Delete |
|--------|-----------|-------------|---------------|--------|--------|
| Reader | ✅         | ✅           | ❌             | ❌      | ❌      |
| Writer | ✅         | ✅           | ✅             | ✅      | ❌      |

---

## 🛠 Prerequisites

Ensure PostgreSQL is installed on your machine. You can get it from:  
👉 [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

Make sure `psql` is available in your terminal or PowerShell.

---

## 🔗 Connection Details

You will receive the following from the exposee:
- Host: `switchback.proxy.rlwy.net`
- Port: `38424`
- Database: `railway`

### 🔐 Credentials

| Role   | Username | Password        |
|--------|----------|-----------------|
| Reader | `reader` | `readerpassword` |
| Writer | `writer` | `writerpassword` |

---

## 🚀 Connect via PowerShell

Open PowerShell and run the following (you’ll be prompted for password):

### Reader:
```powershell
psql -h switchback.proxy.rlwy.net -U reader -p 38424 -d railway
```

🔐 Password: `readerpassword`

### Writer:
```powershell
psql -h switchback.proxy.rlwy.net -U writer -p 38424 -d railway
```

🔐 Password: `writerpassword`

---

## 🧪 Testing Access

### ✅ Reader
```sql
SELECT * FROM users;        -- Should return id and name
SELECT secret FROM users;   -- Should fail
INSERT INTO users (name, secret) VALUES ('Hacker', 'hidden'); -- Should fail
```

### ✅ Writer
```sql
SELECT * FROM users;        
INSERT INTO users (name, secret) VALUES ('Alice', 'qwerty123');
SELECT secret FROM users;   -- Should succeed
DELETE FROM users WHERE name='Alice';  -- Should fail
```

---

## 🧰 Setup (Exposee Side)

Here’s the SQL to set up everything:

```sql
-- Create table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  secret TEXT NOT NULL
);

-- Drop roles
DROP ROLE IF EXISTS reader;
DROP ROLE IF EXISTS writer;

-- Create roles
CREATE ROLE reader WITH LOGIN PASSWORD 'readerpassword';
CREATE ROLE writer WITH LOGIN PASSWORD 'writerpassword';

-- Permissions
GRANT CONNECT ON DATABASE railway TO reader, writer;
GRANT USAGE ON SCHEMA public TO reader, writer;

GRANT SELECT (id, name) ON users TO reader;

GRANT SELECT (id, name, secret), INSERT ON users TO writer;
```

---

## 🧯 Troubleshooting

| Problem | Solution |
|---------|----------|
| `psql: not recognized` | Ensure PostgreSQL is added to system PATH |
| `password authentication failed` | Verify role exists and password is correct |
| `permission denied` | Use the correct user (reader/writer) |
| Can’t connect | Verify Railway project is running, firewall is open, and credentials are correct |

---

## ✅ Summary

- Reader can only read names and IDs.
- Writer can insert and read everything.
- Passwords are stored securely.
- Integration works via PowerShell and `psql`.

Happy integrating! 🚀
