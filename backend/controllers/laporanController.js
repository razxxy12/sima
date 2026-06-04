const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'admin') {
      query = `SELECT l.*, u.nama AS nama_mahasiswa, m.nim FROM laporan l JOIN mahasiswa m ON l.mahasiswa_id = m.id JOIN users u ON m.user_id = u.id ORDER BY l.tanggal_upload DESC`;
      params = [];
    } else {
      query = `SELECT l.*, u.nama AS nama_mahasiswa FROM laporan l JOIN mahasiswa m ON l.mahasiswa_id = m.id JOIN users u ON m.user_id = u.id WHERE m.user_id = ? ORDER BY l.tanggal_upload DESC`;
      params = [req.user.id];
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memuat laporan' });
  }
};

exports.upload = async (req, res) => {
  try {
    const { judul } = req.body;
    if (!req.file) return res.status(400).json({ message: 'File tidak ada' });
    if (!judul) return res.status(400).json({ message: 'Judul wajib' });
    const [mhs] = await pool.query('SELECT id FROM mahasiswa WHERE user_id = ?', [req.user.id]);
    if (mhs.length === 0) return res.status(400).json({ message: 'Profil mahasiswa tidak ditemukan' });
    const filePath = req.file.path.replace(/\\/g, '/');
    await pool.query('INSERT INTO laporan (mahasiswa_id, judul, file_pdf) VALUES (?, ?, ?)', [mhs[0].id, judul, filePath]);
    res.status(201).json({ message: 'Laporan diupload' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload gagal' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status))
      return res.status(400).json({ message: 'Status tidak valid' });
    await pool.query('UPDATE laporan SET status=?, catatan=? WHERE id=?', [status, catatan || null, id]);
    res.json({ message: 'Status laporan diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal update status' });
  }
};