import LoginForm from "@/components/auth/LoginForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        return redirect("/clientes");
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white px-4">
            <div className="w-full max-w-md p-4 sm:p-8">
                <LoginForm />
            </div>
        </div>
    );
}
