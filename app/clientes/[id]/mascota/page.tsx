import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import PetForm from "@/components/pets/PetForm"
import { ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getClientBasicInfoById } from "@/lib/services/clients"

export default async function NuevaMascotaPage({params,}: {params: Promise<{ id: string }>}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect("/login")
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    const { data: client, error } = await getClientBasicInfoById(supabase, id)

    if (error || !client) {
        return redirect("/clientes")
    }

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans selection:bg-[#00BFA5] selection:text-white">
            <Navbar />

            <main className="flex-1 overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                    {/* Botón Regresar */}
                    <div className="mb-8">
                        <Link href={`/clientes/${id}`}>
                            <Button variant="outline" className="text-slate-600 font-bold border-slate-200 hover:bg-slate-100 hover:text-slate-900 h-10 rounded-xl transition-colors">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Regresar al Cliente
                            </Button>
                        </Link>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Registro de Mascota</h1>
                        <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                            Añadiendo un nueva mascota para el usuario:
                            <span className="inline-flex items-center text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-bold">
                                <User className="h-3.5 w-3.5 mr-1" />
                                {client.full_name}
                            </span>
                        </p>
                    </div>

                    <PetForm ownerId={id} />
                </div>
            </main>
        </div>
    )
}
