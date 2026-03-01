import { PawPrint, LogOut } from "lucide-react"
import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="shrink-0 w-full bg-white border-b border-slate-200 z-20 sticky top-0 px-6 h-20 flex justify-between items-center shadow-sm">
            <Link href="/clientes" className="flex items-center gap-2">
                <div className="bg-[#FEF3C7] p-2 rounded-full">
                    <PawPrint className="h-6 w-6 text-[#F59E0B] fill-[#F59E0B]" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">Ruffo</span>
            </Link>

            <form action="/auth/signout" method="POST">
                <button type="submit" className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 transition-colors duration-200 cursor-pointer text-white px-4 py-2 rounded-lg" title="Cerrar sesión">
                    Cerrar sesión <LogOut className="h-5 w-5" />
                </button>
            </form>
        </nav>
    )
}