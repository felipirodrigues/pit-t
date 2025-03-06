const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    // Usar timestamp + nome original do arquivo (limpo)
    const fileName = file.originalname.toLowerCase().replace(/[^a-z0-9.]/g, '-');
    cb(null, Date.now() + '-' + fileName);
  }
});

const fileFilter = (req, file, cb) => {
  // Tipos de arquivo permitidos
  const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.includes('application/') || file.mimetype.includes('text/');
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas documentos são aceitos.'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
  }
});

module.exports = upload; 