const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    let where = '';
    const params = [];
    if (search) {
      where = 'WHERE nama_perusahaan LIKE ? OR bidang_usaha LIKE ? OR kota LIKE ?';
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    const [rows] = await pool.query(
      `SELECT * FROM perusahaan ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM perusahaan ${where}`, params);
    res.json({ data: rows, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memuat data perusahaan' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM perusahaan WHERE id=?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Perusahaan tidak ditemukan' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama_perusahaan, alamat, kota, bidang_usaha, email, telepon, pic } = req.body;
    if (!nama_perusahaan) return res.status(400).json({ message: 'Nama perusahaan wajib' });
    await pool.query(
      'INSERT INTO perusahaan (nama_perusahaan, alamat, kota, bidang_usaha, email, telepon, pic) VALUES (?,?,?,?,?,?,?)',
      [nama_perusahaan, alamat, kota, bidang_usaha, email, telepon, pic]
    );
    res.status(201).json({ message: 'Perusahaan berhasil ditambahkan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menambahkan perusahaan' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_perusahaan, alamat, kota, bidang_usaha, email, telepon, pic } = req.body;
    await pool.query(
      'UPDATE perusahaan SET nama_perusahaan=?, alamat=?, kota=?, bidang_usaha=?, email=?, telepon=?, pic=? WHERE id=?',
      [nama_perusahaan, alamat, kota, bidang_usaha, email, telepon, pic, id]
    );
    res.json({ message: 'Perusahaan diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui perusahaan' });
  }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM perusahaan WHERE id=?', [req.params.id]);
    res.json({ message: 'Perusahaan dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus perusahaan' });
  }
};