const pool       = require('../config/db');
const bcrypt     = require('bcryptjs');
const cloudinary = require('../config/cloudinary');

exports.getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nama, email, role, foto, created_at FROM users WHERE id = ?',
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
    const { nama, no_hp } = req.body;
    await pool.query('UPDATE users SET nama = ? WHERE id = ?', [nama, req.user.id]);
    res.json({ message: 'Profil diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal update profil' });
  }
};

exports.uploadFoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File foto tidak ditemukan' });

    // Hapus foto lama dari Cloudinary jika ada
    const [rows] = await pool.query('SELECT foto FROM users WHERE id = ?', [req.user.id]);
    const fotoLama = rows[0]?.foto;
    if (fotoLama && fotoLama.includes('cloudinary')) {
      // Extract public_id: ambil bagian setelah /upload/ lalu hapus extension
      const match = fotoLama.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
      if (match) {
        await cloudinary.uploader.destroy(match[1]).catch(console.error);
      }
    }

    // req.file.path = Cloudinary secure_url
    const fotoUrl = req.file.path;
    await pool.query('UPDATE users SET foto = ? WHERE id = ?', [fotoUrl, req.user.id]);
    res.json({ message: 'Foto berhasil diupload', foto: fotoUrl });
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
      const match = fotoLama.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
      if (match) {
        await cloudinary.uploader.destroy(match[1]).catch(console.error);
      }
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
