import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import ClientForm from "@/components/clients/ClientForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function NuevoClientePage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect("/login")
    }

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans selection:bg-[#F59E0B] selection:text-white">
            <Navbar />

            <main className="flex-1 overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    {/* Botón Regresar */}
                    <div className="mb-8">
                        <Link href="/clientes">
                            <Button variant="outline" className="text-slate-600 font-bold border-slate-200 hover:bg-slate-100 hover:text-slate-900 h-10 rounded-xl transition-colors">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Regresar
                            </Button>
                        </Link>
                    </div>

                    <div className="mb-6 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Registro de Cliente</h1>
                        <p className="text-slate-500 mt-2 font-medium">Completa los datos para registrar un nuevo usuario en el sistema.</p>
                    </div>

                    <ClientForm />
                </div>
            </main>
        </div>
    )
}
