## 🚀 Fitur

- **Manajemen User**: Daftar, login
- **Manajemen Catatan**: CREATE, READ, UPDATE, dan DATE catatan
- **Autentikasi**: Autentikasi berbasis JWT dengan refresh token
- **Database**: Database MySQL dengan Sequelize ORM
- **Dokumentasi**: Dokumentasi API menggunakan Swagger
- **Logging**: Winston logger untuk monitoring aplikasi
- **CORS**: Cross-origin resource sharing diaktifkan

## 📋 Yang Dibutuhkan

Sebelum menjalankan project ini, pastikan memiliki:

- **Node.js** (v18 atau lebih tinggi) atau **Bun** runtime
- **MySQL** database server
- **Git** (untuk clone repository)

## 🛠️ Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd notes-api
   ```

2. **Install dependencies**
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

## 🚀 Menjalankan Aplikasi

### Mode Development

```bash
bun run server.ts
```

Server akan berjarunning di `http://localhost:3000` (atau port yang ditentukan di file `.env`).

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
Untuk Auth jika user login telah login /  > 15 menit / Token Expired maka perlu refresh token nya lagi ke refresh-token untuk request body nya skrng optional karna semua manajemen tokennya dihandle dari back / cookies

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

Aplikasi secara otomatis menginisialisasi database dan membuat tabel saat startup. Model database didefinisikan menggunakan Sequelize ORM.

## 🆘 Troubleshooting

### Masalah Umum

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

**Dibuat dengan ❤️ menggunakan Bun, Express.js, dan TypeScript**
