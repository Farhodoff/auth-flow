import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile-form";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                <p className="text-muted-foreground">Manage your public profile and account settings.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <ProfileForm user={session.user} />
            </div>
        </div>
    );
}
