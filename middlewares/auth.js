import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export function autenticar(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: "Não autenticado" });
    }

    try {
        const payload = jwt.verify(token, SECRET);
        req.usuario = payload;
        next();
    } catch {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}

// Deve ser usado SEMPRE depois de `autenticar` na cadeia de middlewares,
// pois depende de req.usuario já estar preenchido.
export function ehAdmin(req, res, next) {
    if (req.usuario?.tipo !== "admin") {
        return res.status(403).json({ error: "Apenas administradores podem realizar esta ação." });
    }
    next();
}

// Permite tanto administradores quanto editores de conteúdo
export function podePublicar(req, res, next) {
    if (!["admin", "editor"].includes(req.usuario?.tipo)) {
        return res.status(403).json({ error: "Você não tem permissão para publicar notícias." });
    }
    next();
}