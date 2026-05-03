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
})