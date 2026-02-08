import DashboardSidebar from "@/components/dashboard/Sidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserNav from "@/components/dashboard/user-nav";
import AuthErrorToast from "@/components/auth-error-toast";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebar user={session.user} />
            <div className="flex-1 flex flex-col">
                {/* Dashboard Header */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4 md:hidden">
                        <MobileSidebar />
                        <span className="text-lg font-semibold">AuthFlow</span>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        {/* We can place the UserNav (Avatar + Logout) here */}
                        <UserNav user={session.user} />
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    <AuthErrorToast />
                    {children}
                </main>
            </div>
        </div>
    );
}
