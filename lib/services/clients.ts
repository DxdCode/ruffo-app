import type { SupabaseClient } from "@supabase/supabase-js"
import type { Client, ClientFormData } from "@/lib/types"

type ClientSearchFilter = "name" | "phone"

type GetClientsOptions = {
    query?: string
    filterBy?: ClientSearchFilter
}

export async function getClients(
    supabase: SupabaseClient,
    options: GetClientsOptions = {}
) {
    const query = options.query?.trim() ?? ""
    const filterBy = options.filterBy ?? "name"

    let supabaseQuery = supabase
        .from("clients")
        .select("id, full_name, phone, created_at, pets(count)")
        .order("created_at", { ascending: false })

    if (query) {
        if (filterBy === "phone") {
            supabaseQuery = supabaseQuery.ilike("phone", `%${query}%`)
        } else {
            supabaseQuery = supabaseQuery.ilike("full_name", `%${query}%`)
        }
    }

    const { data, error } = await supabaseQuery

    return {
        data: (data as Client[]) ?? [],
        error,
    }
}

export async function getClientById(supabase: SupabaseClient, clientId: string) {
    const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single()

    return {
        data: data as Client | null,
        error,
    }
}

export async function getClientBasicInfoById(supabase: SupabaseClient, clientId: string) {
    const { data, error } = await supabase
        .from("clients")
        .select("id, full_name")
        .eq("id", clientId)
        .single()

    return {
        data: data as Pick<Client, "id" | "full_name"> | null,
        error,
    }
}

export async function createClientRecord(
    supabase: SupabaseClient,
    input: ClientFormData
) {
    const payload = {
        ...input,
        email: input.email?.trim() === "" ? null : input.email,
    }

    return supabase
        .from("clients")
        .insert(payload)
        .select("id")
        .single()
}