import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
                <p className="text-muted-foreground">Configure how you receive alerts.</p>
            </div>

            <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="font-semibold">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Choose what emails you want to receive.</p>
                    </div>
                    <div className="p-6 space-y-6">
                        {[
                            { title: "Product Updates", desc: "New features and updates.", default: true },
                            { title: "Security Alerts", desc: "Important security notifications.", default: true },
                            { title: "Marketing", desc: "Tips and marketing materials.", default: false },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium">{item.title}</label>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                                {/* Simple Toggle Switch Mockup */}
                                <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${item.default ? 'bg-primary' : 'bg-muted'}`}>
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${item.default ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
