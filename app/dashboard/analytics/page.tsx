import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default async function AnalyticsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                <p className="text-muted-foreground">Detailed metrics and performance data.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                    { title: "Bounce Rate", value: "42.3%", change: "-2.1%", trend: "down" },
                    { title: "Average Session", value: "4m 12s", change: "+4.3%", trend: "up" },
                    { title: "Conversion Rate", value: "3.2%", change: "+1.2%", trend: "up" },
                ].map((item, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">{item.title}</h3>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold">{item.value}</span>
                            <span className={`flex items-center text-sm ${item.trend === 'up' ? 'text-green-500' : 'text-green-500'}`}>
                                {item.trend === 'up' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1 text-green-500" />}
                                {/* Note: usually down is bad but for bounce rate down is good. keeping simple for now */}
                                {item.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold">Traffic Sources</h3>
                    <p className="text-sm text-muted-foreground">Where your visitors are coming from.</p>
                </div>
                <div className="space-y-4">
                    {[
                        { source: "Direct", active: 45, max: 100 },
                        { source: "Social Media", active: 32, max: 100 },
                        { source: "Organic Search", active: 78, max: 100 },
                        { source: "Referral", active: 12, max: 100 },
                    ].map((item, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{item.source}</span>
                                <span className="text-muted-foreground">{item.active}%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${item.active}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
