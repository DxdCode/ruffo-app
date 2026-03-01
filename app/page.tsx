import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function HomePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        return redirect("/clientes");
    }

    return (
        <div className="min-h-screen lg:h-screen w-full bg-white overflow-x-hidden lg:overflow-hidden font-sans selection:bg-[#F59E0B] selection:text-white flex flex-col">

            <nav className="w-full bg-white z-20 relative px-6 md:px-12 xl:px-24 h-20 lg:h-25 flex justify-between items-center">

                <span className="font-extrabold text-3xl tracking-tight text-slate-900">Ruffo</span>

                <Link
                    href="/login"
                    className="bg-[#F59E0B] text-white px-8 py-3 rounded-full text-base font-bold hover:bg-[#00BFA5] transition-colors"
                >
                    Iniciar sesión
                </Link>
            </nav>

            {/* Main contenido*/}
            <main className="flex-1 relative w-full flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 xl:px-24">

                {/* Contenido de texto */}
                <div className="flex-1 z-10 pt-12 lg:pt-0 max-w-2xl flex flex-col items-center text-center lg:items-start lg:text-left">
                    <p className="text-xl md:text-2xl font-bold text-slate-800 mb-4">Prueba Ruffo</p>
                    <h1 className="text-5xl sm:text-6xl md:text-[75px] xl:text-[85px] font-black text-black leading-[1.05] tracking-tight mb-8 md:mb-12">
                        Administración <br className="hidden md:block" /> de tus Mascotas
                    </h1>

                    <Link
                        href="/login"
                        className="group inline-flex items-center justify-center rounded-full px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-black text-white hover:opacity-90 transition-all w-max shadow-xl"
                        style={{ backgroundColor: '#F59E0B' }}
                    >
                        Iniciar sesión
                        <ChevronRight className="ml-2 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                {/* Contenedor de la imagen */}
                <div className="flex-1 w-full h-full relative flex items-end justify-center lg:justify-end mt-12 lg:mt-0">

                    {/* Fondo */}
                    <div className="absolute top-0 right-0 w-100 h-100 md:top-10 md:w-125 md:h-125 xl:w-212.5 xl:h-187.5 pointer-events-none z-0 flex justify-end lg:-mr-20">
                        <svg viewBox="0 0 800 800" className="w-full h-full text-[#F59E0B] fill-current"
                            style={{ color: '#00BFA5' }}>
                            <path d="M780.5,372.5Q735,545,595,649.5Q455,754,285,735Q115,716,68,558Q21,400,105,250.5Q189,101,368.5,41.5Q548,-18,687,83.5Q826,185,780.5,372.5Z" />
                        </svg>
                    </div>

                    <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-[#4FC3F7] blur-3xl opacity-40 z-0"></div>

                    {/* Imagen del perro y gato */}
                    <Image
                        src="/image.webp"
                        alt="Perro y gato felices"
                        width={700}
                        height={700}
                        className="w-[90%] max-w-87.5 sm:max-w-112.5 lg:max-w-none lg:w-125 xl:w-175 relative z-10 bottom-0 object-contain xl:-mr-12 drop-shadow-2xl mt-8 lg:mt-0"
                    />

                </div>
            </main>

        </div>
    )
}
