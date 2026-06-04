const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, nama: user.nama },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email dan password wajib diisi' });

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Email atau password salah' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email atau password salah' });

    const token = generateToken(user);
    let profil = null;
    if (user.role === 'mahasiswa') {
      const [mhs] = await pool.query(
        'SELECT m.*, p.nama_perusahaan FROM mahasiswa m LEFT JOIN perusahaan p ON m.perusahaan_id = p.id WHERE m.user_id = ?',
        [user.id]
      );
      if (mhs.length > 0) profil = mhs[0];
    }

    res.json({ token, user: { id: user.id, nama: user.nama, email: user.email, role: user.role, foto: user.foto, profil } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { nama, email, password, nim, prodi, angkatan } = req.body;
    if (!nama || !email || !password || !nim)
      return res.status(400).json({ message: 'Field nama, email, password, nim wajib diisi' });

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [userRes] = await conn.query('INSERT INTO users (nama, email, password, role) VALUES (?,?,?,?)',
        [nama, email, hashedPassword, 'mahasiswa']);
      await conn.query('INSERT INTO mahasiswa (user_id, nim, prodi, angkatan) VALUES (?,?,?,?)',
        [userRes.insertId, nim, prodi, angkatan || new Date().getFullYear()]);
      await conn.commit();
      res.status(201).json({ message: 'Registrasi berhasil. Silakan login.' });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};