import multer from "multer";
import path from "path";

// Destino para armazenar as imagens
const imageStorage = multer.diskStorage({
  // A função destination agora é mais inteligente
  destination: function(req, file, cb) {
    let folder = "";

    // Verifica a URL base da requisição para decidir a pasta
    if (req.baseUrl.includes('produtos')) {
      folder = "produtos";
    } else if (req.baseUrl.includes('configuracao')) {
      // Usaremos 'configuracao' para as imagens de logo e fachada
      folder = "configuracao";
    }
    // Chama o callback com o caminho completo do destino
    cb(null, `public/images/${folder}`);
  },
  // A função filename para criar um nome de arquivo único continua perfeita
  filename: function(req, file, cb) {
    cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname));
  }
});

const imageUpload = multer({
  storage: imageStorage,
  // O filtro de arquivos também continua perfeito
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Por favor, envie apenas imagens no formato JPG, JPEG ou PNG.'));
    }
    cb(undefined, true);
  },
});
export default imageUpload;