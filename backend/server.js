require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const pool    = require('./config/db');

// ── Buat folder uploads otomatis saat server start ────────────────────────────
const uploadDirs = ['uploads', 'uploads/foto', 'uploads/laporan'].map(
  (d) => path.join(__dirname, d)
);
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`[server] Folder dibuat: ${dir}`);
  }
});

const authRoutes       = require('./routes/auth');
const dashboardRoutes  = require('./routes/dashboard');
const mahasiswaRoutes  = require('./routes/mahasiswa');
const perusahaanRoutes = require('./routes/perusahaan');
const laporanRoutes    = require('./routes/laporan');
const profileRoutes    = require('./routes/profile');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',       authRoutes);
app.use('/api/dashboard',  dashboardRoutes);
app.use('/api/mahasiswa',  mahasiswaRoutes);
app.use('/api/perusahaan', perusahaanRoutes);
app.use('/api/laporan',    laporanRoutes);
app.use('/api/profile',    profileRoutes);

async function autoSetupDatabase() {
  try {
    const [tables] = await pool.query("SHOW TABLES LIKE 'users'");
    if (tables.length === 0) {
      console.log('⚙️  Membuat tabel...');
      await pool.query(`CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin','mahasiswa') NOT NULL DEFAULT 'mahasiswa',
        foto VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB`);

      await pool.query(`CREATE TABLE perusahaan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_perusahaan VARCHAR(100) NOT NULL,
        alamat TEXT,
        kota VARCHAR(50),
        bidang_usaha VARCHAR(50),
        email VARCHAR(100),
        telepon VARCHAR(30),
        pic VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB`);

      await pool.query(`CREATE TABLE mahasiswa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        nim VARCHAR(20) UNIQUE NOT NULL,
        prodi VARCHAR(50),
        angkatan YEAR,
        no_hp VARCHAR(20),
        status_magang ENUM('Pending','Approved','Rejected','Aktif','Selesai') DEFAULT 'Pending',
        perusahaan_id INT DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (perusahaan_id) REFERENCES perusahaan(id) ON DELETE SET NULL
      ) ENGINE=InnoDB`);

      await pool.query(`CREATE TABLE laporan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mahasiswa_id INT NOT NULL,
        judul VARCHAR(200) NOT NULL,
        file_pdf VARCHAR(255) NOT NULL,
        status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
        catatan TEXT,
        tanggal_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id) ON DELETE CASCADE
      ) ENGINE=InnoDB`);

      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        "INSERT INTO users (nama, email, password, role) VALUES (?,?,?,?)",
        ['Administrator', 'admin@sima.ac.id', hashedPassword, 'admin']
      );
      console.log('✅ Database siap! Admin: admin@sima.ac.id / admin123');
    } else {
      console.log('✅ Database sudah ada, lanjut...');
    }
  } catch (error) {
    console.error('❌ Gagal setup database:', error);
  }
}

const PORT = process.env.PORT || 5000;
setTimeout(() => {
  autoSetupDatabase().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
  });
}, 5000);
