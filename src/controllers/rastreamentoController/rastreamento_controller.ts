import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { rastreamentoSchema, idRastreamentoSchema, eventoRastreamentoSchema } from "../../schemas/user.schema";

export default {
    createRastreamento: async (req: Request, res: Response) => {
        try {
            const { codigo, nome, categoria, favorito, statusAtual, previsaoEntrega } = rastreamentoSchema.parse(req.body);
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const response = await prisma.rastreamento.create({
                data: {
                    codigo,
                    nome,
                    categoria,
                    favorito,
                    statusAtual,
                    previsaoEntrega: previsaoEntrega ? new Date(previsaoEntrega) : null,
                    usuarioId
                },
                include: {
                    eventos: true
                }
            });

            return res.status(201).json({
                message: "Rastreamento criado com sucesso",
                rastreamento: response
            });
        } catch (error: any) {
            if (error.name === "ZodError") {
                return res.status(400).json({ errors: error.errors });
            }
            if (error.code === "P2002") {
                return res.status(409).json({ message: "Código de rastreamento já existe para este usuário" });
            }
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    },

    getRastreamentos: async (req: Request, res: Response) => {
        try {
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const rastreamentos = await prisma.rastreamento.findMany({
                where: { usuarioId },
                include: {
                    eventos: {
                        orderBy: { data: 'desc' }
                    }
                },
                orderBy: { criadoEm: 'desc' }
            });

            return res.status(200).json({
                rastreamentos
            });
        } catch (error: any) {
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    },

    getRastreamentoById: async (req: Request, res: Response) => {
        try {
            const { id } = idRastreamentoSchema.parse(req.params);
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const rastreamento = await prisma.rastreamento.findFirst({
                where: {
                    id,
                    usuarioId
                },
                include: {
                    eventos: {
                        orderBy: { data: 'desc' }
                    }
                }
            });

            if (!rastreamento) {
                return res.status(404).json({ message: "Rastreamento não encontrado" });
            }

            return res.status(200).json({
                rastreamento
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

    updateRastreamento: async (req: Request, res: Response) => {
        try {
            const { id } = idRastreamentoSchema.parse(req.params);
            const updateData = rastreamentoSchema.parse(req.body);
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const response = await prisma.rastreamento.updateMany({
                where: {
                    id,
                    usuarioId
                },
                data: {
                    ...updateData,
                    previsaoEntrega: updateData.previsaoEntrega ? new Date(updateData.previsaoEntrega) : undefined
                }
            });

            if (response.count === 0) {
                return res.status(404).json({ message: "Rastreamento não encontrado" });
            }

            const rastreamentoAtualizado = await prisma.rastreamento.findUnique({
                where: { id },
                include: {
                    eventos: {
                        orderBy: { data: 'desc' }
                    }
                }
            });

            return res.status(200).json({
                message: "Rastreamento atualizado com sucesso",
                rastreamento: rastreamentoAtualizado
            });
        } catch (error: any) {
            if (error.name === "ZodError") {
                return res.status(400).json({ errors: error.errors });
            }
            if (error.code === "P2002") {
                return res.status(409).json({ message: "Código de rastreamento já existe para este usuário" });
            }
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    },

    deleteRastreamento: async (req: Request, res: Response) => {
        try {
            const { id } = idRastreamentoSchema.parse(req.params);
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const response = await prisma.rastreamento.deleteMany({
                where: {
                    id,
                    usuarioId
                }
            });

            if (response.count === 0) {
                return res.status(404).json({ message: "Rastreamento não encontrado" });
            }

            return res.status(200).json({
                message: "Rastreamento deletado com sucesso"
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

    addEvento: async (req: Request, res: Response) => {
        try {
            const { id } = idRastreamentoSchema.parse(req.params);
            const { status, local, data } = eventoRastreamentoSchema.parse(req.body);
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            // Verificar se o rastreamento existe e pertence ao usuário
            const rastreamento = await prisma.rastreamento.findFirst({
                where: {
                    id,
                    usuarioId
                }
            });

            if (!rastreamento) {
                return res.status(404).json({ message: "Rastreamento não encontrado" });
            }

            const evento = await prisma.eventoRastreamento.create({
                data: {
                    rastreamentoId: id,
                    status,
                    local,
                    data: new Date(data)
                }
            });

            // Atualizar status atual do rastreamento se necessário
            await prisma.rastreamento.update({
                where: { id },
                data: { statusAtual: status as any }
            });

            return res.status(201).json({
                message: "Evento adicionado com sucesso",
                evento
            });
        } catch (error: any) {
            if (error.name === "ZodError") {
                return res.status(400).json({ errors: error.errors });
            }
            if (error.code === "P2002") {
                return res.status(409).json({ message: "Evento já existe para esta data e status" });
            }
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }
}