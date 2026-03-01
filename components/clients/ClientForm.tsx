"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { clientSchema, type ClientFormData } from "@/lib/validations"
import { createClient } from "@/lib/supabase/client"
import { createClientRecord } from "@/lib/services/clients"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, User, Phone, Mail, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ClientForm() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            full_name: "",
            phone: "",
            email: "",
            notes: "",
        }
    })

    async function onSubmit(data: ClientFormData) {
        setLoading(true)
        setError(null)

        const { error: supabaseError } = await createClientRecord(supabase, data)

        if (supabaseError) {
            setError(supabaseError.message)
            setLoading(false)
            return
        }

        router.push(`/clientes`)
        router.refresh()
    }

    return (
        <Card className="w-full border-none shadow-xl shadow-slate-200/50 bg-white rounded-2xl overflow-hidden mt-8">
            <CardContent className="p-6 md:p-8">

                {error && (
                    <div className="p-4 mb-8 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Nombre y Teléfono */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="full_name" className="font-bold text-slate-700">
                                Nombre completo <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="full_name"
                                    placeholder="Ej. Juan Pérez"
                                    {...register("full_name")}
                                    className={cn(
                                        "pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#F59E0B]",
                                        errors.full_name && "border-rose-500 focus-visible:ring-rose-500"
                                    )}
                                />
                            </div>
                            {errors.full_name && (
                                <p className="text-rose-500 text-xs font-medium">{errors.full_name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="font-bold text-slate-700">
                                Teléfono <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Ej. 099 999 9999"
                                    {...register("phone")}
                                    className={cn(
                                        "pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#F59E0B]",
                                        errors.phone && "border-rose-500 focus-visible:ring-rose-500"
                                    )}
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-rose-500 text-xs font-medium">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="font-bold text-slate-700">
                            Correo electrónico <span className="text-slate-400 font-normal text-xs ml-1">(Opcional)</span>
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-slate-400" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="usuario@correo.com"
                                {...register("email")}
                                className={cn(
                                    "pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#F59E0B]",
                                    errors.email && "border-rose-500 focus-visible:ring-rose-500"
                                )}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-rose-500 text-xs font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Notas */}
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="font-bold text-slate-700">
                            Notas adicionales <span className="text-slate-400 font-normal text-xs ml-1">(Opcional)</span>
                        </Label>
                        <div className="relative">
                            <div className="absolute top-3 left-0 pl-3.5 pointer-events-none">
                                <FileText className="h-4 w-4 text-slate-400" />
                            </div>
                            <Textarea
                                id="notes"
                                placeholder="Información relevante sobre el cliente..."
                                {...register("notes")}
                                className={cn(
                                    "pl-10 min-h-25 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#F59E0B] py-3",
                                    errors.notes && "border-rose-500 focus-visible:ring-rose-500"
                                )}
                            />
                        </div>
                        {errors.notes && (
                            <p className="text-rose-500 text-xs font-medium">{errors.notes.message}</p>
                        )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1 h-12 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 h-12 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold transition-colors"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            Guardar Cliente
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
