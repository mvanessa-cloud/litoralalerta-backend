import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export function autenticar(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: "Não autenticado" });
    }

    const payload = jwt.verify(token, SECRET);
    req.usuario = payload;
    next();
}