import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
})

export const clientSchema = z.object({
    full_name: z.string().min(1, "El nombre es requerido"),
    phone: z.string().min(1, "El teléfono es requerido"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    notes: z.string().optional(),
})

export const petSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    species: z.enum(["canino", "felino", "otro"], {
        message: "Selecciona una especie válida"
    }),
    breed: z.string().optional(),
    behavior_notes: z.string().optional(),
    image: z.any().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type ClientFormData = z.infer<typeof clientSchema>
export type PetFormData = z.infer<typeof petSchema>