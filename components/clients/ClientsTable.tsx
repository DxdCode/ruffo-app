import { PawPrint, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import type { Client } from "@/lib/types"

type Props = {
    clients: Client[]
    error: string | null
    query: string
}

export default function ClientsTable({ clients, error, query }: Props) {
    function getInitials(name: string) {
        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("")
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-white border-b border-slate-200">
                    <TableRow className="border-slate-200 hover:bg-transparent">
                        <TableHead className="font-extrabold text-slate-600 h-12 pl-6 tracking-wide uppercase text-xs">Nombre Completo</TableHead>
                        <TableHead className="font-extrabold text-slate-600 h-12 tracking-wide uppercase text-xs">Teléfono</TableHead>
                        <TableHead className="font-extrabold text-slate-600 h-12 text-center tracking-wide uppercase text-xs">Cantidad de Mascotas</TableHead>
                        <TableHead className="font-extrabold text-slate-600 h-12 tracking-wide uppercase text-xs">Fecha de Registro</TableHead>
                        <TableHead className="font-extrabold text-slate-600 h-12 text-right pr-6 tracking-wide uppercase text-xs">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {error ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-rose-500 font-medium">
                                Error al cargar los clientes: {error}
                            </TableCell>
                        </TableRow>
                    ) : clients.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-40 text-center text-slate-500">
                                <div className="flex flex-col items-center justify-center space-y-3 my-15">
                                    <div className="bg-slate-100 p-3 rounded-full">
                                        <Search className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="font-medium text-base">No se encontraron clientes.</p>
                                    {query && (
                                        <Link href="/clientes">
                                            <Button variant="outline" className="mt-2 text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900 h-9 rounded-lg">
                                                Limpiar búsqueda
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        clients.map((client) => {
                            const petCount = client.pets?.[0]?.count ?? 0
                            const initials = getInitials(client.full_name)

                            return (
                                <TableRow key={client.id} className="border-slate-100 hover:bg-slate-50/70 transition-colors">
                                    <TableCell className="py-4 h-20 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-11 w-11 rounded-full bg-[#E1F5FE] text-[#00BFA5] font-black flex items-center justify-center shrink-0">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <Link href={`/clientes/${client.id}`} className="font-bold text-slate-900 hover:text-[#00BFA5] transition-colors block truncate">
                                                    {client.full_name}
                                                </Link>
                                                <p className="text-slate-500 text-sm truncate">{client.email ?? "Sin correo registrado"}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600 font-semibold">{client.phone}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="inline-flex items-center justify-center gap-1.5 bg-[#E1F5FE] text-[#00BFA5] font-bold px-3 py-1 rounded-full text-sm">
                                            <PawPrint className="h-3.5 w-3.5" />
                                            {petCount} {petCount === 1 ? "Mascota" : "Mascotas"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500 font-medium whitespace-nowrap">
                                        {new Date(client.created_at).toLocaleDateString("es-ES", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Link href={`/clientes/${client.id}`}>
                                            <Button
                                                variant="ghost"
                                                className="text-[#00BFA5] hover:text-[#00BFA5] hover:bg-[#E1F5FE] font-bold rounded-lg px-3"
                                            >
                                                Ver
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}