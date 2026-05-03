import z from "zod";

export const userSchema = z.object({
    id: z.string(),
    nome: z.string(),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caractéres"),
    email: z.string().email("Email inválido")
});