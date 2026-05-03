import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { userSchema } from "../../schemas/user.schema";

export default {
    createAccount: async( req: Request, res: Response)=> {
        try {
            const {nome, senha, email} = userSchema.parse(req.body);
            const senhaHash = await bcrypt.hash(senha, 10);
            const response = await prisma.usuario.create({
                data: {
                    nome: nome,
                    senha: senhaHash,
                    email: email
                }
            });
            if (!response) {
                return res.status(400).json({message: "Erro ocorreu ao tentar criar usuário"})
            }
            res.status(200).json({message: "Conta criada com sucesso"})
        } catch (error) {
            res.status(500).json({message: `Erro interno no servidor ${error}`})
        }
    },
    updateAccount: async (req: Request, res: Response)=> {
        try {
            const { id } = userSchema.parse(req.params);
            const {nome, senha, email} = userSchema.parse(req.body);
            const response = await prisma.usuario.update({
                where: {
                    id: id
                },
                data: {
                    nome: nome,
                    email: email,
                    senha: senha
                }
            });
            if(!response) {
                res.status(400).json({message: "Usuário não encontrado"})
            }
        } catch (error) {
            res.status(500).json({message: `Erro interno no servidor ${error}`})
        }
    }
}