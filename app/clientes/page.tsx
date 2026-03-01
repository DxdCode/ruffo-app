import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/layout/Navbar"
import ClientsSearch from "@/components/clients/ClientsSearch"
import ClientsTable from "@/components/clients/ClientsTable"
import { getClients } from "@/lib/services/clients"

export default async function ClientesPage(props: {
    searchParams?: Promise<{ q?: string; filterBy?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    const searchParams = props.searchParams ? await props.searchParams : {}
    const query = searchParams?.q || ""
    const filterBy = searchParams?.filterBy || "name"

    const { data: clients, error } = await getClients(supabase, {
        query,
        filterBy: filterBy === "phone" ? "phone" : "name",
    })

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Listado de Clientes</h1>
                            <p className="text-slate-500 mt-1 font-medium">Administra todos los tutores y pacientes en Ruffo.</p>
                        </div>
                        <Link href="/clientes/nuevo">
                            <Button className="w-full md:w-auto bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold h-11 rounded-xl px-6 shadow-md">
                                <Plus className="h-5 w-5 mr-2" />
                                Nuevo Cliente
                            </Button>
                        </Link>
                    </div>

                    <div>
                        <ClientsSearch />

                        <div className="rounded-xl bg-white border border-slate-200 shadow-sm ">
                            <ClientsTable clients={clients} error={error?.message ?? null} query={query} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}