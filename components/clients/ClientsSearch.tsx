"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export default function ClientsSearch() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const query = searchParams.get("q") ?? ""
  const filterBy = searchParams.get("filterBy") ?? "name"

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (term) {
      params.set("q", term)
    } else {
      params.delete("q")
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, 200)

  return (
    <div className="mb-6 relative w-full flex flex-col sm:flex-row gap-3 md:max-w-2xl">

      {/* Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <Input
          type="search"
          defaultValue={query}
          placeholder="Buscar cliente..."
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-11 h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-[#00BFA5] text-base shadow-sm"
        />
      </div>

      {/* Select */}
      <div className="relative w-full sm:w-48 shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Filter className="h-4 w-4 text-slate-500" />
        </div>

        <select
          defaultValue={filterBy}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams)
            params.set("filterBy", e.target.value)
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
          }}
          className="w-full h-12 pl-9 pr-8 rounded-xl bg-white border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent cursor-pointer appearance-none shadow-sm"
        >
          <option value="name">Por Nombre</option>
          <option value="phone">Por Teléfono</option>
        </select>
      </div>
    </div>
  )
}