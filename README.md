## 📋 Requirement

### Untuk Testing dengan Docker
- **Docker** dan **Docker Compose**
- **Git** (untuk clone repository)

### Untuk Development
- **Bun** runtime
- **MySQL** database server
- **Git** (untuk clone repository)

## ⚡ Quick Start

```bash
# 1. Clone repository
git clone https://github.com/ryturN/notes-api.git
cd notes-api

docker build -t notes-api .
# 2. Jalankan dengan Docker Compose
docker-compose up -d

# 3. Tunggu beberapa saat, lalu akses:
# - API: http://localhost:3000
# - Swagger Docs: http://localhost:3000/api/docs
```


## 🛠️ Instalasi
Notes : Jika ingin langsung running menggunakan docker bisa skip step instalasi
1. **Clone repository**
   ```bash
   git clone https://github.com/ryturN/notes-api.git
   cd notes-api
   ```

2. **Install dependencies**
   jika belum mempunyai bun bisa install dulu ke `https://bun.com/docs/installation`
   ```bash
   # Menggunakan Bun (direkomendasikan)
   bun install
   ```

3. **Setup environment variables**
   Buat file `.env` di root directory:
   ```env
   # Konfigurasi Database
   MYSQL_DB_NAME=notes_db
   MYSQL_DB_USER=root
   MYSQL_DB_PASSWORD=password_anda
   MYSQL_DB_HOST=localhost
   MYSQL_DB_PORT=3306
   
   # JWT Secrets
   JWT_SECRET=jwt_secret_key_anda
   JWT_REFRESH_SECRET=jwt_refresh_secret_key_anda
   
   # Konfigurasi Server
   PORT=3000
   ```

4. **Setup MySQL Database**
   ```sql
   CREATE DATABASE notes_db;
   ```

## 🚀 Running App

### Opsi 1: Menggunakan Docker

**Tidak perlu install Bun**

1. **Build Docker image**
   ```bash
   docker build -t notes-api .
   ```

2. **Jalankan dengan Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Atau jalankan manual**
   ```bash
   # Jalankan MySQL container
   docker run -d --name mysql-notes \
     -e MYSQL_ROOT_PASSWORD=root \
     -e MYSQL_DATABASE=notes_db \
     -p 3306:3306 mysql:8.0

   # Jalankan app
   docker run -d --name notes-api \
     --link mysql-notes:mysql \
     -p 3000:3000 \
     --env-file .env \
     notes-api
   ```

### Opsi 2: Manual running (Perlu Install Bun)

```bash
bun run server.ts
```

Server akan running di `http://localhost:3000` (atau port yang ditentukan di file `.env`).

## 📚 Dokumentasi API

Setelah server running, Bisa Langsung mengakses swagger documentation di :

```
http://localhost:3000/api/docs
```

## 🗂️ Struktur Project


```
notes-api/
├── app/
│   ├── BaseClient/          # Base client
│   ├── config/              # File konfigurasi
│   │   ├── logger.ts        # Config Winston logger
│   │   └── mysql.ts         # Setup DB
│   ├── controller/          # API controllers
│   │   ├── notes/           # Controller Notes
│   │   └── user/            # Controller Users
│   ├── middleware/          # Express middleware
│   │   └── token.ts         # Middleware autentikasi JWT
│   ├── models/              # Model database
│   │   ├── interface/       # TypeScript interfaces
│   │   ├── tables/          # Model Sequelize
│   │   ├── database.ts      # Init database
│   │   └── index.ts         # Export models
│   └── routes/              # API routes
│       ├── notes/           # Routes notes
│       ├── user/            # Routes user
│       └── index.ts         # Agregat routes
├── .env                     # Environment variables
├── package.json             # Dependencies dan scripts
├── server.ts               # File server utama
├── swagger.ts              # Konfigurasi Swagger
└── tsconfig.json           # Konfigurasi TypeScript
```

## 🔐 Autentikasi

API menggunakan JWT (JSON Web Tokens) untuk autentikasi.
untuk tokennya otomatis set ke cookies

## 📡 API Endpoints

### Autentikasi
- `POST /api/user/register` - Daftar New user
- `POST /api/user/login` - Login user
- `POST /api/user/refresh-token` - Refresh JWT token

### Untuk Auth. jika user telah login Lebih Dari 15 menit / Token Expired ,maka perlu refresh token nya lagi ke endpoint refresh-token. untuk request body nya skrng, masih optional karna semua manajemen tokennya dihandle dari back / cookies

### Notes (Need Login)
- `GET /api/notes` - Get All Notes untuk user yang login
- `POST /api/notes` - Buat notes baru
- `GET /api/notes/:id` - Get spesifik Note
- `PUT /api/notes/:id` - Update Note
- `DELETE /api/notes/:id` - Hapus Note



## 🔧 Development

### Script yang Tersedia

```bash
bun run server.ts
```

### Operasi Database

secara otomatis menginisialisasi database dan membuat tabel saat startup. Model database didefinisikan menggunakan Sequelize ORM.

## 🆘 Troubleshooting

### General Problem

1. **Error Koneksi Database**
   - Pastikan MySQL server berjalan
   - Verifikasi kredensial database di `.env`
   - Pastikan database sudah dibuat

2. **Port Sudah Digunakan**
   - Ubah PORT di file `.env`
   - Matikan proses yang menggunakan port: `netstat -ano | findstr :3000`

3. **Masalah JWT Token**
   - Pastikan JWT secrets sudah diset di `.env`
   - Periksa ekspirasi token
   - Verifikasi format token di Authorization header

### Troubleshooting Docker

1. **Docker Build Gagal**
   ```bash
   # Bersihkan cache dan rebuild
   docker system prune -f
   docker build --no-cache -t notes-api .
   ```

2. **Container MySQL Tidak Ready**
   ```bash
   # Check status MySQL
   docker logs mysql-notes
   
   # Tunggu sampai MySQL ready
   docker-compose logs -f mysql
   ```

3. **Port Conflict**
   ```bash
   # Stop semua container
   docker-compose down
   
   # Ubah port di docker-compose.yml jika perlu
   # Lalu jalankan lagi
   docker-compose up -d
   ```

4. **Reset Semua Container & Data**
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### Quick Commands Docker

```bash
# Lihat status containers
docker-compose ps

# Lihat logs aplikasi
docker-compose logs notes-api

# Lihat logs MySQL
docker-compose logs mysql

# Restart aplikasi saja
docker-compose restart notes-api

# Stop semua
docker-compose down

# Start ulang dengan rebuild
docker-compose up -d --build
```

**Dibuat dengan ❤️ menggunakan Bun, Express.js, dan TypeScript**
