-- ============================================================
-- Database: sima_db
-- Tabel: users, perusahaan, mahasiswa, laporan
-- Admin default: admin@sima.ac.id / admin123
-- ============================================================

CREATE DATABASE IF NOT EXISTS sima_db;
USE sima_db;

-- 1. Tabel users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','mahasiswa') NOT NULL DEFAULT 'mahasiswa',
  foto VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabel perusahaan
CREATE TABLE IF NOT EXISTS perusahaan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_perusahaan VARCHAR(100) NOT NULL,
  alamat TEXT,
  kota VARCHAR(50),
  bidang_usaha VARCHAR(50),
  email VARCHAR(100),
  telepon VARCHAR(30),
  pic VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabel mahasiswa
CREATE TABLE IF NOT EXISTS mahasiswa (
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
) ENGINE=InnoDB;

-- 4. Tabel laporan
CREATE TABLE IF NOT EXISTS laporan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mahasiswa_id INT NOT NULL,
  judul VARCHAR(200) NOT NULL,
  file_pdf VARCHAR(255) NOT NULL,
  status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
  catatan TEXT,
  tanggal_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Admin default (password: admin123, sudah di-hash dengan bcrypt)
INSERT INTO users (nama, email, password, role) VALUES
('Administrator', 'admin@sima.ac.id', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin');