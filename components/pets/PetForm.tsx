"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { petSchema, type PetFormData } from "@/lib/validations"
import { createClient } from "@/lib/supabase/client"
import { createPetRecord } from "@/lib/services/pets"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Dog, Tag, FileText, UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
    ownerId: string
}

export default function PetForm({ ownerId }: Props) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PetFormData>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            name: "",
            species: "canino",
            breed: "",
            behavior_notes: "",
        }
    })

    async function onSubmit(data: PetFormData) {
        setLoading(true)
        setError(null)

        const { error: supabaseError } = await createPetRecord(supabase, {
            ownerId,
            formData: data,
            imageFile,
        })

        if (supabaseError) {
            setError(supabaseError.message)
            setLoading(false)
            return
        }

        router.push(`/clientes/${ownerId}`)
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
                    {/* Nombre y Especie */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="font-bold text-slate-700">
                                Nombre de la Mascota <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Dog className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="name"
                                    placeholder="Ej. Max"
                                    {...register("name")}
                                    className={cn(
                                        "pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#00BFA5]",
                                        errors.name && "border-rose-500 focus-visible:ring-rose-500"
                                    )}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-rose-500 text-xs font-medium">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="species" className="font-bold text-slate-700">
                                Especie <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative">
                                <select
                                    id="species"
                                    {...register("species")}
                                    className={cn(
                                        "w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent cursor-pointer appearance-none",
                                        errors.species && "border-rose-500 focus:ring-rose-500"
                                    )}
                                >
                                    <option value="canino">Perro</option>
                                    <option value="felino">Gato</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                            {errors.species && (
                                <p className="text-rose-500 text-xs font-medium">{errors.species.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Raza e Imagen */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="breed" className="font-bold text-slate-700">
                                Raza <span className="text-slate-400 font-normal text-xs ml-1">(Opcional)</span>
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Tag className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="breed"
                                    placeholder="Ej. Golden Retriever"
                                    {...register("breed")}
                                    className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#00BFA5]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image" className="font-bold text-slate-700">
                                Foto de la Mascota <span className="text-slate-400 font-normal text-xs ml-1">(Opcional)</span>
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <UploadCloud className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setImageFile(e.target.files[0])
                                        }
                                    }}
                                    className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#00BFA5] file:mr-4 file:h-8 file:px-5 file:leading-8 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E1F5FE] file:text-[#0288D1] hover:file:bg-[#B3E5FC] cursor-pointer"
                                />
                            </div>
                            {imageFile && (
                                <p className="text-xs text-[#00BFA5] font-medium mt-1">Archivo seleccionado: {imageFile.name}</p>
                            )}
                        </div>
                    </div>

                    {/* Notas de Comportamiento */}
                    <div className="space-y-2">
                        <Label htmlFor="behavior_notes" className="font-bold text-slate-700">
                            Notas de Comportamiento <span className="text-slate-400 font-normal text-xs ml-1">(Opcional)</span>
                        </Label>
                        <div className="relative">
                            <div className="absolute top-3 left-0 pl-3.5 pointer-events-none">
                                <FileText className="h-4 w-4 text-slate-400" />
                            </div>
                            <Textarea
                                id="behavior_notes"
                                placeholder="Ej. Muy amigable, asustadizo con ruidos fuertes..."
                                {...register("behavior_notes")}
                                className={cn(
                                    "pl-10 min-h-25 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#00BFA5] py-3",
                                    errors.behavior_notes && "border-rose-500 focus-visible:ring-rose-500"
                                )}
                            />
                        </div>
                        {errors.behavior_notes && (
                            <p className="text-rose-500 text-xs font-medium">{errors.behavior_notes.message}</p>
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
                            className="flex-1 h-12 rounded-xl bg-[#00BFA5] hover:bg-[#00BFA3] text-white font-bold transition-colors"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            Registrar Mascota
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
