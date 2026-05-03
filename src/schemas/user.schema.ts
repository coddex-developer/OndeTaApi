import z from "zod";

export const loginSchema = z.object({
    senha: z.string().min(6, "Senha deve conter 6 no mínimo dígitos"),
    email: z.string().email("Email inválido")
});

export const userSchema = z.object({
    nome: z.string(),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caractéres"),
    email: z.string().email("Email inválido")
});

export const idUserSchema = z.object({
    id: z.string()
});

export const rastreamentoSchema = z.object({
    codigo: z.string().min(1, "Código é obrigatório"),
    nome: z.string().optional(),
    categoria: z.string().optional(),
    favorito: z.boolean().optional(),
    statusAtual: z.enum(["SAIU_PARA_ENTREGA", "EM_TRANSITO", "ENTREGUE", "ATRASADO"]).optional(),
    previsaoEntrega: z.string().datetime().optional()
});

export const idRastreamentoSchema = z.object({
    id: z.string()
});

export const eventoRastreamentoSchema = z.object({
    status: z.string().min(1, "Status é obrigatório"),
    local: z.string().optional(),
    data: z.string().datetime()
});

export const notificacaoSchema = z.object({
    mensagem: z.string().min(1, "Mensagem é obrigatória"),
    lida: z.boolean().optional()
});

export const idNotificacaoSchema = z.object({
    id: z.string()
});

export const changePasswordSchema = z.object({
    senhaAtual: z.string().min(6, "Senha atual deve ter no mínimo 6 caracteres"),
    novaSenha: z.string().min(6, "Nova senha deve ter no mínimo 6 caracteres")
});