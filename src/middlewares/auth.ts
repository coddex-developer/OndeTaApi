import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            }
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({message: "Token não encontrado"})
    }
    try {
        const secret = process.env.JWT_SECRET || "";
        const decoded = jwt.verify(token, secret) as { id: string; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: "Token inválido"})
    }
};