const multer     = require('multer');
const cloudinary = require('../config/cloudinary');

// Simpan file ke memory dulu, lalu upload manual ke Cloudinary
// Ini menghindari masalah kompatibilitas multer-storage-cloudinary
const memoryStorage = multer.memoryStorage();

const uploadFoto    = multer({ storage: memoryStorage, limits: { fileSize: 5  * 1024 * 1024 } });
const uploadLaporan = multer({ storage: memoryStorage, limits: { fileSize: 10 * 1024 * 1024 } });

// Helper: upload buffer ke Cloudinary
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });
};

module.exports = { uploadFoto, uploadLaporan, uploadToCloudinary };
