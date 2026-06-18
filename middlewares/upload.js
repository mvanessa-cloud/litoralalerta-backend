import fs from "fs";
import path from "path";
import multer from "multer";

// Pastas onde cada tipo de imagem é salva, dentro de /public (servido estaticamente)
const DESTINOS = {
    fotoCapa: path.join(process.cwd(), "public", "fotos"),
    fotoPerfil: path.join(process.cwd(), "public", "fotos", "perfil"),
};

// Garante que as pastas de destino existem
Object.values(DESTINOS).forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
});

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function criarStorage(campo) {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, DESTINOS[campo]);
        },
        filename: (req, file, cb) => {
            const extensao = path.extname(file.originalname).toLowerCase() || ".jpg";
            const nomeUnico = `${campo}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extensao}`;
            cb(null, nomeUnico);
        },
    });
}

function filtroImagem(req, file, cb) {
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
        return cb(new Error("Formato de imagem inválido. Use JPG, PNG, WEBP ou GIF."));
    }
    cb(null, true);
}

export const uploadFotoCapa = multer({
    storage: criarStorage("fotoCapa"),
    fileFilter: filtroImagem,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("fotoCapa");

export const uploadFotoPerfil = multer({
    storage: criarStorage("fotoPerfil"),
    fileFilter: filtroImagem,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("fotoPerfil");