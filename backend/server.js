const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// ─── Auto-buat folder uploads saat server start ───────────────────────────────
const uploadDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads', 'foto'),
  path.join(__dirname, 'uploads', 'laporan'),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`[server] Folder dibuat: ${dir}`);
  }
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sajikan folder uploads sebagai static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
const authRoutes       = require('./routes/auth');
const dashboardRoutes  = require('./routes/dashboard');
const mahasiswaRoutes  = require('./routes/mahasiswa');
const perusahaanRoutes = require('./routes/perusahaan');
const laporanRoutes    = require('./routes/laporan');
const profileRoutes    = require('./routes/profile');

app.use('/api/auth',       authRoutes);
app.use('/api/dashboard',  dashboardRoutes);
app.use('/api/mahasiswa',  mahasiswaRoutes);
app.use('/api/perusahaan', perusahaanRoutes);
app.use('/api/laporan',    laporanRoutes);
app.use('/api/profile',    profileRoutes);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[server error]', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[server] Berjalan di http://localhost:${PORT}`);
});
