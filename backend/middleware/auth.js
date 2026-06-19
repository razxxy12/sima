const jwt  = require('jsonwebtoken');
const pool = require('../config/db');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa.' });
  }
};

// Cek apakah mahasiswa berstatus Aktif
const requireAktif = async (req, res, next) => {
  try {
    // Admin boleh lewat
    if (req.user.role === 'admin') return next();

    const [rows] = await pool.query(
      'SELECT status_magang FROM mahasiswa WHERE user_id = ?',
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(403).json({ message: 'Data mahasiswa tidak ditemukan.' });
    if (rows[0].status_magang !== 'Aktif')
      return res.status(403).json({ message: 'Hanya mahasiswa yang sedang aktif magang yang dapat mengupload laporan.' });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memverifikasi status magang.' });
  }
};

module.exports = { authenticate, requireAktif };
