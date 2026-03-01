"use client"

import { createClient } from "@/lib/supabase/client"
import { LoginFormData } from "@/lib/validations"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/validations"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Loader2, PawPrint, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"

export default function LoginForm() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

    async function onSubmit(data: LoginFormData) {
        setLoading(true)
        setError(null)
        const { error } = await supabase.auth.signInWithPassword(data)

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        router.push("/clientes")
        router.refresh()
    }

    return (
        <Card className="w-full border-none shadow-none bg-transparent">
            <CardHeader className="space-y-6 px-0">
                <div className="flex items-center space-x-3">
                    <div className="bg-[#FEF3C7] p-2.5 rounded-full">
                        <PawPrint className="w-8 h-8 text-[#F59E0B] fill-[#F59E0B]" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ruffo</h1>
                </div>

                <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">Bienvenido</CardTitle>
                    <CardDescription className="text-base">
                        Ingresa tus credenciales para iniciar sesión
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-0">
                {error && (
                    <div className="p-3 mb-6 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="font-bold">
                            Correo electrónico
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@ruffo.com"
                                {...register("email")}
                                className={cn(
                                    "pl-10 h-12 rounded-xl focus-visible:ring-[#F59E0B]",
                                    errors.email && "border-rose-500 focus-visible:ring-rose-500"
                                )}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-rose-500 text-xs font-medium">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="font-bold">
                                Contraseña
                            </Label>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password")}
                                className={cn(
                                    "pl-10 pr-10 h-12 rounded-xl focus-visible:ring-[#F59E0B]",
                                    errors.password && "border-rose-500 focus-visible:ring-rose-500"
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-rose-500 text-xs font-medium">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 rounded-xl bg-[#00BFA5] hover:bg-[#00BFA3] text-white font-bold text-base mt-2 transition-colors cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : null}
                        Iniciar sesión
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}