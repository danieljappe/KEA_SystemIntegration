# Railway PostgreSQL Integration – Granular Data Access

## Introduction
This guide describes how to connect to a **PostgreSQL** database hosted on **Railway** with **granular database access**.

The database contains a `users` table with the following columns:
- `id` (primary key)
- `name` (text)
- `secret` (text)

---

## Access Control

| Role        | View `id` | View `name` | View `secret` | Insert | Delete |
|-------------|-----------|-------------|---------------|--------|--------|
| Reader      | ✅         | ✅           | ❌             | ❌      | ❌      |
| Reader2     | ✅         | ✅           | ✅             | ❌      | ❌      |
| ReadWriter  | ✅         | ✅           | ✅             | ✅      | ❌      |

---

## Prerequisites

Ensure PostgreSQL is installed on your machine:  
[https://www.postgresql.org/download/](https://www.postgresql.org/download/)

Ensure the `psql` command works in your terminal or PowerShell.

---

## Connection Details

Use the following connection info provided by the exposee:

- **Host:** `turntable.proxy.rlwy.net`
- **Port:** `15272`
- **Database:** `railway`

### Credentials

| Role        | Username     | Password         |
|-------------|--------------|------------------|
| Reader      | `reader`     | `readerpassword` |
| Reader2     | `reader2`    | `reader2password`      |
| ReadWriter  | `readwriter` | `rwpassword`     |

---

## Connect via PowerShell (Windows)

Open PowerShell and run the following. You'll be prompted for a password.

### Reader:
```powershell
psql -h turntable.proxy.rlwy.net -U reader -p 15272 -d railway
```
Password: `readerpassword`

### Reader2:
```powershell
psql -h turntable.proxy.rlwy.net -U reader2 -p 15272 -d railway
```
Password: `reader2pw`

### ReadWriter:
```powershell
psql -h turntable.proxy.rlwy.net -U readwriter -p 15272 -d railway
```
Password: `rwpassword`

---

## Connect via macOS Terminal (Same for linux)

On macOS, open the Terminal app and use the following commands. You'll be prompted for a password.

### Reader:
```bash
psql -h turntable.proxy.rlwy.net -U reader -p 15272 -d railway
```
Password: `readerpassword`

### Reader2:
```bash
psql -h turntable.proxy.rlwy.net -U reader2 -p 15272 -d railway
```
Password: `reader2pw`

### ReadWriter:
```bash
psql -h turntable.proxy.rlwy.net -U readwriter -p 15272 -d railway
```
Password: `rwpassword`

---

## Testing Access

### Reader
```sql
SELECT * FROM users;        -- Should return id and name only
SELECT secret FROM users;   -- Should fail
SELECT (id, name) FROM users; -- Should not fail
```

### Reader2
```sql
SELECT * FROM users;        -- Should return everything
SELECT secret FROM users;   -- Should succeed
```

### ReadWriter
```sql
SELECT * FROM users;
INSERT INTO users (name, secret) VALUES ('Alice', 'supersecret');
```

---

## Troubleshooting

| Problem                          | Solution |
|----------------------------------|----------|
| `psql: not recognized`           | Add PostgreSQL bin folder to system PATH |
| `authentication failed`          | Double-check username/password |
| `permission denied`              | Ensure you use the right role |
| `could not connect`              | Make sure Railway DB is running and you’re using correct host/port |

---

## Summary

- `reader` can only read `id` and `name`
- `reader2` can read everything
- `readwriter` can read everything and insert new rows
