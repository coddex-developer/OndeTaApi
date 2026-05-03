import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { idUserSchema, loginSchema, userSchema, changePasswordSchema } from "../../schemas/user.schema";

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
    },
    getProfile: async (req: Request, res: Response) => {
        try {
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const user = await prisma.usuario.findUnique({
                where: { id: usuarioId },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    criadoEm: true,
                    atualizadoEm: true,
                    _count: {
                        select: {
                            rastreamentos: true,
                            notificacoes: true
                        }
                    }
                }
            });

            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            return res.status(200).json({
                user
            });
        } catch (error: any) {
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    },
    deleteAccount: async (req: Request, res: Response) => {
        try {
            const { id } = idUserSchema.parse(req.params);
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            // Verificar se o usuário está deletando sua própria conta
            if (id !== usuarioId) {
                return res.status(403).json({ message: "Você só pode deletar sua própria conta" });
            }

            // Deletar o usuário (o Prisma cuidará das relações devido às constraints)
            await prisma.usuario.delete({
                where: { id }
            });

            return res.status(200).json({
                message: "Conta deletada com sucesso"
            });
        } catch (error: any) {
            if (error.name === "ZodError") {
                return res.status(400).json({ errors: error.errors });
            }
            if (error.code === "P2025") {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    },
    changePassword: async (req: Request, res: Response) => {
        try {
            const { id } = idUserSchema.parse(req.params);
            const { senhaAtual, novaSenha } = changePasswordSchema.parse(req.body);
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            // Verificar se o usuário está alterando sua própria senha
            if (id !== usuarioId) {
                return res.status(403).json({ message: "Você só pode alterar sua própria senha" });
            }

            // Buscar o usuário para verificar a senha atual
            const user = await prisma.usuario.findUnique({
                where: { id }
            });

            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            // Verificar se a senha atual está correta
            const senhaAtualValida = await bcrypt.compare(senhaAtual, user.senha);
            if (!senhaAtualValida) {
                return res.status(400).json({ message: "Senha atual incorreta" });
            }

            // Hash da nova senha
            const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

            // Atualizar a senha
            await prisma.usuario.update({
                where: { id },
                data: { senha: novaSenhaHash }
            });

            return res.status(200).json({
                message: "Senha alterada com sucesso"
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
    getUserStats: async (req: Request, res: Response) => {
        try {
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            // Contar rastreamentos por status
            const rastreamentosStats = await prisma.rastreamento.groupBy({
                by: ['statusAtual'],
                where: { usuarioId },
                _count: {
                    statusAtual: true
                }
            });

            // Contar notificações não lidas
            const notificacoesNaoLidas = await prisma.notificacao.count({
                where: {
                    usuarioId,
                    lida: false
                }
            });

            // Total de rastreamentos
            const totalRastreamentos = await prisma.rastreamento.count({
                where: { usuarioId }
            });

            // Total de notificações
            const totalNotificacoes = await prisma.notificacao.count({
                where: { usuarioId }
            });

            // Formatar estatísticas de rastreamento
            const rastreamentosPorStatus = rastreamentosStats.reduce((acc, stat) => {
                acc[stat.statusAtual || 'SEM_STATUS'] = stat._count.statusAtual;
                return acc;
            }, {} as Record<string, number>);

            return res.status(200).json({
                stats: {
                    rastreamentos: {
                        total: totalRastreamentos,
                        porStatus: rastreamentosPorStatus
                    },
                    notificacoes: {
                        total: totalNotificacoes,
                        naoLidas: notificacoesNaoLidas
                    }
                }
            });
        } catch (error: any) {
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }
}