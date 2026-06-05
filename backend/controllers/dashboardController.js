const pool = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [[{ total_mahasiswa }]] = await pool.query(
      "SELECT COUNT(*) AS total_mahasiswa FROM mahasiswa m JOIN users u ON m.user_id = u.id WHERE u.role = 'mahasiswa'"
    );
    const [[{ total_perusahaan }]] = await pool.query('SELECT COUNT(*) AS total_perusahaan FROM perusahaan');
    const [[{ total_laporan }]] = await pool.query('SELECT COUNT(*) AS total_laporan FROM laporan');
    const [[{ laporan_approved }]] = await pool.query("SELECT COUNT(*) AS laporan_approved FROM laporan WHERE status='Approved'");
    const [[{ mahasiswa_aktif }]] = await pool.query(
      "SELECT COUNT(*) AS mahasiswa_aktif FROM mahasiswa m JOIN users u ON m.user_id = u.id WHERE u.role = 'mahasiswa' AND m.status_magang = 'Aktif'"
    );

    res.json({ total_mahasiswa, total_perusahaan, total_laporan, laporan_approved, mahasiswa_aktif });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil statistik' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [[{ total_mahasiswa }]] = await pool.query(
      "SELECT COUNT(*) AS total_mahasiswa FROM mahasiswa m JOIN users u ON m.user_id = u.id WHERE u.role = 'mahasiswa'"
    );
    const [[{ total_perusahaan }]] = await pool.query('SELECT COUNT(*) AS total_perusahaan FROM perusahaan');
    const [[{ total_laporan }]] = await pool.query('SELECT COUNT(*) AS total_laporan FROM laporan');
    const [[{ laporan_approved }]] = await pool.query("SELECT COUNT(*) AS laporan_approved FROM laporan WHERE status='Approved'");
    const [[{ mahasiswa_aktif }]] = await pool.query(
      "SELECT COUNT(*) AS mahasiswa_aktif FROM mahasiswa m JOIN users u ON m.user_id = u.id WHERE u.role = 'mahasiswa' AND m.status_magang = 'Aktif'"
    );
    res.json({ total_mahasiswa, total_perusahaan, total_laporan, laporan_approved, mahasiswa_aktif });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil statistik' });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.id, l.judul, l.status, l.tanggal_upload, u.nama AS nama_mahasiswa
      FROM laporan l
      JOIN mahasiswa m ON l.mahasiswa_id = m.id
      JOIN users u ON m.user_id = u.id
      ORDER BY l.tanggal_upload DESC
      LIMIT 5
    `);
    const activities = rows.map(r => ({
      id: r.id,
      type: 'laporan',
      description: `${r.nama_mahasiswa} mengunggah laporan "${r.judul}"`,
      status: r.status,
      time: r.tanggal_upload
    }));
    res.json({ activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil aktivitas' });
  }
};
