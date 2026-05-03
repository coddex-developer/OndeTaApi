import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { notificacaoSchema, idNotificacaoSchema } from "../../schemas/user.schema";

export default {
    createNotificacao: async (req: Request, res: Response) => {
        try {
            const { mensagem, lida } = notificacaoSchema.parse(req.body);
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const response = await prisma.notificacao.create({
                data: {
                    usuarioId,
                    mensagem,
                    lida: lida || false
                }
            });

            return res.status(201).json({
                message: "Notificação criada com sucesso",
                notificacao: response
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

    getNotificacoes: async (req: Request, res: Response) => {
        try {
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const notificacoes = await prisma.notificacao.findMany({
                where: { usuarioId },
                orderBy: { criadaEm: 'desc' }
            });

            return res.status(200).json({
                notificacoes
            });
        } catch (error: any) {
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    },

    getNotificacaoById: async (req: Request, res: Response) => {
        try {
            const { id } = idNotificacaoSchema.parse(req.params);
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const notificacao = await prisma.notificacao.findFirst({
                where: {
                    id,
                    usuarioId
                }
            });

            if (!notificacao) {
                return res.status(404).json({ message: "Notificação não encontrada" });
            }

            return res.status(200).json({
                notificacao
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

    updateNotificacao: async (req: Request, res: Response) => {
        try {
            const { id } = idNotificacaoSchema.parse(req.params);
            const { mensagem, lida } = notificacaoSchema.parse(req.body);
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const response = await prisma.notificacao.updateMany({
                where: {
                    id,
                    usuarioId
                },
                data: {
                    mensagem,
                    lida
                }
            });

            if (response.count === 0) {
                return res.status(404).json({ message: "Notificação não encontrada" });
            }

            const notificacaoAtualizada = await prisma.notificacao.findUnique({
                where: { id }
            });

            return res.status(200).json({
                message: "Notificação atualizada com sucesso",
                notificacao: notificacaoAtualizada
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

    deleteNotificacao: async (req: Request, res: Response) => {
        try {
            const { id } = idNotificacaoSchema.parse(req.params);
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const response = await prisma.notificacao.deleteMany({
                where: {
                    id,
                    usuarioId
                }
            });

            if (response.count === 0) {
                return res.status(404).json({ message: "Notificação não encontrada" });
            }

            return res.status(200).json({
                message: "Notificação deletada com sucesso"
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

    markAsRead: async (req: Request, res: Response) => {
        try {
            const { id } = idNotificacaoSchema.parse(req.params);
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const response = await prisma.notificacao.updateMany({
                where: {
                    id,
                    usuarioId
                },
                data: {
                    lida: true
                }
            });

            if (response.count === 0) {
                return res.status(404).json({ message: "Notificação não encontrada" });
            }

            return res.status(200).json({
                message: "Notificação marcada como lida"
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

    markAllAsRead: async (req: Request, res: Response) => {
        try {
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            await prisma.notificacao.updateMany({
                where: {
                    usuarioId,
                    lida: false
                },
                data: {
                    lida: true
                }
            });

            return res.status(200).json({
                message: "Todas as notificações foram marcadas como lidas"
            });
        } catch (error: any) {
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }
}