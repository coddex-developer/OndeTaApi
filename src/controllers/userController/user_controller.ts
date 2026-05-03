import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { idUserSchema, loginSchema, userSchema } from "../../schemas/user.schema";

export default {
    createAccount: async (req: Request, res: Response) => {
        try {
            const { nome, senha, email } = userSchema.parse(req.body);
            const senhaHash = await bcrypt.hash(senha, 10);
            const response = await prisma.usuario.create({
                data: {
                    nome: nome,
                    senha: senhaHash,
                    email: email
                }
            });
            return res.status(201).json({ 
                message: "Conta criada com sucesso",
                user: {
                    id: response.id,
                    email: response.email,
                    nome: response.nome
                }
            })
        } catch (error: any) {
            if (error.name === "ZodError") {
                return res.status(400).json({ errors: error.errors });
            }
            if (error.code === "P2002") {
                return res.status(409).json({ message: "Email já cadastrado" });
            }
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const { email, senha } = loginSchema.parse(req.body);
            const user = await prisma.usuario.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(401).json({
                    message: "Email ou senha inválidos",
                });
            }
            const senhaValida = await bcrypt.compare(senha, user.senha);

            if (!senhaValida) {
                return res.status(401).json({
                    message: "Email ou senha inválidos",
                });
            }
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                return res.status(500).json({
                    message: "Erro de configuração do servidor",
                });
            }
            const token = jwt.sign(
                {
                    email: user.email,
                    id: user.id,
                },
                jwtSecret,
                {
                    expiresIn: "7d",
                }
            );
            return res.status(200).json({
                message: "Login realizado com sucesso",
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    nome: user.nome,
                },
            });
        } catch (error: any) {
            if (error.name === "ZodError") {
                return res.status(400).json({ errors: error.errors });
            }
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    },
    updateAccount: async (req: Request, res: Response) => {
        try {
            const { id } = idUserSchema.parse(req.params);
            const { nome, senha, email } = userSchema.parse(req.body);
            const senhaHash = await bcrypt.hash(senha, 10);
            const response = await prisma.usuario.update({
                where: {
                    id: id
                },
                data: {
                    nome: nome,
                    email: email,
                    senha: senhaHash
                }
            });
            return res.status(200).json({ 
                message: "Conta atualizada com sucesso",
                user: {
                    id: response.id,
                    email: response.email,
                    nome: response.nome
                }
            });
        } catch (error: any) {
            if (error.name === "ZodError") {
                return res.status(400).json({ errors: error.errors });
            }
            if (error.code === "P2025") {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            if (error.code === "P2002") {
                return res.status(409).json({ message: "Email já cadastrado" });
            }
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }
}