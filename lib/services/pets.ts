import type { SupabaseClient } from "@supabase/supabase-js"
import type { Pet, PetFormData } from "@/lib/types"

type CreatePetInput = {
    ownerId: string
    formData: PetFormData
    imageFile?: File | null
}

export async function getPetsByClientId(supabase: SupabaseClient, clientId: string) {
    const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })

    return {
        data: (data as Pet[]) ?? [],
        error,
    }
}

export async function uploadPetImage(
    supabase: SupabaseClient,
    ownerId: string,
    imageFile: File
) {
    const fileExt = imageFile.name.split(".").pop() ?? "jpg"
    const fileName = `${ownerId}-${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
        .from("pets")
        .upload(fileName, imageFile)

    if (error) {
        return {
            data: null,
            error,
        }
    }

    const { data } = supabase.storage
        .from("pets")
        .getPublicUrl(fileName)

    return {
        data: data.publicUrl,
        error: null,
    }
}

export async function createPetRecord(
    supabase: SupabaseClient,
    input: CreatePetInput
) {
    let imageUrl: string | null = null

    if (input.imageFile) {
        const uploadResult = await uploadPetImage(supabase, input.ownerId, input.imageFile)

        if (uploadResult.error) {
            return {
                data: null,
                error: uploadResult.error,
            }
        }

        imageUrl = uploadResult.data
    }

    const payload = {
        name: input.formData.name,
        species: input.formData.species,
        breed: input.formData.breed || null,
        behavior_notes: input.formData.behavior_notes || null,
        image_url: imageUrl,
        client_id: input.ownerId,
    }

    return supabase
        .from("pets")
        .insert(payload)
}