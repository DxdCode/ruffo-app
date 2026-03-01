import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function POST(request: Request) {
    const supabase = await createClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (session) {
        await supabase.auth.signOut()
    }

    return redirect("/")
}
