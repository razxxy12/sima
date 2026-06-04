const pool = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    let where = "WHERE u.role = 'mahasiswa'";
    const params = [];
    if (search) {
      where += ' AND (m.nim LIKE ? OR u.nama LIKE ? OR m.prodi LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    const query = `SELECT m.*, u.nama, u.email, u.foto FROM mahasiswa m JOIN users u ON m.user_id = u.id ${where} ORDER BY m.id DESC LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) AS total FROM mahasiswa m JOIN users u ON m.user_id = u.id ${where}`;
    const [rows] = await pool.query(query, [...params, parseInt(limit), parseInt(offset)]);
    const [[{ total }]] = await pool.query(countQuery, params);
    res.json({ data: rows, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memuat data mahasiswa' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT m.*, u.nama, u.email, u.foto FROM mahasiswa m JOIN users u ON m.user_id = u.id WHERE m.id = ? AND u.role = ?',
      [req.params.id, 'mahasiswa']
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
};

exports.create = async (req, res) => {
  const { nim, nama, email, prodi, angkatan, no_hp, status_magang } = req.body;
  if (!nim || !nama || !email) return res.status(400).json({ message: 'NIM, nama, email wajib diisi' });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [existing] = await conn.query('SELECT id, role FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      if (existing[0].role === 'admin') return res.status(400).json({ message: 'Email digunakan admin' });
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }
    const hashedPassword = await bcrypt.hash('password123', 10);
    const [userRes] = await conn.query(
      'INSERT INTO users (nama, email, password, role) VALUES (?,?,?,?)',
      [nama, email, hashedPassword, 'mahasiswa']
    );
    await conn.query(
      'INSERT INTO mahasiswa (user_id, nim, prodi, angkatan, no_hp, status_magang) VALUES (?,?,?,?,?,?)',
      [userRes.insertId, nim, prodi, angkatan || new Date().getFullYear(), no_hp, status_magang || 'Pending']
    );
    await conn.commit();
    res.status(201).json({ message: 'Mahasiswa berhasil ditambahkan' });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ message: 'Gagal menambahkan mahasiswa' });
  } finally {
    conn.release();
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nama, prodi, angkatan, no_hp, status_magang } = req.body;
  try {
    await pool.query('UPDATE mahasiswa SET prodi=?, angkatan=?, no_hp=?, status_magang=? WHERE id=?',
      [prodi, angkatan, no_hp, status_magang, id]);
    const [mhs] = await pool.query('SELECT user_id FROM mahasiswa WHERE id=?', [id]);
    if (mhs.length > 0) {
      await pool.query('UPDATE users SET nama=? WHERE id=?', [nama, mhs[0].user_id]);
    }
    res.json({ message: 'Mahasiswa diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui mahasiswa' });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();
  try {
    const [mhs] = await conn.query(
      'SELECT m.user_id, u.role FROM mahasiswa m JOIN users u ON m.user_id = u.id WHERE m.id=?',
      [id]
    );
    if (mhs.length === 0) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
    if (mhs[0].role !== 'mahasiswa') return res.status(403).json({ message: 'Tidak dapat menghapus admin' });
    await conn.beginTransaction();
    await conn.query('DELETE FROM mahasiswa WHERE id=?', [id]);
    await conn.query('DELETE FROM users WHERE id=?', [mhs[0].user_id]);
    await conn.commit();
    res.json({ message: 'Mahasiswa dihapus' });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus' });
  } finally {
    conn.release();
  }
};