const pool                   = require('../config/db');
const bcrypt                 = require('bcryptjs');
const cloudinary             = require('../config/cloudinary');
const { uploadToCloudinary } = require('../middleware/upload');

exports.getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.nama, u.email, u.role, u.foto, u.created_at,
              m.nim, m.no_hp, m.prodi, m.angkatan
       FROM users u
       LEFT JOIN mahasiswa m ON m.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil profil' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { nama, no_hp, prodi, angkatan } = req.body;

    // Update nama di tabel users
    await pool.query('UPDATE users SET nama = ? WHERE id = ?', [nama, req.user.id]);

    // Update data mahasiswa jika ada
    const [mhs] = await pool.query('SELECT id FROM mahasiswa WHERE user_id = ?', [req.user.id]);
    if (mhs.length > 0) {
      await pool.query(
        'UPDATE mahasiswa SET no_hp = ?, prodi = ?, angkatan = ? WHERE user_id = ?',
        [no_hp || null, prodi || null, angkatan || null, req.user.id]
      );
    }

    res.json({ message: 'Profil diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal update profil' });
  }
};

exports.uploadFoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File foto tidak ditemukan' });
    const [rows] = await pool.query('SELECT foto FROM users WHERE id = ?', [req.user.id]);
    const fotoLama = rows[0]?.foto;
    if (fotoLama && fotoLama.includes('cloudinary')) {
      const match = fotoLama.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
      if (match) await cloudinary.uploader.destroy(match[1]).catch(console.error);
    }
    const result = await uploadToCloudinary(req.file.buffer, {
      folder:         'sima/foto',
      resource_type:  'image',
      transformation: [{ width: 400, height: 400, crop: 'fill' }],
    });
    await pool.query('UPDATE users SET foto = ? WHERE id = ?', [result.secure_url, req.user.id]);
    res.json({ message: 'Foto berhasil diupload', foto: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal upload foto' });
  }
};

exports.deleteFoto = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT foto FROM users WHERE id = ?', [req.user.id]);
    const fotoLama = rows[0]?.foto;
    if (fotoLama && fotoLama.includes('cloudinary')) {
      const match = fotoLama.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
      if (match) await cloudinary.uploader.destroy(match[1]).catch(console.error);
    }
    await pool.query('UPDATE users SET foto = NULL WHERE id = ?', [req.user.id]);
    res.json({ message: 'Foto dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal hapus foto' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: 'Password lama dan baru wajib diisi' });
    const [rows]  = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
    if (!isMatch) return res.status(400).json({ message: 'Password lama salah' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengubah password' });
  }
};
