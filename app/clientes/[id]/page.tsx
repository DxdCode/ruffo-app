import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import { ArrowLeft, User, Phone, Mail, FileText, Plus, Dog } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getClientById } from "@/lib/services/clients"
import { getPetsByClientId } from "@/lib/services/pets"

export default async function DetalleClientePage({ params, }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect("/login")
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    const { data: clientData, error: clientError } = await getClientById(supabase, id)

    if (clientError || !clientData) {
        return redirect("/clientes")
    }

    const client = clientData
    const { data: petsData } = await getPetsByClientId(supabase, id)

    const pets = petsData || []

    return (
        <div className="md:h-screen min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#F59E0B] selection:text-white">
            <Navbar />

            <main className="flex-1 md:overflow-hidden w-full flex flex-col">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col flex-1 h-full w-full">

                    {/* Botón Regresar */}
                    <div className="mb-4 sm:mb-8 shrink-0">
                        <Link href="/clientes">
                            <Button variant="outline" className="text-slate-600 font-bold border-slate-200 hover:bg-slate-100 hover:text-slate-900 h-10 rounded-xl transition-colors">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Regresar
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 flex-1 md:min-h-0">

                        {/* Clientes */}
                        <div className="w-full md:w-1/3 shrink-0 md:overflow-y-auto md:pr-1">
                            <Card className="bg-white rounded-2xl border-none">
                                <CardHeader className="border-b border-slate-100">
                                    <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                                        <div className="bg-[#FEF3C7] rounded-full p-2">
                                            <User className="h-5 w-5 text-[#F59E0B]" />
                                        </div>
                                        Datos del Cliente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre Completo</p>
                                        <p className="text-slate-700 font-medium">{client.full_name}</p>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Teléfono</p>
                                        <p className="flex items-center gap-2 text-slate-700 font-medium">
                                            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                                            {client.phone}
                                        </p>
                                    </div>

                                    {client.email && (
                                        <div className="pt-3 border-t border-slate-100">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico</p>
                                            <p className="flex items-center gap-2 text-slate-700 font-medium">
                                                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                                                {client.email}
                                            </p>
                                        </div>
                                    )}

                                    {client.notes && (
                                        <div className="pt-3 border-t border-slate-100">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Notas</p>
                                            <p className="flex items-start gap-2 text-slate-700 font-medium">
                                                <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                                {client.notes}
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Registrado el</p>
                                        <p className="text-slate-500 text-sm font-medium">
                                            {new Date(client.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Mascotas */}
                        <div className="flex-1 flex flex-col md:min-h-0">

                            <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#E0F2F1] p-2.5 rounded-full">
                                        <Dog className="h-6 w-6 text-[#00BFA5]" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Mascotas Asociadas</h2>
                                        <p className="text-slate-500 text-sm font-medium">Pacientes bajo la tutela de este cliente</p>
                                    </div>
                                </div>
                                <Link href={`/clientes/${id}/mascota`}>
                                    <Button className="w-full sm:w-auto bg-[#00BFA5] hover:bg-[#00A896] text-white font-bold h-11 rounded-xl px-6 shadow-md transition-colors">
                                        <Plus className="h-5 w-5 mr-2" />
                                        Agregar Mascota
                                    </Button>
                                </Link>
                            </div>

                            {pets.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-12 flex flex-col items-center justify-center text-center border border-dashed border-slate-200 flex-1">
                                    <div className="bg-slate-50 p-4 rounded-full mb-4">
                                        <Dog className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Sin mascotas registradas</h3>
                                    <p className="text-slate-500 max-w-sm mb-6">Este cliente aún no tiene pacientes asignados en el sistema.</p>
                                    <Link href={`/clientes/${id}/mascota`}>
                                        <Button className="bg-[#00BFA5] hover:bg-[#00A896] text-white font-bold h-11 rounded-xl px-6 shadow-md">
                                            Registrar primera mascota
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex-1 md:overflow-y-auto md:pr-2 pb-4 custom-scrollbar">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {pets.map((pet) => (
                                            <div key={pet.id} className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30 p-4 flex items-center gap-4 h-fit">

                                                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center border-2 border-slate-50">
                                                    {pet.image_url
                                                        ? <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
                                                        : <span className="font-black text-slate-400 text-xl">{pet.name.charAt(0).toUpperCase()}</span>
                                                    }
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-bold text-slate-900 truncate mb-1">{pet.name}</h4>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-[#00BFA5] text-white">
                                                            {pet.species}
                                                        </span>
                                                        {pet.breed && (
                                                            <span className="text-sm font-bold text-slate-500 truncate">{pet.breed}</span>
                                                        )}
                                                    </div>
                                                    {pet.behavior_notes && (
                                                        <div className="mt-2 pt-2 border-t border-slate-100">
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Notas</p>
                                                            <p className="text-xs text-slate-500 line-clamp-2">{pet.behavior_notes}</p>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}